# Round 2 — selected visual directions

[Open the comparison](http://127.0.0.1:4184/REVIEW.html#visual-studies).

Julio selected architecture B, the White House drawing's fine lines and soft washes, and sculpture C, the Caracalla portrait's charcoal background. These selections are recorded in the first study. The six new candidates below await review.

## Images

| Medium | Work | Displayed file | Treatment |
|---|---|---|---|
| Architecture | Palais Garnier | [Image](assets/palais-garnier-sepia-study.png) | AI style study from the historical elevation |
| Architecture | Edith Farnsworth House | [Image](assets/farnsworth-house-sepia-study.png) | AI style study from a HABS measured south elevation |
| Architecture | Neue Nationalgalerie | [Image](assets/neue-nationalgalerie-sepia-study.png) | AI style study from the architect's documented east elevation |
| Sculpture | Nefertiti | [Image](assets/nefertiti-profile.png) | AI background study from Julio's reference |
| Sculpture | Benjamin Franklin | [Image](assets/houdon-benjamin-franklin.png) | AI background study from the Met photograph |
| Sculpture | Roman woman | [Image](originals/roman-woman-head.jpg) | Unchanged Met photograph; already matches the direction |

The [Roman generated alternative](assets/roman-woman-head.png) is retained, but is not the displayed candidate. The original already has the desired backdrop and retains the most source detail.

## Fidelity

Architecture treatments preserve the checked principal façade arrangements, proportions, rooflines and major supports. Fine ornament, interior lines, glazing reflections and surface texture are interpretive. These generated images are illustrative treatments, not historical documents or measured construction drawings. The warm paper does not imply an earlier date for the modern buildings.

The two sculpture edits keep the photographed pose, recognizable contour, material, colors and visible damage. Fine texture and local tones were regenerated. They do not preserve foreground pixels exactly. The Roman woman's displayed photograph is unchanged.

The review labels every candidate's treatment. Each generated image has an expandable source comparison with full-size viewing. Unedited source images, source records, dimensions, hashes and detailed fidelity checks remain in [architecture.json](architecture.json) and [sculpture.json](sculpture.json). Full source sheets and PDF files are retained in `originals/`.

## Generation

Used the built-in ChatGPT image-generation tool, with separate target and style references. Six calls produced six images; five treatments are displayed. No fallback CLI/API calls were used. [Exact prompts](PROMPTS.md) are saved for all six outputs. Source and generation metadata stay with each record.

## Review preservation

- The 12 editorial entries and their 36 image choices remain unchanged. No app import occurred.
- Earlier visual records retain their original fingerprints and feedback.
- New records use `architecture-round-2` and `sculpture-round-2`, with no default choice. Both rounds remain in exports.
- Preferences and notes remain separate from writing approval and the whole-batch release gate.
- The first study is available below the new images in a collapsed section.

## Verification

Source/output comparisons checked each candidate at full size. The review's image loading, generated/source labels, source viewer, temporary preference controls and unchanged approval gate were checked in the browser. See the final checks in [verification.json](verification.json).
