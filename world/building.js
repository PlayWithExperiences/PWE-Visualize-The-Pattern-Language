import { buildSite } from './building-site.js?v=b6146c2fbb37';
import { buildPlan } from './building-plan.js?v=b6146c2fbb37';
import { buildEdge } from './building-edge.js?v=b6146c2fbb37';
export function buildBuilding(key,ids=[]){
 if(key==='site')return buildSite(ids);
 if(key==='plan')return buildPlan(ids);
 if(key==='edge')return buildEdge(ids);
 throw new Error(`Unknown building world: ${key}`);
}
