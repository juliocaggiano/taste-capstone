# Prototype Content Assets

These files support the local Taste (V1.2) prototype. They do not come from DailyArt.

| Local file | Work | Source | Rights status recorded for prototype use |
|---|---|---|---|
| `dante-portrait.jpg` | Portrait of Dante Alighieri, after Sandro Botticelli | [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Dante_Alighieri%27s_portrait_by_Sandro_Botticelli.jpg) | Public domain; attribution rechecked 2026-09-20 |
| `chart-of-hell.jpg` | *Chart of Hell*, Sandro Botticelli | [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Botticelli_ChartOfDantesHell.jpg) | Public domain |
| `great-wave.jpg` | *The Great Wave off Kanagawa*, Katsushika Hokusai | [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Great_Wave_off_Kanagawa.jpg) | Public domain |
| `noh-mask.jpg` | Noh mask: Kojo | [The Metropolitan Museum of Art](https://www.metmuseum.org/art/collection/search/45140) | Public domain; Met Open Access |
| `arabic-bowl.jpg` | Bowl with Arabic inscription | [The Metropolitan Museum of Art](https://www.metmuseum.org/art/collection/search/451802) | CC0; Met Open Access |
| `migrant-mother.jpg` | *Migrant Mother*, Dorothea Lange | [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Dorothea_Lange%E2%80%99s_1936_photograph_%E2%80%9CMigrant_Mother%E2%80%9D.jpg) | Public domain |
| `caligari-poster.jpg` | *The Cabinet of Dr. Caligari* poster | [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:The_Cabinet_of_Doctor_Caligari_Movie_poster.jpg) | Public domain |
| `the-kiss.jpg` | *The Kiss*, Gustav Klimt | [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:The_Kiss_-_Gustav_Klimt_-_Google_Cultural_Institute.jpg) | Public domain |
| `girl-pearl.jpg` | *Girl with a Pearl Earring*, Johannes Vermeer | [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:1665_Girl_with_a_Pearl_Earring.jpg) | Public domain |

Rights labels reflect the linked source pages on 2026-09-03. Recheck each source before distribution. Record the required creator, institution, and license credit in production metadata.

## Image viewer sources — 2026-09-20

The `viewer/` files provide larger images for the expanded artwork viewer. Existing article and gallery images remain unchanged. These files come from the same registered public-domain works, not DailyArt. The viewer should request them when opened, rather than preload them with the article.

| Viewer file | Source original pixels | Viewer pixels | Viewer bytes | Preparation / source |
|---|---:|---:|---:|---|
| `viewer/great-wave.jpg` | 8561 × 6037 | 4096 × 2888 | 4,671,422 | Locally reduced from the [Commons original](https://upload.wikimedia.org/wikipedia/commons/f/f7/Great_Wave_off_Kanagawa.jpg). |
| `viewer/noh-mask.jpg` | 1512 × 2000 | 1512 × 2000 | 1,367,222 | Unchanged [Met source JPEG](https://images.metmuseum.org/CRDImages/as/original/265525.jpg). |
| `viewer/arabic-bowl.jpg` | 3791 × 3791 | 3791 × 3791 | 1,672,695 | Unchanged [Met source JPEG](https://images.metmuseum.org/CRDImages/is/original/DP120823.jpg). |
| `viewer/migrant-mother.jpg` | 1661 × 2048 | 1661 × 2048 | 721,805 | Unchanged [Commons source JPEG](https://upload.wikimedia.org/wikipedia/commons/4/4a/Dorothea_Lange%E2%80%99s_1936_photograph_%E2%80%9CMigrant_Mother%E2%80%9D.jpg). |
| `viewer/the-kiss.jpg` | 7376 × 7401 | 3840 × 3853 | 7,126,574 | [Commons 3840px derivative](https://upload.wikimedia.org/wikipedia/commons/thumb/4/40/The_Kiss_-_Gustav_Klimt_-_Google_Cultural_Institute.jpg/3840px-The_Kiss_-_Gustav_Klimt_-_Google_Cultural_Institute.jpg), saved without further recompression. |
| `viewer/girl-pearl.jpg` | 12285 × 14550 | 3458 × 4096 | 7,443,124 | [Commons 3840px derivative](https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/1665_Girl_with_a_Pearl_Earring.jpg/3840px-1665_Girl_with_a_Pearl_Earring.jpg), locally reduced to a 4096px long edge. |

Total viewer-image payload: **23,002,842 bytes**. Quality was preserved over the approximate 15 MB target. Each file is separate; an opened viewer requests only its selected image.

The Great Wave and Girl with a Pearl Earring derivatives use Lanczos resizing, JPEG quality 95, full 4:4:4 chroma, and progressive encoding. Embedded ICC color profiles are preserved when supplied. No source was upscaled. The source JPEGs below the size cap remain unchanged. Images have been decoded and visually inspected; dimensions, byte lengths, and SHA-256 hashes are recorded in `viewer/source-manifest.json`.

The huge originals for The Kiss and Girl with a Pearl Earring returned a server rate limit. Wikimedia explicitly recommended its [supported thumbnail sizes](https://www.mediawiki.org/wiki/Common_thumbnail_sizes). One attempt per work at the supported 3840px size succeeded. Those originals were therefore not downloaded; their original dimensions and sizes were verified through Commons metadata. Describe the downloaded viewer files as viewing images or derivatives, not archival originals. Large original files are not included in the app bundle.

Rights and credit details:

- The four Commons files retain their public-domain status from the original file-description pages linked in the table above this section. Derivative image resizing does not introduce another work or rights source.
- Noh mask: The Metropolitan Museum of Art, Rogers Fund, 1925, object 25.60.38. The [current object record](https://www.metmuseum.org/art/collection/search/45140) dates the work to the 19th century.
- Bowl: The Metropolitan Museum of Art, Rogers Fund, 1965, object 65.106.2. The [current object record](https://www.metmuseum.org/art/collection/search/451802) identifies its public-domain status. The [Met Open Access policy](https://www.metmuseum.org/about-the-met/policies-and-documents/open-access) supplies eligible images under CC0.
- The two Met API records return `isPublicDomain: true`. Creator, institution, and source credits remain useful provenance even where attribution is not a license condition.
- Today’s portrait remains at its source maximum, 850 × 1296. Chart of Hell and the Caligari poster also retain their existing source-original files. Zoom does not create additional recorded detail in these images.

## Progressive viewer derivatives — 2026-09-20

`viewer/tiles/` contains local derivatives of the nine catalog images above. No National Gallery image, tile, code, or media was copied. The complete viewer JPEGs remain unchanged and remain the download targets. Existing source rights and credits apply to these derivatives.

Generate with `python3 app/scripts/generate-viewer-tiles.py` from the project root. The script reads the current catalog's `viewerImage ?? image` paths, writes the typed URL-keyed manifest to `app/src/artwork-tiles.ts`, and records source/output hashes, dimensions, encoding choices, and fidelity checks in `viewer/tiles/manifest.json`. It uses the installed Pillow and does not access the network.

Each native-resolution tile spans a 512px cell with one extra pixel on each interior edge. Bounds are clamped to the source image. Previews fit within 768 × 768px without upscaling, using Lanczos resizing and progressive JPEG quality 90 with full 4:4:4 chroma. The viewer can retain a preview beneath independently loaded detail tiles. These files do not form a multilevel pyramid.

The lossless WebP candidate totaled **68,035,503 bytes**, above the 60,000,000-byte experiment limit. The selected detail tiles use JPEG quality 94 and full 4:4:4 chroma. They preserve native pixel dimensions and embedded ICC profiles but are not pixel-identical to the source JPEGs after recompression. Every generated tile was decoded and compared with its corresponding decoded source crop; per-record RGB error and peak signal-to-noise measurements are recorded in the manifest. Do not describe these detail tiles as lossless.

| Catalog record | Detail dimensions | Tiles | Detail bytes | Preview bytes |
|---|---:|---:|---:|---:|
| Divine Comedy portrait | 850 × 1296 | 6 | 294,073 | 96,819 |
| Chart of Hell | 800 × 559 | 4 | 179,644 | 164,525 |
| Great Wave | 4096 × 2888 | 48 | 4,508,636 | 148,305 |
| Noh mask | 1512 × 2000 | 12 | 616,636 | 71,351 |
| Arabic bowl | 3791 × 3791 | 64 | 2,699,245 | 88,650 |
| Migrant Mother | 1661 × 2048 | 16 | 1,178,938 | 141,212 |
| Caligari poster | 1206 × 1800 | 12 | 623,134 | 138,949 |
| The Kiss | 3840 × 3853 | 64 | 11,479,797 | 309,579 |
| Girl with a Pearl Earring | 3458 × 4096 | 56 | 7,525,999 | 147,603 |
| **Total** | | **282** | **29,106,102** | **1,306,993** |

The total derivative payload is **30,413,095 bytes**, excluding the small metadata files. It is stored as 282 separate detail tiles and nine previews, so the viewer can request only the currently visible regions. These derivatives do not increase the detail available in the original bundled sources.

## Landscape zoom example: The Death of Socrates — 2026-09-20

Added Jacques Louis David's *The Death of Socrates* (1787), oil on canvas, from [The Metropolitan Museum of Art, object 436105](https://www.metmuseum.org/art/collection/search/436105). The official object page labels the image public domain. Its [Open Access API record](https://collectionapi.metmuseum.org/public/collection/v1/objects/436105) returns `isPublicDomain: true`; the [Met Open Access policy](https://www.metmuseum.org/hubs/open-access) makes eligible images available under CC0. Credit: Catharine Lorillard Wolfe Collection, Wolfe Fund, 1931, object 31.45.

| File | Dimensions | Bytes | Preparation |
|---|---:|---:|---|
| `viewer/death-of-socrates.jpg` | 4000 × 2663 | 1,793,830 | Byte-identical [official API primary-image original](https://images.metmuseum.org/CRDImages/ep/original/DP-13139-001.jpg). |
| `death-of-socrates.jpg` | 1600 × 1065 | 451,033 | Lanczos reduction; progressive JPEG quality 95; full 4:4:4 chroma. |

Both images decode successfully. The article derivative was visually inspected. No image was upscaled, cropped, or color-adjusted; the source supplied no ICC profile. Source and derivative hashes are recorded in `viewer/source-manifest.json`.

The official primary-image original supplies **4000 × 2663 pixels**, not 6000px or higher. The linked artwork-page main-image route supplies a smaller 1200 × 799 image. No larger official master was verified. This is a landscape alternative to the existing 850 × 1296 Dante portrait; do not describe it as an archival-resolution master.

The landscape source adds 48 native-detail tiles in an 8 × 6 grid, with a 768 × 511px preview. Detail tiles total 2,297,061 bytes and the preview is 81,901 bytes. Generation retains the existing 512px grid, 1px overlap, and quality-94 JPEG encoding. All 49 generated files and the unchanged original were hash-verified. The ten-work catalog now totals 330 tiles, 31,403,163 detail bytes, and 1,388,894 preview bytes. The earlier nine-work table documents the initial experiment.
