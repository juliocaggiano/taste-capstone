import { DEFAULT_BOARD_ID, type BoardsState } from "./today-boards";

/** Fresh, disposable collection for an equal comparison of the three layouts. */
export function createLibraryStudyState<Id extends string>(validIds: readonly Id[]): BoardsState<Id> {
  const pick = (...ids: string[]) => validIds.filter(id => ids.includes(id));
  return {
    version: 1,
    savedPieceIds: pick("great-wave", "noh-mask", "migrant-mother", "caligari", "the-kiss"),
    boards: [
      { id: DEFAULT_BOARD_ID, name: "My folder", pieceIds: pick("great-wave", "noh-mask") },
      { id: "study-light-shadow", name: "Light & shadow", pieceIds: pick("migrant-mother", "caligari") },
      { id: "study-to-explore", name: "To explore", pieceIds: [] },
    ],
  };
}
