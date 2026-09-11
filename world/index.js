import {normalizeIds} from '../atlas/compose.js?v=580c78464447';
import {buildTerritory} from './territory.js?v=580c78464447';
import {buildBuilding} from './building.js?v=580c78464447';
import {buildDetail} from './detail.js?v=580c78464447';
import {normalizeSun} from '../sun.js?v=580c78464447';
export function buildWorld(key,ids=[],sun){
 const selected=normalizeIds(ids);
 const scene=['region','city','neighborhood','institution'].includes(key)?buildTerritory(key,selected):['site','plan','edge'].includes(key)?buildBuilding(key,selected):buildDetail(key,selected);
 scene.state.sun=normalizeSun(sun);return scene;
}
