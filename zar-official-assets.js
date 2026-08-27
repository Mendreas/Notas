(() => {
  const PAGE='https://www.resbank.co.za/en/home/what-we-do/banknotes-and-coin/Use-of-banknotes';
  const BASE='https://www.resbank.co.za/content/dam/sarb/what-we-do/banknotes-and-coin/distribution-images/';
  const dims={10:'128 × 70 mm',20:'134 × 70 mm',50:'140 × 70 mm',100:'146 × 70 mm',200:'152 × 70 mm'};
  const previousFetch=window.fetch.bind(window);
  window.fetch=async(...args)=>{
    const request=args[0],url=typeof request==='string'?request:request?.url||'';
    const response=await previousFetch(...args);
    if(!url.includes('/data/notes.json'))return response;
    const notes=await response.clone().json();
    [10,20,50,100,200].forEach(value=>{
      let n=notes.find(x=>x.currency==='ZAR'&&Number(x.value)===value);
      if(!n){n={currency:'ZAR',value};notes.push(n);}
      Object.assign(n,{
        front:`${BASE}R${value}_Front.jpg.coredownload.inline.jpeg`,
        back:`${BASE}R${value}_Back.jpg.coredownload.inline.jpeg`,
        dimensions:dims[value],status:'circulating',statusLabel:'Em circulação',
        source:'South African Reserve Bank',material:'Papel de algodão',series:'Upgraded Mandela series · 2023',
        imageStatus:'official-reproduction',imageSource:'South African Reserve Bank',imageSourceUrl:PAGE
      });
    });
    return new Response(JSON.stringify(notes),{status:response.status,statusText:response.statusText,headers:{'Content-Type':'application/json; charset=utf-8'}});
  };
})();
