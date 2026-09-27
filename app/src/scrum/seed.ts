export type ScrumStatus = 'todo' | 'in-progress' | 'done';
export type ScrumWeek = 'week-1' | 'week-2' | 'week-3' | 'week-4' | 'backlog';

export interface ScrumTask {
  id: string;
  title: string;
  description: string;
  status: ScrumStatus;
  sprintId: string | null;
  points: number | null;
  area: string;
  priority: 'High' | 'Medium' | 'Low';
  dueDate?: string;
  completedAt?: string;
  week: ScrumWeek;
  acceptanceCriteria: string[];
  criteriaChecked?: boolean[];
  evidence: { label: string; path: string }[];
  historyNote?: string;
}

export interface ScrumSprint {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  goal: string;
  status: 'closed' | 'active' | 'planned';
  review: string;
  retrospective: string;
}

export const productGoal = 'Build a daily cultural learning experience whose usefulness can be tested with readers, supported by clear editorial standards and capstone evidence.';

export const definitionOfDone = [
  'Save the promised artifact or working change, with a retrievable evidence record.',
  'Verify each acceptance criterion against the agreed task scope.',
  'Run relevant checks for code, sources, accessibility, and content rights.',
  'Record limitations and distinguish implementation completion from visual or editorial approval.',
  'Update the handoff and identify the next decision when further work remains.',
];

// Empty planning slots follow the existing 14-day cadence through late December.
// Sprint 9 crosses the year boundary so the final December days remain covered.
const futureSprintDates = [
  ['2026-09-28', '2026-10-11'],
  ['2026-10-12', '2026-10-25'],
  ['2026-10-26', '2026-11-08'],
  ['2026-11-09', '2026-11-22'],
  ['2026-11-23', '2026-12-06'],
  ['2026-12-07', '2026-12-20'],
  ['2026-12-21', '2027-01-03'],
] as const;

export const seedSprints: ScrumSprint[] = [
  {
    id: 'sprint-1',
    name: 'Sprint 1',
    startDate: '2026-08-31',
    endDate: '2026-09-13',
    goal: 'Establish the working discovery prototype',
    status: 'closed',
    review: 'Reconstructed from dated evidence: the prototype, chronological navigation, contribution draft flow, design handoff, and academic reference archive were delivered. This is a historical summary; no Sprint Review meeting is recorded.',
    retrospective: 'Reconstructed observation: repeated gesture corrections led to explicit pointer-direction rules and regression coverage. Preserve source measurements and task-level verification. No historical retrospective meeting is recorded.',
  },
  {
    id: 'sprint-2',
    name: 'Sprint 2',
    startDate: '2026-09-14',
    endDate: '2026-09-27',
    goal: 'Turn the refined prototype and editorial work into a reviewable reader pilot with a clear learning question.',
    status: 'active',
    review: '',
    retrospective: '',
  },
  ...futureSprintDates.map(([startDate, endDate], index): ScrumSprint => ({
    id: `sprint-${index + 3}`,
    name: `Sprint ${index + 3}`,
    startDate,
    endDate,
    goal: '',
    status: 'planned',
    review: '',
    retrospective: '',
  })),
];

const retrospectiveNote = 'Reconstructed on 21 September from dated project evidence. The completion date is the documentation date, not a time log. Story points are retrospective estimates, not recorded historical estimates.';
const proposedNote = 'Proposed on 21 September. The date is a personal planning target, not a verified academic deadline. Points estimate relative effort and uncertainty; they are not hours.';

export const seedTasks: ScrumTask[] = [
  {
    id: 'DC-001', title: 'Build the core discovery prototype',
    description: 'Deliver the initial Daily, Discover, Search, Favourites, and Settings flows. This records the verified September 3 prototype, whose visual direction was later superseded.',
    status: 'done', sprintId: 'sprint-1', points: 5, area: 'Product', priority: 'High', completedAt: '2026-09-03', week: 'week-1',
    acceptanceCriteria: ['Verify five-tab navigation, story detail, search, and saved-item persistence.', 'Check the four locales, both device previews, and protected runtime integrity.'],
    criteriaChecked: [true, true],
    evidence: [{ label: 'Initial prototype QA · September 3', path: 'qa/design-qa.md' }], historyNote: retrospectiveNote,
  },
  {
    id: 'DC-002', title: 'Make Daily navigation predictable',
    description: 'Implement one-edition chronological movement with pointer, wheel, and keyboard controls. Preserve independent reading and nested recommendation gestures.',
    status: 'done', sprintId: 'sprint-1', points: 5, area: 'Engineering', priority: 'High', completedAt: '2026-09-05', week: 'week-1',
    acceptanceCriteria: ['Verify rightward dragging opens older editions; leftward dragging moves toward Today and Suggestion.', 'Pass the 23-case navigation suite, including release reversals and wheel bursts.'],
    criteriaChecked: [true, true],
    evidence: [{ label: 'Final direction inversion and verification', path: 'qa/moma/VERIFICATION.md' }, { label: 'Daily navigation regression suite', path: 'app/tests/daily-navigation.test.mjs' }], historyNote: retrospectiveNote,
  },
  {
    id: 'DC-003', title: 'Keep contribution drafts usable',
    description: 'Deliver the localized prototype contribution form and preserve unfinished text during dismissal. This scope covers the local prototype, without transmission.',
    status: 'done', sprintId: 'sprint-1', points: 3, area: 'Product', priority: 'Medium', completedAt: '2026-09-05', week: 'week-1',
    acceptanceCriteria: ['Verify required-field validation and text persistence after dismissing and reopening.', 'Preserve the requested subject, context, sources, and optional image fields without name or email.'],
    criteriaChecked: [true, true],
    evidence: [{ label: 'Contribution checks', path: 'qa/moma/VERIFICATION.md' }, { label: 'Captured contribution states', path: 'qa/screenshot-library-2026-09-05/README.md' }], historyNote: retrospectiveNote,
  },
  {
    id: 'DC-004', title: 'Prepare the visual redesign handoff',
    description: 'Preserve the earlier prototype and MoMA exploration in a browsable screenshot library for Julio’s redesign. Historical captures do not represent current visual approval.',
    status: 'done', sprintId: 'sprint-1', points: 3, area: 'Design', priority: 'Medium', completedAt: '2026-09-05', week: 'week-1',
    acceptanceCriteria: ['Save both visual versions with device dimensions and screen coverage.', 'Document current interaction differences and distinguish app captures from third-party references.'],
    criteriaChecked: [true, true],
    evidence: [{ label: 'Screenshot library and coverage', path: 'qa/screenshot-library-2026-09-05/README.md' }], historyNote: retrospectiveNote,
  },
  {
    id: 'DC-005', title: 'Preserve the venture track requirements',
    description: 'Archive the supplied Digital Learning Venture track document and extract learning, audience, and sustainability expectations. Later academic updates supersede its dated schedule.',
    status: 'done', sprintId: 'sprint-1', points: 2, area: 'Capstone', priority: 'High', completedAt: '2026-09-07', week: 'week-2',
    acceptanceCriteria: ['Preserve the supplied source and searchable reference.', 'Record learning-evidence expectations and schedule conflicts without treating hypothetical targets as results.'],
    criteriaChecked: [true, true],
    evidence: [{ label: 'Track reference saved September 7', path: 'docs/academic/CAPSTONE_TRACK_REFERENCE.md' }], historyNote: retrospectiveNote,
  },
  {
    id: 'DC-006', title: 'Map handbook and process requirements',
    description: 'Preserve the handbook, learning outcomes, AI-use documentation expectations, and track precedence. This does not claim an assignment was completed or submitted.',
    status: 'done', sprintId: 'sprint-1', points: 2, area: 'Capstone', priority: 'High', completedAt: '2026-09-07', week: 'week-2',
    acceptanceCriteria: ['Archive the handbook with its source and cross-reference the track.', 'Record process evidence, attribution, and unresolved requirement conflicts.'],
    criteriaChecked: [true, true],
    evidence: [{ label: 'Handbook reference saved September 7', path: 'docs/academic/CAPSTONE_HANDBOOK_REFERENCE.md' }], historyNote: retrospectiveNote,
  },
  {
    id: 'DC-007', title: 'Implement the Artsy design exploration',
    description: 'Apply the observed visual direction across the local prototype and fix contribution-sheet overflow. September 20 compact monochrome work supersedes parts of this exploration.',
    status: 'done', sprintId: 'sprint-2', points: 5, area: 'Design', priority: 'Medium', completedAt: '2026-09-19', week: 'week-3',
    acceptanceCriteria: ['Compare the documented reference with the main app screens and both device previews.', 'Pass build, protected-runtime, and navigation checks while retaining locales and drafts.'],
    criteriaChecked: [true, true],
    evidence: [{ label: 'Artsy implementation QA', path: 'design-qa.md' }], historyNote: `${retrospectiveNote} Implementation review passed; Julio’s final visual approval was not recorded.`,
  },
  {
    id: 'DC-008', title: 'Create the reusable design-system library',
    description: 'Add the browser library, shared tokens and components, example patterns, and export workflow. The library is an interactive catalog; it does not synchronize with Paper.',
    status: 'done', sprintId: 'sprint-2', points: 5, area: 'Design system', priority: 'High', completedAt: '2026-09-19', week: 'week-3',
    acceptanceCriteria: ['Verify library navigation, examples, return focus, and narrow layouts.', 'Verify generated exports, production build, and unchanged protected runtime.'],
    criteriaChecked: [true, true],
    evidence: [{ label: 'Design-system starter verification', path: 'qa/design-system-2026-09-19/verification.md' }, { label: 'System handoff', path: 'docs/DESIGN_SYSTEM.md' }], historyNote: retrospectiveNote,
  },
  {
    id: 'DC-009', title: 'Apply compact monochrome components',
    description: 'Measure the Paper Daily and Search frames and implement compact neutral controls and patterns. Record deliberate adaptations and keep final visual acceptance separate.',
    status: 'done', sprintId: 'sprint-2', points: 3, area: 'Design system', priority: 'High', completedAt: '2026-09-20', week: 'week-3',
    acceptanceCriteria: ['Verify compact controls, 393px patterns, and selected-chip contrast in Light and Dark.', 'Verify library responsiveness, interactive examples, and generated-token consistency.'],
    criteriaChecked: [true, true],
    evidence: [{ label: 'Compact monochrome checks', path: 'qa/design-system-monochrome-2026-09-20/verification.md' }], historyNote: `${retrospectiveNote} Final visual approval remains a separate task.`,
  },
  {
    id: 'DC-010', title: 'Match Today to the Paper layout',
    description: 'Correct Today’s exact spacing and text sizes, then apply PP Neue Montreal across app-owned screens. Preserve installed-font and device-runtime boundaries.',
    status: 'done', sprintId: 'sprint-2', points: 3, area: 'Design', priority: 'High', completedAt: '2026-09-20', week: 'week-3',
    acceptanceCriteria: ['Verify rendered Paper geometry and actual font selection.', 'Verify artwork activation, focus restoration, and suppression after scrolling or edition dragging.'],
    criteriaChecked: [true, true],
    evidence: [{ label: 'Exact Paper measurements', path: 'qa/today-paper-exact-2026-09-20/verification.md' }, { label: 'App-wide font and artwork checks', path: 'qa/pp-app-image-preview-2026-09-20/verification.md' }], historyNote: `${retrospectiveNote} Exact typography elsewhere requires matching installed fonts or authorized webfonts.`,
  },
  {
    id: 'DC-011', title: 'Refine the high-resolution artwork viewer',
    description: 'Implement the requested Socrates opening crop, decoded native-detail tiles, and minimal controls. Local Chromium verification does not establish real-device performance or visual approval.',
    status: 'done', sprintId: 'sprint-2', points: 5, area: 'Engineering', priority: 'High', completedAt: '2026-09-20', week: 'week-3',
    acceptanceCriteria: ['Verify the 72%-height opening crop and visible tile reveal on fresh and cached opens.', 'Verify gestures, keyboard access, focus restoration, original downloads, and failure recovery.'],
    criteriaChecked: [true, true],
    evidence: [{ label: 'Viewer opening and behavior checks', path: 'qa/viewer-opening-2026-09-20/verification.md' }], historyNote: retrospectiveNote,
  },
  {
    id: 'DC-012', title: 'Refine Settings and repeat preferences',
    description: 'Make the full library card open Favourites, add all five repeat choices, and clarify Switch Accounts as a preview state.',
    status: 'done', sprintId: 'sprint-2', points: 2, area: 'Product', priority: 'Medium', completedAt: '2026-09-20', week: 'week-3',
    acceptanceCriteria: ['Verify card clicks, keyboard activation, and drag suppression on both devices.', 'Verify five persisted repeat preferences and localized account copy in all four languages.'],
    criteriaChecked: [true, true],
    evidence: [{ label: 'Settings verification', path: 'qa/settings-2026-09-20/verification.md' }], historyNote: `${retrospectiveNote} Authentication and content scheduling remain unconnected.`,
  },
  {
    id: 'DC-013', title: 'Build the editorial research and calibration record',
    description: 'Study the saved cultural collection and available Kindle annotations, then preserve draft comparisons and explicit feedback. This delivers research and calibration artifacts, not a publishable content library.',
    status: 'done', sprintId: 'sprint-2', points: 5, area: 'Editorial', priority: 'High', completedAt: '2026-09-20', week: 'week-3',
    acceptanceCriteria: ['Record research coverage and provenance limits separately from original authorship.', 'Preserve draft comparisons, rejection reasons, and pending revisions without inferring publication approval.'],
    criteriaChecked: [true, true],
    evidence: [{ label: 'Editorial collection research', path: 'docs/editorial/research-2026-09-19/README.md' }, { label: 'Passage-selection research', path: 'docs/editorial/research-2026-09-20/README.md' }, { label: 'Pending book and film repairs', path: 'docs/editorial/CALIBRATION_10_BOOK_FILM_REVISIONS.md' }], historyNote: `${retrospectiveNote} September 21 feedback is not backdated into this completion record.`,
  },
  {
    id: 'DC-014', title: 'Refresh the academic context',
    description: 'Link current academic evidence, the biweekly reflection process, and the Project Brief plus Canvas requirements. Retain the unresolved deadline conflict.',
    status: 'done', sprintId: 'sprint-2', points: 1, area: 'Capstone', priority: 'High', completedAt: '2026-09-19', week: 'week-3',
    acceptanceCriteria: ['Document the newer reflection cadence and authoritative source entry point.', 'Keep submission receipts, self-reported goals, grades, and verified product work distinct.'],
    criteriaChecked: [true, true],
    evidence: [{ label: 'Academic context update', path: 'docs/academic/ACADEMIC_CONTEXT_UPDATE_2026-09-19.md' }], historyNote: retrospectiveNote,
  },
  {
    id: 'DC-015', title: 'Confirm the brief and reflection requirements',
    description: 'Check the current academic source for the Project Brief, Business Model Canvas, and next reflection. Record the actual deadline and identify any missing deliverables before prioritizing further work.',
    status: 'todo', sprintId: 'sprint-2', points: 1, area: 'Capstone', priority: 'High', dueDate: '2026-09-21', week: 'week-4',
    acceptanceCriteria: ['Save the current assignment source and resolve or explicitly retain the conflicting dates.', 'List any missing brief, Canvas, and reflection items without claiming submission or grades.'],
    evidence: [{ label: 'Known academic conflicts', path: 'docs/academic/ACADEMIC_CONTEXT_UPDATE_2026-09-19.md' }], historyNote: proposedNote,
  },
  {
    id: 'DC-016', title: 'Prepare a focused reader study',
    description: 'Choose one intended reader group and one learning question. Prepare a short discovery and prototype protocol, including the applicable Minerva participant-research requirements.',
    status: 'todo', sprintId: 'sprint-2', points: 3, area: 'Research', priority: 'High', dueDate: '2026-09-22', week: 'week-4',
    acceptanceCriteria: ['Write a testable problem hypothesis, reader criteria, and a short session guide.', 'Define an observable comprehension or recall task and confirm applicable consent/research requirements before collecting data.'],
    evidence: [{ label: 'Unvalidated problem hypothesis', path: 'docs/PRODUCT_SPEC.md' }, { label: 'Learning and audience expectations', path: 'docs/academic/CAPSTONE_TRACK_REFERENCE.md' }, { label: 'Participant-research requirements', path: 'docs/academic/CAPSTONE_HANDBOOK_REFERENCE.md' }], historyNote: proposedNote,
  },
  {
    id: 'DC-017', title: 'Review the current prototype with Julio',
    description: 'Review compact Today, the artwork viewer, Settings, and the design-system library. Turn remaining visual feedback into a small ordered list; do not reopen already accepted choices without evidence.',
    status: 'todo', sprintId: 'sprint-2', points: 2, area: 'Design', priority: 'Medium', dueDate: '2026-09-23', week: 'week-4',
    acceptanceCriteria: ['Record Julio’s acceptance or concrete corrections for each named surface.', 'Check the agreed changes in both device previews and preserve exact Paper geometry where required.'],
    evidence: [{ label: 'Pending visual acceptance', path: 'qa/viewer-opening-2026-09-20/verification.md' }, { label: 'Current component decisions', path: 'docs/DESIGN_SYSTEM.md' }], historyNote: proposedNote,
  },
  {
    id: 'DC-018', title: 'Select and review a small editorial pilot',
    description: 'Review the pending Dorian Gray, Parasite, and Raft repairs. Preserve praised Nineteen Eighty-Four A and Eternal Sunshine A. Choose a small pilot set only after explicit editorial review.',
    status: 'todo', sprintId: 'sprint-2', points: 3, area: 'Editorial', priority: 'High', dueDate: '2026-09-24', week: 'week-4',
    acceptanceCriteria: ['Record acceptance or requested changes for the three pending repairs while preserving praised texts.', 'For the selected pilot, verify central concerns, factual sources, quotation provenance, and content rights.'],
    evidence: [{ label: 'Book and film revisions awaiting review', path: 'docs/editorial/CALIBRATION_10_BOOK_FILM_REVISIONS.md' }, { label: 'September 21 feedback', path: 'docs/editorial/CALIBRATION_11_PAINTING_BOOK_FILM.md' }, { label: 'Raft revision awaiting review', path: 'docs/editorial/CALIBRATION_12_RAFT_REVISION.md' }], historyNote: proposedNote,
  },
  {
    id: 'DC-019', title: 'Run a small reader pilot and record findings',
    description: 'After the protocol and pilot content are ready, aim for two reader sessions. Check understanding and core navigation. Participant availability is unconfirmed; this is a proposed scope, not a promise of recruitment.',
    status: 'todo', sprintId: 'sprint-2', points: 3, area: 'Research', priority: 'High', dueDate: '2026-09-26', week: 'week-4',
    acceptanceCriteria: ['Record the actual session count, anonymized observations, and comprehension evidence with consent.', 'Separate usability findings, learning observations, and untested assumptions; choose the next product change.'],
    evidence: [{ label: 'Learning-evidence expectations', path: 'docs/academic/CAPSTONE_TRACK_REFERENCE.md' }, { label: 'Current academic research emphasis', path: 'docs/academic/ACADEMIC_CONTEXT_UPDATE_2026-09-19.md' }], historyNote: `${proposedNote} Depends on DC-016 and DC-018. If participation is unavailable, record the blocker and move unfinished work to the backlog.`,
  },
  {
    id: 'DC-020', title: 'Review Sprint 2 and plan the next increment',
    description: 'Inspect the work against the Sprint Goal, collect feedback on the result, and record one process improvement. Use actual completion evidence to plan the next sprint.',
    status: 'todo', sprintId: 'sprint-2', points: 1, area: 'Planning', priority: 'Medium', dueDate: '2026-09-27', week: 'week-4',
    acceptanceCriteria: ['Write a review stating what was delivered, learned, and left incomplete against the Sprint Goal.', 'Record a retrospective improvement and reorder unfinished or newly discovered work before the next sprint.'],
    evidence: [{ label: 'Process-documentation expectations', path: 'docs/academic/CAPSTONE_HANDBOOK_REFERENCE.md' }], historyNote: `${proposedNote} Historical reconstructed points are not a reliable velocity baseline.`,
  },
  {
    id: 'DC-021', title: 'Define the first real content-publishing workflow',
    description: 'After reader feedback, decide how Julio will prepare, review, and publish a daily story. Keep editorial provenance and media rights attached to each record.',
    status: 'todo', sprintId: null, points: null, area: 'Product', priority: 'Medium', week: 'backlog',
    acceptanceCriteria: ['Map draft, source check, editorial review, and publication states.', 'Choose a minimal delivery approach from the pilot findings before estimating implementation.'],
    evidence: [{ label: 'Product scope and open questions', path: 'docs/PRODUCT_SPEC.md' }], historyNote: 'Undated product backlog. Not committed to either sprint; estimate after refinement.',
  },
  {
    id: 'DC-022', title: 'Scope accounts and cross-device libraries',
    description: 'Define what must persist across devices and how account switching should behave. The current prototype stores preferences locally and does not authenticate.',
    status: 'todo', sprintId: null, points: null, area: 'Engineering', priority: 'Low', week: 'backlog',
    acceptanceCriteria: ['Define the minimum account, sync, export, and recovery needs from user evidence.', 'Separate prototype states from an implementation plan, then estimate the smallest useful slice.'],
    evidence: [{ label: 'Current account limits', path: 'qa/settings-2026-09-20/verification.md' }], historyNote: 'Undated product backlog. Not committed to either sprint; estimate after refinement.',
  },
];
