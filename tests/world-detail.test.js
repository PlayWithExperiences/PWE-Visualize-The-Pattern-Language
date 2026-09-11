import test from 'node:test';
import assert from 'node:assert/strict';
import {buildDetail} from '../world/detail.js';
import {canStand,movePlayer} from '../walk-physics.js';
const groups=[['room',179,204],['construction',205,240],['finish',241,253]];
const range=(a,b)=>Array.from({length:b-a+1},(_,i)=>a+i);
const geometry=s=>JSON.stringify({boxes:s.boxes.map(({pattern,...b})=>b),meshes:s.meshes.map(({pattern,...m})=>m),lights:(s.lights||[]).map(({pattern,...l})=>l)});

test('every detail pattern independently changes real three-dimensional geometry and has a landmark',()=>{
 for(const [key,a,b]of groups){const base=geometry(buildDetail(key,[]));for(const id of range(a,b)){
  const scene=buildDetail(key,[id]);assert.notEqual(geometry(scene),base,`${id}: no geometric change`);
  assert.ok(scene.applied.includes(id),`${id}: no owned geometry`);assert.ok(scene.landmarks.some(m=>m.id===id),`${id}: no navigable marker`);
  assert.ok(scene.boxes.some(b=>b.pattern===id&&b.dz>0)||scene.meshes.some(m=>m.pattern===id&&new Set(m.points.map(p=>p[2])).size>1),`${id}: no 3D component`);
 }}
});
test('all detail pairs and complete worlds are deterministic, finite, and spawn in a clear place',()=>{
 for(const [key,a,b]of groups){const ids=range(a,b),sets=[[],ids,...ids.map(id=>[id])];for(let i=0;i<ids.length;i++)for(let j=i+1;j<ids.length;j++)sets.push([ids[i],ids[j]]);
  for(const subset of sets){const s=buildDetail(key,subset);for(const box of s.boxes){for(const k of ['x','y','z','dx','dy','dz'])assert.ok(Number.isFinite(box[k]),`${key}/${subset}: ${k}`);assert.ok(box.dx>0&&box.dy>0&&box.dz>0,`${key}/${subset}: invalid box size`);}for(const mesh of s.meshes)assert.ok(mesh.points.flat().every(Number.isFinite));assert.ok(canStand(s.boxes,s.spawn.x,s.spawn.y,s.spawn.feet),`${key}/${subset}: blocked spawn`);}
  assert.equal(geometry(buildDetail(key,ids)),geometry(buildDetail(key,ids)));
 }
});
test('full room and finish worlds have traversable front portals and interior circulation',()=>{
 for(const [key,ids,x,startY,endY]of [['room',range(179,204),14,23,11],['finish',range(241,253),10,19,5],['construction',range(205,240),15.7,21,14]]){
  const s=buildDetail(key,ids);let pose={x,y:startY,feet:0};pose=movePlayer(s.boxes,pose,0,endY-startY);assert.ok(Math.abs(pose.y-endY)<.05,`${key}: stopped at ${pose.y}`);
 }
 const room=buildDetail('room',[194,196]);assert.ok(canStand(room.boxes,23.8,10,.12));assert.ok(!canStand(room.boxes,5,10,.12),'interior window must not become a walking portal');
});
test('dining and bed modes share furniture, with room for chair pullout',()=>{
 const s=buildDetail('room',[182,185,187,188]);const dining=s.boxes.filter(b=>b.pattern===182&&b.kind==='furniture'&&b.z===.75);assert.equal(dining.length,1);
 const table=dining[0];for(const chair of s.boxes.filter(b=>b.pattern===182&&b.kind==='furniture'&&b.z===.43))assert.ok(chair.y+chair.dy<table.y||chair.y>table.y+table.dy,'chair intersects dining tabletop footprint');
 assert.equal(s.boxes.filter(b=>b.kind==='furniture'&&b.z===.2&&b.dy===2).length,1,'shared intimate bed and alcove must have one bed');
});
test('opening patterns operate on one actual window, with deep splayed reveals and opened casements',()=>{
 const ids=[221,222,223,225,236,239],s=buildDetail('construction',ids),v=s.state.window;
 assert.equal(v.sill,.48);assert.equal(v.width,4.2);assert.equal(v.open,true);
 assert.equal(s.boxes.filter(b=>b.kind==='window'&&b.y>=15.75&&b.y<16.1).length,0,'open casement must remove central glass');
 assert.ok(s.meshes.some(m=>m.kind==='splayed-reveal'&&new Set(m.points.map(p=>p[1])).size>1));assert.ok(s.meshes.filter(m=>m.kind==='window').length===4);
 for(const z of [1.1,2])assert.ok(!s.boxes.some(b=>b.kind==='wall'&&v.x+.5>b.x&&v.x+.5<b.x+b.dx&&15.9>b.y&&15.9<b.y+b.dy&&z>b.z&&z<b.z+b.dz),'wall blocks glazed opening');
});
test('construction shells and stairs expose usable three-dimensional section geometry',()=>{
 const s=buildDetail('construction',[214,216,218,219,220,228,229]);
 assert.match(s.state.notes.join(' '),/214.*尚未解决/);assert.ok(s.meshes.some(m=>m.kind==='floor-vault'));assert.ok(s.meshes.some(m=>m.kind==='roof'));
 assert.equal(s.boxes.filter(b=>b.kind==='wall-layer').length,3);assert.ok(s.boxes.find(b=>b.kind==='column-core').dz<s.boxes.find(b=>b.kind==='column-shell').dz);
 assert.ok(s.boxes.filter(b=>b.pattern===228&&b.kind==='step').every(b=>b.dz===.12),'stair treads must leave undercroft open');assert.ok(canStand(s.boxes,21.3,24,.12),'higher staircase should allow standing below');
});
test('local light mode creates separated fixtures and actual renderer lights',()=>{
 const s=buildDetail('finish',[252]);assert.equal(s.lights.length,3);assert.ok(s.lights.every(l=>l.pattern===252&&l.intensity>0&&l.radius===3));assert.equal(s.boxes.filter(b=>b.kind==='emissive').length,3);assert.ok(Math.abs(s.lights[1].x-s.lights[0].x)>5);
});

test('inhabitable dormer has an attic floor, an access stair and standing headroom',()=>{
 const s=buildDetail('construction',[231]);assert.equal(s.boxes.filter(b=>b.pattern===231&&b.kind==='step').length,15);
 assert.ok(canStand(s.boxes,10,1.9,2.62));const top=s.boxes.find(b=>b.pattern===231&&b.kind==='roof');assert.ok(top.z-2.62>2.4);
 let pose={x:7.3,y:-3.5,feet:0};pose=movePlayer(s.boxes,pose,0,5.4);assert.ok(pose.feet>2.5);pose=movePlayer(s.boxes,pose,2.7,0);assert.ok(pose.x>9.9);
});
