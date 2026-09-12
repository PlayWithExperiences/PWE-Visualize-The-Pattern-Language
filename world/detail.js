import {buildRooms} from './detail-room.js?v=a08df7453e28';
import {buildConstruction} from './detail-construction.js?v=a08df7453e28';
import {buildFinish} from './detail-finish.js?v=a08df7453e28';

export function buildDetail(key,ids=[]){
 if(key==='room')return buildRooms(ids);
 if(key==='construction')return buildConstruction(ids);
 if(key==='finish')return buildFinish(ids);
 throw new Error(`Unknown detail world: ${key}`);
}
