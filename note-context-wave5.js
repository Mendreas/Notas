(() => {
  const C={};
  const I=(title,summary,more='')=>({title,summary,more});
  const add=(currency,value,front,back)=>C[`${currency}:${Number(value)}`]={front,back};

  // Brasil — segunda família do real.
  const br={2:'tartaruga-de-pente',5:'garça-branca-grande',10:'arara-vermelha-grande',20:'mico-leão-dourado',50:'onça-pintada',100:'garoupa',200:'lobo-guará'};
  Object.entries(br).forEach(([v,a])=>add('BRL',v,I('Efígie da República','A frente apresenta a Efígie simbólica da República, elemento comum à segunda família do real.','A figura alegórica deriva da tradição republicana brasileira e não representa uma pessoa histórica específica.'),I(a[0].toUpperCase()+a.slice(1),`O verso apresenta ${a}, espécie da fauna brasileira escolhida para esta denominação.`,'A família do real utiliza animais nativos para representar a biodiversidade do Brasil.')));

  // Colômbia — nova família de 2016.
  const co={
    2000:['Débora Arango','Caño Cristales e biodiversidade'],
    5000:['José Asunción Silva','páramos colombianos, puya e abelha'],
    10000:['Virginia Gutiérrez','Amazónia, vitória-régia e rã-arborícola'],
    20000:['Alfonso López Michelsen','canais de La Mojana e sombrero vueltiao'],
    50000:['Gabriel García Márquez','Ciudad Perdida e cultura Tayrona'],
    100000:['Carlos Lleras Restrepo','Valle de Cocora e palmeira-de-cera']
  };
  Object.entries(co).forEach(([v,[p,b]])=>add('COP',v,I(p,`A frente homenageia ${p}, figura destacada da arte, literatura, ciência ou vida pública colombiana.`,'A nova família combina personalidades nacionais com biodiversidade e paisagens emblemáticas.'),I(b,`O verso apresenta ${b}.`,'O motivo integra património natural e cultural da Colômbia.')));

  // Peru — nova família iniciada em 2021.
  const pe={
    10:['Chabuca Granda','vicuña e Flor de Amancaes'],
    20:['José María Arguedas','cóndor-andino e Flor da Cantuta'],
    50:['María Rostworowski','jaguar e Puya Raimondi'],
    100:['Pedro Paulet','colibri-cauda-de-espátula e orquídea Phragmipedium kovachii'],
    200:['Tilsa Tsuchiya','gallito de las rocas e Flor Bella Abanquina']
  };
  Object.entries(pe).forEach(([v,[p,b]])=>add('PEN',v,I(p,`A frente apresenta ${p}, personalidade peruana de destaque nas artes, humanidades ou ciência do século XX.`,'A nova família homenageia figuras peruanas e, no verso, espécies da fauna e flora do país.'),I(b,`O verso apresenta ${b}.`,'Os motivos foram escolhidos para realçar a biodiversidade do Peru.')));

  // Bolívia — Primeira Família do Estado Plurinacional.
  const bo={
    10:['José Santos Vargas · Apiaguaiki Tüpa · Eustaquio Méndez','Ilha do Pescado · picaflor gigante · Puya Raimondi'],
    20:['Genoveva Ríos e outras figuras históricas bolivianas','paisagem, fauna e flora representativas da Bolívia'],
    50:['Figuras históricas e sociais da Bolívia','paisagem andina, fauna e quinua real'],
    100:['Juana Azurduy de Padilla e outras figuras históricas','paisagem boliviana, fauna e flor de patujú'],
    200:['Tupak Katari e outras figuras históricas','paisagem andina, gato-andino e flor de kantuta']
  };
  Object.entries(bo).forEach(([v,[f,b]])=>add('BOB',v,I(f,`A frente reúne ${f}.`,'A Primeira Família foi concebida para aumentar a representação nacional, regional e de género nas notas bolivianas.'),I(b,`O verso reúne ${b}.`,'Cada denominação combina sítios, fauna e flora do Estado Plurinacional da Bolívia.')));

  // Paraguai — personagens atuais confirmados pelo BCP.
  const py={2000:'Adela e Celsa Speratti',5000:'Carlos Antonio López',10000:'José Gaspar Rodríguez de Francia',20000:'Mulher Paraguaia',50000:'Agustín Pío Barrios “Mangoré”',100000:'São Roque González de Santa Cruz'};
  Object.entries(py).forEach(([v,p])=>add('PYG',v,I(p,`A frente apresenta ${p}, motivo humano ou histórico associado a esta denominação do guarani.`,'As notas paraguaias atuais homenageiam educação, história política, cultura e identidade nacional.'),I('Património e símbolos do Paraguai','O verso apresenta edifícios, cenas históricas ou símbolos ligados ao tema da denominação.','O desenho concreto varia por série, mantendo-se o mesmo eixo histórico e cultural.')));

  // Uruguai — Série Harmónica e emissões atuais.
  const uy={20:'Juan Zorrilla de San Martín',50:'José Pedro Varela',100:'Eduardo Fabini',200:'Pedro Figari',500:'Alfredo Vásquez Acevedo',1000:'Juana de Ibarbourou',2000:'Dámaso Antonio Larrañaga'};
  Object.entries(uy).forEach(([v,p])=>add('UYU',v,I(p,`A frente apresenta ${p}, personalidade da literatura, educação, música, arte ou ciência uruguaia.`,'A família atual mantém uma galeria de figuras centrais da cultura e formação do Uruguai.'),I('Motivo associado ao homenageado','O verso apresenta um edifício, obra ou símbolo ligado à atividade e ao legado da personalidade.','Na nota de 2.000 pesos, por exemplo, surge a antiga fachada da Biblioteca Nacional.')));

  // Guiana — motivos podem variar por série; a nota de 20 mantém o clássico Kaieteur/Malali.
  add('GYD',20,I('Cataratas de Kaieteur','A frente apresenta as Cataratas de Kaieteur, um dos grandes símbolos naturais da Guiana.','Kaieteur é uma das quedas de água de maior queda livre contínua do mundo.'),I('Ferry Malali e construção naval','O verso apresenta o ferry Malali e motivos ligados à construção naval.','O desenho sublinha a importância histórica dos rios e transportes fluviais na Guiana.'));
  add('GYD',50,I('50.º aniversário da Independência','A frente da emissão comemorativa destaca a independência da Guiana e a união do seu povo.','O desenho inclui o emblema do Bank of Guyana e símbolos nacionais.'),I('Mapa, bandeira e símbolos nacionais','O verso reúne o mapa e a bandeira da Guiana, o lema nacional, pombas da paz e a flor nacional.','A nota foi lançada no contexto dos 50 anos da independência.'));
  [100,500,1000,2000,5000].forEach(v=>add('GYD',v,I('Guiana · património nacional','A frente apresenta um motivo institucional, natural ou histórico da Guiana, conforme a série representada.','As emissões do Bank of Guyana usam símbolos nacionais e elementos ligados à identidade do país.'),I('Paisagem, economia ou cultura da Guiana','O verso desenvolve um tema nacional ligado à paisagem, infraestruturas, economia ou património cultural.','O motivo específico depende da série mostrada na imagem.')));

  // Suriname — edifício do banco na frente; natureza e produção no verso.
  [5,10,20,50,100,200,500].forEach(v=>add('SRD',v,I('Centrale Bank van Suriname','A frente apresenta o edifício do banco central do Suriname, motivo comum às atuais notas em dólares surinameses.','A série utiliza uma linguagem gráfica comum entre denominações.'),I('Natureza e setor produtivo','O verso apresenta um motivo da natureza do Suriname e do respetivo setor produtivo.','A combinação de biodiversidade e produção económica é o eixo visual comum às notas atuais.')));

  // Venezuela — família monetária atual; manter descrição prudente porque coexistem emissões recentes.
  [5,10,20,50,100,200,500].forEach(v=>add('VES',v,I('Bolívar venezuelano · emissão atual','A frente apresenta iconografia histórica e institucional da Venezuela, de acordo com a emissão representada.','A nova expressão monetária foi introduzida em 2021 e recebeu novas denominações posteriormente.'),I('História e identidade venezuelanas','O verso utiliza paisagens, monumentos ou símbolos nacionais ligados à história venezuelana.','Como circulam emissões de diferentes momentos recentes, o motivo exato deve ser lido em conjunto com a série da imagem.')));

  window.NOTE_CONTEXT_WAVE5=C;
})();