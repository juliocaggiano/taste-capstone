import { seedTasks, type ScrumTask } from './seed';
import type { Task } from './model';

export type ProjectTask = ScrumTask & { epicId: string; descriptionConsolidated: true; doneConfirmed: boolean };
export type ProjectPatch = { taskId: string; expected: Partial<Task>; changes: Partial<Task> };
export type ProjectUpdate = { id: string; tasks: ProjectTask[]; patches: ProjectPatch[] };

// Append reviewed updates; never rewrite a batch already applied to a saved board.
// The agent verifies sources and current task state before authoring another batch.
const record = (id: string, title: string, epicId: string, status: ScrumTask['status'], date: string | undefined, points: number | null, description: string, sources: string[], sprintId: string | null = 'sprint-2'): ProjectTask => ({
  id: `taste-${id}`, title, epicId, status, sprintId, points, description,
  ...(status === 'done' ? { completedAt: date } : date ? { dueDate: date } : {}),
  week: sprintId === null ? 'backlog' : sprintId === 'sprint-1' ? 'week-1' : date && date < '2026-09-21' ? 'week-3' : 'week-4',
  area: 'Product', priority: 'Medium', acceptanceCriteria: [], evidence: sources.map(path => ({ label: 'Project record', path })),
  descriptionConsolidated: true, doneConfirmed: status === 'done',
  historyNote: status === 'done'
    ? 'Reconciled on 23 September from project chats and dated evidence. Completion records the stated artifact or receipt, not broader approval. Points are retrospective estimates.'
    : 'Reconciled on 23 September from active work and explicit next steps. Dates are personal planning targets; points are provisional estimates.',
});
const original = (id: string) => seedTasks.find(task => task.id === id)!;
const descriptionPatch = (id: string, description: string, title?: string): ProjectPatch => ({
  taskId: id,
  expected: { title: original(id).title, description: original(id).description, status: ['DC-017', 'DC-018'].includes(id) ? 'in-progress' : 'todo', completedAt: undefined, archived: undefined, descriptionConsolidated: undefined, acceptanceCriteria: original(id).acceptanceCriteria, evidence: original(id).evidence, historyNote: original(id).historyNote },
  changes: { description, descriptionConsolidated: true, ...(title ? { title } : {}) },
});
const startReview = (id: string): ProjectPatch => ({
  taskId: id,
  expected: { title: original(id).title, status: 'todo', sprintId: 'sprint-2', archived: undefined, completedAt: undefined },
  changes: { status: 'in-progress' },
});

export const projectUpdates: ProjectUpdate[] = [{
  id: '2026-09-23-sprint-foundation',
  tasks: [
    record('moma-exploration', 'Implement the MoMA design exploration', 'product-design', 'done', '2026-09-05', 5,
      'Build the earlier museum-inspired visual exploration across the core screens and verify both device previews, themes, locales, and navigation. Later Artsy and compact monochrome work supersedes this version.',
      ['qa/moma/VERIFICATION.md'], 'sprint-1'),
    record('reflection-period-1', 'Submit the first biweekly capstone reflection', 'capstone-planning', 'done', '2026-09-16', 1,
      'The September 16 Google Forms receipt confirms submission of Reflection Period 1. It records receipt, not a grade or instructor approval.',
      ['docs/academic/ACADEMIC_CONTEXT_UPDATE_2026-09-19.md']),
    record('selection-motion', 'Build shared selection and feedback interactions', 'product-design', 'done', '2026-09-21', 3,
      'Add Morphing Select and moving selection pills across the workspace, prototype, and design-system examples. Refine like motion, compact stable counts, the three-gray palette, and the save toast.',
      ['qa/morphing-selection-2026-09-21/verification.md', 'qa/compact-like-counts-2026-09-21/verification.md', 'qa/stable-likes-palette-2026-09-21/verification.md', 'qa/compact-toast-2026-09-21/verification.md']),
    record('artwork-information', 'Add artwork information and creator following', 'engineering', 'done', '2026-09-21', 3,
      'Add sourced technical information and creator biographies to artwork reading. Share the Follow control with the design system and retain followed creators locally across profiles and Favourites.',
      ['qa/artwork-information-2026-09-21/verification.md', 'qa/follow-interaction-2026-09-21/verification.md']),
    record('reading-refinement', 'Refine Daily reading and artwork controls', 'product-design', 'done', '2026-09-21', 2,
      'Remove redundant reading copy and dividers, refine spacing, and reduce viewer captions and controls. Keep the revised Socrates text and its editorial acceptance distinct.',
      ['qa/daily-editorial-2026-09-21/verification.md']),
    record('discover-layout', 'Build Discover and related artwork cards', 'product-design', 'done', '2026-09-21', 3,
      'Implement the measured Paper discovery layout, functional filters, retained browse state, and consistent horizontal related cards. The later merged Search page builds on this work.',
      ['qa/discover-paper-2026-09-21/verification.md', 'qa/related-cards-2026-09-21/verification.md']),
    record('creator-profiles', 'Build and refine creator profiles', 'product-design', 'done', '2026-09-22', 5,
      'Add Overview, Biography, and Artworks with actual artwork counts, sorting, saved-work filtering, a full-width cover, and refined Follow controls. Implementation is verified; broader visual review remains open.',
      ['qa/creator-reference-2026-09-21/verification.md', 'qa/creator-refinement-2026-09-22/verification.md']),
    record('creator-slide', 'Implement the selected Slide back transition', 'product-design', 'done', '2026-09-23', 2,
      'Adopt the full-size Slide back transition selected by Julio. Preserve scroll position and focus when closing a creator profile, including reduced-motion behavior.',
      ['qa/creator-motion-variations-2026-09-23/verification.md']),
    record('editorial-guide', 'Audit editorial feedback and refine the writing guide', 'editorial', 'done', '2026-09-21', 3,
      'Reconcile the calibration feedback and refine the writing guide through version 0.18. Preserve explicit preferences, rejected drafts, and source distinctions without treating guide completion as approval of new entries.',
      ['docs/editorial/EDITORIAL_AUDIT_2026-09-21.md', 'docs/editorial/research-2026-09-21/AUDIT_VERIFICATION.md', 'docs/editorial/VOICE_GUIDE.md']),
    record('editorial-batch', 'Prepare the first seven-art editorial batch', 'editorial', 'done', '2026-09-21', 5,
      'Stage 21 English entries, three per art form, with writing, sources, image records, and local review pages. The batch is prepared for review; its entries remain unapproved and are not imported into the app.',
      ['docs/editorial/batches/batch-001/README.md', 'docs/editorial/batches/batch-001/verification.md']),
    record('editorial-images', 'Build the editorial image direction study', 'product-design', 'done', '2026-09-23', 3,
      'Prepare architecture and sculpture studies, vinyl treatments, and three local film frames. Apply the selected photographic vinyl surround. Architecture and sculpture fidelity still need a separate refinement pass.',
      ['docs/editorial/batches/batch-001/visual-study/README.md', 'docs/editorial/batches/batch-001/visual-study/verification.md']),
    record('process-workspace', 'Build and simplify Process documentation', 'capstone-planning', 'done', '2026-09-23', 5,
      'Deliver the personal sprint board, list, backlog, planning, and retrospective. Add epic task codes, simplify the solo workflow, adopt Taste (V1.2), and refine shared workspace navigation and motion.',
      ['qa/scrum-2026-09-21/verification.md', 'qa/process-epics-2026-09-23/verification.md', 'qa/taste-refinement-2026-09-23/verification.md']),
    record('today-saves', 'Add saves and personal boards to Today', 'engineering', 'in-progress', '2026-09-24', 3,
      'Replace Today’s favourite action with save count, Save, board selection and creation, and full-screen access. Verify saved state, keyboard behavior, and both phone previews before closing this task.',
      ['app/src/TodaySaveActions.tsx', 'app/src/today-boards.ts']),
    record('floating-menu', 'Refine the floating menu and merged Search page', 'product-design', 'in-progress', '2026-09-24', 3,
      'Combine Search and Discover and refine the five-control light-glass menu. The initial study is implemented; finish the current refinement and record the chosen result. Create remains a placeholder.',
      ['qa/floating-menu-2026-09-23/verification.md']),
    record('create-flow', 'Define the Create flow', 'product-design', 'todo', undefined, null,
      'Decide what Create should offer and how it connects to contributions. Replace the current placeholder only after the flow is defined.',
      ['qa/floating-menu-2026-09-23/verification.md'], null),
    record('object-images', 'Refine architecture and sculpture images', 'product-design', 'todo', undefined, null,
      'Revisit the deferred Borobudur and Great Buddha studies. Correct reconstructed or missing details against the original references, then record approval for the selected image revision.',
      ['docs/editorial/batches/batch-001/visual-study/verification.md'], null),
  ],
  patches: [
    startReview('DC-017'),
    startReview('DC-018'),
    descriptionPatch('DC-017', 'Review Today, the artwork viewer, creator profiles, Discover/Search, the floating menu, and the design-system library. Record accepted choices and remaining corrections. The selected Slide back transition is already implemented; the broader review is still underway.'),
    descriptionPatch('DC-018', 'Review the 21 staged entries and their supporting images. Record writing and image approvals by entry and revision, then choose a small reader-pilot set. Preserve earlier preferred drafts without treating them as batch approval.', 'Review the staged editorial batch'),
    descriptionPatch('DC-021', 'Map approved entries into the app’s reader fields and chosen content store. Resolve the seven-art taxonomy, prepare locale versions, and finish image-use checks. Keep provenance and approval attached to each revision; no batch has been imported yet.'),
    { taskId: 'DC-015', expected: { status: 'todo', dueDate: '2026-09-21', sprintId: 'sprint-2' }, changes: { dueDate: '2026-09-24' } },
    { taskId: 'DC-016', expected: { status: 'todo', dueDate: '2026-09-22', sprintId: 'sprint-2' }, changes: { dueDate: '2026-09-25' } },
  ],
}];

// These chats finished while the foundation was being assembled. Keep their
// verified delivery separate from the new Paper correction that followed it.
projectUpdates.push({
  id: '2026-09-23-latest-deliveries',
  tasks: [record('today-paper-actions', 'Match Today action buttons to Paper', 'product-design', 'in-progress', '2026-09-24', 2,
    'Refine the saved-count pill, text-only Save control, and expand button against Paper node 1TC-0. Preserve save and board behavior while checking compact spacing in both phone previews.',
    ['qa/sprint-foundation-2026-09-23/history-review.md'])],
  patches: [
    { taskId: 'taste-today-saves', expected: { title: projectUpdates[0].tasks.find(task => task.id === 'taste-today-saves')!.title, description: projectUpdates[0].tasks.find(task => task.id === 'taste-today-saves')!.description, status: 'in-progress', completedAt: undefined, dueDate: '2026-09-24' }, changes: { status: 'done', completedAt: '2026-09-23', dueDate: undefined } },
    { taskId: 'taste-today-saves', expected: { status: 'done', completedAt: '2026-09-23', description: projectUpdates[0].tasks.find(task => task.id === 'taste-today-saves')!.description, historyNote: projectUpdates[0].tasks.find(task => task.id === 'taste-today-saves')!.historyNote, evidence: projectUpdates[0].tasks.find(task => task.id === 'taste-today-saves')!.evidence }, changes: {
      description: 'Add saved count, Save, board selection and creation, and full-screen access to Today. Verify persistence, keyboard behavior, Daily gestures, and both phone previews. The count uses prototype samples, not measured adoption. Later Paper styling is tracked separately.',
      evidence: [{ label: 'Save and board verification', path: 'qa/today-save-2026-09-23/verification.md' }],
      historyNote: 'Verified September 23 after the foundation snapshot. Done covers the implemented save/board behavior. Points are retrospective estimates; later visual corrections remain separate.', doneConfirmed: true,
    } },
    { taskId: 'taste-floating-menu', expected: { title: projectUpdates[0].tasks.find(task => task.id === 'taste-floating-menu')!.title, description: projectUpdates[0].tasks.find(task => task.id === 'taste-floating-menu')!.description, status: 'in-progress', completedAt: undefined, dueDate: '2026-09-24' }, changes: { status: 'done', completedAt: '2026-09-23', dueDate: undefined } },
    { taskId: 'taste-floating-menu', expected: { status: 'done', completedAt: '2026-09-23', description: projectUpdates[0].tasks.find(task => task.id === 'taste-floating-menu')!.description, historyNote: projectUpdates[0].tasks.find(task => task.id === 'taste-floating-menu')!.historyNote, evidence: projectUpdates[0].tasks.find(task => task.id === 'taste-floating-menu')!.evidence }, changes: {
      description: 'Deliver the five-control floating menu, merged Search/Discover page, and smaller Light glass variation selected by Julio on September 23. Keep the Create placeholder until its flow is designed. The subsequent Today button correction is a separate task.',
      historyNote: 'The September 23 chat records explicit selection of the verified Light glass menu after its refinement. Points are retrospective estimates. Later Today control styling remains in progress.', doneConfirmed: true,
    } },
  ],
});

// Public process descriptions replace file-path handoffs. Match only the
// previously shipped copy (including its old open-and-save expansion), so
// personal edits, status changes and manual ordering remain untouched.
function priorTemplate(id: string): Task {
  const starting = seedTasks.find(task => task.id === id) ?? projectUpdates.flatMap(update => update.tasks).find(task => task.id === id);
  if (!starting) throw new Error(`Unknown process card: ${id}`);
  let task: Task = structuredClone(starting);
  for (const update of projectUpdates) for (const patch of update.patches) {
    if (patch.taskId !== id || !Object.entries(patch.expected).every(([key, value]) => JSON.stringify(task[key as keyof Task]) === JSON.stringify(value))) continue;
    task = { ...task, ...structuredClone(patch.changes) };
  }
  return task;
}

function previouslyExpandedDescription(task: Task): string {
  const original = task.description.trim();
  const seedNote = seedTasks.find(seed => seed.id === task.id)?.historyNote;
  const note = seedNote ? (task.historyNote ?? '').replace(seedNote, '').trim() : task.historyNote?.trim();
  const criteria = task.acceptanceCriteria.map(line => line.trim()).filter(line => line && !original.includes(line));
  const sources = task.evidence.filter(source => !original.includes(source.path)).map(source => `${source.label}: ${source.path}`);
  return [original, criteria.map(line => `- ${line}`).join('\n'), note && !original.includes(note) ? note : '', sources.join('\n')].filter(Boolean).join('\n\n');
}

type PublicCopy = { id: string; title: string; description: string };
function copyPatches(copy: PublicCopy): ProjectPatch[] {
  const before = priorTemplate(copy.id);
  const seed = seedTasks.find(task => task.id === copy.id);
  // Only replace untouched copy. A changed status, criterion, or note is a
  // personal board edit, even when the short description still matches.
  const untouched = {
    status: before.status,
    sprintId: before.sprintId,
    completedAt: before.completedAt,
    archived: before.archived,
    acceptanceCriteria: before.acceptanceCriteria,
    historyNote: before.historyNote,
  };
  const variants: { description: string; descriptionConsolidated?: boolean }[] = [
    { description: before.description, descriptionConsolidated: before.descriptionConsolidated },
    { description: previouslyExpandedDescription(before), descriptionConsolidated: true },
  ];
  if (seed) {
    variants.push({ description: seed.description, descriptionConsolidated: undefined });
    variants.push({ description: previouslyExpandedDescription(seed), descriptionConsolidated: true });
  }
  const seen = new Set<string>();
  const patches: ProjectPatch[] = variants.filter(variant => {
    const key = JSON.stringify(variant);
    if (seen.has(key)) return false;
    seen.add(key); return true;
  }).map(variant => ({
    taskId: copy.id,
    expected: { ...untouched, ...variant },
    changes: { description: copy.description, descriptionConsolidated: true },
  }));
  for (const title of new Set([before.title, seed?.title].filter((value): value is string => Boolean(value)))) {
    if (title !== copy.title) patches.push({ taskId: copy.id, expected: { ...untouched, title, description: copy.description, descriptionConsolidated: true }, changes: { title: copy.title } });
  }
  return patches;
}
const publicCopy: PublicCopy[] = [
  {
    "id": "DC-001",
    "title": "Build a daily cultural reading baseline",
    "description": "I began with a navigable Daily story, discovery, search, saved works, and settings. The first build supported four interface languages, reader preferences, and local saves. It gave me a working object to critique across iPhone and Pixel previews. At this stage, the stories and interactions were prototype material; I had not tested whether readers learned from them."
  },
  {
    "id": "DC-002",
    "title": "Correct the direction of Daily navigation",
    "description": "The first swipe direction did not match the intended chronology. I changed a rightward drag and positive horizontal wheel input to reach older editions; leftward movement goes toward Today and then the contribution invitation. A completed gesture advances one edition. I checked release reversals, wheel bursts, vertical reading, and the related-artwork rail so navigation would not trigger accidental openings."
  },
  {
    "id": "DC-003",
    "title": "Keep an unfinished story suggestion intact",
    "description": "The suggestion sheet asks for a cultural subject, why it matters, and optional sources or images. I kept those fields instead of adding name or email. Closing and reopening preserves the draft, and required fields are checked before the local completion state. This browser prototype does not send a submission or upload an image."
  },
  {
    "id": "DC-004",
    "title": "Preserve the early visual options for comparison",
    "description": "I kept screenshots of the first prototype and the museum-inspired version at phone dimensions. That made the changes in typography, image framing, and navigation visible during later reviews. These images record explored options, not a current design recommendation or evidence that users preferred either version."
  },
  {
    "id": "DC-005",
    "title": "Extract the venture track's learning requirements",
    "description": "I read the Digital Learning Venture track material for its expectations about a defined learner group, evidence of learning, and a sustainable delivery model. I separated those requirements from the existing UI work. A polished prototype does not establish that the problem is real or that readers learn; those claims still require research."
  },
  {
    "id": "DC-006",
    "title": "Map the capstone evidence I still need",
    "description": "I preserved the handbook requirements for process documentation, source judgment, AI use, setbacks, and planned versus completed work. I also identified the HC and LO explanations and timeline the capstone needs. This card records the requirements I extracted; it does not claim the Project Brief or final process document was submitted."
  },
  {
    "id": "DC-007",
    "title": "Adapt an Artsy browsing reference to Taste",
    "description": "I compared Artsy's Home, Search, and Artwork screens with Taste on iPhone-sized views. I adapted restrained typography, neutral framing, proportional artwork, and compact controls, while keeping Taste's stories and navigation. Review exposed a contribution action clipped by the sheet in Portuguese with larger text; I corrected its scrolling and checked both phone previews, four languages, drafts, and navigation. Later monochrome work replaced parts of this direction. This was a local implementation review, not final visual approval."
  },
  {
    "id": "DC-008",
    "title": "Build a reusable Taste component library",
    "description": "I created a browsable design-system workspace for the project's type, color, controls, selection states, and screen patterns. I checked the component examples, keyboard return, narrow layouts, and generated exports. This gives future screen changes a shared reference. It is an interactive browser library; changes do not automatically synchronize with Paper."
  },
  {
    "id": "DC-009",
    "title": "Choose compact monochrome components",
    "description": "I compared my Paper Daily and Search design frames against the prototype after the Artsy study. I kept the quiet artwork-led hierarchy but moved the controls toward Taste's smaller monochrome surfaces, gray states, and PP Neue Montreal typography. I checked the library at phone widths and in Light and Dark. This replaced the earlier blue reference accents without claiming every screen was visually approved."
  },
  {
    "id": "DC-010",
    "title": "Measure and refine the Daily reading layout",
    "description": "I measured my Paper reading design frame and corrected Today spacing, text sizes, and the placement of artwork actions. The changes retained the selected artwork's prominence and the ability to open, save, and return without losing the reading position. Later feedback led to separate adjustments to date, tags, image height, and action buttons; this card records the measured baseline rather than treating it as a frozen design."
  },
  {
    "id": "DC-011",
    "title": "Make artwork inspection usable at full size",
    "description": "I changed the initial Socrates opening crop and loaded image detail at native resolution in tiles, then checked zoom, pan, keyboard controls, download, and return focus. Later review enlarged the title and creator caption and kept detail screens free of the menu blur. The checks used browser phone previews; physical-device performance and my final visual review remain separate."
  },
  {
    "id": "DC-012",
    "title": "Make Settings preferences usable",
    "description": "I made the whole library card open its destination and added weekly, monthly, six-month, yearly, and never options for story repeats. I checked saved preferences and keyboard entry across the four interface languages. Account switching, notifications, and widget behavior were still preview states here; a later task built a fuller local account-switching flow."
  },
  {
    "id": "DC-013",
    "title": "Calibrate the editorial voice before release",
    "description": "I compared draft writing against the saved cultural collection and available annotations, recorded factual and voice corrections, and kept preferred and rejected passages distinct. This produced an editorial working record, not a publishable content set. At that stage, each story needed its own source, image, writing, and rights review before it could enter the reader app."
  },
  {
    "id": "DC-014",
    "title": "Separate academic facts from planning guesses",
    "description": "I gathered the current capstone context, the biweekly reflection cadence, and Project Brief and Canvas requirements. Sources disagreed about the Brief date, so I kept that conflict visible instead of treating an old schedule as current. A reflection receipt is evidence of submission only; it is not a grade or proof that the product work meets the assignment."
  },
  {
    "id": "DC-015",
    "title": "Confirm the CP193 Project Brief requirements",
    "description": "Before finalizing the Brief, I need to check the current Forum and professor guidance. The Brief needs a clear work product, process, success criteria, and a suitable Canvas. The public process cards also need to explain decisions without relying on files stored only on my computer. Older sources give conflicting dates, so the deadline and submission state remain unconfirmed here."
  },
  {
    "id": "DC-016",
    "title": "Turn the learning hypothesis into a study",
    "description": "The current problem statement is a hypothesis: culture-curious people may want one contextual piece instead of an endless feed. I need to choose a specific reader group, recruitable criteria, and a short session that tests comprehension or recall as well as navigation. I will confirm consent and research requirements before collecting responses. Interface polish alone cannot answer the learning question."
  },
  {
    "id": "DC-017",
    "title": "Record my screen-by-screen decisions",
    "description": "This review is ongoing. I have compared Home reading, the viewer, search, Explore, Library, profiles, filters, and Settings in the live prototype. Choices already made include the smaller Light glass menu, Compact browse, the Library overview, and bottom-only menu blur. The remaining work is to capture any further corrections and verify them on both phone previews. A working screen does not by itself mean I approved every visual detail."
  },
  {
    "id": "DC-018",
    "title": "Review writing and images by artwork",
    "description": "As of 25 September, the review has 35 active works: 12 approved for a later import and 23 still to review. I keep writing approval, image choice, sources, and unresolved comments separate for each entry. Three theater works remain on hold. The original 21-entry archive is unchanged, and none of this material has entered the main app. I still need to review revised text for Pantheon, Borobudur, and Tōdai-ji and resolve remaining image choices."
  },
  {
    "id": "DC-019",
    "title": "Run a reader pilot after the materials are ready",
    "description": "The proposed pilot should ask readers to explain what they understood from a story and where navigation helped or blocked them. I will record the actual participant count, consent, anonymized observations, and any comprehension evidence. Two sessions are an aim, not recruited participants. If the protocol or reviewed stories are not ready, this stays unfinished rather than becoming an invented finding."
  },
  {
    "id": "DC-020",
    "title": "Review Sprint 2 against what happened",
    "description": "At the sprint close, I need to compare the planned reader-pilot goal with what was actually delivered: prototype decisions, editorial review, research preparation, and any sessions that occurred. I will record what remained open and one concrete process change for the next sprint. The reconstructed September task dates and points are not a measured velocity history."
  },
  {
    "id": "DC-021",
    "title": "Define the route from approved story to reader app",
    "description": "The current reader app uses a small sample catalog. A real release needs a path from draft through factual checks, image rights, writing approval, translation, and final import. I need to decide who can approve each step and how a revision keeps its provenance. Reviewed editorial material has not yet been imported as live daily content."
  },
  {
    "id": "DC-022",
    "title": "Scope real accounts and cross-device saves",
    "description": "The current account switcher keeps separate saves, folders, follows, preferences, and Create drafts in one browser. It does not authenticate, invite people, or synchronize across devices. A later product decision must define the smallest useful account, recovery, and sync model from user needs before those preview controls become a service."
  }
];
publicCopy.push(...[
  {
    "id": "taste-moma-exploration",
    "title": "Test a museum-led visual direction",
    "description": "I tried a museum-inspired treatment across the first core screens, including stronger headlines and exhibition-like blocks. I checked navigation, themes, languages, and both phone previews. Later Artsy and compact monochrome studies replaced this direction. The retained comparison explains why Taste moved toward quieter framing; this version is historical, not the current interface."
  },
  {
    "id": "taste-selection-motion",
    "title": "Unify selection and feedback motion",
    "description": "I used one Morphing Select behavior for choices in the workspace, prototype, and component library. I also refined the moving selection pill, saved-count stability, gray feedback states, and the save toast. The goal was to make state changes readable without letting animation dominate the artwork. Motion stops or becomes immediate under reduced-motion settings."
  },
  {
    "id": "taste-artwork-information",
    "title": "Give each artwork context and a creator path",
    "description": "I added technical information and a short creator biography beneath the Daily story. Material, size when recorded, and medium stay distinct from the editorial explanation. A creator name opens that person's profile. The first creator action was Follow; I later changed it to Save/Saved, while social accounts kept Follow. Later review tightened the space between the technical panel and biography and kept the biography card readable at its bottom edge."
  },
  {
    "id": "taste-reading-refinement",
    "title": "Remove repetition from artwork reading",
    "description": "I removed repeated labels and dividers that slowed the Daily page, then adjusted text and action spacing around the artwork. I kept the source story and creator context in place. The Socrates passage was revised separately through editorial feedback; a UI cleanup does not approve the writing or imply the story was tested with readers."
  },
  {
    "id": "taste-discover-layout",
    "title": "Build a browse page without losing context",
    "description": "I translated my measured Paper discovery design frame into working search, category, filter, and related-artwork paths. Opening an artwork and returning keeps the previous browse position. This was a functional foundation; later comparison rounds determined which Gallery and collection structure belonged in normal Explore."
  },
  {
    "id": "taste-creator-profiles",
    "title": "Give creator profiles useful sections",
    "description": "I built Overview, Biography, and Artworks around each creator's actual catalog works. The Artworks section can sort and filter saved works, while the full-width cover and Save/Saved control connect back to the reader app. Counts come from the sample catalog and local saves. I treated the first profile layout as a reference, then refined its hierarchy and controls for Taste."
  },
  {
    "id": "taste-creator-slide",
    "title": "Choose Slide back for creator return",
    "description": "I compared several ways for a creator profile to leave the screen. I selected the full-size Slide back motion because it keeps the return to the artwork legible. Closing restores the underlying scroll position and focus; reduced motion removes the travel. This is a chosen interaction in the prototype, not a user-tested preference."
  },
  {
    "id": "taste-editorial-guide",
    "title": "Turn writing feedback into a working guide",
    "description": "I compared draft passages and my corrections, then revised the editorial voice guide through version 0.18 during the first batch. I kept examples I preferred alongside rejected or unresolved versions, and separated source facts from interpretation. Later entry reviews advanced the guide to version 0.20. The guide can direct future writing; it does not approve any new story by itself."
  },
  {
    "id": "taste-editorial-batch",
    "title": "Stage seven art forms for item-level review",
    "description": "I prepared 21 English entries, three for each of seven art forms, with writing, sources, image records, and review surfaces. The work created a concrete pool for selection and revision. Staging is the completed scope of this card; individual approvals and import into the main app remain separate decisions."
  },
  {
    "id": "taste-editorial-images",
    "title": "Compare image treatments across art forms",
    "description": "I prepared studies for architecture and sculpture, a vinyl treatment for music, and local film frames. I selected the photographic vinyl surround. The Borobudur and Great Buddha studies still need fidelity checks against their sources. I did not treat a visually compelling image as sufficient evidence of accuracy or reuse rights."
  },
  {
    "id": "taste-process-workspace",
    "title": "Make the capstone work traceable",
    "description": "I built a personal sprint board, list, backlog, plan, and retrospective view. I simplified the solo workflow to To do, In progress, and Done, grouped cards by meaningful work area, and changed the visible project name to Taste. Historical dates and points are reconstructed estimates. The board documents checked artifacts, not formal Scrum meetings or automatic chat synchronization."
  },
  {
    "id": "taste-today-saves",
    "title": "Connect Daily stories to a personal Library",
    "description": "I added a saved-by count, Save, folder selection and creation, and full-screen viewing to the Daily story. Saves and folder membership persist within the current local account. The displayed social count is prototype data, not measured adoption. I checked keyboard paths and return behavior; later Paper feedback refined the compact action row."
  },
  {
    "id": "taste-floating-menu",
    "title": "Choose the smaller Light glass navigation",
    "description": "I compared floating-menu treatments and selected the smaller Light glass version for the five main destinations. I merged Search and discovery into one browse destination, keeping Home search as a separate entry point. Later work restricted the stronger bottom blur to screens where this menu actually appears. The menu's appearance is a design choice, not evidence of reader preference."
  },
  {
    "id": "taste-create-flow",
    "title": "Build a four-step artwork contribution preview",
    "description": "I turned Create from a placeholder into Artwork, Images, Details, and Review. Artist and title can be unknown; images are optional and require a rights confirmation when attached. Closing preserves the local draft and step. The final action says Finish preview because it does not submit, publish, or add an artwork to Library. The older Daily suggestion sheet remains a separate, smaller flow."
  },
  {
    "id": "taste-object-images",
    "title": "Resolve fidelity in architecture and sculpture images",
    "description": "The Borobudur and Great Buddha image studies are still open. I need to compare the proposed crop and reconstructed details with the underlying source images, select a defensible version, and record image-use rights. The earlier visual study alone is not approval to place either image in the reader app."
  },
  {
    "id": "taste-today-paper-actions",
    "title": "Match the compact Daily actions to Paper",
    "description": "I compared the saved-by avatar and count, text-only Save control, and separate expand action with my Paper design frame. I kept its compact structure, then adjusted the controls to match nearby sizes while retaining touch targets and save behavior. Later feedback set Save as the type-size reference for the date and tags, so these controls read as one row."
  }
]);

const createBefore = priorTemplate('taste-create-flow');
const paperActionsBefore = priorTemplate('taste-today-paper-actions');
const createCopy = publicCopy.find(copy => copy.id === 'taste-create-flow')!;
const paperActionsCopy = publicCopy.find(copy => copy.id === 'taste-today-paper-actions')!;

// The professor's Vercel origin starts with an empty board. These checked
// decisions are shipped as seed updates, while the same batch also upgrades
// unchanged cards in Julio's saved board. No reader pilot is marked complete.
projectUpdates.push({
  id: '2026-09-25-public-process-narratives-v1',
  tasks: [
    record('explore-choice', 'Choose Compact browse for Explore', 'product-design', 'done', '2026-09-25', null,
      'I compared interactive Explore layouts in several rounds. The first three felt too similar; the later magazine, room, and index concepts moved the type and spacing outside Taste. I selected Compact browse on 23 September, then removed the normal Collections block. Explore now moves from Search and Discover something new to a nine-work Gallery and category cards. View all opens the complete Gallery; Back restores the previous position. The discarded layouts remain comparison studies, not alternate product directions.',
      ['qa/compact-browse-selected-2026-09-23/verification.md', 'qa/gallery-expansion-2026-09-23/verification.md', 'qa/ui-polish-2026-09-25/verification.md']),
    record('home-search-choice', 'Reuse Explore search on Home', 'product-design', 'done', '2026-09-23', null,
      'The first expanded Home search left artwork slivers visible and made its field feel oversized. I kept the leftward reveal I liked, but reused Explore\'s compact field, Artworks/Artists/Accounts/Medium scopes, filters, views, and empty states. The surface now covers the artwork cleanly. Opening a result and returning keeps the query, selected scope, scroll, and focus; the bottom Search tab retains its own browse state.',
      ['qa/home-search-shared-2026-09-23/verification.md']),
    record('search-entities', 'Make artists and accounts searchable', 'product-design', 'done', '2026-09-25', null,
      'I kept Artworks, Artists, Accounts, and Medium visible as search scopes. Artist results use the catalog creator profiles and a local Save state. Account results use the prototype\'s fictional peers and local Follow state; they are not real registered users. I removed prototype-facing labels such as Sample profiles and kept result rows quiet, with smaller visible actions and no gray account-row hover.',
      ['qa/search-entities-refinement-2026-09-23/verification.md', 'qa/ui-polish-2026-09-25/verification.md']),
    record('profile-choice', 'Refine owner and visitor profiles', 'product-design', 'done', '2026-09-25', null,
      'I reduced the empty area above the profile statistics, made the portrait a smaller rounded square, enlarged the handle, and removed repeated Artworks, Folders, Following, and Followers headings. The owner sees Share profile; another person sees Follow. Saved artwork and folder counts come from the current local account. The fictional account network does not imply real followers, public sharing, or remote invitations.',
      ['qa/account-folders-refinement-2026-09-23/verification.md', 'qa/ui-polish-2026-09-25/verification.md']),
    record('library-choice', 'Choose a folder-first Library overview', 'product-design', 'done', '2026-09-24', null,
      'I compared compact tabs, a single switcher, and an overview. I chose the overview to show folders before all saved artworks without repeating All artworks under an Artworks tab. Folder detail puts Back on its own row, then the title and controls. The normal Library uses the active account\'s actual saves and folders; the comparison routes use temporary examples.',
      ['qa/library-navigation-2026-09-24/verification.md', 'qa/library-overview-filters-2026-09-24/verification.md']),
    record('filter-range', 'Make artwork filters useful as the catalog grows', 'product-design', 'done', '2026-09-24', null,
      'I added searchable Artist and Country choices, decade and century date presets, and editable From and To years. Choosing a preset fills the same year fields; custom ranges stay possible. Matching includes both endpoints and works whose recorded period overlaps the range. Reversed ranges cannot apply. One filter sheet serves Search, Home search, Library, folders, and creator works. Its current choices come from the small catalog, not a complete world directory.',
      ['qa/library-overview-filters-2026-09-24/verification.md', 'qa/filter-search-and-menu-blur-2026-09-24/verification.md']),
    record('bottom-blur-choice', 'Use stronger blur only beneath the menu', 'product-design', 'done', '2026-09-24', null,
      'I compared no blur, subtle blur, and a stronger edge treatment. I selected the stronger bottom-only option because it gives the floating menu separation from scrolling art. The effect fades at the end of a page and appears only when the menu is present. Artwork details, profiles, sheets, Home search, Create, keyboard, and the full-screen viewer remain clear.',
      ['qa/scroll-edge-blur-2026-09-23/verification.md', 'qa/filter-search-and-menu-blur-2026-09-24/verification.md']),
    record('account-preview', 'Test switching local account identities', 'product-design', 'done', '2026-09-24', null,
      'I made Settings switch between my account and a second preview identity. Each has separate saves, folders, follows, preferences, and Create drafts. The Add account controls show the intended entry methods, but they create only local browser identities. They do not authenticate, send mail, synchronize data, or prove the final account model.',
      ['qa/switch-accounts-2026-09-24/verification.md']),
    record('library-retrieval', 'Search and narrow saved artworks in Library', 'product-design', 'done', '2026-09-25', null,
      'The overview now has a top search action and a Medium picker below Artworks. Search matches saved titles, creators, dates, mediums, and countries; it combines with the existing filters. A typed query hides the folder rail so results take priority. I reduced empty space above the grid. Folder detail keeps its own simpler header.',
      ['qa/ui-polish-2026-09-25/verification.md']),
    record('editorial-approved-package', 'Freeze 12 approved works for later import', 'editorial', 'done', '2026-09-25', null,
      'I separated approval of writing from selection of an image for each work. Twelve entries passed both checks and were frozen with their source and image records in an approved-submissions package. The review still contains unresolved entries, including held theater work and images that need fidelity checks. This package is ready for a later authorized import; it has not replaced the demonstration catalog in the app.',
      ['docs/editorial/research-2026-09-25/feedback-and-release/verification.md']),
    record('editorial-batch-two', 'Stage 15 more works for editorial review', 'editorial', 'done', '2026-09-25', null,
      'I added five painting, five architecture, and five film drafts to the review queue. Painting and architecture have 30 sourced image options. Film images remain pending because the preferred still source requires access; I did not supply substitute images or preselect an option. Across both batches, 35 works are active: 12 approved and 23 to review. No new work from this batch is approved or imported.',
      ['docs/editorial/research-2026-09-25/batch-002-review/verification.md']),
    record('process-ai', 'Record how AI assisted the prototype work', 'capstone-planning', 'done', '2026-09-25', null,
      'I set the product direction through screen reviews and specific corrections, then used AI coding assistance to implement and revise the browser prototype. For example, I rejected an oversized Home search surface, chose Compact browse over larger Explore concepts, and selected the Library overview after comparing three options. I checked local builds, interactions, and phone previews before marking those implementation tasks done. These checks do not establish reader learning or replace the planned study.',
      ['docs/academic/CAPSTONE_HANDBOOK_REFERENCE.md', 'qa/home-search-shared-2026-09-23/verification.md', 'qa/library-navigation-2026-09-24/verification.md']),
  ].map(task => ({
    ...task,
    historyNote: 'Documented on 25 September from dated project records and recorded design choices. Done covers the stated local artifact, not reader approval or publication. No story points were estimated.',
  })),
  patches: [
    { taskId: 'DC-015', expected: { status: 'todo', dueDate: '2026-09-24' }, changes: { dueDate: undefined } },
    ...publicCopy.flatMap(copyPatches),
    { taskId: 'taste-create-flow', expected: { title: createCopy.title, description: createCopy.description, status: 'todo', sprintId: null, points: null, completedAt: undefined }, changes: { status: 'done', sprintId: 'sprint-2', week: 'week-4', completedAt: '2026-09-24', doneConfirmed: true } },
    { taskId: 'taste-today-paper-actions', expected: { title: paperActionsCopy.title, description: paperActionsCopy.description, status: 'in-progress', sprintId: 'sprint-2', dueDate: '2026-09-24', completedAt: undefined }, changes: { status: 'done', dueDate: undefined, completedAt: '2026-09-23', doneConfirmed: true } },
    { taskId: 'taste-create-flow', expected: { evidence: createBefore.evidence }, changes: { evidence: [{ label: 'Four-step Create preview and checks', path: 'qa/create-artwork-flow-2026-09-23/verification.md' }, { label: 'Refined form selection', path: 'qa/create-art-form-variation-2026-09-23/verification.md' }] } },
    { taskId: 'taste-today-paper-actions', expected: { evidence: paperActionsBefore.evidence }, changes: { evidence: [{ label: 'Selected compact action row', path: 'qa/today-actions-paper-2026-09-23/verification.md' }] } },
  ],
});

// The September 25 approved-catalog import followed the public narrative
// snapshot. Correct only untouched descriptions on both fresh and saved boards.
const importedCatalogCopy: { id: string; description: string }[] = [
  {
    id: 'DC-018',
    description: 'The review now has 45 active works. Eighteen approved works entered the Taste prototype on 25 September; 27 unapproved or held entries remain outside it. I keep writing approval, image choice, sources, and unresolved comments separate for each entry. Three theater works remain on hold. I still need to review revised text for Pantheon, Borobudur, and Tōdai-ji and resolve remaining image choices.',
  },
  {
    id: 'DC-021',
    description: 'The reader prototype now contains 18 approved works in place of the ten unreviewed samples. I still need a repeatable path from draft through factual checks, image rights, writing approval, translation, and later imports. I need to decide who can approve each step and how a revision keeps its provenance. This first import does not establish a publishing service or scheduled daily delivery.',
  },
  {
    id: 'taste-creator-profiles',
    description: 'I built Overview, Biography, and Artworks around each creator\'s catalog works. The Artworks section can sort and filter saved works, while the full-width cover and Save/Saved control connect back to the reader app. The profiles now draw from the 18-work approved prototype catalog; save counts remain local. I treated the first profile layout as a reference, then refined its hierarchy and controls for Taste.',
  },
  {
    id: 'taste-editorial-approved-package',
    description: 'I separated approval of writing from selection of an image for each work. Twelve entries passed both checks and were frozen with their source and image records in an approved-submissions package. Later on 25 September, I authorized a separate import of 18 approved works, including these twelve, into the Taste prototype. The frozen package remains a record of that earlier approval checkpoint. The other review entries and image-rights checks remain open.',
  },
  {
    id: 'taste-editorial-batch-two',
    description: 'I staged five painting, five architecture, and five film drafts for review. Painting and architecture had 30 sourced image options. Film images were pending because the preferred still source required access; I did not supply substitute images or preselect an option. At that staging checkpoint, none of these fifteen was approved or imported. Later approval and import decisions are separate from this completed staging task.',
  },
];
projectUpdates.push({
  id: '2026-09-26-approved-catalog-process-correction',
  tasks: [],
  patches: [
    ...importedCatalogCopy.map(copy => ({
      taskId: copy.id,
      expected: { description: priorTemplate(copy.id).description, descriptionConsolidated: true },
      changes: { description: copy.description },
    })),
    {
      taskId: 'taste-editorial-approved-package',
      expected: { title: priorTemplate('taste-editorial-approved-package').title },
      changes: { title: 'Freeze the first 12 approved works' },
    },
  ],
});
