(() => {
  const page='https://www.tcmb.gov.tr/wps/wcm/connect/EN/TCMB+EN/Main+Menu/Banknotes/Banknotes+in+Circulation+and+Their+Security+Features';
  const O={
    5:{front:'https://www.tcmb.gov.tr/wps/wcm/connect/e141cf1f-0a64-46d8-8e03-1881595fe91a/1/5%2BTL_E9_T7_onyuz_SPECIMEN.jpg?MOD=AJPERES',back:'https://www.tcmb.gov.tr/wps/wcm/connect/e141cf1f-0a64-46d8-8e03-1881595fe91a/2/5%2BTL_E9_T7_arkayuz_SPECIMEN.jpg?MOD=AJPERES',series:'E9 · VII Series · 19 Nov 2024',dimensions:'130 × 64 mm'},
    10:{front:'https://www.tcmb.gov.tr/wps/wcm/connect/09142395-87f5-4a14-8e04-e07d25aa8329/1/img.jpeg?MOD=AJPERES',back:'https://www.tcmb.gov.tr/wps/wcm/connect/09142395-87f5-4a14-8e04-e07d25aa8329/2/img.jpeg?MOD=AJPERES',series:'E9 · VII Series · 24 Feb 2025',dimensions:'136 × 64 mm'},
    20:{front:'https://www.tcmb.gov.tr/wps/wcm/connect/3f2610e6-d139-4aa8-bf55-c8765564ee0f/1/img.jpeg?MOD=AJPERES',back:'https://www.tcmb.gov.tr/wps/wcm/connect/3f2610e6-d139-4aa8-bf55-c8765564ee0f/2/img.jpeg?MOD=AJPERES',series:'E9 · VII Series · 22 Oct 2025',dimensions:'142 × 68 mm'},
    50:{front:'https://www.tcmb.gov.tr/wps/wcm/connect/9f509330-fd09-4451-844c-15520e80787a/1/E9_T8_50TL_onyuz_SPECIMEN.jpg?MOD=AJPERES',back:'https://www.tcmb.gov.tr/wps/wcm/connect/9f509330-fd09-4451-844c-15520e80787a/2/E9_T8_50TL_arkayuz_SPECIMEN.jpg?MOD=AJPERES',series:'E9 · VIII Series · 19 Nov 2024',dimensions:'148 × 68 mm'},
    100:{front:'https://www.tcmb.gov.tr/wps/wcm/connect/5dae4790-e422-4cb5-a6d6-1c3c2eaecea7/1/img.jpeg?MOD=AJPERES',back:'https://www.tcmb.gov.tr/wps/wcm/connect/5dae4790-e422-4cb5-a6d6-1c3c2eaecea7/2/img.jpeg?MOD=AJPERES',series:'E9 · VI Series · 24 Feb 2025',dimensions:'154 × 72 mm'},
    200:{front:'https://www.tcmb.gov.tr/wps/wcm/connect/59e46012-f0d7-4549-91fb-e463a716a156/1/E9%2BT8%2B200%2BTL%2Bon%2Byuz_specimen.jpg?MOD=AJPERES',back:'https://www.tcmb.gov.tr/wps/wcm/connect/59e46012-f0d7-4549-91fb-e463a716a156/2/E9%2BT8%2B200%2BTL%2Barka%2Byuz_specimen.jpg?MOD=AJPERES',series:'E9 · VIII Series · 5 Apr 2024',dimensions:'160 × 72 mm'}
  };
  const previousFetch=window.fetch.bind(window);
  window.fetch=async(...args)=>{
    const req=args[0],url=typeof req==='string'?req:req?.url||'';
    const response=await previousFetch(...args);
    if(!url.includes('/data/notes.json'))return response;
    const notes=await response.clone().json();
    for(const [value,cfg] of Object.entries(O)){
      let n=notes.find(x=>x.currency==='TRY'&&Number(x.value)===Number(value));
      if(!n){n={currency:'TRY',value:Number(value),status:'circulating',statusLabel:'Em circulação',source:'Central Bank of the Republic of Türkiye',material:'Papel'};notes.push(n);}
      Object.assign(n,cfg,{imageStatus:'official-reproduction',imageSource:'Central Bank of the Republic of Türkiye · SPECIMEN',imageSourceUrl:page});
    }
    return new Response(JSON.stringify(notes),{status:response.status,statusText:response.statusText,headers:{'Content-Type':'application/json; charset=utf-8'}});
  };
})();
