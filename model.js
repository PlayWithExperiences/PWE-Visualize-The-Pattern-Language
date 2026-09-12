import {patterns} from './data/patterns.js?v=a8cc37458ddd';
import {normalizeSun,defaultSun} from './sun.js?v=a8cc37458ddd';
export const allowed = patterns.map(p=>p.id);
export const defaults = {ids:[105,106,112,115,163,171,180],width:12,depth:10,court:4,seat:0.65,sun:defaultSun};
const clamp=(n,a,b,f)=>Number.isFinite(Number(n))?Math.min(b,Math.max(a,Number(n))):f;
export function normalize(raw={}) {
 return {ids:[...new Set((Array.isArray(raw.ids)?raw.ids:defaults.ids).filter(id=>allowed.includes(id)))].sort((a,b)=>a-b),width:clamp(raw.width,10,16,12),depth:clamp(raw.depth,9,14,10),court:clamp(raw.court,3,5,4),seat:clamp(raw.seat,.45,1,.65),sun:normalizeSun(raw.sun)};
}
export function encode(state){const normalized=normalize(state);normalized.sun.playing=false;return '#v1='+encodeURIComponent(JSON.stringify(normalized));}
export function decode(hash){
 if(!hash) return {state:normalize(defaults),error:null};
 try {if(!hash.startsWith('#v1='))throw Error();const v=JSON.parse(decodeURIComponent(hash.slice(4)));if(!v||typeof v!=='object'||Array.isArray(v)||!Array.isArray(v.ids))throw Error();return {state:normalize(v),error:null};}
 catch{return {state:normalize(defaults),error:'分享链接无法解析，已加载初始方案。'};}
}
export function buildScene(raw){
 const state=normalize(raw), has=id=>state.ids.includes(id), {width:w,depth:d,court:c,seat}=state;
 const courtyard=has(115), south=has(105), ySign=south?1:-1;
 const boxes=[], labels=[];
 const box=(x,y,z,dx,dy,dz,color,pattern=0,kind='solid')=>boxes.push({x,y,z,dx,dy,dz,color,pattern:pattern||(has(250)&&['wall','floor'].includes(kind)?250:0),kind});
 // The internal coordinates use the south-facing version; mirroring moves the garden north.
 const add=(x,y,z,dx,dy,dz,color,p=0,k='solid')=>box(x,south?y:d-y-dy,z,dx,dy,dz,color,p,k);
 const mark=(x,y,z,text,p=0)=>labels.push({x,y:south?y:d-y,z,text,pattern:p});
 const stone=has(250)?'#e8d4b6':'#eee9dc', wall=has(250)?'#efcda7':'#f7f3e9', wood='#b88b60', green='#789080';
 const sill=has(222)?.35:.7,glazingBase=.15+sill,glazingHeight=2.4-glazingBase;
 add(-2,-2,-.2,w+4,d+8,.16,'#dfdfce',0,'ground');
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
  add(x+jamb,y,.15,opening,.18,sill,wall,has(222)?222:p,'wall'); add(x+jamb,y,2.4,opening,.18,.4,wall,p,'wall');
  add(x+jamb,y,glazingBase,opening,.09,glazingHeight,'#a6c4c0',has(222)?222:p,'window');
 }
 function vertical(x,y,len,p=0){
  if(has(159)&&len>2&&p!==115){
   add(x,y,.15,.18,.65,2.65,wall,159,'wall');add(x,y+len-.65,.15,.18,.65,2.65,wall,159,'wall');
   add(x,y+.65,.15,.18,len-1.3,sill,wall,has(222)?222:159,'wall');add(x,y+.65,2.4,.18,len-1.3,.4,wall,159,'wall');
   add(x,y+.65,glazingBase,.09,len-1.3,glazingHeight,'#a6c4c0',has(222)?222:159,'window');
  }else add(x,y,.15,.18,len,2.65,wall,p,'wall');
 }
 horizontal(0,0,w); vertical(0,0,houseD);vertical(w-.18,0,courtyard?d-c:houseD);
 if(courtyard){horizontal(gx,d-c,c,115);vertical(gx-.18,d-c,c,115);}
 const frontLen=w-c;
 horizontal(0,houseD-.18,Math.max(1.8,frontLen-1.35));
 add(frontLen-.3,houseD-.18,.15,.3,.18,2.65,wall,0,'wall');
 add(frontLen-1.35,houseD-.18,2.4,1.05,.18,.4,wall,0,'wall');
 if(!courtyard)horizontal(frontLen,houseD-.18,w-frontLen);
 if(courtyard) { // Replace a section of the courtyard sill with a traversable opening.
  // A separate open portal at the end of the west wing connects daily circulation to the court.
  const index=boxes.findIndex(b=>b.x===gx-.18&&b.pattern===115&&b.kind==='wall');
  if(index>=0){boxes.splice(index,1);add(gx-.18,d-c,.15,.18,c-1.3,2.65,wall,115,'wall');add(gx-.18,d-1.3,2.4,.18,1.3,.4,wall,115,'wall');}
 }
 function chair(x,y,side,variant,p){
  const wide=side==='n'?1:.65,deep=variant===2?.55:side==='n'?.65:1;
  const seatHeight=variant===2?.32:.46;
  for(const xx of [x+.06,x+wide-.13])for(const yy of [y+.06,y+deep-.13])
   add(xx,yy,.15,.07,.07,seatHeight,wood,p,'furniture');
  add(x,y,.15+seatHeight,wide,deep,.09,variant===2?'#a89880':'#dcc8a6',p,'furniture');
  if(variant!==2){
   if(side==='n')add(x,y,.15+seatHeight,wide,.1,.55,wood,p,'furniture');
   else add(side==='w'?x:x+wide-.1,y,.15+seatHeight,.1,deep,.55,wood,p,'furniture');
  }
  if(variant===1){
   add(x,y,.15+seatHeight+.23,.09,deep,.08,wood,p,'furniture');
   add(x+wide-.09,y,.15+seatHeight+.23,.09,deep,.08,wood,p,'furniture');
  }
 }
 if(has(185)){
  add(2.25,2.5,.15,1.1,.85,.42,'#c1b19a',185,'furniture');
  chair(2.2,1.3,'n',0,185);
  chair(1.1,2.35,'w',has(251)?1:0,has(251)?251:185);
  chair(3.8,2.35,'e',has(251)?2:0,has(251)?251:185);
 }else{
  add(1.2,1.4,.15,2.4,.85,.55,wood,0,'furniture');add(1.2,1.4,.7,2.4,.22,.5,'#d8c9af',0,'furniture');
  add(2,3,.15,1.8,.85,.55,'#c1b19a',0,'furniture');
  if(has(251)){chair(4.05,1.65,'e',1,251);chair(4.05,3.15,'e',2,251);}
 }
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
  for(const x of [gx+.4,w-.7])for(const y of [gy+.4,gy+c-1.25])add(x,y,.3,.12,.12,2.6,wood,163,'post');
  for(let i=0;i<9;i++)add(gx+.4,gy+.4+i*(c-1.1)/8,2.9,c-.98,.07,.1,wood,163,'pergola');
  add(gx+1.1,gy+1.1,.3,.85,.85,.65,'#e8dfca',163,'furniture');
  for(const y of [gy+.65,gy+2.1])add(gx+1.25,y,.3,.5,.4,.45,'#e8dfca',163,'furniture');
 }
 if(has(171)){
  add(w+.75,gy+1.2,0,.23,.23,2.3,'#8a7459',171,'trunk');
  add(w+.04,gy+.5,2,1.7,1.7,1.1,'#718875',171,'canopy');add(w+.3,gy+.75,3.1,1.2,1.2,.6,'#899d7d',171,'canopy');
  add(w+.7,gy+2.8,.15,1.1,.48,.5,wood,171,'bench');
 }
 if(has(179)){
  add(.45,houseD-2.8,.15,1.8,.13,1.6,wall,179,'alcove');add(2.12,houseD-2.8,.15,.13,1.65,1.6,wall,179,'alcove');
  add(.55,houseD-2.55,.15,.65,1.25,.5,'#c49a79',179,'furniture');
 }
 if(has(180))add(4.1,.25,.15,2,seat,.5,wood,180,'window-seat');
 if(has(139)){
  add(.4,.3,.15,2.8,.55,.74,'#c8bda9',139,'furniture');
  add(.35,.25,.89,2.9,.65,.08,stone,139,'furniture');
  add(.7,.38,.975,.6,.38,.015,'#647b7a',139,'furniture');
  for(const xx of [2.15,2.52])add(xx,.41,.975,.24,.28,.015,'#535950',139,'furniture');
 }
 if(has(139)||has(147)){
  const id=has(147)?147:139,tableWidth=has(147)?2:1.4,tableDepth=has(147)?1.2:.85;
  for(const xx of [2.65,2.6+tableWidth-.12])for(const yy of [4.85,4.8+tableDepth-.12])
   add(xx,yy,.15,.09,.09,.69,wood,id,'furniture');
  add(2.6,4.8,.84,tableWidth,tableDepth,.08,wood,id,'furniture');
  if(has(147)){
   for(const xx of [2.8,3.95])for(const yy of [4.12,6.3])add(xx,yy,.15,.45,.45,.45,'#d8c9af',147,'furniture');
  }
 }
 if(has(190)){
  add(.32,d-3.05,2.25,2.1,2.75,.12,wood,190,'ceiling-panel');
  mark(1.35,d-1.65,2.42,'低顶阅读角',190);
 }
 if(has(199)){
  add(.4,d-.9,.97,2,.56,.08,stone,199,'furniture');
  for(const xx of [.48,2.23])add(xx,d-.84,.15,.08,.42,.82,wood,199,'furniture');
 }
 if(has(200)){
  for(const yy of [.55,2.55])add(w-.75,yy,.15,.5,.08,2.1,wood,200,'furniture');
  for(let n=0;n<5;n++)add(w-.75,.55,.25+n*.48,.5,2.08,.07,wood,200,'furniture');
 }
 if(has(201)){
  for(const yy of [3.35,4.65])add(.25,yy,.15,.65,.08,.78,wood,201,'furniture');
  add(.25,3.35,.93,.65,1.38,.07,wood,201,'furniture');
  add(.25,3.35,.43,.65,1.38,.07,wood,201,'furniture');
 }
 if(has(242)){
  add(frontLen-3.2,d+.4,.15,1.3,.5,.42,wood,242,'bench');
  add(frontLen-3.2,d+.4,.57,1.3,.1,.5,wood,242,'bench');
 }
 if(has(245)){
  add(gx+.2,gy+c+.68,.02,c-.4,.3,.5,'#bd9274',245,'planter');
  add(gx+.26,gy+c+.71,.53,c-.52,.24,.03,'#685942',245,'soil');
  const flowers=Math.floor((c-.5)/.32);
  for(let n=0;n<flowers;n++){
   const xx=gx+.34+n*.32;
   add(xx,gy+c+.76,.56,.045,.045,.24,'#678265',245,'flower');
   add(xx-.045,gy+c+.715,.8,.14,.14,.1,n%2?'#d6b875':'#c4857a',245,'flower');
  }
 }
 // Window layers are built in world coordinates, so both orientations share one rule.
 for(const window of boxes.filter(b=>b.kind==='window')){
  const {x,y,z,dx,dy,dz}=window,horizontal=dx>dy;
  if(has(223)){
   if(horizontal){
    for(const xx of [x-.1,x+dx])box(xx,y-.14,z-.06,.1,.38,dz+.12,wall,223,'window-trim');
    for(const zz of [z-.06,z+dz])box(x,y-.14,zz,dx,.38,.06,wall,223,'window-trim');
   }else{
    for(const yy of [y-.1,y+dy])box(x-.14,yy,z-.06,.38,.1,dz+.12,wall,223,'window-trim');
    for(const zz of [z-.06,z+dz])box(x-.14,y,zz,.38,dy,.06,wall,223,'window-trim');
   }
  }
  if(has(238)){
   for(let n=1;n<=5;n++){
    const zz=z+dz*n/6;
    if(horizontal)box(x,y-.075,zz,dx,.24,.045,wood,238,'filter');
    else box(x-.075,y,zz,.24,dy,.045,wood,238,'filter');
   }
  }
  if(has(239)){
   const length=horizontal?dx:dy,divisions=Math.ceil(length/1.2);
   for(let n=1;n<divisions;n++){
    if(horizontal)box(x+length*n/divisions,y+.02,z,.045,.06,dz,'#ab9b7f',239,'mullion');
    else box(x+.02,y+length*n/divisions,z,.06,.045,dz,'#ab9b7f',239,'mullion');
   }
   if(horizontal)box(x,y+.02,z+dz/2,dx,.06,.04,'#ab9b7f',239,'mullion');
   else box(x+.02,y,z+dz/2,.06,dy,.04,'#ab9b7f',239,'mullion');
  }
 }

 mark(gx+c/2,gy+c/2,.35,'庭院',115);mark(w/2,-1,.1,south?'北 N':'南 S');
 return {boxes,labels,state,metrics:{indoorArea:Math.round(w*houseD-(courtyard?c*c:0)),courtArea:c*c,selected:state.ids.length},orientation:ySign};
}
