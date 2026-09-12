import {palette as P} from './primitives.js?v=f839e046c358';
import {kit} from './territory.js?v=f839e046c358';
export function buildLocalPattern(ctx){const {w,id,x,y,box,path,room,house,tree,bench,table,pergola,slab,gate,station,garden}=kit(ctx);
 switch(id){
 case 30: slab(1,10,9,10);room(1,2,9,6);bench(2,17);path([[0,23],[5,15],[13,23],[27,23]],2);room(19,16,8,6);break;
 case 31: path([[5,1],[5,26]],3);pergola(1,1,8,4);slab(1,21,8,6);for(const b of [8,14]){bench(1,b);tree(9,b);}break;
 case 32: path([[5,0],[5,27]],3);for(const b of [1,10,19])room(18,b,8,6);slab(1,2,3,6,P.metal);path([[5,27],[25,27]],2);break;
 case 33: room(1,2,9,7);room(19,2,8,7);slab(1,12,9,12);table(2,15);for(const a of [1,9,19,26]){box(a,11,0,.12,.12,3,P.metal,'lamp');box(a-.15,11,3,.45,.45,.4,P.warm,'emissive');w.light(x+a+.075,y+11.2,2.95,id,{intensity:2.2,radius:8});}break;
 case 34: station(1,2);station(1,8);path([[5,5],[5,15],[26,15]],2);room(19,2,8,7);house(19,18,8,7,3);break;
 case 35: room(1,1,6,5);room(18,1,9,7);room(1,17,9,9);w.bed(x+2,y+18,id);w.bed(x+5,y+18,id);house(20,18,7,7,2);break;
 case 36: path([[0,26],[28,26]],3);room(1,18,9,6);room(19,9,8,6);room(1,1,8,6);path([[23,17],[23,26]],1.5);garden(18,18,9,6);break;
 case 37: for(const [a,b]of [[0,0],[5,0],[19,0],[24,0],[0,19],[5,19],[19,19],[24,19]])house(a,b,4,5);slab(1,8,26,8,P.ground);path([[0,12],[28,12]],2);bench(4,10);break;
 case 38: for(const b of [1,10,19]){room(0,b,10,5);room(18,b,10,5);}path([[14,0],[14,28]],3);path([[0,27],[28,27]],3,P.metal);break;
 case 39: // Two stepped occupied levels and an open common stair, no impossible roof-only access.
  room(1,1,9,12,{roof:false});w.room(x+1,y+1,9,6,id,{z:3});slab(1,7,9,6,P.stone,3);for(let n=0;n<19;n++)box(7,13+n*.32,0,2.5,.32,(19-n)*.16,P.stone,'step');garden(18,3,9,14);break;
 case 40: room(1,2,9,8);w.bed(x+2,y+3,id);room(19,2,8,6);room(19,18,8,6);path([[5,13],[15,13],[15,26],[23,26],[23,24]],2);bench(18,14);break;
 case 41: for(const [a,b]of [[1,1],[19,1],[1,17],[19,17]]){room(a,b,8,6);table(a+1,b+2);}slab(1,9,26,6);pergola(2,10,6,4);bench(19,11);break;
 case 42: path([[0,0],[28,0]],4,P.metal);for(const a of [1,19]){box(a,3,0,8,8,5,P.wall,'industrial-hall');room(a,13,8,6);}path([[0,23],[28,23]],3);break;
 case 43: path([[0,13],[28,13]],4);room(1,2,9,8);room(19,2,8,8);pergola(1,18,9,7);table(2,20);room(19,18,8,7);break;
 case 44: room(1,2,9,10);table(2,4);table(6,4);slab(1,15,9,10);bench(2,20);room(19,2,8,6);room(19,18,8,6);break;
 case 45: room(1,1,9,8);for(const b of [1,9,17]){room(19,b,7,6);box(19,b+5,2.7,7,1,.15,P.warm,'project-awning');}path([[16,0],[16,27]],2);break;
 case 46: pergola(1,1,9,23);for(const b of [2,9,16]){table(2,b,3);box(6,b,0,2,2,1,P.wood,'market-stall');}path([[9,1],[9,26]],2);room(19,1,8,6);break;
 case 47: room(1,2,9,9);w.bed(x+2,y+3,id);room(19,2,8,7);table(20,4);garden(1,17,9,9);path([[5,14],[23,14]],2);break;
 case 48: room(1,1,9,6);room(19,1,8,6);house(1,17,8,7,2);garden(19,17,8,7);gate(19,25,6);break;
 case 49: path([[0,26],[28,26]],3,P.metal);path([[5,26],[5,12],[9,9],[23,9],[23,20],[5,20]],2.5,P.metal);house(1,1,8,5);house(19,1,8,5);break;
 case 50: path([[0,8],[28,8]],3,P.metal);path([[6,8],[6,24]],3,P.metal);path([[22,0],[22,8]],3,P.metal);for(let n=0;n<5;n++)slab(3.5+n,12,.5,3,P.wall);break;
 case 51: slab(1,1,9,25,P.ground);for(const a of [3,6])path([[a,0],[a,27]],.6,P.stone);for(const b of [4,13,22])tree(9,b);house(19,1,8,6);house(19,18,8,6);break;
 case 52: path([[0,5],[28,5]],3,P.metal);path([[0,22],[28,22]],3,P.metal);path([[8,0],[8,28]],2,P.warm);path([[21,0],[21,28]],2,P.warm);room(1,10,8,6);break;
 case 53: gate(2,7,6,3.6);gate(2,19,6,2.6);path([[5,0],[5,27]],3);for(const b of [9,15])tree(9,b);break;
 case 54: path([[0,12],[28,12]],4,P.metal);slab(3,9,4,6,P.stone,.12);w.steps(x+3,y+15,4,1,id,.12,.6);for(const a of [2,8])box(a,11,0,.3,.3,.8,P.stone,'bollard');break;
 case 55: path([[0,3],[28,3]],4,P.metal);slab(1,7,26,3,P.stone,.8);for(let a=1;a<28;a+=2)box(a,7,.92,.08,.08,1,P.metal,'railing');box(1,7,1.92,26,.08,.08,P.metal,'railing');for(let n=0;n<5;n++)box(2,10+n*.3,0,3,.3,(5-n)*.16,P.stone,'step');break;
 case 56: path([[0,21],[28,21]],2,P.warm);path([[0,25],[28,25]],2,P.stone);room(1,2,9,7);pergola(1,13,8,4);for(let a=2;a<8;a+=1.3){box(a,14,0,.06,.06,1,P.metal,'bike-rack');box(a,15,0,.06,.06,1,P.metal,'bike-rack');box(a,14,1,.06,1,.06,P.metal,'bike-rack');}break;
 case 57: path([[5,0],[5,27]],2,P.warm);room(19,1,8,7);room(19,18,8,7);for(const b of [3,11,20])tree(9,b);box(1,12,0,2,2,.4,P.wood,'discovery-platform');break;
 case 58: path([[12,0],[12,27]],3);path([[12,9],[3.5,9],[3.5,7]],1.5);for(const b of [1,9,17]){pergola(19,b,7,5);table(20,b+1);}slab(1,2,9,6,P.wood,.24);for(let n=0;n<2;n++)box(2,8+n*.35,0,3,.35,(2-n)*.12,P.stone,'step');break;
 case 59: room(1,1,9,9);path([[5,12],[5,22],[9,24]],1.3);garden(1,15,9,11);w.wall(x+1,y+13,3,.3,2.5,id);w.wall(x+6,y+13,4,.3,2.5,id);break;
 case 60: for(const [a,b]of [[1,2],[19,17]])garden(a,b,8,8);house(19,2,8,6,2);house(1,18,8,6);path([[5,13],[23,13]],1.5);break;
 case 61: slab(1,10,9,10);room(1,2,9,6);room(19,10,8,6);bench(2,18,6);tree(8,12);break;
 case 62: slab(1,1,9,8,P.stone,3);for(const a of [1,9])for(const b of [1,8])box(a,b,0,.3,.3,3,P.wood,'tower-post');for(let n=0;n<19;n++)box(3,9+n*.32,0,3,.32,(19-n)*.16,P.stone,'step');box(1,1,3.12,9,.15,1,P.wood,'guard');box(1,1,3.12,.15,8,1,P.wood,'guard');box(9.85,1,3.12,.15,8,1,P.wood,'guard');break;
 case 63: slab(1,2,9,6,P.wood,.16);pergola(1,2,9,6);slab(1,10,9,14);w.steps(x+3,y+8,3,1,id);table(19,15);bench(19,18);break;
 case 64: slab(0,5,28,3,P.water);slab(19,5,3,21,P.water);path([[0,10],[17,10],[17,27]],1.5);slab(3,4,3,5,P.wood,.16);tree(25,12);tree(24,20);break;
 case 65: room(1,1,9,8);w.bed(x+2,y+2,id);room(19,1,8,8);table(20,3);garden(1,16,9,10);w.wall(x+1,y+15,9,.2,1.6,id);break;
 // The innermost approach ends before the solid sacred core and passes inside every gateway.
 case 66: for(const [b,span]of [[24,8],[16,6],[8,4]]){gate(2,b,span);w.wall(x+1,y+b,.2,5,2,id);w.wall(x+10,y+b,.2,5,2,id);}box(4,2,0,3,3,1,P.stone,'inner-core');path([[5,6],[5,28]],2);break;
 case 67: house(1,1,8,6);house(19,1,8,6);house(19,19,8,6);slab(1,10,9,17,P.ground);tree(2,11);bench(3,20);slab(19,9,8,8,P.ground);tree(25,11);w.state.commonLandParcelRatio=217/784;break;
 case 68: for(const [a,b]of [[1,1],[19,1],[19,19]])house(a,b,8,6);path([[5,28],[5,13],[23,13]],2,P.ground);slab(1,15,8,7,P.ground);box(2,17,0,2,2,.3,P.wood,'play');box(22,11,0,2,2,.5,P.wood,'play');break;
 case 69: pergola(1,9,9,9);w.wall(x+1,y+9,9,.2,2.5,id);bench(2,10,6);table(3,13);path([[5,20],[28,20]],2);break;
 case 70: garden(1,1,9,20);for(const b of [4,9,14])box(3,b,0,.6,.3,1,P.stone,'memorial');path([[7,0],[7,25]],1.5);bench(2,19);break;
 case 71: slab(1,1,9,8,P.water);for(let n=0;n<4;n++)box(1,9+n*1.5,0,9,1.5,(n+1)*.15,P.stone,'graded-shore');slab(1,15,9,1,P.stone,.6);for(let n=0;n<4;n++)box(1,16+n*.35,0,9,.35,(4-n)*.15,P.stone,'step');bench(2,19);break;
 case 72: slab(1,1,9,18,P.soil);for(const b of [2,18]){box(3,b,0,.08,.08,2.4,P.metal,'goal');box(8,b,0,.08,.08,2.4,P.metal,'goal');box(3,b,2.4,5,.08,.08,P.metal,'goal');}bench(19,9,6);path([[16,0],[16,27]],2);break;
 case 73: slab(1,1,9,23,P.soil);for(let n=0;n<4;n++)box(2+n*1.4,5+n*2,0,1,1,.3+n*.2,P.wood,'loose-play-material');pergola(2,17,5,5);table(2,2);break;
 case 74: garden(1,1,9,24);slab(3,12,3,3,P.water);room(19,1,8,5);path([[7,0],[7,28]],2,P.ground);for(const b of [4,18]){box(19,b+7,0,4,3,.2,P.soil,'animal-habitat');tree(25,b+7);}break;
 default:throw new Error(`Unsupported local pattern ${id}`);
 }
}
