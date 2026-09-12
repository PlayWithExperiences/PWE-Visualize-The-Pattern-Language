import {palette as P} from './primitives.js?v=f839e046c358';
import {kit} from './territory.js?v=f839e046c358';
export function buildUrbanPattern(ctx){const {w,id,x,y,box,path,room,house,tree,bench,table,pergola,slab,gate,station,garden}=kit(ctx);
 switch(id){
 case 1: // Separate civic centres linked across a permeable natural boundary.
  for(const a of [2,38]){room(a,9,12,9);slab(a,20,12,9);for(let j=0;j<3;j++)house(a+j*4,38,3,5,1);table(a+3,24);}for(let b=0;b<60;b+=5)tree(28,b,1.5);path([[14,30],[45,30]],3);break;
 case 2: for(const [a,b,n]of [[1,3,3],[38,2,2],[2,38,2],[43,42,1]]){for(let j=0;j<n;j++)house(a+j*7,b,5,6,n);path([[a,b+9],[30,b+9]],2);}break;
 case 3: for(let j=0;j<3;j++){slab(2,4+j*18,54,7,P.ground);for(let a=3;a<56;a+=8)tree(a,7+j*18);for(let a=3;a<52-j*8;a+=8)house(a,13+j*18,6,7,2);}break;
 case 4: slab(20,0,20,61,P.soil);for(let a=22;a<39;a+=3)path([[a,1],[a,60]],.6,P.plant);for(const a of [1,47])for(let b=7;b<60;b+=17){box(a,b,0,13,10,2,P.ground,'highland');w.room(x+a,y+b,12,9,id,{z:2});for(let n=0;n<13;n++)box(a+4,b+9+n*.3,0,3,.3,(13-n)*.16,P.stone,'step');}break;
 case 5: path([[3,3],[58,3],[58,57],[3,57],[3,3]],3);slab(14,14,33,30,P.soil);for(const a of [5,22,40]){house(a,5,6,6);house(a,49,6,6);}break;
 case 6: for(const a of [2,40]){house(a,8,9,7,2);room(a,20,10,8);box(a,2,0,8,4,4,P.wood,'workshop');station(a,31);}for(let b=0;b<60;b+=6)tree(26,b);path([[12,38],[49,38]],3);break;
 case 7: slab(3,2,22,40,P.soil);for(let b=4;b<40;b+=4)path([[4,b],[24,b]],.5,P.plant);room(40,4,10,7);path([[32,0],[32,50],[55,50]],2);gate(29,20,6);for(let b=8;b<48;b+=7)tree(52,b);bench(40,47);break;
 case 8: for(const [a,b,c]of [[1,2,P.warm],[18,2,P.wood],[1,17,P.wall],[18,17,P.stone]]){room(a,b,8,6);box(a,b,3,8,.3,.6,c,'local-frontage');slab(a,b+7,8,3,c);}break;
 case 9: house(1,2,8,6,2);house(18,17,8,6);room(18,2,8,6);table(20,4);room(1,17,8,6);table(3,19);break;
 case 10: for(const [a,b]of [[1,2],[18,17]]){room(a,b,8,6);slab(a,b+7,8,3);bench(a,b+9);}path([[5,13],[23,13]],2);station(18,2);break;
 case 11: path([[0,0],[27,0],[27,27]],3,P.metal);path([[3,0],[3,9],[9,9]],2,P.metal);path([[27,18],[19,18],[19,10]],2,P.metal);path([[9,9],[13,13],[19,10]],1.2);garden(2,18);break;
 case 12: room(1,2,9,7);for(let n=0;n<4;n++)table(2+(n%2)*3,3+Math.floor(n/2)*2);house(18,2,8,6);house(18,17,8,6);path([[5,12],[23,12]],2);break;
 case 13: room(1,1,8,7);room(19,1,8,7);slab(9,12,10,9,P.ground);pergola(10,13,7,5);table(11,15);path([[1,23],[27,23]],2);break;
 case 14: for(const [a,b]of [[1,1],[19,1],[1,17],[19,17]])house(a,b,7,6);garden(9,8,10,8);gate(11,25,4);break;
 case 15: for(let a=0;a<26;a+=5)if(a<10||a>16)tree(a,23);gate(11,23,4);room(1,10,8,6);pergola(18,20,7,4);bench(19,20);break;
 case 16: path([[0,4],[27,4]],2,P.metal);path([[23,0],[23,27]],2,P.wood);station(17,7);station(17,12);path([[19,10],[19,11],[23,11],[23,16],[19,16]],2);break;
 case 17: path([[0,0],[27,0],[27,27]],4,P.metal);for(let a=0;a<24;a+=4)box(a,3,0,3,2,1.7,P.ground,'noise-berm');room(2,10,8,7);garden(1,20,9,7);break;
 case 18: room(1,2,8,6);table(2,4);room(19,2,8,6);w.bed(x+20,y+3,id);pergola(1,18,8,6);table(3,20);path([[5,11],[23,11],[23,25],[5,25]],1.5,P.warm);break;
 case 19: house(1,1,8,6,2);house(19,1,8,6,2);room(1,17,8,6);room(19,17,8,6);box(19,22,2.6,8,1,.3,P.warm,'new-retail-awning');break;
 case 20: path([[0,3],[27,3]],3,P.metal);station(1,5);path([[6,10],[9,15],[22,15],[22,24]],1.5,P.warm);station(18,19);box(6,5,0,3,1.5,1.8,P.warm,'feeder-vehicle');break;
 case 21: for(const [a,b,n]of [[1,1,4],[19,1,3],[1,18,2],[19,18,1]])house(a,b,8,6,n);w.state.heightLimitConcept=4;break;
 case 22: for(const [a,b]of [[1,1],[19,1],[1,17]])house(a,b,8,6,2);slab(20,18,5,5,P.metal);for(let j=0;j<2;j++)box(20.3+j*2.3,19,.1,1.8,3,1.3,P.wood,'parked-car');w.state.parkingParcelRatio=25/(28*28);break;
 case 23: for(const [b,dir]of [[5,1],[21,-1]]){path([[0,b],[27,b]],3,P.metal);w.triangle([x+12,y+b-dir, .05],[x+14,y+b,.05],[x+12,y+b+dir,.05],P.warm,id,'direction-arrow');}path([[7,5],[7,13]],2,P.metal);path([[21,21],[21,13]],2,P.metal);path([[1,13],[27,13]],1.5);break;
 case 24: box(3,4,0,5,5,4,P.stone,'historic-core');for(const b of [11,18,24])gate(3,b,5,3-(b/60));path([[5,10],[5,27]],2);bench(8,20);garden(18,3);break;
 case 25: slab(0,0,28,4,P.water);path([[0,7],[28,7]],3);for(const a of [12,23])path([[a,7],[a,27]],2);room(1,16,8,6);for(let a=1;a<28;a+=5)tree(a,10);break;
 case 26: room(1,1,8,6);w.bed(x+2,y+2,id);room(19,1,8,6);w.bed(x+20,y+2,id);pergola(1,18,8,6);table(3,20);box(20,19,0,4,4,.3,P.wood,'play-platform');break;
 case 27: room(1,1,9,7);table(2,3);for(let a=2;a<9;a+=2)w.chair(x+a,y+5,id);room(19,1,8,7);w.bed(x+20,y+2,id);slab(1,17,9,7);w.steps(x+1,y+19,4,3,id);path([[10,12],[22,12]],2);break;
 case 28: room(19,1,8,6);for(const [a,b,n]of [[19,10,4],[18,20,3],[1,19,2],[1,2,1]])house(a,b,8,6,n);path([[23,8],[23,18],[12,18],[5,12]],2);break;
 case 29: for(const [a,b,n]of [[1,1,4],[19,1,3],[1,18,2],[19,18,1]])house(a,b,7,6,n);slab(1,9,8,6);bench(2,10);path([[5,15],[23,15]],2);w.state.densityGradient=[4,3,2,1];break;
 default:throw new Error(`Unsupported urban pattern ${id}`);
 }
}
