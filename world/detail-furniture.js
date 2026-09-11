export function chairFacing(w,x,y,id,variant,turn){
 const start=w.boxes.length;w.chair(x,y,id,variant);
 if(!turn)return;
 const cx=x+.25,cy=y+.25;
 for(const b of w.boxes.slice(start)){
  const pts=[[b.x,b.y],[b.x+b.dx,b.y],[b.x+b.dx,b.y+b.dy],[b.x,b.y+b.dy]].map(([xx,yy])=>{
   const a=xx-cx,c=yy-cy;return turn===1?[cx-c,cy+a]:turn===2?[cx-a,cy-c]:[cx+c,cy-a];
  });const xs=pts.map(v=>v[0]),ys=pts.map(v=>v[1]);b.x=Math.min(...xs);b.y=Math.min(...ys);b.dx=Math.max(...xs)-b.x;b.dy=Math.max(...ys)-b.y;
 }
}
