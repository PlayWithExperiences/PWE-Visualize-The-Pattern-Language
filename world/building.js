import { buildSite } from './building-site.js';
import { buildPlan } from './building-plan.js';
import { buildEdge } from './building-edge.js';
export function buildBuilding(key,ids=[]){
 if(key==='site')return buildSite(ids);
 if(key==='plan')return buildPlan(ids);
 if(key==='edge')return buildEdge(ids);
 throw new Error(`Unknown building world: ${key}`);
}
