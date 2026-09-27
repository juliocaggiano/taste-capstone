import { motion, useReducedMotion, type Variants } from "motion/react";
import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import "./creator-page-transition.css";

export type CreatorPageOrigin = { x: number; y: number; width: number; height: number };
export type CreatorMotionVariant = "source" | "slide" | "glide" | "dissolve";

type CreatorPageTransitionProps = {
  closing: boolean;
  onCloseComplete: () => void;
  onRequestClose: () => void;
  origin: CreatorPageOrigin | null;
  variant?: CreatorMotionVariant;
  children: ReactNode;
};

const ease = [0.22, 1, 0.36, 1] as const;

/** Keeps the scrolling profile intact until its selected transition finishes. */
export function CreatorPageTransition({ closing, onCloseComplete, onRequestClose, origin, variant = "slide", children }: CreatorPageTransitionProps) {
  const layerRef = useRef<HTMLDivElement>(null);
  const completedRef = useRef(false);
  const reducedMotion = useReducedMotion() === true;
  const [destination, setDestination] = useState({ x: 0, y: 0, scale: 0.22 });

  useLayoutEffect(() => {
    if (variant !== "source") return;
    const layer = layerRef.current;
    if (!layer) return;

    function measure() {
      if (!layer) return;
      // The phone preview can be scaled. Convert viewport coordinates back to its CSS pixels.
      const bounds = layer.getBoundingClientRect();
      const scaleX = bounds.width / layer.clientWidth;
      const scaleY = bounds.height / layer.clientHeight;
      if (!Number.isFinite(scaleX) || !Number.isFinite(scaleY) || scaleX <= 0 || scaleY <= 0) return;
      const usableOrigin = origin && Object.values(origin).every(Number.isFinite) && origin.width > 0 && origin.height > 0;
      setDestination(usableOrigin && origin ? {
        x: (origin.x + origin.width / 2 - bounds.x - bounds.width / 2) / scaleX,
        y: (origin.y + origin.height / 2 - bounds.y - bounds.height / 2) / scaleY,
        scale: Math.max(0.18, Math.min(0.36, Math.max(origin.width / bounds.width, origin.height / bounds.height))),
      } : { x: 0, y: layer.clientHeight * 0.18, scale: 0.22 });
    }

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(layer);
    window.addEventListener("resize", measure);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [origin, variant]);

  useLayoutEffect(() => {
    layerRef.current?.querySelector<HTMLButtonElement>(".creator-reference-back")?.focus({ preventScroll: true });
  }, []);

  function completeClose() {
    if (!closing || completedRef.current) return;
    completedRef.current = true;
    onCloseComplete();
  }

  useEffect(() => {
    if (!closing) completedRef.current = false;
    if (closing && reducedMotion && !completedRef.current) {
      completedRef.current = true;
      onCloseComplete();
    }
  }, [closing, reducedMotion, onCloseComplete]);

  useEffect(() => {
    if (closing) return;
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key !== "Escape" || event.defaultPrevented || event.repeat) return;
      const scope = layerRef.current?.closest(".device-screen") ?? document;
      const dialogOpen = Array.from(scope.querySelectorAll<HTMLElement>('[role="dialog"], [role="alertdialog"], [aria-modal="true"]'))
        .some(dialog => dialog.dataset.state !== "closed" && dialog.getClientRects().length > 0
          && getComputedStyle(dialog).visibility !== "hidden");
      if (dialogOpen) return;
      event.preventDefault();
      onRequestClose();
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [closing, onRequestClose]);

  const sourceVariants: Variants = {
    enter: { x: 18, y: 8, scale: 0.97, opacity: 0, borderRadius: 12 },
    open: { x: 0, y: 0, scale: 1, opacity: 1, borderRadius: 0, transition: { duration: reducedMotion ? 0 : 0.28, ease } },
    closed: reducedMotion
      ? { x: 0, y: 0, scale: 1, opacity: 1, borderRadius: 0, transition: { duration: 0 } }
      : {
        ...destination,
        opacity: 0,
        borderRadius: 24,
        transition: { duration: 0.4, ease, opacity: { delay: 0.18, duration: 0.22, ease: "linear" } },
      },
  };

  const pagePose = { y: 0, scale: 1, borderRadius: 0 };
  const alternatives: Record<Exclude<CreatorMotionVariant, "source">, Variants> = {
    slide: {
      enter: { ...pagePose, x: "100%", opacity: 1 },
      open: { ...pagePose, x: 0, opacity: 1, transition: { duration: 0.32, ease } },
      closed: { ...pagePose, x: "100%", opacity: 1, transition: { duration: 0.32, ease } },
    },
    glide: {
      enter: { ...pagePose, x: 28, opacity: 0 },
      open: { ...pagePose, x: 0, opacity: 1,
        transition: { duration: 0.22, ease, opacity: { duration: 0.12, delay: 0.08, ease: "linear" } } },
      closed: { ...pagePose, x: 28, opacity: 0,
        transition: { duration: 0.22, ease, opacity: { duration: 0.1, ease: "linear" } } },
    },
    dissolve: {
      enter: { ...pagePose, x: 0, opacity: 0, "--creator-transition-progress": 0 },
      open: { ...pagePose, x: 0, opacity: 1, "--creator-transition-progress": [0, 1],
        transition: { duration: 0.16, ease: "linear", opacity: { duration: 0.08, delay: 0.08, ease: "linear" } } },
      // The unused progress value preserves the full duration even when an interrupted entrance is still transparent.
      closed: { ...pagePose, x: 0, opacity: [null, 0, 0], "--creator-transition-progress": [1, 0],
        transition: { duration: 0.16, ease: "linear", opacity: { duration: 0.16, times: [0, 0.5, 1], ease: "linear" } } },
    },
  };
  const variants = variant === "source" ? sourceVariants : reducedMotion ? {
    enter: { ...pagePose, x: 0, opacity: 1 },
    open: { ...pagePose, x: 0, opacity: 1, transition: { duration: 0 } },
    closed: { ...pagePose, x: 0, opacity: 1, transition: { duration: 0 } },
  } : alternatives[variant];

  return (
    <div ref={layerRef} className="creator-page-transition" data-variant={variant} data-phase={closing ? "closing" : "open"} inert={closing}>
      <motion.div className="creator-page-transition-surface" variants={variants}
        initial={reducedMotion ? false : "enter"} animate={closing ? "closed" : "open"}
        onAnimationComplete={definition => { if (definition === "closed") completeClose(); }}>
        {children}
      </motion.div>
    </div>
  );
}
