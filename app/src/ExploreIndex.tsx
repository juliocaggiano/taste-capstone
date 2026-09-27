import { useState } from "react";
import { collectionArtworks, type ExploreConceptProps } from "./explore-concepts";
import "./explore-index.css";

const COPY = {
  en: { title: "Follow a thread.", intro: "A small index of things worth looking into.", collections: "Collections", gallery: "All artworks", open: "Open collection", works: (n: number) => `${n} works` },
  "pt-BR": { title: "Siga um caminho.", intro: "Um pequeno índice de coisas para descobrir.", collections: "Coleções", gallery: "Todas as obras", open: "Abrir coleção", works: (n: number) => `${n} obras` },
  it: { title: "Segui un filo.", intro: "Un piccolo indice di cose da scoprire.", collections: "Collezioni", gallery: "Tutte le opere", open: "Apri collezione", works: (n: number) => `${n} opere` },
  es: { title: "Sigue un hilo.", intro: "Un pequeño índice de cosas por descubrir.", collections: "Colecciones", gallery: "Todas las obras", open: "Abrir colección", works: (n: number) => `${n} obras` },
};

export function ExploreIndex({ artworks, collections, locale, gallery, onOpenPiece, onOpenCollection }: ExploreConceptProps) {
  const [expanded, setExpanded] = useState<string | null>(collections[0]?.id ?? null);
  const labels = COPY[locale];
  const toggle = (id: string) => setExpanded(current => current === id ? null : id);
  return <div className="explore-index">
    <header className="explore-index-intro">
      <h2>{labels.title}</h2>
      <p>{labels.intro}</p>
    </header>
    <section className="explore-index-contents discover-featured" aria-label={labels.collections}>
      <div className="explore-index-key"><span>{labels.collections}</span><span>{String(collections.length).padStart(2, "0")}</span></div>
      {collections.map((collection, index) => {
        const works = collectionArtworks(collection, artworks);
        const open = expanded === collection.id;
        const panelId = `explore-index-${collection.id}`;
        return <article key={collection.id} className="explore-index-entry" data-open={open}>
          <h3><button type="button" className="explore-index-trigger" aria-expanded={open} aria-controls={panelId} onClick={() => toggle(collection.id)}>
            <span className="explore-index-number">{String(index + 1).padStart(2, "0")}</span>
            <span className="explore-index-name">{collection.title}</span>
            <span className="explore-index-toggle" aria-hidden="true">{open ? "−" : "+"}</span>
          </button></h3>
          {!open && <span className="explore-index-peek" aria-hidden="true">{works.slice(0, 3).map(work => <img key={work.id} src={work.image} alt="" draggable={false} style={{ objectPosition: work.imagePosition }} />)}</span>}
          <div className="explore-index-panel" id={panelId} hidden={!open}>
            <p className="explore-index-description">{collection.description}</p>
            <div className="explore-index-artworks">
              {works.map(work => <button type="button" key={work.id} onClick={() => onOpenPiece(work.id)} aria-label={work.title}>
                <img src={work.image} alt="" draggable={false} loading="lazy" style={{ objectPosition: work.imagePosition ?? "center" }} />
                <span>{work.title}</span>
              </button>)}
            </div>
            <div className="explore-index-entry-footer"><span>{labels.works(works.length)}</span><button type="button" className="explore-index-open" onClick={() => onOpenCollection(collection.id)}>{labels.open}<span aria-hidden="true">↗</span></button></div>
          </div>
        </article>;
      })}
      <article className="explore-index-entry explore-index-gallery-entry" data-open={expanded === "gallery"}>
        <h3><button type="button" className="explore-index-trigger" aria-expanded={expanded === "gallery"} aria-controls="explore-index-gallery" onClick={() => toggle("gallery")}>
          <span className="explore-index-number">{String(collections.length + 1).padStart(2, "0")}</span>
          <span className="explore-index-name">{labels.gallery}<small>{labels.works(artworks.length)}</small></span>
          <span className="explore-index-toggle" aria-hidden="true">{expanded === "gallery" ? "−" : "+"}</span>
        </button></h3>
        <div className="explore-index-panel" id="explore-index-gallery" hidden={expanded !== "gallery"}>{gallery}</div>
      </article>
    </section>
  </div>;
}
