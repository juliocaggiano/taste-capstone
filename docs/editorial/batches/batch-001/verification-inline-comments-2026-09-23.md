# Inline comments and book covers — September 23, 2026

## Completed

- Added select-to-comment feedback inside each story. Saved marks reopen comments; hover previews the feedback. Editing, resolving and reopening preserve each quote and anchor.
- Retained the same browser storage key and existing notes, choices, approval hashes and unknown fields. Additive comment data does not reconstruct or replace entry records.
- Added a whole-batch gate: all 12 expected entries need valid writing approvals, image choices and resolved passage comments. No partial import or automatic publication exists.
- Standardized nine literature thumbnails as filled 600:927 front covers with square corners inside gray stages. Replaced Animal Farm A and all six Gatsby/Vidas covers. Rejected assets remain on disk.
- Preserved Julio's Animal Farm C selection through a migration checked against its unchanged source file, edition, visible metadata and work identity.

## Verification

- Captured the existing completed review before any reload. After the final rebuild, all 12 entries' displayed notes, writing statuses and image choices matched that snapshot exactly. The review showed 1 of 12 entries ready; no new approval was inferred.
- Browser interaction in isolated test mode verified exact phrase selection, opening the editor, entering feedback, saving a highlight, and reopening its feedback.
- A selection crossing two paragraphs retained the complete text and newline in the quote, saved the comment, and highlighted the corresponding spans.
- Desktop and 393 × 852 mobile screenshots checked the comment editor. The mobile document had no horizontal overflow. Temporary viewport overrides were reset.
- Book-frame measurements matched across the row: 288.8125 × 446.21875 pixels at the tested desktop width, zero border radius and object-fit cover. All nine cover URLs return HTTP 200 and correct image content types; actual image dimensions match metadata.
- A separate deterministic review exercised valid/invalid release gates, stale anchors, cross-paragraph anchors, successful edits, unknown-field preservation, failed-save recovery, concurrent comment merges and export isolation.
- Failed storage writes retain pending field/comment edits in memory and replay them over fresh snapshots; they are not lost on subsequent edits. Exported test reviews are explicitly marked, use TEST-ONLY filenames and cannot report ready for release.
- JavaScript syntax and generation pass. Source article bodies remain unchanged. No app source, database or publication state was modified.

## Review state

The full batch remains on hold. Gatsby and Vidas image options need fresh review. Editorial notes were preserved for the next prose revision, including the music clarity/lyrics and film phrasing feedback. No rewrite was silently applied while introducing passage comments.

Browser test comments remain isolated and temporary. Normal-page persistence was confirmed for the user's existing review. Comment write/merge persistence received deterministic testing without adding test comments to the user's real storage.
