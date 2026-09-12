import test from 'node:test';
import assert from 'node:assert/strict';
import {buildScene,defaults,allowed} from '../model.js';
import {sunMatrix} from '../lighting.js';

test('sun shadow camera contains architecture and roof at supported size extremes',()=>{
 for(const sizes of [{width:10,depth:9,court:5},{width:16,depth:14,court:3}]){
  for(const south of [true,false]){
   const scene=buildScene({...defaults,...sizes,ids:allowed.filter(id=>south||id!==105)});
   const m=sunMatrix(scene);
   const roofs=scene.boxes.filter(b=>b.kind==='floor').map(b=>({...b,z:2.8,dz:.12}));
   for(const b of [...scene.boxes.filter(b=>b.kind!=='ground'),...roofs]){
    for(const x of [b.x,b.x+b.dx])for(const y of [b.y,b.y+b.dy])for(const z of [b.z,b.z+b.dz]){
     const p=[x,z,y,1];
     for(let row=0;row<3;row++){
      const clip=p.reduce((sum,v,i)=>sum+m[i*4+row]*v,0);
      assert.ok(Number.isFinite(clip)&&Math.abs(clip)<=1,'shadow camera clips scene');
     }
    }
   }
  }
 }
});

function clip(m,p){return [0,1,2].map(row=>[...p,1].reduce((sum,v,i)=>sum+m[i*4+row]*v,0));}
test('room shadow map fits architecture rather than padded presentation ground',()=>{
 const wall={kind:'wall',x:0,y:0,z:0,dx:6,dy:4,dz:3};
 const ground={kind:'ground',x:-30,y:-30,z:-.1,dx:66,dy:64,dz:.1};
 const scene={autoCeiling:false,boxes:[ground,wall],meshes:[]},direction=[-.48,.67,.57];
 const m=sunMatrix(scene,direction);
 const rightSpan=2/Math.hypot(m[0],m[4],m[8]);
 assert.ok(rightSpan<10,`6 by 4 m room uses a ${rightSpan.toFixed(2)} m map width`);
 const expanded=sunMatrix({...scene,boxes:[{...ground,x:-100,y:-100,dx:206,dy:204},wall]},direction);
 for(const i of [0,4,8,12,1,5,9,13])assert.ok(Math.abs(m[i]-expanded[i])<1e-6,'ground padding does not dilute XY shadow resolution');
 for(const x of [0,6])for(const y of [0,4])for(const z of [0,3]){
  const point=[x,z,y],t=z/direction[1],shadow=point.map((v,i)=>v-direction[i]*t);
  for(const p of [point,shadow])assert.ok(clip(m,p).every(v=>Math.abs(v)<=1),'architecture and its ground shadow remain covered');
 }
});
test('low sun and overhead sun produce finite shadow cameras covering mesh vertices',()=>{
 const scene={autoCeiling:false,boxes:[{kind:'ground',x:-10,y:-10,z:-.1,dx:20,dy:20,dz:.1}],meshes:[{points:[[0,0,0],[3,0,5],[0,4,2]]}]};
 for(const direction of [[1,.01,0],[0,1,0],[0,-1,0],[0,0,0]]){
  const m=sunMatrix(scene,direction);assert.ok(Array.from(m).every(Number.isFinite));
  for(const [x,y,z]of scene.meshes[0].points)assert.ok(clip(m,[x,z,y]).every(v=>Math.abs(v)<=1));
 }
});
