import React, {useEffect,useRef} from 'react';
import {createPortal} from 'react-dom';
import Art from './Art';
import {portionPlacement} from './bowl-layout';

const clamp=(value,min,max)=>Math.min(max,Math.max(min,value));
const ease=t=>t*t*(3-2*t);
const lerp=(a,b,t)=>a+(b-a)*t;
const curve=(a,b,c,d,t)=>((1-t)**3*a)+3*(1-t)**2*t*b+3*(1-t)*t*t*c+t**3*d;

export default function IngredientTransfer({transfer,mainRef,dockRef,onComplete,queued}){
  const root=useRef(null),food=useRef(null),leftStick=useRef(null),rightStick=useRef(null);
  const durationRef=useRef(queued>2?720:1100);
  useEffect(()=>{
    let frame;
    let start;
    const duration=durationRef.current;
    const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
    const placement=portionPlacement(transfer);
    const tick=now=>{
      if(start===undefined)start=now;
      const p=Math.min(1,(now-start)/duration);
      if(reduced.matches||p>=1){onComplete(transfer.token);return;}
      const main=mainRef.current?.getBoundingClientRect();
      const mainY=main?main.top+main.height*placement.y/100:Infinity;
      const target=main&&mainY>50&&mainY<innerHeight-30?main:dockRef.current?.getBoundingClientRect();
      if(!target?.width){frame=requestAnimationFrame(tick);return;}
      const sx=clamp(transfer.source.x-scrollX,25,innerWidth-25);
      const sy=clamp(transfer.source.y-scrollY,45,innerHeight-35);
      const dx=target.left+target.width*placement.x/100;
      const dy=target.top+target.height*placement.y/100;
      const travel=ease(clamp((p-.25)/.57,0,1));
      const lift=Math.min(100,Math.abs(dx-sx)*.12+55);
      const x=curve(sx,sx,dx,dx,travel);
      const y=curve(sy,Math.max(24,sy-lift),Math.max(24,dy-lift),dy,travel);
      const grip=ease(clamp((p-.08)/.13,0,1))*(1-ease(clamp((p-.81)/.12,0,1)));
      const retreat=ease(clamp((p-.9)/.1,0,1));
      root.current.style.transform=`translate3d(${x}px,${y-retreat*50}px,0)`;
      root.current.style.opacity=String(p<.08?p/.08:1-retreat);
      root.current.dataset.phase=p<.25?'grip':p<.81?'carry':'release';
      const foodSize=lerp(82,target.width*placement.width/100,travel);
      food.current.style.width=`${foodSize}px`;
      food.current.style.opacity=p<.18?'0':String(1-ease(clamp((p-.86)/.04,0,1)));
      food.current.style.transform=`translate(-50%,-50%) rotate(${lerp(-12,placement.rotation,travel)}deg) scaleY(${lerp(1,.82,travel)})`;
      const separation=lerp(29,foodSize*.18,grip);
      leftStick.current.style.transform=`translateX(${-separation}px) rotate(${lerp(12,24,grip)}deg)`;
      rightStick.current.style.transform=`translateX(${separation}px) rotate(${lerp(46,32,grip)}deg)`;
      frame=requestAnimationFrame(tick);
    };
    frame=requestAnimationFrame(tick);
    return ()=>cancelAnimationFrame(frame);
  },[transfer,mainRef,dockRef,onComplete]);
  return createPortal(<div ref={root} className="ingredient-transfer" aria-hidden="true" data-ingredient={transfer.id}>
    <div className="carried-food" ref={food}><Art index={transfer.art}/></div>
    <img ref={leftStick} className="moving-chopstick" src="/art/chopstick.png" alt=""/>
    <img ref={rightStick} className="moving-chopstick" src="/art/chopstick.png" alt=""/>
  </div>,document.body);
}
