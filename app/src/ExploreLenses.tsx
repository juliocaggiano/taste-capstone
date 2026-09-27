import { useState } from "react";
import { CaretRight } from "./design-system/PrototypeIcons";
import { collectionArtworks, type ExploreConceptProps } from "./explore-concepts";
import "./explore-lenses.css";

const COPY = {
  en: { collections: "Collections", all: "All artworks", gallery: "Gallery", open: "Open collection", works: (n: number) => `${n} works` },
  "pt-BR": { collections: "Coleções", all: "Todas as obras", gallery: "Galeria", open: "Abrir coleção", works: (n: number) => `${n} obras` },
  it: { collections: "Collezioni", all: "Tutte le opere", gallery: "Galleria", open: "Apri collezione", works: (n: number) => `${n} opere` },
  es: { collections: "Colecciones", all: "Todas las obras", gallery: "Galería", open: "Abrir colección", works: (n: number) => `${n} obras` },
};

export function ExploreLenses({ artworks, collections, locale, onOpenPiece, onOpenCollection }: ExploreConceptProps) {
  const [selected, setSelected] = useState<string | null>(null);
  const [changed, setChanged] = useState(false);
  const copy = COPY[locale];
  const collection = collections.find(item => item.id === selected);
  const shown = collection ? collectionArtworks(collection, artworks) : artworks;
  const select = (id: string | null) => { setSelected(id); setChanged(true); };
  return <div className="explore-lenses">
    <section className="discover-featured" aria-label={copy.collections}>
      <header className="explore-lenses-heading"><h2>{copy.collections}</h2><button className="explore-lenses-all" type="button" aria-pressed={!collection} onClick={() => select(null)}>{copy.all}</button></header>
      <div className="explore-lenses-options" role="group" aria-label={copy.collections}>
        {collections.map(item => {
          const works = collectionArtworks(item, artworks);
          return <button key={item.id} type="button" className="explore-lenses-option" aria-pressed={selected === item.id} aria-controls="explore-lenses-gallery" onClick={() => select(selected === item.id ? null : item.id)}>
            <span className="explore-lenses-cover" aria-hidden="true"><img src={item.image} alt="" draggable={false} /></span>
            <span className="explore-lenses-copy"><strong>{item.title}</strong><span>{copy.works(works.length)}</span></span>
          </button>;
        })}
      </div>
    </section>
    <section className="explore-lenses-results" id="explore-lenses-gallery" aria-label={copy.gallery}>
      <header className="explore-lenses-heading"><h2>{collection?.title ?? copy.gallery}</h2><span className="explore-lenses-count" aria-live="polite">{copy.works(shown.length)}</span></header>
      {collection && <div className="explore-lenses-context"><p>{collection.description}</p><button type="button" onClick={() => onOpenCollection(collection.id)}>{copy.open}<CaretRight size={14} aria-hidden="true" /></button></div>}
      <div key={selected ?? "all"} className="discover-gallery-grid explore-lenses-grid" data-layout="grid" data-changed={changed}>
        {shown.map(work => <button key={work.id} type="button" className="discover-artwork-card" onClick={() => onOpenPiece(work.id)}>
          <img src={work.image} alt="" draggable={false} loading="lazy" style={{ objectPosition: work.imagePosition ?? "center" }} />
          <span className="discover-card-copy"><strong>{work.title}</strong><span>{work.creator}</span></span>
        </button>)}
      </div>
    </section>
  </div>;
}
