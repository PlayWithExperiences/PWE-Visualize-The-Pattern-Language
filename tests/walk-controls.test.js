import test from 'node:test';
import assert from 'node:assert/strict';
import {createWalk} from '../walk.js';
import {buildWorld} from '../world/index.js';

test('held Shift triples travel, release and blur restore base speed; night aid reaches GPU',t=>{
 const events=new Map(),windowEvents=new Map(),uniforms=new Map();let frame,pose;
 const gl=new Proxy({FRAMEBUFFER_COMPLETE:1,getShaderParameter:()=>true,getProgramParameter:()=>true,getExtension:()=>null,checkFramebufferStatus:()=>1,
  getUniformLocation:(_,key)=>key,uniform1f:(key,value)=>uniforms.set(key,value)},
  {get:(o,k)=>k in o?o[k]:String(k).startsWith('create')?()=>({}):String(k).toUpperCase()===k?k:()=>{}});
 const canvas={dataset:{},clientWidth:800,clientHeight:600,getContext:()=>gl,addEventListener:(k,v)=>events.set(k,v),removeEventListener(){}};
 const listener={addEventListener(){},removeEventListener(){}};
 for(const [key,value]of Object.entries({window:{...listener,addEventListener:(k,v)=>windowEvents.set(k,v)},document:{...listener,hidden:false,activeElement:canvas,querySelector:()=>null},devicePixelRatio:1,requestAnimationFrame:fn=>(frame=fn,1),cancelAnimationFrame(){}})){
  const original=Object.getOwnPropertyDescriptor(globalThis,key);Object.defineProperty(globalThis,key,{configurable:true,writable:true,value});t.after(()=>original?Object.defineProperty(globalThis,key,original):delete globalThis[key]);
 }
 const engine=createWalk(canvas,assert.fail,p=>pose={...p});engine.update(buildWorld('site',[]),{freeMode:true});engine.start();
 let now=performance.now()+1000;const tick=()=>frame(now+=200),distance=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y,a.z-b.z);
 events.get('keydown')({key:'w',preventDefault(){}});const start={...pose};tick();const normal=distance(start,pose);
 events.get('keydown')({key:'Shift',preventDefault(){}});const before={...pose};tick();assert.ok(Math.abs(distance(before,pose)-normal*3)<1e-8);
 windowEvents.get('keyup')({key:'Shift'});const release={...pose};tick();assert.ok(Math.abs(distance(release,pose)-normal)<1e-8);
 events.get('blur')();const blurred={...pose};tick();assert.deepEqual(pose,blurred);
 engine.setNightAid(false);tick();assert.equal(uniforms.get('uNightAid'),0);
 engine.setNightAid(true);tick();assert.equal(uniforms.get('uNightAid'),1);engine.dispose();
});
