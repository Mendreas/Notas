(() => {
  const placeholder=(code,value)=>'data:image/svg+xml;charset=UTF-8,'+encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 320"><rect width="720" height="320" rx="18" fill="#0c1824"/><rect x="18" y="18" width="684" height="284" rx="14" fill="none" stroke="#526170" stroke-width="2"/><text x="360" y="118" text-anchor="middle" fill="#d7e2ea" font-family="Arial,sans-serif" font-size="42" font-weight="700">${code} ${value}</text><text x="360" y="175" text-anchor="middle" fill="#90a1ae" font-family="Arial,sans-serif" font-size="24">IMAGEM EM PREPARAÇÃO</text></svg>`);
  const countries=[
    {id:'KWT',name:'Kuwait',flag:'🇰🇼',continent:'Asia',currency:'KWD',capital:'Cidade do Kuwait',population:'≈ 5 milhões',language:'Árabe',history:[['1961–hoje','Dinar kuwaitiano (KWD)']]},
    {id:'BHR',name:'Bahrain',flag:'🇧🇭',continent:'Asia',currency:'BHD',capital:'Manama',population:'≈ 1,6 milhões',language:'Árabe',history:[['1965–hoje','Dinar do Bahrain (BHD)']]},
    {id:'OMN',name:'Omã',flag:'🇴🇲',continent:'Asia',currency:'OMR',capital:'Mascate',population:'≈ 5 milhões',language:'Árabe',history:[['1973–hoje','Rial omanense (OMR)']]},
    {id:'JOR',name:'Jordânia',flag:'🇯🇴',continent:'Asia',currency:'JOD',capital:'Amã',population:'≈ 11 milhões',language:'Árabe',history:[['1950–hoje','Dinar jordaniano (JOD)']]}
  ];
  const cfg={
    KWD:{name:'Dinar kuwaitiano',symbol:'د.ك',group:'Kuwait',source:'Central Bank of Kuwait',material:'Papel',notes:[0.25,0.5,1,5,10,20],countries:['KWT'],officialUrl:'https://www.cbk.gov.kw/en/banknotes-and-coins/banknotes',series:'6.ª emissão · 2014–hoje'},
    BHD:{name:'Dinar do Bahrain',symbol:'د.ب',group:'Bahrain',source:'Central Bank of Bahrain',material:'Papel',notes:[0.5,1,5,10,20],countries:['BHR'],officialUrl:'https://www.cbb.gov.bh/currency/',series:'4.ª emissão · 2016–hoje'},
    OMR:{name:'Rial omanense',symbol:'ر.ع.',group:'Omã',source:'Central Bank of Oman',material:'Papel / polímero',notes:[0.1,0.5,1,5,10,20,50],countries:['OMN'],officialUrl:'https://cbo.gov.om/',series:'2020–2025'},
    JOD:{name:'Dinar jordaniano',symbol:'د.ا',group:'Jordânia',source:'Central Bank of Jordan',material:'Papel',notes:[1,5,10,20,50],countries:['JOR'],officialUrl:'https://www.cbj.gov.jo/',series:'5.ª emissão · 2022–2025'}
  };
  const previousFetch=window.fetch.bind(window);
  window.fetch=async(...args)=>{const req=args[0],url=typeof req==='string'?req:req?.url||'';const response=await previousFetch(...args);
    if(url.includes('/data/countries.json')){const data=await response.clone().json();for(const c of countries){const old=data.find(x=>x.id===c.id);old?Object.assign(old,c):data.push(c)}return new Response(JSON.stringify(data),{status:response.status,statusText:response.statusText,headers:{'Content-Type':'application/json; charset=utf-8'}})}
    if(url.includes('/data/currencies.json')){const data=await response.clone().json();for(const [code,c] of Object.entries(cfg)){data[code]=Object.assign(data[code]||{},{name:c.name,symbol:c.symbol,group:c.group,source:c.source,rate:0,material:c.material,notes:c.notes,countries:c.countries,focus:false})}return new Response(JSON.stringify(data),{status:response.status,statusText:response.statusText,headers:{'Content-Type':'application/json; charset=utf-8'}})}
    if(url.includes('/data/notes.json')){const data=await response.clone().json();for(const [code,c] of Object.entries(cfg))for(const value of c.notes){let n=data.find(x=>x.currency===code&&Number(x.value)===value);if(!n){n={currency:code,value};data.push(n)}Object.assign(n,{front:placeholder(code,value),back:placeholder(code,value),status:'circulating',statusLabel:'Em circulação',source:c.source,material:c.material,series:c.series,imageStatus:'official-link',imageSource:c.source,imageSourceUrl:c.officialUrl,officialUrl:c.officialUrl,officialLabel:`Ver ${code} ${value} na fonte oficial`})}return new Response(JSON.stringify(data),{status:response.status,statusText:response.statusText,headers:{'Content-Type':'application/json; charset=utf-8'}})}
    return response;
  };
})();
