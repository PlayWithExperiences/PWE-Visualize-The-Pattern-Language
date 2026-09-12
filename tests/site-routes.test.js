import test from 'node:test';
import assert from 'node:assert/strict';
import {buildWorld} from '../world/index.js';
import {auditRoutes} from '../world/route-audit.js';
import {movePlayer} from '../walk-physics.js';
const check=ids=>{const scene=buildWorld('site',ids);assert.deepEqual(auditRoutes(scene),[],JSON.stringify(ids));return scene;};
test('site paths remain clear for every single/pair, full selection, both shipped presets and reported-tree combination',()=>{
 for(let a=95;a<=126;a++)for(let b=a;b<=126;b++)check(a===b?[a]:[a,b]);
 check(Array.from({length:32},(_,i)=>95+i));
 for(const ids of [[104,105,106,110,112,115,119,120,125,126],[95,98,99,100,102,103,108,122,124],[113,120]])check(ids);
});
test('parking-to-main-entry route can be walked in both directions with every site pattern enabled',()=>{
 const scene=check(Array.from({length:32},(_,i)=>95+i)),route=scene.routes.find(r=>r.pattern===113);
 assert.ok(route);const entrance=scene.landmarks.find(m=>m.id===110),target=[entrance.x,entrance.y-1.4];
 // Follow the authored parking approach, then through the real main entrance.
 const points=[...route.points,target];
 for(const path of [points,[...points].reverse()]){
  let pose={x:path[0][0],y:path[0][1],feet:.12,yaw:0,pitch:0};
  for(const [x,y]of path.slice(1)){pose=movePlayer(scene.boxes,pose,x-pose.x,y-pose.y);assert.ok(Math.hypot(pose.x-x,pose.y-y)<.03,JSON.stringify({target:[x,y],pose}));}
 }
});

test('every declared site route and both upper accesses can be walked forward and backward',()=>{
 const scene=check(Array.from({length:32},(_,i)=>95+i));
 for(const route of scene.routes)for(const path of [route.points,[...route.points].reverse()]){
  let pose={x:path[0][0],y:path[0][1],feet:path!==route.points?(route.endFeet??Math.max(0,route.z)):Math.max(0,route.z),yaw:0,pitch:0};
  for(const [x,y]of path.slice(1)){pose=movePlayer(scene.boxes,pose,x-pose.x,y-pose.y);assert.ok(Math.hypot(pose.x-x,pose.y-y)<.03,JSON.stringify({pattern:route.pattern,target:[x,y],pose}));}
 }
});
