import { buildSite } from './building-site.js?v=77ac9ca8ff67';
import { buildPlan } from './building-plan.js?v=77ac9ca8ff67';
import { buildEdge } from './building-edge.js?v=77ac9ca8ff67';
export function buildBuilding(key,ids=[]){
 if(key==='site')return buildSite(ids);
 if(key==='plan')return buildPlan(ids);
 if(key==='edge')return buildEdge(ids);
 throw new Error(`Unknown building world: ${key}`);
}
