import {mkdir,cp,rm,readdir,readFile,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
await rm('dist',{recursive:true,force:true});
await mkdir('dist');
for(const name of ['index.html','style.css','app.js','model.js','scene.js','walk.js','lighting.js','walk-physics.js','data']){
 await cp(name,'dist/'+name,{recursive:true});
}
async function files(dir){
 const entries=await readdir(dir,{withFileTypes:true});
 const nested=await Promise.all(entries.map(e=>e.isDirectory()?files(dir+'/'+e.name):[dir+'/'+e.name]));
 return nested.flat().sort();
}
const paths=await files('dist'),contents=await Promise.all(paths.map(path=>readFile(path,'utf8')));
const hash=createHash('sha256');
for(let i=0;i<paths.length;i++)hash.update(paths[i]).update('\0').update(contents[i]).update('\0');
const version=hash.digest('hex').slice(0,12);
// Version every local module, stylesheet and catalog URL, not only index.html.
for(let i=0;i<paths.length;i++){
 if(!/\.(html|js)$/.test(paths[i]))continue;
 const revised=contents[i].replace(/(['"])(\.\.?\/[^'"\s]+\.(?:js|css|json))\1/g,(_,quote,path)=>quote+path+'?v='+version+quote);
 await writeFile(paths[i],revised);
}
console.log('Static site built in dist/; asset version '+version);
