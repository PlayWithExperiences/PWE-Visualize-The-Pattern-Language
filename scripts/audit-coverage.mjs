// Coverage audit reports evidence levels, not semantic correctness from a green test.
import {readFile,writeFile} from 'node:fs/promises';
import {patterns} from '../data/patterns.js';
import {buildScene,defaults} from '../model.js';
const catalog=JSON.parse(await readFile(new URL('../data/catalog.json',import.meta.url),'utf8'));
if(catalog.length!==253||new Set(catalog.map(p=>p.id)).size!==253)throw Error('Catalog must contain 253 unique patterns.');
const ranges=[
 [1,7,'region','区域与城乡'],[8,29,'city','城市结构与社区'],[30,74,'neighborhood','街区与公共空间'],
 [75,94,'institution','家庭与地方机构'],[95,126,'building-site','建筑群与场地'],
 [127,158,'building-plan','室内组织与生活'],[159,178,'building-edge','建筑边缘与庭院'],
 [179,204,'room','房间与局部空间'],[205,240,'construction','建造与构造'],[241,253,'finish','细节与生活物件']
];
const base=JSON.stringify(buildScene({...defaults,ids:[]}).boxes);
const entries=catalog.map(item=>{
 const group=ranges.find(([from,to])=>item.id>=from&&item.id<=to);
 const demo=patterns.find(p=>p.id===item.id);
 const textComplete=!!demo&&['question','idea','effect','tradeoff'].every(key=>typeof demo[key]==='string'&&demo[key].trim().length>0);
 const effect=demo?JSON.stringify(buildScene({...defaults,ids:[item.id]}).boxes)!==base:false;
 return {id:item.id,name:item.name,zh:item.zh,scale:item.scale,workGroup:group[2],workGroupLabel:group[3],
  sourceEvidence:'official_catalog_name_only',
  interpretation:textComplete?'project_authored':'pending',
  activeScene:effect?'home':null,
  runtimeEffect:effect?'observed_standalone_geometry_or_material_change':'not_implemented',
  originalTextCrosscheck:'pending',
  completion:effect&&textComplete?'project_demo_needs_source_review':'pending'};
});
const groups=ranges.map(([, ,key,label])=>{
 const rows=entries.filter(p=>p.workGroup===key);
 return {key,label,total:rows.length,projectDemos:rows.filter(p=>p.activeScene).length,pendingRuntime:rows.filter(p=>!p.activeScene).length};
});
const report={updatedAt:new Date().toISOString(),scope:'253 patterns; group allocation is project planning, not an original-book relationship graph',
 totals:{catalog:entries.length,projectDemos:entries.filter(p=>p.activeScene&&p.interpretation==='project_authored').length,
 pendingRuntime:entries.filter(p=>!p.activeScene).length,fullTextReviewed:entries.filter(p=>p.originalTextCrosscheck!=='pending').length},groups,entries};
await writeFile(new URL('../ProjectInfo/pattern-coverage.json',import.meta.url),JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({totals:report.totals,groups},null,2));
