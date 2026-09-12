import { buildSite } from './building-site.js?v=a8cc37458ddd';
import { buildPlan } from './building-plan.js?v=a8cc37458ddd';
import { buildEdge } from './building-edge.js?v=a8cc37458ddd';
export function buildBuilding(key,ids=[]){
 if(key==='site')return buildSite(ids);
 if(key==='plan')return buildPlan(ids);
 if(key==='edge')return buildEdge(ids);
 throw new Error(`Unknown building world: ${key}`);
}
