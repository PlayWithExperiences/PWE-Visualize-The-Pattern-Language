import {canStand,floorHeight,EYE_HEIGHT} from '../walk-physics.js';
export function worldOverview(scene){const p=scene.overview||{x:scene.state.width*1.15,y:scene.state.depth*1.25,z:scene.state.width*.65};const cx=scene.state.width/2,cy=scene.state.depth/2;return {...p,yaw:Math.atan2(cx-p.x,-(cy-p.y)),pitch:Math.atan2(1-p.z,Math.hypot(cx-p.x,cy-p.y))};}
export function safeSpawn(scene){
 const p=scene.spawn||{x:scene.state.width/2,y:scene.state.depth+3,yaw:0,pitch:0,feet:0};
 if(canStand(scene.boxes,p.x,p.y,p.feet??0))return {...p,feet:floorHeight(scene.boxes,p.x,p.y,p.feet??0)};
 const ground=scene.boxes.find(b=>b.kind==='ground');
 for(let ring=1;ring<12;ring++)for(let angle=0;angle<12;angle++){const x=p.x+Math.sin(angle*Math.PI/6)*ring,y=p.y+Math.cos(angle*Math.PI/6)*ring;if(canStand(scene.boxes,x,y,0))return {...p,x,y,feet:floorHeight(scene.boxes,x,y,0)};}
 for(let y=ground.y+1;y<ground.y+ground.dy;y+=2)for(let x=ground.x+1;x<ground.x+ground.dx;x+=2)if(canStand(scene.boxes,x,y,0))return {...p,x,y,feet:floorHeight(scene.boxes,x,y,0)};
 throw Error('此三维场景没有找到安全的行走起点。');
}
export function observationPose(scene,id,free=true){
 const mark=scene.landmarks?.find(m=>m.id===id);if(!mark)return free?worldOverview(scene):safeSpawn(scene);
 if(free){const extent=Math.max(3,Math.min(12,scene.state.width*.07)),x=mark.x+extent,y=mark.y+extent,z=Math.max(2.8,(mark.z||1.5)+extent*.65);return {x,y,z,yaw:Math.atan2(mark.x-x,-(mark.y-y)),pitch:Math.atan2((mark.z||1.2)-z,Math.hypot(x-mark.x,y-mark.y))};}
 for(const radius of [2.5,4,6,9,14,22])for(const angle of [0,Math.PI/4,-Math.PI/4,Math.PI/2,-Math.PI/2,Math.PI]){
  const x=mark.x+Math.sin(angle)*radius,y=mark.y+Math.cos(angle)*radius,feet=Math.max(0,(mark.z||1.5)-EYE_HEIGHT);
  if(canStand(scene.boxes,x,y,feet))return {x,y,feet:floorHeight(scene.boxes,x,y,feet),yaw:Math.atan2(mark.x-x,-(mark.y-y)),pitch:0};
 }
 return safeSpawn(scene);
}
export function projectMarker(point,pose,eye,width,height){
 const dx=point.x-pose.x,dy=point.y-pose.y,dz=(point.z||1.5)-eye,sy=Math.sin(pose.yaw),cy=Math.cos(pose.yaw),sp=Math.sin(pose.pitch),cp=Math.cos(pose.pitch);
 const depth=dx*sy*cp-dy*cy*cp+dz*sp;if(depth<.2)return null;
 const right=dx*cy+dy*sy,up=-dx*sy*sp+dy*cy*sp+dz*cp,f=height/(2*Math.tan(65*Math.PI/360));
 const x=width/2+right*f/depth,y=height/2-up*f/depth;
 return x>10&&x<width-10&&y>12&&y<height-12?{x,y,distance:Math.hypot(dx,dy,dz)}:null;
}
