(()=>{
 const q=s=>document.querySelector(s),qa=s=>[...document.querySelectorAll(s)];
 const esc=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
 const norm=s=>String(s??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
 const key=(c,v)=>`${c}:${Number(v)}`;
 const recent=[];
 const stores=()=>[
  window.NOTE_CONTEXT_MANUAL,window.NOTE_CONTEXT_AFRICA3,window.NOTE_CONTEXT_AFRICA2,
  window.NOTE_CONTEXT_AFRICA1,window.NOTE_CONTEXT_CATALOG,window.NOTE_CONTEXT_ENRICHMENT,
  window.NOTE_CONTEXT_QUALITY,window.NOTE_CONTEXT_WAVE5,window.NOTE_CONTEXT_WAVE4,
  window.NOTE_CONTEXT_WAVE3,window.NOTE_CONTEXT_WAVE2,window.NOTE_CONTEXT_GLOBAL_REVIEW,
  window.NOTE_CONTEXT_GLOBAL
 ].filter(Boolean);
 function contextFor(note,side){
  const k=key(note.currency,note.value);
  for(const src of stores())if(src?.[k]?.[side])return src[k][side];
  return window.NOTE_CONTEXT_GLOBAL?.get?.(note,side)||null;
 }
 function countriesFor(code){return (window.DB?.countries||[]).filter(c=>c.currency===code)}
 function currencyTerms(note){
  const cur=DB.currencies?.[note.currency]||{},countries=countriesFor(note.currency);
  const raw=[note.currency,cur.name,cur.group,note.source,cur.source,...countries.map(c=>c.name)];
  return [...new Set(raw.map(norm).filter(x=>x&&x.length>=3))].sort((a,b)=>b.length-a.length);
 }
 function disclosureScore(note,side){
  const ctx=contextFor(note,side),text=norm([ctx?.title,ctx?.summary,ctx?.more].filter(Boolean).join(' '));
  if(!text)return 0;
  let score=0;
  for(const term of currencyTerms(note)){
   if(term.length>=5&&text.includes(term))score+=term===norm(note.currency)?1:2;
  }
  if(/banco central|central bank|reserve bank|bank of |monetary authority|republika|republica|republic of|estado de|government of/.test(text))score+=2;
  return score;
 }
 function usableImage(url){return !!url&&!String(url).includes('placeholder')}
 function pickSide(note){
  const f=usableImage(note.front),b=usableImage(note.back);if(!f&&!b)return null;
  if(f&&!b)return disclosureScore(note,'front')>=5?null:'front';
  if(b&&!f)return disclosureScore(note,'back')>=5?null:'back';
  const fs=disclosureScore(note,'front'),bs=disclosureScore(note,'back');
  if(fs>=5&&bs>=5)return null;
  if(fs>=4&&bs<4)return 'back';
  if(bs>=4&&fs<4)return 'front';
  return bs<fs?'back':'front';
 }
 function removeAnswerTerms(text,note){
  let out=String(text||'');
  const cur=DB.currencies?.[note.currency]||{},countries=countriesFor(note.currency);
  const terms=[note.currency,cur.name,cur.group,note.source,cur.source,...countries.map(c=>c.name)]
   .filter(Boolean).sort((a,b)=>String(b).length-String(a).length);
  for(const t of terms){
   const safe=String(t).replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
   out=out.replace(new RegExp(safe,'gi'),'').replace(/\s{2,}/g,' ').replace(/\s+([,.;:])/g,'$1');
  }
  return out.replace(/^[\s,.;:–—-]+|[\s,.;:–—-]+$/g,'').trim();
 }
 function genericClue(text){
  const t=norm(text);
  if(/ave|passaro|bird|animal|fauna|peixe|fish|tartaruga|tigre|elefante|rinoceronte/.test(t))return 'O motivo deste lado da nota está ligado à fauna ou à natureza.';
  if(/ponte|bridge|palacio|palace|templo|igreja|church|torre|tower|edificio|building|monumento/.test(t))return 'O motivo deste lado da nota destaca património, arquitetura ou um monumento.';
  if(/cient|medic|doctor|escritor|poeta|artist|musico|music|educa/.test(t))return 'A figura ou o motivo desta nota está ligado à cultura, ciência, educação ou serviço público.';
  if(/independ|revolu|president|rei|king|queen|rainha|lider|leader|primeiro-ministro/.test(t))return 'A nota recorda uma figura ou acontecimento com importância histórica e política.';
  if(/navio|ship|aviao|aircraft|ferrovia|rail|transporte/.test(t))return 'O motivo apresentado está ligado a transporte, exploração ou desenvolvimento do território.';
  return 'Observe o motivo, o estilo gráfico e os elementos visuais deste lado da nota.';
 }
 function clueFor(note,side){
  const ctx=contextFor(note,side),raw=[ctx?.summary,ctx?.more,ctx?.title].filter(Boolean).join(' ');
  let clue=removeAnswerTerms(raw,note).replace(/\s+/g,' ').trim();
  if(clue.length<45)clue=genericClue(raw);
  if(clue.length>180)clue=clue.slice(0,177).replace(/\s+\S*$/,'')+'…';
  return clue;
 }
 function revealFor(note,side){
  const ctx=contextFor(note,side),cur=DB.currencies?.[note.currency]||{},countries=countriesFor(note.currency).map(c=>c.name).join(', ');
  const motif=ctx?.title||ctx?.summary||'motivo da nota';
  return `${motif}. ${countries?`Esta moeda é usada em ${countries}. `:''}${cur.name||note.currency} (${note.currency}).`;
 }
 function continentFor(code){return countriesFor(code)[0]?.continent||''}
 function optionCodes(note){
  const sameCont=Object.keys(DB.currencies||{}).filter(code=>code!==note.currency&&continentFor(code)===continentFor(note.currency));
  const rest=Object.keys(DB.currencies||{}).filter(code=>code!==note.currency&&!sameCont.includes(code));
  const shuffle=a=>[...a].sort(()=>Math.random()-.5);
  return [note.currency,...shuffle(sameCont).slice(0,5),...shuffle(rest)].filter((v,i,a)=>a.indexOf(v)===i).slice(0,6).sort(()=>Math.random()-.5);
 }
 function candidates(){
  return (DB.notes||[]).map(note=>({note,side:pickSide(note)})).filter(x=>x.side&&usableImage(x.note[x.side]));
 }
 function chooseCandidate(list){
  let pool=list.filter(x=>!recent.includes(x.note.currency));if(!pool.length)pool=list;
  const pick=pool[Math.floor(Math.random()*pool.length)];
  if(pick){recent.push(pick.note.currency);while(recent.length>6)recent.shift()}
  return pick;
 }
 function setQuizActive(){
  qa('#sidebar .nav-item').forEach(el=>el.classList.toggle('active',el.dataset.ndmTool==='quiz'));
 }
 function renderQuiz(){
  if(!window.DB)return;
  state.currentKind='quiz';state.currentId=null;crumbs.textContent='Quiz';setQuizActive();
  const list=candidates();let score=0,total=0;
  view.innerHTML=hero('Quiz de notas','A imagem é escolhida para evitar pistas demasiado óbvias. Use a curiosidade e os detalhes visuais para identificar a moeda.')+`<div class="quiz-wrap panel" id="quizBox"></div>`;
  const next=()=>{
   const chosen=chooseCandidate(list);if(!chosen){q('#quizBox').innerHTML='<div class="notice">Não existem notas suficientemente ambíguas para gerar uma pergunta neste momento.</div>';return}
   const {note:n,side}=chosen,cur=DB.currencies[n.currency]||{},opts=optionCodes(n),clue=clueFor(n,side),img=n[side];
   if(opts.length<6){next();return}
   q('#quizBox').innerHTML=`<div class="quiz-side-label"><span class="mini-badge">${side==='back'?'VERSO':'FRENTE'}</span><span>O lado mostrado foi escolhido para não revelar diretamente a resposta.</span></div><div class="quiz-note"><img src="${esc(img)}" alt="Nota para identificar"></div><div class="quiz-clue panel"><span class="mini-badge">PISTA / CURIOSIDADE</span><p>${esc(clue)}</p></div><p><strong>Qual destas seis moedas corresponde à nota apresentada?</strong></p><div class="quiz-options quiz-options-six">${opts.map(code=>`<button class="ghost-btn" data-quiz="${esc(code)}">${esc(DB.currencies[code]?.name||code)} · ${esc(code)}</button>`).join('')}</div><div class="quiz-feedback" id="quizFeedback">Pontuação: ${score}/${total}</div>`;
   qa('[data-quiz]').forEach(b=>b.onclick=()=>{
    total++;const ok=b.dataset.quiz===n.currency;if(ok)score++;
    qa('[data-quiz]').forEach(x=>{x.disabled=true;x.classList.toggle('on',x.dataset.quiz===n.currency)});
    q('#quizFeedback').innerHTML=`<div class="notice"><strong>${ok?'Certo!':'Não desta vez.'}</strong> A resposta é ${esc(cur.name||n.currency)} (${esc(n.currency)}).<p style="margin:7px 0 0">${esc(revealFor(n,side))}</p></div><button class="primary-btn" id="quizNext" style="margin-top:10px">Próxima nota</button>`;
    q('#quizNext').onclick=next;
   });
  };
  next();
 }
 function intercept(e){
  const btn=e.target.closest?.('[data-ndm-tool="quiz"],[data-atlas-action="quiz"]');if(!btn)return;
  e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();q('#sidebar')?.classList.remove('open');renderQuiz();
 }
 function style(){if(q('#quiz-v179-style'))return;const s=document.createElement('style');s.id='quiz-v179-style';s.textContent=`
  .quiz-side-label{display:flex;align-items:center;gap:10px;margin:0 auto 10px;max-width:760px;color:var(--muted,#9fb0c0);font-size:13px}
  .quiz-clue{max-width:760px;margin:14px auto;padding:14px 16px;text-align:left}
  .quiz-clue p{margin:8px 0 0;line-height:1.5}
  .quiz-options-six{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}
  @media(max-width:700px){.quiz-options-six{grid-template-columns:1fr}}
 `;document.head.appendChild(s)}
 function patch(){style();window.showQuiz=renderQuiz;document.removeEventListener('click',intercept,true);document.addEventListener('click',intercept,true)}
 patch();window.addEventListener('load',patch);
})();