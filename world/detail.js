import {buildRooms} from './detail-room.js';
import {buildConstruction} from './detail-construction.js';
import {buildFinish} from './detail-finish.js';

export function buildDetail(key,ids=[]){
 if(key==='room')return buildRooms(ids);
 if(key==='construction')return buildConstruction(ids);
 if(key==='finish')return buildFinish(ids);
 throw new Error(`Unknown detail world: ${key}`);
}
