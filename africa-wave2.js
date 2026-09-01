(()=>{
 const XOF_COUNTRIES=[
  {id:'BEN',name:'Benim',flag:'🇧🇯',capital:'Porto-Novo',population:'≈ 14 milhões',language:'Francês'},
  {id:'BFA',name:'Burkina Faso',flag:'🇧🇫',capital:'Ouagadougou',population:'≈ 24 milhões',language:'Francês e línguas nacionais'},
  {id:'CIV',name:'Costa do Marfim',flag:'🇨🇮',capital:'Yamoussoukro',population:'≈ 32 milhões',language:'Francês'},
  {id:'GNB',name:'Guiné-Bissau',flag:'🇬🇼',capital:'Bissau',population:'≈ 2,2 milhões',language:'Português / Crioulo'},
  {id:'MLI',name:'Mali',flag:'🇲🇱',capital:'Bamako',population:'≈ 25 milhões',language:'Línguas nacionais / Francês'},
  {id:'NER',name:'Níger',flag:'🇳🇪',capital:'Niamey',population:'≈ 28 milhões',language:'Francês e línguas nacionais'},
  {id:'SEN',name:'Senegal',flag:'🇸🇳',capital:'Dacar',population:'≈ 19 milhões',language:'Francês / Wolof'},
  {id:'TGO',name:'Togo',flag:'🇹🇬',capital:'Lomé',population:'≈ 9,5 milhões',language:'Francês'}
 ];
 const XAF_COUNTRIES=[
  {id:'CMR',name:'Camarões',flag:'🇨🇲',capital:'Yaoundé',population:'≈ 30 milhões',language:'Francês / Inglês'},
  {id:'CAF',name:'República Centro-Africana',flag:'🇨🇫',capital:'Bangui',population:'≈ 5,5 milhões',language:'Francês / Sango'},
  {id:'TCD',name:'Chade',flag:'🇹🇩',capital:"N'Djamena",population:'≈ 20 milhões',language:'Francês / Árabe'},
  {id:'COG',name:'República do Congo',flag:'🇨🇬',capital:'Brazzaville',population:'≈ 6,5 milhões',language:'Francês'},
  {id:'GNQ',name:'Guiné Equatorial',flag:'🇬🇶',capital:'Malabo',population:'≈ 1,9 milhões',language:'Espanhol / Francês / Português'},
  {id:'GAB',name:'Gabão',flag:'🇬🇦',capital:'Libreville',population:'≈ 2,5 milhões',language:'Francês'}
 ];
 const isoMap={'204':'BEN','854':'BFA','384':'CIV','624':'GNB','466':'MLI','562':'NER','686':'SEN','768':'TGO','120':'CMR','140':'CAF','148':'TCD','178':'COG','226':'GNQ','266':'GAB'};
 const values=[500,1000,2000,5000,10000];
 const countries=[...XOF_COUNTRIES.map(c=>({...c,continent:'Africa',currency:'XOF',history:[['1945–hoje','Franco CFA da África Ocidental; atualmente emitido pelo BCEAO']]})),...XAF_COUNTRIES.map(c=>({...c,continent:'Africa',currency:'XAF',history:[['1945–hoje','Franco CFA da África Central; atualmente emitido pelo BEAC']]}))];
 const currencyDefs={
  XOF:{name:'Franco CFA da África Ocidental',symbol:'CFA',group:'União Monetária Oeste-Africana',source:"Banque Centrale des États de l'Afrique de l'Ouest (BCEAO)",rate:655.957,material:'Papel',notes:values,countries:XOF_COUNTRIES.map(c=>c.id),focus:false},
  XAF:{name:'Franco CFA da África Central',symbol:'FCFA',group:'CEMAC',source:"Banque des États de l'Afrique Centrale (BEAC)",rate:655.957,material:'Papel',notes:values,countries:XAF_COUNTRIES.map(c=>c.id),focus:false}
 };
 const pages={XOF:{500:'WAS/WAS.htm',1000:'WAS/WAS.htm',2000:'WAS/WAS.htm',5000:'WAS/WAS.htm',10000:'WAS/WAS.htm'},XAF:{500:'CAS/CASW0700.htm',1000:'CAS/CASW0701.htm',2000:'CAS/CASW0702.htm',5000:'CAS/CASW0703.htm',10000:'CAS/CASW0704.htm'}};
 const official={XOF:'https://www.bceao.int/fr/content/billets-et-pieces',XAF:'https://www.beac.int/billets-et-pieces/'};
 const oldFetch=window.fetch.bind(window);
 window.fetch=async(...args)=>{const req=args[0],url=typeof req==='string'?req:req?.url||'';const r=await oldFetch(...args);
  if(url.includes('/data/countries.json')){const data=await r.clone().json();for(const c of countries)if(!data.some(x=>x.id===c.id))data.push(c);return new Response(JSON.stringify(data),{status:r.status,statusText:r.statusText,headers:{'Content-Type':'application/json; charset=utf-8'}})}
  if(url.includes('/data/currencies.json')){const data=await r.clone().json();for(const [code,def] of Object.entries(currencyDefs))if(!data[code])data[code]=def;return new Response(JSON.stringify(data),{status:r.status,statusText:r.statusText,headers:{'Content-Type':'application/json; charset=utf-8'}})}
  if(url.includes('/data/iso-map.json')){const data=await r.clone().json();Object.assign(data,isoMap);return new Response(JSON.stringify(data),{status:r.status,statusText:r.statusText,headers:{'Content-Type':'application/json; charset=utf-8'}})}
  if(!url.includes('/data/notes.json'))return r;const data=await r.clone().json();for(const code of ['XOF','XAF'])for(const value of values){let n=data.find(x=>x.currency===code&&Number(x.value)===value);if(!n){n={currency:code,value};data.push(n)}Object.assign(n,{status:'circulating',statusLabel:'Em circulação',source:currencyDefs[code].source,material:'Papel',front:`/assets/notes/banknotews/${code.toLowerCase()}/${value}-front.jpg`,back:`/assets/notes/banknotews/${code.toLowerCase()}/${value}-back.jpg`,imageStatus:'local-reference',imageSource:'Bank Note Museum · cópia local',imageSourceUrl:`https://www.banknote.ws/COLLECTION/countries/AFR/${pages[code][value]}`,officialUrl:official[code],officialLabel:`Ver ${code} na fonte oficial`})}return new Response(JSON.stringify(data),{status:r.status,statusText:r.statusText,headers:{'Content-Type':'application/json; charset=utf-8'}})};
 const base=window.NOTAS_CONTINENT_MATCH;window.NOTAS_CONTINENT_MATCH=(country,continent)=>base?base(country,continent):(Array.isArray(country?.continents)?country.continents.includes(continent):country?.continent===continent);
})();

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
