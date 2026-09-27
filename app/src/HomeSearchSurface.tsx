import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import { useKeyboard, useMobileDevice } from "./mobile";
import "./home-search-surface.css";

/** Home stays mounted underneath this search surface, including while reading a result. */
export function HomeSearchSurface({ covered, label, onClose, children }: {
  covered: boolean; label: string; onClose: () => void; children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const keyboard = useKeyboard();
  const { device } = useMobileDevice();
  useEffect(() => {
    const frame = requestAnimationFrame(() => ref.current?.querySelector<HTMLInputElement>(".discover-search input")?.focus({ preventScroll: true }));
    return () => cancelAnimationFrame(frame);
  }, []);

  return <div ref={ref} className="home-search-surface" role={covered ? undefined : "dialog"} aria-label={label}
    style={{ "--home-search-top": `${Math.max(60, device.geometry.safeArea.top)}px` } as CSSProperties}
    data-covered={covered} inert={covered} aria-hidden={covered || undefined}
    onPointerDownCapture={event => {
      // Keep the keyboard steady until a button's click runs; vertical drag still bubbles to MobileScroll.
      if (keyboard.visible && event.target instanceof Element && event.target.closest("button")) event.preventDefault();
    }}
    onKeyDown={event => {
      if (event.defaultPrevented || ref.current?.closest(".device-screen")?.querySelector(".bottom-sheet")) return;
      if (event.key === "Escape") { event.preventDefault(); event.stopPropagation(); onClose(); }
      if (event.key !== "Tab") return;
      const controls = Array.from(ref.current?.querySelectorAll<HTMLElement>('button:not([disabled]), input, [tabindex="0"]') ?? [])
        .filter(element => element.getClientRects().length && !element.closest('[inert], [hidden]'));
      const first = controls[0];
      const last = controls.at(-1);
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
    }}>{children}</div>;
}
