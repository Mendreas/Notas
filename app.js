
const CONTINENTS = {
  "Europe": {name:"Europa", center:[18,54], scale:560},
  "Asia": {name:"Ásia", center:[90,37], scale:250},
  "Africa": {name:"África", center:[20,2], scale:350},
  "North America": {name:"América do Norte", center:[-105,45], scale:300},
  "South America": {name:"América do Sul", center:[-62,-18], scale:330},
  "Oceania": {name:"Oceania", center:[145,-25], scale:390}
};
const TOP10=["USD","EUR","GBP","JPY","CNY","CHF","CAD","AUD","SGD","HKD"];
const WORLD_LABELS=[["North America",-105,43],["South America",-62,-20],["Europe",16,51],["Africa",18,1],["Asia",90,33],["Oceania",145,-26]];
let DB={countries:[],currencies:{},notes:[],isoMap:{}}, state={world:null,continent:null,mapMode:"currency"};
let navHistory=[];
let restoringNav=false;
let favorites=new Set(JSON.parse(localStorage.getItem("ndm-favorites")||"[]"));
let compare=[];
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)], view=$("#view"), crumbs=$("#breadcrumbs");
async function init(){
 [DB.countries,DB.currencies,DB.notes,DB.isoMap]=await Promise.all([
   fetch("/data/countries.json").then(r=>r.json()),
   fetch("/data/currencies.json").then(r=>r.json()),
   fetch("/data/notes.json").then(r=>r.json()),
   fetch("/data/iso-map.json").then(r=>r.json())
 ]);
 bindChrome();showHome();refreshRates();
 if("serviceWorker" in navigator)navigator.serviceWorker.register("/service-worker.js").catch(()=>{});
}
function bindChrome(){
 window.addEventListener("popstate",()=>{ if(navHistory.length)goBack(); });
 $("#menuBtn").onclick=()=>$("#sidebar").classList.toggle("open");
 $$("[data-nav]").forEach(el=>el.onclick=()=>navigate(el.dataset.nav));
 $("#searchInput").addEventListener("input",search);
 document.addEventListener("click",e=>{if(e.target.matches("[data-close-modal]"))closeModal();if(e.target.matches("[data-close-viewer]"))closeImageViewer();if(!e.target.closest(".search-wrap"))$("#searchResults").classList.remove("show")});
 document.addEventListener("keydown",e=>{if(e.key==="Escape"){if(!$("#imageViewer").classList.contains("hidden"))closeImageViewer();else if(!$("#noteModal").classList.contains("hidden"))closeModal();}});
}

function currentLocation(){
  return {
    kind: state.currentKind || "home",
    id: state.currentId || null,
    continent: state.continent || null
  };
}
function rememberLocation(){
  if(restoringNav)return;
  const loc=currentLocation();
  const last=navHistory[navHistory.length-1];
  if(!last || JSON.stringify(last)!==JSON.stringify(loc)) navHistory.push(loc);
  if(navHistory.length>30)navHistory.shift();
}
function goBack(){
  const prev=navHistory.pop();
  if(!prev){showHome(true);return}
  restoringNav=true;
  if(prev.kind==="continent")showContinent(prev.id,true);
  else if(prev.kind==="country")showCountry(prev.id,true);
  else if(prev.kind==="currency")showCurrency(prev.id,true);
  else if(prev.kind==="countries")showCountries(true);
  else if(prev.kind==="notes")showAllNotes(true);
  else if(prev.kind==="exchange")showExchange(true);
  else if(prev.kind==="favorites")showFavorites(true);
  else showHome(true);
  restoringNav=false;
}
function backButton(label="Voltar"){
  return `<button class="ghost-btn app-back" data-app-back>← ${label}</button>`;
}
function bindBack(){
  $$("[data-app-back]").forEach(b=>b.onclick=goBack);
}
function setActive(name){$$(".nav-item").forEach(x=>x.classList.toggle("active",x.dataset.nav===name))}
function navigate(name){$("#sidebar").classList.remove("open");setActive(name);({home:showHome,countries:showCountries,notes:showAllNotes,exchange:showExchange,favorites:showFavorites,about:showAbout}[name]||showHome)()}
function key(code,val){return `${code}:${val}`}
function saveFav(){localStorage.setItem("ndm-favorites",JSON.stringify([...favorites]))}
function toggleFav(code,val,rerender=false){const k=key(code,val);favorites.has(k)?favorites.delete(k):favorites.add(k);saveFav();if(rerender)showFavorites();else{bindNoteCards();$$(`[data-fav="${k}"]`).forEach(b=>{b.classList.toggle("on",favorites.has(k));b.textContent=favorites.has(k)?"♥":"♡"})}}
function toggleCompare(code,val){
 const k=key(code,val),i=compare.indexOf(k);if(i>=0)compare.splice(i,1);else if(compare.length<3)compare.push(k);else return alert("Pode comparar até 3 notas.");
 updateCompareBar();$$(`[data-compare="${k}"]`).forEach(b=>b.classList.toggle("on",compare.includes(k)));
}
function updateCompareBar(){
 const bar=$("#compareBar");if(!compare.length){bar.classList.add("hidden");return}
 bar.classList.remove("hidden");bar.innerHTML=`<div class="compare-items">${compare.map(k=>{let [c,v]=k.split(":");return `<span class="compare-pill">${DB.currencies[c].symbol}${v} ${c}</span>`}).join("")}</div><button class="primary-btn" id="doCompare">Comparar ${compare.length}</button><button class="ghost-btn" id="clearCompare">Limpar</button>`;
 $("#clearCompare").onclick=()=>{compare=[];updateCompareBar();bindNoteCards()};$("#doCompare").onclick=showComparison;
}
function search(e){
 const q=e.target.value.trim().toLowerCase(),box=$("#searchResults");if(!q){box.classList.remove("show");return}
 let hits=[];DB.countries.forEach(c=>{if((c.name+" "+c.currency).toLowerCase().includes(q))hits.push({t:c.flag+" "+c.name,s:DB.currencies[c.currency].name,a:`country:${c.id}`})});
 Object.entries(DB.currencies).forEach(([code,c])=>{if((c.name+" "+code+" "+c.group).toLowerCase().includes(q))hits.push({t:`${c.symbol} ${c.name}`,s:code,a:`currency:${code}`})});
 DB.notes.forEach(n=>{let c=DB.currencies[n.currency];if(`${n.value} ${n.currency} ${c.name}`.toLowerCase().includes(q))hits.push({t:`${c.symbol}${n.value}`,s:`${c.name} · ${n.statusLabel}`,a:`note:${n.currency}:${n.value}`})});
 box.innerHTML=hits.slice(0,10).map(h=>`<div class="search-hit" data-action="${h.a}"><strong>${h.t}</strong><small>${h.s}</small></div>`).join("")||`<div class="search-hit">Sem resultados</div>`;box.classList.add("show");
 box.querySelectorAll("[data-action]").forEach(x=>x.onclick=()=>{box.classList.remove("show");$("#searchInput").value="";runAction(x.dataset.action)});
}
function runAction(a){const p=a.split(":");if(p[0]==="country")showCountry(p[1]);if(p[0]==="currency")showCurrency(p[1]);if(p[0]==="note")openNote(p[1],+p[2])}
function hero(t,s,actions=""){return `<div class="hero"><h1>${t}</h1><p>${s}</p>${actions?`<div class="action-row">${actions}</div>`:""}</div>`}
function metrics(){
 return `<div class="dashboard-strip"><div class="metric"><strong>${DB.countries.length}</strong><small>países na v0.2</small></div><div class="metric"><strong>${Object.keys(DB.currencies).length}</strong><small>moedas</small></div><div class="metric"><strong>${DB.notes.length}</strong><small>denominações</small></div><div class="metric"><strong>${favorites.size}</strong><small>favoritos</small></div></div>`;
}
function showHome(fromBack=false){
 if(!fromBack && state.currentKind)rememberLocation();
 state.currentKind="home";state.currentId=null;state.continent=null;crumbs.textContent="Mundo";setActive("home");
 view.innerHTML=hero("Explorar as notas do mundo","Navegue pelo mapa, moeda, país ou diretamente por uma denominação.",
 `<button class="primary-btn" id="randomNote">Descobrir uma nota</button><button class="ghost-btn" id="allNotesBtn">Ver todas as notas</button>`)+metrics()+
 `<div class="map-card"><svg id="worldMap"></svg><div class="map-toolbar"><button id="zoomIn">+</button><button id="zoomOut">−</button><button id="resetMap">⌂</button></div></div>
 <div class="section-head"><div><h2>10 moedas globais em destaque</h2><p>Seleção editorial baseada em relevância internacional, liquidez, reservas e comércio — não no valor nominal de 1 unidade.</p></div></div>
 <div class="currency-band">${TOP10.map(currencyCard).join("")}</div>
 <div class="section-head"><div><h2>Continentes</h2><p>As moedas partilhadas aparecem como uma única área monetária.</p></div></div>
 <div class="grid">${Object.entries(CONTINENTS).map(([k,c])=>`<div class="card" data-continent="${k}"><div class="card-topline"><h3>${c.name}</h3><span class="mini-badge">${new Set(DB.countries.filter(x=>x.continent===k).map(x=>x.currency)).size} moedas</span></div><p>${DB.countries.filter(x=>x.continent===k).length} países nesta versão</p></div>`).join("")}</div>`;
 $("#randomNote").onclick=randomNote;$("#allNotesBtn").onclick=showAllNotes;$$("[data-currency]").forEach(x=>x.onclick=()=>showCurrency(x.dataset.currency));$$("[data-continent]").forEach(x=>x.onclick=()=>showContinent(x.dataset.continent));renderWorldMap();
}
async function loadWorld(){if(state.world)return state.world;const topo=await fetch("https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json").then(r=>r.json());return state.world=topojson.feature(topo,topo.objects.countries)}
async function renderWorldMap(continent=null){
 const svg=d3.select("#worldMap");if(svg.empty())return;
 const card=$("#worldMap").closest(".map-card");
 if(card && !card.querySelector(".map-tooltip")) card.insertAdjacentHTML("beforeend",`<div class="map-tooltip" id="mapTooltip"></div>`);
 const tooltip=$("#mapTooltip");
 const w=$("#worldMap").clientWidth,h=$("#worldMap").clientHeight,world=await loadWorld();svg.selectAll("*").remove();

 let projection=d3.geoNaturalEarth1();
 if(continent){const cfg=CONTINENTS[continent];projection.translate([w/2,h/2]).scale(Math.min(w,h)*cfg.scale/500).center(cfg.center)}
 else projection.fitExtent([[25,25],[w-25,h-25]],world);

 const path=d3.geoPath(projection);
 const baseColor=d3.scaleOrdinal().domain([1,2,3,4,5,6]).range(["#6f9c7d","#b58d4c","#9c6aa8","#5f86b7","#bb754d","#5d9a8c"]);
 const currencyCodes=[...new Set(DB.countries.filter(c=>!continent||c.continent===continent).map(c=>c.currency))];
 const currencyPalette=["#53a6d8","#d58d52","#71b98e","#b379c2","#d2b34f","#7c8ee3","#dd6f79","#54b6b0","#a58d61","#8da86d","#c678a8","#6d9bc4","#d5966a","#7d73b8","#a7a35d","#5fba9b"];
 const curColor={};currencyCodes.forEach((c,i)=>curColor[c]=currencyPalette[i%currencyPalette.length]);

 const g=svg.append("g");
 const shapes=g.selectAll("path").data(world.features).join("path")
   .attr("class",d=>{
      const cid=DB.isoMap[String(+d.id)],known=DB.countries.some(c=>c.id===cid);
      return `country-shape ${known?"known clickable":""}`;
   })
   .attr("d",path)
   .attr("fill",(d,i)=>{
      const cid=DB.isoMap[String(+d.id)],country=DB.countries.find(c=>c.id===cid);
      if(country && (!continent || country.continent===continent)){
        return state.mapMode==="currency" ? curColor[country.currency] : "#4f82b8";
      }
      return continent ? "#263746" : baseColor(i%6+1);
   })
   .attr("opacity",d=>{
      const cid=DB.isoMap[String(+d.id)],country=DB.countries.find(c=>c.id===cid);
      if(!continent) return 1;
      if(country && country.continent===continent) return 1;
      return .33;
   })
   .on("mousemove",(ev,d)=>{
      const cid=DB.isoMap[String(+d.id)],country=DB.countries.find(c=>c.id===cid);
      if(!country || (continent && country.continent!==continent)){tooltip.style.display="none";return}
      const cur=DB.currencies[country.currency];
      tooltip.innerHTML=state.mapMode==="currency"
        ? `<strong>${cur.symbol} ${cur.name}</strong><span>${country.flag} ${country.name} · clicar abre a área monetária</span>`
        : `<strong>${country.flag} ${country.name}</strong><span>${cur.name} · clicar abre o país</span>`;
      const rect=card.getBoundingClientRect();tooltip.style.display="block";
      tooltip.style.left=Math.min(rect.width-230,Math.max(10,ev.clientX-rect.left+12))+"px";
      tooltip.style.top=Math.min(rect.height-70,Math.max(10,ev.clientY-rect.top+12))+"px";
   })
   .on("mouseleave",()=>{if(tooltip)tooltip.style.display="none"})
   .on("click",(ev,d)=>{
      const cid=DB.isoMap[String(+d.id)],country=DB.countries.find(c=>c.id===cid);
      if(!country || (continent && country.continent!==continent))return;
      state.mapMode==="currency" ? showCurrency(country.currency) : showCountry(country.id);
   });

 if(!continent){
   const labels=g.selectAll("g.label").data(WORLD_LABELS).join("g").attr("class","continent-label")
     .attr("transform",d=>{const p=projection([d[1],d[2]]);return `translate(${p[0]},${p[1]})`})
     .on("click",(_,d)=>showContinent(d[0]));
   labels.append("rect").attr("x",-72).attr("y",-17).attr("width",144).attr("height",34).attr("rx",17);
   labels.append("text").attr("text-anchor","middle").attr("dy","5").text(d=>CONTINENTS[d[0]].name);
 }

 let z=1;
 $("#zoomIn").onclick=()=>{z=Math.min(4,z*1.25);g.attr("transform",`translate(${w*(1-z)/2},${h*(1-z)/2}) scale(${z})`)};
 $("#zoomOut").onclick=()=>{z=Math.max(.7,z/1.25);g.attr("transform",`translate(${w*(1-z)/2},${h*(1-z)/2}) scale(${z})`)};
 $("#resetMap").onclick=()=>continent?showContinent(continent):showHome();
}
function currencyCard(code){const c=DB.currencies[code],ct=DB.countries.filter(x=>x.currency===code);return `<div class="card currency-card" data-currency="${code}"><div class="card-topline"><span class="big-symbol">${c.symbol}</span><span class="mini-badge">${code}</span></div><h3>${c.group}</h3><p>${c.name}</p><small>${ct.length} país(es) · ${c.notes.length} denominações</small></div>`}
function countryCard(c){return `<div class="card" data-country="${c.id}"><div class="card-topline"><span class="flag">${c.flag}</span><span class="mini-badge">${c.currency}</span></div><h3>${c.name}</h3><p>${DB.currencies[c.currency].name}</p></div>`}
function showContinent(k,fromBack=false){
 if(!fromBack)rememberLocation();
 state.currentKind="continent";state.currentId=k;state.continent=k;crumbs.textContent=`Mundo › ${CONTINENTS[k].name}`;setActive("home");
 const cs=DB.countries.filter(c=>c.continent===k),codes=[...new Set(cs.map(c=>c.currency))];
 view.innerHTML=`<div class="section-head"><div><h2>${CONTINENTS[k].name}</h2><p>${cs.length} países · ${codes.length} áreas monetárias nesta versão.</p></div><button class="ghost-btn" id="backWorld">← Mundo</button></div>
 <div class="section-head" style="margin-top:4px"><div><h3 style="margin:0">Como quer ver o mapa?</h3><p>Países abre a ficha nacional; Moedas agrupa os países que partilham a mesma moeda.</p></div>
 <div class="map-mode-switch"><button id="modeCountries" class="${state.mapMode==="country"?"active":""}">Países</button><button id="modeCurrencies" class="${state.mapMode==="currency"?"active":""}">Moedas</button></div></div>
 <div class="map-card" style="height:46vh;min-height:350px"><svg id="worldMap"></svg><div class="map-toolbar"><button id="zoomIn">+</button><button id="zoomOut">−</button><button id="resetMap">⌂</button></div><div class="map-hint">${state.mapMode==="currency"?"Mesma cor = mesma moeda · toque num país para abrir a moeda":"Toque num país para abrir a ficha do país"}</div></div>
 <div class="map-legend">${codes.map((code,i)=>{const c=DB.currencies[code];return `<span class="legend-chip" data-currency="${code}"><span class="legend-dot" style="background:${["#53a6d8","#d58d52","#71b98e","#b379c2","#d2b34f","#7c8ee3","#dd6f79","#54b6b0","#a58d61","#8da86d","#c678a8","#6d9bc4","#d5966a","#7d73b8","#a7a35d","#5fba9b"][i%16]}"></span>${code} · ${c.name}</span>`}).join("")}</div>
 <div class="section-head"><div><h2>Áreas monetárias</h2><p>Os países que usam a mesma moeda são tratados como um grupo.</p></div></div><div class="currency-band">${codes.map(currencyCard).join("")}</div>
 <div class="section-head"><div><h2>Países</h2><p>Lista individual — útil para entrar na história monetária de cada país.</p></div></div><div class="grid">${cs.map(countryCard).join("")}</div>`;

 $("#backWorld").onclick=goBack;
 $("#modeCountries").onclick=()=>{state.mapMode="country";showContinent(k)};
 $("#modeCurrencies").onclick=()=>{state.mapMode="currency";showContinent(k)};
 $$("[data-currency]").forEach(x=>x.onclick=()=>showCurrency(x.dataset.currency));
 $$("[data-country]").forEach(x=>x.onclick=()=>showCountry(x.dataset.country));
 renderWorldMap(k);
}
function showCountries(fromBack=false){
 if(!fromBack)rememberLocation();state.currentKind="countries";state.currentId=null;
 crumbs.textContent="Países";setActive("countries");
 view.innerHTML=hero("Países","Selecione um país para abrir a ficha monetária.")+`<div class="filter-panel"><input id="countryFilter" placeholder="Filtrar países…"><select id="continentFilter"><option value="">Todos os continentes</option>${Object.entries(CONTINENTS).map(([k,v])=>`<option value="${k}">${v.name}</option>`).join("")}</select><select id="currencyFilter"><option value="">Todas as moedas</option>${Object.keys(DB.currencies).map(c=>`<option>${c}</option>`).join("")}</select></div><div id="countryGrid"></div>`;
 const render=()=>{const q=$("#countryFilter").value.toLowerCase(),co=$("#continentFilter").value,cu=$("#currencyFilter").value,items=DB.countries.filter(c=>(!q||c.name.toLowerCase().includes(q))&&(!co||c.continent===co)&&(!cu||c.currency===cu));$("#countryGrid").innerHTML=`<div class="grid">${items.map(countryCard).join("")}</div>`;$$("[data-country]").forEach(x=>x.onclick=()=>showCountry(x.dataset.country))};["countryFilter","continentFilter","currencyFilter"].forEach(id=>$("#"+id).addEventListener("input",render));render();
}
function showCountry(id,fromBack=false){
 if(!fromBack)rememberLocation();state.currentKind="country";state.currentId=id;
 const c=DB.countries.find(x=>x.id===id),cur=DB.currencies[c.currency];crumbs.textContent=`${CONTINENTS[c.continent].name} › ${c.name}`;
 view.innerHTML=`<div class="section-head" style="margin-top:4px"><div>${backButton(state.continent?CONTINENTS[state.continent].name:"Voltar")}</div></div><div class="panel country-currency-hero"><div><div class="country-title"><span class="flag">${c.flag}</span><div><h1>${c.name}</h1><p>${cur.name} · ${c.currency} · ${cur.symbol}</p></div></div><p class="history-intro">A ficha do país contextualiza a moeda atual e mostra a evolução monetária antes de entrar nas notas em circulação.</p></div><div class="huge-currency">${cur.symbol}</div></div>
 <div class="detail-layout" style="margin-top:18px"><div class="panel"><h3>Breve história da moeda</h3><div class="timeline">${c.history.map(h=>`<div class="timeline-item"><strong>${h[0]}</strong><span>${h[1]}</span></div>`).join("")}</div></div>
 <aside class="panel"><h3>Ficha rápida</h3><div class="info-row"><span>Capital</span><strong>${c.capital}</strong></div><div class="info-row"><span>População</span><strong>${c.population}</strong></div><div class="info-row"><span>Idioma</span><strong>${c.language}</strong></div><div class="info-row"><span>Moeda</span><strong>${c.currency}</strong></div><div class="info-row"><span>Emissor</span><strong>${cur.source}</strong></div><div class="info-row"><span>1 EUR ≈</span><strong>${cur.rate} ${c.currency}</strong></div><button class="primary-btn" id="openCurrency" style="width:100%;margin-top:14px">Abrir ${cur.name}</button></aside></div>
 <div class="section-head"><div><h2>Notas associadas</h2><p>Uma entrada por valor; não separamos séries na grelha principal.</p></div></div>${notesGrid(c.currency)}`;
 bindBack();$("#openCurrency").onclick=()=>showCurrency(c.currency);bindNoteCards();
}
function showCurrency(code,fromBack=false){
 if(!fromBack)rememberLocation();state.currentKind="currency";state.currentId=code;
 const c=DB.currencies[code],members=DB.countries.filter(x=>x.currency===code);crumbs.textContent=`Moedas › ${c.name}`;
 view.innerHTML=`<div class="section-head" style="margin-top:4px"><div>${backButton(state.continent?CONTINENTS[state.continent].name:"Voltar")}</div></div><div class="panel country-currency-hero"><div><span class="mini-badge">${code}</span><h1>${c.name}</h1><p>${c.group} · ${c.source}</p><p class="history-intro">Página da área monetária. Quando uma moeda é partilhada, todos os países aparecem juntos antes das notas.</p></div><div class="huge-currency">${c.symbol}</div></div>
 <div class="dashboard-strip"><div class="metric"><strong>${c.notes.length}</strong><small>denominações</small></div><div class="metric"><strong>${members.length}</strong><small>países nesta base</small></div><div class="metric"><strong>${c.material}</strong><small>suporte principal</small></div><div class="metric"><strong>${c.rate}</strong><small>${code} por 1 EUR*</small></div></div>
 ${c.editorial?`<div class="detail-layout"><div class="panel"><span class="mini-badge">MOEDA GLOBAL #${c.focusRank}</span><h3>${c.editorial.role}</h3><p class="history-intro">${c.editorial.fact}</p></div><aside class="panel"><h3>Emissão e segurança</h3><div class="info-row"><span>Emissor</span><strong>${c.editorial.issuer}</strong></div><p class="history-intro">${c.editorial.security}</p></aside></div>`:""}
 <div class="section-head"><div><h2>Países / área monetária</h2></div></div><div class="grid">${members.map(countryCard).join("")}</div>
 <div class="section-head"><div><h2>Notas</h2><p>Clique para ver frente, verso e ficha detalhada.</p></div></div>${notesGrid(code)}
 <p class="source-note">* Câmbio indicativo; a app tenta atualizar via serviço externo e mantém fallback local para demonstração.</p>`;
 bindBack();$$("[data-country]").forEach(x=>x.onclick=()=>showCountry(x.dataset.country));bindNoteCards();
}
function notesGrid(code){return `<div class="note-grid">${DB.notes.filter(n=>n.currency===code).map(noteCard).join("")}</div>`}
function noteCard(n){
 const c=DB.currencies[n.currency],k=key(n.currency,n.value),legacy=n.status!=="circulating";
 return `<article class="note-card" data-note="${k}"><button class="compare-btn ${compare.includes(k)?"on":""}" data-compare="${k}" title="Comparar">≍</button><button class="fav-btn ${favorites.has(k)?"on":""}" data-fav="${k}" title="Favorito">${favorites.has(k)?"♥":"♡"}</button><div class="note-visual"><img loading="lazy" src="${n.front}" alt="${n.value} ${c.name}"></div><div class="note-meta"><strong>${c.symbol}${n.value}</strong><small>${c.name} · ${n.currency}</small><div class="status-line"><span class="status-dot ${legacy?"legacy":""}"></span>${n.statusLabel}</div></div></article>`;
}
function bindNoteCards(){
 $$("[data-note]").forEach(card=>card.onclick=e=>{if(e.target.closest("button"))return;let [c,v]=card.dataset.note.split(":");openNote(c,+v)});
 $$("[data-fav]").forEach(b=>b.onclick=e=>{e.stopPropagation();let [c,v]=b.dataset.fav.split(":");toggleFav(c,+v)});
 $$("[data-compare]").forEach(b=>b.onclick=e=>{e.stopPropagation();let [c,v]=b.dataset.compare.split(":");toggleCompare(c,+v)});
}
function openNote(code,value){
 const n=DB.notes.find(x=>x.currency===code&&x.value===value),c=DB.currencies[code],k=key(code,value),countries=DB.countries.filter(x=>x.currency===code);
 const sourceLine=n.imageStatus==="official" ? `<div class="notice" style="margin-top:16px"><strong>Imagem oficial.</strong> Fonte: ${n.imageSource||n.source}.${code==="EUR"?" A marca SPECIMEN é exigida pelo BCE para reproduções digitais integrais.":""}</div>` : `<div class="notice" style="margin-top:16px"><strong>Imagem demonstrativa.</strong> Esta denominação ainda aguarda substituição por um asset oficial/licenciado.</div>`;
 $("#modalBody").innerHTML=`<div class="note-detail-head"><div><span class="mini-badge">${code}</span><h2>${c.symbol}${value} · ${c.name}</h2></div><div class="note-detail-actions"><button class="ghost-btn" id="modalFav">${favorites.has(k)?"♥ Favorita":"♡ Favorito"}</button><button class="ghost-btn" id="modalCompare">≍ Comparar</button></div></div>
 <div class="modal-note-grid"><div class="modal-note-side"><h4>Frente</h4><button class="note-image-button" data-full-image="${n.front}" data-full-label="${c.symbol}${value} · Frente"><img src="${n.front}" alt="Frente"></button><small class="tap-hint">Toque na imagem para ampliar</small></div><div class="modal-note-side"><h4>Verso</h4><button class="note-image-button" data-full-image="${n.back}" data-full-label="${c.symbol}${value} · Verso"><img src="${n.back}" alt="Verso"></button><small class="tap-hint">Toque na imagem para ampliar</small></div></div>
 <div class="modal-facts"><div class="stat"><small>Valor</small><strong>${c.symbol}${value}</strong></div><div class="stat"><small>Estado</small><strong>${n.statusLabel}</strong></div><div class="stat"><small>Material</small><strong>${n.material}</strong></div><div class="stat"><small>Emissor</small><strong>${n.source}</strong></div><div class="stat"><small>País(es)</small><strong>${countries.map(x=>x.flag).join(" ")}</strong></div><div class="stat"><small>Equivalência EUR*</small><strong>≈ €${(value/c.rate).toLocaleString("pt-PT",{maximumFractionDigits:2})}</strong></div>${n.dimensions?`<div class="stat"><small>Dimensões</small><strong>${n.dimensions}</strong></div>`:""}</div>
 ${sourceLine}`;
 $("#modalFav").onclick=()=>{toggleFav(code,value);openNote(code,value)};$("#modalCompare").onclick=()=>{toggleCompare(code,value);closeModal()};
 $$("[data-full-image]").forEach(btn=>btn.onclick=()=>openImageViewer(btn.dataset.fullImage,btn.dataset.fullLabel));
 $("#noteModal").classList.remove("hidden");$("#noteModal").setAttribute("aria-hidden","false");
}
function openImageViewer(src,label="Nota"){
 const viewer=$("#imageViewer"),img=$("#imageViewerImg"),title=$("#imageViewerTitle");
 img.src=src;img.alt=label;title.textContent=label;
 viewer.classList.remove("hidden");viewer.setAttribute("aria-hidden","false");
 document.body.classList.add("viewer-open");
}
function closeImageViewer(){
 const viewer=$("#imageViewer");
 viewer.classList.add("hidden");viewer.setAttribute("aria-hidden","true");
 $("#imageViewerImg").src="";
 document.body.classList.remove("viewer-open");
}
function closeModal(){$("#noteModal").classList.add("hidden");$("#noteModal").setAttribute("aria-hidden","true")}
function showComparison(){
 if(compare.length<2)return alert("Escolha pelo menos duas notas.");
 const arr=compare.map(k=>{let [c,v]=k.split(":");return DB.notes.find(n=>n.currency===c&&n.value==+v)});
 const cols=arr.length;$("#modalBody").innerHTML=`<h2>Comparar notas</h2><p style="color:var(--muted)">Comparação visual e monetária de ${cols} denominações.</p><div class="compare-table" style="--cols:${cols}">
 <div class="compare-cell"></div>${arr.map(n=>`<div class="compare-cell"><img src="${n.front}"></div>`).join("")}
 <div class="compare-cell"><strong>Nota</strong></div>${arr.map(n=>`<div class="compare-cell"><strong>${DB.currencies[n.currency].symbol}${n.value}</strong><br><small>${n.currency}</small></div>`).join("")}
 <div class="compare-cell"><strong>Moeda</strong></div>${arr.map(n=>`<div class="compare-cell">${DB.currencies[n.currency].name}</div>`).join("")}
 <div class="compare-cell"><strong>Em EUR*</strong></div>${arr.map(n=>`<div class="compare-cell">€${(n.value/DB.currencies[n.currency].rate).toLocaleString("pt-PT",{maximumFractionDigits:2})}</div>`).join("")}
 <div class="compare-cell"><strong>Material</strong></div>${arr.map(n=>`<div class="compare-cell">${n.material}</div>`).join("")}
 </div><p class="source-note">* Equivalência apenas indicativa.</p>`;$("#noteModal").classList.remove("hidden");
}
function showAllNotes(fromBack=false){
 if(!fromBack)rememberLocation();state.currentKind="notes";state.currentId=null;
 crumbs.textContent="Notas";setActive("notes");
 view.innerHTML=hero("Todas as notas","Filtre e compare denominações de diferentes moedas.",`<button class="primary-btn" id="randomNote">Nota aleatória</button>`)+
 `<div class="filter-panel"><input id="noteSearch" placeholder="Valor ou moeda…"><select id="noteCont"><option value="">Todos os continentes</option>${Object.entries(CONTINENTS).map(([k,v])=>`<option value="${k}">${v.name}</option>`).join("")}</select><select id="noteCur"><option value="">Todas as moedas</option>${Object.keys(DB.currencies).map(c=>`<option value="${c}">${c} · ${DB.currencies[c].name}</option>`).join("")}</select></div><div id="allNotes"></div>`;
 $("#randomNote").onclick=randomNote;const render=()=>{const q=$("#noteSearch").value.toLowerCase(),cont=$("#noteCont").value,cur=$("#noteCur").value;let ns=DB.notes.filter(n=>{let c=DB.currencies[n.currency],countries=DB.countries.filter(x=>x.currency===n.currency);return (!q||`${n.value} ${n.currency} ${c.name}`.toLowerCase().includes(q))&&(!cur||n.currency===cur)&&(!cont||countries.some(x=>x.continent===cont))});$("#allNotes").innerHTML=`<div class="note-grid">${ns.map(noteCard).join("")}</div>`;bindNoteCards()};["noteSearch","noteCont","noteCur"].forEach(id=>$("#"+id).addEventListener("input",render));render();
}
function randomNote(){const n=DB.notes[Math.floor(Math.random()*DB.notes.length)],c=DB.currencies[n.currency];view.innerHTML=hero("Descoberta aleatória","Uma forma de explorar o atlas sem escolher país ou moeda.")+`<div class="panel random-card"><div class="note-visual"><img src="${n.front}"></div><div><span class="mini-badge">${n.currency}</span><h2>${c.symbol}${n.value} · ${c.name}</h2><p>${n.statusLabel} · ${n.material}</p><div class="action-row" style="justify-content:flex-start"><button class="primary-btn" id="openRnd">Ver frente e verso</button><button class="ghost-btn" id="anotherRnd">Outra nota</button></div></div></div>`;$("#openRnd").onclick=()=>openNote(n.currency,n.value);$("#anotherRnd").onclick=randomNote}
function showFavorites(fromBack=false){
 if(!fromBack)rememberLocation();state.currentKind="favorites";state.currentId=null;
 crumbs.textContent="Favoritos";setActive("favorites");let ns=DB.notes.filter(n=>favorites.has(key(n.currency,n.value)));
 view.innerHTML=hero("Favoritos",favorites.size?`${favorites.size} notas guardadas neste dispositivo.`:"Ainda não guardou nenhuma nota.")+(ns.length?`<div class="note-grid">${ns.map(noteCard).join("")}</div>`:`<div class="panel empty">Toque no ♡ de qualquer nota para a guardar aqui. Os favoritos persistem no navegador.</div>`);bindNoteCards();
}
async function refreshRates(){
 try{const r=await fetch("https://api.frankfurter.app/latest?from=EUR"),j=await r.json();Object.entries(j.rates||{}).forEach(([code,val])=>{if(DB.currencies[code])DB.currencies[code].rate=val});}
 catch(e){}
}
function showExchange(fromBack=false){
 if(!fromBack)rememberLocation();state.currentKind="exchange";state.currentId=null;
 crumbs.textContent="Câmbio";setActive("exchange");view.innerHTML=hero("Conversor","Conversão rápida entre moedas da base. A app tenta obter taxas atuais e usa fallback se necessário.")+`<div class="panel" style="max-width:800px;margin:auto"><div class="exchange-box"><div><input id="amt" type="number" value="100" min="0"><select id="from">${currencyOptions("EUR")}</select></div><strong>→</strong><div><select id="to">${currencyOptions("USD")}</select><div class="exchange-value" id="conv"></div></div></div><div class="notice" style="margin-top:18px">O câmbio é informativo e não substitui uma cotação bancária/comercial.</div></div>`;["amt","from","to"].forEach(id=>$("#"+id).addEventListener("input",convert));convert();
}
function currencyOptions(sel){return Object.entries(DB.currencies).map(([k,v])=>`<option ${k===sel?"selected":""} value="${k}">${k} · ${v.name}</option>`).join("")}
function convert(){let amount=+$("#amt").value||0,from=$("#from").value,to=$("#to").value,eur=amount/DB.currencies[from].rate,result=eur*DB.currencies[to].rate;$("#conv").textContent=`${DB.currencies[to].symbol}${result.toLocaleString("pt-PT",{maximumFractionDigits:2})}`}
function showAbout(){crumbs.textContent="Sobre";setActive("about");view.innerHTML=hero("Notas do Mundo","Atlas visual e geográfico de moedas e notas.")+`<div class="detail-layout"><div class="panel"><h3>O que esta v0.2 permite validar</h3><p class="history-intro">Mapa → continente → área monetária → país → história → notas → frente/verso. Também já existem pesquisa, favoritos persistentes, comparação, nota aleatória e conversor.</p><h3>Princípio editorial</h3><p class="history-intro">A grelha mostra uma entrada por denominação. Séries ou variantes só serão mencionadas quando forem necessárias para explicar o visual ou o estatuto da nota.</p></div><aside class="panel"><h3>Estado dos assets</h3><div class="info-row"><span>Interface</span><strong>Funcional</strong></div><div class="info-row"><span>Dados</span><strong>Amostra ampliada + Top 10 global</strong></div><div class="info-row"><span>Frente/verso</span><strong>Placeholders</strong></div><div class="info-row"><span>Próxima fase</span><strong>Assets reais</strong></div></aside></div>`}
init();
