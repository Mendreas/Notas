(()=>{
 const defs=[
  {id:'GHA',name:'Gana',flag:'🇬🇭',continent:'Africa',currency:'GHS',capital:'Acra',population:'≈ 35 milhões',language:'Inglês',history:[['1958–1965','Libra ganesa'],['1965–hoje','Cedi ganês; redenominado em 2007']]},
  {id:'UGA',name:'Uganda',flag:'🇺🇬',continent:'Africa',currency:'UGX',capital:'Kampala',population:'≈ 51 milhões',language:'Inglês / Suaíli',history:[['até 1966','Xelim da África Oriental'],['1966–hoje','Xelim ugandês']]},
  {id:'TZA',name:'Tanzânia',flag:'🇹🇿',continent:'Africa',currency:'TZS',capital:'Dodoma',population:'≈ 70 milhões',language:'Suaíli / Inglês',history:[['até 1966','Xelim da África Oriental'],['1966–hoje','Xelim tanzaniano']]},
  {id:'ETH',name:'Etiópia',flag:'🇪🇹',continent:'Africa',currency:'ETB',capital:'Adis Abeba',population:'≈ 135 milhões',language:'Amárico e outras línguas',history:[['1945–1976','Dólar etíope'],['1976–hoje','Birr etíope']]},
  {id:'RWA',name:'Ruanda',flag:'🇷🇼',continent:'Africa',currency:'RWF',capital:'Kigali',population:'≈ 14,5 milhões',language:'Kinyarwanda / Inglês / Francês / Suaíli',history:[['1964–hoje','Franco ruandês']]}
 ];
 const currencies={
  GHS:{name:'Cedi ganês',symbol:'GH₵',group:'Gana',source:'Bank of Ghana',material:'Papel',notes:[1,5,10,20,50,100,200],countries:['GHA'],focus:false},
  UGX:{name:'Xelim ugandês',symbol:'USh',group:'Uganda',source:'Bank of Uganda',material:'Papel',notes:[1000,2000,5000,10000,20000,50000],countries:['UGA'],focus:false},
  TZS:{name:'Xelim tanzaniano',symbol:'TSh',group:'Tanzânia',source:'Bank of Tanzania',material:'Papel',notes:[500,1000,2000,5000,10000],countries:['TZA'],focus:false},
  ETB:{name:'Birr etíope',symbol:'Br',group:'Etiópia',source:'National Bank of Ethiopia',material:'Papel',notes:[10,50,100,200],countries:['ETH'],focus:false},
  RWF:{name:'Franco ruandês',symbol:'FRw',group:'Ruanda',source:'National Bank of Rwanda',material:'Papel',notes:[500,1000,2000,5000],countries:['RWA'],focus:false}
 };
 const iso={'288':'GHA','800':'UGA','834':'TZA','231':'ETH','646':'RWA'};
 const official={GHS:'https://www.bog.gov.gh/',UGX:'https://www.bou.or.ug/',TZS:'https://www.bot.go.tz/',ETB:'https://nbe.gov.et/',RWF:'https://www.bnr.rw/'};
 const oldFetch=window.fetch.bind(window);
 window.fetch=async(...args)=>{const req=args[0],url=typeof req==='string'?req:req?.url||'';const r=await oldFetch(...args);
  if(url.includes('/data/countries.json')){const data=await r.clone().json();for(const c of defs)if(!data.some(x=>x.id===c.id))data.push(c);return new Response(JSON.stringify(data),{status:r.status,statusText:r.statusText,headers:{'Content-Type':'application/json; charset=utf-8'}})}
  if(url.includes('/data/currencies.json')){const data=await r.clone().json();for(const [code,def] of Object.entries(currencies))if(!data[code])data[code]=def;return new Response(JSON.stringify(data),{status:r.status,statusText:r.statusText,headers:{'Content-Type':'application/json; charset=utf-8'}})}
  if(url.includes('/data/iso-map.json')){const data=await r.clone().json();Object.assign(data,iso);return new Response(JSON.stringify(data),{status:r.status,statusText:r.statusText,headers:{'Content-Type':'application/json; charset=utf-8'}})}
  if(!url.includes('/data/notes.json'))return r;const data=await r.clone().json();for(const [code,def] of Object.entries(currencies))for(const value of def.notes){let n=data.find(x=>x.currency===code&&Number(x.value)===Number(value));if(!n){n={currency:code,value};data.push(n)}Object.assign(n,{status:'circulating',statusLabel:'Em circulação',source:def.source,material:def.material,front:`/assets/notes/banknotews/${code.toLowerCase()}/${value}-front.jpg`,back:`/assets/notes/banknotews/${code.toLowerCase()}/${value}-back.jpg`,imageStatus:'local-reference',imageSource:'Bank Note Museum · cópia local',officialUrl:official[code],officialLabel:`Ver ${code} na fonte oficial`})}return new Response(JSON.stringify(data),{status:r.status,statusText:r.statusText,headers:{'Content-Type':'application/json; charset=utf-8'}})};
})();
