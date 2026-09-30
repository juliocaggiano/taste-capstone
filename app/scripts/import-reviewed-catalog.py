#!/usr/bin/env python3
"""Incrementally import a fresh, explicitly authorized editorial-review capture."""
import argparse
import hashlib
import importlib.util
import json
from html import escape
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

def validate_choice(choice, entry, review):
    key = entry['id']
    assert entry['medium'] in initial.FORMS and not review['onHold'], f'Held work: {key}'
    assert choice['writingStatus'] == 'approved', f'Writing not approved: {key}'
    assert not any(not c.get('resolved') for c in choice['comments']), f'Open comments: {key}'
    identity = {k: entry[k] for k in ['title', 'creator', 'dateDisplay', 'medium']}
    assert initial.ex.fingerprint({'identity': identity, 'body': entry['body']}) == review['bodyHash'], f'Stale source: {key}'
    assert initial.ex.fingerprint({'identity': identity, 'options': review['options'],
        'presentation': initial.ex.presentation(REVIEW, entry['medium'])}) == review['imageHash'], f'Stale image manifest: {key}'
    if 'entryId' in choice:
        # The review's own export contains the exact draft and its version hashes.
        assert choice['body'] == entry['body'] and choice['bodyHash'] == review['bodyHash'], f'Stale writing approval: {key}'
        assert choice['imageHash'] == review['imageHash'], f'Stale image approval: {key}'
    else:
        assert initial.visible(initial.prose(entry['body'])) == initial.visible(choice['storyHtml']), f'Stale visible text: {key}'
    option = next(o for o in review['options'] if o['id'] == choice['imageOption'])
    assert option.get('approvalEligible') is not False, f'Image ineligible: {key}'
    if 'selectedImage' in choice:
        assert choice['selectedImage'] == option, f'Selected image changed: {key}'
    return option

def render_asset(entry, option):
    """Preserve the reviewed presentation while retaining the original source bytes."""
    key = entry['id']
    source = initial.ex.local_source(REVIEW, option['imageUrl'])
    original = source.read_bytes()
    assert initial.ex.sha(original) == option['assetSha256'], f'Image bytes changed: {key}'
    raw, suffix, width, height = original, source.suffix.lower(), option['width'], option['height']
    if entry['medium'] == 'music':
        raw, suffix, width, height = initial.ex.render_vinyl(REVIEW, option, key), '.svg', 1200, 1500
    elif entry['medium'] == 'literature':
        raw = initial.ex.render_book(REVIEW, option, key, initial.ex.book_presentation(REVIEW))
        suffix, width, height = '.svg', 900, 1200
    elif option.get('thumbnailWindow'):
        x, y, w, h = [option['thumbnailWindow'][k] for k in ['x', 'y', 'w', 'h']]
        assert 0 <= x < 1 and 0 <= y < 1 and 0 < w <= 1-x and 0 < h <= 1-y
        vw, vh = width * w, height * h
        # A viewBox clips the unchanged photograph to the exact review crop.
        raw = (f'<svg xmlns="http://www.w3.org/2000/svg" width="{vw}" height="{vh}" '
            f'viewBox="{width*x} {height*y} {vw} {vh}" role="img">'
            f'<title>{escape(option["altText"])}</title><image width="{width}" height="{height}" '
            f'href="{initial.ex.data_uri(source)}"/></svg>\n').encode()
        suffix, width, height = '.svg', vw, vh
    assets = {f'{key}{suffix}': raw}
    if raw != original:
        assets[f'{key}-source{source.suffix.lower()}'] = original
    return assets, f'{key}{suffix}', width, height

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--capture', required=True, type=Path)
    parser.add_argument('--output', required=True, type=Path)
    parser.add_argument('--entry', required=True, action='append')
    parser.add_argument('--display-metadata', type=Path, help='Additional verified creator/place/context mappings.')
    parser.add_argument('--authorization', required=True, help='The actual user instruction authorizing this import.')
    parser.add_argument('--dry-run', action='store_true')
    args = parser.parse_args()
    assert len(args.entry) == len(set(args.entry))
    assert not (args.output / 'manifest.json').exists(), 'Preserve earlier import evidence; use a new output folder.'
    capture = load(args.capture)
    assert not capture.get('testMode'), 'Test reviews cannot authorize publication.'
    decisions = {e.get('entryId', e.get('id')): e for e in capture['entries']}
    assert len(decisions) == len(capture['entries']), 'Duplicate review IDs'
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
        'death-of-socrates': ('jacques-louis-david', 'France', 'Ancient philosophy'),
        'pantheon': ('pantheon-architect-unknown', 'Italy', 'Ancient Rome'),
        'raft-of-medusa': ('theodore-gericault', 'France', 'Romanticism'),
        'las-meninas': ('diego-velazquez', 'Spain', 'Court and representation'),
        'arnolfini-portrait': ('jan-van-eyck', 'Belgium', 'Early Netherlandish painting'),
        'gulf-stream': ('winslow-homer', 'United States', 'Atlantic history'),
        'floor-scrapers': ('gustave-caillebotte', 'France', 'Urban labor'),
        'the-angelus': ('jean-francois-millet', 'France', 'Rural life'),
        'man-controller-of-the-universe': ('diego-rivera', 'Mexico', 'Mexican muralism'),
        'retirantes': ('candido-portinari', 'Brazil', 'Migration and drought')}
    if args.display_metadata:
        display.update(load(args.display_metadata))
    updates = []
    # Validate every body, approval and asset before writing any app files.
    for key in args.entry:
        choice, entry, review = decisions[key], sources[key], manifest[key]
        option = validate_choice(choice, entry, review)
        assets, asset, width, height = render_asset(entry, option)
        creator, country, context = display[key]
        record = {**catalog.get(key, {}), 'id': key, 'title': entry['title'], 'creator': entry['creator'],
            'creatorId': creator, 'creatorDates': catalog.get(key, {}).get('creatorDates', ''),
            'year': entry['dateDisplay'], 'dateStart': entry['dateStart'], 'dateEnd': entry['dateEnd'] or entry['dateStart'],
            'place': country, 'form': initial.FORMS[entry['medium']], 'medium': catalog.get(key, {}).get('medium', ''),
            'image': f'/assets/editorial/{asset}', 'imageWidth': width, 'imageHeight': height,
            'imageAlt': option['altText'], 'kicker': '', 'context': context, 'body': entry['body'],
            'story': entry['body'].split('\n\n'), 'favoriteCount': catalog.get(key, {}).get('favoriteCount', 0),
            'source': '; '.join(s['url'] for s in entry['sources']), 'language': 'en',
            'selectedOption': choice['imageOption'], 'bodyHash': review['bodyHash'], 'imageHash': review['imageHash'],
            'assetSha256': initial.ex.sha(assets[asset]), 'sourceAssetSha256': option['assetSha256']}
        updates.append((key, record, entry, option, choice, assets))
    if args.dry_run:
        print(json.dumps({'validated': args.entry, 'assetCount': sum(len(u[-1]) for u in updates)}))
        return
    for key, record, entry, option, choice, assets in updates:
        for asset, raw in assets.items():
            (PUBLIC / asset).write_bytes(raw)
        catalog[key] = record
        credits[key] = {'id': key, 'creator': entry['creator'], 'image': record['image'],
            **{k: option.get(k) for k in ['credit', 'sourceUrl', 'license', 'licenseUrl', 'rightsStatus', 'imageTreatment', 'sourceNotes']}}
    result = list(catalog.values())
    assert all(catalog[e['id']] == e for e in previous if e['id'] not in args.entry)
    dump(args.output / 'catalog-before.json', previous)
    dump(args.output / 'entries.json', [{'entry': e, 'selectedImage': o, 'reviewEvidence': c,
        'bodyHash': r['bodyHash'], 'imageHash': r['imageHash'], 'appImage': r['image'],
        'appImageSha256': r['assetSha256']} for _, r, e, o, c, _ in updates])
    dump(args.output / 'manifest.json', {'importId': args.output.name, 'capturedAt': capture.get('exportedAt', capture.get('capturedAt')),
        'reviewUrl': capture.get('url', 'http://127.0.0.1:4184/REVIEW.html'), 'entryIds': args.entry,
        'addedIds': [k for k in args.entry if k not in {e['id'] for e in previous}],
        'updatedIds': [k for k in args.entry if k in {e['id'] for e in previous}],
        'catalogCount': len(result), 'publicationStatus': 'awaiting_deployment',
        'authorization': args.authorization})
    dump(catalog_path, result)
    dump(PUBLIC / 'credits.json', list(credits.values()))
    adapter = ROOT / 'app/src/approved-catalog.ts'
    lines = adapter.read_text().splitlines()
    ids = ' | '.join(json.dumps(e['id']) for e in result)
    creators = ' | '.join(json.dumps(k) for k in dict.fromkeys(e['creatorId'] for e in result))
    lines = [f'export type ApprovedPieceId = {ids};' if line.startswith('export type ApprovedPieceId =') else line for line in lines]
    lines = [f'export type ApprovedCreatorId = {creators};' if line.startswith('export type ApprovedCreatorId =') else line for line in lines]
    lines[0] = '// Generated from verified editorial imports; see docs/editorial/PROTOTYPE_IMPORTS.md.'
    adapter.write_text('\n'.join(lines) + '\n')
    print(json.dumps({'updated': args.entry, 'catalogCount': len(result)}))

if __name__ == '__main__':
    main()
