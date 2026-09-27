# Visual direction study

Updated September 22, 2026. All examples await Julio’s visual review.

Preview: http://127.0.0.1:4184/visual-study/index.html

## Architecture and sculpture

- Generated PNGs: `borobudur-study.png` and `buddha-study.png`.
- Each is 1254 × 1254, RGBA, with actual transparent pixels. The four corner pixels have alpha 0.
- Natural stone and bronze, soft light, complete silhouettes and a neutral display surface.
- Display at 84% of a square stage; preserve proportions. The surrounding surface can switch between white and `#f2f2f2`.
- Tool: `image_gen.imagegen`, editing the supplied reference photograph. The successful prompts are in `generated-prompts.json`.
- These are generated illustrations, not scans or faithful photographic cutouts. Borobudur’s elevated viewpoint reconstructs unseen terraces and details. The Buddha omits the gold halo and reconstructs the left hand and lotus pedestal; facial modelling differs.
- The original photographs remain accessible through the comparison control. A separate fidelity revision is needed before publication.
- David was the initial sculpture candidate. The image service rejected that generation; the delivered study uses the Great Buddha instead.

## Music

Julio requested a reusable vinyl presentation inspired by the existing Strange Fruit image.

- Same front-facing disc, diameter, grooves, reflections and shadow for every entry.
- Neutral square stage; disc width 79% of the stage. Center label is 36% of the disc diameter.
- Change the label image to the associated album cover or another relevant image. Preserve the source image; the circular mask belongs to the presentation.
- The preview uses a reusable CSS template, avoiding generated or misspelled album typography.
- Beethoven: manuscript artwork. Billie Holiday: the original Strange Fruit release label. João Gilberto: the 1959 Chega de Saudade album cover, supporting the 1958 song recording.
- These vinyls are visual mockups. They do not claim to reproduce actual historical pressings or identify a specific Beethoven recording.

## Cinema

Use an individual frame selected through Julio’s signed-in ShotDeck account. Choose a visually strong frame relevant to the work’s central concerns. Preserve composition, color and original aspect ratio. Store film/version, frame link, source URL and selection rationale in `shotdeck-selections.json`. Keep sources and rights metadata outside reader-facing prose.

## Scope and continuation

- `build_study.py` generates `index.html`. Rebuild after changing the template or ShotDeck selections.
- This folder is a proposal. The 21 entry records, original media, approvals and app content remain unchanged.
- Current specification in this README supersedes the initial two-work proposal in `DIRECTION.md`, including its David, opaque-background and output-size assumptions.
- The persistent editorial review service serves this folder through an explicit allowlist. Its configuration is documented in the parent batch folder.

## September 22 revision — music and local film images

- Julio approved the light gray background. Architecture refinement is deferred; this revision changes only music and film presentation.
- `music.html` shows a full-disc artwork variation with a thin rim, subtle grooves and a 2.88% center hole. Its controls also show the existing center label and a side-by-side comparison for all three tracks. Generate it with `build_music.py`.
- The full-disc direction remains pending review. Preserve source context: manuscript, original label, and 1959 album artwork.
- At Julio’s explicit request, the three selected film frames were saved through Chrome’s native image download action, then copied unchanged to `film-frames/`. Original downloads remain in place.
- `shotdeck-selections.json` records relative paths, verified dimensions, file hashes and download provenance. Local copies now appear directly in this study, `REVIEW.html` and `IMAGES.html`. Frame links open the local image.
- Film selections override review presentation only; the original batch records and their approval states remain unchanged. No database import or publication occurred.

## September 23 — fixed photographic vinyl surround

Julio chose the supplied close-up vinyl photograph as the exact reusable style. Only the purple center label changes for each work. This supersedes the full-disc-cover direction as the default experiment.

- The unmodified 1200 × 1500 source is `references/vinyl-reference.png`; provenance and SHA-256 are in its JSON record.
- `vinyl_template.py` builds one reusable SVG layout. It uses the original photograph across the whole frame, overlays the artwork only within the measured label, then restores the original center hole. The source PNG is never repainted or regenerated.
- Fixed label geometry: center (600, 751), radii (357, 357). A 27.5px cutout at (600.5, 750.5) preserves the hole and its rim.
- The cover fills the label without stretching. A restrained paper shade and pressed center ring apply only inside that label. All surrounding grooves, highlights, shadows and portrait framing stay the same.
- Applied to all three works in `music.html`, the main visual study, the entry review and the image gallery. The older full-disc and small-label examples remain available in the music experiment.
- Keep title/creator outside the image. Beethoven remains a manuscript illustration; Strange Fruit uses its release label; Chega uses the 1959 album cover. This task did not source different artwork.
- Architecture and cinema images remain unchanged. Entry content and approval states remain unchanged. No database import.
