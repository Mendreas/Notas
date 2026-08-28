(() => {
  const commons=(name)=>`https://commons.wikimedia.org/wiki/Special:Redirect/file/${encodeURIComponent(name)}?width=1200`;
  const images={
    VES:{
      50:[commons('50-Bolívares-anverso.jpg'),commons('50-Bolívares-reverso.jpg')]
    }
  };
  const source='https://commons.wikimedia.org/wiki/Category:Banknotes_of_Venezuela';
  const previousFetch=window.fetch.bind(window);
  window.fetch=async(...args)=>{
    const req=args[0],url=typeof req==='string'?req:req?.url||'';
    const response=await previousFetch(...args);
    if(!url.includes('/data/notes.json')) return response;
    const data=await response.clone().json();
    Object.entries(images).forEach(([code,values])=>Object.entries(values).forEach(([value,pair])=>{
      const n=data.find(x=>x.currency===code&&Number(x.value)===Number(value));
      if(!n)return;
      Object.assign(n,{front:pair[0],back:pair[1],imageStatus:'commons-reusable',imageSource:'Wikimedia Commons',imageSourceUrl:source});
    }));
    return new Response(JSON.stringify(data),{status:response.status,statusText:response.statusText,headers:{'Content-Type':'application/json; charset=utf-8'}});
  };
})();