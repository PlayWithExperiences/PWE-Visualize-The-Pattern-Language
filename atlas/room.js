import {colors as C,pane,route} from './primitives.js?v=580c78464447';
export function room(d){
 const H=id=>d.has(id);d.text(500,36,'房间 · 活动平面与高度剖面',0,19);
 d.rect(90,85,820,360,C.land);d.rect(140,120,690,285,H(250)?'#e7c79e':C.paper,H(250)?250:0);
 const bedroomX=H(127)?665:610;
 if(H(191)){d.rect(140,120,430,285,'none',191,'',{'stroke-width':5});d.rect(610,120,220,285,'none',191,'',{'stroke-width':5});}else d.path('M140,120H550L570,170V405H140Z','none',0,{'stroke-width':4});
 d.line(610,120,610,405,0,{width:7});pane(d,210,112,110,12,0);
 if(H(179)){d.path('M135,200H95V300H135',C.warm,179,{'stroke-width':5});d.seats(103,267,179,1);}
 if(H(180)){d.rect(203,126,125,52,C.warm,180);d.seats(221,157,180,4);d.line(203,130,203,174,180,{width:4});d.line(328,130,328,174,180,{width:4});}
 if(H(181)){d.rect(402,125,75,30,C.active,181);d.path('M423,148q-12,-20 10,-32q-3,15 18,25Z','#c77a45',181);d.seats(381,188,181,4);}
 const tableX=H(185)?275:H(184)?315:350;
 if(H(182)){d.circle(tableX,278,70,'#ecd7ae',182);d.rect(tableX-47,254,94,48,C.warm,182);for(const y of [240,316])d.seats(tableX-34,y,182,3);}
 if(H(183)){d.path('M180,375V310H260V345',C.building,183);d.rect(185,325,60,25,C.warm,183);d.circle(220,367,10,C.paper,183);route(d,[[220,367],[320,350]],183,{width:2,arrow:true});}
 if(H(184)){d.path('M355,145H555V250H525V175H355Z',C.building,184);for(const [x,y]of [[378,158],[488,158],[540,228]])d.circle(x,y,9,C.paper,184);route(d,[[378,158],[488,158],[540,228],[378,158]],184,{width:2,dash:'4 3'});}
 if(H(185)){for(let i=0;i<6;i++){const a=i*Math.PI/3;d.rect(410+Math.cos(a)*65,300+Math.sin(a)*52,24,18,C.warm,185);}route(d,[[520,210],[545,345],[485,385]],185,{width:4});}
 if(H(186)){for(const x of [255,305,355]){d.rect(x,335,40,60,C.warm,186);d.rect(x+5,341,30,12,C.paper,186);}d.text(315,428,'临时聚宿 · 可收起',186,10);}
 d.rect(bedroomX+20,145,105,80,C.warm,0);
 if(H(187)){d.rect(bedroomX+12,137,121,96,'none',187,'',{'stroke-width':5});for(const x of [bedroomX+12,bedroomX+133])d.circle(x,137,5,C.active,187);d.rect(bedroomX+20,150,105,20,C.paper,187);}
 if(H(188)){d.path(`M${bedroomX+8},${145+88}V130h130v103`,'none',188,{'stroke-width':9});d.line(bedroomX+8,233,bedroomX+138,233,188,{dash:'3 4'});}
 if(H(189)){d.rect(650,250,145,60,C.paper,189);d.rect(650,250,145,15,C.building,189);pane(d,650,270,8,30,189);d.rect(680,335,92,55,C.water,189);route(d,[[720,220],[720,345]],189,{width:3});}
 if(H(192)){pane(d,822,240,14,90,192);d.people(858,290,192,3);d.tree(880,200,192,19);route(d,[[740,285],[880,285]],192,{width:2,dash:'3 4'});}
 if(H(193)){d.rect(602,230,16,105,C.paper,193);d.rect(602,245,16,30,C.building,193);d.circle(610,232,6,C.ink,193);d.circle(610,335,6,C.ink,193);}
 if(H(194)){pane(d,602,165,16,48,194);route(d,[[675,183],[550,183]],194,{width:2,stroke:'#c29e57'});}
 if(H(195)){d.rect(510,295,75,100,'none',195,'',{'stroke-width':3});for(let y=300;y<395;y+=10)d.line(515,y,580,y,195);route(d,[[548,385],[548,305]],195,{arrow:true});}
 const doorX=H(196)?155:350;d.rect(doorX,398,50,12,C.paper,H(196)?196:0);d.path(`M${doorX},405v-45q45,0 45,45`,'none',H(196)?196:0);
 if(H(197)){d.rect(830,120,45,285,C.building,197);for(const y of [150,215,340])d.rect(835,y,32,40,C.paper,197);}
 if(H(198)){d.rect(570,130,32,100,C.building,198);for(let y=140;y<230;y+=23)d.line(570,y,600,y,198);d.rect(600,352,35,40,C.building,198);}
 if(H(199)){d.rect(390,371,155,28,C.building,199);pane(d,392,398,150,10,199);route(d,[[475,440],[475,383]],199,{stroke:'#c4a057',width:3,arrow:true});}
 if(H(200)){d.rect(150,130,23,130,C.building,200);for(let y=140;y<250;y+=22)d.circle(161,y,6,C.paper,200);}
 if(H(201)){d.rect(180,391,130,9,C.active,201);d.rect(650,391,150,9,C.active,201);d.circle(225,388,6,C.paper,201);}
 if(H(202)){d.rect(355,340,100,28,'none',202,'',{'stroke-dasharray':'4 3'});d.seats(190,277,202,3);route(d,[[390,342],[260,290]],202,{arrow:true});d.text(375,383,'试坐 → 确定位置',202,10);}
 if(H(203)){d.path('M510,392v-40q23,-28 48,0v40Z',C.active,203);d.people(526,365,203,1);}
 if(H(204)){d.rect(802,130,20,22,C.building,204);d.rect(806,135,12,12,C.warm,204);d.line(802,154,822,154,204,{dash:'2 2'});}
 // Linked section: ceiling profile responds to room hierarchy rather than a loose annotation.
 d.text(155,480,'高度剖面',0,12);d.line(140,600,830,600,0,{width:5});
 const heights=H(190)?[90,125,65]:[105,105,105];
 if(H(190)){d.line(290,510,290,475,190,{width:5});d.line(600,475,600,535,190,{width:5});}
 for(const [i,[xx,ww]]of [[140,150],[290,310],[600,230]].entries()){const top=600-heights[i];d.line(xx,600,xx,top,H(190)?190:0,{width:5});d.line(xx,top,xx+ww,top,H(190)?190:0,{width:6});d.text(xx+ww/2,620,['小聚 / 凹室','共同活动','私人领域'][i],H(190)?190:0,10);}
}
