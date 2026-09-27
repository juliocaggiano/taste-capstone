# Taste — Batch 002

20 new review candidates prepared on 25 September 2026: five paintings, five films, five architectural works and five photographs.

[Review the drafts](http://127.0.0.1:4184/REVIEW.html#to-review). Each new entry carries a Batch 002 label. Writing, image choices and passage comments use the existing review controls. New drafts begin unapproved. Current browser decisions determine their review status. Nothing is imported or published.

| Medium | Works |
|---|---|
| Painting | The Third of May 1808; The Raft of the Medusa; The Potato Eaters; The Gleaners; Las Meninas |
| Cinema | Her; The Truman Show; Parasite; Bicycle Thieves; 12 Angry Men |
| Architecture | Hagia Sophia; Alhambra; Villa Rotonda; Crystal Palace; St Peter’s Basilica |
| Photography | Portrait of Engalo; Cast of Thousands, Serra Pelada; Children Lifting Their Empty Cups, Vienna; McLean, Virginia; Noor Nisa and her mother, Badakhshan |

Paintings and architecture each offer three sourced images. The updated architecture direction favors recognizable whole-building engravings, with Pantheon A/B as the strongest references. Avoid plan-only and detail-only choices. The option descriptions distinguish proposed designs from completed buildings. No new artwork images were generated.

Photography adds an eighth review category. Each entry uses one authentic, unaltered source image, following Julio’s instruction to avoid artificial variants. Sources include the photographers’ own portfolios, a representing gallery and ICP. Chim’s museum scan is limited to 690 × 700 pixels; its image description states that limit. The [photography guide](../../PHOTOGRAPHY_GUIDE.md) draws on sixteen saved Notion studies and five reopened pages, with fresh research for every photograph.

The five films have complete writing drafts. Their three-frame selections are pending ShotDeck access: the account currently shows a login screen in Chrome. Julio was asked to sign in or authorize official film stills instead. These entries show an explicit image-pending notice, without substitute placeholders or default selections.

## Source files

- `paintings.json`, `architecture.json`, `cinema.json`: editorial drafts, meaning briefs, writing sources and provenance.
- `photography-joey.json`, `photography-salgado-chim.json`, `photography-sternfeld-addario.json`: five photography drafts. Matching image manifests and research notes retain exact exposure identity and source limits.
- `*-images.json`: image choices, original source links, credits and dimensions. Cinema remains explicitly pending until real frames are obtained.
- `*-research.md`: evidence, interpretation checks, quotation decisions and limits.
- `batch-002.json`: generated archive for this batch.

The shared review builder remains in `../batch-001/build_review.py`. Its `review-config.json` registers this batch under `additionalBatches`. It combines the review interface while preserving separate source archives. Candidate assets live in `../batch-001/image-options/assets/<medium>/b002-*`, where the existing local server can serve them.

The initial batch retains its 21 archived records and 20 active review entries. The combined review has 40 entries. The saved ledger contains 12 prior approvals; current browser decisions can add further approvals. Three theater entries remain on hold. The frozen first approved-submissions package remains unchanged.

Past calibration preferences inform these drafts. They do not approve the new versions. New approvals require Julio’s current writing decision, an image selection and resolved comments.
