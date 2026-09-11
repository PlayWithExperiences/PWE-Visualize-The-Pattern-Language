import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {compose,groups,groupFor,normalizeIds,toggleId,encodeAtlas,decodeAtlas} from '../atlas/compose.js';
const guides=JSON.parse(readFileSync(new URL('../data/guide-catalog.json',import.meta.url)));
const relations=JSON.parse(readFileSync(new URL('../data/book-relations.json',import.meta.url)));
const geom=d=>JSON.stringify(d.diagram.shapes.filter(s=>s.kind!=='text').map(s=>[s.kind,s.attrs]));
const shapes=(key,ids,id,kind)=>compose(key,ids).diagram.shapes.filter(s=>s.owner===id&&(!kind||s.kind===kind));
test('all 253 guides have original explanations, source locations and unique operations',()=>{
 assert.deepEqual(guides.map(p=>p.id),Array.from({length:253},(_,i)=>i+1));assert.equal(new Set(guides.map(p=>p.rule)).size,253);
 for(const p of guides){assert.ok(p.problem.length>8&&p.principle.length>20);assert.equal(groupFor(p.id).key,p.group);assert.ok(p.source.pdfPages.length>0&&p.source.pdfPages.every(n=>n>0&&n<=1218));}
 assert.deepEqual(guides[107].source.pdfPages,[578,577,576,575]);assert.deepEqual(guides[162].source.missingPrintedPages,[767]);assert.match(guides[162].note,/767/);assert.match(guides[213].note,/待解决/);
});
test('every standalone pattern changes rendered geometry or surface, excluding titles, ownership and metadata',()=>{
 for(const p of guides){const d=compose(p.group,[p.id]);assert.notEqual(geom(d),geom(compose(p.group,[])),`${p.id} has no visual effect`);assert.ok(d.diagram.effects.has(p.id),`${p.id} has no focusable drawing`);}
});
test('all within-context pairs plus full-context diagrams remain finite and deterministic',()=>{
 for(const g of groups){const ids=guides.filter(p=>p.group===g.key).map(p=>p.id),cases=[ids,...ids.map(id=>[id])];for(let a=0;a<ids.length;a++)for(let b=a+1;b<ids.length;b++)cases.push([ids[a],ids[b]]);
  for(const subset of cases){const d=compose(g.key,subset);assert.doesNotMatch(d.svg,/NaN|Infinity|undefined/);for(const s of d.diagram.shapes){for(const v of Object.values(s.attrs))if(typeof v==='number')assert.ok(Number.isFinite(v));if(s.kind==='rect')assert.ok(s.attrs.width>=0&&s.attrs.height>=0);}}
  assert.equal(compose(g.key,ids).svg,compose(g.key,ids).svg);
 }
});
test('alternate household briefs replace one another without dropping other scales',()=>{
 assert.deepEqual(toggleId([21,75,79,180],78),[21,78,79,180]);assert.deepEqual(toggleId([21,78,79,180],78),[21,79,180]);assert.deepEqual(normalizeIds([253,75,78,75,0,254,null]),[75,253]);
});
test('atlas sharing retains every scale and empty selections, rejecting malformed input',()=>{
 const state={group:'construction',ids:[1,21,96,190,214,253],focus:214,view:'single'};assert.deepEqual(decodeAtlas(encodeAtlas(state)),state);assert.deepEqual(decodeAtlas(encodeAtlas({...state,ids:[]})).ids,[]);assert.equal(decodeAtlas('#v1=%7B%7D'),null);assert.equal(decodeAtlas('#atlas=%'),null);
});
test('parking cap reduces actual plan area by half, and four-story constraint never increases site height',()=>{
 const base=compose('city',[]).diagram.shapes.find(s=>s.kind==='rect'&&s.attrs.fill==='#c2c4b7');const capped=shapes('city',[22],22,'rect').find(s=>s.attrs.fill==='#c2c4b7');assert.equal(capped.attrs.width*capped.attrs.height,base.attrs.width*base.attrs.height/2);
 const floors=ids=>shapes('site',ids,96,'rect').length;assert.equal(floors([96]),6);assert.equal(floors([21,96]),4);
});
test('two-sided daylight, balcony depth and ceiling hierarchy express different spatial operations',()=>{
 const a=compose('edge',[]),b=compose('edge',[159]);assert.ok(b.diagram.shapes.filter(s=>s.attrs.fill==='#bdd9de').length>a.diagram.shapes.filter(s=>s.attrs.fill==='#bdd9de').length);
 const balcony=shapes('edge',[167],167,'rect').find(s=>s.attrs.width===580);assert.equal(balcony.attrs.height,120);
 const tops=shapes('room',[190],190,'line').filter(s=>s.attrs.y1===s.attrs.y2).map(s=>s.attrs.y1);assert.equal(new Set(tops).size,3);
});
test('window details combine with lowered sill instead of moving to unrelated objects',()=>{
 const base=compose('construction',[]).diagram.shapes.find(s=>s.kind==='rect'&&s.attrs.fill==='#bdd9de');const low=shapes('construction',[222,223,239],222,'rect').find(s=>s.attrs.fill==='#bdd9de');assert.equal(low.attrs.y,base.attrs.y);assert.ok(low.attrs.height>base.attrs.height);
 const grid=shapes('construction',[222,223,239],239,'line');assert.ok(grid.some(s=>s.attrs.y1>390));assert.ok(shapes('construction',[222,223],223,'path').length===2);
});
test('matched book references are directed, unique and in range, without assumed self-dependencies',()=>{
 assert.equal(new Set(relations.edges.map(e=>e.join(':'))).size,relations.edges.length);for(const [a,b]of relations.edges){assert.ok(a>=1&&a<=253&&b>=1&&b<=253&&a!==b);}assert.ok(relations.edges.some(([a,b])=>a===180&&b===202));
});
test('published entry preserves legacy home hashes and keeps original text out of public data',()=>{
 const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');assert.match(html,/startsWith\('#v1='/);assert.match(html,/home\.html/);assert.doesNotMatch(JSON.stringify(guides),/"body"|"solutionText"|\/Users\//);
});
test('shared kitchen and communal eating combine into one table instead of overlapping furniture',()=>{
 assert.ok(shapes('plan',[139],139,'circle').length>0);assert.equal(shapes('plan',[139,147],139,'circle').length,0);assert.ok(shapes('plan',[139,147],139,'path').length>0);assert.equal(shapes('plan',[139,147],147,'rect').filter(s=>s.attrs.width===140).length,1);
});
