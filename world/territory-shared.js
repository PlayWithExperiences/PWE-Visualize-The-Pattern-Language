import {palette as P} from './primitives.js?v=3534622f64ec';
import {buildLocalPattern} from './territory-local.js?v=3534622f64ec';
import {buildInstitutionPattern} from './territory-institution.js?v=3534622f64ec';
const localModifiers=new Set([30,31,49,50,52,53,54,60,67,68]);
const institutionModifiers=new Set([75,76,77,78,79,80,82,83]);
function base(w,builder,id,x,y){const b=w.boxes.length,m=w.meshes.length;builder({w,id,x,y,s:28});for(const v of w.boxes.slice(b))v.pattern=0;for(const v of w.meshes.slice(m))v.pattern=0;w.applied.delete(id);}
export function composeLocal(w,ids){
 const has=id=>ids.includes(id),overridden=new Set(ids.filter(id=>localModifiers.has(id)));
 const active=ids.filter(id=>[37,38,39].includes(id));
 const groups=(active.length?active:[37]).map(id=>({id,x:66+(id-37)*32,y:34}));
 // A modifier always has an actual dwelling group to modify, even when viewed alone.
 if(!active.length&&overridden.size)base(w,buildLocalPattern,37,66,34);
 w.state.residentialGroups=groups;w.state.sharedResidentialBounds={x:62,y:30,width:96,depth:40};
 if(has(30)){w.slab(98,66,12,9,30);w.pergola(98,66,4,3,30);w.bench(103,67,30,4);w.path([[104,75],[104,62]],2,30);}
 if(has(53)){for(const x of [109,115])w.box(x,77,0,.25,.25,3.1,P.wood,53,'gateway');w.box(109,77,3.1,6.25,.25,.25,P.wood,53,'gateway');w.path([[112,82],[112,62]],2.4,53);}
 if(has(31)){const path=[[62,62],[158,62]];w.path(path,3,31);for(const g of groups){w.path([[g.x+5,g.y+26],[g.x+5,62]],1.6,31);w.bench(g.x+10,57,31,3);}w.state.promenade={points:path,serves:groups.map(g=>g.id)};}
 if(has(49)||has(50)){
  const loop=has(50)?[[[62,30],[62,64]],[[62,64],[158,64]]]:[[[62,30],[62,64],[158,64],[158,30]],[[158,30],[146,30]]];
  for(const points of loop)w.path(points,3,has(50)?50:49,P.metal);
  if(has(49)&&has(50))w.path([[62,64],[50,64]],3,49,P.metal);
  w.state.residentialRoads={topology:has(50)?'T-access':'local-loop',paths:loop};
 }
 if(has(52)){const paths=[[[96,22],[96,83]],[[128,22],[128,83]],[[62,61],[158,61]]];for(const p of paths)w.path(p,1.8,52,P.warm);w.state.secondaryWalks=paths;}
 if(has(54)){w.slab(94,61,4,6,54,P.stone,.12);w.box(93.5,63,0,.25,.25,.8,P.stone,54,'crossing-bollard');w.box(98.2,63,0,.25,.25,.8,P.stone,54,'crossing-bollard');w.state.crossing={x:96,y:64,road:'residential-access',walk:52};}
 if(has(60))for(const g of groups){w.slab(g.x+1,24,8,5,60,P.ground);w.tree(g.x+2,25,60);w.bench(g.x+3,28,60);w.path([[g.x+8,29],[g.x+12,29],[g.x+12,61]],1.2,60);}
 if(has(67))for(const g of groups){w.slab(g.x+10,g.y+8,8,17,67,P.ground);w.bench(g.x+11,g.y+9,67,4);w.path([[g.x+14,g.y+25],[g.x+14,62]],1.8,67);}
 if(has(68)){const points=[[62,60],[158,60]];w.path(points,2,68,P.warm);for(const g of groups){w.path([[g.x+14,g.y+14],[g.x+14,60]],1.4,68,P.warm);w.box(g.x+10,g.y+16,0,1.2,1.2,.35,P.wood,68,'shared-play-material');}w.state.childrenRoute={points,serves:groups.map(g=>g.id),sharesCommons:has(67)};}
 for(const id of overridden){w.marker(id,id===30?104:id===53?112:62,id===30?72:id===53?80:62+(id%4)*2,`#${id}`);w.state.patterns[id]={geometry:true,relation:'shared residential groups',groups:groups.map(g=>g.id)};}
 return overridden;
}
export function composeInstitution(w,ids){
 const has=id=>ids.includes(id),overridden=new Set(ids.filter(id=>institutionModifiers.has(id)));
 const homeIds=ids.filter(id=>id>=75&&id<=78),homeId=homeIds[0]??76;
 const home={id:homeId,x:2,y:2,width:28,depth:28};
 if(homeIds.length)buildInstitutionPattern({w,id:homeId,x:home.x,y:home.y,s:28});
 else if(has(79))base(w,buildInstitutionPattern,homeId,home.x,home.y);
 // Alternative household types are intentionally mutually exclusive on the same site.
 for(const id of homeIds.slice(1)){overridden.delete(id);}
 if(has(79)){
  // Adaptation and stewardship touch the occupied home's southern edge.
  w.pergola(home.x+1,home.y+27,9,4,79);w.box(home.x+2,home.y+28,0,4,1,.85,P.wood,79,'resident-repair-bench');
  for(const x of [home.x+18,home.x+22])w.planter(x,home.y+27,3,2,79);
  w.path([[home.x+5,home.y+25],[home.x+5,home.y+33]],1.6,79);w.state.residentControl={homeId,homeOrigin:[home.x,home.y],boundaryY:home.y+27};
 }
 w.state.household=home;
 if(ids.some(id=>[80,82,83].includes(id))){
  const units=has(82)?[{name:'A',x:66,y:4},{name:'B',x:80,y:4},{name:'C',x:66,y:24}]:[{name:'A',x:66,y:4},{name:'B',x:100,y:4},{name:'C',x:66,y:24}];
  const owner=has(80)?80:has(82)?82:83;
  for(const u of units){w.room(u.x,u.y,10,8,owner,{sideDoor:true});w.table(u.x+1,u.y+2,owner,2.5);if(has(83)){w.table(u.x+1,u.y+5,83,2.5);w.chair(u.x+1,u.y+3,83);w.chair(u.x+2.5,u.y+3,83);w.box(u.x+6,u.y+2,0,2,1,.9,P.wood,83,'shared-apprenticeship-tool');}}
  const [a,b,c]=units;w.path([[a.x+5,15],[b.x+5,15]],2,has(82)?82:owner);w.path([[a.x+5,15],[c.x+5,23]],2,owner);
  if(has(82))w.pergola(a.x+10,6,4,4,82);
  w.state.workUnits=units;w.state.contactDistances={AB:b.x-a.x,AC:c.y-a.y};
 }
 for(const id of overridden){w.marker(id,id<80?16:80,id<80?34:36,`#${id}`);w.state.patterns[id]={geometry:true,relation:id<80?'shared household and controllable edge':'shared autonomous workgroups'};}
 return overridden;
}
