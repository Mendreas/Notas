(() => {
 const ph=(c,v)=>'data:image/svg+xml;charset=UTF-8,'+encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 320"><rect width="720" height="320" rx="18" fill="#0c1824"/><text x="360" y="145" text-anchor="middle" fill="#d7e2ea" font-family="Arial" font-size="42" font-weight="700">${c} ${v}</text><text x="360" y="190" text-anchor="middle" fill="#90a1ae" font-family="Arial" font-size="22">IMAGEM EM PREPARAÇÃO</text></svg>`);
 const countries=[
 {id:'KAZ',name:'Cazaquistão',flag:'🇰🇿',continent:'Asia',currency:'KZT',capital:'Astana',language:'Cazaque / Russo'},
 {id:'KGZ',name:'Quirguistão',flag:'🇰🇬',continent:'Asia',currency:'KGS',capital:'Bisqueque',language:'Quirguiz / Russo'},
 {id:'TJK',name:'Tajiquistão',flag:'🇹🇯',continent:'Asia',currency:'TJS',capital:'Duchambé',language:'Tajique'},
 {id:'TKM',name:'Turquemenistão',flag:'🇹🇲',continent:'Asia',currency:'TMT',capital:'Asgabate',language:'Turcomeno'},
 {id:'UZB',name:'Uzbequistão',flag:'🇺🇿',continent:'Asia',currency:'UZS',capital:'Tashkent',language:'Uzbeque'}];
 const cfg={
 KZT:{name:'Tenge cazaque',symbol:'₸',notes:[500,1000,2000,5000,10000,20000],countries:['KAZ'],source:'National Bank of Kazakhstan'},
 KGS:{name:'Som quirguiz',symbol:'с',notes:[20,50,100,200,500,1000,5000],countries:['KGZ'],source:'National Bank of the Kyrgyz Republic'},
 TJS:{name:'Somoni tajique',symbol:'SM',notes:[10,20,50,100,200,500],countries:['TJK'],source:'National Bank of Tajikistan'},
 TMT:{name:'Manat turcomeno',symbol:'m',notes:[1,5,10,20,50,100],countries:['TKM'],source:'Central Bank of Turkmenistan'},
 UZS:{name:'Som uzbeque',symbol:'soʻm',notes:[1000,5000,10000,20000,50000,100000,200000],countries:['UZB'],source:'Central Bank of Uzbekistan'}};
 const prev=window.fetch.bind(window);window.fetch=async(...a)=>{const r=await prev(...a),u=typeof a[0]==='string'?a[0]:a[0]?.url||'';
 if(u.includes('/data/countries.json')){const d=await r.clone().json();countries.forEach(c=>{const x=d.find(y=>y.id===c.id);x?Object.assign(x,c):d.push(c)});return new Response(JSON.stringify(d),{headers:{'Content-Type':'application/json'}})}
 if(u.includes('/data/currencies.json')){const d=await r.clone().json();Object.entries(cfg).forEach(([k,c])=>d[k]=Object.assign(d[k]||{},{...c,group:c.countries[0],rate:0,material:'Papel',focus:false}));return new Response(JSON.stringify(d),{headers:{'Content-Type':'application/json'}})}
 if(u.includes('/data/notes.json')){const d=await r.clone().json();Object.entries(cfg).forEach(([k,c])=>c.notes.forEach(v=>{let n=d.find(x=>x.currency===k&&Number(x.value)===v);if(!n){n={currency:k,value:v};d.push(n)}Object.assign(n,{front:ph(k,v),back:ph(k,v),status:'circulating',statusLabel:'Em circulação',source:c.source,imageStatus:'official-link'})}));return new Response(JSON.stringify(d),{headers:{'Content-Type':'application/json'}})}return r};
})();