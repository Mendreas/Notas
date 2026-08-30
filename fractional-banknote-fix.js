(() => {
  const MAP={
    'KWD:0.25':{front:'/assets/notes/banknotews/kwd/0-front.jpg?v=117',back:'/assets/notes/banknotews/kwd/0-back.jpg?v=117',url:'https://www.banknote.ws/COLLECTION/countries/ASI/KUW/KUW0029.htm'},
    'KWD:0.5':{front:'/assets/notes/banknotews/kwd/1-front.jpg?v=117',back:'/assets/notes/banknotews/kwd/1-back.jpg?v=117',url:'https://www.banknote.ws/COLLECTION/countries/ASI/KUW/KUW0031.htm'},
    'BHD:0.5':{front:'/assets/notes/banknotews/bhd/0-front.jpg?v=117',back:'/assets/notes/banknotews/bhd/0-back.jpg?v=117',url:'https://www.banknote.ws/COLLECTION/countries/ASI/BHR/BHR0030.htm'},
    'OMR:0.1':{front:'/assets/notes/banknotews/omr/0-front.jpg?v=117',back:'/assets/notes/banknotews/omr/0-back.jpg?v=117',url:'https://www.banknote.ws/COLLECTION/countries/ASI/OMA/OMAW2020-100b.htm'},
    'OMR:0.5':{front:'/assets/notes/banknotews/omr/1-front.jpg?v=117',back:'/assets/notes/banknotews/omr/1-back.jpg?v=117',url:'https://www.banknote.ws/COLLECTION/countries/ASI/OMA/OMAW2020-500b.htm'},
    'KZT:500':{front:'/assets/notes/banknotews/kzt/500-front.jpg?v=118',back:'/assets/notes/banknotews/kzt/500-back.jpg?v=118',url:'https://www.banknote.ws/COLLECTION/countries/ASI/KAZ/KAZW0051.htm'},
    'KZT:1000':{front:'/assets/notes/banknotews/kzt/1000-front.jpg?v=118',back:'/assets/notes/banknotews/kzt/1000-back.jpg?v=118',url:'https://www.banknote.ws/COLLECTION/countries/ASI/KAZ/KAZW0052.htm'},
    'KZT:2000':{front:'/assets/notes/banknotews/kzt/2000-front.jpg?v=118',back:'/assets/notes/banknotews/kzt/2000-back.jpg?v=118',url:'https://www.banknote.ws/COLLECTION/countries/ASI/KAZ/KAZW0053.htm'},
    'KZT:5000':{front:'/assets/notes/banknotews/kzt/5000-front.jpg?v=118',back:'/assets/notes/banknotews/kzt/5000-back.jpg?v=118',url:'https://www.banknote.ws/COLLECTION/countries/ASI/KAZ/KAZW0054.htm'},
    'KZT:10000':{front:'/assets/notes/banknotews/kzt/10000-front.jpg?v=118',back:'/assets/notes/banknotews/kzt/10000-back.jpg?v=118',url:'https://www.banknote.ws/COLLECTION/countries/ASI/KAZ/KAZW0055.htm'},
    'KZT:20000':{front:'/assets/notes/banknotews/kzt/20000-front.jpg?v=118',back:'/assets/notes/banknotews/kzt/20000-back.jpg?v=118',url:'https://www.banknote.ws/COLLECTION/countries/ASI/KAZ/KAZW0049.htm'}
  };
  const previousFetch=window.fetch.bind(window);
  window.fetch=async(...args)=>{const req=args[0],url=typeof req==='string'?req:req?.url||'';const response=await previousFetch(...args);if(!url.includes('/data/notes.json'))return response;const data=await response.clone().json();for(const n of data){const m=MAP[`${n.currency}:${Number(n.value)}`];if(m)Object.assign(n,{front:m.front,back:m.back,imageStatus:'local-reference',imageSource:'Banknote Museum · banknote.ws',imageSourceUrl:m.url});}return new Response(JSON.stringify(data),{status:response.status,statusText:response.statusText,headers:{'Content-Type':'application/json; charset=utf-8'}})};
  window.__fractionalBanknoteMap=MAP;
})();
