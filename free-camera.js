// Free camera intentionally ignores building collisions, allowing inspection.
export function overviewPose(scene){
 const {width,depth}=scene.state,x=width+6,y=depth+7,z=10;
 const dx=width/2-x,dy=depth/2-y;
 return {x,y,z,yaw:Math.atan2(dx,-dy),pitch:Math.atan2(1-z,Math.hypot(dx,dy))};
}
export function moveFree(pose,forward,side,lift,distance){
 const scale=distance/Math.max(1,Math.hypot(forward,side,lift));
 return {...pose,
  x:Math.max(-150,Math.min(150,pose.x+(Math.sin(pose.yaw)*Math.cos(pose.pitch)*forward+Math.cos(pose.yaw)*side)*scale)),
  y:Math.max(-150,Math.min(150,pose.y+(-Math.cos(pose.yaw)*Math.cos(pose.pitch)*forward+Math.sin(pose.yaw)*side)*scale)),
  z:Math.max(.3,Math.min(80,pose.z+(Math.sin(pose.pitch)*forward+lift)*scale))
 };
}
