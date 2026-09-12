import {World,palette as p} from './primitives.js?v=e16c31c774f1';
import {chairFacing} from './detail-furniture.js?v=e16c31c774f1';

// Shared home: public south rooms, private north rooms, a clear central route.
export function buildRooms(ids){
 const w=new World('room',28,24,ids),has=id=>w.has(id),mark=(id,x,y,s)=>w.marker(id,x,y,s);
 w.room(2,2,24,18,0,{roof:false,height:4.4});
 w.spawn={x:14,y:23,yaw:0,pitch:0,feet:0};
 w.path([[14,23],[14,18],[14,10]],1.6);
 w.wall(2.2,10,8,.2,2.8);w.wall(17,10,8.8,.2,2.8);
 // Work-room south wall has an actual door; 196 relocates it toward the corner.
 const doorX=has(196)?23.2:20.2;
 // Replace the work partition, rather than covering its opening with another wall.
 w.boxes=w.boxes.filter(b=>!(b.x===17&&b.y===10&&b.kind==='wall'));
 w.wall(17,10,doorX-17,.2,2.8,has(196)?196:0);
 w.wall(doorX+1.2,10,25.8-doorX-1.2,.2,2.8,has(196)?196:0);
 w.wall(doorX,10,1.2,.2,.6,has(196)?196:0,2.32);
 if(has(196))mark(196,doorX+.6,10.7,'角部门洞 · 把穿行留在一端');
 // A common table is authored once. Eating atmosphere changes its scale and setting.
 w.table(16,14,has(182)?182:0,has(182)?3:2.3,1.15);
 for(const [x,y]of [[16.25,13.15],[17.45,13.15],[16.25,15.9],[17.45,15.9]])chairFacing(w,x,y,has(182)?182:0,0,y>15?2:0);
 if(has(179)){
  w.wall(2.3,12,2.8,.18,2.4,179);w.wall(5.1,12,.18,1.3,2.4,179);w.box(2.3,12,2.52,3,2.7,.12,p.wood,179,'ceiling');w.bench(2.6,13.3,179,2.1);mark(179,4,14.4,'主室边缘的小凹室');
 }
 if(has(180)||has(202)){
  const owner=has(202)?202:180;w.bench(5.6,18.9,owner,2.6);w.box(5.6,18.97,.65,2.6,.08,.48,p.warm,owner,'seat-cushion');
  if(has(180)){w.box(5.4,18.5,0,.16,1.1,1,p.wood,180,'window-place');w.box(8.3,18.5,0,.16,1.1,1,p.wood,180,'window-place');mark(180,7,18,'坐下看向花园的窗边');}
  if(has(202)){w.chair(8.8,17.9,202,1);mark(202,7,19,'可移动试坐椅与整合式座椅 · 舒适度未实测');}
 }
 if(has(181)){
  w.box(8.6,10.4,0,2.5,1,.15,p.stone,181,'hearth');w.box(8.6,10.4,.15,.3,1,1.4,p.stone,181);w.box(10.8,10.4,.15,.3,1,1.4,p.stone,181);w.box(8.6,10.4,1.55,2.5,1,.2,p.stone,181);w.box(9,10.5,.3,1.5,.5,.12,'#5b5550',181);mark(181,9.8,11.8,'共同焦点 · 炉火仅示聚集关系');
 }
 if(has(182)){w.box(16,14,2.5,3,1.15,.12,p.warm,182,'emissive');w.light(17.5,14.575,2.45,182,{intensity:2.2,radius:3.5});w.box(19.8,14,0,.45,1.5,1,p.wood,182,'sideboard');mark(182,17.5,15.4,'餐桌聚集 · 四周保留拉椅空间');}
 if(has(183)){w.table(20,5,183,2,1);chairFacing(w,20.5,6.6,183,0,2);w.wall(19.4,4.6,.18,3,1.3,183);w.wall(19.4,7.6,3,.18,1.3,183);mark(183,21,7,'有背靠且朝向室内的工作位');}
 if(has(184)||has(199)){
  const id=has(184)?184:199;
  w.box(22.8,15,.12,.7,4.5,.78,p.wood,id,'counter');w.box(19.8,18.8,.12,3,.7,.78,p.wood,id,'counter');
  w.box(22.8,15,.9,.7,4.5,.08,p.stone,id,'worktop');w.box(19.8,18.8,.9,3,.7,.08,p.stone,id,'worktop');
  if(has(184)){w.box(22.9,15.3,.98,.5,.7,.05,p.metal,184,'hob');w.box(20.8,18.9,.98,.7,.4,.04,p.glass,184,'sink');w.box(24.5,16,.12,.85,.85,1.8,'#dadfd8',184,'food-store');mark(184,23,17.4,'灶—洗涤—储藏与连续台面');}
  if(has(199)){w.box(20,18.9,1.02,.5,.18,.2,p.plant,199,'kitchen-herbs');w.box(21,19.6,1.05,1.7,.3,.1,p.stone,199,'sunny-sill');mark(199,21.5,18.2,'面向南侧花园窗的操作台');}
 }
 if(has(185)){for(const [x,y,v,t]of [[6.2,15,1,3],[9.5,14.4,0,1],[8.8,17,2,2],[5,16.3,0,3]])chairFacing(w,x,y,185,v,t);w.table(7.4,15.4,185,.8,.6);mark(185,8,16,'松散围坐 · 通路从圈外经过');}
 if(has(186)){for(let n=0;n<3;n++)w.box(4+n*2.15,7.6,.14,1.75,.8,.15,'#d1b591',186,'sleep-mat');mark(186,7,8.9,'可选临时共同睡眠 · 须所有人同意');}
 if(has(187)||has(188)){
  w.bed(4,4,has(187)?187:188,1.8);
  if(has(187)){for(const x of [3.9,5.9])for(const y of [3.9,6.1])w.box(x,y,0,.09,.09,2.15,p.wood,187,'bed-post');w.box(3.85,3.85,2.15,2.25,2.35,.08,p.warm,187,'ceiling');mark(187,5,6.6,'围合床架作为私人中心');}
  if(has(188)){w.wall(3.48,3.3,3.02,.18,2.4,188);w.wall(3.3,3.3,.18,3.6,2.4,188);w.wall(6.5,3.3,.18,2.5,2.4,188);w.box(3.3,3.3,2.52,3.4,3.6,.1,p.wall,188,'ceiling');w.box(6,3.6,.12,.35,1.2,1.2,p.wood,188,'bed-storage');mark(188,6.3,6.7,'小床凹室连着更大的活动室');}
 }
 if(has(189)){w.box(9,3.1,.12,2,.65,2.1,p.wood,189,'wardrobe');w.box(11.1,3.15,.4,.05,1.3,1.6,p.glass,189,'mirror');w.box(12.3,3.2,.12,1.2,1.8,.45,p.stone,189,'bath');mark(189,10.2,5.7,'床与浴室之间的更衣空地');}
 if(has(190)){for(const [x,y,dx,dy,z]of [[2.2,10.3,23.6,9.3,4.5],[17,2.2,8.8,7.6,3.2],[8,2.2,5.8,5,2.6]])w.box(x,y,z,dx,dy,.12,p.wall,190,'ceiling');mark(190,14,12,'公共厅 4.5m／工作间 3.2m／私人边缘 2.6m');}
 if(has(191)){for(const x of [3,7,11])w.beam([x,11,3.5],[x,19,3.5],.055,p.wood,191);w.box(3,has(181)?11.4:11,.125,8,has(181)?7.6:8,.025,'#e3d1b2',191,'floor');mark(191,10.5,18,'矩形主室与对称顶面');}
 if(has(192)){w.path([[3,22],[25,22]],1.3,192);w.tree(5,23,192,.8);w.bench(21,22.8,192);mark(192,20,20.8,'窗口看见花园路径和停留活动');}
 if(has(193)){w.wall(11,10,.22,3,1,193);for(const y of [10,13])w.box(11,y,1.12,.22,.22,1.88,p.wood,193,'post');w.box(11,10,3,.22,3.2,.15,p.wood,193,'beam');mark(193,12,11,'半墙和柱保留联系与独立');}
 if(has(194)){
  // Cut a real hole in the existing interior wall before glazing it.
  w.boxes=w.boxes.filter(b=>!(b.kind==='wall'&&b.x===2.2&&b.y===10));
  w.wall(2.2,10,1,.2,2.8,194);w.wall(6.8,10,3.4,.2,2.8,194);w.wall(3.2,10,3.6,.2,.9,194);w.wall(3.2,10,3.6,.2,.6,194,2.32);w.box(3.2,10.075,1.02,3.6,.04,1.3,p.glass,194,'window');mark(194,5,10.8,'内窗穿过分隔墙');
 }
 if(has(195)){w.steps(14.8,3,1.4,16,195,.175,.35);w.box(14.8,8.6,2.68,1.4,1.3,.12,p.stone,195,'floor');for(const x of [14.7,16.25])w.beam([x,3,.9],[x,8.6,3.7],.045,p.metal,195);mark(195,15.5,7,'跨层楼梯体积 · 尺寸仅概念示意');}
 if(has(197)){for(const x of [3,4,5]){w.box(x,2.25,.12,.08,.5,2,p.wood,197,'storage-divider');for(const z of [.6,1.2,1.8])w.box(x+.08,2.25,z,.82,.5,.07,p.wood,197,'shelf');}mark(197,4,3,'外墙厚度容纳储物与生活');}
 if(has(198)){w.box(8.5,9.2,.12,1.5,.65,2.3,p.wood,198,'closet-buffer');w.box(17.2,9.2,.12,1.5,.65,2.3,p.wood,198,'closet-buffer');mark(198,9,8.5,'内墙柜体形成隐私缓冲 · 未计算隔声');}
 if(has(200)){for(const z of [.55,1.05,1.55]){w.box(24.9,4,z,.5,3.8,.065,p.wood,200,'open-shelf');for(let y=4.2;y<7.7;y+=.5)w.box(25,y,z+.065,.25,.22,.26,y%1<.5?p.warm:p.stone,200,'stored-object');}mark(200,24.3,6,'浅架只放一层物品');}
 if(has(201)){w.box(2.25,16,1,.35,2.1,.08,p.wood,201,'ledge');w.box(18,10.25,1,2,.32,.08,p.wood,201,'ledge');mark(201,18.8,11,'腰高置物面避让门窗');}
 if(has(203)){w.wall(17.5,3,.12,1.6,1.05,203);w.wall(19,3,.12,1.6,1.05,203);w.wall(17.62,3,1.38,.12,1.05,203);w.box(17.5,3,1.17,1.62,1.6,.12,p.wood,203,'ceiling');w.box(17.7,3.2,.12,1.2,1.1,.05,p.warm,203,'floor');mark(203,18.3,5,'儿童尺度凹洞 · 照护与疏散另评');}
 if(has(204)){w.box(7,2.3,.9,.7,.5,.06,p.wood,204,'memory-niche');w.box(7,2.3,.96,.06,.5,.59,p.wood,204);w.box(7.64,2.3,.96,.06,.5,.59,p.wood,204);w.box(7.1,2.4,.98,.4,.25,.25,p.warm,204,'memory-box');mark(204,7.3,3.2,'边缘里的私人记忆藏处');}
 w.state.zones={living:[2,10,11,10],dining:[15,12,6,6],kitchen:[20,15,6,5],sleep:[3,3,8,6],work:[19,4,6,5]};
 return w.finish();
}
