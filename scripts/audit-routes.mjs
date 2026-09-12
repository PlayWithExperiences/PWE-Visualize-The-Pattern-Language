// Local route-clearance check. This validates declared paths/corridors, not every
// possible destination, road-vehicle turning envelope, or accessibility code.
import {buildWorld} from '../world/index.js';
import {auditRoutes} from '../world/route-audit.js';
const groups=[['region',1,7],['city',8,29],['neighborhood',30,74],['institution',75,94],['site',95,126],['plan',127,158],['edge',159,178],['room',179,204],['construction',205,240],['finish',241,253]];
const results=groups.map(([group,start,end])=>{const scene=buildWorld(group,Array.from({length:end-start+1},(_,i)=>start+i)),issues=auditRoutes(scene);return {group,routes:scene.routes.length,issues};});
if(results.some(r=>r.issues.length))process.exitCode=1;
console.log(JSON.stringify({scope:'Ten all-selected worlds; declared path centrelines with 0.6m walking clearance, continuous step height, and ground bounds. Exact traversal regression fixtures additionally use movePlayer in both directions.',results},null,2));
