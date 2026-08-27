(() => {
  const commons=file=>'https://commons.wikimedia.org/wiki/Special:Redirect/file/'+encodeURIComponent(file);
  const PAGE='https://www.bnr.ro/764-bancnote-in-circulatie';
  const files={
    1:['1 leu. Romania, 2005 a.jpg','1 leu. Romania, 2005 b.jpg'],
    5:['5 lei. Romania, 2005 a.jpg','5 lei. Romania, 2005 b.jpg'],
    10:['10 lei. Romania, 2008 a.jpg','10 lei. Romania, 2008 b.jpg'],
    20:['20 lei. Romania, 2021 a.jpg','20 lei. Romania, 2021 b.jpg'],
    50:['50 lei. Romania, 2005 a.jpg','50 lei. Romania, 2005 b.jpg'],
    100:['100 lei. Romania, 2005 a.jpg','100 lei. Romania, 2005 b.jpg'],
    200:['200 lei. Romania, 2006 a.jpg','200 lei. Romania, 2006 b.jpg'],
    500:['500 lei. Romania, 2005 a.jpg','500 lei. Romania, 2005 b.jpg']
  };
  const dims={1:'120 × 62 mm',5:'127 × 67 mm',10:'133 × 72 mm',20:'136 × 77 mm',50:'140 × 77 mm',100:'147 × 82 mm',200:'150 × 82 mm',500:'153 × 82 mm'};
  const previousFetch=window.fetch.bind(window);
  window.fetch=async(...args)=>{
    const request=args[0],url=typeof request==='string'?request:request?.url||'';
    const response=await previousFetch(...args);
    if(!url.includes('/data/notes.json'))return response;
    const notes=await response.clone().json();
    Object.entries(files).forEach(([value,pair])=>{
      let n=notes.find(x=>x.currency==='RON'&&Number(x.value)===Number(value));
      if(!n){n={currency:'RON',value:Number(value)};notes.push(n);}
      Object.assign(n,{front:commons(pair[0]),back:commons(pair[1]),dimensions:dims[value],status:'circulating',statusLabel:'Em circulação',source:'Banca Națională a României',material:'Polímero',series:Number(value)===20?'Emissão 2021 · série atual':'Série atual',imageStatus:'reference-reproduction',imageSource:'Banca Națională a României / Wikimedia Commons',imageSourceUrl:PAGE});
    });
    return new Response(JSON.stringify(notes),{status:response.status,statusText:response.statusText,headers:{'Content-Type':'application/json; charset=utf-8'}});
  };
})();
