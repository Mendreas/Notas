(()=>{
 const defs=[
  {id:'MRT',name:'Mauritânia',flag:'🇲🇷',continent:'Africa',currency:'MRU',capital:'Nouakchott',population:'≈ 5 milhões',language:'Árabe',history:[['1973–2018','Ouguiya (MRO)'],['2018–hoje','Ouguiya (MRU), redenominada 10:1']]},
  {id:'COM',name:'Comores',flag:'🇰🇲',continent:'Africa',currency:'KMF',capital:'Moroni',population:'≈ 0,9 milhões',language:'Comoriano / Árabe / Francês',history:[['1981–hoje','Franco comoriano']]},
  {id:'STP',name:'São Tomé e Príncipe',flag:'🇸🇹',continent:'Africa',currency:'STN',capital:'São Tomé',population:'≈ 240 mil',language:'Português',history:[['1977–2018','Dobra (STD)'],['2018–hoje','Dobra (STN), redenominada 1000:1']]}
 ];
 const currencies={
  MRU:{name:'Ouguiya mauritana',symbol:'UM',group:'Mauritânia',source:'Banque Centrale de Mauritanie',material:'Polímero / papel',notes:[20,50,100,200,500,1000],countries:['MRT'],focus:false},
  KMF:{name:'Franco comoriano',symbol:'CF',group:'Comores',source:'Banque Centrale des Comores',material:'Papel',notes:[500,1000,2000,5000,10000],countries:['COM'],focus:false},
  STN:{name:'Dobra são-tomense',symbol:'Db',group:'São Tomé e Príncipe',source:'Banco Central de São Tomé e Príncipe',material:'Papel / polímero',notes:[5,10,20,50,100,200],countries:['STP'],focus:false}
 };
 const iso={'478':'MRT','174':'COM','678':'STP'};
 const official={MRU:'https://www.bcm.mr/',KMF:'https://banque-comores.km/',STN:'https://www.bcstp.st/'};
 const oldFetch=window.fetch.bind(window);
 window.fetch=async(...args)=>{const req=args[0],url=typeof req==='string'?req:req?.url||'';const r=await oldFetch(...args);
  if(url.includes('/data/countries.json')){const data=await r.clone().json();for(const c of defs)if(!data.some(x=>x.id===c.id))data.push(c);return new Response(JSON.stringify(data),{status:r.status,statusText:r.statusText,headers:{'Content-Type':'application/json; charset=utf-8'}})}
  if(url.includes('/data/currencies.json')){const data=await r.clone().json();for(const [code,def] of Object.entries(currencies))if(!data[code])data[code]=def;return new Response(JSON.stringify(data),{status:r.status,statusText:r.statusText,headers:{'Content-Type':'application/json; charset=utf-8'}})}
  if(url.includes('/data/iso-map.json')){const data=await r.clone().json();Object.assign(data,iso);return new Response(JSON.stringify(data),{status:r.status,statusText:r.statusText,headers:{'Content-Type':'application/json; charset=utf-8'}})}
  if(!url.includes('/data/notes.json'))return r;const data=await r.clone().json();for(const [code,def] of Object.entries(currencies))for(const value of def.notes){let n=data.find(x=>x.currency===code&&Number(x.value)===Number(value));if(!n){n={currency:code,value};data.push(n)}Object.assign(n,{status:'circulating',statusLabel:'Em circulação',source:def.source,material:def.material,front:`/assets/notes/banknotews/${code.toLowerCase()}/${value}-front.jpg`,back:`/assets/notes/banknotews/${code.toLowerCase()}/${value}-back.jpg`,imageStatus:'local-reference',imageSource:'Bank Note Museum · cópia local',officialUrl:official[code],officialLabel:`Ver ${code} na fonte oficial`})}return new Response(JSON.stringify(data),{status:r.status,statusText:r.statusText,headers:{'Content-Type':'application/json; charset=utf-8'}})};
})();

// Africa wave 5 — Zambia, Malawi, Mozambique, Angola e Serra Leoa
(()=>{
 const defs=[
  {id:'ZMB',name:'Zâmbia',flag:'🇿🇲',continent:'Africa',currency:'ZMW',capital:'Lusaka',population:'≈ 22 milhões',language:'Inglês',history:[['1964–2013','Kwacha zambiano (ZMK)'],['2013–hoje','Kwacha zambiano (ZMW), redenominado 1000:1']]},
  {id:'MWI',name:'Malawi',flag:'🇲🇼',continent:'Africa',currency:'MWK',capital:'Lilongwe',population:'≈ 22 milhões',language:'Inglês / Chichewa',history:[['1964–1971','Libra malawiana'],['1971–hoje','Kwacha malawiano']]},
  {id:'MOZ',name:'Moçambique',flag:'🇲🇿',continent:'Africa',currency:'MZN',capital:'Maputo',population:'≈ 35 milhões',language:'Português',history:[['1980–2006','Metical (MZM)'],['2006–hoje','Metical (MZN), redenominado 1000:1']]},
  {id:'AGO',name:'Angola',flag:'🇦🇴',continent:'Africa',currency:'AOA',capital:'Luanda',population:'≈ 39 milhões',language:'Português',history:[['1977–1990','Kwanza'],['1990–1995','Novo kwanza'],['1995–1999','Kwanza reajustado'],['1999–hoje','Kwanza (AOA)']]},
  {id:'SLE',name:'Serra Leoa',flag:'🇸🇱',continent:'Africa',currency:'SLE',capital:'Freetown',population:'≈ 9 milhões',language:'Inglês / Krio',history:[['1964–2022','Leone (SLL)'],['2022–hoje','Leone (SLE), redenominado 1000:1']]}
 ];
 const currencies={
  ZMW:{name:'Kwacha zambiano',symbol:'K',group:'Zâmbia',source:'Bank of Zambia',material:'Papel',notes:[10,20,50,100,200,500],countries:['ZMB'],focus:false},
  MWK:{name:'Kwacha malawiano',symbol:'MK',group:'Malawi',source:'Reserve Bank of Malawi',material:'Papel',notes:[20,50,100,200,500,1000,2000,5000],countries:['MWI'],focus:false},
  MZN:{name:'Metical moçambicano',symbol:'MT',group:'Moçambique',source:'Banco de Moçambique',material:'Papel / polímero',notes:[20,50,100,200,500,1000],countries:['MOZ'],focus:false},
  AOA:{name:'Kwanza angolano',symbol:'Kz',group:'Angola',source:'Banco Nacional de Angola',material:'Polímero',notes:[200,500,1000,2000,5000],countries:['AGO'],focus:false},
  SLE:{name:'Leone',symbol:'Le',group:'Serra Leoa',source:'Bank of Sierra Leone',material:'Papel',notes:[1,2,5,10,20],countries:['SLE'],focus:false}
 };
 const iso={'894':'ZMB','454':'MWI','508':'MOZ','024':'AGO','694':'SLE'};
 const official={ZMW:'https://www.boz.zm/',MWK:'https://www.rbm.mw/',MZN:'https://www.bancomoc.mz/',AOA:'https://www.bna.ao/',SLE:'https://bsl.gov.sl/'};
 const oldFetch=window.fetch.bind(window);
 window.fetch=async(...args)=>{const req=args[0],url=typeof req==='string'?req:req?.url||'';const r=await oldFetch(...args);
  if(url.includes('/data/countries.json')){const data=await r.clone().json();for(const c of defs)if(!data.some(x=>x.id===c.id))data.push(c);return new Response(JSON.stringify(data),{status:r.status,statusText:r.statusText,headers:{'Content-Type':'application/json; charset=utf-8'}})}
  if(url.includes('/data/currencies.json')){const data=await r.clone().json();for(const [code,def] of Object.entries(currencies))if(!data[code])data[code]=def;return new Response(JSON.stringify(data),{status:r.status,statusText:r.statusText,headers:{'Content-Type':'application/json; charset=utf-8'}})}
  if(url.includes('/data/iso-map.json')){const data=await r.clone().json();Object.assign(data,iso);return new Response(JSON.stringify(data),{status:r.status,statusText:r.statusText,headers:{'Content-Type':'application/json; charset=utf-8'}})}
  if(!url.includes('/data/notes.json'))return r;const data=await r.clone().json();for(const [code,def] of Object.entries(currencies))for(const value of def.notes){let n=data.find(x=>x.currency===code&&Number(x.value)===Number(value));if(!n){n={currency:code,value};data.push(n)}Object.assign(n,{status:'circulating',statusLabel:'Em circulação',source:def.source,material:def.material,front:`/assets/notes/banknotews/${code.toLowerCase()}/${value}-front.jpg`,back:`/assets/notes/banknotews/${code.toLowerCase()}/${value}-back.jpg`,imageStatus:'local-reference',imageSource:'Bank Note Museum · cópia local',officialUrl:official[code],officialLabel:`Ver ${code} na fonte oficial`})}return new Response(JSON.stringify(data),{status:r.status,statusText:r.statusText,headers:{'Content-Type':'application/json; charset=utf-8'}})};
})();
