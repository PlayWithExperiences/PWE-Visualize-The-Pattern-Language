import {normalizeIds} from '../atlas/compose.js?v=f839e046c358';
import {buildTerritory} from './territory.js?v=f839e046c358';
import {buildBuilding} from './building.js?v=f839e046c358';
import {buildDetail} from './detail.js?v=f839e046c358';
import {normalizeSun} from '../sun.js?v=f839e046c358';
export function buildWorld(key,ids=[],sun){
 const selected=normalizeIds(ids);
 const scene=['region','city','neighborhood','institution'].includes(key)?buildTerritory(key,selected):['site','plan','edge'].includes(key)?buildBuilding(key,selected):buildDetail(key,selected);
 scene.state.sun=normalizeSun(sun);return scene;
}
