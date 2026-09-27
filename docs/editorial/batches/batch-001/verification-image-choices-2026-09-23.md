# Image-choice review verification — September 23, 2026

## Delivered scope

- Twelve active entries: three each for painting, music, cinema and literature.
- Nine architecture, sculpture and theater entries retained with `reviewAvailability: on_hold`.
- Thirty-six image candidates: three per active entry, labeled A/B/C.
- All article bodies match the original source records. No app content or database was changed.
- No image was preselected. The normal browser review displayed zero selected images and zero reviewed writings after verification.

## Asset checks

- Every referenced asset exists locally, decodes as an image, and matches its recorded dimensions and SHA-256.
- Every candidate URL returned HTTP 200 and an image content type from the existing loopback review service.
- Each entry has three distinct file hashes. Sources and edition/release identities were inspected separately; different hashes alone do not establish different provenance.
- The cinema set contains nine downloaded ShotDeck frames from the correct films, with three distinct scenes each.
- Music options use the same photographic vinyl surround. Only the center image changes.
- Stańczyk C uses a full-color WikiArt reproduction. It derives from the same museum capture as another option; its already-published rendering differs. The archival monochrome fallback is not offered.
- The source manifests retain dimensions, URLs, credits, identity notes and image-use status. `image-options/asset-verification.json` records final file checks.

## Review controls and display

- Browser testing used `?test=1`, which skips real saved choices and keeps test decisions temporary.
- Chose Beethoven image B, approved its writing in test mode, then chose image C from the enlarged viewer. The image changed to C while the writing decision remained approved.
- Closing the viewer returned focus to its opening button. The dialog has an accessible name.
- Moving to Images only preserved test mode and reset temporary choices. Test mode ignores storage events from normal tabs.
- The normal user tab was refreshed and verified to show only the four active filters, 36 options, and no test approvals.
- Desktop screenshots checked the music layout, book covers, film stills and painting comparisons. Mobile review at 393 × 852 used a single image column with no horizontal document overflow. The temporary viewport override was reset.
- JavaScript syntax and Python generation passed. Final generation reported 12 active, 9 held, 36 options, and no missing image sets.
- A separate code review identified test-mode navigation, incomplete approval fingerprints and dialog naming issues. All three were fixed before the final build.

## Decision persistence

Choices and writing decisions save separately under `taste-batch-001-review-v2`. Candidate fingerprints include identity, option metadata, actual asset bytes, and the music presentation template/reference. Writing fingerprints include body, title, creator, date and medium. Changed inputs invalidate their corresponding previous decision; notes remain.

Browser interactions verified temporary choices and decision independence. Persistence and invalidation branches received source review; the real user's storage was not populated with test approvals. Export creates a review JSON file, not a database import. Staging approval fields remain pending until user feedback is explicitly reconciled.

## Limits

Some historical labels and publisher covers are modest resolution. Their true dimensions are recorded; no artificial upscaling is presented as improved source quality. The Ambassadors option A retains a visible source watermark. These differences are disclosed beside the candidates or under Source and image details.

This is an English review batch. Editorial approval, image preference and production image-use clearance remain separate. Source-file and browser verification do not constitute Julio's acceptance.
