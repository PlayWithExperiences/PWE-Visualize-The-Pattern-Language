import {floorHeight} from '../walk-physics.js';
// Authored path centrelines are tested with a 0.6 m clear corridor. This is
// traversal evidence, not an accessibility/vehicle turning compliance claim.
export function segmentBoxDistanceSquared(a,b,box){
 const lo=[box.x,box.y],hi=[box.x+box.dx,box.y+box.dy],d=[b[0]-a[0],b[1]-a[1]];
 let enter=0,leave=1,intersects=true;
 for(let i=0;i<2;i++){
  if(Math.abs(d[i])<1e-12){if(a[i]<lo[i]||a[i]>hi[i])intersects=false;}
  else{const t1=(lo[i]-a[i])/d[i],t2=(hi[i]-a[i])/d[i];enter=Math.max(enter,Math.min(t1,t2));leave=Math.min(leave,Math.max(t1,t2));}
 }
 if(intersects&&enter<=leave)return 0;
 const pointRect=p=>p.reduce((sum,v,i)=>sum+(v-Math.max(lo[i],Math.min(v,hi[i])))**2,0),length=d[0]**2+d[1]**2;
 let best=Math.min(pointRect(a),pointRect(b));
 for(const x of [lo[0],hi[0]])for(const y of [lo[1],hi[1]]){const t=length?Math.max(0,Math.min(1,((x-a[0])*d[0]+(y-a[1])*d[1])/length)):0;best=Math.min(best,(x-a[0]-d[0]*t)**2+(y-a[1]-d[1]*t)**2);}
 return best;
}
export function auditRoutes(scene,{radius=.3,step=.2}={}){
 const walkable=new Set(['ground','floor','garden','path','deck','step']),issues=[];
 const floors=scene.boxes.filter(b=>walkable.has(b.kind)),ground=scene.boxes.find(b=>b.kind==='ground');
 for(const [routeIndex,route]of (scene.routes||[]).entries()){
  const hits=new Map();let feet=Math.max(0,route.z||0);
  for(let i=1;i<route.points.length;i++){
   const a=route.points[i-1],b=route.points[i],length=Math.hypot(b[0]-a[0],b[1]-a[1]),steps=Math.max(1,Math.ceil(length/step));
   const candidates=scene.boxes.map((box,index)=>[index,box]).filter(([,box])=>box.x+box.dx>=Math.min(a[0],b[0])-radius&&box.x<=Math.max(a[0],b[0])+radius&&box.y+box.dy>=Math.min(a[1],b[1])-radius&&box.y<=Math.max(a[1],b[1])+radius);
   let previous=[a[0],a[1]];
   for(let n=0;n<=steps;n++){
    const t=n/steps,x=a[0]+(b[0]-a[0])*t,y=a[1]+(b[1]-a[1])*t;feet=floorHeight(floors,x,y,feet);
    if(ground&&(x<ground.x+radius||x>ground.x+ground.dx-radius||y<ground.y+radius||y>ground.y+ground.dy-radius)&&!hits.has(-1))hits.set(-1,{routeIndex,pattern:route.pattern,blocker:0,kind:'outside-ground',boxIndex:-1,point:[x,y,feet]});
    for(const [boxIndex,box]of candidates){
     if(box.collision===false||(walkable.has(box.kind)&&(box.z+box.dz<=feet+.3||box.z>=feet+1.8))||box.z>=feet+1.8||box.z+box.dz<=feet+.25)continue;
     if(segmentBoxDistanceSquared(previous,[x,y],box)<radius*radius-1e-12&&!hits.has(boxIndex))hits.set(boxIndex,{routeIndex,pattern:route.pattern,blocker:box.pattern,kind:box.kind,boxIndex,point:[x,y,feet]});
    }
    previous=[x,y];
   }
  }
  issues.push(...hits.values());
 }
 return issues;
}
