(() => {
  const sets={
    SEK:{values:[20,50,100,200,500,1000],source:'Sveriges Riksbank',material:'Papel de algodão',page:'https://www.riksbank.se/en-gb/payments--cash/notes--coins/notes/valid-banknotes/'},
    PLN:{values:[10,20,50,100,200,500],source:'Narodowy Bank Polski',material:'Papel',page:'https://nbp.pl/en/coins-and-banknotes/banknotes/'},
    CZK:{values:[100,200,500,1000,2000,5000],source:'Czech National Bank',material:'Papel',page:'https://www.cnb.cz/en/banknotes-and-coins/banknotes/'},
    RON:{values:[1,5,10,20,50,100,200,500],source:'National Bank of Romania',material:'Polímero',page:'https://www.bnr.ro/Banknotes-and-coins-1332.aspx'}
  };
  const sek={
    20:['https://www.riksbank.se/contentassets/56def20a399b459bb15521a6a937af1c/20-kronorssedel-navigation-specimen-fram.png','https://www.riksbank.se/contentassets/56def20a399b459bb15521a6a937af1c/20-kronorssedel-navigation-specimen-bak.png'],
    50:['https://www.riksbank.se/contentassets/c2b34515579241d5a211fcfcd89f1dc9/50-kronorssedel-navigation-specimen-fram.png','https://www.riksbank.se/contentassets/c2b34515579241d5a211fcfcd89f1dc9/50-kronorssedel-navigation-specimen-bak.png'],
    100:['https://www.riksbank.se/contentassets/ec0fcae299064c80871e8ccf3aa8e89b/100-kronorssedel-specimen-fram.png','https://www.riksbank.se/contentassets/ec0fcae299064c80871e8ccf3aa8e89b/100-kronorssedel-specimen-bak.png'],
    200:['https://www.riksbank.se/contentassets/8bd04134e5c046b38232d355d9bb8a75/200-kronorssedel-specimen-fram.png','https://www.riksbank.se/contentassets/8bd04134e5c046b38232d355d9bb8a75/200-kronorssedel-specimen-bak.png'],
    500:['https://www.riksbank.se/contentassets/e6e9874c29a44edc96d38442e173865d/500-kronorssedel-specimen-fram.png','https://www.riksbank.se/contentassets/e6e9874c29a44edc96d38442e173865d/500-kronossedel-specimen-bak.png'],
    1000:['https://www.riksbank.se/contentassets/352d05bdefae4a7387f5bf27a795b4f2/1000-kronossedel-specimen-fram.png','https://www.riksbank.se/contentassets/352d05bdefae4a7387f5bf27a795b4f2/1000-kronosssedel-specimen-bak.png']
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
      const imgs=currency==='SEK'?sek[value]:null;
      Object.assign(n,{front:imgs?imgs[0]:(n.front||'/assets/notes/placeholder-front.svg'),back:imgs?imgs[1]:(n.back||'/assets/notes/placeholder-back.svg'),status:'circulating',statusLabel:'Em circulação',source:cfg.source,material:cfg.material,imageSource:cfg.source,imageSourceUrl:cfg.page,imageStatus:imgs?'official-reproduction':(n.imageStatus==='official-reproduction'?n.imageStatus:'source-verified')});
      if(currency==='CZK'&&cnbDims[value])n.dimensions=cnbDims[value];
    }
    return new Response(JSON.stringify(notes),{status:response.status,statusText:response.statusText,headers:{'Content-Type':'application/json; charset=utf-8'}});
  };
})();
