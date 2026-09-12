import test from 'node:test';
import assert from 'node:assert/strict';
import {buildDetail} from '../world/detail.js';
import {auditRoutes} from '../world/route-audit.js';
import {canStand,movePlayer} from '../walk-physics.js';

const range=(a,b)=>Array.from({length:b-a+1},(_,i)=>a+i);
const groups=[['room',179,204],['construction',205,240],['finish',241,253]];
const presets={
 room:[[179,180,181,182,185,190,193,200,201],[187,188,189,190,196,198,203,204],[183,184,192,194,199,200]],
 construction:[[221,222,223,225,236,237,238,239,240],[205,209,210,211,212,217,219,229],[207,218,233,234,235,240]],
 finish:[[241,242,243,244,245,246,247],[248,249,250,251,252,253]],
};
function combinations(key,a,b){
 const ids=range(a,b),sets=[[],ids,...presets[key],...ids.map(id=>[id])];
 for(let i=0;i<ids.length;i++)for(let j=i+1;j<ids.length;j++)sets.push([ids[i],ids[j]]);
 return sets;
}
function walk(scene,points,label,feet=0){
 let pose={x:points[0][0],y:points[0][1],feet};
 assert.ok(canStand(scene.boxes,pose.x,pose.y,pose.feet),`${label}: blocked start`);
 for(const [x,y]of points.slice(1)){
  pose=movePlayer(scene.boxes,pose,x-pose.x,y-pose.y);
  assert.ok(Math.hypot(x-pose.x,y-pose.y)<.025,`${label}: expected ${x},${y}; stopped at ${pose.x},${pose.y}, feet ${pose.feet}`);
 }
 return pose;
}
function corridors(key,ids){
 if(key==='room'){
  const door=ids.includes(196)?23.8:20.8;
  return [
   ['work door',[[14,23],[14,11],[door,11],[door,8],[22,8]]],
   ['sleep entrance',[[14,23],[14,11],[12,9],[12,7],[7,7]]],
   ...(ids.includes(195)?[['stair and landing',[[14,23],[14,11],[13.9,2.65],[15.5,2.65],[15.5,9.3]],2.7]]:[]),
  ];
 }
 if(key==='construction')return [
  ['main door',[[16,21],[15.7,21],[15.7,14]]],
  ['side room',[[16,21],[16,17],[23,17],[23,12.5]]],
  ...(ids.includes(228)?[['stair and landing',[[16,21],[18.8,21],[18.8,19.4],[20.8,19.4],[20.8,25.2]],2.7]]:[]),
  ...(ids.includes(231)?[['dormer from entrance',[[16,21],[4.5,21],[4.5,-3.6],[7.3,-3.6],[7.3,2],[10,2]],2.5]]:[]),
 ];
 return [
  ['left seating approach',[[10,19],[10,5],[9,5]]],
  ['right seating approach',[[10,19],[10,9],[15,9],[15,5]]],
 ];
}
for(const [key,a,b]of groups)test(`${key}: authored paths and entrance-connected doors/stairs in base, presets, singles, pairs and full scene`,()=>{
 for(const ids of combinations(key,a,b)){
  const scene=buildDetail(key,ids),label=`${key}/${ids.join(',')}`;
  assert.deepEqual(auditRoutes(scene),[],`${label}: obstructed 0.6m path corridor`);
  for(const [index,route]of scene.routes.entries()){
   walk(scene,route.points,`${label}/path ${index}`);
   walk(scene,[...route.points].reverse(),`${label}/return path ${index}`);
  }
  for(const [name,points,minHeight]of corridors(key,ids)){
   const pose=walk(scene,points,`${label}/${name}`);
   if(minHeight)assert.ok(pose.feet>minHeight,`${label}/${name}: did not climb to landing`);
   walk(scene,[...points].reverse(),`${label}/${name} return`,pose.feet);
  }
 }
});

test('column seat leaves the full drawn side-approach width clear',()=>{
 const scene=buildDetail('construction',[226]),route=scene.routes.find(r=>r.points.some(p=>p[0]===23));
 assert.ok(route);const end=23-route.width/2;
 for(const b of scene.boxes.filter(b=>b.pattern===226&&b.kind==='bench'))assert.ok(b.x+b.dx<=end,'seat does not intrude into drawn approach');
});
