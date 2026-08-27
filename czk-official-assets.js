(() => {
  const values=[100,200,500,1000,2000,5000];
  const dims={100:'140 × 69 mm',200:'146 × 69 mm',500:'152 × 69 mm',1000:'158 × 74 mm',2000:'164 × 74 mm',5000:'170 × 74 mm'};
  const base='https://www.cnb.cz/export/sites/cnb/cs/bankovky-a-mince/.galleries/bankovky/galerie_obrazku/';
  const previousFetch=window.fetch.bind(window);
  window.fetch=async(...args)=>{
    const request=args[0],url=typeof request==='string'?request:request?.url||'';
    const response=await previousFetch(...args);
    if(!url.includes('/data/notes.json'))return response;
    const notes=await response.clone().json();
    for(const value of values){
      let n=notes.find(x=>x.currency==='CZK'&&Number(x.value)===value);
      if(!n){n={currency:'CZK',value};notes.push(n);}
      Object.assign(n,{
        front:`${base}${value}_lic.jpg`,
        back:`${base}${value}_rub.jpg`,
        status:'circulating',statusLabel:'Em circulação',source:'Czech National Bank',material:'Papel',
        dimensions:dims[value],imageStatus:'official-reproduction',imageSource:'Czech National Bank',
        imageSourceUrl:'https://www.cnb.cz/en/banknotes-and-coins/banknotes/'
      });
    }
    return new Response(JSON.stringify(notes),{status:response.status,statusText:response.statusText,headers:{'Content-Type':'application/json; charset=utf-8'}});
  };
})();
