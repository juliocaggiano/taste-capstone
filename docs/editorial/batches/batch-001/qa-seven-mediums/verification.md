# Seven-medium review verification

Verified September 23, 2026. Local review only.

## Scope

Julio explicitly reopened all seven mediums: 21 original entries, three per medium. Architecture, sculpture and theater rejoin painting, music, literature and cinema. All 21 now have three local A/B/C candidates: 63 choices. The original article bodies remain unchanged. No records were imported into the app or a production database.

## Preservation

- All 12 prior review records match the baseline exactly, including body/image fingerprints, options and compatibility records.
- Visual-study metadata and fingerprints match the baseline exactly.
- Browser DOM comparison confirmed all 12 prior image choices, writing decisions, notes and passage-comment displays survived the reload.
- The four selected visual directions were preserved.
- Live totals: 7 of 21 images selected, 5 writings reviewed, 1 of 21 entries ready. The five existing general notes remain. There were no saved passage comments at the initial comparison.
- New entries have no default image choice and remain unreviewed. Storage keys are unchanged.

Baselines: `before-review-manifest.json`, `before-visual-manifest.json`. The DOM comparison used the existing user page, without reading or changing storage directly.

## Checks

- Generator: 21 active, 0 held-medium entries, 63 choices, no missing options.
- Seven medium filters each show exactly three entries; All 21 shows all works.
- Each entry has three different candidate file hashes. Actual decoded dimensions match all 63 image records.
- All 64 local candidate/original-source URLs returned HTTP 200 and matched their files byte for byte. See `assets.json`.
- The real release-gate function passed empty, old-12-only, all-21, unresolved/resolved comment, stale-writing, missing-entry, duplicate-entry and missing-candidate cases. See `check-gate.mjs`.
- The gate requires the configured complete set of 21 IDs and complete A/B/C candidates. A partial batch remains held. Readiness never imports content.
- Syntax checks passed for the generator, review script and local server.
- Desktop inspection covered architecture, sculpture, all medium filters, source comparison and enlarged crop rendering.
- At 390 × 844, theater uses a single column; the seven-medium navigation scrolls horizontally and the page does not overflow. The enlarged architectural crop fits inside the viewport without stretching. Temporary viewport settings were reset.
- Cropped full-size images use a clipped SVG viewBox, preserving proportions and hiding source material outside the chosen window. The untouched image remains accessible through View original source.
- A separate `?test=1` page verified image selection, writing approval and notes for a newly added architecture entry. The live page retained its original totals. Test mode does not persist choices and exports cannot mark test data ready for release.
- The user page was left at `REVIEW.html#all`. The temporary test tab was closed.

## Image limits and review boundaries

Architecture uses genuine documented drawings. Historical reconstructions, partial details and unbuilt studies are identified. The SESC drawings vary from 1000 to 3943 pixels wide; no artificial enlargement was used.

Sculpture prioritizes the photographed object over synthetic consistency. David A is a disclosed AI background study with an original-source comparison and texture caveat. Other sculpture choices use original photographs. Some retain gallery backgrounds, source softness or upward perspective, so the selected black-background, eye-level direction is not fully met by every candidate. The generated Buddha treatments changed surface details and were rejected as selectable options; their source records retain that decision.

Theater uses verified stage photographs, posters, playbills and edition material. It does not yet have an approved fixed thumbnail style. Production/date uncertainties are recorded, including the Recife group photograph and the January 17, 1880 Doll’s House playbill.

All images remain candidates for Julio’s visual review. Source provenance and publication-use status remain attached. Selecting an image does not approve its writing or authorize publication.

## Files

Implementation: `review-config.json`, `build_review.py`, `review.js`, `review.css`, `serve-review.mjs`.

Image manifests: `image-options/architecture.json`, `image-options/sculpture.json`, `image-options/theater.json`, plus the three unchanged original manifests.

Source notes: `image-options/architecture-sources.md`, `image-options/sculpture-sources.md`, `theater-sources.md`.

Generated output: `REVIEW.html`, `IMAGES.html`, `REVIEW.md`, `review-manifest.json`, `batch-001.json`.

The persistent service remains `com.juliocaggiano.daily-culture-editorial-review` on loopback port 4184. The main app at port 4173 was not changed.
