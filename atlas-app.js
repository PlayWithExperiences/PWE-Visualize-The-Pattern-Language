import {defaultSun,formatHour} from './sun.js?v=92d7972c59b4';
import {groups,groupFor,compose,normalizeIds,toggleId,encodeAtlas,decodeAtlas,alternatives,influences} from './atlas/compose.js?v=92d7972c59b4';
import {esc} from './atlas/primitives.js?v=92d7972c59b4';
const $=s=>document.querySelector(s),storageKey='pwe-pattern-language:atlas:v1';
const presets={region:[['城镇与乡野',[2,3,4,6,7]],['地方自主',[1,2,7]]],city:[['多中心慢行城市',[9,10,16,18,20,21,22]],['邻里的身份与边界',[8,12,13,14,15,24,25]]],neighborhood:[['可以步行的日常',[30,31,37,52,53,54,60,67,68]],['学习与共同服务',[41,43,44,45,46,47,48]],['花园里的邻里生活',[60,63,64,69,70,71,72,73,74]]],institution:[['共享与个人',[75,79,88,89,94]],['小团队与公共街道',[80,81,82,83,85,87,92,93]]],site:[['有生活的庭院',[104,105,106,110,112,115,119,120,125,126]],['沿街的建筑群',[95,98,99,100,102,103,108,122,124]]],plan:[['家庭的共享核心',[127,128,129,136,137,138,139,143,147]],['工作与来访',[130,146,148,149,150,151,152,157]]],edge:[['从屋内到花园',[159,160,161,163,168,171,173,174,176,177]],['种植与照料',[169,170,172,175,177,178]]],room:[['围坐与窗边',[179,180,181,182,185,190,193,200,201]],['睡眠与私人角落',[187,188,189,190,196,198,203,204]],['明亮的工作与烹饪',[183,184,192,194,199,200]]],construction:[['开口与柔和光线',[221,222,223,225,236,237,238,239,240]],['房间与结构构想',[205,209,210,211,212,217,219,229]],['材料与表面',[207,218,233,234,235,240]]],finish:[['门前的停留',[241,242,243,244,245,246,247]],['一个人的生活痕迹',[248,249,250,251,252,253]]]};
const invalidInitialHash=location.hash.startsWith('#atlas=')&&!decodeAtlas(location.hash);
let guides,relations,saved=null,state=decodeAtlas(location.hash)||{group:'site',ids:[104,105,106,110,112,115,119,120,125,126],focus:115,view:'combined',surface:'3d',camera:'free',sun:{...defaultSun}};
let worldViewer=null,worldImport=null,worldRequest=0,disposeComparison=null;
function renderWorldEffects(scene){
 const local=state.ids.filter(id=>groupFor(id).key===state.group),shown=state.view==='single'?[state.focus]:local;
 $('#effects-title').textContent=`三维场景采用 ${shown.length} 项模式 · 查看作用`;
 $('#effects-list').innerHTML=shown.map(id=>{const p=guide(id),ob=scene.state.observations?.find(o=>o.id===id)?.observation,mark=scene.landmarks.find(m=>m.id===id);return `<div class="effect"><button data-focus="${id}">#${id} ${esc(p.zh)}</button><p>${esc(ob||mark?.label||p.principle)}</p><p>可使用“到模式附近”查看。组合中的多个模式可能共同作用于同一构件。</p></div>`;}).join('');
 const others=state.ids.length-local.length;$('#context-note').textContent=(others?`另有 ${others} 项保留在其他尺度。`:'')+'三维场景按当前尺度生成；制度与结构模型表达空间概念，未模拟实际运行或进行工程验算。';
 $('#drawing-note').textContent=state.view==='single'?`单项三维 · #${state.focus}`:`三维组合 · 标记定位 #${state.focus}`;
}
async function renderWorld(){
 const use3d=state.surface==='3d';$('#surface-3d').setAttribute('aria-pressed',use3d);$('#surface-diagram').setAttribute('aria-pressed',!use3d);$('#drawing').hidden=use3d;$('#world-panel').hidden=!use3d;$('#baseline').disabled=use3d;$('#baseline-control').hidden=use3d;$('#baseline-drawing').hidden=use3d||!$('#baseline').checked;
 if(!use3d){worldRequest++;worldViewer?.hide();return;}
 const request=++worldRequest;
 try{if(!worldViewer){worldImport??=import('./world/viewer.js?v=92d7972c59b4');const {createWorldViewer}=await worldImport;if(request!==worldRequest)return;worldViewer=createWorldViewer({onSun:(sun,save)=>{state.sun=sun;if(save)persistURL();},onCamera:camera=>{state.camera=camera;render();},onSelect:select,onTitle:id=>guide(id)?.zh,onCutaway:value=>{state.cutaway=value;render();},onEmphasis:value=>{state.emphasis=value;render();},onError:status});}
 if(request!==worldRequest)return;const scene=worldViewer.update(state);worldViewer.show();$('#world-canvas').style.visibility='visible';renderWorldEffects(scene);
 }catch(error){worldViewer?.hide();$('#world-canvas').style.visibility='hidden';$('#world-error').hidden=false;$('#world-error').textContent='三维载入失败：'+error.message;status('三维载入失败，可切回图解继续查看。');}
}
const guide=id=>guides.find(p=>p.id===id),status=text=>{$('#status').textContent=text;};
function persistURL(){history.replaceState(null,'',encodeAtlas(state));}
function select(id){state.focus=id;state.group=groupFor(id).key;render();}
function toggle(id){const rival=alternatives.find(a=>a.includes(id))?.find(n=>state.ids.includes(n)&&n!==id);state.ids=toggleId(state.ids,id);render();if(rival)status(`#${id} 已替换另一种居住方案 #${rival}。`);}
function geometry(result){return JSON.stringify(result.diagram.shapes.filter(s=>s.kind!=='text').map(s=>[s.kind,s.attrs]));}
function activeDiagram(){return compose(state.group,state.view==='single'?[state.focus]:state.ids,state.focus);}
let listedFocus=0,listedQuery='';
function renderList(){
 const q=$('#search').value.trim().toLowerCase(),only=$('#only-selected').checked;
 const filtered=guides.filter(p=>(q?[p.id,p.zh,p.name,p.problem,p.principle].join(' ').toLowerCase().includes(q):p.group===state.group)&&(!only||state.ids.includes(p.id)));
 $('#result-count').textContent=`${filtered.length} 项`;$('#empty').hidden=filtered.length>0;
 $('#pattern-list').innerHTML=filtered.map(p=>`<div class="pattern-row" data-focus="${p.id===state.focus}"><input type="checkbox" data-toggle="${p.id}" aria-label="应用 ${p.id} ${esc(p.zh)}" ${state.ids.includes(p.id)?'checked':''}><button data-focus="${p.id}"><span class="num">${String(p.id).padStart(3,'0')}</span>${esc(p.zh)}<small>${esc(p.name)}${q?' · '+groupFor(p.id).name:''}</small></button></div>`).join('');
 const list=$('#pattern-list');if(q!==listedQuery)list.scrollTop=0;const focused=list.querySelector('[data-focus="true"]');
 if(focused&&listedFocus!==state.focus){const top=focused.getBoundingClientRect().top-list.getBoundingClientRect().top+list.scrollTop;list.scrollTop=Math.max(0,top-list.clientHeight*.25);}
 listedFocus=state.focus;listedQuery=q;
}
function renderDetail(){
 const p=guide(state.focus)||guide(groups.find(g=>g.key===state.group).from);state.focus=p.id;
 const out=relations.edges.filter(([a])=>a===p.id).map(([,b])=>b),incoming=relations.edges.filter(([,b])=>b===p.id).map(([a])=>a);
 const buttons=ids=>ids.map(id=>`<button data-focus="${id}">#${id} ${esc(guide(id).zh)}</button>`).join('');
 $('#detail').innerHTML=`<div><span class="number">${String(p.id).padStart(3,'0')}</span><h3>${esc(p.zh)}</h3><p class="english">${esc(p.name)}</p><button class="toggle ${state.ids.includes(p.id)?'':'primary'}" data-toggle="${p.id}">${state.ids.includes(p.id)?'从方案移除 −':'加入我的方案 +'}</button></div><div><h4>它要解决什么</h4><p>${esc(p.problem)}</p><h4>原书原则 · 项目概括</h4><p>${esc(p.principle)}</p>${p.note?`<p class="note">${esc(p.note)}</p>`:''}<h4>在这里观察</h4><p>${esc(groupFor(p.id).description)}。可切换“单项”观察本项，再回到组合中比较。三维中可标出本项构件、拉近观察，或到附近漫游；图解用橙色轮廓标出作用。</p></div><div class="source"><strong>来源定位 · A Pattern Language (1977)</strong><p>扫描本 PDF 第 ${p.source.pdfPages.join('、')} 页<br>候选印刷页 ${p.source.printedStartCandidate}–${p.source.printedEndCandidate}${p.source.solutionPdfPage?' · 方案段 PDF 第 '+p.source.solutionPdfPage+' 页':''}</p><p>依据：${p.source.reviewBasis==='solution-section'?'方案段及相关正文':'现有正文（详见本项说明）'}。页界由文字页码恢复，非逐页校勘。图解是项目解释。</p><details><summary>原书提及 ${out.length} 项 / 被提及 ${incoming.length} 项</summary><p>匹配英文名与编号的有向引用；不是强制依赖，亦非完整关系网。</p><div class="relations">${buttons(out)}</div>${incoming.length?`<details><summary>查看哪些模式提及本项</summary><div class="relations">${buttons(incoming)}</div></details>`:''}</details></div>`;
}
function render(){
 const group=groups.find(g=>g.key===state.group);if(!guide(state.focus)||groupFor(state.focus).key!==state.group)state.focus=group.from;
 $('#scale-tabs').innerHTML=groups.map(g=>`<button data-group="${g.key}" aria-pressed="${g.key===state.group}">${g.name}<small>${state.ids.filter(id=>groupFor(id).key===g.key).length}/${g.to-g.from+1}</small></button>`).join('');
 renderList();renderDetail();const result=activeDiagram();$('#drawing').innerHTML=result.svg;$('#baseline-drawing').innerHTML=$('#baseline').checked?compose(state.group,[]).svg:'';$('#baseline-drawing').hidden=!$('#baseline').checked;
 $('#group-title').textContent=group.name+' / '+group.from+'—'+group.to;$('#context-count').textContent=`本尺度 ${state.ids.filter(id=>groupFor(id).key===state.group).length} 项 · 全方案 ${state.ids.length} 项`;
 $('#single').setAttribute('aria-pressed',state.view==='single');$('#combined').setAttribute('aria-pressed',state.view==='combined');
 $('#drawing-note').textContent=state.view==='single'?`单项示例 #${state.focus}（不改变方案选择）`:(state.ids.includes(state.focus)?`正在阅读 #${state.focus} · 橙色为本项作用`:`#${state.focus} 未加入组合，可切换单项图解预览`);
 const foreign=state.ids.filter(id=>groupFor(id).key!==state.group),influencing=foreign.filter(id=>(influences[state.group]||[]).includes(id));
 $('#context-note').textContent=(foreign.length?`另有 ${foreign.length} 项保留在其他尺度。`:'二维图解表达概念关系，独立绘制，并非三维场景的投影。')+(influencing.length?`本图接收约束：${influencing.map(id=>'#'+id).join('、')}。`:'')+(state.group==='site'&&influencing.includes(21)?'#21 在 #96 层数示例中限制高度。':'')+(result.localIds.length>12?' 选项较多，部分空间会重叠；可逐项对照，工具不会自动解决所有冲突。':'');
 const current=presets[state.group],preset=$('#preset'),previous=preset.dataset.group===state.group?preset.value:'0';
 const local=state.ids.filter(id=>groupFor(id).key===state.group).join(','),matching=current.findIndex(([,ids])=>[...ids].sort((a,b)=>a-b).join(',')===local);
 preset.innerHTML=current.map(([name],i)=>`<option value="${i}">${name}</option>`).join('');preset.value=matching>=0?String(matching):previous;preset.dataset.group=state.group;
 $('#effects-title').textContent=`查看本图 ${result.localIds.length} 项的作用与覆盖关系`;
 const whole=geometry(result);
 $('#effects-list').innerHTML=result.localIds.map(id=>{const p=guide(id),suppressed=state.view==='combined'&&whole===geometry(compose(state.group,state.ids.filter(n=>n!==id),state.focus));const note=result.diagram.notes.find(n=>n.id===id)?.text;return `<div class="effect"><button data-focus="${id}">#${id} ${esc(p.zh)}</button><p>${esc(note||p.principle)}</p>${suppressed?'<p class="suppressed">当前组合中未产生额外图形变化，可能由另一规则覆盖；切换单项查看。</p>':''}</div>`;}).join('')||'<p>当前没有应用本尺度的模式。</p>';
 persistURL();renderWorld();
}
function loadSaved(){try{const raw=localStorage.getItem(storageKey);if(!raw)return null;const s=decodeAtlas('#atlas='+encodeURIComponent(raw));if(!s)throw Error('保存格式无法读取');return s;}catch(error){status('无法读取本机方案：'+error.message);return undefined;}}
async function init(){
 try{[guides,relations]=await Promise.all(['./data/guide-catalog.json?v=92d7972c59b4','./data/book-relations.json?v=92d7972c59b4'].map(async url=>{const r=await fetch(url);if(!r.ok)throw Error(`${url}: HTTP ${r.status}`);return r.json();}));if(guides.length!==253)throw Error('模式数据不完整');}catch(error){status('资料载入失败：'+error.message+'。请刷新重试。');$('#drawing').textContent='无法加载模式资料。';return;}
 document.addEventListener('click',e=>{const t=e.target.closest('button');if(!t)return;if(t.dataset.focus)select(+t.dataset.focus);if(t.dataset.toggle)toggle(+t.dataset.toggle);if(t.dataset.group){state.group=t.dataset.group;delete state.cutaway;state.focus=groups.find(g=>g.key===state.group).from;render();}if(t.classList.contains('close'))t.closest('dialog').close();});
 $('#pattern-list').addEventListener('change',e=>{if(e.target.dataset.toggle)toggle(+e.target.dataset.toggle);});
 $('#search').addEventListener('input',renderList);$('#only-selected').addEventListener('change',renderList);
 for(const surface of ['3d','diagram'])$('#surface-'+surface).onclick=()=>{state.surface=surface;state.camera??='free';state.sun??={...defaultSun};render();};
 for(const view of ['single','combined'])$('#'+view).onclick=()=>{state.view=view;render();};$('#baseline').onchange=render;
 $('#clear-context').onclick=()=>{state.ids=state.ids.filter(id=>groupFor(id).key!==state.group);render();status('已清空本尺度，其他尺度的选择保留。');};
 $('#apply-preset').onclick=()=>{const ids=presets[state.group][+$('#preset').value][1];state.ids=normalizeIds([...state.ids.filter(id=>groupFor(id).key!==state.group),...ids]);state.focus=ids[0];state.view='combined';render();worldViewer?.reset();status('已应用本尺度的示例组合。');};
 $('#save').onclick=()=>{try{localStorage.setItem(storageKey,JSON.stringify(state));status('已保存一个本机方案，包含所有尺度的选择。');}catch(e){status('保存失败：'+e.message);}};
 $('#share').onclick=async()=>{persistURL();const url=location.href;$('#share-url').value=url;$('#share-url').hidden=false;status('正在复制组合链接…');try{await navigator.clipboard.writeText(url);status('组合链接已复制。');}catch{$('#share-url').hidden=false;$('#share-url').value=url;$('#share-url').select();status('请复制下方完整链接。');}};
 $('#export').onclick=()=>{const blob=new Blob([activeDiagram().svg],{type:'image/svg+xml;charset=utf-8'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=`pattern-language-${state.group}.svg`;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);status('已导出当前图解 SVG。');};
 $('#compare').onclick=async()=>{saved=loadSaved();if(saved===undefined)return;if(!saved){status('请先保存一个本机方案，再进行比较。');return;}disposeComparison?.();disposeComparison=null;const three=state.surface==='3d';$('#comparison').innerHTML=[['当前组合',state],['保存的组合',saved]].map(([label,s])=>`<section><h3>${label}</h3>${three?`<canvas class="comparison-world" aria-label="${label}三维总览"></canvas>`:compose(state.group,s.ids).svg}<p>${three?'光照：'+(s.sun?.mode==='manual'?`${s.sun.azimuth}° / ${s.sun.elevation}°`:formatHour(s.sun?.hour??15))+' · 三维总览<br>':''}本尺度：${s.ids.filter(id=>groupFor(id).key===state.group).join('、')||'未选模式'}</p></section>`).join('');$('#compare-dialog').showModal();if(three){const {mountWorldComparison}=await import('./world/viewer.js?v=92d7972c59b4');if($('#compare-dialog').open)disposeComparison=mountWorldComparison($('#comparison'),state,saved,status);}};
 $('#compare-dialog').addEventListener('close',()=>{disposeComparison?.();disposeComparison=null;});
 $('#restore').onclick=()=>{if(saved){state={...saved,ids:[...saved.ids]};$('#compare-dialog').close();render();status('已载入保存方案。');}};
 $('#about').onclick=()=>$('#about-dialog').showModal();$('#fullscreen').onclick=async()=>{try{if(document.fullscreenElement)await document.exitFullscreen();else await (state.surface==='3d'?$('#world-panel'):$('.drawing-panel')).requestFullscreen();}catch(e){status('此浏览器未能进入全屏：'+e.message);}};
 document.addEventListener('fullscreenchange',()=>{$('#world-exit-fullscreen').hidden=document.fullscreenElement!==$('#world-panel');$('#fullscreen').textContent=document.fullscreenElement?'退出全屏 ↙':'全屏 ↗';});
 window.addEventListener('hashchange',()=>{const decoded=decodeAtlas(location.hash);if(decoded){state=decoded;render();}});
 render();if(invalidInitialHash)status('分享链接无法解析，已加载初始方案。');
}
init();
