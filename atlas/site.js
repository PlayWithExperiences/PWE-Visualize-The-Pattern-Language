import {colors as C,gateway,route} from './primitives.js?v=f839e046c358';
export function site(d){
 const H=id=>d.has(id);d.text(500,36,'建筑与场地 · 体量、入口和公共空间',0,19);d.rect(55,70,890,505,C.land);d.text(910,100,'北 ↑',0);
 route(d,[[75,540],[925,540]],0,{width:13});
 const north=H(105),repair=H(104),wing=H(107),thin=H(109);let y=north?130:245,x=repair?420:240,w=thin?400:310,h=wing?75:thin?95:145;
 if(H(104)){d.tree(250,210,104,44);d.circle(250,210,70,'none',104);d.hatch(470,160,210,135,104);d.text(250,310,'保留优质树地',104);}
 const owner=H(109)?109:H(107)?107:H(105)?105:H(104)?104:0;
 if(H(95)){d.building(x,y,110,h,95,'单元 A');d.building(x+150,y,w-150,h,95,'单元 B');route(d,[[x+55,y+h],[x+55,y+h+22],[x+w-70,y+h+22],[x+w-70,y+h]],95,{width:5});}
 else d.building(x,y,w,h,owner,'日常活动');
 if(H(107)){d.building(x+w+25,y,70,220,107,'光翼');d.rect(x,y+h+8,w,18,C.water,107);}
 const stories=H(96)?(H(21)?4:6):1;if(H(96)){for(let n=0;n<stories;n++)d.rect(810+n*9,130-n*15,70,18,C.building,96);d.text(848,185,`示例需求：${stories} 层`,96,10);}
 if(H(97)){d.rect(80,380,140,100,'#bebfb1',97);d.rect(72,370,165,16,C.plant,97);d.rect(224,370,13,85,C.plant,97);route(d,[[150,480],[150,520],[x+w/2,520]],97,{width:3});}
 if(H(98)){for(const [xx,yy,ww,hh]of [[75,95,850,465],[x-20,y-20,w+40,h+50],[x+15,y+15,w-30,h-30]])d.rect(xx,yy,ww,hh,'none',98,'',{'stroke-dasharray':'5 5'});for(const [gx,gy]of [[500,555],[x+w/2,y+h+30]])gateway(d,gx,gy,98,'领域');}
 if(H(99)){d.building(620,220,130,100,99,'共同核心');d.roof(610,220,150,99,48);route(d,[[685,320],[685,540]],99,{width:7});}
 if(H(100)){route(d,[[x-20,y+h+38],[x+w+110,y+h+38]],100,{width:13});for(let xx=x;xx<x+w;xx+=90){gateway(d,xx+30,y+h+8,100,'');for(let n=0;n<4;n++)d.line(xx+50,y+h+8+n*7,xx+73,y+h+8+n*7,100);}}
 if(H(101)){route(d,[[x-40,y+h/2],[x+w+40,y+h/2]],101,{width:17,stroke:C.paper});for(const xx of [x-20,x+w+20])gateway(d,xx,y+h/2,101,'通街');}
 if(H(102))for(const xx of [x+35,x+w-40,685]){d.roof(xx-23,y+h,46,102,15);gateway(d,xx,y+h+22,102,'');}
 if(H(103)){for(const [xx,yy]of [[95,475],[710,480],[830,380]]){d.rect(xx,yy,80,45,C.path,103);for(let n=0;n<3;n++)d.rect(xx+5+n*25,yy+8,15,25,C.paper,103);d.tree(xx-12,yy+20,103,12);route(d,[[xx+40,yy+45],[xx+40,530]],103,{width:2});}}
 if(H(106)){d.path('M390,420V320H580V420','none',106,{'stroke-width':13,stroke:C.building});d.rect(407,337,155,83,'#d2d9bc',106);}
 if(H(108)){d.building(80,130,125,100,108,'已有');route(d,[[205,195],[x,195],[x,y+h/2]],108,{width:14});}
 const doorX=x+w/2,doorY=y+h;
 if(H(110)){d.rect(doorX-28,doorY,56,36,C.warm,110);d.roof(doorX-35,doorY,70,110,20);route(d,[[doorX,540],[doorX,doorY+40]],110,{width:3,arrow:true});}
 if(H(111)){d.rect(x+w+8,y+35,65,130,C.plant,111);d.line(x+w+73,y+35,x+w+73,y+125,111,{width:5});d.line(x+w+8,y+165,x+w+46,y+165,111,{width:5});}
 if(H(112)){route(d,[[doorX-85,535],[doorX-85,doorY+70],[doorX,doorY+50],[doorX,doorY]],112,{width:10});gateway(d,doorX-85,doorY+90,112,'过渡');}
 if(H(113)){d.rect(doorX-150,480,65,40,C.path,113,'车');route(d,[[doorX-110,480],[doorX,450],[doorX,doorY]],113,{width:4,arrow:true});}
 if(H(114)){for(const [xx,yy,ww,hh]of [[730,425,140,95],[760,395,80,30],[782,376,36,19]]){d.rect(xx,yy,ww,hh,C.paper,114);d.line(xx,yy,xx+ww,yy,114,{width:5});}route(d,[[800,390],[800,450],[800,540]],114,{arrow:true});}
 if(H(115)){d.rect(415,320,140,90,C.paper,115);for(const [xx,yy]of [[415,365],[485,320],[555,365]]){gateway(d,xx,yy,115,'');route(d,[[xx,yy],[485,365]],115,{width:3});}route(d,[[485,365],[485,460]],115,{width:4});}
 if(H(116)){for(const [xx,yy,ww,hh]of [[400,140,160,60],[310,158,95,32],[555,160,95,28]])d.roof(xx,yy,ww,116,hh);}
 if(H(117)){d.roof(x-25,y,w+50,117,65);d.line(x-25,y,x-25,y+35,117,{width:4});d.line(x+w+25,y,x+w+25,y+35,117,{width:4});}
 if(H(118)){d.rect(x+30,y+20,115,55,C.plant,118,'屋顶花园');route(d,[[x+145,y+47],[x+185,y+47]],118,{width:6});}
 if(H(119)){d.rect(x-15,y+h+5,w+30,25,'none',119);for(let xx=x;xx<x+w;xx+=35)d.circle(xx,y+h+28,3,C.ink,119);}
 if(H(120)){const targets=[[190,345],[480,460],[720,345]];route(d,targets,120,{width:7});for(const [xx,yy]of targets)d.tree(xx,yy,120,13);}
 if(H(121))d.path('M170,510Q450,400 735,510Q450,555 170,510Z','#dfd3bd',121);
 if(H(122)){for(const xx of [80,780]){d.building(xx,465,120,65,122);d.line(xx,534,xx+120,534,122,{width:3});}}
 if(H(123)){d.rect(370,445,160,65,C.paper,123);d.people(400,465,123,7);d.text(450,500,'按使用人数收拢',123,10);}
 if(H(124))for(const xx of [270,550]){d.path(`M${xx},425v-35h65v35`,C.warm,124);d.seats(xx+10,408,124,2);}
 if(H(125))for(let n=0;n<5;n++)d.rect(610-n*5,430+n*10,85+n*10,10,C.building,125);
 if(H(126)){d.circle(575,470,15,C.water,126);route(d,[[480,540],[540,480],[620,460],[720,540]],126,{width:3});}
}
