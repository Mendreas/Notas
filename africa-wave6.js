// Africa wave 6 — Quénia, Nigéria, Tunísia, Argélia e Egito
(()=>{
 const defs=[
  {id:'KEN',name:'Quénia',flag:'🇰🇪',continent:'Africa',currency:'KES',capital:'Nairobi',population:'≈ 57 milhões',language:'Suaíli / Inglês',history:[['1966–hoje','Xelim queniano (KES)']]},
  {id:'NGA',name:'Nigéria',flag:'🇳🇬',continent:'Africa',currency:'NGN',capital:'Abuja',population:'≈ 238 milhões',language:'Inglês',history:[['1958–1973','Libra nigeriana'],['1973–hoje','Naira nigeriana (NGN)']]},
  {id:'TUN',name:'Tunísia',flag:'🇹🇳',continent:'Africa',currency:'TND',capital:'Tunes',population:'≈ 12,4 milhões',language:'Árabe',history:[['1958–hoje','Dinar tunisino (TND)']]},
  {id:'DZA',name:'Argélia',flag:'🇩🇿',continent:'Africa',currency:'DZD',capital:'Argel',population:'≈ 47 milhões',language:'Árabe / Tamazight',history:[['1964–hoje','Dinar argelino (DZD)']]},
  {id:'EGY',name:'Egito',flag:'🇪🇬',continent:'Africa',currency:'EGP',capital:'Cairo',population:'≈ 118 milhões',language:'Árabe',history:[['1834–hoje','Libra egípcia; emitida pelo Banco Central do Egito desde 1961']]}
 ];
 const currencies={
  KES:{name:'Xelim queniano',symbol:'KSh',group:'Quénia',source:'Central Bank of Kenya',material:'Papel',notes:[50,100,200,500,1000],countries:['KEN'],focus:false},
  NGN:{name:'Naira nigeriana',symbol:'₦',group:'Nigéria',source:'Central Bank of Nigeria',material:'Papel / polímero',notes:[5,10,20,50,100,200,500,1000],countries:['NGA'],focus:false},
  TND:{name:'Dinar tunisino',symbol:'DT',group:'Tunísia',source:'Banque Centrale de Tunisie',material:'Papel',notes:[5,10,20,50],countries:['TUN'],focus:false},
  DZD:{name:'Dinar argelino',symbol:'DA',group:'Argélia',source:"Banque d'Algérie",material:'Papel',notes:[200,500,1000,2000],countries:['DZA'],focus:false},
  EGP:{name:'Libra egípcia',symbol:'E£',group:'Egito',source:'Central Bank of Egypt',material:'Papel / polímero',notes:[10,20,50,100,200],countries:['EGY'],focus:false}
 };
 const iso={'404':'KEN','566':'NGA','788':'TUN','012':'DZA','818':'EGY'};
 const official={KES:'https://www.centralbank.go.ke/',NGN:'https://www.cbn.gov.ng/',TND:'https://www.bct.gov.tn/',DZD:'https://www.bank-of-algeria.dz/',EGP:'https://www.cbe.org.eg/'};
 const oldFetch=window.fetch.bind(window);
 window.fetch=async(...args)=>{const req=args[0],url=typeof req==='string'?req:req?.url||'';const r=await oldFetch(...args);
  if(url.includes('/data/countries.json')){const data=await r.clone().json();for(const c of defs)if(!data.some(x=>x.id===c.id))data.push(c);return new Response(JSON.stringify(data),{status:r.status,statusText:r.statusText,headers:{'Content-Type':'application/json; charset=utf-8'}})}
  if(url.includes('/data/currencies.json')){const data=await r.clone().json();for(const [code,def] of Object.entries(currencies))if(!data[code])data[code]=def;return new Response(JSON.stringify(data),{status:r.status,statusText:r.statusText,headers:{'Content-Type':'application/json; charset=utf-8'}})}
  if(url.includes('/data/iso-map.json')){const data=await r.clone().json();Object.assign(data,iso);return new Response(JSON.stringify(data),{status:r.status,statusText:r.statusText,headers:{'Content-Type':'application/json; charset=utf-8'}})}
  if(!url.includes('/data/notes.json'))return r;const data=await r.clone().json();for(const [code,def] of Object.entries(currencies))for(const value of def.notes){let n=data.find(x=>x.currency===code&&Number(x.value)===Number(value));if(!n){n={currency:code,value};data.push(n)}Object.assign(n,{status:'circulating',statusLabel:'Em circulação',source:def.source,material:def.material,front:`/assets/notes/banknotews/${code.toLowerCase()}/${value}-front.jpg`,back:`/assets/notes/banknotews/${code.toLowerCase()}/${value}-back.jpg`,imageStatus:'local-reference',imageSource:'Bank Note Museum · cópia local',officialUrl:official[code],officialLabel:`Ver ${code} na fonte oficial`})}return new Response(JSON.stringify(data),{status:r.status,statusText:r.statusText,headers:{'Content-Type':'application/json; charset=utf-8'}})};
})();
// Keep the Africa chain synchronous without changing the historical index ordering.
document.write('<script src="/africa-wave8.js?v=162"></script>');
document.write('<script src="/africa-wave8-local-fix.js?v=163"></script>');
