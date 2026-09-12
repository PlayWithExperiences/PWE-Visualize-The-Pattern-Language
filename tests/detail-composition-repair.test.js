import test from 'node:test';
import assert from 'node:assert/strict';
import {buildDetail} from '../world/detail.js';
const all=(a,b)=>Array.from({length:b-a+1},(_,i)=>a+i);
const overlaps=(a,b)=>['x','y','z'].every(k=>Math.min(a[k]+a['d'+k],b[k]+b['d'+k])-Math.max(a[k],b[k])>1e-8);
const area=b=>b.dx*b.dy;

test('room hearth and room-dividing half wall have independent solid volumes',()=>{
 for(const ids of [[181,193],all(179,204)]){
  const s=buildDetail('room',ids),hearth=s.boxes.filter(b=>b.pattern===181),edge=s.boxes.filter(b=>b.pattern===193);
  assert.ok(!hearth.some(a=>edge.some(b=>overlaps(a,b))));
 }
});
test('replacement construction finishes partition area and retain joint ownership',()=>{
 for(const ids of [[205,233],all(205,240)]){
  const s=buildDetail('construction',ids),base=s.boxes.filter(b=>b.pattern===205&&b.kind==='floor'),replacement=s.boxes.filter(b=>(b.patterns??[]).includes(205)&&b.pattern===233);
  assert.equal(replacement.length,3);
  assert.ok(!base.some(a=>replacement.some(b=>overlaps(a,b))));
  assert.ok(Math.abs([...base,...replacement].reduce((sum,b)=>sum+area(b),0)-(11.3*9.3+5.3*5.3))<1e-8,'finish replacement must conserve the authored floor area');
 }
});
test('inhabited column replaces the corner support with shared ownership',()=>{
 for(const ids of [[212,226],all(205,240)]){
  const s=buildDetail('construction',ids),column=s.boxes.find(b=>b.kind==='inhabited-column');
  assert.deepEqual(column.patterns,[226,212]);
  assert.ok(!s.boxes.some(b=>b!==column&&b.kind==='column'&&overlaps(column,b)));
 }
});
test('side roof and door derive elevations from the selected storey and threshold',()=>{
 for(const ids of [[209,210],[206,209,210],all(205,240)]){
  const s=buildDetail('construction',ids),roof=s.meshes.filter(m=>m.pattern===209&&m.kind==='roof'&&m.points.every(p=>p[0]>19));
  assert.ok(roof.length>0);
  assert.ok(roof.every(m=>m.points.every(p=>p[2]>=s.state.structure.upperFloor+2.86-1e-8)));
 }
 for(const ids of [[215,237],[224,237],[215,224,237],all(205,240)]){
  const s=buildDetail('construction',ids),door=s.boxes.filter(b=>b.pattern===237),{doorBase,doorHeight}=s.state.structure;
  assert.ok(Math.abs(Math.min(...door.map(b=>b.z))-doorBase)<1e-8);
  assert.ok(Math.abs(Math.max(...door.map(b=>b.z+b.dz))-doorBase-doorHeight)<1e-8);
  assert.ok(!door.some(a=>s.boxes.some(b=>b.pattern===215&&b.kind==='floor'&&overlaps(a,b))));
 }
});
test('paired bed, kitchen, and window-seat patterns own the same real furniture',()=>{
 const s=buildDetail('room',all(179,204));
 for(const [ids,kind] of [[[187,188],'furniture'],[[184,199],'counter'],[[180,202],'bench']])assert.ok(s.boxes.some(b=>b.kind===kind&&ids.every(id=>b.patterns?.includes(id))));
});
test('finish task lights remain centered on their shared table entities',()=>{
 const s=buildDetail('finish',all(241,253));
 for(const [i,t]of s.state.tables.entries()){assert.equal(s.lights[i].x,t.x+t.width/2);assert.equal(s.lights[i].y,t.y+t.depth/2);}
});

test('window light filter fits below the shared opening header',()=>{
 for(const ids of [[225,238],all(205,240)]){const s=buildDetail('construction',ids),frame=s.boxes.filter(b=>b.kind==='opening-frame'),filter=s.boxes.filter(b=>b.kind==='light-filter');assert.ok(!frame.some(a=>filter.some(b=>overlaps(a,b))))}
});

// Scan actual axis-aligned solid volumes, including the unowned base building.
// Surface contact alone is not an intersection. Each retained overlap has an
// explicit construction relationship; arbitrary furniture/wall pairs cannot pass.
test('full detail solid scans contain only named floor contacts and construction joints',()=>{
 const expectedJoints=new Set([
  '212:column|227:capital', // capital wraps its supporting column
  '0:wall|212:column', // structural column embedded in facade
  '212:column|215:slab-edge', // column foot embedded in edge foundation
  '0:wall|215:floor', '0:wall|215:slab-edge', // raised entrance slab/foundation meets facade
  '0:wall|225:opening-frame', // thickened opening frame wraps wall edge
  '0:wall|249:seam-ornament', '0:wall|249:door-ornament', // shallow attached trim
 ]);
 const groundKinds=new Set(['floor','paving-stone']);
 for(const [key,start,end]of [['room',179,204],['construction',205,240],['finish',241,253]]){
  const s=buildDetail(key,all(start,end)),unexpected=[];
  for(let i=0;i<s.boxes.length;i++)for(let j=i+1;j<s.boxes.length;j++){
   const a=s.boxes[i],b=s.boxes[j];
   if(a.pattern===b.pattern||!overlaps(a,b))continue;
   const common=(a.patterns??[a.pattern]).some(id=>id!==0&&(b.patterns??[b.pattern]).includes(id));
   if(common)continue;
   // Feet, furniture bases, paving supports and wall bottoms contact the
   // thin ground build-up. Two overlapping finishes are never exempted.
   if([a,b].some((q,index)=>groundKinds.has(q.kind)&&q.z+q.dz<=.17+1e-8&&!groundKinds.has([a,b][1-index].kind)))continue;
   const pair=[`${a.pattern}:${a.kind}`,`${b.pattern}:${b.kind}`].sort().join('|');
   if(!expectedJoints.has(pair))unexpected.push({pair,a:[a.x,a.y,a.z],b:[b.x,b.y,b.z]});
  }
  assert.deepEqual(unexpected,[],`${key}: unclassified positive-volume intersections`);
 }
});
