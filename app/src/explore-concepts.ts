import type { ReactNode } from "react";

export type ExploreConceptLocale = "en" | "pt-BR" | "it" | "es";
export type ExploreConceptArtwork = { id: string; title: string; creator: string; image: string; imagePosition?: string; year: string; form: string };
export type ExploreConceptCollection = { id: string; title: string; description: string; image: string; pieceIds: readonly string[] };
export type ExploreConceptProps = {
  artworks: readonly ExploreConceptArtwork[];
  collections: readonly ExploreConceptCollection[];
  locale: ExploreConceptLocale;
  gallery: ReactNode;
  onOpenPiece: (id: string) => void;
  onOpenCollection: (id: string) => void;
};

export function collectionArtworks(collection: ExploreConceptCollection, artworks: readonly ExploreConceptArtwork[]) {
  return collection.pieceIds.flatMap(id => { const work = artworks.find(item => item.id === id); return work ? [work] : []; });
}
