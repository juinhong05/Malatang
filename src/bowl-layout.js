// Stable, irregular positions keep already-placed portions still as more are added.
export function portionPlacement(piece){
  let seed=2166136261;
  for(const char of piece.key)seed=Math.imul(seed^char.charCodeAt(0),16777619)>>>0;
  const angle=(seed%10000)/10000*Math.PI*2;
  const radius=.25+((seed>>>10)%1000)/1000*.7;
  return {
    x:49+Math.cos(angle)*24*radius,
    y:51+Math.sin(angle)*14*radius,
    width:piece.category==='Noodles'?40:piece.category==='Vegetables'?36:32,
    rotation:(seed>>>17)%66-33,
  };
}
