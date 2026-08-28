(() => {
  const placeholder=(code,value)=>'data:image/svg+xml;charset=UTF-8,'+encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 320"><rect width="720" height="320" rx="18" fill="#0c1824"/><rect x="18" y="18" width="684" height="284" rx="14" fill="none" stroke="#526170" stroke-width="2"/><text x="360" y="118" text-anchor="middle" fill="#d7e2ea" font-family="Arial,sans-serif" font-size="42" font-weight="700">${code} ${value}</text><text x="360" y="175" text-anchor="middle" fill="#90a1ae" font-family="Arial,sans-serif" font-size="24">IMAGEM NÃO INCORPORADA</text><text x="360" y="216" text-anchor="middle" fill="#6f8392" font-family="Arial,sans-serif" font-size="18">VER FONTE OFICIAL</text></svg>`);

  const countries=[
    {id:'LIE',name:'Liechtenstein',flag:'🇱🇮',continent:'Europe',currency:'CHF',capital:'Vaduz',population:'≈ 40 mil',language:'Alemão',history:[['1924–hoje','Franco suíço (CHF)']]},
    {id:'RUS',name:'Rússia',flag:'🇷🇺',continent:'Europe',currency:'RUB',capital:'Moscovo',population:'≈ 146 milhões',language:'Russo',history:[['1992–hoje','Rublo russo (RUB)']]},
    {id:'GEO',name:'Geórgia',flag:'🇬🇪',continent:'Europe',currency:'GEL',capital:'Tbilisi',population:'≈ 3,7 milhões',language:'Georgiano',history:[['1995–hoje','Lari georgiano (GEL)']]},
    {id:'ARM',name:'Arménia',flag:'🇦🇲',continent:'Europe',currency:'AMD',capital:'Erevã',population:'≈ 3,0 milhões',language:'Arménio',history:[['1993–hoje','Dram arménio (AMD)']]},
    {id:'AZE',name:'Azerbaijão',flag:'🇦🇿',continent:'Europe',currency:'AZN',capital:'Baku',population:'≈ 10,2 milhões',language:'Azeri',history:[['2006–hoje','Manat azeri atual (AZN)']]}
  ];

  const currencies={
    RUB:{name:'Rublo russo',symbol:'₽',group:'Rússia',source:'Bank of Russia',rate:91,material:'Papel',notes:[5,10,50,100,200,500,1000,2000,5000],countries:['RUS'],officialUrl:'https://www.cbr.ru/cash_circulation/banknotes/'},
    GEL:{name:'Lari georgiano',symbol:'₾',group:'Geórgia',source:'National Bank of Georgia',rate:3.2,material:'Papel',notes:[5,10,20,50,100],countries:['GEO'],officialUrl:'https://nbg.gov.ge/en/georgian-money/banknotes'},
    AMD:{name:'Dram arménio',symbol:'֏',group:'Arménia',source:'Central Bank of Armenia',rate:450,material:'Compósito / papel',notes:[1000,2000,5000,10000,20000,50000],countries:['ARM'],officialUrl:'https://www.cba.am/en/banknotes-in-circulation'},
    AZN:{name:'Manat azeri',symbol:'₼',group:'Azerbaijão',source:'Central Bank of the Republic of Azerbaijan',rate:1.99,material:'Papel',notes:[1,5,10,20,50,100,200],countries:['AZE'],officialUrl:'https://www.cbar.az/moneymarks/banknotes/index?category=1&language=en'}
  };

  const previousFetch=window.fetch.bind(window);
  window.fetch=async(...args)=>{
    const req=args[0],url=typeof req==='string'?req:req?.url||'';
    const response=await previousFetch(...args);

    if(url.includes('/data/countries.json')){
      const data=await response.clone().json();
      countries.forEach(c=>{if(!data.some(x=>x.id===c.id))data.push(c);});
      return new Response(JSON.stringify(data),{status:response.status,statusText:response.statusText,headers:{'Content-Type':'application/json; charset=utf-8'}});
    }

    if(url.includes('/data/currencies.json')){
      const data=await response.clone().json();
      if(data.CHF && !data.CHF.countries.includes('LIE')) data.CHF.countries.push('LIE');
      Object.entries(currencies).forEach(([code,c])=>{if(!data[code])data[code]={name:c.name,symbol:c.symbol,group:c.group,source:c.source,rate:c.rate,material:c.material,notes:c.notes,countries:c.countries,focus:false};});
      return new Response(JSON.stringify(data),{status:response.status,statusText:response.statusText,headers:{'Content-Type':'application/json; charset=utf-8'}});
    }

    if(url.includes('/data/notes.json')){
      const data=await response.clone().json();
      Object.entries(currencies).forEach(([code,c])=>c.notes.forEach(value=>{
        if(data.some(n=>n.currency===code&&Number(n.value)===Number(value))) return;
        data.push({currency:code,value:Number(value),front:placeholder(code,value),back:placeholder(code,value),status:'circulating',statusLabel:'Em circulação',source:c.source,material:c.material,imageStatus:'official-link',imageSource:c.source,imageSourceUrl:c.officialUrl,officialUrl:c.officialUrl,officialLabel:`Ver ${code} ${value} na fonte oficial`});
      }));
      return new Response(JSON.stringify(data),{status:response.status,statusText:response.statusText,headers:{'Content-Type':'application/json; charset=utf-8'}});
    }

    return response;
  };
})();
