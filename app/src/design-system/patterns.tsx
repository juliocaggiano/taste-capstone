import { useRef, useState } from "react";
import { Heart, MagnifyingGlass } from "./PrototypeIcons";
import { Carousel } from "../mobile";
import { ArtworkCard, Chip } from "./components";
import { LikeButton } from "./LikeButton";
import "./patterns.css";

export const sampleArtworks = [
  { image: "/assets/content/great-wave.jpg", title: "The Great Wave off Kanagawa", creator: "Katsushika Hokusai", meta: "Japan · Print" },
  { image: "/assets/content/girl-pearl.jpg", title: "Girl with a Pearl Earring", creator: "Johannes Vermeer", meta: "Netherlands · Painting" },
  { image: "/assets/content/arabic-bowl.jpg", title: "Bowl with Arabic inscription", creator: "Unknown", meta: "Iran · Object" },
];

// Existing project records and files; source notes live in public/assets/content/README.md.
// Keep the three-work export stable for the other component and asset examples.
const galleryArtworks = [
  { ...sampleArtworks[0], form: "Print" },
  { ...sampleArtworks[1], form: "Painting" },
  { ...sampleArtworks[2], form: "Object" },
  { image: "/assets/content/the-kiss.jpg", title: "The Kiss", creator: "Gustav Klimt", meta: "Austria · Painting", form: "Painting" },
  { image: "/assets/content/migrant-mother.jpg", title: "Migrant Mother", creator: "Dorothea Lange", meta: "United States · Photography", form: "Photography" },
  { image: "/assets/content/noh-mask.jpg", title: "Noh Mask: Kojo", creator: "Unknown", meta: "Japan · Theater", form: "Performance" },
  { image: "/assets/content/chart-of-hell.jpg", title: "Chart of Hell", creator: "Sandro Botticelli", meta: "Italy · Drawing", form: "Drawing" },
  { image: "/assets/content/dante-portrait.jpg", title: "Portrait of Dante Alighieri", creator: "Sandro Botticelli", meta: "Italy · Painting", form: "Painting" },
];

const filters = ["All", "Painting", "Print", "Object", "Photography"] as const;
type ArtworkFilter = typeof filters[number];

export function DailyStoryPattern() {
  const [saved, setSaved] = useState(false);
  return <article className="ds-daily-pattern">
    <img className="ds-story-art" src={sampleArtworks[0].image} alt="Hokusai’s Great Wave, with boats beneath a curling wave" />
    <div className="ds-story-meta"><div><h3>{sampleArtworks[0].title}</h3><p>{sampleArtworks[0].creator}</p></div>
      <LikeButton className="ds-save" liked={saved} aria-label={saved ? "Unsave artwork preview" : "Save artwork preview"} onClick={() => setSaved(value => !value)} icon={<Heart size={16} weight={saved ? "fill" : "regular"} aria-hidden="true" />} />
    </div>
    <div className="ds-inline-tags"><span>Print</span><span>Japan</span></div>
    <div className="ds-pattern-story"><p>Three boats cut through a wave that seems larger than Mount Fuji. Hokusai turns foam into claw-like shapes while the mountain stays quiet in the distance.</p><p>The print belonged to a commercial series. Its reach later helped shape how audiences abroad imagined Japanese art and design.</p><small>Editorial project by Julio Caggiano · Draft story</small></div>
  </article>;
}

export function SearchDiscoveryPattern({ onOpen }: { onOpen: (title: string) => void }) {
  const [filter, setFilter] = useState<ArtworkFilter>("All");
  const gallery = useRef<HTMLElement>(null);
  const items = filter === "All" ? galleryArtworks : galleryArtworks.filter(item => item.form === filter);
  const featured = items.slice(0, 2);
  return <section className="ds-search-pattern" aria-label="Search discovery pattern">
    <div className="ds-pattern-search-tools">
      <div className="ds-search-placeholder" aria-label="Search field layout preview"><MagnifyingGlass size={12} aria-hidden="true" /><span>Search</span></div>
      <Carousel className="ds-pattern-filter-rail" contentClassName="ds-pattern-filter-track" ariaLabel="Filter artwork previews">{filters.map(item => <Chip key={item} selected={item === filter} onClick={() => setFilter(item)}>{item}</Chip>)}</Carousel>
    </div>
    <div className="ds-pattern-featured">
      <div className="ds-pattern-section-heading"><h3>Featured collection</h3><button type="button" onClick={() => { gallery.current?.scrollIntoView({ block: "start" }); gallery.current?.focus({ preventScroll: true }); }}>View all</button></div>
      <Carousel key={filter} className="ds-pattern-featured-rail" contentClassName="ds-pattern-featured-track" ariaLabel={`${filter === "All" ? "Featured" : filter} artwork previews`}>
        {featured.map(({ form, ...item }) => <ArtworkCard key={item.title} {...item} density="compact" onOpen={() => onOpen(item.title)} />)}
      </Carousel>
    </div>
    <div className="ds-pattern-discovery">
      <h3 className="ds-discovery-heading">Discover something new</h3>
      <div className="ds-discovery-tiles">{([
        { filter: "Painting", label: "Paintings", category: "Explore a form" },
        { filter: "Print", label: "Works on paper", category: "Printmaking" },
        { filter: "Object", label: "Everyday objects", category: "Explore a form" },
        { filter: "Photography", label: "Photography", category: "People and places" },
      ] as const).map(item => <button type="button" key={item.filter} aria-pressed={filter === item.filter} onClick={() => setFilter(item.filter)}><small>{item.category}</small><span>{item.label}</span></button>)}</div>
    </div>
    <section ref={gallery} className="ds-pattern-gallery" aria-label="Artwork gallery" tabIndex={-1}>
      <div className="ds-pattern-section-heading"><h3>Gallery</h3><span aria-live="polite">{items.length} {items.length === 1 ? "artwork" : "artworks"}</span></div>
      <div className="ds-pattern-gallery-grid">{items.map(({ form, ...item }) => <ArtworkCard key={item.title} {...item} density="compact" onOpen={() => onOpen(item.title)} />)}</div>
    </section>
  </section>;
}
