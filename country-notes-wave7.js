(() => {
  const base='/.netlify/functions/official-source-image';
  const O={};
  const zarDims={10:'128 × 70 mm',20:'134 × 70 mm',50:'140 × 70 mm',100:'146 × 70 mm',200:'152 × 70 mm'};
  [10,20,50,100,200].forEach(v=>O[`ZAR:${v}`]={
    front:`${base}?source=resbank&file=R${v}_Front.jpg`,
    back:`${base}?source=resbank&file=R${v}_Back.jpg`,
    dimensions:zarDims[v],imageStatus:'official-reproduction',imageSource:'South African Reserve Bank',imageSourceUrl:'https://www.resbank.co.za/en/home/what-we-do/banknotes-and-coin/Use-of-banknotes'
  });

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
