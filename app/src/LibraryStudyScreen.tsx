import { useId, useLayoutEffect, useMemo, useRef, useState, type KeyboardEvent } from "react";
import { ArtworkListRow } from "./ArtworkListRow";
import { createEmptyArtworkFilters, filterAndSortArtworks } from "./artwork-filters";
import { GalleryControls, type GalleryControlsProps, type GalleryLayout, type GallerySort } from "./GalleryControls";
import { NewFolderSheet } from "./NewFolderSheet";
import { MorphingSelect } from "./design-system/MorphingSelect";
import { CaretLeft, GridFour, MagnifyingGlass, Plus, X } from "./design-system/PrototypeIcons";
import { Carousel, KeyboardInput, MobileScroll, useKeyboard } from "./mobile";
import { DEFAULT_BOARD_ID, type BoardOptions, type SavedBoard } from "./today-boards";
import "./library-study.css";

export type LibraryStudyVariant = "compact" | "switcher" | "overview";
export type LibraryStudyFormId = "Sculpture" | "Music" | "Architecture" | "Literature" | "Drawing" | "Print" | "Performance" | "Object" | "Photography" | "Film" | "Painting";
type Locale = "en" | "pt-BR" | "it" | "es";
type Section = "pieces" | "folders";
export type LibraryStudyArtwork<Id extends string = string> = {
  id: Id; title: string; creator: string; year: string; image: string; imagePosition?: string; form: LibraryStudyFormId; place?: string; dateStart?: number; dateEnd?: number;
};
export type LibraryStudyScreenProps<Id extends string = string> = {
  variant?: LibraryStudyVariant | null;
  pieces: readonly LibraryStudyArtwork<Id>[];
  favourites: ReadonlySet<Id>;
  boards: SavedBoard<Id>[];
  locale: Locale;
  onOpenPiece: (id: Id) => void;
  onCreateFolder: (name: string, options?: BoardOptions<Id>) => string;
  galleryCopy: Pick<GalleryControlsProps<"all" | LibraryStudyFormId>, "labels" | "sortOptions" | "mediumOptions">;
};

const COPY = {
  en: { library: "Library", pieces: "Artworks", folders: "Folders", newFolder: "New folder", defaultFolder: "My folder", back: "Back to folders", sections: "Library sections", noWorks: "No artworks yet", emptyLibrary: "Save a work to add it to your library.", emptyFolder: "Save artworks to this folder to see them here.", noMatches: "No matching artworks", filterHint: "Try another filter or reset your filters.", noFolders: "No folders yet", folderHint: "Create a folder to keep your saved artworks together.", artwork: "artwork", artworks: "artworks" },
  "pt-BR": { library: "Biblioteca", pieces: "Obras", folders: "Pastas", newFolder: "Nova pasta", defaultFolder: "Minha pasta", back: "Voltar às pastas", sections: "Seções da biblioteca", noWorks: "Nenhuma obra ainda", emptyLibrary: "Salve uma obra para adicioná-la à biblioteca.", emptyFolder: "Salve obras nesta pasta para vê-las aqui.", noMatches: "Nenhuma obra corresponde", filterHint: "Tente outro filtro ou redefina os filtros.", noFolders: "Nenhuma pasta ainda", folderHint: "Crie uma pasta para organizar suas obras salvas.", artwork: "obra", artworks: "obras" },
  it: { library: "Biblioteca", pieces: "Opere", folders: "Cartelle", newFolder: "Nuova cartella", defaultFolder: "La mia cartella", back: "Torna alle cartelle", sections: "Sezioni della biblioteca", noWorks: "Ancora nessuna opera", emptyLibrary: "Salva un’opera per aggiungerla alla biblioteca.", emptyFolder: "Salva opere in questa cartella per vederle qui.", noMatches: "Nessuna opera corrispondente", filterHint: "Prova un altro filtro o reimposta i filtri.", noFolders: "Ancora nessuna cartella", folderHint: "Crea una cartella per organizzare le opere salvate.", artwork: "opera", artworks: "opere" },
  es: { library: "Biblioteca", pieces: "Obras", folders: "Carpetas", newFolder: "Nueva carpeta", defaultFolder: "Mi carpeta", back: "Volver a las carpetas", sections: "Secciones de la biblioteca", noWorks: "Aún no hay obras", emptyLibrary: "Guarda una obra para añadirla a tu biblioteca.", emptyFolder: "Guarda obras en esta carpeta para verlas aquí.", noMatches: "Ninguna obra coincide", filterHint: "Prueba otro filtro o restablece los filtros.", noFolders: "Aún no hay carpetas", folderHint: "Crea una carpeta para organizar tus obras guardadas.", artwork: "obra", artworks: "obras" },
} as const;

const SEARCH_COPY = {
  en: { placeholder: "Search saved artworks", clear: "Clear search", close: "Close search", empty: "Try another search or filter." },
  "pt-BR": { placeholder: "Buscar obras salvas", clear: "Limpar busca", close: "Fechar busca", empty: "Tente outra busca ou filtro." },
  it: { placeholder: "Cerca nelle opere salvate", clear: "Cancella ricerca", close: "Chiudi ricerca", empty: "Prova un'altra ricerca o un altro filtro." },
  es: { placeholder: "Buscar obras guardadas", clear: "Borrar búsqueda", close: "Cerrar búsqueda", empty: "Prueba otra búsqueda u otro filtro." },
} as const;

function normalizeLibrarySearch(value: string) {
  return value.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();
}

/** Selected Library overview, with explicit comparison variants. Data remains owned by the parent. */
export function LibraryScreen<Id extends string>({ variant: studyVariant, pieces, favourites, boards, locale, onOpenPiece, onCreateFolder, galleryCopy }: LibraryStudyScreenProps<Id>) {
  const variant = studyVariant ?? "overview";
  const copy = COPY[locale];
  const searchCopy = SEARCH_COPY[locale];
  const uid = useId().replaceAll(":", "");
  const keyboard = useKeyboard();
  const pageRef = useRef<HTMLElement>(null);
  const backRef = useRef<HTMLButtonElement>(null);
  const newFolderRef = useRef<HTMLButtonElement>(null);
  const searchButtonRef = useRef<HTMLButtonElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const tabRefs = useRef<Partial<Record<Section, HTMLButtonElement | null>>>({});
  const pendingNavigation = useRef<"folder" | "return" | "section" | null>(null);
  const folderReturn = useRef({ id: "", scrollTop: 0, railLeft: 0 });
  const [section, setSection] = useState<Section>("pieces");
  const [folderId, setFolderId] = useState<string | null>(null);
  const [lastFolderId, setLastFolderId] = useState<string | null>(null);
  const [newFolderOpen, setNewFolderOpen] = useState(false);
  const [layout, setLayout] = useState<GalleryLayout>("grid");
  const [sort, setSort] = useState<GallerySort>("featured");
  const [filters, setFilters] = useState(createEmptyArtworkFilters);
  const [medium, setMedium] = useState<"all" | LibraryStudyFormId>("all");
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const saved = useMemo(() => pieces.filter(piece => favourites.has(piece.id)), [pieces, favourites]);
  const selectedFolder = boards.find(board => board.id === folderId);
  const folderDetail = Boolean(selectedFolder);
  const folderIndex = !folderDetail && variant !== "overview" && section === "folders";
  const folderName = (board: SavedBoard<Id>) => board.id === DEFAULT_BOARD_ID ? copy.defaultFolder : board.name;
  const folderWorks = (board: SavedBoard<Id>) => saved.filter(piece => board.pieceIds.includes(piece.id));
  const contextWorks = selectedFolder ? folderWorks(selectedFolder) : saved;
  const searchTerms = !studyVariant && !folderDetail ? normalizeLibrarySearch(query).trim().split(/\s+/).filter(Boolean) : [];
  const visibleWorks = filterAndSortArtworks(contextWorks.filter(piece => {
    if (medium !== "all" && piece.form !== medium) return false;
    if (!searchTerms.length) return true;
    const formLabel = galleryCopy.mediumOptions.find(option => option.value === piece.form)?.label ?? piece.form;
    const searchable = normalizeLibrarySearch(`${piece.title} ${piece.creator} ${piece.year} ${piece.form} ${formLabel} ${piece.place ?? ""}`);
    return searchTerms.every(term => searchable.includes(term));
  }), sort, filters, locale);
  const count = (value: number) => new Intl.NumberFormat(locale).format(value);
  const workCount = (value: number) => `${count(value)} ${value === 1 ? copy.artwork : copy.artworks}`;

  function resetFilters() { setSort("featured"); setMedium("all"); setFilters(createEmptyArtworkFilters()); setQuery(""); }
  function openSearch() {
    setSearchOpen(true);
    window.requestAnimationFrame(() => searchInputRef.current?.focus({ preventScroll: true }));
  }
  function closeSearch() {
    keyboard.hide();
    setQuery("");
    setSearchOpen(false);
    window.requestAnimationFrame(() => searchButtonRef.current?.focus({ preventScroll: true }));
  }
  function chooseSection(next: Section) {
    keyboard.hide();
    setFolderId(null);
    resetFilters();
    pendingNavigation.current = "section";
    setSection(next);
  }
  function openFolder(id: string) {
    const scroll = pageRef.current?.closest<HTMLElement>(".mobile-scroll");
    folderReturn.current = { id, scrollTop: scroll?.scrollTop ?? 0, railLeft: pageRef.current?.querySelector<HTMLElement>(".library-study-folder-rail")?.scrollLeft ?? 0 };
    keyboard.hide();
    resetFilters();
    setSearchOpen(false);
    setLastFolderId(id);
    pendingNavigation.current = "folder";
    setFolderId(id);
  }
  function backToFolders() {
    keyboard.hide();
    resetFilters();
    pendingNavigation.current = "return";
    setFolderId(null);
  }

  useLayoutEffect(() => {
    if (!pendingNavigation.current) return;
    let frame = 0;
    const restore = () => {
      const page = pageRef.current;
      if (!page) return;
      // Folder creation closes an animated sheet before focusing the new folder's Back control.
      if (page.closest(".device-screen")?.querySelector(".bottom-sheet")) {
        frame = requestAnimationFrame(restore);
        return;
      }
      const direction = pendingNavigation.current;
      pendingNavigation.current = null;
      const scroll = page.closest<HTMLElement>(".mobile-scroll");
      if (scroll) scroll.scrollTop = direction === "return" ? folderReturn.current.scrollTop : 0;
      if (direction === "folder") backRef.current?.focus({ preventScroll: true });
      if (direction === "return") {
        const rail = page.querySelector<HTMLElement>(".library-study-folder-rail");
        if (rail) rail.scrollLeft = folderReturn.current.railLeft;
        const source = Array.from(page.querySelectorAll<HTMLButtonElement>("[data-library-folder-id]"))
          .find(button => button.dataset.libraryFolderId === folderReturn.current.id);
        (source ?? newFolderRef.current)?.focus({ preventScroll: true });
      }
    };
    frame = requestAnimationFrame(restore);
    return () => cancelAnimationFrame(frame);
  }, [folderId, section, boards]);

  function tabKey(event: KeyboardEvent<HTMLButtonElement>, current: Section) {
    const next = event.key === "Home" || event.key === "ArrowLeft" ? "pieces"
      : event.key === "End" || event.key === "ArrowRight" ? "folders" : null;
    if (!next) return;
    event.preventDefault();
    if (next !== current) chooseSection(next);
    tabRefs.current[next]?.focus({ preventScroll: true });
  }

  const controls = <GalleryControls {...galleryCopy} layout={layout} onLayout={setLayout} sort={sort} onSort={setSort}
    medium={medium} onMedium={setMedium} allMedium="all" locale={locale} filters={filters} onFilters={setFilters} artworks={contextWorks} />;
  const newFolderButton = <button ref={newFolderRef} type="button" className="library-study-new-folder" onClick={() => setNewFolderOpen(true)}>
    <Plus size={12} aria-hidden="true" /><span>{copy.newFolder}</span>
  </button>;
  const folderCard = (board: SavedBoard<Id>) => {
    const works = folderWorks(board);
    const cover = pieces.find(piece => piece.id === board.coverPieceId) ?? works[0];
    return <button key={board.id} type="button" className="library-study-folder-card" data-library-folder-id={board.id}
      data-selected={lastFolderId === board.id} onClick={() => openFolder(board.id)}>
      <span className="library-study-folder-cover">{cover ? <img src={cover.image} alt="" draggable={false} loading="lazy" style={{ objectPosition: cover.imagePosition ?? "center" }} /> : <GridFour size={24} aria-hidden="true" />}</span>
      <span className="library-study-folder-copy"><strong>{folderName(board)}</strong><span>{workCount(works.length)}</span></span>
    </button>;
  };
  const artworks = visibleWorks.length ? <div className="library-work-grid" data-layout={layout}>
    {visibleWorks.map(piece => layout === "list"
      ? <ArtworkListRow key={piece.id} artwork={piece} className="library-work-card" onOpen={onOpenPiece} />
      : <button key={piece.id} type="button" className="library-work-card" data-piece-id={piece.id} onClick={() => onOpenPiece(piece.id)}>
        <span className="library-work-image"><img src={piece.image} alt="" draggable={false} loading="lazy" style={{ objectPosition: piece.imagePosition ?? "center" }} /></span>
        <span className="library-work-copy"><strong>{piece.title}</strong><span>{piece.creator}</span></span>
      </button>)}
  </div> : <div className="library-study-empty">
    <h2>{contextWorks.length ? copy.noMatches : copy.noWorks}</h2>
    <p>{contextWorks.length ? query.trim() && !folderDetail ? searchCopy.empty : copy.filterHint : folderDetail ? copy.emptyFolder : copy.emptyLibrary}</p>
    {contextWorks.length > 0 && <button type="button" className="library-reset-filters" onClick={resetFilters}>{galleryCopy.labels.reset}</button>}
  </div>;

  return <>
    <MobileScroll className="app-scroll library-study-scroll">
      <main ref={pageRef} className="page favourites-page library-study-page" data-library-study={studyVariant ?? undefined} data-library-variant={variant}
        data-library-section={folderIndex ? "folders" : "pieces"} data-folder-open={folderId ?? undefined}
        data-library-searching={query.trim() ? "true" : undefined} aria-label={copy.library}
        onKeyDown={event => {
          if (event.key !== "Escape" || event.defaultPrevented || !folderDetail || newFolderOpen) return;
          if (pageRef.current?.closest(".device-screen")?.querySelector(".bottom-sheet")) return;
          event.preventDefault(); event.stopPropagation(); backToFolders();
        }}>
        {folderDetail && selectedFolder ? <section className="library-study-panel" key={`folder-${folderId}`}>
          <div className="library-study-folder-navigation">
            <button ref={backRef} type="button" className="library-study-back" onClick={backToFolders} aria-label={copy.back}><CaretLeft size={14} aria-hidden="true" /></button>
          </div>
          <header className="library-study-toolbar library-study-folder-heading">
            <div className="library-study-folder-heading-copy">
              <div><h1>{folderName(selectedFolder)}</h1><span>{workCount(contextWorks.length)}</span></div>
            </div>
            {controls}
          </header>
          {artworks}
        </section> : <>
          {variant === "overview" ? <>
            <header className="library-study-toolbar library-study-overview-heading"><h1>{copy.library}</h1>
              {!studyVariant ? <div className="library-study-heading-actions">
                <button ref={searchButtonRef} type="button" className="library-study-search-button" aria-label={searchOpen ? searchCopy.close : searchCopy.placeholder}
                  aria-expanded={searchOpen} aria-controls={searchOpen ? `${uid}-search` : undefined} onClick={searchOpen ? closeSearch : openSearch}>
                  <MagnifyingGlass size={16} aria-hidden="true" />
                </button>{newFolderButton}
              </div> : newFolderButton}
            </header>
            {!studyVariant && searchOpen && <div id={`${uid}-search`} className="library-study-search-field">
              <MagnifyingGlass size={16} aria-hidden="true" />
              <KeyboardInput ref={searchInputRef} type="search" aria-label={searchCopy.placeholder} placeholder={searchCopy.placeholder} value={query}
                onChange={event => setQuery(event.target.value)} onBlur={() => keyboard.hide()}
                onKeyDown={event => {
                  if (event.key === "Escape") { event.preventDefault(); closeSearch(); }
                  if (event.key === "Enter") { event.preventDefault(); keyboard.hide(); pageRef.current?.querySelector<HTMLButtonElement>(".library-work-card")?.focus({ preventScroll: true }); }
                }} />
              <button type="button" aria-label={query ? searchCopy.clear : searchCopy.close}
                onClick={() => { if (query) { setQuery(""); searchInputRef.current?.focus({ preventScroll: true }); } else closeSearch(); }}>
                <X size={16} aria-hidden="true" />
              </button>
            </div>}
          </>
            : <div className="library-study-toolbar">
              {variant === "compact" ? <div className="library-study-tabs" role="tablist" aria-label={copy.sections}>
                {(["pieces", "folders"] as const).map(item => <button key={item} ref={element => { tabRefs.current[item] = element; }}
                  id={`${uid}-tab-${item}`} type="button" role="tab" aria-selected={section === item} aria-controls={`${uid}-panel`}
                  tabIndex={section === item ? 0 : -1} onClick={() => chooseSection(item)} onKeyDown={event => tabKey(event, item)}>
                  <span>{copy[item]}</span><span className="library-study-count">{count(item === "pieces" ? saved.length : boards.length)}</span>
                </button>)}
                <span className="library-study-tab-indicator" aria-hidden="true" style={{ transform: `translateX(${section === "pieces" ? 0 : 100}%)` }} />
              </div> : <MorphingSelect className="library-study-switcher" value={section} onChange={next => chooseSection(next as Section)} ariaLabel={copy.sections} duration={180}
                options={[{ value: "pieces", label: `${copy.pieces} ${count(saved.length)}` }, { value: "folders", label: `${copy.folders} ${count(boards.length)}` }]} />}
              {folderIndex ? newFolderButton : controls}
            </div>}
          <div className="library-study-panel" key={section} id={`${uid}-panel`}
            role={variant === "compact" ? "tabpanel" : undefined} aria-labelledby={variant === "compact" ? `${uid}-tab-${section}` : undefined}>
            {variant === "overview" && <>
              {(!query.trim() || studyVariant) && <Carousel className="library-study-folder-rail" contentClassName="library-study-folder-track" ariaLabel={copy.folders}>
                {boards.map(folderCard)}
              </Carousel>}
              <header className="library-study-toolbar library-study-artworks-heading"><h2>{copy.pieces}<span className="library-study-count">{count(studyVariant ? saved.length : visibleWorks.length)}</span></h2>{controls}</header>
              {!studyVariant && <div className="library-study-medium-row">
                <span>{galleryCopy.labels.medium}</span>
                <MorphingSelect className="library-study-medium-select" value={medium} onChange={value => setMedium(value as typeof medium)}
                  options={galleryCopy.mediumOptions} ariaLabel={galleryCopy.labels.medium} duration={180} />
              </div>}
            </>}
            {folderIndex ? boards.length ? <div className="library-study-folder-grid">{boards.map(folderCard)}</div>
              : <div className="library-study-empty"><h2>{copy.noFolders}</h2><p>{copy.folderHint}</p></div>
              : artworks}
          </div>
        </>}
      </main>
    </MobileScroll>
    <NewFolderSheet open={newFolderOpen} onOpenChange={setNewFolderOpen} locale={locale} artworks={saved}
      onCreate={(name, options) => {
        const id = onCreateFolder(name, options);
        if (variant !== "overview") setSection("folders");
        setNewFolderOpen(false);
        openFolder(id);
      }} />
  </>;
}
