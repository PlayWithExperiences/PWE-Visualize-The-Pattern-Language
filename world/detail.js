import {buildRooms} from './detail-room.js?v=3534622f64ec';
import {buildConstruction} from './detail-construction.js?v=3534622f64ec';
import {buildFinish} from './detail-finish.js?v=3534622f64ec';

export function buildDetail(key,ids=[]){
 if(key==='room')return buildRooms(ids);
 if(key==='construction')return buildConstruction(ids);
 if(key==='finish')return buildFinish(ids);
 throw new Error(`Unknown detail world: ${key}`);
}
