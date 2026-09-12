import {normalizeIds} from '../atlas/compose.js?v=a08df7453e28';
import {buildTerritory} from './territory.js?v=a08df7453e28';
import {buildBuilding} from './building.js?v=a08df7453e28';
import {buildDetail} from './detail.js?v=a08df7453e28';
import {normalizeSun} from '../sun.js?v=a08df7453e28';
export function buildWorld(key,ids=[],sun){
 const selected=normalizeIds(ids);
 const scene=['region','city','neighborhood','institution'].includes(key)?buildTerritory(key,selected):['site','plan','edge'].includes(key)?buildBuilding(key,selected):buildDetail(key,selected);
 scene.state.sun=normalizeSun(sun);return scene;
}
