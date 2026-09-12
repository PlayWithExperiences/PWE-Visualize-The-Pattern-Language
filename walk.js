import {worldOverview,safeSpawn,observationPose,reconcilePerson} from './world/navigation.js';
import {EYE_HEIGHT,floorHeight,canStand,entryPose,movePlayer} from './walk-physics.js';
import {multiply,vertexSource,fragmentSource,createSunlight} from './lighting.js';
import {normalizeSun,advanceSun,sampleSun} from './sun.js';
import {overviewPose,moveFree} from './free-camera.js';
import {createRenderBuffers,emphasizedColor} from './render-buffers.js';
const dot=(a,b)=>a.reduce((s,n,i)=>s+n*b[i],0);
const cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
const unit=a=>{const n=Math.hypot(...a);return a.map(v=>v/n);};
function cameraMatrix(pose,eyeHeight,aspect,far=250,near=.06){
 const forward=[Math.sin(pose.yaw)*Math.cos(pose.pitch),Math.sin(pose.pitch),-Math.cos(pose.yaw)*Math.cos(pose.pitch)];
 const eye=[pose.x,eyeHeight,pose.y], right=unit(cross(forward,[0,1,0])),up=cross(right,forward);
 const view=[right[0],up[0],-forward[0],0,right[1],up[1],-forward[1],0,right[2],up[2],-forward[2],0,-dot(right,eye),-dot(up,eye),dot(forward,eye),1];
 const f=1/Math.tan(65*Math.PI/360);
 const projection=[f/aspect,0,0,0,0,f,0,0,0,0,(far+near)/(near-far),-1,0,0,2*far*near/(near-far),0];
 return multiply(projection,view);
}
export function createWalk(canvas,onError,onPose,onLight,options={}){
 const gl=canvas.getContext('webgl',{antialias:true,alpha:false});
 if(!gl)throw Error('此浏览器无法启用三维漫游。请使用轴测或平面视图。');
 const compile=(type,source)=>{
  const shader=gl.createShader(type);gl.shaderSource(shader,source);gl.compileShader(shader);
  if(!gl.getShaderParameter(shader,gl.COMPILE_STATUS))throw Error('三维着色器初始化失败。');
  return shader;
 };
 const vertex=compile(gl.VERTEX_SHADER,vertexSource);
 const derivatives=gl.getExtension('OES_standard_derivatives');
 const fragment=compile(gl.FRAGMENT_SHADER,(derivatives?'#extension GL_OES_standard_derivatives : enable\n#define RECEIVER_PLANE_BIAS\n':'')+fragmentSource);
 const program=gl.createProgram();gl.attachShader(program,vertex);gl.attachShader(program,fragment);gl.linkProgram(program);
 if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw Error('三维场景初始化失败。');
 gl.deleteShader(vertex);gl.deleteShader(fragment);
 const pos=gl.getAttribLocation(program,'aPosition'),color=gl.getAttribLocation(program,'aColor'),matrix=gl.getUniformLocation(program,'uMatrix');
 const normalAttribute=gl.getAttribLocation(program,'aNormal'),materialAttribute=gl.getAttribLocation(program,'aMaterial');
 const sunUniform=gl.getUniformLocation(program,'uSunMatrix'),shadowUniform=gl.getUniformLocation(program,'uShadow');
 const texelUniform=gl.getUniformLocation(program,'uShadowTexel'),eyeUniform=gl.getUniformLocation(program,'uEye'),directionUniform=gl.getUniformLocation(program,'uSunDirection');
 const batches=createRenderBuffers(gl,()=>{
  gl.enableVertexAttribArray(pos);gl.vertexAttribPointer(pos,3,gl.FLOAT,false,44,0);gl.enableVertexAttribArray(color);gl.vertexAttribPointer(color,4,gl.FLOAT,false,44,12);
  gl.enableVertexAttribArray(normalAttribute);gl.vertexAttribPointer(normalAttribute,3,gl.FLOAT,false,44,28);
  gl.enableVertexAttribArray(materialAttribute);gl.vertexAttribPointer(materialAttribute,1,gl.FLOAT,false,44,40);
 });
 const sunlight=createSunlight(gl,compile,options);
 const packedShadowUniform=gl.getUniformLocation(program,'uPackedShadow'),fogRangeUniform=gl.getUniformLocation(program,'uFogRange');canvas.dataset.shadowStorage=sunlight.packed?'rgba-packed':'native-depth';
 const lampPositions=gl.getUniformLocation(program,'uLampPosition[0]'),lampColors=gl.getUniformLocation(program,'uLampColor[0]');
 let lampPositionData=new Float32Array(32),lampColorData=new Float32Array(24),speedMultiplier=1;
 const skyUniform=gl.getUniformLocation(program,'uSkyColor'),sunColorUniform=gl.getUniformLocation(program,'uSunColor');
 const nightAidUniform=gl.getUniformLocation(program,'uNightAid');let nightAid=options.nightAid===true;
 const dayUniform=gl.getUniformLocation(program,'uDaylight'),strengthUniform=gl.getUniformLocation(program,'uSunStrength');
 let free=false,personPose=null,flyingPose=null,lightSettings=normalizeSun(),light=sampleSun(lightSettings),shadowDirty=false,shadowAt=0;

 let emphasisId=null,emphasisEnabled=false;
 let scene=null,pose=null,opaque=[],shadowVertices=[],glass=[],active=false,frame=0,last=0,lastReadout=0,drag=null;
 const keys=new Set(), cleanup=[];
 const listen=(target,event,fn,options)=>{target.addEventListener(event,fn,options);cleanup.push(()=>target.removeEventListener(event,fn,options));};
 const faces=[[[0,1,2,3],[0,0,-1]],[[4,7,6,5],[0,0,1]],[[0,4,5,1],[0,-1,0]],[[3,2,6,7],[0,1,0]],[[0,3,7,4],[-1,0,0]],[[1,5,6,2],[1,0,0]]];
 function geometry(refreshEnvironment=true){
  opaque=[];shadowVertices=[];glass=[];
  // A simple level ceiling completes the enclosure for the person-height view.
  const ceilings=scene.autoCeiling===false?[]:scene.boxes.filter(b=>b.kind==='floor').map(b=>({...b,z:2.8,dz:.12,color:'#e8e3d7',kind:'ceiling'}));
  for(const b of [...scene.boxes,...ceilings]){
   if(b.collisionOnly||(scene.cutaway&&['roof','ceiling'].includes(b.kind)&&b.pattern!==scene.focus&&!b.patterns?.includes(scene.focus)))continue;
   const {x,y,z,dx,dy,dz}=b;
   const points=[[x,y,z],[x+dx,y,z],[x+dx,y+dy,z],[x,y+dy,z],[x,y,z+dz],[x+dx,y,z+dz],[x+dx,y+dy,z+dz],[x,y+dy,z+dz]];
   const rgb=emphasizedColor(b,emphasisId,emphasisEnabled);
   const isGlass=b.kind==='window';
   for(const [indices,normal] of faces){
    const material=b.kind==='emissive'?4:isGlass?3:['deck','post','pergola','window-seat','bench','trunk','furniture','filter','mullion','ceiling-panel'].includes(b.kind)?2:b.kind==='floor'?1:0;
    const vertices=[];
    for(const i of [0,1,2,0,2,3]){
     const [px,py,pz]=points[indices[i]];
     vertices.push(px,pz,py,...rgb,isGlass?.23:1,normal[0],normal[2],normal[1],material);
    }
    if(isGlass)glass.push({vertices,center:[x+dx/2,y+dy/2,z+dz/2]});else {opaque.push(...vertices);if(b.kind!=='ground'&&!(['floor','path','garden','deck'].includes(b.kind)&&b.z+b.dz<=.3))shadowVertices.push(...vertices);}
   }
  }
  for(const mesh of scene.meshes||[]){
   if(scene.cutaway&&['roof','ceiling'].includes(mesh.kind)&&mesh.pattern!==scene.focus&&!mesh.patterns?.includes(scene.focus))continue;
   const p=mesh.points,u=p[1].map((v,i)=>v-p[0][i]),v=p[2].map((v,i)=>v-p[0][i]);const n=cross(u,v),length=Math.hypot(...n);if(length<1e-9)continue;
   const normal=n.map(v=>v/length),rgb=emphasizedColor(mesh,emphasisId,emphasisEnabled),isGlass=mesh.kind==='window';
   const material=mesh.kind==='emissive'?4:isGlass?3:['beam','wood'].includes(mesh.kind)?2:0;
   const vertices=p.flatMap(([x,y,z])=>[x,z,y,...rgb,isGlass?.23:1,-normal[0],-normal[2],-normal[1],material]);
   if(isGlass)glass.push({vertices,center:[0,1,2].map(i=>(p[0][i]+p[1][i]+p[2][i])/3)});else {opaque.push(...vertices);if(!['path','floor','water','emissive'].includes(mesh.kind))shadowVertices.push(...vertices);}
  }
  batches.update(opaque,glass);
  if(!refreshEnvironment)return;
  lampPositionData=new Float32Array(32);lampColorData=new Float32Array(24);
  for(const [i,lamp]of (scene.lights||[]).slice(0,8).entries()){lampPositionData.set([lamp.x,lamp.z,lamp.y,lamp.radius],i*4);lampColorData.set(lamp.color.slice(1).match(/../g).map(c=>parseInt(c,16)/255*(lamp.intensity||1)),i*3);}
  sunlight.update(scene,shadowVertices,light.direction);shadowDirty=false;shadowAt=performance.now();
 }
 function render(now){
  if(!active)return;
  frame=requestAnimationFrame(render);
  if(!scene||!pose)return;
  const elapsed=Math.min(.25,(now-last)/1000||0),dt=Math.min(.045,elapsed);last=now;
  if(lightSettings.playing&&!document.hidden&&!document.querySelector('dialog[open]')){lightSettings=advanceSun(lightSettings,elapsed);shadowDirty=true;}
  if(shadowDirty&&now-shadowAt>=66){light=sampleSun(lightSettings);sunlight.update(scene,shadowVertices,light.direction);shadowDirty=false;shadowAt=now;}
  const editing=document.activeElement!==canvas&&!document.activeElement?.closest('.walk-buttons');
  const paused=document.hidden||document.querySelector('dialog[open]')||editing;
  if(paused)keys.clear();
  else{
   const forward=Number(keys.has('w'))-Number(keys.has('s'));
   const side=Number(keys.has('d'))-Number(keys.has('a'));
   if(free){pose=moveFree(pose,forward,side,Number(keys.has('e'))-Number(keys.has('q')),(scene.navigation?.speed||4)*speedMultiplier*(keys.has('shift')?3:1)*dt,scene.navigation);}
   else if(forward||side){const norm=Math.hypot(forward,side);const speed=2*speedMultiplier*(keys.has('shift')?3:1)*dt/norm;pose=movePlayer(scene.boxes,pose,(Math.sin(pose.yaw)*forward+Math.cos(pose.yaw)*side)*speed,(-Math.cos(pose.yaw)*forward+Math.sin(pose.yaw)*side)*speed);}
   pose.yaw+=(Number(keys.has('arrowright'))-Number(keys.has('arrowleft')))*dt*1.3;
   pose.pitch=Math.max(-1.05,Math.min(1.05,pose.pitch+(Number(keys.has('arrowup'))-Number(keys.has('arrowdown')))*dt));
  }
  const eye=free?pose.z:floorHeight(scene.boxes,pose.x,pose.y,pose.feet??Infinity)+EYE_HEIGHT;
  const ratio=Math.min(devicePixelRatio||1,2),width=Math.max(1,Math.round(canvas.clientWidth*ratio)),height=Math.max(1,Math.round(canvas.clientHeight*ratio));
  if(canvas.width!==width||canvas.height!==height){canvas.width=width;canvas.height=height;}
  gl.viewport(0,0,width,height);gl.clearColor(...light.sky,1);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
  gl.enable(gl.DEPTH_TEST);gl.disable(gl.CULL_FACE);gl.useProgram(program);
  gl.uniformMatrix4fv(sunUniform,false,sunlight.matrix);
  gl.activeTexture(gl.TEXTURE0);gl.bindTexture(gl.TEXTURE_2D,sunlight.texture);gl.uniform1i(shadowUniform,0);gl.uniform1f(packedShadowUniform,sunlight.packed?1:0);gl.uniform2f(texelUniform,1/sunlight.size,1/sunlight.size);
  gl.uniform3f(eyeUniform,pose.x,eye,pose.y);gl.uniform3fv(directionUniform,light.direction);
  gl.uniform3fv(skyUniform,light.sky);gl.uniform3fv(sunColorUniform,scene.navigation?.world?light.color.map(v=>v*.8):light.color);gl.uniform2f(fogRangeUniform,scene.navigation?.world?Math.max(40,scene.state.width*.7):22,scene.navigation?.world?Math.max(120,scene.state.width*2):80);gl.uniform1f(dayUniform,light.daylight);gl.uniform1f(strengthUniform,light.strength);
  gl.uniform1f(nightAidUniform,nightAid?1:0);gl.uniform4fv(lampPositions,lampPositionData);gl.uniform3fv(lampColors,lampColorData);
  gl.uniformMatrix4fv(matrix,false,cameraMatrix(pose,eye,width/height,scene.navigation?.far||250,scene.navigation?.world&&free?Math.max(.06,Math.min(1,eye/50)):.06));
  gl.disable(gl.BLEND);gl.depthMask(true);batches.drawOpaque();
  gl.enable(gl.BLEND);gl.blendFunc(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA);gl.depthMask(false);
  batches.drawTransparent([pose.x,pose.y,eye]);gl.depthMask(true);
  if(now-lastReadout>150){lastReadout=now;onPose?.(pose,free);onLight?.({...lightSettings});}
 }
 function stop(){active=false;keys.clear();drag=null;cancelAnimationFrame(frame);}
 function reset(){pose=scene.navigation?.world?(free?worldOverview(scene):safeSpawn(scene)):(free?overviewPose(scene):entryPose(scene));keys.clear();onPose?.(pose,free);onLight?.({...lightSettings});}
 const handled=new Set(['w','a','s','d','q','e','arrowleft','arrowright','arrowup','arrowdown','shift']);
 listen(canvas,'keydown',e=>{const key=e.key.toLowerCase();if(handled.has(key)){e.preventDefault();keys.add(key);}if(key==='escape'){keys.clear();canvas.blur();}});
 listen(window,'keyup',e=>keys.delete(e.key.toLowerCase()));
 listen(window,'blur',()=>{keys.clear();drag=null;});
 listen(canvas,'blur',()=>keys.clear());
 listen(document,'visibilitychange',()=>keys.clear());
 listen(canvas,'pointerdown',e=>{canvas.focus({preventScroll:true});drag={x:e.clientX,y:e.clientY};canvas.setPointerCapture(e.pointerId);});
 listen(canvas,'pointermove',e=>{if(!drag)return;pose.yaw+=(e.clientX-drag.x)*.005;pose.pitch=Math.max(-1.05,Math.min(1.05,pose.pitch-(e.clientY-drag.y)*.005));drag={x:e.clientX,y:e.clientY};});
 for(const ev of ['pointerup','pointercancel','lostpointercapture'])listen(canvas,ev,()=>drag=null);
 listen(canvas,'webglcontextlost',e=>{e.preventDefault();stop();onError('三维显示连接已中断，请切换回轴测视图，或刷新页面后重试。');});
 return {
  update(next,{freeMode=false,resetView=false,emphasis}={}){
   if(emphasis){emphasisId=emphasis.id;emphasisEnabled=Boolean(emphasis.enabled);}
   const changedWorld=resetView||scene?.key!==next.key;scene=next;if(changedWorld){pose=null;personPose=null;flyingPose=null;}lightSettings=normalizeSun(next.state.sun);light=sampleSun(lightSettings);
   if(scene.navigation?.world&&personPose)personPose=reconcilePerson(scene,personPose);
   if(freeMode!==free){if(free)flyingPose=pose;else personPose=pose;free=freeMode;pose=free?flyingPose:personPose;}
   if(!pose||(!free&&!canStand(scene.boxes,pose.x,pose.y,pose.feet??Infinity)))reset();
   if(scene.navigation?.world&&!free)pose=reconcilePerson(scene,pose);
   geometry();onPose?.(pose,free);
  },
  setEmphasis(patternId,enabled){
   if(emphasisId===patternId&&emphasisEnabled===Boolean(enabled))return;
   emphasisId=patternId;emphasisEnabled=Boolean(enabled);if(scene)geometry(false);
  },
  zoom(direction){
   if(!free||!scene||!pose)return;
   const amount=Math.max(-1,Math.min(1,Number(direction)||0)),forward=Math.sign(amount);if(!forward)return;
   pose=moveFree(pose,forward,0,0,(scene.navigation?.speed||4)*.5*Math.abs(amount),scene.navigation);onPose?.(pose,free);
  },
  setNightAid(enabled){nightAid=Boolean(enabled);},
  setSpeed(multiplier){speedMultiplier=Math.max(.25,Math.min(20,Number(multiplier)||1));},
  goToPattern(id){if(scene?.navigation?.world){pose=observationPose(scene,id,free);keys.clear();onPose?.(pose,free);}},
  setLighting(next){const normalized=normalizeSun(next);if(Object.keys(normalized).every(key=>normalized[key]===lightSettings[key]))return;lightSettings=normalized;shadowDirty=true;},
  start(){if(active)return;active=true;last=performance.now();frame=requestAnimationFrame(render);},
  stop,reset,
  step(key){
   if(!scene||!pose)return;
   if(key==='arrowleft')pose.yaw-=.18;
   else if(key==='arrowright')pose.yaw+=.18;
   else{
    const forward=key==='w'?1:key==='s'?-1:0,side=key==='d'?1:key==='a'?-1:0;
    if(free)pose=moveFree(pose,forward,side,key==='e'?1:key==='q'?-1:0,.5*speedMultiplier,scene.navigation);
    else pose=movePlayer(scene.boxes,pose,(Math.sin(pose.yaw)*forward+Math.cos(pose.yaw)*side)*.4,(-Math.cos(pose.yaw)*forward+Math.sin(pose.yaw)*side)*.4);
   }
   onPose?.(pose,free);
  },
  key(key,down){if(down)keys.add(key);else keys.delete(key);},
  dispose(){stop();cleanup.forEach(fn=>fn());sunlight.dispose();batches.dispose();gl.deleteProgram(program);gl.getExtension('WEBGL_lose_context')?.loseContext();},
 };
}
