# Approved content in the prototype

On 25 September 2026, Julio authorized importing the current Approved-tab selections into the local Taste prototype. The normal catalog now contains 18 works. It replaces the ten unreviewed sample works. The app remains local at http://127.0.0.1:4173/.

## Imported selection

| Work | Medium | Selected image |
|---|---|---|
| David | sculpture | A |
| Stańczyk | painting | A |
| The Death of Marat | painting | A |
| The Ambassadors | painting | B |
| The Third of May 1808 | painting | A |
| The Potato Eaters | painting | B |
| The Gleaners | painting | A |
| Liberty Leading the People | painting | A |
| The School of Athens | painting | A |
| Symphony No. 9 in D minor, Op. 125 | music | A |
| Strange Fruit | music | A |
| Chega de Saudade | music | C |
| Animal Farm | literature | C |
| Vidas Secas | literature | A |
| The Great Gatsby | literature | A |
| Eternal Sunshine of the Spotless Mind | cinema | A |
| Soul | cinema | C |
| I’m Still Here | cinema | C |

## Content and image fidelity

- Bodies, paragraph order, emphasis and quotations match the approved review text. No new translation or editorial rewrite was introduced. Interface controls retain all four locales; the reviewed content stays English.
- Every regular image is copied unchanged. Music uses the selected label in the existing vinyl template. Literature uses the selected cover in the existing sharp rectangular gray frame. After Julio’s September 26 correction, reading previews fill the existing frame with a proportional cover crop, capped at 420px. The expanded viewer retains its full-image presentation. Gallery and related thumbnails retain their previous layout.
- Missing creator lifetimes, biographies, material details and edit timestamps remain unrecorded. Existing verified Jacques-Louis David biography and dates remain available. No public engagement count is invented; imported works start at zero sample saves.
- Titles, creators, years, source URLs and image credit/license metadata remain attached. Technical metadata was mapped only where supported by the source records and approved text.
- The 27 other review entries are excluded. Theater remains on hold. The historical comparison routes retain their sample fixtures. Those fixtures are not in the normal catalog.
- Retired sample saves, notes and folder references remain in browser storage, but the normal Library shows only current catalog works. No old artwork ID was remapped to a different artwork.

## Sources and future updates

- Current evidence: `imports/prototype-2026-09-25/entries.json` and `manifest.json`. The snapshot includes exact source bodies, selections, captured approval evidence and asset hashes. It is local editorial evidence, not public-facing content.
- App catalog: `../../app/src/approved-catalog.json`; adapter: `../../app/src/approved-catalog.ts`; image assets and public credit ledger: `../../app/public/assets/editorial/`.
- Import implementation: `../../app/scripts/import-approved-catalog.py`. It validates the captured Approved set against source text, hashes and image bytes before writing. This script is pinned to the September 25 capture; do not rerun it as a way to infer later approvals.
- Fresh updates require a fresh visible approval capture and explicit import instruction. They must preserve current bodies, chosen images and resolved-comment requirements. New approval clicks do not automatically change the prototype.
- The original 12-entry frozen submission folder remains unchanged. It is historical evidence, not the current app catalog.
- Verification: `../../qa/approved-catalog-import-2026-09-25/verification.md`.

## September 26 local supplements

Julio requested sourced technical information and short creator biographies for the 18 imported works. These now live in `app/src/editorial-information.json` and the shared information components. Unknown fields remain absent; biography prose remains English until separately reviewed translations exist. The original approved article bodies and selected image files remain unchanged.

Reading previews use cover fill. The Death of Marat is bottom-aligned within its existing frame. The expanded viewer retains the full composition. The earlier onboarding pool returns: Girl with a Pearl Earring, The Kiss and the Dante portrait.

The shared editorial queue now contains 55 active entries. Batch 004 and the completed Batch 002 film images remain in review; none were added to the normal app. The frozen submission package remains historical evidence. Further imports still require Julio’s instruction.

Checks: `qa/artwork-details-2026-09-26/verification.md`, `qa/artwork-preview-fill-2026-09-26/verification.md` and `qa/editorial-batch-004-2026-09-26/verification.md`, relative to the project root. This task did not deploy these supplements; the separate publication record in AGENTS.md describes the public prototype.

## Incremental painting import — 27 September 2026

Julio authorized his latest small painting edits, an approved-painting catalog update and Vercel deployment. Live browser decisions selected image A for Liberty Leading the People, Saturn Devouring His Son and The Death of Socrates. Saturn already had writing approval, subject to two explicit sentence deletions. Both were applied exactly, with the comments archived. Liberty and Socrates were imported without prose changes.

The catalog now contains 20 works: two additions, one updated record and 17 unchanged records. Pending revised versions do not replace previously approved app versions. The Gulf Stream had Request changes selected; its single requested deletion is complete, but the revised draft remains pending and is not imported. New works include sourced technical details and use the existing David/Goya biographies.

Fresh evidence lives in `imports/prototype-2026-09-27-paintings/`. `app/scripts/update-approved-paintings.py` supports incremental capture-based painting imports; the original September 25 importer remains pinned to its original capture. Each update requires a fresh capture, named entries and an unused evidence folder. The original frozen submission package remains unchanged.

Production: https://taste-capstone.vercel.app/ — deployment `dpl_CFyrE4NyfPzvBeoobrc7kdpb2VF5`. QA: `qa/painting-approval-import-2026-09-27/verification.md`.

## Review and publication integration — 27 September 2026

Follow [REVIEW_DATA_WORKFLOW.md](REVIEW_DATA_WORKFLOW.md) for direct edits and future releases. The Live view comes from the verified published catalog, while draft approvals remain separate. After each deployment, run the publication synchronization script and rebuild the review. Never replace a live version merely because a newer draft exists.

## Sixteen approved artworks published — 2026-09-30

- Julio confirmed publication of all 16 Ready entries: 10 paintings, 2 Peruvian ceramic sculptures, 2 music recordings and 2 books. Production now contains **45 works** at https://taste-capstone.vercel.app/.
- Deployment `dpl_4diAk9JNmTfYc4ccSub3VM751mV3` is READY. Release commit `0dc9e90` is pushed to `codex/editorial-publication`; publication remains manual.
- Exact approved bodies and selected images are preserved, including Julio’s direct edits. Barge Haulers retains the approved photograph crop through an SVG viewBox; book covers and vinyl layouts retain their established presentation. Sourced facts and creator previews accompany each addition. Previous 29 records and images are unchanged.
- Review: **All 108 / Live 45 / Ready to publish 0 / To review 63**. Status tabs are mutually exclusive. All 108 notes, writing decisions and image choices were checked unchanged. The Barge Haulers source revision number was aligned to the existing revision 2; its approved body was not edited.
- Isolated catalog release from the prior published baseline; main-checkout UI experiments remain local. New local taxonomy classifications cover all 45 imported works. No portfolio settings or integrations changed.
- Import evidence: `docs/editorial/imports/prototype-2026-09-30/` and `prototype-2026-09-30-other-media/`. Checks: `qa/editorial-publication-2026-09-30/verification.md`. Public catalog and all 45 image hashes were verified before synchronizing the Live review snapshot.
