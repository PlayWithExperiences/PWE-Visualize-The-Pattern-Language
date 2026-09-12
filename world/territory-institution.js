import {palette as P} from './primitives.js?v=e16c31c774f1';
import {kit} from './territory.js?v=e16c31c774f1';
export function buildInstitutionPattern(ctx){const {w,id,x,y,box,path,room,house,tree,bench,table,pergola,slab,gate,station,garden}=kit(ctx);
 const bed=(a,b)=>w.bed(x+a,y+b,id);
 const chairs=(a,b,count=3)=>{for(let n=0;n<count;n++)w.chair(x+a+n*1.2,y+b,id);};
 switch(id){
 case 75: for(const [a,b]of [[1,1],[19,1],[19,18]]){room(a,b,8,7);bed(a+1,b+1);}pergola(1,17,9,9);table(2,19,3);box(2,23,0,3,.8,.9,P.wood,'shared-kitchen');path([[5,12],[23,12],[23,27]],2);break;
 case 76: room(1,1,9,8);bed(2,2);room(19,1,8,8);bed(20,2);box(24,5,0,1,1,.35,P.wood,'child-play');pergola(1,17,9,9);table(2,19,3);chairs(2,21);path([[5,13],[23,13]],2);break;
 case 77: room(1,1,8,8);table(2,3);room(19,1,8,8);table(20,3);room(1,17,9,9);bed(2,18);table(5,22);path([[5,13],[23,13]],2);break;
 case 78: room(1,1,9,14);bed(2,2);table(7,3);box(1.2,6,0,3,.15,2.1,P.wood,'alcove-divider');box(7,7,0,2,.7,.9,P.wood,'kitchen');bench(2,11,2);break;
 case 79: room(1,1,9,8);pergola(1,13,9,5);box(2,14,0,4,1,.85,P.wood,'repair-bench');for(const a of [2,5,8])w.planter(x+a,y+21,2,2,id);garden(19,1,8,8);break;
 case 80: for(const [a,b]of [[1,1],[19,1],[1,18],[19,18]]){room(a,b,8,7);table(a+1,b+2);}path([[5,12],[23,12]],2);pergola(1,10,8,5);break;
 case 81: for(const b of [1,10,19]){room(1,b,9,6);table(3,b+2);}path([[13,0],[13,28]],3);for(const b of [8,17,26])path([[5,b],[13,b]],1.5);break;
 case 82: room(1,1,9,7,{sideDoor:true});room(19,1,8,7,{sideDoor:true});room(1,18,9,7);path([[9,5],[19,5]],2);path([[5,10],[5,17]],1.2);table(2,3);table(20,3);table(2,20);w.state.contactPairs=[{units:['A','B'],frequency:'frequent',pathMetres:10},{units:['A','C'],frequency:'less-frequent',pathMetres:17}];break;
 case 83: room(1,1,9,14);for(const b of [3,9]){table(2,b,3);chairs(2,b+1,2);}box(7,3,0,2,2,1,P.metal,'shared-tool');break;
 case 84: room(1,1,9,9);table(2,3,3);chairs(2,5);room(19,1,8,6);table(20,3);pergola(1,17,9,8);box(2,18,0,4,1,.8,P.wood,'project-bench');path([[5,13],[23,13],[23,27]],2);break;
 case 85: room(1,1,9,8);table(2,3);room(19,1,8,8);box(20,3,0,4,1,.8,P.wood,'workbench');path([[0,13],[28,13]],3);garden(1,18,9,8);break;
 case 86: room(1,1,9,10);bed(2,2);table(5,5);garden(1,17,9,9);box(3,20,0,3,2,.3,P.wood,'play-deck');room(19,1,8,6);break;
 case 87: for(const [a,b,c]of [[1,1,P.wood],[19,1,P.warm],[1,17,P.stone],[19,17,P.plant]]){room(a,b,8,7);box(a,b+6,2.6,8,.8,.15,c,'independent-awning');table(a+1,b+2);}break;
 case 88: room(1,1,9,8,{openNorth:true});table(2,3);for(const [a,b]of [[2,13],[6,17],[2,21]]){table(a,b);w.chair(x+a,y+b+1,id);}path([[13,0],[13,28]],3);break;
 case 89: room(1,1,9,8);for(const b of [2,4,6])box(2,b,0,2,.6,1.5,P.wood,'grocery-shelf');room(19,1,8,8);bed(20,2);path([[0,13],[28,13]],3);path([[13,0],[13,28]],3);break;
 case 90: room(1,1,9,22,{sideDoor:true});for(const b of [3,10,18]){table(2,b);bench(7,b);}path([[5,2],[5,24]],1.6,P.warm);path([[1,12],[13,12]],1.5,P.warm);box(7,20,0,2,2,.3,P.wood,'music-alcove');break;
 case 91: for(const [a,b]of [[1,1],[19,1],[19,18]]){room(a,b,8,7);bed(a+1,b+1);}room(1,17,9,9);table(2,19,3);chairs(2,21);path([[5,13],[23,13],[23,27]],2);break;
 case 92: station(1,16);room(1,1,9,7);box(8,18,0,1,.2,1.8,P.wood,'information-board');path([[0,24],[28,24]],3,P.metal);path([[5,10],[5,22]],2);break;
 case 93: path([[0,23],[28,23]],3,P.metal);path([[13,0],[13,28]],2.5);pergola(1,14,8,6);table(2,16,3);box(2,18,0,3,1,.9,P.wood,'food-counter');bench(19,17);break;
 case 94: pergola(1,1,9,12);w.wall(x+1,y+1,9,.2,2.5,id);bench(2,3,2.5);bench(2,7,2.5);box(7,3,0,2,5,.2,P.wood,'rest-deck');garden(1,17,9,9);path([[13,0],[13,28]],2);break;
 default:throw new Error(`Unsupported institution pattern ${id}`);
 }
}
