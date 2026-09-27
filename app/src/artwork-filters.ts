export type GallerySort = "featured" | "ascending" | "descending" | "oldest" | "newest";

export type ArtworkFilters = {
  yearFrom: string;
  yearTo: string;
  artist: string;
  place: string;
};

export type ArtworkFilterRecord = {
  title: string;
  creator: string;
  place?: string;
  dateStart?: number;
  dateEnd?: number;
};

export function createEmptyArtworkFilters(): ArtworkFilters {
  return { yearFrom: "", yearTo: "", artist: "", place: "" };
}

export function hasArtworkFilters(filters: ArtworkFilters): boolean {
  return Object.values(filters).some(value => value.trim() !== "");
}

/** Blank bounds remain open. A repeated year selects that year alone. */
export function validateArtworkYearRange(filters: Pick<ArtworkFilters, "yearFrom" | "yearTo">): "year" | "order" | null {
  const { yearFrom, yearTo } = filters;
  const valid = (value: string) => !value.trim() || (/^\d{1,4}$/.test(value.trim()) && Number(value) >= 1 && Number(value) <= 9999);
  if (!valid(yearFrom) || !valid(yearTo)) return "year";
  if (yearFrom.trim() && yearTo.trim() && Number(yearFrom) > Number(yearTo)) return "order";
  return null;
}

function artworkDateRange(work: ArtworkFilterRecord): [number, number] | null {
  const start = Number.isFinite(work.dateStart) ? work.dateStart : undefined;
  const end = Number.isFinite(work.dateEnd) ? work.dateEnd : undefined;
  if (start === undefined && end === undefined) return null;
  return [Math.min(start ?? end!, end ?? start!), Math.max(start ?? end!, end ?? start!)];
}

/** Date metadata stays separate from localized display dates; recorded periods overlap inclusively. */
export function filterAndSortArtworks<T extends ArtworkFilterRecord>(
  works: readonly T[], sort: GallerySort, filters: ArtworkFilters, locale: string,
): T[] {
  if (validateArtworkYearRange(filters)) return [];
  const from = filters.yearFrom.trim() ? Number(filters.yearFrom) : -Infinity;
  const to = filters.yearTo.trim() ? Number(filters.yearTo) : Infinity;
  const dateConstrained = Number.isFinite(from) || Number.isFinite(to);
  const filtered = works.filter(work => {
    if (filters.artist && work.creator !== filters.artist) return false;
    if (filters.place && work.place !== filters.place) return false;
    if (!dateConstrained) return true;
    const range = artworkDateRange(work);
    return range !== null && range[0] <= to && range[1] >= from;
  });
  if (sort === "featured") return filtered;
  return filtered.sort((left, right) => {
    if (sort === "ascending" || sort === "descending") {
      return left.title.localeCompare(right.title, locale, { sensitivity: "base" }) * (sort === "ascending" ? 1 : -1);
    }
    const leftDate = artworkDateRange(left);
    const rightDate = artworkDateRange(right);
    if (leftDate === null) return rightDate === null ? 0 : 1;
    if (rightDate === null) return -1;
    return sort === "oldest" ? leftDate[0] - rightDate[0] : rightDate[0] - leftDate[0];
  });
}

export function getArtworkFilterOptions(works: readonly ArtworkFilterRecord[], locale = "en") {
  const options = (values: (string | undefined)[]) => [...new Set(values.filter((value): value is string => Boolean(value?.trim())))]
    .sort((left, right) => left.localeCompare(right, locale, { sensitivity: "base" }))
    .map(value => ({ value, label: value }));
  return { artists: options(works.map(work => work.creator)), places: options(works.map(work => work.place)) };
}
