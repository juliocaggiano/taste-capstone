# Architecture round 04 — source and visual checks

Prepared 23 September 2026. This round replaces the rejected Farnsworth and Neue Nationalgalerie choices with two different, richly detailed historical engravings. The Palais Garnier image stays identical. No new image generation was used. Prior manifests and assets were not edited.

## A — Palais Garnier, retained

The record copies round 03 A and points to the same round-02 `palais-garnier-sepia-study.png` (1596 × 986). It remains labeled **AI style study**, with the original source, prompt and limits preserved. The new ID separates round-04 preference storage from older rounds. Neither the image nor its source was changed.

## B — St Peter’s Basilica: Michelangelo’s design

- Selected file: `assets/st-peters-duperac.jpg`, 3724 × 2745, unchanged source JPEG.
- [Met collection record, 41.72(3.24)](https://www.metmuseum.org/art/collection/search/364513): Étienne Dupérac, engraving with etching, south elevation of St Peter’s as conceived by Michelangelo.
- [Commons reproduction](https://commons.wikimedia.org/wiki/File:Speculum_Romanae_Magnificentiae-_Elevation_Showing_the_Exterior_of_Saint_Peter%27s_Basilica_from_the_South_as_Conceived_by_Michelagelo_(Published_in_1569)_MET_DP826753.jpg).
- The Met title says published in 1569; its separate date field says 1558–61. The visible date follows the title’s publication statement. The distinct catalog date is recorded in the manifest, without inventing a resolution.
- Current museum credit: Harris Brisbane Dick Fund, 1941. This takes precedence over the different historical credit carried by Commons.
- Met Open Access / Public Domain; Commons identifies the donated reproduction as CC0. Final app-use clearance remains separate.
- The historical design must not be described as the basilica’s current principal façade.

Visual check: full orthographic south elevation, large central dome, paired small domes, stacked pilasters, niches and right-hand portico. The entire architecture is present. The image nearly fills its landscape sheet and needs no crop. Original folds, cream paper, scale and inscriptions remain; no artificial whitening or restoration was applied.

## C — St Paul’s Cathedral, section and decorative proposal

- Selected file: `assets/st-pauls-rooker-1755.jpg`, 1281 × 1920, unchanged museum JPEG.
- [London Museum object A4883](https://www.londonmuseum.org.uk/collections/v/object-101691/section-of-st-pauls-cathedral/).
- [Exact museum download](https://collections.londonmuseum.net/download/583/343/download_2018_03_08_12_00_0007.jpg).
- Museum date: 27 May 1755. The print is a north–south section through the dome, presenting a decorative scheme claimed to follow Christopher Wren’s original intention. It is not proof that all depicted decoration was installed.
- London Museum names Gwyn, Jonathan; Wale, Samuel; and Rooker, Edward. A separately inspected 1912 reproduction credits S. Wale for the architecture, J. Gwynn for decoration and E. Rooker for engraving. The record uses **Edward Rooker, after Samuel Wale and J. Gwynn**, preserving the initial rather than silently resolving the conflicting first name.
- Digital image © London Museum, **CC BY-NC 4.0**. Attribution and noncommercial review are supported; commercial app use is not cleared.
- The [British Museum record P_G.11.48](https://www.britishmuseum.org/collection/object/P_G-11-48) supplied supporting indexed metadata for the print. Direct access returned 403. It was not used to pretend an unseen higher-resolution image had been inspected.

Visual check: dense engraved dome structure, curved interior surfaces, columns, proposed reliefs and painted decoration. This is a transverse section, unlike the rejected perspective candidate below. The complete architectural section remains visible, from lantern to ground level. Original paper color and fine linework are retained.

The manifest’s non-destructive normalized thumbnail window is `[0.025, 0.076, 0.95, 0.76]`. It removes photographic registration targets and the lower dedication, not the architecture. The full source remains available on opening. Its tall proportions remain; it is not stretched into 4:3.

## Alternatives inspected and retained, not displayed

1. `assets/st-pauls-cross-section.jpg`: William Emmett, Yale Center for British Art B1977.14.19134. Although the title says section, the actual image is a receding interior perspective. Rejected against the requested flat projection.
2. `assets/invalides-st-gregory-section-1736.jpg`: Claude Lucas after Jean-Michel Chevotet, 1736, Musée Carnavalet G.39099. [Museum record](https://www.parismuseescollections.paris.fr/fr/musee-carnavalet/oeuvres/coupe-de-la-chapelle-de-st-gregoire-celles-des-3-autres-chapelle-de-st); [IIIF manifest](https://apicollections.parismusees.paris.fr/iiif/320272607/manifest). Authentic CC0 ornate chapel section, but narrower than the chosen complete St Paul’s composition. Not included in the three-choice manifest.
3. `assets/architectural-drawing-and-draughtsmen.pdf`: Reginald Blomfield, *Architectural Drawing and Draughtsmen*, Cassell, 1912; Cornell University Library / Internet Archive scan, [Commons source](https://commons.wikimedia.org/wiki/File:Architectural_drawing_and_draughtsmen_(IA_cu31924015419991).pdf). PDF page 174, zero-based 173, reproduces Rooker’s print. The plate caption says 1755; its illustration index says 1775, an inconsistency resolved for the entry by the London Museum’s dated record.
4. `st-pauls-rooker-book-page-174.png` and `st-pauls-rooker-book-page-174-full.png`: direct PDFium renders at 3× and 4× (1467 × 2163 and 1956 × 2884). They are document renders, not AI edits. The white-paper book reproduction loses fine lines and fills shadow areas. Parent and source review both preferred the sharper museum image. Neither is displayed.
5. `st-pauls-rooker-book-plate-29.png` and `-30.png` are native PDF image layers extracted during diagnosis. They are incomplete layers, not independent usable reproductions. The composed page, rather than either layer, was visually assessed.

All rejected files remain for provenance; none was deleted. Source HTML snapshots accompany the relevant research candidates. No UI, source content batch, app database or earlier round was changed by this sourcing task.
