import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { join } from 'node:path';
import { createHash } from 'node:crypto';
const readJSON = async path => JSON.parse(await readFile(path, 'utf8'));
const stable = value => typeof value !== 'object' || value === null ? JSON.stringify(value) : Array.isArray(value)
  ? '['+value.map(stable).join(', ')+']' : '{'+Object.keys(value).sort().map(key=>JSON.stringify(key)+': '+stable(value[key])).join(', ')+'}';
export const bodyHash = entry => createHash('sha256').update(stable({identity:Object.fromEntries(['title','creator','dateDisplay','medium'].map(k=>[k,entry[k]])),body:entry.body})).digest('hex').slice(0,16);
export class ReviewError extends Error { constructor(status,message) { super(message); this.status=status; } }
export async function saveDraft(root, id, input, rebuild) {
  if (!input || typeof input.body !== 'string' || !input.body.trim() || input.body.length > 60000 || /[\x00-\x08\x0B\x0C\x0E-\x1F]/.test(input.body)) throw new ReviewError(400,'Enter valid text, up to 60,000 characters.');
  const config = await readJSON(join(root,'review-config.json'));
  if (!config.expectedEntryIds.includes(id)) throw new ReviewError(404,'Unknown artwork.');
  const sources = ['architecture.json','sculpture-music.json','painting-literature.json','cinema-theater.json', ...(config.additionalBatches || []).flatMap(b=>b.contentSources)];
  for (const relative of sources) {
    const path = join(root,relative), original = await readFile(path,'utf8'), entries=JSON.parse(original);
    const entry=entries.find(e=>e.id===id); if (!entry) continue;
    if (input.baseHash !== bodyHash(entry)) throw new ReviewError(409,'This draft changed elsewhere. Copy your edits, then reload before saving.');
    const body = input.body.trim().replace(/\r\n/g,'\n');
    if (body === entry.body) return {unchanged:true};
    const old={...entry}, now=new Date().toISOString();
    Object.assign(entry,{body,editorialStatus:'pending_review',approvedBy:null,approvedAt:null,editorialDecisionId:null});
    // Save source prose, not browser HTML. The builder escapes markup on output.
    await writeFile(path,JSON.stringify(entries,null,2)+'\n');
    try { await rebuild(); }
    catch (error) { await writeFile(path,original); await rebuild().catch(()=>{}); throw error; }
    await mkdir(join(root,'direct-edit-history'),{recursive:true});
    await writeFile(join(root,'direct-edit-history',`${now.replace(/[:.]/g,'-')}-${id}.json`),JSON.stringify({entryId:id,editedAt:now,previousBody:old.body,previousBodyHash:input.baseHash,body,bodyHash:bodyHash(entry)},null,2)+'\n');
    return {unchanged:false};
  }
  throw new ReviewError(404,'Artwork source not found.');
}
