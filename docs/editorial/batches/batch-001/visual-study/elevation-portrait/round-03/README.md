# Visual refinement — round 3

September 23, 2026. Local review only.

Open [the updated comparison](http://127.0.0.1:4184/REVIEW.html#visual-studies).

## Architecture

The shared direction is 2D engraving and architectural drawing, with freedom to vary paper and line treatment:

- A: existing Palais Garnier sepia ink-and-wash study.
- B: original Farnsworth House measured elevation on white paper.
- C: Neue Nationalgalerie gray crosshatching on white paper.

Keep real geometry and source identity. Historic paper color is optional. [Architecture assets, sources and exact prompts](ARCHITECTURE_PROMPTS.md).

## Sculpture

Round 2 C, the original Met photograph of a Roman woman’s head, is Julio’s selected reference. Keep its darker upper background, headroom and large face. Cropping irrelevant supports is preferred to shrinking the portrait to fit them.

- A: previous Nefertiti image retained for comparison.
- B: Franklin face-and-shoulders close-up; socle outside the crop; near-black headroom and subtle charcoal background.
- C: the original Roman woman photograph, unchanged.

The new Franklin image uses the built-in image tool, starting with the untouched Met photograph. The exact prompt and visual check are in [SCULPTURE_PROMPT.md](SCULPTURE_PROMPT.md). Output: `assets/houdon-franklin-closeup.png`.

The full sources remain available through the review’s comparison controls. Generated images are labeled. Their fine details are interpretive; originals remain the documentary reference.

## Preservation

Earlier round data, assets, choices and notes remain in collapsed archives. New groups have separate identifiers. The twelve editorial entries, their saved decisions and whole-batch approval gate remain separate from these visual studies.

The user’s round 2 sculpture C preference was recorded through the existing review control. New treatments await visual review.

## Verification

- Build remains 12 active entries, 9 held entries and 36 editorial image options.
- Both editorial files retain their previous hashes; all four prior study fingerprints are unchanged.
- Twelve image/source requests returned exact local file bytes. All six current images loaded in the browser.
- Browser comparison confirmed the 12 editorial decisions and notes were unchanged. Earlier visual choices and notes were preserved.
- Franklin enlargement displays the new portrait and hides editorial approval controls. Both current rows were visually inspected.
- The existing review service was restarted after its image allowlist changed. The main app was not edited or restarted.
- Local prepass: `efe6b253-1985-4f71-8c7c-2a7fc03460bf`. Verified original-image paths and original/source equality against JSON and actual files. Verified fingerprint behavior against the builder and preserved-state checks.

Machine-readable checks: `verification.json`. User visual acceptance of the new treatments remains pending.
