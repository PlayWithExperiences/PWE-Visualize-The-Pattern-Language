import { buildSite } from './building-site.js?v=f839e046c358';
import { buildPlan } from './building-plan.js?v=f839e046c358';
import { buildEdge } from './building-edge.js?v=f839e046c358';
export function buildBuilding(key,ids=[]){
 if(key==='site')return buildSite(ids);
 if(key==='plan')return buildPlan(ids);
 if(key==='edge')return buildEdge(ids);
 throw new Error(`Unknown building world: ${key}`);
}
