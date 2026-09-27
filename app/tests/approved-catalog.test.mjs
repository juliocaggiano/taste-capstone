import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { createHash } from 'node:crypto';
import { stripTypeScriptTypes } from 'node:module';

const read = path => JSON.parse(fs.readFileSync(new URL(path, import.meta.url), 'utf8'));
const catalog = read('../src/approved-catalog.json');
const imported = read('../../docs/editorial/imports/prototype-2026-09-25/entries.json');
const capture = read('../../qa/approved-catalog-import-2026-09-25/current-review.json');
const hash = bytes => createHash('sha256').update(bytes).digest('hex');

test('catalog contains precisely the current approved subset, with no pending or held works', () => {
  const ready = capture.entries.filter(e => e.status === 'Approved · writing and image reviewed');
  assert.deepEqual(catalog.map(e => e.id).sort(), ready.map(e => e.id).sort());
  assert.equal(new Set(catalog.map(e => e.id)).size, catalog.length);
  for (const row of imported) {
    assert.equal(row.reviewEvidence.writingStatus, 'approved');
    assert.ok(!row.reviewEvidence.commentsText || row.reviewEvidence.commentsText.includes('Passage comments · 0 open'));
  }
});

test('approved wording, quotations, selected image and served asset remain bound together', () => {
  for (const piece of catalog) {
    const source = imported.find(row => row.entry.id === piece.id);
    assert.equal(piece.body, source.entry.body);
    assert.equal(piece.story.join('\n\n'), source.entry.body);
    assert.equal(piece.selectedOption, source.reviewEvidence.imageOption);
    assert.equal(piece.selectedOption, source.selectedImage.id);
    assert.equal(piece.bodyHash, source.bodyHash);
    assert.equal(piece.imageHash, source.imageHash);
    const bytes = fs.readFileSync(new URL('../public' + piece.image, import.meta.url));
    assert.equal(hash(bytes), source.appImageSha256);
    if (piece.image.endsWith('.svg')) {
      const images = [...bytes.toString().matchAll(/data:image\/[^;]+;base64,([^"\s]+)/g)];
      assert.ok(images.some(match => hash(Buffer.from(match[1], 'base64')) === piece.sourceAssetSha256));
    } else assert.equal(hash(bytes), piece.sourceAssetSha256);
  }
});

test('retired sample saves and private notes survive while new catalog saves persist independently', async () => {
  const load = async name => {
    const source = fs.readFileSync(new URL('../src/' + name + '.ts', import.meta.url), 'utf8');
    return import(`data:text/javascript;base64,${Buffer.from(stripTypeScriptTypes(source, { mode: 'strip' })).toString('base64')}`);
  };
  const boards = await load('today-boards');
  const notes = await load('library-notes');
  const values = new Map([
    [boards.BOARDS_STORAGE_KEY, JSON.stringify({ version: 1, savedPieceIds: ['divine-comedy'], boards: [{ id: boards.DEFAULT_BOARD_ID, name: 'My folder', pieceIds: ['divine-comedy'], coverPieceId: 'divine-comedy' }] })],
    [notes.LIBRARY_NOTES_STORAGE_KEY, JSON.stringify({ 'divine-comedy': 'Keep my original note.' })],
  ]);
  const storage = { getItem: key => values.get(key) ?? null, setItem: (key, value) => values.set(key, value) };
  const retainedIds = ['divine-comedy', ...catalog.map(piece => piece.id)];
  let state = boards.loadBoards(retainedIds, [], storage);
  state = boards.setPieceSaved(state, catalog[0].id, true);
  boards.saveBoards(state, storage);
  const restored = boards.loadBoards(retainedIds, [], storage);
  assert.deepEqual(restored.savedPieceIds, ['divine-comedy', catalog[0].id]);
  assert.deepEqual(restored.boards[0].pieceIds, ['divine-comedy']);
  assert.equal(restored.boards[0].coverPieceId, 'divine-comedy');
  assert.equal(notes.loadLibraryNotes(retainedIds, storage)['divine-comedy'], 'Keep my original note.');
});
