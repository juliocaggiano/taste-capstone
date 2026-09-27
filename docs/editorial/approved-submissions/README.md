# Approved submissions

**Current status — 25 September 2026:** Julio subsequently authorized importing the 18 current approved selections into the local prototype. See [Prototype imports](../PROTOTYPE_IMPORTS.md). The first frozen package below remains unchanged as historical evidence; its original later-import status is not the current catalog status.

This directory holds frozen editorial selections for later import. It does not feed the current app automatically.

The first release folder is `batch-001-2026-09-25/`. These are the first initial editorial submissions. Future import should replace the current unreviewed demo catalog rather than append to it. There is no one-to-one replacement mapping yet. The current app, including The Death of Socrates and The Divine Comedy examples, remains unchanged today.

`export_approved.py` validates an explicit decision ledger against the current batch and review manifest. It copies only entries marked ready, with approved writing, an approved image and the approved-submission disposition. It refuses stale fingerprints, changed image files, missing evidence and a different ready subset. It never moves or deletes source files. Different existing package files are not overwritten.

## Decision ledger

```json
{
  "schemaVersion": 1,
  "batchId": "batch-001",
  "packageId": "batch-001-2026-09-25",
  "capturedAt": "actual ISO capture timestamp",
  "entries": [{
    "id": "existing-entry-id",
    "readyForImport": true,
    "writingStatus": "approved",
    "imageStatus": "approved",
    "imageOption": "A",
    "bodyHash": "current review bodyHash",
    "imageHash": "current review imageHash",
    "disposition": "approved_submission",
    "decisionEvidence": ["specific observed approval evidence"]
  }]
}
```

Extra decision fields, including reviewer, recorded time, decision ID and resolved comment IDs, are preserved exactly. Nonready records can remain in the ledger and are not exported. Approval evidence is provided by the reviewing agent, never inferred by this script.

## Package

```text
batch-001-2026-09-25/
  INDEX.md
  README.md
  manifest.json
  checksums.json
  entries/<id>/entry.json
  entries/<id>/entry.md
  entries/<id>/assets/selected.<source extension or svg>
  entries/<id>/assets/original.<extension>  # when a local comparison exists
  entries/<id>/assets/label.<extension>    # music source only
  entries/<id>/assets/cover.<extension>    # literature source only
  assets/vinyl-reference.png              # music surround
  provenance/editorial-decisions.json
  provenance/source-entries.json
  provenance/review-entries.json
  provenance/vinyl_template.py
  provenance/review.css                   # literature framing source
  provenance/export_approved.py
```

Each entry JSON contains the unchanged source record under `entry`, the full explicit `decision`, the selected image and local asset paths under `selectedImage`, and frozen body/image hashes. Use `selectedImage` for later import; the original record’s `media` remains historical metadata. No creator facts or translations are invented. Music SVGs embed the existing vinyl composition; the centre image alone is not treated as the selection. Literature SVGs preserve the gray surround and the sharp rectangular cover, with the existing centered fill crop. Their source cover, responsive frame settings and stylesheet are preserved too.

## Export

After the reviewing agent confirms the ledger is final, run from the project root:

```sh
python3 docs/editorial/approved-submissions/export_approved.py \
  --decisions PATH_TO_FINAL_EDITORIAL_DECISIONS_JSON \
  --expected-ids michelangelo-david,stanczyk,death-of-marat,the-ambassadors,beethoven-symphony-nine,billie-holiday-strange-fruit,joao-gilberto-chega-saudade,animal-farm,vidas-secas,eternal-sunshine,soul,im-still-here
```

This validates without writing. Repeat with `--write` to create the verified copies. The ledger’s package ID sets the default output folder. A repeated run with unchanged inputs verifies the existing files. Source changes require a new package or a deliberate new decision; the exporter does not overwrite a different snapshot.

Editorially approved for later import does not mean imported, published, translated or publication-rights-cleared. Existing rights notes travel with the selected assets without creating a new editorial approval gate.
