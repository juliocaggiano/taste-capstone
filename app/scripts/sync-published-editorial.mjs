// Run after deployment: record only the catalog and images verified on the live site.
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
const publicURL='https://taste-capstone.vercel.app/';
const expected=JSON.parse(await readFile(new URL('../public/editorial-catalog.json',import.meta.url),'utf8'));
const response=await fetch(new URL('editorial-catalog.json',publicURL),{cache:'no-store'});
if(!response.ok)throw new Error(`Public catalog unavailable: ${response.status}`);
const live=await response.json();
if(JSON.stringify(live)!==JSON.stringify(expected))throw new Error('Live catalog does not match the built catalog; publication snapshot left unchanged.');
const destination=new URL('../../docs/editorial/',import.meta.url);
await mkdir(new URL('published-assets/',destination),{recursive:true});
const verified=[];
for(const entry of live.entries){
 const image=await fetch(new URL(entry.image,publicURL),{cache:'no-store'});
 if(!image.ok)throw new Error(`Image unavailable: ${entry.id}`);
 const bytes=Buffer.from(await image.arrayBuffer());
 if(createHash('sha256').update(bytes).digest('hex')!==entry.assetSha256)throw new Error(`Image mismatch: ${entry.id}`);
 verified.push([entry,bytes]);
}
// Keep the previous snapshot until every image passes.
for(const [entry,bytes] of verified)await writeFile(new URL(`published-assets/${entry.image.split('/').pop()}`,destination),bytes);
await writeFile(new URL('published-catalog.json',destination),JSON.stringify({...live,url:publicURL,verifiedAt:new Date().toISOString(),deploymentId:process.argv[2]||null},null,2)+'\n');
console.log(`Verified and synchronized ${live.entries.length} published works and images.`);
