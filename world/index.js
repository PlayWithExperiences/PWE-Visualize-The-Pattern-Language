import {normalizeIds} from '../atlas/compose.js?v=a8cc37458ddd';
import {buildTerritory} from './territory.js?v=a8cc37458ddd';
import {buildBuilding} from './building.js?v=a8cc37458ddd';
import {buildDetail} from './detail.js?v=a8cc37458ddd';
import {normalizeSun} from '../sun.js?v=a8cc37458ddd';
export function buildWorld(key,ids=[],sun){
 const selected=normalizeIds(ids);
 const scene=['region','city','neighborhood','institution'].includes(key)?buildTerritory(key,selected):['site','plan','edge'].includes(key)?buildBuilding(key,selected):buildDetail(key,selected);
 scene.state.sun=normalizeSun(sun);return scene;
}
