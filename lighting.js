// Lighting is illustrative daylight, not a site/date-based daylight analysis.
export const SUN_DIRECTION=[-.48,.67,.57];
export function multiply(a,b){
 const out=new Float32Array(16);
 for(let col=0;col<4;col++)for(let row=0;row<4;row++)for(let k=0;k<4;k++)out[col*4+row]+=a[k*4+row]*b[col*4+k];
 return out;
}
export function sunMatrix(scene,direction=SUN_DIRECTION){
 const ground=scene.boxes.find(b=>b.kind==='ground');
 const boxes=scene.boxes.filter(b=>b.kind!=='ground'&&!b.collisionOnly);
 const points=[];
 for(const b of boxes){
  for(const x of [b.x,b.x+b.dx])for(const y of [b.y,b.y+b.dy])for(const z of [b.z,b.z+b.dz])points.push([x,z,y]);
  if(scene.autoCeiling!==false&&b.kind==='floor'){
   for(const x of [b.x,b.x+b.dx])for(const y of [b.y,b.y+b.dy])for(const z of [2.8,2.92])points.push([x,z,y]);
  }
 }
 for(const mesh of scene.meshes||[])for(const [x,y,z]of mesh.points)points.push([x,z,y]);
 if(!points.length&&ground)for(const x of [ground.x,ground.x+ground.dx])for(const y of [ground.y,ground.y+ground.dy])points.push([x,ground.z,y]);
 if(!points.length)points.push([0,0,0]);
 const length=Math.hypot(...direction),back=length>1e-6?direction.map(x=>x/length):[0,1,0];
 const rightLength=Math.hypot(back[2],back[0]),right=rightLength<1e-6?[1,0,0]:[back[2]/rightLength,0,-back[0]/rightLength];
 const up=[back[1]*right[2],back[2]*right[0]-back[0]*right[2],-back[1]*right[0]];
 const dot=(a,b)=>a.reduce((sum,x,i)=>sum+x*b[i],0);
 // Fit real geometry, not the oversized presentation ground. Include receivers
 // along sunlight rays so long shadows retain their depth range on that ground.
 if(ground&&back[1]>.001){
  const top=ground.z+ground.dz;
  for(const p of points.slice()){
   let t=Math.max(0,(p[1]-top)/back[1]);
   for(const [axis,min,max]of [[0,ground.x,ground.x+ground.dx],[2,ground.y,ground.y+ground.dy]]){
    if(back[axis]>1e-6)t=Math.min(t,Math.max(0,(p[axis]-min)/back[axis]));
    else if(back[axis]<-1e-6)t=Math.min(t,Math.max(0,(p[axis]-max)/back[axis]));
   }
   points.push(p.map((v,i)=>v-back[i]*t));
  }
 }
 const axes=[right,up,back],ranges=axes.map(axis=>{
  let min=Infinity,max=-Infinity;for(const p of points){const v=dot(p,axis);min=Math.min(min,v);max=Math.max(max,v);}
  const margin=Math.max(.5,(max-min)*.04);return [min-margin,max+margin];
 });
 const [x,y,z]=ranges,view=[right[0],up[0],back[0],0,right[1],up[1],back[1],0,right[2],up[2],back[2],0,0,0,0,1];
 return multiply([2/(x[1]-x[0]),0,0,0,0,2/(y[1]-y[0]),0,0,0,0,-2/(z[1]-z[0]),0,-(x[1]+x[0])/(x[1]-x[0]),-(y[1]+y[0])/(y[1]-y[0]),(z[1]+z[0])/(z[1]-z[0]),1],view);
}
export const vertexSource=`
attribute vec3 aPosition;
attribute vec4 aColor;
attribute vec3 aNormal;
attribute float aMaterial;
uniform mat4 uMatrix;
uniform mat4 uSunMatrix;
varying vec4 vColor;
varying vec3 vWorld;
varying vec3 vNormal;
varying float vMaterial;
varying vec4 vShadow;
varying float vDistance;
void main(){
 gl_Position=uMatrix*vec4(aPosition,1.0);
 vDistance=gl_Position.w;vColor=aColor;vWorld=aPosition;
 vNormal=aNormal;vMaterial=aMaterial;vShadow=uSunMatrix*vec4(aPosition,1.0);
}`;
export const fragmentSource=`
precision highp float;
uniform sampler2D uShadow;
uniform float uPackedShadow;
uniform vec2 uFogRange;
uniform vec2 uShadowTexel;
uniform vec3 uEye;
uniform vec3 uSunDirection;
uniform vec3 uSkyColor;
uniform vec3 uSunColor;
uniform float uDaylight;
uniform float uSunStrength;
uniform float uNightAid;
uniform vec4 uLampPosition[8];
uniform vec3 uLampColor[8];
varying vec4 vColor;
varying vec3 vWorld;
varying vec3 vNormal;
varying float vMaterial;
varying vec4 vShadow;
varying float vDistance;
float random(vec3 p){return fract(sin(dot(p,vec3(12.9898,78.233,37.719)))*43758.5453);}
float noise(vec3 p){
 vec3 i=floor(p),f=fract(p);f=f*f*(3.0-2.0*f);
 return mix(mix(mix(random(i),random(i+vec3(1,0,0)),f.x),mix(random(i+vec3(0,1,0)),random(i+vec3(1,1,0)),f.x),f.y),
 mix(mix(random(i+vec3(0,0,1)),random(i+vec3(1,0,1)),f.x),mix(random(i+vec3(0,1,1)),random(i+vec3(1,1,1)),f.x),f.y),f.z);
}
float unpackDepth(vec4 rgba){return dot(rgba.rg,vec2(1.0,1.0/255.0));}
float visibility(vec3 normal){
 vec3 p=vShadow.xyz/vShadow.w*.5+.5;
 if(p.x<=0.0||p.x>=1.0||p.y<=0.0||p.y>=1.0||p.z<=0.0||p.z>=1.0)return 1.0;
 float bias=.00015+.00055*(1.0-max(0.0,dot(normal,uSunDirection)));
 float lit=0.0;
 for(int x=-1;x<=1;x++)for(int y=-1;y<=1;y++){
  vec4 sampleDepth=texture2D(uShadow,p.xy+vec2(float(x),float(y))*uShadowTexel*1.2);
  float depth=uPackedShadow>.5?unpackDepth(sampleDepth):sampleDepth.r;
  lit+=step(p.z-bias,depth);
 }
 return lit/9.0;
}
vec3 aces(vec3 x){return clamp((x*(2.51*x+.03))/(x*(2.43*x+.59)+.14),0.0,1.0);}
void main(){
 vec3 normal=normalize(vNormal);
 if(!gl_FrontFacing)normal=-normal;
 float n=noise(vWorld*80.0);
 vec3 albedo=pow(vColor.rgb,vec3(2.2));
 // Fine plaster / stone variation and restrained grain on wooden members.
 albedo*=1.0+(n-.5)*.035*(1.0-smoothstep(1.0,5.0,vDistance));
 if(vMaterial>1.5&&vMaterial<2.5){
  float grain=noise(vec3(vWorld.x*3.0,vWorld.y*50.0,vWorld.z*3.0));
  albedo*=1.0+(grain-.5)*.14*(1.0-smoothstep(3.0,12.0,vDistance));
 }

 // Metre-scaled stone joints distinguish the walking surface from plaster.
 // Fade at distance rather than turning subpixel joints into a moire grid.
 if(vMaterial>.5&&vMaterial<1.5){
  vec2 cell=abs(fract(vWorld.xz/.8)-.5)*.8;
  float seam=min(cell.x,cell.y),footprint=.002+max(vDistance,0.0)*.0008;
  float joint=1.0-smoothstep(.004,.004+footprint,seam);
  albedo*=1.0-.18*joint*(1.0-smoothstep(8.0,24.0,vDistance));
 }
 float hemisphere=normal.y*.5+.5;
 vec3 ambient=mix(vec3(.38,.39,.40),vec3(.53,.57,.62),hemisphere);
 ambient*=.025+.975*uDaylight;
 vec3 localLight=vec3(0.0);
 for(int i=0;i<8;i++){
  vec3 delta=uLampPosition[i].xyz-vWorld;float distance=length(delta);
  float falloff=pow(max(0.0,1.0-distance/max(.01,uLampPosition[i].w)),2.0);
  localLight+=uLampColor[i]*falloff*max(.12,dot(normal,normalize(delta+vec3(.0001))));
 }
 // Optional navigation aid, not a simulated fixture: a neutral camera light
 // fades over the first 12 metres and is exactly off above the horizon.
 float night=1.0-smoothstep(-.12,0.0,uSunDirection.y);
 vec3 eyeDelta=uEye-vWorld;
 float eyeDistance=length(eyeDelta);
 float nearFill=pow(max(0.0,1.0-eyeDistance/12.0),2.0);
 float facing=max(.25,dot(normal,normalize(eyeDelta+vec3(.0001))));
 localLight+=vec3(1.05,1.08,1.15)*nearFill*facing*night*clamp(uNightAid,0.0,1.0);
 // Keep the PCF result out of the live range of the uniform-array light loop.
 // Computing it before that loop produced a reproducible WebGL backend shadow wedge.
 float sunlight=visibility(normal)*max(dot(normal,uSunDirection),0.0)*uSunStrength;
 vec3 radiance=albedo*(ambient+uSunColor*sunlight+localLight);
 if(vMaterial>3.5)radiance=albedo*2.5;
 float alpha=vColor.a;
 if(vMaterial>2.5&&vMaterial<3.5){
  vec3 view=normalize(uEye-vWorld);
  float fresnel=pow(1.0-abs(dot(normal,view)),5.0);
  vec3 halfVector=normalize(view+uSunDirection);
  float sparkle=pow(max(dot(normal,halfVector),0.0),100.0)*sunlight;
  radiance=mix(albedo*.5,uSkyColor*.8,.35+fresnel*.5)*(.025+.975*uDaylight)+sparkle*.5;
  alpha=.10+fresnel*.30;
 }
 vec3 color=pow(aces(radiance),vec3(1.0/2.2));
 float fog=clamp((vDistance-uFogRange.x)/uFogRange.y,0.0,.3);
 gl_FragColor=vec4(mix(color,uSkyColor,fog),alpha);
}`;
export function createSunlight(gl,compile,{forcePacked=false}={}){
 const vertex=compile(gl.VERTEX_SHADER,'attribute vec3 aPosition; uniform mat4 uMatrix; void main(){gl_Position=uMatrix*vec4(aPosition,1.0);}');
 const fragment=compile(gl.FRAGMENT_SHADER,`precision highp float;
 void main(){vec2 p=fract(min(gl_FragCoord.z,.99998)*vec2(1.0,255.0));p.x-=p.y/255.0;gl_FragColor=vec4(p,0.0,1.0);}`);
 const program=gl.createProgram();gl.attachShader(program,vertex);gl.attachShader(program,fragment);gl.linkProgram(program);
 if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw Error('日光阴影初始化失败。');
 gl.deleteShader(vertex);gl.deleteShader(fragment);
 const size=Math.min(2048,gl.getParameter(gl.MAX_TEXTURE_SIZE),gl.getParameter(gl.MAX_RENDERBUFFER_SIZE));
 const texture=gl.createTexture();gl.bindTexture(gl.TEXTURE_2D,texture);
 gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,size,size,0,gl.RGBA,gl.UNSIGNED_BYTE,null);
 gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.NEAREST);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.NEAREST);
 gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);
 const nativeDepth=!forcePacked&&!!gl.getExtension('WEBGL_depth_texture');
 let depth=null,depthTexture=null;
 if(nativeDepth){depthTexture=gl.createTexture();gl.bindTexture(gl.TEXTURE_2D,depthTexture);gl.texImage2D(gl.TEXTURE_2D,0,gl.DEPTH_COMPONENT,size,size,0,gl.DEPTH_COMPONENT,gl.UNSIGNED_SHORT,null);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.NEAREST);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.NEAREST);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);}
 else{depth=gl.createRenderbuffer();gl.bindRenderbuffer(gl.RENDERBUFFER,depth);gl.renderbufferStorage(gl.RENDERBUFFER,gl.DEPTH_COMPONENT16,size,size);}
 const target=gl.createFramebuffer();gl.bindFramebuffer(gl.FRAMEBUFFER,target);
 gl.framebufferTexture2D(gl.FRAMEBUFFER,gl.COLOR_ATTACHMENT0,gl.TEXTURE_2D,texture,0);
 if(depthTexture)gl.framebufferTexture2D(gl.FRAMEBUFFER,gl.DEPTH_ATTACHMENT,gl.TEXTURE_2D,depthTexture,0);else gl.framebufferRenderbuffer(gl.FRAMEBUFFER,gl.DEPTH_ATTACHMENT,gl.RENDERBUFFER,depth);
 const complete=gl.checkFramebufferStatus(gl.FRAMEBUFFER)===gl.FRAMEBUFFER_COMPLETE;gl.bindFramebuffer(gl.FRAMEBUFFER,null);
 if(!complete)throw Error('设备无法创建实时阴影，请使用轴测或平面视图。');
 const buffer=gl.createBuffer(),position=gl.getAttribLocation(program,'aPosition'),matrix=gl.getUniformLocation(program,'uMatrix');
 return {texture:depthTexture||texture,packed:!nativeDepth,size,matrix:null,
  update(scene,vertices,direction=SUN_DIRECTION){
   this.matrix=sunMatrix(scene,direction);
   gl.bindTexture(gl.TEXTURE_2D,null);gl.bindFramebuffer(gl.FRAMEBUFFER,target);gl.viewport(0,0,size,size);
   gl.enable(gl.DEPTH_TEST);gl.disable(gl.BLEND);gl.disable(gl.CULL_FACE);gl.disable(gl.DITHER);gl.depthMask(true);
   gl.clearColor(1,1,1,1);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);gl.useProgram(program);
   gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(vertices),gl.STATIC_DRAW);
   gl.enableVertexAttribArray(position);gl.vertexAttribPointer(position,3,gl.FLOAT,false,44,0);
   gl.uniformMatrix4fv(matrix,false,this.matrix);gl.drawArrays(gl.TRIANGLES,0,vertices.length/11);
   gl.bindFramebuffer(gl.FRAMEBUFFER,null);
  },
  dispose(){gl.deleteBuffer(buffer);gl.deleteFramebuffer(target);if(depth)gl.deleteRenderbuffer(depth);if(depthTexture)gl.deleteTexture(depthTexture);gl.deleteTexture(texture);gl.deleteProgram(program);}
 };
}
