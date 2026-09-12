import {World,palette as p} from './primitives.js?v=8207f127fbc7';
import {chairFacing} from './detail-furniture.js?v=8207f127fbc7';

function flower(w,x,y,z,id,color){
 w.beam([x,y,z],[x,y,z+.35],.014,p.plant,id);
 for(let n=0;n<5;n++){const a=n*Math.PI*2/5,b=a+.8;w.triangle([x,y,z+.4],[x+.12*Math.cos(a),y+.12*Math.sin(a),z+.38],[x+.12*Math.cos(b),y+.12*Math.sin(b),z+.42],color,id,'flower');}
}
export function buildFinish(ids){
 const w=new World('finish',20,22,ids),has=id=>w.has(id),mark=(id,x,y,s)=>w.marker(id,x,y,s);
 w.room(3,2,14,10,0,{roof:false,height:3.3});w.spawn={x:10,y:19,yaw:0,pitch:0,feet:0};
 w.slab(3,12,14,5);w.path([[10,21],[10,17],[10,12]],1.5);w.tree(1,17,0,.9);
 w.table(6,6,0,2,1);w.table(12,6,0,1.5,.85);
 // The room and porch share one coherent seating arrangement, with no duplicate chairs.
 const seats=[[5.5,5,0],[7.6,5,0],[5.5,8,2],[7.6,8,2],[12.4,7.7,2]];
 for(const [n,[x,y,turn]]of seats.entries())chairFacing(w,x,y,has(251)?251:0,has(251)?n%3:0,turn);
 if(has(241)){w.bench(3.7,15.8,241,2);w.wall(3.2,14.4,.18,2.5,1.4,241);w.tree(2.2,14.5,241,.8);mark(241,5,17,'有树荫和挡风、看向门前路径的座位');}
 if(has(242)){w.bench(11.5,12.4,242,2.4);w.planter(14.2,12.4,1.5,.6,242);mark(242,12.5,13.6,'门外长椅连接室内与路径');}
 if(has(243)){w.box(4,17,.12,4,.5,.42,p.stone,243,'sitting-wall');w.box(12,17,.12,4,.5,.42,p.stone,243,'sitting-wall');w.box(4,17,.54,4,.5,.08,p.wood,243,'seat-cap');w.box(12,17,.54,4,.5,.08,p.wood,243,'seat-cap');mark(243,7,18,'可坐的边界墙留下中央入口');}
 if(has(244)){for(const x of [4,8])w.box(x,15.5,0,.08,.08,2.5,p.metal,244,'awning-post');w.beam([4,12,2.9],[8,12,2.9],.07,p.metal,244);for(let i=0;i<8;i++){const x=4+i*.5;w.quad([x,12,2.9],[x+.5,12,2.9],[x+.5,15.5,2.5],[x,15.5,2.5],i%2?'#d4c4a3':'#efe4ca',244,'canvas');}w.box(4,11.9,2.84,4,.18,.18,p.wood,244,'canvas-roller');mark(244,6,15,'有卷轴的可收帆布遮篷 · 展示展开状态');}
 if(has(245)){w.planter(15.2,14,1.5,2.2,245);for(let x=15.4;x<16.5;x+=.32)for(let y=14.2;y<16;y+=.45)flower(w,x,y,.62,245,y%1>.5?'#d8a5a0':'#e4cd79');mark(245,16,16.9,'花朵抬高到手和嗅觉附近');}
 if(has(246)){for(const x of [8.8,11.2]){w.beam([x,12,.1],[x,12,3],.04,p.wood,246);for(let z=.5;z<3;z+=.35){w.beam([x,12,z],[x+.2*Math.sin(z*7),12.08,z+.3],.024,p.plant,246);w.box(x-.12,12.06,z,.28,.07,.13,p.plant,246,'climbing-leaf');}}w.beam([8.8,12,3],[11.2,12,3],.04,p.plant,246);mark(246,11.6,12.8,'植物沿门框生长，保留通行洞口');}
 if(has(247)){// Stones sit apart, with actual joints occupied by low ground cover.
  for(let x=3.5;x<8.5;x+=.72)for(let y=13;y<15.8;y+=.72){w.box(x,y,.125,.65,.65,.045,p.stone,247,'paving-stone');w.box(x+.65,y,.126,.07,.72,.02,p.plant,247,'planted-joint');}
  mark(247,6.5,16.1,'铺石间真实留缝与低矮地被');
 }
 if(has(248)){for(let n=0;n<12;n++){const x=11.8+(n%4)*.75,y=14+Math.floor(n/4)*.65;w.box(x,y,.125,.72,.62,.07,n%3===0?'#a77961':'#b78c70',248,'wearing-tile');if(n%3===0)w.box(x+.1,y+.12,.196,.45,.32,.008,'#c3a08a',248,'worn-patch');}mark(248,13.5,16.5,'砖瓦表面磨痕 · 示意使用后的差异');}
 if(has(249)){for(let x=3.2;x<16.8;x+=.4)w.box(x,11.75,3.15,.16,.1,.12,'#b38d65',249,'seam-ornament');for(const x of [9.28,10.6])for(let z=.3;z<2.1;z+=.3)w.box(x,11.75,z,.08,.09,.13,p.wood,249,'door-ornament');mark(249,8.5,12.8,'重复纹样落在门框与檐口接缝');}
 if(has(250)){w.box(3.22,3,.2,.07,5,2.5,'#dfbc94',250,'warm-surface');w.box(3.3,3,.13,3,5,.03,'#d0b58f',250,'floor');w.box(3.32,5,1.3,.04,.8,.7,'#6d8e91',250,'cool-accent');mark(250,4,8.8,'暖墙与木地面配少量冷色 · 反射未作光谱模拟');}
 if(has(251))mark(251,8.5,8.5,'同一桌旁：扶手椅、直背椅与矮凳');
 if(has(252)){
  w.box(3.2,6.2,3.3,13.6,.6,.1,p.wood,252,'lamp-support');
  w.beam([12.5,11.8,3.3],[12.5,12.9,3.3],.06,p.metal,252);
  for(const [x,y,z]of [[7,6.5,2],[12.75,6.4,1.9],[12.5,12.8,2.3]]){
   w.beam([x,y,3.3],[x,y,z+.25],.014,p.metal,252);w.box(x-.25,y-.2,z,.5,.4,.16,p.warm,252,'lamp-shade');w.box(x-.18,y-.14,z-.03,.36,.28,.035,'#ffe0ac',252,'emissive');w.light(x,y,z-.08,252,{color:'#ffdaa0',intensity:2.3,radius:3});
  }
  mark(252,10,9,'三处独立局部灯光 · 夜间查看其间暗处');
 }
 if(has(253)){
  w.box(16.55,3,.5,.22,3.5,.08,p.wood,253,'memory-shelf');
  for(let n=0;n<4;n++){const y=3.3+n*.65;w.box(16.5,y,1.45,.09,.5,.65,p.wood,253,'picture-frame');w.box(16.48,y+.04,1.49,.025,.42,.57,['#97b0b1','#c59e80','#a3b38c','#baaaa0'][n],253,'personal-picture');w.box(16.5,y,.6,.18,.22,.2+n*.04,p.stone,253,'keepsake');}
  mark(253,15.7,5,'照片与不同纪念物 · 具体人生由居住者赋予');
 }
 return w.finish();
}
