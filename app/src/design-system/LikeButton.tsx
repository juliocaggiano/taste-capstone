import { useEffect, useLayoutEffect, useRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { Heart } from "./PrototypeIcons";
import { useAnimate, useReducedMotion } from "motion/react";
import "./like-button.css";

export type LikeButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "aria-pressed"> & {
  liked: boolean;
  /** Preserve screen-specific heart artwork and dimensions, including the Paper Today icon. */
  icon?: ReactNode;
};

/** Pulse the heart; resize the count only when its intrinsic width changes. */
export function LikeButton({ liked, icon, children, className = "", type = "button", ...props }: LikeButtonProps) {
  const [heart, animate] = useAnimate<HTMLSpanElement>();
  const reducedMotion = useReducedMotion();
  const previous = useRef(liked);
  const count = useRef<HTMLSpanElement>(null);
  const countText = useRef<HTMLSpanElement>(null);
  const hasCount = children !== undefined && children !== null;

  useLayoutEffect(() => {
    const container = count.current;
    const content = countText.current;
    if (!container || !content) return;
    let target = Number.NaN;
    let resizeAnimation: ReturnType<typeof animate> | undefined;
    const resize = (width: number) => {
      // Hidden mounted previews must not initialize to zero or animate on reveal.
      if (!Number.isFinite(width) || width <= 0 || Math.abs(width - target) < .01) return;
      const first = Number.isNaN(target);
      target = width;
      resizeAnimation?.stop();
      if (first || reducedMotion) container.style.width = `${width}px`;
      else resizeAnimation = animate(container, { width }, { duration: .18, ease: "easeOut" });
    };
    // Computed width is unaffected by the phone preview's scale transform.
    resize(parseFloat(getComputedStyle(content).width));
    const observer = new ResizeObserver(entries => resize(entries[0].contentRect.width));
    observer.observe(content);
    return () => { observer.disconnect(); resizeAnimation?.stop(); };
  }, [hasCount, reducedMotion, animate]);

  useEffect(() => {
    const changed = previous.current !== liked;
    previous.current = liked;
    if (!heart.current) return;
    if (reducedMotion) {
      const reset = animate(heart.current, { scale: 1 }, { duration: 0 });
      return () => reset.stop();
    }
    // Saved favourites render in their final state without replaying the gesture.
    if (!changed) return;
    const animation = animate(heart.current, {
      scale: liked ? [1, 0.9, 1.12, 1] : [1, 0.94, 1],
    }, {
      duration: liked ? 0.32 : 0.18,
      times: liked ? [0, 0.22, 0.55, 1] : [0, 0.35, 1],
      ease: "easeOut",
    });
    return () => animation.stop();
  }, [liked, reducedMotion, animate, heart]);

  return <button {...props} type={type} className={`dc-like-button ${className}`.trim()} aria-pressed={liked}>
    <span ref={heart} className="dc-like-icon" aria-hidden="true">{icon ?? <Heart size={20} weight={liked ? "fill" : "regular"} />}</span>
    {hasCount && <span ref={count} className="dc-like-count"><span ref={countText} className="dc-like-count-value">{children}</span></span>}
  </button>;
}
