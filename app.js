import {groupFor,encodeAtlas} from './atlas/compose.js?v=8207f127fbc7';
import {patterns, SOURCE} from './data/patterns.js?v=8207f127fbc7';
import {normalize, defaults, encode, decode, buildScene} from './model.js?v=8207f127fbc7';
import {renderScene} from './scene.js?v=8207f127fbc7';
import {createWalk} from './walk.js?v=8207f127fbc7';
import {normalizeSun,sampleSun,formatHour} from './sun.js?v=8207f127fbc7';
const $=id=>document.getElementById(id);
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let {state,error}=decode(location.hash),focus=115,angle=-35,plan=false,cutaway=true,catalog=[],saved=null;
let walking=false,freeCamera=false,walker=null;
const STORAGE='pwe-pattern-language:v1';
const presets={garden:defaults,quiet:{...defaults,ids:[105,112,127,159,179,180]},social:{...defaults,ids:[105,106,112,115,159,163,171]},cooking:{...defaults,ids:[105,112,115,127,139,147,159,185,199,201,250,251]},light:{...defaults,ids:[105,115,159,171,179,180,190,200,222,223,238,239]},arrival:{...defaults,ids:[105,106,112,115,163,171,242,245,250,251]},blank:{...defaults,ids:[]}};
try{const v=localStorage.getItem(STORAGE);if(v){const parsed=decode(v);if(parsed.error)error='本机保存的方案已损坏，请重新保存。';else saved=parsed.state;}}catch{error='浏览器未开放本机存储；仍可使用分享链接保存方案。';}
const say=text=>{$('status').textContent=text;};
function draw(){
 $('scene').hidden=walking;$('walk-scene').hidden=!walking;
 if(walking){
  try{
   if(!walker)walker=createWalk($('walk-canvas'),message=>{say(message);$('walk-location').textContent=message;},(pose,isFree)=>{
    const inside=pose.x>=0&&pose.x<=state.width&&pose.y>=0&&pose.y<=state.depth;
    const garden=state.ids.includes(115)&&pose.x>state.width-state.court&&(state.ids.includes(105)?pose.y>state.depth-state.court:pose.y<state.court);
    const compass=['北','东北','东','东南','南','西南','西','西北'][((Math.round(pose.yaw/(Math.PI/4))%8)+8)%8];
    $('walk-location').textContent=(isFree?'自由相机 · 高度 '+pose.z.toFixed(1)+' m':'眼高 1.65 m')+' · 朝'+compass+(isFree?'':' · '+(inside&&!garden?'室内':'户外'));
   },settings=>{state.sun=settings;syncSunControls();});
   walker.update(buildScene(state),{freeMode:freeCamera});walker.start();
  }catch(e){walking=false;say(e.message);$('scene').hidden=false;$('walk-scene').hidden=true;}
 }
 if(!walking){walker?.stop();$('scene').innerHTML=renderScene(state,{angle,plan,cutaway,focus});}
 const m=buildScene(state).metrics;
 $('area-value').textContent=m.indoorArea;$('garden-value').textContent=Number(m.courtArea.toFixed(2));$('mode-value').textContent=m.selected;
 $('selected-count').textContent=m.selected+' / '+patterns.length;$('scheme-number').textContent=String(m.selected).padStart(2,'0');
 $('scene-hint').textContent=walking?(freeCamera?'WASD 飞行 · E 上升 / Q 下降 · 拖动转头':'WASD 行走 · 拖动 / 方向键转头 · Esc 停止'):plan?'平面视图 · 上北下南':'拖动旋转 · ← → 调整视角';
 $('scene').setAttribute('aria-label',plan?'建筑平面视图。':'建筑视图。左右方向键旋转视角。');
 $('view-3d').setAttribute('aria-pressed',!plan&&!walking);$('view-plan').setAttribute('aria-pressed',plan&&!walking);$('view-walk').setAttribute('aria-pressed',walking&&!freeCamera);$('view-free').setAttribute('aria-pressed',walking&&freeCamera);$('cutaway').disabled=plan||walking;$('cutaway').closest('label').hidden=walking;
 $('reset-view').textContent=walking?(freeCamera?'回到全景 ↺':'回到入口 ↺'):'视角复位 ↺';
 $('walk-home').textContent=freeCamera?'回到全景':'回到入口';
 $('walk-canvas').setAttribute('aria-label',freeCamera?'自由相机，WASD飞行，E上升Q下降，拖动或方向键转头。':'第一人称漫游，眼高1.65米。WASD移动，拖动或方向键转头。');
 document.querySelector('.walk-help').innerHTML=freeCamera?'WASD 飞行 · E 上升 / Q 下降<br>拖动 / 方向键转头 · 可穿墙观察':'WASD 行走 · 拖动看四周<br>方向键转头 · Esc 停止 / 退出全屏';
 for(const item of document.querySelectorAll('[data-flight]'))item.hidden=!freeCamera;
 syncSunControls();
 $('compare').disabled=!saved;
}
function renderList(){
 const active=document.activeElement;const toggle=active?.dataset.toggle;const selected=active?.dataset.focus;
 $('pattern-list').innerHTML=patterns.filter(p=>$('pattern-filter').value!=='new'||p.batch===2).map(p=>`<div class="pattern-row ${p.id===focus?'focused':''}"><input type="checkbox" data-toggle="${p.id}" ${state.ids.includes(p.id)?'checked':''} aria-label="应用${p.zh}"><button class="pattern-name" data-focus="${p.id}" aria-pressed="${p.id===focus}"><small>${String(p.id).padStart(3,'0')}</small><span>${p.zh}</span></button></div>`).join('');
 if(toggle)$('pattern-list').querySelector(`[data-toggle="${toggle}"]`)?.focus({preventScroll:true});
 else if(selected)$('pattern-list').querySelector(`[data-focus="${selected}"]`)?.focus({preventScroll:true});
}
function detail(){
 const p=patterns.find(p=>p.id===focus), entry=catalog.find(c=>c.id===focus);
 $('pattern-detail').innerHTML=`<div class="pattern-id">${p.id}</div><h3 class="detail-title">${p.zh}</h3><p class="detail-en">${esc(entry?.name||'A PATTERN LANGUAGE')}</p><p class="detail-question">${p.question}</p><p class="detail-idea">${p.idea}</p><div class="effect"><strong>${state.ids.includes(p.id)?'已应用 ·':'未应用 · 勾选后'} 模型中的变化</strong><p>${p.effect}</p></div><p class="tradeoff">${p.tradeoff}</p><p><a class="text-link" href="./${encodeAtlas({group:groupFor(p.id).key,ids:[p.id],focus:p.id,view:'single'})}">查看原书概括、页码与完整图解 ↗</a></p><span class="related-label">可一起探索 · 项目组合建议</span><div class="related">${p.related.map(id=>`<button data-focus="${id}">${id} ${patterns.find(p=>p.id===id).zh}</button>`).join('')}</div>`;
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
$('pattern-filter').onchange=renderList;
$('pattern-list').addEventListener('change',e=>{const id=Number(e.target.dataset.toggle);if(!id)return;state.ids=e.target.checked?[...state.ids,id]:state.ids.filter(n=>n!==id);focus=id;update();say(`${patterns.find(p=>p.id===id).zh}已${e.target.checked?'应用':'移除'}。`);});
document.addEventListener('click',e=>{const target=e.target.closest('[data-focus]');if(target)setFocus(Number(target.dataset.focus));const close=e.target.closest('[data-close]');if(close)$(close.dataset.close).close();});
$('preset').addEventListener('change',()=>{const key=$('preset').value;if(!presets[key])return;state=normalize({...presets[key],sun:state.sun});focus=({garden:115,quiet:179,social:163,cooking:139,light:222,arrival:242,blank:115})[key];update();$('preset').value=key;say('已载入组合。勾选模式继续探索。');});
for(const key of ['width','depth','court','seat'])$(key).addEventListener('input',()=>{state[key]=Number($(key).value);update();});
$('view-3d').onclick=()=>{walking=false;plan=false;state.sun.playing=false;draw();};$('view-plan').onclick=()=>{walking=false;plan=true;state.sun.playing=false;draw();};
$('view-free').onclick=()=>{walking=true;freeCamera=true;plan=false;draw();if(walking)$('walk-canvas').focus({preventScroll:true});};
$('view-walk').onclick=()=>{walking=true;freeCamera=false;plan=false;draw();if(walking)$('walk-canvas').focus({preventScroll:true});};$('cutaway').onchange=()=>{cutaway=$('cutaway').checked;draw();};$('reset-view').onclick=()=>{angle=-35;if(walking){walker?.reset();$('walk-canvas').focus({preventScroll:true});}draw();};
$('walk-home').onclick=()=>{walker?.reset();$('walk-canvas').focus({preventScroll:true});};
document.addEventListener('fullscreenchange',()=>{$('walk-fullscreen').textContent=document.fullscreenElement?'退出全屏':'全屏 ⛶';});
$('walk-fullscreen').onclick=async()=>{try{if(document.fullscreenElement)await document.exitFullscreen();else await $('walk-scene').requestFullscreen();$('walk-canvas').focus({preventScroll:true});}catch{say('当前浏览器不支持全屏；可继续在工作台内漫游。');}};
for(const button of document.querySelectorAll('[data-walk-key]')){
 const key=button.dataset.walkKey;
 button.addEventListener('pointerdown',e=>{button.focus({preventScroll:true});button.setPointerCapture(e.pointerId);walker?.key(key,true);});
 for(const event of ['pointerup','pointercancel','lostpointercapture','blur'])button.addEventListener(event,()=>walker?.key(key,false));
 button.addEventListener('click',e=>{if(e.detail===0)walker?.step(key);});
}

let drag=null;
$('scene').addEventListener('pointerdown',e=>{if(plan||walking)return;drag={x:e.clientX,angle};$('scene').setPointerCapture(e.pointerId);});
$('scene').addEventListener('pointermove',e=>{if(!drag)return;angle=drag.angle+(e.clientX-drag.x)*.35;draw();});
for(const ev of ['pointerup','pointercancel','lostpointercapture'])$('scene').addEventListener(ev,()=>drag=null);
$('scene').addEventListener('keydown',e=>{if(plan||walking)return;if(['ArrowLeft','ArrowRight'].includes(e.key)){e.preventDefault();angle+=e.key==='ArrowLeft'?-10:10;draw();}});
$('save').onclick=()=>{try{localStorage.setItem(STORAGE,encode(state));saved=decode(encode(state)).state;draw();say('已保存到本机，可与接下来的组合比较。');}catch{say('保存失败：本机存储不可用。请使用分享链接保留方案。');}};
$('compare').onclick=()=>{
 if(!saved)return;
 $('comparison').innerHTML=[['已保存的方案',saved],['当前方案',state]].map(([title,s])=>{const m=buildScene(s).metrics;return `<section class="compare-scene"><h3>${title}</h3>${renderScene(s,{angle,plan,cutaway})}<p>室内 ${m.indoorArea} m² · 庭院 ${Number(m.courtArea.toFixed(2))} m² · ${s.ids.length} 个模式</p><p>${s.ids.length?s.ids.map(id=>patterns.find(p=>p.id===id).zh).join(' / '):'未应用模式'}</p><p>包络 ${s.width} × ${s.depth} m · 庭院尺度 ${s.court} m · 座位进深 ${s.seat} m</p><p>光照：${s.sun.mode==='time'?formatHour(s.sun.hour):'手动方位 '+s.sun.azimuth+'° / 高度 '+s.sun.elevation+'°'}</p></section>`;}).join('');
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
 try{const res=await fetch('./data/catalog.json?v=8207f127fbc7');if(!res.ok)throw Error('HTTP '+res.status);catalog=await res.json();if(catalog.length!==253)throw Error('目录数量异常');catalogRender();detail();}
 catch(e){$('catalog-count').textContent='目录加载失败';$('catalog-results').innerHTML='<p>无法读取目录，请检查网络后重试。<button id="retry-catalog" class="secondary">重新加载</button></p>';$('retry-catalog').onclick=loadCatalog;say('模式目录加载失败：'+e.message);}
}
const openCatalog=()=>{$('catalog-dialog').showModal();$('search').focus();};
$('catalog-open').onclick=openCatalog;$('catalog-bottom').onclick=openCatalog;$('about-open').onclick=()=>$('about-dialog').showModal();
$('search').oninput=catalogRender;$('scale').onchange=catalogRender;
$('catalog-results').onclick=e=>{const b=e.target.closest('[data-explore]');if(b){setFocus(Number(b.dataset.explore));$('catalog-dialog').close();$('pattern-detail').scrollIntoView({block:'nearest',behavior:'smooth'});}};

function syncSunControls(){
 const sun=normalizeSun(state.sun),sample=sampleSun(sun);
 $('sun-mode').value=sun.mode;
 $('sun-time-controls').hidden=sun.mode!=='time';$('sun-manual-controls').hidden=sun.mode!=='manual';
 $('sun-time').value=Math.floor(sun.hour*60);$('sun-time-out').textContent=formatHour(sun.hour);
 $('sun-rate').value=sun.rate;$('sun-rate-out').textContent=sun.rate+' 分钟 / 秒';
 for(const key of ['azimuth','elevation']){$('sun-'+key).value=sun[key];$('sun-'+key+'-out').textContent=sun[key]+'°';}
 $('sun-play').textContent=sun.playing?'暂停时间':'播放时间';$('sun-play').setAttribute('aria-pressed',sun.playing);
 $('sun-summary').textContent=sun.mode==='time'?formatHour(sun.hour):'手动太阳';
 $('sun-description').textContent=(sun.mode==='time'?'示意日周期：06:00 日出、18:00 日落。':'直接设定太阳；高度角低于 0° 时太阳落下。')+(sample.elevation<0?' 当前无太阳直射光，未模拟室内灯。':'');
}
function applySun(){
 state.sun=normalizeSun(state.sun);walker?.setLighting(state.sun);syncSunControls();
 history.replaceState(null,'',encode(state));
}
$('sun-mode').onchange=()=>{state.sun.mode=$('sun-mode').value;state.sun.playing=false;applySun();};
$('sun-time').oninput=()=>{state.sun.hour=Number($('sun-time').value)/60;state.sun.playing=false;applySun();};
$('sun-rate').oninput=()=>{state.sun.rate=Number($('sun-rate').value);applySun();};
for(const key of ['azimuth','elevation'])$('sun-'+key).oninput=()=>{state.sun[key]=Number($('sun-'+key).value);applySun();};
$('sun-play').onclick=()=>{state.sun.playing=!state.sun.playing;applySun();};
update({push:false});if(location.hash)$('preset').value='custom';say(error||'从左侧选择模式，或点击名称查看它如何改变空间。');loadCatalog();
