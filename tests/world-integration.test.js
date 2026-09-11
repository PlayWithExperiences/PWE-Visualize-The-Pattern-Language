import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync}from'node:fs';
import {groups,encodeAtlas,decodeAtlas,normalizeIds}from'../atlas/compose.js';import {buildWorld}from'../world/index.js';import{safeSpawn}from'../world/navigation.js';import{canStand}from'../walk-physics.js';
const raw=s=>JSON.stringify({boxes:s.boxes.map(({pattern,patterns,...rest})=>rest),meshes:s.meshes.map(({pattern,patterns,...rest})=>rest),lights:s.lights});
test('all 253 canonical patterns reach an actual 3D builder, independent of metadata or labels',()=>{
 let count=0;for(const g of groups){const base=raw(buildWorld(g.key,[]));for(let id=g.from;id<=g.to;id++){const s=buildWorld(g.key,[id]);assert.notEqual(raw(s),base,String(id));assert.ok(s.applied.includes(id));assert.ok(s.landmarks.some(m=>m.id===id));const p=safeSpawn(s);assert.ok(canStand(s.boxes,p.x,p.y,p.feet));count++;}}assert.equal(count,253);
});
test('all normalized contexts keep their active 3D rules and valid attributes',()=>{
 for(const g of groups){const ids=normalizeIds(Array.from({length:g.to-g.from+1},(_,i)=>i+g.from)),s=buildWorld(g.key,ids);for(const id of ids)assert.ok(s.applied.includes(id),`${g.key}:${id}`);for(const b of s.boxes){assert.match(b.color,/^#[0-9a-f]{6}$/i);for(const k of ['x','y','z','dx','dy','dz'])assert.ok(Number.isFinite(b[k]));assert.ok(b.dx>0&&b.dy>0&&b.dz>0);}for(const m of s.meshes){assert.equal(m.points.length,3);assert.match(m.color,/^#[0-9a-f]{6}$/i);assert.ok(m.points.flat().every(Number.isFinite));}}
});
test('3D share captures camera mode and current sun while pausing playback and preserving old links',()=>{
 const state={group:'finish',ids:[250,252],focus:252,view:'combined',surface:'3d',camera:'walk',sun:{mode:'time',hour:22.3,playing:true,rate:40}};
 const restored=decodeAtlas(encodeAtlas(state));assert.equal(restored.surface,'3d');assert.equal(restored.camera,'walk');assert.equal(restored.sun.hour,22.3);assert.equal(restored.sun.playing,false);assert.equal(state.sun.playing,true);
 const old={group:'room',ids:[180],focus:180,view:'single'};assert.deepEqual(decodeAtlas(encodeAtlas(old)),old);
});
test('three-dimensional public source does not depend on private book files or generated SVG extrusion',()=>{
 const source=readFileSync(new URL('../world/index.js',import.meta.url),'utf8');assert.doesNotMatch(source,/\.pdf|\/Users\/|compose\(/);assert.match(source,/buildTerritory/);assert.match(source,/buildBuilding/);assert.match(source,/buildDetail/);
});
test('night centres, light-dark sequence and dining atmosphere use working light sources',()=>{
 for(const [key,id,count]of [['neighborhood',33,4],['plan',135,3],['room',182,1]]){const s=buildWorld(key,[id],{hour:0});assert.equal(s.lights.filter(l=>l.pattern===id).length,count);assert.ok(s.boxes.some(b=>b.pattern===id&&b.kind==='emissive'));}
});
