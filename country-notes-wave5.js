(() => {
  const commons=f=>'https://commons.wikimedia.org/wiki/Special:Redirect/file/'+encodeURIComponent(f);
  const O={
    'INR:10':['India new 10 INR, MG series, 2018, obverse.jpg','India new 10 INR, MG series, 2018, reverse.jpg','123 × 63 mm'],
    'INR:20':['India new 20 INR, MG series, 2019, obverse.jpg','India new 20 INR, MG series, 2019, reverse.jpg','129 × 63 mm'],
    'INR:50':['India new 50 INR, MG series, 2018, obverse.jpg','India new 50 INR, MG series, 2018, reverse.jpg','135 × 66 mm'],
    'INR:100':['100 rs note obverse.jpg','100 rs note reverse.jpg','142 × 66 mm'],
    'INR:200':['India, 200 INR, 2018, obverse.jpg','India, 200 INR, 2018, reverse.jpg','146 × 66 mm'],
    'INR:500':['India new 500 INR, MG series, 2016, obverse.jpg','India new 500 INR, MG series, 2016, reverse.jpg','150 × 66 mm']
  };
  const nativeFetch=window.fetch.bind(window);
  window.fetch=async(...args)=>{
    const req=args[0],url=typeof req==='string'?req:req?.url||'';
    const response=await nativeFetch(...args);
    if(!url.includes('/data/notes.json')) return response;
    const notes=await response.clone().json();
    for(const n of notes){
      const k=`${n.currency}:${n.value}`;
      if(O[k]){const [f,b,d]=O[k];Object.assign(n,{front:commons(f),back:commons(b),dimensions:d,imageStatus:'official-reproduction',imageSource:'Reserve Bank of India / Wikimedia Commons',imageSourceUrl:'https://www.rbi.org.in/'});}
    }
    return new Response(JSON.stringify(notes),{status:response.status,statusText:response.statusText,headers:{'Content-Type':'application/json; charset=utf-8'}});
  };
})();