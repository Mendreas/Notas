(() => {
  const placeholder=(code,value)=>'data:image/svg+xml;charset=UTF-8,'+encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 320"><rect width="720" height="320" rx="18" fill="#0c1824"/><rect x="18" y="18" width="684" height="284" rx="14" fill="none" stroke="#526170" stroke-width="2"/><text x="360" y="118" text-anchor="middle" fill="#d7e2ea" font-family="Arial,sans-serif" font-size="42" font-weight="700">${code} ${value}</text><text x="360" y="175" text-anchor="middle" fill="#90a1ae" font-family="Arial,sans-serif" font-size="24">IMAGEM EM PREPARAÇÃO</text></svg>`);
  const countries=[
    {id:'LAO',name:'Laos',flag:'🇱🇦',continent:'Asia',currency:'LAK',capital:'Vientiane',population:'≈ 8 milhões',language:'Lao',history:[['1955–hoje','Kip do Laos (LAK)']]},
    {id:'MMR',name:'Myanmar',flag:'🇲🇲',continent:'Asia',currency:'MMK',capital:'Naypyidaw',population:'≈ 55 milhões',language:'Birmanês',history:[['1952–hoje','Kyat de Myanmar (MMK)']]},
    {id:'BRN',name:'Brunei',flag:'🇧🇳',continent:'Asia',currency:'BND',capital:'Bandar Seri Begawan',population:'≈ 460 mil',language:'Malaio',history:[['1967–hoje','Dólar do Brunei (BND)']]}
  ];
  const cfg={
    LAK:{name:'Kip do Laos',symbol:'₭',group:'Laos',source:"Bank of the Lao P.D.R.",material:'Papel',notes:[1000,2000,5000,10000,20000,50000,100000],countries:['LAO'],officialUrl:'https://www.bol.gov.la/',series:'Emissões modernas em circulação'},
    MMK:{name:'Kyat de Myanmar',symbol:'K',group:'Myanmar',source:'Central Bank of Myanmar',material:'Papel',notes:[50,100,200,500,1000,5000,10000],countries:['MMR'],officialUrl:'https://www.cbm.gov.mm/',series:'Emissões modernas em circulação'},
    BND:{name:'Dólar do Brunei',symbol:'B$',group:'Brunei',source:'Brunei Darussalam Central Bank',material:'Polímero',notes:[1,5,10,20,50,100,500,1000],countries:['BRN'],officialUrl:'https://www.bdcb.gov.bn/currency/circulation',series:'Famílias em circulação · inclui nova série 2025'}
  };
  const previousFetch=window.fetch.bind(window);
  window.fetch=async(...args)=>{const req=args[0],url=typeof req==='string'?req:req?.url||'';const response=await previousFetch(...args);
    if(url.includes('/data/countries.json')){const data=await response.clone().json();for(const c of countries){const old=data.find(x=>x.id===c.id);old?Object.assign(old,c):data.push(c)}return new Response(JSON.stringify(data),{status:response.status,statusText:response.statusText,headers:{'Content-Type':'application/json; charset=utf-8'}})}
    if(url.includes('/data/currencies.json')){const data=await response.clone().json();for(const [code,c] of Object.entries(cfg)){data[code]=Object.assign(data[code]||{},{name:c.name,symbol:c.symbol,group:c.group,source:c.source,rate:0,material:c.material,notes:c.notes,countries:c.countries,focus:false})}return new Response(JSON.stringify(data),{status:response.status,statusText:response.statusText,headers:{'Content-Type':'application/json; charset=utf-8'}})}
    if(url.includes('/data/notes.json')){const data=await response.clone().json();for(const [code,c] of Object.entries(cfg))for(const value of c.notes){let n=data.find(x=>x.currency===code&&Number(x.value)===value);if(!n){n={currency:code,value};data.push(n)}Object.assign(n,{front:placeholder(code,value),back:placeholder(code,value),status:'circulating',statusLabel:'Em circulação',source:c.source,material:c.material,series:c.series,imageStatus:'official-link',imageSource:c.source,imageSourceUrl:c.officialUrl,officialUrl:c.officialUrl,officialLabel:`Ver ${code} ${value} na fonte oficial`})}return new Response(JSON.stringify(data),{status:response.status,statusText:response.statusText,headers:{'Content-Type':'application/json; charset=utf-8'}})}
    return response;
  };
})();
