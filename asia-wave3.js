(() => {
  const placeholder=(code,value)=>'data:image/svg+xml;charset=UTF-8,'+encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 320"><rect width="720" height="320" rx="18" fill="#0c1824"/><rect x="18" y="18" width="684" height="284" rx="14" fill="none" stroke="#526170" stroke-width="2"/><text x="360" y="118" text-anchor="middle" fill="#d7e2ea" font-family="Arial,sans-serif" font-size="42" font-weight="700">${code} ${value}</text><text x="360" y="175" text-anchor="middle" fill="#90a1ae" font-family="Arial,sans-serif" font-size="24">IMAGEM EM PREPARAÇÃO</text></svg>`);
  const countries=[
    {id:'PAK',name:'Paquistão',flag:'🇵🇰',continent:'Asia',currency:'PKR',capital:'Islamabad',population:'≈ 255 milhões',language:'Urdu / Inglês',history:[['1948–hoje','Rupia paquistanesa (PKR)']]},
    {id:'MNG',name:'Mongólia',flag:'🇲🇳',continent:'Asia',currency:'MNT',capital:'Ulan Bator',population:'≈ 3,5 milhões',language:'Mongol',history:[['1925–hoje','Tögrög mongol (MNT)']]},
    {id:'KHM',name:'Camboja',flag:'🇰🇭',continent:'Asia',currency:'KHR',capital:'Phnom Penh',population:'≈ 18 milhões',language:'Khmer',history:[['1980–hoje','Riel cambojano (KHR)']]}
  ];
  const cfg={
    PKR:{name:'Rupia paquistanesa',symbol:'₨',group:'Paquistão',source:'State Bank of Pakistan',material:'Papel',notes:[10,20,50,100,500,1000,5000],countries:['PAK'],officialUrl:'https://www.sbp.org.pk/finance/BankNotes.asp',series:'Série atual · 2005–2026'},
    MNT:{name:'Tögrög mongol',symbol:'₮',group:'Mongólia',source:'Mongolbank',material:'Papel',notes:[50,100,500,1000,5000,10000,20000],countries:['MNG'],officialUrl:'https://www.mongolbank.mn/en/',series:'Com marcas tácteis · 2019–2025'},
    KHR:{name:'Riel cambojano',symbol:'៛',group:'Camboja',source:'National Bank of Cambodia',material:'Papel',notes:[100,200,500,1000,2000,5000,10000,20000],countries:['KHM'],officialUrl:'https://www.nbc.gov.kh/english/about_the_bank/banknotes.php',series:'Série atual · 2014–2022'}
  };
  const previousFetch=window.fetch.bind(window);
  window.fetch=async(...args)=>{const req=args[0],url=typeof req==='string'?req:req?.url||'';const response=await previousFetch(...args);
    if(url.includes('/data/countries.json')){const data=await response.clone().json();for(const c of countries){const old=data.find(x=>x.id===c.id);old?Object.assign(old,c):data.push(c)}return new Response(JSON.stringify(data),{status:response.status,statusText:response.statusText,headers:{'Content-Type':'application/json; charset=utf-8'}})}
    if(url.includes('/data/currencies.json')){const data=await response.clone().json();for(const [code,c] of Object.entries(cfg)){data[code]=Object.assign(data[code]||{},{name:c.name,symbol:c.symbol,group:c.group,source:c.source,rate:0,material:c.material,notes:c.notes,countries:c.countries,focus:false})}return new Response(JSON.stringify(data),{status:response.status,statusText:response.statusText,headers:{'Content-Type':'application/json; charset=utf-8'}})}
    if(url.includes('/data/notes.json')){const data=await response.clone().json();for(const [code,c] of Object.entries(cfg))for(const value of c.notes){let n=data.find(x=>x.currency===code&&Number(x.value)===value);if(!n){n={currency:code,value};data.push(n)}Object.assign(n,{front:placeholder(code,value),back:placeholder(code,value),status:'circulating',statusLabel:'Em circulação',source:c.source,material:c.material,series:c.series,imageStatus:'official-link',imageSource:c.source,imageSourceUrl:c.officialUrl,officialUrl:c.officialUrl,officialLabel:`Ver ${code} ${value} na fonte oficial`})}return new Response(JSON.stringify(data),{status:response.status,statusText:response.statusText,headers:{'Content-Type':'application/json; charset=utf-8'}})}
    return response;
  };
})();
