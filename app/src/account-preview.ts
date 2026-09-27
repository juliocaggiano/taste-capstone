import type { SavedPerson } from "./today-savers";

/** Local identities for the account-switching prototype. They are not signed-in users. */
export type PreviewAccount = SavedPerson & { email?: string; builtIn?: boolean };
export type PreviewAccountId = string;

export const PRIMARY_ACCOUNT_ID = "current-prototype-reader";
export const PREVIEW_ACCOUNT_ID = "preview-reader-leila";

export const PREVIEW_ACCOUNTS: readonly PreviewAccount[] = [
  {
    id: PRIMARY_ACCOUNT_ID,
    name: "Julio Caggiano",
    handle: "juliocaggiano",
    initials: "JC",
    tone: 0,
    avatarUrl: "/assets/profile/julio-avatar.webp",
    builtIn: true,
  },
  {
    id: PREVIEW_ACCOUNT_ID,
    name: "Leila Martins",
    handle: "leila.martins",
    initials: "LM",
    tone: 1,
    builtIn: true,
  },
];

const ACCOUNTS_KEY = "taste.preview.accounts.v1";
const ACTIVE_ACCOUNT_KEY = "taste.preview.active-account.v1";
const CUSTOM_ID_PREFIX = "preview-reader-";

export type AccountStorage = Pick<Storage, "getItem" | "setItem" | "removeItem">;

function browserStorage(): AccountStorage | null {
  try { return typeof window === "undefined" ? null : window.localStorage; }
  catch { return null; }
}

function initialsFor(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean);
  return (words.length > 1 ? `${words[0][0]}${words[1][0]}` : `${words[0]?.[0] ?? "?"}${words[0]?.[1] ?? "?"}`).toUpperCase();
}

function handleFor(name: string): string {
  return name.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase().trim().replace(/[^a-z0-9]+/g, ".").replace(/^\.+|\.+$/g, "") || "reader";
}

function parseCustomAccounts(raw: string | null): PreviewAccount[] {
  if (!raw) return [];
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    const ids = new Set(PREVIEW_ACCOUNTS.map(account => account.id));
    const accounts: PreviewAccount[] = [];
    for (const value of parsed) {
      if (!value || typeof value !== "object") continue;
      const record = value as Record<string, unknown>;
      if (typeof record.id !== "string" || !record.id.startsWith(CUSTOM_ID_PREFIX) || ids.has(record.id)) continue;
      if (typeof record.name !== "string" || !record.name.trim() || record.name.trim().length > 60) continue;
      const name = record.name.trim();
      ids.add(record.id);
      accounts.push({
        id: record.id,
        name,
        handle: typeof record.handle === "string" && /^[a-z0-9][a-z0-9._-]{0,59}$/.test(record.handle) ? record.handle : handleFor(name),
        initials: initialsFor(name),
        tone: accounts.length % 3,
      });
    }
    return accounts.slice(0, 20);
  } catch { return []; }
}

export function loadPreviewAccounts(storage: AccountStorage | null = browserStorage()): PreviewAccount[] {
  try { return [...PREVIEW_ACCOUNTS, ...parseCustomAccounts(storage?.getItem(ACCOUNTS_KEY) ?? null)]; }
  catch { return [...PREVIEW_ACCOUNTS]; }
}

/** Add a local-only identity. This does not create credentials or contact a server. */
export function addPreviewAccount(
  input: { name: string; email?: string },
  storage: AccountStorage | null = browserStorage(),
): PreviewAccount {
  const name = input.name.trim().replace(/\s+/g, " ");
  if (!name || name.length > 60) throw new Error("Enter a name of 60 characters or fewer.");
  const existing = loadPreviewAccounts(storage);
  let id: string;
  do {
    id = `${CUSTOM_ID_PREFIX}${typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`}`;
  } while (existing.some(account => account.id === id));
  const baseHandle = handleFor(name);
  const handles = new Set(existing.map(item => item.handle));
  let handle = baseHandle;
  let suffix = 2;
  while (handles.has(handle)) handle = `${baseHandle}.${suffix++}`;
  const account: PreviewAccount = {
    id,
    name,
    handle,
    initials: initialsFor(name),
    tone: (existing.length - PREVIEW_ACCOUNTS.length) % 3,
  };
  // The email is accepted by the preview form, but is never saved here.
  try { storage?.setItem(ACCOUNTS_KEY, JSON.stringify([...existing.filter(item => !item.builtIn), account])); }
  catch { /* The caller can still show this account during the current session. */ }
  return account;
}

export function loadActivePreviewAccountId(storage: AccountStorage | null = browserStorage()): PreviewAccountId {
  try {
    const id = storage?.getItem(ACTIVE_ACCOUNT_KEY);
    return loadPreviewAccounts(storage).some(account => account.id === id) ? id! : PRIMARY_ACCOUNT_ID;
  } catch { return PRIMARY_ACCOUNT_ID; }
}

export function saveActivePreviewAccountId(id: PreviewAccountId, storage: AccountStorage | null = browserStorage()): boolean {
  if (!loadPreviewAccounts(storage).some(account => account.id === id)) return false;
  try { storage?.setItem(ACTIVE_ACCOUNT_KEY, id); return Boolean(storage); }
  catch { return false; }
}

/** Existing Julio data always stays at its original storage key. */
export function accountKey(id: PreviewAccountId, key: string): string {
  return id === PRIMARY_ACCOUNT_ID ? key : `taste.preview.account.${encodeURIComponent(id)}.${key}`;
}

/** Adapt modules that accept a Storage reader/writer without changing their keys. */
export function accountStorage(
  id: PreviewAccountId,
  storage: AccountStorage | null = browserStorage(),
): AccountStorage | null {
  if (!storage) return null;
  if (id === PRIMARY_ACCOUNT_ID) return storage;
  return {
    getItem: key => storage.getItem(accountKey(id, key)),
    setItem: (key, value) => storage.setItem(accountKey(id, key), value),
    removeItem: key => storage.removeItem(accountKey(id, key)),
  };
}
