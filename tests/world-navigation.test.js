import test from 'node:test';import assert from 'node:assert/strict';
import {World} from '../world/primitives.js';
import {floorHeight,canStand,movePlayer} from '../walk-physics.js';
import {safeSpawn,observationPose,worldOverview,projectMarker} from '../world/navigation.js';
import {sunMatrix} from '../lighting.js';import {moveFree} from '../free-camera.js';
test('a person remains below an upper floor, walks through a real doorway, and climbs incremental steps',()=>{
 const w=new World('test',30,25,[]);w.room(5,5,8,8,1);w.slab(5,5,8,8,2,undefined,3);
 assert.equal(floorHeight(w.boxes,9,9,.12),.12);assert.ok(canStand(w.boxes,9,9,.12));
 const p=movePlayer(w.boxes,{x:9,y:14,feet:0},0,-3);assert.ok(p.y<12);assert.ok(p.feet<.2);
 w.steps(19,5,2,8,3);const stair=movePlayer(w.boxes,{x:20,y:4.8,feet:0},0,2.3);assert.ok(stair.feet>1);assert.ok(stair.y>7);
 w.box(25,5,0,2,2,1,undefined,4,'step');const blocked=movePlayer(w.boxes,{x:24.5,y:6,feet:0},2,0);assert.ok(blocked.x<25);
});
test('safe spawn and mode inspection positions do not place a person in solids',()=>{
 const w=new World('test',30,25,[1]);w.house(10,10,8,8,1);w.spawn={x:13,y:13,feet:0,yaw:0,pitch:0};w.marker(1,13,13,'建筑');const scene=w.finish();
 for(const p of [safeSpawn(scene),observationPose(scene,1,false)])assert.ok(canStand(scene.boxes,p.x,p.y,p.feet));
 assert.ok(observationPose(scene,1,true).z>2);assert.ok(Number.isFinite(worldOverview(scene).pitch));
});
test('large worlds have navigation bounds and shadow projection containing their extent',()=>{
 const w=new World('region',500,400,[]);w.house(450,350,20,20,1,{floors:10});const scene=w.finish(),matrix=sunMatrix(scene);
 for(const [x,y,z]of [[-15,-15,0],[515,415,0],[470,370,31]]){const p=[x,z,y,1],q=[0,1,2,3].map(r=>p.reduce((sum,n,i)=>sum+matrix[i*4+r]*n,0));assert.ok(q.slice(0,3).every(n=>Math.abs(n/q[3])<=1.01));}
 const moved=moveFree({x:180,y:200,z:100,yaw:0,pitch:0},0,1,1,10,scene.navigation);assert.ok(moved.x>180&&moved.z>100);
});
test('landmark projection hides points behind the camera',()=>{
 assert.equal(projectMarker({x:0,y:3,z:1.65},{x:0,y:0,yaw:0,pitch:0},1.65,1000,600),null);
 assert.equal(projectMarker({x:0,y:-3,z:1.65},{x:0,y:0,yaw:0,pitch:0},1.65,1000,600).x,500);
});
test('removing and restoring an upper floor does not teleport a grounded person upward',async()=>{
 const {buildWorld}=await import('../world/index.js');const {reconcilePerson}=await import('../world/navigation.js');
 const on=buildWorld('edge',[166]),off=buildWorld('edge',[]),pose={x:16,y:17,feet:3.32,yaw:0,pitch:0};
 const grounded=reconcilePerson(off,pose);assert.ok(grounded.feet<.3);assert.ok(reconcilePerson(on,grounded).feet<.3);
});
test('single-pattern overview aims at the local scene and the construction stair can be entered',async()=>{
 const {buildWorld}=await import('../world/index.js');
 for(const [key,id]of [['neighborhood',30],['neighborhood',46],['institution',75]]){const scene=buildWorld(key,[id]),pose=worldOverview(scene),mark=scene.landmarks[0];assert.ok(projectMarker(mark,pose,pose.z,1000,640));}
 const scene=buildWorld('construction',[228]),pose=movePlayer(scene.boxes,{x:20.8,y:19.5,feet:0,yaw:Math.PI,pitch:0},0,5.5);assert.ok(pose.y>24.8);assert.ok(pose.feet>2.5);
});
