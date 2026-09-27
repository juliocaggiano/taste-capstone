"""Render visual experiments separately from the twelve-entry editorial batch."""
import hashlib
import html
import json
from pathlib import Path

P = Path(__file__).resolve().parent
ROOT = P.parents[1]
E = html.escape


def build_section():
    studies = {}
    groups = []
    previous_groups = {3: [], 2: [], 1: []}
    for medium, round_number, heading, intro in [
        ('architecture', 4, 'Architecture · alternative engravings', 'A retains the Palais Garnier. B and C offer two richer original engravings.'),
        ('sculpture', 4, 'Sculpture · sharper close-up', 'A and C remain unchanged. B shows a crisper portrait, with the shoulders filling the frame.'),
        ('architecture', 3, 'Architecture · three drawing treatments', 'Compare warm archival ink and wash, measured lines on white paper, and gray crosshatching.'),
        ('sculpture', 3, 'Sculpture · closer portraits', 'Franklin is cropped above the stand. C remains unchanged as the selected reference.'),
        ('architecture', 2, 'Architecture · ink and wash', 'Three buildings in the direction of B: fine lines, soft shading and warm paper. Open the source image to compare the details.'),
        ('sculpture', 2, 'Sculpture · charcoal backgrounds', 'Three portraits in the direction of C: close, eye-level views against a subtle black-to-gray background.'),
        ('architecture', 1, 'Architecture · first study', 'Your selected direction: B, the White House drawing.'),
        ('sculpture', 1, 'Sculpture · first study', 'Your selected direction: C, the Caracalla portrait.')
    ]:
        group_key = f'{medium}-round-{round_number}' if round_number > 1 else medium
        path = P / (f'round-{round_number:02d}' if round_number > 1 else '') / f'{medium}.json'
        if not path.exists():
            continue
        rows = json.loads(path.read_text())
        assert len(rows) == 3
        cards = []
        for label, item in zip('ABC', rows):
            image = ROOT / item['imageUrl']
            assert image.is_file(), image
            item['label'] = label
            item['assetSha256'] = hashlib.sha256(image.read_bytes()).hexdigest()
            crop = item.get('objectPosition', 'center')
            fit = item.get('objectFit', 'contain')
            item['presentation'] = {'aspectRatio': '4 / 5' if medium == 'sculpture' else '4 / 3', 'objectFit':fit, 'objectPosition':crop}
            notes = item.get('sourceNotes', '')
            if not isinstance(notes, list):
                notes = [notes]
            if round_number > 1 and item.get('fidelityNotes'):
                fidelity = item['fidelityNotes']
                notes = notes + (fidelity if isinstance(fidelity, list) else [fidelity])
            notes_html = ''.join(f'<p>{E(note)}</p>' for note in notes)
            image_html = f'<img src="{E(item["imageUrl"], quote=True)}" alt="{E(item.get("altText", item["title"]), quote=True)}" loading="lazy" style="object-fit:{E(fit, quote=True)};object-position:{E(crop, quote=True)}">'
            if item.get('thumbnailWindow'):
                x, y, width, height = item['thumbnailWindow']
                assert 0 <= x < 1 and 0 <= y < 1 and 0 < width <= 1-x and 0 < height <= 1-y
                ratio = item['width'] * width / (item['height'] * height)
                stage_ratio = 4/5 if medium == 'sculpture' else 4/3
                crop_max_width = min(100, 100 * ratio / stage_ratio)
                item['presentation']['thumbnailWindow'] = item['thumbnailWindow']
                image_html = f'<span class="study-crop" style="aspect-ratio:{ratio};max-width:{crop_max_width}%;--crop-width:{100/width}%;--crop-height:{100/height}%;--crop-left:{-100*x/width}%;--crop-top:{-100*y/height}%">{image_html}</span>'
            treatment_html = ''
            comparison_html = ''
            if round_number > 1:
                treatment_html = f'<p class="study-treatment">{E(item.get("imageTreatment", "Generated visual study"))}</p>'
                original = item.get('originalImageUrl')
                if original and original != item['imageUrl']:
                    assert (ROOT / original).is_file(), original
                    comparison_html = f'<details class="study-comparison"><summary>Compare with the source image</summary><button type="button" class="study-source-image" data-study-original="{group_key}:{item["id"]}" aria-label="Enlarge source for {E(item["title"], quote=True)}"><img src="{E(original, quote=True)}" alt="Original source for {E(item["title"], quote=True)}" loading="lazy"></button></details>'
            cards.append(f'''<figure class="study-card">
              <button type="button" class="study-image {medium}" data-study-preview="{group_key}:{item['id']}" aria-label="Enlarge {E(item['title'], quote=True)}">{image_html}</button>
              <figcaption><div class="study-title"><span>{label}</span><h3>{E(item['title'])}</h3></div><p class="study-identity">{E(item['creator'])} · {E(item['dateDisplay'])}</p>{treatment_html}<p>{E(item['description'])}</p>
              <label class="choose"><input type="radio" name="study-{group_key}" data-study-choice="{group_key}" value="{E(item['id'], quote=True)}"><span>Prefer {label}</span></label>{comparison_html}
              <details class="image-source"><summary>Source details</summary><p>{E(item['credit'])}</p><p>{item['width']} × {item['height']} pixels · {E(item['viewType'].replace('_', ' '))}</p>{notes_html}<a href="{E(item['sourceUrl'], quote=True)}" target="_blank" rel="noopener noreferrer">Source record ↗</a></details></figcaption>
            </figure>''')
        fingerprint = hashlib.sha256(json.dumps(rows, sort_keys=True, ensure_ascii=False).encode()).hexdigest()[:16]
        studies[group_key] = {'fingerprint': fingerprint, 'options': rows, 'medium': medium, 'round': round_number}
        group_html = f'''<section class="study-group" id="study-{group_key}"><div class="eyebrow">Round {round_number} · {medium}</div><h2>{heading}</h2><p class="study-intro">{intro}</p><div class="study-grid">{''.join(cards)}</div><div class="study-feedback"><label for="study-notes-{group_key}">Feedback on {medium} · round {round_number}</label><textarea id="study-notes-{group_key}" data-study-notes="{group_key}" rows="2" placeholder="What works? What should change?"></textarea></div></section>'''
        (groups if round_number == 4 else previous_groups[round_number]).append(group_html)
    previous = ''.join(f'<details class="previous-studies"><summary>Round {round_number} archive · architecture and sculpture</summary>{"".join(group_html)}</details>' for round_number, group_html in previous_groups.items() if group_html)
    section = f'''<section id="visual-studies" class="visual-studies" hidden><div class="study-header"><div class="eyebrow">Visual direction · round 4</div><h2>Architecture and sculpture</h2><p>Alternative engravings and a sharper sculpture close-up. Generated treatments are labeled, with their source images available for comparison.</p><p id="study-save-status" role="status">Preferences and feedback save in this browser.</p></div>{''.join(groups)}{previous}</section>'''
    return section, studies
