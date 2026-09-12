// Resolve axis-aligned, same-facing coplanar box surfaces before GPU upload.
// Authored geometry/collisions remain unchanged. Later finish layers supply color;
// intersections retain all contributors so selecting either rule identifies them.
const EPS=1e-8;
const owners=item=>[...new Set([item.pattern,...(item.patterns||[])].filter(Boolean))];
const intersection=(a,b)=>{const r={u0:Math.max(a.u0,b.u0),v0:Math.max(a.v0,b.v0),u1:Math.min(a.u1,b.u1),v1:Math.min(a.v1,b.v1)};return r.u1-r.u0>EPS&&r.v1-r.v0>EPS?r:null;};
function subtract(a,r){
 const result=[];
 for(const [u0,v0,u1,v1]of [[a.u0,a.v0,r.u0,a.v1],[r.u1,a.v0,a.u1,a.v1],[r.u0,a.v0,r.u1,r.v0],[r.u0,r.v1,r.u1,a.v1]])if(u1-u0>EPS&&v1-v0>EPS)result.push({...a,u0,v0,u1,v1});
 return result;
}
function corners(face){
 const axes=[0,1,2].filter(i=>i!==face.axis),points=[[face.u0,face.v0],[face.u1,face.v0],[face.u1,face.v1],[face.u0,face.v1]].map(uv=>{const p=[0,0,0];p[face.axis]=face.plane;p[axes[0]]=uv[0];p[axes[1]]=uv[1];return p;});
 // The renderer swaps world Y/Z, reversing orientation; its front face must
 // agree with the supplied outward normal after that conversion.
 const natural=face.axis===1?-1:1;
 return natural===face.sign?points.reverse():points;
}
export function resolveBoxSurfaces(boxes){
 const groups=new Map(),transparent=[];
 for(const item of boxes){
  if(item.collisionOnly)continue;
  const pos=[item.x,item.y,item.z],size=[item.dx,item.dy,item.dz];
  for(let axis=0;axis<3;axis++)for(const sign of [-1,1]){
   const axes=[0,1,2].filter(i=>i!==axis),plane=pos[axis]+(sign>0?size[axis]:0);
   const face={axis,sign,plane,u0:pos[axes[0]],v0:pos[axes[1]],u1:pos[axes[0]]+size[axes[0]],v1:pos[axes[1]]+size[axes[1]],item};
   if(item.kind==='window'){transparent.push(face);continue;}
   const key=axis+':'+sign+':'+Math.round(plane/EPS),prior=groups.get(key)||[];
   let pending=[face];const retained=[];
   for(const previous of prior){
    const overlap=intersection(previous,face);
    if(!overlap){retained.push(previous);continue;}
    retained.push(...subtract(previous,overlap));
    const merged={...item,patterns:[...new Set([...owners(previous.item),...owners(item)])]};
    retained.push({...face,...overlap,item:merged});
    pending=pending.flatMap(piece=>{const hit=intersection(piece,previous);return hit?subtract(piece,hit):[piece];});
   }
   groups.set(key,[...retained,...pending]);
  }
 }
 return [...groups.values()].flat().concat(transparent).map(face=>({...face,points:corners(face),normal:[0,1,2].map(i=>i===face.axis?face.sign:0)}));
}
