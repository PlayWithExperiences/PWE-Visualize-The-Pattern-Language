import {patterns, SOURCE} from './data/patterns.js';
import {normalize, defaults, encode, decode, buildScene} from './model.js';
import {renderScene} from './scene.js';
const $=id=>document.getElementById(id);
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let {state,error}=decode(location.hash),focus=115,angle=-35,plan=false,cutaway=true,catalog=[],saved=null;
const STORAGE='pwe-pattern-language:v1';
const presets={garden:defaults,quiet:{...defaults,ids:[105,112,127,159,179,180]},social:{...defaults,ids:[105,106,112,115,159,163,171]},blank:{...defaults,ids:[]}};
try{const v=localStorage.getItem(STORAGE);if(v){const parsed=decode(v);if(parsed.error)error='本机保存的方案已损坏，请重新保存。';else saved=parsed.state;}}catch{error='浏览器未开放本机存储；仍可使用分享链接保存方案。';}
const say=text=>{$('status').textContent=text;};
function draw(){
 $('scene').innerHTML=renderScene(state,{angle,plan,cutaway,focus});
 const m=buildScene(state).metrics;
 $('area-value').textContent=m.indoorArea;$('garden-value').textContent=Number(m.courtArea.toFixed(2));$('mode-value').textContent=m.selected;
 $('selected-count').textContent=m.selected+' / 10';$('scheme-number').textContent=String(m.selected).padStart(2,'0');
 $('scene-hint').textContent=plan?'平面视图 · 上北下南':'拖动旋转 · ← → 调整视角';
 $('scene').setAttribute('aria-label',plan?'建筑平面视图。':'建筑视图。左右方向键旋转视角。');
 $('view-3d').setAttribute('aria-pressed',!plan);$('view-plan').setAttribute('aria-pressed',plan);$('cutaway').disabled=plan;
 $('compare').disabled=!saved;
}
function renderList(){
 const active=document.activeElement;const toggle=active?.dataset.toggle;const selected=active?.dataset.focus;
 $('pattern-list').innerHTML=patterns.map(p=>`<div class="pattern-row ${p.id===focus?'focused':''}"><input type="checkbox" data-toggle="${p.id}" ${state.ids.includes(p.id)?'checked':''} aria-label="应用${p.zh}"><button class="pattern-name" data-focus="${p.id}" aria-pressed="${p.id===focus}"><small>${String(p.id).padStart(3,'0')}</small><span>${p.zh}</span></button></div>`).join('');
 if(toggle)$('pattern-list').querySelector(`[data-toggle="${toggle}"]`)?.focus({preventScroll:true});
 else if(selected)$('pattern-list').querySelector(`[data-focus="${selected}"]`)?.focus({preventScroll:true});
}
function detail(){
 const p=patterns.find(p=>p.id===focus), entry=catalog.find(c=>c.id===focus);
 $('pattern-detail').innerHTML=`<div class="pattern-id">${p.id}</div><h3 class="detail-title">${p.zh}</h3><p class="detail-en">${esc(entry?.name||'A PATTERN LANGUAGE')}</p><p class="detail-question">${p.question}</p><p class="detail-idea">${p.idea}</p><div class="effect"><strong>${state.ids.includes(p.id)?'已应用 ·':'未应用 · 勾选后'} 模型中的变化</strong><p>${p.effect}</p></div><p class="tradeoff">${p.tradeoff}</p><span class="related-label">可一起探索 · 项目组合建议</span><div class="related">${p.related.map(id=>`<button data-focus="${id}">${id} ${patterns.find(p=>p.id===id).zh}</button>`).join('')}</div>`;
}
function controls(){
 for(const key of ['width','depth','court','seat']){$(key).value=state[key];$(key+'-out').textContent=state[key]+' m';}
 $('seat').disabled=!state.ids.includes(180);
 $('parameter-note').textContent=state.ids.includes(115)?'庭院尺度调整 L 形住宅的内凹范围；宽度与进深控制建筑包络。':'当前为矩形住宅；庭院尺度调整外侧庭院宽度。启用 115 可探索内凹庭院。';
}
function update({push=true}={}){
 state=normalize(state);renderList();detail();controls();draw();
 if(push){history.replaceState(null,'',encode(state));$('preset').value='custom';$('share-fallback').hidden=true;}
}
function setFocus(id){focus=id;renderList();detail();draw();}
$('pattern-list').addEventListener('change',e=>{const id=Number(e.target.dataset.toggle);if(!id)return;state.ids=e.target.checked?[...state.ids,id]:state.ids.filter(n=>n!==id);focus=id;update();say(`${patterns.find(p=>p.id===id).zh}已${e.target.checked?'应用':'移除'}。`);});
document.addEventListener('click',e=>{const target=e.target.closest('[data-focus]');if(target)setFocus(Number(target.dataset.focus));const close=e.target.closest('[data-close]');if(close)$(close.dataset.close).close();});
$('preset').addEventListener('change',()=>{const key=$('preset').value;if(!presets[key])return;state=normalize(presets[key]);update();$('preset').value=key;say('已载入组合。勾选模式继续探索。');});
for(const key of ['width','depth','court','seat'])$(key).addEventListener('input',()=>{state[key]=Number($(key).value);update();});
$('view-3d').onclick=()=>{plan=false;draw();};$('view-plan').onclick=()=>{plan=true;draw();};$('cutaway').onchange=()=>{cutaway=$('cutaway').checked;draw();};$('reset-view').onclick=()=>{angle=-35;draw();};
let drag=null;
$('scene').addEventListener('pointerdown',e=>{if(plan)return;drag={x:e.clientX,angle};$('scene').setPointerCapture(e.pointerId);});
$('scene').addEventListener('pointermove',e=>{if(!drag)return;angle=drag.angle+(e.clientX-drag.x)*.35;draw();});
for(const ev of ['pointerup','pointercancel','lostpointercapture'])$('scene').addEventListener(ev,()=>drag=null);
$('scene').addEventListener('keydown',e=>{if(plan)return;if(['ArrowLeft','ArrowRight'].includes(e.key)){e.preventDefault();angle+=e.key==='ArrowLeft'?-10:10;draw();}});
$('save').onclick=()=>{try{localStorage.setItem(STORAGE,encode(state));saved=normalize(state);draw();say('已保存到本机，可与接下来的组合比较。');}catch{say('保存失败：本机存储不可用。请使用分享链接保留方案。');}};
$('compare').onclick=()=>{
 if(!saved)return;
 $('comparison').innerHTML=[['已保存的方案',saved],['当前方案',state]].map(([title,s])=>{const m=buildScene(s).metrics;return `<section class="compare-scene"><h3>${title}</h3>${renderScene(s,{angle,plan,cutaway})}<p>室内 ${m.indoorArea} m² · 庭院 ${Number(m.courtArea.toFixed(2))} m² · ${s.ids.length} 个模式</p><p>${s.ids.length?s.ids.map(id=>patterns.find(p=>p.id===id).zh).join(' / '):'未应用模式'}</p><p>包络 ${s.width} × ${s.depth} m · 庭院尺度 ${s.court} m · 座位进深 ${s.seat} m</p></section>`;}).join('');
 $('compare-dialog').showModal();
};
$('restore').onclick=()=>{state=normalize(saved);update();$('compare-dialog').close();say('已载入本机方案。');};
$('share').onclick=async()=>{
 const url=new URL(location.href);url.hash=encode(state);
 try{await navigator.clipboard.writeText(url.href);say('方案链接已复制，打开即可重现相同组合。');}
 catch{$('share-fallback').hidden=false;$('share-url').value=url.href;$('share-url').select();say('剪贴板不可用，请手动复制下方方案链接。');}
};
$('reset').onclick=()=>{state=normalize(defaults);focus=115;angle=-35;update();$('preset').value='garden';say('已恢复初始方案；本机保存的方案保留。');};
window.addEventListener('hashchange',()=>{const result=decode(location.hash);state=result.state;update({push:false});$('preset').value='custom';say(result.error||'已从链接载入方案。');});
function catalogRender(){
 const query=$('search').value.trim().toLowerCase(), scale=$('scale').value;
 const matches=catalog.filter(c=>(scale==='all'||c.scale===scale||(scale==='interactive'&&patterns.some(p=>p.id===c.id)))&&`${c.id} ${c.name} ${c.zh||''} ${patterns.find(p=>p.id===c.id)?.zh||''}`.toLowerCase().includes(query));
 $('catalog-count').textContent=`${matches.length} / 253 个模式`;
 $('catalog-results').innerHTML=matches.length?matches.map(c=>{const p=patterns.find(p=>p.id===c.id);return `<article class="catalog-item"><span>${String(c.id).padStart(3,'0')}</span><div><h3>${esc(p?.zh||c.zh||c.name)}</h3><p>${esc(c.name)}</p></div>${p?`<button data-explore="${c.id}">探索 ↗</button>`:'<span class="index-only">目录条目</span>'}</article>`;}).join(''):'<p class="catalog-note">没有匹配的模式。试试其他名称或切换尺度。</p>';
}
async function loadCatalog(){
 try{const res=await fetch('./data/catalog.json');if(!res.ok)throw Error('HTTP '+res.status);catalog=await res.json();if(catalog.length!==253)throw Error('目录数量异常');catalogRender();detail();}
 catch(e){$('catalog-count').textContent='目录加载失败';$('catalog-results').innerHTML='<p>无法读取目录，请检查网络后重试。<button id="retry-catalog" class="secondary">重新加载</button></p>';$('retry-catalog').onclick=loadCatalog;say('模式目录加载失败：'+e.message);}
}
const openCatalog=()=>{$('catalog-dialog').showModal();$('search').focus();};
$('catalog-open').onclick=openCatalog;$('catalog-bottom').onclick=openCatalog;$('about-open').onclick=()=>$('about-dialog').showModal();
$('search').oninput=catalogRender;$('scale').onchange=catalogRender;
$('catalog-results').onclick=e=>{const b=e.target.closest('[data-explore]');if(b){setFocus(Number(b.dataset.explore));$('catalog-dialog').close();$('pattern-detail').scrollIntoView({block:'nearest',behavior:'smooth'});}};
update({push:false});if(location.hash)$('preset').value='custom';say(error||'从左侧选择模式，或点击名称查看它如何改变空间。');loadCatalog();
