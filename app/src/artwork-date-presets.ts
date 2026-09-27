type Locale = "en" | "pt-BR" | "it" | "es";
export type ArtworkDatePreset = { value: string; label: string; yearFrom?: string; yearTo?: string };
const ROMAN = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII", "XIII", "XIV", "XV", "XVI", "XVII", "XVIII", "XIX"];
const COPY = {
  en: { any: "Any time", custom: "Custom range", decade: (year: number) => `${year}s`, century: (century: number) => `${century}${century === 1 ? "st" : century === 2 ? "nd" : century === 3 ? "rd" : "th"} century` },
  "pt-BR": { any: "Qualquer época", custom: "Intervalo personalizado", decade: (year: number) => `Década de ${year}`, century: (century: number) => `Século ${ROMAN[century - 1]}` },
  it: { any: "Qualsiasi periodo", custom: "Intervallo personalizzato", decade: (year: number) => `Anni ${year}`, century: (century: number) => `${ROMAN[century - 1]} secolo` },
  es: { any: "Cualquier época", custom: "Intervalo personalizado", decade: (year: number) => `Década de ${year}`, century: (century: number) => `Siglo ${ROMAN[century - 1]}` },
};

/** Modern decades plus calendar centuries cover Taste's artwork dates without parsing display copy. */
export function getArtworkDatePresets(locale: Locale = "en"): ArtworkDatePreset[] {
  const copy = COPY[locale];
  return [
    { value: "any", label: copy.any, yearFrom: "", yearTo: "" },
    { value: "custom", label: copy.custom },
    ...Array.from({ length: 13 }, (_, index) => {
      const year = 2020 - index * 10;
      return { value: `decade-${year}`, label: copy.decade(year), yearFrom: String(year), yearTo: String(year + 9) };
    }),
    ...Array.from({ length: 19 }, (_, index) => {
      const century = 19 - index;
      return { value: `century-${century}`, label: copy.century(century), yearFrom: String((century - 1) * 100 + 1), yearTo: String(century * 100) };
    }),
  ];
}

export function getArtworkDatePresetValue({ yearFrom, yearTo }: { yearFrom: string; yearTo: string }): string {
  return getArtworkDatePresets().find(preset => preset.yearFrom === yearFrom.trim() && preset.yearTo === yearTo.trim())?.value ?? "custom";
}
