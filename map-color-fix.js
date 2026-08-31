(()=>{
 const currencyPalette=[
  '#7f78bd','#d79a6a','#9baa63','#ce7899','#67a89b','#d3aa4c',
  '#6e8bd5','#b06ca7','#57a6cf','#d28550','#78b18d','#a68b5b',
  '#bf719e','#73a8c5','#8f79ba','#d9b553','#5fa9a6','#c87b5a',
  '#88a76d','#a86fa0','#628bc2','#d89b58','#70a591','#b9826d'
 ];
 const muted='#13232f';
 const currencyOverrides={
  TLS:'USD',ECU:'USD',SLV:'USD',PAN:'USD',MHL:'USD',FSM:'USD',PLW:'USD',
  AND:'EUR',MCO:'EUR',SMR:'EUR',VAT:'EUR',MNE:'EUR',XKX:'EUR'
 };
 const numericIso3={
  '020':'AND','040':'AUT','056':'BEL','196':'CYP','233':'EST','246':'FIN','250':'FRA','276':'DEU','300':'GRC','372':'IRL','380':'ITA','428':'LVA','440':'LTU','442':'LUX','470':'MLT','492':'MCO','528':'NLD','620':'PRT','674':'SMR','703':'SVK','705':'SVN','724':'ESP','336':'VAT','499':'MNE',
  '840':'USA','626':'TLS','218':'ECU','222':'SLV','591':'PAN','584':'MHL','583':'FSM','585':'PLW','643':'RUS'
 };
 const euroMembers=new Set(['AND','AUT','BEL','HRV','CYP','EST','FIN','FRA','DEU','GRC','IRL','ITA','LVA','LTU','LUX','MLT','MCO','MNE','NLD','PRT','SMR','SVK','SVN','ESP','VAT','XKX']);
 const dollarUsers=new Set(['USA','TLS','ECU','SLV','PAN','MHL','FSM','PLW']);
 function featureCountryId(feature){const raw=String(feature.id||''),padded=raw.padStart(3,'0');return DB.isoMap?.[raw]||DB.isoMap?.[padded]||numericIso3[padded]||null}
 function knownCountry(feature){const id=featureCountryId(feature);return DB.countries?.find(c=>c.id===id)||null}
 function belongs(country,continent){if(!country)return false;if(country.id==='RUS')return continent==='Europe'||continent==='Asia';return country.continent===continent}
 function hash(value){const s=String(value||'');let h=2166136261;for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)}return h>>>0}
 function currencyCode(feature){const c=knownCountry(feature),id=c?.id||featureCountryId(feature);if(currencyOverrides[id])return currencyOverrides[id];if(euroMembers.has(id))return'EUR';if(dollarUsers.has(id))return'USD';return c?.currency||('COUNTRY-'+String(feature.id||''))}
 function countryColor(feature){return currencyPalette[hash(currencyCode(feature))%currencyPalette.length]}
 function tooltip(){let el=document.getElementById('mapCountryTooltip');if(el)return el;el=document.createElement('div');el.id='mapCountryTooltip';Object.assign(el.style,{position:'fixed',zIndex:'9999',pointerEvents:'none',display:'none',padding:'9px 11px',borderRadius:'10px',background:'rgba(7,16,26,.96)',border:'1px solid #536b7d',boxShadow:'0 10px 28px rgba(0,0,0,.35)',color:'#fff',fontSize:'13px',lineHeight:'1.35',backdropFilter:'blur(8px)'});document.body.appendChild(el);return el}
 function tooltipHtml(c){if(!c)return'';const cur=DB.currencies?.[c.currency];const currencyName=cur?.name||c.currency||'';return `<strong style="display:block;font-size:14px;margin-bottom:2px">${c.flag?c.flag+' ':''}${c.name}</strong><span style="color:#b9c8d3">${c.currency}${currencyName&&currencyName!==c.currency?' · '+currencyName:''}</span>`}
 const previous=window.renderWorldMap;if(typeof previous!=='function')return;
 window.renderWorldMap=async function(continent=null){
  await previous(continent);
  const map=d3.select('#worldMap'),tip=tooltip();
  map.selectAll('path.country-path')
   .attr('fill',d=>{const c=knownCountry(d);if(!continent)return countryColor(d);return c&&belongs(c,continent)?countryColor(d):muted})
   .attr('opacity',d=>{if(!continent)return 1;const c=knownCountry(d);return c&&belongs(c,continent)?1:.18})
   .attr('stroke',d=>{const c=knownCountry(d);return continent&&!(c&&belongs(c,continent))?'#263744':'#d4e0e6'})
   .attr('stroke-width',d=>{const c=knownCountry(d);return continent&&!(c&&belongs(c,continent))?0.45:0.62})
   .attr('stroke-opacity',d=>{const c=knownCountry(d);return continent&&!(c&&belongs(c,continent))?.45:.78})
   .style('cursor',d=>{const c=knownCountry(d);return c&&(!continent||belongs(c,continent))?'pointer':'default'})
   .on('mouseenter.mapui',function(event,d){const c=knownCountry(d),active=!continent||(c&&belongs(c,continent));if(!active)return;d3.select(this).raise().attr('stroke','#fff').attr('stroke-width',1.55).attr('stroke-opacity',1).style('filter','brightness(1.16) drop-shadow(0 0 4px rgba(255,255,255,.28))');if(c){tip.innerHTML=tooltipHtml(c);tip.style.display='block'}})
   .on('mousemove.mapui',function(event,d){const c=knownCountry(d),active=!continent||(c&&belongs(c,continent));if(!c||!active)return;tip.style.left=Math.min(window.innerWidth-tip.offsetWidth-12,event.clientX+14)+'px';tip.style.top=Math.min(window.innerHeight-tip.offsetHeight-12,event.clientY+14)+'px'})
   .on('mouseleave.mapui',function(event,d){const c=knownCountry(d),active=!continent||(c&&belongs(c,continent));if(active)d3.select(this).attr('stroke','#d4e0e6').attr('stroke-width',0.62).attr('stroke-opacity',0.78).style('filter',null);tip.style.display='none'});
  map.selectAll('g.cont-label rect').attr('fill','#0c1823').attr('stroke','#3b5367').attr('opacity',0.94);
  map.selectAll('g.cont-label text').attr('fill','#eef5f8').attr('font-weight',700).attr('font-size',13)
 };
 window.NOTAS_MAP_CURRENCY_CODE=currencyCode;
})();