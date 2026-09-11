// All units are metres. Model coordinates: x/y on the ground, z up.
export const EYE_HEIGHT = 1.65;
export const BODY_RADIUS = .2;
const walkable = new Set(['ground', 'floor', 'garden', 'path', 'deck', 'step']);
export function floorHeight(boxes,x,y,feet=Infinity) {
 return Math.max(-.04,...boxes.filter(b=>walkable.has(b.kind)&&b.z+b.dz<=feet+.3&&x>=b.x&&x<=b.x+b.dx&&y>=b.y&&y<=b.y+b.dy).map(b=>b.z+b.dz));
}
export function canStand(boxes,x,y,previousFeet=Infinity) {
 const base=boxes.find(b=>b.kind==='ground');
 if(!base||x<base.x+BODY_RADIUS||x>base.x+base.dx-BODY_RADIUS||y<base.y+BODY_RADIUS||y>base.y+base.dy-BODY_RADIUS)return false;
 const feet=floorHeight(boxes,x,y,previousFeet);
 return !boxes.some(b=>{
  if(b.collision===false)return false;
  if(walkable.has(b.kind)){if(!Number.isFinite(previousFeet)||b.z+b.dz<=feet+.3||b.z>=feet+1.8)return false;}
  if(b.z>=feet+1.8||b.z+b.dz<=feet+.25)return false;
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
 let x=pose.x,y=pose.y,feet=pose.feet??Infinity;
 for(let i=0;i<steps;i++){
  if(canStand(boxes,x+dx/steps,y,feet)){x+=dx/steps;if(Number.isFinite(feet))feet=floorHeight(boxes,x,y,feet);}
  if(canStand(boxes,x,y+dy/steps,feet)){y+=dy/steps;if(Number.isFinite(feet))feet=floorHeight(boxes,x,y,feet);}
 }
 return {...pose,x,y,...(Number.isFinite(feet)?{feet}:{})};
}
