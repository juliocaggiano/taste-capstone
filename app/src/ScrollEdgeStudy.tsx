import { useEffect, useRef, useState, type CSSProperties } from "react";
import { createPortal } from "react-dom";
import "./scroll-edge-study.css";

export type ScrollEdgeVariant = "off" | "soft" | "strong";

const clamp = (value: number) => Math.max(0, Math.min(1, value));

/** App-owned scroll edges; MobileScroll's gestures and source stay untouched. */
function PageEdges({ page, variant, disabled, edges: edgeMode }: { page: HTMLElement; variant: Exclude<ScrollEdgeVariant, "off">; disabled: boolean; edges: "bottom" | "both" }) {
  const [edges, setEdges] = useState({ top: 0, bottom: 0, x: 0, y: 0, width: 0, height: 0 });

  useEffect(() => {
    const scroll = page.querySelector<HTMLElement>(":scope > .mobile-scroll");
    const content = scroll?.querySelector<HTMLElement>(":scope > .mobile-scroll-content");
    if (!scroll) return;
    let frame = 0;
    const measure = () => {
      frame = 0;
      const maximum = Math.max(0, scroll.scrollHeight - scroll.clientHeight);
      const top = Math.max(0, Math.min(maximum, scroll.scrollTop));
      const next = {
        top: maximum > 1 ? clamp(top / 28) : 0,
        bottom: maximum > 1 ? clamp((maximum - top) / 28) : 0,
        x: scroll.offsetLeft, y: scroll.offsetTop, width: scroll.clientWidth, height: scroll.clientHeight,
      };
      setEdges(previous => Object.keys(next).every(key => previous[key as keyof typeof next] === next[key as keyof typeof next]) ? previous : next);
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(measure); };
    const resize = new ResizeObserver(schedule);
    resize.observe(scroll);
    if (content) resize.observe(content);
    scroll.addEventListener("scroll", schedule, { passive: true });
    measure();
    return () => { resize.disconnect(); scroll.removeEventListener("scroll", schedule); cancelAnimationFrame(frame); };
  }, [page]);

  return createPortal(<div className="scroll-edge-viewport" data-variant={variant} aria-hidden="true"
    style={{ left: edges.x, top: edges.y, width: edges.width, height: edges.height }}>
    {(edgeMode === "bottom" ? ["bottom"] as const : ["top", "bottom"] as const).map(side => <div key={side} className={`scroll-edge-blur scroll-edge-blur--${side}`}
      data-visible={!disabled && edges[side] > 0}
      style={{ "--edge-strength": disabled ? 0 : edges[side] } as CSSProperties}>
      <i className="scroll-edge-blur-layer" data-depth="1" />
      <i className="scroll-edge-blur-layer" data-depth="2" />
      <i className="scroll-edge-blur-layer" data-depth="3" />
      <i className="scroll-edge-tint" />
    </div>)}
  </div>, page);
}

export function ScrollEdgeBlur({ variant, disabled, edges = "bottom", studyControls = false }: { variant: ScrollEdgeVariant; disabled: boolean; edges?: "bottom" | "both"; studyControls?: boolean }) {
  const anchor = useRef<HTMLSpanElement | null>(null);
  const [pages, setPages] = useState<HTMLElement[]>([]);

  useEffect(() => {
    const root = anchor.current?.closest<HTMLElement>(".daily-culture-app");
    if (!root) return;
    const scan = () => {
      const next = Array.from(root.querySelectorAll<HTMLElement>(".mobile-page"))
        .filter(page => page.querySelector(":scope > .mobile-scroll") && !page.closest('[role="dialog"], .create-flow'));
      setPages(previous => previous.length === next.length && previous.every((page, index) => page === next[index]) ? previous : next);
    };
    const observer = new MutationObserver(scan);
    observer.observe(root, { childList: true, subtree: true });
    scan();

    const onCommand = (event: MessageEvent) => {
      if (!studyControls || event.origin !== window.location.origin || event.source !== window.parent
        || event.data?.type !== "taste-edge-blur-command" || event.data.variant !== variant
        || event.data.action !== "scroll" || typeof event.data.position !== "number" || !Number.isFinite(event.data.position)) return;
      const scroll = Array.from(root.querySelectorAll<HTMLElement>(".mobile-page > .mobile-scroll"))
        .find(element => !element.closest('[inert], [aria-hidden="true"], [role="dialog"], .create-flow')
          && element.getClientRects().length > 0 && getComputedStyle(element).visibility !== "hidden");
      if (!scroll) return;
      scroll.scrollTo({ top: Math.max(0, scroll.scrollHeight - scroll.clientHeight) * clamp(event.data.position),
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
    };
    if (studyControls) window.addEventListener("message", onCommand);
    return () => { observer.disconnect(); window.removeEventListener("message", onCommand); };
  }, [variant, studyControls]);

  return <><span ref={anchor} hidden />{variant !== "off" && pages.map((page, index) => <PageEdges key={index} page={page} variant={variant} disabled={disabled} edges={edges} />)}</>;
}
