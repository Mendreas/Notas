(()=>{
 const palette={
  'North America':'#29445f','South America':'#355b57','Europe':'#3d4f6f',
  'Africa':'#6a5736','Asia':'#315b53','Oceania':'#36536d'
 };
 const muted='#13232f',active='#b7833e';
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
   const raw=String(feature.id),padded=raw.padStart(3,'0');
   const id=DB.isoMap?.[raw]||DB.isoMap?.[padded];
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
   const map=d3.select('#worldMap');
   map.selectAll('path.country-path').attr('fill',d=>{
     const c=knownCountry(d),geo=geoContinent(d);
     if(continent){
       if(c&&belongs(c,continent))return active;
       if(geo===continent)return palette[continent]||'#355065';
       return muted;
     }
     const cc=c?.continent||geo;
     return palette[cc]||muted;
   }).attr('opacity',d=>{
     if(!continent)return 1;
     const c=knownCountry(d),geo=geoContinent(d);
     return (c&&belongs(c,continent))||geo===continent?1:.30;
   }).attr('stroke','#0b1720').attr('stroke-width',0.55);
   map.selectAll('g.cont-label rect').attr('fill','#0c1823').attr('stroke','#3b5367').attr('opacity',0.94);
   map.selectAll('g.cont-label text').attr('fill','#eef5f8').attr('font-weight',700).attr('font-size',13);
 };
})();
