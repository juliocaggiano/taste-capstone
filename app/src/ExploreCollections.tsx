import { CaretRight } from "./design-system/PrototypeIcons";
import { Carousel } from "./mobile";
import "./explore-study.css";

export type ExploreStudyVariant = "gallery-first" | "collections-first" | "compact-browse" | "editorial" | "rooms" | "index" | "switchboard" | "lenses" | "stream";

type Collection<Id extends string> = { id: Id; title: string; image: string; pieceIds: readonly string[] };
type Artwork = { id: string; image: string; imagePosition?: string };

export function ExploreCollections<Id extends string>({ variant, collections, artworks, title, worksLabel, onOpen }: {
  variant: ExploreStudyVariant;
  collections: readonly Collection<Id>[];
  artworks: readonly Artwork[];
  title: string;
  worksLabel: (count: number) => string;
  onOpen: (id: Id) => void;
}) {
  const cards = collections.map(collection => {
    const works = collection.pieceIds.flatMap(id => {
      const work = artworks.find(item => item.id === id);
      return work ? [work] : [];
    });
    const images = works.slice(0, 2);
    return <button key={collection.id} type="button" className="explore-collection-card discover-collection-card" onClick={() => onOpen(collection.id)}>
      <span className="explore-collection-images" aria-hidden="true">
        {(images.length ? images : [{ id: collection.id, image: collection.image }]).map(work =>
          <img key={work.id} src={work.image} alt="" loading="lazy" draggable={false} style={{ objectPosition: "imagePosition" in work ? work.imagePosition : "center" }} />)}
      </span>
      <span className="discover-card-copy"><strong>{collection.title}</strong><span>{worksLabel(works.length)}</span></span>
      {variant === "gallery-first" && <CaretRight className="explore-collection-arrow" size={14} aria-hidden="true" />}
    </button>;
  });

  return <section className="discover-featured explore-collections" aria-labelledby="discover-collections-title">
    <header className="discover-section-heading"><h2 id="discover-collections-title">{title}</h2></header>
    {variant === "collections-first"
      ? <Carousel className="explore-collection-rail" contentClassName="explore-collection-track" ariaLabel={title}>{cards}</Carousel>
      : <div className="explore-collection-layout">{cards}</div>}
  </section>;
}
