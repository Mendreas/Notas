(() => {
  const base='/.netlify/functions/official-source-image';
  const O={};
  const zarDims={10:'128 × 70 mm',20:'134 × 70 mm',50:'140 × 70 mm',100:'146 × 70 mm',200:'152 × 70 mm'};
  [10,20,50,100,200].forEach(v=>O[`ZAR:${v}`]={
    front:`${base}?source=resbank&file=R${v}_Front.jpg`,
    back:`${base}?source=resbank&file=R${v}_Back.jpg`,
    dimensions:zarDims[v],imageStatus:'official-reproduction',imageSource:'South African Reserve Bank',imageSourceUrl:'https://www.resbank.co.za/en/home/what-we-do/banknotes-and-coin/Use-of-banknotes'
  });

  const mx={
    20:'https://www.banxico.org.mx/billetes-y-monedas/billete-20-pesos-conmemorat.html',
    50:'https://www.banxico.org.mx/billetes-y-monedas/billete-50-pesos-familia-g.html',
    100:'https://www.banxico.org.mx/billetes-y-monedas/billete-100-pesos-familia-g.html',
    200:'https://www.banxico.org.mx/billetes-y-monedas/billete-200-pesos-familia-g.html',
    500:'https://www.banxico.org.mx/billetes-y-monedas/billete-500-pesos-familia-g-c.html',
    1000:'https://www.banxico.org.mx/billetes-y-monedas/billete-1000-pesos-familia-g.html'
  };
  const mxDims={20:'120 × 65 mm',50:'125 × 65 mm',100:'132 × 65 mm',200:'139 × 65 mm',500:'146 × 65 mm',1000:'153 × 65 mm'};
  for(const [v,page] of Object.entries(mx)) O[`MXN:${v}`]={
    front:`${base}?source=banxico&value=${v}&side=front&page=${encodeURIComponent(page)}`,
    back:`${base}?source=banxico&value=${v}&side=back&page=${encodeURIComponent(page)}`,
    dimensions:mxDims[v],imageStatus:'official-reproduction',imageSource:'Banco de México · Familia G',imageSourceUrl:page
  };

  const nativeFetch=window.fetch.bind(window);
  window.fetch=async(...args)=>{
    const req=args[0],url=typeof req==='string'?req:req?.url||'';
    const response=await nativeFetch(...args);
    if(!url.includes('/data/notes.json')) return response;
    const notes=await response.clone().json();
    for(const n of notes){const k=`${n.currency}:${n.value}`;if(O[k])Object.assign(n,O[k]);}
    return new Response(JSON.stringify(notes),{status:response.status,statusText:response.statusText,headers:{'Content-Type':'application/json; charset=utf-8'}});
  };
})();
