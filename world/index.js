import {normalizeIds} from '../atlas/compose.js?v=3534622f64ec';
import {buildTerritory} from './territory.js?v=3534622f64ec';
import {buildBuilding} from './building.js?v=3534622f64ec';
import {buildDetail} from './detail.js?v=3534622f64ec';
import {normalizeSun} from '../sun.js?v=3534622f64ec';
export function buildWorld(key,ids=[],sun){
 const selected=normalizeIds(ids);
 const scene=['region','city','neighborhood','institution'].includes(key)?buildTerritory(key,selected):['site','plan','edge'].includes(key)?buildBuilding(key,selected):buildDetail(key,selected);
 scene.state.sun=normalizeSun(sun);return scene;
}
