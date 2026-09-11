import test from 'node:test';
import assert from 'node:assert/strict';
import {advanceSun,sampleSun,normalizeSun,formatHour,defaultSun} from '../sun.js';
import {overviewPose,moveFree} from '../free-camera.js';
import {defaults,buildScene,encode,decode} from '../model.js';
import {sunMatrix} from '../lighting.js';

test('illustrative day starts in the east, culminates south, and has no sunlight at night',()=>{
 const east=sampleSun({hour:6}),noon=sampleSun({hour:12}),west=sampleSun({hour:18}),night=sampleSun({hour:0});
 assert.ok(east.direction[0]>.99);
 assert.ok(noon.direction[1]>.9&&noon.direction[2]>0);
 assert.ok(west.direction[0]<-.99);
 assert.equal(night.strength,0);assert.equal(night.daylight,0);
 assert.equal(noon.strength,1);assert.equal(noon.daylight,1);
});
test('time rate has declared minutes/second units, wraps midnight, and stops when paused',()=>{
 const start={hour:23.5,playing:true,rate:60};
 assert.equal(advanceSun(start,1).hour,.5);
 assert.equal(advanceSun({...start,playing:false},20).hour,23.5);
 assert.equal(advanceSun({hour:15,playing:true,rate:10},6).hour,16);
 assert.equal(formatHour(23.999),'23:59');assert.equal(formatHour(24),'00:00');
});
test('manual sun ignores the clock and remains finite at zenith/nadir',()=>{
 const scene=buildScene(defaults);
 for(const elevation of [-90,-45,0,45,90]){
  const sample=sampleSun({mode:'manual',azimuth:90,elevation});
  assert.ok(Math.abs(Math.hypot(...sample.direction)-1)<1e-10);
  assert.ok([...sunMatrix(scene,sample.direction)].every(Number.isFinite));
  if(elevation<0)assert.equal(sample.strength,0);
 }
 assert.equal(normalizeSun({mode:'manual',playing:true}).playing,false);
 assert.equal(normalizeSun({rate:999}).rate,240);
});
test('old links remain valid and sharing freezes the current lighting without mutating playback',()=>{
 const old=decode('#v1='+encodeURIComponent(JSON.stringify({ids:[],width:11,depth:10,court:4,seat:.6})));
 assert.equal(old.error,null);assert.deepEqual(old.state.sun,defaultSun);
 const state={...defaults,sun:{...defaultSun,hour:8.75,rate:60,playing:true}};
 const restored=decode(encode(state)).state;
 assert.equal(restored.sun.hour,8.75);assert.equal(restored.sun.rate,60);assert.equal(restored.sun.playing,false);assert.equal(state.sun.playing,true);
 const manual={...defaults,sun:{...defaultSun,mode:'manual',azimuth:130,elevation:12}};
 assert.deepEqual(decode(encode(manual)).state.sun,manual.sun);
});
test('free camera flies in three axes and can pass through walls while remaining bounded',()=>{
 const scene=buildScene(defaults),start=overviewPose(scene);
 assert.equal(start.z,10);
 const up=moveFree(start,0,0,1,3);assert.equal(up.z,13);
 const forward=moveFree(start,1,0,0,2);
 assert.ok(forward.z<start.z,'looking down and flying forward descends');
 const inside={x:5,y:1,z:1.8,yaw:0,pitch:0};
 assert.ok(moveFree(inside,1,0,0,2).y<0,'free mode must not use wall collision');
 assert.equal(moveFree(start,0,0,1,1000).z,80);
 assert.equal(moveFree(start,0,0,-1,1000).z,.3);
});
