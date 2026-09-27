# Taste (V1.2) process documentation

Implemented locally on 21 September 2026 for Julio's personal capstone planning. Updated on 24 September 2026.

## Open and use

Select **Process documentation** beside Prototype and Design system, or open `http://127.0.0.1:4173/?view=scrum`.
The existing persistent preview serves this route. Build with `cd app && npm run build` after source changes.
Prototype, Design system, and Process documentation share a 44px dark bar with the workspace picker and a live local date and time. The centered project label and **JC** badge were removed on 24 September 2026.
The sidebar starts with **About**, **Sprint board**, and **Product backlog**, followed by the sprint list.

- **About:** read a beginner introduction that starts with this documentation’s basis in Scrum, defines sprints and the product backlog, and explains the solo two-week workflow. Retain the Scrum Guide link. This text is not editable.
- **Board:** choose a sprint, add tasks, open a task, or drag cards between **To do**, **In progress**, and **Done**.
- **List:** edit status without dragging and adjust manual task order with the arrow controls.
- **Sprint plan:** edit the sprint name, goal, and point budget; inspect the two weeks.
- **Product backlog:** order future work and assign a task directly from the table's Sprint dropdown. It offers planned sprints that have not ended, including an unstarted current sprint. Legacy archived tasks appear here too.
- **Retrospective:** reflect in a separate optional panel after completion, or reopen it for a closed sprint.

Export and Import controls are removed. Existing local data remains in place.
Board, List, and Sprint plan tabs appear only inside Sprint board. Product backlog and About do not show these tabs.

Task details include title, epic, description, status, sprint, target date, and optional Fibonacci story points.
Area and Priority are removed from task forms, cards, lists, planning rows, filtering, and sorting.
Story points estimate effort. Manual task order determines sequence; Due date is the other sorting option.
Existing area/priority values and valid defaults remain only in saved records for version-1 backup compatibility.
Julio's September 21 cleanup removed separate criteria, Definition of Done, record, evidence, and outcome-note panels.
Useful existing criteria, custom notes, and sources consolidate into the editable Description when a task opens.
Saving commits that description. Cancelling leaves the original record untouched. A saved marker prevents duplicate text on future edits.
Legacy fields remain preserved in the record for backup compatibility. Generated provenance boilerplate stays in the data and documentation.
Done is a direct status change, with no acceptance checklist or quality-confirmation gate.
Historical tasks can be reopened into the backlog. Unfinished work cannot be assigned to a closed sprint.

New sprints last exactly 14 calendar days and cannot overlap.
The sidebar includes blank planned Sprints 3–9 on the same cadence, from 28 September through 3 January. Sprint 9 starts on 21 December and covers the rest of December. Their goals, reviews, and retrospectives stay empty until planned.
Selecting a future sprint in a backlog row moves that task into the chosen sprint without changing its status, due date, points, epic, or order. An archived task becomes active again. The row leaves the backlog, a confirmation appears, and keyboard focus moves to the next sprint selector or the backlog navigation button.
Existing browser boards receive this outline once. Personal sprint names, goals, dates, tasks, and order stay intact. An overlapping custom sprint takes precedence over a blank slot; a later removed placeholder does not reappear.
Only one sprint can be active. Its standalone **Complete sprint** button completes the sprint immediately.
Closing retains completed work in that sprint and returns unfinished work to the product backlog.
An optional **Retrospective** panel then opens; cancelling it does not undo completion.
Closed sprints offer a Retrospective button to reopen the panel. No Reflection field appears in Sprint plan or new-sprint creation.
The panel combines existing planning, review, retrospective, and improvement notes until Julio saves a reflection.
Saved reflection takes precedence, including an intentionally empty value. Original note fields remain in stored records.
Legacy archived records stay intact until an edit or status change restores them to active work.

## Process icons — September 23, 2026

Julio requested Cursor-style icons for Process documentation, then rejected the light outlines and requested filled versions. `app/src/scrum/ProcessIcons.tsx` contains 14 original Taste SVG drawings informed by [the Cursor designer's construction notes](https://www.minoradventures.co/blog/the-making-of-cursors-icons). Use a 16px grid, solid silhouettes, transparent detail cutouts, restrained corners, and heavier action symbols. Keep unfinished task markers hollow so they remain distinct from solid Done markers. This filled direction supersedes the initial 1.25px outline set. Cursor artwork and fonts are not bundled.

The family covers the sidebar, Board/List/Sprint plan tabs, search, task status, add/close/reorder controls, and the workspace symbol while Process documentation is active. Preserve existing 13–20px display sizes, control spacing, monochrome colors, 4–8px surface corners, hover/focus feedback, and motion. The shared select's existing outlined caret and check remain in place. Icons are decorative; labels and keyboard behavior belong to their controls.

Keep Prototype and Design system icons independent. No task data, copy, responsive layout, or protected runtime changes belong to this icon adaptation. Desktop and 390px-wide checks are recorded in `qa/process-icons-2026-09-23/verification.md`; visual acceptance remains Julio's decision.

Julio rejected the first filled glyph choices and requested variations. `public/assets/process-icons/variants.svg` supplies three filled navigation families: Panels (framed board, document, Gantt bars, stacked cards), Tiles (block layout, rows, calendar, inbox), and Minimal (columns, lines, steps, tray). About also varies. `http://127.0.0.1:4173/process-icons.html` compares all three using the same SVG symbols.

Julio confirmed this mixed selection as the app default:

| Icon | Selected variation |
| --- | --- |
| Board | Tiles |
| List | Tiles |
| Sprint plan | Minimal |
| Product backlog | Tiles |
| About | Minimal |

Apply each choice wherever that icon appears in Process documentation, including sidebar and sprint-view controls. Explicit `?view=scrum&process-icons=panels`, `tiles`, or `minimal` URLs remain comparison previews of a complete family. These URL choices do not persist or alter task data; the standard route uses the confirmed mixed selection.

The Process documentation sidebar uses the text wordmark **Taste** with no image or reserved icon slot. This applies across its board, list, sprint plan, About, backlog, and sprint pages. The auxiliary icon-comparison page also uses the text wordmark. The former supplied silhouette and its source record remain under `public/assets/brand/`; the earlier visual state is recorded in `qa/process-icon-variations-2026-09-23/verification.md`. Navigation and action icons remain in their controls.

## Epics and task codes

Julio requested grouping existing tasks by their content. The initial epics are:

| Epic | Code prefix |
| --- | --- |
| Product Design | PD |
| Engineering | ENG |
| Editorial | ED |
| User Research | UR |
| Capstone Planning | CP |

Each epic has its own sequence: `PD-001`, `PD-002`, and so on. Codes appear on cards, lists, task details, and dated sprint-plan rows.
Search accepts a task code, epic name, or legacy internal ID.
Choose **Epic** in task details, or select **New epic…** and enter **Epic name** and **Code prefix**.
Prefixes use 1–8 uppercase letters or numbers, starting with a letter. Duplicate prefixes and epic names are rejected.
New epics and task numbers commit together when the task is saved. Cancelling consumes no number and creates no epic.
Editing or reordering a task keeps its code. Moving it to a different epic assigns the next number in that epic.

Migration adds epic fields without changing internal IDs, saved descriptions, dates, points, task order, or source evidence.
Unassigned original tasks use a content-reviewed mapping. Other unassigned tasks use their title and description; assigned tasks are never reclassified by later title edits.
Existing codes and counters survive reload and import. Normalization raises stale counters above allocated numbers to avoid duplicates.
Legacy backup validation and normalization remain available in the model, although the UI no longer exposes Import. Legacy `review` status becomes `in-progress`.

The initial sprint names are **Sprint 1** and **Sprint 2**. Migration replaces only `Sprint 1 · Foundation` and `Sprint 2 · Design into learning` on their original sprint IDs.
Custom sprint names remain unchanged. New sprints start with a simple numbered name that remains editable.
The Sprint plan heading is now an editable **Sprint name** field, with no date/status subtitle.
The reference area contains only **References · previous sprints**. Do not append sprint names, point totals, or an empty-state explanation.
Task cards have no assignee avatar or initials. The date starts at the left edge of the card footer.

## Seed and evidence

See [SCRUM_HISTORY.md](SCRUM_HISTORY.md) for the early task inventory, estimates, source files, and limitations.
The original September 21 seed has 22 tasks: 14 completed, six proposed, and two backlog items.
The two September 23 batches add 17 tasks, bringing the earlier board to 39 tasks.
The September 25 public-narrative batch adds 12 cards for decisions, editorial work, and AI-assisted process that were missing from that board.
It rewrites untouched card copy around the actual decision, iteration, outcome, and limit. It keeps user-edited cards intact.
An unchanged fresh board now has 51 tasks: 42 Done, two In progress, and seven To do.
Sprint 1 has seven Done. Sprint 2 has 35 Done, two In progress, and four To do. Three tasks remain in the backlog.
Custom boards can differ because status, description, sprint, and manual-order edits remain local to each browser.
The [September 23 chat review](../qa/sprint-foundation-2026-09-23/history-review.md) records the saves and folder work, selected Light glass menu, and later Daily control correction.

The public card descriptions include enough context to stand alone when a professor opens them on Vercel.
For example, the Artsy card names the screens compared, the clipped contribution action that was fixed, and the later monochrome choice.
Cards keep reader-pilot findings, editorial approval, app import, account authentication, and publication separate from implemented prototype work.
Local verification files remain internal evidence metadata and are not presented as required reading in card descriptions.

Sprint 1 runs 31 August–13 September. Sprint 2 runs 14–27 September.
Sprints 3–9 are planning slots. Their presence does not assert that future work has been selected or completed.
The first three project weeks are reconstructed. The final week now includes delivered work, active work, and remaining planning targets.
These are not academic week numbers or records of historical Scrum meetings.
Past points are retrospective estimates. Open-task points remain provisional.
No historical velocity or burndown is invented. Each task distinguishes its narrow completed artifact from approval or validation.

The board is a personal Scrum adaptation. See [SCRUM_VALIDATION.md](SCRUM_VALIDATION.md) for the primary-source framework check.
The software supports sprint goals, backlogs, progress tracking, and reflection. It cannot establish that Scrum events occurred.

## Reference and visual decisions

The first September 23 update renames the launcher to Process documentation and removes In review from the solo workflow. The selector accommodates the longer label; the shared bar stays 44px high, with center-title truncation on narrow screens. Framework terminology in About remains unchanged.

The September 21 navigation update replaced Goals & rituals with read-only About, removed the workspace breadcrumb and archive navigation, and tightened the sidebar title/subtitle gap. It initially placed Reflection in Sprint plan; the latest update moves that field into the separate Retrospective panel. Historical evidence: [workspace navigation verification](../qa/workspace-navigation-2026-09-21/verification.md).

Latest cleanup removes board column counts and points, card point badges, the reconstruction footer, sprint status pills, Personal badge, main-header book icon, Next 7 days, empty-column filler, and sidebar explanations. Sprint goals, scheduling dates, and progress remain. The latest update removes the backup controls and the redundant plan date/status subtitle. Point editing remains in task details and planning views. Evidence: `qa/scrum-cleanup-2026-09-21/`.

Primary visual reference: [Asana Board view](https://help.asana.com/s/article/board-view?language=en_US).
The official article's [published screenshot](https://assets.asana.biz/m/75d8ffcc9e58eb1a/original/productui-helpcenter-projects-boardview-001-en-us-jpeg.jpeg) was inspected at 1280 × 720.

Observed structure: dark global bar around 48px high; white project title and underlined view tabs; separate task toolbar around 52px high; pale board surface; white outlined cards; approximately 264px columns with 22px gaps in the published image. Cards separate title, labels, owner, and date.
The help article documents drag and drop, list/board views, filters, sorting, and editable task fields.

Taste (V1.2) adapts this structure with a 44px global bar, 208px project sidebar, compact project header, sprint-goal strip, and three workflow columns.
Desktop columns have a 235px minimum. Typography uses the existing locally installed PP Neue Montreal family.
Colors are monochrome, including progress and focus states. No Asana logo, code, or imagery ships in the feature.
Only the published desktop reference was measured; the responsive layout is an original adaptation.

At 900px and below, the sidebar becomes a horizontal navigation strip.
At 600px and below, the plan becomes one column and task details use the full width.
Only the board and wide table scroll horizontally. Main document width remains bounded.
Coarse pointers receive at least 44px control targets. Reduced motion removes decorative transitions.
The details panel is a native dialog with Escape dismissal and focus restoration.

Process interactions reuse the existing Motion library. Search focus and the clear control transition over 150ms.
Board, List, Sprint plan, sidebar pages, and sprint changes crossfade over 180ms; the active tab underline moves over 250ms.
Task, sprint-creation, and retrospective dialogs transition over 200ms. Exiting content becomes inert immediately.
Reduced motion changes state immediately. Preserve keyboard focus, current data, compact spacing, and 4–8px corners.
Do not apply these workspace timings to the separately selected creator Slide back interaction.

## Persistence and limits

Data saves to `daily-culture-scrum-v1` in browser storage. It is independent of reader preferences and favourites.
Storage is specific to the browser and origin; `localhost` and `127.0.0.1` have separate boards.
There are no Export or Import controls. There is no account, server database, or cross-device sync.
Do not clear or overwrite saved browser data as part of interface maintenance.

Seed records initialize only an empty board. Reviewed project-update batches then apply to both new and existing boards.
Each immutable batch ID is recorded in `appliedProjectUpdates`; loading the board again does not reapply that batch.
Additions use stable internal IDs and skip an existing matching record. New epic codes use the next available number.
Patches apply only when their declared expected fields still match. Conflicting custom fields remain unchanged.
Existing sprint settings, custom task details, and manual order are not reseeded. Unfinished additions cannot enter a closed sprint.
If a guarded patch is skipped, its batch is still recorded as applied. Resolve that difference through a new reviewed update.
Unreadable storage is preserved, and the UI reports that the working session cannot be saved over it.
Legacy validation still checks IDs, references, dates, sprint duration, overlap, statuses, points, epic prefixes, and unique epic task numbers.
It remains part of model compatibility; the removed Import UI is not a recovery path.
Keep the route, browser storage key, and source filenames unchanged for compatibility.
`app/src/brand.ts` supplies the text wordmark **Taste** and the versioned label **Taste (V1.2)** without rewriting historical source paths or internal identifiers.
The app does not provide simultaneous multi-tab editing or merge conflicting edits. Use one editing tab.

Evidence paths remain internal task metadata. The editor no longer appends them to descriptions shown on the public site.
Because storage is browser-local, edits Julio makes only in his local board will not appear automatically on Vercel.
The shipped seed and reviewed updates define what a first-time visitor sees at the deployed origin.
Nothing is submitted to Minerva, sent to participants, or scheduled automatically.
Target dates are personal planning suggestions, not verified academic deadlines.

An existing task's editor has a **Delete task** action. It asks for a second click with the task code and name visible before removal.
Deleting removes that task from the current board and saves its ID, so a later reviewed update cannot recreate it.
It does not renumber other task codes, change sprint settings, or delete evidence files. New unsaved tasks have no Delete action.
Deletion is local to this browser's board; it does not remove the checked-in seed for a first-time visitor on another origin.

The semester outline and table assignment were verified locally in `qa/sprint-assignment-2026-09-23/verification.md`. Julio's visual review remains open.

## Prompt-driven ticket updates

Julio can describe work verbally and ask the agent to create, revise, or move tickets.
The agent should inspect the current board and relevant project chats, then verify the source evidence before changing status.
Mark work Done only when the ticket's stated artifact or outcome has evidence. Keep implementation, approval, publication, and reader findings distinct.

1. Resolve the spoken request to an existing internal task ID, or define a new stable ID and the appropriate epic.
2. Append a uniquely named, reviewed batch to `app/src/scrum/projectUpdates.ts`. Never rewrite a batch already applied to saved boards.
3. For an existing ticket, declare the observed fields in `expected` and only the requested changes in `changes`.
4. Verify source paths, task counts, stable codes, repeat-load behavior, and preservation of custom edits.
5. Build the local preview and check the intended origin's board and list. Confirm the requested result after loading the update.

This is an agent-assisted workflow for explicit requests. It does not automatically read chats, monitor work, or synchronize conversations.
There is no automation, backend task service, or cross-device account connection.

## Implementation boundary

- `app/src/scrum/seed.ts`: curated task and sprint seed.
- `app/src/scrum/projectUpdates.ts`: immutable reviewed task additions and guarded changes from explicit project requests.
- `app/src/scrum/model.ts`: data types, epic assignment and numbering, legacy migration, validation, project-update application, storage loading, dates, and sprint completion.
- `app/src/scrum/ScrumWorkspace.tsx`: task, board, planning, and retrospective interactions.
- `app/src/scrum/scrum.css`: isolated workspace styles.
- `app/src/design-system/DesignSystem.tsx`: shared top bar, three-way selector, and browser dialog.
- `app/tests/scrum-model.test.mjs`: meaningful state and evidence checks.

The existing modal launcher and URL history are shared across the three workspace choices.
Task cards opt into native dragging through the runtime's existing `data-native-drag="true"` escape hatch.
Browser-level text/date fields intentionally use native inputs. The workspace selector, sort control, list status, and task epic/status/points/sprint use shared `MorphingSelect`. All sit outside the phone runtime. Workspace surfaces use 4–8px corners and restrained hover feedback; this supersedes the earlier pill-shaped Scrum controls and larger card radii. Prototype and Design system retain their existing shapes.
Protected runtime files, reader preferences, locale behavior, and device assets remain unchanged. Phone copy uses the new brand.
No deployment was requested or performed.

Current verification record: [Sprint foundation](../qa/sprint-foundation-2026-09-23/verification.md). Build, 23 model tests, and focused desktop/mobile browser checks passed; consult the record for scope and limits.

Earlier verification record: [Taste naming and process refinement](../qa/taste-refinement-2026-09-23/verification.md). Implementation notes do not establish browser verification or visual approval.

Earlier September 23 verification record: [Process documentation and epic codes](../qa/process-epics-2026-09-23/verification.md).

September 21 verification: [simplified fields and restrained surfaces](../qa/scrum-fields-2026-09-21/verification.md). Earlier checks: [selection motion and surfaces](../qa/morphing-selection-2026-09-21/verification.md) and [workspace navigation](../qa/workspace-navigation-2026-09-21/verification.md). Historical feature checks remain in `qa/scrum-2026-09-21/`; these do not establish verification of the September 23 additions.
