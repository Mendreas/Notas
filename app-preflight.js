(() => {
  const nativeFetch=window.fetch.bind(window),B='https://www.banknote.ws/COLLECTION/countries/AFR';
  const M={
   ZAR:{10:'SAF/SAFW0148',20:'SAF/SAFW0149',50:'SAF/SAFW0150',100:'SAF/SAFW0151',200:'SAF/SAFW0152'},
   MAD:{20:'MRQ/MRQW0079',50:'MRQ/MRQW0080',100:'MRQ/MRQW0081',200:'MRQ/MRQW0082'},
   KES:{50:'KEN/KENW0052-2024',100:'KEN/KENW0053-2024',200:'KEN/KENW0054-2024',500:'KEN/KENW0055-2024',1000:'KEN/KENW0056-2024'},
   EGP:{5:'EGY/EGY0072',10:'EGY/EGYW2021-0010',20:'EGY/EGYW2021-0020',50:'EGY/EGY0075',100:'EGY/EGY0076',200:'EGY/EGY0077'},
   BWP:{10:'BOT/BOTW0036',20:'BOT/BOT0031',50:'BOT/BOT0032',100:'BOT/BOT0033',200:'BOT/BOT0034'},
   NAD:{10:'NAM/NAMW0020',20:'NAM/NAMW0021',30:'NAM/NAMW0018',50:'NAM/NAMW0022',100:'NAM/NAMW0023',200:'NAM/NAMW0024'}
  };
  window.fetch=async(input,init)=>{
    const url=typeof input==='string'?input:input?.url||'';
    if(url.startsWith('https://api.frankfurter.app/latest?from=EUR'))return new Response(JSON.stringify({rates:{}}),{status:200,headers:{'Content-Type':'application/json'}});
    const r=await nativeFetch(input,init);if(!url.includes('/data/notes.json'))return r;
    const notes=await r.clone().json();for(const n of notes){const stem=M[n.currency]?.[Number(n.value)];if(!stem)continue;n.front=`${B}/${stem}o.jpg`;n.back=`${B}/${stem}r.jpg`;n.imageStatus='museum-reference';n.imageSource='Bank Note Museum · banknote.ws';const pageStem=stem.replace(/-2024$/,'');n.imageSourceUrl=`${B}/${pageStem}.htm`;}
    return new Response(JSON.stringify(notes),{status:r.status,statusText:r.statusText,headers:{'Content-Type':'application/json; charset=utf-8'}});
  };
})();