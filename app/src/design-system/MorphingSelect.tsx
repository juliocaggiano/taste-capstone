import {
  forwardRef, useCallback, useEffect, useId, useImperativeHandle,
  useLayoutEffect, useRef, useState,
  type CSSProperties, type KeyboardEvent, type ReactNode,
} from 'react';
import { createPortal } from 'react-dom';
import './morphing-select.css';

export type MorphingSelectOption = { value: string; label: string; disabled?: boolean };
export type MorphingSelectProps = {
  value: string;
  onChange: (value: string) => void;
  options: readonly MorphingSelectOption[];
  ariaLabel: string;
  id?: string;
  disabled?: boolean;
  variant?: 'surface' | 'dark';
  className?: string;
  leadingIcon?: ReactNode;
  /** Milliseconds. Production controls default to 420; the reference example uses 800. */
  duration?: number;
  placeholder?: string;
  /** Keep a select's popup inside an enclosing modal's focus boundary. */
  portalContainer?: HTMLElement | null;
};

type Placement = {
  left: number; top: number; width: number; triggerLeft: number;
  triggerWidth: number; triggerHeight: number; panelY: number; panelHeight: number;
  direction: 'up' | 'down';
};
const GAP = 8;
const INSET = 8;
const emptyPlacement: Placement = {
  left: 0, top: 0, width: 180, triggerLeft: 0,
  triggerWidth: 180, triggerHeight: 32, panelY: 40, panelHeight: 44, direction: 'down',
};

function elasticOut(progress: number) {
  if (progress === 0 || progress === 1) return progress;
  const period = 0.82;
  return 2 ** (-10 * progress) * Math.sin((progress - period / 4) * Math.PI * 2 / period) + 1;
}

function useReducedMotion() {
  const [reduced, setReduced] = useState(() => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(query.matches);
    update();
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);
  return reduced;
}

/** Select-only combobox: focus stays on the trigger; the active option is announced there. */
export const MorphingSelect = forwardRef<HTMLButtonElement, MorphingSelectProps>(function MorphingSelect({
  value, onChange, options, ariaLabel, id, disabled = false, variant = 'surface',
  className = '', leadingIcon, duration = 420, placeholder = 'Select', portalContainer,
}, forwardedRef) {
  const uid = useId().replaceAll(':', '');
  const listId = `dc-morph-list-${uid}`;
  const fieldId = `dc-morph-field-${uid}`;
  const valueId = `dc-morph-value-${uid}`;
  const filterId = `dc-morph-goo-${uid}`;
  const rootRef = useRef<HTMLSpanElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const shapeRef = useRef<HTMLDivElement>(null);
  const gooRef = useRef<HTMLDivElement>(null);
  const blurRef = useRef<SVGFEGaussianBlurElement>(null);
  const animationRef = useRef<Animation | null>(null);
  const blurFrame = useRef(0);
  const rollTimer = useRef(0);
  const typeTimer = useRef(0);
  const typeBuffer = useRef('');
  const token = useRef(0);
  const openRef = useRef(false);
  const keyboardNavigation = useRef(false);
  const [open, setOpen] = useState(false);
  const [present, setPresent] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [portalRoot, setPortalRoot] = useState<HTMLElement | null>(null);
  const [placement, setPlacement] = useState(emptyPlacement);
  const [portalStyles, setPortalStyles] = useState<CSSProperties>({});
  const [triggerStyle, setTriggerStyle] = useState<CSSProperties>({});
  const reduced = useReducedMotion();
  const selectedIndex = options.findIndex(option => option.value === value);
  const selectedLabel = options[selectedIndex]?.label ?? (value || placeholder);
  const previousLabel = useRef(selectedLabel);
  const [roll, setRoll] = useState({ from: selectedLabel, to: selectedLabel, active: false });
  const ms = Math.max(0, Math.min(duration, 1600));
  const quick = Math.min(400, ms * 0.52);
  const canPopover = typeof HTMLElement !== 'undefined' && 'showPopover' in HTMLElement.prototype;

  useImperativeHandle(forwardedRef, () => triggerRef.current!, []);

  const close = useCallback((restoreFocus = false) => {
    openRef.current = false;
    setOpen(false);
    setActiveIndex(-1);
    typeBuffer.current = '';
    window.clearTimeout(typeTimer.current);
    if (restoreFocus && triggerRef.current?.isConnected) triggerRef.current.focus({ preventScroll: true });
  }, []);

  const measure = useCallback(() => {
    const trigger = triggerRef.current;
    if (!trigger) return;
    const rect = trigger.getBoundingClientRect();
    const triggerStyles = getComputedStyle(trigger);
    const scale = portalContainer && trigger.offsetWidth ? rect.width / trigger.offsetWidth : 1;
    const pixelScale = (value: string) => value.replace(/(-?[\d.]+)px/g, (_, number) => `${Number(number) * scale}px`);
    const viewport = window.visualViewport;
    const viewportOrigin = { left: viewport?.offsetLeft ?? 0, top: viewport?.offsetTop ?? 0 };
    const boundary = portalContainer?.closest<HTMLElement>('.bottom-sheet')?.getBoundingClientRect();
    const viewportLeft = Math.max(viewportOrigin.left, boundary?.left ?? viewportOrigin.left);
    const viewportTop = Math.max(viewportOrigin.top, boundary?.top ?? viewportOrigin.top);
    const viewportRight = Math.min(viewportOrigin.left + (viewport?.width ?? document.documentElement.clientWidth), boundary?.right ?? Infinity);
    const viewportBottom = Math.min(viewportOrigin.top + (viewport?.height ?? window.innerHeight), boundary?.bottom ?? Infinity);
    const gap = GAP * scale;
    const inset = INSET * scale;
    const width = Math.min(Math.max(rect.width, 180 * scale), viewportRight - viewportLeft - inset * 2);
    const left = Math.max(viewportLeft + inset, Math.min(rect.left, viewportRight - width - inset));
    const rowHeight = (portalContainer || window.matchMedia('(pointer: coarse)').matches ? 44 : 32) * scale;
    const measuredOptions = listRef.current ? Array.from(listRef.current.children).reduce((height, option) => height + (option as HTMLElement).offsetHeight, 12 * scale) : 0;
    const contentHeight = measuredOptions || options.length * rowHeight + 12 * scale;
    const desiredHeight = Math.min(contentHeight, 340 * scale);
    const below = viewportBottom - rect.bottom - gap - inset;
    const above = rect.top - viewportTop - gap - inset;
    const direction = below < desiredHeight && above > below ? 'up' : 'down';
    const panelHeight = Math.max(1, Math.min(desiredHeight, direction === 'up' ? above : below));
    const next: Placement = {
      left, top: rect.top, width, triggerLeft: rect.left - left,
      triggerWidth: rect.width, triggerHeight: rect.height,
      panelY: direction === 'up' ? -panelHeight - gap : rect.height + gap,
      panelHeight, direction,
    };
    setPlacement(current => Object.keys(next).every(key => current[key as keyof Placement] === next[key as keyof Placement]) ? current : next);
    if (rootRef.current) {
      const styles = getComputedStyle(rootRef.current);
      const inherited = Object.fromEntries([
        '--msel-surface', '--msel-ink', '--msel-selected', '--msel-focus', '--msel-muted',
        '--msel-trigger-radius', '--msel-panel-radius', '--msel-option-radius',
      ].map(name => [name, name.includes('radius') ? pixelScale(styles.getPropertyValue(name)) : styles.getPropertyValue(name)]));
      setPortalStyles({ ...inherited, ...(portalContainer ? {
        fontFamily: triggerStyles.fontFamily, fontSize: pixelScale(triggerStyles.fontSize), lineHeight: pixelScale(triggerStyles.lineHeight),
        '--msel-option-min-height': `${rowHeight}px`, '--msel-option-padding': `${8 * scale}px ${10 * scale}px`,
        '--msel-list-padding': `${6 * scale}px`, '--msel-glyph-size': `${14 * scale}px`, '--msel-option-gap': `${8 * scale}px`,
      } : {}) } as CSSProperties);
    }
    setTriggerStyle({ fontFamily: triggerStyles.fontFamily, fontSize: pixelScale(triggerStyles.fontSize),
      fontWeight: triggerStyles.fontWeight, lineHeight: pixelScale(triggerStyles.lineHeight),
      letterSpacing: pixelScale(triggerStyles.letterSpacing), padding: pixelScale(triggerStyles.padding), gap: pixelScale(triggerStyles.gap) });
    if (openRef.current && (rect.bottom < viewportTop || rect.top > viewportBottom || rect.right < viewportLeft || rect.left > viewportRight)) close(false);
  }, [close, options.length, portalContainer]);

  const openSelect = useCallback((preferLast = false) => {
    if (disabled || !options.some(option => !option.disabled)) return;
    const selected = options.findIndex(option => option.value === value && !option.disabled);
    const enabled = options.map((option, index) => option.disabled ? -1 : index).filter(index => index >= 0);
    const initial = selected >= 0 ? selected : preferLast ? enabled[enabled.length - 1] : enabled[0];
    keyboardNavigation.current = true;
    setActiveIndex(initial);
    setPortalRoot(portalContainer ?? triggerRef.current?.closest<HTMLElement>('dialog[open]') ?? document.body);
    measure();
    setPresent(true);
    openRef.current = true;
    setOpen(true);
  }, [disabled, measure, options, value, portalContainer]);

  const selectAt = useCallback((index: number) => {
    const option = options[index];
    if (!option || option.disabled) return;
    close(true);
    onChange(option.value);
  }, [close, onChange, options]);

  useLayoutEffect(() => {
    window.clearTimeout(rollTimer.current);
    const from = previousLabel.current;
    previousLabel.current = selectedLabel;
    if (from === selectedLabel || reduced || ms === 0) {
      setRoll({ from: selectedLabel, to: selectedLabel, active: false });
      return;
    }
    setRoll({ from, to: selectedLabel, active: true });
    rollTimer.current = window.setTimeout(() => setRoll({ from: selectedLabel, to: selectedLabel, active: false }), quick);
    return () => window.clearTimeout(rollTimer.current);
  }, [selectedLabel, reduced, ms, quick]);

  useLayoutEffect(() => {
    if (!present) return;
    const overlay = overlayRef.current;
    if (canPopover && overlay && !overlay.matches(':popover-open')) {
      try { overlay.showPopover(); } catch { /* A closing ancestor dialog can remove the layer in this frame. */ }
    }
    measure();
    const observer = new ResizeObserver(measure);
    if (triggerRef.current) observer.observe(triggerRef.current);
    if (listRef.current) observer.observe(listRef.current);
    window.addEventListener('resize', measure);
    document.addEventListener('scroll', measure, true);
    window.visualViewport?.addEventListener('resize', measure);
    window.visualViewport?.addEventListener('scroll', measure);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', measure);
      document.removeEventListener('scroll', measure, true);
      window.visualViewport?.removeEventListener('resize', measure);
      window.visualViewport?.removeEventListener('scroll', measure);
    };
  }, [canPopover, measure, present, portalRoot]);

  useLayoutEffect(() => {
    if (!present) return;
    const shape = shapeRef.current;
    const goo = gooRef.current;
    if (!shape || !goo) return;
    const motionToken = ++token.current;
    window.cancelAnimationFrame(blurFrame.current);
    const computed = getComputedStyle(shape);
    const radiusFor = (name: string, fallback: number) => {
      const radius = Number.parseFloat(computed.getPropertyValue(name));
      return Number.isFinite(radius) ? Math.max(0, radius) : fallback;
    };
    const customRadius = computed.getPropertyValue('--msel-trigger-radius').trim() || computed.getPropertyValue('--msel-panel-radius').trim();
    const matrix = computed.transform === 'none' ? null : new DOMMatrixReadOnly(computed.transform);
    const from = {
      x: matrix?.m41 ?? placement.triggerLeft, y: matrix?.m42 ?? 0,
      width: Number.parseFloat(computed.width) || placement.triggerWidth,
      height: Number.parseFloat(computed.height) || placement.triggerHeight,
      radius: Number.parseFloat(computed.borderTopLeftRadius) || placement.triggerHeight / 2,
    };
    animationRef.current?.cancel();
    const target = open
      ? { x: 0, y: placement.panelY, width: placement.width, height: placement.panelHeight, radius: radiusFor('--msel-panel-radius', 16) }
      : { x: placement.triggerLeft, y: 0, width: placement.triggerWidth, height: placement.triggerHeight, radius: radiusFor('--msel-trigger-radius', placement.triggerHeight / 2) };
    const frame = (p: number): Keyframe => {
      // Custom corner sizes stay within their bounds while the surface keeps its existing motion.
      const radiusProgress = customRadius ? Math.max(0, Math.min(1, p)) : p;
      return {
        transform: `translate(${from.x + (target.x - from.x) * p}px, ${from.y + (target.y - from.y) * p}px)`,
        width: `${Math.max(1, from.width + (target.width - from.width) * p)}px`,
        height: `${Math.max(1, from.height + (target.height - from.height) * p)}px`,
        borderRadius: `${Math.max(0, from.radius + (target.radius - from.radius) * radiusProgress)}px`,
      };
    };
    const finish = () => {
      if (motionToken !== token.current) return;
      Object.assign(shape.style, frame(1));
      animationRef.current?.cancel();
      animationRef.current = null;
      goo.style.filter = 'none';
      blurRef.current?.setAttribute('stdDeviation', '0');
      if (!openRef.current) setPresent(false);
    };
    if (reduced || ms === 0 || typeof shape.animate !== 'function') { finish(); return; }
    const animationDuration = open ? ms : ms * 0.65;
    const frames = open ? Array.from({ length: 49 }, (_, index) => ({ ...frame(elasticOut(index / 48)), offset: index / 48 })) : [frame(0), frame(1)];
    const animation = shape.animate(frames, { duration: animationDuration, easing: open ? 'linear' : 'cubic-bezier(.3,.9,.1,1)', fill: 'both' });
    animationRef.current = animation;
    void animation.finished.then(finish, () => undefined);
    const started = performance.now();
    goo.style.filter = `url(#${filterId})`;
    const animateBlur = (now: number) => {
      if (motionToken !== token.current) return;
      const progress = (now - started) / animationDuration;
      const amount = open ? 7 * Math.max(0, 1 - Math.max(0, progress - 0.25) / 0.45) : 6 * Math.sin(Math.min(1, progress) * Math.PI);
      blurRef.current?.setAttribute('stdDeviation', amount.toFixed(2));
      if (progress < 1) blurFrame.current = window.requestAnimationFrame(animateBlur);
      else goo.style.filter = 'none';
    };
    blurFrame.current = window.requestAnimationFrame(animateBlur);
  }, [open, present, reduced, ms, filterId, placement.panelY, placement.panelHeight, placement.width, placement.triggerWidth, placement.triggerHeight, placement.triggerLeft]);

  useEffect(() => {
    if (!open) return;
    const outside = (event: PointerEvent) => {
      const target = event.target as Node;
      if (!rootRef.current?.contains(target) && !overlayRef.current?.contains(target)) close(false);
    };
    const escape = (event: globalThis.KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      event.preventDefault();
      event.stopImmediatePropagation();
      close(true);
    };
    const focus = (event: FocusEvent) => {
      if (!rootRef.current?.contains(event.target as Node) && !overlayRef.current?.contains(event.target as Node)) close(false);
    };
    const escapeTarget = portalContainer ? window : document;
    document.addEventListener('pointerdown', outside, true);
    escapeTarget.addEventListener('keydown', escape as EventListener, true);
    document.addEventListener('focusin', focus);
    return () => {
      document.removeEventListener('pointerdown', outside, true);
      escapeTarget.removeEventListener('keydown', escape as EventListener, true);
      document.removeEventListener('focusin', focus);
    };
  }, [open, close, portalContainer]);

  useEffect(() => {
    if (disabled || !options.some(option => !option.disabled)) close(false);
    else if (open && (!options[activeIndex] || options[activeIndex].disabled)) setActiveIndex(options.findIndex(option => !option.disabled));
  }, [activeIndex, close, disabled, open, options]);

  useLayoutEffect(() => {
    if (!open || !keyboardNavigation.current) return;
    const list = listRef.current;
    const option = list?.children[activeIndex] as HTMLElement | undefined;
    if (list && option) {
      if (option.offsetTop < list.scrollTop) list.scrollTop = option.offsetTop;
      else if (option.offsetTop + option.offsetHeight > list.scrollTop + list.clientHeight) list.scrollTop = option.offsetTop + option.offsetHeight - list.clientHeight;
    }
  }, [activeIndex, open, placement.panelHeight]);

  useEffect(() => () => {
    token.current += 1;
    animationRef.current?.cancel();
    window.cancelAnimationFrame(blurFrame.current);
    window.clearTimeout(rollTimer.current);
    window.clearTimeout(typeTimer.current);
  }, []);

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (disabled) return;
    const enabled = options.map((option, index) => option.disabled ? -1 : index).filter(index => index >= 0);
    if (!enabled.length) return;
    keyboardNavigation.current = true;
    if (event.key === 'Tab') { if (open) close(false); return; }
    if (event.key === 'Escape') {
      if (open) { event.preventDefault(); event.stopPropagation(); close(true); }
      return;
    }
    if (['Enter', ' ', 'ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key) && !(event.key === ' ' && typeBuffer.current)) {
      event.preventDefault();
      event.stopPropagation();
      if (!open) {
        openSelect(event.key === 'ArrowUp' || event.key === 'End');
        if (event.key === 'Home' || event.key === 'End') setActiveIndex(event.key === 'Home' ? enabled[0] : enabled[enabled.length - 1]);
      } else if (event.key === 'Enter' || event.key === ' ') selectAt(activeIndex);
      else if (event.key === 'Home' || event.key === 'End') setActiveIndex(event.key === 'Home' ? enabled[0] : enabled[enabled.length - 1]);
      else {
        const current = enabled.indexOf(activeIndex);
        setActiveIndex(enabled[(current + (event.key === 'ArrowDown' ? 1 : -1) + enabled.length) % enabled.length]);
      }
      return;
    }
    if (event.key.length === 1 && !event.altKey && !event.ctrlKey && !event.metaKey) {
      event.preventDefault();
      event.stopPropagation();
      const letter = event.key.toLocaleLowerCase();
      const buffer = typeBuffer.current + letter;
      typeBuffer.current = buffer;
      window.clearTimeout(typeTimer.current);
      typeTimer.current = window.setTimeout(() => { typeBuffer.current = ''; }, 700);
      const term = [...buffer].every(character => character === letter) ? letter : buffer;
      const start = open ? activeIndex : selectedIndex;
      const ordered = [...enabled.filter(index => index > start), ...enabled.filter(index => index <= start)];
      const match = ordered.find(index => options[index].label.toLocaleLowerCase().startsWith(term));
      if (!open) openSelect();
      if (match !== undefined) setActiveIndex(match);
    }
  };

  const motionStyle = {
    '--msel-quick': `${reduced ? 0 : quick}ms`,
    '--msel-reveal': `${reduced ? 0 : ms * 0.24}ms`,
    '--msel-stagger': `${reduced ? 0 : Math.min(20, ms * 0.025)}ms`,
  } as CSSProperties;
  const renderValue = () => <>
    {leadingIcon && <span className="dc-morph-select-icon" aria-hidden="true">{leadingIcon}</span>}
    <span className="dc-morph-select-value" aria-hidden="true" data-rolling={roll.active} key={`${roll.from}\u0000${roll.to}`}>
      <span className="dc-morph-select-value-current">{roll.active ? roll.from : selectedLabel}</span>
      {roll.active && <span className="dc-morph-select-value-next">{roll.to}</span>}
    </span>
    <svg className="dc-morph-select-caret" width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="m4 6 4 4 4-4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" /></svg>
  </>;

  return <span ref={rootRef} className={`dc-morph-select ${className}`.trim()} data-variant={variant} data-open={open} data-reduced={reduced} style={motionStyle}>
    <span className="dc-morph-select-sr" id={fieldId}>{ariaLabel}</span>
    <span className="dc-morph-select-sr" id={valueId}>{selectedLabel}</span>
    <button ref={triggerRef} id={id} type="button" role="combobox" className="dc-morph-select-trigger"
      aria-labelledby={`${fieldId} ${valueId}`} aria-haspopup="listbox" aria-expanded={open}
      aria-controls={present ? listId : undefined} aria-activedescendant={open && activeIndex >= 0 ? `${listId}-${activeIndex}` : undefined}
      disabled={disabled || !options.some(option => !option.disabled)} onKeyDown={onKeyDown}
      onClick={event => { event.stopPropagation(); if (open) close(true); else openSelect(); }}>
      {renderValue()}
    </button>
    {present && portalRoot && createPortal(<div ref={overlayRef} popover={canPopover ? 'manual' : undefined}
      className="dc-morph-select-overlay" data-variant={variant} data-open={open} data-reduced={reduced} data-direction={placement.direction}
      style={{ ...motionStyle, ...portalStyles, left: placement.left, top: placement.top, width: placement.width, height: placement.triggerHeight,
        '--msel-trigger-left': `${placement.triggerLeft}px`, '--msel-trigger-width': `${placement.triggerWidth}px`, '--msel-trigger-height': `${placement.triggerHeight}px`,
      } as CSSProperties}>
      <svg className="dc-morph-select-filter" aria-hidden="true" width="0" height="0"><defs>
        <filter id={filterId} x="-30%" y="-100%" width="160%" height="400%" colorInterpolationFilters="sRGB">
          <feGaussianBlur ref={blurRef} in="SourceGraphic" stdDeviation="0" result="blur" />
          <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -10" result="goo" />
          <feComposite in="SourceGraphic" in2="goo" operator="atop" />
        </filter>
      </defs></svg>
      <div className="dc-morph-select-goo" ref={gooRef} aria-hidden="true">
        <div className="dc-morph-select-trigger-shape" />
        <div className="dc-morph-select-panel-shape" ref={shapeRef} />
      </div>
      <div className="dc-morph-select-trigger-ghost" aria-hidden="true" style={triggerStyle}>{renderValue()}</div>
      <ul ref={listRef} id={listId} className="dc-morph-select-list" role="listbox" aria-label={ariaLabel} aria-hidden={!open}
        style={{ top: placement.panelY, height: placement.panelHeight }} onMouseDown={event => event.preventDefault()}>
        {options.map((option, index) => <li key={option.value} id={`${listId}-${index}`} role="option"
          aria-selected={option.value === value} aria-disabled={option.disabled || undefined} data-active={activeIndex === index}
          className="dc-morph-select-option" style={{ '--msel-index': Math.min(index, 12) } as CSSProperties}
          onPointerMove={() => { if (open && !option.disabled) { keyboardNavigation.current = false; setActiveIndex(index); } }}
          onClick={event => { event.stopPropagation(); if (open) selectAt(index); }}>
          <span>{option.label}</span><svg aria-hidden="true" className="dc-morph-select-check" width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="m3.5 8 3 3 6-6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </li>)}
      </ul>
    </div>, portalRoot)}
  </span>;
});
