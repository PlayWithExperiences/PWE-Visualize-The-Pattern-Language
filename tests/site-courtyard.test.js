import test from 'node:test';
import assert from 'node:assert/strict';
import {buildSite} from '../world/building-site.js';
const overlap=(a,b)=>['x','y','z'].every(k=>Math.min(a[k]+a['d'+k],b[k]+b['d'+k])-Math.max(a[k],b[k])>1e-7);
test('105 and121 share one supported bench and partition their common terrace',()=>{
 const scene=buildSite([105,121]),floors=scene.boxes.filter(b=>b.kind==='floor'&&(b.patterns.includes(105)||b.patterns.includes(121)));
 assert.equal(floors.reduce((s,b)=>s+b.dx*b.dy,0),78);
 for(let i=0;i<floors.length;i++)for(const b of floors.slice(i+1))assert.equal(overlap(floors[i],b),false);
 const bench=scene.boxes.filter(b=>b.kind==='bench');assert.equal(bench.length,4);
 assert.ok(bench.every(b=>b.patterns.includes(105)&&b.patterns.includes(121)&&b.z>=.12));
 assert.ok(scene.meshes.filter(m=>m.kind==='roof').every(m=>!m.patterns.includes(121)),'bench sharing does not relabel unrelated roof meshes');
});
test('private garden furniture stays outside the rooftop garden building',()=>{
 const scene=buildSite([111,118]),garden=scene.boxes.filter(b=>b.pattern===111&&['wall','bench','planter'].includes(b.kind)),building=scene.boxes.filter(b=>b.pattern===118&&['wall','floor'].includes(b.kind));
 for(const a of garden)for(const b of building)assert.equal(overlap(a,b),false);
});

test('later shape rules preserve the ownership of a jointly placed courtyard bench',()=>{
 const scene=buildSite(Array.from({length:23},(_,i)=>104+i));
 const shared=scene.boxes.filter(b=>b.kind==='bench'&&b.patterns.includes(105));
 assert.equal(shared.length,4);assert.ok(shared.every(b=>b.patterns.includes(121)));
});
