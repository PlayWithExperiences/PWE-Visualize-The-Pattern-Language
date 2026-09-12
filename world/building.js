import { buildSite } from './building-site.js?v=8207f127fbc7';
import { buildPlan } from './building-plan.js?v=8207f127fbc7';
import { buildEdge } from './building-edge.js?v=8207f127fbc7';
export function buildBuilding(key,ids=[]){
 if(key==='site')return buildSite(ids);
 if(key==='plan')return buildPlan(ids);
 if(key==='edge')return buildEdge(ids);
 throw new Error(`Unknown building world: ${key}`);
}
