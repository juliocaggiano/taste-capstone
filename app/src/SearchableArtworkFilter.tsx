import { useEffect, useId, useLayoutEffect, useMemo, useRef, useState, type KeyboardEvent } from "react";
import { CaretLeft, Check, MagnifyingGlass, X } from "./design-system/PrototypeIcons";
import { KeyboardInput, useKeyboard } from "./mobile";

type Option = { value: string; label: string };
type Props = {
  label: string;
  value: string;
  options: readonly Option[];
  copy: { search: string; clear: string; back: string; all: string; empty: string };
  onChange: (value: string) => void;
  onBack: () => void;
};
const normalize = (value: string) => value.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLocaleLowerCase().trim();

/** A searchable in-sheet list keeps large artist and country sets inside the phone's focus boundary. */
export function SearchableArtworkFilter({ label, value, options, copy, onChange, onBack }: Props) {
  const id = useId();
  const keyboard = useKeyboard();
  const input = useRef<HTMLInputElement>(null);
  const list = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState("");
  const selectedIndex = Math.max(0, options.findIndex(option => option.value === value) + 1);
  const [activeIndex, setActiveIndex] = useState(selectedIndex);
  const [keyboardChoice, setKeyboardChoice] = useState(false);
  const indexedOptions = useMemo(() => options.map(option => ({ ...option, searchText: normalize(option.label) })), [options]);
  const terms = normalize(query).split(/\s+/).filter(Boolean);
  const matches = indexedOptions.filter(option => terms.every(term => option.searchText.includes(term)));
  const choices: readonly Option[] = [{ value: "", label: copy.all }, ...matches];
  const currentIndex = Math.min(activeIndex, choices.length - 1);

  useLayoutEffect(() => { input.current?.focus({ preventScroll: true }); }, []);
  useLayoutEffect(() => {
    const active = list.current?.children[currentIndex] as HTMLElement | undefined;
    const scroll = list.current;
    if (!active || !scroll) return;
    if (active.offsetTop < scroll.scrollTop) scroll.scrollTop = active.offsetTop;
    else if (active.offsetTop + active.offsetHeight > scroll.scrollTop + scroll.clientHeight) scroll.scrollTop = active.offsetTop + active.offsetHeight - scroll.clientHeight;
  }, [currentIndex, query]);

  const choose = (choice: string) => { keyboard.hide(); onChange(choice); };
  const back = () => { keyboard.hide(); onBack(); };
  useEffect(() => {
    // Radix listens on document capture, so handle chooser Back before that outer dialog listener.
    const handleEscape = (event: globalThis.KeyboardEvent) => {
      if (event.key !== "Escape" || event.defaultPrevented) return;
      event.preventDefault(); event.stopPropagation(); keyboard.hide(); onBack();
    };
    window.addEventListener("keydown", handleEscape, true);
    return () => window.removeEventListener("keydown", handleEscape, true);
  }, [keyboard, onBack]);
  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      setKeyboardChoice(true);
      setActiveIndex((currentIndex + (event.key === "ArrowDown" ? 1 : -1) + choices.length) % choices.length);
    } else if (event.key === "Enter") {
      event.preventDefault();
      if (terms.length && !matches.length && !keyboardChoice) return;
      choose(choices[currentIndex].value);
    }
  };

  return <div className="artwork-filter-picker">
    <button type="button" className="artwork-filter-picker-back" aria-label={copy.back} onClick={back}><CaretLeft size={14} /></button>
    <div className="artwork-filter-picker-search">
      <MagnifyingGlass size={16} aria-hidden="true" />
      <KeyboardInput ref={input} type="search" role="combobox" value={query} placeholder={copy.search} aria-label={copy.search}
        aria-autocomplete="list" aria-expanded="true" aria-controls={`${id}-options`} aria-activedescendant={`${id}-option-${currentIndex}`}
        autoComplete="off" autoCorrect="off" spellCheck={false} enterKeyHint="search"
        onChange={event => { setQuery(event.currentTarget.value); setKeyboardChoice(false); setActiveIndex(event.currentTarget.value.trim() ? 1 : selectedIndex); }}
        onKeyDown={handleKeyDown} />
      {query && <button type="button" aria-label={copy.clear} onMouseDown={event => event.preventDefault()} onClick={() => {
        setQuery(""); setKeyboardChoice(false); setActiveIndex(selectedIndex); input.current?.focus({ preventScroll: true });
      }}><X size={16} /></button>}
    </div>
    <div ref={list} id={`${id}-options`} className="artwork-filter-picker-options" role="listbox" aria-label={label}>
      {choices.map((option, index) => <button type="button" key={option.value} id={`${id}-option-${index}`} role="option"
        aria-selected={option.value === value} data-active={index === currentIndex} tabIndex={-1}
        onMouseDown={event => event.preventDefault()} onPointerMove={() => setActiveIndex(index)} onClick={() => choose(option.value)}>
        <span>{option.label}</span>{option.value === value && <Check size={16} aria-hidden="true" />}
      </button>)}
      {!matches.length && <p className="artwork-filter-picker-empty" role="status">{copy.empty}</p>}
    </div>
  </div>;
}
