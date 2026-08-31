(() => {
 const ph=(c,v)=>'data:image/svg+xml;charset=UTF-8,'+encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 320"><rect width="720" height="320" rx="18" fill="#0c1824"/><text x="360" y="145" text-anchor="middle" fill="#d7e2ea" font-family="Arial" font-size="42" font-weight="700">${c} ${v}</text><text x="360" y="190" text-anchor="middle" fill="#90a1ae" font-family="Arial" font-size="22">IMAGEM EM PREPARAÇÃO</text></svg>`);
 const countries=[
 {id:'SYR',name:'Síria',flag:'🇸🇾',continent:'Asia',currency:'SYP',capital:'Damasco',language:'Árabe'},
 {id:'YEM',name:'Iémen',flag:'🇾🇪',continent:'Asia',currency:'YER',capital:'Saná',language:'Árabe'},
 {id:'PRK',name:'Coreia do Norte',flag:'🇰🇵',continent:'Asia',currency:'KPW',capital:'Pyongyang',language:'Coreano'},
 {id:'PSE',name:'Palestina',flag:'🇵🇸',continent:'Asia',currency:'ILS',capital:'Jerusalém Oriental / Ramallah',language:'Árabe',currencyNote:'Não existe atualmente uma moeda palestiniana própria em circulação. Usam-se sobretudo o novo shekel israelita (ILS), o dinar jordano (JOD) e, em menor escala, o dólar dos EUA (USD).'}];
 const cfg={
 SYP:{name:'Libra síria',symbol:'£S',notes:[50,100,200,500,1000,2000,5000],countries:['SYR'],source:'Central Bank of Syria'},
 YER:{name:'Rial iemenita',symbol:'﷼',notes:[100,200,250,500,1000],countries:['YEM'],source:'Central Bank of Yemen'},
 KPW:{name:'Won norte-coreano',symbol:'₩',notes:[5,10,50,100,200,500,1000,2000,5000],countries:['PRK'],source:'Central Bank of the Democratic People’s Republic of Korea'}};
 const prev=window.fetch.bind(window);window.fetch=async(...a)=>{const r=await prev(...a),u=typeof a[0]==='string'?a[0]:a[0]?.url||'';
 if(u.includes('/data/countries.json')){const d=await r.clone().json();countries.forEach(c=>{const x=d.find(y=>y.id===c.id);x?Object.assign(x,c):d.push(c)});return new Response(JSON.stringify(d),{headers:{'Content-Type':'application/json'}})}
 if(u.includes('/data/currencies.json')){const d=await r.clone().json();Object.entries(cfg).forEach(([k,c])=>d[k]=Object.assign(d[k]||{},{...c,group:c.countries[0],rate:0,material:'Papel',focus:false}));if(d.ILS){const cur=Array.isArray(d.ILS.countries)?d.ILS.countries:[];d.ILS.countries=[...new Set([...cur,'ISR','PSE'])];}return new Response(JSON.stringify(d),{headers:{'Content-Type':'application/json'}})}
 if(u.includes('/data/notes.json')){const d=await r.clone().json();Object.entries(cfg).forEach(([k,c])=>c.notes.forEach(v=>{let n=d.find(x=>x.currency===k&&Number(x.value)===v);if(!n){n={currency:k,value:v};d.push(n)}Object.assign(n,{front:ph(k,v),back:ph(k,v),status:'circulating',statusLabel:'Em circulação',source:c.source,imageStatus:'official-link'})}));return new Response(JSON.stringify(d),{headers:{'Content-Type':'application/json'}})}return r};
})();