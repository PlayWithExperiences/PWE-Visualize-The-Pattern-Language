import test from 'node:test';
import assert from 'node:assert/strict';
import {World} from '../world/primitives.js';
import {buildBuilding} from '../world/building.js';
import {buildDetail} from '../world/detail.js';

const triangleArea=([a,b,c])=>Math.abs((b[0]-a[0])*(c[1]-a[1])-(b[1]-a[1])*(c[0]-a[0]))/2;
// Independent separating-axis check: a common edge has zero area, not overlap.
function overlaps(a,b){
 for(const polygon of [a,b])for(let i=0;i<polygon.length;i++){
  const p=polygon[i],q=polygon[(i+1)%polygon.length],axis=[p[1]-q[1],q[0]-p[0]],len=Math.hypot(...axis);
  if(len<1e-9)continue;
  const project=poly=>poly.map(v=>(v[0]*axis[0]+v[1]*axis[1])/len),ap=project(a),bp=project(b);
  if(Math.min(Math.max(...ap),Math.max(...bp))-Math.max(Math.min(...ap),Math.min(...bp))<1e-7)return false;
 }
 return true;
}
function assertPavingDisjoint(world){
 const paths=world.meshes.filter(m=>m.kind==='path');assert(paths.length>0);
 for(let i=0;i<paths.length;i++){
  assert(triangleArea(paths[i].points)>1e-9,'nondegenerate paving');
  for(let j=0;j<i;j++)if(Math.abs(paths[i].points[0][2]-paths[j].points[0][2])<1e-9)
   assert(!overlaps(paths[i].points,paths[j].points),`paving ${j}/${i} overlaps in ${world.key}`);
 }
}

test('crossing and retraced paths retain exact union area at authored elevation',()=>{
 const w=new World('test',10,10,[1,2]);
 w.path([[1,3],[5,3]],1,1);w.path([[3,1],[3,5]],1,2);w.path([[5,3],[1,3]],1,2);
 assertPavingDisjoint(w);
 const paving=w.meshes.filter(m=>m.kind==='path');
 assert(Math.abs(paving.reduce((sum,m)=>sum+triangleArea(m.points),0)-7)<1e-8);
 assert(paving.every(m=>m.points.every(p=>p[2]===.01)),'no depth offsets');
 assert(w.applied.has(1)&&w.applied.has(2));
});
test('paving at separate physical elevations remains separate',()=>{
 const w=new World('test',10,10,[]);
 w.path([[1,3],[5,3]],1,0,'#fff',.01);w.path([[1,3],[5,3]],1,0,'#fff',3.01);
 assert.equal(w.meshes.length,4);assert.equal(w.meshes.reduce((sum,m)=>sum+triangleArea(m.points),0),8);
});
test('site default and complete building/detail routes contain no coplanar overlap',()=>{
 for(const world of [
  buildBuilding('site',[104,105,106,110,112,115,119,120,125,126]),
  buildBuilding('site',Array.from({length:32},(_,i)=>95+i)),
  buildBuilding('plan',Array.from({length:32},(_,i)=>127+i)),
  buildDetail('room',Array.from({length:26},(_,i)=>179+i)),
 ])assertPavingDisjoint(world);
});
test('room facade joins side walls without intersecting corner volumes',()=>{
 const w=new World('test',10,10,[]);w.room(1,1,8,6);
 const walls=w.boxes.filter(b=>b.kind==='wall');
 for(let i=0;i<walls.length;i++)for(let j=0;j<i;j++){
  const a=walls[i],b=walls[j];
  const intersect=['x','y','z'].every((key,k)=>Math.min(a[key]+a[['dx','dy','dz'][k]],b[key]+b[['dx','dy','dz'][k]])-Math.max(a[key],b[key])>1e-8);
  assert(!intersect,`wall ${j}/${i} has intersecting volume`);
 }
});
test('private rooms reuse the shared house floor without coplanar duplicate slabs',()=>{
 const world=buildBuilding('plan',[127,136,137,138,141,143,144,145]);
 const floors=world.boxes.filter(b=>b.kind==='floor'&&b.z===0);
 assert.equal(floors.length,1);assert.deepEqual([floors[0].x,floors[0].y,floors[0].dx,floors[0].dy],[10,8,24,22]);
 assert(world.boxes.some(b=>b.kind==='wall'&&b.x===11),'private partitions retained');
});
test('selected paving owns only its actual crossing with a baseline path',()=>{
 const w=new World('test',10,10,[1,2]);
 w.path([[1,3],[5,3]],1);w.path([[3,1],[3,5]],1,1);w.path([[2,3],[4,3]],1,2);
 const result=w.finish();assertPavingDisjoint(result);
 const owned=id=>result.meshes.filter(m=>(m.patterns??[m.pattern]).includes(id));
 const area=meshes=>meshes.reduce((sum,m)=>sum+triangleArea(m.points),0);
 assert(Math.abs(area(owned(1))-4)<1e-8,'crossing path retains its entire footprint');
 assert(Math.abs(area(owned(2))-2)<1e-8,'fully covered selected path retains its own exact footprint');
 const jointlyOwned=owned(1).filter(m=>m.patterns?.includes(2));
 assert(Math.abs(area(jointlyOwned)-1)<1e-8,'joint attribution restricted to one square metre');
 assert.equal(area(result.meshes),7,'attribution never duplicates surfaces');
});
test('combined room rug stops at the hearth and alcove joinery has no overlapping volumes',()=>{
 const world=buildDetail('room',[179,181,183,188,191,193,197,203,204]);
 const volumeOverlap=(a,b)=>['x','y','z'].every((key,k)=>Math.min(a[key]+a[['dx','dy','dz'][k]],b[key]+b[['dx','dy','dz'][k]])-Math.max(a[key],b[key])>1e-8);
 const rug=world.boxes.find(b=>b.pattern===191&&b.kind==='floor'),hearth=world.boxes.find(b=>b.kind==='hearth');
 assert(rug.y>=hearth.y+hearth.dy,'rug meets the hearth edge rather than covering its top');
 for(const id of [179,183,188,193,197,203,204]){
  const parts=world.boxes.filter(b=>b.pattern===id);
  for(let i=0;i<parts.length;i++)for(let j=0;j<i;j++)assert(!volumeOverlap(parts[i],parts[j]),`${id}: joinery ${j}/${i} overlaps`);
 }
});
