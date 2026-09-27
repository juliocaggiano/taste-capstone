# Verification — September 22, 2026

- The persistent review service serves the study page and both PNGs. It also serves both original reference photographs.
- Borobudur and Great Buddha are 1254 × 1254 RGBA PNGs. Each alpha range is 0–255, with transparent corner pixels.
- Both generated images and all three music-label images loaded in the in-app browser at their expected dimensions.
- Original/Study controls changed only the two object images. All vinyl labels remained present.
- White/Light gray controls changed the stage background; transparent objects rendered without a solid image rectangle.
- Desktop screenshot reviewed for framing, complete silhouettes, vinyl consistency and metadata readability.
- ShotDeck’s three full-size source images were inspected in Julio’s signed-in Chrome. They failed to embed in the local in-app page. The study therefore provides frame links and short scene descriptions. No download, proxy or screenshot was used to bypass this limitation.
- Both generated object studies require fidelity refinement. Borobudur includes reconstructed details; the Great Buddha omits the halo and reconstructs parts of the figure/base. These limits are stated in the study and README.
- Local-model scene proposals were rejected after verification; see `local-prepass-verification.md`.
- The main review now links to this study. No entry prose, original images, approval status, app source or database content was replaced.
- This folder has no Git repository. File readback, generated-page inspection and browser checks were used instead of a Git diff.

Visual acceptance remains Julio’s decision.

## September 22 follow-up — completed music variation and downloads

- All six label/full-disc image instances loaded. Full-disc and center-label modes each expose three figures; side-by-side exposes all six. Stage background is exactly rgb(242, 242, 242). The full-disc desktop layout was visually inspected.
- Three original frames were downloaded through the signed-in Chrome’s native image download action at Julio’s explicit request. This supersedes the earlier link-only limitation. No screenshot or proxy was used.
- Local images return HTTP 200 with correct MIME types: QC5VUQXE.jpg (1924 × 1040), K6M8JXPG.jpg (1920 × 1040), N2M5LTVK.png (1920 × 804).
- All three local images loaded in the browser with those dimensions and object-fit contain. Their full compositions are retained. The main review and image gallery also reference all three local assets.
- SHA-256 of batch-001.json was identical before and after rebuilding the review. All 21 records remain pending review and not imported.
- Persistent service configuration passed syntax validation and was restarted on its existing port.

## September 23 — fixed photographic vinyl surround

- Source dimensions measured at 1200 × 1500. The purple boundary measures approximately x245–956 and y395–1107. The reusable circular mask covers that label; the original 27.5px center hole is restored above the replacement.
- The copied source matches the supplied file by SHA-256. The local server returns its original bytes as image/png.
- All four generated pages contain exactly three new SVG thumbnails. The browser verified identical reference URLs, viewBoxes, label masks and center-hole masks, with only the three artwork URLs changing.
- Desktop screenshot visually verified all three label replacements, complete photographic surrounds, retained spindle and lack of remaining purple text. No horizontal page overflow.
- The existing responsive grid retains one column below 650px; the SVG keeps its 4:5 aspect ratio at every size.
- Batch JSON SHA-256 unchanged after rebuilding the review. No text or approval edits.
- Local prepass e30e3ce3-e420-4f5b-a39e-b61a743f9f02: data-source and CSS geometry claims independently verified, but invented line citations failed verification. Hosted inspection supplied the actual line references; no local output was applied as an edit. Raw local output remains at /tmp/daily-culture-vinyl-template-prepass.txt.
