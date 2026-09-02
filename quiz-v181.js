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
 function usable(url){return !!url&&!String(url).includes('placeholder')}
 function backData(note){
  if(!usable(note.back))return null;
  const ctx=contextFor(note,'back');
  return {side:'back',ctx,text:[ctx?.title,ctx?.summary,ctx?.more].filter(Boolean).join(' ')};
 }
 function countriesFor(code){return (DB.countries||[]).filter(c=>c.currency===code)}
 function answerTerms(note){
  const cur=DB.currencies?.[note.currency]||{},countries=countriesFor(note.currency);
  return [note.currency,cur.name,cur.group,note.source,cur.source,...countries.map(c=>c.name)].filter(Boolean).sort((a,b)=>String(b).length-String(a).length);
 }
 function removeTerms(text,note){
  let out=String(text||'');
  for(const term of answerTerms(note)){
   const safe=String(term).replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
   out=out.replace(new RegExp(safe,'gi'),' ').replace(/\s+/g,' ');
  }
  return out.replace(/^[\s,.;:–—-]+|[\s,.;:–—-]+$/g,'').trim();
 }
 function genericQuestion(text){
  const t=norm(text);
  if(/ave|passaro|bird|animal|fauna|peixe|fish|tartaruga|tigre|elefante|rinoceronte/.test(t))return 'Qual destes versos apresenta o motivo de fauna ou natureza descrito abaixo?';
  if(/ponte|bridge|palacio|palace|templo|igreja|church|torre|tower|edificio|building|monumento|mesquita/.test(t))return 'Qual destes versos apresenta este elemento de património, arquitetura ou paisagem?';
  if(/cient|medic|doctor|escritor|poeta|artist|musico|music|educa/.test(t))return 'Qual destes versos está associado à figura ou atividade cultural, científica ou pública descrita?';
  if(/independ|revolu|president|rei|king|queen|rainha|lider|leader|primeiro-ministro/.test(t))return 'Qual destes versos corresponde à referência histórica ou política descrita?';
  if(/navio|ship|aviao|aircraft|ferrovia|rail|transporte/.test(t))return 'Qual destes versos apresenta o motivo ligado a transporte ou desenvolvimento descrito?';
  return 'Qual destes seis versos corresponde à curiosidade apresentada?';
 }
 function clueFor(note,data){
  const ctx=data.ctx,raw=data.text||'';
  let clue=removeTerms([ctx?.summary,ctx?.more,ctx?.title].filter(Boolean).join(' '),note);
  if(clue.length<50)clue='Observe os motivos visuais e relacione-os com esta descrição: '+removeTerms(ctx?.title||raw,note);
  if(clue.length<45)clue='Este verso distingue-se pelos motivos gráficos, culturais ou naturais nele representados.';
  if(clue.length>210)clue=clue.slice(0,207).replace(/\s+\S*$/,'')+'…';
  return {question:genericQuestion(raw),clue};
 }
 function continentFor(code){return countriesFor(code)[0]?.continent||''}
 function candidateNotes(){
  const seenCurrency=new Set(),arr=[];
  for(const note of DB.notes||[]){
   if(seenCurrency.has(note.currency))continue;
   const data=backData(note);if(!data)continue;
   seenCurrency.add(note.currency);arr.push({note,data});
  }
  return arr;
 }
 function targetCandidate(list){
  let rich=list.filter(x=>x.data.ctx&&!recent.includes(x.note.currency));
  if(!rich.length)rich=list.filter(x=>x.data.ctx);
  let pool=rich.length?rich:list.filter(x=>!recent.includes(x.note.currency));
  if(!pool.length)pool=list;
  const x=pool[Math.floor(Math.random()*pool.length)];
  if(x){recent.push(x.note.currency);while(recent.length>7)recent.shift()}
  return x;
 }
 const shuffle=a=>[...a].sort(()=>Math.random()-.5);
 function optionNotes(target,list){
  const continent=continentFor(target.note.currency);
  const same=shuffle(list.filter(x=>x.note.currency!==target.note.currency&&continentFor(x.note.currency)===continent));
  const rest=shuffle(list.filter(x=>x.note.currency!==target.note.currency&&continentFor(x.note.currency)!==continent));
  return shuffle([target,...same,...rest].filter((x,i,a)=>a.findIndex(y=>y.note.currency===x.note.currency)===i).slice(0,6));
 }
 function setQuizActive(){qa('#sidebar .nav-item').forEach(el=>el.classList.toggle('active',el.dataset.ndmTool==='quiz'))}
 function renderQuiz(){
  if(!window.DB)return;
  state.currentKind='quiz';state.currentId=null;crumbs.textContent='Quiz';setQuizActive();
  const list=candidateNotes();let score=0,total=0;
  view.innerHTML=hero('Quiz de notas','As seis opções mostram sempre o verso das notas. Leia a curiosidade e escolha o verso que corresponde à descrição.')+`<div class="quiz-wrap panel" id="quizBox"></div>`;
  const next=()=>{
   const target=targetCandidate(list);if(!target){q('#quizBox').innerHTML='<div class="notice">Não existem versos de notas suficientes para gerar o quiz.</div>';return}
   const options=optionNotes(target,list);if(options.length<6){q('#quizBox').innerHTML='<div class="notice">São necessárias pelo menos seis moedas com versos válidos para este modo.</div>';return}
   const prompt=clueFor(target.note,target.data),targetKey=key(target.note.currency,target.note.value);
   q('#quizBox').innerHTML=`<div class="quiz-question-card panel"><span class="mini-badge">PISTA / CURIOSIDADE · VERSO</span><h3>${esc(prompt.question)}</h3><p>${esc(prompt.clue)}</p></div><div class="quiz-visual-options">${options.map((x,i)=>`<button class="quiz-note-option" data-quiz-key="${esc(key(x.note.currency,x.note.value))}" aria-label="Opção ${i+1}"><span class="quiz-option-letter">${String.fromCharCode(65+i)}</span><img src="${esc(x.note.back)}" alt="Verso da opção ${i+1}" loading="eager"></button>`).join('')}</div><div class="quiz-feedback" id="quizFeedback">Pontuação: ${score}/${total}</div>`;
   qa('[data-quiz-key]').forEach(btn=>btn.onclick=()=>{
    total++;const ok=btn.dataset.quizKey===targetKey;if(ok)score++;
    qa('[data-quiz-key]').forEach(x=>{x.disabled=true;x.classList.toggle('is-correct',x.dataset.quizKey===targetKey);if(x===btn&&!ok)x.classList.add('is-wrong')});
    const cur=DB.currencies[target.note.currency]||{},ct=countriesFor(target.note.currency).map(c=>c.name).join(', '),motif=target.data.ctx?.title||target.data.ctx?.summary||'motivo representado no verso';
    q('#quizFeedback').innerHTML=`<div class="notice"><strong>${ok?'Certo!':'Não desta vez.'}</strong> A nota correta é ${esc(cur.name||target.note.currency)} (${esc(target.note.currency)}).<p style="margin:7px 0 0"><b>${esc(motif)}</b>${ct?` · ${esc(ct)}`:''}</p></div><button class="primary-btn" id="quizNext" style="margin-top:10px">Próxima pergunta</button>`;
    q('#quizNext').onclick=next;
   });
  };
  next();
 }
 function intercept(e){
  const btn=e.target.closest?.('[data-ndm-tool="quiz"],[data-atlas-action="quiz"]');if(!btn)return;
  e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();q('#sidebar')?.classList.remove('open');renderQuiz();
 }
 function style(){if(q('#quiz-v181-style'))return;const s=document.createElement('style');s.id='quiz-v181-style';s.textContent=`
  .quiz-question-card{max-width:900px;margin:0 auto 18px;padding:18px 20px;text-align:left}
  .quiz-question-card h3{margin:9px 0 7px;font-size:20px}.quiz-question-card p{margin:0;line-height:1.55}
  .quiz-visual-options{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px}
  .quiz-note-option{position:relative;border:1px solid var(--line,#264153);background:rgba(255,255,255,.02);border-radius:12px;padding:10px;cursor:pointer;transition:.18s ease;min-width:0}
  .quiz-note-option:hover{border-color:#69c7e8;transform:translateY(-1px)}.quiz-note-option img{display:block;width:100%;height:150px;object-fit:contain;border-radius:8px}
  .quiz-option-letter{position:absolute;top:7px;left:7px;z-index:2;width:27px;height:27px;display:grid;place-items:center;border-radius:50%;background:#0a1a28;border:1px solid #4e728a;font-weight:800}
  .quiz-note-option.is-correct{border-color:#66d19e;box-shadow:0 0 0 2px rgba(102,209,158,.22)}.quiz-note-option.is-wrong{border-color:#e17e7e;opacity:.72}
  @media(max-width:850px){.quiz-visual-options{grid-template-columns:repeat(2,minmax(0,1fr))}}@media(max-width:540px){.quiz-visual-options{grid-template-columns:1fr}.quiz-note-option img{height:auto}}
 `;document.head.appendChild(s)}
 function patch(){style();window.showQuiz=renderQuiz;document.removeEventListener('click',intercept,true);document.addEventListener('click',intercept,true)}
 patch();window.addEventListener('load',patch);
})();