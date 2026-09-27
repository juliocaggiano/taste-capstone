from pathlib import Path
import html
import json
from vinyl_template import vinyl_thumbnail

p = Path(__file__).resolve().parent
escape = html.escape
entries = json.loads((p.parent / 'sculpture-music.json').read_text())
labels = {
    'beethoven-symphony-nine': ('Symphony No. 9', 'Ludwig van Beethoven · Manuscript artwork'),
    'billie-holiday-strange-fruit': ('Strange Fruit', 'Billie Holiday · Original release label'),
    'joao-gilberto-chega-saudade': ('Chega de Saudade', 'João Gilberto · 1959 album artwork'),
}
cards = []
for entry in entries:
    if entry['id'] not in labels:
        continue
    title, creator = labels[entry['id']]
    media = entry['media']
    variants = [f'<figure class="variant variant-reference">{vinyl_thumbnail(media, entry["id"])}<figcaption>Reference style</figcaption></figure>']
    for variant, caption in [('label', 'Center label'), ('full', 'Full disc')]:
        variants.append(f'''<figure class="variant variant-{variant}">
          <div class="stage"><div class="disc disc-{variant}">
            <div class="artwork"><img src="{escape(media['imageUrl'], quote=True)}" alt="{escape(media['altText'], quote=True)}"></div>
            <span class="grooves" aria-hidden="true"></span>
            <span class="reflection" aria-hidden="true"></span>
            <span class="spindle" aria-hidden="true"></span>
          </div></div><figcaption>{caption}</figcaption>
        </figure>''')
    cards.append(f'''<article class="card"><div class="pair">{''.join(variants)}</div>
      <h2>{escape(title)}</h2><p class="creator">{escape(creator)}</p></article>''')

css = '''
@font-face{font-family:"PP Neue Montreal";src:local("PPNeueMontrealTT-Regular"),local("PP Neue Montreal TT Regular");font-weight:400;font-display:swap}
*{box-sizing:border-box}body{margin:0;color:#252525;background:#fff;font:14px/20px "PP Neue Montreal",system-ui,sans-serif}
header{display:flex;justify-content:space-between;align-items:center;gap:20px;padding:20px 24px;border-bottom:1px solid #f2f2f2}
a{color:inherit;text-underline-offset:3px}main{max-width:1120px;padding:40px 24px 60px;margin:auto}
.eyebrow{color:#6e6e6e;font-size:10px;line-height:12px;letter-spacing:1px;text-transform:uppercase}
h1{font-size:32px;line-height:40px;letter-spacing:-.7px;font-weight:400;margin:8px 0 12px}
.intro{color:#6e6e6e;margin:0;max-width:620px}h2{font-size:16px;line-height:20px;font-weight:400;margin:12px 0 2px}
.creator{font-size:12px;line-height:16px;color:#6e6e6e;margin:0}
.controls{display:flex;gap:4px;flex-wrap:wrap;margin:28px 0 20px}
button{font:inherit;font-size:12px;line-height:16px;border:0;border-radius:20px;background:#f2f2f2;color:#252525;padding:8px 14px;cursor:pointer;min-height:32px}
button[aria-pressed=true]{background:#252525;color:#fff}button:focus-visible,a:focus-visible{outline:2px solid #252525;outline-offset:3px}
.cards{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:20px}.card{min-width:0}.pair{display:grid;gap:20px}
figure{margin:0;min-width:0}.stage{aspect-ratio:1;display:grid;place-items:center;background:#f2f2f2;border-radius:16px;overflow:hidden}
.disc{position:relative;width:79%;aspect-ratio:1;border-radius:50%;background:repeating-radial-gradient(circle,#181818 0,#181818 1px,#2b2b2b 1.5px,#181818 2px,#181818 3px);box-shadow:0 12px 14px -10px #0005,0 2px 3px #0002,inset 0 0 0 2px #111,inset 0 0 0 3px #333;isolation:isolate}
.artwork{position:absolute;inset:1.1%;border-radius:50%;overflow:hidden;background:#f2f2f2}
.artwork img{display:block;width:100%;height:100%;object-fit:cover}
.disc-label .artwork{inset:32%;box-shadow:0 0 0 4px #141414}
.grooves{position:absolute;inset:1.1%;border-radius:50%;background:repeating-radial-gradient(circle,transparent 0,transparent 2px,#000 2.5px,transparent 3px);opacity:.11;pointer-events:none}
.disc-label .grooves{display:none}
.reflection{position:absolute;inset:1%;border-radius:50%;background:conic-gradient(from 15deg,transparent 0deg,#ffffff24 38deg,transparent 68deg,transparent 165deg,#ffffff1c 213deg,transparent 242deg);pointer-events:none}
.disc-label .reflection{z-index:-1}.disc-full .reflection{opacity:.55}
.spindle{position:absolute;width:2.88%;aspect-ratio:1;left:48.56%;top:48.56%;border-radius:50%;background:#f2f2f2;box-shadow:0 0 0 1px #0006}
figcaption{display:none;font-size:12px;line-height:16px;color:#6e6e6e;margin-top:8px}
[data-view=reference] .variant-label,[data-view=reference] .variant-full,[data-view=full] .variant-label,[data-view=full] .variant-reference,[data-view=label] .variant-full,[data-view=label] .variant-reference,[data-view=compare] .variant-reference{display:none}
.reference-vinyl{border-radius:8px;overflow:hidden}.cards{margin-top:20px}
[data-view=compare] .cards{grid-template-columns:1fr;gap:36px;max-width:940px}
[data-view=compare] .pair{grid-template-columns:1fr 1fr}
[data-view=compare] figcaption{display:block}
footer{font-size:12px;line-height:16px;color:#6e6e6e;border-top:1px solid #f2f2f2;padding-top:16px;margin-top:36px}
@media(max-width:650px){header{padding:16px}main{padding:28px 16px}h1{font-size:26px;line-height:32px}.cards{grid-template-columns:1fr;gap:28px;max-width:420px;margin:auto}button{min-height:44px}.controls{margin-top:24px}.pair{gap:12px}[data-view=compare] .cards{max-width:none}[data-view=compare] .disc{width:84%}}
'''
page = '''<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Daily Culture · Music thumbnails</title><style>''' + css + '''</style></head>
<body data-view="reference"><header><span>Daily Culture</span><a href="index.html#music">All visual studies</a></header>
<main><div class="eyebrow">Music · Variation 03</div><h1>One vinyl frame. Three covers.</h1>
<p class="intro">Your photograph stays the same. Only the center artwork changes.</p>
<div class="controls" role="group" aria-label="Vinyl presentation">
<button type="button" data-view="reference" aria-pressed="true">Reference style</button><button type="button" data-view="full" aria-pressed="false">Previous full disc</button>
<button type="button" data-view="label" aria-pressed="false">Previous center label</button>
<button type="button" data-view="compare" aria-pressed="false">Side by side</button></div>
<div class="cards">''' + ''.join(cards) + '''</div>
<footer>Same photograph, crop, grooves and center hole across all three thumbnails.</footer></main>
<script>document.querySelectorAll('button[data-view]').forEach(button=>button.addEventListener('click',()=>{
document.body.dataset.view=button.dataset.view;
document.querySelectorAll('button[data-view]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
}));</script></body></html>'''
(p / 'music.html').write_text(page)
print('Saved the music thumbnail comparison.')
