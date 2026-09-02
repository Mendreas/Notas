(()=>{
  const families={
    USD:{
      material:'75% algodão / 25% linho',
      dimensions:{1:'156 × 66 mm',2:'156 × 66 mm',5:'156 × 66 mm',10:'156 × 66 mm',20:'156 × 66 mm',50:'156 × 66 mm',100:'156 × 66 mm'},
      security:'Impressão em relevo e microimpressão; nas denominações de 5 dólares ou superiores, elementos adicionais variam conforme o desenho, incluindo marca de água e fio de segurança. Nas notas redesenhadas de 10, 20, 50 e 100 dólares existem ainda elementos de mudança de cor; a nota de 100 dólares inclui a fita de segurança 3-D.',
      circulation:'Em circulação e com curso legal. As notas dos Estados Unidos mantêm o seu valor independentemente da data de emissão, embora os desenhos de segurança variem entre séries.',
      source:'U.S. Currency Education Program',sourceUrl:'https://www.uscurrency.gov/'
    },
    EUR:{
      material:'Papel de fibra de algodão',
      dimensions:{5:'120 × 62 mm',10:'127 × 67 mm',20:'133 × 72 mm',50:'140 × 77 mm',100:'147 × 77 mm',200:'153 × 77 mm',500:'160 × 82 mm'},
      security:'Impressão em relevo, marca de água e elementos holográficos. Na série Europa existem ainda o retrato de Europa em elementos de segurança e, consoante a denominação, número esmeralda e janela-retrato. A verificação corrente é feita pelo método tocar, observar e inclinar.',
      circulation:'As notas da série Europa de 5, 10, 20, 50, 100 e 200 euros são a série atualmente produzida. A nota de 500 euros deixou de ser emitida em 2019, mas continua a ter curso legal e conserva permanentemente o seu valor.',
      source:'Banco Central Europeu',sourceUrl:'https://www.ecb.europa.eu/euro/banknotes/current/html/index.en.html',
      overrides:{500:{legalStatus:'Curso legal · emissão terminada',circulation:'A nota de 500 euros deixou de ser emitida em 27 de abril de 2019. Continua a ter curso legal, mantém permanentemente o seu valor e pode ser trocada em qualquer banco central nacional do Eurosistema.'}}
    },
    GBP:{
      material:'Polímero',
      dimensions:{5:'125 × 65 mm',10:'132 × 69 mm',20:'139 × 73 mm',50:'146 × 77 mm'},
      security:'Grande janela transparente com retrato e valor, imagem metálica sobre a janela e holograma que muda entre o valor e a palavra “Pounds”. As notas de 20 e 50 libras têm uma segunda janela mais pequena. A cor da película metálica varia por denominação.',
      circulation:'As notas de 5, 10, 20 e 50 libras do Bank of England estão em circulação. As versões com Charles III, emitidas desde 5 de junho de 2024, circulam em paralelo com as versões de Elizabeth II; ambas têm curso legal.',
      source:'Bank of England',sourceUrl:'https://www.bankofengland.co.uk/banknotes/current-banknotes'
    },
    CAD:{
      material:'Polímero',
      dimensions:{5:'152,4 × 69,85 mm',10:'152,4 × 69,85 mm',20:'152,4 × 69,85 mm',50:'152,4 × 69,85 mm',100:'152,4 × 69,85 mm'},
      security:'Substrato de polímero com áreas transparentes, grande janela, retrato e edifício metálicos, números transparentes, folhas de ácer e impressão em relevo. Os elementos mudam de aspeto ao inclinar e repetem-se corretamente quando a nota é virada.',
      circulation:'Notas de polímero com curso legal. Algumas denominações podem coexistir com variantes comemorativas ou desenhos de séries diferentes.',
      source:'Bank of Canada',sourceUrl:'https://www.bankofcanada.ca/banknotes/'
    },
    AUD:{
      material:'Polímero',
      dimensions:{5:'130 × 65 mm',10:'137 × 65 mm',20:'144 × 65 mm',50:'151 × 65 mm',100:'158 × 65 mm'},
      security:'Substrato de polímero, janela transparente de cima a baixo com vários efeitos dinâmicos, imagem tridimensional, elemento móvel/variável de ave, número reversível, microimpressão, impressão em relevo e elementos fluorescentes sob luz ultravioleta.',
      circulation:'Série de polímero em circulação. As denominações têm a mesma altura e comprimentos progressivamente maiores para facilitar a identificação.',
      source:'Reserve Bank of Australia',sourceUrl:'https://banknotes.rba.gov.au/banknote-features/explore/'
    },
    CHF:{
      material:'Durasafe',
      dimensions:{10:'70 × 123 mm',20:'70 × 130 mm',50:'70 × 137 mm',100:'70 × 144 mm',200:'70 × 151 mm',1000:'70 × 158 mm'},
      security:'Substrato Durasafe de três camadas, elementos transparentes, globo e cruz suíça com efeitos ópticos, fio/strip de segurança, microtexto e elementos táteis. A combinação exata varia por denominação.',
      circulation:'Nona série do franco suíço em circulação. As notas têm largura constante e comprimento crescente com o valor.',
      source:'Swiss National Bank',sourceUrl:'https://www.snb.ch/en/the-snb/mandates-goals/cash/series-9'
    },
    JPY:{
      material:'Papel',
      dimensions:{1000:'150 × 76 mm',2000:'154 × 76 mm',5000:'156 × 76 mm',10000:'160 × 76 mm'},
      security:'Marca de água, impressão em relevo e microimpressão; nas emissões mais recentes existem hologramas avançados e outros elementos contra contrafação. Os recursos concretos dependem da série e da denominação.',
      circulation:'As notas atuais e várias emissões anteriores continuam com curso legal no Japão. A nota de 2 000 ienes pertence a uma emissão distinta das novas notas de 2024.',
      source:'Bank of Japan / National Printing Bureau',sourceUrl:'https://www.npb.go.jp/en/products/intro/'
    }
  };

  const key=(code,value)=>`${code}:${Number(value)}`;
  function get(code,value){
    const fam=families[code]; if(!fam)return null;
    const ov=fam.overrides?.[Number(value)]||{};
    return {
      currency:code,value:Number(value),
      dimensions:ov.dimensions||fam.dimensions?.[Number(value)]||null,
      material:ov.material||fam.material||null,
      security:ov.security||fam.security||null,
      circulation:ov.circulation||fam.circulation||null,
      legalStatus:ov.legalStatus||null,
      source:ov.source||fam.source||null,
      sourceUrl:ov.sourceUrl||fam.sourceUrl||null
    };
  }
  function apply(){
    if(!window.DB?.notes)return false;
    for(const n of window.DB.notes){
      const t=get(n.currency,n.value);if(!t)continue;
      if(t.dimensions)n.dimensions=t.dimensions;
      if(t.material)n.material=t.material;
      if(t.security)n.security=t.security;
      if(t.circulation)n.circulationDetail=t.circulation;
      if(t.legalStatus)n.statusLabel=t.legalStatus;
      n.technicalSource=t.source;
      n.technicalSourceUrl=t.sourceUrl;
    }
    for(const [code,fam] of Object.entries(families)){
      const c=window.DB.currencies?.[code];if(!c)continue;
      if(fam.material)c.material=fam.material;
      c.technicalSource=fam.source;c.technicalSourceUrl=fam.sourceUrl;
    }
    return true;
  }
  window.NOTE_TECHNICAL={families,get,apply,key};
  if(typeof document!=='undefined'){
    const tryApply=()=>{if(!apply())setTimeout(tryApply,60)};
    if(document.readyState==='loading')window.addEventListener('DOMContentLoaded',tryApply,{once:true});else tryApply();
  }
})();
