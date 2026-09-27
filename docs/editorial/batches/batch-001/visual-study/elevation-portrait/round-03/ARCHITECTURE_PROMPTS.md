# Architecture comparison — round 03

Created 23 September 2026. This round varies drawing techniques while retaining flat exterior elevations. All round-02 files remain preserved.

## A — Palais Garnier: retained sepia study

- Record: `r3-palais-garnier-sepia`.
- Image: `visual-study/elevation-portrait/round-02/assets/palais-garnier-sepia-study.png`. The exact existing asset is reused.
- Source: [Garnier / de Garron elevation, published 1880](https://commons.wikimedia.org/wiki/File:Palais_Garnier_elevation_of_the_principal_facade_-_Mead_1991_p102.jpg).
- Treatment: the built-in AI sepia ink-and-wash study generated for round 02; no new generation or transformation in this round.
- Prior source/result comparison retains seven central arches, seven upper central window bays, paired domed pavilions and the major roof/sculpture groups. Fine ornament remains interpretive.
- The original prompt and source provenance remain in the record.

## B — Edith Farnsworth House: original measured line drawing

- Record: `r3-farnsworth-measured-line`.
- Image and comparison source: `visual-study/elevation-portrait/round-02/originals/farnsworth-south-elevation-region.png`.
- Source: [HABS IL-1105, sheet 4 of 8](https://www.loc.gov/resource/hhh.il0323.sheet/?sp=4&st=image), downloaded from the [Commons institutional-source mirror](https://commons.wikimedia.org/wiki/File:South_and_North_Elevations_-_Edith_Farnsworth_House,_14520_River_Road,_Plano,_Kendall_County,_IL_HABS_ILL,47-PLAN.V,1-_(sheet_4_of_8).tif).
- Building: 1949–1951. Survey drawing: summer 2009.
- No generation prompt: this is the existing document-region extraction, referenced directly without changing pixels. Four tall supports, terrace, stair flights, glazing and core lines remain exactly as drawn.
- The two terrace labels remain. Sheet-scale annotations and the alternate north elevation are outside the crop. Full HABS sheet and TIFF remain in round-02/originals.
- Visible treatment label: **Measured elevation**.

## C — Neue Nationalgalerie: neutral gray crosshatching

- Record: `r3-neue-nationalgalerie-gray-crosshatch`.
- Image: `visual-study/elevation-portrait/round-03/assets/neue-nationalgalerie-gray-crosshatch-v2.png`.
- Input: `visual-study/elevation-portrait/round-02/originals/neue-nationalgalerie-east-elevation-region.png`.
- Source: [David Chipperfield Architects' refurbishment drawing packet](https://cdn.archilovers.com/projects/5ce43ca1-9036-46a6-8ebc-977323786378.pdf), page 6 of 13, east elevation, 1014_06_D_EE_750.
- Building: 1965–1968. Source drawing packet: 2021.
- Built-in tool: `image_gen__imagegen`. Two calls: initial treatment and targeted correction of the open end bays.
- Output copied from: `/Users/juliocaggiano/.codex/generated_images/01a0bb1e-935c-7790-9e98-384121a67a17/exec-ab291a1a-3b6b-4eaa-aed4-c4556f3d0d8f.png`. Default output remains in place.
- Source/result comparison preserves 18 roof-fascia rectangles, 14 upper glazing bays, four visible major supports, the inset glass perimeter and both sculpture positions. The flat viewpoint remains.
- The first output incorrectly hatched the open end bays below the roof overhang. The second call removed that hatching. Visual comparison confirms both voids are now white while roof, actual glazing and plinth hatching remain. Small stone joints, doors and sculpture outlines are still interpretive.
- The new image avoids yellow/sepia paper, wash clouds and antiquing. It is visibly distinct from A's sepia wash and B's unmodified measured linework.
- Copyright credit remains © David Chipperfield Architects for Bundesamt für Bauwesen und Raumordnung. Source says single use with credit. App-use clearance is not claimed.

### Exact generation prompt

Use case: faithful architectural linework style transfer. Create a single complete orthographic EAST ELEVATION of Neue Nationalgalerie from the supplied source drawing. The supplied image is the sole authoritative geometry. Preserve the exact straight-on projection, low wide silhouette, all dimensions relative to each other, 18 roof fascia rectangles, four visible major supports, 14 upper glass bays, all lower door/mullion divisions, the inset glass façade, the broad raised plinth, its steps and right-hand ground slope, and the two existing sculpture silhouettes at their exact source positions. Keep every count and spacing. No perspective, newly visible side, imagined architecture, added people, planting, trees, windows or columns. Render the drawing with crisp fine neutral black/gray engraved linework and restrained fine crosshatching on clean white or very pale neutral gray paper. Use subtle sparse diagonal hatching to differentiate roof, glass and stone. Retain legibility of every original division. The building should read as a careful flat architectural etching, with a dark-gray roof and pale glass, not a photoreal rendering. Limit hatching to the depicted architectural surfaces and a very small grounding shadow. Completely uncolored: no yellow, sepia, beige, brown, aged-paper effect, stains, cloudy wash, dramatic sky or dark vignette. No watercolor. Preserve the entire wide plinth and building, centered in a landscape image with modest neutral margins. The building's long horizontal proportion must not be stretched or made taller. No text, labels, captions, scale bar, border, signature or watermark. Change drawing treatment only; keep geometry.

### Targeted correction prompt and result

Precise local correction to image 1 only. Image 1 is the current gray architectural elevation. Image 2 is the authoritative original drawing, supplied solely to identify the two open end bays. In image 1 remove ALL diagonal hatching and gray shading inside the open void at each end beneath the cantilevered roof: the LEFT void between the leftmost external support and the left edge of the recessed glass façade, and the RIGHT void between the right edge of that recessed glass façade and the rightmost external support. These are OPEN AIR, not glass. Make both areas clean white matching the unmarked background, as in image 2. Approximate region of left void: 26%–31% of canvas width and 45%–63% of canvas height; right void: 67%–72% width and 45%–63% height. Use the actual architectural boundaries, not rectangular patches over the supports. Preserve the four vertical supports and glass boundary lines exactly; preserve the 18 roof fascia rectangles and 14 upper glazing bays. Preserve ALL other pixels and visual treatment as closely as possible: roof hatching, hatching inside the real central glass façade, stone plinth and its joints, steps, sculptures, grounding shadow, overall exact flat projection, proportions, placement, white paper and image dimensions. Do not change any other area. Do not regenerate or redesign the building; no new lines or objects. Only erase the misleading hatching/shading from the two open end voids.

- Corrected built-in output: `/Users/juliocaggiano/.codex/generated_images/01a0bb1e-935c-7790-9e98-384121a67a17/exec-b48a15dd-cdd5-491a-8866-7065a4bfc860.png`.
- Copied sibling: `assets/neue-nationalgalerie-gray-crosshatch-v2.png`, 2172 × 724 pixels.
- Both original generated outputs remain in place. The first round-03 asset also remains at `assets/neue-nationalgalerie-gray-crosshatch.png`.
- Corrected result retains four principal supports, 18 roof fascia divisions and 14 upper glazed bays. The canvas is one pixel wider than v1; no material change to the façade arrangement was observed.

## Preservation and verification

Only the new round-03 architecture manifest, this note and its generated C asset were created by this task. A and B point to existing local files. No builder, UI or round-02 file was edited. All three source/output paths and PNG dimensions were verified. SHA-256 comparison confirmed all 23 round-02 files are unchanged.
