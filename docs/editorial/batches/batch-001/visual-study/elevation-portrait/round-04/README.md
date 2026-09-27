# Visual refinement — round 4

September 23, 2026. Local review only.

Julio selected **architecture B, St Peter’s**, as his favorite after this round. The choice is saved in the review under `architecture-round-4`. It is the primary architectural thumbnail reference. This is a visual-direction choice, not approval to release an editorial entry.

Open [the comparison](http://127.0.0.1:4184/REVIEW.html#visual-studies).

## Changes

Architecture A retains Palais Garnier. B and C replace the rejected Farnsworth line drawing and Neue Nationalgalerie crosshatching with original, more detailed historic engravings. See `architecture.json` for precise source identities and document dates.

Sculpture A and C stay unchanged. Franklin B receives clearer local contrast and continuous marble at the bottom corners. The built-in image tool regenerated fine texture and filled the small shoulder gaps. This is labeled as an AI clarity and framing study; the museum original stays available for comparison. It is not a newly discovered higher-resolution museum image.

## Assets and prompts

- New Franklin: `assets/houdon-franklin-refined.png`, 1122 × 1402.
- [Exact Franklin prompt and limits](SCULPTURE_PROMPT.md).
- Architecture source and presentation records: [ARCHITECTURE_SOURCES.md](ARCHITECTURE_SOURCES.md) and `architecture.json`.
- Sculpture source and presentation records: `sculpture.json`.

Earlier images and feedback remain in their archived rounds. The 12-entry editorial batch and approval gate stay separate. No content is imported into the app.

## Prepass

The read-only local worker ran as `f9576107-584e-48dc-a347-fbe314654794`. Its output invented group keys, hashes and image paths, so it was rejected and recorded as failed. The main agent verified the actual manifest keys, asset paths and fingerprints directly. The rejected output is retained only as a QA artifact and is not a project source.

## Verification

Build: 12 active editorial entries, 9 held, 36 existing editorial image choices. All six previous study fingerprints and both editorial file hashes remain unchanged. Nine distinct current source/image paths return the exact local bytes. All six thumbnails loaded and both rows were visually inspected in the browser. All previous choices and notes survived reload.

The portrait-section thumbnail exposed a sizing issue in the shared crop wrapper: its width could exceed the height available in a 4:3 stage. The wrapper now limits its width by the crop ratio, keeping the entire recorded window visible. Earlier row records and fingerprints remain unchanged.

The existing review service was restarted for round-four assets. Nothing was imported into the app. Final visual acceptance remains Julio’s decision.
