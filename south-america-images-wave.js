(() => {
  const commons=(name)=>`https://commons.wikimedia.org/wiki/Special:Redirect/file/${encodeURIComponent(name)}?width=1200`;
  const images={
    VES:{
      50:[commons('50-Bolívares-anverso.jpg'),commons('50-Bolívares-reverso.jpg')]
    },
    GYD:{
      20:['https://bankofguyana.org.gy/bog/images/operations/banking/notescoins/20_fr3_small.jpg','https://bankofguyana.org.gy/bog/images/operations/banking/notescoins/20_bk3_small.jpg'],
      50:['https://bankofguyana.org.gy/bog/images/operations/banking/notescoins/50-specimen-front.jpg','https://bankofguyana.org.gy/bog/images/operations/banking/notescoins/50-specimen-back.jpg'],
      100:['https://bankofguyana.org.gy/bog/images/operations/banking/notescoins/100_front_specimen.jpg','https://bankofguyana.org.gy/bog/images/operations/banking/notescoins/100_back_specimen.jpg'],
      500:['https://bankofguyana.org.gy/bog/images/operations/banking/notescoins/500-front.jpg','https://bankofguyana.org.gy/bog/images/operations/banking/notescoins/500-back.jpg'],
      1000:['https://bankofguyana.org.gy/bog/images/operations/banking/notescoins/1000_2019_front.jpg','https://bankofguyana.org.gy/bog/images/operations/banking/notescoins/1000_2019_back.jpg'],
      2000:['https://bankofguyana.org.gy/bog/images/2000-frontsmall.png','https://bankofguyana.org.gy/bog/images/2000-backsmall.png'],
      5000:['https://bankofguyana.org.gy/bog/images/operations/banking/notescoins/5000-front.jpg','https://bankofguyana.org.gy/bog/images/operations/banking/notescoins/5000-back.jpg']
    }
  };
  const partial={
    SRD:{
      5:{front:commons('Suriname 5 Dollar observe.jpg')}
    }
  };
  const sources={
    VES:'https://commons.wikimedia.org/wiki/Category:Banknotes_of_Venezuela',
    GYD:'https://bankofguyana.org.gy/bog3/core-functions/issuance-of-currency/notes',
    SRD:'https://commons.wikimedia.org/wiki/File:Suriname_5_Dollar_observe.jpg'
  };
  const previousFetch=window.fetch.bind(window);
  window.fetch=async(...args)=>{
    const req=args[0],url=typeof req==='string'?req:req?.url||'';
    const response=await previousFetch(...args);
    if(!url.includes('/data/notes.json')) return response;
    const data=await response.clone().json();
    Object.entries(images).forEach(([code,values])=>Object.entries(values).forEach(([value,pair])=>{
      const n=data.find(x=>x.currency===code&&Number(x.value)===Number(value));
      if(!n)return;
      const official=code==='GYD';
      Object.assign(n,{front:pair[0],back:pair[1],imageStatus:official?'official-source':'commons-reusable',imageSource:official?'Bank of Guyana':'Wikimedia Commons',imageSourceUrl:sources[code]});
    }));
    Object.entries(partial).forEach(([code,values])=>Object.entries(values).forEach(([value,parts])=>{
      const n=data.find(x=>x.currency===code&&Number(x.value)===Number(value));
      if(!n)return;
      if(parts.front)n.front=parts.front;
      if(parts.back)n.back=parts.back;
      Object.assign(n,{imageStatus:'commons-reusable-partial',imageSource:'Wikimedia Commons',imageSourceUrl:sources[code]});
    }));
    return new Response(JSON.stringify(data),{status:response.status,statusText:response.statusText,headers:{'Content-Type':'application/json; charset=utf-8'}});
  };
})();