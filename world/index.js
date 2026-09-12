import {normalizeIds} from '../atlas/compose.js?v=77ac9ca8ff67';
import {buildTerritory} from './territory.js?v=77ac9ca8ff67';
import {buildBuilding} from './building.js?v=77ac9ca8ff67';
import {buildDetail} from './detail.js?v=77ac9ca8ff67';
import {normalizeSun} from '../sun.js?v=77ac9ca8ff67';
export function buildWorld(key,ids=[],sun){
 const selected=normalizeIds(ids);
 const scene=['region','city','neighborhood','institution'].includes(key)?buildTerritory(key,selected):['site','plan','edge'].includes(key)?buildBuilding(key,selected):buildDetail(key,selected);
 scene.state.sun=normalizeSun(sun);return scene;
}
