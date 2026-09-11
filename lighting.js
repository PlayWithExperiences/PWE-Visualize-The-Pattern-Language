// Lighting is illustrative daylight, not a site/date-based daylight analysis.
export const SUN_DIRECTION=[-.48,.67,.57];
export function multiply(a,b){
 const out=new Float32Array(16);
 for(let col=0;col<4;col++)for(let row=0;row<4;row++)for(let k=0;k<4;k++)out[col*4+row]+=a[k*4+row]*b[col*4+k];
 return out;
}
export function sunMatrix(scene,direction=SUN_DIRECTION){
 const base=scene.boxes.find(b=>b.kind==='ground');
 const height=Math.max(3,...scene.boxes.map(b=>b.z+b.dz),...(scene.meshes||[]).flatMap(m=>m.points.map(p=>p[2])));
 const center=[base.x+base.dx/2,scene.navigation?.world?height/2:1,base.y+base.dy/2];
 const radius=Math.hypot(base.dx,base.dy,height)/2+3,reach=Math.max(40,radius*1.5);
 const length=Math.hypot(...direction),back=direction.map(x=>x/length);
 const eye=center.map((x,i)=>x+back[i]*reach);
 const rightLength=Math.hypot(back[2],back[0]),right=rightLength<1e-6?[1,0,0]:[back[2]/rightLength,0,-back[0]/rightLength];
 const up=[back[1]*right[2],back[2]*right[0]-back[0]*right[2],-back[1]*right[0]];
 const dot=(a,b)=>a.reduce((sum,x,i)=>sum+x*b[i],0);
 const view=[right[0],up[0],back[0],0,right[1],up[1],back[1],0,right[2],up[2],back[2],0,-dot(right,eye),-dot(up,eye),-dot(back,eye),1];
 const near=.1,far=Math.max(90,reach+radius*2);
 return multiply([1/radius,0,0,0,0,1/radius,0,0,0,0,-2/(far-near),0,0,0,-(far+near)/(far-near),1],view);
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
uniform vec2 uShadowTexel;
uniform vec3 uEye;
uniform vec3 uSunDirection;
uniform vec3 uSkyColor;
uniform vec3 uSunColor;
uniform float uDaylight;
uniform float uSunStrength;
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
float unpackDepth(vec4 rgba){return dot(rgba,vec4(1.0/16777216.0,1.0/65536.0,1.0/256.0,1.0));}
float visibility(vec3 normal){
 vec3 p=vShadow.xyz/vShadow.w*.5+.5;
 if(p.x<=0.0||p.x>=1.0||p.y<=0.0||p.y>=1.0||p.z>=1.0)return 1.0;
 float bias=.00015+.00055*(1.0-max(0.0,dot(normal,uSunDirection)));
 float lit=0.0;
 for(int x=-1;x<=1;x++)for(int y=-1;y<=1;y++){
  float depth=unpackDepth(texture2D(uShadow,p.xy+vec2(float(x),float(y))*uShadowTexel*1.2));
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
 albedo*=.975+.05*n;
 if(vMaterial>1.5&&vMaterial<2.5){
  float grain=noise(vec3(vWorld.x*3.0,vWorld.y*50.0,vWorld.z*3.0));
  albedo*=.92+.14*grain;
 }
 float sunlight=visibility(normal)*max(dot(normal,uSunDirection),0.0)*uSunStrength;
 float hemisphere=normal.y*.5+.5;
 vec3 ambient=mix(vec3(.26,.235,.20),vec3(.42,.47,.52),hemisphere);
 ambient*=.025+.975*uDaylight;
 vec3 localLight=vec3(0.0);
 for(int i=0;i<8;i++){
  vec3 delta=uLampPosition[i].xyz-vWorld;float distance=length(delta);
  float falloff=pow(max(0.0,1.0-distance/max(.01,uLampPosition[i].w)),2.0);
  localLight+=uLampColor[i]*falloff*max(.12,dot(normal,normalize(delta+vec3(.0001))));
 }
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
 float fog=clamp((vDistance-22.0)/80.0,0.0,.3);
 gl_FragColor=vec4(mix(color,uSkyColor,fog),alpha);
}`;
export function createSunlight(gl,compile){
 const vertex=compile(gl.VERTEX_SHADER,'attribute vec3 aPosition; uniform mat4 uMatrix; void main(){gl_Position=uMatrix*vec4(aPosition,1.0);}');
 const fragment=compile(gl.FRAGMENT_SHADER,`precision highp float;
 void main(){vec4 p=fract(gl_FragCoord.z*vec4(16777216.0,65536.0,256.0,1.0));p-=p.xxyz*vec4(0.0,1.0/256.0,1.0/256.0,1.0/256.0);gl_FragColor=p;}`);
 const program=gl.createProgram();gl.attachShader(program,vertex);gl.attachShader(program,fragment);gl.linkProgram(program);
 if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw Error('日光阴影初始化失败。');
 gl.deleteShader(vertex);gl.deleteShader(fragment);
 const size=Math.min(2048,gl.getParameter(gl.MAX_TEXTURE_SIZE),gl.getParameter(gl.MAX_RENDERBUFFER_SIZE));
 const texture=gl.createTexture();gl.bindTexture(gl.TEXTURE_2D,texture);
 gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,size,size,0,gl.RGBA,gl.UNSIGNED_BYTE,null);
 gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.NEAREST);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.NEAREST);
 gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);
 const depth=gl.createRenderbuffer();gl.bindRenderbuffer(gl.RENDERBUFFER,depth);gl.renderbufferStorage(gl.RENDERBUFFER,gl.DEPTH_COMPONENT16,size,size);
 const target=gl.createFramebuffer();gl.bindFramebuffer(gl.FRAMEBUFFER,target);
 gl.framebufferTexture2D(gl.FRAMEBUFFER,gl.COLOR_ATTACHMENT0,gl.TEXTURE_2D,texture,0);
 gl.framebufferRenderbuffer(gl.FRAMEBUFFER,gl.DEPTH_ATTACHMENT,gl.RENDERBUFFER,depth);
 const complete=gl.checkFramebufferStatus(gl.FRAMEBUFFER)===gl.FRAMEBUFFER_COMPLETE;gl.bindFramebuffer(gl.FRAMEBUFFER,null);
 if(!complete)throw Error('设备无法创建实时阴影，请使用轴测或平面视图。');
 const buffer=gl.createBuffer(),position=gl.getAttribLocation(program,'aPosition'),matrix=gl.getUniformLocation(program,'uMatrix');
 return {texture,size,matrix:null,
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
  dispose(){gl.deleteBuffer(buffer);gl.deleteFramebuffer(target);gl.deleteRenderbuffer(depth);gl.deleteTexture(texture);gl.deleteProgram(program);}
 };
}
