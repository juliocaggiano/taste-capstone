import { createContext, createElement, useContext, useMemo, useSyncExternalStore, type ReactNode } from "react";

/** Prototype readers. Sample peers do not represent live saving activity. */
export type SavedPerson = {
  id: string;
  name: string;
  handle: string;
  initials: string;
  /** An uploaded profile image, when available; initials remain the fallback. */
  avatarUrl?: string;
  tone: number;
  isCurrentUser?: boolean;
};

export const FOLLOWED_PEOPLE_STORAGE_KEY = "daily-culture-followed-people-v1";

const firstNames = ["Mara", "Noah", "Alma", "Theo", "Lina", "Ivo", "Nora", "Milo", "Cora", "Luca", "Ada", "Remy", "Nina"];
const lastNames = ["Vale", "Reed", "Costa", "Linden", "Morel"];
const samplePeople: SavedPerson[] = lastNames.flatMap((lastName, group) => firstNames.map((firstName, index) => ({
  id: `sample-person-${group * firstNames.length + index + 1}`,
  name: `${firstName} ${lastName}`,
  handle: `${firstName.toLowerCase()}.${lastName.toLowerCase()}`,
  initials: `${firstName[0]}${lastName[0]}`,
  tone: (group + index) % 3,
})));
const validPersonIds = new Set(samplePeople.map(person => person.id));
const currentPerson: SavedPerson = {
  // Julio's supplied portrait; the sheet localizes its display label as "You".
  id: "current-prototype-reader", name: "Julio Caggiano", handle: "juliocaggiano", initials: "JC", tone: 0, isCurrentUser: true,
  avatarUrl: "/assets/profile/julio-avatar.webp",
};

/** Count includes the current reader when saved. Larger counts show at most 65 sample peers. */
export function getSampleSavers(count: number, isSaved: boolean, reader: SavedPerson = currentPerson): SavedPerson[] {
  const total = Number.isFinite(count) ? Math.max(0, Math.floor(count)) : 0;
  if (!total) return [];
  const peers = samplePeople.filter(person => person.id !== reader.id).slice(0, Math.min(65, total - Number(isSaved)));
  return isSaved ? [{ ...reader, isCurrentUser: true }, ...peers] : peers;
}

type PeopleStorage = Pick<Storage, "getItem" | "setItem">;

function browserStorage(): Storage | null {
  try { return typeof window === "undefined" ? null : window.localStorage; }
  catch { return null; }
}

function isStudyRoute(): boolean {
  if (typeof window === "undefined") return false;
  const query = new URLSearchParams(window.location.search);
  return query.has("menu-study") || query.has("creator-motion-study") || query.has("today-search-study") || query.has("related-study") || query.has("explore-study") || query.has("edge-blur-study") || ["compact", "switcher", "overview"].includes(query.get("library-study") ?? "")
    || /\/(menu-study|motion-study)\.html$/.test(window.location.pathname);
}

function readFollowed(storage: PeopleStorage | null, currentReaderId?: string): Set<string> {
  try {
    const raw = storage?.getItem(FOLLOWED_PEOPLE_STORAGE_KEY);
    if (!raw) return new Set();
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.some(id => typeof id !== "string" || !validPersonIds.has(id))) return new Set();
    return new Set(parsed.filter(id => id !== currentReaderId));
  } catch { return new Set(); }
}

/** A small external store keeps every mounted Today edition in sync. */
export function createFollowedPeopleStore(options: { temporary?: boolean; storage?: PeopleStorage | null; storageKey?: string; currentReaderId?: string } = {}) {
  let followed = new Set<string>();
  let initialized = false;
  let storage: PeopleStorage | null = null;
  const listeners = new Set<() => void>();

  function initialize() {
    if (initialized) return;
    initialized = true;
    if (options.temporary) return;
    storage = options.storage === undefined ? browserStorage() : options.storage;
    followed = readFollowed(storage, options.currentReaderId);
  }

  function update(next: Set<string>) {
    if (next.size === followed.size && [...next].every(id => followed.has(id))) return;
    followed = next;
    listeners.forEach(listener => listener());
  }

  function onStorage(event: StorageEvent) {
    if (options.temporary || (event.key !== null && event.key !== (options.storageKey ?? FOLLOWED_PEOPLE_STORAGE_KEY))) return;
    const expectedArea = options.storageKey ? browserStorage() : storage;
    if (event.storageArea && expectedArea && event.storageArea !== expectedArea) return;
    update(readFollowed(storage, options.currentReaderId));
  }

  return {
    getSnapshot() {
      initialize();
      return followed;
    },
    subscribe(listener: () => void) {
      initialize();
      if (!listeners.size && !options.temporary && typeof window !== "undefined") {
        window.addEventListener("storage", onStorage);
        update(readFollowed(storage));
      }
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
        if (!listeners.size && typeof window !== "undefined") window.removeEventListener("storage", onStorage);
      };
    },
    toggleFollow(id: string) {
      if (!validPersonIds.has(id) || id === options.currentReaderId) return;
      initialize();
      const next = new Set(followed);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      update(next);
      if (options.temporary || isStudyRoute()) return;
      try { storage?.setItem(FOLLOWED_PEOPLE_STORAGE_KEY, JSON.stringify([...next])); }
      catch { /* Following still works for this session when browser storage is blocked. */ }
    },
  };
}

const persistentPeople = createFollowedPeopleStore();
const temporaryPeople = createFollowedPeopleStore({ temporary: true });
const serverSnapshot = new Set<string>();

type ReaderSession = { reader: SavedPerson; followedPeople: ReturnType<typeof createFollowedPeopleStore> };
const ReaderSessionContext = createContext<ReaderSession | null>(null);

/** Sets the active local preview reader for profiles and saved-by surfaces. */
export function ReaderSessionProvider({ person, storage, storageKey, temporary = false, children }: {
  person: SavedPerson;
  storage?: PeopleStorage | null;
  storageKey?: string;
  temporary?: boolean;
  children: ReactNode;
}) {
  const followedPeople = useMemo(() => createFollowedPeopleStore({ storage, storageKey, temporary, currentReaderId: person.id }), [person.id, storageKey, temporary]);
  const session = useMemo(() => ({ reader: { ...person, isCurrentUser: true }, followedPeople }), [person, followedPeople]);
  return createElement(ReaderSessionContext.Provider, { value: session }, children);
}

export function useCurrentReader(): SavedPerson {
  return useContext(ReaderSessionContext)?.reader ?? currentPerson;
}

export function useFollowedPeople(): { followed: Set<string>; toggleFollow: (id: string) => void } {
  const session = useContext(ReaderSessionContext);
  const store = session?.followedPeople ?? (isStudyRoute() ? temporaryPeople : persistentPeople);
  const followed = useSyncExternalStore(store.subscribe, store.getSnapshot, () => serverSnapshot);
  return { followed, toggleFollow: store.toggleFollow };
}
