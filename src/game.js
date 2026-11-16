export const RATE = 3;
export const INGREDIENTS = [
  {id:'bok',name:'Bok choy',category:'Vegetables',grams:40,art:0},
  {id:'broccoli',name:'Broccoli',category:'Vegetables',grams:50,art:1},
  {id:'shiitake',name:'Shiitake',category:'Vegetables',grams:30,art:2},
  {id:'lotus',name:'Lotus root',category:'Vegetables',grams:40,art:3},
  {id:'beef',name:'Beef rolls',category:'Protein',grams:60,art:4},
  {id:'shrimp',name:'Shrimp',category:'Protein',grams:40,art:5},
  {id:'fish',name:'Fish balls',category:'Protein',grams:50,art:6},
  {id:'tofu',name:'Tofu',category:'Protein',grams:40,art:7},
  {id:'udon',name:'Udon',category:'Noodles',grams:100,art:8},
  {id:'glass',name:'Glass noodles',category:'Noodles',grams:80,art:9},
  {id:'corn',name:'Corn',category:'Extras',grams:60,art:10},
  {id:'eggs',name:'Quail eggs',category:'Extras',grams:30,art:11},
];
export const GUESTS = [
  {name:'Lily',art:13,quote:'A little crunch and something cozy, please!'},
  {name:'Kai',art:14,quote:'A big bowl after a long day. Make it a good one!'},
  {name:'Auntie Mei',art:15,quote:'A lovely mix of fresh things, dear.'},
  {name:'Jun',art:14,quote:'My lunch break is short, but my appetite isn’t!'},
  {name:'Amira',art:13,quote:'Surprise me, but don’t forget my favourites.'},
];
export const money = n => `RM ${n.toFixed(2)}`;
export function createOrder(round, random = Math.random) {
  const budget = [12,15,18,21,24][Math.floor(random()*5)];
  const pool = [...INGREDIENTS];
  const required = [];
  const count = round > 3 ? 3 : 2;
  for (let i=0;i<count;i++) required.push(pool.splice(Math.floor(random()*pool.length),1)[0].id);
  return {round,guest:GUESTS[(round-1)%GUESTS.length],budget,tolerance:1.5,required,patience:Math.max(50,100-(round-1)*5)};
}
export function summarize(bowl) {
  const items = INGREDIENTS.filter(i => bowl[i.id]>0).map(i=>({...i,quantity:bowl[i.id],weight:i.grams*bowl[i.id]}));
  const weight = items.reduce((n,i)=>n+i.weight,0);
  return {items,weight,price:Math.round(weight*RATE)/100,portions:items.reduce((n,i)=>n+i.quantity,0)};
}
export function evaluate(order,bowl,secondsLeft,expired=false) {
  const totals=summarize(bowl);
  const target=order.budget/RATE*100;
  const difference=totals.weight-target;
  const weight=Math.max(0,Math.round(100-Math.abs(difference)/target*100));
  const speed=Math.max(0,Math.min(100,Math.round(secondsLeft/order.patience*100)));
  const matched=order.required.filter(id=>bowl[id]>0).length;
  const accuracy=Math.round(matched/order.required.length*100);
  const inRange=Math.abs(totals.price-order.budget)<=order.tolerance+0.001;
  const score=Math.round(weight*0.5+speed*0.2+accuracy*0.3);
  let stars=score>=90?3:score>=65?2:score>=35?1:0;
  if(!inRange || accuracy<100) stars=Math.min(stars,2);
  if(expired || !totals.portions) stars=0;
  const tip=stars===0?0:Math.round(totals.price*(stars===3?0.2:stars===2?0.1:0.05)*score)/100;
  return {...totals,target,difference,weightScore:weight,speed,accuracy,score,stars,tip,inRange,expired,secondsUsed:order.patience-secondsLeft};
}
