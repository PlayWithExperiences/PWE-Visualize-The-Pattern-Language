import {World,palette as p} from './primitives.js?v=92d7972c59b4';
import {finishBuilding,share,note,eastWindow,rail,counter} from './building-common.js?v=92d7972c59b4';
export function buildEdge(ids){
 const w=new World('edge',42,39,ids),h=id=>w.has(id),any=(...a)=>a.some(h);
 w.room(10,8,12,8,0,{roof:false,sideDoor:h(175)});w.roof(9.7,7.7,12.6,8.6,0,2.92,1.5);w.path([[16,21],[16,16]],2);w.path([[3,22],[37,22]],2);w.spawn={x:16,y:20,yaw:0,pitch:0,feet:0};w.navigation.speed=4;
 if(h(159)){w.boxes=w.boxes.filter(b=>!(b.kind==='wall'&&b.x===10&&b.y===8&&b.dx===.2&&b.dy===8));eastWindow(w,10,8,8,159);w.chair(11,13,159);w.state.daylightOpenings=['south','west','north'];}
 if(any(160,161,163)){const s=w.boxes.length,m=w.meshes.length;w.slab(10,16,12,3.5,160,p.wood);w.pergola(10,16,12,3.5,160);w.bench(11,17,160,2);share(w,[160,161,163],s,m);}
 if(h(160)){w.box(10,16,2.65,12,3.5,.1,p.roof,160,'ceiling');w.bench(19,17,160,2);}
 if(h(161)){w.wall(10,16,.15,3.5,1.5,161);w.planter(10.4,19,3,.4,161);w.state.sunnyPlace='南侧挡风座位；日照随地点、季节而变';}
 if(h(162)){w.room(10,3,12,4,162,{roof:false,height:2.5});w.roof(9.7,2.7,12.6,4.6,162,2.62,.6);w.room(11,0,10,2.5,162,{roof:false,height:2.2});w.roof(10.7,-.3,10.6,3.1,162,2.32,.4);w.box(11.5,3.5,.12,3,.7,1,p.wood,162,'storage');w.state.northHeights=[4.42,3.22,2.72];}
 if(h(163)){w.table(18,17,163,1.8,.8);w.chair(18,18.5,163);w.wall(21.8,16,.2,3.5,1.3,163);}
 if(h(164)){w.bench(17,14.7,164,2);w.box(17.2,15.35,.82,2.4,.25,.08,p.wood,164,'window-seat-sill');w.path([[16,22],[20,22]],2,164);}
 if(h(165)){w.boxes=w.boxes.filter(b=>!(b.y>=15.8&&b.y<16.01&&['wall','window'].includes(b.kind)));w.box(10,15.8,.12,.25,.2,2.8,p.wood,165,'post');w.box(21.75,15.8,.12,.25,.2,2.8,p.wood,165,'post');w.box(10,15.8,2.72,12,.2,.2,p.wood,165,'lintel');w.box(10.3,15.8,.12,.08,2.2,2.4,p.wood,165,'folded-panel');counter(w,19,13,165,2);w.box(18,23,.12,2,.7,.8,p.wood,165,'street-display');w.state.openFrontWidth=11.5;}
 if(any(166,167)){// Upper room replaces lower roof locally; the balcony connects directly to its door.
 w.meshes=w.meshes.filter(m=>m.pattern!==0||m.kind==='path');const s=w.boxes.length,m=w.meshes.length;
 w.room(10,8,12,8,166,{roof:false,z:3.2});w.roof(9.7,7.7,12.6,8.6,166,6.12,1.2);w.slab(10,16,12,h(167)?2.6:2,166,p.wood,3.2);
 w.steps(23,10.8,2,20,166,.16,.3);w.slab(22,16.8,3,1.8,166,p.wood,3.2);rail(w,10,h(167)?18.5:17.9,12,166,3.32);w.bench(11,16.4,166,2,3.32);share(w,[166,167],s,m);w.state.balcony={depth:h(167)?2.6:2,door:[16,15.8],floor:3.32,stair:[23,10.8]};}
 if(h(167)){w.box(10,16,3.32,.2,2.6,1.2,p.wall,167,'wall');w.box(11,17.5,3.32,1.4,.65,.72,p.wood,167,'balcony-table');}
 if(h(168)){w.slab(12,19.5,8,1,168,p.stone,.04);w.path([[16,20.5],[16,22],[12,24]],2,168,p.wood);w.box(10,19.7,0,2,.6,.16,p.stone,168,'step');w.planter(19,20,2,.6,168);}
 if(h(169)){for(let n=0;n<3;n++){w.slab(27,25+n*3,10,3,169,p.ground,n*.48);w.wall(27,25+n*3,10,.2,n*.48+.1,169,0);}w.steps(25,25,2,9,169,.16,1);w.slab(25,34,12,2,169,p.stone,1.44);w.state.terraces=[0,.48,.96,1.44];}
 if(h(170)){for(const x of [3,6,9])for(const y of [27,32]){w.tree(x,y,170,.85);for(const dx of [-.45,.4])w.box(x+dx,y,2.1,.18,.18,.18,'#c58a59',170,'fruit');}w.path([[6,23],[6,35]],1.4,170);w.bench(8,34,170);}
 if(h(171)){for(const [x,y]of [[11,28],[14,26],[18,26],[21,28],[21,32]])w.tree(x,y,171,1.15);w.bench(14,28,171,2);w.path([[16,23],[16,29],[20,34]],1.5,171);}
 if(h(172)){for(let n=0;n<24;n++){const x=1+(n*1.73)%9,y=8+(n*2.39)%11;w.box(x,y,0,.35+n%3*.2,.45,.12+(n%4)*.14,n%2?p.plant:'#849976',172,'wild-plant');}w.tree(4,12,172,.8);w.path([[3,22],[6,19],[8,16]],1.1,172);}
 if(h(173)){w.wall(1,24,.25,13,1.7,173);w.wall(1,37,12,.25,1.7,173);w.wall(1,24,3,.25,1.7,173);w.wall(6,24,5,.25,1.7,173);w.path([[5,22],[5,25]],1.5,173);w.state.gardenOpening=[4,24,2];}
 if(h(174)){w.pergola(15,23,2,12,174);w.path([[16,22],[16,36]],1.6,174);for(let y=23;y<35;y+=1.4)w.box(15,y,2.65,2,.55,.1,p.plant,174,'vine');}
 if(h(175)){// Connect through the main room's side portal, then through a greenhouse to the garden.
 w.slab(22,9,7,6,175);for(const x of [22,29])for(const y of [9,15])w.box(x,y,.12,.08,.08,2.5,p.wood,175,'post');
 w.box(22,9,.12,7,.04,2.4,p.glass,175,'window');w.box(22,15,.12,7,.04,2.4,p.glass,175,'window');
 for(const [y,d]of [[9,2.3],[12.7,2.3]])w.box(29,y,.12,.04,d,2.4,p.glass,175,'window');w.box(29,11.3,2.27,.06,1.4,.25,p.wood,175,'lintel');
 w.quad([22,9,2.62],[25.5,9,3.6],[25.5,15,3.6],[22,15,2.62],p.glass,175,'window');w.quad([25.5,9,3.6],[29,9,2.62],[29,15,2.62],[25.5,15,3.6],p.glass,175,'window');
 w.planter(23,9.4,4,.7,175);w.planter(23,13.9,4,.7,175);w.path([[29,12],[32,12],[32,22]],1.4,175);w.state.greenhouseDoors=[[21.8,12],[29,12]];}
 if(h(176)){w.wall(35,10,4,.2,1.4,176);w.wall(38.8,10,.2,5,1.4,176);w.bench(35.5,11,176,2);w.tree(38,16,176);w.path([[35,22],[35,16],[36,13]],1.2,176);}
 if(h(177)){for(const y of [25,28,31]){const vz=h(169)?((y-25)/3)*.48:0;w.box(28,y,vz+.12,7,1.2,.15,p.soil,177,'vegetable-bed');for(let x=28.3;x<35;x+=.5)w.box(x,y+.3,vz+.27,.25,.3,.3,p.plant,177,'vegetable');}counter(w,37,30,177,1.6);w.path([[32,22],[36,24],[36,33]],1.3,177);}
 if(h(178)){for(const [x,color,kind]of [[29,p.wood,'compost-input'],[31.5,p.stone,'managed-treatment'],[34,p.soil,'mature-compost']]){w.box(x,36,0,1.7,1.5,.9,color,178,kind);w.box(x,36,.9,1.7,1.5,.1,p.wood,178,'lid');}w.path([[29.8,35.5],[34.8,35.5],[36,33]],1.2,178);w.state.compostCycle={stages:['分类有机物','需专业管理的处理','成熟物料供种植'],sanitationVerified:false,rawWasteToCrops:false};}
 const positions={159:[11,12],160:[12,17],161:[11,18],162:[16,5],163:[19,18],164:[18,15],165:[16,16],166:[23,11],167:[13,17],168:[16,20],169:[25,25],170:[6,29],171:[16,29],172:[6,16],173:[5,24],174:[16,24],175:[26,12],176:[36,12],177:[32,28],178:[32,36]};
 const labels=['两侧采光','可居住的建筑边缘','避风向阳处','北侧递降','户外起居室','看街窗','向街开放','可居住的廊台','有进深的阳台','连接地面','等高台地','共同果树','树形成的场所','自然混生花园','保护花园的墙','藤架步道','连接住宅的温室','安静园座','菜园','堆肥循环'];
 const observations=["西侧实体墙被替换为有窗台与墙垛的玻璃开口，与南向开窗形成不同方向的采光边界。", "入口前有可走、可坐并带屋顶的有进深边缘。", "南侧座位有挡风侧墙、植栽与遮阴；具体日照需结合场地核验。", "北侧两段服务体量逐级降低，小屋内放储物而非主要起居活动。", "有座位和餐桌的部分围合平台把室内生活延伸到花园。", "临街窗内侧设座位，窗台仍提供低层隐私边界。", "前立面打开成大开口，折叠板收在侧面，街道另一侧设活动陈列。", "真实上层房间的门直接接廊台，廊台通过外楼梯回到地面。", "阳台净设计进深2.6米，部分嵌入侧墙并容纳桌椅，非贴面装饰。", "木、石地面与浅台阶将门前平台逐渐接到花园路径。", "等高台地以低墙保留地面，各级高度差由连续阶梯连接。", "果树沿日常路径成小组，树下设照料与停留可共用的座位。", "树丛围出中心坐处，路径从开口进入而非穿过树干。", "草本、灌木和树木以不同高度混生，只有必要步道保持明确。", "高边墙屏蔽花园外缘，并留下连接公共路径的开口。", "藤架和攀缘植被覆盖连续步道，两侧空间仍可进入。", "温室通过主屋侧门与花园端门贯通，种植台面留在两侧。", "园座背靠屏墙与树木，侧向小径抵达独处位置。", "三组菜畦靠近日常花园路径，边缘设工具台；组合台地时菜畦随标高提升。", "分类输入、专业管理处理和成熟物料分为三个实体环节，不把原始污物直接连到菜园。"];
 for(let id=159;id<=178;id++)note(w,id,...positions[id],labels[id-159],observations[id-159]);
 if(h(167))w.landmarks.find(m=>m.id===167).z=4.82;
 return finishBuilding(w);
}
