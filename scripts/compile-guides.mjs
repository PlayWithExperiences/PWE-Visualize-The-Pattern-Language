import {readFile,readdir,writeFile} from 'node:fs/promises';
import {groups,groupFor,compose} from '../atlas/compose.js';
const catalog=JSON.parse(await readFile('data/catalog.json','utf8'));
const index=JSON.parse(await readFile('data/book-index.json','utf8'));
const drafts=(await Promise.all((await readdir('data/guides')).filter(f=>f.endsWith('.json')).sort().map(async f=>JSON.parse(await readFile('data/guides/'+f,'utf8'))))).flat();
if(drafts.length!==253||new Set(drafts.map(p=>p.id)).size!==253||new Set(drafts.map(p=>p.rule)).size!==253)throw Error('253 unique drafts and semantic rules required');
const result=catalog.map(c=>{
 const p=drafts.find(x=>x.id===c.id),source=index.patterns.find(x=>x.id===c.id),group=groupFor(c.id);
 if(!p?.problem||!p?.principle||!p?.rule||!source?.pdfPages?.length||!group)throw Error('Incomplete guide '+c.id);
 const shapeKey=ids=>JSON.stringify(compose(group.key,ids).diagram.shapes.filter(s=>s.kind!=='text').map(s=>[s.kind,s.attrs]));
 if(shapeKey([c.id])===shapeKey([]))throw Error('No visual operation '+c.id);
 return {...c,...p,group:group.key,source,representation:'项目编制的概念图解；原书允许多种具体实现。'};
});
await writeFile('data/guide-catalog.json',JSON.stringify(result,null,2)+'\n');
console.log(`Compiled ${result.length} source-linked guides across ${groups.length} contexts.`);
