import test from 'node:test';
import assert from 'node:assert/strict';
import {buildScene,defaults,allowed} from '../model.js';
import {EYE_HEIGHT,entryPose,canStand,movePlayer,floorHeight} from '../walk-physics.js';

test('eye height is 1.65m above the surface underfoot',()=>{
 const scene=buildScene(defaults);
 assert.equal(EYE_HEIGHT,1.65);
 assert.equal(floorHeight(scene.boxes,5,4),.15);
 assert.ok(Math.abs(floorHeight(scene.boxes,8.5,6.5)-.3)<1e-9);
});

test('entrance is clear and traversable in all 1024 combinations at size extremes',()=>{
 for(let mask=0;mask<1024;mask++){
  const ids=allowed.filter((_,i)=>mask&(1<<i));
  for(const sizes of [{width:10,depth:9,court:5},{width:16,depth:14,court:3}]){
   const scene=buildScene({...defaults,...sizes,ids}),start=entryPose(scene);
   assert.ok(canStand(scene.boxes,start.x,start.y),'spawn '+mask);
   const direction=ids.includes(105)?-1:1;
   const end=movePlayer(scene.boxes,start,0,direction*3.6);
   assert.ok(Math.abs(end.y-(start.y+direction*3.6))<1e-8,'entry blocked '+mask);
   assert.ok(canStand(scene.boxes,end.x,end.y));
  }
 }
});

test('walls, glazing and furniture block the person rather than allowing flight through them',()=>{
 const s=buildScene(defaults);
 assert.equal(canStand(s.boxes,.05,3),false);
 assert.equal(canStand(s.boxes,5,.05),false);
 assert.equal(canStand(s.boxes,2,1.8),false);
 const start={x:7,y:4,yaw:0,pitch:0};
 const end=movePlayer(s.boxes,start,0,-30);
 assert.ok(end.y>=.37&&end.y<.5,'large frame must not tunnel through exterior wall');
});

test('the internal portal leads from the house into the courtyard',()=>{
 const s=buildScene(defaults),start={x:7.1,y:9.35,yaw:Math.PI/2,pitch:0};
 const end=movePlayer(s.boxes,start,1.6,0);
 assert.ok(end.x>8.6);
 assert.ok(canStand(s.boxes,end.x,end.y));
});

test('walking stays within the scene and resumes from safe entry after a layout change',()=>{
 const s=buildScene(defaults),start=entryPose(s);
 const end=movePlayer(s.boxes,start,0,100);
 const base=s.boxes.find(b=>b.kind==='ground');
 assert.ok(end.y<=base.y+base.dy-.2+1e-8);
 const flipped=buildScene({...defaults,ids:defaults.ids.filter(id=>id!==105)});
 const restored=entryPose(flipped);
 assert.ok(canStand(flipped.boxes,restored.x,restored.y));
 assert.equal(restored.y,-1.8);
});
