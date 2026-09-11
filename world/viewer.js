import {createWalk} from '../walk.js?v=580c78464447';
import {buildWorld} from './index.js?v=580c78464447';
import {projectMarker} from './navigation.js?v=580c78464447';
import {EYE_HEIGHT,floorHeight} from '../walk-physics.js?v=580c78464447';
import {normalizeSun,formatHour} from '../sun.js?v=580c78464447';
const $=s=>document.querySelector(s);
export function createWorldViewer({onSun,onCamera,onSelect,onTitle,onCutaway,onError}){
 let scene=null,focus=0,lastKey='',currentState=null,engine=null,mode='free',speed=1,visible=false,lost=false;
 const canvas=$('#world-canvas'),labels=$('#world-labels');
 function locate(pose,free){
  if(!scene)return;const eye=free?pose.z:floorHeight(scene.boxes,pose.x,pose.y,pose.feet??Infinity)+EYE_HEIGHT;
  $('#world-location').textContent=free?`自由相机 · 高度 ${eye.toFixed(1)} m`:`第一人称 · 眼高 1.65 m · 地面 ${(eye-EYE_HEIGHT).toFixed(1)} m`;
  labels.replaceChildren();
  const landmarks=scene.landmarks.filter(m=>m.id===focus).slice(0,3);
  for(const m of landmarks){const p=projectMarker({...m,z:(m.z||1.5)+.5},pose,eye,canvas.clientWidth,canvas.clientHeight);if(!p)continue;const b=document.createElement('button');b.className='world-label';b.textContent=`#${m.id} ${m.label||''}`;b.style.left=p.x+'px';b.style.top=p.y+'px';b.onclick=()=>onSelect(m.id);labels.append(b);}
 }
 function lighting(s){
  const sun=normalizeSun(s);if(currentState)currentState.sun=sun;
  $('#world-hour-label').textContent=formatHour(sun.hour);$('#world-light-summary').textContent=sun.mode==='time'?formatHour(sun.hour):`${Math.round(sun.azimuth)}° / ${Math.round(sun.elevation)}°`;
  if(document.activeElement!==$('#world-hour'))$('#world-hour').value=Math.round(sun.hour*60);
  $('#world-play').textContent=sun.playing?'暂停时间':'播放时间';$('#world-play').setAttribute('aria-pressed',sun.playing);onSun(sun,false);
 }
 function applySun(patch){const sun=normalizeSun({...currentState.sun,...patch});currentState.sun=sun;engine?.setLighting(sun);lighting(sun);onSun(sun,true);}
 function controls(){
  for(const button of document.querySelectorAll('[data-world-camera]'))button.onclick=()=>{onCamera(button.dataset.worldCamera);};
  $('#world-reset').onclick=()=>engine?.reset();$('#world-cutaway').onchange=e=>onCutaway(e.target.checked);$('#world-focus').onclick=()=>{engine?.goToPattern(focus);canvas.focus({preventScroll:true});};
  $('#world-speed').onchange=e=>{speed=+e.target.value;engine?.setSpeed(speed);};
  $('#world-hour').oninput=e=>applySun({hour:+e.target.value/60,playing:false});$('#world-rate').oninput=e=>{applySun({rate:+e.target.value});$('#world-rate-label').textContent=e.target.value+' 分钟 / 秒';};
  $('#world-azimuth').oninput=e=>{applySun({azimuth:+e.target.value});$('#world-azimuth-label').textContent=e.target.value+'°';};
  $('#world-elevation').oninput=e=>{applySun({elevation:+e.target.value});$('#world-elevation-label').textContent=e.target.value+'°';};
  $('#world-sun-mode').onchange=e=>{applySun({mode:e.target.value,playing:false});$('#world-time-controls').hidden=e.target.value!=='time';$('#world-manual-controls').hidden=e.target.value!=='manual';};
  $('#world-play').onclick=()=>applySun({playing:!currentState.sun.playing});
  for(const button of document.querySelectorAll('[data-world-key]')){
   const key=button.dataset.worldKey;button.onpointerdown=e=>{e.preventDefault();canvas.focus({preventScroll:true});button.setPointerCapture(e.pointerId);engine?.key(key,true);};
   for(const name of ['pointerup','pointercancel','lostpointercapture'])button.addEventListener(name,()=>engine?.key(key,false));
   button.onclick=e=>{if(e.detail===0){canvas.focus({preventScroll:true});engine?.step(key);}};
  }
 }
 controls();
 return {
  update(state){
   if(lost)throw Error('三维显示上下文已中断，请刷新页面后重试。');
   currentState=state;focus=state.focus;mode=state.camera==='walk'?'walk':'free';
   const ids=state.view==='single'?[state.focus]:state.ids,key=state.group+':'+ids.join(',');
   const changed=key!==lastKey;
   if(changed){scene=buildWorld(state.group,ids,state.sun);for(const m of scene.landmarks)if(!m.label||m.label===`#${m.id}`)m.label=onTitle?.(m.id)||m.label;lastKey=key;}
   scene.state.sun=normalizeSun(state.sun);scene.focus=focus;scene.cutaway=mode==='free'&&(state.cutaway??['plan','room'].includes(state.group));$('#world-cutaway').checked=scene.cutaway;$('#world-cutaway').disabled=mode==='walk';
   if(!engine)engine=createWalk(canvas,message=>{visible=false;lost=true;$('#world-error').hidden=false;$('#world-error').textContent=message;onError(message);},locate,lighting);
   const engineKey=key+':'+mode+':'+scene.cutaway+':'+(scene.cutaway?focus:0);
   if(this.engineKey!==engineKey){engine.update(scene,{freeMode:mode==='free',resetView:changed&&state.view==='single'});this.engineKey=engineKey;}else engine.setLighting(scene.state.sun);
   canvas.dataset.worldKey=scene.key;canvas.dataset.modelPatterns=scene.applied.join(',');engine.setSpeed(speed);
   $('#world-error').hidden=true;$('#world-focus').disabled=!scene.landmarks.some(m=>m.id===focus);$('#world-focus').textContent=`到 #${focus} 附近`;
   for(const b of document.querySelectorAll('[data-world-camera]'))b.setAttribute('aria-pressed',b.dataset.worldCamera===mode);
   for(const b of document.querySelectorAll('[data-world-lift]'))b.hidden=mode!=='free';
   const s=scene.state.sun;$('#world-sun-mode').value=s.mode;$('#world-time-controls').hidden=s.mode!=='time';$('#world-manual-controls').hidden=s.mode!=='manual';$('#world-hour').value=Math.round(s.hour*60);$('#world-rate').value=s.rate;$('#world-rate-label').textContent=s.rate+' 分钟 / 秒';$('#world-azimuth').value=s.azimuth;$('#world-azimuth-label').textContent=s.azimuth+'°';$('#world-elevation').value=s.elevation;$('#world-elevation-label').textContent=s.elevation+'°';lighting(s);
   const mark=scene.landmarks.find(m=>m.id===focus);$('#world-observation').textContent=mark?`#${focus} · ${mark.label||'可点击“到附近”近看'}`:'当前组合未加入此模式，可切换单项预览。';
   if(visible)engine.start();return scene;
  },
  reset(){engine?.reset();},
  show(){visible=true;engine?.start();},hide(){visible=false;engine?.stop();},dispose(){engine?.dispose();}
 };
}

export function mountWorldComparison(container,current,saved,onError){
 const engines=[];
 for(const [i,s]of [current,saved].entries()){
  const canvas=container.querySelectorAll('canvas')[i];
  try{const scene=buildWorld(current.group,s.ids,s.sun);const engine=createWalk(canvas,onError);engine.update(scene,{freeMode:true});engine.start();engines.push(engine);}catch(error){canvas.replaceWith(Object.assign(document.createElement('p'),{textContent:'三维比较载入失败：'+error.message}));}
 }
 return ()=>engines.forEach(e=>e.dispose());
}
