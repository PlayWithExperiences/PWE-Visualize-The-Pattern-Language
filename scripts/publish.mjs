// Publish only the built static website. ProjectInfo and source history stay on main.
import {execFileSync} from 'node:child_process';
import {mkdtempSync,cpSync,writeFileSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join,resolve} from 'node:path';
const root=resolve(import.meta.dirname,'..');
const run=(args,cwd=root)=>execFileSync('git',['-c','credential.helper=','-c','credential.helper=!gh auth git-credential',...args],{cwd,encoding:'utf8',stdio:['ignore','pipe','pipe']}).trim();
const origin=run(['remote','get-url','origin']);
if(origin!=='https://github.com/PlayWithExperiences/PWE-Visualize-The-Pattern-Language.git')throw Error('Unexpected publish destination; inspect origin first.');
execFileSync(process.execPath,['scripts/build.mjs'],{cwd:root,stdio:'inherit'});
const dir=mkdtempSync(join(tmpdir(),'pwe-pages-'));
try{
 run(['init','-b','gh-pages'],dir);run(['remote','add','origin',origin],dir);
 let exists=false;
 try{run(['ls-remote','--exit-code',origin,'refs/heads/gh-pages']);exists=true;}catch(e){if(e.status!==2)throw e;}
 if(exists){run(['fetch','--depth=1','origin','gh-pages'],dir);run(['reset','--hard','FETCH_HEAD'],dir);run(['rm','-r','--ignore-unmatch','.'],dir);}
 cpSync(join(root,'dist'),dir,{recursive:true});writeFileSync(join(dir,'.nojekyll'),'');
 run(['add','.'],dir);
 const changed=run(['status','--porcelain'],dir);
 if(changed){run(['commit','-m','Publish pattern language lab'],dir);run(['push','origin','HEAD:gh-pages'],dir);}
 console.log('Published static branch:',run(['rev-parse','HEAD'],dir));
}finally{rmSync(dir,{recursive:true,force:true});}
