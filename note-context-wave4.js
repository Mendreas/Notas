(() => {
  const C={};
  const I=(title,summary,more='',wiki='')=>({title,summary,more,wiki});
  const add=(currency,value,front,back)=>C[`${currency}:${Number(value)}`]={front,back};
  const many=(currency,rows)=>Object.entries(rows).forEach(([v,[ft,fs,bt,bs,fm='',bm='']])=>add(currency,v,I(ft,fs,fm),I(bt,bs,bm)));

  // Noruega — série VIII: mar, navegação e economia costeira.
  many('NOK',{
    50:['Farol de Utvær','A frente apresenta o farol de Utvær, símbolo da navegação costeira norueguesa.','Sinal marítimo e padrão abstrato','O verso transforma a luz do farol e o mar num motivo geométrico inspirado no vento e nas ondas.'],
    100:['Navio de Gokstad','A frente apresenta o navio viking de Gokstad, evocando a tradição marítima e a exploração.','Navio moderno e rota marítima','O verso liga a herança viking ao transporte marítimo contemporâneo.'],
    200:['Bacalhau','A frente destaca o bacalhau, espécie central na história da pesca e das exportações norueguesas.','Pesca e mar aberto','O verso desenvolve o tema da pesca através de formas inspiradas em ondas, redes e atividade marítima.'],
    500:['Navio de salvamento RS 14 Stavanger','A frente homenageia o serviço de salvamento marítimo com o histórico RS 14 Stavanger.','Mar, energia e navegação','O verso associa o mar norueguês à tecnologia, à energia e à segurança marítima.'],
    1000:['O mar aberto','A frente apresenta uma onda em alto-mar, síntese visual da relação da Noruega com o oceano.','Horizonte e ondas','O verso reduz o tema marítimo a um padrão quase abstrato, inspirado na força do mar e do vento.']
  });

  // Suécia — família atual de personalidades e regiões.
  many('SEK',{
    20:['Astrid Lindgren','Escritora sueca, criadora de Pippi das Meias Altas e uma das autoras infantis mais influentes do século XX.','Småland','O verso evoca Småland, região ligada à infância e ao universo literário de Astrid Lindgren.'],
    50:['Evert Taube','Poeta, compositor e cantor, uma das figuras centrais da canção sueca do século XX.','Bohuslän','O verso apresenta motivos da costa de Bohuslän, associados ao mar e à obra de Taube.'],
    100:['Greta Garbo','Atriz sueca de projeção internacional e uma das grandes estrelas da história do cinema.','Estocolmo','O verso evoca Estocolmo e o ambiente urbano ligado à vida e carreira inicial de Garbo.'],
    200:['Ingmar Bergman','Realizador e dramaturgo sueco, referência maior do cinema mundial.','Gotland','O verso apresenta Gotland e Fårö, paisagens profundamente associadas à obra e à vida de Bergman.'],
    500:['Birgit Nilsson','Soprano sueca, celebrada pelas interpretações de Wagner e Strauss.','Skåne','O verso evoca a região da Escânia, onde Nilsson nasceu.'],
    1000:['Dag Hammarskjöld','Diplomata sueco e segundo secretário-geral das Nações Unidas.','Lapónia','O verso apresenta a paisagem da Lapónia, região ligada ao interesse de Hammarskjöld pela natureza e pela montanha.']
  });

  // Polónia — soberanos e símbolos históricos.
  const pln={10:['Mieszko I','primeiro governante histórico da Polónia'],20:['Bolesław I Chrobry','primeiro rei da Polónia'],50:['Casimiro III, o Grande','rei associado ao fortalecimento institucional e urbano do país'],100:['Władysław II Jagiełło','rei ligado à vitória de Grunwald e à união polaco-lituana'],200:['Sigismundo I, o Velho','monarca do Renascimento polaco'],500:['João III Sobieski','rei e comandante militar associado à vitória de Viena em 1683']};
  Object.entries(pln).forEach(([v,[p,d]])=>add('PLN',v,I(p,`A frente apresenta ${p}, ${d}.`,'A atual família de notas polacas organiza-se cronologicamente em torno de soberanos ligados a diferentes fases da formação do Estado.'),I('Símbolos do respetivo reinado','O verso reúne moedas, brasões, edifícios ou objetos associados à época do soberano representado.','Os motivos foram escolhidos para funcionar como síntese histórica do período correspondente.')));

  // Dinamarca — série Pontes e Achados Antigos.
  many('DKK',{
    50:['Ponte de Sallingsund','A frente apresenta a Ponte de Sallingsund, que liga a ilha de Mors à península de Salling.','Vaso de Skarpsalling','O verso apresenta o famoso recipiente neolítico de Skarpsalling, um dos achados pré-históricos mais conhecidos da Dinamarca.'],
    100:['Antiga Ponte do Pequeno Belt','A frente apresenta a antiga ponte sobre o Pequeno Belt, inaugurada em 1935.','Punhal de Hindsgavl','O verso apresenta um punhal de sílex pré-histórico encontrado em Hindsgavl.'],
    200:['Knippelsbro','A frente apresenta a ponte basculante Knippelsbro, em Copenhaga.','Placa de cinto de Langstrup','O verso apresenta uma grande placa circular de bronze da Idade do Bronze encontrada em Langstrup.'],
    500:['Ponte Rainha Alexandrine','A frente apresenta a ponte que liga as ilhas da Zelândia e Møn.','Recipiente de bronze de Keldby','O verso apresenta um objeto arqueológico de bronze encontrado em Keldby, na ilha de Møn.']
  });

  // Chéquia — personalidades históricas da família atual.
  const czk={100:['Carlos IV','rei da Boémia e imperador do Sacro Império'],200:['Jan Amos Komenský','pedagogo e filósofo conhecido internacionalmente como Comenius'],500:['Božena Němcová','escritora central do romantismo e da literatura checa'],1000:['František Palacký','historiador e figura do renascimento nacional checo'],2000:['Ema Destinnová','soprano checa de carreira internacional'],5000:['Tomáš Garrigue Masaryk','primeiro presidente da Checoslováquia']};
  Object.entries(czk).forEach(([v,[p,d]])=>add('CZK',v,I(p,`A frente apresenta ${p}, ${d}.`,'A série checa utiliza retratos de figuras que marcaram a cultura, a política e a identidade nacional.'),I('Motivos históricos e culturais checos','O verso desenvolve elementos ligados à vida, à obra ou ao contexto histórico da personalidade representada.','A composição combina arquitetura, símbolos e elementos gráficos da tradição checa.')));

  // Roménia — personalidades e património.
  const ron={1:['Nicolae Iorga','historiador e estadista'],5:['George Enescu','compositor e violinista'],10:['Nicolae Grigorescu','pintor'],20:['Ecaterina Teodoroiu','heroína militar da Primeira Guerra Mundial'],50:['Aurel Vlaicu','engenheiro e pioneiro da aviação'],100:['Ion Luca Caragiale','dramaturgo e escritor'],200:['Lucian Blaga','poeta e filósofo'],500:['Mihai Eminescu','poeta nacional romeno']};
  Object.entries(ron).forEach(([v,[p,d]])=>add('RON',v,I(p,`A frente apresenta ${p}, ${d} romeno de grande importância histórica ou cultural.`,'As notas romenas modernas são impressas em polímero e combinam retratos com elementos botânicos e símbolos da respetiva área de atividade.'),I('Património associado à personalidade','O verso apresenta edifícios, obras, instrumentos ou outros motivos diretamente relacionados com a figura da frente.','Cada denominação funciona como uma pequena ficha visual de história e cultura romena.')));

  // Turquia — Atatürk na frente, personalidades no verso.
  const tr={5:['Aydın Sayılı','historiador da ciência'],10:['Cahit Arf','matemático'],20:['Mimar Kemaleddin','arquiteto'],50:['Fatma Aliye','romancista e ensaísta'],100:['Buhurizade Mustafa Itrî','compositor da música clássica otomana'],200:['Yunus Emre','poeta e místico sufista']};
  Object.entries(tr).forEach(([v,[p,d]])=>add('TRY',v,I('Mustafa Kemal Atatürk','A frente apresenta Mustafa Kemal Atatürk, fundador e primeiro presidente da República da Turquia.','O retrato de Atatürk é o elemento comum a todas as denominações da atual série E9.'),I(p,`O verso homenageia ${p}, ${d}.`,'A família de notas procura representar diferentes áreas da ciência, arte, arquitetura e literatura turcas.')));

  // África do Sul — Mandela e Big Five.
  const za={10:'rinoceronte',20:'elefante',50:'leão',100:'búfalo-africano',200:'leopardo'};
  Object.entries(za).forEach(([v,a])=>add('ZAR',v,I('Nelson Mandela','A frente apresenta Nelson Mandela, líder anti-apartheid e primeiro presidente negro da África do Sul.','O retrato de Mandela é comum à família atual de notas sul-africanas.'),I(a[0].toUpperCase()+a.slice(1),`O verso apresenta o ${a}, um dos animais do grupo conhecido como “Big Five”.`,'As cinco denominações distribuem entre si rinoceronte, elefante, leão, búfalo e leopardo.')));

  // Quénia — património comum na frente, temas económicos e sociais no verso.
  const ke={50:'energia verde',100:'agricultura',200:'serviços sociais',500:'turismo',1000:'governação'};
  Object.entries(ke).forEach(([v,t])=>add('KES',v,I('KICC · estátua de Jomo Kenyatta','A frente combina o Kenyatta International Convention Centre, em Nairobi, a estátua de Jomo Kenyatta e o Monte Quénia.','A nova geração foi concebida para representar a identidade nacional sem colocar o retrato de uma pessoa viva como tema dominante.'),I(t[0].toUpperCase()+t.slice(1),`O verso desenvolve o tema da ${t}, através de cenas e infraestruturas representativas do Quénia moderno.`,'Cada denominação foi associada a um setor diferente da sociedade e da economia quenianas.')));

  // Egito — arquitetura islâmica na frente, Antigo Egito no verso.
  const eg={5:['Mesquita de Ibn Tulun','Hapi, divindade do Nilo'],10:['Mesquita de Al-Rifa’i','motivos faraónicos e escultura do Egito antigo'],20:['Mesquita de Muhammad Ali','carro de guerra e motivos faraónicos'],50:['Mesquita de Abu Huraiba','Templo de Edfu'],100:['Mesquita do Sultão Hassan','Grande Esfinge de Gizé'],200:['Mesquita de Qani-Bay','escriba sentado']};
  Object.entries(eg).forEach(([v,[f,b]])=>add('EGP',v,I(f,`A frente apresenta ${f}, exemplo do património arquitetónico islâmico do Cairo.`,'As notas egípcias combinam deliberadamente património islâmico na frente e motivos do Egito faraónico no verso.'),I(b,`O verso apresenta ${b}.`,'A composição liga a moeda contemporânea à longa continuidade histórica e arqueológica do Egito.')));

  // Marrocos — série 2023: retrato real e projetos/património nacionais.
  [20,50,100,200].forEach(v=>add('MAD',v,I('Rei Mohammed VI','A frente apresenta o Rei Mohammed VI, acompanhado por símbolos institucionais e arquitetónicos de Marrocos.','A série de 2023 introduziu novos elementos de segurança e uma linguagem visual dedicada ao património e ao desenvolvimento do país.'),I('Património e desenvolvimento de Marrocos','O verso reúne infraestruturas, arquitetura, paisagens ou atividades económicas associadas ao Marrocos contemporâneo.','Os motivos variam por denominação, mas seguem o eixo comum de modernização, cultura e identidade nacional.')));

  // Hong Kong — várias entidades emissoras partilham denominações.
  [10,20,50,100,500,1000].forEach(v=>add('HKD',v,I('Dólar de Hong Kong · emissor da nota','A frente identifica a entidade emissora e apresenta arquitetura, símbolos ou elementos gráficos próprios da respetiva série.','Em Hong Kong, as notas de 20 a 1.000 dólares podem ser emitidas por HSBC, Standard Chartered e Bank of China; a nota de 10 dólares é emitida pelo Governo de Hong Kong.'),I('Tema de Hong Kong','O verso desenvolve um tema cultural, urbano, natural ou quotidiano relacionado com Hong Kong.','O desenho concreto depende do banco emissor e da série representada na imagem.')));

  // Hungria — figuras históricas.
  const hu={500:['Francisco II Rákóczi','Castelo de Sárospatak'],1000:['Rei Matias Corvino','Palácio de Visegrád'],2000:['Gabriel Bethlen','cena histórica ligada ao seu reinado'],5000:['István Széchenyi','mansão da família Széchenyi em Nagycenk'],10000:['Santo Estêvão I','vista histórica de Esztergom'],20000:['Ferenc Deák','antigo edifício parlamentar']};
  Object.entries(hu).forEach(([v,[p,b]])=>add('HUF',v,I(p,`A frente apresenta ${p}, figura decisiva da história húngara.`,'A série atual manteve a tradição de associar cada denominação a uma personalidade histórica.'),I(b,`O verso apresenta ${b}, motivo diretamente relacionado com a época ou a vida da personalidade representada.`,'A composição completa o retrato com um lugar ou cena da memória nacional húngara.')));

  // Islândia — personalidades culturais, religiosas e científicas.
  const is={500:['Jón Sigurðsson','documentos e objetos ligados à independência islandesa'],1000:['Brynjólfur Sveinsson','património religioso e manuscritos'],2000:['Jóhannes S. Kjarval','obra e paisagem associadas ao pintor'],5000:['Ragnheiður Jónsdóttir','bordado, educação e cultura doméstica'],10000:['Jónas Hallgrímsson','natureza, poesia e investigação científica']};
  Object.entries(is).forEach(([v,[p,b]])=>add('ISK',v,I(p,`A frente apresenta ${p}, personalidade marcante da história e cultura islandesas.`,'As notas islandesas valorizam figuras da independência, religião, arte, literatura e ciência.'),I('Motivos ligados à sua obra',`O verso reúne ${b}.`,'Os elementos visuais ligam a personalidade à paisagem, à cultura e à memória islandesas.')));

  // Sérvia — galeria de cultura, ciência e política.
  const rs={10:'Vuk Karadžić',20:'Petar II Petrović-Njegoš',50:'Stevan Stojanović Mokranjac',100:'Nikola Tesla',200:'Nadežda Petrović',500:'Jovan Cvijić',1000:'Đorđe Vajfert',2000:'Milutin Milanković',5000:'Slobodan Jovanović'};
  Object.entries(rs).forEach(([v,p])=>add('RSD',v,I(p,`A frente apresenta ${p}, figura importante da cultura, ciência ou vida pública sérvia.`,'A atual série reúne escritores, artistas, cientistas, empresários e estadistas.'),I('Obra e legado da personalidade','O verso apresenta objetos, edifícios, manuscritos ou símbolos associados ao percurso da figura representada.','O motivo complementa o retrato com referências à respetiva área de atividade.')));

  // Albânia.
  const al={200:['Naim Frashëri','poeta do Renascimento Nacional Albanês'],500:['Ismail Qemali','líder da independência e primeiro chefe de governo da Albânia'],1000:['Pjetër Bogdani','escritor e clérigo'],2000:['Rei Gentius','governante ilírio da Antiguidade'],5000:['Skanderbeg','herói nacional da resistência aos otomanos'],10000:['Asdreni','poeta e autor da letra do hino nacional']};
  Object.entries(al).forEach(([v,[p,d]])=>add('ALL',v,I(p,`A frente apresenta ${p}, ${d}.`,'A nova família de notas combina retratos históricos com design contemporâneo e elementos de segurança modernos.'),I('Património albanês associado','O verso apresenta arquitetura, símbolos, manuscritos ou lugares ligados à personalidade e ao período histórico representado.','A composição procura ligar biografia e património nacional.')));

  // Bósnia e Herzegovina — variantes paralelas por entidade.
  [10,20,50,100,200].forEach(v=>add('BAM',v,I('Personalidade literária · variante regional','A frente apresenta uma personalidade da literatura ou cultura da Bósnia e Herzegovina; existem versões distintas para a Federação e para a Republika Srpska.','As duas variantes têm o mesmo valor e circulam em todo o país.'),I('Motivo cultural ou arquitetónico','O verso apresenta um motivo ligado à personalidade ou à tradição cultural da entidade representada.','O desenho concreto depende da variante regional da nota mostrada na imagem.')));

  // Macedónia do Norte — património arqueológico, religioso e artístico.
  [10,50,100,200,500,1000,2000].forEach(v=>add('MKD',v,I('Património da Macedónia do Norte','A frente apresenta um motivo histórico, arqueológico, religioso ou artístico ligado ao património macedónio.','A família mistura mosaicos, ícones, artefactos e figuras históricas de diferentes épocas.'),I('Arte e arqueologia macedónias','O verso desenvolve o mesmo tema com obras, edifícios ou objetos patrimoniais complementares.','A identificação concreta varia por denominação e pela série representada.')));

  // Moldávia — Ștefan cel Mare em todas as notas.
  [1,5,10,20,50,100,200,500,1000].forEach(v=>add('MDL',v,I('Ștefan cel Mare','A frente apresenta Ștefan cel Mare, príncipe da Moldávia no século XV e figura central da memória nacional moldava.','O seu retrato é o elemento unificador das denominações do leu moldavo.'),I('Mosteiro ou monumento da Moldávia','O verso apresenta um edifício religioso, monumento ou lugar histórico moldavo.','Cada denominação associa o retrato de Ștefan cel Mare a um elemento distinto do património arquitetónico do país.')));

  // Ucrânia.
  const ua={20:['Ivan Franko','Ópera de Lviv'],50:['Mykhailo Hrushevsky','edifício da antiga Rada Central'],100:['Taras Shevchenko','Universidade Nacional Taras Shevchenko de Kyiv'],200:['Lesya Ukrainka','Castelo de Lubart, em Lutsk'],500:['Hryhorii Skovoroda','Academia Kyiv-Mohyla'],1000:['Volodymyr Vernadsky','Academia Nacional de Ciências da Ucrânia']};
  Object.entries(ua).forEach(([v,[p,b]])=>add('UAH',v,I(p,`A frente apresenta ${p}, uma das grandes figuras da literatura, ciência ou história ucranianas.`,'A atual família combina retratos com elementos de segurança de última geração.'),I(b,`O verso apresenta ${b}, local ou instituição associado ao legado da personalidade.`,'O desenho reforça a ligação entre biografia e património cultural ucraniano.')));

  // Bielorrússia — regiões e monumentos, sem retratos.
  const by={5:'Brest e a torre de Kamyenyets',10:'Vitebsk e património de Polotsk',20:'Gomel e o complexo Rumyantsev–Paskevich',50:'Grodno e o Castelo de Mir',100:'Minsk e património de Nesvizh',200:'Mogilev e o seu património artístico',500:'Minsk e a Biblioteca Nacional da Bielorrússia'};
  Object.entries(by).forEach(([v,t]])=>{});
  Object.entries(by).forEach(([v,t])=>add('BYN',v,I(t,`A frente apresenta arquitetura ou paisagem associada à região representada nesta denominação.`,'A série de 2009, colocada em circulação em 2016, organiza as notas por regiões da Bielorrússia.'),I('Cultura regional bielorrussa','O verso apresenta um segundo motivo cultural, artístico ou arquitetónico relacionado com a mesma região.','A família evita retratos e privilegia património material e identidade regional.')));

  // Rússia — série mista em circulação.
  const ru={5:'Veliky Novgorod',10:'Krasnoyarsk',50:'São Petersburgo',100:'Moscovo',200:'Sebastopol',500:'Arkhangelsk',1000:'Nizhny Novgorod e região do Volga',2000:'Vladivostok e Extremo Oriente',5000:'Ecaterimburgo e Urais'};
  Object.entries(ru).forEach(([v,city])=>add('RUB',v,I(city,`A frente apresenta monumentos e arquitetura associados a ${city}.`,'A atual circulação russa combina desenhos de diferentes gerações; as notas mais recentes adotam uma organização por distritos federais e cidades de referência.'),I('Paisagem e património regional',`O verso apresenta um segundo conjunto de monumentos, infraestruturas ou paisagens ligados a ${city} e à respetiva região.`,'O motivo concreto depende da geração da nota representada na imagem.')));

  // Geórgia — personalidades culturais.
  const ge={5:'Ivane Javakhishvili',10:'Akaki Tsereteli',20:'Ilia Chavchavadze',50:'Rainha Tamar',100:'Shota Rustaveli'};
  Object.entries(ge).forEach(([v,p])=>add('GEL',v,I(p,`A frente apresenta ${p}, figura central da história e cultura georgianas.`,'A série modernizada manteve as personalidades tradicionais e atualizou grafismo e segurança.'),I('Património georgiano associado','O verso reúne arquitetura, arte ou paisagens relacionadas com o legado da personalidade.','A composição liga cada retrato a um capítulo da identidade histórica da Geórgia.')));

  // Arménia — terceira geração.
  const am={1000:'Paruyr Sevak',2000:'Tigran Petrosian',5000:'William Saroyan',10000:'Komitas',20000:'Hovhannes Aivazovsky',50000:'São Gregório, o Iluminador'};
  Object.entries(am).forEach(([v,p])=>add('AMD',v,I(p,`A frente homenageia ${p}, personalidade ligada à literatura, música, arte, xadrez ou história religiosa arménia.`,'A terceira geração de notas arménias utiliza substrato compósito e forte integração de elementos históricos e culturais.'),I('Obra e património arménios','O verso desenvolve referências à obra, ao contexto histórico ou aos lugares associados à personalidade representada.','O conjunto funciona como uma galeria da cultura e história da Arménia.')));

  // Azerbaijão — temas nacionais, não retratos.
  const az={1:'Cultura e música tradicional',5:'Literatura e escrita',10:'História e Cidade Velha de Baku',20:'Karabakh',50:'Educação e futuro',100:'Desenvolvimento e arquitetura',200:'Arquitetura contemporânea e Centro Heydar Aliyev'};
  Object.entries(az).forEach(([v,t])=>add('AZN',v,I(t,`A frente desenvolve o tema “${t}” através de símbolos, objetos e arquitetura do Azerbaijão.`,'A família do manat foi concebida tematicamente, sem depender de retratos de personalidades.'),I('Identidade do Azerbaijão','O verso complementa o tema com mapas, padrões, arquitetura e outros símbolos nacionais.','O grafismo procura unir património histórico, modernização e identidade cultural.')));

  window.NOTE_CONTEXT_WAVE4=C;
})();