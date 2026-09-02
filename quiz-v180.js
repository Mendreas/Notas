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
 function usableImage(url){return !!url&&!String(url).includes('placeholder')}
 function sideQuality(note,side){
  if(!usableImage(note[side]))return -99;
  const ctx=contextFor(note,side);if(!ctx)return 0;
  const text=[ctx.title,ctx.summary,ctx.more].filter(Boolean).join(' ');
  let score=Math.min(5,Math.floor(text.length/80));
  if(ctx.title)score+=2;if(ctx.summary)score+=2;if(ctx.more)score+=1;
  return score;
 }
 function bestSide(note){
  const f=sideQuality(note,'front'),b=sideQuality(note,'back');
  if(f<0&&b<0)return null;
  return b>f?'back':'front';
 }
 function removeAnswerTerms(text,note){
  let out=String(text||'');
  const cur=DB.currencies?.[note.currency]||{},countries=countriesFor(note.currency);
  const terms=[note.currency,cur.name,cur.group,note.source,cur.source,...countries.map(c=>c.name)]
    .filter(Boolean).sort((a,b)=>String(b).length-String(a).length);
  for(const t of terms){
   const safe=String(t).replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
   out=out.replace(new RegExp(safe,'gi'),' ').replace(/\s{2,}/g,' ');
  }
  return out.replace(/^[\s,.;:–—-]+|[\s,.;:–—-]+$/g,'').trim();
 }
 function genericQuestion(raw){
  const t=norm(raw);
  if(/ave|passaro|bird|animal|fauna|peixe|fish|tartaruga|tigre|elefante|rinoceronte|cavalo|horse/.test(t))return 'Qual destas notas apresenta o motivo de fauna ou natureza descrito nesta pista?';
  if(/ponte|bridge|palacio|palace|templo|igreja|church|torre|tower|edificio|building|monumento|castelo|castle/.test(t))return 'Qual destas notas apresenta o monumento, edifício ou património referido na pista?';
  if(/cient|medic|doctor|escritor|poeta|artist|musico|music|educa|professor/.test(t))return 'Qual destas notas está associada à figura ou ao tema cultural, científico ou de serviço público descrito?';
  if(/independ|revolu|president|rei|king|queen|rainha|lider|leader|primeiro-ministro|general/.test(t))return 'Qual destas notas corresponde à figura ou acontecimento histórico referido?';
  if(/navio|ship|aviao|aircraft|ferrovia|rail|transporte|porto|harbour|harbor/.test(t))return 'Qual destas notas apresenta o motivo ligado a transporte, navegação ou desenvolvimento referido?';
  return 'Qual destas seis notas corresponde à curiosidade apresentada?';
 }
 function clueFor(note,side){
  const ctx=contextFor(note,side)||{};
  const raw=[ctx.summary,ctx.more,ctx.title].filter(Boolean).join(' ');
  let clue=removeAnswerTerms(raw,note).replace(/\s+/g,' ').trim();
  if(clue.length<55){
    const title=removeAnswerTerms(ctx.title||'',note);
    clue=title?`O motivo principal deste lado da nota é ${title}. Observe as seis opções e escolha a correspondente.`:'Observe os motivos visuais das seis notas e identifique a que melhor corresponde à descrição.';
  }
  if(clue.length>220)clue=clue.slice(0,217).replace(/\s+\S*$/,'')+'…';
  return {question:genericQuestion(raw),clue};
 }
 function eligibleNotes(){
  return (DB.notes||[]).map(note=>({note,side:bestSide(note)})).filter(x=>x.side&&usableImage(x.note[x.side])&&contextFor(x.note,x.side));
 }
 function shuffle(a){return [...a].sort(()=>Math.random()-.5)}
 function chooseTarget(list){
  let pool=list.filter(x=>!recent.includes(x.note.currency));if(!pool.length)pool=list;
  const pick=pool[Math.floor(Math.random()*pool.length)];
  if(pick){recent.push(pick.note.currency);while(recent.length>6)recent.shift()}
  return pick;
 }
 function buildOptions(target,list){
  const targetCont=countriesFor(target.note.currency)[0]?.continent||'';
  const same=shuffle(list.filter(x=>x.note.currency!==target.note.currency&&(countriesFor(x.note.currency)[0]?.continent||'')===targetCont));
  const rest=shuffle(list.filter(x=>x.note.currency!==target.note.currency&&!same.includes(x)));
  const out=[target];
  for(const x of [...same,...rest]){
    if(out.some(y=>y.note.currency===x.note.currency))continue;
    out.push(x);if(out.length===6)break;
  }
  return shuffle(out);
 }
 function revealText(target){
  const n=target.note,ctx=contextFor(n,target.side)||{},cur=DB.currencies?.[n.currency]||{},countries=countriesFor(n.currency).map(c=>c.name).join(', ');
  return `${ctx.title||'Motivo da nota'} — ${cur.name||n.currency} (${n.currency})${countries?` · ${countries}`:''}.`;
 }
 function setQuizActive(){qa('#sidebar .nav-item').forEach(el=>el.classList.toggle('active',el.dataset.ndmTool==='quiz'))}
 function renderQuiz(){
  if(!window.DB)return;
  state.currentKind='quiz';state.currentId=null;crumbs.textContent='Quiz';setQuizActive();
  const list=eligibleNotes();let score=0,total=0;
  view.innerHTML=hero('Quiz de notas','Leia a pista ou curiosidade e escolha qual das seis notas corresponde à descrição. Aqui o desafio está no motivo da nota — não em ler o nome do país.')+`<div class="quiz-wrap panel" id="quizBox"></div>`;
  const next=()=>{
   const target=chooseTarget(list);if(!target){q('#quizBox').innerHTML='<div class="notice">Não existem notas com contexto suficiente para gerar uma pergunta.</div>';return}
   const options=buildOptions(target,list);if(options.length<6){q('#quizBox').innerHTML='<div class="notice">Ainda não existem seis notas adequadas para esta ronda.</div>';return}
   const clue=clueFor(target.note,target.side);
   q('#quizBox').innerHTML=`
    <div class="quiz-question-card panel"><span class="mini-badge">PISTA / CURIOSIDADE</span><h3>${esc(clue.question)}</h3><p>${esc(clue.clue)}</p></div>
    <div class="quiz-visual-grid">${options.map((x,i)=>`<button class="quiz-visual-option" data-quiz-note="${esc(key(x.note.currency,x.note.value))}" aria-label="Opção ${i+1}"><span class="quiz-option-number">${i+1}</span><img src="${esc(x.note[x.side])}" alt="Nota opção ${i+1}"><small>${x.side==='back'?'Verso':'Frente'}</small></button>`).join('')}</div>
    <div class="quiz-feedback" id="quizFeedback">Pontuação: ${score}/${total}</div>`;
   qa('[data-quiz-note]').forEach(btn=>btn.onclick=()=>{
    total++;
    const correct=btn.dataset.quizNote===key(target.note.currency,target.note.value);if(correct)score++;
    qa('[data-quiz-note]').forEach(x=>{x.disabled=true;x.classList.toggle('correct',x.dataset.quizNote===key(target.note.currency,target.note.value));x.classList.toggle('wrong',x===btn&&!correct)});
    q('#quizFeedback').innerHTML=`<div class="notice"><strong>${correct?'Certo!':'Não desta vez.'}</strong><p style="margin:7px 0 0">${esc(revealText(target))}</p></div><button class="primary-btn" id="quizNext" style="margin-top:10px">Próxima pergunta</button>`;
    q('#quizNext').onclick=next;
   });
  };
  next();
 }
 function intercept(e){
  const btn=e.target.closest?.('[data-ndm-tool="quiz"],[data-atlas-action="quiz"]');if(!btn)return;
  e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();q('#sidebar')?.classList.remove('open');renderQuiz();
 }
 function style(){if(q('#quiz-v180-style'))return;const s=document.createElement('style');s.id='quiz-v180-style';s.textContent=`
  .quiz-question-card{max-width:900px;margin:0 auto 18px;padding:18px;text-align:left}.quiz-question-card h3{margin:9px 0 7px}.quiz-question-card p{margin:0;line-height:1.55}
  .quiz-visual-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:14px}.quiz-visual-option{position:relative;display:flex;flex-direction:column;gap:7px;align-items:center;padding:10px;border:1px solid rgba(126,161,184,.28);border-radius:14px;background:rgba(255,255,255,.025);cursor:pointer;color:inherit}.quiz-visual-option:hover,.quiz-visual-option:focus-visible{border-color:#74c8f5;background:rgba(116,200,245,.08);outline:none}.quiz-visual-option img{width:100%;aspect-ratio:1.75/1;object-fit:contain;border-radius:8px;background:rgba(0,0,0,.12)}.quiz-visual-option small{color:var(--muted,#9fb0c0)}.quiz-option-number{position:absolute;top:16px;left:16px;z-index:2;width:27px;height:27px;border-radius:50%;display:grid;place-items:center;background:rgba(5,15,24,.9);border:1px solid rgba(126,161,184,.5);font-weight:700}.quiz-visual-option.correct{border-color:#75d39b;box-shadow:0 0 0 2px rgba(117,211,155,.14)}.quiz-visual-option.wrong{border-color:#df7b7b;opacity:.72}.quiz-visual-option:disabled{cursor:default}
  @media(max-width:900px){.quiz-visual-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}@media(max-width:560px){.quiz-visual-grid{grid-template-columns:1fr}}
 `;document.head.appendChild(s)}
 function patch(){style();window.showQuiz=renderQuiz;document.removeEventListener('click',intercept,true);document.addEventListener('click',intercept,true)}
 patch();window.addEventListener('load',patch);
})();