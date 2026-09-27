"""Build static review artifacts; no app or database writes."""
import json, re, html, sys
from pathlib import Path
from collections import Counter
P=Path(__file__).resolve().parent
sys.path.insert(0,str(P/"visual-study"))
from vinyl_template import vinyl_thumbnail
order=['architecture','sculpture','painting','music','literature','theater','cinema']
parts=['architecture.json','sculpture-music.json','painting-literature.json','cinema-theater.json']
entries=[]
for name in parts:
    if (P/name).exists(): entries.extend(json.loads((P/name).read_text()))
entries.sort(key=lambda r:order.index(r['medium']))
captions=json.loads((P/'captions.json').read_text())
for r in entries: r['media']['caption']=captions[r['id']]
for i,r in enumerate(entries,1):
    r.update(reviewNumber=i,language='en',revision=1,editorialStatus='pending_review',imageApprovalStatus='pending_review',publicationStatus='not_imported',approvedBy=None,approvedAt=None)
    r['media']['displayMode']='contain'
    r['media']['reviewOnly']=True
batch=dict(schemaVersion=1,batchId='batch-001',createdAt='2026-09-21',editorialOwner='Julio Caggiano',status='pending_review',entries=entries)
(P/'batch-001.json').write_text(json.dumps(batch,ensure_ascii=False,indent=2)+'\n')
e=html.escape

def inline(t):
    t=e(t)
    return re.sub(r'\*([^*]+)\*',r'<em>\1</em>',t)
def body(t):
    return '\n'.join('<blockquote>'+inline(x[2:])+'</blockquote>' if x.startswith('> ') else '<p>'+inline(x)+'</p>' for x in t.strip().split('\n\n'))
film_selections_path=P/'visual-study/shotdeck-selections.json'
film_selections={x['id']:x for x in json.loads(film_selections_path.read_text())} if film_selections_path.exists() else {}
def review_media(r):
    media=r['media'].copy()
    selected=film_selections.get(r['id'],{})
    local=selected.get('localImagePath')
    if local and (P/'visual-study'/local).is_file():
        media.update(imageUrl='visual-study/'+local,altText=selected['altText'],credit=selected['credit'],caption=selected['altText'],referenceUrl=selected['catalogUrl'],license='Selected film still downloaded from ShotDeck for local review. App-publication rights remain pending.')
    return media
def image_tag(r):
    media=review_media(r)
    if r["medium"]=="music":
        return vinyl_thumbnail(media,r["id"],"visual-study/")
    return f'<img src="{e(media["imageUrl"],quote=True)}" alt="{e(media["altText"],quote=True)}" decoding="async" referrerpolicy="no-referrer">'
css='''*{box-sizing:border-box}html{scroll-behavior:smooth;scroll-padding-top:80px}body{margin:0;background:#fff;color:#252525;font:16px/1.62 -apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}a{color:inherit;text-underline-offset:3px}header{max-width:1200px;margin:auto;padding:48px 28px 24px}h1{font-size:36px;line-height:1.15;letter-spacing:-1px;font-weight:500;margin:12px 0}header p{color:#6e6e6e;max-width:720px}.eyebrow,.meta,figcaption{font-size:13px;color:#6e6e6e}.nav{position:sticky;top:0;z-index:3;display:flex;gap:8px;flex-wrap:wrap;padding:12px 28px;border-block:1px solid #eee;background:#fff}.nav a{font-size:13px;padding:4px 10px;background:#f2f2f2;border-radius:16px;text-decoration:none}main{max-width:1200px;margin:auto;padding:0 28px}section>h2{font-size:24px;font-weight:500;margin:52px 0 0;border-bottom:1px solid #252525;padding-bottom:10px}.entry{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.1fr);gap:40px;padding:42px 0;border-bottom:1px solid #ddd}.entry h3{font-size:28px;line-height:1.2;font-weight:500;margin:6px 0 10px}.copy{max-width:650px}.copy p{margin:20px 0}.meta{margin-bottom:24px}.number{font-size:12px;font-variant-numeric:tabular-nums;color:#6e6e6e}figure{margin:0;min-width:0}figure img{display:block;width:100%;height:auto;max-height:650px;object-fit:contain;background:#f2f2f2}figcaption{line-height:1.4;margin-top:10px}blockquote{margin:24px 0;border-left:2px solid #aaa;padding:4px 0 4px 18px;font-size:19px;line-height:1.55}details{font-size:13px;border-top:1px solid #eee;padding-top:12px;color:#6e6e6e}summary{cursor:pointer}details ul{padding-left:18px}details li{margin:10px 0}footer{padding:32px;color:#6e6e6e;font-size:13px}.gallery{display:grid;grid-template-columns:repeat(7,minmax(0,1fr));gap:18px;padding:24px}.tile img{height:150px;width:100%;object-fit:contain;background:#f2f2f2}.tile{font-size:12px;text-decoration:none}.tile span{display:block;margin-top:6px}.galleryhead{padding:20px 24px}.galleryhead h1{font-size:24px}@media(max-width:760px){header{padding:28px 20px}h1{font-size:30px}main{padding:0 20px}.nav{position:static;padding:12px 20px}.entry{grid-template-columns:1fr;gap:24px;padding:28px 0}.entry h3{font-size:25px}figure img{max-height:520px}.gallery{grid-template-columns:repeat(3,minmax(0,1fr));gap:12px;padding:16px}.tile img{height:130px}}@media print{.nav{position:static}.entry{break-inside:avoid;display:block}figure img{max-height:300px}details{display:none}}'''
css+=' .tile .reference-vinyl{height:150px!important;aspect-ratio:auto!important} .entry .reference-vinyl{border-radius:8px;overflow:hidden}'
start=f'<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="referrer" content="no-referrer"><title>Daily Culture · Batch 001</title><style>{css}</style></head><body>'
nav='<nav class="nav" aria-label="Art forms">'+''.join(f'<a href="#{x}">{x.title()}</a>' for x in order)+'<a href="IMAGES.html">All images</a><a href="visual-study/index.html">Visual study</a></nav>'
out=[start,'<header><div class="eyebrow">DAILY CULTURE · BATCH 001 · FOR REVIEW</div><h1>21 works across the seven arts</h1><p>Review the writing and supporting image for each work. Use its number or title when giving feedback. All entries await your approval.</p></header>',nav,'<main>']
md=['# Daily Culture — Batch 001\n\n21 entries for review. All entries and images await approval. Nothing has been imported into the app.\n']
for medium in order:
    out.append(f'<section id="{medium}"><h2>{medium.title()}</h2>')
    md.append(f'\n## {medium.title()}\n')
    for r in [x for x in entries if x['medium']==medium]:
        m=review_media(r); num=r['reviewNumber']
        caption=m.get('caption') or m.get('note','')
        source_list=''.join(f'<li><a href="{e(s["url"],quote=True)}" target="_blank" rel="noopener noreferrer">{e(s["title"])}</a> — {e(s.get("supports",""))}</li>' for s in r['sources'])
        out.append(f'<article class="entry" id="{r["id"]}"><figure><a href="{e(m["imageUrl"],quote=True)}" target="_blank" rel="noopener noreferrer" aria-label="Open full image for {e(r["title"],quote=True)}">{image_tag(r)}</a><figcaption>{e(m["credit"])}<br>{e(caption)}</figcaption></figure><div class="copy"><div class="number">{num:02d} / 21</div><h3>{e(r["title"])}</h3><div class="meta">{e(r["creator"])} · {e(r["dateDisplay"])}</div>{body(r["body"])}<details><summary>Sources and image record</summary><ul>{source_list}</ul><p><a href="{e(m["referenceUrl"],quote=True)}" target="_blank" rel="noopener noreferrer">Image source</a><br>{e(m["license"])}</p></details></div></article>')
        md.append(f'\n### {num:02d}. {r["title"]}\n\n{r["creator"]} · {r["dateDisplay"]}\n\n![{m["altText"]}]({m["imageUrl"]})\n\n*{m["credit"]}. {caption}*\n\n{r["body"]}\n\n<details><summary>Sources and image record</summary>\n\n'+ '\n'.join(f'- [{s["title"]}]({s["url"]})' for s in r['sources'])+f'\n- [Image record]({m["referenceUrl"]}) — {m["license"]}\n\n</details>\n')
    out.append('</section>')
out+=['</main><footer>Batch 001 · English review edition · Film frames are stored locally. Other images load from their source websites. Publication and image permissions are tracked separately.</footer></body></html>']
(P/'REVIEW.html').write_text('\n'.join(out))
(P/'REVIEW.md').write_text('\n'.join(md))
gallery=start+'<div class="galleryhead"><h1>Batch 001 · Supporting images</h1><a href="REVIEW.html">Read the entries</a></div><div class="gallery">'+''.join(f'<a class="tile" href="REVIEW.html#{r["id"]}">{image_tag(r)}<span>{r["reviewNumber"]:02d}. {e(r["title"])}</span></a>' for r in entries)+'</div></body></html>'
(P/'IMAGES.html').write_text(gallery)
print(json.dumps(dict(count=len(entries),byMedium=Counter(r['medium'] for r in entries))))
