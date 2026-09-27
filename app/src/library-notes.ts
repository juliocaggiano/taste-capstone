/** Private notes attached to works in the local prototype library. */

export const LIBRARY_NOTES_STORAGE_KEY = "daily-culture.library-notes.v1";

export type LibraryNotes<Id extends string> = Partial<Record<Id, string>>;

function browserStorage(): Storage | null {
  try { return typeof window === "undefined" ? null : window.localStorage; }
  catch { return null; }
}

export function loadLibraryNotes<Id extends string>(validIds: readonly Id[], storage: Pick<Storage, "getItem"> | null = browserStorage()): LibraryNotes<Id> {
  try {
    const raw = storage?.getItem(LIBRARY_NOTES_STORAGE_KEY);
    if (!raw) return {};
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return {};
    const valid = new Set<string>(validIds);
    return Object.fromEntries(Object.entries(parsed).filter(([id, note]) => valid.has(id) && typeof note === "string" && note.trim()).map(([id, note]) => [id, (note as string).slice(0, 1000)])) as LibraryNotes<Id>;
  } catch {
    return {};
  }
}

export function setLibraryNote<Id extends string>(notes: LibraryNotes<Id>, id: Id, value: string): LibraryNotes<Id> {
  const next = { ...notes };
  const note = value.trim().slice(0, 1000);
  if (note) next[id] = note;
  else delete next[id];
  return next;
}

export function saveLibraryNotes<Id extends string>(notes: LibraryNotes<Id>, storage: Pick<Storage, "setItem"> | null = browserStorage()): boolean {
  if (!storage) return false;
  try { storage.setItem(LIBRARY_NOTES_STORAGE_KEY, JSON.stringify(notes)); return true; }
  catch { return false; }
}
