import { useEffect, useRef, useState, type ReactNode } from 'react';
import { ArrowDown, ArrowUp, Backlog, CalendarBlank, Check, CheckCircle, Circle, Kanban, ListBullets, Plus, Info, X, ProcessIconVariantContext, readProcessIconVariant } from './ProcessIcons';
import { AnimatePresence, motion, useIsPresent, useReducedMotion } from 'motion/react';
import { APP_LABEL, APP_NAME, displayBrand } from '../brand';
import { TaskSearch } from './TaskSearch';
import { type ScrumStatus } from './seed';
import { addDays, addEpic, completeSprint, deleteTask as deleteWorkspaceTask, formatDate, loadWorkspace, localDate, pointOptions, points, saveTask as saveWorkspaceTask, sprintReflection, taskCode, taskWithDescription, statuses, statusLabels, STORAGE_KEY, type Epic, type Sprint, type Task } from './model';
import { MorphingSelect } from '../design-system/MorphingSelect';
import './scrum.css';

type Page = 'project' | 'backlog' | 'about';
type View = 'Board' | 'List' | 'Sprint plan';
type NewEpic = { name: string; prefix: string };
const uid = () => crypto.randomUUID();
const statusOptions = statuses.map(value => ({ value, label: statusLabels[value] }));
const storyPointOptions = [{ value: '', label: 'Unestimated' }, ...pointOptions.map(value => ({ value: String(value), label: String(value) }))];
const sortOptions = [{ value: 'manual', label: 'Manual order' }, { value: 'date', label: 'Due date' }];
const sprintDateRange = (sprint: Sprint, showYear = false) => {
  const startYear = sprint.startDate.slice(0, 4), endYear = sprint.endDate.slice(0, 4);
  return startYear === endYear
    ? `${formatDate(sprint.startDate)} – ${formatDate(sprint.endDate)}${showYear ? `, ${startYear}` : ''}`
    : `${formatDate(sprint.startDate)} ${startYear} – ${formatDate(sprint.endDate)} ${endYear}`;
};

export function ScrumWorkspace({ topbar }: { topbar: ReactNode }) {
  const reducedMotion = useReducedMotion();
  const [iconVariant] = useState(readProcessIconVariant);
  const [loaded] = useState(loadWorkspace);
  const [data, setData] = useState(loaded.data);
  const [storageError, setStorageError] = useState(loaded.error);
  const canSave = !loaded.error;
  const [page, setPage] = useState<Page>('project');
  const [view, setView] = useState<View>('Board');
  const [sprintId, setSprintId] = useState(() => loaded.data.sprints.find(s => s.status === 'active')?.id ?? loaded.data.sprints[0].id);
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState('manual');
  const [draft, setDraft] = useState<Task | null>(null);
  const [notice, setNotice] = useState('');
  const [showDone, setShowDone] = useState(false);
  const [createSprint, setCreateSprint] = useState(false);
  const [retroId, setRetroId] = useState<string | null>(null);
  const sprint = data.sprints.find(s => s.id === sprintId) ?? data.sprints[0];
  const sprintTasks = data.tasks.filter(t => t.sprintId === sprint.id && !t.archived);
  const done = sprintTasks.filter(t => t.status === 'done');
  const epics = data.epics ?? [];
  const orderedSprints = [...data.sprints].sort((a, b) => a.startDate.localeCompare(b.startDate));
  const futureSprints = orderedSprints.filter(item => item.status === 'planned' && item.endDate >= localDate());

  useEffect(() => {
    if (!canSave) return;
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); setStorageError(''); }
    catch { setStorageError('Changes could not be saved. Keep this page open and free up browser storage.'); }
  }, [data, canSave]);
  useEffect(() => {
    if (!notice) return;
    const timer = window.setTimeout(() => setNotice(''), 5500);
    return () => window.clearTimeout(timer);
  }, [notice]);

  function patchTask(task: Task) {
    setData(current => saveWorkspaceTask(current, task));
  }
  function selectSprint(id: string) { setSprintId(id); setPage('project'); setQuery(''); setShowDone(false); }
  function newTask(status: ScrumStatus = 'todo') {
    // Legacy category defaults keep version-1 backups compatible; the UI does not use them.
    setDraft({ id: `task-${uid()}`, title: '', description: '', status, sprintId: page === 'backlog' || sprint.status === 'closed' ? null : sprint.id, epicId: epics[0]?.id, points: null, priority: 'Medium', area: 'Product', week: 'backlog', acceptanceCriteria: [], evidence: [], criteriaChecked: [], doneConfirmed: false });
  }
  function moveTask(id: string, status: ScrumStatus) {
    const storedTask = data.tasks.find(t => t.id === id);
    if (!storedTask || storedTask.status === status) return;
    const task = storedTask.archived ? { ...storedTask, sprintId: null, archived: false } : storedTask;
    if (data.sprints.find(s => s.id === task.sprintId)?.status === 'closed' && status !== 'done') { setDraft({ ...task, sprintId: null, status }); setNotice('Reopened work belongs in the backlog or a new sprint.'); return; }
    patchTask({ ...task, status, completedAt: status === 'done' ? localDate() : undefined });
    setNotice(`Moved “${displayBrand(task.title)}” to ${statusLabels[status]}.`);
  }
  function assignTaskToSprint(task: Task, id: string) {
    if (!id) return;
    const target = data.sprints.find(item => item.id === id && item.status === 'planned' && item.endDate >= localDate());
    if (!target) { setNotice('This sprint is no longer available. Choose another.'); return; }
    const index = filtered.findIndex(item => item.id === task.id);
    const nextTaskId = filtered[index + 1]?.id ?? filtered[index - 1]?.id;
    patchTask({ ...task, sprintId: target.id, archived: false });
    setNotice(`Moved “${displayBrand(task.title)}” to ${target.name}.`);
    window.requestAnimationFrame(() => {
      const nextRow = [...document.querySelectorAll<HTMLTableRowElement>('.scrum-table tbody tr[data-task-id]')]
        .find(row => row.dataset.taskId === nextTaskId);
      const focusTarget = nextRow?.querySelector<HTMLButtonElement>('.scrum-sprint-select .dc-morph-select-trigger')
        ?? document.querySelector<HTMLButtonElement>('[data-backlog-nav="true"]');
      focusTarget?.focus({ preventScroll: true });
    });
  }
  function reorder(id: string, direction: number) {
    const index = filtered.findIndex(t => t.id === id);
    const neighbor = filtered[index + direction];
    if (!neighbor) return;
    setData(current => {
      const tasks = [...current.tasks];
      const a = tasks.findIndex(t => t.id === id), b = tasks.findIndex(t => t.id === neighbor.id);
      [tasks[a], tasks[b]] = [tasks[b], tasks[a]];
      return { ...current, tasks };
    });
  }
  function updateSprint(next: Sprint) { setData(current => ({ ...current, sprints: current.sprints.map(s => s.id === next.id ? next : s) })); }
  // Old archived records remain intact until edited, and stay accessible in the backlog.
  let filtered = data.tasks.filter(t => page === 'backlog' ? t.archived || !t.sprintId : !t.archived && t.sprintId === sprint.id);
  filtered = filtered.filter(t => `${displayBrand(t.title)} ${displayBrand(t.description)} ${taskCode(t, epics)} ${epics.find(epic => epic.id === t.epicId)?.name ?? ''} ${t.id}`.toLowerCase().includes(query.toLowerCase()));
  if (sort === 'date') filtered = [...filtered].sort((a, b) => (a.dueDate ?? '9999').localeCompare(b.dueDate ?? '9999'));

  const card = (task: Task) => <article key={task.id} className="scrum-card" data-native-drag="true" draggable={!task.archived} onDragStart={event => { event.dataTransfer.setData('text/plain', task.id); event.dataTransfer.effectAllowed = 'move'; }} data-status={task.status}>
    <button className="scrum-card-open" type="button" onClick={() => setDraft(structuredClone(task))} aria-label={`Open ${displayBrand(task.title)}`}>
      <span className="scrum-card-id" title={epics.find(epic => epic.id === task.epicId)?.name}>{taskCode(task, epics)}</span>
      <span className="scrum-card-title">{task.status === 'done' ? <CheckCircle size={17} /> : <Circle size={17} />}{displayBrand(task.title)}</span>
      <span className="scrum-card-footer">{formatDate(task.dueDate ?? task.completedAt)}</span>
    </button>
  </article>;

  return <ProcessIconVariantContext.Provider value={iconVariant}><div className="scrum-workspace">
    {topbar}
    <div className="scrum-body">
      <aside className="scrum-sidebar">
        <div className="scrum-sidebar-heading"><div>{APP_NAME}<small>Capstone project</small></div></div>
        <nav className="scrum-sidebar-nav" aria-label="Process documentation navigation">
          <button aria-current={page === 'about' ? 'page' : undefined} onClick={() => setPage('about')}><Info size={17} />About</button>
          <button aria-current={page === 'project' ? 'page' : undefined} onClick={() => setPage('project')}><Kanban size={17} />Sprint board</button>
          <button data-backlog-nav="true" aria-current={page === 'backlog' ? 'page' : undefined} onClick={() => { setPage('backlog'); }}><Backlog size={17} />Product backlog</button>
        </nav>
        <div className="scrum-sidebar-label">Sprints <button className="scrum-icon-button" aria-label="Create sprint" onClick={() => setCreateSprint(true)}><Plus size={15} /></button></div>
        <nav className="scrum-sidebar-nav scrum-sprint-nav" aria-label="Sprints">{orderedSprints.map(s => <button key={s.id} aria-current={s.id === sprint.id && page === 'project' ? 'page' : undefined} onClick={() => selectSprint(s.id)}><span className={`scrum-sprint-dot ${s.status}`} /><span>{s.name}<small>{sprintDateRange(s)}</small></span>{s.status === 'closed' && <Check size={14} />}</button>)}</nav>
      </aside>
      <main className="scrum-main">
        <header className="scrum-project-header">
          <div className="scrum-project-title"><h1>{page === 'backlog' ? 'Product backlog' : page === 'about' ? 'About' : APP_LABEL}</h1></div>
          {page === 'project' && <nav className="scrum-tabs" aria-label="Project views">{(['Board', 'List', 'Sprint plan'] as View[]).map((item, i) => <button key={item} aria-current={view === item ? 'page' : undefined} onClick={() => setView(item)}>{i === 0 ? <Kanban size={15} /> : i === 1 ? <ListBullets size={15} /> : <CalendarBlank size={15} />}{item}{view === item && <motion.span className="scrum-tab-indicator" layoutId="process-view-indicator" transition={{ type: 'spring', bounce: 0, duration: reducedMotion ? 0 : .25 }} />}</button>)}</nav>}
        </header>
        {storageError && <div className="scrum-warning" role="alert">{storageError}</div>}
        <div className="scrum-view-stage"><AnimatePresence initial={false}><ViewSurface key={`${page}-${page === 'project' ? `${view}-${sprint.id}` : ''}`} >
        {page === 'about' ? <About /> : page === 'project' && view === 'Sprint plan' ? <SprintPlan epics={epics} sprint={sprint} tasks={sprintTasks} sprints={orderedSprints} onRetro={() => setRetroId(sprint.id)} onEdit={task => setDraft(structuredClone(task))} onSave={updateSprint} onCreate={() => setCreateSprint(true)} onActivate={() => { if (data.sprints.some(s => s.status === 'active' && s.id !== sprint.id)) { setNotice('Complete the active sprint before starting another.'); return; } if (!sprint.goal.trim()) { setNotice('Add a sprint goal first.'); return; } updateSprint({ ...sprint, status: 'active' }); }} onComplete={() => {
          setData(current => completeSprint(current, sprint.id));
          setNotice('Sprint completed.'); setRetroId(sprint.id);
        }} /> : <>
          {page === 'project' && <section className="scrum-sprint-summary"><div><div className="scrum-sprint-heading"><strong>{sprint.name}</strong><span>{sprintDateRange(sprint, true)}</span></div>{sprint.goal && <p>{displayBrand(sprint.goal)}</p>}</div><div className="scrum-progress-summary"><strong>{done.length}<span> / {sprintTasks.length} done</span></strong><progress className="scrum-progress" value={done.length} max={sprintTasks.length || 1} /><small>{points(done)} / {points(sprintTasks)} estimated points</small></div></section>}
          <div className="scrum-toolbar">
            <button className="scrum-button scrum-primary" onClick={() => newTask()}><Plus size={15} />Add task</button>
            <TaskSearch value={query} onChange={setQuery} />
            <div className="scrum-toolbar-filters"><MorphingSelect className="scrum-filter-select" ariaLabel="Sort tasks" value={sort} onChange={setSort} options={sortOptions} duration={380} /></div>
          </div>
          <div className="scrum-content">
            {page === 'project' && view === 'Board' ? <div className="scrum-board">{statuses.map(status => {
              const tasks = filtered.filter(t => t.status === status), displayed = status === 'done' && !showDone ? tasks.slice(0, 4) : tasks;
              return <section className="scrum-column" key={status} aria-label={`${statusLabels[status]} column`} onDragOver={event => { event.preventDefault(); event.dataTransfer.dropEffect = 'move'; }} onDrop={event => { event.preventDefault(); moveTask(event.dataTransfer.getData('text/plain'), status); }}><header className="scrum-column-heading"><h2>{statusLabels[status]}</h2><button className="scrum-icon-button" aria-label={`Add task to ${statusLabels[status]}`} onClick={() => newTask(status)}><Plus size={16} /></button></header>{displayed.map(card)}{status === 'done' && tasks.length > 4 && <button className="scrum-add-task" onClick={() => setShowDone(!showDone)}>{showDone ? 'Show fewer' : 'Show all completed tasks'}</button>}<button className="scrum-add-task" onClick={() => newTask(status)}><Plus size={15} />Add task</button></section>;
            })}</div> : <div className={`scrum-list-wrap${page === 'backlog' ? ' scrum-backlog-list' : ''}`}>
              <div className="scrum-list-heading"><h2>{page === 'backlog' ? 'Ready for a future sprint' : sprint.name}</h2><span>{filtered.length} tasks · {points(filtered)} estimated points</span></div>
              <table className="scrum-table">
                <thead><tr><th>Task name</th><th>Status</th>{page === 'backlog' && <th>Sprint</th>}<th>Due date</th><th>Points</th><th>Order</th></tr></thead>
                <tbody>{filtered.map((task, i) => <tr key={task.id} data-task-id={task.id}>
                  <td><button className="scrum-task-link" onClick={() => setDraft(structuredClone(task))}>{task.status === 'done' ? <CheckCircle size={17} /> : <Circle size={17} />}<span>{displayBrand(task.title)}<small>{taskCode(task, epics)}</small></span></button></td>
                  <td><MorphingSelect className="scrum-status-select" ariaLabel={`Status for ${displayBrand(task.title)}`} value={task.status} onChange={value => moveTask(task.id, value as ScrumStatus)} options={statusOptions} duration={350} /></td>
                  {page === 'backlog' && <td><MorphingSelect className="scrum-sprint-select" ariaLabel={`Sprint for ${displayBrand(task.title)}`} value="" onChange={value => assignTaskToSprint(task, value)} options={[{ value: '', label: 'Product backlog' }, ...futureSprints.map(item => ({ value: item.id, label: `${item.name} · ${sprintDateRange(item)}` }))]} disabled={!futureSprints.length} duration={350} /></td>}
                  <td>{formatDate(task.dueDate ?? task.completedAt)}</td>
                  <td>{task.points ?? '–'}</td>
                  <td><div className="scrum-order"><button className="scrum-icon-button" aria-label={`Move ${displayBrand(task.title)} up`} disabled={i === 0 || sort !== 'manual'} onClick={() => reorder(task.id, -1)}><ArrowUp size={14} /></button><button className="scrum-icon-button" aria-label={`Move ${displayBrand(task.title)} down`} disabled={i === filtered.length - 1 || sort !== 'manual'} onClick={() => reorder(task.id, 1)}><ArrowDown size={14} /></button></div></td>
                </tr>)}</tbody>
              </table>
              {!filtered.length && <p className="scrum-empty">No tasks match this view. Change your search or add a task.</p>}
            </div>}
          </div>
        </>}
        </ViewSurface></AnimatePresence></div>
      </main>
    </div>
    <WorkspaceToast notice={notice} />
    <AnimatePresence>{draft && <TaskEditor key={draft.id} task={draft} isExisting={data.tasks.some(item => item.id === draft.id)} sprints={data.sprints} epics={epics} onClose={() => setDraft(null)} onDelete={() => {
      setData(current => deleteWorkspaceTask(current, draft.id));
      setNotice(`Deleted “${displayBrand(draft.title)}”.`);
      setDraft(null);
    }} onSave={(task, newEpic) => {
      const next = newEpic ? addEpic(data, newEpic) : data;
      const savedTask = newEpic ? { ...task, epicId: next.epics!.at(-1)!.id } : task;
      setData(saveWorkspaceTask(next, savedTask));
      setDraft(null); setNotice('Task saved.');
    }} />}</AnimatePresence>
    <AnimatePresence>{createSprint && <NewSprint key="new-sprint" sprints={data.sprints} onClose={() => setCreateSprint(false)} onSave={next => { setData(current => ({ ...current, sprints: [...current.sprints, next] })); selectSprint(next.id); setView('Sprint plan'); setCreateSprint(false); }} />}</AnimatePresence>
    <AnimatePresence>{retroId && <Retrospective key={retroId} sprint={data.sprints.find(item => item.id === retroId)!} onClose={() => setRetroId(null)} onSave={next => { updateSprint(next); setRetroId(null); setNotice('Retrospective saved.'); }} />}</AnimatePresence>
  </div></ProcessIconVariantContext.Provider>;
}

function ViewSurface({ children }: { children: ReactNode }) {
  const present = useIsPresent();
  const reducedMotion = useReducedMotion();
  return <motion.div className="scrum-view-surface" inert={!present} aria-hidden={!present} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: reducedMotion ? 0 : .18, ease: 'easeOut' }} style={{ zIndex: present ? 1 : 0, pointerEvents: present ? 'auto' : 'none' }}>{children}</motion.div>;
}

function WorkspaceToast({ notice }: { notice: string }) {
  const [message, setMessage] = useState(notice);
  useEffect(() => { if (notice) setMessage(notice); }, [notice]);
  return <div className="scrum-toast" data-visible={Boolean(notice)}><span aria-hidden="true">{message}</span><span className="scrum-sr-only" role="status">{notice}</span></div>;
}

function Modal({ title, children, onClose }: { title: string; children: ReactNode; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  const present = useIsPresent();
  const reducedMotion = useReducedMotion();
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    const dialog = ref.current;
    const workspace = dialog?.closest('.scrum-workspace');
    dialog?.showModal();
    return () => {
      dialog?.close();
      const fallback = workspace?.querySelector<HTMLElement>('.scrum-tabs button[aria-current="page"], .scrum-sidebar-nav button[aria-current="page"]');
      const target = previous?.isConnected && !previous.closest('[inert]') ? previous : fallback;
      target?.focus({ preventScroll: true });
    };
  }, []);
  return <motion.dialog ref={ref} className="scrum-panel" aria-label={title} data-exiting={!present} inert={!present} initial={{ opacity: 0, x: reducedMotion ? 0 : 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: reducedMotion ? 0 : 12 }} transition={{ duration: reducedMotion ? 0 : .2, ease: [.22, 1, .36, 1] }} onCancel={event => { event.preventDefault(); event.stopPropagation(); onClose(); }}><header className="scrum-panel-header"><span>{title}</span><button className="scrum-icon-button" aria-label="Close panel" onClick={onClose}><X size={20} /></button></header>{children}</motion.dialog>;
}

function TaskEditor({ task, isExisting, sprints, epics, onSave, onDelete, onClose }: { task: Task; isExisting: boolean; sprints: Sprint[]; epics: Epic[]; onSave: (task: Task, newEpic?: NewEpic) => void; onDelete: () => void; onClose: () => void }) {
  const [draft, setDraft] = useState(() => { const merged = taskWithDescription(task.archived ? { ...task, sprintId: null, archived: false } : task); return { ...merged, title: displayBrand(merged.title), description: displayBrand(merged.description) }; }), [error, setError] = useState('');
  const [newEpic, setNewEpic] = useState<NewEpic | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const deleteTrigger = useRef<HTMLButtonElement>(null);
  const keepTask = useRef<HTMLButtonElement>(null);
  useEffect(() => { if (confirmDelete) keepTask.current?.focus(); }, [confirmDelete]);
  const patch = (values: Partial<Task>) => setDraft(current => ({ ...current, ...values }));
  const epic = epics.find(item => item.id === draft.epicId);
  const code = newEpic ? `${newEpic.prefix.trim().toUpperCase() || '…'}-001` : taskCode({ ...draft, epicNumber: task.epicId === draft.epicId && task.epicNumber ? task.epicNumber : epic?.nextNumber }, epics);
  function saveTask(next: Task) {
    if (!next.title.trim()) { setError('Give this task a name.'); return; }
    if (sprints.find(s => s.id === next.sprintId)?.status === 'closed' && next.status !== 'done') { setError('Move unfinished work to the product backlog or an open sprint.'); return; }
    try { onSave({ ...next, title: next.title.trim(), completedAt: next.status === 'done' ? next.completedAt ?? localDate() : undefined }, newEpic ?? undefined); }
    catch (cause) { setError(cause instanceof Error ? cause.message : 'This task could not be saved.'); }
  }
  return <Modal title={code} onClose={onClose}><form className="scrum-form" onSubmit={event => { event.preventDefault(); if (!confirmDelete) saveTask(draft); }}>
    <label className="scrum-field scrum-title-field">Task name<input autoFocus required value={draft.title} onChange={event => patch({ title: event.target.value })} placeholder="What needs to happen?" /></label>
    <div className="scrum-field"><span>Epic</span><MorphingSelect className="scrum-field-select" ariaLabel="Epic" value={newEpic ? '__new__' : draft.epicId ?? ''} onChange={value => { setError(''); if (value === '__new__') setNewEpic({ name: '', prefix: '' }); else { setNewEpic(null); patch({ epicId: value }); } }} options={[...epics.map(item => ({ value: item.id, label: `${item.name} · ${item.prefix}` })), { value: '__new__', label: 'New epic…' }]} duration={350} /></div>
    {newEpic && <div className="scrum-field-grid"><label className="scrum-field">Epic name<input required maxLength={80} value={newEpic.name} onChange={event => setNewEpic({ ...newEpic, name: event.target.value })} placeholder="Product Design" /></label><label className="scrum-field">Code prefix<input required minLength={1} maxLength={8} pattern="[A-Za-z][A-Za-z0-9]{0,7}" value={newEpic.prefix} onChange={event => setNewEpic({ ...newEpic, prefix: event.target.value.toUpperCase() })} placeholder="PD" /></label></div>}
    <div className="scrum-field-grid">
      <div className="scrum-field"><span>Status</span><MorphingSelect className="scrum-field-select" ariaLabel="Status" value={draft.status} onChange={value => patch({ status: value as ScrumStatus })} options={statusOptions} duration={350} /></div>
      <div className="scrum-field"><span>Story points</span><MorphingSelect className="scrum-field-select" ariaLabel="Story points" value={draft.points === null ? '' : String(draft.points)} onChange={value => patch({ points: value ? Number(value) : null })} options={storyPointOptions} duration={350} /></div>
      <div className="scrum-field"><span>Sprint</span><MorphingSelect className="scrum-field-select" ariaLabel="Sprint" value={draft.sprintId ?? ''} onChange={value => patch({ sprintId: value || null })} options={[{ value: '', label: 'Product backlog' }, ...sprints.map(item => ({ value: item.id, label: `${item.name} · ${item.status}` }))]} duration={350} /></div>
      <label className="scrum-field">Due date<input type="date" value={draft.dueDate ?? ''} onChange={event => patch({ dueDate: event.target.value || undefined })} /></label>
    </div>
    <label className="scrum-field scrum-description-field">Description<textarea rows={10} value={draft.description} onChange={event => patch({ description: event.target.value })} placeholder="Add a description" /></label>
    {error && <p className="scrum-warning" role="alert">{error}</p>}
    {confirmDelete ? <div className="scrum-delete-confirmation" role="group" aria-labelledby="scrum-delete-heading" aria-describedby="scrum-delete-description">
      <strong id="scrum-delete-heading">Delete this task?</strong>
      <p id="scrum-delete-description">{code} · “{displayBrand(task.title)}” will be removed from this board. This cannot be undone.</p>
      <div className="scrum-delete-actions"><button ref={keepTask} type="button" className="scrum-button" onClick={() => { setConfirmDelete(false); window.requestAnimationFrame(() => deleteTrigger.current?.focus()); }}>Keep task</button><button type="button" className="scrum-button scrum-primary" onClick={onDelete}>Delete task</button></div>
    </div> : <footer className="scrum-form-actions">{isExisting && <button ref={deleteTrigger} type="button" className="scrum-button scrum-delete-trigger" onClick={() => setConfirmDelete(true)}>Delete task</button>}<button type="button" className="scrum-button" onClick={onClose}>Cancel</button>{task.title && (draft.sprintId || task.archived) && <button type="button" className="scrum-button" onClick={() => saveTask({ ...draft, sprintId: null, archived: false })}>Move to backlog</button>}<button className="scrum-button scrum-primary" type="submit">Save task</button></footer>}
  </form></Modal>;
}

function SprintPlan({ epics, sprint, tasks, sprints, onRetro, onEdit, onSave, onCreate, onActivate, onComplete }: { epics: Epic[]; sprint: Sprint; tasks: Task[]; sprints: Sprint[]; onRetro: () => void; onEdit: (task: Task) => void; onSave: (sprint: Sprint) => void; onCreate: () => void; onActivate: () => void; onComplete: () => void }) {
  return <div className="scrum-content scrum-plan"><div className="scrum-section-heading"><label className="scrum-field scrum-sprint-name">Sprint name<input aria-label="Sprint name" value={sprint.name} onChange={event => onSave({ ...sprint, name: event.target.value })} onBlur={event => { if (!event.target.value.trim()) onSave({ ...sprint, name: `Sprint ${sprints.findIndex(item => item.id === sprint.id) + 1}` }); }} /></label><button className="scrum-button" onClick={onCreate}><Plus size={15} />New sprint</button></div>
    <div className="scrum-plan-fields"><label className="scrum-field">Sprint goal<textarea rows={2} value={displayBrand(sprint.goal)} onChange={event => onSave({ ...sprint, goal: event.target.value })} /></label><label className="scrum-field">Point budget · optional<input type="number" min="0" value={sprint.capacity ?? ''} onChange={event => onSave({ ...sprint, capacity: event.target.value ? Math.max(0, Number(event.target.value)) : undefined })} /></label></div>
    <div className="scrum-point-reference">References · previous sprints</div>
    <div className="scrum-week-grid">{[0, 1].map(index => { const start = addDays(sprint.startDate, index * 7), end = addDays(start, 6); const items = tasks.filter(t => { const date = t.dueDate ?? t.completedAt; return date && date >= start && date <= end; }); return <section className="scrum-week" key={start}><span className="scrum-eyebrow">Week {index + 1}</span><h3>{formatDate(start)} – {formatDate(end)}</h3>{items.map(task => <button key={task.id} className="scrum-plan-task" onClick={() => onEdit(task)}>{task.status === 'done' ? <CheckCircle size={17} /> : <Circle size={17} />}<span>{displayBrand(task.title)}<small>{taskCode(task, epics)} · {formatDate(task.dueDate ?? task.completedAt)}</small></span><span className="scrum-points">{task.points ?? '–'}</span></button>)}{!items.length && <p className="scrum-muted">No dated tasks in this week.</p>}</section>; })}</div>
    {tasks.some(t => { const date = t.dueDate ?? t.completedAt; return !date || date < sprint.startDate || date > sprint.endDate; }) && <section className="scrum-note"><h3>Unscheduled or outside sprint dates</h3>{tasks.filter(t => { const date = t.dueDate ?? t.completedAt; return !date || date < sprint.startDate || date > sprint.endDate; }).map(t => <button className="scrum-task-link" key={t.id} onClick={() => onEdit(t)}>{displayBrand(t.title)} · {formatDate(t.dueDate ?? t.completedAt)}</button>)}</section>}

    {sprint.status === 'closed' && <div className="scrum-form-actions"><button className="scrum-button" onClick={onRetro}>Retrospective</button></div>}
    {sprint.status !== 'closed' && <div className="scrum-form-actions">{sprint.status === 'active' && <button className="scrum-button scrum-primary" onClick={onComplete}>Complete sprint</button>}{sprint.status === 'planned' && <button className="scrum-button scrum-primary" disabled={sprints.some(s => s.status === 'active')} onClick={onActivate}>Start sprint</button>}</div>}
  </div>;
}

function Retrospective({ sprint, onSave, onClose }: { sprint: Sprint; onSave: (sprint: Sprint) => void; onClose: () => void }) {
  const [reflection, setReflection] = useState(() => displayBrand(sprintReflection(sprint)));
  return <Modal title={`${sprint.name} · Retrospective`} onClose={onClose}><form className="scrum-form" onSubmit={event => { event.preventDefault(); onSave({ ...sprint, reflection }); }}><label className="scrum-field">Reflection<textarea autoFocus rows={10} value={reflection} onChange={event => setReflection(event.target.value)} placeholder="What worked? What would you improve?" /></label><footer className="scrum-form-actions"><button type="button" className="scrum-button" onClick={onClose}>Cancel</button><button type="submit" className="scrum-button scrum-primary">Save</button></footer></form></Modal>;
}

function About() {
  return <div className="scrum-content scrum-about"><p>This process documentation is based on the Scrum framework. Scrum is a methodology for product development teams to develop projects through short work cycles called sprints. Each sprint has a clear business goal and a set of tasks that produce a useful outcome. The results are then reviewed at the end of each sprint, also called retros, which are used to inform future iterations. {APP_NAME} adapts this approach for a solo capstone project in biweekly sprints. You can access the product backlog to see the list of future work waiting to be assigned to a designated sprint and check the sprint board to see which tasks are in progress this iteration cycle. For more information, please visit the <a href="https://scrumguides.org/scrum-guide.html" target="_blank" rel="noreferrer">Scrum Guide</a>.</p></div>;
}

function NewSprint({ sprints, onSave, onClose }: { sprints: Sprint[]; onSave: (sprint: Sprint) => void; onClose: () => void }) {
  const latest = [...sprints].sort((a, b) => b.endDate.localeCompare(a.endDate))[0];
  const [start, setStart] = useState(addDays(latest.endDate, 1)), [name, setName] = useState(`Sprint ${sprints.length + 1}`), [goal, setGoal] = useState(''), [error, setError] = useState('');
  const end = start ? addDays(start, 13) : '';
  return <Modal title="Plan a new sprint" onClose={onClose}><form className="scrum-form" onSubmit={event => { event.preventDefault(); if (!start || !name.trim() || !goal.trim()) return; if (sprints.some(s => start <= s.endDate && end >= s.startDate)) { setError('Sprints cannot overlap. Choose a date after the previous sprint.'); return; } onSave({ id: `sprint-${uid()}`, name: name.trim(), startDate: start, endDate: end, goal: goal.trim(), status: 'planned', review: '', retrospective: '' }); }}><label className="scrum-field">Sprint name<input required value={name} onChange={event => setName(event.target.value)} /></label><label className="scrum-field">Start date<input required type="date" value={start} onChange={event => setStart(event.target.value)} /></label><p>Ends {formatDate(end)}. Every sprint lasts 14 days.</p><label className="scrum-field">Sprint goal<textarea required rows={3} value={goal} onChange={event => setGoal(event.target.value)} /></label>{error && <p role="alert" className="scrum-warning">{error}</p>}<footer className="scrum-form-actions"><button type="button" className="scrum-button" onClick={onClose}>Cancel</button><button type="submit" className="scrum-button scrum-primary">Create sprint</button></footer></form></Modal>;
}
