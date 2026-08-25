(() => {
  // Europe wave: current circulating denominations and official issuer pages.
  // Full note images are only embedded when the source/reproduction terms allow it.
  const sets={
    SEK:{values:[20,50,100,200,500,1000],source:'Sveriges Riksbank',material:'Papel de algodão',page:'https://www.riksbank.se/en-gb/payments--cash/notes--coins/notes/valid-banknotes/'},
    PLN:{values:[10,20,50,100,200,500],source:'Narodowy Bank Polski',material:'Papel',page:'https://nbp.pl/en/coins-and-banknotes/banknotes/'},
    CZK:{values:[100,200,500,1000,2000,5000],source:'Czech National Bank',material:'Papel',page:'https://www.cnb.cz/en/banknotes-and-coins/banknotes/'},
    RON:{values:[1,5,10,20,50,100,200,500],source:'National Bank of Romania',material:'Polímero',page:'https://www.bnr.ro/Banknotes-and-coins-1332.aspx'}
  };
  const cnbDims={100:'140 × 69 mm',200:'146 × 69 mm',500:'152 × 69 mm',1000:'158 × 74 mm',2000:'164 × 74 mm',5000:'170 × 74 mm'};
  const nativeFetch=window.fetch.bind(window);
  window.fetch=async(...args)=>{
    const req=args[0],url=typeof req==='string'?req:req?.url||'';
    const response=await nativeFetch(...args);
    if(!url.includes('/data/notes.json'))return response;
    const notes=await response.clone().json();
    for(const [currency,cfg] of Object.entries(sets)) for(const value of cfg.values){
      let n=notes.find(x=>x.currency===currency&&Number(x.value)===value);
      if(!n){n={currency,value};notes.push(n);}
      Object.assign(n,{front:n.front||'/assets/notes/placeholder-front.svg',back:n.back||'/assets/notes/placeholder-back.svg',status:'circulating',statusLabel:'Em circulação',source:cfg.source,material:cfg.material,imageSource:cfg.source,imageSourceUrl:cfg.page,imageStatus:n.imageStatus==='official-reproduction'?n.imageStatus:'source-verified'});
      if(currency==='CZK'&&cnbDims[value])n.dimensions=cnbDims[value];
    }
    return new Response(JSON.stringify(notes),{status:response.status,statusText:response.statusText,headers:{'Content-Type':'application/json; charset=utf-8'}});
  };
})();
