import {colors as C,pane,route} from './primitives.js';
export function construction(d){
 const H=id=>d.has(id);d.text(500,32,'构造剖面 · 原书体系的概念图解',0,19);d.text(500,55,'不含荷载、材料性能、节点尺寸或工程验算',0,11);
 d.rect(60,495,880,95,C.land);d.line(65,495,935,495,0,{width:3});
 const wallX=H(211)?160:190,wallW=H(211)?55:24,top=230;
 if(H(190))d.line(210,280,380,280,190,{width:6});
 d.rect(wallX,top,wallW,265,C.building,H(211)?211:0);d.rect(780,230,24,265,C.building);d.rect(190,490,614,15,C.building);
 let cols=H(205)?[190,390,580,780]:[190,485,780];if(H(212))cols=[190,365,600,780];if(H(213))cols=[...new Set([...cols,277,687])].sort((a,b)=>a-b);
 for(const x of cols)d.rect(x,top,15,265,C.building,H(213)?213:H(212)?212:H(205)?205:0);
 if(H(205)){d.rect(215,465,165,18,C.warm,205);d.rect(420,465,135,18,C.warm,205);d.text(292,457,'活动领域',205,10);}
 if(H(206)){d.path('M205,495V265Q385,180 485,265Q655,185 785,265V495','none',206,{'stroke-width':12,stroke:'#bba98e'});for(const [x,y]of [[300,232],[640,235]])route(d,[[x,y],[x-45,y+45],[x-65,480]],206,{stroke:'#a3704c',width:2,arrow:true});}
 if(H(207)){for(const [i,c]of [C.land,'#c7b39a','#e2d4bc'].entries()){d.rect(75,140+i*50,90,35,c,207);d.path(`M85,${150+i*50}l10,10l12,-8l13,11`,'none',207);}d.text(119,307,'可加工 / 修补',207,10);}
 if(H(208)){for(let n=0;n<3;n++){const x=100+n*145;d.path(`M${x},110v-25h95v25`,'none',208,{'stroke-width':2+n*3});if(n)d.hatch(x+3,90,89,n*7,208);if(n<2)d.line(x+100,100,x+135,100,208,{arrow:true});}d.text(300,129,'轻框 → 填充 → 加强（过程设想）',208,10);}
 if(H(209)){d.roof(175,230,225,209,70);d.roof(400,205,225,209,120);d.roof(625,230,194,209,60);}else d.roof(175,230,645,0,100);
 if(H(210)){d.line(210,350,780,350,210,{width:9});for(const x of [365,600])d.line(x,230,x,485,210,{dash:'4 4',width:2});d.text(505,342,'上下层支点协调',210,10);}
 if(H(211)){d.rect(163,350,45,60,C.paper,211);d.seats(166,400,211,1);d.roof(142,top,70,211,25);}
 if(H(214)){for(const x of [197,787])d.path(`M${x-7},488L${x-27},530L${x-52},565M${x},490V552M${x+7},488L${x+28},530L${x+48},564`,'none',214,{'stroke-width':8,stroke:'#ad9673'});d.text(485,571,'214：原书明确未解决的结构挑战',214,12);}
 if(H(215)){d.rect(172,475,644,20,C.building,215);for(let n=0;n<3;n++)d.rect(816+n*22,478+n*8,24,17,C.building,215);}
 if(H(216)){d.rect(600,260,34,215,C.active,216);d.rect(608,266,18,205,C.paper,216);d.text(651,380,'壳 / 芯',216,10);}
 if(H(217)){d.rect(180,222,635,20,C.active,217);d.line(195,235,785,235,217,{width:2});}
 if(H(218)){d.rect(780,250,8,235,C.active,218);d.hatch(788,250,20,235,218);d.rect(808,250,8,235,C.active,218);}
 if(H(219)){d.path('M210,365Q335,300 465,365Q620,290 780,365L780,340H210Z',C.building,219);d.line(210,339,780,339,219,{width:4});}
 if(H(220)){d.path('M175,230Q475,28 820,230L820,213Q475,9 175,213Z',C.building,220);for(let x=250;x<720;x+=65)d.line(x,180-Math.sin((x-175)/645*Math.PI)*70,x+10,169-Math.sin((x-175)/645*Math.PI)*70,220,{width:3});}
 const sill=H(222)?425:390,windowX=H(221)?260:300,windowW=H(221)?110:85;
 pane(d,windowX,305,windowW,sill-305,H(222)?222:H(221)?221:0,{});
 if(H(221)){d.people(windowX+35,440,221,1);route(d,[[windowX+38,440],[windowX+55,340]],221,{width:2,dash:'3 3'});}
 if(H(222)){d.seats(windowX+28,451,222,2);d.line(windowX+40,440,windowX+40,410,222,{arrow:true});}
 if(H(223)){d.path(`M${windowX},305l-22,-20v${sill-285+20}l22,-20Z`,C.warm,223);d.path(`M${windowX+windowW},305l22,-20v${sill-285+20}l-22,-20Z`,C.warm,223);}
 const doorH=H(224)?135:175;d.rect(465,490-doorH,72,doorH,C.paper,H(224)?224:0);if(H(224))d.rect(458,480-doorH,86,10,C.active,224);
 if(H(225)){d.rect(windowX-9,296,windowW+18,sill-287,'none',225,'',{'stroke-width':9});}
 if(H(226)){d.rect(677,260,28,220,C.building,226);d.rect(650,446,85,15,C.warm,226);d.line(650,455,650,480,226,{width:5});}
 if(H(227)){for(const x of [205,600,780])d.path(`M${x},250v40l40,-40Z`,C.active,227);}
 if(H(228)){d.path('M560,485Q600,390 755,355L755,340Q595,385 540,485Z',C.building,228);for(let n=0;n<9;n++)d.path(`M${550+n*22},${480-n*15}h24v-15`,'none',228);d.rect(630,450,60,30,C.warm,228);}
 if(H(229)){route(d,[[820,490],[820,245],[205,245]],229,{stroke:'#588c98',width:5});d.rect(810,370,20,30,C.paper,229);d.text(855,385,'检修',229,10);}
 if(H(230)){d.rect(405,450,12,35,C.active,230);for(let n=0;n<3;n++)route(d,[[420,460+n*8],[446,452+n*8]],230,{stroke:'#bc8252',arrow:true,width:2});d.seats(430,477,230,1);}
 if(H(231)){d.rect(580,152,80,65,C.building,231);d.roof(573,152,94,231,30);pane(d,598,163,43,47,231);d.line(580,218,660,218,231,{width:4});}
 if(H(232)){d.circle(495,120,9,C.active,232);d.path('M485,110l10,-27l10,27Z',C.active,232);}
 if(H(233)){d.rect(212,477,220,10,'url(#brick)',233);d.rect(630,477,140,10,'#c4baaa',233);d.line(620,475,620,490,233,{width:3});}
 if(H(234)){for(let y=255;y<485;y+=18)d.path(`M818,${y}l13,12h-13Z`,C.building,234);}
 if(H(235)){d.rect(208,260,8,210,'#decaae',235);d.rect(214,395,25,28,C.paper,235);d.circle(228,399,2,C.ink,235);}
 if(H(236)){d.path(`M${windowX},305l-35,22v${sill-305}l35,-22M${windowX+windowW},305l35,22v${sill-305}l-35,-22`,'none',236,{'stroke-width':3});route(d,[[windowX-70,360],[windowX+40,360]],236,{stroke:'#659993',arrow:true});}
 if(H(237)){pane(d,477,490-doorH+18,48,doorH*.45,237);d.circle(529,450,3,C.active,237);}
 if(H(238)){for(let n=0;n<9;n++){d.circle(windowX+n*windowW/9,302+(n%2)*9,6,C.plant,238);}d.line(windowX,295,windowX+windowW,295,238,{width:2});}
 if(H(239)){for(let x=windowX+20;x<windowX+windowW;x+=20)d.line(x,305,x,sill,239,{width:2});for(let y=325;y<sill;y+=20)d.line(windowX,y,windowX+windowW,y,239,{width:2});}
 if(H(240)){d.line(208,469,780,469,240,{width:3,stroke:'#a67e58'});d.rect(462,490-doorH-3,78,doorH+3,'none',240,'',{'stroke-width':2,stroke:'#a67e58'});}
}
