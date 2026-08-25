(() => {
 const base='/.netlify/functions/official-source-image';
 const O={};
 const nokDims={50:'126 × 70 mm',100:'133 × 70 mm',200:'140 × 70 mm',500:'147 × 70 mm',1000:'154 × 70 mm'};
 [50,100,200,500,1000].forEach(v=>O[`NOK:${v}`]={front:`${base}?source=norges&value=${v}&side=front`,back:`${base}?source=norges&value=${v}&side=back`,dimensions:nokDims[v],imageStatus:'official-reproduction',imageSource:'Norges Bank · Series VIII',imageSourceUrl:'https://www.norges-bank.no/en/topics/notes-and-coins/legal-tender-notes-coins/'});
 const nzdDims={5:'135 × 66 mm',10:'140 × 68 mm',20:'145 × 70 mm',50:'150 × 72 mm',100:'155 × 74 mm'};
 [5,10,20,50,100].forEach(v=>O[`NZD:${v}`]={front:`${base}?source=rbnz&value=${v}&side=front`,back:`${base}?source=rbnz&value=${v}&side=back`,dimensions:nzdDims[v],imageStatus:'official-reproduction',imageSource:'Reserve Bank of New Zealand · Series 7',imageSourceUrl:`https://www.rbnz.govt.nz/money-and-cash/banknotes-and-coins/banknotes-in-circulation/${v}-banknote`});
 const nativeFetch=window.fetch.bind(window);
 window.fetch=async(...args)=>{const req=args[0],url=typeof req==='string'?req:req?.url||'';const response=await nativeFetch(...args);if(!url.includes('/data/notes.json'))return response;const notes=await response.clone().json();for(const [k,cfg] of Object.entries(O)){const [currency,value]=k.split(':');let n=notes.find(x=>x.currency===currency&&Number(x.value)===Number(value));if(!n){n={currency,value:Number(value),status:'circulating',statusLabel:'Em circulação',material:currency==='NZD'?'Polímero':'Papel de algodão',source:cfg.imageSource};notes.push(n)}Object.assign(n,cfg)}return new Response(JSON.stringify(notes),{status:response.status,statusText:response.statusText,headers:{'Content-Type':'application/json; charset=utf-8'}})};
})();
