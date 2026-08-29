(() => {
  const commons=(name)=>`https://commons.wikimedia.org/wiki/Special:Redirect/file/${encodeURIComponent(name)}?width=1600`;
  const netlifyCrop=(source,position)=>`/.netlify/images?url=${encodeURIComponent(source)}&w=1200&h=540&fit=cover&position=${position}&fm=webp&q=90`;
  const vesPair=(name)=>{
    const source=commons(name);
    return [netlifyCrop(source,'top'),netlifyCrop(source,'bottom')];
  };
  const images={
    GYD:{
      20:['https://bankofguyana.org.gy/bog/images/operations/banking/notescoins/20_fr3_small.jpg','https://bankofguyana.org.gy/bog/images/operations/banking/notescoins/20_bk3_small.jpg'],
      50:['https://bankofguyana.org.gy/bog/images/operations/banking/notescoins/50-specimen-front.jpg','https://bankofguyana.org.gy/bog/images/operations/banking/notescoins/50-specimen-back.jpg'],
      100:['https://bankofguyana.org.gy/bog/images/operations/banking/notescoins/100_front_specimen.jpg','https://bankofguyana.org.gy/bog/images/operations/banking/notescoins/100_back_specimen.jpg'],
      500:['https://bankofguyana.org.gy/bog/images/operations/banking/notescoins/500_fr1_small.jpg','https://bankofguyana.org.gy/bog/images/operations/banking/notescoins/500_bk1_small.jpg'],
      1000:['https://bankofguyana.org.gy/bog/images/operations/banking/notescoins/1000_2019_front.jpg','https://bankofguyana.org.gy/bog/images/operations/banking/notescoins/1000_2019_back.jpg'],
      2000:['https://bankofguyana.org.gy/bog/images/2000-frontsmall.png','https://bankofguyana.org.gy/bog/images/2000-backsmall.png']
    },
    VES:{
      5:vesPair('Billete de 5 Bolívares.jpg'),
      10:vesPair('Billete de 10 Bolívares, Venezuela.jpg'),
      20:vesPair('Billete de 20 Bolìvares.jpg'),
      50:vesPair('Billete de 50 Bolìvares.jpg'),
      100:vesPair('Billete de 100 Bolìvares.jpg'),
      200:['/assets/notes/ves/200-front.jpg','/assets/notes/ves/200-back.jpg'],
      500:['/assets/notes/ves/500-front.jpg','/assets/notes/ves/500-back.jpg']
    }
  };
  const partial={
    SRD:{
      5:{front:commons('Suriname 5 Dollar observe.jpg')},
      20:{front:commons('20surinamedollar.jpg')}
    }
  };
  const sources={
    GYD:'https://bankofguyana.org.gy/bog3/core-functions/issuance-of-currency/notes',
    VES:'https://commons.wikimedia.org/wiki/Category:Banknotes_of_Venezuela',
    SRD:'https://commons.wikimedia.org/wiki/Category:Banknotes_of_Suriname'
  };
  const previousFetch=window.fetch.bind(window);
  window.fetch=async(...args)=>{
    const req=args[0],url=typeof req==='string'?req:req?.url||'';
    const response=await previousFetch(...args);
    if(!url.includes('/data/notes.json')) return response;
    const data=await response.clone().json();
    Object.entries(images).forEach(([code,values])=>Object.entries(values).forEach(([value,pair])=>{
      const n=data.find(x=>x.currency===code&&Number(x.value)===Number(value));
      if(!n)return;
      const isVes=code==='VES';
      const localVes=isVes&&(Number(value)===200||Number(value)===500);
      Object.assign(n,{front:pair[0],back:pair[1],imageStatus:localVes?'commons-reusable-local':isVes?'commons-reusable-cropped':'official-source',imageSource:isVes?'Wikimedia Commons · Rjcastillo · CC BY-SA 4.0':'Bank of Guyana',imageSourceUrl:sources[code]});
    }));
    Object.entries(partial).forEach(([code,values])=>Object.entries(values).forEach(([value,parts])=>{
      const n=data.find(x=>x.currency===code&&Number(x.value)===Number(value));
      if(!n)return;
      if(parts.front)n.front=parts.front;
      if(parts.back)n.back=parts.back;
      Object.assign(n,{imageStatus:'commons-reusable-partial',imageSource:'Wikimedia Commons',imageSourceUrl:sources[code]});
    }));
    return new Response(JSON.stringify(data),{status:response.status,statusText:response.statusText,headers:{'Content-Type':'application/json; charset=utf-8'}});
  };
})();