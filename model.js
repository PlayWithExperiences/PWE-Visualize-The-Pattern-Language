import {patterns} from './data/patterns.js';
export const allowed = patterns.map(p=>p.id);
export const defaults = {ids:[105,106,112,115,163,171,180],width:12,depth:10,court:4,seat:0.65};
const clamp=(n,a,b,f)=>Number.isFinite(Number(n))?Math.min(b,Math.max(a,Number(n))):f;
export function normalize(raw={}) {
 return {ids:[...new Set((Array.isArray(raw.ids)?raw.ids:defaults.ids).filter(id=>allowed.includes(id)))].sort((a,b)=>a-b),width:clamp(raw.width,10,16,12),depth:clamp(raw.depth,9,14,10),court:clamp(raw.court,3,5,4),seat:clamp(raw.seat,.45,1,.65)};
}
export function encode(state){return '#v1='+encodeURIComponent(JSON.stringify(normalize(state)));}
export function decode(hash){
 if(!hash) return {state:normalize(defaults),error:null};
 try {if(!hash.startsWith('#v1='))throw Error();const v=JSON.parse(decodeURIComponent(hash.slice(4)));if(!v||typeof v!=='object'||Array.isArray(v)||!Array.isArray(v.ids))throw Error();return {state:normalize(v),error:null};}
 catch{return {state:normalize(defaults),error:'分享链接无法解析，已加载初始方案。'};}
}
export function buildScene(raw){
 const state=normalize(raw), has=id=>state.ids.includes(id), {width:w,depth:d,court:c,seat}=state;
 const courtyard=has(115), south=has(105), ySign=south?1:-1;
 const boxes=[], labels=[];
 const box=(x,y,z,dx,dy,dz,color,pattern=0,kind='solid')=>boxes.push({x,y,z,dx,dy,dz,color,pattern,kind});
 // The internal coordinates use the south-facing version; mirroring moves the garden north.
 const add=(x,y,z,dx,dy,dz,color,p=0,k='solid')=>box(x,south?y:d-y-dy,z,dx,dy,dz,color,p,k);
 const mark=(x,y,z,text,p=0)=>labels.push({x,y:south?y:d-y,z,text,pattern:p});
 const stone='#eee9dc', wall='#f7f3e9', wood='#b88b60', green='#789080';
 add(-2,-2,-.2,w+4,d+7,.16,'#dfdfce',0,'ground');
 const houseD=d;
 if(courtyard){add(0,0,0,w,d-c,.15,stone,0,'floor');add(0,d-c,0,w-c,c,.15,stone,0,'floor');}
 else add(0,0,0,w,houseD,.15,stone,0,'floor');
 if(courtyard)add(w-c,d-c,.01,c,c,.14,'#cbd4b8',115,'garden');
 else add(w-c,d,.01,c,c,.14,'#cbd4b8',105,'garden');
 const gx=w-c, gy=courtyard?d-c:d;
 // Outer shell, segmented windows and entry. No overlaid solid walls behind windows.
 function horizontal(x,y,len,p=0){
  const jamb=.65, opening=Math.max(.5,len-2*jamb);
  add(x,y,.15,jamb,.18,2.65,wall,p,'wall'); add(x+len-jamb,y,.15,jamb,.18,2.65,wall,p,'wall');
  add(x+jamb,y,.15,opening,.18,.7,wall,p,'wall'); add(x+jamb,y,2.4,opening,.18,.4,wall,p,'wall');
  add(x+jamb,y,.85,opening,.09,1.55,'#a6c4c0',p,'window');
 }
 function vertical(x,y,len,p=0){
  if(has(159)&&len>2&&p!==115){
   add(x,y,.15,.18,.65,2.65,wall,159,'wall');add(x,y+len-.65,.15,.18,.65,2.65,wall,159,'wall');
   add(x,y+.65,.15,.18,len-1.3,.7,wall,159,'wall');add(x,y+.65,2.4,.18,len-1.3,.4,wall,159,'wall');
   add(x,y+.65,.85,.09,len-1.3,1.55,'#a6c4c0',159,'window');
  }else add(x,y,.15,.18,len,2.65,wall,p,'wall');
 }
 horizontal(0,0,w); vertical(0,0,houseD);vertical(w-.18,0,courtyard?d-c:houseD);
 if(courtyard){horizontal(gx,d-c,c,115);vertical(gx-.18,d-c,c,115);}
 const frontLen=courtyard?w-c:w;
 horizontal(0,houseD-.18,Math.max(1.8,frontLen-1.35));
 add(frontLen-.3,houseD-.18,.15,.3,.18,2.65,wall,0,'wall');
 add(frontLen-1.35,houseD-.18,2.4,1.05,.18,.4,wall,0,'wall');
 if(courtyard) { // Replace a section of the courtyard sill with a traversable opening.
  // A separate open portal at the end of the west wing connects daily circulation to the court.
  const index=boxes.findIndex(b=>b.x===gx-.18&&b.pattern===115&&b.kind==='wall');
  if(index>=0){boxes.splice(index,1);add(gx-.18,d-c,.15,.18,c-1.3,2.65,wall,115,'wall');add(gx-.18,d-1.3,2.4,.18,1.3,.4,wall,115,'wall');}
 }
 add(1.2,1.4,.15,2.4,.85,.55,wood,0,'furniture'); add(1.2,1.4,.7,2.4,.22,.5,'#d8c9af',0,'furniture');
 add(2,3,.15,1.8,.85,.55,'#c1b19a',0,'furniture');
 add(w-3.3,1.1,.15,2,2,.45,'#c8bda9',0,'furniture');add(w-3.15,1.2,.6,1.7,.55,.12,'#eee9dc',0,'furniture');
 if(has(127)){
  add(w*.53,.2,.15,.16,2.7,2.1,wall,127,'partition');
  if(d-c>4)add(w*.53,4,.15,.16,d-c-4,2.1,wall,127,'partition');
  add(w*.53,2.9,2.05,.16,1.1,.2,wall,127,'partition');
  mark(w*.28,4.9,.22,'共享',127);mark(w-2,3.8,.22,'安静',127);
 }
 if(has(106)){
  add(gx,gy+c+.1,.15,c,.35,.55,green,106,'planter');add(w+.1,gy,.15,.35,c+.45,.55,green,106,'planter');
 }
 if(has(112)){
  add(frontLen-1.5,houseD,.05,1.8,2.3,.12,'#c1b19a',112,'path');add(frontLen-3,houseD+1.7,.05,2.2,.6,.12,'#c1b19a',112,'path');
  for(const x of [frontLen-1.5,frontLen+.15])add(x,houseD+1.2,.17,.12,.12,2.5,wood,112,'post');
  for(let i=0;i<6;i++)add(frontLen-1.5,houseD+i*.24,2.65,1.8,.08,.1,wood,112,'pergola');
 }
 if(has(163)){
  add(gx+.35,gy+.35,.2,c-1.1,c-1.1,.1,wood,163,'deck');
  for(const x of [gx+.4,w-.7])for(const y of [gy+.4,gy+c-.7])add(x,y,.3,.12,.12,2.6,wood,163,'post');
  for(let i=0;i<9;i++)add(gx+.4,gy+.4+i*(c-1.1)/8,2.9,c-.98,.07,.1,wood,163,'pergola');
  add(gx+1.1,gy+1.1,.3,.85,.85,.65,'#e8dfca',163,'furniture');
  for(const y of [gy+.65,gy+2.1])add(gx+1.25,y,.3,.5,.4,.45,'#e8dfca',163,'furniture');
 }
 if(has(171)){
  add(w+.75,gy+1.2,0,.23,.23,2.3,'#8a7459',171,'trunk');
  add(w+.04,gy+.5,2,1.7,1.7,1.1,'#718875',171,'canopy');add(w+.3,gy+.75,3.1,1.2,1.2,.6,'#899d7d',171,'canopy');
  add(w+.7,gy+2.8,.15,1.5,.48,.5,wood,171,'bench');
 }
 if(has(179)){
  add(.45,houseD-2.8,.15,1.8,.13,1.6,wall,179,'alcove');add(2.12,houseD-2.8,.15,.13,1.65,1.6,wall,179,'alcove');
  add(.55,houseD-2.55,.15,.65,1.25,.5,'#c49a79',179,'furniture');
 }
 if(has(180))add(4.1,.25,.15,2,seat,.5,wood,180,'window-seat');
 mark(gx+c/2,gy+c/2,.35,'庭院',115);mark(w/2,-1,.1,south?'北 N':'南 S');
 return {boxes,labels,state,metrics:{indoorArea:Math.round(w*houseD-(courtyard?c*c:0)),courtArea:c*c,selected:state.ids.length},orientation:ySign};
}
