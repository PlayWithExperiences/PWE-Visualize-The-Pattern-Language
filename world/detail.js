import {buildRooms} from './detail-room.js?v=8207f127fbc7';
import {buildConstruction} from './detail-construction.js?v=8207f127fbc7';
import {buildFinish} from './detail-finish.js?v=8207f127fbc7';

export function buildDetail(key,ids=[]){
 if(key==='room')return buildRooms(ids);
 if(key==='construction')return buildConstruction(ids);
 if(key==='finish')return buildFinish(ids);
 throw new Error(`Unknown detail world: ${key}`);
}
