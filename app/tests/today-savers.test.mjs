import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { stripTypeScriptTypes } from 'node:module';

const source = fs.readFileSync(new URL('../src/today-savers.ts', import.meta.url), 'utf8');
const javascript = stripTypeScriptTypes(source, { mode: 'strip' }).replace('"react"', JSON.stringify(import.meta.resolve('react')));
const savers = await import(`data:text/javascript;base64,${Buffer.from(javascript).toString('base64')}`);
const key = savers.FOLLOWED_PEOPLE_STORAGE_KEY;

function makeStorage(initial = null) {
  const data = new Map(initial === null ? [] : [[key, initial]]);
  return {
    writes: 0,
    getItem: name => data.get(name) ?? null,
    setItem(name, value) { this.writes += 1; data.set(name, value); },
    externallySet(value) { if (value === null) data.delete(key); else data.set(key, value); },
  };
}

test('sample identities are stable and 65 becomes 66 by adding the current reader', () => {
  const before = savers.getSampleSavers(65, false);
  const after = savers.getSampleSavers(66, true);
  assert.equal(before.length, 65);
  assert.equal(new Set(before.map(person => person.id)).size, 65);
  assert.equal(new Set(before.map(person => person.handle)).size, 65);
  assert.equal(after.length, 66);
  assert.equal(after[0].isCurrentUser, true);
  assert.deepEqual(after.slice(1), before);
  assert.equal(savers.getSampleSavers(2500, false).length, 65);
  assert.equal(savers.getSampleSavers(2501, true).length, 66);
  assert.deepEqual(savers.getSampleSavers(Number.NaN, false), []);
});

test('every reader has two fallback initials, including the current reader', () => {
  const people = savers.getSampleSavers(66, true);
  assert.equal(people[0].name, 'Julio Caggiano');
  assert.equal(people[0].initials, 'JC');
  for (const person of people) {
    assert.equal(person.initials.length, 2);
    assert.equal(person.initials, person.name.split(/\s+/).slice(0, 2).map(part => part[0]).join(''));
  }
});

test('following persists separately and rejects unknown profiles and the current reader', () => {
  const storage = makeStorage();
  const store = savers.createFollowedPeopleStore({ storage });
  const id = savers.getSampleSavers(1, false)[0].id;
  const self = savers.getSampleSavers(1, true)[0].id;
  const seen = [];
  const unsubscribe = store.subscribe(() => seen.push([...store.getSnapshot()]));
  store.toggleFollow(self);
  store.toggleFollow('someone-else');
  assert.equal(storage.writes, 0);
  store.toggleFollow(id);
  assert.equal(store.getSnapshot().has(id), true);
  assert.equal(savers.createFollowedPeopleStore({ storage }).getSnapshot().has(id), true);
  assert.deepEqual(seen, [[id]]);
  assert.equal(storage.getItem('daily-culture-followed-creators-v1'), null);
  store.toggleFollow(id);
  assert.deepEqual([...store.getSnapshot()], []);
  unsubscribe();
});

test('invalid storage fails closed without writing during load', () => {
  for (const invalid of ['{broken', '{}', '["unknown-person"]', '["sample-person-1", 2]', '["current-prototype-reader"]']) {
    const storage = makeStorage(invalid);
    assert.deepEqual([...savers.createFollowedPeopleStore({ storage }).getSnapshot()], []);
    assert.equal(storage.writes, 0);
  }
});

test('temporary study follows never read or write persistent data', () => {
  const storage = makeStorage('["sample-person-1"]');
  const store = savers.createFollowedPeopleStore({ temporary: true, storage });
  assert.deepEqual([...store.getSnapshot()], []);
  store.toggleFollow('sample-person-2');
  assert.deepEqual([...store.getSnapshot()], ['sample-person-2']);
  assert.equal(storage.writes, 0);
  assert.equal(storage.getItem(key), '["sample-person-1"]');
});

test('all subscribers receive cross-tab changes and storage clearing', () => {
  const browser = new EventTarget();
  browser.location = { search: '', pathname: '/' };
  globalThis.window = browser;
  try {
    const storage = makeStorage();
    const store = savers.createFollowedPeopleStore({ storage });
    let updates = 0;
    const stopA = store.subscribe(() => updates++);
    const stopB = store.subscribe(() => updates++);
    storage.externallySet('["sample-person-3"]');
    browser.dispatchEvent(Object.assign(new Event('storage'), { key, storageArea: storage }));
    assert.deepEqual([...store.getSnapshot()], ['sample-person-3']);
    assert.equal(updates, 2);
    storage.externallySet(null);
    browser.dispatchEvent(Object.assign(new Event('storage'), { key: null, storageArea: storage }));
    assert.deepEqual([...store.getSnapshot()], []);
    assert.equal(updates, 4);
    stopA();
    stopB();
    browser.location.search = '?menu-study=light';
    store.toggleFollow('sample-person-4');
    assert.equal(storage.writes, 0);
  } finally { delete globalThis.window; }
});
