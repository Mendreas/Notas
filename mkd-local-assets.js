(() => {
  const sourceUrl='https://www.nbrm.mk/knizhni_pari_vo_optiek-en.nspx';
  const values=[10,50,100,200,500,1000,2000];
  const previousFetch=window.fetch.bind(window);
  window.fetch=async(...args)=>{
    const request=args[0],url=typeof request==='string'?request:request?.url||'';
    const response=await previousFetch(...args);
    if(!url.includes('/data/notes.json'))return response;
    const notes=await response.clone().json();
    values.forEach(value=>{
      const n=notes.find(x=>x.currency==='MKD'&&Number(x.value)===value);
      if(!n)return;
      Object.assign(n,{
        front:`/assets/mkd/${value}-front.webp`,
        back:`/assets/mkd/${value}-back.webp`,
        imageStatus:'official-source',
        imageSource:'National Bank of the Republic of North Macedonia',
        imageSourceUrl:sourceUrl,
        officialUrl:sourceUrl,
        officialLabel:`Ver MKD ${value} na fonte oficial`
      });
    });
    return new Response(JSON.stringify(notes),{status:response.status,statusText:response.statusText,headers:{'Content-Type':'application/json; charset=utf-8'}});
  };
})();
