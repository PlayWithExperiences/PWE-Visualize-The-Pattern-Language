// Evidence levels are explicit: geometric difference does not prove semantic or engineering correctness.
import {readFile,writeFile} from 'node:fs/promises';
import {patterns} from '../data/patterns.js';
import {groups,compose} from '../atlas/compose.js';
import {buildWorld} from '../world/index.js';
const worldKey=s=>JSON.stringify({boxes:s.boxes.map(({pattern,patterns,...b})=>b),meshes:s.meshes.map(({pattern,patterns,...m})=>m),lights:s.lights});
const catalog=JSON.parse(await readFile(new URL('../data/guide-catalog.json',import.meta.url),'utf8'));
if(catalog.length!==253||new Set(catalog.map(p=>p.id)).size!==253)throw Error('253 unique guides required');
const key=result=>JSON.stringify(result.diagram.shapes.filter(s=>s.kind!=='text').map(s=>[s.kind,s.attrs]));
const entries=catalog.map(p=>{
 const runtimeEffect=key(compose(p.group,[p.id]))!==key(compose(p.group,[]));
 const spatialEffect=worldKey(buildWorld(p.group,[p.id]))!==worldKey(buildWorld(p.group,[]));
 return {id:p.id,name:p.name,zh:p.zh,workGroup:p.group,sourceId:'apl-1977-user-pdf',sourceBasis:p.source.reviewBasis,pdfPages:p.source.pdfPages,missingPrintedPages:p.source.missingPrintedPages,
 interpretation:'independent_chinese_paraphrase',operation:p.rule,activeScene:p.group,standaloneVisualEffect:runtimeEffect,spatial3d:spatialEffect,classicHome3d:patterns.some(h=>h.id===p.id),
 status:runtimeEffect&&spatialEffect?'diagram_and_spatial_3d_implemented':'missing_runtime',engineeringValidation:'not_performed'};
});
const report={updatedAt:new Date().toISOString(),scope:'253 independently authored guides, conceptual diagrams and spatial 3D rules; 25 retained classic home demos. Ten contexts are teaching groups, not the original-book taxonomy.',
 evidenceLimits:['Standalone and pairwise geometry tests do not prove semantic fidelity or collision-free layouts.','Original solution sections and relevant body text were read; this is not a complete page-by-page textual edition review.','Pattern 163 printed page 767 is missing; available neighboring text used.','All 253 have spatial 3D concept implementations; background buildings may be exterior masses and this is not one unified building generator.','Only explicit cross-context influences propagate; other selections remain stored in their own contexts.'],
 totals:{catalog:entries.length,sourceLinkedGuides:entries.length,standaloneConceptDiagrams:entries.filter(e=>e.standaloneVisualEffect).length,spatial3d:entries.filter(e=>e.spatial3d).length,classicHome3d:entries.filter(e=>e.classicHome3d).length,pendingConceptRuntime:entries.filter(e=>!e.standaloneVisualEffect).length},
 groups:groups.map(g=>({key:g.key,label:g.name,total:g.to-g.from+1,implemented:entries.filter(e=>e.workGroup===g.key&&e.standaloneVisualEffect).length})),entries};
await writeFile(new URL('../ProjectInfo/pattern-coverage.json',import.meta.url),JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify(report.totals));
