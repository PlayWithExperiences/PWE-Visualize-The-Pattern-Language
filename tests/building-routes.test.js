import test from 'node:test';
import assert from 'node:assert/strict';
import {buildPlan} from '../world/building-plan.js';
import {buildEdge} from '../world/building-edge.js';
import {auditRoutes} from '../world/route-audit.js';
import {floorHeight} from '../walk-physics.js';
const range=(a,b)=>Array.from({length:b-a+1},(_,i)=>a+i);
const groups=[
 [buildPlan,127,158,[[127,128,129,136,137,138,139,143,147],[130,146,148,149,150,151,152,157]]],
 [buildEdge,159,178,[[159,160,161,163,168,171,173,174,176,177],[169,170,172,175,177,178]]],
];
for(const [build,lo,hi,presets]of groups){
 test(`${build.name}: full scene and public presets retain clear pedestrian corridors`,()=>{
  for(const ids of [range(lo,hi),...presets])assert.deepEqual(auditRoutes(build(ids)),[],`ids ${ids}`);
 });
 test(`${build.name}: every single pattern and pair retains clear corridors`,()=>{
  for(let a=lo;a<=hi;a++)for(let b=a;b<=hi;b++)assert.deepEqual(auditRoutes(build(a===b?[a]:[a,b])),[],`ids ${a},${b}`);
 });
}
test('audit detects real trunks, furniture and facade walls without ignoring ownership',()=>{
 for(const kind of ['trunk','furniture','wall']){
  const scene={routes:[{pattern:170,z:0,points:[[0,0],[0,4]]}],boxes:[{x:-.1,y:2,z:0,dx:.2,dy:.2,dz:2,kind,pattern:170}]};
  assert.equal(auditRoutes(scene).length,1,kind);
 }
});
test('upper access routes actually ascend to the landing and reach the room doorway',()=>{
 for(const [build,ids,id]of [[buildPlan,[133],133],[buildPlan,range(127,158),133],[buildEdge,[166],166],[buildEdge,range(159,178),166]]){
  const scene=build(ids),route=scene.routes.find(r=>r.pattern===id);assert.ok(route);
  let feet=0;
  for(let i=1;i<route.points.length;i++){
   const a=route.points[i-1],b=route.points[i],n=Math.ceil(Math.hypot(b[0]-a[0],b[1]-a[1])/.1);
   for(let j=0;j<=n;j++){
    const next=floorHeight(scene.boxes,a[0]+(b[0]-a[0])*j/n,a[1]+(b[1]-a[1])*j/n,feet);
    assert.ok(Math.abs(next-feet)<=.2,`discontinuous stair ${id}: ${feet} -> ${next}`);feet=next;
   }
  }
  assert.ok(feet>=3.2,`route ${id} must end in the upper room, got ${feet}`);
 }
});
