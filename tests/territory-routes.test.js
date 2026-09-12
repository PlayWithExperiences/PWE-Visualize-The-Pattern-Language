import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {buildTerritory} from '../world/territory.js';
import {auditRoutes} from '../world/route-audit.js';
import {movePlayer} from '../walk-physics.js';
const ranges={region:[1,7],city:[8,29],neighborhood:[30,74],institution:[75,94]};
// Read the shipped presets rather than maintaining a different test-only selection.
const source=readFileSync(new URL('../atlas-app.js',import.meta.url),'utf8');
const presets=Function(`return (${source.match(/const presets=(.*);/)[1]})`)();
const regressions={region:[[4],[4,5]],city:[[16],[24],[25],[17],[17,23],[11,17]],neighborhood:[[30],[32],[40],[46],[58],[59],[66],[31,60],[60,67],[38,67]],institution:[[75],[79],[90],[91],[75,79]]};
for(const [key,[lo,hi]]of Object.entries(ranges)){
 const selections=new Map();
 const add=(label,ids)=>selections.set([...ids].sort((a,b)=>a-b).join(','),{label,ids});
 add('full',Array.from({length:hi-lo+1},(_,i)=>lo+i));
 for(const [label,ids]of presets[key])add(label,ids);
 for(const ids of regressions[key])add(`regression ${ids}`,ids);
 for(const {label,ids}of selections.values())test(`${key}: 0.6m authored route clearance, ${label}`,()=>{
  const scene=buildTerritory(key,ids);assert.ok(scene.routes.length>0);
  assert.deepEqual(auditRoutes(scene),[],`${key} ${ids}: route centreline has an obstacle at walking height`);
 });
}
test('regional cultivation stripes are field surfaces, separate from the road network',()=>{
 const w=buildTerritory('region',[4,5]);
 assert.ok(w.boxes.some(b=>b.pattern===4&&b.kind==='floor'&&b.dx===.5&&b.dy===103));
 assert.ok(w.routes.every(r=>r.pattern!==4));
 assert.equal(w.state.regionalRoads[0][1][0],38,'rural ring clears raised western settlements');
});
test('detours retain obstacles and connect to the intended destinations',()=>{
 const home=buildTerritory('institution',[75,79]);
 assert.equal(home.boxes.filter(b=>b.kind==='planter').length,2);
 assert.ok(home.routes.some(r=>r.pattern===75&&r.points.at(-1)[0]===25&&r.points.at(-1)[1]===27));
 const market=buildTerritory('neighborhood',[46]);
 assert.equal(market.boxes.filter(b=>b.kind==='market-stall').length,3);
 assert.ok(market.boxes.filter(b=>b.kind==='market-stall').every(b=>b.collision!==false));
});

test('58 reaches its raised dance deck through the southern steps',()=>{
 const w=buildTerritory('neighborhood',[58]),[x,y]=w.state.patterns[58].parcel;
 let pose={x:x+12,y:y+9,feet:0};
 pose=movePlayer(w.boxes,pose,-8.5,0);pose=movePlayer(w.boxes,pose,0,-2);
 assert.ok(Math.abs(pose.x-(x+3.5))<1e-6&&Math.abs(pose.y-(y+7))<1e-6);
 assert.ok(Math.abs(pose.feet-.36)<1e-6,'player must stand on the deck, not remain stuck at its edge');
});
