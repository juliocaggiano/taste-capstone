# Taste (V1.2) — Shared editorial review and Batch 001

Prepared September 21, 2026. All 21 texts revised September 24. Entry-specific feedback recorded September 25 under voice guide v0.20.
Editorial owner: Julio Caggiano.

## Review

Open [Content review](http://127.0.0.1:4184/REVIEW.html) for 40 entries across eight art forms. [Batch 002](../batch-002/README.md) adds five each in painting, cinema, architecture and photography. The initial batch retains its 20 active entries; SESC Pompeia remains in its 21-work archive. [Images only](http://127.0.0.1:4184/IMAGES.html) shows the available candidates without prose. The five new film image sets await ShotDeck access.

The [September 24 revision record](../../research-2026-09-24/remake-21/verification.md) documents the full rewrite. The earlier [visual studies](http://127.0.0.1:4184/REVIEW.html#visual-studies) remain available, with their selections preserved. Architecture now uses Pantheon A/B as the strongest references for recognizable whole-building engravings. The round 4 B St Peter’s engraving and round 2 C Roman woman’s head remain useful references. These preferences do not approve individual entries.

Completed image sets offer three options, labeled A, B and C, except photography. The five photographs each have one authentic original; no artificial variants were made. Explicitly pending film sets show a notice and cannot become approved submissions. Click an image to enlarge it. Choose an image separately from Approve writing or Request changes. Optional notes and decisions save in this browser. Export review downloads those decisions with source metadata and content fingerprints.

Select a passage to add feedback directly to it. Click the saved highlight to edit or resolve the comment; hover to preview it. Comments keep their original quote if a later draft changes. General notes remain intact.

Julio's September 25 review replaces the whole-batch gate with individual approved submissions. “Ship” means collect them in a dedicated folder for later import. The current prototype stays unchanged.

The table records the first submission decisions. The page’s status tabs also include later browser decisions.

| Recorded status | Entries |
|---|---|
| Approved writing and image, ready for the submissions folder | David; Stańczyk; The Death of Marat; The Ambassadors; Beethoven's Ninth Symphony; Strange Fruit; Chega de Saudade; Animal Farm; Vidas Secas; Eternal Sunshine of the Spotless Mind; Soul; I'm Still Here. |
| Writing approved, images awaiting approval | Apollo and Daphne; The Great Gatsby. Gatsby C is a provisional preference, not the final image choice. |
| Requested revisions awaiting review | Pantheon; Borobudur; Great Buddha at Tōdai-ji. Borobudur and Tōdai-ji also need acceptable images. |
| On hold | All three theater entries. |
| Removed from the queue, retained in the archive | SESC Pompeia. |

The [12 approved submissions](../../approved-submissions/batch-001-2026-09-25/INDEX.md) form the first editorial package. [Preview them here](http://127.0.0.1:4184/SUBMISSIONS.html). Each submission retains its approved text, selected image, presentation, sources and approval evidence. A later import will replace the unreviewed demonstration catalog with approved material. This step does not import or publish it.

Available candidate images are downloaded for direct local display. Music uses Julio’s fixed photographic vinyl surround, changing only its center. The first batch’s film options are distinct ShotDeck stills. The next five film sets are pending sign-in. Architecture uses documented drawings; sculpture treatments preserve accessible original photographs. Theater options identify productions or editions. Painting options compare sourced reproductions; book options identify different editions.

No option is selected by default. Recorded selections come from Julio's review. No entry has been imported into the app or a database. Approval applies only to the corresponding text and image. Selecting an image does not approve writing or authorize publication.

## Files and regeneration

- `REVIEW.html`, `IMAGES.html`, `REVIEW.md`: generated review pages and portable reading copy.
- `SUBMISSIONS.html`: read-only preview of recorded approved submissions.
- `batch-001.json`: all 21 source records, including the removed SESC Pompeia entry.
- `architecture.json`, `sculpture-music.json`, `painting-literature.json`, `cinema-theater.json`: editorial source records.
- `review-config.json`: queue membership, held media and submission policy.
- `editorial-decisions.json`: Julio's recorded decisions, conditions, approval evidence and content fingerprints.
- `image-options/*.json`: candidate images and provenance.
- `image-options/assets/`: downloaded candidate files.
- `review-manifest.json`: generated metadata and fingerprints for all 40 queued entries, with source batch IDs.
- `review-compatibility.json`: verified preservation of the user's unchanged Animal Farm C choice when alternative covers changed.
- `feedback/review-2026-09-23-before-inline-comments.json`: snapshot of completed browser notes and decisions before the interface update.
- `review.js`, `review.css`: independent choices, full-size viewer and review layout.
- `visual-study/elevation-portrait/`: the archived visual studies, their source metadata, local originals and separate preference controls.
- `build_review.py`: deterministic generator that reconciles matching recorded decisions; does not invent approval or import content.
- `build_review_21_archive.py`: retained previous generator for the original seven-medium review.
- `verification.md`: initial September 21 checks.
- `verification-image-choices-2026-09-23.md`: earlier four-medium checks.
- `qa-seven-mediums/verification.md`: checks for the expanded seven-medium review.

After editing a source record, option manifest or review code, run `python3 docs/editorial/batches/batch-001/build_review.py` from the project root. Refresh the page. Image choices reset when candidate files or decision-relevant metadata change. Writing decisions reset when the body or displayed work identity changes, unless a matching recorded decision explicitly approves that version. Notes and original passage comments remain available. Approved submission files are snapshots; do not silently replace them with later drafts.

Browser storage uses `taste-batch-001-review-v2`. The `?test=1` query isolates manual verification from Julio’s choices and keeps them temporary. Do not use the normal page to create test approvals.

Visual-direction preferences use `taste-batch-001-visual-directions-v1`. They are included under `visualStudies` in the review export and never approve an editorial entry.

## Editorial and image handoff

The batch follows `../../VOICE_GUIDE.md` and Julio's calibration feedback. September 25 changes target Pantheon, Borobudur, Tōdai-ji and the requested sentence deletions in Apollo and Daphne and Stańczyk. Preserve the remaining approved prose. Earlier A/B preferences are not treated as approval of this batch; the current decisions come from the latest entry-by-entry review.

The Notion corpus informs selections and voice. Institutional sources establish work identity and dates. This update does not claim a new complete review of Notion or Kindle.

Preserve edition distinctions: Chega de Saudade concerns Gilberto’s 1958 recording, although some images belong to the 1959 album or later releases. Beethoven’s composition is distinct from the recorded performances shown on alternative covers. Book and film image metadata identifies the edition or film version.

Record decisions by entry ID, body fingerprint, candidate-set fingerprint and selected option. Keep research and quotation records attached. Follow `../../IMAGE_REVIEW_WORKFLOW.md` for future batches.

The inspected prototype stores unreviewed sample pieces locally. This staging archive is not a production database. Julio identified the approved package as the first editorial submissions for the app. When he requests the later import, map approved records to the chosen content store and reader fields, prepare required locales and resolve production image use. Replace the demo catalog with approved material. Do not import held entries, transfer approval to changed content or assume a one-to-one replacement between unrelated artworks.

## Persistent local review

- Service: `com.juliocaggiano.daily-culture-editorial-review`
- URL: http://127.0.0.1:4184/REVIEW.html
- Runtime: `/usr/local/bin/node` running `serve-review.mjs` in this exact batch folder.
- Host: `127.0.0.1`; strict port 4184.
- Server: allowlisted review/study pages and local image assets only.
- Restart: `launchctl kickstart -k gui/$(id -u)/com.juliocaggiano.daily-culture-editorial-review`
- Logs: `preview-stdout.log` and `preview-stderr.log` in this folder.
- Existing app preview at port 4173 is unchanged.

## Tōdai-ji image hold — September 25

The three new dark-background proposals remain studies. Generation changed fine sculpture details, and one retains a low camera angle. The review shows the original photographs for comparison but disables image selection for these studies. `approvalEligible: false` prevents an accidental submission. A later image pass must preserve the photographed sculpture before these can become selectable candidates. Borobudur, Apollo and Daphne, and Gatsby each have three replacement options ready for editorial review.

## Review status tabs — September 25

Use **All**, **Approved**, or **To review** above the art-form filters. These show current browser decisions, so all entry review controls remain available. Request changes or leave an unresolved passage comment to return an approved entry to To review. Notes alone do not revoke approval. Theater remains on hold in To review. The saved submission snapshot stays frozen until a later deliberate revision.

Direct links: `REVIEW.html#approved`, `REVIEW.html#to-review`, and combinations such as `REVIEW.html#approved/painting`. Existing medium and entry links still work. The same controls appear on IMAGES.html.

## Adding another review batch

Register separate content sources, image manifests and an archive path under `additionalBatches` in `review-config.json`. Extend `expectedEntryIds` with stable unique IDs. Existing content fingerprints and browser storage keys stay unchanged. `awaitingImageEntryIds` permits only explicitly declared empty image sets with a source-access reason; these can receive writing feedback but cannot become approved submissions. Missing undeclared image sets fail the build. Review export includes source batch IDs.
