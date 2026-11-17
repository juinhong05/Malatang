import React, {useState,useEffect,useRef,useCallback,useMemo} from 'react';
import {createRoot} from 'react-dom/client';
import {INGREDIENTS,RATE,createOrder,summarize,evaluate,money} from './game';
import Art from './Art';
import BowlScene from './BowlScene';
import IngredientTransfer from './IngredientTransfer';
import './styles.css';
import './counter-update.css';
import './serving-motion.css';

function Icon({name,size=20,...props}) {
  const paths={bowl:<><path d="M3 11h18c0 6-4 9-9 9s-9-3-9-9Z"/><path d="M8 6c-2-2 2-2 0-4m5 4c-2-2 2-2 0-4m5 4c-2-2 2-2 0-4M8 22h8"/></>,scale:<><path d="M6 7h12l3 14H3L6 7Z"/><path d="M12 7V3M7 3h10m-8 9a4 4 0 0 1 6 0l-3 3Z"/></>,leaf:<><path d="M20 3C9 2 2 8 5 16c8 5 15-2 15-13Z"/><path d="m3 21 12-13"/></>,clock:<><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>,check:<path d="m5 12 4 4L19 6"/>,arrow:<path d="M4 12h16m-6-6 6 6-6 6"/>,sound:<><path d="m11 4-5 4H2v8h4l5 4V4Z"/><path d="M15 8q5 4 0 8m3-11q8 7 0 14"/></>,help:<><circle cx="12" cy="12" r="9"/><path d="M9 9a3 3 0 1 1 4 3l-1 1m0 3h.01"/></>,star:<path d="m12 2 3 6.5 7 1-5 5 1.2 7-6.2-3.4-6.2 3.4 1.2-7-5-5 7-1Z"/>,close:<path d="m6 6 12 12M6 18 18 6"/>,coin:<><ellipse cx="12" cy="7" rx="8" ry="4"/><path d="M4 7v5c0 5 16 5 16 0V7M4 12v5c0 5 16 5 16 0v-5"/></>};
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>{paths[name]||paths.bowl}</svg>;
}
function Modal({children,label,onClose}) {
  const ref=useRef(null);
  useEffect(()=>{const el=ref.current;const previous=document.activeElement;el.showModal();return ()=>{el.close();previous?.focus();};},[]);
  return <dialog ref={ref} className="modal" aria-label={label} onCancel={e=>{e.preventDefault();onClose?.();}} onClick={e=>{if(e.target===e.currentTarget)onClose?.();}}>{children}</dialog>;
}
function Counter({bowl,onAdd,disabled}) {
  const [category,setCategory]=useState('All ingredients');
  const [query,setQuery]=useState('');
  const [pageOffset,setPageOffset]=useState(0);
  const [pageSize,setPageSize]=useState(()=>window.matchMedia('(max-width: 850px)').matches?6:12);
  useEffect(()=>{
    const media=window.matchMedia('(max-width: 850px)');
    const resize=()=>setPageSize(media.matches?6:12);
    media.addEventListener('change',resize);
    return ()=>media.removeEventListener('change',resize);
  },[]);
  const setPage=n=>setPageOffset(n*pageSize);
  const categories=['All ingredients','Vegetables','Protein','Noodles','Extras'];
  const ingredients=INGREDIENTS.filter(i=>(category==='All ingredients'||i.category===category)&&i.name.toLowerCase().includes(query.trim().toLowerCase()));
  const pageCount=Math.max(1,Math.ceil(ingredients.length/pageSize));
  const currentPage=Math.min(Math.floor(pageOffset/pageSize),pageCount-1);
  const visibleIngredients=ingredients.slice(currentPage*pageSize,(currentPage+1)*pageSize);
  return <section className="counter" aria-label="Cold storage ingredient cabinet">
    <div className="counter-heading"><h2><Icon name="leaf" size={27}/> The fresh counter</h2><span className="rate"><Icon name="scale"/>{money(RATE)} <span>/ 100 g</span></span></div>
    <div className="tabs" role="group" aria-label="Filter ingredients">{categories.map(c=><button key={c} aria-pressed={category===c} className={category===c?'active':''} onClick={()=>{setCategory(c);setPage(0);}}>{c}</button>)}</div>
    <div className="counter-search"><input type="search" aria-label="Search ingredients" placeholder="Find your favourites…" value={query} onChange={e=>{setQuery(e.target.value);setPage(0);}}/><span aria-live="polite">{ingredients.length} / {INGREDIENTS.length}</span></div>
    <div className="cabinet"><div className="cabinet-light"/><div className="ingredients-page" id="ingredient-page" role="region" aria-label={`Ingredient page ${currentPage+1} of ${pageCount}`}><div className="ingredients">{visibleIngredients.map(i=><button className="tray" key={i.id} onClick={event=>onAdd(i.id,event.currentTarget)} disabled={disabled || (bowl[i.id]||0)>=12} aria-label={`Add ${i.name}`}><Art index={i.art}/>{bowl[i.id]>0&&<span className="tray-count">{bowl[i.id]} in bowl</span>}<span className="tray-label"><span>{i.name}</span><span className="plus">+</span></span></button>)}{pageCount>1&&Array.from({length:pageSize-visibleIngredients.length},(_,n)=><span key={`empty-${n}`} className="tray tray-placeholder" aria-hidden="true"/>)}</div>{!ingredients.length&&<p className="no-ingredients">No ingredients found. Try another search or category.</p>}</div>
      <nav className="cabinet-pagination" aria-label="Ingredient pages">
        <button className="page-arrow previous" aria-label="Previous ingredient page" aria-controls="ingredient-page" disabled={currentPage===0} onClick={()=>setPage(currentPage-1)}><Icon name="arrow" size={17}/></button>
        <div className="page-bars">{Array.from({length:pageCount},(_,n)=><button key={n} className="page-bar" aria-label={`Go to ingredient page ${n+1}`} aria-current={currentPage===n?'page':undefined} aria-controls="ingredient-page" title={`Page ${n+1}`} onClick={()=>setPage(n)}><span/></button>)}</div>
        <button className="page-arrow" aria-label="Next ingredient page" aria-controls="ingredient-page" disabled={currentPage===pageCount-1} onClick={()=>setPage(currentPage+1)}><Icon name="arrow" size={17}/></button>
      </nav>
    </div>
    <div className="counter-note"><span className="fresh-dot"/><span className="page-status" role="status">{ingredients.length?`Page ${currentPage+1} of ${pageCount} · ${currentPage*pageSize+1}–${Math.min((currentPage+1)*pageSize,ingredients.length)} of ${ingredients.length} ingredients`:'No matching ingredients'}</span><span>Tap a bar to change pages</span></div>
  </section>;
}
function OrderTicket({order,bowl,remaining,started}) {
  const pct=remaining/order.patience*100;
  return <section className="order-ticket" aria-label="Customer order"><span className="paperclip"/><div className="ticket-top"><span>CUSTOMER ORDER</span><span>NO. {String(order.round).padStart(3,'0')}</span></div><div className="guest"><Art index={order.guest.art}/><div><h2>{order.guest.name}</h2><p>“{order.guest.quote}”</p></div></div><div className="order-budget"><span><Icon name="coin"/> Budget</span><strong>{money(order.budget)}</strong></div><div className="acceptable"><span>Acceptable range</span><b>{money(order.budget-order.tolerance)} – {money(order.budget+order.tolerance)}</b></div><div className="must-haves"><div className="small-label">A LITTLE NON-NEGOTIABLE</div><div className="required">{order.required.map(id=>{const i=INGREDIENTS.find(x=>x.id===id);return <span className={bowl[id]?'met':''} key={id}><Art index={i.art}/>{i.name}{bowl[id]>0?<Icon name="check" size={15}/>:<span className="empty-check"/>}</span>;})}</div></div><div className="patience-label"><span><Icon name="clock" size={16}/> Patience</span><b>{!started?'Ready when you are':`${Math.ceil(remaining)}s`}</b></div><div className={`patience ${pct<25?'urgent':''}`} role="progressbar" aria-label="Customer patience" aria-valuenow={Math.ceil(pct)} aria-valuemin={0} aria-valuemax={100}><span style={{width:`${pct}%`}}/></div><p className="patience-note">{!started?'The clock starts with your first ingredient.':pct<25?'They’re getting hungry. Time to serve!':'A happy guest is a well-fed guest.'}</p></section>;
}
function Bowl({bowl,onRemove,onClear,onServe,disabled,weighing,pendingKeys,sceneRef}) {
  const {items,portions}=summarize(bowl);
  return <section className="bowl-section"><div className="bowl-heading"><h2>Your bowl</h2><span>{portions} {portions===1?'portion':'portions'}<button className="text-button" onClick={onClear} disabled={!portions||disabled}>Clear</button></span></div>
    <div className={`bowl-stage ${weighing?'weighing':''}`}><BowlScene bowl={bowl} pendingKeys={pendingKeys} sceneRef={sceneRef}/></div>
    {portions?<div className="bowl-items" aria-label="Selected ingredients">{items.map(i=><button onClick={()=>onRemove(i.id)} disabled={disabled} key={i.id} aria-label={`Remove one ${i.name}`}>{i.name} <b>×{i.quantity}</b><span>−</span></button>)}</div>:<p className="bowl-empty">Good things start with an empty bowl.</p>}<button className="serve-button" disabled={!portions||disabled} onClick={onServe}><Icon name="scale" size={23}/>{weighing?'Weighing your bowl…':'Weigh & serve'}{!weighing&&<Icon name="arrow"/>}</button><p className="bowl-hint">Trust your instincts. The scale reveals all.</p></section>;
}
function Receipt({order,result,onNext}) {
  return <Modal label="Your round receipt"><div className="receipt"><div className="receipt-brand"><Icon name="bowl" size={28}/> Mala Mama</div><p className="receipt-sub">A LITTLE SPICE. A LOT OF LOVE.</p><div className="receipt-title"><h2>{result.expired?'Time’s up!':result.stars===3?'A perfect bowl!':result.stars===2?'Nicely done!':result.stars===1?'Getting warmer!':'Room to grow!'}</h2><p>Guest {String(order.round).padStart(2,'0')} · {order.guest.name}</p></div><div className="receipt-items"><div className="receipt-table-head"><span>INGREDIENT</span><span>WEIGHT</span><span>PRICE</span></div>{result.items.map(i=><div className="receipt-row" key={i.id}><span>{i.name} <small>×{i.quantity}</small></span><span>{i.weight} g</span><span>{money(i.weight*RATE/100)}</span></div>)}{!result.items.length&&<p>No ingredients selected.</p>}</div><div className="receipt-totals"><div><span>Total weight</span><b>{result.weight} g</b></div><div><span>Total price</span><strong>{money(result.price)}</strong></div></div><div className="receipt-details"><div><span>Customer budget</span><b>{money(order.budget)}</b></div><div><span>Acceptable range</span><b>{money(order.budget-order.tolerance)} – {money(order.budget+order.tolerance)}</b></div><div><span>Perfect weight</span><b>{result.target} g</b></div><div><span>Weight difference</span><b className={result.inRange?'green':'orange'}>{result.difference===0?'Spot on!':`${result.difference>0?'+':''}${result.difference} g (${result.difference>0?'over':'under'})`}</b></div></div><div className="stars" aria-label={`${result.stars} out of 3 stars`}>{[1,2,3].map(s=><Icon name="star" size={38} key={s} className={s<=result.stars?'earned':''}/>)}</div><div className="scores">{[['scale','Weight',result.weightScore],['clock','Speed',result.speed],['check','Order',result.accuracy]].map(([icon,label,value])=><div key={label}><Icon name={icon}/><span>{label}</span><b>{value}%</b></div>)}</div><p className="score-note">{result.expired?'Your guest ran out of patience. No stars or tip this round.':!result.inRange?'A little outside their budget range. Try adjusting your portions.':result.accuracy<100?'A favourite was missing. Check every must-have next time.':result.stars===3?'Just right, right on time. Your guest loved it!':'All their favourites, within budget. A quicker bowl earns more!'}</p><div className="tip"><span>♥ Customer tip</span><strong>{money(result.tip)}</strong></div><button className="serve-button" onClick={onNext}>Next guest<Icon name="arrow"/></button><p className="receipt-thanks">Thank you for cooking with heart.</p></div></Modal>;
}
function Help({onClose}) {return <Modal label="How to play" onClose={onClose}><div className="help"><button className="close-button" onClick={onClose} aria-label="Close instructions"><Icon name="close"/></button><Icon name="bowl" size={42}/><h2>A little bowl of know-how.</h2><ol><li><b>Read the room.</b> Check your guest’s budget, acceptable range, and must-have ingredients.</li><li><b>Pick your ingredients.</b> Tap a tray to add one portion. Tap an ingredient in your bowl to remove one. Your first pick starts the clock.</li><li><b>Trust your instincts.</b> Everything costs RM 3.00 per 100 g. Portion weights stay hidden until you serve. Learn them from your receipts!</li><li><b>Weigh & serve.</b> Your receipt reveals the total and your ideal weight: budget ÷ 3 × 100.</li></ol><div className="help-scoring"><h3>Make it a three-star bowl</h3><p>Weight accuracy contributes 50%, remaining patience 20%, and must-have completion 30%. Get 90% overall, include every must-have, and stay in range for 3 stars. 65% earns 2; 35% earns 1. An empty bowl or expired patience earns 0.</p><p>Weight accuracy is 100% minus your percentage distance from the target. Tips scale with your score: up to 20% for 3 stars, 10% for 2, and 5% for 1.</p></div><button className="serve-button" onClick={onClose}>Let’s get cooking<Icon name="arrow"/></button></div></Modal>;}
function readStats(){try{return JSON.parse(localStorage.getItem('mala-mama-stats-v1'))||{guests:0,tips:0};}catch{return {guests:0,tips:0};}}
function App(){
  const [order,setOrder]=useState(()=>createOrder(1));const [bowl,setBowl]=useState({});const [remaining,setRemaining]=useState(order.patience);const [started,setStarted]=useState(false);const [phase,setPhase]=useState('picking');const [result,setResult]=useState(null);const [help,setHelp]=useState(false);const [sound,setSound]=useState(true);const [stats,setStats]=useState(readStats);const deadline=useRef(0);const finishing=useRef(false);const revealTimer=useRef(null);const audio=useRef(null);
  const [transfers,setTransfers]=useState([]);
  const [dockVisible,setDockVisible]=useState(false);
  const bowlRef=useRef(bowl),sceneRef=useRef(null),dockRef=useRef(null),transferId=useRef(0);
  const pendingKeys=useMemo(()=>transfers.map(t=>t.key),[transfers]);
  const completeTransfer=useCallback(token=>setTransfers(current=>current.filter(t=>t.token!==token)),[]);
  function updateBowl(nextBowl){bowlRef.current=nextBowl;setBowl(nextBowl);}
  function remove(id){
    const quantity=bowlRef.current[id]||0;
    if(!quantity||phase!=='picking')return;
    setTransfers(current=>current.filter(t=>t.key!==`${id}-${quantity-1}`));
    updateBowl({...bowlRef.current,[id]:quantity-1});
  }
  function clearBowl(){setTransfers([]);updateBowl({});}
  useEffect(()=>{
    const update=()=>{
      const rect=sceneRef.current?.getBoundingClientRect();
      const center=rect?rect.top+rect.height*.51:0;
      setDockVisible(started&&phase==='picking'&&!help&&(center<70||center>innerHeight-70));
    };
    update();
    window.addEventListener('scroll',update,{passive:true});window.addEventListener('resize',update);
    return ()=>{window.removeEventListener('scroll',update);window.removeEventListener('resize',update);};
  },[started,phase,help,bowl]);
  function chime(frequency=500){if(!sound)return;try{audio.current ||= new (window.AudioContext||window.webkitAudioContext)();const ctx=audio.current;ctx.resume();const osc=ctx.createOscillator(),gain=ctx.createGain();osc.connect(gain);gain.connect(ctx.destination);osc.frequency.value=frequency;osc.type='sine';gain.gain.setValueAtTime(.045,ctx.currentTime);gain.gain.exponentialRampToValueAtTime(.001,ctx.currentTime+.15);osc.start();osc.stop(ctx.currentTime+.15);}catch{}}
  function finish(expired=false){if(finishing.current||phase!=='picking')return;finishing.current=true;setTransfers([]);const time=expired?0:Math.max(0,(deadline.current-Date.now())/1000);const r=evaluate(order,bowlRef.current,time,expired);setRemaining(time);setPhase('weighing');chime(350);revealTimer.current=setTimeout(()=>{setResult(r);setPhase('receipt');setStats(s=>{const n={guests:s.guests+1,tips:Math.round((s.tips+r.tip)*100)/100};try{localStorage.setItem('mala-mama-stats-v1',JSON.stringify(n));}catch{}return n;});},850);}
  useEffect(()=>{if(!started||phase!=='picking'||help)return;const tick=()=>{const left=Math.max(0,(deadline.current-Date.now())/1000);setRemaining(left);if(left<=0)finish(true);};const timer=setInterval(tick,100);return ()=>clearInterval(timer);},[started,phase,help,order,bowl]);
  useEffect(()=>()=>clearTimeout(revealTimer.current),[]);
  function add(id,tray){
    if(phase!=='picking'||finishing.current)return;
    if(started&&Date.now()>=deadline.current){finish(true);return;}
    const quantity=bowlRef.current[id]||0;
    if(quantity>=12)return;
    if(!started){deadline.current=Date.now()+order.patience*1000;setStarted(true);}
    updateBowl({...bowlRef.current,[id]:quantity+1});
    if(!window.matchMedia('(prefers-reduced-motion: reduce)').matches&&tray){
      const rect=(tray.querySelector('.art')||tray).getBoundingClientRect();
      const item=INGREDIENTS.find(i=>i.id===id);
      const token=++transferId.current;
      setTransfers(current=>[...current,{...item,key:`${id}-${quantity}`,token,source:{x:rect.left+rect.width*.5+scrollX,y:rect.top+rect.height*.45+scrollY}}]);
    }
    chime(460+Math.random()*180);
  }
  function next(){const o=createOrder(order.round+1);setOrder(o);clearBowl();setRemaining(o.patience);setStarted(false);setResult(null);setPhase('picking');finishing.current=false;window.scrollTo({top:0,behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});}
  function toggleHelp(open){if(open){setTransfers([]);if(started&&phase==='picking')setRemaining(Math.max(0,(deadline.current-Date.now())/1000));}if(!open&&started&&phase==='picking')deadline.current=Date.now()+remaining*1000;setHelp(open);}
  return <><header className="site-header"><a className="brand" href="/" aria-label="Mala Mama home"><Icon name="bowl" size={37}/>Mala Mama<span>麻辣妈妈</span></a><nav><button onClick={()=>toggleHelp(true)}><Icon name="help"/>How to play</button><span className="nav-divider"/><button onClick={()=>setSound(s=>!s)} aria-pressed={sound} aria-label={`Sound ${sound?'on':'off'}`}><Icon name="sound"/><span>Sound {sound?'on':'off'}</span></button></nav></header><main><section className="intro"><div><h1>A little spice.<br className="mobile-break"/> A lot of instinct<span>.</span></h1><p>Build their perfect bowl. Keep an eye on the budget.</p></div><div className="shift-stats"><span>YOUR LITTLE NOODLE SHOP</span><div><b>{stats.guests}</b> guests served <i/> <b>{money(stats.tips)}</b> in tips</div></div></section><div className="game-layout"><Counter bowl={bowl} onAdd={add} disabled={phase!=='picking'}/><aside><OrderTicket order={order} bowl={bowl} remaining={remaining} started={started}/><Bowl bowl={bowl} onRemove={remove} onClear={clearBowl} pendingKeys={pendingKeys} sceneRef={sceneRef} onServe={()=>finish(started&&Date.now()>=deadline.current)} disabled={phase!=='picking'} weighing={phase==='weighing'}/></aside></div><footer className="game-footer"><span><Icon name="leaf"/>Pick a little of what they love.</span><span><Icon name="scale"/>Weigh it. Serve it. Make their day.</span><span><Icon name="star"/>Three stars. One perfect bowl.</span></footer></main><div className="bottom-line"><span>Made with a little heat & a lot of heart.</span><span>MALA MAMA · THE BOWL-BUILDING GAME</span></div><div className="sr-only" aria-live="polite">{phase==='weighing'?'Weighing your bowl':`${summarize(bowl).portions} portions in your bowl`}</div><button className="bowl-dock" hidden={!dockVisible} aria-label="View your bowl" onClick={()=>sceneRef.current?.scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'center'})}><BowlScene bowl={bowl} pendingKeys={pendingKeys} sceneRef={dockRef} compact/><span>Your bowl · {summarize(bowl).portions} portions</span></button>{transfers[0]&&<IngredientTransfer key={transfers[0].token} transfer={transfers[0]} mainRef={sceneRef} dockRef={dockRef} onComplete={completeTransfer} queued={transfers.length}/>} {help&&<Help onClose={()=>toggleHelp(false)}/>} {result&&<Receipt order={order} result={result} onNext={next}/>}</>;
}
createRoot(document.getElementById('root')).render(<App/>);
