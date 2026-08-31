(()=>{
 const oldFetch=window.fetch.bind(window);
 window.fetch=async(...args)=>{
  const req=args[0],url=typeof req==='string'?req:req?.url||'';
  const r=await oldFetch(...args);
  if(!url.includes('/data/countries.json'))return r;
  const countries=await r.clone().json();
  let rus=countries.find(c=>c.id==='RUS'||c.currency==='RUB'||c.name==='Rússia');
  if(rus){rus.continent='Europe';rus.continents=['Europe','Asia'];rus.transcontinental=true;}
  return new Response(JSON.stringify(countries),{status:r.status,statusText:r.statusText,headers:{'Content-Type':'application/json; charset=utf-8'}});
 };
 window.NOTAS_CONTINENT_MATCH=(country,continent)=>Array.isArray(country?.continents)?country.continents.includes(continent):country?.continent===continent;
})();
