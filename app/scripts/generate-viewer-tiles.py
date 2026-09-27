#!/usr/bin/env python3
"""Generate local viewer previews and native-resolution detail tiles.

Only registered, already bundled sources are read. Originals are never changed.
Run from any directory: python3 app/scripts/generate-viewer-tiles.py
Requires Pillow; no network access, image upscaling, or runtime dependency.
"""

from concurrent.futures import ThreadPoolExecutor
from hashlib import sha256
from io import BytesIO
import json
from math import ceil, log10, sqrt
from pathlib import Path
import re

from PIL import Image, ImageChops, ImageStat, __version__ as pillow_version


APP = Path(__file__).resolve().parents[1]
PUBLIC = APP / "public"
OUTPUT = PUBLIC / "assets/content/viewer/tiles"
TILE_SIZE = 512
OVERLAP = 1
PREVIEW_EDGE = 768
LOSSLESS_LIMIT = 60_000_000


def catalog_sources():
    source = (APP / "src/Prototype.tsx").read_text()
    catalog = source.split("const pieces: Piece[] = [", 1)[1].split("\n];", 1)[0]
    records = []
    for match in re.finditer(r'\n  \{\n    id: "([^"]+)",(.*?)\n  \}', catalog, re.S):
        identifier, block = match.groups()
        image = re.search(r'\n    image: "([^"]+)"', block)
        viewer = re.search(r'\n    viewerImage: "([^"]+)"', block)
        if not image:
            raise ValueError(f"Missing registered image: {identifier}")
        url = (viewer or image).group(1)
        if not url.startswith("/assets/content/") or ".." in Path(url).parts:
            raise ValueError(f"Expected local content source: {url}")
        path = PUBLIC / url.lstrip("/")
        if not path.is_file():
            raise FileNotFoundError(path)
        records.append((identifier, url, path))
    if not records or len({url for _, url, _ in records}) != len(records):
        raise ValueError("Expected a nonempty catalog with unique image sources")
    return records


def encoded(image, *, lossless, icc):
    output = BytesIO()
    profile = {"icc_profile": icc} if icc else {}
    if lossless:
        image.save(output, "WEBP", lossless=True, quality=100, method=4, **profile)
    else:
        image.save(output, "JPEG", quality=94, subsampling=0, optimize=True, **profile)
    return output.getvalue()


def prepare(record, lossless=True):
    identifier, url, path = record
    source_bytes = path.read_bytes()
    with Image.open(BytesIO(source_bytes)) as original:
        source = original.convert("RGB")
        icc = original.info.get("icc_profile")
    width, height = source.size
    columns, rows = ceil(width / TILE_SIZE), ceil(height / TILE_SIZE)
    extension = "webp" if lossless else "jpg"
    base_path = f"/assets/content/viewer/tiles/{identifier}"
    manifest = {
        "width": width, "height": height, "tileSize": TILE_SIZE,
        "columns": columns, "rows": rows,
        "preview": f"{base_path}/preview.jpg", "basePath": base_path,
        "extension": extension, "overlap": OVERLAP,
    }
    files = []
    all_pixels_equal = True
    squared_error = 0.0
    channel_samples = 0
    maximum_channel_error = 0
    for row in range(rows):
        for column in range(columns):
            bounds = (
                max(0, column * TILE_SIZE - OVERLAP),
                max(0, row * TILE_SIZE - OVERLAP),
                min(width, (column + 1) * TILE_SIZE + OVERLAP),
                min(height, (row + 1) * TILE_SIZE + OVERLAP),
            )
            crop = source.crop(bounds)
            data = encoded(crop, lossless=lossless, icc=icc)
            with Image.open(BytesIO(data)) as decoded:
                difference = ImageChops.difference(crop, decoded.convert("RGB"))
                pixels_equal = difference.getbbox() is None
                squared_error += sum(ImageStat.Stat(difference).sum2)
                channel_samples += crop.width * crop.height * 3
                maximum_channel_error = max(maximum_channel_error, *(high for _, high in difference.getextrema()))
                if icc != decoded.info.get("icc_profile"):
                    raise ValueError(f"ICC profile changed: {identifier} {column},{row}")
                if decoded.size != crop.size:
                    raise ValueError(f"Tile dimensions changed: {identifier} {column},{row}")
            if lossless and not pixels_equal:
                raise ValueError(f"Lossless pixel verification failed: {identifier} {column},{row}")
            all_pixels_equal = all_pixels_equal and pixels_equal
            files.append((f"{column}_{row}.{extension}", data, {
                "column": column, "row": row, "bounds": list(bounds),
                "width": crop.width, "height": crop.height,
                "decodedPixelsEqualSource": pixels_equal,
            }))
    preview = source.copy()
    preview.thumbnail((PREVIEW_EDGE, PREVIEW_EDGE), Image.Resampling.LANCZOS)
    preview_output = BytesIO()
    profile = {"icc_profile": icc} if icc else {}
    preview.save(preview_output, "JPEG", quality=90, subsampling=0,
                 progressive=True, optimize=True, **profile)
    preview_bytes = preview_output.getvalue()
    files.append(("preview.jpg", preview_bytes, {
        "width": preview.width, "height": preview.height, "kind": "preview",
    }))
    return {
        "id": identifier, "url": url, "manifest": manifest, "files": files,
        "sourceSha256": sha256(source_bytes).hexdigest(), "sourceBytes": len(source_bytes),
        "tileBytes": sum(len(data) for name, data, _ in files if name != "preview.jpg"),
        "previewBytes": len(preview_bytes), "iccPreserved": True,
        "decodedTilePixelsEqualSource": all_pixels_equal,
        "tileRgbRmse": round(sqrt(squared_error / channel_samples), 5),
        "tileRgbPsnrDb": round(10 * log10(255 ** 2 / (squared_error / channel_samples)), 3) if squared_error else None,
        "maximumTileChannelError": maximum_channel_error,
    }


def generate():
    records = catalog_sources()
    with ThreadPoolExecutor(max_workers=4) as executor:
        prepared = list(executor.map(prepare, records))
    total_bytes = sum(item["tileBytes"] + item["previewBytes"] for item in prepared)
    lossless_candidate_bytes = total_bytes
    if total_bytes > LOSSLESS_LIMIT:
        with ThreadPoolExecutor(max_workers=4) as executor:
            prepared = list(executor.map(lambda item: prepare(item, lossless=False), records))
    OUTPUT.mkdir(parents=True, exist_ok=True)
    sets = {}
    provenance = {
        "generator": "app/scripts/generate-viewer-tiles.py", "pillowVersion": pillow_version,
        "tileSize": TILE_SIZE, "overlap": OVERLAP, "previewLongEdge": PREVIEW_EDGE,
        "losslessCandidateBytes": lossless_candidate_bytes, "losslessLimitBytes": LOSSLESS_LIMIT,
        "encodingDecision": "JPEG quality 94, full 4:4:4 chroma; lossless candidate exceeded the size limit."
        if lossless_candidate_bytes > LOSSLESS_LIMIT else "Lossless WebP; every decoded tile equals its source crop.",
        "sourcePolicy": "Existing bundled catalog images only; source files unchanged; no upscaling.",
        "records": [],
    }
    for item in prepared:
        destination = OUTPUT / item["id"]
        destination.mkdir(parents=True, exist_ok=True)
        sets[item["url"]] = item["manifest"]
        report = {key: value for key, value in item.items() if key not in ("files", "manifest")}
        report.update(item["manifest"])
        report["files"] = []
        for name, data, details in item["files"]:
            (destination / name).write_bytes(data)
            report["files"].append({"file": f"{item['id']}/{name}", "bytes": len(data),
                                    "sha256": sha256(data).hexdigest(), **details})
        provenance["records"].append(report)
    provenance["totalTileBytes"] = sum(item["tileBytes"] for item in prepared)
    provenance["totalPreviewBytes"] = sum(item["previewBytes"] for item in prepared)
    provenance["totalTileCount"] = sum(item["manifest"]["columns"] * item["manifest"]["rows"] for item in prepared)
    provenance["allDecodedTilePixelsEqualSources"] = all(item["decodedTilePixelsEqualSource"] for item in prepared)
    (OUTPUT / "manifest.json").write_text(json.dumps(provenance, indent=2) + "\n")
    types = """// Generated by scripts/generate-viewer-tiles.py from bundled content assets.
// Do not hand-edit. One-pixel overlap extends each tile within the source bounds.
export type ArtworkTileSet = {
  width: number;
  height: number;
  tileSize: number;
  columns: number;
  rows: number;
  preview: string;
  basePath: string;
  extension: "webp" | "jpg";
  overlap: number;
};

export const artworkTileSets: Record<string, ArtworkTileSet> = """
    (APP / "src/artwork-tiles.ts").write_text(types + json.dumps(sets, indent=2) + ";\n")
    for item in prepared:
        tile_set = item["manifest"]
        print(f"{item['id']}: {tile_set['width']}x{tile_set['height']}, "
              f"{tile_set['columns'] * tile_set['rows']} {tile_set['extension']} tiles, "
              f"{item['tileBytes']:,} tile bytes + {item['previewBytes']:,} preview bytes")
    print(json.dumps({key: value for key, value in provenance.items() if key.startswith("total") or key.startswith("allDecoded") or key.startswith("lossless")}, indent=2))


if __name__ == "__main__":
    generate()
