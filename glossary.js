// Glossário técnico global · Notas do Mundo
(()=>{
  const TERMS={
    'polímero':{title:'Polímero',definition:'Material plástico fino, resistente e impermeável usado em notas modernas. Dura mais do que o papel e permite elementos de segurança como janelas transparentes.'},
    'substrato':{title:'Substrato',definition:'Material-base onde a nota é impressa. Pode ser papel de algodão, polímero ou uma combinação multicamada.'},
    'papel de algodão':{title:'Papel de algodão',definition:'Papel de segurança feito sobretudo com fibras de algodão. É mais resistente e tem um toque diferente do papel comum.'},
    'durasafe':{title:'Durasafe',definition:'Substrato multicamada que combina camadas de papel de algodão com um núcleo de polímero, usado em algumas notas de alta segurança.'},
    'marca de água':{title:'Marca de água',definition:'Imagem ou padrão incorporado no papel durante o fabrico, visível sobretudo quando a nota é observada contra a luz.'},
    'fio de segurança':{title:'Fio de segurança',definition:'Faixa muito fina incorporada no substrato da nota. Pode conter microtexto, efeitos metálicos ou propriedades visíveis sob luz ultravioleta.'},
    'holograma':{title:'Holograma',definition:'Elemento óptico que muda de imagem, brilho ou cor quando a nota é inclinada, dificultando a reprodução por impressão ou fotografia.'},
    'microimpressão':{title:'Microimpressão',definition:'Texto ou padrões impressos em tamanho extremamente pequeno. Parecem uma linha à vista desarmada e ficam legíveis apenas com ampliação.'},
    'microtexto':{title:'Microtexto',definition:'Texto minúsculo utilizado como elemento de segurança. É difícil de reproduzir com nitidez em cópias ou impressoras comuns.'},
    'tinta opticamente variável':{title:'Tinta opticamente variável',definition:'Tinta de segurança que muda de cor ou aparência quando a nota é inclinada e observada de ângulos diferentes.'},
    'tinta que muda de cor':{title:'Tinta que muda de cor',definition:'Elemento de segurança cuja cor aparente varia com o ângulo de observação. É uma forma de tinta opticamente variável.'},
    'janela transparente':{title:'Janela transparente',definition:'Área transparente integrada sobretudo em notas de polímero. Pode conter imagens, hologramas ou outros elementos difíceis de falsificar.'},
    'impressão em relevo':{title:'Impressão em relevo',definition:'Impressão que deixa partes da tinta fisicamente elevadas. Pode ser sentida ao passar o dedo e ajuda também pessoas com deficiência visual.'},
    'ultravioleta':{title:'Ultravioleta (UV)',definition:'Luz invisível ao olho humano sob a qual determinadas fibras, tintas ou símbolos de segurança fluorescem.'},
    'curso legal':{title:'Curso legal',definition:'Estatuto jurídico que reconhece uma moeda ou nota como meio oficial de pagamento num determinado território.'},
    'em circulação':{title:'Em circulação',definition:'Nota atualmente emitida ou aceite normalmente como dinheiro. Pode coexistir com séries anteriores que ainda tenham curso legal.'},
    'comemorativa circulante':{title:'Comemorativa circulante',definition:'Nota criada para assinalar uma pessoa, acontecimento ou aniversário, mas que pode ser usada normalmente em pagamentos.'},
    'emissão comemorativa':{title:'Emissão comemorativa',definition:'Emissão monetária criada para assinalar uma data, personalidade ou acontecimento. Pode ou não ser destinada à circulação corrente.'},
    'redenominação':{title:'Redenominação',definition:'Alteração da unidade monetária em que valores antigos são convertidos para uma nova escala, frequentemente retirando zeros.'},
    'demonetizada':{title:'Demonetizada',definition:'Nota que perdeu o estatuto de curso legal e já não deve ser usada normalmente para pagamentos.'},
    'série':{title:'Série',definition:'Família de notas emitidas segundo um mesmo desenho, período ou conjunto de características. Uma moeda pode ter várias séries sucessivas.'},
    'denominação':{title:'Denominação',definition:'Valor facial de uma nota ou moeda, por exemplo 5 euros, 20 dólares ou 1000 ienes.'},
    'anverso':{title:'Anverso',definition:'Face principal de uma nota, habitualmente chamada frente.'},
    'reverso':{title:'Reverso',definition:'Face oposta ao anverso, habitualmente chamada verso.'},
    'pick':{title:'Número Pick',definition:'Referência de catálogo usada internacionalmente para identificar tipos de notas. É frequentemente escrita como P- seguido de um número ou código.'},
    'p-':{title:'P- / Pick',definition:'Prefixo usado em referências Pick, um sistema de catalogação internacional de papel-moeda.'},
    'iso 4217':{title:'ISO 4217',definition:'Norma internacional que atribui códigos de três letras às moedas, como EUR, USD, JPY ou XPF.'},
    'taxa de câmbio':{title:'Taxa de câmbio',definition:'Relação de valor entre duas moedas, indicando quanto de uma moeda corresponde a uma unidade de outra.'},
    'moeda de reserva':{title:'Moeda de reserva',definition:'Moeda mantida em quantidade significativa por bancos centrais e outras instituições como parte das suas reservas internacionais.'},
    'numismática':{title:'Numismática',definition:'Estudo e coleção de moedas, notas, medalhas e outros objetos monetários.'}
  };
  window.NDM_GLOSSARY=TERMS;
  const ordered=Object.keys(TERMS).sort((a,b)=>b.length-a.length);
  const escaped=ordered.map(x=>x.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'));
  const re=new RegExp(`(${escaped.join('|')})`,'giu');
  let pop=null,active=null,scanQueued=false;

  function norm(s){return String(s||'').toLocaleLowerCase('pt-PT')}
  function dataFor(label){return TERMS[norm(label)]||TERMS[ordered.find(k=>norm(label).startsWith(k))]||null}
  function ensurePopover(){
    if(pop)return pop;
    pop=document.createElement('div');pop.className='glossary-popover';pop.setAttribute('role','dialog');pop.setAttribute('aria-live','polite');pop.hidden=true;
    pop.innerHTML='<div class="glossary-pop-head"><strong></strong><button type="button" aria-label="Fechar explicação">×</button></div><p></p>';
    document.body.appendChild(pop);
    pop.querySelector('button').addEventListener('click',close);
    return pop;
  }
  function close(){if(!pop)return;pop.hidden=true;if(active){active.setAttribute('aria-expanded','false');active=null}}
  function open(btn){
    const d=dataFor(btn.dataset.glossary);if(!d)return;
    const p=ensurePopover();if(active&&active!==btn)active.setAttribute('aria-expanded','false');active=btn;btn.setAttribute('aria-expanded','true');
    p.querySelector('strong').textContent=d.title;p.querySelector('p').textContent=d.definition;p.hidden=false;
    requestAnimationFrame(()=>position(btn,p));
  }
  function position(btn,p){
    const r=btn.getBoundingClientRect();
    if(innerWidth<=640){p.style.left='12px';p.style.right='12px';p.style.top='auto';p.style.bottom='calc(12px + env(safe-area-inset-bottom))';return}
    p.style.right='auto';p.style.bottom='auto';const w=Math.min(380,innerWidth-24);p.style.width=w+'px';
    let left=Math.max(12,Math.min(innerWidth-w-12,r.left+r.width/2-w/2));let top=r.bottom+10;
    p.style.left=left+'px';p.style.top=top+'px';
    requestAnimationFrame(()=>{if(p.getBoundingClientRect().bottom>innerHeight-12)p.style.top=Math.max(12,r.top-p.offsetHeight-10)+'px'});
  }
  function eligible(node){
    const p=node.parentElement;if(!p||!node.nodeValue?.trim())return false;
    if(p.closest('script,style,textarea,input,select,option,button,a,code,pre,.glossary-term,.glossary-popover,[data-no-glossary]'))return false;
    return !!p.closest('#view,#modalBody');
  }
  function annotateTextNode(node){
    const text=node.nodeValue;re.lastIndex=0;if(!re.test(text))return;re.lastIndex=0;
    const frag=document.createDocumentFragment();let last=0,m;
    while((m=re.exec(text))){
      if(m.index>last)frag.appendChild(document.createTextNode(text.slice(last,m.index)));
      const b=document.createElement('button');b.type='button';b.className='glossary-term';b.dataset.glossary=norm(m[0]);b.setAttribute('aria-expanded','false');b.setAttribute('aria-label',`${m[0]} — tocar para definição`);b.textContent=m[0];frag.appendChild(b);last=m.index+m[0].length;
      if(m[0].length===0)re.lastIndex++;
    }
    if(last<text.length)frag.appendChild(document.createTextNode(text.slice(last)));node.replaceWith(frag);
  }
  function scan(root=document){
    const target=root.querySelector?.('#view')||document.querySelector('#view');if(!target)return;
    const walker=document.createTreeWalker(target,NodeFilter.SHOW_TEXT);const nodes=[];let n;while((n=walker.nextNode()))if(eligible(n))nodes.push(n);nodes.forEach(annotateTextNode);
  }
  function queueScan(){if(scanQueued)return;scanQueued=true;requestAnimationFrame(()=>{scanQueued=false;scan()})}
  document.addEventListener('click',e=>{
    const b=e.target.closest?.('.glossary-term');if(b){e.preventDefault();e.stopPropagation();if(active===b&&!ensurePopover().hidden)close();else open(b);return}
    if(pop&&!pop.hidden&&!e.target.closest('.glossary-popover'))close();
  });
  document.addEventListener('keydown',e=>{if(e.key==='Escape')close()});window.addEventListener('resize',()=>{if(active&&pop&&!pop.hidden)position(active,pop)});window.addEventListener('scroll',()=>{if(active&&pop&&!pop.hidden&&innerWidth>640)position(active,pop)},{passive:true});
  const observer=new MutationObserver(queueScan);window.addEventListener('DOMContentLoaded',()=>{const v=document.querySelector('#view');if(v)observer.observe(v,{childList:true,subtree:true});queueScan()});

  function glossaryHTML(){
    return `<div class="panel glossary-index" data-no-glossary><div class="section-head"><div><span class="mini-badge">GLOSSÁRIO</span><h2>Termos técnicos</h2><p>Definições rápidas dos conceitos usados nas fichas de moedas e notas.</p></div></div><input id="glossaryFilter" class="glossary-filter" placeholder="Procurar termo…" autocomplete="off"><div class="glossary-grid">${Object.values(TERMS).sort((a,b)=>a.title.localeCompare(b.title,'pt')).map(d=>`<article class="glossary-card" data-glossary-card data-search="${d.title.toLocaleLowerCase('pt-PT')}"><h3>${d.title}</h3><p>${d.definition}</p></article>`).join('')}</div></div>`;
  }
  function patchAbout(){
    if(typeof window.showAbout!=='function'||window.__glossaryAboutPatched)return false;const original=window.showAbout;
    window.showAbout=function(...args){const result=original(...args);const view=document.querySelector('#view');if(view&&!view.querySelector('.glossary-index')){view.insertAdjacentHTML('beforeend',glossaryHTML());const input=document.querySelector('#glossaryFilter');input?.addEventListener('input',()=>{const q=norm(input.value.trim());document.querySelectorAll('[data-glossary-card]').forEach(card=>card.hidden=!!q&&!card.dataset.search.includes(q)&&!norm(card.textContent).includes(q))})}return result};
    window.__glossaryAboutPatched=true;return true;
  }
  if(!patchAbout())window.addEventListener('load',patchAbout);
})();
