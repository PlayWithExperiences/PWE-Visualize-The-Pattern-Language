import {palette as p} from './primitives.js?v=a08df7453e28';
// Shared geometry carries every contributing pattern, without duplicating furniture.
export function share(w,ids,start=0,meshStart=0){const active=ids.filter(id=>w.has(id));for(const b of [...w.boxes.slice(start),...w.meshes.slice(meshStart)])b.patterns=[...new Set([b.pattern,...active].filter(Boolean))];for(const id of active)w.applied.add(id);}
export function note(w,id,x,y,label,observation){if(!w.has(id))return;w.marker(id,x,y,label);(w.state.observations??=[]).push({id,at:[x,y],observation,scope:'可漫游的空间概念；非日照、结构、消防或社会效果验证'});}
export function portal(w,x,y,width,id,height=2.8){const gap=1.4,side=(width-gap)/2;w.wall(x,y,side,.16,height,id);w.wall(x+side+gap,y,side,.16,height,id);w.wall(x+side,y,gap,.16,height-2.15,id,2.27);}
export function eastWindow(w,x,y,length,id,z=.12,height=2.8){w.wall(x,y,.2,.35,height,id,z);w.wall(x,y+length-.35,.2,.35,height,id,z);w.wall(x,y+.35,.2,length-.7,.8,id,z);w.wall(x,y+.35,.2,length-.7,.4,id,z+height-.4);w.box(x+.08,y+.35,z+.8,.035,length-.7,height-1.2,p.glass,id,'window');}
export function counter(w,x,y,id,width=2){w.box(x,y,0,width,.65,.84,p.wood,id,'cabinet');w.box(x-.03,y-.03,.84,width+.06,.71,.06,p.stone,id,'worktop');}
export function rail(w,x,y,width,id,z=0){w.box(x,y,z+.95,width,.09,.08,p.wood,id,'rail');for(let xx=x;xx<x+width;xx+=.75)w.box(xx,y,z,.06,.06,.95,p.wood,id,'post');}
export function bookcase(w,x,y,id,width=1.4){for(const zz of [.1,.65,1.2,1.75])w.box(x,y,zz,width,.3,.06,p.wood,id,'shelf');for(const xx of [x,x+width-.06])w.box(xx,y,0,.06,.3,1.8,p.wood,id,'shelf');for(let n=0;n<7;n++)w.box(x+.12+n*.16,y+.03,.72,.1,.22,.35,n%2?p.warm:p.metal,id,'book');}
export function car(w,x,y,id){w.box(x,y,.25,1.7,3.6,.65,p.metal,id,'car');w.box(x+.15,y+.9,.9,1.4,1.8,.65,p.glass,id,'car');}
export function finishBuilding(w){
 // Only selected patterns are reported. A jointly created object keeps all contributors.
 for(const b of [...w.boxes,...w.meshes]){const active=(b.patterns??[b.pattern]).filter(id=>w.has(id));b.patterns=active;if(!w.has(b.pattern))b.pattern=active[0]??0;}
 w.applied=new Set([...w.applied].filter(id=>w.has(id)));
 return w.finish();
}
