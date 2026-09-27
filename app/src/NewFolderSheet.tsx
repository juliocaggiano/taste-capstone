import { useEffect, useId, useLayoutEffect, useRef, useState, type FocusEvent, type FormEvent } from "react";
import { BottomSheet, KeyboardInput, useKeyboard, useKeyboardInsets, useMobileDevice } from "./mobile";
import { Toggle } from "./design-system/components";
import { Check, ImageSquare, MagnifyingGlass, Plus, X } from "./design-system/PrototypeIcons";
import { SaverAvatar } from "./TodaySaversSheet";
import { getSampleSavers } from "./today-savers";
import { BOARD_COLLABORATOR_LIMIT, BOARD_NAME_MAX_LENGTH, type BoardOptions } from "./today-boards";
import "./new-folder-sheet.css";

type Locale = "en" | "pt-BR" | "it" | "es";

const COPY = {
  en: {
    title: "New folder", create: "Create", name: "Folder name", namePlaceholder: "Folder name",
    changeCover: "Change cover", chooseCover: "Choose a cover", noCover: "No cover yet",
    private: "Private folder", privateDescription: "Keep this folder between you and your collaborators.",
    hide: "Hide from feed", hideDescription: "Keep artwork saved to this folder out of your feed.",
    collaborators: "Collaborators", search: "Search by name", sample: "Sample profiles",
    select: "Select", remove: "Remove", noResults: "No profiles found.", selected: "Selected collaborators",
  },
  "pt-BR": {
    title: "Nova pasta", create: "Criar", name: "Nome da pasta", namePlaceholder: "Nome da pasta",
    changeCover: "Alterar capa", chooseCover: "Escolha uma capa", noCover: "Ainda sem capa",
    private: "Pasta privada", privateDescription: "Mantenha esta pasta entre você e seus colaboradores.",
    hide: "Ocultar do feed", hideDescription: "Oculte do seu feed as obras salvas nesta pasta.",
    collaborators: "Colaboradores", search: "Buscar por nome", sample: "Perfis de exemplo",
    select: "Selecionar", remove: "Remover", noResults: "Nenhum perfil encontrado.", selected: "Colaboradores selecionados",
  },
  it: {
    title: "Nuova cartella", create: "Crea", name: "Nome della cartella", namePlaceholder: "Nome della cartella",
    changeCover: "Cambia copertina", chooseCover: "Scegli una copertina", noCover: "Nessuna copertina",
    private: "Cartella privata", privateDescription: "Condividi questa cartella solo con i tuoi collaboratori.",
    hide: "Nascondi dal feed", hideDescription: "Nascondi dal tuo feed le opere salvate in questa cartella.",
    collaborators: "Collaboratori", search: "Cerca per nome", sample: "Profili di esempio",
    select: "Seleziona", remove: "Rimuovi", noResults: "Nessun profilo trovato.", selected: "Collaboratori selezionati",
  },
  es: {
    title: "Nueva carpeta", create: "Crear", name: "Nombre de la carpeta", namePlaceholder: "Nombre de la carpeta",
    changeCover: "Cambiar portada", chooseCover: "Elige una portada", noCover: "Sin portada todavía",
    private: "Carpeta privada", privateDescription: "Comparte esta carpeta solo con tus colaboradores.",
    hide: "Ocultar del feed", hideDescription: "Oculta de tu feed las obras guardadas en esta carpeta.",
    collaborators: "Colaboradores", search: "Buscar por nombre", sample: "Perfiles de ejemplo",
    select: "Seleccionar", remove: "Eliminar", noResults: "No se encontraron perfiles.", selected: "Colaboradores seleccionados",
  },
} as const;

export type FolderCoverArtwork<Id extends string = string> = {
  id: Id;
  title: string;
  image: string;
  imagePosition?: string;
};

export type NewFolderSheetProps<Id extends string = string> = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  locale: Locale;
  artworks: readonly FolderCoverArtwork<Id>[];
  initialCoverId?: Id;
  onCreate: (name: string, options: BoardOptions<Id>) => void;
};

const samplePeople = getSampleSavers(65, false).filter(person => !person.isCurrentUser);
const normalize = (value: string) => value.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase().trim();

/** Cover and collaboration choices are local folder metadata, independent of saved membership. */
export function NewFolderSheet<Id extends string>({ open, onOpenChange, locale, artworks, initialCoverId, onCreate }: NewFolderSheetProps<Id>) {
  const copy = COPY[locale];
  const id = useId();
  const keyboard = useKeyboard();
  const { device } = useMobileDevice();
  const { keyboardHeight, availableHeight, isKeyboardVisible } = useKeyboardInsets();
  const formRef = useRef<HTMLFormElement>(null);
  const coverButton = useRef<HTMLButtonElement>(null);
  const focusedInput = useRef<HTMLInputElement | null>(null);
  const pointerInside = useRef(false);
  const wasOpen = useRef(false);
  const [name, setName] = useState("");
  const [coverId, setCoverId] = useState<Id | undefined>(initialCoverId ?? artworks[0]?.id);
  const [coverPickerOpen, setCoverPickerOpen] = useState(false);
  const [isPrivate, setIsPrivate] = useState(false);
  const [hideFromFeed, setHideFromFeed] = useState(false);
  const [query, setQuery] = useState("");
  const [collaboratorIds, setCollaboratorIds] = useState<string[]>([]);

  useLayoutEffect(() => {
    if (open && !wasOpen.current) {
      setName("");
      setCoverId(artworks.find(artwork => artwork.id === initialCoverId)?.id ?? artworks[0]?.id);
      setCoverPickerOpen(false);
      setIsPrivate(false);
      setHideFromFeed(false);
      setQuery("");
      setCollaboratorIds([]);
      pointerInside.current = false;
      focusedInput.current = null;
    }
    wasOpen.current = open;
  }, [open, initialCoverId, artworks]);

  // The shared sheet's maximum stays inside the usable phone area while typing.
  const visibleHeight = Math.min(device.geometry.screen.height * .93, availableHeight - device.geometry.safeArea.top - 8);
  const snap = (visibleHeight + Math.min(keyboardHeight, 180)) / device.geometry.screen.height;

  useEffect(() => {
    if (!open || !isKeyboardVisible) return;
    const frame = window.requestAnimationFrame(() => {
      const input = focusedInput.current;
      const scroll = formRef.current?.closest<HTMLElement>(".sheet-content");
      if (!input || !scroll || document.activeElement !== input) return;
      const fieldBounds = input.getBoundingClientRect();
      const scrollBounds = scroll.getBoundingClientRect();
      const scale = scrollBounds.height > 0 ? scroll.clientHeight / scrollBounds.height : 1;
      if (fieldBounds.bottom > scrollBounds.bottom - 16) scroll.scrollTop += (fieldBounds.bottom - scrollBounds.bottom + 16) * scale;
      else if (fieldBounds.top < scrollBounds.top + 12) scroll.scrollTop -= (scrollBounds.top + 12 - fieldBounds.top) * scale;
    });
    return () => window.cancelAnimationFrame(frame);
  }, [open, isKeyboardVisible, keyboardHeight, keyboard.focusedElement]);

  const changeOpen = (next: boolean) => {
    if (!next) keyboard.hide();
    onOpenChange(next);
  };

  const handleBlur = (event: FocusEvent<HTMLInputElement>) => {
    if (pointerInside.current || (event.relatedTarget instanceof Element && formRef.current?.contains(event.relatedTarget))) return;
    window.requestAnimationFrame(() => {
      if (!formRef.current?.contains(document.activeElement)) keyboard.hide();
    });
  };

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const cleanName = name.trim();
    if (!cleanName) return;
    const validCover = artworks.find(artwork => artwork.id === coverId)?.id;
    onCreate(cleanName, { ...(validCover ? { coverPieceId: validCover } : {}), isPrivate, hideFromFeed, collaboratorIds });
    changeOpen(false);
  };

  const toggleCollaborator = (personId: string) => {
    setCollaboratorIds(current => current.includes(personId)
      ? current.filter(id => id !== personId)
      : current.length < BOARD_COLLABORATOR_LIMIT ? [...current, personId] : current);
  };

  const cover = artworks.find(artwork => artwork.id === coverId) ?? artworks[0];
  const terms = normalize(query).split(/\s+/).filter(Boolean);
  const results = terms.length ? samplePeople.filter(person => terms.every(term => normalize(`${person.name} ${person.handle}`).includes(term))).slice(0, 8) : [];
  const selectedPeople = samplePeople.filter(person => collaboratorIds.includes(person.id));

  return <BottomSheet open={open} onOpenChange={changeOpen} title={copy.title} snap={snap}>
    <form ref={formRef} className="new-folder-form" onSubmit={submit}
      onPointerDownCapture={() => { pointerInside.current = true; }}
      onPointerUpCapture={() => { window.setTimeout(() => { pointerInside.current = false; }, 0); }}
      onPointerCancelCapture={() => { pointerInside.current = false; }}>
      <button className="new-folder-submit" type="submit" disabled={!name.trim()}>{copy.create}</button>

      <div className="new-folder-cover-section">
        <button ref={coverButton} className="new-folder-cover" type="button" aria-label={copy.changeCover} aria-expanded={coverPickerOpen}
          aria-controls={`${id}-covers`} disabled={!artworks.length} onClick={() => { keyboard.hide(); setCoverPickerOpen(current => !current); }}>
          {cover ? <img src={cover.image} style={{ objectPosition: cover.imagePosition }} alt={cover.title} draggable={false} /> : <ImageSquare size={30} />}
          {cover && <span className="new-folder-cover-edit" aria-hidden="true"><ImageSquare size={14} /></span>}
        </button>
        {!cover && <span className="new-folder-cover-empty">{copy.noCover}</span>}
        {coverPickerOpen && <fieldset className="new-folder-cover-picker" id={`${id}-covers`}>
          <legend>{copy.chooseCover}</legend>
          <div className="new-folder-cover-options">{artworks.map(artwork => <button type="button" key={artwork.id}
            aria-label={artwork.title} aria-pressed={cover?.id === artwork.id} onClick={() => {
              setCoverId(artwork.id); setCoverPickerOpen(false);
              window.requestAnimationFrame(() => coverButton.current?.focus({ preventScroll: true }));
            }}>
            <img src={artwork.image} style={{ objectPosition: artwork.imagePosition }} alt="" draggable={false} loading="lazy" />
            {cover?.id === artwork.id && <span aria-hidden="true"><Check size={14} /></span>}
          </button>)}</div>
        </fieldset>}
      </div>

      <div className="new-folder-name-field">
        <div className="new-folder-field-label"><label htmlFor={`${id}-name`}>{copy.name}</label><span id={`${id}-name-count`}>{name.length}/{BOARD_NAME_MAX_LENGTH}</span></div>
        <KeyboardInput id={`${id}-name`} name="folderName" value={name} maxLength={BOARD_NAME_MAX_LENGTH} placeholder={copy.namePlaceholder}
          autoComplete="off" required aria-describedby={`${id}-name-count`} onChange={event => setName(event.currentTarget.value)}
          onFocus={event => { focusedInput.current = event.currentTarget; }} onBlur={handleBlur} />
      </div>

      <div className="new-folder-preferences">
        <div className="new-folder-preference"><div><span>{copy.private}</span><p>{copy.privateDescription}</p></div>
          <Toggle ariaLabel={copy.private} checked={isPrivate} onChange={() => setIsPrivate(current => !current)} /></div>
        <div className="new-folder-preference"><div><span>{copy.hide}</span><p>{copy.hideDescription}</p></div>
          <Toggle ariaLabel={copy.hide} checked={hideFromFeed} onChange={() => setHideFromFeed(current => !current)} /></div>
      </div>

      <section className="new-folder-collaborators" aria-labelledby={`${id}-collaborators-title`}>
        <div className="new-folder-collaborators-heading"><h3 id={`${id}-collaborators-title`}>{copy.collaborators}</h3><p>{copy.sample}</p></div>
        {selectedPeople.length > 0 && <ul className="new-folder-selected" aria-label={copy.selected}>{selectedPeople.map(person => <li key={person.id}>
          <button type="button" aria-label={`${copy.remove} ${person.name}`} onClick={() => toggleCollaborator(person.id)}>
            <SaverAvatar person={person} /><span>{person.name}</span><X size={12} />
          </button>
        </li>)}</ul>}
        <div className="new-folder-people-search"><MagnifyingGlass size={18} /><KeyboardInput type="search" aria-label={copy.search} placeholder={copy.search}
          value={query} autoComplete="off" onChange={event => setQuery(event.currentTarget.value)}
          onFocus={event => { focusedInput.current = event.currentTarget; }} onBlur={handleBlur} onKeyDown={event => { if (event.key === "Enter") event.preventDefault(); }} /></div>
        {terms.length > 0 && <ul className="new-folder-people-results" aria-label={copy.sample}>{results.length ? results.map(person => {
          const selected = collaboratorIds.includes(person.id);
          return <li key={person.id}><button type="button" aria-label={`${selected ? copy.remove : copy.select} ${person.name}`} aria-pressed={selected}
            disabled={!selected && collaboratorIds.length >= BOARD_COLLABORATOR_LIMIT} onClick={() => toggleCollaborator(person.id)}>
            <SaverAvatar person={person} /><span className="new-folder-person-name">{person.name}<small>@{person.handle}</small></span>
            {selected ? <Check size={18} /> : <Plus size={18} />}
          </button></li>;
        }) : <li className="new-folder-people-empty">{copy.noResults}</li>}</ul>}
      </section>
    </form>
  </BottomSheet>;
}
