// América Central — países, moedas e notas locais
// Revisto em 01-09-2026. Imagens: cópias locais importadas do Bank Note Museum.
(()=>{
 const defs=[
  {id:'GTM',name:'Guatemala',flag:'🇬🇹',continent:'North America',region:'América Central',currency:'GTQ',capital:'Cidade da Guatemala',population:'≈ 18 milhões',language:'Espanhol / línguas maias',history:[['1925–hoje','Quetzal (GTQ)']]},
  {id:'HND',name:'Honduras',flag:'🇭🇳',continent:'North America',region:'América Central',currency:'HNL',capital:'Tegucigalpa',population:'≈ 10,8 milhões',language:'Espanhol',history:[['1931–hoje','Lempira (HNL)']]},
  {id:'SLV',name:'El Salvador',flag:'🇸🇻',continent:'North America',region:'América Central',currency:'USD',capital:'San Salvador',population:'≈ 6,3 milhões',language:'Espanhol',history:[['1892–2001','Colón salvadorenho'],['2001–hoje','Dólar dos Estados Unidos (USD) como moeda de circulação geral']]},
  {id:'NIC',name:'Nicarágua',flag:'🇳🇮',continent:'North America',region:'América Central',currency:'NIO',capital:'Manágua',population:'≈ 7 milhões',language:'Espanhol',history:[['1912–hoje','Córdoba (NIO)'],['1991–hoje','Córdoba oro / sistema monetário atual']]},
  {id:'CRI',name:'Costa Rica',flag:'🇨🇷',continent:'North America',region:'América Central',currency:'CRC',capital:'San José',population:'≈ 5,2 milhões',language:'Espanhol',history:[['1896–hoje','Colón costa-riquenho (CRC)'],['2020–hoje','Família atual em polímero']]},
  {id:'PAN',name:'Panamá',flag:'🇵🇦',continent:'North America',region:'América Central',currency:'USD',capital:'Cidade do Panamá',population:'≈ 4,5 milhões',language:'Espanhol',history:[['1904–hoje','Balboa (PAB) apenas em moedas, à paridade com USD'],['1904–hoje','Dólar dos Estados Unidos (USD) usado nas notas e na circulação geral']]}
 ];
 const currencies={
  GTQ:{name:'Quetzal',symbol:'Q',group:'Guatemala',source:'Banco de Guatemala',material:'Papel / polímero',notes:[5,10,20,50,100,200],countries:['GTM'],focus:false,rate:9.0},
  HNL:{name:'Lempira',symbol:'L',group:'Honduras',source:'Banco Central de Honduras',material:'Papel / polímero',notes:[1,2,5,10,20,50,100,200,500],countries:['HND'],focus:false,rate:30.5},
  NIO:{name:'Córdoba',symbol:'C$',group:'Nicarágua',source:'Banco Central de Nicaragua',material:'Papel / polímero',notes:[10,20,50,100,200,500,1000],countries:['NIC'],focus:false,rate:43.0},
  CRC:{name:'Colón costa-riquenho',symbol:'₡',group:'Costa Rica',source:'Banco Central de Costa Rica',material:'Polímero',notes:[1000,2000,5000,10000,20000],countries:['CRI'],focus:false,rate:610}
 };
 const iso={'320':'GTM','340':'HND','222':'SLV','558':'NIC','188':'CRI','591':'PAN'};
 const official={
  GTQ:'https://www.banguat.gob.gt/',HNL:'https://www.bch.hn/',NIO:'https://www.bcn.gob.ni/',CRC:'https://www.bccr.fi.cr/'
 };
 const museum={
  GTQ:'https://www.banknote.ws/COLLECTION/countries/AME/GTM/GTM-BDG.htm',
  HNL:'https://www.banknote.ws/COLLECTION/countries/AME/HON/HON-BCH.htm',
  NIO:'https://www.banknote.ws/COLLECTION/countries/AME/NIC/NIC-BCN.htm',
  CRC:'https://www.banknote.ws/COLLECTION/countries/AME/CRI/CRI-BCC.htm'
 };
 const oldFetch=window.fetch.bind(window);
 window.fetch=async(...args)=>{
  const req=args[0],url=typeof req==='string'?req:req?.url||'';const r=await oldFetch(...args);
  if(url.includes('/data/countries.json')){
   const data=await r.clone().json();for(const c of defs){const x=data.find(v=>v.id===c.id);x?Object.assign(x,c):data.push(c)}
   return new Response(JSON.stringify(data),{status:r.status,statusText:r.statusText,headers:{'Content-Type':'application/json; charset=utf-8'}});
  }
  if(url.includes('/data/currencies.json')){
   const data=await r.clone().json();for(const [code,def] of Object.entries(currencies))data[code]=Object.assign({},data[code]||{},def);
   if(data.USD)data.USD.countries=[...new Set([...(data.USD.countries||[]),'SLV','PAN'])];
   return new Response(JSON.stringify(data),{status:r.status,statusText:r.statusText,headers:{'Content-Type':'application/json; charset=utf-8'}});
  }
  if(url.includes('/data/iso-map.json')){
   const data=await r.clone().json();Object.assign(data,iso);return new Response(JSON.stringify(data),{status:r.status,statusText:r.statusText,headers:{'Content-Type':'application/json; charset=utf-8'}});
  }
  if(url.includes('/data/notes.json')){
   const data=await r.clone().json();
   for(const [code,def] of Object.entries(currencies))for(const value of def.notes){
    let n=data.find(x=>x.currency===code&&Number(x.value)===Number(value));if(!n){n={currency:code,value};data.push(n)}
    Object.assign(n,{status:'circulating',statusLabel:'Em circulação',source:def.source,material:def.material,front:`/assets/notes/banknotews/${code.toLowerCase()}/${value}-front.jpg`,back:`/assets/notes/banknotews/${code.toLowerCase()}/${value}-back.jpg`,imageStatus:'local-reference',imageSource:'Bank Note Museum · cópia local',imageSourceUrl:museum[code],officialUrl:official[code],officialLabel:`Ver ${code} na fonte oficial`});
   }
   return new Response(JSON.stringify(data),{status:r.status,statusText:r.statusText,headers:{'Content-Type':'application/json; charset=utf-8'}});
  }
  return r;
 };
})();
