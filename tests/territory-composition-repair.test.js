import test from 'node:test';
import assert from 'node:assert/strict';
import {buildTerritory} from '../world/territory.js';
const ranges={region:[1,7],city:[8,29],neighborhood:[30,74],institution:[75,94]};
const overlap=(a,b)=>['x','y','z'].every(k=>Math.min(a[k]+a['d'+k],b[k]+b['d'+k])-Math.max(a[k],b[k])>1e-6);
const solids=w=>w.boxes.filter(b=>b.pattern&&!['ground','floor','window','settlement-highland'].includes(b.kind));
// Do not call a floor underneath furniture, supported highland, facade glazing,
// or joined surfaces a collision. Independent patterned solid volumes must clear.
for(const [key,[lo,hi]]of Object.entries(ranges))test(`${key}: full composition has no intersecting independent solid contributions`,()=>{
 const w=buildTerritory(key,Array.from({length:hi-lo+1},(_,i)=>lo+i)),boxes=solids(w);
 for(let i=0;i<boxes.length;i++)for(let j=i+1;j<boxes.length;j++){
  const a=boxes[i],b=boxes[j];if(a.pattern===b.pattern)continue;
  const common=(a.patterns??[a.pattern]).some(id=>(b.patterns??[b.pattern]).includes(id));
  if(!common)assert.ok(!overlap(a,b),`${a.pattern} ${a.kind} intersects ${b.pattern} ${b.kind}`);
 }
});
test('shared household and residential geometry is separated from stable public facility parcels',()=>{
 for(const [key,ids]of [['neighborhood',[30,37,38,39,40,52,67,68]],['institution',[75,76,77,78,79,80,81,82,83,84]]]){
  const w=buildTerritory(key,ids),domain=w.state.sharedDomain;
  for(const [id,p]of Object.entries(w.state.patterns))if(p.parcel&&!['37','38','39'].includes(id))assert.ok(p.parcel[1]>domain.y+domain.depth);
  for(const id of key==='neighborhood'?[40]:[81,84]){
   const alone=buildTerritory(key,[id]);assert.deepEqual(alone.state.patterns[id].parcel,w.state.patterns[id].parcel);
  }
 }
});
test('city core furnishings clear occupied building envelopes for central and eccentric density',()=>{
 for(const ids of [[9,29],[9,21,28,29]]){
  const w=buildTerritory('city',ids),c=w.state.core,plaza={x:c.x-7,y:c.y-7,z:0,dx:14,dy:14,dz:3};
  for(const b of w.boxes.filter(b=>b.kind==='building'))assert.ok(!overlap(plaza,b));
  for(const b of w.state.cityBuildings){assert.equal(b.distanceToCore,Math.hypot(b.x+b.width/2-c.x,b.y+b.depth/2-c.y));}
  const building=w.boxes.find(b=>b.kind==='building');assert.deepEqual(building.patterns,[9,21,29].filter(id=>ids.includes(id)));
 }
});
test('urban auxiliary facilities retain their site when earlier facilities are selected',()=>{
 const before=buildTerritory('city',[27]),after=buildTerritory('city',[8,10,27]);
 assert.deepEqual(before.boxes.filter(b=>b.pattern===27),after.boxes.filter(b=>b.pattern===27));
});
test('institution workgroup connector goes around C and joins its southern entrance',()=>{
 const w=buildTerritory('institution',[75,77,80,82,83]),c=w.state.workUnits[2];
 assert.ok(c.y>=44);
 const roomInterior={x:c.x+.2,y:c.y+.2,z:0,dx:9.6,dy:7.6,dz:.1};
 for(const m of w.meshes.filter(m=>m.kind==='path')){
  const center=m.points.reduce((a,p)=>a.map((v,i)=>v+p[i]/3),[0,0,0]);
  assert.ok(!(center[0]>roomInterior.x&&center[0]<roomInterior.x+roomInterior.dx&&center[1]>roomInterior.y&&center[1]<roomInterior.y+roomInterior.dy),'outside connector must not cut across C');
 }
});
test('regional stewardship and rural infill fit the expanded connected southern band',()=>{
 const w=buildTerritory('region',[1,2,3,4,5,6,7]);
 for(const b of w.boxes.filter(b=>[5,7].includes(b.pattern)&&!['floor','window'].includes(b.kind)))assert.ok(b.y+b.dy<=w.state.depth);
 const infill=w.boxes.filter(b=>b.pattern===5&&b.kind==='building');assert.equal(infill.length,4);assert.ok(infill.every(b=>b.y>99));
});

test('city housing setbacks clear the full width of its north-south streets',()=>{
 for(const ids of [[9],[9,11],[9,23]]){
  const w=buildTerritory('city',ids);
  for(const b of w.boxes.filter(b=>b.kind==='building'))for(const p of w.state.cityRoads){
   if(p[0][0]!==p[1][0])continue;
   const street={x:p[0][0]-2,y:Math.min(p[0][1],p[1][1]),z:0,dx:4,dy:Math.abs(p[0][1]-p[1][1]),dz:1};
   assert.ok(!overlap(b,street),'occupied building must respect road setback');
  }
 }
});
