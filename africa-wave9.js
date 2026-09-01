// Africa wave 9 — Líbia, Somália e Zimbabué
// Revisto em 01-09-2026. Imagens servidas como cópias locais importadas do Bank Note Museum.
(()=>{
 const defs=[
  {id:'LBY',name:'Líbia',flag:'🇱🇾',continent:'Africa',currency:'LYD',capital:'Trípoli',population:'≈ 7,4 milhões',language:'Árabe',history:[['1951–1971','Libra líbia'],['1971–hoje','Dinar líbio (LYD)'],['2025–2026','Renovação de várias denominações; antigas emissões retiradas gradualmente']]},
  {id:'SOM',name:'Somália',flag:'🇸🇴',continent:'Africa',currency:'SOS',capital:'Mogadíscio',population:'≈ 19 milhões',language:'Somali / Árabe',history:[['1962–hoje','Xelim somali (SOS)'],['1991–hoje','Economia fortemente dolarizada; a reforma monetária nacional permanece em preparação']]},
  {id:'ZWE',name:'Zimbabué',flag:'🇿🇼',continent:'Africa',currency:'ZWG',capital:'Harare',population:'≈ 17 milhões',language:'Inglês, Shona, Ndebele e outras',history:[['1980–2009','Dólar do Zimbabué e sucessivas reformas'],['2019–2024','Novo dólar do Zimbabué (ZWL)'],['2024–hoje','Zimbabwe Gold / ZiG (ZWG)'],['2026–hoje','Série BiG5 ZiG atualizada']]}
 ];
 const currencies={
  LYD:{name:'Dinar líbio',symbol:'LD',group:'Líbia',source:'Central Bank of Libya',rate:7.2,material:'Papel / polímero',notes:[1,5,10,20],countries:['LBY'],focus:false},
  SOS:{name:'Xelim somali',symbol:'Sh.So.',group:'Somália',source:'Central Bank of Somalia',rate:660,material:'Papel',notes:[1000],countries:['SOM'],focus:false},
  ZWG:{name:'Zimbabwe Gold (ZiG)',symbol:'ZiG',group:'Zimbabué',source:'Reserve Bank of Zimbabwe',rate:30.9,material:'Papel',notes:[10,20,50],countries:['ZWE'],focus:false}
 };
 const iso={'434':'LBY','706':'SOM','716':'ZWE'};
 const official={
  LYD:'https://cbl.gov.ly/banknotes/',
  SOS:'https://centralbank.gov.so/',
  ZWG:'https://www.rbz.co.zw/'
 };
 const museum={
  LYD:'https://www.banknote.ws/COLLECTION/countries/AFR/LIY/LIY-CBL.htm',
  SOS:'https://www.banknote.ws/COLLECTION/countries/AFR/SOM/SOM.htm',
  ZWG:'https://www.banknote.ws/COLLECTION/countries/AFR/ZIM/ZIM-ZIM.htm'
 };
 const oldFetch=window.fetch.bind(window);
 window.fetch=async(...args)=>{
  const req=args[0],url=typeof req==='string'?req:req?.url||'';
  const r=await oldFetch(...args);
  if(url.includes('/data/countries.json')){
   const data=await r.clone().json();for(const c of defs)if(!data.some(x=>x.id===c.id))data.push(c);
   return new Response(JSON.stringify(data),{status:r.status,statusText:r.statusText,headers:{'Content-Type':'application/json; charset=utf-8'}});
  }
  if(url.includes('/data/currencies.json')){
   const data=await r.clone().json();for(const [code,def] of Object.entries(currencies))data[code]=Object.assign({},data[code]||{},def);
   return new Response(JSON.stringify(data),{status:r.status,statusText:r.statusText,headers:{'Content-Type':'application/json; charset=utf-8'}});
  }
  if(url.includes('/data/iso-map.json')){
   const data=await r.clone().json();Object.assign(data,iso);
   return new Response(JSON.stringify(data),{status:r.status,statusText:r.statusText,headers:{'Content-Type':'application/json; charset=utf-8'}});
  }
  if(url.includes('/data/notes.json')){
   const data=await r.clone().json();
   for(const [code,def] of Object.entries(currencies))for(const value of def.notes){
    let n=data.find(x=>x.currency===code&&Number(x.value)===Number(value));if(!n){n={currency:code,value};data.push(n)}
    Object.assign(n,{status:'circulating',statusLabel:code==='SOS'?'Circulação residual':'Em circulação',source:def.source,material:def.material,front:`/assets/notes/banknotews/${code.toLowerCase()}/${value}-front.jpg`,back:`/assets/notes/banknotews/${code.toLowerCase()}/${value}-back.jpg`,imageStatus:'local-reference',imageSource:'Bank Note Museum · cópia local',imageSourceUrl:museum[code],officialUrl:official[code],officialLabel:`Ver ${code} na fonte oficial`});
   }
   return new Response(JSON.stringify(data),{status:r.status,statusText:r.statusText,headers:{'Content-Type':'application/json; charset=utf-8'}});
  }
  return r;
 };
})();
