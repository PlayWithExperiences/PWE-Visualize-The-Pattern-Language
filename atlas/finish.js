import {colors as C,pane,route} from './primitives.js';
export function finish(d){
 const H=id=>d.has(id);d.text(500,36,'生活细节 · 门前、材料、座位与光',0,19);
 d.rect(70,415,860,160,C.land);d.rect(170,140,620,275,H(250)?'#e5c599':C.building,H(250)?250:0);d.roof(150,140,660,0,60);
 d.rect(440,250,85,165,C.paper);pane(d,230,210,140,105,0);pane(d,590,210,135,105,0);
 d.rect(170,415,620,120,H(248)?'url(#brick)':C.path,H(248)?248:0);
 if(H(247)){for(let x=180;x<780;x+=60)for(let y=427;y<525;y+=38){d.rect(x,y,52,30,C.building,247);d.path(`M${x+55},${y+14}l-4,-8m4,8l6,-5`,'none',247,{stroke:'#698359','stroke-width':3});}}
 if(H(241)){d.circle(750,385,62,'#ead4a2',241);d.line(810,335,810,430,241,{width:7});d.seats(714,400,241,3);route(d,[[735,393],[845,470]],241,{width:2,dash:'4 3'});d.people(850,480,241,2);}
 if(H(242)){d.rect(355,386,75,12,C.warm,242);d.line(360,398,360,416,242,{width:4});d.line(420,398,420,416,242,{width:4});d.tree(340,385,242,18);}
 if(H(243)){d.rect(580,476,170,24,C.building,243);d.line(580,476,750,476,243,{width:5});d.people(617,455,243,3);}
 if(H(244)){d.path('M190,188H385L425,255H160Z','#e9dbb7',244);for(let x=210;x<385;x+=35)d.line(x,190,x+20,245,244,{width:1});d.rect(190,183,195,8,C.active,244);route(d,[[408,257],[383,204]],244,{arrow:true,width:2});}
 if(H(245)){d.rect(200,370,100,45,C.building,245);for(let x=210;x<295;x+=19){d.line(x,370,x,343,245,{stroke:C.plant});d.circle(x,343,6,['#c18c64','#ded0a0'][x%2],245);}d.text(250,440,'抬高花床',245,10);}
 if(H(246)){for(const x of [431,535]){d.path(`M${x},413q-20,-60 0,-115t0,-65`,'none',246,{stroke:C.plant,'stroke-width':4});for(let y=255;y<400;y+=27)d.circle(x+(y%2?7:-7),y,8,C.plant,246);}}
 if(H(248)){for(const [x,y]of [[230,455],[530,495],[680,430]])d.path(`M${x},${y}l25,4l8,12l-21,3Z`,'#dcc9ad',248,{'stroke-width':.6});}
 if(H(249)){for(let x=180;x<785;x+=22)d.path(`M${x},157l8,9l8,-9`,'none',249,{stroke:'#9c704b'});for(let y=245;y<410;y+=20)d.circle(428,y,3,C.active,249);}
 if(H(250)){d.path('M235,315L300,395H390L360,315Z','#eddbb5',250,{'stroke-width':0});d.rect(690,335,30,45,'#829994',250);}
 if(H(252)){for(const [x,y,r]of [[290,340,55],[608,370,60]]){d.circle(x,y,r,'#f0dfa9',252,'',{'fill-opacity':.32,stroke:'none'});d.line(x,y-100,x,y-45,252);d.path(`M${x-13},${y-45}l13,-12l13,12Z`,C.active,252);d.circle(x,y,13,C.warm,252);}}
 const chairs=H(251)?[[530,363,28,45],[575,360,40,26],[638,370,24,35]]:[[550,370,26,28],[590,370,26,28],[630,370,26,28]];
 for(const [i,[x,y,w,h]]of chairs.entries()){d.rect(x,y,w,h,H(251)?['#b89773','#cbbb9a','#92a59a'][i]:C.warm,H(251)?251:0);d.line(x,y+h,x,y+h+12,H(251)?251:0);d.line(x+w,y+h,x+w,y+h+12,H(251)?251:0);if(H(251)&&i===1)d.line(x-4,y+12,x+w+4,y+12,251,{width:5});}
 if(H(253)){for(const [x,y,w,h]of [[550,180,26,33],[600,168,35,40],[661,181,28,30]]){d.rect(x,y,w,h,C.active,253);d.rect(x+4,y+4,w-8,h-8,C.paper,253);d.circle(x+w/2,y+h/2,5,C.warm,253);}d.rect(550,325,150,8,C.active,253);d.path('M570,325v-20q12,-15 24,0v20Z',C.warm,253);d.text(620,447,'照片 · 收藏 · 生活记忆',253,11);}
}
