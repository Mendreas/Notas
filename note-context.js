(() => {
  const INFO={
    'USD:100':{
      front:{title:'Benjamin Franklin',summary:'Um dos Pais Fundadores dos Estados Unidos, diplomata, cientista, inventor e signatário da Declaração de Independência.',more:'Franklin teve um papel central na diplomacia da independência norte-americana e foi também uma figura marcante do Iluminismo.',wiki:'https://pt.wikipedia.org/wiki/Benjamin_Franklin'},
      back:{title:'Independence Hall · Filadélfia',summary:'Edifício histórico onde foram debatidas e adotadas a Declaração de Independência e a Constituição dos Estados Unidos.',more:'O edifício, na Pensilvânia, é um dos lugares simbólicos da fundação política dos Estados Unidos.',wiki:'https://pt.wikipedia.org/wiki/Independence_Hall'}
    },
    'ARS:100':{
      front:{title:'María Eva Duarte de Perón',summary:'Eva Perón foi uma das figuras políticas e sociais mais influentes da Argentina do século XX.',more:'A nota homenageia a sua projeção pública e o seu papel na história social argentina.',wiki:'https://pt.wikipedia.org/wiki/Eva_Per%C3%B3n'},
      back:{title:'Voto feminino e Escola de Enfermagem',summary:'A composição evoca a conquista do voto feminino na Argentina e a Escola de Enfermagem inaugurada em 1948.',more:'A Lei 13.010, aprovada em 1947, reconheceu às mulheres argentinas os mesmos direitos políticos dos homens.',wiki:'https://pt.wikipedia.org/wiki/Sufr%C3%A1gio_feminino'}
    },
    'ARS:200':{
      front:{title:'Martín Miguel de Güemes e Juana Azurduy',summary:'Dois protagonistas das lutas de independência do espaço rioplatense e sul-americano.',more:'Güemes destacou-se na defesa do noroeste argentino; Juana Azurduy combateu nas guerras de independência do Alto Peru e do Rio da Prata.',wiki:'https://pt.wikipedia.org/wiki/Juana_Azurduy_de_Padilla'},
      back:{title:'Campanha gaúcha',summary:'Cena evocativa das forças de cavalaria que combateram no norte argentino durante as guerras de independência.',more:'A chamada Guerra Gaucha foi decisiva para conter avanços realistas vindos do Alto Peru.',wiki:'https://pt.wikipedia.org/wiki/Mart%C3%ADn_Miguel_de_G%C3%BCemes'}
    },
    'ARS:500':{
      front:{title:'María Remedios del Valle e Manuel Belgrano',summary:'Remedios del Valle foi heroína da Guerra da Independência; Belgrano foi um dos principais líderes revolucionários e criador da bandeira argentina.',more:'Ambos estão associados às campanhas do Exército do Norte e à consolidação da independência argentina.',wiki:'https://pt.wikipedia.org/wiki/Manuel_Belgrano'},
      back:{title:'Jura da Bandeira',summary:'Recriação da cerimónia de juramento à bandeira realizada em 27 de fevereiro de 1812.',more:'O episódio está ligado a Manuel Belgrano e ao nascimento de um dos principais símbolos nacionais argentinos.',wiki:'https://pt.wikipedia.org/wiki/Bandeira_da_Argentina'}
    },
    'ARS:1000':{
      front:{title:'José de San Martín',summary:'General e estadista, uma das figuras centrais das independências da Argentina, Chile e Peru.',more:'San Martín liderou o Exército dos Andes e é considerado um dos grandes libertadores da América do Sul.',wiki:'https://pt.wikipedia.org/wiki/Jos%C3%A9_de_San_Mart%C3%ADn'},
      back:{title:'Travessia dos Andes',summary:'A composição representa a travessia dos Andes pelo Exército dos Andes em 1817.',more:'A operação militar abriu caminho para a campanha libertadora do Chile e, posteriormente, do Peru.',wiki:'https://pt.wikipedia.org/wiki/Travessia_dos_Andes'}
    },
    'ARS:2000':{
      front:{title:'Ramón Carrillo e Cecilia Grierson',summary:'Dois pioneiros da medicina e da saúde pública argentinas.',more:'Cecilia Grierson foi a primeira médica argentina; Ramón Carrillo teve papel decisivo no desenvolvimento da saúde pública nacional.',wiki:'https://pt.wikipedia.org/wiki/Cecilia_Grierson'},
      back:{title:'Instituto Nacional de Microbiologia Dr. Carlos G. Malbrán',summary:'O reverso apresenta o edifício do Instituto Malbrán, referência argentina em microbiologia e saúde pública.',more:'A nota de 2.000 pesos foi concebida como homenagem à saúde pública, à ciência e à medicina argentinas.',wiki:'https://pt.wikipedia.org/wiki/Instituto_Nacional_de_Enfermedades_Infecciosas'}
    },
    'ARS:10000':{
      front:{title:'María Remedios del Valle e Manuel Belgrano',summary:'Heroína da Guerra da Independência e criador da bandeira argentina, reunidos na família “Heroínas y Héroes de la Patria”.',more:'O BCRA indica que o retrato de Belgrano deriva de uma obra atribuída a François Casimir Carbonnier e a figura de Remedios del Valle da obra “La Capitana”, de Gisela Banzer.',wiki:'https://pt.wikipedia.org/wiki/Manuel_Belgrano'},
      back:{title:'Jura da Bandeira · 27 de fevereiro de 1812',summary:'Recriação artística da cerimónia de juramento à bandeira argentina.',more:'O episódio, associado a Manuel Belgrano, tornou-se um marco simbólico da formação nacional argentina.',wiki:'https://pt.wikipedia.org/wiki/Bandeira_da_Argentina'}
    },
    'ARS:20000':{
      front:{title:'Juan Bautista Alberdi',summary:'Jurista, escritor, diplomata e pensador argentino, inspirador intelectual da Constituição de 1853.',more:'A obra “Bases y puntos de partida para la organización política de la República Argentina” teve forte influência na organização constitucional do país.',wiki:'https://pt.wikipedia.org/wiki/Juan_Bautista_Alberdi'},
      back:{title:'Casa natal de Juan Bautista Alberdi',summary:'Recriação artística da casa onde Alberdi nasceu, em San Miguel de Tucumán.',more:'O reverso liga a figura do pensador ao seu lugar de origem e à memória histórica argentina.',wiki:'https://pt.wikipedia.org/wiki/Juan_Bautista_Alberdi'}
    }
  };

  function esc(s=''){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
  function findNoteByImage(src){
    try{return DB.notes.find(n=>n.front===src||n.back===src)||null}catch(_){return null}
  }
  function getInfo(src){
    const n=findNoteByImage(src); if(!n)return null;
    const side=n.front===src?'front':'back';
    const key=`${n.currency}:${Number(n.value)}`;
    return {note:n,side,info:INFO[key]?.[side]||null};
  }
  function ensurePanel(){
    const shell=document.querySelector('.image-viewer-shell'); if(!shell)return null;
    let panel=document.querySelector('#imageViewerContext');
    if(!panel){panel=document.createElement('div');panel.id='imageViewerContext';panel.className='image-viewer-context';shell.appendChild(panel)}
    return panel;
  }
  function renderContext(src){
    const panel=ensurePanel(); if(!panel)return;
    const hit=getInfo(src);
    if(!hit?.info){panel.innerHTML='<div class="note-context-muted">Descrição editorial em preparação.</div>';return}
    const i=hit.info;
    panel.innerHTML=`<div class="note-context-copy"><strong>${esc(i.title)}</strong><p>${esc(i.summary)}</p>${i.more?`<details><summary>Saber mais</summary><p>${esc(i.more)}</p></details>`:''}</div>${i.wiki?`<a class="note-context-wiki" href="${i.wiki}" target="_blank" rel="noopener noreferrer">Wikipédia ↗</a>`:''}`;
  }

  const original=window.openImageViewer;
  window.openImageViewer=function(src,label='Nota'){
    original(src,label);
    renderContext(src);
  };

  const style=document.createElement('style');
  style.textContent=`
    .image-viewer-context{display:flex;gap:16px;align-items:flex-start;justify-content:space-between;padding:14px 18px 18px;color:#dfe8ef;background:rgba(6,15,24,.94);border-top:1px solid rgba(255,255,255,.09)}
    .note-context-copy{max-width:920px}.note-context-copy strong{display:block;font-size:16px;margin-bottom:5px}.note-context-copy p{margin:0;color:#b8c6d1;line-height:1.45;font-size:14px}.note-context-copy details{margin-top:7px}.note-context-copy summary{cursor:pointer;color:#e6eef4;font-size:13px}.note-context-copy details p{margin-top:6px}.note-context-wiki{flex:0 0 auto;text-decoration:none;color:#fff;border:1px solid rgba(255,255,255,.22);border-radius:999px;padding:8px 12px;font-size:13px;white-space:nowrap}.note-context-wiki:hover{background:rgba(255,255,255,.08)}.note-context-muted{color:#8395a3;font-size:13px}
    @media(max-width:700px){.image-viewer-context{display:block;padding:12px 14px 16px}.note-context-wiki{display:inline-block;margin-top:10px}.note-context-copy strong{font-size:15px}.note-context-copy p{font-size:13px}}
  `;
  document.head.appendChild(style);
})();
