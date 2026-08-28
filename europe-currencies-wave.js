(() => {
  const enc=s=>encodeURIComponent(s);
  const commons=file=>'https://commons.wikimedia.org/wiki/Special:Redirect/file/'+enc(file);
  const placeholder=(code,value)=>'data:image/svg+xml;charset=UTF-8,'+encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 320"><rect width="720" height="320" rx="18" fill="#0c1824"/><rect x="18" y="18" width="684" height="284" rx="14" fill="none" stroke="#526170" stroke-width="2"/><text x="360" y="118" text-anchor="middle" fill="#d7e2ea" font-family="Arial,sans-serif" font-size="42" font-weight="700">${code} ${value}</text><text x="360" y="175" text-anchor="middle" fill="#90a1ae" font-family="Arial,sans-serif" font-size="24">IMAGEM NÃO INCORPORADA</text><text x="360" y="216" text-anchor="middle" fill="#6f8392" font-family="Arial,sans-serif" font-size="18">VER FONTE OFICIAL</text></svg>`);

  const countries=[
    {id:'HUN',name:'Hungria',flag:'🇭🇺',continent:'Europe',currency:'HUF',capital:'Budapeste',population:'≈ 9,6 milhões',language:'Húngaro',history:[["1946–hoje","Forint húngaro (HUF)"]]},
    {id:'ISL',name:'Islândia',flag:'🇮🇸',continent:'Europe',currency:'ISK',capital:'Reiquiavique',population:'≈ 0,4 milhões',language:'Islandês',history:[["1885–hoje","Coroa islandesa (ISK)"]]},
    {id:'SRB',name:'Sérvia',flag:'🇷🇸',continent:'Europe',currency:'RSD',capital:'Belgrado',population:'≈ 6,6 milhões',language:'Sérvio',history:[["2003–hoje","Dinar sérvio (RSD)"]]},
    {id:'ALB',name:'Albânia',flag:'🇦🇱',continent:'Europe',currency:'ALL',capital:'Tirana',population:'≈ 2,4 milhões',language:'Albanês',history:[["1926–hoje","Lek albanês (ALL)"]]},
    {id:'BIH',name:'Bósnia e Herzegovina',flag:'🇧🇦',continent:'Europe',currency:'BAM',capital:'Sarajevo',population:'≈ 3,2 milhões',language:'Bósnio / Croata / Sérvio',history:[["1998–hoje","Marco convertível (BAM)"]]},
    {id:'MKD',name:'Macedónia do Norte',flag:'🇲🇰',continent:'Europe',currency:'MKD',capital:'Skopje',population:'≈ 1,8 milhões',language:'Macedónio / Albanês',history:[["1992–hoje","Denar macedónio (MKD)"]]},
    {id:'MDA',name:'Moldávia',flag:'🇲🇩',continent:'Europe',currency:'MDL',capital:'Chișinău',population:'≈ 2,4 milhões',language:'Romeno',history:[["1993–hoje","Leu moldavo (MDL)"]]},
    {id:'UKR',name:'Ucrânia',flag:'🇺🇦',continent:'Europe',currency:'UAH',capital:'Kyiv',population:'≈ 37 milhões',language:'Ucraniano',history:[["1996–hoje","Hryvnia (UAH)"]]},
    {id:'BLR',name:'Bielorrússia',flag:'🇧🇾',continent:'Europe',currency:'BYN',capital:'Minsk',population:'≈ 9,1 milhões',language:'Bielorrusso / Russo',history:[["2016–hoje","Rublo bielorrusso atual (BYN)"]]}
  ];

  const currencyMeta={
    HUF:{name:'Forint húngaro',symbol:'Ft',group:'Hungria',source:'Magyar Nemzeti Bank',rate:395,material:'Papel',notes:[500,1000,2000,5000,10000,20000],countries:['HUN'],officialUrl:'https://www.mnb.hu/en/banknotes-and-coins/banknotes'},
    ISK:{name:'Coroa islandesa',symbol:'kr',group:'Islândia',source:'Seðlabanki Íslands',rate:143,material:'Papel',notes:[500,1000,2000,5000,10000],countries:['ISL'],officialUrl:'https://sedlabanki.is/greidslumidlun/sedlar-og-mynt/'},
    RSD:{name:'Dinar sérvio',symbol:'дин.',group:'Sérvia',source:'National Bank of Serbia',rate:117,material:'Papel',notes:[10,20,50,100,200,500,1000,2000,5000],countries:['SRB'],officialUrl:'https://www.nbs.rs/en/novac-i-placanja/novcanice/'},
    ALL:{name:'Lek albanês',symbol:'L',group:'Albânia',source:'Bank of Albania',rate:98,material:'Papel / polímero',notes:[200,500,1000,2000,5000,10000],countries:['ALB'],officialUrl:'https://www.bankofalbania.org/Currency/Banknotes_in_circulation/'},
    BAM:{name:'Marco convertível',symbol:'KM',group:'Bósnia e Herzegovina',source:'Central Bank of Bosnia and Herzegovina',rate:1.95583,material:'Papel',notes:[10,20,50,100,200],countries:['BIH'],officialUrl:'https://www.cbbh.ba/Content/Read/1252'},
    MKD:{name:'Denar macedónio',symbol:'ден',group:'Macedónia do Norte',source:'National Bank of the Republic of North Macedonia',rate:61.5,material:'Papel / polímero',notes:[10,50,100,200,500,1000,2000],countries:['MKD'],officialUrl:'https://www.nbrm.mk/knizhni_pari_vo_optiek-en.nspx'},
    MDL:{name:'Leu moldavo',symbol:'L',group:'Moldávia',source:'National Bank of Moldova',rate:20,material:'Papel',notes:[1,5,10,20,50,100,200,500,1000],countries:['MDA'],officialUrl:'https://www.bnm.md/en/content/banknotes'},
    UAH:{name:'Hryvnia ucraniana',symbol:'₴',group:'Ucrânia',source:'National Bank of Ukraine',rate:48,material:'Papel',notes:[20,50,100,200,500,1000],countries:['UKR'],officialUrl:'https://bank.gov.ua/en/uah/obig-banknote'},
    BYN:{name:'Rublo bielorrusso',symbol:'Br',group:'Bielorrússia',source:'National Bank of the Republic of Belarus',rate:4,material:'Papel',notes:[5,10,20,50,100,200,500],countries:['BLR'],officialUrl:'https://www.nbrb.by/engl/coinsbanknotes/banknotes'}
  };

  const noteDims={
    HUF:{500:'154 × 70 mm',1000:'154 × 70 mm',2000:'154 × 70 mm',5000:'154 × 70 mm',10000:'154 × 70 mm',20000:'154 × 70 mm'},
    ISK:{500:'145 × 70 mm',1000:'150 × 70 mm',2000:'150 × 70 mm',5000:'155 × 70 mm',10000:'162 × 70 mm'},
    RSD:{10:'131 × 62 mm',20:'135 × 64 mm',50:'139 × 66 mm',100:'143 × 68 mm',200:'147 × 70 mm',500:'147 × 70 mm',1000:'151 × 72 mm',2000:'155 × 74 mm',5000:'159 × 76 mm'},
    ALL:{200:'125 × 65 mm',500:'132 × 69 mm',1000:'139 × 69 mm',2000:'146 × 72 mm',5000:'153 × 72 mm',10000:'160 × 72 mm'},
    BAM:{10:'130 × 65 mm',20:'138 × 68 mm',50:'146 × 71 mm',100:'154 × 74 mm',200:'156 × 76 mm'},
    MKD:{10:'140 × 70 mm',50:'143 × 70 mm',100:'146 × 70 mm',200:'150 × 70 mm',500:'152 × 70 mm',1000:'154 × 74 mm',2000:'156 × 74 mm'},
    MDL:{1:'114 × 58 mm',5:'119 × 58 mm',10:'124 × 58 mm',20:'129 × 58 mm',50:'134 × 58 mm',100:'139 × 58 mm',200:'139 × 58 mm',500:'140 × 66 mm',1000:'150 × 66 mm'},
    UAH:{20:'130 × 69 mm',50:'136 × 72 mm',100:'142 × 75 mm',200:'148 × 75 mm',500:'154 × 75 mm',1000:'160 × 75 mm'},
    BYN:{5:'135 × 72 mm',10:'139 × 72 mm',20:'143 × 72 mm',50:'147 × 72 mm',100:'151 × 72 mm',200:'155 × 72 mm',500:'159 × 72 mm'}
  };

  const verifiedImages={
    'ALL:5000':{
      front:commons('Albania-5000-(July-2019)-front-600dpi.jpg'),
      back:commons('Albania-5000-(July-2019)-back-600dpi.jpg'),
      imageSource:'Bank of Albania / Wikimedia Commons',
      imageStatus:'reference-reproduction'
    }
  };

  function makeNote(code,value){
    const c=currencyMeta[code],img=verifiedImages[`${code}:${value}`];
    return {
      currency:code,value:Number(value),dimensions:noteDims[code]?.[value]||'',status:'circulating',statusLabel:'Em circulação',material:c.material,series:'Série atual',source:c.source,
      front:img?.front||placeholder(code,value),back:img?.back||placeholder(code,value),
      imageStatus:img?.imageStatus||'official-link',imageSource:img?.imageSource||c.source,imageSourceUrl:c.officialUrl,officialUrl:c.officialUrl,officialLabel:`Ver ${code} ${value} na fonte oficial`
    };
  }

  const previousFetch=window.fetch.bind(window);
  window.fetch=async(...args)=>{
    const request=args[0],url=typeof request==='string'?request:request?.url||'';
    const response=await previousFetch(...args);
    if(url.includes('/data/countries.json')){
      const data=await response.clone().json();
      countries.forEach(c=>{if(!data.some(x=>x.id===c.id))data.push(c)});
      return new Response(JSON.stringify(data),{status:response.status,statusText:response.statusText,headers:{'Content-Type':'application/json; charset=utf-8'}});
    }
    if(url.includes('/data/currencies.json')){
      const data=await response.clone().json();
      Object.entries(currencyMeta).forEach(([code,c])=>{if(!data[code])data[code]={name:c.name,symbol:c.symbol,group:c.group,source:c.source,rate:c.rate,material:c.material,notes:c.notes,countries:c.countries,focus:false};});
      return new Response(JSON.stringify(data),{status:response.status,statusText:response.statusText,headers:{'Content-Type':'application/json; charset=utf-8'}});
    }
    if(url.includes('/data/notes.json')){
      const data=await response.clone().json();
      Object.entries(currencyMeta).forEach(([code,c])=>c.notes.forEach(v=>{let n=data.find(x=>x.currency===code&&Number(x.value)===Number(v));const cfg=makeNote(code,v);if(n)Object.assign(n,cfg);else data.push(cfg);}));
      return new Response(JSON.stringify(data),{status:response.status,statusText:response.statusText,headers:{'Content-Type':'application/json; charset=utf-8'}});
    }
    return response;
  };
})();
