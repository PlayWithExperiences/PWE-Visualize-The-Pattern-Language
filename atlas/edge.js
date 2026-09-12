import {colors as C,pane,route} from './primitives.js?v=a8cc37458ddd';
export function edge(d){
 const H=id=>d.has(id);d.text(500,36,'建筑边缘 · 房屋与花园的连续生活',0,19);d.rect(55,70,890,505,C.land);
 d.building(150,120,580,150,0,'室内');d.roof(135,120,610,0,40);d.rect(150,270,580,H(167)?120:50,C.building,H(167)?167:0);d.text(420,H(167)?370:303,H(167)?'可围坐的阳台进深':'室外边缘',H(167)?167:0);
 pane(d,210,175,90,60,0);if(H(159)){d.path('M730,120L790,155V305L730,270Z',C.building,159);d.path('M744,175L772,191V261L744,245Z',C.water,159);route(d,[[820,230],[750,210]],159,{stroke:'#c6a353',arrow:true});route(d,[[255,290],[320,210]],159,{stroke:'#c6a353',arrow:true});}
 if(H(160)){for(const x of [180,350,550]){d.rect(x,273,90,40,C.warm,160);d.seats(x+14,297,160,2);}d.line(150,315,730,315,160,{width:4});}
 if(H(161)){d.rect(190,320,130,85,'#e8d39f',161);d.line(180,315,180,410,161,{width:7});d.seats(218,375,161,3);d.tree(310,330,161,18);}
 if(H(162)){for(let n=0;n<3;n++){d.rect(755+n*45,230+n*13,45,40-n*9,C.building,162);}d.text(825,296,'北侧逐级降低',162,10);}
 if(H(163)){d.path('M355,350V315H540V350',C.warm,163,{'stroke-width':6});d.circle(445,356,25,C.paper,163);d.seats(412,392,163,3);route(d,[[445,270],[445,335]],163,{width:6});}
 if(H(164)){pane(d,580,175,100,70,164,{low:true});d.seats(600,252,164,2);route(d,[[635,210],[780,420]],164,{dash:'4 3',width:2});}
 if(H(165)){d.rect(390,210,150,80,C.land,165);d.path('M390,210l-32,25v55l32,-15M540,210l32,25v55l-32,-15','none',165);route(d,[[465,235],[465,425],[565,425]],165,{width:7});}
 if(H(166)){d.rect(170,150,550,25,'none',166);for(const x of [185,350,545]){d.line(x,150,x,200,166,{width:3});d.rect(x+10,140,45,10,C.water,166);}d.line(170,178,720,178,166,{width:3});}
 if(H(167))d.seats(210,340,167,4);
 if(H(168)){for(let n=0;n<4;n++)d.rect(210-n*10,390+n*18,440+n*20,18,['#d1c5b1','#dbcfb8','#d6d6b8','#c8d0b0'][n],168);}
 if(H(169)){for(let n=0;n<4;n++){d.path(`M65,${420+n*35}Q200,${360+n*35} 340,${445+n*35}`,'none',169,{'stroke-width':9,stroke:'#b8ba96'});}d.text(177,582,'顺等高线成台地',169,10);}
 if(H(170)){for(const [x,y]of [[720,445],[780,455],[840,445]]){d.tree(x,y,170,22);for(const dx of [-8,8])d.circle(x+dx,y+3,3,'#c28755',170);}route(d,[[720,480],[850,480]],170,{width:3});}
 if(H(171)){for(const [x,y]of [[370,435],[420,470],[530,470],[580,435]])d.tree(x,y,171,28);d.seats(445,462,171,2);}
 if(H(172)){for(let n=0;n<22;n++){const x=90+(n*113)%800,y=470+(n*47)%75;d.circle(x,y,5+n%4*3,['#8d9f70','#afbc87','#798e69'][n%3],172);}}
 if(H(173)){d.path('M70,510V335M70,315V290M70,510H670M720,510H920V310','none',173,{'stroke-width':10,stroke:'#b5af95'});}
 if(H(174)){route(d,[[320,275],[320,445]],174,{width:36,stroke:'#bbcba6'});for(let y=280;y<445;y+=24)d.line(300,y,340,y,174,{width:3});d.tree(300,380,174,10);}
 if(H(175)){d.rect(735,175,145,130,C.water,175);d.roof(728,175,160,175,40);for(const x of [760,795,830])d.line(x,175,x,305,175);route(d,[[710,235],[800,235],[800,335]],175,{width:5});}
 if(H(176)){d.path('M790,375V330H890V375','none',176,{'stroke-width':18,stroke:C.plant});d.seats(815,360,176,2);d.line(843,365,880,420,176,{dash:'3 3'});}
 if(H(177)){for(let n=0;n<4;n++){d.rect(90+n*32,375,24,82,C.active,177);for(let y=385;y<450;y+=18)d.circle(102+n*32,y,4,C.plant,177);}d.rect(85,340,55,25,C.building,177,'工具');}
 if(H(178)){d.rect(620,530,110,42,C.building,178,'专业处理');d.rect(775,530,105,42,C.warm,178,'堆肥成熟');route(d,[[710,260],[920,260],[920,590],[600,590],[620,550]],178,{width:2,arrow:true});route(d,[[730,550],[775,550]],178,{width:3,arrow:true});route(d,[[775,571],[520,595],[160,470]],178,{width:3,stroke:'#8a9867',arrow:true});}
}
