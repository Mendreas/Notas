(()=>{
 const q=s=>document.querySelector(s);
 const norm=s=>String(s??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
 const noteKey=(c,v)=>`${c}:${Number(v)}`;
 const storageKey='ndm-collection-v1';
 const collection=()=>{try{return JSON.parse(localStorage.getItem(storageKey)||'{}')}catch{return {}}};
 const contextStores=()=>[
  window.NOTE_CONTEXT_MANUAL,window.NOTE_CONTEXT_AFRICA3,window.NOTE_CONTEXT_AFRICA2,
  window.NOTE_CONTEXT_AFRICA1,window.NOTE_CONTEXT_CATALOG,window.NOTE_CONTEXT_ENRICHMENT,
  window.NOTE_CONTEXT_QUALITY,window.NOTE_CONTEXT_WAVE5,window.NOTE_CONTEXT_WAVE4,
  window.NOTE_CONTEXT_WAVE3,window.NOTE_CONTEXT_WAVE2,window.NOTE_CONTEXT_GLOBAL,
  window.NOTE_CONTEXT_GLOBAL_REVIEW
 ].filter(Boolean);
 function contextFor(note,side){
  const k=noteKey(note.currency,note.value);
  for(const src of contextStores())if(src?.[k]?.[side])return src[k][side];
  return window.NOTE_CONTEXT_GLOBAL?.get?.(note,side)||null;
 }
 function isCommemorative(n){
  if(n?.commemorative===true)return true;
  return /comemor|commemor/.test(norm([n?.series,n?.statusLabel,n?.status,n?.type,n?.category,n?.description].filter(Boolean).join(' ')));
 }
 function renderAdvancedSearch(){
  if(!window.DB)return;
  state.currentKind='advanced';state.currentId=null;crumbs.textContent='Pesquisa avançada';setActive('notes');
  view.innerHTML=hero('Pesquisa avançada','Combine pesquisa por conteúdo, continente, material, estado de circulação e a sua relação pessoal com cada nota.')+`<div class="advanced-search-grid">
   <input id="advQ" placeholder="Ex.: Franklin, comemorativa, polímero, tigre, 100, XPF…">
   <select id="advCont"><option value="">Todos os continentes</option>${Object.entries(CONTINENTS).map(([k,v])=>`<option value="${k}">${v.name}</option>`).join('')}</select>
   <select id="advMat"><option value="">Todos os materiais</option><option value="pol">Polímero</option><option value="pap">Papel</option></select>
   <select id="advState"><option value="">Qualquer estado</option><option value="circulating">Em circulação</option><option value="commemorative">Comemorativa</option></select>
   <select id="advPersonal"><option value="">Coleção pessoal · qualquer</option><option value="owned">Tenho esta nota</option><option value="wanted">Quero esta nota</option><option value="seen">Já vi / tive contacto</option></select>
  </div><div id="advResults"></div>`;
  const render=()=>{
   const text=norm(q('#advQ').value),cont=q('#advCont').value,mat=q('#advMat').value,st=q('#advState').value,personal=q('#advPersonal').value,col=collection();
   const arr=DB.notes.filter(n=>{
    const cur=DB.currencies[n.currency]||{},countries=DB.countries.filter(x=>x.currency===n.currency),f=contextFor(n,'front'),b=contextFor(n,'back'),comm=isCommemorative(n),cstate=col[noteKey(n.currency,n.value)]||{};
    const hay=norm([n.currency,n.value,n.series,n.statusLabel,n.status,n.material,cur.name,cur.group,...countries.map(x=>x.name),f?.title,f?.summary,f?.more,b?.title,b?.summary,b?.more,comm?'comemorativa comemorativo commemorative':''].filter(Boolean).join(' '));
    const stateOK=!st||(st==='circulating'?n.status==='circulating':st==='commemorative'?comm:true);
    const personalOK=!personal||!!cstate[personal];
    const material=norm(n.material||cur.material);
    return(!text||hay.includes(text))&&(!cont||countries.some(x=>x.continent===cont))&&(!mat||(mat==='pol'?material.includes('pol'):material.includes('pap')))&&stateOK&&personalOK;
   });
   const labels={owned:'Tenho esta nota',wanted:'Quero esta nota',seen:'Já vi / tive contacto'};
   const info=[st==='commemorative'?'Comemorativas':st==='circulating'?'Em circulação':'',personal?labels[personal]:''].filter(Boolean).join(' · ');
   q('#advResults').innerHTML=`<div class="section-head"><div><h2>${arr.length} resultados</h2>${info?`<p>Filtros ativos: ${info}</p>`:''}</div></div><div class="note-grid">${arr.map(noteCard).join('')}</div>`;
   bindNoteCards();if(window.GLOSSARY?.enhance)window.GLOSSARY.enhance(q('#advResults'));
  };
  ['advQ','advCont','advMat','advState','advPersonal'].forEach(id=>q('#'+id).addEventListener('input',render));render();
 }
 function intercept(e){
  const btn=e.target.closest?.('[data-ndm-tool="advanced"],[data-atlas-action="advanced"]');
  if(!btn)return;
  e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();
  q('#sidebar')?.classList.remove('open');renderAdvancedSearch();
 }
 document.addEventListener('click',intercept,true);
 window.showAdvancedSearch=renderAdvancedSearch;
})();
