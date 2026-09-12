import {colors as C,gateway,route,pane} from './primitives.js?v=8207f127fbc7';
export function plan(d){
 const H=id=>d.has(id);d.text(500,36,'建筑平面 · 共同生活与私人领域',0,19);d.rect(80,85,840,440,C.land);
 d.rect(130,120,720,360,C.building);const privateX=H(127)?670:145,commonX=H(129)?410:330,commonY=H(128)?305:230;
 d.rect(commonX-110,commonY-70,220,145,C.warm,H(129)?129:H(128)?128:0,(H(139)||H(147))?'':'共享起居');
 d.rect(privateX,145,150,125,C.paper,H(127)?127:0,(H(136)||H(138))?'':'私人领域');gateway(d,500,490,0,'主要入口');
 if(H(127)){route(d,[[500,490],[500,380],[600,380],[600,285],[735,285]],127,{width:4,arrow:true});d.text(705,300,'向内渐静',127,10);}
 if(H(128)){pane(d,commonX-90,467,180,10,128);route(d,[[commonX,550],[commonX,430]],128,{stroke:'#c99b48',width:3,arrow:true});d.text(760,565,'南侧日光（北半球示意）',128,11);}
 if(H(129))route(d,[[500,490],[540,390],[540,175]],129,{width:5});
 if(H(130)){d.rect(452,445,96,80,C.paper,130,'迎接');d.rect(452,497,96,28,C.warm,130);}
 if(H(131)){route(d,[[290,330],[415,330],[550,330],[550,210],[430,210]],131,{width:7});for(const x of [290,430,550])d.rect(x-25,270,50,15,C.paper,131);}
 if(H(132)){d.rect(170,290,115,60,C.paper,132);pane(d,170,295,10,45,132);d.seats(195,329,132,2);d.rect(205,290,65,12,C.active,132);}
 if(H(133)){for(let n=0;n<7;n++)d.rect(548-n*2,270+n*13,45+n*4,13,C.building,133);d.people(575,345,133,2);}
 if(H(134)){d.line(125,280,125,370,134,{width:9});d.rect(122,310,6,14,C.water,134);route(d,[[190,400],[190,317],[80,317]],134,{width:2,dash:'4 3'});d.tree(72,317,134,16);}
 if(H(135)){for(const [x,y,r]of [[500,470,32],[570,325,30],[250,170,25]]){d.circle(x,y,r,'#efd29e',135);d.circle(x,y,r*.3,'#f6e8c9',135);}d.rect(340,405,85,22,'#a4aa99',135);}
 if(H(136)){d.rect(645,130,190,150,C.paper,136,'伴侣领域');if(!H(138))d.rect(682,180,90,55,C.warm,136);d.line(645,267,645,300,136,{width:6});}
 if(H(137)){d.rect(165,145,125,110,C.paper,137,'儿童');route(d,[[230,230],[230,390],[160,390],[100,430]],137,{stroke:'#aa895e',width:8});d.rect(90,420,90,70,C.plant,137,'户外游戏');}
 if(H(138)){d.rect(725,175,73,50,C.warm,138);pane(d,838,168,12,70,138);route(d,[[915,203],[780,203]],138,{stroke:'#c99b48',arrow:true});}
 if(H(139)){d.path(`M${commonX-105},${commonY-65}h190v25h-165v50h-25Z`,C.building,139);if(!H(147)){d.circle(commonX,commonY+25,27,C.paper,139);d.text(commonX,commonY+28,'共厨',139,10);}}
 if(H(140)){d.rect(290,485,140,52,C.building,140);d.line(290,538,430,538,140,{width:7});d.seats(315,518,140,3);route(d,[[350,460],[350,495]],140,{width:6});}
 if(H(141))for(const x of [650,750]){d.rect(x,300,78,70,C.paper,141,'个人');d.rect(x+10,315,35,20,C.active,141);}
 if(H(142)){for(const [x,y,w,h]of [[175,375,80,75],[280,385,75,50],[420,390,75,40]]){d.path(`M${x},${y+h}V${y}h${w}v${h}`,'none',142,{'stroke-width':4});d.seats(x+12,y+25,142,2);}}
 if(H(143)){d.rect(170,150,140,110,C.plant,143);for(const [x,y]of [[175,155],[255,155],[215,220]]){d.rect(x,y,47,32,C.paper,143);d.line(x,y+35,x+47,y+35,143,{dash:'3 2'});}}
 if(H(144)){d.rect(600,280,60,105,C.water,144,'沐浴');route(d,[[550,335],[610,335],[680,335]],144,{width:3});}
 if(H(145)){d.hatch(310,125,240,40,145);d.text(430,150,'预留大件储物',145);}
 if(H(146)){for(const x of [340,405,470])for(const y of [165,225])d.circle(x,y,5,C.ink,146);d.line(405,165,405,205,146,{dash:'4 3'});d.line(405,225,470,225,146,{dash:'4 3'});}
 if(H(147)){d.rect(commonX-70,commonY+10,140,42,C.paper,147);for(const yy of [commonY-6,commonY+63])d.seats(commonX-55,yy,147,5);}
 if(H(148)){for(const [x,y]of [[345,165],[455,165]]){d.circle(x,y,28,C.paper,148);d.people(x-22,y-15,148,4);}route(d,[[345,198],[400,240],[455,198]],148,{width:3});}
 if(H(149)){d.seats(555,428,149,3);d.rect(620,425,38,40,C.warm,149,'接待');d.circle(580,451,12,C.paper,149);}
 if(H(150)){d.rect(675,400,150,60,C.paper,150);d.seats(680,425,150,2);d.rect(750,407,65,30,C.warm,150,'阅读');}
 if(H(151)){for(const x of [310,420]){d.rect(x,170,85,72,C.paper,151);d.circle(x+42,210,17,C.warm,151);d.people(x+24,185,151,3);}}
 if(H(152)){d.rect(680,315,140,75,C.paper,152);d.seats(685,358,152,2);d.rect(780,327,32,40,C.active,152);d.line(748,330,748,390,152,{width:4});}
 if(H(153)){d.rect(665,130,170,120,'none',153,'',{'stroke-width':4});gateway(d,850,205,153,'独立入口');d.rect(790,135,38,35,C.water,153);d.line(660,205,675,205,153,{dash:'2 3'});}
 if(H(154)){d.rect(760,78,130,62,C.paper,154,'青年小屋');gateway(d,888,110,154,'');route(d,[[810,140],[810,150]],154,{width:4});}
 if(H(155)){d.rect(725,477,160,66,C.paper,155,'地面小屋');d.seats(768,555,155,2);route(d,[[805,540],[805,580]],155,{width:4});}
 if(H(156)){d.rect(170,380,110,70,C.warm,156,'个人工作');d.rect(180,390,28,42,C.active,156);d.rect(225,390,40,42,'none',156,'',{'stroke-dasharray':'4 3'});}
 if(H(157)){d.rect(130,470,140,75,C.paper,157,'家庭作坊');pane(d,140,535,65,10,157);gateway(d,235,545,157,'');}
 if(H(158)){for(let n=0;n<9;n++)d.rect(865,220+n*20,42,20,C.building,158);d.rect(820,200,87,25,C.paper,158);route(d,[[886,540],[886,225],[830,225]],158,{width:2,arrow:true});}
}
