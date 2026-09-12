// The lighting shaders consume position(3), RGBA(4), normal(3), material(1).
export const VERTEX_FLOATS=11;
export function emphasizedColor(item,patternId,enabled){
 const rgb=item.color.slice(1).match(/../g).map(c=>parseInt(c,16)/255);
 const matches=patternId!=null&&(String(item.pattern)===String(patternId)||item.patterns?.some(id=>String(id)===String(patternId)));
 return enabled&&matches?rgb.map((v,i)=>v*.76+[1,.72,.32][i]*.24):rgb;
}

// Each buffer owns its upload lifetime. Binding attributes must follow binding
// the buffer, including after the shadow pass changes WebGL's current buffer.
export function createRenderBuffers(gl,bindAttributes){
 const opaque=gl.createBuffer(),transparent=gl.createBuffer();
 let opaqueCount=0,faces=[],glassData=new Float32Array(0),lastEye=null,glassDirty=true;
 function upload(buffer,data,usage){gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.bufferData(gl.ARRAY_BUFFER,data,usage);}
 function draw(buffer,count){if(!count)return;gl.bindBuffer(gl.ARRAY_BUFFER,buffer);bindAttributes();gl.drawArrays(gl.TRIANGLES,0,count);}
 return {
  update(vertices,nextFaces){
   const data=new Float32Array(vertices);opaqueCount=data.length/VERTEX_FLOATS;
   upload(opaque,data,gl.STATIC_DRAW);
   faces=nextFaces.slice();const length=faces.reduce((sum,face)=>sum+face.vertices.length,0);
   if(glassData.length!==length)glassData=new Float32Array(length);
   glassDirty=true;
  },
  drawOpaque(){draw(opaque,opaqueCount);},
  drawTransparent(eye){
   // Distance sorting is independent of yaw/pitch, so rotations reuse the VBO.
   if(faces.length&&(glassDirty||!lastEye||eye.some((v,i)=>v!==lastEye[i]))){
    const distance=face=>face.center.reduce((sum,v,i)=>sum+(v-eye[i])**2,0);
    faces.sort((a,b)=>distance(b)-distance(a));
    let offset=0;for(const face of faces){glassData.set(face.vertices,offset);offset+=face.vertices.length;}
    upload(transparent,glassData,gl.DYNAMIC_DRAW);lastEye=eye.slice();glassDirty=false;
   }
   draw(transparent,glassData.length/VERTEX_FLOATS);
  },
  dispose(){gl.deleteBuffer(opaque);gl.deleteBuffer(transparent);}
 };
}
