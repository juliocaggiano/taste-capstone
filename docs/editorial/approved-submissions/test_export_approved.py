"""Focused integrity tests. All test writes stay in a new temporary folder."""
import copy
import importlib.util
import json
from pathlib import Path
import tempfile
import unittest
import xml.etree.ElementTree as ET


HERE = Path(__file__).resolve().parent
spec = importlib.util.spec_from_file_location("export_approved", HERE / "export_approved.py")
export = importlib.util.module_from_spec(spec)
spec.loader.exec_module(export)


class ExportTests(unittest.TestCase):
    def setUp(self):
        # Retain this explicitly labelled disposable fixture rather than delete files.
        self.root = Path(tempfile.mkdtemp(prefix="taste-export-integrity-test-"))
        self.batch = self.root / "batch"
        self.batch.mkdir()
        (self.batch / "review.css").write_bytes((export.DEFAULT_BATCH / "review.css").read_bytes())
        self.asset = self.batch / "image-options/assets/test.png"
        self.asset.parent.mkdir(parents=True)
        self.asset.write_bytes(b"fixed-test-image-payload")
        self.entry = {"id": "test-entry", "title": "Test entry", "creator": "Test creator", "dateDisplay": "2000", "medium": "literature", "body": "Exact test paragraph.", "media": {"historical": True}}
        self.option = {"id": "A", "imageUrl": "image-options/assets/test.png", "altText": "Test image", "width": 1, "height": 1, "rightsStatus": "review_only_pending_clearance", "assetSha256": export.sha(self.asset.read_bytes())}
        self.decision = {"id": "test-entry", "readyForImport": True, "writingStatus": "approved", "imageStatus": "approved", "imageOption": "A", "disposition": "approved_submission", "decisionEvidence": ["TEST FIXTURE ONLY; not a user decision"]}
        self.ledger_path = self.root / "test-decisions.json"
        self.save_inputs()

    def save_inputs(self):
        identity = {k: self.entry[k] for k in ("title", "creator", "dateDisplay", "medium")}
        review = {"id": self.entry["id"], "options": [self.option], "bodyHash": export.fingerprint({"identity": identity, "body": self.entry["body"]}), "imageHash": export.fingerprint({"identity": identity, "options": [self.option], "presentation": export.presentation(self.batch, self.entry["medium"])})}
        self.decision.update(bodyHash=review["bodyHash"], imageHash=review["imageHash"])
        (self.batch / "batch-001.json").write_bytes(export.json_bytes({"batchId": "batch-001", "entries": [self.entry]}))
        (self.batch / "review-manifest.json").write_bytes(export.json_bytes({"entries": [review]}))
        self.ledger_path.write_bytes(export.json_bytes({"schemaVersion": 1, "batchId": "batch-001", "packageId": "test-package", "capturedAt": "2026-09-25T00:00:00Z", "entries": [self.decision]}))

    def test_exact_copy_and_idempotent_write(self):
        _, files, _ = export.plan_export(self.batch, self.ledger_path, {"test-entry"})
        output = self.root / "output"
        export.write_plan(output, files)
        export.write_plan(output, files)
        record = json.loads((output / "entries/test-entry/entry.json").read_text())
        self.assertEqual(record["entry"], self.entry)
        self.assertEqual(record["selectedImage"]["rightsStatus"], self.option["rightsStatus"])
        self.assertEqual(record["importStatus"], "not_imported")
        checksums = json.loads((output / "checksums.json").read_text())
        for name, check in checksums["files"].items():
            self.assertEqual(export.sha((output / name).read_bytes()), check["sha256"])

    def test_changed_body_rejected(self):
        source = json.loads((self.batch / "batch-001.json").read_text())
        source["entries"][0]["body"] = "Later unapproved edit."
        (self.batch / "batch-001.json").write_bytes(export.json_bytes(source))
        with self.assertRaisesRegex(export.ExportError, "Stale body"):
            export.plan_export(self.batch, self.ledger_path)

    def test_changed_asset_rejected(self):
        self.asset.write_bytes(b"different asset")
        with self.assertRaisesRegex(export.ExportError, "Changed image asset"):
            export.plan_export(self.batch, self.ledger_path)

    def test_provisional_image_rejected(self):
        ledger = json.loads(self.ledger_path.read_text())
        ledger["entries"][0]["imageStatus"] = "preferred_pending_review"
        self.ledger_path.write_bytes(export.json_bytes(ledger))
        with self.assertRaisesRegex(export.ExportError, "Image is not approved"):
            export.plan_export(self.batch, self.ledger_path)

    def test_held_review_entry_rejected(self):
        path = self.batch / "review-manifest.json"
        review = json.loads(path.read_text())
        review["entries"][0]["onHold"] = True
        path.write_bytes(export.json_bytes(review))
        with self.assertRaisesRegex(export.ExportError, "Review entry is on hold"):
            export.plan_export(self.batch, self.ledger_path)

    def test_ineligible_selected_image_rejected(self):
        self.option["approvalEligible"] = False
        self.save_inputs()
        with self.assertRaisesRegex(export.ExportError, "Selected image is not eligible"):
            export.plan_export(self.batch, self.ledger_path)

    def test_wrong_subset_rejected(self):
        with self.assertRaisesRegex(export.ExportError, "Ready IDs differ"):
            export.plan_export(self.batch, self.ledger_path, {"test-entry", "another-entry"})

    def test_book_keeps_gray_frame_and_original_cover(self):
        _, files, _ = export.plan_export(self.batch, self.ledger_path)
        record = json.loads(files["entries/test-entry/entry.json"])
        self.assertEqual(record["selectedImage"]["imageUrl"], "assets/selected.svg")
        self.assertEqual(files["entries/test-entry/assets/cover.png"], self.asset.read_bytes())
        svg = ET.fromstring(files["entries/test-entry/assets/selected.svg"])
        image = list(svg.iter("{http://www.w3.org/2000/svg}image"))[0]
        self.assertEqual(image.attrib["href"], export.data_uri(self.asset))
        self.assertEqual(image.attrib["preserveAspectRatio"], "xMidYMid slice")
        self.assertAlmostEqual(float(image.attrib["width"]) / float(image.attrib["height"]), 600 / 927)
        clips = list(svg.iter("{http://www.w3.org/2000/svg}clipPath"))
        self.assertNotIn("rx", list(clips[1])[0].attrib)
        gray_rect = [node for node in svg.iter("{http://www.w3.org/2000/svg}rect") if node.attrib.get("fill") == "#f2f2f2"]
        self.assertEqual(len(gray_rect), 1)

    def test_changed_book_style_rejected(self):
        css_path = self.batch / "review.css"
        css_path.write_text(css_path.read_text().replace("aspect-ratio:600/927", "aspect-ratio:1/1"))
        with self.assertRaisesRegex(export.ExportError, "book presentation differs"):
            export.plan_export(self.batch, self.ledger_path)

    def test_output_collision_prevents_partial_writes(self):
        output = self.root / "collision"
        output.mkdir()
        (output / "existing.txt").write_bytes(b"keep")
        with self.assertRaisesRegex(export.ExportError, "Refusing to replace"):
            export.write_plan(output, {"new.txt": b"new", "existing.txt": b"changed"})
        self.assertFalse((output / "new.txt").exists())
        self.assertEqual((output / "existing.txt").read_bytes(), b"keep")

    def test_music_keeps_self_contained_vinyl(self):
        self.entry["medium"] = "music"
        for relative in ("visual-study/vinyl_template.py", "visual-study/references/vinyl-reference.png"):
            target = self.batch / relative
            target.parent.mkdir(parents=True, exist_ok=True)
            target.write_bytes((export.DEFAULT_BATCH / relative).read_bytes())
        self.save_inputs()
        _, files, _ = export.plan_export(self.batch, self.ledger_path)
        svg = ET.fromstring(files["entries/test-entry/assets/selected.svg"])
        images = list(svg.iter("{http://www.w3.org/2000/svg}image"))
        self.assertEqual(svg.attrib["viewBox"], "0 0 1200 1500")
        self.assertEqual(len(images), 3)
        self.assertTrue(all(image.attrib["href"].startswith("data:image/") for image in images))
        self.assertEqual(images[0].attrib["href"], images[2].attrib["href"])
        self.assertNotEqual(images[0].attrib["href"], images[1].attrib["href"])
        record = json.loads(files["entries/test-entry/entry.json"])
        self.assertEqual(record["selectedImage"]["imageUrl"], "assets/selected.svg")
        self.assertEqual(record["selectedImage"]["width"], 1200)
        self.assertEqual(record["selectedImage"]["height"], 1500)


if __name__ == "__main__":
    unittest.main()
