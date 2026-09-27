# Two-work visual study

September 21, 2026. Proposed treatment for Julio’s review, not an approved app change.

## Presentation specification

Use a quiet catalogue presentation: a complete, recognizable artifact on a neutral background. Borobudur and David should belong to the same visual family while retaining their different proportions.

| Element | Proposed rule |
| --- | --- |
| File | One square PNG per work, at the generator’s native resolution. Aim for at least 1536 × 1536 when available. Record actual dimensions. |
| Background | Flat light gray, targeting `#f2f2f2`, with a very soft contact shadow. No scenic setting, horizon line, vignette or decorative platform. PNG does not itself imply transparency; this first study uses an opaque neutral background. |
| Composition | Show the entire artifact and its integral base. Center its bounding box; keep the longest dimension near 82% of the canvas, leaving at least 8% clearance. Fine-tune optical placement after comparing both images. |
| Camera | Restrained three-quarter frontal presentation, no wide-angle distortion or strong tilt. Stay close to each supplied reference’s viewpoint. Do not invent a matching camera rotation that exposes undocumented sides. |
| Light | Broad, soft light from the upper left. Gentle material shading, readable details, no dramatic spotlight or glossy showroom finish. |
| Material | Preserve the monument’s weathered gray stone and David’s subtly warm white marble. The neutral interface does not require recoloring the artifacts. |
| Image contents | Artifact only. Keep names, dates, labels and source information outside the generated pixels. |
| Review container | Equal square stages, `object-fit: contain`, light-gray surface and 8px corners applied in the page. Preserve the full PNG when opened separately. |
| Review typography | PP Neue Montreal, regular. Title 20/24; creator/date 12/16; short explanatory text 14/20. Dark `#252525`, secondary `#6e6e6e`, white page. Use the installed family; do not introduce a new font asset. |
| Spacing | 4px image-to-metadata gap, 2px within metadata, 8px between related items, 24px between the two study cards. Stack cards on narrow screens. |

These are study-specific framing proposals. A square stage makes the two treatments easy to compare; it does not replace existing Daily or viewer geometry. Borobudur will occupy less vertical space than David. Enlarging it to David’s height would crop or distort the building. Equal longest-edge occupancy is the starting rule, not a claim of equal physical scale.

The current batch review uses system typography, large headings and images with varying aspect ratios. Keep its useful side-by-side image/text organization, but use the current palette and compact typography for this study. The latest design-system decisions override older Inter substitutions in the same document.

## Borobudur: fidelity requirements

- Preserve its broad, stepped silhouette, square lower terraces, stairways and upper circular platforms. Keep the proportions of the central stupa to the whole monument.
- Retain the distinction between enclosed lower galleries and the upper rings of perforated, bell-shaped stupas. Do not turn them into pagoda roofs or a field of identical pointed towers.
- Preserve visible stone texture, carved relief bands, Buddha niches and architectural spacing. Avoid invented inscriptions or sharpened decorative patterns that look authoritative at close range.
- Removing trees, tourists, lawn and sky is a presentation change. It must not become an imagined restoration of missing architecture.
- The reference shows the northwest view. Keep that identifiable orientation and the stairs visible there. A single photograph cannot verify every hidden terrace or all 72 upper stupas; do not describe the result as an exact archaeological reconstruction.

## David: fidelity requirements

- Preserve Michelangelo’s actual pose: weight on the figure’s right leg, relaxed left knee, left arm bent toward the shoulder, right arm lowered, head turned left.
- Keep the sling, attentive face, curls, hands, feet and integral tree support. Preserve the sculpture’s head and hand proportions instead of making them anatomically more ordinary.
- Retain the marble’s carving and restrained surface variation. Avoid smoothing it into a generic athletic figure or adding pronounced modern musculature.
- Show the complete nude sculpture and integral base without cropping the head, toes or lowered hand. Remove the museum wall and lighting cast from the room; distinguish any retained display pedestal from the original sculpture.
- Do not mirror the image. A mirrored pose would change the work while still looking superficially familiar.

## Review and provenance

Compare each output with its supplied photograph at full size and as a small card. Check silhouette, pose or tier structure, material, edge quality and complete framing before discussing aesthetic polish. Keep the source photograph available beside the study. Use a concise review label such as “Generated presentation study”; record reference credits and generation details separately. Approval of this treatment would not establish image accuracy or publication clearance automatically.

Sources inspected: `docs/DESIGN_SYSTEM.md` (latest September 21 decisions); `docs/design/ROUNDED_SURFACES_AND_MORPHING_SELECT.md`; batch `build_review.py`; the two local reference photographs and their JSON records; the David batch record. Borobudur’s tier structure and upper stupas are also documented by [UNESCO](https://whc.unesco.org/en/list/592). No app files or images were changed for this note.
