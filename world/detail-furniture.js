export function chairFacing(w,x,y,id,variant,turn){
 const start=w.boxes.length;w.chair(x,y,id,variant);
 if(!turn)return;
 const cx=x+(variant===1?.65:.45)/2,cy=y+.48/2;
 for(const b of w.boxes.slice(start)){
  const pts=[[b.x,b.y],[b.x+b.dx,b.y],[b.x+b.dx,b.y+b.dy],[b.x,b.y+b.dy]].map(([xx,yy])=>{
   const a=xx-cx,c=yy-cy;return turn===1?[cx-c,cy+a]:turn===2?[cx-a,cy-c]:[cx+c,cy-a];
  });const xs=pts.map(v=>v[0]),ys=pts.map(v=>v[1]);b.x=Math.min(...xs);b.y=Math.min(...ys);b.dx=Math.max(...xs)-b.x;b.dy=Math.max(...ys)-b.y;
 }
}

// A material choice replaces a region of the shared finish, rather than adding
// another coplanar layer. The replacement retains both contributing patterns.
export function partitionFloorFinish(w,baseId,finishId){
 const finishes=w.boxes.filter(b=>b.pattern===finishId&&['floor','soft-floor','material-threshold'].includes(b.kind));
 if(!finishes.length)return;
 w.boxes=w.boxes.flatMap(b=>{
  if(b.pattern!==baseId||b.kind!=='floor')return [b];
  let pieces=[b];
  for(const f of finishes){
   let replaced=false;
   pieces=pieces.flatMap(r=>{
    const x=Math.max(r.x,f.x),y=Math.max(r.y,f.y),right=Math.min(r.x+r.dx,f.x+f.dx),bottom=Math.min(r.y+r.dy,f.y+f.dy);
    if(right<=x||bottom<=y)return [r];
    replaced=true;
    return [[r.x,r.y,x-r.x,r.dy],[right,r.y,r.x+r.dx-right,r.dy],[x,r.y,right-x,y-r.y],[x,bottom,right-x,r.y+r.dy-bottom]].filter(v=>v[2]>1e-9&&v[3]>1e-9).map(([x,y,dx,dy])=>({...r,x,y,dx,dy}));
   });
   if(replaced)f.patterns=[...new Set([...(f.patterns??[f.pattern]),baseId])];
  }
  return pieces;
 });
}
