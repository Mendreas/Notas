document.write('<script src="/africa-wave9.js?v=163"><\/script><script src="/note-context-africa3.js?v=164"><\/script><script src="/caribbean-wave1.js?v=165"><\/script>');
(() => {
  const nativeFetch=window.fetch.bind(window);
  const imported={
    BWP:new Set([20,50,100,200]),NAD:new Set([10,20,50,100,200]),ZAR:new Set([10,20,50,100,200]),MAD:new Set([20,50,100,200]),KES:new Set([50,100,200,500,1000]),EGP:new Set([5,50]),
    GMD:new Set([5,10,20,50,100,200]),SSP:new Set([1,5,10,25,50,100,500,1000]),LYD:new Set([1,5,10,20]),SOS:new Set([1000]),ZWG:new Set([10,20,50])
  };
  const commons=f=>'https://commons.wikimedia.org/wiki/Special:Redirect/file/'+encodeURIComponent(f);
  const egpFallback={
    10:[commons('10 EGP obverse 2014-8-13.jpg'),commons('10 EGP reverse 2014-8-13.jpg')],
    20:[commons('20 EGP 2022 Polymer - front 01.jpg'),commons('20 EGP 2022 Polymer - rear.jpg')],
    100:[commons('100 EGP obverse 2014-1-26.jpg'),commons('100 EGP reverse 2014-1-26.jpg')],
    200:[commons('200 EGP obverse 2010-1-2.jpg'),commons('200 EGP reverse 2010-1-2.jpg')]
  };
  const placeholderFront='/assets/notes/placeholder-front.svg',placeholderBack='/assets/notes/placeholder-back.svg';
  window.fetch=async(input,init)=>{
    const url=typeof input==='string'?input:input?.url||'';
    if(url.startsWith('https://api.frankfurter.app/latest?from=EUR')){
      return new Response(JSON.stringify({rates:{}}),{status:200,headers:{'Content-Type':'application/json'}});
    }
    const response=await nativeFetch(input,init);
    if(!url.includes('/data/notes.json'))return response;
    const notes=await response.clone().json();
    for(const n of notes){
      const value=Number(n.value),set=imported[n.currency];
      if(set?.has(value)){
        n.front=`/assets/notes/banknotews/${n.currency.toLowerCase()}/${value}-front.jpg`;
        n.back=`/assets/notes/banknotews/${n.currency.toLowerCase()}/${value}-back.jpg`;
        n.imageStatus='local-reference';
        n.imageSource='Bank Note Museum · cópia local';
      } else if(n.currency==='EGP'&&egpFallback[value]){
        [n.front,n.back]=egpFallback[value];
        n.imageStatus='public-domain';
        n.imageSource='Central Bank of Egypt / Wikimedia Commons';
      } else {
        if(/^https:\/\/www\.banknote\.ws\//i.test(n.front||''))n.front=placeholderFront;
        if(/^https:\/\/www\.banknote\.ws\//i.test(n.back||''))n.back=placeholderBack;
      }
    }
    return new Response(JSON.stringify(notes),{status:response.status,statusText:response.statusText,headers:{'Content-Type':'application/json; charset=utf-8'}});
  };
})();
