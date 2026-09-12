import {World,palette as p} from './primitives.js';
import {finishBuilding,share,note,portal,eastWindow,counter,bookcase,rail} from './building-common.js';
export function buildPlan(ids){
 const w=new World('plan',48,43,ids),h=id=>w.has(id),any=(...a)=>a.some(h);
 w.room(10,8,24,22,0,{roof:false,sideDoor:h(153)});w.roof(9.7,7.7,24.6,22.6,0,3.1,2.2);w.path([[22,33],[22,29]],2.2);w.spawn={x:22,y:32,yaw:0,pitch:0,feet:0};w.navigation.speed=4;
 // Private rooms open onto a shared north passage. Their doors never open into beds.
 const privateRoom=(x,active,bed=false)=>{const used=active.filter(h);if(!used.length)return;const s=w.boxes.length,m=w.meshes.length;w.room(x,9,6,6,used[0],{roof:false,floor:false});if(bed)w.bed(x+.7,10.2,used[0]);share(w,used,s,m);};
 privateRoom(11,[127,136,138,141],any(136,138));privateRoom(19,[127,137,143],false);privateRoom(27,[127,144,145],false);
 if(h(127)){w.path([[22,30],[22,24],[25.6,19],[25.6,16],[14,16]],1.4,127,p.wood,.13);w.wall(16.8,20,.15,4,1.4,127);w.state.privacyGradient=['入口','共享起居','侧向过道','私人床位'];}
 if(h(128)){w.bench(27,28,128,2);w.box(27,28.8,.12,3,.6,.03,p.warm,128,'sun-location');w.state.orientation={south:'+y',east:'+x',sunSimulation:false};}
 if(any(129,139,147)){const s=w.boxes.length,m=w.meshes.length;w.table(20,20,129,3,1.2);for(const x of [20,21.2,22.4]){w.chair(x,19,129);w.chair(x,22,129);}share(w,[129,139,147],s,m);w.state.sharedDiningTables=1;}
 if(h(129))w.path([[22,29],[25,26],[25,19],[25,16]],1.3,129,p.stone,.13);
 if(h(130)){w.pergola(19.7,29.8,4.6,2.7,130);w.box(19.7,29.8,2.64,4.6,2.7,.12,p.roof,130,'ceiling');w.bench(19,27,130);counter(w,24,27,130,1);}
 if(h(131)){portal(w,11,24,10,131);portal(w,23,24,10,131);w.path([[15,25],[15,19],[25,19],[28,25]],1.4,131,p.wood,.13);w.state.sharedRoomLoop=[[15,25],[15,19],[25,19],[28,25]];}
 if(h(132)){w.wall(11,17,7,.15,1.1,132);w.bench(11.5,16,132);bookcase(w,15,16,132);w.path([[14,15.2],[18,15.7],[25,15.7]],1.2,132,p.stone,.13);}
 if(any(133,158)){const s=w.boxes.length,m=w.meshes.length;w.steps(35,31,2.2,20,133,.16,.3);w.slab(34,37,3.2,3,133,p.stone,3.2);w.room(28,34,6,6,133,{z:3.2,roof:false,sideDoor:true});w.roof(27.7,33.7,6.6,6.6,133,6.12,1);rail(w,34,39.9,3.2,133,3.32);share(w,[133,158],s,m);w.state.upperAccess={steps:20,rise:3.2,landing:[35,37],door:[33.8,37]};}
 if(h(133)){w.steps(34.5,30.4,3.2,2,133,.16,.3);w.bench(31,31,133);}
 if(h(134)){w.wall(11,18,2,.2,2.7,134);w.wall(14,18,2,.2,2.7,134);w.wall(13,18,1,.2,.8,134);w.wall(13,18,1,.2,.6,134,2.22);w.tree(13.5,3,134);w.path([[17,19],[13.5,19]],1.2,134,p.stone,.13);}
 if(h(135)){w.box(19,26,2.5,5,3,.1,p.wood,135,'ceiling');for(const [x,y]of [[22,28],[25,19],[18,16]]){w.box(x,y,2.85,.7,.7,.08,p.warm,135,'emissive');w.light(x+.35,y+.35,2.8,135,{intensity:1.8,radius:4});}w.state.lightSequence='顶棚暗段与入口、转折处局部点光；未作照度验算';}
 if(h(136)){w.chair(15,12.5,136,1);w.wall(17,12,.15,2,1.7,136);}
 if(h(137)){w.box(21,12,.15,1.4,1.4,.06,p.warm,137,'play-mat');w.path([[22,15],[25,16],[31,18],[36,18],[40,18]],1.4,137);w.box(39,17,.15,2,2,.3,p.soil,137,'sand-play');}
 if(h(138)){// Replace the bedroom east wall with a real glazed opening.
 w.boxes=w.boxes.filter(b=>!(b.kind==='wall'&&b.x===16.8&&b.y===9&&b.dy===6));eastWindow(w,16.8,9,6,138);w.box(14,10,.63,.6,1.4,.02,p.warm,138,'bed-orientation');}
 if(h(139)){counter(w,29,19,139,3);counter(w,32.3,20,139,.7);w.box(29.2,19.1,.92,.8,.45,.03,p.metal,139,'sink');}
 if(h(140)){w.slab(16,30,12,3,140,p.wood,.16);w.steps(21,33,2,1,140,.16,.3);w.wall(16,32.8,4,.2,.8,140,.28);w.wall(24,32.8,4,.2,.8,140,.28);w.bench(17,31,140,2,.28);}
 if(h(141)){bookcase(w,11.5,13.8,141);w.table(14.5,10,141,1.4,.65);w.chair(14.8,11.2,141);}
 if(h(142)){for(const [x,y,v]of [[12,27,1],[17,20,0],[25,12,2]])w.chair(x,y,142,v);w.wall(11,26,3,.15,1.4,142);w.wall(11,26,.15,2,1.4,142);}
 if(h(143)){w.bed(19.5,9.8,143,.9);w.bed(23.1,9.8,143,.9);for(const x of [20.5,22.8])w.box(x,9.5,.12,.06,2.8,1.8,p.warm,143,'curtain');w.box(21,12.7,.12,1.5,1.5,.06,p.warm,143,'play-mat');}
 if(h(144)){w.box(27.6,10,.12,2.1,1,.45,p.stone,144,'bath');w.box(27.8,10.2,.57,1.7,.6,.04,p.water,144,'water');counter(w,30.5,10,144,1.4);w.box(31,12,.12,.6,.8,.4,p.stone,144,'toilet');}
 if(h(145)){bookcase(w,28,13.9,145,3);w.box(28,14,.2,1,.22,.36,p.soil,145,'storage-box');w.box(29.5,14,.8,1,.22,.35,p.soil,145,'storage-box');w.state.bulkStorageVolume=3*.3*1.8;}
 if(any(146,148,151,152)){const s=w.boxes.length,m=w.meshes.length;w.room(1,9,7,7,146,{roof:false,sideDoor:true});w.roof(.7,8.7,7.6,7.6,146,2.92,.8);w.path([[8,12.5],[10,12.5],[10,19],[22,29]],1.5,146);share(w,[146,148,151,152],s,m);}
 if(h(146)){for(const x of [2,4.5,7])w.box(x,10,.12,.12,.12,2.7,p.wood,146,'post');w.wall(2,13,2,.12,1.1,146);w.table(2,11,146,1.4,.6);w.state.officeBays='柱列与可调整低隔断';}
 if(h(147)){counter(w,26.5,21,147,1.5);w.box(26.7,21.1,.92,.45,.3,.25,p.warm,147,'serving');}
 if(h(148)){for(const x of [2,5.5]){w.table(x,13.7,148,1.5,.65);w.chair(x+.4,12.8,148);}w.state.workGroups=[2,2];}
 if(h(149)){w.chair(24,28,149,1);w.chair(26,28,149);counter(w,28,27,149,1.5);w.box(28.1,27.1,.92,.35,.3,.3,p.warm,149,'hospitality');w.state.receptionPassageClear=true;}
 if(h(150)){w.chair(12,22,150,1);bookcase(w,11,21,150);w.table(28,24.7,150,1.4,.6);w.chair(30,25,150);}
 if(h(151)){w.room(1,19,7,6,151,{roof:false});w.table(3,21,151,2,1);for(const x of [2,5.5])w.chair(x,21,151);w.path([[4.5,25],[4.5,28],[22,32]],1.4,151);}
 if(h(152)){w.wall(5,10,.13,2,1.7,152);w.table(5.6,10,152,1.4,.65);w.chair(5.8,11,152);w.chair(6,14.7,152);}
 if(any(153,154,155)){for(const [id,y]of [[153,2],[154,12],[155,23]])if(h(id)){w.room(39,y,7,7,id,{roof:false,sideDoor:true});w.roof(38.7,y-.3,7.6,7.6,id,2.92,1);w.bed(39.7,y+1,id,1.1);counter(w,43.5,y+1,id,1.6);w.box(44.5,y+2.5,.12,.6,.7,.4,p.stone,id,'toilet');w.path([[42.5,y+7],[47,y+8],[47,34],[22,34]],1.4,id);}}
 if(h(153)){
 // Remove the west solid wall of the independent unit and construct an actual side portal.
 w.boxes=w.boxes.filter(b=>!(b.kind==='wall'&&b.x===39&&b.y===2&&b.dx===.2&&b.dy===7));
 w.wall(39,2,.2,2.8,2.8,153);w.wall(39,6.2,.2,2.8,2.8,153);w.wall(39,4.8,.2,1.4,.65,153,2.27);
 w.box(39.25,4.8,.12,1.25,.07,2.1,p.wood,153,'open-door-leaf');
 w.path([[39,5.5],[36.5,5.5],[36.5,19],[34,19]],1.5,153);w.pergola(35.5,4.8,3.5,1.5,153);w.pergola(35.5,6.3,1.8,13.5,153);w.box(35.5,4.8,2.65,3.5,1.5,.1,p.roof,153,'ceiling');w.box(35.5,6.3,2.65,1.8,13.5,.1,p.roof,153,'ceiling');
 w.state.rentableUnit={externalDoor:[42.5,9],internalDoor:[39,5.5],internalLink:'带可关闭门的有顶连廊接共享室侧门',sanitary:true};}

 if(h(154)){w.table(42.5,16,154,1.8,.6);w.path([[42.5,20],[38,20],[38,32],[22,32]],1.3,154);}
 if(h(155)){w.bench(39.5,30.5,155,2);w.path([[42.5,30],[42.5,34]],2,155);}
 if(any(156,157)){const s=w.boxes.length,m=w.meshes.length;w.room(10,35,8,6,156,{roof:false});w.roof(9.7,34.7,8.6,6.6,156,2.92,1);counter(w,10.5,35.5,156,5);w.chair(13,37,156);w.path([[14,41],[20,41],[22,33]],1.6,156);share(w,[156,157],s,m);}
 if(h(156)){bookcase(w,16,36,156);w.box(11,35.6,.92,.8,.4,.35,p.metal,156,'personal-tools');}
 if(h(157)){w.box(14,35.6,.92,1,.4,.4,p.metal,157,'workshop-tool');w.path([[14,41],[14,43]],2,157);}
 const positions={127:[25,18],128:[28,28],129:[21,20],130:[22,30],131:[15,24],132:[14,16],133:[35,31],134:[13.5,19],135:[22,27],136:[14,12],137:[22,13],138:[16,11],139:[30,19],140:[22,32],141:[15,11],142:[12,27],143:[22,12],144:[29,11],145:[29,14],146:[4,11],147:[21,21],148:[4,14],149:[25,28],150:[12,22],151:[4,22],152:[6,11],153:[42,9],154:[42,19],155:[42,30],156:[13,37],157:[14,41],158:[35,31]};
 const labels=['私密梯度','随阳光布置','共享核心','入口房间','穿过共享房间','像房间的短廊','舞台式楼梯','短暂显露的景观','明暗序列','伴侣领域','儿童领域','东向床位','农舍厨房','临街私人露台','个人退处','坐区序列','床位簇','沐浴房间','大件收纳','灵活办公柱间','共同用餐','小工作组','欢迎式接待','积极等候','小会议室','半私密办公室','独立租用单元','青少年小屋','老人小屋','稳定个人工作位','家庭工坊','开放外楼梯'];
 const observations=["入口先接共享区域，再转向北侧通道和三个私室；床位不放在穿行线上。", "南侧窗边增加常用座位，用活动位置说明朝向；并非照度模拟。", "一个共同餐桌位于共享区，主要路径从桌椅外侧擦过。", "屋外门廊与屋内座位、置物台组成可停留的入口。", "宽门洞和侧向路径把共享空间串联，私人入口位于其侧面。", "私室前的短段通道容纳书架和座位，同时保留通行宽度。", "可见的外楼梯以宽底阶面对共同到达空间，上部接真实房间。", "屏墙中小开口在路径转折处框住外部树木。", "较低暗顶棚与入口、转角的灯具交替；光感需要照明渲染进一步判断。", "伴侣床位和坐椅位于后部私室，入口联系共享通道。", "儿童区的游戏地垫通过侧向路径接室外沙坑，绕过伴侣私室。", "床位东侧的实体墙替换为真实开窗，保留窗台与墙垛。", "厨房台面沿共享区边缘放置，与共同餐桌共享一个活动核心。", "较街面稍高的前露台以低墙保护边缘，台阶接回公共路径。", "后部私室有个人桌椅及书架，可由使用者独立支配。", "围合坐角、开放座位和低坐席提供三种不同坐下条件。", "两个独立床位由软帘边界分开，前方保留共同游戏地垫。", "沐浴、洗涤和卫生设施在北侧服务房间集中，门朝共享与私密之间的通道。", "完整书架体积预先留在北侧服务间，不占用中央起居区。", "柱列与低隔断定义可调整办公间，家具并不填满所有柱间。", "备餐台与共同桌椅相邻；与厨房同时启用时不再生成第二张餐桌。", "左右小组各有面向彼此的桌椅，共享同一办公入口。", "入口内有交谈椅与饮食台，接待工作位在侧面而非挡门。", "书架旁安静坐椅与另一侧活动桌并存，让等候方式可选择。", "独立小会议房在公共入口附近，桌椅围坐而不塞满房间。", "入口旁交谈位置与后部工作桌由半高边界区分。", "单元既有外门也有带开启门扇的侧门，通过有顶联系接主屋，卫生服务独立。", "附属小屋有自己的入口、床和书桌，同时路径仍接回家庭共享入口。", "地面层小屋门前有坐凳，宽路径直接接共同到达地面。", "固定工作房内保留个人工具、书架和连续工作台。", "可从外部进入的工坊带真实工具台，经路径联系主屋。", "20级开放楼梯从公共到达地面接到上层房间侧门，无封闭长走廊。"];
 for(let id=127;id<=158;id++)note(w,id,...positions[id],labels[id-127],observations[id-127]);
 return finishBuilding(w);
}
