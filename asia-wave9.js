(() => {
 const ph=(c,v)=>'data:image/svg+xml;charset=UTF-8,'+encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 320"><rect width="720" height="320" rx="18" fill="#0c1824"/><text x="360" y="145" text-anchor="middle" fill="#d7e2ea" font-family="Arial" font-size="42" font-weight="700">${c} ${v}</text><text x="360" y="190" text-anchor="middle" fill="#90a1ae" font-family="Arial" font-size="22">IMAGEM EM PREPARAÇÃO</text></svg>`);
 const countries=[
 {id:'AFG',name:'Afeganistão',flag:'🇦🇫',continent:'Asia',currency:'AFN',capital:'Cabul',language:'Dari / Pashto'},
 {id:'BTN',name:'Butão',flag:'🇧🇹',continent:'Asia',currency:'BTN',capital:'Thimphu',language:'Dzonga'},
 {id:'MDV',name:'Maldivas',flag:'🇲🇻',continent:'Asia',currency:'MVR',capital:'Malé',language:'Divehi'}];
 const cfg={
 AFN:{name:'Afegani afegão',symbol:'؋',notes:[10,20,50,100,500,1000],countries:['AFG'],source:'Da Afghanistan Bank'},
 BTN:{name:'Ngultrum butanês',symbol:'Nu.',notes:[5,10,20,50,100,500,1000],countries:['BTN'],source:'Royal Monetary Authority of Bhutan'},
 MVR:{name:'Rufiyaa maldiva',symbol:'Rf',notes:[5,10,20,50,100,500,1000],countries:['MDV'],source:'Maldives Monetary Authority'}};
 const prev=window.fetch.bind(window);window.fetch=async(...a)=>{const r=await prev(...a),u=typeof a[0]==='string'?a[0]:a[0]?.url||'';
 if(u.includes('/data/countries.json')){const d=await r.clone().json();countries.forEach(c=>{const x=d.find(y=>y.id===c.id);x?Object.assign(x,c):d.push(c)});return new Response(JSON.stringify(d),{headers:{'Content-Type':'application/json'}})}
 if(u.includes('/data/currencies.json')){const d=await r.clone().json();Object.entries(cfg).forEach(([k,c])=>d[k]=Object.assign(d[k]||{},{...c,group:c.countries[0],rate:0,material:k==='MVR'?'Polímero':'Papel',focus:false}));return new Response(JSON.stringify(d),{headers:{'Content-Type':'application/json'}})}
 if(u.includes('/data/notes.json')){const d=await r.clone().json();Object.entries(cfg).forEach(([k,c])=>c.notes.forEach(v=>{let n=d.find(x=>x.currency===k&&Number(x.value)===v);if(!n){n={currency:k,value:v};d.push(n)}Object.assign(n,{front:ph(k,v),back:ph(k,v),status:'circulating',statusLabel:'Em circulação',source:c.source,imageStatus:'official-link'})}));return new Response(JSON.stringify(d),{headers:{'Content-Type':'application/json'}})}return r};
})();