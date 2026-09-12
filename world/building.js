import { buildSite } from './building-site.js?v=e16c31c774f1';
import { buildPlan } from './building-plan.js?v=e16c31c774f1';
import { buildEdge } from './building-edge.js?v=e16c31c774f1';
export function buildBuilding(key,ids=[]){
 if(key==='site')return buildSite(ids);
 if(key==='plan')return buildPlan(ids);
 if(key==='edge')return buildEdge(ids);
 throw new Error(`Unknown building world: ${key}`);
}
