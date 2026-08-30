(() => {
  const values={
    KZT:[500,1000,2000,5000,10000,20000],
    KGS:[20,50,100,200,500,1000,5000],
    TJS:[10,20,50,100,200,500],
    TMT:[1,5,10,20,50,100],
    UZS:[1000,5000,10000,20000,50000,100000,200000]
  };
  const previousFetch=window.fetch.bind(window);
  window.fetch=async(...args)=>{
    const req=args[0],url=typeof req==='string'?req:req?.url||'';
    const response=await previousFetch(...args);
    if(!url.includes('/data/notes.json')) return response;
    const data=await response.clone().json();
    for(const n of data){
      const list=values[n.currency];
      const v=Number(n.value);
      if(!list || !list.includes(v)) continue;
      const c=n.currency.toLowerCase();
      n.front=`/assets/notes/banknotews/${c}/${v}-front.jpg?v=118`;
      n.back=`/assets/notes/banknotews/${c}/${v}-back.jpg?v=118`;
      n.imageStatus='local-reference';
      n.imageSource='Banknote Museum · banknote.ws';
    }
    return new Response(JSON.stringify(data),{status:response.status,statusText:response.statusText,headers:{'Content-Type':'application/json; charset=utf-8'}});
  };
})();
