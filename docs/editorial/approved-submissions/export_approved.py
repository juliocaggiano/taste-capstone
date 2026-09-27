#!/usr/bin/env python3
"""Freeze explicitly approved editorial records for later import; copy only.

No app, review, database, or source file is changed. Running without --write
validates inputs and reports the plan. Existing identical output is reusable;
different existing output is refused rather than replaced.
"""
from __future__ import annotations

import argparse
import base64
import hashlib
import importlib.util
import json
import mimetypes
from pathlib import Path
import re
import sys
import xml.etree.ElementTree as ET


ROOT = Path(__file__).resolve().parent
DEFAULT_BATCH = ROOT.parent / "batches" / "batch-001"
MEDIUM_ORDER = ("architecture", "sculpture", "painting", "music", "literature", "theater", "cinema")
LABELS = {key: key.title() for key in MEDIUM_ORDER}
STATUS = "editorially_approved_for_later_import"


class ExportError(ValueError):
    pass


def require(condition, message):
    if not condition:
        raise ExportError(message)


def sha(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


def canonical(value) -> bytes:
    # Must match build_review.py, including its default separators.
    return json.dumps(value, sort_keys=True, ensure_ascii=False).encode()


def fingerprint(value) -> str:
    return sha(canonical(value))[:16]


def json_bytes(value) -> bytes:
    return (json.dumps(value, ensure_ascii=False, indent=2) + "\n").encode()


def read_json(path: Path):
    return json.loads(path.read_text())


def unique_records(items, label):
    require(isinstance(items, list), f"{label}: entries must be a list")
    result = {}
    for item in items:
        entry_id = item.get("id")
        require(isinstance(entry_id, str) and re.fullmatch(r"[a-z0-9][a-z0-9-]*", entry_id), f"{label}: invalid entry ID")
        require(entry_id not in result, f"{label}: duplicate {entry_id}")
        result[entry_id] = item
    return result


def local_source(batch: Path, relative: str) -> Path:
    require(isinstance(relative, str) and relative and not re.match(r"[a-zA-Z]+:", relative), f"Expected local asset: {relative}")
    path = (batch / relative).resolve()
    require(path.is_relative_to(batch.resolve()), f"Asset escapes batch: {relative}")
    require(path.is_file(), f"Missing asset: {relative}")
    return path


def presentation(batch: Path, medium: str):
    if medium != "music":
        return None
    return {name: sha(local_source(batch, name).read_bytes()) for name in (
        "visual-study/vinyl_template.py", "visual-study/references/vinyl-reference.png"
    )}


def data_uri(path: Path) -> str:
    mime = mimetypes.guess_type(path.name)[0]
    require(mime and mime.startswith("image/"), f"Unknown image type: {path.name}")
    return f"data:{mime};base64," + base64.b64encode(path.read_bytes()).decode()


def render_vinyl(batch: Path, option: dict, key: str) -> bytes:
    template = local_source(batch, "visual-study/vinyl_template.py")
    spec = importlib.util.spec_from_file_location("approved_export_vinyl_template", template)
    require(spec is not None and spec.loader is not None, "Cannot load existing vinyl template")
    module = importlib.util.module_from_spec(spec)
    prior = sys.dont_write_bytecode
    sys.dont_write_bytecode = True
    try:
        spec.loader.exec_module(module)
    finally:
        sys.dont_write_bytecode = prior
    media = {**option, "imageUrl": data_uri(local_source(batch, option["imageUrl"]))}
    svg = module.vinyl_thumbnail(media, key, "")
    svg = svg.replace('href="references/vinyl-reference.png"', 'href="' + data_uri(local_source(batch, "visual-study/references/vinyl-reference.png")) + '"')
    node = ET.fromstring(svg)
    require(node.attrib.get("viewBox") == "0 0 1200 1500", "Unexpected vinyl geometry")
    images = list(node.iter("{http://www.w3.org/2000/svg}image"))
    require(len(images) == 3 and all(n.attrib.get("href", "").startswith("data:image/") for n in images), "Vinyl SVG is not self-contained")
    return (svg + "\n").encode()


def book_presentation(batch: Path):
    """Freeze the selected responsive cover treatment at the desktop review width."""
    css = local_source(batch, "review.css").read_text()
    # Fail if the source presentation changes rather than silently freezing stale geometry.
    for rule in (
        '.image-open.literature{padding:24px;background:#f2f2f2}',
        'aspect-ratio:600/927',
        'object-fit:cover;object-position:center;border:0;border-radius:0;box-shadow:none',
    ):
        require(rule in css, "The current book presentation differs from the export renderer")
    return {
        "canvasAspectRatio": [3, 4], "background": "#f2f2f2",
        "referenceContainerCssWidth": (1200 - 56 - 32) / 3,
        "paddingCssPx": 24, "canvasBorderRadiusCssPx": 8,
        "coverAspectRatio": [600, 927], "coverBorderRadius": 0,
        "objectFit": "cover", "objectPosition": "center",
        "sourceCssSha256": sha(css.encode()),
    }


def render_book(batch: Path, option: dict, key: str, style: dict) -> bytes:
    width = style["referenceContainerCssWidth"]
    height = width * 4 / 3
    cover_height = height - 2 * style["paddingCssPx"]
    cover_width = cover_height * 600 / 927
    x, y = (width - cover_width) / 2, style["paddingCssPx"]
    svg = f'''<svg xmlns="http://www.w3.org/2000/svg" width="900" height="1200" viewBox="0 0 {width} {height}" role="img">
<defs><clipPath id="canvas-{key}"><rect width="{width}" height="{height}" rx="8"/></clipPath><clipPath id="cover-{key}"><rect x="{x}" y="{y}" width="{cover_width}" height="{cover_height}"/></clipPath></defs>
<g clip-path="url(#canvas-{key})"><rect width="{width}" height="{height}" fill="#f2f2f2"/>
<image href="{data_uri(local_source(batch, option['imageUrl']))}" x="{x}" y="{y}" width="{cover_width}" height="{cover_height}" preserveAspectRatio="xMidYMid slice" clip-path="url(#cover-{key})"/></g>
</svg>'''
    ET.fromstring(svg)
    return (svg + "\n").encode()


def validate(batch: Path, ledger_path: Path, expected_ids: set[str] | None = None):
    source = read_json(batch / "batch-001.json")
    manifest = read_json(batch / "review-manifest.json")
    ledger = read_json(ledger_path)
    require(ledger.get("schemaVersion") == 1, "Unsupported decision ledger version")
    require(ledger.get("batchId") == source.get("batchId"), "Decision ledger belongs to another batch")
    require(re.fullmatch(r"[a-z0-9][a-z0-9-]*", ledger.get("packageId", "")), "Invalid packageId")
    require(isinstance(ledger.get("capturedAt"), str) and ledger["capturedAt"], "Missing actual ledger capture time")
    entries = unique_records(source["entries"], "source")
    reviews = unique_records(manifest["entries"], "review")
    decisions = unique_records(ledger["entries"], "decisions")
    ready_ids = {key for key, value in decisions.items() if value.get("readyForImport") is True}
    require(ready_ids, "No explicitly ready submissions")
    if expected_ids is not None:
        require(ready_ids == expected_ids, f"Ready IDs differ from the requested subset: missing={sorted(expected_ids-ready_ids)}, extra={sorted(ready_ids-expected_ids)}")
    selected = []
    for entry_id in sorted(ready_ids):
        require(entry_id in entries and entry_id in reviews, f"Missing source/review record: {entry_id}")
        entry, review, decision = entries[entry_id], reviews[entry_id], decisions[entry_id]
        require(decision.get("writingStatus") == "approved", f"Writing is not approved: {entry_id}")
        require(decision.get("imageStatus") == "approved", f"Image is not approved: {entry_id}")
        require(decision.get("disposition") == "approved_submission", f"Conflicting disposition: {entry_id}")
        require(review.get("onHold") is not True, f"Review entry is on hold: {entry_id}")
        require(decision.get("decisionEvidence"), f"Missing decision evidence: {entry_id}")
        require(entry.get("medium") in MEDIUM_ORDER, f"Unknown medium: {entry_id}")
        identity = {key: entry[key] for key in ("title", "creator", "dateDisplay", "medium")}
        body_hash = fingerprint({"identity": identity, "body": entry["body"]})
        require(body_hash == review.get("bodyHash") == decision.get("bodyHash"), f"Stale body approval: {entry_id}")
        options = review.get("options", [])
        ids = [o.get("id") for o in options]
        require(len(ids) == len(set(ids)), f"Duplicate image option: {entry_id}")
        option = next((o for o in options if o.get("id") == decision.get("imageOption")), None)
        require(option is not None, f"Selected image does not exist: {entry_id}")
        require(option.get("approvalEligible") is not False, f"Selected image is not eligible for approval: {entry_id}")
        # Verify every option: the review fingerprint covers the candidate set.
        for candidate in options:
            digest = sha(local_source(batch, candidate["imageUrl"]).read_bytes())
            require(digest == candidate.get("assetSha256"), f"Changed image asset: {entry_id}/{candidate.get('id')}")
        image_hash = fingerprint({"identity": identity, "options": options, "presentation": presentation(batch, entry["medium"])})
        require(image_hash == review.get("imageHash") == decision.get("imageHash"), f"Stale image approval: {entry_id}")
        require(option.get("width", 0) > 0 and option.get("height", 0) > 0, f"Missing image dimensions: {entry_id}")
        selected.append((entry, review, decision, option))
    selected.sort(key=lambda row: (MEDIUM_ORDER.index(row[0]["medium"]), list(entries).index(row[0]["id"])))
    return source, manifest, ledger, selected


def plan_export(batch: Path, ledger_path: Path, expected_ids=None):
    source, reviews, ledger, selected = validate(batch, ledger_path, expected_ids)
    files: dict[str, bytes] = {}
    summaries = []
    for entry, review, decision, option in selected:
        entry_id = entry["id"]
        source_image = local_source(batch, option["imageUrl"])
        prefix = f"entries/{entry_id}/"
        selected_image = {"selectedOption": option, "rightsStatus": option.get("rightsStatus"), "credit": option.get("credit"), "altText": option.get("altText")}
        if entry["medium"] == "music":
            image_name = "assets/selected.svg"
            image_bytes = render_vinyl(batch, option, entry_id)
            files[prefix + "assets/label" + source_image.suffix.lower()] = source_image.read_bytes()
            files["assets/vinyl-reference.png"] = local_source(batch, "visual-study/references/vinyl-reference.png").read_bytes()
            files["provenance/vinyl_template.py"] = local_source(batch, "visual-study/vinyl_template.py").read_bytes()
            selected_image.update(width=1200, height=1500, imageTreatment="Existing vinyl presentation, packaged as a self-contained SVG", components={
                "label": "assets/label" + source_image.suffix.lower(),
                "surround": "../../assets/vinyl-reference.png",
                "template": "../../provenance/vinyl_template.py",
                "templateAndSurroundHashes": presentation(batch, "music"),
            })
        elif entry["medium"] == "literature":
            image_name = "assets/selected.svg"
            style = book_presentation(batch)
            image_bytes = render_book(batch, option, entry_id, style)
            source_name = "assets/cover" + source_image.suffix.lower()
            files[prefix + source_name] = source_image.read_bytes()
            files["provenance/review.css"] = local_source(batch, "review.css").read_bytes()
            selected_image.update(width=900, height=1200,
                imageTreatment="Existing sharp-edged cover within the review's gray frame, packaged as a self-contained SVG",
                presentation=style, components={"cover": source_name, "stylesheet": "../../provenance/review.css"})
        else:
            image_name = "assets/selected" + source_image.suffix.lower()
            image_bytes = source_image.read_bytes()
            selected_image.update(width=option["width"], height=option["height"])
        files[prefix + image_name] = image_bytes
        selected_image.update(imageUrl=image_name, sha256=sha(image_bytes), sourceAssetSha256=option["assetSha256"])
        original_url = option.get("originalImageUrl", "")
        if original_url and not re.match(r"[a-zA-Z]+:", original_url):
            original = local_source(batch, original_url)
            if original == source_image:
                selected_image["originalImageUrl"] = (
                    "assets/label" + source_image.suffix.lower() if entry["medium"] == "music" else
                    "assets/cover" + source_image.suffix.lower() if entry["medium"] == "literature" else image_name
                )
            else:
                original_name = "assets/original" + original.suffix.lower()
                original_bytes = original.read_bytes()
                files[prefix + original_name] = original_bytes
                selected_image.update(originalImageUrl=original_name, originalSha256=sha(original_bytes))
        record = {
            "schemaVersion": 1,
            "status": STATUS,
            "importStatus": "not_imported",
            "publicationStatus": "not_published",
            "sourceBatchId": source["batchId"],
            "entry": entry,
            "decision": decision,
            "selectedImage": selected_image,
            "frozen": {
                "bodyHash": review["bodyHash"],
                "bodySha256": sha(entry["body"].encode()),
                "imageHash": review["imageHash"],
                "sourceEntrySha256": sha(canonical(entry)),
            },
        }
        files[prefix + "entry.json"] = json_bytes(record)
        article = f"# {entry['title']}\n\n{entry['creator']} · {entry['dateDisplay']}\n\n![{option['altText']}]({image_name})\n\n{entry['body']}\n\n---\n\n[Selected image and complete provenance](entry.json)\n"
        files[prefix + "entry.md"] = article.encode()
        summaries.append({"id": entry_id, "title": entry["title"], "medium": entry["medium"], "imageOption": option["id"], "record": prefix + "entry.json", "readingCopy": prefix + "entry.md", "image": prefix + image_name, **record["frozen"], "imageSha256": sha(image_bytes)})
    files["provenance/editorial-decisions.json"] = ledger_path.read_bytes()
    files["provenance/source-entries.json"] = json_bytes([row[0] for row in selected])
    files["provenance/review-entries.json"] = json_bytes([row[1] for row in selected])
    files["provenance/export_approved.py"] = Path(__file__).read_bytes()
    inputs = {"batch-001.json": sha((batch / "batch-001.json").read_bytes()), "review-manifest.json": sha((batch / "review-manifest.json").read_bytes()), "editorial-decisions.json": sha(ledger_path.read_bytes())}
    package = {"schemaVersion": 1, "packageId": ledger["packageId"], "sourceBatchId": source["batchId"], "capturedAt": ledger["capturedAt"], "status": STATUS, "importStatus": "not_imported", "publicationStatus": "not_published", "rightsNote": "Existing source rights and license notes are preserved. Editorial selection is not publication rights clearance.", "inputSha256": inputs, "entries": summaries}
    files["manifest.json"] = json_bytes(package)
    lines = [f"# Approved submissions · {ledger['packageId']}", "", f"{len(summaries)} entries approved for later import. Nothing in this folder has been imported or published.", "", "The selected image and exact approved text are frozen together. Source and rights notes remain attached.", ""]
    for medium in MEDIUM_ORDER:
        group = [row for row in summaries if row["medium"] == medium]
        if not group:
            continue
        lines += [f"## {LABELS[medium]}", ""]
        lines += [f"- [{row['title']}]({row['readingCopy']}) · image {row['imageOption']} · [JSON]({row['record']}) · [image]({row['image']})" for row in group]
        lines.append("")
    files["INDEX.md"] = ("\n".join(lines) + "\n").encode()
    files["README.md"] = PACKAGE_README.encode()
    hashes = {name: {"sha256": sha(data), "bytes": len(data)} for name, data in sorted(files.items())}
    files["checksums.json"] = json_bytes({"algorithm": "sha256", "files": hashes, "note": "This checksum file excludes itself."})
    return ledger, files, summaries


PACKAGE_README = """# Approved submissions for later import

Open INDEX.md for the selected entries, grouped by art form.

These are Taste’s first initial editorial submissions. A future import should replace the current unreviewed demo catalog, rather than append to it. This package defines no one-to-one replacement mapping. The current app, including The Death of Socrates and The Divine Comedy examples, remains unchanged today.

Each entries/<id>/ folder contains entry.md, entry.json and assets/. The body in entry.json is the exact approved source text. The selectedImage field is the image to import; entry.media is retained historical source metadata and must not override the explicit image selection.

Music’s selected.svg embeds the unchanged vinyl photograph and selected centre image using the existing review template. It is self-contained and keeps the 1200 × 1500 composition. The source label, photograph and template are also preserved.

Literature’s selected.svg keeps the approved gray frame and sharp-edged 600:927 cover. It embeds the selected cover unchanged with the same centered fill crop. The SVG freezes the responsive presentation at the existing desktop comparison width; the original cover, frame settings and source stylesheet are preserved for a later responsive implementation.

The decision ledger, source records, review fingerprints and exporter are frozen under provenance/. Each record includes the review body/image hashes, a full body SHA-256, and source entry and image digests. checksums.json covers every package file except itself.

Status: editorially approved for later import. No app, database, translation, creator biography or publication was created by this export. Existing license, attribution and image-treatment notes remain attached; editorial approval does not assert publication rights clearance.

This is a copy-only snapshot. It does not remove source files or change browser review decisions. Later writing or image changes require a new recorded decision and a new package, rather than overwriting this snapshot.
"""


def write_plan(output: Path, files: dict[str, bytes]):
    # Preflight every collision before writing even one output file.
    for relative, data in files.items():
        path = output / relative
        require(not path.exists() or (path.is_file() and path.read_bytes() == data), f"Refusing to replace different existing output: {path}")
    for relative, data in files.items():
        path = output / relative
        path.parent.mkdir(parents=True, exist_ok=True)
        if not path.exists():
            with path.open("xb") as handle:
                handle.write(data)
        require(sha(path.read_bytes()) == sha(data), f"Copy verification failed: {path}")


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--batch", type=Path, default=DEFAULT_BATCH)
    parser.add_argument("--decisions", type=Path, required=True)
    parser.add_argument("--output", type=Path)
    parser.add_argument("--expected-ids", help="Comma-separated exact ready subset; errors on missing or extra ready records")
    parser.add_argument("--write", action="store_true", help="Write verified copies; default only validates")
    args = parser.parse_args()
    try:
        expected = set(args.expected_ids.split(",")) if args.expected_ids else None
        ledger, files, summaries = plan_export(args.batch.resolve(), args.decisions.resolve(), expected)
        output = args.output or ROOT / ledger["packageId"]
        if args.write:
            write_plan(output, files)
        print(json.dumps({"status": "written_and_verified" if args.write else "validated_only", "output": str(output.resolve()), "entryCount": len(summaries), "entryIds": [row["id"] for row in summaries], "fileCount": len(files), "totalBytes": sum(map(len, files.values()))}, indent=2))
    except (ExportError, OSError, KeyError, json.JSONDecodeError, ET.ParseError) as error:
        parser.exit(1, f"Export stopped: {error}\n")


if __name__ == "__main__":
    main()
