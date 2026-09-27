import { readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
const root = new URL('../', import.meta.url);
const catalog = JSON.parse(await readFile(new URL('src/approved-catalog.json', root), 'utf8'));
const entries = catalog.map(({id,title,creator,year,form,body,bodyHash,imageHash,image,imageAlt,selectedOption,assetSha256,sourceAssetSha256}) =>
  ({id,title,creator,year,medium:form.toLowerCase(),body,bodyHash,imageHash,image,imageAlt,selectedOption,assetSha256,sourceAssetSha256}));
const catalogHash = createHash('sha256').update(JSON.stringify(entries)).digest('hex');
await writeFile(new URL('public/editorial-catalog.json',root), JSON.stringify({version:1,catalogHash,entries},null,2)+'\n');
console.log(`Exported ${entries.length} public catalog records to ${fileURLToPath(new URL('public/editorial-catalog.json',root))}`);
