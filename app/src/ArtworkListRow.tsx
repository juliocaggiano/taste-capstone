import "./artwork-list-row.css";

export type ArtworkListRowArtwork<Id extends string = string> = {
  id: Id;
  title: string;
  creator: string;
  year: string;
  image: string;
  imagePosition?: string;
};

export type ArtworkListRowProps<Id extends string = string> = {
  artwork: ArtworkListRowArtwork<Id>;
  onOpen: (id: Id) => void;
  className?: string;
  "aria-label"?: string;
};

/** Shared artwork row for Search, Library, and collection contents. */
export function ArtworkListRow<Id extends string>({ artwork, onOpen, className = "", "aria-label": ariaLabel }: ArtworkListRowProps<Id>) {
  return <button
    type="button"
    className={`artwork-list-row ${className}`.trim()}
    data-piece-id={artwork.id}
    aria-label={ariaLabel}
    onClick={() => onOpen(artwork.id)}
  >
    <img className="artwork-list-image" src={artwork.image} alt="" loading="lazy" draggable={false}
      style={{ objectPosition: artwork.imagePosition ?? "center" }} />
    <span className="artwork-list-copy">
      <strong>{artwork.title}</strong>
      <span className="artwork-list-author">{artwork.creator}{artwork.year ? `, ${artwork.year}` : ""}</span>
    </span>
  </button>;
}
