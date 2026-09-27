import { useEffect, useId, useLayoutEffect, useMemo, useRef, useState, type FocusEvent, type FormEvent } from "react";
import { BottomSheet, KeyboardInput, useKeyboard, useKeyboardInsets, useMobileDevice } from "./mobile";
import { MorphingSelect } from "./design-system/MorphingSelect";
import { SelectionPill } from "./design-system/SelectionPill";
import { CaretDown } from "./design-system/PrototypeIcons";
import { SearchableArtworkFilter } from "./SearchableArtworkFilter";
import { getArtworkDatePresets, getArtworkDatePresetValue } from "./artwork-date-presets";
import { createEmptyArtworkFilters, getArtworkFilterOptions, validateArtworkYearRange, type ArtworkFilterRecord, type ArtworkFilters, type GallerySort } from "./artwork-filters";
import "./artwork-filter-sheet.css";

export type ArtworkFilterLocale = "en" | "pt-BR" | "it" | "es";
export type ArtworkFilterLabels = { title: string; sortBy: string; medium: string; reset: string; done: string };

const COPY = {
  en: { artist: "Artist", allArtists: "All artists", country: "Country", allCountries: "All countries", searchArtists: "Search artists", searchCountries: "Search countries", noArtists: "No artists found", noCountries: "No countries found", clear: "Clear search", back: "Back to filters", date: "Artwork date", from: "From year", to: "To year", anyYear: "Any year", invalid: "Enter a year from 1 to 9999.", reversed: "The end year must be the same as or after the start year.", oldest: "Oldest first", newest: "Newest first", show: "Show", all: "All artworks", saved: "Saved artworks" },
  "pt-BR": { artist: "Artista", allArtists: "Todos os artistas", country: "País", allCountries: "Todos os países", searchArtists: "Buscar artistas", searchCountries: "Buscar países", noArtists: "Nenhum artista encontrado", noCountries: "Nenhum país encontrado", clear: "Limpar busca", back: "Voltar aos filtros", date: "Data da obra", from: "Do ano", to: "Até o ano", anyYear: "Qualquer ano", invalid: "Digite um ano de 1 a 9999.", reversed: "O ano final deve ser igual ou posterior ao ano inicial.", oldest: "Mais antigas primeiro", newest: "Mais recentes primeiro", show: "Mostrar", all: "Todas as obras", saved: "Obras salvas" },
  it: { artist: "Artista", allArtists: "Tutti gli artisti", country: "Paese", allCountries: "Tutti i paesi", searchArtists: "Cerca artisti", searchCountries: "Cerca paesi", noArtists: "Nessun artista trovato", noCountries: "Nessun paese trovato", clear: "Cancella ricerca", back: "Torna ai filtri", date: "Data dell’opera", from: "Dall’anno", to: "All’anno", anyYear: "Qualsiasi anno", invalid: "Inserisci un anno da 1 a 9999.", reversed: "L’anno finale deve essere uguale o successivo a quello iniziale.", oldest: "Prima le più antiche", newest: "Prima le più recenti", show: "Mostra", all: "Tutte le opere", saved: "Opere salvate" },
  es: { artist: "Artista", allArtists: "Todos los artistas", country: "País", allCountries: "Todos los países", searchArtists: "Buscar artistas", searchCountries: "Buscar países", noArtists: "No se encontraron artistas", noCountries: "No se encontraron países", clear: "Borrar búsqueda", back: "Volver a los filtros", date: "Fecha de la obra", from: "Desde el año", to: "Hasta el año", anyYear: "Cualquier año", invalid: "Introduce un año del 1 al 9999.", reversed: "El año final debe ser igual o posterior al inicial.", oldest: "Más antiguas primero", newest: "Más recientes primero", show: "Mostrar", all: "Todas las obras", saved: "Obras guardadas" },
} as const;

export type ArtworkFilterSheetProps<Medium extends string> = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  locale: ArtworkFilterLocale;
  sort: GallerySort;
  onSort: (sort: GallerySort) => void;
  medium: Medium;
  onMedium: (medium: Medium) => void;
  allMedium: Medium;
  labels: ArtworkFilterLabels;
  sortOptions: readonly { value: GallerySort; label: string }[];
  mediumOptions: readonly { value: Medium; label: string }[];
  filters: ArtworkFilters;
  onFilters: (filters: ArtworkFilters) => void;
  artworks: readonly ArtworkFilterRecord[];
  savedOnly?: boolean;
  onSavedOnly?: (savedOnly: boolean) => void;
  savedOnlyLabel?: string;
  allWorksLabel?: string;
};

/** One draft filter form shared by every artwork gallery. Dismissal does not apply edits. */
export function ArtworkFilterSheet<Medium extends string>({ open, onOpenChange, locale, sort, onSort,
  medium, onMedium, allMedium, labels, sortOptions, mediumOptions, filters, onFilters, artworks,
  savedOnly = false, onSavedOnly, savedOnlyLabel, allWorksLabel }: ArtworkFilterSheetProps<Medium>) {
  const copy = COPY[locale];
  const id = useId();
  const keyboard = useKeyboard();
  const { device } = useMobileDevice();
  const { keyboardHeight, availableHeight, isKeyboardVisible } = useKeyboardInsets();
  const [draftFilters, setDraftFilters] = useState(filters);
  const [draftSort, setDraftSort] = useState(sort);
  const [draftMedium, setDraftMedium] = useState(medium);
  const [draftSavedOnly, setDraftSavedOnly] = useState(savedOnly);
  const [choosing, setChoosing] = useState<"artist" | "place" | null>(null);
  const [customPeriod, setCustomPeriod] = useState(false);
  const [portalContainer, setPortalContainer] = useState<HTMLFormElement | null>(null);
  const wasOpen = useRef(false);
  const pointerInside = useRef(false);
  const focusedInput = useRef<HTMLInputElement | null>(null);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const chooserTriggerRefs = useRef<Partial<Record<"artist" | "place", HTMLButtonElement | null>>>({});
  const options = useMemo(() => getArtworkFilterOptions(artworks, locale), [artworks, locale]);
  const error = validateArtworkYearRange(draftFilters);
  const errorMessage = error === "year" ? copy.invalid : error === "order" ? copy.reversed : "";
  const datePresets = useMemo(() => getArtworkDatePresets(locale), [locale]);
  const periodLabel = { en: "Time period", "pt-BR": "Período", it: "Periodo", es: "Período" }[locale];
  const sorts = [...sortOptions];
  if (!sorts.some(option => option.value === "oldest")) sorts.push({ value: "oldest", label: copy.oldest });
  if (!sorts.some(option => option.value === "newest")) sorts.push({ value: "newest", label: copy.newest });

  useLayoutEffect(() => {
    if (open && !wasOpen.current) {
      setDraftFilters({ ...filters }); setDraftSort(sort); setDraftMedium(medium); setDraftSavedOnly(savedOnly);
      setChoosing(null);
      setCustomPeriod(false);
      pointerInside.current = false; focusedInput.current = null;
    }
    wasOpen.current = open;
  }, [open, filters, sort, medium, savedOnly]);

  const visibleHeight = Math.min(device.geometry.screen.height * .89, availableHeight - device.geometry.safeArea.top - 8);
  const snap = (visibleHeight + Math.min(keyboardHeight, 180)) / device.geometry.screen.height;

  useEffect(() => {
    if (!open || !portalContainer) return;
    const dock = portalContainer.closest(".device-screen")?.querySelector(".keyboard-dock");
    if (!dock) return;
    // The protected keyboard is a sibling of the dialog. Its drag must dismiss only the keyboard.
    const keepSheetOpen = (event: Event) => event.preventDefault();
    dock.addEventListener("dismissableLayer.pointerDownOutside", keepSheetOpen, true);
    return () => dock.removeEventListener("dismissableLayer.pointerDownOutside", keepSheetOpen, true);
  }, [open, portalContainer]);

  useEffect(() => {
    if (!open || !isKeyboardVisible) return;
    const frame = requestAnimationFrame(() => {
      const input = focusedInput.current;
      const scroll = portalContainer?.closest<HTMLElement>(".sheet-content");
      if (!input || !scroll || document.activeElement !== input) return;
      const bounds = input.getBoundingClientRect(); const scrollBounds = scroll.getBoundingClientRect();
      const scale = scrollBounds.height > 0 ? scroll.clientHeight / scrollBounds.height : 1;
      const footerTop = portalContainer?.querySelector(".artwork-filter-footer")?.getBoundingClientRect().top ?? scrollBounds.bottom;
      const visibleBottom = Math.min(scrollBounds.bottom, footerTop);
      if (bounds.bottom > visibleBottom - 12) scroll.scrollTop += (bounds.bottom - visibleBottom + 12) * scale;
      else if (bounds.top < scrollBounds.top + 12) scroll.scrollTop -= (scrollBounds.top + 12 - bounds.top) * scale;
    });
    return () => cancelAnimationFrame(frame);
  }, [open, isKeyboardVisible, keyboardHeight, keyboard.focusedElement, portalContainer]);

  const close = () => { keyboard.hide(); onOpenChange(false); };
  const returnFromChooser = () => {
    const previous = choosing;
    keyboard.hide(); setChoosing(null);
    requestAnimationFrame(() => { if (previous) chooserTriggerRefs.current[previous]?.focus({ preventScroll: true }); });
  };
  const handleBlur = (event: FocusEvent<HTMLInputElement>) => {
    if (pointerInside.current || (event.relatedTarget instanceof Element && portalContainer?.contains(event.relatedTarget))) return;
    requestAnimationFrame(() => { if (!portalContainer?.contains(document.activeElement)) keyboard.hide(); });
  };
  const apply = (event: FormEvent) => {
    event.preventDefault();
    if (error) { inputRefs.current[0]?.focus({ preventScroll: true }); return; }
    onFilters({ ...draftFilters, yearFrom: draftFilters.yearFrom.trim(), yearTo: draftFilters.yearTo.trim() });
    onSort(draftSort); onMedium(draftMedium); onSavedOnly?.(draftSavedOnly); close();
  };

  return <BottomSheet open={open} onOpenChange={next => next ? onOpenChange(true) : close()} title={choosing === "artist" ? copy.artist : choosing === "place" ? copy.country : labels.title} snap={snap}>
    <form ref={setPortalContainer} className="artwork-filter-sheet" data-choosing={choosing ?? undefined} onSubmit={apply}
      onPointerDownCapture={() => { pointerInside.current = true; }}
      onPointerUpCapture={() => { setTimeout(() => { pointerInside.current = false; }, 0); }}
      onPointerCancelCapture={() => { pointerInside.current = false; }}
      onClickCapture={event => { if (event.target instanceof Element && event.target.closest('button[role="combobox"]')) keyboard.hide(); }}
      onKeyDownCapture={event => { if (["Enter", " ", "ArrowDown", "ArrowUp", "Home", "End"].includes(event.key) && event.target instanceof Element && event.target.closest('button[role="combobox"]')) keyboard.hide(); }}>
      {choosing ? <SearchableArtworkFilter key={choosing} label={choosing === "artist" ? copy.artist : copy.country}
        value={draftFilters[choosing]} options={choosing === "artist" ? options.artists : options.places}
        copy={{ search: choosing === "artist" ? copy.searchArtists : copy.searchCountries, clear: copy.clear, back: copy.back,
          all: choosing === "artist" ? copy.allArtists : copy.allCountries, empty: choosing === "artist" ? copy.noArtists : copy.noCountries }}
        onBack={returnFromChooser} onChange={value => { setDraftFilters(current => ({ ...current, [choosing]: value })); returnFromChooser(); }} /> : <>
      <div className="artwork-filter-fields">
        <div className="artwork-filter-field"><label htmlFor={`${id}-sort`}>{labels.sortBy}</label>
          <MorphingSelect id={`${id}-sort`} ariaLabel={labels.sortBy} value={draftSort} onChange={value => setDraftSort(value as GallerySort)} options={sorts} duration={220} portalContainer={portalContainer} /></div>
        <div className="artwork-filter-field"><label htmlFor={`${id}-medium`}>{labels.medium}</label>
          <MorphingSelect id={`${id}-medium`} ariaLabel={labels.medium} value={draftMedium} onChange={value => setDraftMedium(value as Medium)} options={mediumOptions} duration={220} portalContainer={portalContainer} /></div>
        <fieldset className="artwork-filter-dates"><legend>{copy.date}</legend>
          <div className="artwork-filter-period artwork-filter-field"><label htmlFor={`${id}-period`}>{periodLabel}</label>
            <MorphingSelect id={`${id}-period`} ariaLabel={periodLabel} value={customPeriod ? "custom" : getArtworkDatePresetValue(draftFilters)}
              onChange={value => {
                setCustomPeriod(value === "custom");
                const preset = datePresets.find(item => item.value === value);
                if (preset?.yearFrom !== undefined && preset.yearTo !== undefined) {
                  setDraftFilters(current => ({ ...current, yearFrom: preset.yearFrom!, yearTo: preset.yearTo! }));
                } else if (value === "custom") requestAnimationFrame(() => inputRefs.current[0]?.focus({ preventScroll: true }));
              }} options={datePresets} duration={220} portalContainer={portalContainer} />
          </div>
          <div className="artwork-filter-year-fields">{(["yearFrom", "yearTo"] as const).map((key, index) => <div className="artwork-filter-field" key={key}>
            <label htmlFor={`${id}-${key}`}>{index === 0 ? copy.from : copy.to}</label>
            <KeyboardInput ref={element => { inputRefs.current[index] = element; }} id={`${id}-${key}`} value={draftFilters[key]} inputMode="numeric" enterKeyHint={index === 0 ? "next" : "done"}
              autoComplete="off" maxLength={4} placeholder={copy.anyYear} aria-invalid={Boolean(error)} aria-describedby={error ? `${id}-date-error` : undefined}
              onChange={event => { const value = event.currentTarget.value; setCustomPeriod(false); setDraftFilters(current => ({ ...current, [key]: value })); }}
              onFocus={event => { focusedInput.current = event.currentTarget; }} onBlur={handleBlur}
              onKeyDown={event => { if (event.key === "Enter") { event.preventDefault(); if (index === 0) inputRefs.current[1]?.focus(); else keyboard.hide(); } }} />
          </div>)}</div>
          {error && <p id={`${id}-date-error`} className="artwork-filter-error" role="alert">{errorMessage}</p>}
        </fieldset>
        <div className="artwork-filter-field"><label htmlFor={`${id}-artist`}>{copy.artist}</label>
          <button ref={element => { chooserTriggerRefs.current.artist = element; }} id={`${id}-artist`} type="button" className="artwork-filter-chooser-trigger"
            aria-label={`${copy.artist}: ${draftFilters.artist || copy.allArtists}`} onClick={() => { keyboard.hide(); setChoosing("artist"); }}>
            <span>{draftFilters.artist || copy.allArtists}</span><CaretDown size={14} aria-hidden="true" /></button></div>
        <div className="artwork-filter-field"><label htmlFor={`${id}-place`}>{copy.country}</label>
          <button ref={element => { chooserTriggerRefs.current.place = element; }} id={`${id}-place`} type="button" className="artwork-filter-chooser-trigger"
            aria-label={`${copy.country}: ${draftFilters.place || copy.allCountries}`} onClick={() => { keyboard.hide(); setChoosing("place"); }}>
            <span>{draftFilters.place || copy.allCountries}</span><CaretDown size={14} aria-hidden="true" /></button></div>
        {onSavedOnly && <div className="artwork-filter-field"><span>{copy.show}</span>
          <SelectionPill ariaLabel={copy.show} value={draftSavedOnly ? "saved" : "all"} onChange={value => { keyboard.hide(); setDraftSavedOnly(value === "saved"); }}
            options={[{ value: "all", label: allWorksLabel ?? copy.all }, { value: "saved", label: savedOnlyLabel ?? copy.saved }]} /></div>}
      </div>
      <div className="artwork-filter-footer">
        <button type="button" onClick={() => { keyboard.hide(); setDraftSort("featured"); setDraftMedium(allMedium); setDraftFilters(createEmptyArtworkFilters()); setDraftSavedOnly(false); setCustomPeriod(false); }}>{labels.reset}</button>
        <button type="submit" disabled={Boolean(error)}>{labels.done}</button>
      </div>
      </>}
    </form>
  </BottomSheet>;
}
