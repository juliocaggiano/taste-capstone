# Taste (V1.2) sprint history and foundation

Original seed prepared on 21 September 2026 for Julio’s personal Daily Culture planning board.
Foundation reviewed on 23 September 2026 under the current name, Taste (V1.2).

The board is a solo Scrum adaptation. It organizes evidence-backed work and a proposed next increment.
It does not establish that a Scrum Team or historical Scrum events existed.

## Current foundation — 23 September

Julio requested a review of project chats and records, then updates to both sprint boards.
The source is the original `app/src/scrum/seed.ts` plus two immutable batches in `app/src/scrum/projectUpdates.ts`:
`2026-09-23-sprint-foundation` and `2026-09-23-latest-deliveries`.
The original inventory remains below as a dated historical snapshot.

The first batch adds 16 tasks: 12 Done, two In progress, and two undated backlog items.
It also moves the existing prototype and editorial review tasks to In progress when their saved fields still match.
The second batch records newly verified saves/boards and Light glass menu deliveries without rewriting the first batch.
It adds the subsequent Today Paper button correction as a separate In progress task.
Across both batches, 17 additions comprise 14 Done, one In progress, and two backlog items.
For an unchanged original board, 22 + 17 = 39 tasks: 14 + 14 = 28 Done, three In progress, and eight To do.
Four of those To do tasks belong to the backlog.

| Scope | Done | In progress | To do | Total |
| --- | ---: | ---: | ---: | ---: |
| Sprint 1 | 7 | 0 | 0 | 7 |
| Sprint 2 | 21 | 3 | 4 | 28 |
| Product backlog | 0 | 0 | 4 | 4 |
| All work | 28 | 3 | 8 | 39 |

These counts were calculated from `freshWorkspace()` on 23 September. Existing custom boards may differ because edits are preserved.
The sprint dates remain 31 August–13 September and 14–27 September.

### Added completed scopes

Each row uses its stable internal ID. Displayed epic numbers are allocated after existing codes and may differ on customized boards.

| Internal ID | Evidence date | Delivered scope | Primary evidence |
| --- | --- | --- | --- |
| taste-moma-exploration | 5 September | Earlier MoMA visual exploration, separately from the initial prototype and screenshot handoff | [MoMA checks](../qa/moma/VERIFICATION.md) |
| taste-reflection-period-1 | 16 September | First biweekly reflection submission receipt; no grade or instructor approval inferred | [Academic source entry point](academic/ACADEMIC_CONTEXT_UPDATE_2026-09-19.md) |
| taste-selection-motion | 21 September | Shared selection, like/count, palette, and compact toast refinements | [Selection](../qa/morphing-selection-2026-09-21/verification.md), [count width](../qa/compact-like-counts-2026-09-21/verification.md), [palette](../qa/stable-likes-palette-2026-09-21/verification.md), [toast](../qa/compact-toast-2026-09-21/verification.md) |
| taste-artwork-information | 21 September | Artwork information, creator biographies, and persistent following | [Artwork panels](../qa/artwork-information-2026-09-21/verification.md), [Follow interaction](../qa/follow-interaction-2026-09-21/verification.md) |
| taste-reading-refinement | 21 September | Daily reading spacing, reduced viewer controls, and copy cleanup | [Reading refinement](../qa/daily-editorial-2026-09-21/verification.md) |
| taste-discover-layout | 21 September | Measured Discover layout and horizontal related artwork cards | [Discover](../qa/discover-paper-2026-09-21/verification.md), [related cards](../qa/related-cards-2026-09-21/verification.md) |
| taste-creator-profiles | 22 September | Creator tabs, artwork browsing, and profile refinements | [Profile reference](../qa/creator-reference-2026-09-21/verification.md), [refinement](../qa/creator-refinement-2026-09-22/verification.md) |
| taste-creator-slide | 23 September | Julio’s selected Slide back transition, with retained scroll and focus | [Selected motion](../qa/creator-motion-variations-2026-09-23/verification.md) |
| taste-editorial-guide | 21 September | Editorial feedback audit and guide through v0.18 | [Audit](editorial/EDITORIAL_AUDIT_2026-09-21.md), [checks](editorial/research-2026-09-21/AUDIT_VERIFICATION.md), [guide](editorial/VOICE_GUIDE.md) |
| taste-editorial-batch | 21 September | Staged 21-entry English batch across seven arts | [Batch handoff](editorial/batches/batch-001/README.md), [verification](editorial/batches/batch-001/verification.md) |
| taste-editorial-images | 23 September | Editorial image study, selected photographic vinyl treatment, and local film frames | [Study handoff](editorial/batches/batch-001/visual-study/README.md), [verification](editorial/batches/batch-001/visual-study/verification.md) |
| taste-process-workspace | 23 September | Personal process workspace, epic codes, solo-workflow cleanup, Taste naming, and motion | [Initial workspace](../qa/scrum-2026-09-21/verification.md), [epics](../qa/process-epics-2026-09-23/verification.md), [refinement](../qa/taste-refinement-2026-09-23/verification.md) |
| taste-today-saves | 23 September | Saved count, Save, personal board selection/creation, and full-screen access | [Save and board checks](../qa/today-save-2026-09-23/verification.md) |
| taste-floating-menu | 23 September | Merged Search/Discover and the refined Light glass menu explicitly selected by Julio | [Menu checks](../qa/floating-menu-2026-09-23/verification.md), [latest chat selection](../qa/sprint-foundation-2026-09-23/history-review.md) |

The staged editorial batch contains exactly 21 unique records, three per medium.
All writing and image statuses remain pending review; all publication statuses remain not imported.
The image study does not certify the fidelity or approval of architecture and sculpture illustrations.
The reflection receipt confirms a submission on September 16; it does not resolve the separate Project Brief deadline conflict.

### Active work and remaining scope

- `taste-today-paper-actions`: In progress, target September 24. Refine Today’s saved-count pill, text-only Save, and expand control against Paper node 1TC-0. Preserve the already delivered save/board behavior.
- `DC-017` / original `PD-007`: In progress. Broader prototype review remains open despite specific accepted choices.
- `DC-018` / original `ED-002`: In progress, renamed **Review the staged editorial batch**. Review writing and images by entry and revision before choosing pilot content.
- `DC-015`: To do, replanned from September 21 to September 24 only when the original open-task fields match. This is a personal target, not a verified academic deadline.
- `DC-016`: To do, replanned from September 22 to September 25 under the same guard. No protocol, recruitment, or participant findings are inferred.
- `DC-019` and `DC-020`: Reader pilot and sprint retrospective planning remain open with their September 26 and 27 targets.
- `taste-create-flow` and `taste-object-images`: New undated backlog items for the Create placeholder and deferred architecture/sculpture fidelity work.
- `DC-021`: Existing publishing backlog now describes approved-record mapping, taxonomy, locales, and image-use checks. `DC-022` remains the account/sync backlog item.

Active implementation and review statuses reflect the inspected project state, not automatic tracking of other tasks.
Later completion requires fresh evidence and a new reviewed update.
The [latest chat review](../qa/sprint-foundation-2026-09-23/history-review.md) distinguishes the explicit Light glass selection from the newer Today button correction.
The older menu QA pending-choice wording predates that selection. It does not reopen the delivered menu task.

### Saved-board updates and future spoken requests

The update applies once to new and existing boards through `appliedProjectUpdates` in the existing browser record.
Additions retain stable IDs. Guarded patches change only matching expected fields; customized records are not reset.
Applied batches remain immutable, including patches skipped because a field had changed.
Future explicit spoken requests can create an append-only batch after the agent checks the current board and sources.
Verify the resulting board and list in the local preview before reporting the requested ticket change complete.
See [the prompt-driven workflow](SCRUM_WORKSPACE.md#prompt-driven-ticket-updates) for the procedure.

This does not add automatic chat synchronization, recurring monitoring, a backend, or cross-device sync.
The internal `daily-culture-scrum-v1` key and existing task IDs remain unchanged.
The reference area contains only **References · previous sprints**. Cards omit assignee initials and align the date left.
Current verification record: [Sprint foundation](../qa/sprint-foundation-2026-09-23/verification.md). Build, 23 model tests, and focused desktop/mobile browser checks passed; see the record for scope and limits.

## Original September 21 seed: dates and evidence boundaries

The requested four weeks use two consecutive 14-day periods:

| Period | Dates | Treatment |
| --- | --- | --- |
| Sprint 1, project week 1 | 31 August–6 September | Reconstructed completed work |
| Sprint 1, project week 2 | 7–13 September | Reconstructed completed work |
| Sprint 2, project week 3 | 14–20 September | Reconstructed completed work |
| Sprint 2, project week 4 | 21–27 September | Proposed personal planning targets |

These are project-history weeks. They are not Minerva’s academic week numbers.
The [September 7 handbook reference](academic/CAPSTONE_HANDBOOK_REFERENCE.md) records Julio identifying that date as academic week one.

The historical Sprint Goals, review, and retrospective observation were reconstructed for this board.
No historical Sprint Planning, Daily Scrum, Sprint Review, or Sprint Retrospective meeting is claimed.
Sprint 1 appears closed because its selected artifact scopes are documented as delivered.
That state does not imply formal Scrum execution during those dates.

Historical completion dates use dated verification or source-preservation records.
They are evidence dates, not exact work-start times, time logs, or proof of daily activity.
The source record does not establish work on every day of each week.
There is no project Git history available at the workspace root to corroborate a commit timeline.

Historical story points are retrospective relative-effort estimates created for this seed.
They were not estimated before those tasks began. They are not hours, measured productivity, or a reliable velocity baseline.
Future points are also provisional. Julio can resize tasks after inspecting his available time.
Do not draw a historical burndown curve from these reconstructed records.

“Done” has a narrow task scope: the named artifact or implementation was delivered and checked.
It does not imply deployment, final visual acceptance, approved editorial content, reader validation, or academic submission.
Those outcomes need their own evidence. Incomplete acceptance is explicitly represented in next-week tasks.

## Product and Sprint Goals

**Product Goal:** Build a daily cultural learning experience whose usefulness can be tested with readers, supported by clear editorial standards and capstone evidence.

**Sprint 1:** Establish the working discovery prototype and preserve the capstone requirements that guide it.

**Sprint 2:** Turn the refined prototype and editorial work into a reviewable reader pilot with a clear learning question.

Sprint 2’s proposed remaining work intentionally includes reader research and learning evidence.
The product’s problem statement remains a hypothesis in [PRODUCT_SPEC.md](PRODUCT_SPEC.md).
The [track reference](academic/CAPSTONE_TRACK_REFERENCE.md) distinguishes evidence of learning from interface completion or engagement.

## Original reconstructed completed work

| ID | Documented date | Delivered scope | Points | Primary evidence |
| --- | --- | --- | ---: | --- |
| DC-001 | 3 September | Core discovery prototype and initial functional QA | 5 | [Initial QA](../qa/design-qa.md) |
| DC-002 | 5 September | Chronological navigation, direction correction, and regression coverage | 5 | [MoMA verification, final inversion section](../qa/moma/VERIFICATION.md) |
| DC-003 | 5 September | Local contribution validation and unfinished-draft persistence | 3 | [Contribution checks](../qa/moma/VERIFICATION.md), [captured states](../qa/screenshot-library-2026-09-05/README.md) |
| DC-004 | 5 September | Browsable redesign screenshot handoff | 3 | [Screenshot-library record](../qa/screenshot-library-2026-09-05/README.md) |
| DC-005 | 7 September | Preserved venture-track reference and requirement conflicts | 2 | [Track source record](academic/CAPSTONE_TRACK_REFERENCE.md) |
| DC-006 | 7 September | Preserved handbook, process requirements, and precedence | 2 | [Handbook source record](academic/CAPSTONE_HANDBOOK_REFERENCE.md) |
| DC-007 | 19 September | Artsy exploration and contribution-sheet overflow correction | 5 | [Artsy QA](../design-qa.md) |
| DC-008 | 19 September | Reusable design-system library and generated exports | 5 | [Starter verification](../qa/design-system-2026-09-19/verification.md) |
| DC-009 | 20 September | Compact monochrome components and pattern examples | 3 | [Monochrome verification](../qa/design-system-monochrome-2026-09-20/verification.md) |
| DC-010 | 20 September | Paper-exact Today and app-wide PP Neue Montreal implementation | 3 | [Paper measurements](../qa/today-paper-exact-2026-09-20/verification.md), [later font checks](../qa/pp-app-image-preview-2026-09-20/verification.md) |
| DC-011 | 20 September | Cropped opening and native-detail artwork viewer | 5 | [Viewer opening verification](../qa/viewer-opening-2026-09-20/verification.md) |
| DC-012 | 20 September | Settings library card, account wording, and five repeat preferences | 2 | [Settings verification](../qa/settings-2026-09-20/verification.md) |
| DC-013 | 20 September | Editorial research, comparisons, and feedback record | 5 | [Collection study](editorial/research-2026-09-19/README.md), [passage study](editorial/research-2026-09-20/README.md), [pending repairs](editorial/CALIBRATION_10_BOOK_FILM_REVISIONS.md) |
| DC-014 | 19 September | Academic context refresh and source links | 1 | [Academic update](academic/ACADEMIC_CONTEXT_UPDATE_2026-09-19.md) |

Sprint 1 has six reconstructed completed tasks and 20 retrospective points.
Sprint 2 has eight reconstructed completed tasks and 29 retrospective points before the proposed final week.
These totals describe the selected seed items. They do not measure all work performed in those periods.

The earlier visual directions remain historical work even when later iterations superseded them.
Current instructions override older directions inside the historical QA records.
Examples include Daily’s final drag inversion, monochrome replacing blue states, and PP Neue Montreal replacing earlier fonts.

Editorial “Done” covers the research and calibration record only.
It does not backdate September 21 feedback or imply the pending Dorian Gray, Parasite, and Raft repairs were approved.
The [current editorial guide](editorial/VOICE_GUIDE.md) and named calibration records retain those distinctions.

## Original proposed final week

The six proposed tasks total 13 provisional points.
This is a planning suggestion, not a commitment inferred from historical velocity.
All dates are personal targets. No academic due date is asserted.

| ID | Target | Proposed outcome | Points | Dependencies or limits |
| --- | --- | --- | ---: | --- |
| DC-015 | 21 September | Confirm current brief, Canvas, and reflection requirements | 1 | Resolve the dated source conflict before treating a date as authoritative |
| DC-016 | 22 September | Reader group, learning question, protocol, and participant-research check | 3 | No participant recruitment or consent is claimed |
| DC-017 | 23 September | Julio’s explicit review of the current prototype surfaces | 2 | Implementation QA is already documented; final visual acceptance is separate |
| DC-018 | 24 September | Review pending editorial repairs and select a small pilot set | 3 | Preserve praised texts; no publication approval inferred |
| DC-019 | 26 September | Small reader pilot and evidence-backed findings | 3 | Depends on DC-016 and DC-018; aim for two readers, with availability unconfirmed |
| DC-020 | 27 September | Sprint Review record, one retrospective improvement, and ordered next work | 1 | Use actual outcomes; move unfinished work to the backlog explicitly |

If the confirmed academic deadline or deliverable scope requires more work, replan Sprint 2 immediately.
If participants are unavailable, record the blocker. Do not mark the reader pilot complete based on a protocol alone.
The board creates planning items only. It does not send invitations, submit assignments, or schedule notifications.

The two undated backlog items cover content publishing and accounts/cross-device libraries.
They remain unestimated until reader evidence and scope are clearer.

## Historical quality criteria

The seed uses the shared Definition of Done exported in `app/src/scrum/seed.ts`:

1. Save the promised artifact or working change, with a retrievable evidence record.
2. Verify each acceptance criterion against the agreed task scope.
3. Run relevant checks for code, sources, accessibility, and content rights.
4. Record limitations and distinguish implementation completion from visual or editorial approval.
5. Update the handoff and identify the next decision when further work remains.

Historical criteria are checked only where the source evidence supports the stated scope.
They do not certify compliance with a Definition of Done that existed before this board was created.
These legacy criteria remain source data, not a required task-form checklist. The current UI uses one Description and a direct status change.
New foundation tasks keep concise descriptions and evidence records. Agents must inspect their evidence before marking the named scope complete.

## Scrum interpretation and limits

The implementation should support these planning relationships:

| Scrum element | Personal-board treatment |
| --- | --- |
| Product Goal and Product Backlog | One goal and an ordered pool of future work |
| Sprint Goal and Sprint Backlog | One goal per 14-day sprint, with selected tasks and an editable plan |
| Increment and Definition of Done | A usable, inspectable result supported by task evidence and explicit quality criteria |
| Sprint Planning | Julio chooses a goal and feasible scope before committing new work |
| Daily Scrum | A short personal inspection and plan adjustment; a solo adaptation of a team event |
| Sprint Review | Inspect the result and its value, preferably with relevant readers or stakeholders |
| Sprint Retrospective | Record one concrete improvement to the next cycle |

Story points, workflow columns, and task due dates are optional planning aids.
They do not establish Scrum compliance. A board alone cannot verify the actual practice of events or accountabilities.
Julio handles product decisions, development, and process for this personal workspace.
This differs from the Scrum Guide’s team-based accountabilities.

The final implementation review should separately verify the interface, persistence, editing, sprint transitions, and evidence visibility.
This history handoff does not report those new implementation checks as already passed.

## Seed implementation

`app/src/scrum/seed.ts` exports:

- `ScrumTask`, `ScrumSprint`, `ScrumStatus`, and `ScrumWeek` types.
- `seedTasks`, `seedSprints`, `productGoal`, and `definitionOfDone`.
- Task-level acceptance criteria, checked state, source paths, and provenance notes.

Evidence paths are relative to the Daily Culture project root.
The seed avoids embedding private raw transcripts, annotations, grades, or personal research text in the board.
The relevant source files were inspected directly. Weekly review summaries were used only as corroborating retrieval aids.

## Original source audit

The completed-task evidence paths were checked against local files on 21 September.
The seed contains 22 unique task IDs, two 14-day sprints, and no historical completion date outside its assigned week.
All 14 completed tasks contain evidence and checked criteria.
All six proposed tasks use 21–27 September targets. Both backlog tasks remain undated and unestimated.
These September 21 counts describe the original seed, not the September 23 foundation above.
