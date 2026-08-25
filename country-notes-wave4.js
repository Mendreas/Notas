(() => {
  const O={
    'CAD:5':['https://www.bankofcanada.ca/wp-content/uploads/2015/09/5_front.png','https://www.bankofcanada.ca/wp-content/uploads/2015/09/5_back.png','152.4 × 69.85 mm'],
    'CAD:10':['https://www.bankofcanada.ca/wp-content/uploads/2015/09/10_front.png','https://www.bankofcanada.ca/wp-content/uploads/2015/09/10_back.png','152.4 × 69.85 mm'],
    'CAD:20':['https://www.bankofcanada.ca/wp-content/uploads/2015/09/20_front.png','https://www.bankofcanada.ca/wp-content/uploads/2015/09/20_back.png','152.4 × 69.85 mm'],
    'CAD:50':['https://www.bankofcanada.ca/wp-content/uploads/2015/09/50_front.png','https://www.bankofcanada.ca/wp-content/uploads/2015/09/50_back.png','152.4 × 69.85 mm'],
    'CAD:100':['https://www.bankofcanada.ca/wp-content/uploads/2015/09/100_front.png','https://www.bankofcanada.ca/wp-content/uploads/2015/09/100_back.png','152.4 × 69.85 mm'],
    'KRW:1000':['https://www.bok.or.kr/static/eng/img/cts/old/money_img46.jpg','https://www.bok.or.kr/static/eng/img/cts/old/money_img46-1.jpg','136 × 68 mm'],
    'KRW:5000':['https://www.bok.or.kr/static/eng/img/cts/old/money_img43.jpg','https://www.bok.or.kr/static/eng/img/cts/old/money_img43-1.jpg','142 × 68 mm'],
    'KRW:10000':['https://www.bok.or.kr/static/eng/img/cts/old/money_img40.jpg','https://www.bok.or.kr/static/eng/img/cts/old/money_img40-1.jpg','148 × 68 mm'],
    'KRW:50000':['https://www.bok.or.kr/static/eng/img/cts/old/money_five_img06.jpg','https://www.bok.or.kr/static/eng/img/cts/old/money_five_img07.jpg','154 × 68 mm']
  };
  const nativeFetch=window.fetch.bind(window);
  window.fetch=async(...args)=>{
    const req=args[0],url=typeof req==='string'?req:req?.url||'';
    const response=await nativeFetch(...args);
    if(!url.includes('/data/notes.json')) return response;
    const notes=await response.clone().json();
    const add=(currency,value,source,material)=>{if(!notes.some(n=>n.currency===currency&&Number(n.value)===value))notes.push({currency,value,front:'/assets/notes/placeholder-front.svg',back:'/assets/notes/placeholder-back.svg',status:'circulating',statusLabel:'Em circulação',source,material,imageStatus:'pending-official'});};
    [5,10,20,50,100].forEach(v=>add('CAD',v,'Bank of Canada','Polímero'));
    [1000,5000,10000,50000].forEach(v=>add('KRW',v,'Bank of Korea','Algodão'));
    for(const n of notes){const k=`${n.currency}:${n.value}`;if(O[k]){const [front,back,dimensions]=O[k];Object.assign(n,{front,back,dimensions,imageStatus:'official-reproduction',imageSource:n.currency==='CAD'?'Bank of Canada':'Bank of Korea',imageSourceUrl:n.currency==='CAD'?'https://www.bankofcanada.ca/banknotes/':'https://www.bok.or.kr/eng/main/contents.do?menuNo=400112'});}}
    return new Response(JSON.stringify(notes),{status:response.status,statusText:response.statusText,headers:{'Content-Type':'application/json; charset=utf-8'}});
  };
})();