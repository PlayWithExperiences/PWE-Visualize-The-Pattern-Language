import { buildSite } from './building-site.js?v=3534622f64ec';
import { buildPlan } from './building-plan.js?v=3534622f64ec';
import { buildEdge } from './building-edge.js?v=3534622f64ec';
export function buildBuilding(key,ids=[]){
 if(key==='site')return buildSite(ids);
 if(key==='plan')return buildPlan(ids);
 if(key==='edge')return buildEdge(ids);
 throw new Error(`Unknown building world: ${key}`);
}
