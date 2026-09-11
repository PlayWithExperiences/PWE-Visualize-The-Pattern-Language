// Evidence levels are explicit: geometric difference does not prove semantic or engineering correctness.
import {readFile,writeFile} from 'node:fs/promises';
import {patterns} from '../data/patterns.js';
import {groups,compose} from '../atlas/compose.js';
const catalog=JSON.parse(await readFile(new URL('../data/guide-catalog.json',import.meta.url),'utf8'));
if(catalog.length!==253||new Set(catalog.map(p=>p.id)).size!==253)throw Error('253 unique guides required');
const key=result=>JSON.stringify(result.diagram.shapes.filter(s=>s.kind!=='text').map(s=>[s.kind,s.attrs]));
const entries=catalog.map(p=>{
 const runtimeEffect=key(compose(p.group,[p.id]))!==key(compose(p.group,[]));
 return {id:p.id,name:p.name,zh:p.zh,workGroup:p.group,sourceId:'apl-1977-user-pdf',sourceBasis:p.source.reviewBasis,pdfPages:p.source.pdfPages,missingPrintedPages:p.source.missingPrintedPages,
 interpretation:'independent_chinese_paraphrase',operation:p.rule,activeScene:p.group,standaloneVisualEffect:runtimeEffect,home3d:patterns.some(h=>h.id===p.id),
 status:runtimeEffect?'concept_diagram_implemented':'missing_runtime',engineeringValidation:'not_performed'};
});
const report={updatedAt:new Date().toISOString(),scope:'253 independently authored guides and conceptual combinations; 25 retained detailed home3d demos. Ten contexts are teaching groups, not the original-book taxonomy.',
 evidenceLimits:['Standalone and pairwise geometry tests do not prove semantic fidelity or collision-free layouts.','Original solution sections and relevant body text were read; this is not a complete page-by-page textual edition review.','Pattern 163 printed page 767 is missing; available neighboring text used.','All 253 are not detailed 3D models or one unified building generator.','Only explicit cross-context influences propagate; other selections remain stored in their own contexts.'],
 totals:{catalog:entries.length,sourceLinkedGuides:entries.length,standaloneConceptDiagrams:entries.filter(e=>e.standaloneVisualEffect).length,home3d:entries.filter(e=>e.home3d).length,pendingConceptRuntime:entries.filter(e=>!e.standaloneVisualEffect).length},
 groups:groups.map(g=>({key:g.key,label:g.name,total:g.to-g.from+1,implemented:entries.filter(e=>e.workGroup===g.key&&e.standaloneVisualEffect).length})),entries};
await writeFile(new URL('../ProjectInfo/pattern-coverage.json',import.meta.url),JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify(report.totals));
