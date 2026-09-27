import http from 'node:http';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { saveDraft } from './review-store.mjs';
import { readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
const root = dirname(fileURLToPath(import.meta.url));
const allowed = new Set(['REVIEW.html','IMAGES.html','SUBMISSIONS.html','visual-study/index.html','visual-study/music.html',
  'visual-study/borobudur-study.png','visual-study/buddha-study.png',
  'visual-study/film-frames/QC5VUQXE.jpg','visual-study/film-frames/K6M8JXPG.jpg','visual-study/film-frames/N2M5LTVK.png',
  'visual-study/references/vinyl-reference.png','visual-study/references/borobudur-reference.jpg','visual-study/references/buddha-reference.jpg']);
const exec = promisify(execFile);
const project = join(root,'../../../..');
let saveQueue = Promise.resolve();
http.createServer(async (req,res) => {
  const name = new URL(req.url,'http://127.0.0.1').pathname.slice(1) || 'REVIEW.html';
  const replyJSON = (status, value) => { res.writeHead(status,{'Content-Type':'application/json','Cache-Control':'no-store'}); res.end(JSON.stringify(value)); };
  if (name === 'api/catalog' && req.method === 'GET') {
    try { replyJSON(200,JSON.parse(await readFile(join(project,'docs/editorial/published-catalog.json'),'utf8'))); }
    catch { replyJSON(503,{error:'Published catalog unavailable.'}); } return;
  }
  const edit = /^api\/entries\/([a-z0-9-]+)\/body$/.exec(name);
  if (edit && req.method === 'POST') {
    const expected = `http://${req.headers.host}`;
    if (!['127.0.0.1:4184','localhost:4184'].includes(req.headers.host) || req.headers.origin !== expected || !req.headers['content-type']?.startsWith('application/json')) { replyJSON(403,{error:'Save from the local review page.'}); return; }
    try {
      let body = ''; for await (const chunk of req) { body += chunk; if (Buffer.byteLength(body)>100000) { replyJSON(413,{error:'Text is too large.'}); return; } }
      const payload=JSON.parse(body);
      const operation=saveQueue.then(async()=> {
        await saveDraft(root,edit[1],payload,()=>exec('python3',[join(root,'build_review.py')],{maxBuffer:1024*1024}));
        const manifest=JSON.parse(await readFile(join(root,'review-manifest.json'),'utf8'));
        return manifest.entries.find(entry=>entry.id===edit[1]);
      });
      saveQueue=operation.catch(()=>{});
      replyJSON(200,{record:await operation});
    } catch(error) { replyJSON(error.status || (error instanceof SyntaxError ? 400 : 500),{error:error.status ? error.message : 'Could not save this draft. Your text remains in the editor.'}); } return;
  }
  if (req.method !== 'GET' && req.method !== 'HEAD') { res.writeHead(405); res.end(); return; }
  const catalogAsset = /^catalog-assets\/([A-Za-z0-9._-]+\.(?:png|jpe?g|webp|avif|svg))$/i.exec(name);
  const isReviewAsset = /^image-options\/assets\/(architecture|sculpture|painting|literature|music|theater|cinema|photography)\/[A-Za-z0-9._-]+\.(png|jpe?g|webp|avif)$/i.test(name);
  const isStudyAsset = /^visual-study\/elevation-portrait\/(?:assets\/|round-0[234]\/(?:assets|originals)\/)[A-Za-z0-9._-]+\.(png|jpe?g|webp|avif)$/i.test(name);
  if (!allowed.has(name) && !isReviewAsset && !isStudyAsset && !catalogAsset) { res.writeHead(404); res.end('Not found'); return; }
  try { const content=await readFile(catalogAsset ? join(project,'docs/editorial/published-assets',catalogAsset[1]) : join(root,name)); const type=name.endsWith('.svg')?'image/svg+xml':name.endsWith('.png')?'image/png':/\.jpe?g$/i.test(name)?'image/jpeg':name.endsWith('.webp')?'image/webp':name.endsWith('.avif')?'image/avif':'text/html; charset=utf-8'; res.writeHead(200,{'Content-Type':type,'Cache-Control':'no-store'}); res.end(content); }
  catch { res.writeHead(500); res.end('Review unavailable'); }
}).listen(4184,'127.0.0.1');
