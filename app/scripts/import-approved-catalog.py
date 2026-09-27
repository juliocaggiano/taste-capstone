#!/usr/bin/env python3
"""Copy the current Approved-tab selections into the local prototype catalog."""
from pathlib import Path
from html import escape, unescape
from html.parser import HTMLParser
import importlib.util, json, re, hashlib

ROOT=Path(__file__).resolve().parents[2]
REVIEW=ROOT/'docs/editorial/batches/batch-001'
CAPTURE=ROOT/'qa/approved-catalog-import-2026-09-25/current-review.json'
OUT=ROOT/'docs/editorial/imports/prototype-2026-09-25'
PUBLIC=ROOT/'app/public/assets/editorial'
spec=importlib.util.spec_from_file_location('exporter',ROOT/'docs/editorial/approved-submissions/export_approved.py')
ex=importlib.util.module_from_spec(spec);spec.loader.exec_module(ex)

# Only display metadata grounded in the reviewed text is added. Unrecorded
# creator lifetimes, material details and edit dates stay empty.
DISPLAY={
'michelangelo-david':('michelangelo-buonarroti','Italy','Florence'),
'stanczyk':('jan-matejko','Poland','Polish history'),
'death-of-marat':('jacques-louis-david','France','French Revolution'),
' the-ambassadors':('hans-holbein-the-younger','England','Memento mori'),
'goya-third-of-may':('francisco-goya','Spain','War'),
'potato-eaters':('vincent-van-gogh','The Netherlands','Rural life'),
' the-gleaners':('jean-francois-millet','France','Rural life'),
'liberty-leading-the-people':('eugene-delacroix','France','July Revolution'),
'school-of-athens':('raphael','Vatican City','Renaissance'),
'beethoven-symphony-nine':('ludwig-van-beethoven','Austria','Choral symphony'),
'billie-holiday-strange-fruit':('billie-holiday','United States','Anti-lynching song'),
'joao-gilberto-chega-saudade':('joao-gilberto','Brazil','Bossa nova'),
'animal-farm':('george-orwell','United Kingdom','Political satire'),
'vidas-secas':('graciliano-ramos','Brazil','Brazilian Northeast'),
' the-great-gatsby':('f-scott-fitzgerald','United States','American Dream'),
'eternal-sunshine':('michel-gondry','United States','Memory'),
'soul':('pete-docter-kemp-powers','United States','Purpose'),
'im-still-here':('walter-salles','Brazil','Military dictatorship'),
}
DISPLAY={k.strip():v for k,v in DISPLAY.items()}
FORMS={'sculpture':'Sculpture','painting':'Painting','music':'Music','literature':'Literature','cinema':'Film','architecture':'Architecture','theater':'Performance','photography':'Photography'}
class Text(HTMLParser):
 def __init__(self):super().__init__();self.parts=[]
 def handle_data(self,data):self.parts.append(data)
def visible(markup):
 p=Text();p.feed(markup);return ' '.join(''.join(p.parts).split())
def prose(body):
 def inline(s):return re.sub(r'\*([^*]+)\*',r'<em>\1</em>',escape(s))
 return '\n'.join('<blockquote>'+inline(p[2:])+'</blockquote>' if p.startswith('> ') else '<p>'+inline(p)+'</p>' for p in body.strip().split('\n\n'))
def write(path,data):path.parent.mkdir(parents=True,exist_ok=True);path.write_bytes(data)
def dump(path,data):write(path,ex.json_bytes(data))

def main():
 capture=json.loads(CAPTURE.read_text());manifest=json.loads((REVIEW/'review-manifest.json').read_text());reviews={e['id']:e for e in manifest['entries']};config=json.loads((REVIEW/'review-config.json').read_text())
 sources={}
 for file in [REVIEW/'batch-001.json']+[(REVIEW/b['archive']).resolve() for b in config['additionalBatches']]:
  for e in json.loads(file.read_text())['entries']:sources[e['id']]=e
 approved=[e for e in capture['entries'] if e['status']=='Approved · writing and image reviewed']
 assert len(approved)==len({e['id'] for e in approved})==18
 assert set(DISPLAY)=={e['id'] for e in approved}
 records=[];catalog=[]
 for choice in approved:
  key=choice['id'];entry=sources[key];review=reviews[key]
  assert choice['writingStatus']=='approved' and choice['imageOption'] and not review['onHold']
  assert not choice['commentsText'] or 'Passage comments · 0 open' in choice['commentsText']
  assert visible(prose(entry['body']))==visible(choice['storyHtml']),f'Review text changed: {key}'
  identity={k:entry[k] for k in ['title','creator','dateDisplay','medium']}
  assert ex.fingerprint({'identity':identity,'body':entry['body']})==review['bodyHash']
  assert ex.fingerprint({'identity':identity,'options':review['options'],'presentation':ex.presentation(REVIEW,entry['medium'])})==review['imageHash']
  option=next(o for o in review['options'] if o['id']==choice['imageOption'])
  assert option.get('approvalEligible') is not False
  src=ex.local_source(REVIEW,option['imageUrl']);raw=src.read_bytes();assert ex.sha(raw)==option['assetSha256']
  suffix=src.suffix.lower();width=option['width'];height=option['height'];raw_name=f'{key}-source{suffix}'
  if entry['medium']=='music':
   write(PUBLIC/raw_name,raw);raw=ex.render_vinyl(REVIEW,option,key);suffix='.svg';width,height=1200,1500
  elif entry['medium']=='literature':
   write(PUBLIC/raw_name,raw);raw=ex.render_book(REVIEW,option,key,ex.book_presentation(REVIEW));suffix='.svg';width,height=900,1200
  asset=f'{key}{suffix}';write(PUBLIC/asset,raw)
  creator,country,context=DISPLAY[key]
  record={'id':key,'title':entry['title'],'creator':entry['creator'],'creatorId':creator,'creatorDates':'1748–1825' if creator=='jacques-louis-david' else '', 'year':entry['dateDisplay'],'dateStart':entry['dateStart'],'dateEnd':entry['dateEnd'] if entry['dateEnd'] is not None else entry['dateStart'],'place':country,'form':FORMS[entry['medium']],'medium':'','image':f'/assets/editorial/{asset}','imageWidth':width,'imageHeight':height,'imageAlt':option['altText'],'kicker':'','context':context,'body':entry['body'],'story':entry['body'].split('\n\n'),'favoriteCount':0,'source':'; '.join(s['url'] for s in entry['sources']), 'language':'en','selectedOption':choice['imageOption'],'bodyHash':review['bodyHash'],'imageHash':review['imageHash'],'assetSha256':ex.sha(raw),'sourceAssetSha256':option['assetSha256']}
  if key == 'death-of-marat': record['imagePosition'] = 'center bottom'
  catalog.append(record)
  records.append({'entry':entry,'selectedImage':option,'reviewEvidence':choice,'approvedCapturedAt':capture['capturedAt'],'bodyHash':review['bodyHash'],'imageHash':review['imageHash'],'appImage':record['image'],'appImageSha256':record['assetSha256'],'status':'imported_to_local_prototype','publicationStatus':'not_published'})
 dump(OUT/'entries.json',records)
 dump(OUT/'manifest.json',{'importId':'prototype-2026-09-25','authorization':'User requested launching the current approved artworks with their images on the local prototype.','capturedAt':capture['capturedAt'],'reviewUrl':capture['url'],'appUrl':'http://127.0.0.1:4173/','entryIds':[r['entry']['id'] for r in records],'entryCount':len(records),'publicationStatus':'not_published'})
 dump(ROOT/'app/src/approved-catalog.json',catalog)
 # Keep a public image credit ledger free from private editorial comments.
 dump(PUBLIC/'credits.json',[{'id':r['entry']['id'],'creator':r['entry']['creator'],'image':r['appImage'],'credit':r['selectedImage'].get('credit'),'sourceUrl':r['selectedImage'].get('sourceUrl'),'license':r['selectedImage'].get('license'),'licenseUrl':r['selectedImage'].get('licenseUrl'),'rightsStatus':r['selectedImage'].get('rightsStatus'),'imageTreatment':r['selectedImage'].get('imageTreatment'),'sourceNotes':r['selectedImage'].get('sourceNotes')} for r in records])
 ids=' | '.join(json.dumps(e['id']) for e in catalog);creators=' | '.join(json.dumps(x) for x in dict.fromkeys(e['creatorId'] for e in catalog))
 code=f'''// Generated from current, verified editorial approvals by scripts/import-approved-catalog.py.
import catalog from "./approved-catalog.json";
import { editorialWorks, editorialCreators } from "./editorial-information";
export type ApprovedPieceId = {ids};
export type ApprovedCreatorId = {creators};
export type ApprovedForm = "Painting" | "Sculpture" | "Music" | "Literature" | "Film" | "Architecture" | "Performance" | "Photography";
export const approvedPieces = catalog.map(piece => ({{ ...piece, medium: editorialWorks[piece.id]?.medium ?? piece.medium, creatorDates: editorialCreators[piece.creatorId]?.dates || piece.creatorDates, id: piece.id as ApprovedPieceId, creatorId: piece.creatorId as ApprovedCreatorId, form: piece.form as ApprovedForm }}));
export const approvedCreators = [...new Set(approvedPieces.map(piece => piece.creatorId))].map(id => {{
  const works = approvedPieces.filter(piece => piece.creatorId === id);
  return {{ id, canonicalName: works[0].creator, dates: works[0].creatorDates, heroPieceId: works[0].id, pieceIds: works.map(piece => piece.id) }};
}});
export const approvedContext = Object.fromEntries(approvedPieces.map(piece => [piece.id, {{ en: piece.context, "pt-BR": piece.context, it: piece.context, es: piece.context }}]));
'''
 write(ROOT/'app/src/approved-catalog.ts',code.encode())
 print(json.dumps({'imported':len(records),'forms':sorted({x['form'] for x in catalog}),'assetsBytes':sum(p.stat().st_size for p in PUBLIC.iterdir() if p.is_file())}))
if __name__=='__main__':main()
