import {World,palette as p} from './primitives.js?v=a8cc37458ddd';
import {finishBuilding,share,note,car,rail} from './building-common.js?v=a8cc37458ddd';
export function buildSite(ids){
 const w=new World('site',48,38,ids),h=id=>w.has(id),any=(...a)=>a.some(h);
 const mainH=h(99)?4:2.8, narrow=any(107,109),mw=narrow?8:12,md=h(109)?12:8,mx=24-mw/2;
 // One entrance canopy serves the selected entrance/roof patterns. Its north
 // edge clears the main eave, including the longer body of pattern 109.
 const entryRoof=any(110,116,117),entryWidth=h(116)?mw+4:h(117)?mw+2:3.4;
 const entryX=24-entryWidth/2,entryY=md+7.31,entryDepth=2.5;
 w.room(mx,7,mw,md,0,{height:mainH,roof:false,openNorth:h(101)});
 w.roof(mx-.3,6.7,mw+.6,md+.6,0,mainH+.12,h(117)?2.1:1.2);
 share(w,[99,107,109],0,0);
 if(any(95,100,102,107,108,115,116,119,122)){
  const s=w.boxes.length,m=w.meshes.length;
  w.room(3,9,10,6,95,{roof:false});w.roof(2.7,8.7,10.6,6.6,95,2.92,.85);
  w.room(35,9,10,6,95,{roof:false});w.roof(34.7,8.7,10.6,6.6,95,2.92,.85);
  share(w,[95,100,102,107,108,115,116,119,122],s,m);
 }
 w.path([[24,35],[24,md+8]],2.2);w.spawn={x:24,y:md+10,yaw:0,pitch:0,feet:0};w.navigation.speed=4;
 if(h(96)){w.room(18,0,12,5,96,{roof:false});w.room(18,0,12,5,96,{roof:false,z:3.2,sideDoor:true});w.roof(17.7,-.3,12.6,5.6,96,6.12,1);w.steps(31,-4,2,20,96,.16,.3);w.slab(30,2,3,4.5,96,p.stone,3.2);w.slab(18,5,12,1.5,96,p.wood,3.2);rail(w,18,6.4,12,96,3.32);w.path([[33,-5],[35,-5],[35,7],[32,20],[24,22]],1.5,96);w.state.program={illustrativeArea:120,stories:2,openGroundRetained:true,heightLimitStories:h(21)?4:null};}

 if(any(97,103,113)){const s=w.boxes.length,m=w.meshes.length;for(const x of h(103)?[2,7,38,43]:[2,5,8]){car(w,x,29,97);w.slab(x-.1,28.8,2,4.1,97);};if(h(97))for(let x=1;x<11;x+=2)w.planter(x,27,1.8,.6,97);if(h(103))for(const x of [1,10,37,46])w.tree(x,32,103,.8);share(w,[97,103,113],s,m);}
 if(h(98)){for(const [x,y,ww]of [[21,32,6],[22,25,4],[23,h(109)&&entryRoof?entryY+entryDepth+.5:20,2]]){w.box(x,y,0,.15,.15,2.6,p.wood,98);w.box(x+ww,y,0,.15,.15,2.6,p.wood,98);w.box(x,y,2.6,ww,.15,.16,p.wood,98);}w.state.arrivalRealms=['公共到达','院落','主入口'];}
 if(h(99)){const s=w.boxes.length,m=w.meshes.length;w.box(mx+.3,7.2,mainH-.5,mw-.6,.3,.3,p.warm,99,'clerestory');w.path([[24,35],[24,md+7]],3,99);share(w,[99],s,m);}
 if(any(100,102,108,115,119,122)){
  const s=w.boxes.length,m=w.meshes.length,streetY=entryY+1.1;
  w.path([[8,15],[8,streetY],[40,streetY],[40,15]],2.2,100);w.path([[24,md+7],[24,streetY]],2.2,100);
  if(any(102,108,119)){
   const cover=(x,y,width,depth)=>{w.pergola(x,y,width,depth,119,2.5);w.box(x,y,2.64,width,depth,.12,p.roof,119,'ceiling');};
   // The arcade meets the shared central canopy, never drawing through it.
   if(entryRoof){cover(6.5,entryY,entryX-6.5,2.2);cover(entryX+entryWidth,entryY,41.5-entryX-entryWidth,2.2);}
   else cover(6.5,entryY,35,2.2);
   // Returns keep both side entrances connected when the main body lengthens.
   if(entryY>15.31)for(const x of [6.5,39.3])cover(x,15.31,2.2,entryY-15.31);
  }
  share(w,[100,102,108,115,119,122],s,m);
 }
 if(h(101)){w.path([[24,0],[24,md+9]],2.4,101);w.bench(mx+.5,10,101);w.box(mx+mw-1,9,0,.5,3,.8,p.wood,101,'display');}
 if(h(104)){w.tree(5,22,104,1.3);w.path([[8,20],[8,24],[12,26]],1.4,104);w.box(36,3,0,8,3,.04,p.soil,104,'repair-ground');w.state.siteRepair={retainedTree:[5,22],builtOnLessValuedGround:[24,11]};}
 if(h(105)){if(h(121)){w.slab(17,23,13,2,105,'#d5cbaa');w.slab(24,25,6,4,105,'#d5cbaa');}else w.slab(17,23,13,6,105,'#d5cbaa');const start=w.boxes.length;w.bench(18,26,105,2,.12);if(h(121))share(w,[105,121],start,w.meshes.length);w.state.orientation={north:'-y',south:'+y',hemisphere:'northern illustrative only'};}
 if(h(106)){w.wall(15,23,.25,6,1,106);w.wall(15,23,5,.25,1,106);w.pergola(28,23,3,6,106);}
 if(any(107,109)){const s=w.boxes.length;w.box(mx+.4,9,.12,1.8,.6,.75,p.wood,h(107)?107:109,'worktop');share(w,[107,109],s,w.meshes.length);w.state.wingDepth=mw;}
 if(entryRoof){
  const s=w.boxes.length,m=w.meshes.length,id=h(110)?110:h(116)?116:117;
  w.pergola(entryX,entryY,entryWidth,entryDepth,id,2.5);
  if(any(116,117))w.roof(entryX,entryY,entryWidth,entryDepth,id,2.64,h(117)?.8:.45);
  else w.box(entryX,entryY,2.64,entryWidth,entryDepth,.12,p.roof,id,'ceiling');
  share(w,[110,116,117,...(any(102,108,119)?[102,108,119]:[])],s,m);
 }
 if(h(111)){const x=h(118)?46:32;w.wall(x,23,.2,7,1.7,111);w.planter(x+2,23,7,.7,111);w.bench(x+3,26,111);w.path([[24,30],[x-2,31],[x+3,31],[x+3,28]],1.3,111);}
 if(h(112)){w.path([[24,35],[27,32],[27,29],[24,26]],1.6,112,p.wood);w.pergola(26,29,2,3,112);w.planter(28.2,29,.6,3,112);}
 if(h(113))w.path([[6,33],[14,33],[24,30],[24,md+8]],1.5,113);
 if(h(114)){w.wall(8,23,3,.2,1,114);w.wall(8,23,.2,3,1,114);w.bench(8.4,23.4,114);w.path([[10,26],[17,28],[24,33]],1.4,114);}
 if(h(115)){w.bench(12,20.8,115,2);w.path([[8,16],[8,20],[24,20],[40,20],[40,16]],2.2,115);}
 if(h(116))w.state.roofHierarchy=[mainH+.12+(h(117)?2.1:1.2),3.77,2.64+(h(117)?.8:.45)];
 if(h(117))w.bench(entryX+.5,entryY+.5,117);
 if(h(118)){w.room(35,22,9,7,118,{roof:false,height:2.76});w.slab(34.8,21.8,9.4,7.4,118,p.stone,2.88);w.steps(45,16.4,2,18,118,.16,.3);w.slab(44,21.8,3,1.6,118,p.stone,2.88); const plantStart=w.boxes.length;w.planter(39,27,3,.6,118);for(const b of w.boxes.slice(plantStart))b.z+=3;rail(w,35,29,9,118,3);w.bench(36,25,118,1.5,3);w.state.roofAccess={rise:2.88,steps:18,landing:[44,21.8]};}
 if(h(120)){w.tree(13,33,120);w.bench(15,33,120);w.path([[24,35],[15,34],[13,33]],1.5,120);}
 if(h(121)){w.path([[24,31],[20,27],[24,22]],2,121);const start=w.boxes.length;w.slab(17,25,7,4,121,h(105)?'#d5cbaa':p.stone);if(h(105))share(w,[105,121],start,w.meshes.length);else w.bench(17.5,25.4,121,1.5,.12);}
 if(h(123)){w.slab(2,35,8,3,123);for(let x=2.5;x<9;x+=2)w.chair(x,35.5,123);w.state.capacity={seats:4,illustrativeArea:24,occupancyMeasured:false};}
 if(h(124)){for(const x of [2,39]){const y=x===39&&h(118)?34:21;w.wall(x,y,5,.2,1.2,124);w.wall(x,y,.2,3,1.2,124);w.bench(x+.5,y+.4,124,2);}}
 if(h(125))w.steps(15,36,15,3,125,.16,.65);
 if(h(126)){const x=h(112)?30:28,y=h(112)?33.2:32;w.tree(x,y,126,1.2);w.bench(x+1.5,y,126);w.path([[24,35],[24,30]],2,126);}
 const positions={95:[8,16],96:[24,5],97:[6,28],98:[24,32],99:[24,md+7],100:[15,20],101:[24,10],102:[8,16],103:[40,33],104:[5,22],105:[23,26],106:[16,25],107:[mx,11],108:[14,17],109:[24,11],110:[24,md+8],111:[h(118)?49:35,27],112:[27,31],113:[14,33],114:[10,25],115:[24,20],116:[24,md+7],117:[mx+1,md+8],118:[45,17],119:[30,entryY+1.1],120:[13,33],121:[20,27],122:[8,16],123:[6,36],124:[4,22],125:[20,36],126:[h(112)?30:28,h(112)?33.2:32]};
 const labels=['建筑群','楼层与开放地','隐蔽停车','到达领域','主体建筑','步行建筑街','穿堂捷径','入口家族','小停车组','场地修复','南向户外','积极室外空间','狭窄采光翼','连接建筑','细长建筑','可见主入口','半隐花园','入口过渡','车到主入口','室外空间层级','生活庭院','层叠屋顶','庇护屋顶','可达屋顶花园','连续拱廊','目标间路径','鼓起的路径','建筑界定街道','人数与尺度','边缘活动口袋','坐阶','偏心焦点'];
 const observations=["三个有独立入口的建筑围绕共同步行联系展开，主屋与两侧小屋可分别进入。", "北侧两层楼面保留南侧开放地；外楼梯和上层平台让层数成为可实际到达的空间。", "停车置于侧边，低种植屏障介于车辆与共同庭院之间。", "从宽门架到窄门架依次通过三层到达领域。", "共享主屋的屋顶高于两翼，主要路径朝它的入口展开。", "两翼入口直接接到横向步行街，主入口从中部接入。", "主屋南北两端打开，穿堂路径贯通而陈列留在侧面。", "两翼入口处于同一可见的有顶联系上。", "车辆分成左右两小组，中间以庭院和植栽留出间隔。", "西侧成熟树木保留，路径绕树连接；维修地面与保留地面用不同材质表达。", "主屋南侧增设可坐的活动地坪；此朝向仅是北半球示意。", "矮墙和廊架把剩余空地围成有开口的户外房间。", "主屋减小横向进深，并以可进入的较窄两翼增加临外边界。", "两翼通过连续有顶联系接入主屋前的公共路径。", "主屋改成长而窄的可进入体量，共享入口仍位于序列端部。", "门前突出的有顶门廊使入口从到达方向可辨认。", "侧花园由高屏墙部分遮挡，但入口路径仍能绕入。", "折线路径、木地面、植栽和藤架形成前门前的过渡。", "停车后的连续路径绕到主入口，而非通向后勤侧门。", "背靠矮墙的小坐角通过路径朝向较大的共同庭院。", "两翼和主屋入口共同接入庭院，入口边保留有顶停留处。", "主屋大屋顶、两翼小屋顶和低门廊形成递降层级。", "真实坡屋顶和降低的前檐包围入口座位。", "18级外楼梯接屋面平台，屋顶座位和种植盆真实位于上层。", "覆盖步行路径的连续低屋顶连接左右建筑。", "路径连接一棵树、旁侧座位和入口；目标附近留有停留地面。", "路径中段扩大为坐下空间，两端收窄接回通行路线。", "两翼的入口正面面向同一公共路径，形成清楚街道边缘。", "24平方米的小平台放置四席，表达按日常人数选择尺度；未估算真实人流。", "两处部分围合的座位口袋贴着庭院边缘，路径从旁通过。", "三道宽坐阶朝向公共活动地面，并可以逐级走上。", "树和座位偏在主通路东侧，保持直行空间而形成稳定焦点。"];
 for(let id=95;id<=126;id++)note(w,id,...positions[id],labels[id-95],observations[id-95]);
 return finishBuilding(w);
}
