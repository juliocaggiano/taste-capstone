"""Build the review and reconcile explicit recorded decisions; never import content."""
import hashlib, html, json, re, sys
from pathlib import Path
from collections import Counter

P = Path(__file__).resolve().parent
sys.path.insert(0, str(P / 'visual-study'))
from vinyl_template import vinyl_thumbnail
sys.path.insert(0, str(P / 'visual-study/elevation-portrait'))
from build_section import build_section
E = html.escape
config = json.loads((P / 'review-config.json').read_text())
published_path = P.parents[1] / 'published-catalog.json'
published = json.loads(published_path.read_text()) if published_path.exists() else {'entries': []}
published_by_id = {entry['id']: entry for entry in published['entries']}
order = config['activeMedia']
expected_ids = config['expectedEntryIds']
expected_count = len(expected_ids)
assert expected_count == len(set(expected_ids)), 'Duplicate configured entry IDs'
parts = ['architecture.json', 'sculpture-music.json', 'painting-literature.json', 'cinema-theater.json']
image_parts = ['image-options/' + name for name in ['architecture.json', 'sculpture.json', 'painting-literature.json', 'music.json', 'theater.json', 'cinema.json']]
batch_sources = [{'id': 'batch-001', 'label': 'Batch 001', 'archive': 'batch-001.json', 'contentSources': parts, 'imageSources': image_parts}] + config.get('additionalBatches', [])
all_entries, archives, source_batch_by_id = [], [], {}
for batch in batch_sources:
    batch_entries = [entry for part in batch['contentSources'] for entry in json.loads((P / part).read_text())]
    archive_path = P / batch['archive']
    archive = json.loads(archive_path.read_text()) if archive_path.exists() else {'batchId': batch['id'], 'editorialStatus': 'pending_review', 'entries': []}
    for entry in batch_entries:
        assert entry['id'] not in source_batch_by_id, f'Duplicate entry ID: {entry["id"]}'
        source_batch_by_id[entry['id']] = batch
    all_entries.extend(batch_entries)
    archives.append((archive_path, archive, batch_entries))
removed_ids = set(config.get('removedEntryIds', []))
assert set(expected_ids) == {entry['id'] for entry in all_entries if entry['medium'] in order and entry['id'] not in removed_ids}, 'Active content differs from configured batch'
decision_path = P / 'editorial-decisions.json'
decisions = json.loads(decision_path.read_text()) if decision_path.exists() else {'entries': []}
feedback_path = P / 'feedback-revisions.json'
feedback_revisions = json.loads(feedback_path.read_text()) if feedback_path.exists() else []
decisions_by_id = {entry['id']: entry for entry in decisions['entries']}
previous_by_id = {entry['id']: entry for _, archive, _ in archives for entry in archive['entries']}
prior_manifest_path = P / 'review-manifest.json'
prior_reviews = {entry['id']: entry for entry in json.loads(prior_manifest_path.read_text())['entries']} if prior_manifest_path.exists() else {}
compatibility_path = P / 'review-compatibility.json'
compatibility_rules = json.loads(compatibility_path.read_text()) if compatibility_path.exists() else []
# Keep each batch's source archive separate while reviewing them together.
for entry in all_entries:
    old = previous_by_id.get(entry['id'], {})
    retained = {key: value for key, value in old.items() if key not in entry}
    entry.update(retained)
    if old.get('body') and any(old.get(key) != entry.get(key) for key in ['body', 'title', 'creator', 'dateDisplay', 'medium']):
        entry.update(revision=old.get('revision',1)+1,editorialStatus='pending_review',approvedBy=None,approvedAt=None,editorialDecisionId=None)
    entry['reviewAvailability'] = 'removed' if entry['id'] in removed_ids else 'on_hold' if entry['medium'] in config['onHoldMedia'] else 'active'
for _, archive, batch_entries in archives:
    updated = {entry['id']: entry for entry in batch_entries}
    prior_ids = [entry['id'] for entry in archive['entries'] if entry['id'] in updated]
    archive['entries'] = [updated[entry_id] for entry_id in prior_ids] + [entry for entry in batch_entries if entry['id'] not in prior_ids]
    archive['activeMedia'] = [medium for medium in order if any(entry['medium'] == medium for entry in batch_entries)]
    archive['onHoldMedia'] = config['onHoldMedia']
    archive['releasePolicy'] = config.get('releasePolicy')
entries = sorted([entry for entry in all_entries if entry['id'] in expected_ids], key=lambda x: order.index(x['medium']))
options_by_id = {}
pending_image_reasons = {}
for source in [source for batch in batch_sources for source in batch['imageSources']]:
    path = P / source
    if path.exists():
        for record in json.loads(path.read_text()):
            assert record['entryId'] not in options_by_id, f'Duplicate image options: {record["entryId"]}'
            options_by_id[record['entryId']] = record['options']
            if record.get('pendingReason'):
                pending_image_reasons[record['entryId']] = record['pendingReason']


def fingerprint(value):
    return hashlib.sha256(json.dumps(value, sort_keys=True, ensure_ascii=False).encode()).hexdigest()[:16]


def inline(text):
    return re.sub(r'\*([^*]+)\*', r'<em>\1</em>', E(text))


def prose(text):
    return '\n'.join('<blockquote>' + inline(p[2:]) + '</blockquote>' if p.startswith('> ') else '<p>' + inline(p) + '</p>' for p in text.strip().split('\n\n'))


def option_visual(entry, option, key):
    if entry['medium'] == 'music':
        return vinyl_thumbnail(option, key, 'visual-study/')
    visual = f'<img src="{E(option["imageUrl"], quote=True)}" alt="{E(option["altText"], quote=True)}" decoding="async" loading="lazy">'
    if option.get('thumbnailWindow'):
        window = option['thumbnailWindow']
        x, y, w, h = [window[k] for k in ['x', 'y', 'w', 'h']]
        assert 0 <= x < 1 and 0 <= y < 1 and 0 < w <= 1-x and 0 < h <= 1-y, window
        ratio = option['width'] * w / (option['height'] * h)
        stage_ratio = 4/5 if entry['medium'] == 'sculpture' else 4/3
        max_width = min(100, 100 * ratio / stage_ratio)
        return f'<span class="option-crop" style="aspect-ratio:{ratio};max-width:{max_width}%;--crop-width:{100/w}%;--crop-height:{100/h}%;--crop-left:{-100*x/w}%;--crop-top:{-100*y/h}%">{visual}</span>'
    return f'<span class="book-cover">{visual}</span>' if entry['medium'] == 'literature' else visual


manifest = []
articles = []
image_articles = []
submission_articles = []
missing = []
for ordinal, entry in enumerate(entries, 1):
    entry_id = entry['id']
    options = options_by_id.get(entry_id, [])
    pending_images = not options and entry_id in config.get('awaitingImageEntryIds', []) and bool(pending_image_reasons.get(entry_id))
    option_rule = config.get('imageOptionsByMedium', {}).get(entry['medium'], {'min': 3, 'max': 3})
    if not option_rule['min'] <= len(options) <= option_rule['max'] and not pending_images:
        missing.append(entry_id)
    seen = set()
    for option in options:
        assert option['id'] in ['A', 'B', 'C'] and option['id'] not in seen, (entry_id, option['id'])
        seen.add(option['id'])
        image_path = option['imageUrl']
        assert image_path.startswith('image-options/assets/'), image_path
        assert (P / image_path).is_file(), image_path
        assert option['width'] > 0 and option['height'] > 0
        if option.get('originalImageUrl', '').startswith('image-options/assets/'):
            assert (P / option['originalImageUrl']).is_file()
        option['assetSha256'] = hashlib.sha256((P / image_path).read_bytes()).hexdigest()
    assert seen == set(['A', 'B', 'C'][:len(options)]), f'Nonsequential image choices: {entry_id}'
    identity = {key: entry[key] for key in ['title', 'creator', 'dateDisplay', 'medium']}
    body_hash = fingerprint({'identity': identity, 'body': entry['body']})
    presentation = None
    if entry['medium'] == 'music':
        presentation = {str(path.relative_to(P)): hashlib.sha256(path.read_bytes()).hexdigest() for path in [P / 'visual-study/vinyl_template.py', P / 'visual-study/references/vinyl-reference.png']}
    image_hash = fingerprint({'identity': identity, 'options': options, 'presentation': presentation})
    old_review = prior_reviews.get(entry_id, {})
    compatible = []
    # Image compatibility depends on unchanged image options, not the writing.
    # Keep earlier cover selections when the body receives a new revision.
    if entry['medium'] == 'literature':
        unchanged = [x['id'] for x in options if any(x == old for old in old_review.get('options', []))]
        for old in old_review.get('compatibleImageSelections', []) + [{'imageHash':old_review.get('imageHash'), 'optionIds':unchanged}]:
            ids = sorted(set(old['optionIds']) & set(unchanged))
            if ids and old['imageHash'] != image_hash:
                item = {'imageHash':old['imageHash'], 'optionIds':ids}
                if item not in compatible: compatible.append(item)
    for rule in compatibility_rules:
        if rule['entryId'] != entry_id or rule['bodyHash'] != body_hash: continue
        candidate = next((x for x in options if x['id'] == rule['optionId']), None)
        keys = ['id','label','description','sourceUrl','altText','edition','width','height','assetSha256']
        if candidate and fingerprint({k:candidate.get(k) for k in keys}) == rule['optionFingerprint']:
            item = {'imageHash':rule['previousImageHash'], 'optionIds':[rule['optionId']]}
            if item not in compatible: compatible.append(item)
    decision = decisions_by_id.get(entry_id)
    if decision and decision.get('bodyHash') == body_hash:
        approved = decision.get('writingStatus') == 'approved'
        entry.update(editorialStatus='approved' if approved else 'pending_review', approvedBy=decision.get('reviewer') if approved else None, approvedAt=decision.get('recordedAt') if approved else None)
        entry['editorialDecisionId'] = decision['decisionId']
    source_batch = source_batch_by_id[entry_id]
    manifest.append({'id': entry_id, 'sourceBatchId': source_batch['id'], 'title': entry['title'], 'medium': entry['medium'], 'body': entry['body'], 'published': published_by_id.get(entry_id), 'bodyHash': body_hash, 'imageHash': image_hash, 'compatibleImageSelections':compatible, 'options': options, 'pendingImages':pending_images, 'onHold':entry['medium'] in config['onHoldMedia'], 'recordedDecision':decision, 'revision':entry.get('revision', 1), 'feedbackRevisions':[r for r in feedback_revisions if r['entryId'] == entry_id]})
    cards = []
    for option in options:
        key = f'{entry_id}-{option["id"]}'
        visual = option_visual(entry, option, key)
        details = f'<details class="image-source"><summary>Source and image details</summary><p>{E(option.get("credit", ""))}</p><p>{option["width"]} × {option["height"]} pixels</p><a href="{E(option["sourceUrl"], quote=True)}" target="_blank" rel="noopener noreferrer">Source record ↗</a></details>'
        extra_details = ''.join(f'<p>{E(str(option[field]))}</p>' for field in ['imageTreatment', 'fidelityNotes', 'metadataLimits', 'license'] if option.get(field))
        if option.get('originalImageUrl', '').startswith('image-options/assets/'):
            extra_details += f'<button type="button" data-source-preview="{entry_id}:{option["id"]}">View original source</button>'
        details = details.replace('</details>', extra_details + '</details>')
        image_style = f' style="--photo-ratio:{option["width"]}/{option["height"]}"' if entry['medium'] == 'photography' else ''
        cards.append(f'''<figure class="option" data-option="{option['id']}">
          <button type="button" class="image-open {entry['medium']}"{image_style} data-preview="{entry_id}:{option['id']}" aria-label="Enlarge option {option['id']} for {E(entry['title'], quote=True)}">{visual}</button>
          <figcaption><div class="option-heading"><span class="letter">{option['id']}</span><span>{E(option['label'])}</span></div>

          <label class="choose"><input type="radio" name="image-{entry_id}" value="{option['id']}" data-entry="{entry_id}" {'disabled' if option.get('approvalEligible') is False else ''}><span>{'Study only · image on hold' if option.get('approvalEligible') is False else 'Choose ' + option['id']}</span></label>{details}</figcaption>
        </figure>''')
    grid = f'<div class="options{" single-option" if len(cards) == 1 else ""}">' + ''.join(cards) + '</div>' if cards else f'<p class="pending-images">Three film stills are still to come. {E(pending_image_reasons.get(entry_id, "Image options are being prepared").rstrip("."))}.</p>'
    heading = f'<div class="work-heading"><h2>{E(entry["title"])}</h2><p class="creator">{E(entry["creator"])} · {E(entry["dateDisplay"])}</p></div>'
    live = published_by_id.get(entry_id)
    version_controls = f'<div class="version-switch" data-versions="{entry_id}" role="group" aria-label="Version of {E(entry["title"], quote=True)}"><button data-version="live">Live</button><button data-version="draft">Draft</button></div>' if live else ''
    live_panel = ''
    if live:
        live_src = 'catalog-assets/' + Path(live['image']).name
        live_panel = f'<section class="live-panel" data-live="{entry_id}" hidden><a href="{E(live_src, quote=True)}" target="_blank" rel="noopener"><img class="live-image" src="{E(live_src, quote=True)}" alt="{E(live["imageAlt"], quote=True)}" loading="lazy"></a><div class="writing"><div class="story-text live-story">{prose(live["body"])}</div><button data-open-draft="{entry_id}">Edit draft</button></div></section>'
    history = ''
    revisions = [r for r in feedback_revisions if r['entryId'] == entry_id]
    if revisions:
        history = '<details class="revision-history"><summary>Revision history · addressed feedback</summary>'
        for r in reversed(revisions):
            history += f'<h3>Version {r["version"]} · {E(r["revisedOn"])}</h3><p>{E(r["summary"])}</p>'
            if r.get('notes'): history += '<h4>Previous notes</h4><p class="archived-note">' + E(r['notes']) + '</p>'
            for c in r['comments']: history += '<blockquote>' + E(c['quote']) + '</blockquote><p class="archived-note">' + E(c['text']) + '</p>'
            history += '<details class="previous-text"><summary>Read the previous text</summary>' + prose(r['previousBody']) + '</details>'
        history += '</details>'
    writing = f'''<div class="writing"><div class="story-actions"><button type="button" data-edit-story="{entry_id}">Edit text</button><span class="edit-status" data-edit-status="{entry_id}" role="status"></span></div><div class="story-text" data-story="{entry_id}" tabindex="0" aria-label="Text of {E(entry['title'], quote=True)}">{prose(entry['body'])}</div>
      <section class="passage-comments" data-comments="{entry_id}" aria-label="Passage comments"></section>
      <fieldset class="writing-decision"><legend>Writing review</legend>
      <label><input type="radio" name="writing-{entry_id}" value="pending" data-writing="{entry_id}" checked><span>Not reviewed</span></label>
      <label><input type="radio" name="writing-{entry_id}" value="approved" data-writing="{entry_id}"><span>Approve writing</span></label>
      <label><input type="radio" name="writing-{entry_id}" value="changes_requested" data-writing="{entry_id}"><span>Request changes</span></label></fieldset>
      <label class="notes-label" for="notes-{entry_id}">Notes <span class="muted">optional</span></label>
      <textarea id="notes-{entry_id}" data-notes="{entry_id}" rows="2" placeholder="What would you change?"></textarea>{history}</div>'''
    sources = '<details class="writing-sources"><summary>Writing sources</summary><ul>' + ''.join(f'<li><a href="{E(s["url"], quote=True)}" target="_blank" rel="noopener noreferrer">{E(s["title"])}</a></li>' for s in entry['sources']) + '</ul></details>'
    attrs = f'id="{entry_id}" data-entry-id="{entry_id}" data-medium="{entry["medium"]}"'
    articles.append(f'<article class="entry" {attrs}>{heading}{version_controls}{live_panel}<div class="draft-panel" data-draft="{entry_id}">{grid}{writing}{sources}</div></article>')
    image_articles.append(f'<article class="entry" {attrs}>{heading}{version_controls}{live_panel}<div class="draft-panel" data-draft="{entry_id}">{grid}<a class="read-entry" href="REVIEW.html#{entry_id}">Read this entry ↗</a></div></article>')
    if decision and decision.get('readyForImport') and decision.get('writingStatus') == 'approved' and decision.get('bodyHash') == body_hash and decision.get('imageHash') == image_hash and entry['medium'] not in config['onHoldMedia']:
        selected = next((option for option in options if option['id'] == decision.get('imageOption')), None)
        assert selected and selected.get('approvalEligible') is not False and decision.get('imageStatus') == 'approved', f'Invalid approved image for {entry_id}'
        visual = option_visual(entry, selected, f'submission-{entry_id}')
        submission_articles.append(f'<article class="entry" {attrs}><div class="eyebrow">{E(entry["medium"])} · Approved submission</div><h2>{E(entry["title"])}</h2><p>{E(entry["creator"])} · {E(entry["dateDisplay"])}</p><figure class="option"><div class="image-open {entry["medium"]}">{visual}</div><figcaption>Selected image {selected["id"]} · {E(selected["label"])}</figcaption></figure><div class="writing story-text">{prose(entry["body"])}</div>{sources}<p><a href="REVIEW.html#{entry_id}">Open review record ↗</a></p></article>')

assert not missing, f'Image choices do not meet the configured count: {missing}'
study_section, study_manifest = build_section()
study_path = P / 'visual-study/elevation-portrait'
css = (P / 'review.css').read_text() + '\n' + (study_path / 'studies.css').read_text()
script = (P / 'review-revision-state.js').read_text() + '\n' + (P / 'review.js').read_text() + '\n' + (study_path / 'studies.js').read_text()
payload = json.dumps(manifest, ensure_ascii=False).replace('<', '\\u003c')
study_payload = json.dumps(study_manifest, ensure_ascii=False).replace('<', '\\u003c')
batch_payload = json.dumps(config, ensure_ascii=False).replace('<', '\\u003c')
status_nav = '<nav class="status-nav" aria-label="Review status">' + ''.join(f'<a href="#{key}" data-status="{key}" aria-current="{str(key == "all").lower()}">{label} <span class="tab-count">{expected_count if key == "all" else 0}</span></a>' for key, label in [('all', 'All'), ('live', 'Live'), ('approved', 'Ready to publish'), ('to-review', 'To review')]) + '</nav>'
medium_nav = '<nav class="medium-nav" aria-label="Art forms"><a href="#all" data-filter="all" aria-current="true">All art forms</a>' + ''.join(f'<a href="#{m}" data-filter="{m}">{m.title()}</a>' for m in order) + '<a href="#visual-studies" data-filter="visual-studies">Visual studies</a></nav>'
nav = '<div class="review-navigation">' + status_nav + medium_nav + '</div>'


def page(content, images_only=False):
    page_title = 'Image choices' if images_only else 'Content review'
    link = '<a href="REVIEW.html">Read the entries</a>' if images_only else '<a href="IMAGES.html">Images only</a>'
    return f'''<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Taste (V1.2) · {page_title}</title><style>{css}</style></head>
    <body><header class="review-header"><div class="topline"><span>Taste</span><div class="header-actions">{link}<button type="button" id="export-review">Export review</button></div></div><h1 class="sr-only">Editorial review</h1><span class="save-status sr-only" id="save-status" role="status"></span></header>
    {nav}<main><p id="review-empty" class="review-empty" role="status" hidden></p>{''.join(content)}{study_section}</main>
    <dialog id="image-viewer" aria-labelledby="viewer-title"><div class="viewer-toolbar"><span id="viewer-title"></span><button type="button" id="close-viewer" aria-label="Close image">Close</button></div><div id="viewer-image"></div><div class="viewer-bottom"><span id="viewer-description"></span><a id="original-image" target="_blank" rel="noopener noreferrer">Full image ↗</a><button type="button" id="choose-from-viewer">Choose this image</button></div></dialog>
    <button type="button" id="add-passage-comment" class="selection-comment" hidden>Comment on selection</button>
    <div id="comment-hover" role="tooltip" hidden></div>
    <dialog id="comment-editor" class="comment-editor" aria-labelledby="comment-title"><form id="comment-form"><div class="comment-editor-heading"><h2 id="comment-title">Comment on this passage</h2><button type="button" id="cancel-comment" aria-label="Close comment">Close</button></div><blockquote id="comment-quote"></blockquote><p id="comment-version-note" class="muted" hidden>This comment refers to an earlier draft.</p><label for="comment-text">Your feedback</label><textarea id="comment-text" rows="4" required></textarea><div class="comment-editor-actions"><button type="button" id="resolve-comment" hidden>Resolve comment</button><button type="submit" id="save-comment">Save comment</button></div></form></dialog>
    <script id="review-config" type="application/json">{batch_payload}</script><script id="review-data" type="application/json">{payload}</script><script id="visual-studies-data" type="application/json">{study_payload}</script><script>{script}</script></body></html>'''

(P / 'REVIEW.html').write_text(page(articles))
(P / 'IMAGES.html').write_text(page(image_articles, True))
(P / 'SUBMISSIONS.html').write_text(f'''<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Taste · Approved submissions</title><style>{css}</style></head><body class="submissions-page"><header><div class="topline"><span>Taste</span><a href="REVIEW.html#all">Return to review</a></div><div class="eyebrow">First editorial submissions · 25 September 2026</div><h1>{len(submission_articles)} approved submissions.</h1><p>Initial frozen submission snapshot. The current review and prototype may contain later approved selections.</p><p>This page preserves the initial recorded selections. The current prototype uses the later confirmed import.</p></header><main>{''.join(submission_articles)}</main><footer>Editorial approval recorded from Julio’s review. Nothing is published.</footer></body></html>''')
(P / 'review-manifest.json').write_text(json.dumps({'version': 2, 'activeMedia': order, 'onHoldMedia': config['onHoldMedia'], 'entries': manifest}, ensure_ascii=False, indent=2) + '\n')
for archive_path, archive, _ in archives:
    archive_path.write_text(json.dumps(archive, ensure_ascii=False, indent=2) + '\n')
(study_path / 'manifest.json').write_text(json.dumps(study_manifest, ensure_ascii=False, indent=2) + '\n')
markdown = [f'# Taste (V1.2) — Editorial review\n\n{expected_count} works in the review queue. Approved submissions are collected separately for later import; theater remains on hold.\n']
for entry, record in zip(entries, manifest):
    markdown.append(f'## {entry["title"]}\n\n{entry["creator"]} · {entry["dateDisplay"]}\n\n{entry["body"]}\n\n### Image choices\n')
    for option in record['options']:
        markdown.append(f'- {option["id"]}. {option["label"]} — {option.get("description", "")} [Image]({option["imageUrl"]})\n')
(P / 'REVIEW.md').write_text('\n'.join(markdown))
print(json.dumps({'active': len(entries), 'held': sum(entry['medium'] in config['onHoldMedia'] for entry in entries), 'removed': len(removed_ids), 'options': sum(len(x['options']) for x in manifest), 'awaitingImages': [x['id'] for x in manifest if x['pendingImages']]}))
