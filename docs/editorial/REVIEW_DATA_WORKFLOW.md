# Editorial drafts and published works

The review is at http://127.0.0.1:4184/REVIEW.html. The public app is https://taste-capstone.vercel.app/.

- **Live** displays the exact text and selected image in the verified public catalog.
- **Ready to publish** contains newly approved drafts or image changes that differ from the live version.
- **To review** contains unapproved drafts, unresolved passage feedback and held media. A live work can also appear here when a newer draft needs review.
- **All** includes every active editorial work.

Each published work has a Live/Draft switch. Viewing Live never overwrites a newer draft. Its image is a preserved copy of the published asset, so importing a candidate locally cannot silently change the Live view.

Double-click a draft passage, or use **Edit text**, to rewrite it. **Save draft** writes back to its original batch source file and rebuilds the review. Changed prose needs fresh writing approval; selected images and feedback remain intact. **Cancel** leaves the source untouched. Saved previous text is retained under `batches/batch-001/direct-edit-history/` and appears in the collapsed Previous drafts section after reload.

Plain paragraphs, `*italics*` and `> quotations` are supported. HTML is displayed as text. Saving rejects stale versions rather than overwriting another tab's edits. The service accepts writes only from its loopback review origin. It is not a public editing API.

## Source and release flow

1. Drafts: original JSON files listed by `batches/batch-001/review-config.json`.
2. Current editorial choices and passage comments: existing browser key `taste-batch-001-review-v2`; Export review retains these plus current draft bodies. Direct prose edits also persist on disk.
3. Authorized imports: exact approved body and chosen image into `app/src/approved-catalog.json` and `app/public/assets/editorial/`. Review approval does not itself publish anything.
4. Every app build exports `app/public/editorial-catalog.json` from that catalog. This public file includes only already imported artwork content and image identity, never review notes or pending drafts.
5. After a successful Vercel deployment, run `node app/scripts/sync-published-editorial.mjs <deployment-id>` from the project root. It checks the public manifest against the build and downloads all published images, verifying each SHA-256. It updates `docs/editorial/published-catalog.json` and `published-assets/` only after every check passes.
6. Run `python3 docs/editorial/batches/batch-001/build_review.py`, then reload the review. `/api/catalog` serves that verified publication snapshot. Do not mark local builds as Live.

Keep the original frozen `approved-submissions/batch-001-2026-09-25/` package intact. The live catalog, local imported catalog and editorial drafts have separate version identities.

The review service remains `com.juliocaggiano.daily-culture-editorial-review`, bound to port 4184 on loopback. Restart after server changes with `launchctl kickstart -k gui/$(id -u)/com.juliocaggiano.daily-culture-editorial-review`.
