import {World,palette as p} from './primitives.js';
import {share} from './building-common.js';
import {partitionFloorFinish} from './detail-furniture.js';

function vault(w,x,y,width,depth,z,rise,id,kind='vault'){
 const count=18,point=(i,yy)=>[x+width*i/count,yy,z+rise*Math.sin(Math.PI*i/count)];
 for(let i=0;i<count;i++){
  w.quad(point(i,y),point(i+1,y),point(i+1,y+depth),point(i,y+depth),p.stone,id,kind);
  // A real shell has a visible underside and thickness at both exposed ends.
  const a=point(i,y),b=point(i+1,y),c=point(i,y+depth),d=point(i+1,y+depth);
  w.quad(a.map((v,n)=>v-(n===2?.14:0)),c.map((v,n)=>v-(n===2?.14:0)),d.map((v,n)=>v-(n===2?.14:0)),b.map((v,n)=>v-(n===2?.14:0)),p.wall,id,kind);
  for(const [u,v]of [[a,b],[d,c]])w.quad(u,v,v.map((q,n)=>q-(n===2?.14:0)),u.map((q,n)=>q-(n===2?.14:0)),p.wood,id,kind);
 }
}
export function buildConstruction(ids){
 const w=new World('construction',36,30,ids),has=id=>w.has(id),mark=(id,x,y,s)=>w.marker(id,x,y,s);
 w.spawn={x:16,y:21,yaw:0,pitch:0,feet:0};w.navigation.maxHeight=80;
 w.state.notes=['构造与受力均为原书概念图解，未经工程验算，不可用作施工方案。'];
 if(has(214))w.state.notes.push('214 根状基础：原书明确尚未解决具体实现与结构有效性；此处仅显示待研究形态。');
 w.slab(6,6,12,10,0);w.slab(20,8,6,6,0);w.path([[16,21],[16,17],[23,17],[23,14]],1.4);
 // Column positions follow a large hall and a smaller side room, not a universal grid.
 const upperFloor=has(206)?4.85:3.8,sideRoofBase=has(210)?upperFloor+2.86:3.9;
 const corners=[[6,6],[17.7,6],[6,15.7],[17.7,15.7],[20,8],[25.7,8],[20,13.7],[25.7,13.7]];
 for(const [x,y]of corners){
  const inhabited=has(226)&&x===20&&y===13.7,start=w.boxes.length;
  w.box(x,inhabited?13.6:y,0,inhabited?.7:has(212)?.3:.22,inhabited?.7:has(212)?.3:.22,3.6,p.wood,inhabited?226:has(212)?212:0,inhabited?'inhabited-column':'column');
  if(inhabited)share(w,[212,226],start,w.meshes.length);
 }
 if(has(205)){w.box(6.35,6.35,.125,11.3,9.3,.025,'#d3bda0',205,'floor');w.box(20.35,8.35,.125,5.3,5.3,.025,'#c5ceba',205,'floor');w.beam([20.15,8.15,3.6],[20.15,13.85,3.6],.15,p.wood,205);mark(205,23,10,'结构回应主厅与小室的不同尺度');}
 if(has(206)){vault(w,20,8,6,3.5,3.5,1.1,206,'compression-shell');for(const x of [19.5,26])w.box(x,8,0,.5,3.5,3.6,p.stone,206,'buttress');mark(206,23,12,'柱—边梁—拱壳连续构想 · 未验算');}
 if(has(207)){for(const [n,col]of [p.soil,p.wood,'#cbd4b9'].entries()){w.box(2,6+n*1.5,0,2,1,.5,col,207,'material-sample');for(let i=0;i<4;i++)w.box(2+i*.48,6+n*1.5,.5,.42,.9,.12,col,207,'replaceable-block');}mark(207,3,11,'土基／木材／轻填充 · 可加工材料样段');}
 if(has(208)){for(let n=0;n<3;n++){const x=3+n*3.8;for(const xx of [x,x+2])w.box(xx,24,0,.1,.1,2.5,p.wood,208,'stiffening-frame');w.box(x,24,2.5,2.1,.12,.12,p.wood,208,'stiffening-frame');if(n>0)w.box(x+.1,24.03,0,1.9,.06,2.5,p.soil,208,'stiffening-fill');if(n>1){w.beam([x,24,0],[x+2,24,2.5],.08,p.wood,208);w.box(x,24.12,0,2.1,.15,2.5,p.wall,208,'stiffening-skin');}}mark(208,7,25.5,'三个阶段：轻骨架 → 填充 → 加强 · 非施工程序');}
 if(has(209)){if(!has(220))w.roof(5.7,5.7,12.6,10.6,209,3.9,2);if(!has(206)||has(210))w.roof(19.7,7.7,6.6,6.6,209,sideRoofBase,1);w.roof(6,16,4,2.5,209,2.7,.45);mark(209,20,15,'主厅大顶／侧室小顶／边缘低顶');}
 if(has(210)){const level=upperFloor;w.slab(20,8,6,3.8,210,p.stone,level);for(const x of [20,25.7]){w.box(x,8,3.6,.3,.3,level+.12-3.6,p.wood,210,'support-extension');w.box(x,8,level+.12,.3,.3,2.5,p.wood,210,'upper-column');}w.box(20,8,level+2.62,6,.3,.24,p.wood,210,'upper-beam');mark(210,24,12,'上下层顶面与边缘支点协调');}
 if(has(211)){w.box(6.3,6.4,0,.8,3,.45,p.wood,211,'inhabited-edge');w.box(6.3,6.4,2.7,.8,3,.1,p.wall,211,'ceiling');w.box(7,6.4,0,.12,.12,2.7,p.wood,211,'edge-post');mark(211,7.7,8,'主室外预留可居住的厚边缘');}
 if(has(212))mark(212,17.4,15,'房间和侧室转角落柱');
 if(has(213)){for(const y of [8.5,11,13.5])w.box(6,y,0,.24,.24,3.6,p.wood,213,'intermediate-column');for(const y of [9.5,11])w.box(25.7,y,0,.18,.18,3.6,p.wood,213,'intermediate-column');mark(213,6.8,12,'按空间尺度加密柱距 · 无荷载数值');}
 if(has(214)){
  // Raised cutaway beside the building makes the below-ground hypothesis inspectable.
  w.box(29,5,0,4,4,.25,p.soil,214,'cutaway-ground');w.box(30.8,6.8,.25,.35,.35,2.5,p.stone,214,'foundation-column');
  for(const [dx,dy]of [[-1,-1],[1,-1],[1,1],[-1,1]])w.beam([30.975,6.975,1],[30.975+dx*1.5,6.975+dy*1.5,.3],.14,p.stone,214);
  mark(214,31,9.8,'未解决：根状基础仅为形态假设');
 }
 if(has(215)){w.slab(12,16,6,2.1,215,p.stone,.24);w.box(14.9,18.1,0,1.6,.35,.24,p.stone,215,'step');w.box(14.9,18.45,0,1.6,.35,.12,p.stone,215,'step');w.box(17.7,15.8,0,.5,2.3,.36,p.stone,215,'slab-edge');mark(215,16,18.5,'首层平台、边缘基础与室外地面');}
 if(has(216)){w.box(29,12,0,.15,1,3,p.wood,216,'column-shell');w.box(29,12,0,1,.15,3,p.wood,216,'column-shell');w.box(29.85,12,0,.15,1,3,p.wood,216,'column-shell');w.box(29.15,12.15,0,.7,.7,2,p.stone,216,'column-core');mark(216,30,13.8,'剖开箱柱：外壳与较低的可见芯材');}
 if(has(217)){for(const [a,b]of [[[6,6,3.6],[18,6,3.6]],[[18,6,3.6],[18,16,3.6]],[[18,16,3.6],[6,16,3.6]],[[6,16,3.6],[6,6,3.6]]])w.beam(a,b,.16,p.wood,217);mark(217,16,16.8,'连续周边梁跨过门窗开口');}
 if(has(218)){for(const [i,col]of [p.wall,p.soil,p.wood].entries())w.box(29+i*.65,16,0,.2,3.2,2.8-i*.3,col,218,'wall-layer');mark(218,30,20,'展开墙体：外表层／填充／内表层');}
 if(has(219)){vault(w,8,6.5,7,3.8,3.2,.65,219,'floor-vault');w.box(8,6.5,3.97,7,2.1,.16,p.stone,219,'floor');mark(219,12,10.8,'部分揭开的楼板展示下方拱顶');}
 if(has(220)){vault(w,5.7,5.7,12.6,10.6,3.9,2,220,'roof');for(const y of [5.7,9,12,16.3]){for(let i=0;i<12;i++)w.beam([5.7+i*1.05,y,4+2*Math.sin(Math.PI*i/12)],[5.7+(i+1)*1.05,y,4+2*Math.sin(Math.PI*(i+1)/12)],.04,p.wood,220);}w.box(5.4,5.7,3.8,.2,10.6,.12,p.metal,220,'roof-drain');mark(220,12,17,'曲面屋盖与起伏加劲、檐沟');}
 // A single inhabited facade is shared by the opening patterns.
 const doorBase=has(215)?.36:.12,doorHeight=has(224)?2.1:2.5;
 const wx=has(221)?7.6:8,ww=has(221)?4.2:3.2,sill=has(222)?.48:.95,top=3.05,fy=15.75;
 const windowId=has(222)?222:has(221)?221:0;
 w.wall(6,fy,wx-6,.3,3.6);w.wall(wx,fy,ww,.3,sill,windowId);w.wall(wx,fy,ww,.3,3.6-top,0,top+.12);
 w.wall(wx+ww,fy,15-wx-ww,.3,3.6);w.wall(16.4,fy,1.6,.3,3.6);w.wall(15,fy,1.4,.3,3.72-doorBase-doorHeight,has(224)?224:0,doorBase+doorHeight);
 if(!has(236))w.box(wx,fy+.12,sill+.12,ww,.04,top-sill,p.glass,windowId,'window');
 if(has(221)){w.bench(wx,14.9,221,1.6);mark(221,wx+1,17,'现场适配窗宽与观看位置');}
 if(has(222)){w.box(wx,fy-.15,sill+.06,ww,.6,.06,p.stone,222,'low-sill');mark(222,wx+ww/2,16.8,'低窗台让坐姿视线穿出');}
 if(has(223)){const z=sill+.12;for(const [a,b,c,d]of [
  [[wx,fy,z],[wx,fy,top+.12],[wx-.35,fy-.65,top+.4],[wx-.35,fy-.65,z-.2]],
  [[wx+ww,fy,z],[wx+ww+.35,fy-.65,z-.2],[wx+ww+.35,fy-.65,top+.4],[wx+ww,fy,top+.12]],
  [[wx,fy,top+.12],[wx+ww,fy,top+.12],[wx+ww+.35,fy-.65,top+.4],[wx-.35,fy-.65,top+.4]]])w.quad(a,b,c,d,p.wall,223,'splayed-reveal');mark(223,wx+ww/2,14.5,'窗洞向室内展开 · 真正斜面剖口');}
 if(has(224))mark(224,15.7,16.8,'较低门洞的过渡感 · 非现行规范尺寸');
 if(has(225)){for(const x of [wx-.12,wx+ww])w.box(x,fy-.1,sill,.12,.5,top-sill+.25,p.stone,225,'opening-frame');w.box(wx-.12,fy-.1,top+.12,ww+.24,.5,.12,p.stone,225,'opening-frame');mark(225,wx,17,'框作为墙体加厚的连续边缘');}
 if(has(226)){w.bench(20.8,13.8,226,2.1);mark(226,21.5,15,'可倚靠的粗柱与柱边座位');}
 if(has(227)){for(const x of [6.15,17.85])for(const dir of [x<10?1:-1]){w.beam([x,6.15,2.65],[x+dir*.9,6.15,3.6],.12,p.wood,227);w.box(x-.22,5.93,3.35,.44,.44,.25,p.stone,227,'capital');}mark(227,7,5,'柱头和斜撑连接梁柱转角');}
 if(has(228)){
  // Open undercroft: individual treads above a sloping curved shell, not solid wedges.
  for(let i=0;i<15;i++){const yy=20+i*.32,zz=.04+i*.18;w.box(20,yy,zz,1.6,.32,.12,p.stone,228,'step');const z2=.04+(i+1)*.18,under=zz-.08-.16*Math.sin(Math.PI*i/15),under2=z2-.08-.16*Math.sin(Math.PI*(i+1)/15);w.quad([20,yy,under],[21.6,yy,under],[21.6,yy+.32,under2],[20,yy+.32,under2],p.wall,228,'stair-shell');}
  w.bench(20.2,23,228,1.1);w.slab(20,24.8,1.6,1,228,p.stone,2.68);mark(228,22.5,23,'壳托踏步与可用梯下凹室 · 未验算');
 }
 if(has(229)){for(const [n,col]of ['#a3b4b7','#a87564'].entries()){w.beam([17.3,6.5,.2],[17.3,6.5,3.3+n*.15],.045,col,229);w.beam([17.3,6.5,3.3+n*.15],[17.3,15,3.3+n*.15],.045,col,229);}w.box(17,6.15,1.2,.6,.06,.7,p.wood,229,'open-access-panel');mark(229,16.6,7,'角部竖井接水平管线 · 检修盖展开');}
 if(has(230)){w.box(20.5,8.3,.15,4,.2,1.3,'#d1a17c',230,'radiant-panel');for(let x=20.8;x<24.5;x+=.5)w.beam([x,8.52,.4],[x,8.52,1.25],.018,'#bb7f66',230);w.bench(21,10,230,2.5);mark(230,23,10.8,'座位面向温暖辐射表面 · 未模拟温度');}
 if(has(231)){
  w.room(8,0,4,4,231,{roof:false,height:2.5});w.slab(8,0,4,4,231,p.wood,2.5);
  // The pitched roof is interrupted around a standing-height dormer, not overlaid with a box.
  w.roof(7.7,-.2,4.6,1.8,231,2.62,2.5);w.roof(7.7,3.3,4.6,1,231,2.62,2.5);
  w.wall(11.4,1.6,.18,1.7,2.55,231,2.62);w.wall(8.4,2.85,.18,.45,2.55,231,2.62);
  w.wall(8.4,1.6,.18,1.25,.35,231,4.82);w.facade(8.4,3.1,3.2,2.55,231,{door:false,sill:.55,z:2.62});
  w.box(8.4,1.6,5.17,3.2,1.7,.12,p.roof,231,'roof');w.bench(9,2.3,231,1.7,2.62);
  w.steps(6.6,-3.2,1.4,15,231,.175,.32);w.slab(6.6,1.6,2,1.2,231,p.wood,2.5);
  mark(231,10,4.8,'楼梯通往可站立的老虎窗凹室');
 }
 if(has(232)){if(!has(209)&&!has(220)){for(const y of [6,16]){w.beam([6,y,3.6],[12,y,5.9],.1,p.wood,232);w.beam([12,y,5.9],[18,y,3.6],.1,p.wood,232);}}w.beam([12,5.5,5.9],[12,16.4,5.9],.13,p.roof,232);w.box(11.85,5.6,5.85,.3,.3,.6,p.warm,232,'roof-finial');mark(232,12,5,'脊帽与端部标识屋顶最高处');}
 if(has(233)){w.box(8,11,.125,5,3,.02,p.stone,233,'floor');w.box(20.7,11,.125,3.8,2.5,.045,'#c5ac92',233,'soft-floor');w.box(20.6,11,.13,.1,2.5,.03,p.wood,233,'material-threshold');mark(233,22,13,'公共硬地面过渡到私人软铺面');}
 if(has(234)){for(let z=.15;z<3.4;z+=.26)w.box(5.7,6.4,z,.14,8.8,.3,z%1>.5?'#b8a189':'#ad947d',234,'lapped-cladding');mark(234,4.8,13,'向下搭接、可逐块替换的外墙板');}
 if(has(235)){w.box(6.35,10,.2,.08,2.8,2.5,'#d9bb98',235,'soft-wall');for(let y=10.4;y<12.7;y+=.6)w.box(6.45,y,1.5,.05,.3,.35,'#d7d1bd',235,'pinned-note');mark(235,7,11,'可钉挂日常纸张的柔和内表面');}
 if(has(236)){for(const [x,dir]of [[wx,1],[wx+ww,-1]]){const end=[x+dir*.35,fy+ww/2];w.quad([x,fy,sill+.12],[end[0],end[1],sill+.12],[end[0],end[1],top+.12],[x,fy,top+.12],p.glass,236,'window');for(const z of [sill+.12,top+.12])w.beam([x,fy,z],[end[0],end[1],z],.035,p.wood,236);w.beam([end[0],end[1],sill+.12],[end[0],end[1],top+.12],.035,p.wood,236);}mark(236,wx+ww/2,17.8,'两扇窗向外开启 · 中央真实敞口');}
 if(has(237)){// Door is parked open at 90 degrees so the portal remains traversable.
  const rail=.08,split=.85,glassHeight=doorHeight-split-rail;
  w.box(15,fy,doorBase,.1,1.3,split,p.wood,237,'door');w.box(15,fy,doorBase+split,.1,rail,glassHeight,p.wood,237,'door-frame');w.box(15,fy+1.22,doorBase+split,.1,rail,glassHeight,p.wood,237,'door-frame');w.box(15,fy,doorBase+doorHeight-rail,.1,1.3,rail,p.wood,237,'door-frame');w.box(15.035,fy+.08,doorBase+split,.025,1.14,glassHeight,p.glass,237,'window');mark(237,15.7,17.5,'实心下部与透明上部 · 门扇敞开');}
 if(has(238)){for(let x=wx;x+.06<=wx+ww+1e-9;x+=.2)w.box(x,fy-.12,top-.2,.06,.2,.32,p.wood,238,'light-filter');w.beam([wx-.2,fy-.1,top+.4],[wx+ww+.2,fy-.1,top+.4],.055,p.plant,238);mark(238,wx+.5,15,'植物与细格柔化开口上缘');}
 if(has(239)){if(!has(236)){for(let x=wx+.4;x<wx+ww;x+=.4)w.box(x,fy+.06,sill+.12,.025,.12,top-sill,p.wood,239,'mullion');for(let z=sill+.55;z<top;z+=.45)w.box(wx,fy+.06,z,ww,.12,.025,p.wood,239,'mullion');}else{for(const [x,dir]of [[wx,1],[wx+ww,-1]])for(let z=sill+.5;z<top;z+=.45)w.beam([x,fy,z],[x+dir*.35,fy+ww/2,z],.015,p.wood,239);}mark(239,wx+ww,16.5,'细窗格服从同一开窗尺寸');}
 if(has(240)){w.box(6.45,10,.17,.035,2.8,.04,p.wood,240,'joint-trim');w.box(6.45,10,2.7,.035,2.8,.04,p.wood,240,'joint-trim');w.box(6.45,10,.17,.035,.04,2.57,p.wood,240,'joint-trim');mark(240,7,12.8,'内表面与地面接缝的细收口');}
 partitionFloorFinish(w,205,233);
 w.state.structure={upperFloor:has(210)?upperFloor:null,sideRoofBase:has(209)&&(!has(206)||has(210))?sideRoofBase:null,doorBase,doorHeight};
 w.state.window={x:wx,y:fy,width:ww,sill,top,open:has(236)};
 return w.finish();
}
