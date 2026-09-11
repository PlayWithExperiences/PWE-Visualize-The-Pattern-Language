import {EYE_HEIGHT,floorHeight,canStand,entryPose,movePlayer} from './walk-physics.js?v=7cf58ddf4371';
import {multiply,SUN_DIRECTION,vertexSource,fragmentSource,createSunlight} from './lighting.js?v=7cf58ddf4371';
const dot=(a,b)=>a.reduce((s,n,i)=>s+n*b[i],0);
const cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
const unit=a=>{const n=Math.hypot(...a);return a.map(v=>v/n);};
function cameraMatrix(pose,eyeHeight,aspect){
 const forward=[Math.sin(pose.yaw)*Math.cos(pose.pitch),Math.sin(pose.pitch),-Math.cos(pose.yaw)*Math.cos(pose.pitch)];
 const eye=[pose.x,eyeHeight,pose.y], right=unit(cross(forward,[0,1,0])),up=cross(right,forward);
 const view=[right[0],up[0],-forward[0],0,right[1],up[1],-forward[1],0,right[2],up[2],-forward[2],0,-dot(right,eye),-dot(up,eye),dot(forward,eye),1];
 const near=.06,far=100,f=1/Math.tan(65*Math.PI/360);
 const projection=[f/aspect,0,0,0,0,f,0,0,0,0,(far+near)/(near-far),-1,0,0,2*far*near/(near-far),0];
 return multiply(projection,view);
}
export function createWalk(canvas,onError,onPose){
 const gl=canvas.getContext('webgl',{antialias:true,alpha:false});
 if(!gl)throw Error('此浏览器无法启用三维漫游。请使用轴测或平面视图。');
 const compile=(type,source)=>{
  const shader=gl.createShader(type);gl.shaderSource(shader,source);gl.compileShader(shader);
  if(!gl.getShaderParameter(shader,gl.COMPILE_STATUS))throw Error('三维着色器初始化失败。');
  return shader;
 };
 const vertex=compile(gl.VERTEX_SHADER,vertexSource);
 const fragment=compile(gl.FRAGMENT_SHADER,fragmentSource);
 const program=gl.createProgram();gl.attachShader(program,vertex);gl.attachShader(program,fragment);gl.linkProgram(program);
 if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw Error('三维场景初始化失败。');
 gl.deleteShader(vertex);gl.deleteShader(fragment);
 const buffer=gl.createBuffer(),pos=gl.getAttribLocation(program,'aPosition'),color=gl.getAttribLocation(program,'aColor'),matrix=gl.getUniformLocation(program,'uMatrix');
 const normalAttribute=gl.getAttribLocation(program,'aNormal'),materialAttribute=gl.getAttribLocation(program,'aMaterial');
 const sunUniform=gl.getUniformLocation(program,'uSunMatrix'),shadowUniform=gl.getUniformLocation(program,'uShadow');
 const texelUniform=gl.getUniformLocation(program,'uShadowTexel'),eyeUniform=gl.getUniformLocation(program,'uEye'),directionUniform=gl.getUniformLocation(program,'uSunDirection');
 const sunlight=createSunlight(gl,compile);
 let scene=null,pose=null,opaque=[],glass=[],active=false,frame=0,last=0,lastReadout=0,drag=null;
 const keys=new Set(), cleanup=[];
 const listen=(target,event,fn,options)=>{target.addEventListener(event,fn,options);cleanup.push(()=>target.removeEventListener(event,fn,options));};
 const faces=[[[0,1,2,3],[0,0,-1]],[[4,7,6,5],[0,0,1]],[[0,4,5,1],[0,-1,0]],[[3,2,6,7],[0,1,0]],[[0,3,7,4],[-1,0,0]],[[1,5,6,2],[1,0,0]]];
 function geometry(){
  opaque=[];glass=[];
  // A simple level ceiling completes the enclosure for the person-height view.
  const ceilings=scene.boxes.filter(b=>b.kind==='floor').map(b=>({...b,z:2.8,dz:.12,color:'#e8e3d7',kind:'ceiling'}));
  for(const b of [...scene.boxes,...ceilings]){
   const {x,y,z,dx,dy,dz}=b;
   const points=[[x,y,z],[x+dx,y,z],[x+dx,y+dy,z],[x,y+dy,z],[x,y,z+dz],[x+dx,y,z+dz],[x+dx,y+dy,z+dz],[x,y+dy,z+dz]];
   const rgb=b.color.slice(1).match(/../g).map(c=>parseInt(c,16)/255);
   const isGlass=b.kind==='window';
   for(const [indices,normal] of faces){
    const material=isGlass?3:['deck','post','pergola','window-seat','bench','trunk','furniture'].includes(b.kind)?2:b.kind==='floor'?1:0;
    const vertices=[];
    for(const i of [0,1,2,0,2,3]){
     const [px,py,pz]=points[indices[i]];
     vertices.push(px,pz,py,...rgb,isGlass?.23:1,normal[0],normal[2],normal[1],material);
    }
    if(isGlass)glass.push({vertices,center:[x+dx/2,y+dy/2,z+dz/2]});else opaque.push(...vertices);
   }
  }
  sunlight.update(scene,opaque);
 }
 function drawBatch(data){
  gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(data),gl.DYNAMIC_DRAW);gl.drawArrays(gl.TRIANGLES,0,data.length/11);
 }
 function render(now){
  if(!active)return;
  frame=requestAnimationFrame(render);
  if(!scene||!pose)return;
  const dt=Math.min(.045,(now-last)/1000||0);last=now;
  const editing=document.activeElement!==canvas&&!document.activeElement?.closest('.walk-buttons');
  const paused=document.hidden||document.querySelector('dialog[open]')||editing;
  if(paused)keys.clear();
  else{
   const forward=Number(keys.has('w'))-Number(keys.has('s'));
   const side=Number(keys.has('d'))-Number(keys.has('a'));
   if(forward||side){const norm=Math.hypot(forward,side);const speed=2*dt/norm;pose=movePlayer(scene.boxes,pose,(Math.sin(pose.yaw)*forward+Math.cos(pose.yaw)*side)*speed,(-Math.cos(pose.yaw)*forward+Math.sin(pose.yaw)*side)*speed);}
   pose.yaw+=(Number(keys.has('arrowright'))-Number(keys.has('arrowleft')))*dt*1.3;
   pose.pitch=Math.max(-1.05,Math.min(1.05,pose.pitch+(Number(keys.has('arrowup'))-Number(keys.has('arrowdown')))*dt));
  }
  const eye=floorHeight(scene.boxes,pose.x,pose.y)+EYE_HEIGHT;
  const ratio=Math.min(devicePixelRatio||1,2),width=Math.max(1,Math.round(canvas.clientWidth*ratio)),height=Math.max(1,Math.round(canvas.clientHeight*ratio));
  if(canvas.width!==width||canvas.height!==height){canvas.width=width;canvas.height=height;}
  gl.viewport(0,0,width,height);gl.clearColor(.77,.84,.87,1);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
  gl.enable(gl.DEPTH_TEST);gl.disable(gl.CULL_FACE);gl.useProgram(program);gl.bindBuffer(gl.ARRAY_BUFFER,buffer);
  gl.enableVertexAttribArray(pos);gl.vertexAttribPointer(pos,3,gl.FLOAT,false,44,0);gl.enableVertexAttribArray(color);gl.vertexAttribPointer(color,4,gl.FLOAT,false,44,12);
  gl.enableVertexAttribArray(normalAttribute);gl.vertexAttribPointer(normalAttribute,3,gl.FLOAT,false,44,28);
  gl.enableVertexAttribArray(materialAttribute);gl.vertexAttribPointer(materialAttribute,1,gl.FLOAT,false,44,40);
  gl.uniformMatrix4fv(sunUniform,false,sunlight.matrix);
  gl.activeTexture(gl.TEXTURE0);gl.bindTexture(gl.TEXTURE_2D,sunlight.texture);gl.uniform1i(shadowUniform,0);gl.uniform2f(texelUniform,1/sunlight.size,1/sunlight.size);
  gl.uniform3f(eyeUniform,pose.x,eye,pose.y);const length=Math.hypot(...SUN_DIRECTION);gl.uniform3fv(directionUniform,SUN_DIRECTION.map(x=>x/length));
  gl.uniformMatrix4fv(matrix,false,cameraMatrix(pose,eye,width/height));
  gl.disable(gl.BLEND);gl.depthMask(true);drawBatch(opaque);
  gl.enable(gl.BLEND);gl.blendFunc(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA);gl.depthMask(false);
  glass.sort((a,b)=>Math.hypot(b.center[0]-pose.x,b.center[1]-pose.y,b.center[2]-eye)-Math.hypot(a.center[0]-pose.x,a.center[1]-pose.y,a.center[2]-eye));
  drawBatch(glass.flatMap(face=>face.vertices));gl.depthMask(true);
  if(now-lastReadout>150){lastReadout=now;onPose?.(pose);}
 }
 function stop(){active=false;keys.clear();drag=null;cancelAnimationFrame(frame);}
 function reset(){pose=entryPose(scene);keys.clear();onPose?.(pose);}
 const handled=new Set(['w','a','s','d','arrowleft','arrowright','arrowup','arrowdown']);
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
  update(next){scene=next;if(!pose||!canStand(scene.boxes,pose.x,pose.y))reset();geometry();},
  start(){if(active)return;active=true;last=performance.now();frame=requestAnimationFrame(render);},
  stop,reset,
  step(key){if(!scene||!pose)return;if(key==='arrowleft')pose.yaw-=.18;else if(key==='arrowright')pose.yaw+=.18;else{const f=key==='w'?1:key==='s'?-1:0;const s=key==='d'?1:key==='a'?-1:0;pose=movePlayer(scene.boxes,pose,(Math.sin(pose.yaw)*f+Math.cos(pose.yaw)*s)*.4,(-Math.cos(pose.yaw)*f+Math.sin(pose.yaw)*s)*.4);}},
  key(key,down){if(down)keys.add(key);else keys.delete(key);},
  dispose(){stop();cleanup.forEach(fn=>fn());sunlight.dispose();gl.deleteBuffer(buffer);gl.deleteProgram(program);},
 };
}
