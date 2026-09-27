import { useId, useRef, useState, type KeyboardEvent } from "react";
import { collectionArtworks, type ExploreConceptProps } from "./explore-concepts";
import "./explore-switchboard.css";

const COPY = {
  en: { gallery: "Gallery", collections: "Collections", browse: "Browse", work: "artwork", works: "artworks" },
  "pt-BR": { gallery: "Galeria", collections: "Coleções", browse: "Explorar", work: "obra", works: "obras" },
  it: { gallery: "Galleria", collections: "Collezioni", browse: "Esplora", work: "opera", works: "opere" },
  es: { gallery: "Galería", collections: "Colecciones", browse: "Explorar", work: "obra", works: "obras" },
};
const SECTIONS = ["gallery", "collections"] as const;
type Section = typeof SECTIONS[number];

/** Two browse destinations, using the existing gallery and compact collection shelf. */
export function ExploreSwitchboard({ artworks, collections, locale, gallery, onOpenCollection }: ExploreConceptProps) {
  const [section, setSection] = useState<Section>("gallery");
  const [hasChanged, setHasChanged] = useState(false);
  const refs = useRef<Array<HTMLButtonElement | null>>([]);
  const id = useId();
  const copy = COPY[locale];

  function selectSection(next: Section) {
    if (next !== section) {
      setHasChanged(true);
      setSection(next);
    }
  }

  function onTabKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let nextIndex: number;
    switch (event.key) {
      case "ArrowRight": nextIndex = (index + 1) % SECTIONS.length; break;
      case "ArrowLeft": nextIndex = (index - 1 + SECTIONS.length) % SECTIONS.length; break;
      case "Home": nextIndex = 0; break;
      case "End": nextIndex = SECTIONS.length - 1; break;
      default: return;
    }
    event.preventDefault();
    selectSection(SECTIONS[nextIndex]);
    refs.current[nextIndex]?.focus();
  }

  return <div className="explore-switchboard" data-browse-section={section}>
    <div className="explore-switchboard-tabs" role="tablist" aria-label={copy.browse}>
      {SECTIONS.map((item, index) => <button
        key={item}
        ref={element => { refs.current[index] = element; }}
        type="button"
        role="tab"
        id={`${id}-tab-${item}`}
        aria-controls={`${id}-panel-${item}`}
        aria-selected={section === item}
        tabIndex={section === item ? 0 : -1}
        data-explore-tab={item}
        onClick={() => selectSection(item)}
        onKeyDown={event => onTabKeyDown(event, index)}
      >{copy[item]}</button>)}
    </div>

    <section
      className="explore-switchboard-panel explore-switchboard-gallery"
      id={`${id}-panel-gallery`}
      role="tabpanel"
      aria-labelledby={`${id}-tab-gallery`}
      tabIndex={0}
      hidden={section !== "gallery"}
      data-animate={hasChanged && section === "gallery" ? "true" : undefined}
    >{gallery}</section>

    <section
      className="explore-switchboard-panel explore-switchboard-collections"
      id={`${id}-panel-collections`}
      role="tabpanel"
      aria-labelledby={`${id}-tab-collections`}
      tabIndex={0}
      hidden={section !== "collections"}
      data-animate={hasChanged && section === "collections" ? "true" : undefined}
    >
      <div className="explore-switchboard-shelf">
        {collections.map(collection => {
          const works = collectionArtworks(collection, artworks);
          const images = works.length ? works.slice(0, 2) : [{ id: collection.id, image: collection.image, imagePosition: "center" }];
          return <button className="explore-switchboard-collection" key={collection.id} type="button" onClick={() => onOpenCollection(collection.id)}>
            <span className="explore-switchboard-covers" aria-hidden="true">
              {images.map(work => <img key={work.id} src={work.image} alt="" loading="lazy" draggable={false} style={{ objectPosition: work.imagePosition }} />)}
            </span>
            <span className="explore-switchboard-copy"><strong>{collection.title}</strong><span>{works.length} {works.length === 1 ? copy.work : copy.works}</span></span>
          </button>;
        })}
      </div>
    </section>
  </div>;
}
