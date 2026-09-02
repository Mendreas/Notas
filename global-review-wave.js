// Revisão mundial · correções de circulação e territórios · 02-09-2026
(()=>{
 const local=(code,value)=>({front:`/assets/notes/banknotews/${code.toLowerCase()}/${value}-front.jpg`,back:`/assets/notes/banknotews/${code.toLowerCase()}/${value}-back.jpg`,imageStatus:'local-reference',imageSource:'Bank Note Museum · cópia local'});
 const countries=[
  {id:'CUW',name:'Curaçau',flag:'🇨🇼',continent:'North America',region:'Caraíbas',currency:'XCG',capital:'Willemstad',population:'≈ 185 mil',language:'Papiamentu / Neerlandês / Inglês',history:[['até 2025','Florim das Antilhas Neerlandesas (ANG)'],['31 mar 2025–hoje','Florim das Caraíbas (XCG)']]},
  {id:'SXM',name:'Sint Maarten',flag:'🇸🇽',continent:'North America',region:'Caraíbas',currency:'XCG',capital:'Philipsburg',population:'≈ 43 mil',language:'Neerlandês / Inglês',history:[['até 2025','Florim das Antilhas Neerlandesas (ANG)'],['31 mar 2025–hoje','Florim das Caraíbas (XCG)']]},
  {id:'FLK',name:'Ilhas Falkland',flag:'🇫🇰',continent:'South America',region:'Atlântico Sul',currency:'FKP',capital:'Stanley',population:'≈ 3,7 mil',language:'Inglês',history:[['1899–hoje','Libra das Ilhas Falkland (FKP), à paridade com a libra esterlina'],['14 ago 2025–hoje','Nova família de £5, £10 e £20 em polímero; £50 anterior mantém-se em circulação']]}
 ];
 const currencyUpdates={
  XCG:{name:'Florim das Caraíbas',symbol:'Cg',group:'Curaçau e Sint Maarten',source:'Centrale Bank van Curaçao en Sint Maarten',material:'Papel de segurança',notes:[10,20,50,100,200],countries:['CUW','SXM'],focus:false,rate:2.1},
  FKP:{name:'Libra das Ilhas Falkland',symbol:'£',group:'Ilhas Falkland',source:'Falkland Islands Government · Commissioners of Currency',material:'Polímero / papel',notes:[5,10,20,50],countries:['FLK'],focus:false,rate:0.86},
  NAD:{notes:[10,20,30,50,60,100,200],source:'Bank of Namibia',material:'Papel / polímero',countries:['NAM']},
  GTQ:{notes:[1,5,10,20,50,100,200]},
  BDT:{name:'Taka do Bangladesh',symbol:'৳',group:'Bangladesh',source:'Bangladesh Bank',material:'Papel',notes:[2,5,10,20,50,100,200,500,1000],countries:['BGD']}
 };
 const iso={'531':'CUW','534':'SXM','238':'FLK'};
 const official={
  XCG:'https://www.centralbank.cw/functions/banknotes-coins/caribbean-guilder',
  FKP:'https://www.falklands.gov.fk/finance/currency',
  NAD:'https://www.bon.com.na/Currency/Namibian-Notes.aspx',
  GTQ:'https://www.banguat.gob.gt/',
  BDT:'https://www.bb.org.bd/en/index.php/currency'
 };
 const museum={
  XCG:'https://www.banknote.ws/COLLECTION/countries/AME/CSM/CSM.htm',
  FKP:'https://www.banknote.ws/COLLECTION/countries/AME/FKL/FKL.htm',
  NAD:'https://www.banknote.ws/COLLECTION/countries/AFR/NAM/NAM-NAM.htm',
  GTQ:'https://www.banknote.ws/COLLECTION/countries/AME/GTM/GTM-BDG.htm',
  BDT:'https://www.banknote.ws/COLLECTION/countries/ASI/BDE/BDE.htm'
 };
 const localValues={
  XCG:new Set([10,20,50,100,200]),
  FKP:new Set([5,10,20,50]),
  NAD:new Set([10,20,30,50,60,100,200]),
  GTQ:new Set([1,5,10,20,50,100,200]),
  BDT:new Set([2,5,10,20,50,100,200,500,1000])
 };
 const oldFetch=window.fetch.bind(window);
 window.fetch=async(...args)=>{
  const req=args[0],url=typeof req==='string'?req:req?.url||'';const r=await oldFetch(...args);
  if(url.includes('/data/countries.json')){
   const data=await r.clone().json();for(const c of countries){const x=data.find(v=>v.id===c.id);x?Object.assign(x,c):data.push(c)}
   return new Response(JSON.stringify(data),{status:r.status,statusText:r.statusText,headers:{'Content-Type':'application/json; charset=utf-8'}});
  }
  if(url.includes('/data/currencies.json')){
   const data=await r.clone().json();for(const [code,patch] of Object.entries(currencyUpdates))data[code]=Object.assign({},data[code]||{},patch);
   return new Response(JSON.stringify(data),{status:r.status,statusText:r.statusText,headers:{'Content-Type':'application/json; charset=utf-8'}});
  }
  if(url.includes('/data/iso-map.json')){
   const data=await r.clone().json();Object.assign(data,iso);return new Response(JSON.stringify(data),{status:r.status,statusText:r.statusText,headers:{'Content-Type':'application/json; charset=utf-8'}});
  }
  if(url.includes('/data/notes.json')){
   const data=await r.clone().json();
   for(const [code,patch] of Object.entries(currencyUpdates))for(const value of patch.notes||[]){
    let n=data.find(x=>x.currency===code&&Number(x.value)===Number(value));if(!n){n={currency:code,value:Number(value)};data.push(n)}
    const base={status:'circulating',statusLabel:'Em circulação',source:patch.source||n.source,material:patch.material||n.material,imageSourceUrl:museum[code]||n.imageSourceUrl,officialUrl:official[code]||n.officialUrl,officialLabel:`Ver ${code} ${value} na fonte oficial`};
    if(code==='XCG')base.series='Mundo sob o mar · 2025';
    if(code==='FKP')base.series=value===50?'Série anterior · £50 ainda em circulação':'Nova família de polímero · 2025';
    if(code==='NAD')base.series=value===30?'30.º aniversário da Independência · 2020 · comemorativa':value===60?'Hage Geingob · 60 anos de excelência · 2025 · comemorativa':'Série regular 2025–2026';
    if(code==='GTQ'&&value===1)base.series='100.º aniversário do quetzal · emissão comemorativa';
    if(code==='BDT')base.series=value===2?'Série Sheikh Mujibur Rahman · 2011–2024':value===200?'Centenário de Sheikh Mujibur Rahman · 2020–2024 · comemorativa circulante':'Arquitetura histórica e arqueológica · 2025–2026';
    Object.assign(n,base);
    if(localValues[code]?.has(Number(value)))Object.assign(n,local(code,value));
   }
   return new Response(JSON.stringify(data),{status:r.status,statusText:r.statusText,headers:{'Content-Type':'application/json; charset=utf-8'}});
  }
  return r;
 };
})();