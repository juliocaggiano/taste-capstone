#!/usr/bin/env python3
"""Incrementally import a fresh, explicitly authorized painting-review capture."""
import argparse
import hashlib
import importlib.util
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
REVIEW = ROOT / 'docs/editorial/batches/batch-001'
PUBLIC = ROOT / 'app/public/assets/editorial'
spec = importlib.util.spec_from_file_location('initial_import', Path(__file__).with_name('import-approved-catalog.py'))
initial = importlib.util.module_from_spec(spec)
spec.loader.exec_module(initial)

def load(path):
    return json.loads(path.read_text())

def dump(path, value):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(value, ensure_ascii=False, indent=2) + '\n')

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--capture', required=True, type=Path)
    parser.add_argument('--output', required=True, type=Path)
    parser.add_argument('--entry', required=True, action='append')
    args = parser.parse_args()
    assert len(args.entry) == len(set(args.entry))
    assert not (args.output / 'manifest.json').exists(), 'Preserve earlier import evidence; use a new output folder.'
    capture = load(args.capture)
    decisions = {e['id']: e for e in capture['entries']}
    manifest = {e['id']: e for e in load(REVIEW / 'review-manifest.json')['entries']}
    config = load(REVIEW / 'review-config.json')
    source_files = [REVIEW / 'batch-001.json'] + [REVIEW / b['archive'] for b in config['additionalBatches']]
    sources = {e['id']: e for p in source_files for e in load(p)['entries']}
    catalog_path = ROOT / 'app/src/approved-catalog.json'
    previous = load(catalog_path)
    catalog = {e['id']: e for e in previous}
    credits = {e['id']: e for e in load(PUBLIC / 'credits.json')}
    display = {**initial.DISPLAY,
        'saturn-devouring-his-son': ('francisco-goya', 'Spain', 'Black Paintings'),
        'death-of-socrates': ('jacques-louis-david', 'France', 'Ancient philosophy')}
    updates = []
    # Validate every body, approval and asset before writing any app files.
    for key in args.entry:
        choice, entry, review = decisions[key], sources[key], manifest[key]
        assert entry['medium'] == 'painting' and not review['onHold']
        assert choice['status'] == 'Approved · writing and image reviewed'
        assert choice['writingStatus'] == 'approved' and not choice['comments']
        assert initial.visible(initial.prose(entry['body'])) == initial.visible(choice['storyHtml'])
        identity = {k: entry[k] for k in ['title', 'creator', 'dateDisplay', 'medium']}
        assert initial.ex.fingerprint({'identity': identity, 'body': entry['body']}) == review['bodyHash']
        option = next(o for o in review['options'] if o['id'] == choice['imageOption'])
        assert option.get('approvalEligible') is not False
        source = initial.ex.local_source(REVIEW, option['imageUrl'])
        raw = source.read_bytes()
        assert hashlib.sha256(raw).hexdigest() == option['assetSha256']
        asset = f'{key}{source.suffix.lower()}'
        creator, country, context = display[key]
        record = {**catalog.get(key, {}), 'id': key, 'title': entry['title'], 'creator': entry['creator'],
            'creatorId': creator, 'creatorDates': catalog.get(key, {}).get('creatorDates', ''),
            'year': entry['dateDisplay'], 'dateStart': entry['dateStart'], 'dateEnd': entry['dateEnd'] or entry['dateStart'],
            'place': country, 'form': 'Painting', 'medium': catalog.get(key, {}).get('medium', ''),
            'image': f'/assets/editorial/{asset}', 'imageWidth': option['width'], 'imageHeight': option['height'],
            'imageAlt': option['altText'], 'kicker': '', 'context': context, 'body': entry['body'],
            'story': entry['body'].split('\n\n'), 'favoriteCount': catalog.get(key, {}).get('favoriteCount', 0),
            'source': '; '.join(s['url'] for s in entry['sources']), 'language': 'en',
            'selectedOption': choice['imageOption'], 'bodyHash': review['bodyHash'], 'imageHash': review['imageHash'],
            'assetSha256': option['assetSha256'], 'sourceAssetSha256': option['assetSha256']}
        updates.append((key, record, entry, option, choice, raw, asset))
    for key, record, entry, option, choice, raw, asset in updates:
        (PUBLIC / asset).write_bytes(raw)
        catalog[key] = record
        credits[key] = {'id': key, 'creator': entry['creator'], 'image': record['image'],
            **{k: option.get(k) for k in ['credit', 'sourceUrl', 'license', 'licenseUrl', 'rightsStatus', 'imageTreatment', 'sourceNotes']}}
    result = list(catalog.values())
    assert all(catalog[e['id']] == e for e in previous if e['id'] not in args.entry)
    dump(args.output / 'catalog-before.json', previous)
    dump(args.output / 'entries.json', [{'entry': e, 'selectedImage': o, 'reviewEvidence': c,
        'bodyHash': r['bodyHash'], 'imageHash': r['imageHash'], 'appImage': r['image'],
        'appImageSha256': r['assetSha256']} for _, r, e, o, c, _, _ in updates])
    dump(args.output / 'manifest.json', {'importId': args.output.name, 'capturedAt': capture['capturedAt'],
        'reviewUrl': capture['url'], 'entryIds': args.entry,
        'addedIds': [k for k in args.entry if k not in {e['id'] for e in previous}],
        'updatedIds': [k for k in args.entry if k in {e['id'] for e in previous}],
        'catalogCount': len(result), 'publicationStatus': 'awaiting_deployment',
        'authorization': 'Julio requested the exact small painting edits, approved-painting app update and Vercel deployment on 2026-09-27.'})
    dump(catalog_path, result)
    dump(PUBLIC / 'credits.json', list(credits.values()))
    adapter = ROOT / 'app/src/approved-catalog.ts'
    lines = adapter.read_text().splitlines()
    ids = ' | '.join(json.dumps(e['id']) for e in result)
    lines = [f'export type ApprovedPieceId = {ids};' if line.startswith('export type ApprovedPieceId =') else line for line in lines]
    lines[0] = '// Generated from verified editorial imports; see docs/editorial/PROTOTYPE_IMPORTS.md.'
    adapter.write_text('\n'.join(lines) + '\n')
    print(json.dumps({'updated': args.entry, 'catalogCount': len(result)}))

if __name__ == '__main__':
    main()
