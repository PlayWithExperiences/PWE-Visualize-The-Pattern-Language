import test from 'node:test';
import assert from 'node:assert/strict';
import {buildSite} from '../world/building-site.js';

const bounds=m=>({x:Math.min(...m.points.map(p=>p[0])),y:Math.min(...m.points.map(p=>p[1])),right:Math.max(...m.points.map(p=>p[0])),bottom:Math.max(...m.points.map(p=>p[1]))});
const boxBounds=b=>({x:b.x,y:b.y,right:b.x+b.dx,bottom:b.y+b.dy});
const overlaps=(a,b)=>Math.min(a.right,b.right)-Math.max(a.x,b.x)>1e-8&&Math.min(a.bottom,b.bottom)-Math.max(a.y,b.y)>1e-8;

for(const long of [false,true])for(let mask=1;mask<16;mask++){
 const selected=[110,116,117,119].filter((_,i)=>mask&(1<<i));
 test(`site roofs partition actual surfaces: ${long?'109 + ':''}${selected.join(',')}`,()=>{
  const scene=buildSite([...(long?[109]:[]),...selected]),front=long?19:15,width=long?8:12;
  const mainEave={x:24-width/2-.3,y:6.7,right:24+width/2+.3,bottom:front+.3};
  const entry=scene.meshes.filter(m=>m.kind==='roof'&&m.points.every(p=>p[1]>front));
  const ceilings=scene.boxes.filter(b=>b.kind==='ceiling');
  for(const m of entry)assert.ok(!overlaps(bounds(m),mainEave),'entrance roof clears main roof');
  for(const c of ceilings)assert.ok(!overlaps(boxBounds(c),mainEave),'arcade/canopy clears main body and eave');
  for(const c of ceilings)for(const m of entry)assert.ok(!overlaps(boxBounds(c),bounds(m)),'arcade ends at entry roof edge');
  for(let a=0;a<ceilings.length;a++)for(let b=a+1;b<ceilings.length;b++)assert.ok(!overlaps(boxBounds(ceilings[a]),boxBounds(ceilings[b])),'covered strips do not overlap');
  if(selected.some(id=>id===116||id===117)){
   assert.equal(entry.length,4,'one pitched entrance roof, not independent stacked roofs');
   for(const m of entry)for(const id of selected)assert.ok(m.patterns.includes(id),'shared entrance ownership '+id);
  }
  assert.ok(scene.boxes.every(b=>b.dx>0&&b.dy>0&&b.dz>0),'no empty return strips');
 });
}

test('standalone entrance, hierarchy, shelter, and arcade retain their physical meaning',()=>{
 const entrance=buildSite([110]);
 assert.ok(entrance.boxes.some(b=>b.kind==='ceiling'&&b.patterns.includes(110)));
 const hierarchy=buildSite([116]);
 assert.ok(hierarchy.state.roofHierarchy.every((height,i,all)=>!i||height<all[i-1]));
 const shelter=buildSite([117]);
 assert.ok(shelter.boxes.some(b=>b.kind==='bench'&&b.patterns.includes(117)));
 const standaloneArcade=buildSite([119]);
 const arcade=buildSite([109,119]);
 const covers=arcade.boxes.filter(b=>b.kind==='ceiling');
 assert.equal(covers.length,3,'cross arcade and two returns');
 assert.ok(standaloneArcade.boxes.some(b=>b.kind==='wall'&&b.x<13&&b.patterns.includes(119)),'left wing retained');
 assert.ok(standaloneArcade.boxes.some(b=>b.kind==='wall'&&b.x>=35&&b.patterns.includes(119)),'right wing retained');
 for(const x of [8,40])assert.ok(covers.some(b=>x>=b.x&&x<=b.x+b.dx&&Math.abs(b.y-15.31)<1e-8),'wing entrance has covered return');
});
