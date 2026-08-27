(() => {
  const PAGE='https://www.riksbank.se/en-gb/payments--cash/notes--coins/notes/valid-banknotes/';
  const base='/.netlify/functions/official-source-image';
  const overrides={
    "SEK:20":{front:"https://www.riksbank.se/contentassets/56def20a399b459bb15521a6a937af1c/20-kronorssedel-navigation-specimen-fram.png",back:"https://www.riksbank.se/contentassets/56def20a399b459bb15521a6a937af1c/20-kronorssedel-navigation-specimen-bak.png",dimensions:"120 × 66 mm"},
    "SEK:50":{front:"https://www.riksbank.se/contentassets/c2b34515579241d5a211fcfcd89f1dc9/50-kronorssedel-navigation-specimen-fram.png",back:"https://www.riksbank.se/contentassets/c2b34515579241d5a211fcfcd89f1dc9/50-kronorssedel-navigation-specimen-bak.png",dimensions:"126 × 66 mm"},
    "SEK:100":{front:"https://www.riksbank.se/contentassets/ec0fcae299064c80871e8ccf3aa8e89b/100-kronorssedel-specimen-fram.png",back:"https://www.riksbank.se/contentassets/ec0fcae299064c80871e8ccf3aa8e89b/100-kronorssedel-specimen-bak.png",dimensions:"133 × 66 mm"},
    "SEK:200":{front:"https://www.riksbank.se/contentassets/8bd04134e5c046b38232d355d9bb8a75/200-kronorssedel-specimen-fram.png",back:"https://www.riksbank.se/contentassets/8bd04134e5c046b38232d355d9bb8a75/200-kronorssedel-specimen-bak.png",dimensions:"140 × 66 mm"},
    "SEK:500":{front:"https://www.riksbank.se/contentassets/e6e9874c29a44edc96d38442e173865d/500-kronorssedel-specimen-fram.png",back:"https://www.riksbank.se/contentassets/e6e9874c29a44edc96d38442e173865d/500-kronorssedel-specimen-bak.png",dimensions:"147 × 66 mm"},
    "SEK:1000":{front:`${base}?source=riksbank&value=1000&side=front`,back:`${base}?source=riksbank&value=1000&side=back`,dimensions:"154 × 66 mm"}
  };
  const previousFetch=window.fetch.bind(window);
  window.fetch=async(...args)=>{
    const request=args[0],url=typeof request==='string'?request:request?.url||'';
    const response=await previousFetch(...args);
    if(!url.includes('/data/notes.json'))return response;
    const notes=await response.clone().json();
    notes.forEach(n=>{
      const x=overrides[`${n.currency}:${n.value}`];
      if(x)Object.assign(n,x,{status:'circulating',statusLabel:'Em circulação',source:'Sveriges Riksbank',material:'Papel de algodão',imageStatus:'official-reproduction',imageSource:'Sveriges Riksbank',imageSourceUrl:PAGE});
    });
    return new Response(JSON.stringify(notes),{status:response.status,statusText:response.statusText,headers:{'Content-Type':'application/json; charset=utf-8'}});
  };
})();
