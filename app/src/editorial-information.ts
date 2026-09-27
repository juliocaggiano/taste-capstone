import data from "./editorial-information.json";

export type EditorialDetailKey = "collection" | "location" | "measurementNote" | "catalogue" | "premiere" | "text" | "songwriter" | "label" | "language" | "music" | "lyrics" | "recorded" | "firstPublished" | "runtime" | "screenplay" | "cinematography" | "score" | "jazz" | "adaptedFrom";
export type PhysicalDimensions = { heightCm: number; widthCm?: number; heightInches?: number; widthInches?: number; source?: string };
export const editorialWorks: Record<string, { medium: string; dimensions?: PhysicalDimensions; details: { label: EditorialDetailKey; value: string }[]; sources: string[] }> = data.works as Record<string, { medium: string; dimensions?: PhysicalDimensions; details: { label: EditorialDetailKey; value: string }[]; sources: string[] }>;
export const editorialCreators: Record<string, { country: string; dates: string; biography: string; sources: string[] }> = data.creators;
export const DETAIL_LABELS = {
  en: { height: "Height", collection: "Collection", location: "Location", measurementNote: "Measurement", catalogue: "Work", premiere: "First performance", text: "Text", songwriter: "Words and music", label: "Record label", language: "Original language", music: "Music", lyrics: "Lyrics", recorded: "Recorded", firstPublished: "First published", runtime: "Running time", screenplay: "Screenplay", cinematography: "Cinematography", score: "Score", jazz: "Jazz music", adaptedFrom: "Adapted from" },
  "pt-BR": { height: "Altura", collection: "Acervo", location: "Local", measurementNote: "Medida", catalogue: "Obra", premiere: "Primeira apresentação", text: "Texto", songwriter: "Letra e música", label: "Gravadora", language: "Idioma original", music: "Música", lyrics: "Letra", recorded: "Gravação", firstPublished: "Primeira publicação", runtime: "Duração", screenplay: "Roteiro", cinematography: "Fotografia", score: "Trilha sonora", jazz: "Música de jazz", adaptedFrom: "Adaptação de" },
  it: { height: "Altezza", collection: "Collezione", location: "Luogo", measurementNote: "Misura", catalogue: "Opera", premiere: "Prima esecuzione", text: "Testo", songwriter: "Testo e musica", label: "Etichetta", language: "Lingua originale", music: "Musica", lyrics: "Testo", recorded: "Registrazione", firstPublished: "Prima pubblicazione", runtime: "Durata", screenplay: "Sceneggiatura", cinematography: "Fotografia", score: "Colonna sonora", jazz: "Musica jazz", adaptedFrom: "Tratto da" },
  es: { height: "Altura", collection: "Colección", location: "Ubicación", measurementNote: "Medida", catalogue: "Obra", premiere: "Primera interpretación", text: "Texto", songwriter: "Letra y música", label: "Discográfica", language: "Idioma original", music: "Música", lyrics: "Letra", recorded: "Grabación", firstPublished: "Primera publicación", runtime: "Duración", screenplay: "Guion", cinematography: "Fotografía", score: "Banda sonora", jazz: "Música de jazz", adaptedFrom: "Adaptado de" },
} as const;

export function formatPhysicalDimensions(dimensions: PhysicalDimensions, units: "metric" | "imperial", locale: string) {
  const format = new Intl.NumberFormat(locale, { maximumFractionDigits: units === "imperial" ? 2 : 1 });
  const values = [units === "imperial" ? dimensions.heightInches ?? dimensions.heightCm / 2.54 : dimensions.heightCm];
  if (dimensions.widthCm !== undefined) values.push(units === "imperial" ? dimensions.widthInches ?? dimensions.widthCm / 2.54 : dimensions.widthCm);
  const approximate = units === "imperial" && (dimensions.heightInches === undefined || (dimensions.widthCm !== undefined && dimensions.widthInches === undefined));
  return `${approximate ? "≈ " : ""}${values.map(value => format.format(value)).join(" × ")} ${units === "imperial" ? "in" : "cm"}`;
}
