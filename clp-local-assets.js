(() => {
  const VALUES=[1000,2000,5000,10000,20000];
  const SOURCE='Banco Central de Chile';
  const OFFICIAL='https://www.bcentral.cl/web/banco-central/areas/billetes-y-monedas';
  const previousFetch=window.fetch.bind(window);
  window.fetch=async(...args)=>{
    const req=args[0],url=typeof req==='string'?req:req?.url||'';
    const response=await previousFetch(...args);
    if(url.includes('/data/currencies.json')){
      const data=await response.clone().json();
      if(data.CLP){
        data.CLP.notes=[...VALUES];
        data.CLP.source=SOURCE;
        data.CLP.material='Polímero / papel de algodão';
      }
      return new Response(JSON.stringify(data),{status:response.status,statusText:response.statusText,headers:{'Content-Type':'application/json; charset=utf-8'}});
    }
    if(url.includes('/data/notes.json')){
      const data=await response.clone().json();
      VALUES.forEach(value=>{
        let n=data.find(x=>x.currency==='CLP'&&Number(x.value)===value);
        if(!n){n={currency:'CLP',value};data.push(n)}
        Object.assign(n,{
          front:`/assets/notes/clp/${value}-front.png`,
          back:`/assets/notes/clp/${value}-back.png`,
          status:'circulating',
          statusLabel:'Em circulação',
          source:SOURCE,
          material:value<=5000?'Polímero':'Papel de algodão',
          imageStatus:'local-source',
          imageSource:'Imagem fornecida pelo utilizador',
          imageSourceUrl:OFFICIAL,
          officialUrl:OFFICIAL,
          officialLabel:`Ver CLP ${value} na fonte oficial`
        });
      });
      return new Response(JSON.stringify(data),{status:response.status,statusText:response.statusText,headers:{'Content-Type':'application/json; charset=utf-8'}});
    }
    return response;
  };
})();
