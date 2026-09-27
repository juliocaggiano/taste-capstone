import { useEffect, useRef, useState } from "react";
import { CaretDown, GridFour, List } from "./design-system/PrototypeIcons";
import { ArtworkFilterSheet, type ArtworkFilterLocale } from "./ArtworkFilterSheet";
import { hasArtworkFilters, type ArtworkFilterRecord, type ArtworkFilters, type GallerySort } from "./artwork-filters";
import { useKeyboard } from "./mobile";

export type { GallerySort } from "./artwork-filters";
export type GalleryLayout = "grid" | "list";

export type GalleryControlsProps<Medium extends string> = {
  locale: ArtworkFilterLocale;
  filters: ArtworkFilters;
  onFilters: (filters: ArtworkFilters) => void;
  artworks: readonly ArtworkFilterRecord[];
  layout: GalleryLayout;
  onLayout: (layout: GalleryLayout) => void;
  sort: GallerySort;
  onSort: (sort: GallerySort) => void;
  medium: Medium;
  onMedium: (medium: Medium) => void;
  allMedium: Medium;
  allowFilters?: boolean;
  labels: {
    group: string;
    trigger: string;
    active: string;
    grid: string;
    list: string;
    title: string;
    sortBy: string;
    medium: string;
    reset: string;
    done: string;
  };
  sortOptions: readonly { value: GallerySort; label: string }[];
  mediumOptions: readonly { value: Medium; label: string }[];
};

/** Shared gallery actions; each page retains its own layout, sorting, and medium. */
export function GalleryControls<Medium extends string>({
  layout, onLayout, sort, onSort, medium, onMedium, allMedium,
  allowFilters = true, labels, sortOptions, mediumOptions, locale, filters, onFilters, artworks,
}: GalleryControlsProps<Medium>) {
  const [filtersOpen, setFiltersOpen] = useState(false);
  const sortButtonRef = useRef<HTMLButtonElement>(null);
  const returnFilterFocus = useRef(false);
  const keyboard = useKeyboard();
  const active = sort !== "featured" || medium !== allMedium || hasArtworkFilters(filters);

  useEffect(() => {
    if (filtersOpen || !returnFilterFocus.current) return;
    const screen = sortButtonRef.current?.closest(".device-screen");
    let frame = 0;
    const restore = () => {
      if (screen?.querySelector(".bottom-sheet")) {
        frame = requestAnimationFrame(restore);
        return;
      }
      returnFilterFocus.current = false;
      sortButtonRef.current?.focus({ preventScroll: true });
    };
    frame = requestAnimationFrame(restore);
    return () => cancelAnimationFrame(frame);
  }, [filtersOpen]);

  function openFilters() {
    keyboard.hide();
    setFiltersOpen(true);
  }

  function closeFilters() {
    returnFilterFocus.current = true;
    setFiltersOpen(false);
  }

  return <>
    <div className="discover-gallery-actions" role="group" aria-label={labels.group}>
      {allowFilters && <button
        ref={sortButtonRef}
        type="button"
        className="discover-sort-filter"
        aria-label={labels.trigger}
        title={labels.title}
        aria-description={active ? labels.active : undefined}
        aria-haspopup="dialog"
        aria-expanded={filtersOpen}
        data-active={active}
        onClick={openFilters}
      >
        <span className="discover-sort-filter-label">{labels.trigger}</span>
        <CaretDown className="discover-sort-filter-chevron" size={10} aria-hidden="true" />
      </button>}
      <button type="button" aria-label={labels.grid} aria-pressed={layout === "grid"} onClick={() => onLayout("grid")}>
        <GridFour size={12} />
      </button>
      <button type="button" aria-label={labels.list} aria-pressed={layout === "list"} onClick={() => onLayout("list")}>
        <List size={12} />
      </button>
    </div>
    <ArtworkFilterSheet open={filtersOpen} onOpenChange={open => open ? openFilters() : closeFilters()}
      locale={locale} labels={labels} sort={sort} onSort={onSort} medium={medium} onMedium={onMedium} allMedium={allMedium}
      sortOptions={sortOptions} mediumOptions={mediumOptions} filters={filters} onFilters={onFilters} artworks={artworks} />
  </>;
}
