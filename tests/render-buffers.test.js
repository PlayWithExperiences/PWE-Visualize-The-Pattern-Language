import test from 'node:test';
import assert from 'node:assert/strict';
import {createRenderBuffers,emphasizedColor,VERTEX_FLOATS} from '../render-buffers.js';

function recorder(){
 let bound=null,id=0;const uploads=[],draws=[],deleted=[],attributes=[];
 const gl={ARRAY_BUFFER:1,STATIC_DRAW:2,DYNAMIC_DRAW:3,TRIANGLES:4,
  createBuffer:()=>++id,bindBuffer:(_,buffer)=>bound=buffer,
  bufferData:(_,data,usage)=>uploads.push({buffer:bound,data:Array.from(data),bytes:data.byteLength,usage}),
  drawArrays:(_,start,count)=>draws.push({buffer:bound,start,count}),deleteBuffer:buffer=>deleted.push(buffer)};
 const batches=createRenderBuffers(gl,()=>attributes.push(bound));
 return {gl,batches,uploads,draws,deleted,attributes};
}
const triangle=value=>Array.from({length:3*VERTEX_FLOATS},(_,i)=>i%VERTEX_FLOATS===0?value:i/11);
const faces=()=>[{vertices:triangle(1),center:[1,0,0]},{vertices:triangle(9),center:[9,0,0]}];

test('60 static frames upload once per VBO, retaining every 11-float vertex attribute',()=>{
 const r=recorder(),vertices=triangle(2);r.batches.update(vertices,faces());
 for(let i=0;i<60;i++){r.batches.drawOpaque();r.batches.drawTransparent([0,0,0]);}
 assert.equal(r.uploads.length,2);assert.equal(r.uploads[0].usage,r.gl.STATIC_DRAW);
 assert.deepEqual(r.uploads[0].data,Array.from(new Float32Array(vertices)));
 assert.equal(r.draws.length,120);assert.equal(r.draws[0].count,3);assert.equal(r.draws[1].count,6);
 assert.deepEqual(r.attributes,r.draws.map(d=>d.buffer));
 const actualBytes=r.uploads.reduce((sum,u)=>sum+u.bytes,0);
 assert.equal(actualBytes,396);
 // Previous drawBatch uploaded both arrays on every frame: identical fixture.
 assert.equal(60*(vertices.length+66)*4,23760);
});

test('translation reorders transparency without reuploading opaque; same eye reuses upload',()=>{
 const r=recorder(),original=faces();r.batches.update(triangle(2),original);
 r.batches.drawTransparent([0,0,0]);assert.equal(r.uploads[1].data[0],9);
 r.batches.drawTransparent([10,0,0]);assert.equal(r.uploads[2].data[0],1);
 r.batches.drawTransparent([10,0,0]);assert.equal(r.uploads.length,3);
 assert.equal(r.uploads.filter(u=>u.usage===r.gl.STATIC_DRAW).length,1);
 assert.equal(original[0].vertices[0],1,'caller face order is not mutated');
});

test('geometry update invalidates both VBOs at the same eye, empty glass never draws stale vertices',()=>{
 const r=recorder();r.batches.update(triangle(2),faces());r.batches.drawTransparent([0,0,0]);
 const changed=faces();changed[1].vertices=triangle(7);
 r.batches.update(triangle(4),changed);r.batches.drawTransparent([0,0,0]);
 assert.equal(r.uploads.length,4);assert.equal(r.uploads[2].data[0],4);assert.equal(r.uploads[3].data[0],7);
 r.batches.update([],[]);const count=r.draws.length;r.batches.drawOpaque();r.batches.drawTransparent([0,0,0]);
 assert.equal(r.draws.length,count);r.batches.dispose();assert.deepEqual(r.deleted,[1,2]);
});

test('emphasis includes shared pattern contributors and is reversible without source mutation',()=>{
 const item=Object.freeze({color:'#808080',pattern:1,patterns:Object.freeze([1,2])});
 const base=emphasizedColor(item,2,false),cyan=emphasizedColor(item,'2',true);
 assert.ok(cyan[2]-cyan[0]>.08,'neutral material receives a visible cool tint');assert.ok(Math.max(...cyan)-Math.min(...cyan)<.2,'highlight stays muted');
 assert.deepEqual(emphasizedColor(item,1,true),cyan);
 assert.deepEqual(emphasizedColor(item,3,true),base);
 assert.deepEqual(emphasizedColor(item,null,true),base);
 assert.deepEqual(emphasizedColor(item,2,false),base);assert.equal(item.color,'#808080');
 assert.ok(emphasizedColor({color:'#f1ebe0',pattern:2},2,true)[0]-emphasizedColor({color:'#34464e',pattern:2},2,true)[0]>.3,'light and dark material differences survive highlighting');
 for(const color of ['#f1ebe0','#685343','#34464e']){
  const selected=emphasizedColor({color,pattern:2},2,true);
  assert.ok(Math.max(...selected)-Math.min(...selected)<.25,'highlight avoids saturated replacement colors');
 }
});

import {createWalk} from '../walk.js';
import {buildScene,defaults} from '../model.js';
import {buildWorld} from '../world/index.js';
import {groups} from '../atlas/compose.js';

for(const [name,makeScene]of [['legacy',()=>buildScene(defaults)],['city all patterns',()=>{const g=groups.find(g=>g.key==='city');return buildWorld('city',Array.from({length:g.to-g.from+1},(_,i)=>g.from+i));}]])
test(`${name} renderer integrates cached frames, emphasis, zoom, sunlight and context-loss cleanup`,t=>{
 let id=0,bound=null,target=null,callback=null,currentPose=null,error=null;const uploads=[],deleted=[],events=new Map();
 const gl=new Proxy({FRAMEBUFFER_COMPLETE:1,COMPILE_STATUS:1,LINK_STATUS:1,
  getShaderParameter:()=>true,getProgramParameter:()=>true,getParameter:()=>64,
  getExtension:()=>null,checkFramebufferStatus:()=>1,
  bindFramebuffer:(_,value)=>target=value,bindBuffer:(_,value)=>bound=value,
  bufferData:(_,data)=>uploads.push({buffer:bound,target,bytes:data.byteLength,data:Array.from(data)}),
  deleteBuffer:value=>deleted.push(value)}, {get:(object,key)=>key in object?object[key]:String(key).startsWith('create')?()=>++id:String(key).toUpperCase()===key?key:()=>{}});
 const listener={addEventListener(){},removeEventListener(){}};
 const canvas={...listener,dataset:{},clientWidth:800,clientHeight:600,getContext:()=>gl,
  addEventListener:(name,fn)=>events.set(name,fn),removeEventListener:name=>events.delete(name)};
 for(const [key,value]of Object.entries({window:listener,document:{...listener,hidden:false,activeElement:canvas,querySelector:()=>null},devicePixelRatio:1,
  requestAnimationFrame:fn=>{callback=fn;return 1;},cancelAnimationFrame:()=>{callback=null;}})){
  const descriptor=Object.getOwnPropertyDescriptor(globalThis,key);Object.defineProperty(globalThis,key,{configurable:true,writable:true,value});
  t.after(()=>descriptor?Object.defineProperty(globalThis,key,descriptor):delete globalThis[key]);
 }
 const walk=createWalk(canvas,message=>error=message,pose=>currentPose={...pose});
 const scene=makeScene(),source=JSON.stringify(scene),emphasis=scene.boxes.find(b=>b.pattern&&b.kind!=='window').pattern;walk.update(scene,{freeMode:true});
 assert.equal(uploads.length,2,'initial opaque and shadow uploads');
 const initialOpaque=uploads[0].data;
 walk.start();const now=performance.now();callback(now+100);
 const count=uploads.length;for(let i=0;i<59;i++)callback(now+110+i);
 assert.equal(uploads.length,count,'real renderer performs no repeated stationary uploads');
 walk.setLighting(scene.state.sun||defaults.sun);callback(now+300);assert.equal(uploads.length,count,'identical sun settings do not invalidate shadows');
 const display=uploads.filter(u=>u.target==null),bytes=display.reduce((sum,u)=>sum+u.bytes,0);
 t.diagnostic(`${name}: 60 stationary frames color pass ${display.length} uploads / ${bytes} bytes; previous per-frame algorithm ${display.length*60} uploads / ${bytes*60} bytes. Shadow excluded.`);
 walk.setEmphasis(emphasis,true);assert.equal(uploads.length,count+1);assert.equal(uploads.at(-1).target,null,'emphasis does not render/upload shadow');
 assert.notDeepEqual(uploads.at(-1).data,initialOpaque);
 walk.setEmphasis(emphasis,true);assert.equal(uploads.length,count+1,'identical emphasis is a no-op');
 walk.setEmphasis(emphasis,false);assert.deepEqual(uploads.at(-1).data,initialOpaque);
 assert.equal(JSON.stringify(scene),source,'geometry, collision, lights and colors stay unchanged');
 const before={...currentPose};walk.zoom(1);
 assert.ok(Math.hypot(currentPose.x-before.x,currentPose.y-before.y,currentPose.z-before.z)>0);
 const fullDistance=Math.hypot(currentPose.x-before.x,currentPose.y-before.y,currentPose.z-before.z);
 walk.zoom(-1);assert.ok(Math.abs(currentPose.x-before.x)<1e-9);
 walk.zoom(.1);assert.ok(Math.abs(Math.hypot(currentPose.x-before.x,currentPose.y-before.y,currentPose.z-before.z)-fullDistance*.1)<1e-8);walk.zoom(-.1);
 walk.update(scene,{freeMode:false});const person={...currentPose};walk.zoom(1);assert.deepEqual(currentPose,person);
 walk.update(scene,{freeMode:true,emphasis:{id:emphasis,enabled:true}});const preparedCount=uploads.length;walk.setEmphasis(emphasis,true);assert.equal(uploads.length,preparedCount,'initial emphasis is prepared without a second geometry upload');
 const shadowCount=uploads.filter(u=>u.target!=null).length;
 walk.setLighting({...defaults.sun,azimuth:90});callback(performance.now()+1000);
 assert.equal(uploads.filter(u=>u.target!=null).length,shadowCount+1,'sun change still updates shadow');
 events.get('webglcontextlost')({preventDefault(){}});assert.ok(error);assert.equal(callback,null);
 walk.dispose();assert.equal(new Set(deleted).size,3,'both display VBOs and sunlight VBO are released');assert.equal(events.size,0);
});
