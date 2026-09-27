import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { stripTypeScriptTypes } from 'node:module';

const source = fs.readFileSync(new URL('../src/today-boards.ts', import.meta.url), 'utf8');
const moduleUrl = `data:text/javascript;base64,${Buffer.from(stripTypeScriptTypes(source, { mode: 'strip' })).toString('base64')}`;
const boards = await import(moduleUrl);
const pieces = ['great-wave', 'noh-mask', 'the-kiss'];

function storage(initial = {}) {
  const values = new Map(Object.entries(initial));
  return {
    getItem: key => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, value),
  };
}

test('legacy favourites migrate once into saved state and the default board', () => {
  const local = storage({ [boards.LEGACY_FAVOURITES_KEY]: JSON.stringify(['great-wave', 'noh-mask', 'missing', 'great-wave']) });
  let state = boards.loadBoards(pieces, ['the-kiss'], local);
  assert.deepEqual(state.savedPieceIds, ['great-wave', 'noh-mask']);
  assert.deepEqual(state.boards[0].pieceIds, ['great-wave', 'noh-mask']);
  state = boards.setPieceSaved(state, 'great-wave', false);
  assert.equal(boards.saveBoards(state, local), true);
  assert.deepEqual(boards.loadBoards(pieces, ['the-kiss'], local).savedPieceIds, ['noh-mask']);
});

test('global saves and board membership remain independent across reloads', () => {
  const local = storage();
  let state = boards.loadBoards(pieces, [], local);
  state = boards.setPieceSaved(state, 'great-wave', true);
  assert.deepEqual(boards.getBoardIdsForPiece(state, 'great-wave'), []);
  const created = boards.createBoard(state, '  Study references  ');
  state = boards.setPieceInBoard(created.state, 'great-wave', created.boardId, true);
  state = boards.setPieceInBoard(state, 'great-wave', boards.DEFAULT_BOARD_ID, true);
  assert.deepEqual(boards.getBoardIdsForPiece(state, 'great-wave'), [boards.DEFAULT_BOARD_ID, created.boardId]);
  state = boards.setPieceInBoard(state, 'great-wave', created.boardId, false);
  assert.deepEqual(state.savedPieceIds, ['great-wave']);
  state = boards.setPieceInBoard(state, 'noh-mask', created.boardId, true);
  assert.deepEqual(state.savedPieceIds, ['great-wave', 'noh-mask']);
  state = boards.setPieceInBoard(state, 'noh-mask', created.boardId, false);
  assert.deepEqual(state.savedPieceIds, ['great-wave', 'noh-mask']);
  assert.equal(boards.saveBoards(state, local), true);
  const restored = boards.loadBoards(pieces, [], local);
  assert.equal(restored.boards[1].name, 'Study references');
  assert.deepEqual(boards.getBoardIdsForPiece(restored, 'great-wave'), [boards.DEFAULT_BOARD_ID]);
  assert.deepEqual([...boards.getSavedPieceIds(restored)], ['great-wave', 'noh-mask']);
  assert.deepEqual(boards.setPieceSaved(restored, 'great-wave', false).boards[0].pieceIds, []);
});

test('invalid storage falls back to valid legacy IDs without writing during load', () => {
  let writes = 0;
  const local = {
    getItem: key => key === boards.BOARDS_STORAGE_KEY ? '{broken' : JSON.stringify(['noh-mask', 'bad-id']),
    setItem: () => { writes += 1; },
  };
  const state = boards.loadBoards(pieces, [], local);
  assert.deepEqual(state.savedPieceIds, ['noh-mask']);
  assert.deepEqual(state.boards[0].pieceIds, ['noh-mask']);
  assert.equal(writes, 0);
});

test('folder metadata reloads without saving the cover or adding it as a member', () => {
  const local = storage();
  const initial = boards.loadBoards(pieces, [], local);
  const options = {
    coverPieceId: 'the-kiss',
    isPrivate: true,
    hideFromFeed: false,
    collaboratorIds: ['sample-alex', ' sample-sam ', 'sample-alex'],
  };
  const created = boards.createBoard(initial, '  Inspiration  ', options);
  assert.deepEqual(created.state.savedPieceIds, []);
  assert.deepEqual(created.state.boards[1].pieceIds, []);
  options.collaboratorIds.push('not-saved-later');
  assert.equal(boards.saveBoards(created.state, local), true);
  const restored = boards.loadBoards(pieces, [], local);
  assert.deepEqual(restored.savedPieceIds, []);
  assert.deepEqual(restored.boards[1], {
    id: created.boardId,
    name: 'Inspiration',
    pieceIds: [],
    coverPieceId: 'the-kiss',
    isPrivate: true,
    hideFromFeed: false,
    collaboratorIds: ['sample-alex', 'sample-sam'],
  });
  assert.deepEqual(initial.boards[0], { id: boards.DEFAULT_BOARD_ID, name: boards.DEFAULT_BOARD_NAME, pieceIds: [] });
});

test('load drops invalid metadata and bounds collaborator records while retaining old names', () => {
  const longExistingName = 'A'.repeat(70);
  const local = storage({
    [boards.LEGACY_FAVOURITES_KEY]: JSON.stringify(['great-wave']),
    [boards.BOARDS_STORAGE_KEY]: JSON.stringify({
      version: 1,
      savedPieceIds: [],
      boards: [
        { id: boards.DEFAULT_BOARD_ID, name: 'My board', pieceIds: [] },
        {
          id: 'board-1', name: longExistingName, pieceIds: ['noh-mask'],
          coverPieceId: 'missing-artwork', isPrivate: 'true', hideFromFeed: 1,
          collaboratorIds: ['', '   ', null, 3, 'x'.repeat(201), ' sample-a ', 'sample-a',
            ...Array.from({ length: 70 }, (_, index) => `sample-${index}`)],
        },
        { id: 'board-2', name: 'No collaborators', pieceIds: [], collaboratorIds: { broken: true } },
      ],
    }),
  });
  const restored = boards.loadBoards(pieces, [], local);
  assert.deepEqual(restored.savedPieceIds, ['noh-mask']);
  const folder = restored.boards[1];
  assert.equal(folder.name, longExistingName);
  assert.equal('coverPieceId' in folder, false);
  assert.equal('isPrivate' in folder, false);
  assert.equal('hideFromFeed' in folder, false);
  assert.equal(folder.collaboratorIds.length, boards.BOARD_COLLABORATOR_LIMIT);
  assert.equal(folder.collaboratorIds[0], 'sample-a');
  assert.equal(folder.collaboratorIds[1], 'sample-0');
  assert.equal(new Set(folder.collaboratorIds).size, folder.collaboratorIds.length);
  assert.deepEqual(restored.boards[2], { id: 'board-2', name: 'No collaborators', pieceIds: [] });
});

test('membership changes and global unsave preserve all folder metadata', () => {
  const local = storage();
  const created = boards.createBoard(boards.loadBoards(pieces, [], local), 'Studies', {
    coverPieceId: 'great-wave', isPrivate: false, hideFromFeed: true, collaboratorIds: ['sample-alex'],
  });
  const expected = created.state.boards[1];
  let state = boards.setPieceInBoard(created.state, 'great-wave', created.boardId, true);
  state = boards.setPieceInBoard(state, 'noh-mask', created.boardId, true);
  state = boards.setPieceInBoard(state, 'noh-mask', created.boardId, false);
  state = boards.setPieceSaved(state, 'great-wave', false);
  assert.deepEqual(state.boards[1], expected);
  assert.deepEqual(state.savedPieceIds, ['noh-mask']);
  boards.saveBoards(state, local);
  assert.deepEqual(boards.loadBoards(pieces, [], local).boards[1], expected);
});

test('new names are trimmed and limited to 50 characters without changing backward-compatible records', () => {
  const initial = boards.loadBoards(pieces, [], storage());
  assert.throws(() => boards.createBoard(initial, '  '), /cannot be empty/);
  assert.throws(() => boards.createBoard(initial, 'x'.repeat(51)), /cannot exceed 50/);
  const created = boards.createBoard(initial, `  ${'x'.repeat(50)}  `);
  assert.deepEqual(created.state.boards[1], { id: created.boardId, name: 'x'.repeat(50), pieceIds: [] });
  assert.equal(initial.boards.length, 1);
});
