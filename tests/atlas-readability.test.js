import test from 'node:test';
import assert from 'node:assert/strict';
import {Diagram} from '../atlas/primitives.js';
import {compose,groups} from '../atlas/compose.js';

test('labels paint above later geometry without reordering the geometry itself',()=>{
 const d=new Diagram('test',[1]);
 d.rect(10,10,100,50,'#fff',1,'房间');
 d.rect(25,25,80,30,'#000',1);
 const svg=d.toSVG();
 assert.ok(svg.indexOf('fill="#fff"')<svg.indexOf('fill="#000"'));
 assert.ok(svg.indexOf('<text ')>svg.indexOf('fill="#000"'));
 assert.match(svg, /paint-order="stroke fill"/);
 assert.match(svg, /stroke-linejoin="round"/);
});

test('every context keeps all captions after its last geometry element',()=>{
 for(const g of groups){
  const ids=Array.from({length:g.to-g.from+1},(_,i)=>g.from+i);
  const svg=compose(g.key,ids).svg;
  const firstText=svg.indexOf('<text ');
  assert.ok(firstText>svg.lastIndexOf('<rect '),g.key);
  assert.ok(firstText>svg.lastIndexOf('<path '),g.key);
  assert.ok(firstText>svg.lastIndexOf('<circle '),g.key);
  assert.ok(firstText>svg.lastIndexOf('<line '),g.key);
 }
});

test('light fields remain translucent so furnishing under them is still visible',()=>{
 for(const [key,ids,id] of [['plan',[130,133,135],135],['finish',[245,252],252]]){
  const fields=compose(key,ids).diagram.shapes.filter(s=>s.owner===id&&s.kind==='circle'&&s.attrs.r>=25);
  assert.ok(fields.length>0);
  for(const field of fields){assert.ok(field.attrs['fill-opacity']>0&&field.attrs['fill-opacity']<.5);assert.equal(field.attrs.stroke,'none');}
 }
});

test('room captions clear their own beds and work surfaces',()=>{
 const d=compose('plan',[136,141,156]).diagram;
 const labels=d.shapes.filter(s=>s.kind==='text'&&[136,141,156].includes(s.owner));
 for(const label of labels){
  const rectangles=d.shapes.filter(s=>s.owner===label.owner&&s.kind==='rect');
  const roomArea=Math.max(...rectangles.map(s=>s.attrs.width*s.attrs.height));
  const furniture=rectangles.filter(s=>s.attrs.width*s.attrs.height<roomArea);
  for(const f of furniture){
   const a=f.attrs,b=label.attrs;
   const intersects=b.x>=a.x&&b.x<=a.x+a.width&&b.y-12<a.y+a.height&&b.y>a.y;
   assert.equal(intersects,false,`${label.owner}: ${label.label} crosses its furniture`);
  }
 }
});


test('plan keeps its common core separate from private and children rooms',()=>{
 const intersects=(a,b)=>a.x<b.x+b.width&&a.x+a.width>b.x&&a.y<b.y+b.height&&a.y+a.height>b.y;
 for(const ids of [[],[137],[136,141,156],[127,128,129,136,137,138,139,143,147]]){
  const rects=compose('plan',ids).diagram.shapes.filter(s=>s.kind==='rect');
  const common=rects.find(s=>s.attrs.width===220&&s.attrs.height===145);
  const placeholder=rects.find(s=>s.attrs.width===150&&s.attrs.height===125);
  assert.ok(common);
  if(ids.includes(136))assert.equal(placeholder,undefined,'explicit partner room replaces placeholder');
  else {assert.ok(placeholder);assert.equal(intersects(common.attrs,placeholder.attrs),false);}
  for(const room of rects.filter(s=>(s.owner===136&&s.attrs.width===190)||(s.owner===137&&s.attrs.width===125)||(s.owner===143&&s.attrs.width===140))){
   assert.equal(intersects(common.attrs,room.attrs),false,`common core overlaps room #${room.owner}`);
  }
 }
});
