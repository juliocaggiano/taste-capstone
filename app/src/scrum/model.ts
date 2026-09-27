import { seedTasks, seedSprints, productGoal, definitionOfDone, type ScrumTask, type ScrumSprint } from './seed';
import { projectUpdates, type ProjectUpdate } from './projectUpdates';

export type Task = ScrumTask & { archived?: boolean; doneConfirmed?: boolean; descriptionConsolidated?: boolean; epicId?: string; epicNumber?: number };
export type Epic = { id: string; name: string; prefix: string; nextNumber: number };
export type Sprint = ScrumSprint & { reflection?: string; planning?: string; daily?: string; improvement?: string; capacity?: number; reconstructed?: boolean };
export type Workspace = { version: 1; tasks: Task[]; sprints: Sprint[]; productGoal: string; definitionOfDone: string[]; epics?: Epic[]; appliedProjectUpdates?: string[]; deletedTaskIds?: string[] };
export const STORAGE_KEY = 'daily-culture-scrum-v1';
export const statuses = ['todo', 'in-progress', 'done'] as const;
export const statusLabels = { todo: 'To do', 'in-progress': 'In progress', done: 'Done' };
export const pointOptions = [1, 2, 3, 5, 8, 13];
export const defaultEpics: Epic[] = [
  { id: 'product-design', name: 'Product Design', prefix: 'PD', nextNumber: 1 },
  { id: 'engineering', name: 'Engineering', prefix: 'ENG', nextNumber: 1 },
  { id: 'editorial', name: 'Editorial', prefix: 'ED', nextNumber: 1 },
  { id: 'user-research', name: 'User Research', prefix: 'UR', nextNumber: 1 },
  { id: 'capstone-planning', name: 'Capstone Planning', prefix: 'CP', nextNumber: 1 },
];
const seedEpicIds: Record<string, string> = {
  'DC-001': 'engineering', 'DC-002': 'engineering', 'DC-003': 'engineering',
  'DC-004': 'product-design', 'DC-005': 'capstone-planning', 'DC-006': 'capstone-planning',
  'DC-007': 'product-design', 'DC-008': 'product-design', 'DC-009': 'product-design',
  'DC-010': 'product-design', 'DC-011': 'engineering', 'DC-012': 'product-design',
  'DC-013': 'editorial', 'DC-014': 'capstone-planning', 'DC-015': 'capstone-planning',
  'DC-016': 'user-research', 'DC-017': 'product-design', 'DC-018': 'editorial',
  'DC-019': 'user-research', 'DC-020': 'capstone-planning', 'DC-021': 'editorial', 'DC-022': 'engineering',
};
const legacySprintNames: Record<string, string> = { 'sprint-1': 'Sprint 1 · Foundation', 'sprint-2': 'Sprint 2 · Design into learning' };
const semesterSprintOutlineUpdate = '2026-09-23-semester-sprint-outline';
const positiveSequence = (value: unknown): value is number => typeof value === 'number' && Number.isSafeInteger(value) && value > 0 && value < Number.MAX_SAFE_INTEGER;
const validPrefix = (value: unknown): value is string => typeof value === 'string' && /^[A-Z][A-Z0-9]{0,7}$/.test(value);

// Add the semester outline once to saved boards. Existing sprint dates and edits win
// over a template slot, and later user changes never cause that slot to reappear.
function addSemesterSprintOutline(data: Workspace): Workspace {
  if (data.appliedProjectUpdates?.includes(semesterSprintOutlineUpdate)) return data;
  const sprints = [...data.sprints];
  for (const template of seedSprints.slice(2)) {
    if (sprints.some(sprint => sprint.id === template.id || sprint.startDate <= template.endDate && sprint.endDate >= template.startDate)) continue;
    sprints.push({ ...template });
  }
  return { ...data, sprints, appliedProjectUpdates: [...(data.appliedProjectUpdates ?? []), semesterSprintOutlineUpdate] };
}

export const freshWorkspace = (): Workspace => addSemesterSprintOutline(applyProjectUpdates(normalizeWorkspace(structuredClone({ version: 1, tasks: seedTasks.map(task => ({ ...task, doneConfirmed: task.status === 'done' })), sprints: seedSprints, productGoal, definitionOfDone }))));
export function validWorkspace(value: unknown): value is Workspace {
  if (!value || typeof value !== 'object') return false;
  const v = value as Workspace;
  const date = (x: unknown): x is string => typeof x === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(x) && Number.isFinite(new Date(`${x}T12:00:00`).getTime()) && addDays(x, 0) === x;
  const optionalText = (x: unknown) => x === undefined || typeof x === 'string';
  const epics = v.epics;
  if (v.appliedProjectUpdates !== undefined && (!Array.isArray(v.appliedProjectUpdates) || !v.appliedProjectUpdates.every(id => typeof id === 'string' && id.length > 0) || new Set(v.appliedProjectUpdates).size !== v.appliedProjectUpdates.length)) return false;
  if (v.deletedTaskIds !== undefined && (!Array.isArray(v.deletedTaskIds) || !v.deletedTaskIds.every(id => typeof id === 'string' && id.length > 0) || new Set(v.deletedTaskIds).size !== v.deletedTaskIds.length)) return false;
  if (epics !== undefined && (!Array.isArray(epics) || !epics.every(epic => epic && typeof epic.id === 'string' && epic.id.trim().length > 0 && typeof epic.name === 'string' && epic.name.trim().length > 0 && validPrefix(epic.prefix) && positiveSequence(epic.nextNumber)) || new Set(epics.map(epic => epic.id)).size !== epics.length || new Set(epics.map(epic => epic.prefix)).size !== epics.length)) return false;
  const validTaskEpic = (task: Task) => task.epicId === undefined && task.epicNumber === undefined || typeof task.epicId === 'string' && positiveSequence(task.epicNumber) && Boolean(epics?.some(epic => epic.id === task.epicId));
  return v.version === 1 && typeof v.productGoal === 'string' && Array.isArray(v.definitionOfDone) && v.definitionOfDone.every(x => typeof x === 'string') &&
    Array.isArray(v.sprints) && v.sprints.length > 0 && v.sprints.every(s => s && typeof s.id === 'string' && typeof s.name === 'string' && date(s.startDate) && date(s.endDate) && addDays(s.startDate, 13) === s.endDate && typeof s.goal === 'string' && ['active', 'planned', 'closed'].includes(s.status) && typeof s.review === 'string' && typeof s.retrospective === 'string' && optionalText(s.reflection) && optionalText(s.planning) && optionalText(s.daily) && optionalText(s.improvement) && (s.capacity === undefined || Number.isFinite(s.capacity) && s.capacity >= 0)) &&
    v.sprints.every((s, i) => v.sprints.every((other, j) => i === j || s.endDate < other.startDate || s.startDate > other.endDate)) &&
    Array.isArray(v.tasks) && v.tasks.every(t => t && typeof t.id === 'string' && typeof t.title === 'string' && typeof t.description === 'string' && ['todo', 'in-progress', 'review', 'done'].includes(t.status) && validTaskEpic(t) && (t.points === null || pointOptions.includes(t.points)) && (t.sprintId === null || v.sprints.some(s => s.id === t.sprintId)) && typeof t.area === 'string' && ['High', 'Medium', 'Low'].includes(t.priority) && (t.dueDate === undefined || date(t.dueDate)) && (t.completedAt === undefined || date(t.completedAt)) && optionalText(t.historyNote) && (t.descriptionConsolidated === undefined || typeof t.descriptionConsolidated === 'boolean') && (t.archived === undefined || typeof t.archived === 'boolean') && (t.doneConfirmed === undefined || typeof t.doneConfirmed === 'boolean') && Array.isArray(t.acceptanceCriteria) && t.acceptanceCriteria.every(x => typeof x === 'string') && (!t.criteriaChecked || (Array.isArray(t.criteriaChecked) && t.criteriaChecked.every(x => typeof x === 'boolean'))) && Array.isArray(t.evidence) && t.evidence.every(x => x && typeof x.label === 'string' && typeof x.path === 'string')) &&
    new Set(v.tasks.filter(t => t.epicId).map(t => JSON.stringify([t.epicId, t.epicNumber]))).size === v.tasks.filter(t => t.epicId).length && new Set(v.tasks.map(t => t.id)).size === v.tasks.length && !(v.deletedTaskIds ?? []).some(id => v.tasks.some(task => task.id === id)) && new Set(v.sprints.map(s => s.id)).size === v.sprints.length && v.sprints.filter(s => s.status === 'active').length <= 1;
}
// Only legacy, unassigned tasks are inferred. Once assigned, title edits never change their epic.
function inferEpicId(task: Task): string {
  const seed = seedTasks.find(item => item.id === task.id);
  if (seed && task.title === seed.title) return seedEpicIds[task.id];
  const rules: [RegExp, string][] = [
    [/\b(editorial|content[- ]publishing|writing|calibration|story copy|translations?)\b/i, 'editorial'],
    [/\b(readers?|participants?|interviews?|usability|user research|reader study|pilot)\b/i, 'user-research'],
    [/\b(capstone|academic|handbook|track requirements|assignment|reflection requirements|sprint|business model|project brief)\b/i, 'capstone-planning'],
    [/\b(design|redesign|typography|visual|layout|spacing|components?|styles?|settings)\b/i, 'product-design'],
    [/\b(engineering|navigation|gestures?|authentication|accounts?|sync|cross-device|persistence|drafts?|bug|build|implement|prototype)\b/i, 'engineering'],
  ];
  return rules.find(([pattern]) => pattern.test(task.title))?.[1] ?? rules.find(([pattern]) => pattern.test(task.description))?.[1] ?? 'capstone-planning';
}

function allocateNumber(epic: Epic): number {
  if (epic.nextNumber >= Number.MAX_SAFE_INTEGER - 1) throw new Error('This epic has reached its task number limit.');
  return epic.nextNumber++;
}

// Version 1 remains readable. Codes are added without changing internal IDs, saved edits, or task order.
export function normalizeWorkspace(data: Workspace): Workspace & { epics: Epic[] } {
  const workspace = structuredClone(data);
  const epics = workspace.epics ?? structuredClone(defaultEpics);
  for (const epic of epics) {
    const highest = workspace.tasks.filter(task => task.epicId === epic.id).reduce((number, task) => Math.max(number, task.epicNumber ?? 0), 0);
    epic.nextNumber = Math.max(epic.nextNumber, highest + 1);
  }
  const assignments = new Map<string, { epicId: string; epicNumber: number }>();
  const seedOrder = new Map(seedTasks.map((task, index) => [task.id, index]));
  const unassigned = workspace.tasks.filter(task => !task.epicId).sort((a, b) => (seedOrder.get(a.id) ?? seedTasks.length) - (seedOrder.get(b.id) ?? seedTasks.length) || a.id.localeCompare(b.id));
  for (const task of unassigned) {
    const template = defaultEpics.find(epic => epic.id === inferEpicId(task))!;
    let epic = epics.find(item => item.id === template.id) ?? epics.find(item => item.prefix === template.prefix);
    if (!epic) { epic = { ...template }; epics.push(epic); }
    assignments.set(task.id, { epicId: epic.id, epicNumber: allocateNumber(epic) });
  }
  return {
    ...workspace,
    epics,
    tasks: workspace.tasks.map(task => ({ ...task, ...assignments.get(task.id), status: (task.status as string) === 'review' ? 'in-progress' : task.status })),
    sprints: workspace.sprints.map(sprint => ({ ...sprint, name: sprint.name === legacySprintNames[sprint.id] ? `Sprint ${sprint.id.slice('sprint-'.length)}` : sprint.name, reconstructed: sprint.reconstructed ?? sprint.id === 'sprint-1' })),
  };
}

export function taskCode(task: Task, epics: Epic[] = []): string {
  const epic = epics.find(item => item.id === task.epicId);
  return epic && task.epicNumber ? `${epic.prefix}-${String(task.epicNumber).padStart(3, '0')}` : task.id;
}

export function saveTask(data: Workspace, task: Task): Workspace {
  const workspace = normalizeWorkspace(data);
  const previous = workspace.tasks.find(item => item.id === task.id);
  const epicId = task.epicId ?? previous?.epicId ?? 'product-design';
  const epic = workspace.epics.find(item => item.id === epicId);
  if (!epic) throw new Error('Choose an epic for this task.');
  // Editing existing work cannot rewrite its sequence. Changing epic consumes a new number.
  const epicNumber = previous?.epicId === epicId ? previous.epicNumber! : allocateNumber(epic);
  const saved = { ...task, epicId, epicNumber, status: (task.status as string) === 'review' ? 'in-progress' as const : task.status };
  return { ...workspace, tasks: previous ? workspace.tasks.map(item => item.id === saved.id ? saved : item) : [...workspace.tasks, saved] };
}

// Keep the removal in the saved board. Future reviewed update batches may
// mention the same ID, so a missing task alone cannot represent a deletion.
export function deleteTask(data: Workspace, id: string): Workspace {
  if (!data.tasks.some(task => task.id === id)) return data;
  return {
    ...data,
    tasks: data.tasks.filter(task => task.id !== id),
    deletedTaskIds: [...(data.deletedTaskIds ?? []), id],
  };
}

export function addEpic(data: Workspace, input: { name: string; prefix: string }): Workspace {
  const name = input.name.trim(), prefix = input.prefix.trim().toUpperCase();
  if (!name) throw new Error('Give this epic a name.');
  if (!validPrefix(prefix)) throw new Error('Use 1–8 letters or numbers for the code, starting with a letter.');
  const workspace = normalizeWorkspace(data);
  if (workspace.epics.some(epic => epic.prefix === prefix)) throw new Error('This epic code is already in use.');
  if (workspace.epics.some(epic => epic.name.toLowerCase() === name.toLowerCase())) throw new Error('This epic name is already in use.');
  return { ...workspace, epics: [...workspace.epics, { id: `epic-${crypto.randomUUID()}`, name, prefix, nextNumber: 1 }] };
}

export function loadWorkspace(): { data: Workspace; error: string } {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { data: freshWorkspace(), error: '' };
    const value: unknown = JSON.parse(raw);
    if (!validWorkspace(value)) throw new Error('Invalid saved data');
    return { data: addSemesterSprintOutline(applyProjectUpdates(value)), error: '' };
  } catch {
    return { data: freshWorkspace(), error: 'Saved data could not be read. Your existing data has not been overwritten.' };
  }
}

// Reviewed, prompt-authored updates apply once to both new and existing boards.
// Existing IDs, edited fields, manual order, and sprint settings are never reseeded.
export function applyProjectUpdates(data: Workspace, updates: ProjectUpdate[] = projectUpdates): Workspace {
  let workspace: Workspace = normalizeWorkspace(data);
  const applied = new Set(workspace.appliedProjectUpdates ?? []);
  for (const update of updates) {
    if (applied.has(update.id)) continue;
    for (const addition of update.tasks) {
      if (workspace.tasks.some(task => task.id === addition.id) || workspace.deletedTaskIds?.includes(addition.id)) continue;
      const task = structuredClone(addition);
      const sprint = workspace.sprints.find(item => item.id === task.sprintId);
      if (!sprint || (sprint.status === 'closed' && task.status !== 'done')) task.sprintId = null;
      const template = defaultEpics.find(epic => epic.id === task.epicId);
      if (!template) throw new Error(`Unknown project epic: ${task.epicId}`);
      let epic = workspace.epics!.find(item => item.id === template.id) ?? workspace.epics!.find(item => item.prefix === template.prefix);
      if (!epic) { epic = { ...template }; workspace.epics!.push(epic); }
      workspace = saveTask(workspace, { ...task, epicId: epic.id });
    }
    for (const patch of update.patches) {
      const task = workspace.tasks.find(item => item.id === patch.taskId);
      if (!task || !Object.entries(patch.expected).every(([key, value]) => JSON.stringify(task[key as keyof Task]) === JSON.stringify(value))) continue;
      const next = { ...task, ...structuredClone(patch.changes), id: task.id };
      const nextSprint = workspace.sprints.find(sprint => sprint.id === next.sprintId);
      if (next.sprintId && (!nextSprint || (next.status !== 'done' && nextSprint.status === 'closed'))) next.sprintId = null;
      workspace = saveTask(workspace, next);
    }
    applied.add(update.id);
  }
  workspace.appliedProjectUpdates = [...applied];
  if (!validWorkspace(workspace)) throw new Error('The project update produced invalid data.');
  return workspace;
}
export function localDate() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
}
export function addDays(date: string, days: number) {
  const value = new Date(`${date}T12:00:00`); value.setDate(value.getDate() + days);
  return `${value.getFullYear()}-${String(value.getMonth() + 1).padStart(2, '0')}-${String(value.getDate()).padStart(2, '0')}`;
}
export const formatDate = (date?: string) => date ? new Date(`${date}T12:00:00`).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) : 'No date';
export const points = (tasks: Task[]) => tasks.reduce((sum, task) => sum + (task.points ?? 0), 0);
// Consolidate only when a task is opened. Saving commits the merged description;
// cancelling leaves the existing record untouched. Legacy backups use this same path.
export function taskWithDescription(task: Task): Task {
  if (task.descriptionConsolidated) return task;
  const original = task.description.trim();
  const seedNote = seedTasks.find(seed => seed.id === task.id)?.historyNote;
  // Keep generated provenance in the data and handoff, out of everyday task copy.
  const note = seedNote ? (task.historyNote ?? '').replace(seedNote, '').trim() : task.historyNote?.trim();
  const criteria = task.acceptanceCriteria.map(line => line.trim()).filter(line => line && !original.includes(line));
  // Evidence paths identify local project files. A published board must explain
  // the work in its own description instead of adding unreadable file paths.
  const description = [original, criteria.map(line => `- ${line}`).join('\n'), note && !original.includes(note) ? note : ''].filter(Boolean).join('\n\n');
  return { ...task, description, descriptionConsolidated: true };
}

// Older backups keep their original notes. A saved Reflection takes precedence,
// including an intentionally empty value, so deleted text is never reintroduced.
export function sprintReflection(sprint: Sprint): string {
  return sprint.reflection ?? [...new Set([sprint.planning, sprint.review, sprint.retrospective, sprint.improvement].map(note => note?.trim()).filter(Boolean))].join('\n\n');
}

export function completeSprint(data: Workspace, id: string): Workspace {
  const sprint = data.sprints.find(s => s.id === id);
  if (!sprint || sprint.status !== 'active') return data;
  return { ...data, sprints: data.sprints.map(s => s.id === id ? { ...s, status: 'closed' as const } : s), tasks: data.tasks.map(t => t.sprintId === id && t.status !== 'done' && !t.archived ? { ...t, sprintId: null } : t) };
}
