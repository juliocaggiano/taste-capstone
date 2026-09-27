import { Fragment, useId } from "react";
import { CaretRight } from "./design-system/PrototypeIcons";
import { collectionArtworks, type ExploreConceptCollection, type ExploreConceptProps } from "./explore-concepts";
import "./explore-stream.css";

const streamCopy = {
  en: { gallery: "Gallery", collection: "Collection", work: "artwork", works: "artworks" },
  "pt-BR": { gallery: "Galeria", collection: "Coleção", work: "obra", works: "obras" },
  it: { gallery: "Galleria", collection: "Collezione", work: "opera", works: "opere" },
  es: { gallery: "Galería", collection: "Colección", work: "obra", works: "obras" },
};

/** Keep the gallery continuous, with collection detours between groups of works. */
export function ExploreStream({ artworks, collections, locale, onOpenPiece, onOpenCollection }: ExploreConceptProps) {
  const headingId = useId();
  const copy = streamCopy[locale];
  const groups = [artworks.slice(0, 3), artworks.slice(3, 6), artworks.slice(6)];
  const remainingCollections = [...collections];
  const suggestions = groups.map(group => {
    const overlap = (collection: ExploreConceptCollection) => group.filter(work => collection.pieceIds.includes(work.id)).length;
    remainingCollections.sort((a, b) => overlap(b) - overlap(a));
    return remainingCollections.shift();
  });

  function collectionStrip(collection: ExploreConceptCollection) {
    const works = collectionArtworks(collection, artworks);
    const images = works.slice(0, 2);
    return <button key={collection.id} type="button" className="explore-stream-collection discover-featured" onClick={() => onOpenCollection(collection.id)}>
      <span className="explore-stream-covers" aria-hidden="true">
        {images.length ? images.map(work => <img key={work.id} src={work.image} alt="" draggable={false} loading="lazy" style={{ objectPosition: work.imagePosition ?? "center" }} />)
          : <img src={collection.image} alt="" draggable={false} loading="lazy" />}
      </span>
      <span className="explore-stream-collection-copy">
        <strong>{collection.title}</strong>
        <span>{copy.collection} · {works.length} {works.length === 1 ? copy.work : copy.works}</span>
      </span>
      <CaretRight size={16} />
    </button>;
  }

  return <section className="explore-stream discover-gallery" aria-labelledby={headingId}>
    <header className="discover-gallery-heading"><h2 id={headingId}>{copy.gallery}</h2></header>
    {groups.map((group, index) => <Fragment key={index}>
      {group.length > 0 && <div className="discover-gallery-grid" data-layout="grid">
        {group.map(piece => <button key={piece.id} type="button" className="discover-artwork-card" onClick={() => onOpenPiece(piece.id)}>
          <img src={piece.image} alt="" draggable={false} loading="lazy" style={{ objectPosition: piece.imagePosition ?? "center" }} />
          <span className="discover-card-copy"><strong>{piece.title}</strong><span>{piece.creator}</span></span>
        </button>)}
      </div>}
      {suggestions[index] && collectionStrip(suggestions[index])}
    </Fragment>)}
    {remainingCollections.map(collectionStrip)}
  </section>;
}
