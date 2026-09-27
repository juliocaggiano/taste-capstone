import { CaretDown, Check, Plus } from "./design-system/PrototypeIcons";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useId, useRef, useState } from "react";
import { useKeyboard } from "./mobile";
import { NewFolderSheet } from "./NewFolderSheet";
import type { BoardOptions } from "./today-boards";
import { SaverAvatar, TodaySaversSheet } from "./TodaySaversSheet";
import { getSampleSavers, useCurrentReader } from "./today-savers";
import "./today-save-actions.css";

export type TodaySaveLabels = {
  save: string;
  saved: string;
  chooseBoard: string;
  newBoard: string;
  boardName: string;
  boardNamePlaceholder: string;
  createBoard: string;
  cancel: string;
  fullScreen: string;
  savedBy: (count: number) => string;
};

export type TodaySaveActionsProps<Id extends string = string> = {
  locale: string;
  currentArtwork: { id: Id; title: string; image: string; imagePosition?: string };
  count: number;
  isSaved: boolean;
  boards: readonly { id: string; name: string }[];
  selectedBoardIds: readonly string[];
  labels: TodaySaveLabels;
  onToggleSave: () => void;
  onToggleBoard: (boardId: string, selected: boolean) => void;
  onCreateBoard: (name: string, options?: BoardOptions<Id>) => void;
  onViewImage: () => void;
};

function displayCount(count: number, locale: string): string {
  const safeCount = Number.isFinite(count) ? Math.max(0, Math.round(count)) : 0;
  try {
    return new Intl.NumberFormat(locale, { notation: "compact", maximumFractionDigits: 1 }).format(safeCount);
  } catch {
    return String(safeCount);
  }
}

const countDigitMotion = {
  enter: (direction: number) => ({ y: direction * 12, opacity: 0 }),
  visible: { y: 0, opacity: 1 },
  exit: (direction: number) => ({ y: direction * -12, opacity: 0 }),
};

function RollingSaveCount({ count, locale }: { count: number; locale: string }) {
  const reducedMotion = useReducedMotion();
  const [change, setChange] = useState({ count, direction: 1 });
  if (change.count !== count) {
    setChange({ count, direction: count > change.count ? 1 : -1 });
  }
  const characters = Array.from(displayCount(count, locale));

  // Remounting on locale changes and initial={false} keep restored counts still.
  if (reducedMotion) return <>{characters.join("")}</>;
  return <span className="today-save-number">
    {characters.map((character, index) => <span className="today-save-digit" key={characters.length - index}>
      {/\p{Decimal_Number}/u.test(character) ? <AnimatePresence initial={false} custom={change.direction} mode="popLayout">
        <motion.span
          className="today-save-digit-glyph"
          key={character}
          custom={change.direction}
          variants={countDigitMotion}
          initial="enter"
          animate="visible"
          exit="exit"
          transition={{ duration: .24, ease: [.22, 1, .36, 1] }}
        >{character}</motion.span>
      </AnimatePresence> : character}
    </span>)}
  </span>;
}

export function TodaySaveActions<Id extends string>({
  locale,
  currentArtwork,
  count,
  isSaved,
  boards,
  selectedBoardIds,
  labels,
  onToggleSave,
  onToggleBoard,
  onCreateBoard,
  onViewImage,
}: TodaySaveActionsProps<Id>) {
  const currentReader = useCurrentReader();
  const keyboard = useKeyboard();
  const [menuOpen, setMenuOpen] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [saversOpen, setSaversOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const menuTriggerRef = useRef<HTMLButtonElement>(null);
  const countTriggerRef = useRef<HTMLButtonElement>(null);
  const hadSheetOpen = useRef(false);
  const hadSaversOpen = useRef(false);
  const menuId = useId();

  useEffect(() => {
    if (!menuOpen) return;
    const onPointerDown = (event: PointerEvent) => {
      if (event.target instanceof Node && !rootRef.current?.contains(event.target)) setMenuOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      event.preventDefault();
      setMenuOpen(false);
      menuTriggerRef.current?.focus({ preventScroll: true });
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [menuOpen]);

  useEffect(() => {
    if (sheetOpen) {
      hadSheetOpen.current = true;
      return;
    }
    if (!hadSheetOpen.current) return;
    hadSheetOpen.current = false;
    const frame = window.requestAnimationFrame(() => menuTriggerRef.current?.focus({ preventScroll: true }));
    return () => window.cancelAnimationFrame(frame);
  }, [sheetOpen]);

  useEffect(() => {
    if (saversOpen) {
      hadSaversOpen.current = true;
      return;
    }
    if (!hadSaversOpen.current) return;
    hadSaversOpen.current = false;
    const frame = window.requestAnimationFrame(() => countTriggerRef.current?.focus({ preventScroll: true }));
    return () => window.cancelAnimationFrame(frame);
  }, [saversOpen]);

  function openNewBoard() {
    keyboard.hide();
    setMenuOpen(false);
    setSheetOpen(true);
  }

  function closeSheet() {
    keyboard.hide();
    setSheetOpen(false);
  }

  const safeCount = Number.isFinite(count) ? Math.max(0, Math.round(count)) : 0;
  const people = getSampleSavers(safeCount, isSaved, currentReader);

  return (
    <div className="today-save-actions" ref={rootRef}>
      <button type="button" className="today-save-count" ref={countTriggerRef}
        title={labels.savedBy(safeCount)} aria-label={labels.savedBy(safeCount)} aria-haspopup="dialog" aria-expanded={saversOpen}
        onClick={() => { keyboard.hide(); setMenuOpen(false); setSaversOpen(true); }}>
        <span className="today-save-people" aria-hidden="true">{people.slice(0, 1).map(person => <SaverAvatar key={person.id} person={person} />)}</span>
        <span className="today-save-count-value" aria-hidden="true">+<RollingSaveCount key={locale} count={safeCount} locale={locale} /></span>
      </button>

      <span className="today-save-split">
        <button type="button" className="today-save-primary" aria-pressed={isSaved} onClick={() => { keyboard.hide(); onToggleSave(); }}>
          <span className="today-save-labels">
            <span data-visible={!isSaved} aria-hidden={isSaved}>{labels.save}</span>
            <span data-visible={isSaved} aria-hidden={!isSaved}>{labels.saved}</span>
          </span>
        </button>
        <button
          ref={menuTriggerRef}
          type="button"
          className="today-save-chevron"
          aria-label={labels.chooseBoard}
          aria-expanded={menuOpen}
          aria-controls={menuOpen ? menuId : undefined}
          onClick={() => { keyboard.hide(); setMenuOpen(open => !open); }}
        >
          <CaretDown size={10} weight="bold" aria-hidden="true" />
        </button>
      </span>

      <button type="button" className="today-save-fullscreen" onClick={() => { keyboard.hide(); setMenuOpen(false); onViewImage(); }} aria-label={labels.fullScreen}>
        <svg width="22" height="22" viewBox="6 2 16 16" aria-hidden="true">
          <path transform="translate(3 3)" d="M9 9C9 9 9 7.222 9 7.222 9 7.222 9.445 7.222 9.445 7.222 9.445 7.222 9.445 8.245 9.445 8.245 9.445 8.245 12.245 5.445 12.245 5.445 12.245 5.445 11.222 5.445 11.222 5.445 11.222 5 11.222 5 11.222 5 13 5 13 5 13 5 13 6.778 13 6.778 13 6.778 12.555 6.778 12.555 6.778 12.555 6.778 12.555 5.755 12.555 5.755 12.555 5.755 9.755 8.555 9.755 8.555 9.755 8.555 10.778 8.555 10.778 8.555 10.778 8.555 10.778 9 10.778 9 10.778 9 9 9 9 9Z" fill="currentColor" />
        </svg>
      </button>

      {menuOpen ? (
        <div className="today-save-popover" id={menuId} role="group" aria-label={labels.chooseBoard}>
          <div className="today-save-popover-title">{labels.chooseBoard}</div>
          <div className="today-save-board-list">
            {boards.map(board => {
              const selected = selectedBoardIds.includes(board.id);
              return (
                <button key={board.id} type="button" className="today-save-board-option" aria-pressed={selected} onClick={() => onToggleBoard(board.id, !selected)}>
                  <span className="today-save-board-name">{board.name}</span>
                  <span className="today-save-board-check" aria-hidden="true">{selected ? <Check size={11} weight="bold" /> : null}</span>
                </button>
              );
            })}
          </div>
          <button type="button" className="today-save-new-board" onClick={openNewBoard}><Plus size={11} aria-hidden="true" />{labels.newBoard}</button>
        </div>
      ) : null}

      <TodaySaversSheet open={saversOpen} onOpenChange={setSaversOpen} title={labels.savedBy(safeCount)} locale={locale} people={people} />

      <NewFolderSheet open={sheetOpen} onOpenChange={(open) => { if (!open) closeSheet(); else setSheetOpen(true); }}
        locale={locale === "pt-BR" || locale === "it" || locale === "es" ? locale : "en"}
        artworks={[currentArtwork]} initialCoverId={currentArtwork.id}
        onCreate={(name, options) => { onCreateBoard(name, options); closeSheet(); }} />
    </div>
  );
}
