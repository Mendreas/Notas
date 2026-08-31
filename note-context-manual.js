(() => {
 const C={};
 const I=(title,summary,more='',wiki='')=>({title,summary,more,wiki});
 const add=(currency,value,front,back)=>C[`${currency}:${Number(value)}`]={front,back};

 // Nepal · P-76. Banknote Museum's 2024 image row has no caption; the design is unchanged from the P-76 family.
 add('NPR',5,
   I('Everest e templo Kasthamandap','A frente apresenta o Monte Everest e o templo Kasthamandap, em Catmandu.','O Everest representa a geografia himalaia que define internacionalmente o Nepal; o Kasthamandap liga a nota ao património histórico da capital.'),
   I('Yak e Himalaias','O verso apresenta um yak diante de uma paisagem do Himalaia.','O yak é um animal intimamente ligado à vida de altitude e às comunidades das regiões montanhosas nepalesas.')
 );

 // Bahrain · current 2006-law family, 2016-2018 revision. Variant rows can hide the motif captions on Banknote Museum.
 add('BHD',0.5,
   I('Antigo Tribunal de Manama','A frente apresenta o antigo edifício do Tribunal de Manama.','O motivo recorda o património institucional e arquitetónico do Bahrain.'),
   I('Circuito Internacional do Bahrain','O verso apresenta o Circuito Internacional do Bahrain e a sua torre VIP.','O circuito, em Sakhir, simboliza a projeção internacional e a modernização do país.')
 );
 add('BHD',1,
   I('Escola Al-Hedaya Al-Khalifiya','A frente apresenta a escola Al-Hedaya Al-Khalifiya, uma referência histórica da educação moderna no Bahrain.','A escolha valoriza a educação como parte da construção do Estado moderno.'),
   I('Monumento da Vela e da Pérola · cavalos','O verso apresenta o Monumento da Vela e da Pérola, em Manama, acompanhado por cavalos.','A pérola e a vela evocam a tradição marítima e a antiga economia perlífera do arquipélago.')
 );
 add('BHD',5,
   I('Casa do Xeque Isa e Forte de Riffa','A frente apresenta a Casa do Xeque Isa, em Muharraq, e o Forte de Riffa.','Os dois edifícios representam o património histórico e arquitetónico do Bahrain.'),
   I('Aluminium Bahrain e primeiro poço de petróleo','O verso apresenta as instalações da Aluminium Bahrain e o primeiro poço de petróleo do país, junto a Jebel Dukhan.','A composição liga duas etapas decisivas da economia moderna do Bahrain: petróleo e industrialização.')
 );

 // Kuwait · fractional denominations are not safe in the old integer-based Banknote Museum manifest.
 add('KWD',0.25,
   I('Torre da Libertação, brasão e dhow','A frente reúne a Torre da Libertação, o brasão do Kuwait e um dhow tradicional.','A torre remete para o Kuwait contemporâneo; o dhow recorda a tradição marítima e comercial do Golfo.'),
   I('Porta tradicional kuwaitiana','O verso apresenta uma porta tradicional, referência à arquitetura e ao património doméstico do Kuwait.','A combinação entre modernidade e património é um eixo recorrente da atual família do dinar kuwaitiano.')
 );
 add('KWD',1,
   I('Grande Mesquita, brasão e dhow','A frente apresenta a Grande Mesquita do Kuwait, o brasão nacional e um dhow tradicional.','A Grande Mesquita representa a vida religiosa e institucional; o dhow recorda a história marítima do país.'),
   I('Vestígios arqueológicos da ilha de Failaka','O verso apresenta colunas e elementos arqueológicos associados à ilha de Failaka.','Failaka preserva vestígios de várias civilizações e sublinha a profundidade histórica do território kuwaitiano.')
 );

 // Oman · fractional values are likewise affected by the historic integer-key importer.
 add('OMR',0.1,
   I('Terraços verdes de Jabal al-Akhdar','A frente apresenta os terraços agrícolas de Jabal al-Akhdar e o brasão de Omã.','A imagem destaca a adaptação agrícola às montanhas áridas e uma das paisagens mais características do país.'),
   I('Coqueiros e sistema aflaj','O verso mostra coqueiros e um falaj, o sistema tradicional de canais de irrigação de Omã.','Os sistemas aflaj são fundamentais para a gestão histórica da água e vários estão classificados como Património Mundial.')
 );
 add('OMR',0.5,
   I('Museu Oman Across Ages','A frente apresenta o Oman Across Ages Museum, em Nizwa, acompanhado pelo brasão do país.','O museu foi concebido para narrar a continuidade histórica de Omã, da Antiguidade ao Estado moderno.'),
   I('Castelo de Khasab e património arqueológico','O verso reúne o Castelo de Khasab, vestígios funerários de Wadi Ain e o khanjar omanita.','A composição combina arquitetura, arqueologia e o punhal tradicional que integra o próprio emblema nacional.')
 );

 // Iran · P-W153A is an emergency cheque; the catalogue page's second row is signature metadata, not a second figurative scene.
 add('IRR',500000,
   I('Santuário do Imam Reza · Mashhad','A frente apresenta o complexo do Santuário do Imam Reza, em Mashhad.','É um dos mais importantes centros de peregrinação xiita e um dos grandes marcos religiosos e arquitetónicos do Irão.'),
   I('Desenho de cheque de emergência','O verso é predominantemente tipográfico e ornamental, sem um segundo motivo figurativo comparável ao da frente.','Esta emissão de 500.000 riais foi concebida como cheque de emergência para suprir a ausência, na época, de notas regulares de valor tão elevado.')
 );

 // Lebanon · Banknote Museum leaves several current design cells empty; secondary catalogues document the symbolism.
 add('LBP',5000,
   I('Cedro do Líbano','A frente incorpora o cedro, emblema do Estado libanês, dentro de uma composição geométrica.','O cedro é o símbolo nacional mais reconhecível do Líbano e figura também na bandeira do país.'),
   I('Reconstrução bloco a bloco','O verso utiliza quadrados e blocos geométricos para simbolizar a reconstrução do Líbano.','O desenho transforma a ideia de reconstrução nacional num motivo abstrato repetido por toda a nota.')
 );
 add('LBP',10000,
   I('Cedro do Líbano e desenho geométrico','A frente apresenta o cedro nacional integrado numa composição de blocos geométricos.','Os elementos geométricos fazem parte da linguagem visual da série e remetem para reconstrução e continuidade nacional.'),
   I('Monumento dos Mártires · Beirute','O verso apresenta o Monumento dos Mártires, na Praça dos Mártires de Beirute, com cedros estilizados.','O monumento homenageia nacionalistas executados pelas autoridades otomanas em 1916 e tornou-se um símbolo da memória nacional libanesa.')
 );
 add('LBP',20000,
   I('Cedro e reconstrução do Líbano','A frente combina o cedro do Líbano com espaços quadrados que simbolizam a reconstrução do país bloco a bloco.','O motivo associa diretamente o emblema nacional à recuperação física e económica do Líbano.'),
   I('Escadas e rosácea solar','O verso apresenta escadas e uma rosácea semelhante ao sol.','As escadas e a rosácea simbolizam desenvolvimento e progresso da economia libanesa.')
 );
 add('LBP',50000,
   I('Cedro e barco estilizado','A frente reúne o cedro nacional, um barco estilizado e blocos geométricos associados à reconstrução.','O barco evoca a tradição mediterrânica e marítima do Líbano; o cedro representa a identidade do Estado.'),
   I('Unidade territorial e reconstrução','O verso usa cerca de 25 blocos retangulares e o monograma do Banque du Liban.','Os retângulos simbolizam a unidade das divisões territoriais do país, apresentada como base para segurança, prosperidade e futuro.')
 );
 add('LBP',100000,
   I('Cedro e blocos de reconstrução','A frente apresenta o cedro do Líbano e espaços geométricos associados à reconstrução do país.','A linguagem gráfica mantém o cedro como emblema central da identidade libanesa.'),
   I('Uvas, cereais e fuso de fio','O verso apresenta cachos de uvas, espigas de cereal e um fuso de fio, além do cedro.','Os motivos evocam agricultura, produção e ofícios tradicionais; os blocos de fundo continuam o tema da unidade e reconstrução nacional.')
 );

 // Yemen · the source page used by the old importer is stale/404, but the 2018/2019 issue is well documented.
 add('YER',100,
   I('Dragoeiros de Socotorá e qamariya','A frente apresenta os dragoeiros de Socotorá e uma janela tradicional qamariya em vidro colorido.','A Dracaena cinnabari é uma das espécies mais emblemáticas e endémicas de Socotorá; a qamariya representa a arquitetura tradicional iemenita.'),
   I('Terraços agrícolas e mihrab','O verso apresenta campos agrícolas em socalcos e um nicho de oração mihrab decorado.','Os socalcos representam práticas agrícolas adaptadas ao relevo montanhoso; o mihrab liga o desenho ao património religioso e arquitetónico do Iémen.')
 );

 // North Korea · P-62/P-63 rows on Banknote Museum were parsed as variant metadata.
 add('KPW',200,
   I('Chollima e emblema estatal','A frente apresenta a estátua alada Chollima, em Pyongyang, e o emblema do Estado.','Chollima é um símbolo político de velocidade e mobilização económica associado à campanha de reconstrução e industrialização do pós-guerra.'),
   I('Valor e guilhochê ornamental','O verso é dominado pelo valor facial e por padrões ornamentais de segurança.','Ao contrário de outras denominações da série, o reverso não desenvolve uma paisagem ou edifício nacional específico.')
 );
 add('KPW',500,
   I('Arco do Triunfo · Pyongyang','A frente apresenta o Arco do Triunfo de Pyongyang e o emblema estatal.','O monumento foi construído para comemorar a resistência coreana à ocupação japonesa e é um dos principais símbolos monumentais da capital.'),
   I('Valor e guilhochê ornamental','O verso apresenta sobretudo o valor facial e padrões ornamentais.','A carga simbólica principal desta denominação encontra-se no monumento representado na frente.')
 );

 window.NOTE_CONTEXT_MANUAL=C;
})();
