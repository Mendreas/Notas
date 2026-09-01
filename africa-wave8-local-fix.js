// Local banknote.ws assets for repaired Africa wave 8 currencies.
(()=>{
 const defs={
  LRD:{source:'Central Bank of Liberia',material:'Papel',values:[20,50,100,500,1000],page:'https://www.banknote.ws/COLLECTION/countries/AFR/LIB/LIB.htm',official:'https://cbl.org.lr/general/currency'},
  GNF:{source:'Banque Centrale de la République de Guinée',material:'Papel / polímero',values:[100,500,1000,2000,5000,10000,20000],page:'https://www.banknote.ws/COLLECTION/countries/AFR/GUI/GUI.htm',official:'https://www.bcrg-guinee.org/'},
  BIF:{source:'Banque de la République du Burundi',material:'Papel',values:[100,500,1000,2000,5000,10000],page:'https://www.banknote.ws/COLLECTION/countries/AFR/BUR/BUR.htm',official:'https://www.brb.bi/'},
  CDF:{source:'Banque Centrale du Congo',material:'Papel',values:[50,100,200,500,1000,5000,10000,20000],page:'https://www.banknote.ws/COLLECTION/countries/AFR/CDR/CDR-CDR.htm',official:'https://www.bcc.cd/'},
  DJF:{source:'Banque Centrale de Djibouti',material:'Papel',values:[1000,2000,5000,10000],page:'https://www.banknote.ws/COLLECTION/countries/AFR/DJI/DJI-DJI.htm',official:'https://banque-centrale.dj/'},
  ERN:{source:'Bank of Eritrea',material:'Papel',values:[1,5,10,20,50,100],page:'https://www.banknote.ws/COLLECTION/countries/AFR/ERI/ERI.htm',official:'https://www.banknote.ws/COLLECTION/countries/AFR/ERI/ERI.htm'},
  SDG:{source:'Central Bank of Sudan',material:'Papel',values:[500,1000,2000],page:'https://www.banknote.ws/COLLECTION/countries/AFR/SUD/SUD-SUD.htm',official:'https://cbos.gov.sd/'},
  MGA:{source:"Banky Foiben'i Madagasikara",material:'Papel',values:[100,200,500,1000,2000,5000,10000,20000],page:'https://www.banknote.ws/COLLECTION/countries/AFR/MAD/MAD-BFM.htm',official:'https://www.banky-foibe.mg/'}
 };
 const local=(code,value,side)=>`/assets/notes/banknotews/${code.toLowerCase()}/${value}-${side}.jpg`;
 const previousFetch=window.fetch.bind(window);
 window.fetch=async(...args)=>{
  const req=args[0],url=typeof req==='string'?req:req?.url||'';
  const response=await previousFetch(...args);
  if(url.includes('/data/currencies.json')){
   const data=await response.clone().json();
   if(data.GNF)data.GNF.notes=[100,500,1000,2000,5000,10000,20000];
   return new Response(JSON.stringify(data),{status:response.status,statusText:response.statusText,headers:{'Content-Type':'application/json; charset=utf-8'}});
  }
  if(!url.includes('/data/notes.json'))return response;
  const data=await response.clone().json();
  for(const [code,cfg] of Object.entries(defs))for(const value of cfg.values){
   let n=data.find(x=>x.currency===code&&Number(x.value)===Number(value));
   if(!n){n={currency:code,value};data.push(n)}
   Object.assign(n,{status:'circulating',statusLabel:'Em circulação',source:cfg.source,material:cfg.material,front:local(code,value,'front'),back:local(code,value,'back'),imageStatus:'local-reference',imageSource:'Bank Note Museum · banknote.ws · cópia local',imageSourceUrl:cfg.page,officialUrl:cfg.official,officialLabel:`Ver ${code} na fonte oficial`});
  }
  return new Response(JSON.stringify(data),{status:response.status,statusText:response.statusText,headers:{'Content-Type':'application/json; charset=utf-8'}});
 };
})();
