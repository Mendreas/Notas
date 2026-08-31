(()=>{
 const sets={
  NAD:{values:[10,20,30,50,100,200],country:'Namíbia',source:'Bank of Namibia',url:'https://www.bon.com.na/Currency/Namibian-notes.aspx',material:'Papel'},
  BWP:{values:[10,20,50,100,200],country:'Botswana',source:'Bank of Botswana',url:'https://www.bankofbotswana.bw/notes-and-coins',material:'Papel'}
 };
 const oldFetch=window.fetch.bind(window);
 window.fetch=async(...args)=>{const req=args[0],url=typeof req==='string'?req:req?.url||'';const r=await oldFetch(...args);if(!url.includes('/data/notes.json'))return r;const notes=await r.clone().json();for(const [currency,c] of Object.entries(sets))for(const value of c.values){let n=notes.find(x=>x.currency===currency&&Number(x.value)===value);if(!n){n={currency,value};notes.push(n)}Object.assign(n,{status:'circulating',statusLabel:'Em circulação',source:c.source,material:c.material,imageSource:c.source,imageSourceUrl:c.url,officialUrl:c.url,officialLabel:`Ver ${currency} ${value} na fonte oficial`,imageStatus:'official-link',front:'/assets/notes/placeholder-front.svg',back:'/assets/notes/placeholder-back.svg'})}return new Response(JSON.stringify(notes),{status:r.status,statusText:r.statusText,headers:{'Content-Type':'application/json; charset=utf-8'}})};
})();