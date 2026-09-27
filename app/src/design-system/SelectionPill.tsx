import { useLayoutEffect, useRef, useState, type CSSProperties, type KeyboardEvent } from "react";
import "./selection-pill.css";

export type SelectionOption<Value extends string> = {
  value: Value;
  label: string;
  disabled?: boolean;
};

export type SelectionPillProps<Value extends string> = {
  value: Value;
  options: readonly SelectionOption<Value>[];
  onChange: (value: Value) => void;
  ariaLabel: string;
  className?: string;
  orientation?: "horizontal" | "vertical";
  onCommit?: (value: Value) => void;
};

/** A controlled radio group with one measured surface behind the selected option. */
export function SelectionPill<Value extends string>({
  value, options, onChange, ariaLabel, className = "", orientation = "horizontal", onCommit,
}: SelectionPillProps<Value>) {
  const groupRef = useRef<HTMLDivElement>(null);
  const [indicator, setIndicator] = useState<CSSProperties>({ opacity: 0 });
  const optionSignature = options.map(option => `${option.value}:${option.label}:${!!option.disabled}`).join("|");
  const selectedIndex = options.findIndex(option => option.value === value && !option.disabled);
  const tabIndex = selectedIndex < 0 ? options.findIndex(option => !option.disabled) : selectedIndex;

  useLayoutEffect(() => {
    const group = groupRef.current;
    if (!group) return;
    let active = true;
    const measure = () => {
      if (!active) return;
      const selected = group.querySelector<HTMLButtonElement>('[aria-checked="true"]');
      if (!selected || !selected.offsetWidth || !selected.offsetHeight) {
        setIndicator({ opacity: 0 });
        return;
      }
      // Layout offsets stay accurate when the phone preview is scaled or a rail is dragged.
      setIndicator({
        width: selected.offsetWidth,
        height: selected.offsetHeight,
        transform: `translate(${selected.offsetLeft}px, ${selected.offsetTop}px)`,
        opacity: 1,
      });
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(group);
    group.querySelectorAll("button").forEach(button => observer.observe(button));
    void document.fonts.ready.then(measure);
    return () => { active = false; observer.disconnect(); };
  }, [value, optionSignature]);

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const previous = orientation === "vertical" ? "ArrowUp" : "ArrowLeft";
    const next = orientation === "vertical" ? "ArrowDown" : "ArrowRight";
    if (![previous, next, "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const enabled = options.map((option, optionIndex) => option.disabled ? -1 : optionIndex).filter(optionIndex => optionIndex >= 0);
    if (!enabled.length) return;
    const current = enabled.indexOf(index);
    const target = event.key === "Home" ? enabled[0]
      : event.key === "End" ? enabled[enabled.length - 1]
        : enabled[(current + (event.key === previous ? -1 : 1) + enabled.length) % enabled.length];
    const button = groupRef.current?.querySelectorAll<HTMLButtonElement>("button")[target];
    onChange(options[target].value);
    button?.focus({ preventScroll: true });
    button?.scrollIntoView({ block: "nearest", inline: "nearest", behavior: "instant" });
  };

  return (
    <div ref={groupRef} className={`dc-selection-pill ${className}`} role="radiogroup" aria-label={ariaLabel} aria-orientation={orientation} data-orientation={orientation}>
      <span className="dc-selection-indicator" aria-hidden="true" style={indicator} />
      {options.map((option, index) => (
        <button
          className="dc-selection-option"
          key={option.value}
          type="button"
          role="radio"
          aria-checked={value === option.value}
          disabled={option.disabled}
          tabIndex={tabIndex === index ? 0 : -1}
          onKeyDown={event => onKeyDown(event, index)}
          onClick={() => { onChange(option.value); onCommit?.(option.value); }}
        >
          <span>{option.label}</span>
          {orientation === "vertical" ? <svg className="dc-selection-check" aria-hidden="true" width="18" height="18" viewBox="0 0 20 20"><path d="m4 10 4 4 8-8" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg> : null}
        </button>
      ))}
    </div>
  );
}
