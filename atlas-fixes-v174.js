(()=>{
 const esc=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot',"'":'&#39;'}[m]));
 const norm=s=>String(s??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
 const q=s=>document.querySelector(s),qa=s=>[...document.querySelectorAll(s)];
 const noteKey=(c,v)=>`${c}:${Number(v)}`;
 const storageKey='ndm-collection-v1';
 const collection=()=>{try{return JSON.parse(localStorage.getItem(storageKey)||'{}')}catch{return {}}};
 const saveCollection=o=>localStorage.setItem(storageKey,JSON.stringify(o));
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
 function fixProperNames(){
  const fixes=[
   [/William Lyon Mackenzie rei/gi,'William Lyon Mackenzie King'],
   [/Mackenzie rei\b/gi,'Mackenzie King']
  ];
  for(const store of contextStores()){
   for(const entry of Object.values(store||{})){
    if(!entry||typeof entry!=='object')continue;
    for(const side of ['front','back']){
     const item=entry?.[side];if(!item||typeof item!=='object')continue;
     for(const field of ['title','summary','more']){
      if(typeof item[field]!=='string')continue;
      for(const [rx,repl] of fixes)item[field]=item[field].replace(rx,repl);
     }
    }
   }
  }
  const cad50=contextStores().map(s=>s?.['CAD:50']).find(Boolean);
  if(cad50?.front){
   for(const field of ['title','summary','more'])if(typeof cad50.front[field]==='string')cad50.front[field]=cad50.front[field].replace(/William Lyon Mackenzie rei/gi,'William Lyon Mackenzie King');
   if(/William Lyon Mackenzie King/i.test([cad50.front.title,cad50.front.summary,cad50.front.more].filter(Boolean).join(' ')))cad50.front.wiki='https://pt.wikipedia.org/wiki/William_Lyon_Mackenzie_King';
  }
  if(window.NOTE_CONTEXT_PT?.translate&&!window.NOTE_CONTEXT_PT.translate.__properNamesSafe){
   const old=window.NOTE_CONTEXT_PT.translate;
   const safe=text=>{
    if(typeof text!=='string')return old(text);
    const token='__WILLIAM_LYON_MACKENZIE_KING__';
    const translated=old(text.replace(/William Lyon Mackenzie King/gi,token));
    return String(translated).replaceAll(token,'William Lyon Mackenzie King');
   };
   safe.__properNamesSafe=true;
   window.NOTE_CONTEXT_PT.translate=safe;
  }
 }
 function iso2FromFlag(flag,id){
  const cps=[...String(flag||'')].map(ch=>ch.codePointAt(0));
  if(cps.length===2&&cps.every(cp=>cp>=0x1F1E6&&cp<=0x1F1FF))return cps.map(cp=>String.fromCharCode(97+cp-0x1F1E6)).join('');
  if(String(id||'').length===2)return String(id).toLowerCase();
  return '';
 }
 function flagMarkup(country){
  const cc=iso2FromFlag(country.flag,country.id);
  const visual=cc?`<img src="https://flagcdn.com/w40/${cc}.png" alt="Bandeira de ${esc(country.name)}" loading="lazy">`:`<span>${esc(country.flag||country.id)}</span>`;
  return `<button type="button" class="country-flag-link" data-open-country="${esc(country.id)}" data-country-name="${esc(country.name)}" title="${esc(country.name)}" aria-label="Abrir ficha de ${esc(country.name)}">${visual}</button>`;
 }
 function patchModalCountries(code){
  const body=q('#modalBody');if(!body)return;
  const countries=(window.DB?.countries||[]).filter(x=>x.currency===code);
  const stat=qa('#modalBody .modal-facts .stat').find(x=>norm(x.querySelector('small')?.textContent)==='pais(es)');
  if(!stat||!countries.length)return;
  const strong=stat.querySelector('strong');if(!strong)return;
  strong.classList.add('country-flag-list');
  strong.innerHTML=countries.map(flagMarkup).join('');
  qa('[data-open-country]').forEach(btn=>btn.onclick=e=>{
   e.preventDefault();e.stopPropagation();
   const id=btn.dataset.openCountry;
   if(typeof window.closeModal==='function')window.closeModal();
   if(typeof window.showCountry==='function')window.showCountry(id);
  });
 }
 function restoreManualSeenState(code,value,wasSeen){
  if(wasSeen)return;
  const all=collection(),k=noteKey(code,value),st=all[k]||{};
  st.seen=false;
  if(!st.owned&&!st.wanted)delete all[k];else all[k]=st;
  saveCollection(all);
  const btn=q(`[data-collection="seen"][data-ck="${code}:${Number(value)}"]`);
  if(btn)btn.classList.remove('on');
 }
 function wrapOpenNote(){
  if(typeof window.openNote!=='function'||window.openNote.__countryFlagFix)return;
  const old=window.openNote;
  function wrapped(code,value){
   const before=collection()[noteKey(code,value)]||{},wasSeen=!!before.seen;
   const r=old(code,value);
   requestAnimationFrame(()=>{restoreManualSeenState(code,value,wasSeen);patchModalCountries(code)});
   return r;
  }
  wrapped.__countryFlagFix=true;window.openNote=wrapped;
 }
 function isCommemorative(n){
  if(n?.commemorative===true)return true;
  return /comemor|commemor/.test(norm([n?.series,n?.statusLabel,n?.status,n?.type,n?.category,n?.description].filter(Boolean).join(' ')));
 }
 function renderAdvancedSearchFixed(){
  if(!window.DB)return;
  state.currentKind='advanced';state.currentId=null;crumbs.textContent='Pesquisa avançada';setActive('notes');
  view.innerHTML=hero('Pesquisa avançada','Procure por país, moeda, valor, série, pessoa, monumento, animal, material, estado ou nota comemorativa.')+`<div class="advanced-search-grid"><input id="advQ" placeholder="Ex.: Franklin, comemorativa, polímero, tigre, 100, XPF…"><select id="advCont"><option value="">Todos os continentes</option>${Object.entries(CONTINENTS).map(([k,v])=>`<option value="${k}">${v.name}</option>`).join('')}</select><select id="advMat"><option value="">Todos os materiais</option><option value="pol">Polímero</option><option value="pap">Papel</option></select><select id="advState"><option value="">Todos os estados</option><option value="circulating">Em circulação</option><option value="commemorative">Comemorativa</option><option value="owned">Na minha coleção</option><option value="wanted">Quero adquirir</option><option value="seen">Já vi / tive contacto</option></select></div><div id="advResults"></div>`;
  const render=()=>{
   const text=norm(q('#advQ').value),cont=q('#advCont').value,mat=q('#advMat').value,st=q('#advState').value,col=collection();
   const arr=DB.notes.filter(n=>{
    const cur=DB.currencies[n.currency]||{},countries=DB.countries.filter(x=>x.currency===n.currency),f=contextFor(n,'front'),b=contextFor(n,'back'),comm=isCommemorative(n),cstate=col[noteKey(n.currency,n.value)]||{};
    const hay=norm([n.currency,n.value,n.series,n.statusLabel,n.status,n.material,cur.name,cur.group,...countries.map(x=>x.name),f?.title,f?.summary,f?.more,b?.title,b?.summary,b?.more,comm?'comemorativa comemorativo commemorative':''].filter(Boolean).join(' '));
    const stateOK=!st||(st==='circulating'?n.status==='circulating':st==='commemorative'?comm:!!cstate[st]);
    const material=norm(n.material||cur.material);
    return(!text||hay.includes(text))&&(!cont||countries.some(x=>x.continent===cont))&&(!mat||(mat==='pol'?material.includes('pol'):material.includes('pap')))&&stateOK;
   });
   q('#advResults').innerHTML=`<div class="section-head"><div><h2>${arr.length} resultados</h2><p>${st==='commemorative'?'Filtro: notas comemorativas identificadas pelo estado, série ou classificação editorial.':st==='seen'?'Filtro: notas que marcou manualmente como já vistas ou com as quais teve contacto.':''}</p></div></div><div class="note-grid">${arr.map(noteCard).join('')}</div>`;
   bindNoteCards();if(window.GLOSSARY?.enhance)window.GLOSSARY.enhance(q('#advResults'));
  };
  ['advQ','advCont','advMat','advState'].forEach(id=>q('#'+id).addEventListener('input',render));render();
 }
 function bindHomeAdvanced(){
  const btn=q('[data-atlas-action="advanced"]');if(btn)btn.onclick=renderAdvancedSearchFixed;
 }
 function addPermanentTools(){
  const nav=q('#sidebar nav');if(!nav||q('[data-ndm-tools-nav]'))return;
  const marker=document.createElement('div');marker.dataset.ndmToolsNav='1';marker.className='ndm-tools-nav';
  marker.innerHTML=`<button class="nav-item" data-ndm-tool="advanced">⌕ <span>Pesquisa avançada</span></button><button class="nav-item" data-ndm-tool="quiz">? <span>Quiz</span></button><button class="nav-item" data-ndm-tool="curiosities">✦ <span>Curiosidades</span></button>`;
  const about=nav.querySelector('[data-nav="about"]');about?nav.insertBefore(marker,about):nav.appendChild(marker);
  marker.querySelector('[data-ndm-tool="advanced"]').onclick=()=>{q('#sidebar')?.classList.remove('open');renderAdvancedSearchFixed()};
  marker.querySelector('[data-ndm-tool="quiz"]').onclick=()=>{q('#sidebar')?.classList.remove('open');window.showQuiz?.()};
  marker.querySelector('[data-ndm-tool="curiosities"]').onclick=()=>{q('#sidebar')?.classList.remove('open');window.showCuriosities?.()};
 }
 function wrapHome(){
  if(typeof window.showHome!=='function'||window.showHome.__atlasFix174)return;
  const old=window.showHome;
  function wrapped(...args){const r=old(...args);requestAnimationFrame(()=>{bindHomeAdvanced();addPermanentTools()});return r}
  wrapped.__atlasFix174=true;window.showHome=wrapped;
 }
 function injectStyle(){if(q('#atlas-fixes-v174-style'))return;const s=document.createElement('style');s.id='atlas-fixes-v174-style';s.textContent=`
  .country-flag-list{display:flex;flex-wrap:wrap;gap:7px;align-items:center}
  .country-flag-link{position:relative;display:inline-flex;align-items:center;justify-content:center;width:34px;height:26px;padding:2px;border:1px solid rgba(126,161,184,.35);border-radius:6px;background:rgba(255,255,255,.025);cursor:pointer;appearance:none}
  .country-flag-link img{display:block;max-width:28px;max-height:20px;width:auto;height:auto;object-fit:contain;border-radius:2px;box-shadow:0 1px 4px rgba(0,0,0,.28)}
  .country-flag-link:hover,.country-flag-link:focus-visible{border-color:#74c8f5;background:rgba(116,200,245,.12);outline:none}
  .country-flag-link::after{content:attr(data-country-name);position:absolute;left:50%;bottom:calc(100% + 7px);transform:translateX(-50%);white-space:nowrap;background:rgba(7,16,26,.98);color:#fff;border:1px solid #536b7d;border-radius:8px;padding:6px 8px;font-size:12px;font-weight:600;line-height:1;box-shadow:0 8px 22px rgba(0,0,0,.35);opacity:0;visibility:hidden;pointer-events:none;z-index:10020}
  .country-flag-link:hover::after,.country-flag-link:focus-visible::after{opacity:1;visibility:visible}
  .ndm-tools-nav{display:contents}
 `;document.head.appendChild(s)}
 function patch(){fixProperNames();injectStyle();wrapOpenNote();wrapHome();window.showAdvancedSearch=renderAdvancedSearchFixed;addPermanentTools();bindHomeAdvanced()}
 patch();window.addEventListener('load',patch);
})();