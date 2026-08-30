(() => {
  const C={};
  const add=(currency,value,front,back)=>C[`${currency}:${Number(value)}`]={front,back};
  const I=(title,summary,more='',wiki='')=>({title,summary,more,wiki});

  // Euro — Europa series. The €500 remains from the first series.
  const euro={5:'Clássico',10:'Românico',20:'Gótico',50:'Renascentista',100:'Barroco e rococó',200:'Arquitetura em ferro e vidro do século XIX'};
  Object.entries(euro).forEach(([v,style])=>add('EUR',v,
    I(`${style} · janelas e pórticos`,`A frente apresenta arquitetura simbólica do estilo ${style.toLowerCase()}, representando abertura e cooperação na Europa.`,`Os edifícios representados nas notas de euro não são monumentos reais: são composições arquitetónicas criadas para representar épocas e estilos europeus.`,`https://pt.wikipedia.org/wiki/Notas_de_euro`),
    I(`${style} · ponte e mapa da Europa`,`O verso apresenta uma ponte imaginária do mesmo período arquitetónico e um mapa da Europa.`,`As pontes simbolizam a comunicação entre os povos da Europa e entre a Europa e o resto do mundo.`,`https://pt.wikipedia.org/wiki/Notas_de_euro`)
  ));
  add('EUR',500,I('Arquitetura moderna · século XX','A frente da nota de €500 da primeira série apresenta portas e janelas de arquitetura moderna.','A denominação de €500 deixou de ser emitida, mas conserva o seu valor e continua a poder ser trocada nos bancos centrais nacionais do Eurosistema.','https://pt.wikipedia.org/wiki/Notas_de_euro'),I('Ponte moderna e mapa da Europa','O verso apresenta uma ponte moderna imaginária e o mapa da Europa.','Tal como nas restantes notas de euro, a ponte não corresponde a uma construção real.','https://pt.wikipedia.org/wiki/Notas_de_euro'));

  // Bank of England Series G. Monarch portrait can be Elizabeth II or Charles III depending on the image/issue.
  const gbp={5:['Winston Churchill','Estadista britânico e primeiro-ministro durante grande parte da Segunda Guerra Mundial.'],10:['Jane Austen','Romancista inglesa, autora de obras como “Orgulho e Preconceito” e “Sensibilidade e Bom Senso”.'],20:['J. M. W. Turner','Pintor romântico britânico conhecido pelas paisagens, pela luz e pela atmosfera das suas obras.'],50:['Alan Turing','Matemático e pioneiro da computação, decisivo na criptoanálise britânica durante a Segunda Guerra Mundial.']};
  Object.entries(gbp).forEach(([v,[name,desc]])=>add('GBP',v,I('Monarca britânico',`A frente apresenta o retrato do monarca britânico; circulam versões com Isabel II e com Carlos III.`,`As notas com Carlos III começaram a circular em 5 de junho de 2024, mantendo o restante desenho da série.`,`https://pt.wikipedia.org/wiki/Libra_esterlina`),I(name,desc,'A personalidade histórica constitui o tema principal do verso desta denominação.',`https://pt.wikipedia.org/wiki/${encodeURIComponent(name.replace('J. M. W. Turner','J._M._W._Turner').replace('Winston Churchill','Winston_Churchill').replace('Jane Austen','Jane_Austen').replace('Alan Turing','Alan_Turing'))}`)));

  // US Federal Reserve notes.
  const usd={1:['George Washington','Grande Selo dos Estados Unidos'],2:['Thomas Jefferson','Declaração de Independência'],5:['Abraham Lincoln','Lincoln Memorial'],10:['Alexander Hamilton','Edifício do Tesouro dos Estados Unidos'],20:['Andrew Jackson','Casa Branca'],50:['Ulysses S. Grant','Capitólio dos Estados Unidos'],100:['Benjamin Franklin','Independence Hall']};
  Object.entries(usd).forEach(([v,[person,place]])=>add('USD',v,I(person,`A frente apresenta ${person}, figura central da história política e institucional dos Estados Unidos}.`.replace('Unidos}.','Unidos.'),'O retrato integra a tradição iconográfica das Federal Reserve Notes.',`https://pt.wikipedia.org/wiki/${encodeURIComponent(person.replaceAll(' ','_'))}`),I(place,`O verso apresenta ${place}, um dos motivos históricos associados a esta denominação}.`.replace('denominação}.','denominação.'),'O desenho reforça a ligação da nota à história e às instituições dos Estados Unidos.',`https://pt.wikipedia.org/wiki/${encodeURIComponent(place.replaceAll(' ','_'))}`)));

  // Swiss ninth series: each denomination explores a characteristically Swiss theme rather than portraits.
  const chf={10:['Tempo','organização'],20:['Luz','criatividade'],50:['Vento','experiências'],100:['Água','tradição humanitária'],200:['Matéria','vocação científica'],1000:['Linguagem','comunicação']};
  Object.entries(chf).forEach(([v,[theme,facet]])=>add('CHF',v,I(`${theme} · tema da nota`,`A nota explora o tema “${theme}” através da mão, do globo e de elementos gráficos associados à Suíça.`,`A nona série suíça evita retratos de personalidades e organiza cada denominação em torno de uma característica do país: ${facet}.`,`https://pt.wikipedia.org/wiki/Franco_su%C3%AD%C3%A7o`),I(`${theme} · interpretação suíça`,`O verso desenvolve visualmente o tema “${theme}” através de paisagens, objetos e atividades.`,`O desenho vertical e o substrato Durasafe são marcas distintivas da atual família de notas suíças.`,`https://pt.wikipedia.org/wiki/Franco_su%C3%AD%C3%A7o`)));

  // Japan: current 2024 family plus ¥2000 legacy note still legal tender.
  const jpy={1000:['Shibasaburō Kitasato','A Grande Onda de Kanagawa'],5000:['Umeko Tsuda','Flores de glicínia'],10000:['Eiichi Shibusawa','Estação de Tóquio · Marunouchi']};
  Object.entries(jpy).forEach(([v,[person,back]])=>add('JPY',v,I(person,`A frente apresenta ${person}, personalidade escolhida para a nova família japonesa introduzida em 2024}.`.replace('2024}.','2024.'),'A série de 2024 combina retratos históricos com novas tecnologias de segurança, incluindo hologramas tridimensionais.',`https://pt.wikipedia.org/wiki/${encodeURIComponent(person.replaceAll(' ','_'))}`),I(back,`O verso apresenta ${back}.`,'O motivo liga património cultural, natureza ou modernização à identidade japonesa.',`https://pt.wikipedia.org/wiki/${encodeURIComponent(back.split(' · ')[0].replaceAll(' ','_'))}`)));
  add('JPY',2000,I('Shureimon · Okinawa','A frente apresenta o portão Shureimon, em Naha, símbolo do antigo Reino de Ryūkyū.','A nota de ¥2.000 foi emitida em 2000 e continua a ter curso legal, embora seja pouco vista em circulação.','https://pt.wikipedia.org/wiki/Shureimon'),I('Genji Monogatari e Murasaki Shikibu','O verso evoca “O Conto de Genji” e a sua autora, Murasaki Shikibu.','A obra, escrita no início do século XI, é um dos grandes clássicos da literatura japonesa.','https://pt.wikipedia.org/wiki/Genji_Monogatari'));

  // Generic fallback editorial copy for every other note already loaded in DB.
  function generic(note,side){
    const cur=DB.currencies?.[note.currency];
    const country=(cur?.group||note.currency);
    const material=note.material||cur?.material||'substrato próprio da emissão';
    if(side==='front') return I(`${country} · ${Number(note.value).toLocaleString('pt-PT')}`,`Frente da nota de ${Number(note.value).toLocaleString('pt-PT')} ${cur?.name||note.currency}.`,`Emissão do ${cur?.source||note.source||'banco central ou autoridade monetária competente'}. Material: ${material}.`);
    return I(`${country} · verso`,`Verso da nota de ${Number(note.value).toLocaleString('pt-PT')} ${cur?.name||note.currency}.`,`O verso desenvolve os motivos culturais, históricos, naturais ou institucionais escolhidos para esta denominação. A identificação detalhada deste motivo será acrescentada quando validada pela fonte emissora.`);
  }

  window.NOTE_CONTEXT_GLOBAL={
    get(note,side){return C[`${note.currency}:${Number(note.value)}`]?.[side]||generic(note,side)},
    has(currency,value){return !!C[`${currency}:${Number(value)}`]}
  };
})();
