import { buildSite } from './building-site.js?v=a08df7453e28';
import { buildPlan } from './building-plan.js?v=a08df7453e28';
import { buildEdge } from './building-edge.js?v=a08df7453e28';
export function buildBuilding(key,ids=[]){
 if(key==='site')return buildSite(ids);
 if(key==='plan')return buildPlan(ids);
 if(key==='edge')return buildEdge(ids);
 throw new Error(`Unknown building world: ${key}`);
}
