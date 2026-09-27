import type { ButtonHTMLAttributes, ReactNode } from "react";

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost";
  size?: "small" | "medium";
  loading?: boolean;
};

/** Keep the label mounted while loading so the control keeps its width. */
export function Button({ variant = "primary", size = "medium", loading = false, disabled = false, className = "", children, type = "button", ...props }: ButtonProps) {
  return (
    <button
      {...props}
      type={type}
      className={`dc-button ${className}`.trim()}
      data-variant={variant}
      data-size={size}
      data-loading={loading}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
    >
      <span className="dc-button-label">{children}</span>
      {loading ? <span className="dc-button-spinner" aria-hidden="true" /> : null}
    </button>
  );
}

export type ChipProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  selected?: boolean;
};

export function Chip({ selected = false, className = "", children, type = "button", ...props }: ChipProps) {
  return (
    <button {...props} type={type} className={`dc-chip ${className}`.trim()} data-selected={selected} aria-pressed={selected}>
      {children}
    </button>
  );
}

export type ArtworkCardProps = {
  image: string;
  title: string;
  creator: string;
  meta?: ReactNode;
  imagePosition?: string;
  onOpen: () => void;
  className?: string;
  density?: "default" | "compact";
};

/** The existing app classes preserve the live prototype's geometry and gestures. */
export function ArtworkCard({ image, title, creator, meta, imagePosition = "center", onOpen, className = "", density = "default" }: ArtworkCardProps) {
  return (
    <button type="button" className={`piece-card dc-artwork-card ${className}`.trim()} data-density={density} onClick={onOpen}>
      <img src={image} alt="" style={{ objectPosition: imagePosition }} />
      {density === "compact" ? (
        <span className="dc-artwork-card-copy">
          <strong>{title}</strong>
          <small>{creator}</small>
          {meta != null && meta !== false && meta !== "" ? <span className="piece-card-meta dc-artwork-card-context">{meta}</span> : null}
        </span>
      ) : (
        <>
          <span className="piece-card-meta">{meta}</span>
          <strong>{title}</strong>
          <small>{creator}</small>
        </>
      )}
    </button>
  );
}

export type ToggleProps = {
  ariaLabel: string;
  checked: boolean;
  onChange: () => void;
};

export function Toggle({ ariaLabel, checked, onChange }: ToggleProps) {
  return (
    <button type="button" role="switch" aria-label={ariaLabel} aria-checked={checked} className="switch dc-toggle" data-checked={checked} onClick={onChange}>
      <span />
    </button>
  );
}
