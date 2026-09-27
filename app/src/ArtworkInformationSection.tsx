import { createContext, useContext } from "react";
import { CreatorBiography, TechnicalInformation } from "./design-system/ArtworkInformation";
import { creatorBiographies, technicalDimensions } from "./artwork-information-data";
import { editorialCreators, editorialWorks, DETAIL_LABELS, formatPhysicalDimensions } from "./editorial-information";

type Locale = "en" | "pt-BR" | "it" | "es";
type ReadingContext = {
  locale: Locale;
  units: "metric" | "imperial";
  followedCreators: ReadonlySet<string>;
  toggleFollow: (id: string) => void;
};
export const ArtworkInformationContext = createContext<ReadingContext | null>(null);
export function useArtworkInformation() {
  const context = useContext(ArtworkInformationContext);
  if (!context) throw new Error("Artwork information needs the prototype reading context.");
  return context;
}

export const INFORMATION_COPY = {
  en: { title: "Technical information", materials: "Materials", format: "Format", size: "Size", medium: "Medium", date: "Date", save: "Save", saved: "Saved", unsave: "Remove from saved artists", follow: "Follow", following: "Following", unfollow: "Unfollow", dimensionsOrder: "height × width" },
  "pt-BR": { title: "Informações técnicas", materials: "Materiais", format: "Formato", size: "Dimensões", medium: "Tipo de obra", date: "Data", save: "Salvar", saved: "Salvo", unsave: "Remover dos artistas salvos", follow: "Seguir", following: "Seguindo", unfollow: "Deixar de seguir", dimensionsOrder: "altura × largura" },
  it: { title: "Informazioni tecniche", materials: "Materiali", format: "Formato", size: "Dimensioni", medium: "Tipo di opera", date: "Data", save: "Salva", saved: "Salvato", unsave: "Rimuovi dagli artisti salvati", follow: "Segui", following: "Seguito", unfollow: "Non seguire più", dimensionsOrder: "altezza × larghezza" },
  es: { title: "Información técnica", materials: "Materiales", format: "Formato", size: "Dimensiones", medium: "Tipo de obra", date: "Fecha", save: "Guardar", saved: "Guardado", unsave: "Quitar de artistas guardados", follow: "Seguir", following: "Siguiendo", unfollow: "Dejar de seguir", dimensionsOrder: "alto × ancho" },
} as const;

type InformationPiece = {
  id: string; creatorId: string; creator: string; creatorDates: string; year: string;
  place: string; form: string; medium: string; image: string; imagePosition?: string;
};

export function CreatorInformation({ piece, onOpenCreator, openCreatorLabel }: { piece: InformationPiece; onOpenCreator?: () => void; openCreatorLabel?: string }) {
  const { locale, followedCreators, toggleFollow } = useArtworkInformation();
  const biography = creatorBiographies[piece.creatorId]?.[locale];

  const labels = INFORMATION_COPY[locale];
  const following = followedCreators.has(piece.creatorId);
  return <CreatorBiography
    name={piece.creator} details={[editorialCreators[piece.creatorId]?.country ?? piece.place, piece.creatorDates].filter(Boolean).join(", ")} biography={biography ?? ""}
    image={piece.image} imagePosition={piece.imagePosition}
    followLabel={labels.save} followingLabel={labels.saved}
    followAriaLabel={following ? `${labels.saved} ${piece.creator}. ${labels.unsave}` : `${labels.save} ${piece.creator}`}
    following={following} onFollow={piece.creatorId.startsWith("unknown-") ? undefined : () => toggleFollow(piece.creatorId)}
    onOpenCreator={onOpenCreator} openCreatorLabel={openCreatorLabel}
  />;
}

export function ArtworkInformationSection({ piece, mediumLabel, onOpenCreator, openCreatorLabel }: { piece: InformationPiece; mediumLabel: string; onOpenCreator: () => void; openCreatorLabel: string }) {
  const { locale, units } = useArtworkInformation();
  const labels = INFORMATION_COPY[locale];
  const supplement = editorialWorks[piece.id];
  const dimensions = supplement?.dimensions ?? technicalDimensions[piece.id];
  const filmFormat = { en: "Silent film", "pt-BR": "Filme mudo", it: "Film muto", es: "Película muda" }[locale];
  const items: { label: string; value: string }[] = piece.medium ? [{ label: ["Literature", "Film", "Music"].includes(piece.form) ? labels.format : labels.materials, value: piece.id === "caligari" ? filmFormat : piece.medium }] : [];
  if (dimensions) {
    items.push({ label: dimensions.widthCm === undefined ? DETAIL_LABELS[locale].height : labels.size, value: formatPhysicalDimensions(dimensions, units, locale) });
  }
  if (piece.year && piece.form !== "Literature") items.push({ label: labels.date, value: piece.year });
  for (const detail of supplement?.details ?? []) items.push({ label: DETAIL_LABELS[locale][detail.label], value: detail.value });
  items.push({ label: labels.medium, value: mediumLabel });
  return <div className="artwork-information-section">
    <TechnicalInformation title={labels.title} items={items} />
    <CreatorInformation piece={piece} onOpenCreator={onOpenCreator} openCreatorLabel={openCreatorLabel} />
  </div>;
}
