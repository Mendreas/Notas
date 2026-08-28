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
    'BYN:10':['10 Belarus 2009 front.jpg','10 Belarus 2009 back.jpg'],
    'BYN:20':['20 Belarus 2009 front.jpg','20 Belarus 2009 back.jpg'],
    'BYN:50':['50 Belarus 2009 front.jpg','50 Belarus 2009 back.jpg'],
    'BYN:100':['100 Belarus 2009 front.jpg','100 Belarus 2009 back.jpg'],
    'BYN:500':['500 Belarus 2009 front.jpg','500 Belarus 2009 back.jpg'],
    'MDL:1':['1 leu Moldova 2010 obverse.jpg','1 leu Moldova 2010 reverse.jpg'],
    'HUF:500':['500 forint elolap.png','500 forint hatlap.png'],
    'HUF:1000':['HUF 1000 2018 obverse.png','HUF 1000 2018 reverse.png'],
    'HUF:2000':['2000 HUF 2017 ob.jpg','2000 HUF 2017 rev.jpg'],
    'HUF:5000':['5000 HUF 2017 ob.jpg','5000 HUF 2017 rev.jpg'],
    'HUF:10000':['10000 HUF 2014 ob.jpg','10000 HUF 2014 rev.jpg'],
    'HUF:20000':['20000 HUF 2015 ob.png','20000 HUF 2015 rev.png'],
    'ALL:1000':['ALBW2019-01000o.jpg','1000lek-768x383.png'],
    'ALL:10000':['ALBW2019-10000o.jpg','ALBW2019-10000r.jpg'],
    'UAH:20':['20 hryvnia 2018 front.jpg','20 hryvnia 2018 back.jpg'],
    'UAH:50':['50-uah-2019-1.png','50-uah-2019-2.png'],
    'UAH:100':['100 Ukrainian hryvnia in 2014 Obverse.jpg','100 Ukrainian hryvnia in 2014 Reverse.jpg'],
    'UAH:200':['200 hryvnia 2019 obverse.jpg','200 hryvnia 2019 reverse.jpg'],
    'UAH:500':['500 hryvnia 2015 obverse.jpg','500 hryvnia 2015 back.jpg'],
    'UAH:1000':['1000 UAH 2019 recto.png','1000 UAH 2019 verso.png']
  };
  const official={
    'ALL:200':['https://www.bankofalbania.org/rc/img/Albania_200_July_2019_front_600dpi_15271.jpg','https://www.bankofalbania.org/rc/img/Albania_200_July_2019_back_600dpi_15272.jpg'],
    'ALL:500':['https://www.bankofalbania.org/rc/img/ALB_500_R_CMJN_300_copy_20215.jpg','https://www.bankofalbania.org/rc/img/ALB_500_V_CMJN_300_copy_20216.jpg'],
    'ALL:2000':['https://www.bankofalbania.org/rc/img/Albania_2000_front_1200dpi_copy_20217.jpg','https://www.bankofalbania.org/rc/img/Albania_2000_back_1200dpi_copy_20218.jpg']
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
    Object.entries(official).forEach(([key,[front,back]])=>{
      const [currency,value]=key.split(':');
      const n=notes.find(x=>x.currency===currency&&Number(x.value)===Number(value));
      if(!n)return;
      Object.assign(n,{front,back,imageStatus:'official-source',imageSource:'Bank of Albania',imageSourceUrl:'https://www.bankofalbania.org/Currency/Banknotes_in_circulation/'});
    });
    return new Response(JSON.stringify(notes),{status:response.status,statusText:response.statusText,headers:{'Content-Type':'application/json; charset=utf-8'}});
  };
})();
