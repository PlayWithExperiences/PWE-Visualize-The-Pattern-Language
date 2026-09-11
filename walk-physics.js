// All units are metres. Model coordinates: x/y on the ground, z up.
export const EYE_HEIGHT = 1.65;
export const BODY_RADIUS = .2;
const walkable = new Set(['ground', 'floor', 'garden', 'path', 'deck']);
export function floorHeight(boxes,x,y) {
 return Math.max(-.04,...boxes.filter(b=>walkable.has(b.kind)&&x>=b.x&&x<=b.x+b.dx&&y>=b.y&&y<=b.y+b.dy).map(b=>b.z+b.dz));
}
export function canStand(boxes,x,y) {
 const base=boxes.find(b=>b.kind==='ground');
 if(!base||x<base.x+BODY_RADIUS||x>base.x+base.dx-BODY_RADIUS||y<base.y+BODY_RADIUS||y>base.y+base.dy-BODY_RADIUS)return false;
 const feet=floorHeight(boxes,x,y);
 return !boxes.some(b=>{
  if(walkable.has(b.kind)||b.z>=feet+1.8||b.z+b.dz<=feet+.25)return false;
  const closestX=Math.max(b.x,Math.min(x,b.x+b.dx));
  const closestY=Math.max(b.y,Math.min(y,b.y+b.dy));
  return (x-closestX)**2+(y-closestY)**2<BODY_RADIUS**2;
 });
}
export function entryPose(scene) {
 const {width,depth,court,ids}=scene.state;
 const front=width-court;
 return {x:front-.825,y:ids.includes(105)?depth+1.8:-1.8,yaw:ids.includes(105)?0:Math.PI,pitch:0};
}
export function movePlayer(boxes,pose,dx,dy) {
 // Substeps prevent a long frame or large input from tunnelling through thin walls.
 const steps=Math.max(1,Math.ceil(Math.hypot(dx,dy)/.08));
 let x=pose.x,y=pose.y;
 for(let i=0;i<steps;i++){
  if(canStand(boxes,x+dx/steps,y))x+=dx/steps;
  if(canStand(boxes,x,y+dy/steps))y+=dy/steps;
 }
 return {...pose,x,y};
}
