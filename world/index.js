import {normalizeIds} from '../atlas/compose.js';
import {buildTerritory} from './territory.js';
import {buildBuilding} from './building.js';
import {buildDetail} from './detail.js';
import {normalizeSun} from '../sun.js';
export function buildWorld(key,ids=[],sun){
 const selected=normalizeIds(ids);
 const scene=['region','city','neighborhood','institution'].includes(key)?buildTerritory(key,selected):['site','plan','edge'].includes(key)?buildBuilding(key,selected):buildDetail(key,selected);
 scene.state.sun=normalizeSun(sun);return scene;
}
