(() => {
  const commons=file=>'https://commons.wikimedia.org/wiki/Special:Redirect/file/'+encodeURIComponent(file);
  const pairs={
    'RSD:10':['10RSD Front.jpg','10RSD Reverse.jpg'],
    'RSD:20':['20RSD Front.jpg','20RSD Reverse.jpg'],
    'RSD:50':['50RSD Front.jpg','50RSD Reverse.jpg'],
    'RSD:100':['100RSD front.jpg','100RSD reverse.jpg'],
    'RSD:200':['200RSD Front.jpg','200RSD Reverse.jpg'],
    'RSD:500':['500RSD 2007 obverse.jpg','500RSD 2007 reverse.jpg'],
    'RSD:1000':['1000RSD front.jpg','1000RSD reverse.jpg'],
    'RSD:2000':['2000RSD front.jpg','2000RSD revers.jpg'],
    'RSD:5000':['5000 front.jpg','5000 back.jpg'],
    'MDL:1':['1 leu Moldova 2010 obverse.jpg','1 leu Moldova 2010 reverse.jpg'],
    'BYN:10':['10 Belarus 2009 front.jpg','10 Belarus 2009 back.jpg'],
    'BYN:20':['20 Belarus 2009 front.jpg','20 Belarus 2009 back.jpg'],
    'BYN:50':['50 Belarus 2009 front.jpg','50 Belarus 2009 back.jpg'],
    'BYN:100':['100 Belarus 2009 front.jpg','100 Belarus 2009 back.jpg'],
    'BYN:500':['500 Belarus 2009 front.jpg','500 Belarus 2009 back.jpg']
  };
  const previousFetch=window.fetch.bind(window);
  window.fetch=async(...args)=>{
    const request=args[0],url=typeof request==='string'?request:request?.url||'';
    const response=await previousFetch(...args);
    if(!url.includes('/data/notes.json'))return response;
    const notes=await response.clone().json();
    Object.entries(pairs).forEach(([key,[frontFile,backFile]])=>{
      const [currency,value]=key.split(':');
      const n=notes.find(x=>x.currency===currency&&Number(x.value)===Number(value));
      if(!n)return;
      Object.assign(n,{front:commons(frontFile),back:commons(backFile),imageStatus:'reference-reproduction',imageSource:'Wikimedia Commons · referência de circulação'});
    });
    return new Response(JSON.stringify(notes),{status:response.status,statusText:response.statusText,headers:{'Content-Type':'application/json; charset=utf-8'}});
  };
})();
