import test from 'node:test';
import assert from 'node:assert/strict';
import {patterns} from '../data/patterns.js';
import {buildScene,defaults,allowed,encode,decode} from '../model.js';
import {scenarios} from './scenarios.js';
const added=[139,147,185,190,199,200,201,222,223,238,239,242,245,250,251];

test('pilot adds exactly fifteen complete, independently selectable patterns',()=>{
 assert.equal(patterns.length,25);
 assert.deepEqual(patterns.filter(p=>p.batch===2).map(p=>p.id),added);
 for(const p of patterns){
  for(const field of ['zh','question','idea','effect','tradeoff'])assert.ok(p[field]?.length>1);
  assert.ok(p.related.every(id=>allowed.includes(id)));
 }
 assert.deepEqual(decode(encode({...defaults,ids:added})).state.ids,added);
});
test('each new pattern has a scene effect alone and in the fully combined scene',()=>{
 const base=JSON.stringify(buildScene({...defaults,ids:[]}).boxes);
 const full=JSON.stringify(buildScene({...defaults,ids:allowed}).boxes);
 for(const id of added){
  const alone=buildScene({...defaults,ids:[id]});
  assert.notEqual(JSON.stringify(alone.boxes),base,'standalone '+id);
  assert.ok(alone.boxes.some(b=>b.pattern===id),'inspectable effect '+id);
  assert.notEqual(JSON.stringify(buildScene({...defaults,ids:allowed.filter(n=>n!==id)}).boxes),full,'combined '+id);
 }
});
test('lower sill increases glazing downward without moving window heads',()=>{
 const high=buildScene({...defaults,ids:[159]}).boxes.filter(b=>b.kind==='window');
 const low=buildScene({...defaults,ids:[159,222]}).boxes.filter(b=>b.kind==='window');
 assert.equal(high.length,low.length);
 for(let i=0;i<high.length;i++){
  assert.ok(low[i].z<high[i].z);
  assert.ok(Math.abs(low[i].z+low[i].dz-high[i].z-high[i].dz)<1e-9);
 }
});
test('communal eating enlarges the farmhouse table instead of overlaying a second table',()=>{
 const locate=ids=>buildScene({...defaults,ids:[105,...ids]}).boxes.filter(b=>b.x===2.6&&b.y===4.8&&b.z===.84);
 const small=locate([139]),large=locate([139,147]);
 assert.equal(small.length,1);assert.equal(large.length,1);
 assert.ok(large[0].dx*large[0].dy>small[0].dx*small[0].dy);
});
test('reveals, filtering and panes preserve transparent window geometry',()=>{
 const base=buildScene({...defaults,ids:[159]}).boxes.filter(b=>b.kind==='window');
 const framed=buildScene({...defaults,ids:[159,223,238,239]}).boxes;
 assert.deepEqual(framed.filter(b=>b.kind==='window'),base);
 for(const id of [223,238,239])assert.ok(framed.some(b=>b.pattern===id));
});
test('warm colors change surfaces without changing spatial dimensions or area',()=>{
 const plain=buildScene({...defaults,ids:[]}),warm=buildScene({...defaults,ids:[250]});
 const geometry=s=>s.boxes.map(({x,y,z,dx,dy,dz})=>({x,y,z,dx,dy,dz}));
 assert.deepEqual(geometry(plain),geometry(warm));
 assert.equal(plain.metrics.indoorArea,warm.metrics.indoorArea);
 assert.notEqual(plain.boxes.find(b=>b.kind==='wall').color,warm.boxes.find(b=>b.kind==='wall').color);
});
test('expanded test scenarios cover every pair and full/leave-one-out combinations',()=>{
 const rows=scenarios(allowed),keys=new Set(rows.map(ids=>ids.join(',')));
 for(let a=0;a<allowed.length;a++)for(let b=a+1;b<allowed.length;b++)assert.ok(keys.has([allowed[a],allowed[b]].join(',')));
 assert.ok(keys.has(allowed.join(',')));
 for(const id of allowed)assert.ok(keys.has(allowed.filter(n=>n!==id).join(',')));
});
test('farmhouse kitchen stays on the communal side of the privacy partition',()=>{
 const scene=buildScene({...defaults,ids:[105,127,139]});
 const kitchen=scene.boxes.filter(b=>b.pattern===139&&b.z>.88);
 assert.ok(kitchen.length>0);assert.ok(kitchen.every(b=>b.x+b.dx<scene.state.width*.53));
});
