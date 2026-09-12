import {colors as C,gateway,route} from './primitives.js?v=92d7972c59b4';
export function institution(d){
 const H=id=>d.has(id);d.text(500,38,'居住与机构 · 自主领域、共享空间和公共界面',0,18);
 d.rect(55,80,890,455,C.land);route(d,[[70,550],[930,550]],0,{width:14});d.text(500,600,'公共步行街',0);
 // 75–78 are alternative household briefs; UI keeps them mutually exclusive.
 d.rect(85,110,370,355,C.building);const household=[75,76,77,78].find(H)||0;
 if(household===75){d.rect(205,225,125,115,C.warm,75,'共同生活');for(const [x,y]of [[105,130],[285,130],[105,365],[285,365]]){d.rect(x,y,145,70,C.paper,75,'自主单元');route(d,[[x+72,y+35],[267,280]],75,{width:2});}}
 else if(household===76){d.rect(105,130,140,145,C.paper,76,'成人');d.rect(270,130,165,145,C.paper,76,'儿童');d.rect(105,300,330,140,C.warm,76,'共享起居');for(const x of [180,350])route(d,[[x,270],[x,320]],76,{width:4});}
 else if(household===77){d.rect(105,130,140,90,C.paper,77,'个人 A');d.rect(290,130,140,90,C.paper,77,'个人 B');d.rect(105,260,325,170,C.warm,77,'共同领域');route(d,[[175,220],[175,300],[360,300],[360,220]],77,{width:3});}
 else if(household===78){d.rect(130,160,265,220,C.warm,78,'单一主室');for(const [x,y,w,h,l]of [[95,220,50,70,'睡'],[215,125,80,50,'工作'],[380,250,50,65,'生活'],[220,365,80,60,'坐']])d.rect(x,y,w,h,C.paper,78,l);}
 else{d.rect(105,130,325,300,C.paper);d.text(267,285,'选择居住组织',0);}
 if(H(79)){d.rect(85,110,370,355,'none',79,'',{'stroke-dasharray':'8 4','stroke-width':3});d.rect(95,475,350,44,C.plant,79,'住户可改造的小花园');d.line(300,438,300,475,79,{arrow:true});}
 const units=H(80)?[[520,125],[725,125],[520,305],[725,305]]:[[520,125],[725,125]];
 const contact=H(82)?30:70;
 for(const [i,[x,y]]of units.entries()){const xx=x-(i%2?70-contact:0);d.rect(xx,y,160,125,C.paper,H(82)?82:H(80)?80:0);d.text(xx+80,y+20,H(80)?`自治组 ${i+1}`:'工作单元',H(80)?80:0);if(H(83)){d.circle(xx+75,y+70,22,C.warm,83);d.people(xx+52,y+42,83,4);route(d,[[xx+40,y+100],[xx+75,y+70],[xx+120,y+100]],83,{width:2});}}
 if(H(80))route(d,[[600,245],[600,278],[795-contact/2,278],[795-contact/2,310]],80,{width:3});
 if(H(81)){for(const x of [550,735]){gateway(d,x,450,81,'直接服务');route(d,[[x,540],[x,445]],81,{width:4});}}
 if(H(82)){d.line(665,190,685,190,82,{width:5,arrow:true});d.text(680,270,'高频联系 → 相邻',82,10);}
 if(H(84)){d.rect(510,275,160,60,C.warm,84,'青年自组织');d.people(540,318,84,4);route(d,[[590,330],[700,350]],84,{dash:'4 3'});d.circle(708,350,15,C.paper,84,'支持');}
 if(H(85)){d.rect(525,455,100,70,C.paper,85,'学习');d.rect(530,515,90,10,C.water,85);route(d,[[575,525],[575,550],[665,550],[665,480]],85,{width:2});}
 if(H(86)){d.rect(700,295,175,100,C.warm,86,'儿童之家');d.rect(700,395,175,36,C.plant,86,'共同游戏');route(d,[[785,431],[785,540]],86,{width:3});}
 if(H(87)){for(let n=0;n<4;n++){d.rect(485+n*108,470,88,60,[C.warm,C.paper,C.building,C.land][n],87);gateway(d,529+n*108,528,87,'');}}
 if(H(88)){d.rect(375,485,90,45,C.paper,88,'咖啡');for(const x of [400,435]){d.circle(x,557,9,C.warm,88);d.seats(x-10,570,88,1);}d.rect(385,525,70,8,C.water,88);}
 if(H(89)){d.rect(80,480,65,50,C.warm,89,'杂货');d.rect(80,455,65,23,C.building,89,'店主居住');route(d,[[75,460],[75,555],[165,555]],89,{width:3});}
 if(H(90)){d.rect(520,290,355,135,C.warm,90);route(d,[[530,315],[860,400]],90,{width:8});route(d,[[530,400],[860,315]],90,{width:8});for(const [x,y]of [[550,345],[690,305],[790,345],[690,385]]){d.circle(x,y,16,C.paper,90);d.seats(x-14,y+20,90,1);}}
 if(H(91)){d.rect(540,130,310,120,C.building,91);d.rect(615,167,160,72,C.warm,91,'客栈共同餐桌');for(const x of [545,620,695,770])d.rect(x,134,65,30,C.paper,91,'客房');}
 if(H(92)){d.rect(800,554,115,28,C.building,92);d.seats(815,566,92,3);d.rect(918,537,9,45,C.ink,92);d.rect(870,530,45,22,C.paper,92,'信息');}
 if(H(93)){d.rect(650,530,48,32,C.warm,93,'食摊');d.roof(645,530,58,93,16);route(d,[[675,562],[675,590]],93,{width:3});}
 if(H(94)){d.rect(215,552,120,30,C.plant,94);d.seats(228,570,94,3);d.line(215,583,335,583,94,{width:5});}
}
