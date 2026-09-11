import test from 'node:test';
import assert from 'node:assert/strict';
import {buildScene,defaults,allowed} from '../model.js';
import {sunMatrix} from '../lighting.js';

test('sun shadow camera contains the whole site and roof at supported size extremes',()=>{
 for(const sizes of [{width:10,depth:9,court:5},{width:16,depth:14,court:3}]){
  for(const south of [true,false]){
   const scene=buildScene({...defaults,...sizes,ids:allowed.filter(id=>south||id!==105)});
   const m=sunMatrix(scene);
   const roofs=scene.boxes.filter(b=>b.kind==='floor').map(b=>({...b,z:2.8,dz:.12}));
   for(const b of [...scene.boxes,...roofs]){
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
