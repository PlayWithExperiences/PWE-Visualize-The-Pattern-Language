import test from 'node:test';
import assert from 'node:assert/strict';
import {resolveBoxSurfaces} from '../world/render-surfaces.js';
import {World} from '../world/primitives.js';
import {share} from '../world/building-common.js';
const box=(x,y,dx,dy,pattern,color='#aaaaaa')=>({x,y,z:0,dx,dy,dz:.12,pattern,color,kind:'floor'});
const area=f=>(f.u1-f.u0)*(f.v1-f.v0);
test('coplanar floor finishes cover union once, preserve material and exact contributor intersections',()=>{
 const input=[box(0,0,4,3,1),box(2,1,4,3,2,'#997755')],snapshot=JSON.stringify(input);
 const top=resolveBoxSurfaces(input).filter(f=>f.axis===2&&f.sign===1);
 assert.equal(top.reduce((s,f)=>s+area(f),0),20);
 const joint=top.filter(f=>f.item.patterns?.includes(1)&&f.item.patterns.includes(2));assert.equal(joint.reduce((s,f)=>s+area(f),0),4);
 assert.ok(joint.every(f=>f.item.color==='#997755'));assert.equal(JSON.stringify(input),snapshot);
 for(let i=0;i<top.length;i++)for(const b of top.slice(i+1)){const a=top[i];assert.ok(Math.min(a.u1,b.u1)<=Math.max(a.u0,b.u0)||Math.min(a.v1,b.v1)<=Math.max(a.v0,b.v0));}
});
test('all six outward normals agree with triangle winding after renderer axis conversion',()=>{
 for(const f of resolveBoxSurfaces([box(0,0,2,3,1)])){
  const [a,b,c]=f.points.map(([x,y,z])=>[x,z,y]),u=b.map((v,i)=>v-a[i]),v=c.map((v,i)=>v-a[i]),n=[u[1]*v[2]-u[2]*v[1],u[2]*v[0]-u[0]*v[2],u[0]*v[1]-u[1]*v[0]],normal=[f.normal[0],f.normal[2],f.normal[1]];
  assert.ok(n.reduce((s,v,i)=>s+v*normal[i],0)>0);
 }
});
test('separate heights and transparent glazing are never collapsed into an opaque surface',()=>{
 const raised={...box(0,0,2,3,2),z:1},glass={...box(0,0,2,3,3),kind:'window'},faces=resolveBoxSurfaces([box(0,0,2,3,1),raised,glass]);
 assert.equal(faces.length,18);assert.equal(faces.filter(f=>f.item.kind==='window').length,6);
});
test('box-only share cannot accidentally claim every earlier roof mesh',()=>{
 const w=new World('test',20,20,[1,2]);w.roof(0,0,3,3,1);const start=w.boxes.length;w.bench(5,5,2);share(w,[1,2],start);
 assert.ok(w.boxes.slice(start).every(b=>b.patterns.includes(1)&&b.patterns.includes(2)));
 assert.ok(w.meshes.every(m=>!m.patterns?.includes(2)));
});
