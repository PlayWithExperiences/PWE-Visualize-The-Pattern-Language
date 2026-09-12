import {buildWorld} from './index.js?v=8207f127fbc7';
import {worldGeometryBounds} from './navigation.js?v=8207f127fbc7';
// Camera and cutaway are viewing choices, not design differences.
export function prepareWorldComparison(key,current,saved){
 const scenes=[current,saved].map(s=>buildWorld(key,s.ids,s.sun));
 const bounds=scenes.map(worldGeometryBounds);
 const frameBounds={mins:[0,1,2].map(i=>Math.min(...bounds.map(b=>b.mins[i]))),maxs:[0,1,2].map(i=>Math.max(...bounds.map(b=>b.maxs[i])))};
 const cutaway=current.cutaway??['plan','room'].includes(key);
 return scenes.map(scene=>({...scene,frameBounds,cutaway,focus:null}));
}
