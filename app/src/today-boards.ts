/** Local prototype state for saved pieces and personal boards. */

export const BOARDS_STORAGE_KEY = "daily-culture.boards.v1";
export const LEGACY_FAVOURITES_KEY = "daily-culture.favourites.v1";
export const DEFAULT_BOARD_ID = "board-default";
export const DEFAULT_BOARD_NAME = "My folder";
export const BOARD_NAME_MAX_LENGTH = 50;
export const BOARD_COLLABORATOR_LIMIT = 50;

export type BoardOptions<Id extends string = string> = {
  /** A cover is presentation metadata, independent of the folder's saved pieces. */
  coverPieceId?: Id;
  isPrivate?: boolean;
  hideFromFeed?: boolean;
  collaboratorIds?: string[];
};

export type SavedBoard<Id extends string = string> = BoardOptions<Id> & {
  id: string;
  name: string;
  pieceIds: Id[];
};

export type BoardsState<Id extends string = string> = {
  version: 1;
  /** Overall saved state. A piece can be saved without belonging to a board. */
  savedPieceIds: Id[];
  boards: SavedBoard<Id>[];
};

type StorageReader = Pick<Storage, "getItem">;
type StorageWriter = Pick<Storage, "setItem">;

function browserStorage(): Storage | null {
  try {
    return typeof window === "undefined" ? null : window.localStorage;
  } catch {
    return null;
  }
}

function validIds<Id extends string>(value: unknown, valid: ReadonlySet<Id>): Id[] {
  if (!Array.isArray(value)) return [];
  return [...new Set(value.filter((id): id is Id => typeof id === "string" && valid.has(id as Id)))];
}

function validCollaboratorIds(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  const ids = value
    .filter((id): id is string => typeof id === "string")
    .map(id => id.trim())
    .filter(id => id.length > 0 && id.length <= 200);
  return [...new Set(ids)].slice(0, BOARD_COLLABORATOR_LIMIT);
}

function boardOptions<Id extends string>(record: Record<string, unknown>, validPieceIds?: ReadonlySet<Id>): BoardOptions<Id> {
  const options: BoardOptions<Id> = {};
  if (typeof record.coverPieceId === "string" && record.coverPieceId.length > 0
    && (!validPieceIds || validPieceIds.has(record.coverPieceId as Id))) {
    options.coverPieceId = record.coverPieceId as Id;
  }
  if (typeof record.isPrivate === "boolean") options.isPrivate = record.isPrivate;
  if (typeof record.hideFromFeed === "boolean") options.hideFromFeed = record.hideFromFeed;
  if (Array.isArray(record.collaboratorIds)) options.collaboratorIds = validCollaboratorIds(record.collaboratorIds);
  return options;
}

function legacySaved<Id extends string>(storage: StorageReader | null, valid: ReadonlySet<Id>, fallback: readonly Id[]): Id[] {
  try {
    const raw = storage?.getItem(LEGACY_FAVOURITES_KEY);
    return raw === null || raw === undefined ? validIds(fallback, valid) : validIds(JSON.parse(raw), valid);
  } catch {
    return validIds(fallback, valid);
  }
}

function initialState<Id extends string>(savedPieceIds: Id[]): BoardsState<Id> {
  return {
    version: 1,
    savedPieceIds,
    // Migration places earlier favourites in a board. New Save actions stay independent.
    boards: [{ id: DEFAULT_BOARD_ID, name: DEFAULT_BOARD_NAME, pieceIds: [...savedPieceIds] }],
  };
}

/**
 * Read validated browser data. Legacy favourites migrate only when board data is absent
 * or unusable, so a later unsave cannot be undone by the retained legacy key.
 */
export function loadBoards<Id extends string>(
  validPieceIds: readonly Id[],
  fallbackPieceIds: readonly Id[] = [],
  storage: StorageReader | null = browserStorage(),
): BoardsState<Id> {
  const valid = new Set(validPieceIds);
  const migrated = legacySaved(storage, valid, fallbackPieceIds);
  let raw: string | null = null;
  try { raw = storage?.getItem(BOARDS_STORAGE_KEY) ?? null; }
  catch { /* Use the local fallback if storage is blocked. */ }
  if (raw === null) return initialState(migrated);

  try {
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return initialState(migrated);
    const record = parsed as Record<string, unknown>;
    if (record.version !== 1 || !Array.isArray(record.boards)) return initialState(migrated);

    const boards: SavedBoard<Id>[] = [];
    const seen = new Set<string>();
    for (const item of record.boards) {
      if (!item || typeof item !== "object") continue;
      const board = item as Record<string, unknown>;
      if (typeof board.id !== "string" || !board.id || seen.has(board.id)) continue;
      if (typeof board.name !== "string" || !board.name.trim()) continue;
      if (!Array.isArray(board.pieceIds)) continue;
      seen.add(board.id);
      boards.push({
        id: board.id,
        name: board.id === DEFAULT_BOARD_ID ? DEFAULT_BOARD_NAME : board.name,
        pieceIds: validIds(board.pieceIds, valid),
        ...boardOptions<Id>(board, valid),
      });
    }

    const defaultBoard = boards.find(board => board.id === DEFAULT_BOARD_ID);
    const orderedBoards = defaultBoard
      ? [defaultBoard, ...boards.filter(board => board.id !== DEFAULT_BOARD_ID)]
      : [{ id: DEFAULT_BOARD_ID, name: DEFAULT_BOARD_NAME, pieceIds: migrated }, ...boards];
    const saved = Array.isArray(record.savedPieceIds)
      ? validIds(record.savedPieceIds, valid)
      : migrated;
    // A damaged saved list cannot silently discard pieces still held in a board.
    const savedPieceIds = [...new Set([...saved, ...orderedBoards.flatMap(board => board.pieceIds)])];
    return { version: 1, savedPieceIds, boards: orderedBoards };
  } catch {
    return initialState(migrated);
  }
}

/** Save both formats so existing prototype screens can still read the overall saved set. */
export function saveBoards<Id extends string>(state: BoardsState<Id>, storage: StorageWriter | null = browserStorage()): boolean {
  if (!storage) return false;
  try {
    storage.setItem(BOARDS_STORAGE_KEY, JSON.stringify(state));
    storage.setItem(LEGACY_FAVOURITES_KEY, JSON.stringify(state.savedPieceIds));
    return true;
  } catch {
    return false;
  }
}

export function getSavedPieceIds<Id extends string>(state: BoardsState<Id>): Set<Id> {
  return new Set(state.savedPieceIds);
}

export function getBoardIdsForPiece<Id extends string>(state: BoardsState<Id>, pieceId: Id): string[] {
  return state.boards.filter(board => board.pieceIds.includes(pieceId)).map(board => board.id);
}

/** Save globally without assigning a board. Unsave clears all board memberships. */
export function setPieceSaved<Id extends string>(state: BoardsState<Id>, pieceId: Id, saved: boolean): BoardsState<Id> {
  const alreadySaved = state.savedPieceIds.includes(pieceId);
  if (saved) return alreadySaved ? state : { ...state, savedPieceIds: [...state.savedPieceIds, pieceId] };
  if (!alreadySaved && !state.boards.some(board => board.pieceIds.includes(pieceId))) return state;
  return {
    ...state,
    savedPieceIds: state.savedPieceIds.filter(id => id !== pieceId),
    boards: state.boards.map(board => ({ ...board, pieceIds: board.pieceIds.filter(id => id !== pieceId) })),
  };
}

/** Removing a board membership never removes the piece from the overall saved set. */
export function setPieceInBoard<Id extends string>(state: BoardsState<Id>, pieceId: Id, boardId: string, selected: boolean): BoardsState<Id> {
  const board = state.boards.find(item => item.id === boardId);
  if (!board || board.pieceIds.includes(pieceId) === selected) return state;
  return {
    ...state,
    savedPieceIds: selected && !state.savedPieceIds.includes(pieceId)
      ? [...state.savedPieceIds, pieceId]
      : state.savedPieceIds,
    boards: state.boards.map(item => item.id === boardId
      ? { ...item, pieceIds: selected ? [...item.pieceIds, pieceId] : item.pieceIds.filter(id => id !== pieceId) }
      : item),
  };
}

/** Creates a board with a persistent ID. Call setPieceInBoard to add the current piece. */
export function createBoard<Id extends string>(state: BoardsState<Id>, name: string, options: BoardOptions<Id> = {}): { state: BoardsState<Id>; boardId: string } {
  const cleanName = name.trim();
  if (!cleanName) throw new Error("Folder name cannot be empty.");
  if (cleanName.length > BOARD_NAME_MAX_LENGTH) throw new Error(`Folder name cannot exceed ${BOARD_NAME_MAX_LENGTH} characters.`);
  const ids = new Set(state.boards.map(board => board.id));
  let next = 1;
  while (ids.has(`board-${next}`)) next += 1;
  const boardId = `board-${next}`;
  return {
    state: { ...state, boards: [...state.boards, { id: boardId, name: cleanName, pieceIds: [], ...boardOptions<Id>(options) }] },
    boardId,
  };
}
