import {composeLocal,composeInstitution} from './territory-shared.js?v=8207f127fbc7';
import {composeTerritory} from './territory-composition.js?v=8207f127fbc7';
import {World,palette as P} from './primitives.js?v=8207f127fbc7';
import {buildUrbanPattern} from './territory-urban.js?v=8207f127fbc7';
import {buildLocalPattern} from './territory-local.js?v=8207f127fbc7';
import {buildInstitutionPattern} from './territory-institution.js?v=8207f127fbc7';
const ranges={region:[1,7],city:[8,29],neighborhood:[30,74],institution:[75,94]};
// Public facilities occupy stable sites; residential, mobility and workgroup
// modifiers act on shared domains through the composition modules.
export function buildTerritory(key,ids=[]){
 if(key==='region'||key==='city')return composeTerritory(key,ids);
 const range=ranges[key];if(!range)throw new Error(`Unknown territory ${key}`);
 const selected=[...new Set(ids)].filter(id=>Number.isInteger(id)&&id>=range[0]&&id<=range[1]).sort((a,b)=>a-b);
 const columns=key==='region'?3:5, pitch=key==='region'?68:32;
 const rows=Math.ceil((range[1]-range[0]+1)/columns),width=columns*pitch,depth=rows*pitch;
 const w=new World(key,width,depth,selected);w.navigation.speed=5;w.navigation.maxHeight=Math.max(width,depth);w.navigation.far=Math.max(width,depth)*5;
 w.state.layout='shared-neighborhood-composition';w.state.patterns={};w.state.limitations=['Spatial concept models, not construction, demographic, accessibility, transport or care standards.','Public facilities share local streets; dwelling, workgroup and mobility patterns interact on common sites. Institutional rights are not simulated.'];
 for(let row=0;row<=rows;row++)w.path([[0,row*pitch],[width,row*pitch]],4,0);
 for(let col=0;col<columns;col++)w.path([[col*pitch,0],[col*pitch,depth+5]],3,0);
 w.spawn={x:pitch/2,y:depth+4,yaw:0,pitch:0,feet:0};
 const overridden=key==='neighborhood'?composeLocal(w,selected):composeInstitution(w,selected);
 for(const id of selected){if(overridden.has(id))continue;const n=id-range[0],x=(n%columns)*pitch+2,y=Math.floor(n/columns)*pitch+2;
  // Facility coordinates preserve the surrounding shared street.
  const ctx={w,id,x,y,s: pitch-4};
  if(id<=29)buildUrbanPattern(ctx);else if(id<=74)buildLocalPattern(ctx);else buildInstitutionPattern(ctx);
  w.marker(id,x+2,y+pitch-7,`#${id}`);
  w.state.patterns[id]={parcel:[x,y,pitch-4,pitch-4],geometry:true};
 }
 if(selected.length){
  const first=w.state.patterns[selected[0]].parcel??(key==='institution'?[2,2,pitch-4,pitch-4]:[66,34,pitch-4,pitch-4]);
  w.spawn={x:first[0]+pitch/2-2,y:first[1]+pitch-1,yaw:0,pitch:0,feet:0};
  if(selected.length===1)w.overview={x:first[0]+pitch*1.15,y:first[1]+pitch*1.3,z:pitch*.7,yaw:-.6,pitch:-.6};
 }
 return w.finish();
}
export function kit({w,id,x,y,s}){
 const box=(a,b,z,dx,dy,dz,c=P.wall,kind='solid')=>w.box(x+a,y+b,z,dx,dy,dz,c,id,kind);
 const path=(points,width=1.5,color=P.stone,z=.02)=>w.path(points.map(([a,b])=>[x+a,y+b]),width,id,color,z);
 const room=(a,b,dx=8,dy=6,opts={})=>w.room(x+a,y+b,dx,dy,id,opts);
 const house=(a,b,dx=6,dy=5,floors=1)=>w.house(x+a,y+b,dx,dy,id,{floors});
 const tree=(a,b,size=1)=>w.tree(x+a,y+b,id,size);
 const bench=(a,b,width=1.5)=>w.bench(x+a,y+b,id,width);
 const table=(a,b,width=1.6)=>w.table(x+a,y+b,id,width);
 const pergola=(a,b,dx=6,dy=4)=>w.pergola(x+a,y+b,dx,dy,id);
 const slab=(a,b,dx,dy,color=P.stone,z=0)=>w.slab(x+a,y+b,dx,dy,id,color,z);
 const gate=(a,b,width=4,h=3)=>{box(a,b,0,.3,.3,h,P.wood,'gateway');box(a+width,b,0,.3,.3,h,P.wood,'gateway');box(a,b,h,width+.3,.3,.3,P.wood,'gateway');};
 const station=(a,b)=>{pergola(a,b,5,3);bench(a+.5,b+.5,3);box(a+4.5,b,0,.15,.15,2.4,P.metal,'stop');};
 const garden=(a,b,dx=8,dy=7)=>{slab(a,b,dx,dy,P.ground);tree(a+1,b+1);tree(a+dx-1,b+1);bench(a+1,b+dy-1);};
 return {w,id,x,y,s,box,path,room,house,tree,bench,table,pergola,slab,gate,station,garden};
}
