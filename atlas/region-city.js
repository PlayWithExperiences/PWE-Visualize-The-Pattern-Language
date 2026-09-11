import {colors as C,gateway,route} from './primitives.js?v=e1f7a13264b8';
export function region(d){
 const H=id=>d.has(id);
 d.rect(55,75,890,490,C.land);d.text(500,45,'区域 · 聚落、土地与公共联系',0,19);
 d.path('M60,405 Q300,250 470,430 T940,390','none',0,{'stroke-width':16,stroke:C.water});
 let towns=H(2)?[[180,160,30],[500,180,52],[795,170,25],[130,420,16],[390,470,18],[680,420,22],[840,480,12]]:[[430,250,82],[660,405,35]];
 if(H(4))towns=towns.map(([x,y,r])=>[x,y>300?Math.min(535,Math.max(505,y)):Math.min(200,y),r]);
 if(H(1)){
  for(const [x,w,label] of [[75,245,'区域 A'],[350,300,'区域 B'],[680,240,'区域 C']]){d.rect(x,90,w,455,'none',1,'',{'stroke-dasharray':'7 5'});d.circle(x+w/2,520,10,C.ink,1);d.text(x+w/2,115,label,1);}
  route(d,[[195,520],[500,590],[800,520]],1,{stroke:C.active,arrow:true});d.text(500,610,'地方自主 · 区域协作',1);d.note(1,'区域边界与各自决策点连接到协作层，不合并为单一中心。');
 }
 if(H(3)){for(let n=0;n<4;n++){d.path(`M${120+n*190},100 L${220+n*175},110 L${170+n*175},370 L${110+n*175},420Z`,'#d9c7ac',3);d.line(150+n*180,130,140+n*180,350,3,{width:4});}d.note(3,'建成带与连续绿地交错，交通沿建成带延伸。');}
 if(H(4)){d.path('M60,370 Q300,215 470,395 T940,350 L940,445 Q670,475 470,455 T60,445Z','#b4cca0',4);d.text(440,406,'保留农业谷地',4);d.note(4,'谷地标为保留区，聚落避开连续的农业带。');}
 if(H(5)){for(const x of [90,310,530,750,930])d.line(x,90,x,550,5,{stroke:C.path,width:5});for(const y of [100,300,540])d.line(80,y,935,y,5,{stroke:C.path,width:5});for(let x=105;x<900;x+=42)d.rect(x,112,17,12,C.building,5);d.text(640,280,'一层沿路地块 · 后方农地',5);d.note(5,'路网围合大块农地，住宅只沿道路排一层。');}
 for(const [x,y,r] of towns){if(H(6)){d.circle(x,y,r+24,'none',6);d.rect(x+r+2,y-15,18,20,C.active,6);d.text(x,y+r+37,'本地生活＋工作',6,9);}d.circle(x,y,r,C.building,H(2)?2:0);}
 if(H(2)){d.text(180,70,'多级规模 · 同级分散',2);d.note(2,'聚落由单一集中中心变为大小不同、分散分布的体系。');}
 if(H(6))d.note(6,'乡野环带与本地工作单元使小镇不只作为睡眠卫星。');
 if(H(7)){route(d,[[80,485],[250,455],[480,505],[685,470],[910,510]],7,{stroke:'#638e65',width:5,dash:'5 6'});for(const x of [270,550,850]){d.rect(x,455,75,30,'#edf1df',7,'照料点');}d.text(485,570,'公共访问路径 · 土地照料',7);d.note(7,'共有访问路径与分散照料点联系，保留生产和生态用途。');}
}
export function city(d){
 const H=id=>d.has(id);d.rect(60,80,880,500,C.land);d.text(500,44,'城市结构 · 示例街区与网络',0,19);
 const cells=[[90,115],[510,115],[90,305],[510,305]];
 const center=(x,y)=>[x+(H(28)?290:170),y+70];
 if(H(11))for(const [x,y]of cells)d.rect(x-15,y-12,370,170,'none',11,'',{'stroke-dasharray':'8 5'});
 if(H(17)){route(d,[[65,85],[65,465],[935,465],[935,85]],17,{width:9});d.rect(450,70,100,22,C.land,17,'乡野出口');d.note(17,'快速道路只围三侧，第四侧保持向乡野开放。');}
 if(H(23)){for(const x of [455,490])route(d,[[x,x===455?95:455],[x,x===455?455:95]],23,{width:6,arrow:true});d.note(23,'两条平行单行干路方向相反，支路横向接入。');}
 else{route(d,[[70,285],[925,285]],0,{width:8});route(d,[[475,85],[475,455]],0,{width:8});}
 for(const [i,[x,y]]of cells.entries()){
  if(H(8)){d.rect(x-5,y-5,345,145,['#d8e2cc','#e5d7c5','#d4dedc','#e3dcc0'][i],8);for(let n=0;n<i+1;n++)d.circle(x+310,y+25+n*25,7,C.paper,8);}
  if(H(14))d.rect(x-12,y-10,350,140,'none',14,'',{'stroke-dasharray':'3 3','stroke-width':3});
  if(H(11))route(d,[[x,y+55],[x+320,y+55]],11,{width:3,dash:'3 4'});
  const [cx,cy]=center(x,y);
  if(H(29)){for(const r of [75,52,28])d.circle(cx,cy,r,'none',29);d.text(cx,cy-86,'密度递减',29,9);}
  for(let n=0;n<6;n++){
   const bx=x+(n%3)*100,by=y+Math.floor(n/3)*68;
   const floors=H(21)?Math.min(4,5-n%3):5-n%3;
   const work=H(9)&&n%3===1;
   d.building(bx,by,58,38,work?9:H(21)?21:0,work?'工作':'',floors);
   if(work){d.rect(bx+8,by+30,42,8,C.active,9);d.line(bx+29,by+38,bx+29,by+53,9,{width:3});}
  }
  if(H(10)||H(28)){d.circle(cx,cy,13,C.active,H(28)?28:10);d.text(cx,cy-18,'活动核心',H(28)?28:10,9);}
  if(H(12)){d.rect(x+230,y+113,65,24,C.paper,12,'社区议事');d.line(x+125,y+100,x+245,y+118,12,{arrow:true});}
  if(H(15)){gateway(d,x+155,y+145,15,'有限入口');d.line(x,y+145,x+124,y+145,15,{width:4});d.line(x+187,y+145,x+338,y+145,15,{width:4});}
 }
 if(H(13)){d.rect(70,267,870,35,'#d9c59e',13);for(const x of [245,700])d.rect(x,270,90,28,C.paper,13,'共享界面');d.note(13,'邻接边界增厚，并提供双方可用的共享设施。');}
 const hubs=[[260,185],[680,185],[260,375],[680,375]];
 if(H(16)){route(d,[[260,185],[680,185],[680,375],[260,375],[260,185]],16,{stroke:'#557b85',width:5});route(d,[[260,185],[680,375]],16,{stroke:'#9f785b',width:3});for(const [x,y]of hubs)d.circle(x,y,13,C.paper,16,'换');d.note(16,'多种线路共享换乘节点，而不是各自独立布线。');}
 if(H(18)){for(const [i,[x,y]]of hubs.entries()){d.circle(x-70,y-30,12,'#dac398',18);d.text(x-70,y-12,['家','作坊','博物馆','师友'][i],18,9);d.line(x-70,y-20,x,y,18,{dash:'3 4'});}route(d,hubs,18,{stroke:'#a18856',dash:'5 4'});d.note(18,'学习资源分散在日常地点，由学习路径相连。');}
 if(H(19)){for(const [x,y]of [[180,225],[650,220],[360,420]])d.circle(x,y,7,'#b98c60',19);d.circle(775,375,21,'none',19);d.rect(765,365,20,20,C.active,19,'新');d.text(792,420,'补服务缺口',19,10);d.note(19,'新商店进入示例服务缺口，并与互补设施相邻。');}
 if(H(20)){for(const [x,y]of hubs){route(d,[[x,y],[x-60,y+35],[x+45,y+50]],20,{stroke:'#739079',dash:'3 3'});d.rect(x-53,y+29,20,10,C.active,20);}d.note(20,'小型接驳线路将干线节点与分散住户联系起来。');}
 const fraction=H(22)?.09:.18,parkingWidth=880*500*fraction/90;
 d.rect(940-parkingWidth,480,parkingWidth,90,'#c2c4b7',H(22)?22:0);d.text(940-parkingWidth/2,528,H(22)?'停车目标 ≤9%':'对照基底：18% 停车',H(22)?22:0,12);
 if(H(24)){d.tree(160,465,24,16);d.circle(160,465,30,'none',24);d.text(160,506,'受保护场所',24,10);}
 if(H(25)){d.rect(55,80,24,385,C.water,25);route(d,[[85,90],[85,458]],25,{stroke:'#699986',width:5});for(const y of [170,390])route(d,[[85,y],[155,y]],25,{arrow:true});d.note(25,'水岸保留连续公共带，到达路径侧向接入。');}
 if(H(26)){d.rect(80,590,840,30,C.paper,26);for(const [i,label]of ['儿童','青年','成人','老人'].entries()){d.circle(170+i*190,605,9,C.active,26);d.text(205+i*190,609,label,26,10);}d.note(26,'不同生活阶段的支持场所同时进入社区网络。');}
 if(H(27)){d.circle(485,180,35,'#efe3d3',27);for(const [x,y]of [[435,150],[535,150],[435,225],[535,225]]){d.people(x,y,27,2);d.line(x+7,y+14,485,180,27,{arrow:true});}d.text(485,180,'共同设计',27,10);d.note(27,'以不同使用者参与共同设计表达平衡，不按性别分配活动。');}
 const notes={8:'社区空间形成多样而可接近的小领域。',9:'工作单元穿插于住宅之间。',10:'多个可达核心取代单一集中中心。',11:'主要交通区与内部慢行分层。',12:'地方议事与服务贴近住户。',14:'住宅归入可识别的小邻里。',15:'减少穿行开口，突出保留的入口。',21:'示例建筑层数限制为四层，未作法规判断。',22:'用地示意中的停车面由18%减少至9%。',24:'重要场所设置保护边界和接近位置。',28:'核心向通往更大中心的一侧偏移。',29:'密度圈围绕核心组织，不以几何中心为必然。'};
 for(const [id,text]of Object.entries(notes))if(H(+id))d.note(+id,text);
}
