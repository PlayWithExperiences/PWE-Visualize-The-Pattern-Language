import {normalizeIds} from '../atlas/compose.js?v=b6146c2fbb37';
import {buildTerritory} from './territory.js?v=b6146c2fbb37';
import {buildBuilding} from './building.js?v=b6146c2fbb37';
import {buildDetail} from './detail.js?v=b6146c2fbb37';
import {normalizeSun} from '../sun.js?v=b6146c2fbb37';
export function buildWorld(key,ids=[],sun){
 const selected=normalizeIds(ids);
 const scene=['region','city','neighborhood','institution'].includes(key)?buildTerritory(key,selected):['site','plan','edge'].includes(key)?buildBuilding(key,selected):buildDetail(key,selected);
 scene.state.sun=normalizeSun(sun);return scene;
}
