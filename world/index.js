import {normalizeIds} from '../atlas/compose.js?v=92d7972c59b4';
import {buildTerritory} from './territory.js?v=92d7972c59b4';
import {buildBuilding} from './building.js?v=92d7972c59b4';
import {buildDetail} from './detail.js?v=92d7972c59b4';
import {normalizeSun} from '../sun.js?v=92d7972c59b4';
export function buildWorld(key,ids=[],sun){
 const selected=normalizeIds(ids);
 const scene=['region','city','neighborhood','institution'].includes(key)?buildTerritory(key,selected):['site','plan','edge'].includes(key)?buildBuilding(key,selected):buildDetail(key,selected);
 scene.state.sun=normalizeSun(sun);return scene;
}
