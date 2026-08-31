(()=>{
 const palette={
  'North America':'#594665','South America':'#6c3f47','Europe':'#234a68',
  'Africa':'#77542a','Asia':'#24594f','Oceania':'#31506d'
 };
 const muted='#132431',active='#b57a32';
 function geoContinent(feature){
   try{
     const [lon,lat]=d3.geoCentroid(feature);
     if(lat<-60)return null;
     if(lon<-30)return lat>10?'North America':'South America';
     if(lon>110&&lat<5)return 'Oceania';
     if(lon>40)return 'Asia';
     if(lat<34)return 'Africa';
     return 'Europe';
   }catch(_){return null}
 }
 function knownCountry(feature){
   const id=DB.isoMap?.[String(+feature.id)];
   return DB.countries?.find(c=>c.id===id)||null;
 }
 function belongs(country,continent){
   if(!country)return false;
   return typeof window.NOTAS_CONTINENT_MATCH==='function'?window.NOTAS_CONTINENT_MATCH(country,continent):country.continent===continent;
 }
 const previous=window.renderWorldMap;
 if(typeof previous!=='function')return;
 window.renderWorldMap=async function(continent=null){
   await previous(continent);
   d3.select('#worldMap').selectAll('path.country-shape').attr('fill',d=>{
     const c=knownCountry(d),geo=geoContinent(d);
     if(continent){
       if(c&&belongs(c,continent))return active;
       if(!c&&geo===continent)return palette[continent]||'#28485a';
       return muted;
     }
     const cc=(c?.continents?.[0]||c?.continent||geo);
     return palette[cc]||muted;
   }).attr('opacity',d=>{
     if(!continent)return 1;
     const c=knownCountry(d),geo=geoContinent(d);
     return (c&&belongs(c,continent))||(!c&&geo===continent)?1:.35;
   });
 };
})();
