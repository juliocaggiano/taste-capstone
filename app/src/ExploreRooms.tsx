import { useId, useState } from "react";
import { ArrowRight, CaretDown, CaretLeft, CaretRight } from "./design-system/PrototypeIcons";
import { Carousel } from "./mobile";
import { collectionArtworks, type ExploreConceptProps } from "./explore-concepts";
import "./explore-rooms.css";

const roomCopy = {
  en: {
    title: "Collection rooms", choose: "Choose a collection room", previous: "Previous room", next: "Next room",
    room: "Room", open: "Open collection", all: "All artworks", work: "artwork", works: "artworks",
  },
  "pt-BR": {
    title: "Salas de coleções", choose: "Escolher uma sala de coleção", previous: "Sala anterior", next: "Próxima sala",
    room: "Sala", open: "Abrir coleção", all: "Todas as obras", work: "obra", works: "obras",
  },
  it: {
    title: "Sale delle collezioni", choose: "Scegli una sala della collezione", previous: "Sala precedente", next: "Sala successiva",
    room: "Sala", open: "Apri collezione", all: "Tutte le opere", work: "opera", works: "opere",
  },
  es: {
    title: "Salas de colecciones", choose: "Elige una sala de colección", previous: "Sala anterior", next: "Sala siguiente",
    room: "Sala", open: "Abrir colección", all: "Todas las obras", work: "obra", works: "obras",
  },
};

/** A small exhibition to enter and browse, rather than another collection-card feed. */
export function ExploreRooms({ artworks, collections, locale, gallery, onOpenPiece, onOpenCollection }: ExploreConceptProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const uid = useId();
  const copy = roomCopy[locale];
  const current = collections[selectedIndex] ?? collections[0];
  const currentIndex = current ? collections.indexOf(current) : 0;
  const works = current ? collectionArtworks(current, artworks) : [];
  const worksLabel = (count: number) => `${count} ${count === 1 ? copy.work : copy.works}`;
  const roomNumber = (index: number) => String(index + 1).padStart(2, "0");

  if (!current) return <div className="explore-rooms">{gallery}</div>;

  return <section className="explore-rooms discover-featured" aria-labelledby={`${uid}-title`}>
    <header className="explore-rooms-header">
      <h2 id={`${uid}-title`} className="explore-rooms-heading">{copy.title}</h2>
      <div className="explore-rooms-navigation">
        <span className="explore-rooms-counter" aria-label={`${copy.room} ${currentIndex + 1} / ${collections.length}`}>
          <span>{roomNumber(currentIndex)}</span><span aria-hidden="true">/</span><span>{String(collections.length).padStart(2, "0")}</span>
        </span>
        <div className="explore-rooms-arrows">
          <button type="button" aria-label={copy.previous} disabled={currentIndex === 0} onClick={() => setSelectedIndex(currentIndex - 1)}><CaretLeft size={16} /></button>
          <button type="button" aria-label={copy.next} disabled={currentIndex === collections.length - 1} onClick={() => setSelectedIndex(currentIndex + 1)}><CaretRight size={16} /></button>
        </div>
      </div>
    </header>

    <Carousel className="explore-rooms-selector" contentClassName="explore-rooms-selector-track" ariaLabel={copy.choose}>
      {collections.map((collection, index) => <button
        key={collection.id}
        type="button"
        className="explore-rooms-room"
        aria-pressed={current.id === collection.id}
        aria-controls={`${uid}-room`}
        onClick={() => setSelectedIndex(index)}
      >
        <span className="explore-rooms-thumbnail"><img src={collection.image} alt="" draggable={false} /><span aria-hidden="true">{roomNumber(index)}</span></span>
        <span className="explore-rooms-room-title">{collection.title}</span>
      </button>)}
    </Carousel>

    <div id={`${uid}-room`} className="explore-rooms-exhibition" aria-labelledby={`${uid}-collection`}>
      <div key={current.id} className="explore-rooms-arrival">
        <div className="explore-rooms-wall" data-works={Math.min(works.length, 3)}>
          {works.slice(0, 3).map((work, index) => <button key={work.id} type="button" className="explore-rooms-work" onClick={() => onOpenPiece(work.id)} aria-label={`${work.title} · ${work.creator}`}>
            <span className="explore-rooms-work-image"><img src={work.image} alt="" draggable={false} style={{ objectPosition: work.imagePosition ?? "center" }} /></span>
            <span className="explore-rooms-work-label"><span aria-hidden="true">{roomNumber(index)}</span><span>{work.title}</span></span>
          </button>)}
        </div>
        <div className="explore-rooms-caption">
          <span className="explore-rooms-metadata">{copy.room} {roomNumber(currentIndex)}<span aria-hidden="true">·</span>{worksLabel(works.length)}</span>
          <h3 id={`${uid}-collection`} aria-live="polite" aria-atomic="true">{current.title}</h3>
          <p>{current.description}</p>
          <button type="button" className="explore-rooms-enter" onClick={() => onOpenCollection(current.id)}>{copy.open}<ArrowRight size={16} /></button>
        </div>
      </div>
    </div>

    <details className="explore-rooms-gallery">
      <summary><span>{copy.all}<span className="explore-rooms-gallery-count">{artworks.length}</span></span><CaretDown size={16} /></summary>
      <div className="explore-rooms-gallery-content">{gallery}</div>
    </details>
  </section>;
}
