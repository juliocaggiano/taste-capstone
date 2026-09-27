import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const root = new URL('../', import.meta.url);
const records = JSON.parse(fs.readFileSync(new URL('review-manifest.json',root),'utf8')).entries;
const config = JSON.parse(fs.readFileSync(new URL('review-config.json',root),'utf8'));
const previous = JSON.parse(fs.readFileSync(new URL('qa-seven-mediums/before-review-manifest.json',root),'utf8')).entries;
const source = fs.readFileSync(new URL('review.js',root),'utf8').split('function render()')[0];
function setup(input=records) {
  const context = vm.createContext({URLSearchParams, location:{search:'?test=1'}, document:{getElementById:id=>({textContent:JSON.stringify(id==='review-data'?input:config)}),querySelectorAll:()=>[]}});
  vm.runInContext(source, context);
  return context;
}
function approve(context, ids) {
  context.ids=ids;
  vm.runInContext(`for (const id of ids) { const r=byId.get(id); state.entries[id]={bodyHash:r.bodyHash,imageHash:r.imageHash,writingStatus:'approved',imageOption:'A',comments:[]}; }`,context);
}
function gate(context) {return JSON.parse(vm.runInContext('JSON.stringify(releaseEligibility())',context));}
const c=setup();
assert.equal(gate(c).ready,false);
approve(c,previous.map(r=>r.id));
assert.equal(gate(c).approvedEntries,12);assert.equal(gate(c).ready,false);
approve(c,records.map(r=>r.id));assert.equal(gate(c).ready,true);assert.equal(gate(c).expectedEntries,21);
vm.runInContext(`state.entries[records[0].id].comments=[{id:'test',quote:'Original quote',text:'Review this passage',resolved:false}];`,c);
assert.equal(gate(c).ready,false);
vm.runInContext(`state.entries[records[0].id].comments[0].resolved=true;`,c);assert.equal(gate(c).ready,true);
vm.runInContext(`state.entries[records[0].id].bodyHash='earlier-draft';`,c);assert.equal(gate(c).ready,false);
for (const altered of [records.slice(1),[...records.slice(1),records[1]],records.map((r,i)=>i? r:{...r,options:r.options.slice(1)})]) {
 const t=setup(altered);approve(t,[...new Set(altered.map(r=>r.id))]);assert.equal(gate(t).ready,false);
}
const unchanged = previous.every(old=>JSON.stringify(old)===JSON.stringify(records.find(r=>r.id===old.id)));
assert.equal(unchanged,true,'Prior review records changed');
assert.deepEqual(JSON.parse(fs.readFileSync(new URL('qa-seven-mediums/before-visual-manifest.json',root),'utf8')),JSON.parse(fs.readFileSync(new URL('visual-study/elevation-portrait/manifest.json',root),'utf8')));
console.log(JSON.stringify({gate:'passed',old12Unchanged:unchanged,visualStudiesUnchanged:true,cases:['empty','old12only','all21','unresolvedComment','resolvedComment','staleWriting','missingEntry','duplicateEntry','missingImageChoice']}));
