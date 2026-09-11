import {buildScene} from './model.js?v=580c78464447';
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const shade=(hex,k)=>'#'+hex.slice(1).match(/../g).map(c=>Math.min(255,Math.max(0,Math.round(parseInt(c,16)*k))).toString(16).padStart(2,'0')).join('');
export function renderScene(state,{angle=-35,plan=false,cutaway=true,focus=0,labels=true}={}){
 const scene=buildScene(state), rad=angle*Math.PI/180;
 const project=(x,y,z)=>{
  const a=x*Math.cos(rad)-y*Math.sin(rad), b=x*Math.sin(rad)+y*Math.cos(rad);
  return plan?[x,y,-z]:[a,b*.53-z*.85,b*.85+z*.53];
 };
 const faces=[];
 for(const original of scene.boxes){
  let {x,y,z,dx,dy,dz,color,pattern,kind}=original;
  if(kind==='ceiling-panel'&&(plan||(cutaway&&focus!==190)))continue;
  if(plan&&['pergola','canopy'].includes(kind))continue;
  if(cutaway&&['wall','window','partition','alcove','window-trim','filter','mullion'].includes(kind)){
   if(z>=1.2)continue;dz=Math.min(dz,1.2-z);
  }
  const vertices=[[x,y,z],[x+dx,y,z],[x+dx,y+dy,z],[x,y+dy,z],[x,y,z+dz],[x+dx,y,z+dz],[x+dx,y+dy,z+dz],[x,y+dy,z+dz]].map(v=>project(...v));
  const indices=plan?[[4,5,6,7]]:[[0,1,5,4],[1,2,6,5],[2,3,7,6],[3,0,4,7],[4,5,6,7]];
  indices.forEach((ix,i)=>{
   const pts=ix.map(j=>vertices[j]);
   const depth=plan?z+dz:pts.reduce((s,p)=>s+p[2],0)/4;
   faces.push({pts,depth,color:shade(color,plan?1:[.84,.9,.94,.8,1.03][i]),pattern,kind});
  });
 }
 const layer=f=>['ground','floor','garden','path','deck'].includes(f.kind)?0:1;
 faces.sort((a,b)=>layer(a)-layer(b)||a.depth-b.depth);
 const all=faces.flatMap(f=>f.pts), minX=Math.min(...all.map(p=>p[0]))-1,maxX=Math.max(...all.map(p=>p[0]))+1,minY=Math.min(...all.map(p=>p[1]))-1,maxY=Math.max(...all.map(p=>p[1]))+1;
 const viewBox=`${minX} ${minY} ${maxX-minX} ${maxY-minY}`;
 const polygons=faces.map(f=>`<polygon points="${f.pts.map(p=>p.slice(0,2).join(',')).join(' ')}" fill="${f.color}" stroke="${focus&&f.pattern===focus?'#bd5f35':'#747362'}" stroke-width="${focus&&f.pattern===focus?.045:.012}" opacity="${f.kind==='ceiling-panel'?.4:f.kind==='window'?.68:(focus&&f.pattern&&f.pattern!==focus?.7:1)}"/>`).join('');
 const labelText=labels?scene.labels.map(l=>{const p=project(l.x,l.y,l.z);return `<text x="${p[0]}" y="${p[1]}" text-anchor="middle" font-size=".32" fill="#42544c" paint-order="stroke" stroke="#f2efe6" stroke-width=".1">${esc(l.text)}</text>`;}).join(''):'';
 return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}" role="img" aria-label="${plan?'平面图':'可旋转的轴测建筑模型'}：${scene.metrics.selected}个模式，室内示意面积${scene.metrics.indoorArea}平方米"><title>小住宅与庭院 · ${plan?'平面':'轴测'}示意</title>${polygons}${labelText}</svg>`;
}
