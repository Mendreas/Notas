(() => {
 const byName=(a,b)=>a.name.localeCompare(b.name,'pt',{sensitivity:'base'});
 const currencyFlag=code=>{
   if(code==='EUR') return '🇪🇺';
   const members=DB.countries.filter(c=>c.currency===code).sort(byName);
   return members[0]?.flag||'🏳️';
 };
 const worldButton=()=>`<button class="ghost-btn persistent-nav-btn" data-go-world>← Mundo</button>`;
 const bindWorld=()=>$$('[data-go-world]').forEach(b=>b.onclick=()=>showHome());
 const openNotesModal=(title,notes)=>{
   $('#modalBody').innerHTML=`<div class="note-detail-head"><div><h2>${title}</h2><p style="color:var(--muted);margin:4px 0 0">${notes.length} notas</p></div></div><div class="note-grid modal-note-list">${notes.map(noteCard).join('')}</div>`;
   $('#noteModal').classList.remove('hidden');$('#noteModal').setAttribute('aria-hidden','false');bindNoteCards();
 };
 window.openRandomTenModal=()=>{
   const pool=[...DB.notes];
   for(let i=pool.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[pool[i],pool[j]]=[pool[j],pool[i]]}
   openNotesModal('10 notas aleatórias',pool.slice(0,10));
 };

 showCountries=function(fromBack=false){
   if(!fromBack)rememberLocation();state.currentKind='countries';state.currentId=null;crumbs.textContent='Países';setActive('countries');
   view.innerHTML=`<div class="persistent-nav-row">${worldButton()}</div>${hero('Países','Selecione um país para abrir a ficha monetária.')}<div class="filter-panel"><input id="countryFilter" placeholder="Filtrar países…"><select id="continentFilter"><option value="">Todos os continentes</option>${Object.entries(CONTINENTS).map(([k,v])=>`<option value="${k}">${v.name}</option>`).join('')}</select><select id="currencyFilter"><option value="">Todas as moedas</option>${Object.keys(DB.currencies).sort().map(c=>`<option>${c}</option>`).join('')}</select></div><div id="countryGrid"></div>`;
   const render=()=>{const q=$('#countryFilter').value.toLowerCase(),co=$('#continentFilter').value,cu=$('#currencyFilter').value;const items=DB.countries.filter(c=>(!q||c.name.toLowerCase().includes(q))&&(!co||c.continent===co)&&(!cu||c.currency===cu)).sort(byName);$('#countryGrid').innerHTML=`<div class="grid">${items.map(countryCard).join('')}</div>`;$$('[data-country]').forEach(x=>x.onclick=()=>showCountry(x.dataset.country))};
   ['countryFilter','continentFilter','currencyFilter'].forEach(id=>$('#'+id).addEventListener('input',render));bindWorld();render();
 };

 showAllNotes=function(fromBack=false){
   if(!fromBack)rememberLocation();state.currentKind='notes';state.currentId=null;crumbs.textContent='Notas';setActive('notes');
   const currencies=Object.entries(DB.currencies).filter(([code])=>DB.notes.some(n=>n.currency===code)).sort((a,b)=>(a[1].name||a[0]).localeCompare(b[1].name||b[0],'pt',{sensitivity:'base'}));
   view.innerHTML=`<div class="persistent-nav-row">${worldButton()}</div>${hero('Notas','Organizadas por moeda. Clique numa caixa para ver todas as denominações.')}<div class="currency-type-grid">${currencies.map(([code,c])=>{const count=DB.notes.filter(n=>n.currency===code).length;return `<div class="card note-type-card" data-note-currency="${code}"><div class="card-topline"><span class="flag">${currencyFlag(code)}</span><span class="mini-badge">${code}</span></div><h3>${c.name}</h3><p>${c.group||code}</p><small>${count} denominações</small></div>`}).join('')}</div>`;
   $$('[data-note-currency]').forEach(x=>x.onclick=()=>{const code=x.dataset.noteCurrency,c=DB.currencies[code];openNotesModal(`${currencyFlag(code)} ${c.name} · ${code}`,DB.notes.filter(n=>n.currency===code).sort((a,b)=>a.value-b.value))});bindWorld();
 };

 const oldShowContinent=showContinent;
 showContinent=function(k,fromBack=false){
   state.mapMode='country';oldShowContinent(k,fromBack);
   const cs=DB.countries.filter(c=>c.continent===k).sort(byName);
   const grid=[...document.querySelectorAll('[data-country]')];
   const parent=grid[0]?.parentElement;if(parent){parent.innerHTML=cs.map(countryCard).join('');$$('[data-country]').forEach(x=>x.onclick=()=>showCountry(x.dataset.country));}
   const head=view.querySelector('.section-head');if(head){const old=head.querySelector('#backWorld');if(old){old.textContent='← Mundo';old.onclick=()=>showHome();old.classList.add('persistent-nav-btn');}}
   renderWorldMap(k);
 };

 const oldShowCountry=showCountry;
 showCountry=function(id,fromBack=false){
   const c=DB.countries.find(x=>x.id===id);if(c)state.continent=c.continent;
   oldShowCountry(id,fromBack);
   const b=view.querySelector('[data-app-back]');if(b&&c){b.textContent=`← ${CONTINENTS[c.continent].name}`;b.onclick=()=>showContinent(c.continent);b.classList.add('persistent-nav-btn');}
 };

 const oldRenderWorldMap=renderWorldMap;
 renderWorldMap=async function(continent=null){
   if(continent)state.mapMode='country';await oldRenderWorldMap(continent);
 };
})();
