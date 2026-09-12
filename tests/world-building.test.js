import test from 'node:test';
import assert from 'node:assert/strict';
import {buildBuilding} from '../world/building.js';
const groups=[['site',95,126],['plan',127,158],['edge',159,178]];
const blockers=(w,x,y,z=1.2)=>w.boxes.filter(b=>!['window','floor','step','ground'].includes(b.kind)&&b.x<x&&b.x+b.dx>x&&b.y<y&&b.y+b.dy>y&&b.z<z&&b.z+b.dz>z);
for(const [key,start,end]of groups){
 test(`${key}: every pattern ${start}–${end} creates semantic geometry and a located observation`,()=>{
  const baseline=buildBuilding(key,[]);
  for(let id=start;id<=end;id++){
   const w=buildBuilding(key,[id]);
   assert.deepEqual(w.applied,[id],`${id}: only requested effect reported`);
   assert(w.boxes.some(b=>b.pattern===id)||w.meshes.some(m=>m.pattern===id),`${id}: no labelled-only pattern`);
   assert.notDeepEqual([w.boxes,w.meshes],[baseline.boxes,baseline.meshes],`${id}: geometry unchanged`);
   assert(w.landmarks.some(m=>m.id===id));assert(w.state.observations.some(o=>o.id===id&&o.observation.length>10));
   for(const b of w.boxes){for(const k of ['x','y','z','dx','dy','dz'])assert(Number.isFinite(b[k]),`${id}: ${k}`);assert(b.dx>0&&b.dy>0&&b.dz>0,`${id}: positive dimensions`);}
   assert.equal(blockers(w,w.spawn.x,w.spawn.y).length,0,`${id}: spawn inside solid`);
  }
 });
 test(`${key}: full combination keeps all selected patterns and a clear spawn`,()=>{
  const ids=Array.from({length:end-start+1},(_,n)=>start+n),w=buildBuilding(key,ids);
  assert.deepEqual([...w.applied].sort((a,b)=>a-b),ids);
  assert.equal(w.landmarks.length,ids.length);assert.equal(blockers(w,w.spawn.x,w.spawn.y).length,0);
 });
}
test('kitchen, shared core and communal eating share exactly one dining table',()=>{
 const w=buildBuilding('plan',[127,129,139,147]);assert.equal(w.state.sharedDiningTables,1);
 const tables=w.boxes.filter(b=>b.kind==='furniture'&&b.z===.75&&b.dx===3);assert.equal(tables.length,1);assert.deepEqual(tables[0].patterns.sort(),[129,139,147].sort());
 assert.equal(blockers(w,22,29.9).length,0,'main door is traversable');
 assert.equal(blockers(w,14,14.9).length,0,'private room door is traversable');
});
test('roof garden has a continuous rising stair and roof-level landing',()=>{
 const w=buildBuilding('site',[118]);const stairs=w.boxes.filter(b=>b.kind==='step');assert.equal(stairs.length,18);assert.equal(stairs.at(-1).z+stairs.at(-1).dz,2.88);
 const last=stairs.at(-1);assert(w.boxes.some(b=>b.kind==='floor'&&b.z===last.z+last.dz&&b.y<=last.y+last.dy+1e-6&&b.y+b.dy>last.y+last.dy&&b.x<=last.x&&b.x+b.dx>=last.x+last.dx),'stair width joins roof-height landing');
 const raised=w.boxes.filter(b=>b.kind==='planter');assert(raised.length>0&&raised.every(b=>b.z>=2.88));
});
test('gallery and deep balcony share upper access and a real room door',()=>{
 const w=buildBuilding('edge',[166,167]);assert.equal(w.state.balcony.depth,2.6);assert.equal(w.boxes.filter(b=>b.kind==='step').length,20);assert.equal(blockers(w,16,15.9,4.5).length,0);
 assert(w.boxes.some(b=>b.kind==='floor'&&b.x===10&&b.y===16&&b.dy>=1.83));
});
test('greenhouse opens to both house and garden, glazing remains in wall gaps',()=>{
 const w=buildBuilding('edge',[159,175]);assert.equal(blockers(w,21.9,12).length,0);assert.equal(blockers(w,29.01,12).length,0);assert(w.boxes.some(b=>b.kind==='window'&&b.x===10.08));
});
test('compost diagram retains professionally managed stage and does not assert sanitation',()=>{
 const w=buildBuilding('edge',[177,178]);assert.equal(w.state.compostCycle.sanitationVerified,false);assert.equal(w.state.compostCycle.rawWasteToCrops,false);assert(w.boxes.some(b=>b.kind==='managed-treatment'));
});
test('upper external stair terminates at a real side door, not in the lower roof',()=>{
 const w=buildBuilding('plan',[133,158]);assert.equal(w.boxes.filter(b=>b.kind==='step'&&b.dx===2.2).length,20);assert.equal(blockers(w,33.9,37,4.5).length,0);assert(w.boxes.some(b=>b.kind==='floor'&&b.x===28&&b.y===34&&b.z===3.2));
});
test('story count is backed by two reachable floors with a side entrance',()=>{
 const w=buildBuilding('site',[21,96]);assert.equal(w.state.program.stories,2);assert.equal(w.state.program.heightLimitStories,4);
 assert(w.boxes.some(b=>b.kind==='floor'&&b.x===18&&b.y===0&&b.z===3.2));assert.equal(blockers(w,29.9,2.5,4.5).length,0);assert.equal(w.boxes.filter(b=>b.kind==='step').length,20);
});
test('independent rental room has an internal closable portal as well as its external entrance',()=>{
 const w=buildBuilding('plan',[127,153]);assert.equal(blockers(w,39.1,5.5).length,0);assert.equal(blockers(w,33.9,19).length,0);assert.equal(blockers(w,42.5,8.9).length,0);assert(w.boxes.some(b=>b.kind==='open-door-leaf'));
});
test('vegetable beds follow combined terrace elevations',()=>{
 const w=buildBuilding('edge',[169,177]);const beds=w.boxes.filter(b=>b.kind==='vegetable-bed');assert.equal(beds.length,3);assert.deepEqual(beds.map(b=>Number(b.z.toFixed(2))),[.12,.6,1.08]);
});
