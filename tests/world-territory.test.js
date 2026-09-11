import test from 'node:test';
import assert from 'node:assert/strict';
import {buildTerritory} from '../world/territory.js';
const ranges={region:[1,7],city:[8,29],neighborhood:[30,74],institution:[75,94]};
function validate(world){
 for(const b of world.boxes){for(const f of ['x','y','z','dx','dy','dz'])assert.ok(Number.isFinite(b[f]),`${b.pattern} ${f}`);for(const f of ['dx','dy','dz'])assert.ok(b[f]>0,`${b.pattern} positive ${f}`);}
 for(const m of world.meshes)for(const p of m.points)for(const n of p)assert.ok(Number.isFinite(n));
 assert.equal(world.autoCeiling,false);assert.equal(world.spawn.feet,0);
 assert.ok(!world.boxes.some(b=>!['ground','floor'].includes(b.kind)&&b.z<1.7&&b.z+b.dz>0&&world.spawn.x>b.x&&world.spawn.x<b.x+b.dx&&world.spawn.y>b.y&&world.spawn.y<b.y+b.dy),'spawn must be unobstructed');
}
for(const [key,[lo,hi]]of Object.entries(ranges)){
 test(`${key}: every standalone pattern has finite attributed geometry and a landmark`,()=>{
  const signatures=new Set();
  for(let id=lo;id<=hi;id++){
   const w=buildTerritory(key,[id]);validate(w);assert.deepEqual(w.applied,[id]);assert.ok(w.landmarks.some(m=>m.id===id));
   const boxes=w.boxes.filter(b=>b.pattern===id),meshes=w.meshes.filter(b=>b.pattern===id);assert.ok(boxes.length+meshes.length>0);
   const sig=JSON.stringify({boxes:boxes.map(({x,y,z,dx,dy,dz,kind})=>[x,y,z,dx,dy,dz,kind]),meshes:meshes.map(m=>[m.kind,m.points])});
   assert.ok(!signatures.has(sig),`pattern ${id} must not be only a label`);signatures.add(sig);
  }
 });
 test(`${key}: combined scene keeps every active contribution finite`,()=>{let ids=Array.from({length:hi-lo+1},(_,i)=>lo+i);if(key==='institution')ids=ids.filter(id=>![76,77,78].includes(id));const w=buildTerritory(key,ids);validate(w);for(const id of ids){assert.ok(w.applied.includes(id),`${id} attribution`);assert.ok(w.landmarks.some(m=>m.id===id));}});
}
test('21 limits the same mixed-use buildings created by 9 and density gradient 29',()=>{
 const before=buildTerritory('city',[9,29]),after=buildTerritory('city',[9,21,29]);
 assert.ok(before.state.cityBuildings.some(b=>b.floors>4));assert.ok(after.state.cityBuildings.every(b=>b.floors<=4));
 assert.deepEqual(before.state.cityBuildings.map(b=>[b.x,b.y]),after.state.cityBuildings.map(b=>[b.x,b.y]));
 assert.ok(after.boxes.filter(b=>b.kind==='building').every(b=>b.dz<=12));
 assert.ok(after.state.cityBuildings.every(b=>b.uses.includes('workplace')));
});
test('28 moves the active city core and therefore redistributes 29 density in the same buildings',()=>{
 const centre=buildTerritory('city',[29]),edge=buildTerritory('city',[28,29]);
 assert.notDeepEqual(centre.state.core,edge.state.core);
 assert.deepEqual(centre.state.cityBuildings.map(b=>[b.x,b.y]),edge.state.cityBuildings.map(b=>[b.x,b.y]));
 assert.notDeepEqual(centre.state.cityBuildings.map(b=>b.floors),edge.state.cityBuildings.map(b=>b.floors));
});
test('22 reduces existing parking and 23 rebuilds the same city road system',()=>{
 const base=buildTerritory('city',[9]),changed=buildTerritory('city',[9,22,23]);
 assert.ok(changed.state.parkingArea<base.state.parkingArea/4);assert.notDeepEqual(base.state.cityRoads,changed.state.cityRoads);
 assert.deepEqual(base.state.cityBuildings.map(b=>[b.x,b.y]),changed.state.cityBuildings.map(b=>[b.x,b.y]));
});
test('2 changes shared settlement distribution while 3/4 protect farmland around those settlements',()=>{
 const base=buildTerritory('region',[1,6]),changed=buildTerritory('region',[1,2,3,4,6]);
 assert.notEqual(base.state.settlements.length,changed.state.settlements.length);
 assert.ok(changed.state.settlements.every(t=>t.localServices&&t.civicDomain&&t.z>0));
 const v=changed.state.valley;assert.equal(v.protected,true);
 assert.ok(changed.boxes.filter(b=>b.kind==='building').every(b=>b.x+b.dx<=v.x||b.x>=v.x+v.w));
 assert.equal(changed.state.greenFingers.length,2);
});
test('31 promenade and 68 child route connect the same 37/38/39 dwelling groups and shared commons',()=>{
 const w=buildTerritory('neighborhood',[31,37,38,39,60,67,68]);
 assert.deepEqual(w.state.promenade.serves,[37,38,39]);assert.deepEqual(w.state.childrenRoute.serves,[37,38,39]);assert.equal(w.state.childrenRoute.sharesCommons,true);
 assert.deepEqual(w.state.promenade.points.map(p=>p[0]),w.state.childrenRoute.points.map(p=>p[0]));
 for(const g of w.state.residentialGroups){assert.ok(w.boxes.some(b=>b.pattern===67&&b.x===g.x+10));assert.ok(w.boxes.some(b=>b.pattern===60&&b.x===g.x+1));}
 const network=buildTerritory('neighborhood',[37,49,50,52,54]);assert.equal(network.state.residentialRoads.topology,'T-access');assert.equal(network.state.crossing.y,64);
});
test('79 controls the boundary of the selected household rather than a separate display parcel',()=>{
 for(const id of [75,76,77,78]){const w=buildTerritory('institution',[id,79]);assert.equal(w.state.residentControl.homeId,id);assert.deepEqual(w.state.residentControl.homeOrigin,[2,2]);const bench=w.boxes.find(b=>b.kind==='resident-repair-bench');assert.ok(bench.x>=w.state.household.x&&bench.x<w.state.household.x+w.state.household.width);assert.equal(bench.y,w.state.household.y+28);}
});
test('82 changes distances between the same 80 workgroups and 83 equips those groups',()=>{
 const spread=buildTerritory('institution',[80]),close=buildTerritory('institution',[80,82,83]);
 assert.deepEqual(spread.state.workUnits.map(u=>u.name),close.state.workUnits.map(u=>u.name));assert.ok(close.state.contactDistances.AB<spread.state.contactDistances.AB);
 for(const u of close.state.workUnits)assert.ok(close.boxes.some(b=>b.kind==='shared-apprenticeship-tool'&&b.x===u.x+6&&b.y===u.y+2));
});
