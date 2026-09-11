import {scenarios} from './scenarios.js';
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {defaults,allowed,normalize,encode,decode,buildScene} from '../model.js';
import {renderScene} from '../scene.js';
const catalog=JSON.parse(readFileSync(new URL('../data/catalog.json',import.meta.url)));
test('complete contiguous catalog and bilingual names',()=>{
 assert.deepEqual(catalog.map(p=>p.id),Array.from({length:253},(_,i)=>i+1));
 assert.ok(catalog.every(p=>p.name&&p.zh));
 assert.equal(catalog.filter(p=>p.scale==='town').length,94);
 assert.equal(catalog.filter(p=>p.scale==='building').length,110);
 assert.equal(catalog.filter(p=>p.scale==='construction').length,49);
});
test('share preserves an empty selection and exact supported dimensions',()=>{
 const s={ids:[],width:13.5,depth:11.5,court:4.25,seat:.75};assert.deepEqual(decode(encode(s)).state,{...s,sun:{mode:'time',hour:15,playing:false,rate:10,azimuth:225,elevation:45}});
 assert.deepEqual(decode(encode(defaults)).state,normalize(defaults));
});
test('invalid sharing and untrusted parameter bounds remain identifiable',()=>{
 for(const h of ['#v1=%','invalid','#v1=null','#v1=[]','#v1={}'])assert.ok(decode(h).error);
 const n=normalize({ids:[115,115,999,'105'],width:900,depth:-1,court:999,seat:'oops'});
 assert.deepEqual(n.ids,[115]);assert.equal(n.width,16);assert.equal(n.depth,9);assert.equal(n.court,5);assert.equal(n.seat,.65);
});
test('courtyard removes exactly its area from same building envelope',()=>{
 const plain=buildScene({...defaults,ids:[]}), court=buildScene({...defaults,ids:[115]});
 assert.equal(plain.metrics.indoorArea,120);assert.equal(court.metrics.indoorArea,104);
 assert.equal(plain.metrics.indoorArea-court.metrics.indoorArea,court.metrics.courtArea);
 for(const scene of [plain,court])assert.equal(scene.boxes.filter(b=>b.kind==='floor').reduce((sum,b)=>sum+b.dx*b.dy,0),scene.metrics.indoorArea);
});
test('every supported pattern changes geometry when used alone',()=>{
 const baseline=JSON.stringify(buildScene({...defaults,ids:[]}).boxes);
 for(const id of allowed)assert.notEqual(JSON.stringify(buildScene({...defaults,ids:[id]}).boxes),baseline,`pattern ${id}`);
});
test('legacy exhaustive, all-pairs and mixed scenarios produce valid geometry',()=>{
 for(const ids of scenarios(allowed)){
  const bits=ids.join(',');
  for(const dimensions of [{width:10,depth:9,court:5,seat:1},{width:16,depth:14,court:3,seat:.45}]){
   const s=buildScene({...dimensions,ids});
   for(const b of s.boxes){for(const k of ['x','y','z','dx','dy','dz'])assert.ok(Number.isFinite(b[k]),`${bits} ${k}`);for(const k of ['dx','dy','dz'])assert.ok(b[k]>0,`${bits} ${k}`);}
   assert.ok(s.metrics.indoorArea>0);
  }
 }
});
test('window seat parameter changes seat depth and courtyard opening remains unblocked',()=>{
 const s=buildScene({...defaults,ids:allowed,seat:.9});assert.equal(s.boxes.find(b=>b.kind==='window-seat').dy,.9);
 // South-facing courtyard portal must have clear passage below the lintel.
 const crossing=s.boxes.filter(b=>['wall','window'].includes(b.kind)&&b.x>7.7&&b.x<8&&b.y<9.5&&b.y+b.dy>9.1&&b.z<2);
 assert.equal(crossing.length,0);
});
test('renderer supports rotation and flat plan without invalid numbers',()=>{
 const scene=renderScene(defaults), rotated=renderScene(defaults,{angle:90}),plan=renderScene(defaults,{plan:true});
 assert.notEqual(scene,rotated);assert.notEqual(scene,plan);for(const svg of [scene,rotated,plan]){assert.ok(svg.includes('<svg'));assert.ok(!/NaN|undefined|Infinity/.test(svg));}
});
