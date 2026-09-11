// Illustrative 24-hour solar path: sunrise 06:00, sunset 18:00.
// This deliberately has no geographic/date-based accuracy claim.
const clamp=(value,min,max,fallback)=>Number.isFinite(Number(value))?Math.max(min,Math.min(max,Number(value))):fallback;
export const defaultSun={mode:'time',hour:15,playing:false,rate:10,azimuth:225,elevation:45};
export function normalizeSun(input={}){
 const s=input&&typeof input==='object'?input:{};
 const mode=s.mode==='manual'?'manual':'time';
 return {mode,hour:clamp(s.hour,0,24,15)%24,playing:mode==='time'&&s.playing===true,rate:clamp(s.rate,1,240,10),azimuth:clamp(s.azimuth,0,360,225),elevation:clamp(s.elevation,-90,90,45)};
}
export function advanceSun(input,seconds){
 const s=normalizeSun(input);
 return {...s,hour:s.playing?(s.hour+Math.max(0,seconds)*s.rate/60)%24:s.hour};
}
const smooth=(a,b,x)=>{const t=Math.max(0,Math.min(1,(x-a)/(b-a)));return t*t*(3-2*t);};
export function sampleSun(input){
 const s=normalizeSun(input);
 const azimuth=s.mode==='time'?s.hour*15:s.azimuth;
 const elevation=s.mode==='time'?65*Math.sin((s.hour-6)*Math.PI/12):s.elevation;
 const az=azimuth*Math.PI/180,el=elevation*Math.PI/180;
 const direction=[Math.sin(az)*Math.cos(el),Math.sin(el),-Math.cos(az)*Math.cos(el)];
 const daylight=smooth(-.18,.22,direction[1]),strength=smooth(0,.15,direction[1]);
 const warmth=smooth(.03,.65,direction[1]);
 const sky=[.025,.045,.085].map((v,i)=>v+([.77,.84,.87][i]-v)*daylight);
 const color=[1.9,.75,.3].map((v,i)=>v+([1.75,1.55,1.25][i]-v)*warmth);
 return {direction,daylight,strength,sky,color,azimuth,elevation};
}
export function formatHour(hour){
 const minutes=Math.floor(((hour%24+24)%24)*60+1e-6);
 return String(Math.floor(minutes/60)).padStart(2,'0')+':'+String(minutes%60).padStart(2,'0');
}
