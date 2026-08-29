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
      2000:['https://bankofguyana.org.gy/bog/images/2000-frontsmall.png','https://bankofguyana.org.gy/bog/images/2000-backsmall.png'],
      5000:['/assets/notes/gyd/5000-front.png','/assets/notes/gyd/5000-back.png']
    },
    VES:{
      5:['/assets/notes/ves/5-front.jpg','/assets/notes/ves/5-back.jpg'],
      10:vesPair('Billete de 10 Bolívares, Venezuela.jpg'),
      20:vesPair('Billete de 20 Bolìvares.jpg'),
      50:vesPair('Billete de 50 Bolìvares.jpg'),
      100:vesPair('Billete de 100 Bolìvares.jpg'),
      200:['/assets/notes/ves/200-front.jpg','/assets/notes/ves/200-back.jpg'],
      500:['/assets/notes/ves/500-front.jpg','/assets/notes/ves/500-back.jpg']
    },
    SRD:{
      5:['/assets/notes/srd/5-front.jpg','/assets/notes/srd/5-back.jpg'],
      10:['/assets/notes/srd/10-front.jpg','/assets/notes/srd/10-back.jpg'],
      20:['/assets/notes/srd/20-front.jpg','/assets/notes/srd/20-back.jpg'],
      50:['/assets/notes/srd/50-front.jpg','/assets/notes/srd/50-back.jpg'],
      100:['/assets/notes/srd/100-front.jpg','/assets/notes/srd/100-back.jpg'],
      200:['/assets/notes/srd/200-front.jpg','/assets/notes/srd/200-back.jpg'],
      500:['/assets/notes/srd/500-front.jpg','/assets/notes/srd/500-back.jpg']
    },
    PEN:{
      10:['/assets/notes/pen/10-front.jpg','/assets/notes/pen/10-back.jpg'],
      20:['/assets/notes/pen/20-front.jpg','/assets/notes/pen/20-back.jpg'],
      50:['/assets/notes/pen/50-front.jpg','/assets/notes/pen/50-back.jpg'],
      100:['/assets/notes/pen/100-front.jpg','/assets/notes/pen/100-back.jpg'],
      200:['/assets/notes/pen/200-front.jpg','/assets/notes/pen/200-back.jpg']
    }
  };
  const sources={
    GYD:'https://bankofguyana.org.gy/bog3/core-functions/issuance-of-currency/notes',
    VES:'https://commons.wikimedia.org/wiki/Category:Banknotes_of_Venezuela',
    SRD:'https://www.cbvs.sr/financieel-systeem/munten-en-biljetten-in-circulatie',
    PEN:'https://www.bcrp.gob.pe/billetes-y-monedas/familia-de-billetes.html'
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
      const isLocalUser=['SRD','PEN'].includes(code);
      const localVes=isVes&&[5,200,500].includes(Number(value));
      const localGyd=code==='GYD'&&Number(value)===5000;
      Object.assign(n,{
        front:pair[0],back:pair[1],
        imageStatus:isLocalUser?'local-source':localVes?'commons-reusable-local':localGyd?'local-source':isVes?'commons-reusable-cropped':'official-source',
        imageSource:isLocalUser?'Imagem fornecida pelo utilizador':localGyd?'International Bank Note Society (IBNS)':isVes?'Wikimedia Commons · Rjcastillo · CC BY-SA 4.0':'Bank of Guyana',
        imageSourceUrl:isLocalUser?sources[code]:localGyd?'https://www.theibns.org/joomla/index.php?option=com_content&view=article&id=882&catid=13&Itemid=51':sources[code]
      });
    }));
    return new Response(JSON.stringify(data),{status:response.status,statusText:response.statusText,headers:{'Content-Type':'application/json; charset=utf-8'}});
  };
})();