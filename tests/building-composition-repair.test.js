import test from 'node:test';
import assert from 'node:assert/strict';
import {buildSite} from '../world/building-site.js';
import {buildPlan} from '../world/building-plan.js';
import {buildEdge} from '../world/building-edge.js';

const overlaps=(a,b)=>a.x<b.x+b.dx-1e-8&&a.x+a.dx>b.x+1e-8&&a.y<b.y+b.dy-1e-8&&a.y+a.dy>b.y+1e-8&&a.z<b.z+b.dz-1e-8&&a.z+a.dz>b.z+1e-8;
const range=(a,b)=>Array.from({length:b-a+1},(_,i)=>a+i);

test('site wing ownership does not claim parking, trees, and arrival structures',()=>{
 const w=buildSite([97,98,104,107,109]);
 for(const b of w.boxes.filter(b=>[97,98,104].includes(b.pattern)))assert.ok(!b.patterns.includes(107)&&!b.patterns.includes(109));
 const worktop=w.boxes.find(b=>b.kind==='worktop');
 assert.deepEqual(worktop.patterns,[107,109]);
 assert.ok(w.meshes.some(m=>m.kind==='roof'&&m.patterns.includes(107)&&m.patterns.includes(109)));
});

test('shared children and bed cluster use one play mat outside circulation',()=>{
 for(const ids of [[137,143],range(127,158)]){
  const w=buildPlan(ids),mats=w.boxes.filter(b=>b.kind==='play-mat');
  assert.equal(mats.length,1);assert.ok(mats[0].patterns.includes(137)&&mats[0].patterns.includes(143));
 }
});

test('children outdoor play clears annex rooms and reaches a real side door',()=>{
 for(const ids of [[137],[137,154],range(127,158)]){
  const w=buildPlan(ids),sand=w.boxes.find(b=>b.kind==='sand-play');
  assert.ok(sand.x>=34&&sand.x+sand.dx<=39);
  const door={x:33.8,y:18.5,z:.2,dx:.2,dy:1,dz:1.8};
  assert.ok(!w.boxes.some(b=>b.kind==='wall'&&overlaps(b,door)));
 }
});

test('office group seats clear the flexible office partition',()=>{
 const w=buildPlan([146,148,152]);
 const partitions=w.boxes.filter(b=>b.pattern===146&&b.kind==='wall'&&b.dz===1.1);
 const chairs=w.boxes.filter(b=>b.pattern===148&&b.kind==='furniture'&&b.y<13.3);
 for(const a of partitions)for(const b of chairs)assert.ok(!overlaps(a,b));
});

test('covered edge bench does not intersect outdoor dining furniture',()=>{
 for(const ids of [[160,163],range(159,178)]){
  const w=buildEdge(ids);
  for(const a of w.boxes.filter(b=>b.pattern===160&&b.kind==='bench'))for(const b of w.boxes.filter(b=>b.pattern===163&&b.kind==='furniture'))assert.ok(!overlaps(a,b));
 }
});

test('upper stair clears greenhouse and landing connects it to balcony',()=>{
 for(const ids of [[166,175],[167,175],range(159,178)]){
  const w=buildEdge(ids),stairs=w.boxes.filter(b=>b.kind==='step'&&b.patterns.includes(166)||b.kind==='step'&&b.patterns.includes(167));
  assert.equal(stairs.length,20);
  const greenhouse={x:22,y:9,z:0,dx:7.08,dy:6.08,dz:3.6};
  for(const stair of stairs)assert.ok(!overlaps(stair,greenhouse));
  const landing=w.boxes.find(b=>b.kind==='floor'&&b.x===22&&b.y===16.8&&b.z===3.2);
  assert.ok(landing.x+landing.dx>=w.state.balcony.stair[0]+2);
 }
});

test('garden edge pocket clears roof garden room and grouped parking',()=>{
 const w=buildSite([103,118,124]);
 for(const a of w.boxes.filter(b=>b.pattern===124))for(const b of w.boxes.filter(b=>b.pattern===118||b.patterns.includes(103)))assert.ok(!overlaps(a,b));
});

test('east bed orientation surface stays on mattress clear of personal desk',()=>{
 const w=buildPlan([138,141]),orientation=w.boxes.find(b=>b.kind==='bed-orientation');
 const mattress=w.boxes.find(b=>b.kind==='furniture'&&b.z===.48);
 assert.ok(orientation.x>=mattress.x&&orientation.x+orientation.dx<=mattress.x+mattress.dx);
 assert.ok(orientation.y>=mattress.y&&orientation.y+orientation.dy<=mattress.y+mattress.dy);
 for(const b of w.boxes.filter(b=>b.pattern===141))assert.ok(!overlaps(orientation,b));
});

test('all 1182 building pattern pairs retain both contributors and finite positive geometry',()=>{
 for(const [build,lo,hi]of [[buildSite,95,126],[buildPlan,127,158],[buildEdge,159,178]])for(let a=lo;a<=hi;a++)for(let b=a+1;b<=hi;b++){
  const w=build([a,b]);
  for(const id of [a,b]){
   assert.ok(w.applied.includes(id),`${w.key}: ${a}+${b} missing ${id}`);
   assert.ok([...w.boxes,...w.meshes].some(g=>g.patterns.includes(id)));
  }
  for(const box of w.boxes){assert.ok([box.x,box.y,box.z,box.dx,box.dy,box.dz].every(Number.isFinite));assert.ok(box.dx>0&&box.dy>0&&box.dz>0);}
  for(const mesh of w.meshes)assert.ok(mesh.points.flat().every(Number.isFinite));
 }
});

test('full building groups and six public presets keep furniture clear of independent solids',()=>{
 const groups=[
  [buildSite,95,126,[[104,105,106,110,112,115,119,120,125,126],[95,98,99,100,102,103,108,122,124]]],
  [buildPlan,127,158,[[127,128,129,136,137,138,139,143,147],[130,146,148,149,150,151,152,157]]],
  [buildEdge,159,178,[[159,160,161,163,168,171,173,174,176,177],[169,170,172,175,177,178]]],
 ];
 const furniture=new Set(['bench','furniture','cabinet','worktop','shelf','step','car','bath','toilet','sand-play','balcony-table']);
 const contents=new Set(['floor','plant','vegetable','wild-plant','book','storage-box']);
 for(const [build,lo,hi,presets]of groups)for(const ids of [range(lo,hi),...presets]){
  const w=build(ids);
  for(let i=0;i<w.boxes.length;i++)for(let j=i+1;j<w.boxes.length;j++){
   const a=w.boxes[i],b=w.boxes[j];
   if(a.pattern===b.pattern||(!furniture.has(a.kind)&&!furniture.has(b.kind))||contents.has(a.kind)||contents.has(b.kind))continue;
   assert.ok(!overlaps(a,b),`${w.key} ${a.pattern}:${a.kind} / ${b.pattern}:${b.kind}`);
  }
 }
});

test('arrival vegetation and frames clear the transition canopy in full site',()=>{
 const w=buildSite(range(95,126));
 for(const a of w.boxes.filter(b=>b.pattern===126&&b.kind==='trunk'))for(const b of w.boxes.filter(b=>b.pattern===112))assert.ok(!overlaps(a,b));
 for(const a of w.boxes.filter(b=>b.pattern===98))for(const b of w.boxes.filter(b=>b.patterns.includes(110)))assert.ok(!overlaps(a,b));
});

test('entrance porch starts outside facade glass and folding panel clears pergola',()=>{
 const plan=buildPlan([130]);
 for(const a of plan.boxes.filter(b=>b.pattern===130&&['post','ceiling','pergola'].includes(b.kind)))for(const b of plan.boxes.filter(b=>b.pattern===0&&['wall','window'].includes(b.kind)))assert.ok(!overlaps(a,b));
 const edge=buildEdge([160,165]),panel=edge.boxes.find(b=>b.kind==='folded-panel');
 for(const b of edge.boxes.filter(b=>b.pattern===160&&b.kind==='pergola'))assert.ok(!overlaps(panel,b));
});
