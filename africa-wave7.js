// Africa wave 7 — Cabo Verde, Lesoto, Eswatini, Maurícia e Seicheles
// Estrutura monetária validada em fontes oficiais em 01-09-2026.
// As denominações ficam declaradas na moeda, mas as entradas em notes.json só devem
// ser criadas quando existirem assets frente/verso verificados, evitando imagens partidas.
(()=>{
 const defs=[
  {id:'CPV',name:'Cabo Verde',flag:'🇨🇻',continent:'Africa',currency:'CVE',capital:'Praia',population:'≈ 530 mil',language:'Português / Crioulo cabo-verdiano',history:[['1914–1975','Escudo de Cabo Verde sob administração portuguesa'],['1975–hoje','Escudo cabo-verdiano (CVE)'],['1998–hoje','CVE ligado ao euro através de acordo cambial']]},
  {id:'LSO',name:'Lesoto',flag:'🇱🇸',continent:'Africa',currency:'LSL',capital:'Maseru',population:'≈ 2,3 milhões',language:'Sesotho / Inglês',history:[['antes de 1980','Rand sul-africano'],['1980–hoje','Loti / maloti do Lesoto (LSL), em paridade com o rand']]},
  {id:'SWZ',name:'Eswatini',flag:'🇸🇿',continent:'Africa',currency:'SZL',capital:'Mbabane / Lobamba',population:'≈ 1,25 milhões',language:'SiSwati / Inglês',history:[['1974–2018','Lilangeni da Suazilândia'],['2018–hoje','Lilangeni de Eswatini (SZL), em paridade com o rand']]},
  {id:'MUS',name:'Maurícia',flag:'🇲🇺',continent:'Africa',currency:'MUR',capital:'Port Louis',population:'≈ 1,3 milhões',language:'Inglês / Francês / Crioulo mauriciano',history:[['1877–hoje','Rupia mauriciana (MUR)'],['1967–hoje','Emissão pelo Bank of Mauritius']]},
  {id:'SYC',name:'Seicheles',flag:'🇸🇨',continent:'Africa',currency:'SCR',capital:'Victoria',population:'≈ 130 mil',language:'Crioulo seichelense / Inglês / Francês',history:[['1914–hoje','Rupia das Seicheles (SCR)'],['1983–hoje','Emissão pelo Central Bank of Seychelles']]}
 ];
 const currencies={
  CVE:{name:'Escudo cabo-verdiano',symbol:'$',group:'Cabo Verde',source:'Banco de Cabo Verde',rate:110.265,material:'Papel / polímero',notes:[200,500,1000,2000,5000],countries:['CPV'],focus:false,assetStatus:'pending-verified-images'},
  LSL:{name:'Loti do Lesoto',symbol:'L',group:'Lesoto',source:'Central Bank of Lesotho',rate:20.7,material:'Papel',notes:[10,20,50,100,200],countries:['LSO'],focus:false,assetStatus:'pending-verified-images'},
  SZL:{name:'Lilangeni de Eswatini',symbol:'E',group:'Eswatini',source:'Central Bank of Eswatini',rate:20.7,material:'Papel',notes:[10,20,50,100,200],countries:['SWZ'],focus:false,assetStatus:'pending-verified-images'},
  MUR:{name:'Rupia mauriciana',symbol:'₨',group:'Maurícia',source:'Bank of Mauritius',rate:54,material:'Papel / polímero',notes:[25,50,100,200,500,1000,2000],countries:['MUS'],focus:false,assetStatus:'pending-verified-images'},
  SCR:{name:'Rupia das Seicheles',symbol:'₨',group:'Seicheles',source:'Central Bank of Seychelles',rate:16.2,material:'Papel',notes:[25,50,100,500],countries:['SYC'],focus:false,assetStatus:'pending-verified-images'}
 };
 const iso={'132':'CPV','426':'LSO','748':'SWZ','480':'MUS','690':'SYC'};
 const oldFetch=window.fetch.bind(window);
 window.fetch=async(...args)=>{
  const req=args[0],url=typeof req==='string'?req:req?.url||'';const r=await oldFetch(...args);
  if(url.includes('/data/countries.json')){
   const data=await r.clone().json();
   for(const c of defs)if(!data.some(x=>x.id===c.id))data.push(c);
   return new Response(JSON.stringify(data),{status:r.status,statusText:r.statusText,headers:{'Content-Type':'application/json; charset=utf-8'}})
  }
  if(url.includes('/data/currencies.json')){
   const data=await r.clone().json();
   for(const [code,def] of Object.entries(currencies))if(!data[code])data[code]=def;
   return new Response(JSON.stringify(data),{status:r.status,statusText:r.statusText,headers:{'Content-Type':'application/json; charset=utf-8'}})
  }
  if(url.includes('/data/iso-map.json')){
   const data=await r.clone().json();Object.assign(data,iso);
   return new Response(JSON.stringify(data),{status:r.status,statusText:r.statusText,headers:{'Content-Type':'application/json; charset=utf-8'}})
  }
  return r;
 };
})();
