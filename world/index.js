import {normalizeIds} from '../atlas/compose.js?v=e16c31c774f1';
import {buildTerritory} from './territory.js?v=e16c31c774f1';
import {buildBuilding} from './building.js?v=e16c31c774f1';
import {buildDetail} from './detail.js?v=e16c31c774f1';
import {normalizeSun} from '../sun.js?v=e16c31c774f1';
export function buildWorld(key,ids=[],sun){
 const selected=normalizeIds(ids);
 const scene=['region','city','neighborhood','institution'].includes(key)?buildTerritory(key,selected):['site','plan','edge'].includes(key)?buildBuilding(key,selected):buildDetail(key,selected);
 scene.state.sun=normalizeSun(sun);return scene;
}
