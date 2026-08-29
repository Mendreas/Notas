(() => {
  const VALUES=[100,200,500,1000,2000,10000,20000];
  const SOURCE='Banco Central de la República Argentina';
  const OFFICIAL='https://www.bcra.gob.ar/billetes-y-monedas-en-vigencia/';
  const previousFetch=window.fetch.bind(window);
  window.fetch=async(...args)=>{
    const req=args[0],url=typeof req==='string'?req:req?.url||'';
    const response=await previousFetch(...args);
    if(url.includes('/data/currencies.json')){
      const data=await response.clone().json();
      if(data.ARS){
        data.ARS.notes=[...VALUES];
        data.ARS.source=SOURCE;
        data.ARS.material='Papel';
      }
      return new Response(JSON.stringify(data),{status:response.status,statusText:response.statusText,headers:{'Content-Type':'application/json; charset=utf-8'}});
    }
    if(url.includes('/data/notes.json')){
      const data=await response.clone().json();
      VALUES.forEach(value=>{
        let n=data.find(x=>x.currency==='ARS'&&Number(x.value)===value);
        if(!n){n={currency:'ARS',value};data.push(n)}
        Object.assign(n,{
          front:`/assets/notes/ars/${value}-front.png`,
          back:`/assets/notes/ars/${value}-back.png`,
          status:'circulating',
          statusLabel:'Em circulação',
          source:SOURCE,
          material:'Papel',
          imageStatus:'local-source',
          imageSource:'Imagem fornecida pelo utilizador',
          imageSourceUrl:OFFICIAL,
          officialUrl:OFFICIAL,
          officialLabel:`Ver ARS ${value} na fonte oficial`
        });
      });
      return new Response(JSON.stringify(data),{status:response.status,statusText:response.statusText,headers:{'Content-Type':'application/json; charset=utf-8'}});
    }
    return response;
  };
})();