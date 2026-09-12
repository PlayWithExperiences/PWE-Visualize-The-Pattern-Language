import {colors as C,gateway,route} from './primitives.js?v=a08df7453e28';
export function neighborhood(d){
 const H=id=>d.has(id);d.text(500,38,'邻里 · 住宅、公共场所与慢行网络',0,19);d.rect(60,65,880,515,C.land);
 // Four residential clusters border a common public spine.
 const groups=[[140,120],[570,120],[140,365],[570,365]];
 for(const [g,[x,y]]of groups.entries()){
  if(H(37)||H(67))d.rect(x-25,y-20,260,155,'#c5d6b4',H(67)?67:37);
  const n=H(37)?8:4;
  for(let j=0;j<n;j++){
   const bx=x+(j%4)*58,by=y+Math.floor(j/4)*85;
   let w=H(38)?49:H(35)?[27,38,45,32][j%4]:38,h=H(38)?25:36;
   const py=H(36)?by+(j%4)*8:by;
   d.building(bx,py,w,h,H(38)?38:H(35)?35:H(36)?36:H(37)?37:0);
   if(H(39)){for(let t=1;t<4;t++)d.rect(bx+t*5,py-t*6,w-t*9,8,C.plant,39);route(d,[[bx+w+3,py-18],[bx+w+3,py+h]],39,{width:3});}
   if(H(40)&&j===1){d.circle(bx+18,py+15,5,C.active,40);route(d,[[bx+18,py+25],[500,335]],40,{dash:'4 5',width:1});}
  }
  if(H(60)){d.circle(x+95,y+62,26,'#afc69c',60);route(d,[[x+15,y+45],[x+95,y+62],[x+190,y+45]],60,{width:2});}
  if(H(68))route(d,[[x-10,y+60],[x+220,y+60],[500,305]],68,{stroke:'#648c56',dash:'4 3'});
 }
 let road=H(49)?[[70,555],[70,320],[110,320],[110,540],[930,540]]:[[70,555],[930,555]];
 route(d,road,49*H(49),{width:14});
 if(H(50)){route(d,[[440,555],[440,590]],50,{width:12});route(d,[[720,520],[720,555]],50,{width:12});}else route(d,[[500,515],[500,595]],0,{width:12});
 if(H(51)){route(d,[[110,540],[420,540]],51,{width:13,stroke:'#98b184'});for(const y of [536,544])d.line(115,y,420,y,51,{width:2,stroke:'#c4bdab'});}
 if(H(52))route(d,[[95,260],[905,260],[905,555]],52,{stroke:'#c69b67',width:6});
 const square=H(61)?76:125;d.rect(525,280,square,65,C.paper,H(61)?61:0);
 const nodes=[[130,295],[370,295],[635,295],[870,295]];
 if(H(30))for(const [x,y]of nodes){d.circle(x,y,24,C.warm,30);d.people(x-15,y+2,30,3);}
 if(H(31)){route(d,nodes,31,{width:10});d.circle(110,295,15,C.active,31);d.circle(890,295,15,C.active,31);}
 if(H(32)){route(d,[[330,555],[330,315]],32,{width:8});for(let y=335;y<510;y+=42){d.building(285,y,28,27,32);d.building(350,y,28,27,32);}}
 if(H(33)){for(const x of [365,630]){d.circle(x,295,45,'#eed5a0',33);d.people(x-15,295,33,3);d.rect(x-35,260,70,18,C.active,33,'夜间活动');}}
 if(H(34)){d.rect(755,510,145,25,C.water,34,'站台');route(d,[[815,510],[815,470],[710,470]],34,{width:5});d.rect(785,545,80,12,C.active,34);}
 if(H(40)){d.rect(455,310,90,38,C.paper,40,'支持核心');}
 if(H(41)){d.rect(80,70,340,28,C.building,41);for(const x of [100,200,300]){d.rect(x,73,70,22,C.paper,41,'工作组');route(d,[[x+35,95],[x+35,105],[255,110]],41,{width:2});}}
 if(H(42)){d.rect(450,565,470,25,'#cbbfad',42);for(const x of [480,620,760]){d.rect(x,562,90,12,C.active,42);d.line(x+45,562,x+45,540,42,{width:3});}d.text(670,615,'工业带：运输背面 / 社区服务正面',42);}
 if(H(43)){d.circle(500,270,28,C.warm,43,'学习');for(const x of [260,410,630,760]){route(d,[[500,270],[x,230]],43,{width:2});d.rect(x-24,216,48,25,C.paper,43,'课程');}}
 if(H(44)){d.rect(405,190,140,45,C.building,44,'地方议事厅');d.circle(475,255,18,C.paper,44);}
 if(H(45))for(const x of [400,442,484])d.rect(x,240,35,24,C.warm,45,'项目',{'font-size':9});
 if(H(46)){d.rect(70,208,180,52,'none',46,'',{'stroke-dasharray':'4 2'});for(let i=0;i<5;i++)d.rect(80+i*33,212,24,22,C.warm,46);d.line(80,244,239,244,46,{width:5});}
 if(H(47)){for(const [x,y]of [[315,200],[775,395]]){d.rect(x,y,44,32,C.paper,47);d.line(x+12,y+16,x+32,y+16,47,{width:4});d.line(x+22,y+6,x+22,y+26,47,{width:4});route(d,[[x+22,y+32],[500,295]],47,{width:1,dash:'3 4'});}}
 if(H(48))for(const x of [160,500,850]){d.building(x,227,35,30,48,'住');gateway(d,x+17,257,48,'');}
 if(H(53))gateway(d,500,290,53,'邻里门槛');
 if(H(54)){d.rect(480,533,60,45,C.paper,54);for(let x=486;x<536;x+=10)d.line(x,541,x,568,54,{width:5});route(d,[[510,510],[510,590]],54,{width:2});}
 if(H(55)){d.rect(65,508,320,14,C.building,55);d.line(65,525,385,525,55,{width:3});for(let x=65;x<385;x+=20)d.line(x,522,x,530,55);d.text(220,501,'抬高步行边缘',55,10);}
 if(H(56)){route(d,[[85,595],[915,595],[915,340]],56,{stroke:'#6e9a8d',width:5});for(let x=845;x<905;x+=14)d.path(`M${x},350v-14q6,-8 12,0v14`,'none',56);}
 if(H(57)){route(d,[[180,177],[350,187],[570,185],[790,192],[790,245]],57,{stroke:'#c08951',dash:'2 5'});d.people(350,177,57,2);for(const x of [160,590])d.rect(x,158,20,5,C.water,57);}
 if(H(58)){route(d,[[100,295],[250,300],[400,295]],58,{width:13,stroke:'#c8a87e'});for(let x=100;x<400;x+=50){d.roof(x,285,28,58,12);d.rect(x,285,28,15,C.warm,58);}d.rect(220,310,50,27,C.active,58);}
 if(H(59)){route(d,[[130,95],[400,95],[500,95],[810,95]],59,{width:3,dash:'5 4'});for(const x of [200,610])d.line(x,102,x+120,102,59,{width:6});}

 if(H(62)){d.rect(560,252,24,40,C.building,62);for(let t=0;t<5;t++)d.line(560,255+t*7,584,255+t*7,62);d.circle(572,245,13,C.paper,62);}
 if(H(63)){d.rect(607,307,40,25,C.active,63);d.roof(607,307,40,63,13);d.people(590,341,63,5);}
 if(H(64)){d.path('M930,80Q880,160 925,235T910,450', 'none',64,{stroke:C.water,'stroke-width':15});for(const y of [200,400])d.line(892,y,941,y,64,{width:5});}
 if(H(65)){d.rect(810,80,95,60,C.paper,65,'家庭照护');d.rect(810,142,95,30,C.plant,65,'私密庭园');}
 if(H(66)){for(const r of [45,30,15])d.rect(875-r,445-r,r*2,r*2,'none',66);gateway(d,875,490,66,'静心进入');}
 if(H(69)){d.rect(460,370,85,45,'none',69);for(const x of [463,542])for(const y of [373,412])d.circle(x,y,4,C.ink,69);d.seats(475,395,69,2);}
 if(H(70)){d.rect(70,430,52,64,C.plant,70);d.rect(87,442,15,17,C.paper,70);d.seats(85,480,70,1);}
 if(H(71)){d.circle(445,455,32,C.water,71);for(const r of [15,23])d.circle(445,455,r,'none',71);route(d,[[405,475],[423,466],[437,460]],71,{width:6});}
 if(H(72)){d.rect(540,450,92,50,'#cad5bc',72);d.line(586,450,586,500,72);d.circle(586,475,9,'none',72);d.seats(547,505,72,3);}
 if(H(73)){d.rect(655,440,94,65,'#d2bc91',73);d.path('M665,470l28,-20l25,28Z',C.warm,73);for(let x=670;x<740;x+=20)d.rect(x,488,12,8,C.active,73);}
 if(H(74)){d.rect(820,340,78,58,C.plant,74);route(d,[[895,368],[925,330],[925,120]],74,{width:8,stroke:'#8ea46f'});d.circle(850,363,10,C.paper,74);d.circle(864,361,5,C.paper,74);}
}
