import {World,palette as P} from './primitives.js?v=77ac9ca8ff67';
import {buildUrbanPattern} from './territory-urban.js?v=77ac9ca8ff67';
const bounds={region:[1,7],city:[8,29]};
export function composeTerritory(key,requested){
 const [lo,hi]=bounds[key],ids=[...new Set(requested)].filter(id=>id>=lo&&id<=hi).sort((a,b)=>a-b);
 return key==='region'?region(ids):city(ids);
}
function make(key,width,depth,ids){const w=new World(key,width,depth,ids);w.navigation.speed=5;w.state.patterns={};w.state.layout='shared-spatial-composition';w.state.limitations=['Conceptual spatial composition; no demographic, governance, care, legal or transport compliance simulation.','Territorial distances are compressed.'];w.spawn={x:width/2,y:depth+5,yaw:0,pitch:0,feet:0};return w;}
function mark(w,id,x,y,relation){w.marker(id,x,y,`#${id}`);w.state.patterns[id]={geometry:true,relation};}
function region(ids){
 const w=make('region',120,108,ids),has=id=>ids.includes(id);
 // All regional principles shape the same settlements, cultivated valley and access network.
 let towns=has(2)?[{x:8,y:7,n:5},{x:83,y:7,n:3},{x:8,y:43,n:2},{x:83,y:43,n:2},{x:8,y:78,n:1}]:[{x:8,y:7,n:3},{x:83,y:7,n:3},{x:8,y:78,n:3}];
 if(has(3)&&!has(2))towns=[{x:8,y:7,n:3},{x:83,y:7,n:3},{x:8,y:43,n:3},{x:83,y:78,n:3}];
 const valley={x:43,y:0,w:32,d:108};w.slab(valley.x,valley.y,valley.w,valley.d,has(4)?4:0,P.soil);
 for(let x=46;x<74;x+=4)w.path([[x,2],[x,105]],.5,has(4)?4:0,P.plant);
 if(has(3))for(const y of [32,67]){w.slab(0,y,120,8,3,P.ground);for(let x=3;x<118;x+=8)w.tree(x,y+4,3);}
 const settlements=[];
 for(const [index,t]of towns.entries()){
  const z=has(4)?1.6:0,owner=has(2)?2:0;
  if(z)w.box(t.x-1,t.y-1,0,29,23,z,P.ground,4,'settlement-highland');
  for(let n=0;n<t.n;n++){
   const a=t.x+(n%3)*8,b=t.y+Math.floor(n/3)*8,startB=w.boxes.length,startM=w.meshes.length;
   w.house(a,b,6,5,owner,{floors:index===0?2:1});
   if(z){for(const box of w.boxes.slice(startB))box.z+=z;for(const mesh of w.meshes.slice(startM))for(const p of mesh.points)p[2]+=z;}
  }
  // Civic and productive rooms are located inside each settlement, not separate demonstrations.
  if(has(1)){w.room(t.x+16,t.y+15,8,6,1,{z});const begin=w.boxes.length;w.table(t.x+17,t.y+17,1);for(const b of w.boxes.slice(begin))b.z+=z;}
  if(has(6)){w.room(t.x,t.y+15,12,6,6,{z});w.box(t.x+1,t.y+16,z+.7,3,1,.15,P.wood,6,'local-workbench');}
  if(z)for(let n=0;n<10;n++)w.box(t.x+4,t.y+22+n*.35,0,3,.35,(10-n)*.16,P.stone,4,'step');
  settlements.push({...t,z,localServices:has(6),civicDomain:has(1)});
 }
 // Rural roads border productive land and feed all settlements without occupying the valley.
 const roads=has(5)?[[[4,3],[36,3],[36,102],[4,102],[4,3]],[[79,3],[116,3],[116,102],[79,102],[79,3]],[[36,56],[79,56]]]:[[[36,0],[36,108]],[[79,0],[79,108]],[[36,56],[79,56]]];
 for(const points of roads)w.path(points,has(5)?3:2,has(5)?5:0,P.stone);
 if(has(5))for(const y of [35,70]){w.house(29,y,5,6,5,{floors:1});w.house(110,y,5,6,5,{floors:1});}
 if(has(7)){w.path([[59,108],[59,93],[79,93],[79,56]],1.8,7,P.warm);w.room(84,91,8,6,7);w.bench(85,100,7);for(const x of [80,101,110])w.tree(x,100,7);w.box(60,99,0,.18,.18,2,P.wood,7,'stewardship-waypost');}
 for(const id of ids)mark(w,id,36,10+id*11,'shared settlements, farmland and access network');
 w.state.settlements=settlements;w.state.valley={...valley,protected:has(4)};w.state.regionalRoads=roads;w.state.greenFingers=has(3)?[32,67]:[];
 return w.finish();
}
function city(ids){
 const w=make('city',272,288,ids),has=id=>ids.includes(id);
 const core=has(28)?{x:236,y:35}:{x:128,y:142};
 const lots=[];for(let row=0;row<4;row++)for(let col=0;col<4;col++)lots.push({x:9+col*64,y:14+row*64});
 const reserved=new Set([8,10,12,13,14,15,16,18,19,20,24,25,26,27].filter(has));
 const utilityLots=new Map([...reserved].map((id,i)=>[id,lots[i]]));
 // One shared stock of housing/workplace buildings; density and height rules apply globally.
 const buildings=[];
 for(const [i,lot]of lots.entries()){
  const d=Math.hypot(lot.x+7-core.x,lot.y+5-core.y);
  const desired=has(29)?(d<70?7:d<135?5:2):(has(9)?6:5);
  const floors=has(21)?Math.min(4,desired):desired;
  const owner=has(9)?9:has(29)?29:has(21)?21:0;
  const a=lot.x+35,b=lot.y;
  w.house(a,b,24,20,owner,{floors,roof:false});
  // Height limitation replaces roof mass at the actual capped building elevation.
  w.roof(a-.2,b-.2,24.4,20.4,has(21)?21:has(29)?29:owner,floors*3,.7);
  if(has(9)){w.room(a,b+22,24,8,9);w.table(a+2,b+24,9);w.table(a+13,b+24,9);}
  if(has(29))w.box(a,b+30.1,.12,24,.8,.12,P.stone,29,'density-frontage');
  buildings.push({index:i,x:a,y:b,floors,requestedFloors:desired,uses:has(9)?['housing','workplace']:['housing'],distanceToCore:d});
 }
 // Auxiliary public uses occupy the free half of the same mixed city blocks.
 for(const [id,lot]of utilityLots){
  buildUrbanPattern({w,id,x:lot.x,y:lot.y,s:28});
 }
 // The active urban nucleus and outward density distribution share the same centre.
 w.slab(core.x-7,core.y-7,14,14,has(28)?28:has(10)?10:0,P.stone);
 w.pergola(core.x-6,core.y-5,5,4,has(28)?28:0);w.bench(core.x-5,core.y+4,has(28)?28:0,5);
 // Rebuild the single transport skeleton rather than adding another isolated road example.
 let roads;
 if(has(23))roads=[7,71,135,199,263].map(y=>[[0,y],[272,y]]);
 else if(has(11))roads=[[[0,7],[272,7]],[[0,263],[272,263]],[[4,7],[4,263]],[[260,7],[260,263]],[[68,7],[68,49]],[[196,263],[196,221]]];
 else roads=[[[0,7],[272,7]],[[0,135],[272,135]],[[0,263],[272,263]],[[4,7],[4,263]],[[132,7],[132,263]],[[260,7],[260,263]]];
 const roadId=has(23)?23:has(11)?11:0;
 for(const p of roads)w.path(p,4,roadId,P.metal);
 if(has(23)){for(const [n,y]of [7,71,135,199,263].entries()){const dir=n%2?-1:1;for(const x of [110,218])w.triangle([x+dir*1.5,y,.04],[x-dir*1.5,y-1,.04],[x-dir*1.5,y+1,.04],P.warm,23,'one-way-arrow');}w.state.cityRoadDirections=['east','west','east','west','east'];}
 if(has(23))for(const x of [68,196])for(const y of [7,135])w.path([[x,y],[x,y+35]],2.5,23,P.metal);
 for(const x of [4,68,132,196,260])w.path([[x,0],[x,285]],1.6,has(11)?11:0,P.stone);
 if(has(17)){w.path([[270,0],[270,288]],5,17,P.metal);for(let y=5;y<280;y+=8)w.box(264,y,0,2,5,1.8,P.ground,17,'noise-berm');}
 const parking=[];
 for(const x of [10,74,138,202]){const width=has(22)?5:19,depth=has(22)?6:12;w.slab(x,274,width,depth,has(22)?22:0,P.metal);for(let n=0;n<(has(22)?2:7);n++)w.box(x+.4+n*2.5,275,0,1.8,4,1.3,P.wood,has(22)?22:0,'parked-car');parking.push({x,y:274,width,depth});}
 for(const id of ids){const lot=utilityLots.get(id),point=lot?[lot.x+14,lot.y+29]:id===22?[20,282]:[28,29,10].includes(id)?[core.x,core.y]:id===23?[132,135]:id===17?[268,150]:[buildings[0].x+12,buildings[0].y+33];mark(w,id,...point,'shared mixed city blocks and transport skeleton');}
 if(ids.length===1&&utilityLots.has(ids[0])){const focus=utilityLots.get(ids[0]);w.spawn={x:focus.x+14,y:focus.y+31,yaw:0,pitch:0,feet:0};w.overview={x:focus.x+42,y:focus.y+48,z:30,yaw:-.6,pitch:-.6};}
 w.state.cityBuildings=buildings;w.state.core=core;w.state.cityRoads=roads;w.state.parkingArea=parking.reduce((a,p)=>a+p.width*p.depth,0);w.state.heightLimit=has(21)?4:null;w.state.patterns[29]&&(w.state.patterns[29].relation='density derives from the same active core');
 return w.finish();
}
