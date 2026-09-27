# Architecture and sculpture visual studies

Prepared September 23, 2026. Visual acceptance is pending Julio's review.

Julio selected the first study’s architecture B, then broadened the direction to varied 2D drawing treatments. His latest sculpture reference is round 2 C, the Roman woman’s head. [Round 4](round-04/README.md) replaces the rejected modern architectural examples with different engravings and refines Franklin’s clarity and lower corners. Sculpture A and C stay unchanged. Earlier rounds and their feedback remain available below it.

Open [Visual studies](http://127.0.0.1:4184/REVIEW.html#visual-studies). These six examples sit alongside the existing 12-entry review. They do not expand the approval batch or enter the app.

## Direction

- Architecture: consistent 2D engraving and architectural drawing, with varied paper and line treatments. Warm aged paper is optional, alongside white-paper measured drawings and gray crosshatching.
- Sculpture: close faces at visually eye level, frontal or profile; near-black upper background, subtle charcoal below and generous headroom. Crop irrelevant supports outside the thumbnail.
- Retain the original work’s proportions, identity, color, material and damage. Source-based style or background studies are allowed and labeled. No invented restoration or unseen geometry.
- Use A/B/C preference controls and separate notes for each medium. A visual preference does not approve editorial content.

## First-study sources and presentation

| Study | Original dimensions | Source |
|---|---|---|
| Palais Garnier, principal façade | 3841 × 2374 | [Historical engraving, Commons record](https://commons.wikimedia.org/wiki/File:Palais_Garnier_elevation_of_the_principal_facade_-_Mead_1991_p102.jpg) |
| White House, south-front proposal | 6386 × 4893 | [Library of Congress, 1817 drawing](https://www.loc.gov/item/2001698953/) |
| United States Capitol, west-front proposal | 9084 × 7348 | [Library of Congress, 1811 drawing](https://www.loc.gov/item/2001697186/) |
| Nefertiti | 949 × 1076 | Julio's exact supplied reference; [museum object record](https://www.smb.museum/en/museums-institutions/aegyptisches-museum-und-papyrussammlung/collection-research/bust-of-nefertiti/the-bust/) |
| Benjamin Franklin, Houdon | 1454 × 1861 | [The Metropolitan Museum of Art](https://www.metmuseum.org/art/collection/search/208578) |
| Emperor Caracalla | 2911 × 3880 | [The Metropolitan Museum of Art](https://www.metmuseum.org/art/collection/search/253592) |

The two Latrobe images represent historical proposals, not the current buildings. The dates shown belong to the drawings. Garnier's date belongs to the published elevation. Full descriptions, intermediaries and rights records are in `architecture.json` and `sculpture.json`.

Files are unchanged originals. Architecture thumbnails use a 4:3 gray stage. Two recorded display windows omit excess sky, paper and scan margins while preserving the building. Sculpture thumbnails fill a 4:5 frame, trimming small background margins. Clicking any study opens the complete source image. Exact camera heights were not documented by the museum sources; eye-level suitability was checked visually.

The Nefertiti image's photographer remains unverified. Its use here follows Julio's supplied reference. All studies remain local review material; publication is a separate decision.

## Implementation

- `build_section.py`, `studies.css`, and `studies.js` are included by the existing `build_review.py` generator.
- `manifest.json` records local source hashes and display choices. Changed study content invalidates that group's previous preference, while preserving notes.
- `taste-batch-001-visual-directions-v1` stores independent visual feedback. Export includes it under `visualStudies`.
- `?test=1` keeps test feedback temporary. Unsaved field patches merge into the latest saved data, preserving other-tab edits.
- The original `taste-batch-001-review-v2` storage, 12 expected entries and whole-batch approval gate remain intact.
- Rebuild from the project root with `python3 docs/editorial/batches/batch-001/build_review.py`.

## Verification

- All six manifest-linked local originals loaded successfully; dimensions and file hashes verified.
- Generator still reports 12 active entries, 9 held entries and 36 existing image choices.
- The previous review manifest and complete staging archive remain byte-for-byte unchanged.
- Real browser review compared before and after reload: all 12 decisions and notes unchanged. Seven image selections, five writing reviews, and one ready entry remained intact.
- Temporary preference and feedback actions worked independently of the approval gate. Study enlargement hides entry-choice controls; the normal painting viewer restores them.
- Cross-tab regression checks passed for an unsaved note alongside a newer choice, and an unsaved choice alongside a newer note. The original review key remained untouched.
- Desktop comparison inspected at 1280px. At 390px, cards stack in one column without horizontal page overflow. Temporary viewport overrides were reset.
- The existing launchd review service still serves only allowlisted pages and assets on `127.0.0.1:4184`. The main app at port 4173 was unchanged.

Unused exploratory downloads remain preserved but are not linked by the study manifest.
