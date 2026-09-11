// Explicit coverage; 25 binary modes have 33,554,432 combinations.
// Keep exhaustive coverage of the original ten, plus every pair, full/leave-one-out,
// and repeatable mixed samples. This does not claim exhaustive 25-mode coverage.
export const legacyIds=[105,106,112,115,127,159,163,171,179,180];
export function scenarios(allowed){
 const result=new Map();
 const add=ids=>{const list=[...ids].sort((a,b)=>a-b);result.set(list.join(','),list);};
 for(let mask=0;mask<1024;mask++)add(legacyIds.filter((_,i)=>mask&(1<<i)));
 for(let i=0;i<allowed.length;i++)for(let j=i+1;j<allowed.length;j++)add([allowed[i],allowed[j]]);
 add(allowed);
 for(const excluded of allowed)add(allowed.filter(id=>id!==excluded));
 let seed=0x735129;
 for(let n=0;n<384;n++){
  const ids=allowed.filter(()=>{seed=(Math.imul(1664525,seed)+1013904223)>>>0;return seed>>>31;});
  add(ids);
 }
 return [...result.values()];
}
