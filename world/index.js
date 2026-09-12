import {normalizeIds} from '../atlas/compose.js?v=8207f127fbc7';
import {buildTerritory} from './territory.js?v=8207f127fbc7';
import {buildBuilding} from './building.js?v=8207f127fbc7';
import {buildDetail} from './detail.js?v=8207f127fbc7';
import {normalizeSun} from '../sun.js?v=8207f127fbc7';
export function buildWorld(key,ids=[],sun){
 const selected=normalizeIds(ids);
 const scene=['region','city','neighborhood','institution'].includes(key)?buildTerritory(key,selected):['site','plan','edge'].includes(key)?buildBuilding(key,selected):buildDetail(key,selected);
 scene.state.sun=normalizeSun(sun);return scene;
}
