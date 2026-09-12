import {buildRooms} from './detail-room.js?v=b6146c2fbb37';
import {buildConstruction} from './detail-construction.js?v=b6146c2fbb37';
import {buildFinish} from './detail-finish.js?v=b6146c2fbb37';

export function buildDetail(key,ids=[]){
 if(key==='room')return buildRooms(ids);
 if(key==='construction')return buildConstruction(ids);
 if(key==='finish')return buildFinish(ids);
 throw new Error(`Unknown detail world: ${key}`);
}
