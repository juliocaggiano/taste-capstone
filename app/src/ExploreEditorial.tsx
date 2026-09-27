import { ArrowRight, Plus } from "./design-system/PrototypeIcons";
import { collectionArtworks, type ExploreConceptArtwork, type ExploreConceptProps } from "./explore-concepts";
import "./explore-editorial.css";

const COPY = {
  en: { title: "The edit", introduction: "One idea. Many ways to see it.", featured: "In focus", collection: "Collection", closer: "A closer look", continue: "Follow another thread", explore: "Explore collection", all: "All artworks", browse: "Open the gallery", work: "artwork", works: "artworks", collections: "collections" },
  "pt-BR": { title: "A seleção", introduction: "Uma ideia. Muitas formas de ver.", featured: "Em foco", collection: "Coleção", closer: "Um olhar mais próximo", continue: "Siga outra conexão", explore: "Explorar coleção", all: "Todas as obras", browse: "Abrir a galeria", work: "obra", works: "obras", collections: "coleções" },
  it: { title: "La selezione", introduction: "Un'idea. Tanti modi di vederla.", featured: "In primo piano", collection: "Collezione", closer: "Uno sguardo da vicino", continue: "Segui un altro filo", explore: "Esplora la collezione", all: "Tutte le opere", browse: "Apri la galleria", work: "opera", works: "opere", collections: "collezioni" },
  es: { title: "La selección", introduction: "Una idea. Muchas formas de verla.", featured: "En foco", collection: "Colección", closer: "Una mirada más cercana", continue: "Sigue otra conexión", explore: "Explorar colección", all: "Todas las obras", browse: "Abrir la galería", work: "obra", works: "obras", collections: "colecciones" },
};

function EditorialArtwork({ artwork, onOpen }: { artwork: ExploreConceptArtwork; onOpen: (id: string) => void }) {
  return <button className="edit-artwork" type="button" onClick={() => onOpen(artwork.id)}>
    <span className="edit-artwork-image"><img src={artwork.image} alt="" loading="lazy" draggable={false} style={{ objectPosition: artwork.imagePosition }} /><ArrowRight size={16} aria-hidden="true" /></span>
    <span className="edit-artwork-caption"><strong>{artwork.title}</strong><span>{artwork.creator}</span></span>
  </button>;
}

/** An editorial route through the same live archive, isolated to the Explore study. */
export function ExploreEditorial({ artworks, collections, locale, gallery, onOpenPiece, onOpenCollection }: ExploreConceptProps) {
  const copy = COPY[locale];
  const featured = collections.find(collection => collection.id === "japan-motion") ?? collections[0];
  const remaining = collections.filter(collection => collection.id !== featured?.id);
  const closeLookIds = ["noh-mask", "migrant-mother"];
  const closeLook = closeLookIds.flatMap(id => artworks.find(artwork => artwork.id === id) ?? []).slice(0, 2);
  const worksLabel = (count: number) => `${count} ${count === 1 ? copy.work : copy.works}`;

  return <div className="explore-editorial">
    <header className="edit-masthead">
      <div><h2>{copy.title}</h2><p>{copy.introduction}</p></div>
      <span className="edit-edition">{collections.length.toString().padStart(2, "0")}<span>{copy.collections}</span></span>
    </header>

    {featured && <section className="edit-feature" aria-label={copy.featured}>
      <div className="edit-section-kicker"><span>{copy.featured}</span><span>01</span></div>
      <button type="button" className="edit-feature-link" onClick={() => onOpenCollection(featured.id)}>
        <span className="edit-feature-image"><img src={featured.image} alt="" draggable={false} /></span>
        <span className="edit-feature-caption">
          <span className="edit-eyebrow">{copy.collection} · {worksLabel(collectionArtworks(featured, artworks).length)}</span>
          <strong>{featured.title}</strong>
          <span className="edit-feature-description">{featured.description}</span>
          <span className="edit-link-label">{copy.explore}<ArrowRight size={18} aria-hidden="true" /></span>
        </span>
      </button>
    </section>}

    {closeLook.length > 0 && <section className="edit-close-look" aria-label={copy.closer}>
      <h3>{copy.closer}</h3>
      <div className="edit-artwork-duo">{closeLook.map(artwork => <EditorialArtwork key={artwork.id} artwork={artwork} onOpen={onOpenPiece} />)}</div>
    </section>}

    {remaining.length > 0 && <section className="edit-threads" aria-label={copy.continue}>
      <h3>{copy.continue}</h3>
      {remaining.map((collection, index) => {
        const works = collectionArtworks(collection, artworks);
        const cover = works[0];
        return <button key={collection.id} type="button" className="edit-spread" onClick={() => onOpenCollection(collection.id)}>
          <span className="edit-spread-image"><img src={cover?.image ?? collection.image} alt="" loading="lazy" draggable={false} style={{ objectPosition: cover?.imagePosition }} /></span>
          <span className="edit-spread-copy">
            <span className="edit-spread-number">{(index + 2).toString().padStart(2, "0")}</span>
            <strong>{collection.title}</strong>
            <span className="edit-spread-description">{collection.description}</span>
            <span className="edit-spread-bottom"><span>{worksLabel(works.length)}</span><ArrowRight size={18} aria-hidden="true" /></span>
          </span>
        </button>;
      })}
    </section>}

    <details className="edit-archive">
      <summary>
        <span className="edit-archive-copy"><strong>{copy.all}</strong><span>{worksLabel(artworks.length)}</span></span>
        <span className="edit-archive-thumbs" aria-hidden="true">{artworks.slice(0, 3).map(artwork => <img key={artwork.id} src={artwork.image} alt="" loading="lazy" draggable={false} style={{ objectPosition: artwork.imagePosition }} />)}</span>
        <span className="edit-archive-toggle"><Plus size={18} aria-hidden="true" /></span>
      </summary>
      <div className="edit-archive-content">{gallery}</div>
    </details>
  </div>;
}
