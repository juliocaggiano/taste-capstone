import { CaretRight } from "./design-system/PrototypeIcons";
import { createContext, useContext } from "react";
import { Carousel } from "./mobile";
import "./related-works.css";

export type RelatedWorksVariant = "gallery" | "grid" | "list";
export const RelatedWorksVariantContext = createContext<RelatedWorksVariant | null>("gallery");

type RelatedWork = {
  id: string;
  title: string;
  creator: string;
  year: string;
  image: string;
  imagePosition?: string;
};

export type RelatedWorksProps = {
  id: string;
  title: string;
  carouselLabel: string;
  items: RelatedWork[];
  openLabel: (title: string) => string;
  onOpen: (id: string) => void;
};

function RelatedWorkButton({ item, variant, openLabel, onOpen }: {
  item: RelatedWork;
  variant: RelatedWorksVariant;
  openLabel: RelatedWorksProps["openLabel"];
  onOpen: RelatedWorksProps["onOpen"];
}) {
  return <button type="button" className="related-work" onClick={() => onOpen(item.id)} aria-label={openLabel(item.title)}>
    <span className="related-work-image">
      <img src={item.image} alt="" draggable={false} style={{ objectPosition: item.imagePosition ?? "center" }} />
    </span>
    <span className="related-work-copy">
      <span className="related-work-title">{item.title}</span>
      <span className="related-work-creator">{item.creator}</span>
      <span className="related-work-year">{item.year}</span>
    </span>
    {variant === "list" && <CaretRight className="related-work-chevron" size={14} weight="regular" aria-hidden="true" />}
  </button>;
}

/** Gallery is the selected default; studies can choose a different presentation. */
export function RelatedWorks({ id, title, carouselLabel, items, openLabel, onOpen }: RelatedWorksProps) {
  const variant = useContext(RelatedWorksVariantContext);
  if (!items.length) return null;
  const headingId = `story-more-${id}`;

  return <section className="story-more today-more" data-related-variant={variant ?? "current"} aria-labelledby={headingId}>
    <h2 id={headingId}>{title}</h2>
    {variant === null ? <Carousel className="story-more-carousel" contentClassName="story-more-carousel-track" ariaLabel={carouselLabel}>
      {items.map(item => <button key={item.id} type="button" className="story-more-card" onClick={() => onOpen(item.id)} aria-label={openLabel(item.title)}>
        <span className="story-more-card-image"><img src={item.image} alt="" draggable={false} style={{ objectPosition: item.imagePosition ?? "center" }} /></span>
        <span className="story-more-card-copy">
          <span className="story-more-card-title">{item.title}</span>
          <span className="story-more-card-meta"><strong>{item.creator}</strong><span>{item.year}</span></span>
        </span>
      </button>)}
    </Carousel> : variant === "gallery" ? <Carousel className="related-work-carousel" contentClassName="related-work-carousel-track" ariaLabel={carouselLabel}>
      {items.map(item => <RelatedWorkButton key={item.id} item={item} variant={variant} openLabel={openLabel} onOpen={onOpen} />)}
    </Carousel> : <ul className={`related-work-${variant}`}>
      {items.map(item => <li key={item.id}><RelatedWorkButton item={item} variant={variant} openLabel={openLabel} onOpen={onOpen} /></li>)}
    </ul>}
  </section>;
}
