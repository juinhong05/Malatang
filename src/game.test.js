import test from 'node:test';
import assert from 'node:assert/strict';
import {createOrder,evaluate,summarize,bowlPortions,INGREDIENTS} from './game.js';
test('every random order has distinct, achievable required ingredients',()=>{for(let round=1;round<100;round++){const o=createOrder(round);assert.equal(new Set(o.required).size,o.required.length);const mandatory=o.required.reduce((n,id)=>n+INGREDIENTS.find(i=>i.id===id).grams,0);assert.ok(mandatory<=o.budget/3*100);assert.ok(o.patience>=50);}});
const order={budget:18,tolerance:1.5,required:['bok','tofu'],patience:100};
test('exact, fast, complete order earns three stars and correct tip',()=>{const r=evaluate(order,{bok:5,tofu:5,udon:2},100);assert.equal(r.weight,600);assert.equal(r.price,18);assert.equal(r.difference,0);assert.equal(r.stars,3);assert.equal(r.tip,3.6);assert.equal(r.accuracy,100);});
test('missing requirements and outside range cannot earn three stars',()=>{assert.ok(evaluate(order,{udon:6},100).stars<=2);assert.ok(evaluate(order,{bok:5,tofu:5,udon:3},100).stars<=2);});
test('expired patience earns no stars or tip even with perfect ingredients',()=>{const r=evaluate(order,{bok:5,tofu:5,udon:2},0,true);assert.equal(r.stars,0);assert.equal(r.tip,0);assert.equal(r.speed,0);});
test('empty bowls score zero and removed portions are excluded',()=>{assert.equal(evaluate(order,{},100).stars,0);assert.deepEqual(summarize({bok:0}),{items:[],weight:0,price:0,portions:0});});
test('acceptable range is inclusive and target and deviation are exact',()=>{const r=evaluate(order,{bok:5,tofu:5,udon:2,broccoli:1},80);assert.equal(r.price,19.5);assert.equal(r.inRange,true);assert.equal(r.target,600);assert.equal(r.difference,50);assert.equal(r.speed,80);});
test('each selected portion has its own stable visual identity, beyond seven types',()=>{
  const bowl=Object.fromEntries(INGREDIENTS.map(i=>[i.id,1]));bowl.tofu=3;
  const pieces=bowlPortions(bowl);
  assert.equal(pieces.length,47);
  assert.equal(new Set(pieces.map(p=>p.key)).size,47);
  assert.equal(pieces.filter(p=>p.id==='tofu').length,3);
  const remaining=bowlPortions({...bowl,tofu:2});
  assert.equal(remaining.length,46);
  assert.deepEqual(remaining.filter(p=>p.id==='tofu').map(p=>p.key),['tofu-0','tofu-1']);
  assert.deepEqual(bowlPortions({tofu:0}),[]);
});
test('expanded catalogue participates in weights, prices and order completion',()=>{
  assert.equal(INGREDIENTS.length,45);
  assert.equal(new Set(INGREDIENTS.map(i=>i.id)).size,45);
  for(const item of INGREDIENTS){
    const r=evaluate({...order,required:[item.id]},{[item.id]:3},100);
    assert.equal(r.weight,item.grams*3);
    assert.equal(r.price,Math.round(item.grams*9)/100);
    assert.equal(r.accuracy,100);
  }
});
