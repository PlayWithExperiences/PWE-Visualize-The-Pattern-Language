import {buildRooms} from './detail-room.js?v=a8cc37458ddd';
import {buildConstruction} from './detail-construction.js?v=a8cc37458ddd';
import {buildFinish} from './detail-finish.js?v=a8cc37458ddd';

export function buildDetail(key,ids=[]){
 if(key==='room')return buildRooms(ids);
 if(key==='construction')return buildConstruction(ids);
 if(key==='finish')return buildFinish(ids);
 throw new Error(`Unknown detail world: ${key}`);
}
