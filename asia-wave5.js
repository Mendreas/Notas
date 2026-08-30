(() => {
  const placeholder=(code,value)=>'data:image/svg+xml;charset=UTF-8,'+encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 320"><rect width="720" height="320" rx="18" fill="#0c1824"/><rect x="18" y="18" width="684" height="284" rx="14" fill="none" stroke="#526170" stroke-width="2"/><text x="360" y="118" text-anchor="middle" fill="#d7e2ea" font-family="Arial,sans-serif" font-size="42" font-weight="700">${code} ${value}</text><text x="360" y="175" text-anchor="middle" fill="#90a1ae" font-family="Arial,sans-serif" font-size="24">IMAGEM EM PREPARAÇÃO</text></svg>`);
  const countries=[
    {id:'SAU',name:'Arábia Saudita',flag:'🇸🇦',continent:'Asia',currency:'SAR',capital:'Riade',population:'≈ 35 milhões',language:'Árabe',history:[['1961–hoje','Rial saudita (SAR)']]},
    {id:'ARE',name:'Emirados Árabes Unidos',flag:'🇦🇪',continent:'Asia',currency:'AED',capital:'Abu Dhabi',population:'≈ 11 milhões',language:'Árabe',history:[['1973–hoje','Dirham dos EAU (AED)']]},
    {id:'QAT',name:'Qatar',flag:'🇶🇦',continent:'Asia',currency:'QAR',capital:'Doha',population:'≈ 3 milhões',language:'Árabe',history:[['1973–hoje','Rial do Qatar (QAR)']]}
  ];
  const cfg={
    SAR:{name:'Rial saudita',symbol:'﷼',group:'Arábia Saudita',source:'Saudi Central Bank',material:'Papel / polímero',notes:[5,10,50,100,500],countries:['SAU'],officialUrl:'https://www.sama.gov.sa/en-US/Currency/Pages/BankNotes.aspx',series:'Série atual · 2021–2024'},
    AED:{name:'Dirham dos Emirados Árabes Unidos',symbol:'د.إ',group:'Emirados Árabes Unidos',source:'Central Bank of the UAE',material:'Papel / polímero',notes:[5,10,20,50,100,200,500,1000],countries:['ARE'],officialUrl:'https://www.centralbank.ae/en/our-operations/currency-and-coins/',series:'Série atual · 2021–2026'},
    QAR:{name:'Rial do Qatar',symbol:'﷼',group:'Qatar',source:'Qatar Central Bank',material:'Papel',notes:[1,5,10,50,100,200,500],countries:['QAT'],officialUrl:'https://www.qcb.gov.qa/en/Pages/BankNotes.aspx',series:'Série atual · 2020–2026'}
  };
  const previousFetch=window.fetch.bind(window);
  window.fetch=async(...args)=>{const req=args[0],url=typeof req==='string'?req:req?.url||'';const response=await previousFetch(...args);
    if(url.includes('/data/countries.json')){const data=await response.clone().json();for(const c of countries){const old=data.find(x=>x.id===c.id);old?Object.assign(old,c):data.push(c)}return new Response(JSON.stringify(data),{status:response.status,statusText:response.statusText,headers:{'Content-Type':'application/json; charset=utf-8'}})}
    if(url.includes('/data/currencies.json')){const data=await response.clone().json();for(const [code,c] of Object.entries(cfg)){data[code]=Object.assign(data[code]||{},{name:c.name,symbol:c.symbol,group:c.group,source:c.source,rate:0,material:c.material,notes:c.notes,countries:c.countries,focus:false})}return new Response(JSON.stringify(data),{status:response.status,statusText:response.statusText,headers:{'Content-Type':'application/json; charset=utf-8'}})}
    if(url.includes('/data/notes.json')){const data=await response.clone().json();for(const [code,c] of Object.entries(cfg))for(const value of c.notes){let n=data.find(x=>x.currency===code&&Number(x.value)===value);if(!n){n={currency:code,value};data.push(n)}Object.assign(n,{front:placeholder(code,value),back:placeholder(code,value),status:'circulating',statusLabel:'Em circulação',source:c.source,material:c.material,series:c.series,imageStatus:'official-link',imageSource:c.source,imageSourceUrl:c.officialUrl,officialUrl:c.officialUrl,officialLabel:`Ver ${code} ${value} na fonte oficial`})}return new Response(JSON.stringify(data),{status:response.status,statusText:response.statusText,headers:{'Content-Type':'application/json; charset=utf-8'}})}
    return response;
  };
})();
