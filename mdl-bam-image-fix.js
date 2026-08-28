(() => {
  const commonsThumb=(file,width=1200)=>`https://commons.wikimedia.org/wiki/Special:Redirect/file/${encodeURIComponent(file)}?width=${width}`;
  const MDL={
    1:['1-Leu Moldawien 2010 obv 5280px-1200dpi.jpg','1-Leu Moldawien 2010 rev 5280px-1200dpi.jpg'],
    5:['MD 5 lei av.jpg','MD 5 lei rev.jpg'],
    10:['MD 10 lei av.jpg','MD 10 lei rev.jpg'],
    20:['MD 20 lei av.jpg','MD 20 lei rev.jpg'],
    50:['MD 50 lei av.jpg','MD 50 lei rev.jpg'],
    100:['MD 100 lei 2015 av.jpg','MD 100 lei 2015 rev.jpg'],
    200:['MD 200 lei av.jpg','MD 200 lei rev.jpg'],
    500:['MD 500 lei av.jpg','MD 500 lei rev.jpg'],
    1000:['MD 1000 lei av.jpg','MD 1000 lei rev.jpg']
  };
  const BAM200=['200 KM lice 2022 (BiH).jpg','200 KM naličje 2022 (BiH).jpg'];
  const previousFetch=window.fetch.bind(window);
  window.fetch=async(...args)=>{
    const req=args[0],url=typeof req==='string'?req:req?.url||'';
    const response=await previousFetch(...args);
    if(!url.includes('/data/notes.json')) return response;
    const notes=await response.clone().json();
    Object.entries(MDL).forEach(([value,[front,back]])=>{
      const n=notes.find(x=>x.currency==='MDL'&&Number(x.value)===Number(value));
      if(!n)return;
      Object.assign(n,{front:commonsThumb(front),back:commonsThumb(back),imageStatus:'reference-reproduction',imageSource:'National Bank of Moldova / Wikimedia Commons',imageSourceUrl:'https://www.bnm.md/en/content/banknotes'});
    });
    const bam=notes.find(x=>x.currency==='BAM'&&Number(x.value)===200);
    if(bam)Object.assign(bam,{front:commonsThumb(BAM200[0],1000),back:commonsThumb(BAM200[1],1000),imageStatus:'reference-reproduction',imageSource:'Central Bank of Bosnia and Herzegovina / Wikimedia Commons',imageSourceUrl:'https://www.cbbh.ba/Content/Read/659?title=200-KM---2002-and-2022-Issue'});
    return new Response(JSON.stringify(notes),{status:response.status,statusText:response.statusText,headers:{'Content-Type':'application/json; charset=utf-8'}});
  };
})();
