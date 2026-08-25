(() => {
  const extra = {
    BRL:{values:[2,5,10,20,50,100,200],source:'Banco Central do Brasil',material:'Papel de algodão'},
    MXN:{values:[20,50,100,200,500,1000],source:'Banco de México',material:'Papel / polímero'},
    ZAR:{values:[10,20,50,100,200],source:'South African Reserve Bank',material:'Papel'},
    INR:{values:[10,20,50,100,200,500],source:'Reserve Bank of India',material:'Papel'},
    KRW:{values:[1000,5000,10000,50000],source:'Bank of Korea',material:'Papel'}
  };
  const swiss={10:['CHF_10_9_front.jpg','CHF_10_9_back.jpg','70 × 123 mm'],20:['CHF_20_9_front.jpg','CHF_20_9_back.jpg','70 × 130 mm'],50:['CHF_50_9_front.jpg','CHF_50_9_back.jpg','70 × 137 mm'],100:['CHF_100_9_front.jpg','CHF_100_9_back.jpg','70 × 144 mm'],200:['CHF_200_9_front.jpg','CHF_200_9_back.jpg','70 × 151 mm'],1000:['CHF_1000_9_front.jpg','CHF_1000_9_back.jpg','70 × 158 mm']};
  const canadian={5:['https://www.bankofcanada.ca/wp-content/uploads/2015/09/5_front.png','https://www.bankofcanada.ca/wp-content/uploads/2015/09/5_back.png']};
  const commons=f=>'https://commons.wikimedia.org/wiki/Special:Redirect/file/'+encodeURIComponent(f);
  const nativeFetch=window.fetch.bind(window);
  window.fetch=async(...args)=>{
    const req=args[0],url=typeof req==='string'?req:req?.url||'';
    const response=await nativeFetch(...args);
    if(!url.includes('/data/notes.json')) return response;
    const notes=await response.clone().json();
    for(const [currency,cfg] of Object.entries(extra)) for(const value of cfg.values){
      if(!notes.some(n=>n.currency===currency&&Number(n.value)===value)) notes.push({currency,value,front:'/assets/notes/placeholder-front.svg',back:'/assets/notes/placeholder-back.svg',status:'circulating',statusLabel:'Em circulação',source:cfg.source,material:cfg.material,imageStatus:'pending-official'});
    }
    for(const n of notes){
      if(n.currency==='CHF'&&swiss[n.value]){const [f,b,d]=swiss[n.value];Object.assign(n,{front:commons(f),back:commons(b),dimensions:d,imageStatus:'official-reproduction',imageSource:'Swiss National Bank',imageSourceUrl:'https://www.snb.ch/en/the-snb/mandates-goals/cash'});}
      if(n.currency==='CAD'&&canadian[n.value]){Object.assign(n,{front:canadian[n.value][0],back:canadian[n.value][1],dimensions:'152,4 × 69,85 mm',imageStatus:'official-reproduction',imageSource:'Bank of Canada',imageSourceUrl:'https://www.bankofcanada.ca/banknotes/'});}
    }
    return new Response(JSON.stringify(notes),{status:response.status,statusText:response.statusText,headers:{'Content-Type':'application/json; charset=utf-8'}});
  };
})();