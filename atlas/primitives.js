export const colors={ink:'#354a40',muted:'#899489',land:'#dbe3cd',water:'#bdd9de',building:'#e7decd',active:'#c28a60',path:'#bcb6a5',paper:'#f5f2e9',warm:'#e4bd8e',plant:'#8fa982'};
export const esc=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export class Diagram{
 constructor(group,ids,focus=0){this.group=group;this.ids=new Set(ids);this.focus=focus;this.shapes=[];this.notes=[];this.effects=new Set();}
 has(id){return this.ids.has(id);}
 add(kind,attrs,owner=0,label=''){this.shapes.push({kind,attrs,owner,label});if(owner)this.effects.add(owner);}
 rect(x,y,w,h,fill=colors.building,owner=0,label='',extra={}){this.add('rect',{x,y,width:w,height:h,fill,rx:2,...extra},owner,label);if(label)this.text(x+w/2,y+h/2+4,label,owner);}
 circle(x,y,r,fill=colors.active,owner=0,label=''){this.add('circle',{cx:x,cy:y,r,fill},owner,label);if(label)this.text(x,y+4,label,owner);}
 line(x1,y1,x2,y2,owner=0,{stroke=colors.ink,width=2,dash='',arrow=false}={}){this.add('line',{x1,y1,x2,y2,stroke,'stroke-width':width,'stroke-dasharray':dash,...(arrow?{'marker-end':'url(#arrow)'}:{})},owner);}
 path(d,fill='none',owner=0,extra={}){this.add('path',{d,fill,stroke:colors.ink,'stroke-width':2,...extra},owner);}
 text(x,y,text,owner=0,size=12,extra={}){this.add('text',{x,y,fill:colors.ink,'font-size':size,'text-anchor':'middle',...extra},owner,text);}
 note(id,text){this.notes.push({id,text});}
 tree(x,y,id=0,r=15){this.circle(x,y,r,colors.plant,id);this.line(x,y-5,x,y+7,id,{stroke:'#647556',width:2});}
 people(x,y,id=0,count=3){for(let n=0;n<count;n++){this.circle(x+n*14,y,3.5,colors.ink,id);this.line(x+n*14,y+4,x+n*14,y+14,id,{width:3});}}
 seats(x,y,id=0,count=3){for(let n=0;n<count;n++){this.rect(x+n*26,y,18,10,'#b89573',id);this.line(x+n*26,y-3,x+n*26+18,y-3,id);}}
 building(x,y,w,h,id=0,label='',stories=1){this.rect(x,y,w,h,colors.building,id);for(let n=1;n<stories;n++){const yy=y+h*n/stories;if(!label||Math.abs(yy-(y+h/2))>9)this.line(x+3,yy,x+w-3,yy,id,{stroke:'#b2a693',width:1});}if(label)this.text(x+w/2,y+h/2+4,label,id);}
 roof(x,y,w,id=0,height=28){this.path(`M${x},${y} L${x+w/2},${y-height} L${x+w},${y} Z`,'#c9b69b',id);}
 hatch(x,y,w,h,id=0,fill='url(#hatch)'){this.rect(x,y,w,h,fill,id);}
 toSVG(){
 const attrs=a=>Object.entries(a).filter(([,v])=>v!==''&&v!==undefined).map(([k,v])=>`${k}="${esc(v)}"`).join(' ');
 const body=this.shapes.map(s=>{
  const focused=this.focus&&s.owner===this.focus;
  const attr={stroke:s.kind==='text'?'none':colors.ink,'stroke-width':s.kind==='text'?0:1.2,...s.attrs,...(focused&&s.kind!=='text'?{stroke:'#b4532b','stroke-width':2.7}:{}),...(this.focus&&s.owner&&s.owner!==this.focus?{opacity:.85}:{})};
  return `<${s.kind} ${attrs(attr)} data-pattern="${s.owner}">${s.kind==='text'?esc(s.label):''}</${s.kind}>`;
 }).join('');
 return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 640" role="img" aria-label="${esc(this.group)}模式组合示意"><defs><marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10Z" fill="#647264"/></marker><pattern id="hatch" width="9" height="9" patternUnits="userSpaceOnUse"><rect width="9" height="9" fill="#e8dfcf"/><path d="M0,9 L9,0" stroke="#b6a890" stroke-width="1"/></pattern><pattern id="brick" width="28" height="16" patternUnits="userSpaceOnUse"><rect width="28" height="16" fill="#d7ad8d"/><path d="M0,0H28M0,8H28M0,16H28M14,0V8M0,8V16M28,8V16" fill="none" stroke="#f2e4d1"/></pattern></defs><rect width="1000" height="640" fill="#f5f2e9"/>${body}</svg>`;
 }
}
export function pane(d,x,y,w,h,id,{low=false,grid=false}={}){d.rect(x,y,w,h,colors.water,id);if(grid){for(let xx=x+25;xx<x+w;xx+=25)d.line(xx,y,xx,y+h,id,{width:1});d.line(x,y+h/2,x+w,y+h/2,id,{width:1});}if(low)d.line(x-5,y+h+6,x+w+5,y+h+6,id,{width:4});}
export function gateway(d,x,y,id,label='入口'){d.rect(x-22,y-22,8,35,colors.active,id);d.rect(x+14,y-22,8,35,colors.active,id);d.line(x-22,y-22,x+22,y-22,id,{width:5});d.text(x,y+29,label,id,10);}
export function route(d,points,id,{width=4,stroke=colors.path,dash='',arrow=false}={}){d.path(points.map(([x,y],i)=>(i?'L':'M')+x+','+y).join(' '),'none',id,{stroke,'stroke-width':width,'stroke-dasharray':dash,...(arrow?{'marker-end':'url(#arrow)'}:{})});}
