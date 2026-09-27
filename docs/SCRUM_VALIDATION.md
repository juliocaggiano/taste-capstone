# Process documentation: Scrum framework and implementation validation

Research date: 2026-09-21. This is an implementation checklist, not certification of Scrum practice.

## Framework requirements

The [2020 Scrum Guide](https://scrumguides.org/scrum-guide.html) defines the framework. A two-week Sprint fits its fixed duration of one month or less. Scrum includes:

- Product Owner, Scrum Master, and Developer accountabilities within a self-managing team.
- Product Backlog with a Product Goal.
- Sprint Backlog with a Sprint Goal, selected work, and a delivery plan.
- A usable Increment meeting an explicit Definition of Done.
- Sprint Planning, Daily Scrum, Sprint Review, and Sprint Retrospective within each Sprint.
- Inspection and adaptation throughout delivery. Scope can change without endangering the Sprint Goal or reducing quality.

This solo workspace is a **personal Scrum adaptation**. Software can support these practices; it cannot establish that the accountabilities or events occurred. A board alone is insufficient. A self-check supports daily planning but is not evidence of a team Daily Scrum. The review should inspect results with relevant people; the retrospective should produce an improvement.

Points, Fibonacci estimates, user-story wording, board columns, and progress charts are optional practices. None is required by the Guide.

## Board and estimation references

[Asana's board documentation](https://help.asana.com/s/article/board-view?language=en_US) supports familiar interaction patterns: task cards grouped into stages, drag and drop, list/board alternatives, filters, and editable task fields. Apply these mechanics with Daily Culture's own interface and content.

[Jira's estimation documentation](https://support.atlassian.com/jira-software-cloud/docs/what-is-estimation-in-jira/) describes estimating work before comparing estimates with completed work across sprints. Its velocity concept uses previous completed sprint estimates. Newly assigned historical points do not establish that baseline.

## Product checks

Established product coverage below draws on the implementation, September 21 browser observations, and focused model tests. September 23 changes are listed separately; earlier browser results do not verify those additions.

- [x] Open the planning workspace beside Prototype and Design system through the existing workspace selector.
- [x] Show the current Sprint Goal and two-week dates. Sprint status remains in Sprint plan.
- [x] Provide an ordered product backlog, selected sprint work, and task delivery details.
- [x] Let Julio create and edit tasks, assign a sprint, set points, and change status.
- [x] Support both drag and drop and a keyboard/touch-accessible status control.
- [x] Persist tasks, sprint notes, and changed fields after reload.
- [x] Provide one optional Reflection, preserving legacy planning, review, retrospective, and improvement notes.
- [x] Replace Goals & rituals with read-only About. Task details use one Description field.
- [x] Keep legacy archived tasks accessible in Product backlog without a separate archive page.
- [x] Provide a standalone Complete sprint action without requiring Reflection text.
- [x] Allow direct task completion without acceptance-criteria or Definition of Done confirmation gates, as Julio requested.
- [x] Distinguish completed implementation from visual approval, publication, academic submission, and user validation.
- [x] Retain unfinished work when a sprint ends; make its next destination clear.
- [x] Offer a local export so the personal plan has a portable backup.

## September 23 implementation update

Source-reviewed behavior. See the [September 23 QA report](../qa/process-epics-2026-09-23/verification.md) for separate browser results and limits.

- [x] Rename the user-facing workspace to **Process documentation** while preserving `?view=scrum` and the existing storage key.
- [x] Use **To do**, **In progress**, and **Done** throughout the board and status controls; normalize legacy `review` tasks to `in-progress`.
- [x] Group existing tasks by content into Product Design (PD), Engineering (ENG), Editorial (ED), User Research (UR), and Capstone Planning (CP).
- [x] Display sequential per-epic codes while preserving internal IDs, saved fields, evidence, and task order.
- [x] Provide an Epic selector and New epic name/prefix fields; commit new epics and numbers only on successful task save.
- [x] Retain assigned codes through ordinary edits and repeated normalization; allocate a destination number when a task changes epic.
- [x] Validate unique prefixes, epic references, and epic task numbers; normalize legacy backups before import.
- [x] Use **Sprint 1** and **Sprint 2**, replacing only the exact original seeded names and preserving custom names.

These are personal workflow choices. The original Scrum Guide requirements and research above remain unchanged.

## Historical reconstruction checks

- [x] Record the first three weeks as reconstructed history in project data and the history handoff, without repeated board disclaimers.
- [x] State the chosen calendar assumption for the two consecutive sprints.
- [x] Associate each historical item with existing project source paths.
- [x] Keep exact event dates separate from a broader reconstructed sprint allocation.
- [x] Mark historical points as retrospective estimates, not measured effort or original commitments.
- [x] Do not manufacture meetings, feedback, acceptance, grades, research findings, or elapsed time.
- [x] Keep undocumented weeks visibly sparse instead of filling them with invented completed work.
- [x] Distinguish a proposed next-week plan from approved deadlines or completed work.
- [x] Avoid velocity, burndown, or forecast claims based on reconstructed data.

## Verification record

The initial implementation passed task creation, editing, its original quality gates, status changes, drag and drop, reload persistence, sprint creation and completion, unfinished-work carryover, planning and daily notes, view navigation, and export. See [functional review](../qa/scrum-2026-09-21/functional-review.md).

Julio's September 21 cleanup supersedes the original task quality gates and verbose detail sections. Task status now changes directly; useful criteria, notes, and source references fit inside Description. The board omits the requested badges, counters, helper text, and reconstruction footer. See the [cleanup verification](../qa/scrum-cleanup-2026-09-21/verification.md).

The later September 21 navigation update adds a shared 44px top bar to all three views. About replaces the editable goals and rituals page; one optional Reflection replaces four sprint-note fields. Completion no longer requires those notes. These are personal workflow choices, not changes to the Scrum Guide requirements above. Latest implementation and browser evidence: [workspace navigation verification](../qa/workspace-navigation-2026-09-21/verification.md).

Chrome extension permissions blocked the browser import roundtrip before the app received a file. Source review verified the import recovery correction; browser recovery remains unverified. Historical evidence and responsive visual checks are documented separately in this QA folder. The checklist above describes product coverage, not certification that historical Scrum events occurred.
