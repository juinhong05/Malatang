import React, {memo} from 'react';
import Art from './Art';
import {bowlPortions,summarize} from './game';
import {portionPlacement} from './bowl-layout';

function BowlScene({bowl,pendingKeys=[],sceneRef,compact=false}){
  const {items,portions}=summarize(bowl);
  const pending=new Set(pendingKeys);
  const pieces=bowlPortions(bowl).map(piece=>({...piece,placement:portionPlacement(piece)}))
    .sort((a,b)=>a.placement.y-b.placement.y);
  const landed=pieces.filter(piece=>!pending.has(piece.key));
  return <div ref={sceneRef} className={`bowl-scene ${compact?'compact':''}`} role="img"
    aria-label={portions?`Bowl containing ${items.map(i=>`${i.quantity} ${i.name}`).join(', ')}`:'Empty bowl'}>
    <img className="ceramic-bowl" src="/art/bowl-depth.png" alt="" draggable="false"/>
    <div className="bowl-cavity">
      {landed.length>0&&<span className="pile-contact" style={{opacity:Math.min(.48,.13+landed.length*.025)}}/>}
      {landed.map(i=><span key={i.key} className="pile-piece" data-ingredient={i.id} data-portion={i.portion}
        style={{left:`${i.placement.x}%`,top:`${i.placement.y}%`,width:`${i.placement.width}%`,'--food-angle':`${i.placement.rotation}deg`}}>
        <Art index={i.art} className="bowl-food"/>
      </span>)}
    </div>
    <img className="ceramic-bowl bowl-front" src="/art/bowl-depth.png" alt="" draggable="false"/>
  </div>;
}
export default memo(BowlScene);
