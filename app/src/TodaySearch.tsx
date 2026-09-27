import { MagnifyingGlass } from "@phosphor-icons/react";
import { X, ArrowUpLeft } from "./design-system/PrototypeIcons";
import * as Dialog from "@radix-ui/react-dialog";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useRef, type CSSProperties } from "react";
import { BottomSheet, KeyboardInput, MobileScroll, useKeyboard, useKeyboardInsets, useMobileDevice, useScreenPortal } from "./mobile";
import "./today-search.css";

export type TodaySearchVariant = "inline" | "focus" | "sheet";
export type TodaySearchOrigin = { left: number; top: number; width: number; screenWidth: number };
export type TodaySearchItem = { id: string; title: string; creator: string; year: string; image: string; imagePosition?: string; searchText: string };
const COPY = {
  en: { title: "Search", placeholder: "Artworks, artists, places…", close: "Close search", clear: "Clear search", cancel: "Cancel", suggestions: "Try searching", suggested: "A place to start", results: "Results", empty: "No works found", hint: "Try another title, artist, or place.", terms: ["David", "Painting", "Japan"] },
  "pt-BR": { title: "Buscar", placeholder: "Obras, artistas, lugares…", close: "Fechar busca", clear: "Limpar busca", cancel: "Cancelar", suggestions: "Experimente buscar", suggested: "Por onde começar", results: "Resultados", empty: "Nenhuma obra encontrada", hint: "Tente outro título, artista ou lugar.", terms: ["David", "Pintura", "Japão"] },
  it: { title: "Cerca", placeholder: "Opere, artisti, luoghi…", close: "Chiudi ricerca", clear: "Cancella ricerca", cancel: "Annulla", suggestions: "Prova a cercare", suggested: "Da dove iniziare", results: "Risultati", empty: "Nessuna opera trovata", hint: "Prova un altro titolo, artista o luogo.", terms: ["David", "Pittura", "Giappone"] },
  es: { title: "Buscar", placeholder: "Obras, artistas, lugares…", close: "Cerrar búsqueda", clear: "Borrar búsqueda", cancel: "Cancelar", suggestions: "Prueba buscar", suggested: "Por dónde empezar", results: "Resultados", empty: "No se encontraron obras", hint: "Prueba otro título, artista o lugar.", terms: ["David", "Pintura", "Japón"] },
};
const normalize = (value: string) => value.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLocaleLowerCase();
const ease = [.22, 1, .36, 1] as const;

export function TodaySearch({ open, variant, origin, locale, items, query, onQuery, onClose, onOpenPiece }: {
  open: boolean; variant: TodaySearchVariant; origin: TodaySearchOrigin | null; locale: string;
  items: TodaySearchItem[]; query: string; onQuery: (query: string) => void; onClose: () => void; onOpenPiece: (id: string) => void;
}) {
  const copy = COPY[locale as keyof typeof COPY] ?? COPY.en;
  const keyboard = useKeyboard();
  const { bottomInset } = useKeyboardInsets();
  const { device } = useMobileDevice();
  const { screenRef } = useScreenPortal();
  const reduced = useReducedMotion();
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const resultReturn = useRef<{ id: string; scrollTop: number } | null>(null);
  const returningFromArtwork = resultReturn.current !== null && variant !== "sheet";
  const terms = normalize(query.trim()).split(/\s+/).filter(Boolean);
  const matches = terms.length ? items.filter(item => terms.every(term => normalize(item.searchText).includes(term))) : items.slice(0, 4);
  const safeTop = Math.max(60, device.geometry.safeArea.top);
  const top = safeTop + 8;
  const width = device.geometry.screen.width - 16;
  // This dialog portals to the entire phone screen, outside Android's app viewport.
  const bottom = Math.max(device.geometry.safeArea.bottom, bottomInset);

  useEffect(() => {
    if (!open) return;
    // Restore the chosen row after artwork dismissal without reopening the keyboard.
    // Fresh searches still focus the field after the dialog has mounted.
    const frame = requestAnimationFrame(() => {
      const restore = resultReturn.current;
      if (restore && variant !== "sheet") {
        const scroll = resultsRef.current?.closest<HTMLElement>(".mobile-scroll");
        if (scroll) scroll.scrollTop = restore.scrollTop;
        const row = Array.from(resultsRef.current?.querySelectorAll<HTMLButtonElement>(".today-search-result") ?? [])
          .find(button => button.dataset.pieceId === restore.id);
        row?.focus({ preventScroll: true });
        resultReturn.current = null;
      } else inputRef.current?.focus({ preventScroll: true });
    });
    return () => cancelAnimationFrame(frame);
  }, [open]);

  useEffect(() => {
    const scroll = resultsRef.current?.closest<HTMLElement>(".mobile-scroll");
    if (scroll) scroll.scrollTop = 0;
  }, [query]);

  function close() { resultReturn.current = null; keyboard.hide(); onClose(); }
  function choose(id: string) {
    resultReturn.current = { id, scrollTop: resultsRef.current?.closest<HTMLElement>(".mobile-scroll")?.scrollTop ?? 0 };
    keyboard.hide();
    onOpenPiece(id);
  }
  const field = <form className="today-search-form" role="search" onSubmit={event => { event.preventDefault(); keyboard.hide(); }}>
    <MagnifyingGlass size={16} aria-hidden="true" />
    <KeyboardInput ref={inputRef} type="search" aria-label={copy.placeholder} placeholder={copy.placeholder}
      value={query} onChange={event => onQuery(event.currentTarget.value)} autoComplete="off" spellCheck={false}
      enterKeyHint="search" onBlur={event => {
        // Let the pressed action receive its click before the keyboard moves the sheet.
        if (event.relatedTarget instanceof Element && event.relatedTarget.closest(".today-search-result, .today-search-close, .today-search-suggestions, .today-query-clear")) return;
        keyboard.hide();
      }}
      onKeyDown={event => {
        if (event.key.startsWith("Arrow")) event.stopPropagation();
        if (event.key === "ArrowDown") {
          const first = resultsRef.current?.querySelector<HTMLButtonElement>(".today-search-result");
          if (first) { event.preventDefault(); keyboard.hide(); first.focus({ preventScroll: true }); }
        }
      }} />
    {query && <button className="today-query-clear" type="button" aria-label={copy.clear}
      onPointerDown={event => event.preventDefault()} onClick={() => { onQuery(""); inputRef.current?.focus(); }}><X size={12} /></button>}
    <button className="today-search-close" type="button" onPointerDown={event => event.preventDefault()} onClick={close} aria-label={copy.close}>{copy.cancel}</button>
  </form>;
  const results = <div className="today-search-results" ref={resultsRef}>
    {!query.trim() && <div className="today-search-suggestions">
      <p>{copy.suggestions}</p>
      <div>{copy.terms.map(term => <button type="button" key={term} onPointerDown={event => event.preventDefault()}
        onClick={() => { onQuery(term); inputRef.current?.focus(); }}>{term}<ArrowUpLeft size={11} aria-hidden="true" /></button>)}</div>
    </div>}
    <p className="today-search-section-label" role="status" aria-live="polite">{query.trim() ? `${copy.results} · ${matches.length}` : copy.suggested}</p>
    {matches.length ? <div className="today-search-result-list">{matches.map(item => <button type="button" className="today-search-result" key={item.id} data-piece-id={item.id}
      onPointerDown={event => { if (keyboard.visible) event.preventDefault(); }}
      onKeyDown={event => {
        if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;
        event.preventDefault(); event.stopPropagation();
        const rows = Array.from(resultsRef.current?.querySelectorAll<HTMLButtonElement>(".today-search-result") ?? []);
        const next = rows[rows.indexOf(event.currentTarget) + (event.key === "ArrowDown" ? 1 : -1)];
        if (next) { next.focus({ preventScroll: true }); next.scrollIntoView({ block: "nearest" }); }
        else if (event.key === "ArrowUp") inputRef.current?.focus({ preventScroll: true });
      }} onClick={() => choose(item.id)}>
      <img src={item.image} alt="" draggable={false} style={{ objectPosition: item.imagePosition }} />
      <span><strong>{item.title}</strong><span>{item.creator}, {item.year}</span></span>
    </button>)}</div> : <div className="today-search-empty"><p>{copy.empty}</p><span>{copy.hint}</span></div>}
  </div>;

  if (variant === "sheet") return <BottomSheet open={open} onOpenChange={value => { if (!value) close(); }} title={copy.title} snap={.68}>
    <div className="today-home-search-sheet" data-variant={variant}>
      {field}
      {results}
    </div>
  </BottomSheet>;

  return <Dialog.Root open={open} onOpenChange={value => { if (!value) close(); }}>
    <Dialog.Portal container={screenRef.current ?? undefined} forceMount>
      <AnimatePresence>
        {open && <motion.div key="search-backdrop" className="today-search-backdrop" aria-hidden="true"
          initial={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: reduced ? 0 : .14 }} />}
        {open && <Dialog.Content key="search-content" asChild forceMount
        onOpenAutoFocus={event => event.preventDefault()} onCloseAutoFocus={event => event.preventDefault()}
        onInteractOutside={event => { if (event.target instanceof Element && event.target.closest(".keyboard-dock")) event.preventDefault(); }}
        aria-describedby={undefined}>
        <motion.div className="today-home-search" data-variant={variant}
          style={{ "--today-search-top": `${top}px`, "--today-search-safe-top": `${safeTop}px`, "--today-search-bottom": `${bottom}px` } as CSSProperties}
          initial={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: reduced ? 0 : .14 }}
          onPointerDown={event => { if (event.target === event.currentTarget) close(); }}>
          <Dialog.Title className="today-search-sr-only">{copy.title}</Dialog.Title>
          <div className="today-search-focus-surface" aria-hidden="true" />
          <motion.div className="today-search-expanded-field"
            initial={reduced || returningFromArtwork ? false : { left: origin?.left ?? width - 12, top: origin?.top ?? top + 6, width: 22, height: 22 }}
            animate={{ left: 8, top, width, height: 44 }} transition={{ duration: reduced ? 0 : .32, ease }}>
            <motion.div className="today-search-field-content" initial={{ opacity: reduced || returningFromArtwork ? 1 : 0 }} animate={{ opacity: 1 }} transition={{ duration: reduced ? 0 : .18, delay: reduced ? 0 : .08 }}>{field}</motion.div>
          </motion.div>
          <motion.div className="today-search-results-panel"
            style={{ top: top + 56 }}
            initial={{ opacity: reduced || returningFromArtwork ? 1 : 0, y: reduced || returningFromArtwork ? 0 : -4 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: reduced ? 0 : .2, delay: reduced ? 0 : .1 }}>
            <MobileScroll className="today-search-scroll">{results}</MobileScroll>
          </motion.div>
        </motion.div>
      </Dialog.Content>}</AnimatePresence>
    </Dialog.Portal>
  </Dialog.Root>;
}
