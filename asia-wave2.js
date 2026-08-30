(() => {
  const placeholder=(code,value)=>'data:image/svg+xml;charset=UTF-8,'+encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 320"><rect width="720" height="320" rx="18" fill="#0c1824"/><rect x="18" y="18" width="684" height="284" rx="14" fill="none" stroke="#526170" stroke-width="2"/><text x="360" y="118" text-anchor="middle" fill="#d7e2ea" font-family="Arial,sans-serif" font-size="42" font-weight="700">${code} ${value}</text><text x="360" y="175" text-anchor="middle" fill="#90a1ae" font-family="Arial,sans-serif" font-size="24">IMAGEM EM PREPARAÇÃO</text></svg>`);
  const countries=[
    {id:'TWN',name:'Taiwan',flag:'🇹🇼',continent:'Asia',currency:'TWD',capital:'Taipé',population:'≈ 23 milhões',language:'Mandarim',history:[['1949–hoje','Novo dólar de Taiwan (TWD)']]},
    {id:'BGD',name:'Bangladesh',flag:'🇧🇩',continent:'Asia',currency:'BDT',capital:'Daca',population:'≈ 175 milhões',language:'Bengali',history:[['1972–hoje','Taka do Bangladesh (BDT)']]},
    {id:'LKA',name:'Sri Lanka',flag:'🇱🇰',continent:'Asia',currency:'LKR',capital:'Sri Jayawardenepura Kotte',population:'≈ 22 milhões',language:'Cingalês / Tâmil',history:[['1972–hoje','Rupia do Sri Lanka (LKR)']]},
    {id:'NPL',name:'Nepal',flag:'🇳🇵',continent:'Asia',currency:'NPR',capital:'Catmandu',population:'≈ 30 milhões',language:'Nepalês',history:[['1932–hoje','Rupia nepalesa (NPR)']]}
  ];
  const cfg={
    TWD:{name:'Novo dólar de Taiwan',symbol:'NT$',group:'Taiwan',source:'Central Bank of the Republic of China (Taiwan)',material:'Papel',notes:[100,200,500,1000,2000],countries:['TWN'],officialUrl:'https://www.cbc.gov.tw/en/',series:'Série atual'},
    BDT:{name:'Taka do Bangladesh',symbol:'৳',group:'Bangladesh',source:'Bangladesh Bank',material:'Papel',notes:[10,20,50,100,200,500,1000],countries:['BGD'],officialUrl:'https://www.bb.org.bd/',series:'Série 2025–2026'},
    LKR:{name:'Rupia do Sri Lanka',symbol:'Rs',group:'Sri Lanka',source:'Central Bank of Sri Lanka',material:'Papel',notes:[20,50,100,500,1000,5000],countries:['LKA'],officialUrl:'https://www.cbsl.gov.lk/en/notes-coins/notes-and-coins',series:'Development, Prosperity and Sri Lanka Dancers · 2010–presente'},
    NPR:{name:'Rupia nepalesa',symbol:'रू',group:'Nepal',source:'Nepal Rastra Bank',material:'Papel',notes:[5,10,20,50,100,500,1000],countries:['NPL'],officialUrl:'https://www.nrb.org.np/',series:'Mount Everest · emissões 2015–2025'}
  };
  const previousFetch=window.fetch.bind(window);
  window.fetch=async(...args)=>{const req=args[0],url=typeof req==='string'?req:req?.url||'';const response=await previousFetch(...args);
    if(url.includes('/data/countries.json')){const data=await response.clone().json();for(const c of countries){const old=data.find(x=>x.id===c.id);old?Object.assign(old,c):data.push(c)}return new Response(JSON.stringify(data),{status:response.status,statusText:response.statusText,headers:{'Content-Type':'application/json; charset=utf-8'}})}
    if(url.includes('/data/currencies.json')){const data=await response.clone().json();for(const [code,c] of Object.entries(cfg)){data[code]=Object.assign(data[code]||{},{name:c.name,symbol:c.symbol,group:c.group,source:c.source,rate:0,material:c.material,notes:c.notes,countries:c.countries,focus:false})}return new Response(JSON.stringify(data),{status:response.status,statusText:response.statusText,headers:{'Content-Type':'application/json; charset=utf-8'}})}
    if(url.includes('/data/notes.json')){const data=await response.clone().json();for(const [code,c] of Object.entries(cfg))for(const value of c.notes){let n=data.find(x=>x.currency===code&&Number(x.value)===value);if(!n){n={currency:code,value};data.push(n)}Object.assign(n,{front:placeholder(code,value),back:placeholder(code,value),status:'circulating',statusLabel:'Em circulação',source:c.source,material:c.material,series:c.series,imageStatus:'official-link',imageSource:c.source,imageSourceUrl:c.officialUrl,officialUrl:c.officialUrl,officialLabel:`Ver ${code} ${value} na fonte oficial`})}return new Response(JSON.stringify(data),{status:response.status,statusText:response.statusText,headers:{'Content-Type':'application/json; charset=utf-8'}})}
    return response;
  };
})();
