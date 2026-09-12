// Local audit of actual generated worlds; no network or model calls.
import {buildWorld} from '../world/index.js';
import {resolveBoxSurfaces} from '../world/render-surfaces.js';
const groups=[['region',1,7],['city',8,29],['neighborhood',30,74],['institution',75,94],['site',95,126],['plan',127,158],['edge',159,178],['room',179,204],['construction',205,240],['finish',241,253]];
function overlapCount(faces){
 const planes=new Map();let count=0;
 for(const f of faces){const k=f.axis+':'+f.sign+':'+Math.round(f.plane/1e-8),prior=planes.get(k)||[];
  for(const p of prior)if(Math.min(f.u1,p.u1)-Math.max(f.u0,p.u0)>1e-8&&Math.min(f.v1,p.v1)-Math.max(f.v0,p.v0)>1e-8)count++;
  prior.push(f);planes.set(k,prior);
 }
 return count;
}
const results=[];
for(const [group,start,end]of groups){
 const scene=buildWorld(group,Array.from({length:end-start+1},(_,i)=>start+i));
 const boxes=scene.boxes.filter(b=>!b.collisionOnly&&b.kind!=='window'),before=boxes.flatMap(b=>resolveBoxSurfaces([b])),after=resolveBoxSurfaces(boxes);
 const record={group,patterns:scene.applied.length,boxes:boxes.length,rawFaces:before.length,resolvedFaces:after.length,coplanarPairsBefore:overlapCount(before),coplanarPairsAfter:overlapCount(after)};results.push(record);
 if(record.coplanarPairsAfter)process.exitCode=1;
}
console.log(JSON.stringify({scope:'Ten all-selected worlds; axis-aligned same-facing opaque coplanar surfaces. Not a proof of collision-free layouts, mesh intersections, or architectural semantics.',results},null,2));
