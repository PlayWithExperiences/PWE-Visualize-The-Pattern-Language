import {canStand,floorHeight,EYE_HEIGHT} from '../walk-physics.js';
export function worldGeometryBounds(scene){
 // Frame active spatial content instead of empty reserved parcels or a full ground tile.
 const owned=b=>b.pattern>0||b.patterns?.length;
 let boxes=scene.boxes.filter(b=>b.kind!=='ground'&&!b.collisionOnly&&owned(b)),meshes=(scene.meshes||[]).filter(owned);
 if(!boxes.length&&!meshes.length){boxes=scene.boxes.filter(b=>b.kind!=='ground'&&!b.collisionOnly);meshes=scene.meshes||[];}
 const points=[...boxes.flatMap(b=>[[b.x,b.y,b.z],[b.x+b.dx,b.y+b.dy,b.z+b.dz]]),...meshes.flatMap(m=>m.points)];
 if(!points.length)points.push([0,0,0],[scene.state.width,scene.state.depth,0]);
 const mins=[0,1,2].map(i=>Math.min(...points.map(p=>p[i]))),maxs=[0,1,2].map(i=>Math.max(...points.map(p=>p[i])));
 return {mins,maxs};
}
export function worldOverview(scene){
 const {mins,maxs}=scene.frameBounds||worldGeometryBounds(scene);
 const minimum={region:40,city:30,neighborhood:24,institution:18,site:20,plan:16,edge:16,room:12,construction:12,finish:12}[scene.key]||15;
 const span=Math.max(minimum,maxs[0]-mins[0],maxs[1]-mins[1]),cx=(mins[0]+maxs[0])/2,cy=(mins[1]+maxs[1])/2;
 const x=cx+span*.6,y=cy+span*.75,z=Math.max(8,maxs[2]+span*.62),targetZ=Math.max(1,maxs[2]*.25);
 return {x,y,z,yaw:Math.atan2(cx-x,-(cy-y)),pitch:Math.atan2(targetZ-z,Math.hypot(cx-x,cy-y))};
}
export function reconcilePerson(scene,pose){
 if(!pose||!canStand(scene.boxes,pose.x,pose.y,pose.feet??0))return safeSpawn(scene);
 return {...pose,feet:floorHeight(scene.boxes,pose.x,pose.y,pose.feet??0)};
}
export function safeSpawn(scene){
 const p=scene.spawn||{x:scene.state.width/2,y:scene.state.depth+3,yaw:0,pitch:0,feet:0};
 if(canStand(scene.boxes,p.x,p.y,p.feet??0))return {...p,feet:floorHeight(scene.boxes,p.x,p.y,p.feet??0)};
 const ground=scene.boxes.find(b=>b.kind==='ground');
 for(let ring=1;ring<12;ring++)for(let angle=0;angle<12;angle++){const x=p.x+Math.sin(angle*Math.PI/6)*ring,y=p.y+Math.cos(angle*Math.PI/6)*ring;if(canStand(scene.boxes,x,y,0))return {...p,x,y,feet:floorHeight(scene.boxes,x,y,0)};}
 for(let y=ground.y+1;y<ground.y+ground.dy;y+=2)for(let x=ground.x+1;x<ground.x+ground.dx;x+=2)if(canStand(scene.boxes,x,y,0))return {...p,x,y,feet:floorHeight(scene.boxes,x,y,0)};
 throw Error('此三维场景没有找到安全的行走起点。');
}
export function patternTarget(scene,id){
 const owns=b=>b.pattern===id||b.patterns?.includes(id);
 const visible=b=>!b.collisionOnly&&b.kind!=='ground'&&!(scene.cutaway&&['roof','ceiling'].includes(b.kind)&&!owns(b));
 const boxes=scene.boxes.filter(b=>owns(b)&&visible(b)),meshes=(scene.meshes||[]).filter(m=>owns(m)&&visible(m));
 const points=[...boxes.flatMap(b=>[[b.x,b.y,b.z],[b.x+b.dx,b.y+b.dy,b.z+b.dz]]),...meshes.flatMap(m=>m.points)];
 if(!points.length){const m=scene.landmarks?.find(m=>m.id===id);return m?{x:m.x,y:m.y,z:m.z??1.5,radius:1,halfDepth:1,halfWidth:1,halfHeight:1}:null;}
 const min=[0,1,2].map(i=>Math.min(...points.map(p=>p[i]))),max=[0,1,2].map(i=>Math.max(...points.map(p=>p[i])));
 return {x:(min[0]+max[0])/2,y:(min[1]+max[1])/2,z:(min[2]+max[2])/2,radius:Math.max(.5,Math.hypot(...max.map((v,i)=>(v-min[i])/2))),halfWidth:(max[0]-min[0])/2,halfHeight:(max[2]-min[2])/2,halfDepth:(max[1]-min[1])/2};
}
export function observationPose(scene,id,free=true,aspect=1){
 const target=patternTarget(scene,id);if(!target)return free?worldOverview(scene):safeSpawn(scene);
 const aim=p=>({...p,yaw:Math.atan2(target.x-p.x,-(target.y-p.y)),pitch:Math.atan2(target.z-(free?p.z:p.feet+EYE_HEIGHT),Math.hypot(target.x-p.x,target.y-p.y))});
 if(free){
  const tangent=Math.tan(65*Math.PI/360),vertical=target.halfHeight*Math.cos(.3)+target.halfDepth*Math.sin(.3),depth=target.halfDepth*Math.cos(.3)+target.halfHeight*Math.sin(.3);
  const distance=Math.max(2,(Math.max(target.halfWidth/(tangent*Math.max(.1,aspect)),vertical/tangent)+depth)*1.15);
  return aim({x:target.x,y:target.y+distance*Math.cos(.3),z:target.z+distance*Math.sin(.3)});
 }
 const mark=scene.landmarks?.find(m=>m.id===id),start=Math.max(2.5,target.halfDepth+1.5,Math.abs(target.z-EYE_HEIGHT)/Math.tan(.9));
 for(const radius of [start,start+3,start+7,start+14,start+22])for(const angle of [0,Math.PI/4,-Math.PI/4,Math.PI/2,-Math.PI/2,Math.PI]){
  const x=target.x+Math.sin(angle)*radius,y=target.y+Math.cos(angle)*radius,feet=Math.max(0,(mark?.z??1.5)-EYE_HEIGHT);
  if(canStand(scene.boxes,x,y,feet))return aim({x,y,feet:floorHeight(scene.boxes,x,y,feet)});
 }
 return aim(safeSpawn(scene));
}
export function projectMarker(point,pose,eye,width,height){
 const dx=point.x-pose.x,dy=point.y-pose.y,dz=(point.z??1.5)-eye,sy=Math.sin(pose.yaw),cy=Math.cos(pose.yaw),sp=Math.sin(pose.pitch),cp=Math.cos(pose.pitch);
 const depth=dx*sy*cp-dy*cy*cp+dz*sp;if(depth<.2)return null;
 const right=dx*cy+dy*sy,up=-dx*sy*sp+dy*cy*sp+dz*cp,f=height/(2*Math.tan(65*Math.PI/360));
 const x=width/2+right*f/depth,y=height/2-up*f/depth;
 return x>10&&x<width-10&&y>12&&y<height-12?{x,y,distance:Math.hypot(dx,dy,dz)}:null;
}
