import {buildRooms} from './detail-room.js?v=92d7972c59b4';
import {buildConstruction} from './detail-construction.js?v=92d7972c59b4';
import {buildFinish} from './detail-finish.js?v=92d7972c59b4';

export function buildDetail(key,ids=[]){
 if(key==='room')return buildRooms(ids);
 if(key==='construction')return buildConstruction(ids);
 if(key==='finish')return buildFinish(ids);
 throw new Error(`Unknown detail world: ${key}`);
}
