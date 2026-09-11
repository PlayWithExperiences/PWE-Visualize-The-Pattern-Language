import {normalizeSun} from '../sun.js?v=580c78464447';
import {Diagram} from './primitives.js?v=580c78464447';
import {region,city} from './region-city.js?v=580c78464447';
import {neighborhood} from './neighborhood.js?v=580c78464447';
import {institution} from './institution.js?v=580c78464447';
import {site} from './site.js?v=580c78464447';
import {plan} from './plan.js?v=580c78464447';
import {edge} from './edge.js?v=580c78464447';
import {room} from './room.js?v=580c78464447';
import {construction} from './construction.js?v=580c78464447';
import {finish} from './finish.js?v=580c78464447';
export const groups=[
 {key:'region',name:'区域',from:1,to:7,render:region,description:'聚落分布、土地与治理联系'},
 {key:'city',name:'城市',from:8,to:29,render:city,description:'城市中心、社区与交通网络'},
 {key:'neighborhood',name:'邻里',from:30,to:74,render:neighborhood,description:'住宅组团、公共服务与步行生活'},
 {key:'institution',name:'居住与机构',from:75,to:94,render:institution,description:'自主领域、共同生活与公共界面'},
 {key:'site',name:'建筑与场地',from:95,to:126,render:site,description:'体量、院落、路径与入口'},
 {key:'plan',name:'建筑平面',from:127,to:158,render:plan,description:'共同核心、私密层次与流线'},
 {key:'edge',name:'建筑边缘',from:159,to:178,render:edge,description:'建筑与花园之间的生活'},
 {key:'room',name:'房间',from:179,to:204,render:room,description:'活动、开口、家具与空间高度'},
 {key:'construction',name:'构造',from:205,to:240,render:construction,description:'原书构造体系的概念剖面'},
 {key:'finish',name:'生活细节',from:241,to:253,render:finish,description:'座位、表面、植物、物件与光'}
];
export const alternatives=[[75,76,77,78]];
export const influences={site:[21],plan:[],room:[127,250],construction:[190]};
export function groupFor(id){return groups.find(g=>id>=g.from&&id<=g.to);}
export function normalizeIds(input){return [...new Set((Array.isArray(input)?input:[]).map(Number).filter(id=>Number.isInteger(id)&&id>=1&&id<=253))].sort((a,b)=>a-b).filter((id,_,all)=>!alternatives.some(set=>set.includes(id)&&all.some(other=>set.includes(other)&&other<id)));}
export function toggleId(ids,id){if(ids.includes(id))return ids.filter(n=>n!==id);const rivals=alternatives.find(set=>set.includes(id))||[];return normalizeIds([...ids.filter(n=>!rivals.includes(n)),id]);}
export function compose(key,ids=[],focus=0){const group=groups.find(g=>g.key===key)||groups[0];const selected=normalizeIds(ids);const d=new Diagram(group.name,selected,focus);group.render(d);return {group,diagram:d,svg:d.toSVG(),localIds:selected.filter(id=>groupFor(id)?.key===group.key),influencingIds:selected.filter(id=>(influences[group.key]||[]).includes(id))};}
export function encodeAtlas(state){return '#atlas='+encodeURIComponent(JSON.stringify({group:state.group,ids:normalizeIds(state.ids),focus:state.focus||0,view:state.view==='single'?'single':'combined',...(state.surface?{surface:state.surface==='3d'?'3d':'diagram',camera:state.camera==='walk'?'walk':'free',...(typeof state.cutaway==='boolean'?{cutaway:state.cutaway}:{}),sun:{...normalizeSun(state.sun),playing:false}}:{})}));}
export function decodeAtlas(hash){try{if(!hash.startsWith('#atlas='))return null;const s=JSON.parse(decodeURIComponent(hash.slice(7)));if(!s||Array.isArray(s)||!Array.isArray(s.ids)||!groups.some(g=>g.key===s.group))return null;return {group:groups.some(g=>g.key===s.group)?s.group:'site',ids:normalizeIds(s.ids),focus:Number.isInteger(s.focus)&&s.focus>=1&&s.focus<=253?s.focus:0,view:s.view==='single'?'single':'combined',...(s.surface?{surface:s.surface==='3d'?'3d':'diagram',camera:s.camera==='walk'?'walk':'free',...(typeof s.cutaway==='boolean'?{cutaway:s.cutaway}:{}),sun:{...normalizeSun(s.sun),playing:false}}:{})};}catch{return null;}}
