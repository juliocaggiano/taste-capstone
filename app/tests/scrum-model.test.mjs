import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { stripTypeScriptTypes } from 'node:module';

const source = name => fs.readFileSync(new URL(`../src/scrum/${name}.ts`, import.meta.url), 'utf8');
const compile = text => stripTypeScriptTypes(text, { mode: 'strip' });
const moduleUrl = text => `data:text/javascript;base64,${Buffer.from(text).toString('base64')}`;
const seedUrl = moduleUrl(compile(source('seed')));
const updatesUrl = moduleUrl(compile(source('projectUpdates')).replace("'./seed'", JSON.stringify(seedUrl)));
const model = await import(moduleUrl(compile(source('model')).replace("'./seed'", JSON.stringify(seedUrl)).replace("'./projectUpdates'", JSON.stringify(updatesUrl))));
const seed = await import(seedUrl);
const originalWorkspace = () => model.normalizeWorkspace(structuredClone({ version: 1, tasks: seed.seedTasks.map(task => ({ ...task, doneConfirmed: task.status === 'done' })), sprints: seed.seedSprints, productGoal: seed.productGoal, definitionOfDone: seed.definitionOfDone }));
const root = path.resolve(new URL('../../', import.meta.url).pathname);
const oldExpandedDescription = task => {
  const original = task.description.trim();
  const seedNote = seed.seedTasks.find(item => item.id === task.id)?.historyNote;
  const note = seedNote ? (task.historyNote ?? '').replace(seedNote, '').trim() : task.historyNote?.trim();
  const criteria = task.acceptanceCriteria.map(line => line.trim()).filter(line => line && !original.includes(line));
  const sources = task.evidence.filter(source => !original.includes(source.path)).map(source => `${source.label}: ${source.path}`);
  return [original, criteria.map(line => `- ${line}`).join('\n'), note && !original.includes(note) ? note : '', sources.join('\n')].filter(Boolean).join('\n\n');
};
const loadSavedBoard = data => {
  const previousStorage = globalThis.localStorage;
  try {
    globalThis.localStorage = { getItem: () => JSON.stringify(data) };
    return model.loadWorkspace();
  } finally {
    if (previousStorage === undefined) delete globalThis.localStorage;
    else globalThis.localStorage = previousStorage;
  }
};
const twoSprintLegacyBoard = () => {
  const data = structuredClone({
    version: 1,
    tasks: seed.seedTasks.map(task => ({ ...task, doneConfirmed: task.status === 'done' })),
    sprints: seed.seedSprints.slice(0, 2),
    productGoal: seed.productGoal,
    definitionOfDone: seed.definitionOfDone,
  });
  data.sprints[1].name = 'My current sprint';
  data.sprints[1].goal = 'Keep my own sprint goal.';
  Object.assign(data.tasks.find(task => task.id === 'DC-004'), {
    title: 'My edited design handoff', description: 'Keep my own task description.',
    points: 8, customNote: 'Personal planning note.',
  });
  data.tasks.reverse();
  assert.equal(model.validWorkspace(data), true);
  return data;
};

test('seed preserves dated evidence and two consecutive fortnightly sprints', () => {
  const data = originalWorkspace();
  assert.equal(model.validWorkspace(data), true);
  assert.equal(data.tasks.filter(t => t.status === 'done').length, 14);
  assert.equal(model.points(data.tasks.filter(t => t.week === 'week-4')), 13);
  for (const task of data.tasks.filter(t => t.status === 'done')) {
    assert.ok(task.historyNote.includes('retrospective'));
    for (const evidence of task.evidence) assert.ok(fs.existsSync(path.join(decodeURI(root), evidence.path)), evidence.path);
  }
  assert.equal(model.addDays(data.sprints[0].endDate, 1), data.sprints[1].startDate);
});

test('fresh boards include blank consecutive sprint placeholders through late December', () => {
  const data = model.freshWorkspace();
  assert.deepEqual(data.sprints.map(sprint => sprint.id), Array.from({ length: 9 }, (_, index) => `sprint-${index + 1}`));
  assert.equal(data.sprints.at(-1).startDate, '2026-12-21');
  assert.equal(data.sprints.at(-1).endDate, '2027-01-03');
  for (let index = 1; index < data.sprints.length; index++) {
    assert.equal(model.addDays(data.sprints[index - 1].endDate, 1), data.sprints[index].startDate);
    assert.equal(model.addDays(data.sprints[index].startDate, 13), data.sprints[index].endDate);
  }
  for (const sprint of data.sprints.slice(2)) {
    assert.equal(sprint.status, 'planned');
    assert.equal(sprint.goal, '');
    assert.equal(data.tasks.some(task => task.sprintId === sprint.id), false);
  }
  assert.equal(model.validWorkspace(data), true);
});

test('legacy boards gain future sprints once and retain personal task and sprint edits', () => {
  const saved = twoSprintLegacyBoard();
  const { data, error } = loadSavedBoard(saved);
  assert.equal(error, '');
  assert.deepEqual(data.sprints.map(sprint => sprint.id), Array.from({ length: 9 }, (_, index) => `sprint-${index + 1}`));
  assert.equal(data.sprints[1].name, saved.sprints[1].name);
  assert.equal(data.sprints[1].goal, saved.sprints[1].goal);
  assert.equal(data.sprints[1].status, saved.sprints[1].status);
  assert.deepEqual(data.tasks.slice(0, saved.tasks.length).map(task => task.id), saved.tasks.map(task => task.id));
  const edited = data.tasks.find(task => task.id === 'DC-004');
  for (const key of ['title', 'description', 'points', 'customNote', 'sprintId']) {
    assert.equal(edited[key], saved.tasks.find(task => task.id === edited.id)[key]);
  }
  const reloaded = loadSavedBoard(data);
  assert.equal(reloaded.error, '');
  assert.deepEqual(reloaded.data.sprints.map(sprint => sprint.id), data.sprints.map(sprint => sprint.id));
  assert.deepEqual(reloaded.data.tasks.map(task => task.id), data.tasks.map(task => task.id));
  assert.equal(reloaded.data.tasks.find(task => task.id === edited.id).description, edited.description);
});

test('an overlapping custom sprint blocks only its matching placeholder', () => {
  const saved = twoSprintLegacyBoard();
  saved.sprints.push({
    id: 'my-october-sprint', name: 'My October sprint',
    startDate: '2026-10-26', endDate: '2026-11-08', goal: 'Keep this custom interval.',
    status: 'planned', review: '', retrospective: '',
  });
  assert.equal(model.validWorkspace(saved), true);
  const { data, error } = loadSavedBoard(saved);
  assert.equal(error, '');
  const custom = data.sprints.find(sprint => sprint.id === 'my-october-sprint');
  for (const key of ['id', 'name', 'startDate', 'endDate', 'goal', 'status', 'review', 'retrospective']) {
    assert.equal(custom[key], saved.sprints.at(-1)[key]);
  }
  assert.equal(data.sprints.some(sprint => sprint.id === 'sprint-5'), false);
  for (const id of ['sprint-3', 'sprint-4', 'sprint-6', 'sprint-7', 'sprint-8', 'sprint-9']) {
    assert.equal(data.sprints.some(sprint => sprint.id === id), true, id);
  }
  assert.equal(model.validWorkspace(data), true);
});

test('a removed future placeholder stays removed after migration and reload', () => {
  const migrated = loadSavedBoard(twoSprintLegacyBoard()).data;
  assert.equal(migrated.sprints.some(sprint => sprint.id === 'sprint-8'), true);
  const saved = { ...migrated, sprints: migrated.sprints.filter(sprint => sprint.id !== 'sprint-8') };
  assert.equal(model.validWorkspace(saved), true);
  const { data, error } = loadSavedBoard(saved);
  assert.equal(error, '');
  assert.equal(data.sprints.some(sprint => sprint.id === 'sprint-8'), false);
  assert.deepEqual(data.sprints.map(sprint => sprint.id), saved.sprints.map(sprint => sprint.id));
  assert.deepEqual(data.tasks.map(task => task.id), saved.tasks.map(task => task.id));
});

test('deleting a seeded task survives backup and reload without changing other work', () => {
  const original = model.freshWorkspace();
  const before = structuredClone(original);
  const id = 'DC-007';
  const deleted = model.deleteTask(original, id);
  assert.deepEqual(original, before);
  assert.equal(deleted.tasks.some(task => task.id === id), false);
  assert.deepEqual(deleted.tasks, before.tasks.filter(task => task.id !== id));
  assert.deepEqual(deleted.deletedTaskIds, [id]);
  assert.deepEqual(deleted.epics, before.epics);
  assert.deepEqual(deleted.sprints, before.sprints);
  assert.deepEqual(deleted.appliedProjectUpdates, before.appliedProjectUpdates);
  assert.equal(model.validWorkspace(deleted), true);
  assert.deepEqual(model.deleteTask(deleted, id), deleted);
  const backup = JSON.parse(JSON.stringify(deleted));
  const { data: reloaded, error } = loadSavedBoard(backup);
  assert.equal(error, '');
  assert.equal(reloaded.tasks.some(task => task.id === id), false);
  assert.deepEqual(reloaded.deletedTaskIds, [id]);
  assert.deepEqual(reloaded.tasks, backup.tasks);
  assert.deepEqual(reloaded.epics, backup.epics);
});

test('deleting an update-added task prevents current and future batches from restoring it', async () => {
  const { projectUpdates } = await import(updatesUrl);
  const id = 'taste-filter-range';
  const sourceBatch = projectUpdates.find(update => update.tasks.some(task => task.id === id));
  assert.ok(sourceBatch);
  const original = model.freshWorkspace();
  const deleted = model.deleteTask(original, id);
  const olderBackup = { ...deleted, appliedProjectUpdates: deleted.appliedProjectUpdates.filter(batchId => batchId !== sourceBatch.id) };
  const currentBatchAgain = model.applyProjectUpdates(olderBackup, [sourceBatch]);
  assert.equal(currentBatchAgain.tasks.some(task => task.id === id), false);
  assert.deepEqual(currentBatchAgain.tasks, deleted.tasks);
  assert.ok(currentBatchAgain.appliedProjectUpdates.includes(sourceBatch.id));
  const futureBatch = { id: 'future-reuse-of-deleted-task', tasks: [structuredClone(sourceBatch.tasks.find(task => task.id === id))], patches: [] };
  const afterFutureBatch = model.applyProjectUpdates(currentBatchAgain, [futureBatch]);
  assert.equal(afterFutureBatch.tasks.some(task => task.id === id), false);
  assert.deepEqual(afterFutureBatch.tasks, deleted.tasks);
  assert.ok(afterFutureBatch.appliedProjectUpdates.includes(futureBatch.id));
  const { data: reloaded, error } = loadSavedBoard(olderBackup);
  assert.equal(error, '');
  assert.equal(reloaded.tasks.some(task => task.id === id), false);
  assert.deepEqual(reloaded.deletedTaskIds, [id]);
});

test('deleted task IDs are optional in old backups and malformed markers are rejected', () => {
  const legacy = originalWorkspace();
  assert.equal(model.validWorkspace(legacy), true);
  for (const invalid of [null, 'DC-007', ['DC-007', 'DC-007'], [''], [42]]) {
    const backup = { ...legacy, deletedTaskIds: invalid };
    assert.equal(model.validWorkspace(backup), false);
  }
});

test('task details keep legacy notes without exposing local evidence paths', () => {
  const task = originalWorkspace().tasks.find(t => t.status === 'todo');
  const original = structuredClone(task);
  task.historyNote += '\nMy personal outcome note.';
  const prepared = model.taskWithDescription(task);
  assert.ok(prepared.description.includes(original.description));
  for (const criterion of task.acceptanceCriteria) assert.ok(prepared.description.includes(criterion));
  for (const source of task.evidence) assert.equal(prepared.description.includes(source.path), false);
  assert.ok(prepared.description.includes('My personal outcome note.'));
  assert.equal(prepared.description.includes(original.historyNote), false);
  assert.deepEqual(prepared.acceptanceCriteria, original.acceptanceCriteria);
  assert.deepEqual(prepared.evidence, original.evidence);
  assert.equal(task.description, original.description);
  assert.equal(prepared.historyNote, task.historyNote);
  assert.deepEqual(model.taskWithDescription(prepared), prepared);
  prepared.description = 'My concise replacement.';
  const data = originalWorkspace(); data.tasks[0] = { ...prepared, id: data.tasks[0].id, epicId: data.tasks[0].epicId, epicNumber: data.tasks[0].epicNumber };
  assert.equal(model.validWorkspace(data), true);
  const restored = JSON.parse(JSON.stringify(data)).tasks[0];
  assert.equal(model.taskWithDescription(restored).description, 'My concise replacement.');
});

test('reflection preserves legacy notes and respects edited or cleared text after backup roundtrip', () => {
  const data = originalWorkspace();
  const sprint = data.sprints[1];
  Object.assign(sprint, { planning: '  Select the next prototype change. ', review: 'Readers found the labels clearer.', retrospective: 'Readers found the labels clearer.', improvement: ' Shorten the next test. ' });
  const original = structuredClone(sprint);
  assert.equal(model.sprintReflection(sprint), 'Select the next prototype change.\n\nReaders found the labels clearer.\n\nShorten the next test.');
  assert.deepEqual(sprint, original);
  assert.equal(model.validWorkspace(data), true);
  sprint.reflection = 'Keep the test focused.';
  const restored = JSON.parse(JSON.stringify(data));
  assert.equal(model.validWorkspace(restored), true);
  assert.equal(model.sprintReflection(restored.sprints[1]), 'Keep the test focused.');
  assert.equal(restored.sprints[1].planning, original.planning);
  assert.equal(restored.sprints[1].review, original.review);
  restored.sprints[1].reflection = '';
  assert.equal(model.sprintReflection(restored.sprints[1]), '');
  assert.equal(model.validWorkspace(restored), true);
});

test('closing a sprint preserves completed scope and returns unfinished work to backlog', () => {
  const data = originalWorkspace();
  assert.equal(model.completeSprint(data, 'sprint-1'), data);
  assert.equal(model.completeSprint(data, 'missing'), data);
  const sprint = data.sprints[1];
  sprint.review = ''; sprint.retrospective = ''; sprint.improvement = ''; sprint.reflection = '';
  const result = model.completeSprint(data, sprint.id);
  assert.equal(result.sprints[1].status, 'closed');
  assert.equal(result.tasks.filter(t => t.sprintId === sprint.id && t.status !== 'done').length, 0);
  assert.equal(result.tasks.filter(t => t.sprintId === sprint.id && t.status === 'done').length, 8);
  assert.equal(result.tasks.filter(t => t.sprintId === null).length, 8);
  assert.equal(data.sprints[1].status, 'active');
  assert.equal(result.sprints[1].reconstructed, false);
});

test('backup validation rejects broken references, dates, duplicated IDs and overlapping sprints', () => {
  const invalid = mutate => { const data = originalWorkspace(); mutate(data); assert.equal(model.validWorkspace(data), false); };
  invalid(data => data.tasks[0].sprintId = 'missing');
  invalid(data => data.tasks[0].completedAt = '2026-02-31');
  invalid(data => data.tasks[0].points = 100);
  invalid(data => data.tasks.push(data.tasks[0]));
  invalid(data => data.sprints[0].endDate = '2026-09-14');
  invalid(data => data.sprints[0].startDate = '2026-09-14');
  invalid(data => data.sprints[0].status = 'active');
  invalid(data => data.sprints[0].improvement = {});
  invalid(data => data.sprints[0].reflection = {});
  invalid(data => data.tasks[0] = null);
});

test('invalid browser data is not overwritten during loading', () => {
  let writes = 0;
  globalThis.localStorage = { getItem: () => '{bad json', setItem: () => writes++ };
  const loaded = model.loadWorkspace();
  assert.ok(loaded.error.includes('not been overwritten'));
  assert.equal(writes, 0);
  globalThis.localStorage = { getItem: () => JSON.stringify(originalWorkspace()) };
  assert.equal(model.loadWorkspace().error, '');
});


const legacyWorkspace = () => {
  const data = originalWorkspace();
  data.sprints = data.sprints.slice(0, 2);
  delete data.epics;
  data.tasks = data.tasks.map(({ epicId, epicNumber, ...task }) => task);
  data.sprints[0].name = 'Sprint 1 · Foundation';
  data.sprints[1].name = 'Sprint 2 · Design into learning';
  return data;
};
const codes = data => Object.fromEntries(data.tasks.map(task => [task.id, model.taskCode(task, data.epics)]));

test('epic migration groups seeded content and keeps the original internal IDs', () => {
  const data = model.normalizeWorkspace(legacyWorkspace());
  assert.equal(model.validWorkspace(data), true);
  assert.deepEqual(codes(data), {
    'DC-001': 'ENG-001', 'DC-002': 'ENG-002', 'DC-003': 'ENG-003', 'DC-004': 'PD-001',
    'DC-005': 'CP-001', 'DC-006': 'CP-002', 'DC-007': 'PD-002', 'DC-008': 'PD-003',
    'DC-009': 'PD-004', 'DC-010': 'PD-005', 'DC-011': 'ENG-004', 'DC-012': 'PD-006',
    'DC-013': 'ED-001', 'DC-014': 'CP-003', 'DC-015': 'CP-004', 'DC-016': 'UR-001',
    'DC-017': 'PD-007', 'DC-018': 'ED-002', 'DC-019': 'UR-002', 'DC-020': 'CP-005',
    'DC-021': 'ED-003', 'DC-022': 'ENG-005',
  });
  assert.deepEqual(data.sprints.map(sprint => sprint.name), ['Sprint 1', 'Sprint 2']);
});

test('migration retains saved edits, custom names, and task order and is idempotent', () => {
  const legacy = legacyWorkspace();
  Object.assign(legacy.tasks[3], { description: 'My changed description.', points: 8, archived: true, descriptionConsolidated: true, customNote: 'Keep this imported field.' });
  legacy.sprints[0].name = 'My personal sprint';
  legacy.tasks.reverse();
  const before = structuredClone(legacy);
  assert.equal(model.validWorkspace(legacy), true);
  const data = model.normalizeWorkspace(legacy);
  assert.deepEqual(legacy, before);
  assert.deepEqual(data.tasks.map(task => task.id), before.tasks.map(task => task.id));
  for (const { epicId, epicNumber, ...original } of data.tasks) assert.deepEqual(original, before.tasks.find(item => item.id === original.id));
  assert.equal(data.sprints[0].name, 'My personal sprint');
  assert.equal(data.sprints[1].name, 'Sprint 2');
  assert.deepEqual(codes(data), codes(model.normalizeWorkspace(legacyWorkspace())));
  assert.deepEqual(model.normalizeWorkspace(data), data);
});

test('legacy custom tasks group by content with a deterministic fallback', () => {
  const data = legacyWorkspace(), base = data.tasks[0];
  data.tasks.push(
    { ...base, id: 'custom-z', title: 'Test the reading experience with participants', description: '', area: 'Design' },
    { ...base, id: 'custom-a', title: 'Adjust card typography', description: '', area: 'Research' },
    { ...base, id: 'custom-b', title: 'Something unrelated', description: '' },
    { ...base, id: 'custom-c', title: 'Fix account sync', description: '' },
    { ...base, id: 'custom-d', title: 'Revise editorial copy', description: '' },
  );
  const normalized = model.normalizeWorkspace(data);
  assert.deepEqual(Object.fromEntries(normalized.tasks.filter(task => task.id.startsWith('custom')).map(task => [task.id, task.epicId])), {
    'custom-z': 'user-research', 'custom-a': 'product-design', 'custom-b': 'capstone-planning', 'custom-c': 'engineering', 'custom-d': 'editorial',
  });
  data.tasks.reverse();
  assert.deepEqual(codes(model.normalizeWorkspace(data)), codes(normalized));
});

test('normal edits, title changes, reordering, and reload never renumber assigned tasks', () => {
  const data = originalWorkspace(), before = codes(data);
  const task = data.tasks.find(item => item.id === 'DC-004');
  const saved = model.saveTask(data, { ...task, title: 'Reader sessions instead', status: 'in-progress', epicNumber: 999, points: 8 });
  assert.equal(codes(saved)[task.id], 'PD-001');
  saved.tasks.reverse();
  assert.deepEqual(codes(model.normalizeWorkspace(JSON.parse(JSON.stringify(saved)))), before);
  assert.equal(data.tasks.find(item => item.id === task.id).title, task.title);
  assert.deepEqual(saved.epics, data.epics);
});

test('assignment and reassignment consume monotonic per-epic numbers without reuse', () => {
  let data = originalWorkspace();
  const draft = { ...data.tasks[3], id: 'new-task', title: 'New design task', epicId: 'product-design', epicNumber: undefined };
  data = model.saveTask(data, draft);
  assert.equal(codes(data)['new-task'], 'PD-008');
  const getTask = () => data.tasks.find(task => task.id === draft.id);
  data = model.saveTask(data, { ...getTask(), epicId: 'engineering' });
  assert.equal(codes(data)['new-task'], 'ENG-006');
  data = model.normalizeWorkspace(JSON.parse(JSON.stringify(data)));
  data = model.saveTask(data, { ...getTask(), epicId: 'product-design' });
  assert.equal(codes(data)['new-task'], 'PD-009');
  data = model.saveTask(data, { ...draft, id: 'second-task', epicNumber: 1 });
  assert.equal(codes(data)['second-task'], 'PD-010');
  assert.equal(data.epics.find(epic => epic.id === 'engineering').nextNumber, 7);
  assert.equal(model.validWorkspace(data), true);
  assert.throws(() => model.saveTask(data, { ...draft, epicId: 'missing' }), /Choose an epic/);
});

test('custom epics validate unique prefixes and preserve counters through export/import', () => {
  const initial = originalWorkspace();
  const data = model.addEpic(initial, { name: '  Learning Content  ', prefix: ' lc ' });
  const epic = data.epics.at(-1);
  assert.equal(epic.name, 'Learning Content');
  assert.equal(epic.prefix, 'LC');
  assert.equal(initial.epics.length, 5);
  const assigned = model.saveTask(data, { ...data.tasks[0], id: 'custom-new-task', epicId: epic.id });
  assert.equal(codes(assigned)['custom-new-task'], 'LC-001');
  const exported = JSON.parse(JSON.stringify(assigned));
  assert.equal(model.validWorkspace(exported), true);
  assert.deepEqual(model.normalizeWorkspace(exported), assigned);
  assert.equal(exported.epics.at(-1).nextNumber, 2);
  for (const input of [{ name: '', prefix: 'AA' }, { name: 'Other', prefix: '1A' }, { name: 'Other', prefix: 'TOO-LONG-CODE' }, { name: 'Other', prefix: 'PD' }, { name: 'Other', prefix: 'pd' }, { name: 'product design', prefix: 'OTHER' }]) assert.throws(() => model.addEpic(initial, input));
});

test('import repairs stale counters before allocating another task code', () => {
  const backup = originalWorkspace(), epic = backup.epics.find(item => item.id === 'product-design');
  epic.nextNumber = 1;
  assert.equal(model.validWorkspace(backup), true);
  const data = model.normalizeWorkspace(backup);
  assert.equal(data.epics.find(item => item.id === epic.id).nextNumber, 8);
  const result = model.saveTask(data, { ...data.tasks[3], id: 'after-import', epicNumber: undefined });
  assert.equal(codes(result)['after-import'], 'PD-008');
  assert.equal(model.validWorkspace(result), true);
});

test('backup validation rejects malformed epics, dangling assignments, and duplicate codes', () => {
  const invalid = mutate => { const data = originalWorkspace(); mutate(data); assert.equal(model.validWorkspace(data), false); };
  invalid(data => data.epics = null);
  invalid(data => data.epics[0] = null);
  invalid(data => data.epics[0].id = '');
  invalid(data => data.epics[0].name = ' ');
  invalid(data => data.epics[0].prefix = 'lowercase');
  invalid(data => data.epics[0].nextNumber = 0);
  invalid(data => data.epics[0].nextNumber = 1.5);
  invalid(data => data.epics[0].nextNumber = Number.MAX_SAFE_INTEGER);
  invalid(data => data.epics[1].id = data.epics[0].id);
  invalid(data => data.epics[1].prefix = data.epics[0].prefix);
  invalid(data => data.tasks[0].epicId = 'missing');
  invalid(data => delete data.tasks[0].epicNumber);
  invalid(data => delete data.tasks[0].epicId);
  invalid(data => data.tasks[0].epicNumber = 0);
  invalid(data => data.tasks[0].epicNumber = '1');
  invalid(data => data.tasks[1].epicNumber = data.tasks[0].epicNumber);
  invalid(data => delete data.epics);
});

test('legacy review tasks normalize to in progress on import and load without disappearing', () => {
  const legacy = legacyWorkspace();
  legacy.tasks[14].status = 'review';
  const before = structuredClone(legacy.tasks[14]);
  assert.equal(model.validWorkspace(legacy), true);
  assert.deepEqual(model.statuses, ['todo', 'in-progress', 'done']);
  assert.equal(model.statusLabels.review, undefined);
  const migrated = model.normalizeWorkspace(legacy);
  assert.equal(migrated.tasks.length, legacy.tasks.length);
  assert.equal(migrated.tasks[14].status, 'in-progress');
  for (const field of ['description', 'id', 'points', 'sprintId']) assert.equal(migrated.tasks[14][field], before[field]);
  assert.ok(migrated.tasks.every(task => model.statuses.includes(task.status)));
  globalThis.localStorage = { getItem: () => JSON.stringify(legacy) };
  const loaded = model.loadWorkspace();
  assert.equal(loaded.error, '');
  assert.deepEqual(loaded.data.tasks, model.applyProjectUpdates(migrated).tasks);
  assert.equal(loaded.data.tasks[14].status, 'in-progress');
  assert.equal(model.validWorkspace(loaded.data), true);
  assert.equal(model.completeSprint(migrated, 'sprint-2').tasks[14].sprintId, null);
});

test('public process board includes specific work and preserves open research and approval tasks', () => {
  const data = model.freshWorkspace();
  assert.equal(model.validWorkspace(data), true);
  assert.equal(data.tasks.length, 51);
  assert.deepEqual(Object.fromEntries(model.statuses.map(status => [status, data.tasks.filter(task => task.status === status).length])), { todo: 7, 'in-progress': 2, done: 42 });
  assert.equal(data.tasks.filter(task => task.sprintId === 'sprint-1').length, 7);
  const sprintTwo = data.tasks.filter(task => task.sprintId === 'sprint-2');
  assert.equal(sprintTwo.length, 41);
  assert.deepEqual(Object.fromEntries(model.statuses.map(status => [status, sprintTwo.filter(task => task.status === status).length])), { todo: 4, 'in-progress': 2, done: 35 });
  assert.equal(data.tasks.filter(task => task.sprintId === null).length, 3);
  for (const task of data.tasks) {
    for (const evidence of task.evidence) assert.ok(fs.existsSync(path.join(decodeURI(root), evidence.path)), evidence.path);
    assert.doesNotMatch(task.description, /(?:^|\s)(?:qa\/|docs\/|app\/src\/|design-qa\.md)/, `${task.id} exposes a local evidence path`);
    if (task.status === 'done') {
      const sprint = data.sprints.find(item => item.id === task.sprintId);
      assert.ok(task.completedAt >= sprint.startDate && task.completedAt <= sprint.endDate, task.id);
    }
  }
  for (const id of ['DC-015', 'DC-016', 'DC-019', 'DC-020']) assert.equal(data.tasks.find(task => task.id === id).status, 'todo');
  for (const id of ['DC-017', 'DC-018']) assert.equal(data.tasks.find(task => task.id === id).status, 'in-progress');
  for (const id of ['taste-create-flow', 'taste-today-paper-actions']) assert.equal(data.tasks.find(task => task.id === id).status, 'done');
  assert.match(data.tasks.find(task => task.id === 'DC-007').description, /Artsy.*monochrome work/s);
  assert.match(data.tasks.find(task => task.id === 'taste-editorial-batch').description, /Staging is the completed scope.*import into the main app/s);
  assert.match(data.tasks.find(task => task.id === 'taste-filter-range').description, /Country.*date presets/s);
  assert.match(data.tasks.find(task => task.id === 'taste-editorial-approved-package').description, /Twelve entries.*import of 18 approved works/s);
  assert.match(data.tasks.find(task => task.id === 'DC-018').description, /45 active works.*Eighteen approved works entered the Taste prototype/s);
  assert.match(data.tasks.find(task => task.id === 'DC-021').description, /18 approved works.*repeatable path/s);
  assert.match(data.tasks.find(task => task.id === 'taste-editorial-batch-two').description, /15 more works|five painting, five architecture, and five film/i);
  assert.match(data.tasks.find(task => task.id === 'taste-process-ai').description, /AI coding assistance.*reader learning/s);
  assert.deepEqual(codes(originalWorkspace()), Object.fromEntries(Object.entries(codes(data)).filter(([id]) => id.startsWith('DC-'))));
});

test('approved catalog correction updates shipped copy without changing personal process data', async () => {
  const { projectUpdates } = await import(updatesUrl);
  const saved = model.applyProjectUpdates(originalWorkspace(), projectUpdates.slice(0, -1));
  const edited = structuredClone(saved);
  edited.tasks.find(task => task.id === 'DC-018').description = 'Keep my own account of editorial review.';
  const before = structuredClone(edited);
  const result = model.applyProjectUpdates(edited);
  assert.equal(result.tasks.find(task => task.id === 'DC-018').description, 'Keep my own account of editorial review.');
  assert.match(result.tasks.find(task => task.id === 'DC-021').description, /18 approved works/);
  assert.equal(result.tasks.find(task => task.id === 'taste-editorial-approved-package').title, 'Freeze the first 12 approved works');
  assert.deepEqual(result.tasks.map(task => [task.id, task.status, task.points, task.sprintId]), before.tasks.map(task => [task.id, task.status, task.points, task.sprintId]));
  assert.deepEqual(result.sprints, before.sprints);
  assert.deepEqual(result.deletedTaskIds, before.deletedTaskIds);
  assert.equal(result.tasks.length, before.tasks.length);
  assert.deepEqual(model.applyProjectUpdates(result), result);
});

test('public narrative migration upgrades stock copy but preserves personal task edits', () => {
  const saved = originalWorkspace();
  const artsy = saved.tasks.find(task => task.id === 'DC-007');
  artsy.description = oldExpandedDescription(artsy);
  artsy.descriptionConsolidated = true;
  assert.match(artsy.description, /design-qa\.md/);
  const custom = saved.tasks.find(task => task.id === 'DC-004');
  Object.assign(custom, { title: 'My own redesign record', description: 'Keep my personal account of this work.', descriptionConsolidated: true });
  const statusEdit = saved.tasks.find(task => task.id === 'DC-008');
  Object.assign(statusEdit, { status: 'in-progress', completedAt: undefined });
  const archived = saved.tasks.find(task => task.id === 'DC-009');
  archived.archived = true;
  const moved = saved.tasks.find(task => task.id === 'DC-012');
  moved.sprintId = null;
  const before = structuredClone(saved);
  const result = model.applyProjectUpdates(saved);
  assert.deepEqual(saved, before);
  assert.deepEqual(result.tasks.slice(0, saved.tasks.length).map(task => task.id), saved.tasks.map(task => task.id));
  assert.match(result.tasks.find(task => task.id === 'DC-007').description, /Artsy.*monochrome work/s);
  assert.doesNotMatch(result.tasks.find(task => task.id === 'DC-007').description, /design-qa\.md/);
  assert.deepEqual(result.tasks.find(task => task.id === custom.id), custom);
  assert.deepEqual(result.tasks.find(task => task.id === statusEdit.id), statusEdit);
  assert.deepEqual(result.tasks.find(task => task.id === archived.id), archived);
  assert.deepEqual(result.tasks.find(task => task.id === moved.id), moved);
  assert.deepEqual(model.applyProjectUpdates(result), result);
});

test('project updates merge into saved boards once, preserving edits, custom codes and manual order', () => {
  let saved = originalWorkspace();
  saved.sprints[0].goal = 'Establish the working discovery prototype';
  const review = saved.tasks.find(task => task.id === 'DC-017');
  Object.assign(review, { title: 'My review', description: 'Keep my notes', status: 'done', completedAt: '2026-09-23', points: 8 });
  const editorial = saved.tasks.find(task => task.id === 'DC-018');
  Object.assign(editorial, { description: 'My edited criteria', descriptionConsolidated: true });
  saved.tasks.find(task => task.id === 'DC-015').dueDate = '2026-09-26';
  saved.tasks.reverse();
  saved = model.saveTask(saved, { ...saved.tasks[0], id: 'personal-task', title: 'My extra design work', epicId: 'product-design', points: 8 });
  const before = structuredClone(saved), result = model.applyProjectUpdates(saved);
  assert.deepEqual(saved, before);
  assert.deepEqual(result.tasks.slice(0, saved.tasks.length).map(task => task.id), saved.tasks.map(task => task.id));
  assert.deepEqual(result.tasks.find(task => task.id === review.id), before.tasks.find(task => task.id === review.id));
  assert.equal(result.tasks.find(task => task.id === editorial.id).description, 'My edited criteria');
  assert.equal(result.tasks.find(task => task.id === 'DC-015').dueDate, '2026-09-26');
  assert.equal(result.sprints[0].goal, before.sprints[0].goal);
  assert.equal(codes(result)['personal-task'], codes(saved)['personal-task']);
  assert.equal(model.validWorkspace(result), true);
  assert.deepEqual(model.applyProjectUpdates(result), result);
  const added = result.tasks.find(task => task.id === 'taste-creator-profiles');
  Object.assign(added, { title: 'Edited after reconciliation', points: 13, sprintId: null });
  result.tasks = result.tasks.filter(task => task.id !== 'taste-editorial-guide');
  globalThis.localStorage = { getItem: () => JSON.stringify(result) };
  const reloaded = model.loadWorkspace();
  assert.equal(reloaded.error, '');
  assert.equal(reloaded.data.tasks.find(task => task.id === added.id).title, 'Edited after reconciliation');
  assert.equal(reloaded.data.tasks.find(task => task.id === added.id).points, 13);
  assert.equal(reloaded.data.tasks.some(task => task.id === 'taste-editorial-guide'), false);
  assert.equal(reloaded.data.sprints[0].goal, before.sprints[0].goal);
  assert.equal(codes(reloaded.data)['personal-task'], codes(saved)['personal-task']);
});

test('foundation does not reopen closed sprints or restore removed sprints', () => {
  const saved = model.completeSprint(originalWorkspace(), 'sprint-2');
  const result = model.applyProjectUpdates(saved);
  assert.ok(result.tasks.filter(task => task.sprintId === 'sprint-2').every(task => task.status === 'done'));
  assert.equal(result.tasks.find(task => task.id === 'taste-today-saves').sprintId, null);
  assert.equal(result.sprints[1].status, 'closed');
  const missing = originalWorkspace();
  missing.tasks.forEach(task => { if (task.sprintId === 'sprint-2') task.sprintId = null; });
  missing.sprints = missing.sprints.filter(sprint => sprint.id !== 'sprint-2');
  const migrated = model.applyProjectUpdates(missing);
  assert.deepEqual(migrated.sprints.map(sprint => sprint.id), missing.sprints.map(sprint => sprint.id));
  assert.ok(migrated.tasks.every(task => task.sprintId !== 'sprint-2'));
  assert.equal(model.validWorkspace(migrated), true);
});

test('later prompt-authored changes apply once and honor expected state', () => {
  const data = model.freshWorkspace();
  const updates = [{ id: 'test-follow-up', tasks: [], patches: [
    { taskId: 'DC-017', expected: { status: 'in-progress' }, changes: { status: 'done', completedAt: '2026-09-24' } },
    { taskId: 'DC-016', expected: { status: 'in-progress' }, changes: { status: 'done' } },
    { taskId: 'removed-task', expected: { status: 'todo' }, changes: { status: 'done' } },
  ] }];
  const result = model.applyProjectUpdates(data, updates);
  assert.equal(result.tasks.find(task => task.id === 'DC-017').status, 'done');
  assert.equal(result.tasks.find(task => task.id === 'DC-016').status, 'todo');
  assert.equal(result.tasks.length, data.tasks.length);
  assert.deepEqual(codes(result), codes(data));
  assert.deepEqual(model.applyProjectUpdates(result, updates), result);
  assert.equal(data.tasks.find(task => task.id === 'DC-017').status, 'in-progress');
});

test('invalid reconciliation metadata is rejected and original browser data stays untouched', () => {
  for (const value of [null, 'batch', ['same', 'same'], [4], ['']]) {
    const data = originalWorkspace(); data.appliedProjectUpdates = value;
    assert.equal(model.validWorkspace(data), false);
  }
  const data = originalWorkspace();
  assert.throws(() => model.applyProjectUpdates(data, [{ id: 'invalid', tasks: [], patches: [{ taskId: 'DC-001', expected: {}, changes: { points: 100 } }] }]), /invalid data/);
  assert.equal(data.tasks[0].points, 5);
  globalThis.localStorage = { getItem: () => '{bad json', setItem: () => { throw new Error('Must not overwrite'); } };
  assert.ok(model.loadWorkspace().error);
});

test('custom legacy task notes remain visible and evidence metadata remains intact', () => {
  const data = originalWorkspace(), task = data.tasks.find(task => task.id === 'DC-018');
  task.acceptanceCriteria.push('My extra review criterion');
  task.historyNote += '\nKeep this personal outcome.';
  task.evidence.push({ label: 'My reference', path: 'docs/PRODUCT_SPEC.md' });
  const result = model.applyProjectUpdates(data), saved = result.tasks.find(item => item.id === task.id);
  assert.equal(saved.title, task.title);
  assert.equal(saved.description, task.description);
  assert.equal(saved.descriptionConsolidated, undefined);
  const detail = model.taskWithDescription(saved);
  assert.match(detail.description, /My extra review criterion/);
  assert.match(detail.description, /Keep this personal outcome/);
  assert.doesNotMatch(detail.description, /docs\/PRODUCT_SPEC\.md/);
  assert.deepEqual(saved.evidence.at(-1), { label: 'My reference', path: 'docs/PRODUCT_SPEC.md' });
});

test('already completed reviews keep their delivered scope when project history expands', () => {
  const data = originalWorkspace();
  for (const id of ['DC-017', 'DC-018', 'DC-021']) {
    const task = data.tasks.find(task => task.id === id);
    Object.assign(task, { status: 'done', completedAt: '2026-09-23' });
  }
  const before = structuredClone(data), result = model.applyProjectUpdates(data);
  for (const id of ['DC-017', 'DC-018', 'DC-021']) assert.deepEqual(result.tasks.find(task => task.id === id), before.tasks.find(task => task.id === id));
});

test('successive reviewed batches catch up older boards without overwriting intervening edits', async () => {
  const { projectUpdates } = await import(updatesUrl);
  const first = model.applyProjectUpdates(originalWorkspace(), [projectUpdates[0]]);
  assert.equal(first.tasks.length, 38);
  assert.deepEqual(model.applyProjectUpdates(first), model.applyProjectUpdates(originalWorkspace()));
  const saved = structuredClone(first);
  const saves = saved.tasks.find(task => task.id === 'taste-today-saves');
  saves.description = 'My narrower unfinished save work';
  const menu = saved.tasks.find(task => task.id === 'taste-floating-menu');
  menu.status = 'todo';
  const result = model.applyProjectUpdates(saved);
  assert.deepEqual(result.tasks.find(task => task.id === saves.id), saves);
  assert.deepEqual(result.tasks.find(task => task.id === menu.id), menu);
  assert.equal(result.tasks.filter(task => task.id === 'taste-today-paper-actions').length, 1);
  assert.equal(model.validWorkspace(result), true);
});
