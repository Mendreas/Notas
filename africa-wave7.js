// Africa wave 7 — Cabo Verde, Lesoto, Eswatini, Maurícia e Seicheles
// Estrutura monetária validada em fontes oficiais em 01-09-2026.
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
  LSL:{name:'Loti do Lesoto',symbol:'M',group:'Lesoto',source:'Central Bank of Lesotho',rate:20.7,material:'Papel',notes:[10,20,50,100,200],countries:['LSO'],focus:false,assetStatus:'images-linked'},
  SZL:{name:'Lilangeni de Eswatini',symbol:'E',group:'Eswatini',source:'Central Bank of Eswatini',rate:20.7,material:'Papel',notes:[10,20,50,100,200],countries:['SWZ'],focus:false,assetStatus:'pending-verified-images'},
  MUR:{name:'Rupia mauriciana',symbol:'₨',group:'Maurícia',source:'Bank of Mauritius',rate:54,material:'Papel / polímero',notes:[25,50,100,200,500,1000,2000],countries:['MUS'],focus:false,assetStatus:'pending-verified-images'},
  SCR:{name:'Rupia das Seicheles',symbol:'₨',group:'Seicheles',source:'Central Bank of Seychelles',rate:16.2,material:'Papel',notes:[25,50,100,500],countries:['SYC'],focus:false,assetStatus:'pending-verified-images'}
 };
 const iso={'132':'CPV','426':'LSO','748':'SWZ','480':'MUS','690':'SYC'};
 const crop=(source,position)=>`/.netlify/images?url=${encodeURIComponent(source)}&w=1400&h=610&fit=cover&position=${position}&fm=webp&q=92`;
 const lslImages={
  10:'https://tombanknoter.pl/environment/cache/images/productGfx_7489_2000_2000/LEM10_24.jpg',
  20:'https://i.ebayimg.com/images/g/viEAAeSwe5ZpSZPv/s-l1200.jpg',
  50:'https://moneycorner.com/uploads/images/product/lesotho-50maloti2021-pick-new-b229-c_1703706362658c7efa40b74.jpg?v=1714397572',
  100:'https://tombanknoter.pl/environment/cache/images/productGfx_7498_2000_2000/LEM100_24.jpg',
  200:'https://www.banknoteworld.com/images/product/Lesotho%20200%20Maloti%20Banknote%2C%202021%2C%20P-25b%2C%20UNC.jpg'
 };
 const lslSourcePages={
  10:'https://tombanknoter.pl/pl/p/Lesotho-10-maloti-2024-W26b-nowsze-wydanie/2499',
  20:'https://www.ebay.com/itm/295919143479',
  50:'https://moneycorner.com/en/banknotes/bundle-100-pcs/lesotho-50-maloti-2021-pick-new-b229-bundle-100-pcs',
  100:'https://tombanknoter.pl/pl/p/Lesotho-100-maloti-2024-W29b-nowsze-wydanie/2502',
  200:'https://www.banknoteworld.com/lesotho-200-maloti-banknote-2021-p-30-unc.html'
 };
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
  if(url.includes('/data/notes.json')){
   const data=await r.clone().json();
   for(const value of currencies.LSL.notes){
    let n=data.find(x=>x.currency==='LSL'&&Number(x.value)===value);
    if(!n){n={currency:'LSL',value};data.push(n)}
    const src=lslImages[value];
    Object.assign(n,{status:'circulating',statusLabel:'Em circulação',source:'Central Bank of Lesotho',material:'Papel',front:crop(src,'top'),back:crop(src,'bottom'),imageStatus:'reference-cropped',imageSource:'Imagem de referência da nota em circulação',imageSourceUrl:lslSourcePages[value],officialUrl:'https://centralbank.org.ls/currency/',officialLabel:`Ver LSL ${value} na fonte oficial`});
   }
   return new Response(JSON.stringify(data),{status:r.status,statusText:r.statusText,headers:{'Content-Type':'application/json; charset=utf-8'}})
  }
  return r;
 };
})();
