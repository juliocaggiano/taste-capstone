import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { stripTypeScriptTypes } from 'node:module';

const source = fs.readFileSync(new URL('../src/account-preview.ts', import.meta.url), 'utf8');
const account = await import(`data:text/javascript;base64,${Buffer.from(stripTypeScriptTypes(source, { mode: 'strip' })).toString('base64')}`);

function memoryStorage() {
  const values = new Map();
  return {
    getItem: key => values.get(key) ?? null,
    setItem: (key, value) => { values.set(key, value); },
    removeItem: key => { values.delete(key); },
    snapshot: () => new Map(values),
  };
}

test('account storage leaves the primary data at its original keys and isolates preview data', () => {
  const storage = memoryStorage();
  const primary = account.accountStorage(account.PRIMARY_ACCOUNT_ID, storage);
  const preview = account.accountStorage(account.PREVIEW_ACCOUNT_ID, storage);
  assert.equal(account.accountKey(account.PRIMARY_ACCOUNT_ID, 'daily-culture.boards.v1'), 'daily-culture.boards.v1');
  primary.setItem('daily-culture.boards.v1', 'julio');
  preview.setItem('daily-culture.boards.v1', 'leila');
  assert.equal(primary.getItem('daily-culture.boards.v1'), 'julio');
  assert.equal(preview.getItem('daily-culture.boards.v1'), 'leila');
  assert.equal(storage.getItem('daily-culture.boards.v1'), 'julio');
  assert.equal(storage.getItem(account.accountKey(account.PREVIEW_ACCOUNT_ID, 'daily-culture.boards.v1')), 'leila');
});

test('local account selection persists and unknown IDs fall back to the primary reader', () => {
  const storage = memoryStorage();
  assert.equal(account.loadActivePreviewAccountId(storage), account.PRIMARY_ACCOUNT_ID);
  assert.equal(account.saveActivePreviewAccountId('unknown-reader', storage), false);
  assert.equal(account.saveActivePreviewAccountId(account.PREVIEW_ACCOUNT_ID, storage), true);
  assert.equal(account.loadActivePreviewAccountId(storage), account.PREVIEW_ACCOUNT_ID);
});

test('added preview identities have unique handles and never store entered email', () => {
  const storage = memoryStorage();
  const first = account.addPreviewAccount({ name: '  Preview   Reader  ', email: 'private@example.com' }, storage);
  const second = account.addPreviewAccount({ name: 'Preview Reader', email: 'other@example.com' }, storage);
  assert.equal(first.name, 'Preview Reader');
  assert.notEqual(first.id, second.id);
  assert.notEqual(first.handle, second.handle);
  assert.equal(first.email, undefined);
  assert.equal(account.loadPreviewAccounts(storage).length, 4);
  assert.equal([...storage.snapshot().values()].some(value => value.includes('private@example.com') || value.includes('other@example.com')), false);
});
