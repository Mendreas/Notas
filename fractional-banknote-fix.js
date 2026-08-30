(() => {
  const MAP={
    'KWD:0.25':{front:'/assets/notes/banknotews/kwd/0-front.jpg',back:'/assets/notes/banknotews/kwd/0-back.jpg',url:'https://www.banknote.ws/COLLECTION/countries/ASI/KUW/KUW0029.htm'},
    'KWD:0.5':{front:'/assets/notes/banknotews/kwd/1-front.jpg',back:'/assets/notes/banknotews/kwd/1-back.jpg',url:'https://www.banknote.ws/COLLECTION/countries/ASI/KUW/KUW0031.htm'},
    'BHD:0.5':{front:'/assets/notes/banknotews/bhd/0-front.jpg',back:'/assets/notes/banknotews/bhd/0-back.jpg',url:'https://www.banknote.ws/COLLECTION/countries/ASI/BHR/BHR0030.htm'},
    'OMR:0.1':{front:'/assets/notes/banknotews/omr/0-front.jpg',back:'/assets/notes/banknotews/omr/0-back.jpg',url:'https://www.banknote.ws/COLLECTION/countries/ASI/OMA/OMAW2020-100b.htm'},
    'OMR:0.5':{front:'/assets/notes/banknotews/omr/1-front.jpg',back:'/assets/notes/banknotews/omr/1-back.jpg',url:'https://www.banknote.ws/COLLECTION/countries/ASI/OMA/OMAW2020-500b.htm'}
  };
  const previousFetch=window.fetch.bind(window);
  window.fetch=async(...args)=>{const req=args[0],url=typeof req==='string'?req:req?.url||'';const response=await previousFetch(...args);if(!url.includes('/data/notes.json'))return response;const data=await response.clone().json();for(const n of data){const m=MAP[`${n.currency}:${Number(n.value)}`];if(m)Object.assign(n,{front:m.front,back:m.back,imageStatus:'local-reference',imageSource:'Banknote Museum · banknote.ws',imageSourceUrl:m.url});}return new Response(JSON.stringify(data),{status:response.status,statusText:response.statusText,headers:{'Content-Type':'application/json; charset=utf-8'}})};
})();
