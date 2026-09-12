import {buildRooms} from './detail-room.js?v=e16c31c774f1';
import {buildConstruction} from './detail-construction.js?v=e16c31c774f1';
import {buildFinish} from './detail-finish.js?v=e16c31c774f1';

export function buildDetail(key,ids=[]){
 if(key==='room')return buildRooms(ids);
 if(key==='construction')return buildConstruction(ids);
 if(key==='finish')return buildFinish(ids);
 throw new Error(`Unknown detail world: ${key}`);
}
