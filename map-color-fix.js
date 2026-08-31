(()=>{
 const countryPalette=[
  '#7f78bd','#d79a6a','#9baa63','#ce7899','#67a89b','#d3aa4c',
  '#6e8bd5','#b06ca7','#57a6cf','#d28550','#78b18d','#a68b5b',
  '#bf719e','#73a8c5','#8f79ba','#d9b553','#5fa9a6','#c87b5a',
  '#88a76d','#a86fa0','#628bc2','#d89b58','#70a591','#b9826d'
 ];
 const muted='#13232f';
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
 function hash(value){
   const s=String(value||'');let h=2166136261;
   for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)}
   return h>>>0;
 }
 function countryColor(feature){
   const c=knownCountry(feature);
   const key=c?.id||String(feature.id||'');
   return countryPalette[hash(key)%countryPalette.length];
 }
 function tooltip(){
   let el=document.getElementById('mapCountryTooltip');
   if(el)return el;
   el=document.createElement('div');el.id='mapCountryTooltip';
   Object.assign(el.style,{position:'fixed',zIndex:'9999',pointerEvents:'none',display:'none',padding:'9px 11px',borderRadius:'10px',background:'rgba(7,16,26,.96)',border:'1px solid #536b7d',boxShadow:'0 10px 28px rgba(0,0,0,.35)',color:'#fff',fontSize:'13px',lineHeight:'1.35',backdropFilter:'blur(8px)'});
   document.body.appendChild(el);return el;
 }
 function tooltipHtml(c){
   if(!c)return '';
   const cur=DB.currencies?.[c.currency];
   const currencyName=cur?.name||c.currency||'';
   return `<strong style="display:block;font-size:14px;margin-bottom:2px">${c.flag?c.flag+' ':''}${c.name}</strong><span style="color:#b9c8d3">${c.currency}${currencyName&&currencyName!==c.currency?' · '+currencyName:''}</span>`;
 }
 const previous=window.renderWorldMap;
 if(typeof previous!=='function')return;
 window.renderWorldMap=async function(continent=null){
   await previous(continent);
   const map=d3.select('#worldMap'),tip=tooltip();
   const paths=map.selectAll('path.country-path')
    .attr('fill',d=>{
      const c=knownCountry(d),geo=geoContinent(d);
      if(!continent)return countryColor(d);
      return ((c&&belongs(c,continent))||geo===continent)?countryColor(d):muted;
    })
    .attr('opacity',d=>{
      if(!continent)return 1;
      const c=knownCountry(d),geo=geoContinent(d);
      return (c&&belongs(c,continent))||geo===continent?1:.22;
    })
    .attr('stroke','#d4e0e6').attr('stroke-width',0.62).attr('stroke-opacity',0.78)
    .style('cursor',d=>knownCountry(d)?'pointer':'default')
    .on('mouseenter.mapui',function(event,d){
      d3.select(this).raise().attr('stroke','#ffffff').attr('stroke-width',1.55).attr('stroke-opacity',1).style('filter','brightness(1.16) drop-shadow(0 0 4px rgba(255,255,255,.28))');
      const c=knownCountry(d);
      if(c){tip.innerHTML=tooltipHtml(c);tip.style.display='block'}
    })
    .on('mousemove.mapui',function(event,d){
      const c=knownCountry(d);if(!c)return;
      tip.style.left=Math.min(window.innerWidth-tip.offsetWidth-12,event.clientX+14)+'px';
      tip.style.top=Math.min(window.innerHeight-tip.offsetHeight-12,event.clientY+14)+'px';
    })
    .on('mouseleave.mapui',function(event,d){
      d3.select(this).attr('stroke','#d4e0e6').attr('stroke-width',0.62).attr('stroke-opacity',0.78).style('filter',null);
      tip.style.display='none';
    });
   map.selectAll('g.cont-label rect').attr('fill','#0c1823').attr('stroke','#3b5367').attr('opacity',0.94);
   map.selectAll('g.cont-label text').attr('fill','#eef5f8').attr('font-weight',700).attr('font-size',13);
 };
})();
