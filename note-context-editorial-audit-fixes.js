(()=>{
 const fixes={
  'AUD:20':{back:{
   title:'John Flynn e a aviação médica',
   summary:'Verso: aeronave De Havilland DH.84 Dragon e o reverendo John Flynn, ligado ao Royal Flying Doctor Service.'
  }},
  'CHF:100':{back:{
   title:'“Suone” — aqueduto tradicional de madeira nos Alpes, conduzindo água do degelo glaciar por uma escarpa até aos campos',
   summary:'Verso: “Suone”, aqueduto tradicional de madeira nos Alpes, conduzindo água do degelo glaciar por uma escarpa até aos campos; simboliza o desafio permanente de garantir o abastecimento de água.'
  }},
  'CHF:200':{front:{
   summary:'Frente: mão direita com uma régua a ilustrar a expansão da matéria, Big Bang, sistema planetário e distribuição das massas terrestres durante o período Cretácico; o tema central é a ciência e a investigação na Suíça.'
  }},
  'JPY:2000':{back:{
   title:'Cena de “Genji Monogatari” (O Conto de Genji), com Murasaki Shikibu',
   summary:'Verso: cena de “Genji Monogatari” (O Conto de Genji), obra clássica da literatura japonesa; retrato de Murasaki Shikibu, a quem é atribuída a autoria da obra.'
  }},
  'BAM:200':{back:{
   title:'Ponte Mehmed Paša Sokolović sobre o rio Drina, Višegrad',
   summary:'Verso: Ponte Mehmed Paša Sokolović sobre o rio Drina, em Višegrad, Bósnia e Herzegovina.'
  }},
  'BYN:5':{front:{title:'Torre Belaja (“Branca”), Kamenets, distrito de Brest',summary:'Frente: Torre Belaja (“Branca”), em Kamenets, distrito de Brest.'}},
  'BYN:10':{front:{title:'Igreja Spaso-Preobrazhenskaja, Polotsk, distrito de Vitebsk',summary:'Frente: Igreja Spaso-Preobrazhenskaja, em Polotsk, distrito de Vitebsk.'}},
  'BYN:20':{front:{title:'Palácio Rumjantsev e Paskevich, Gomel',summary:'Frente: Palácio Rumjantsev e Paskevich, em Gomel.'}},
  'BDT:50':{back:{title:'“The Struggle” (“A Luta”), de Zainul Abedin',summary:'Verso: “The Struggle” (“A Luta”), pintura de Shilpacharya Zainul Abedin.'}},
  'LKR:50':{front:{
   title:'Ponte de Manampitiya, com a ponte antiga, papa-moscas-azul-do-Sri-Lanka e borboleta-folha-azul',
   summary:'Frente: nova ponte de Manampitiya ao lado da ponte antiga; papa-moscas-azul-do-Sri-Lanka (Eumyias sordida) e borboleta-folha-azul (Kallima horscampoi).'
  }},
  'LKR:1000':{front:{
   title:'Túnel de Ramboda e fauna do Sri Lanka',
   summary:'Frente: Túnel de Ramboda e a parede rochosa existente no local antes da construção; papagaio-pendente-do-Sri-Lanka (Loriculus beryllinus) e borboleta Ypthima ceylonica.'
  }},
  'LAK:50000':{front:{title:'Kaysone Phomvihane e Wat Xieng Thong, Luang Prabang',summary:'Frente: Kaysone Phomvihane e o templo Wat Xieng Thong (“Cidade Dourada”), em Luang Prabang.'}},
  'AED:50':{front:{title:'Os sete pais fundadores após a assinatura do documento de união',summary:'Frente: os sete pais fundadores com a bandeira, após a assinatura do documento de união.'},back:{title:'Sheikh Zayed bin Sultan Al Nahyan a assinar o documento de união',summary:'Verso: Sheikh Zayed bin Sultan Al Nahyan a assinar o documento de união; Museu Etihad (Union Museum), Dubai.'}},
  'AED:200':{front:{title:'Zayed Sports City e edifício do Tribunal da Sharia',summary:'Frente: Zayed Sports City e edifício do Tribunal da Sharia.'}},
  'AED:500':{front:{summary:'Frente: Sheikh Zayed e Pavilhão Terra — Sustentabilidade, na Expo City Dubai.'}},
  'AED:1000':{back:{title:'Central Nuclear de Barakah, região de Al-Dhafra',summary:'Verso: Central Nuclear de Barakah, na região de Al-Dhafra, Abu Dhabi.'}},
  'IQD:10000':{back:{title:'Al-manara al-hadba fi al-Mawsil — minarete inclinado da Grande Mesquita de al-Nuri, Mossul',summary:'Verso: Al-manara al-hadba fi al-Mawsil, o célebre minarete inclinado da Grande Mesquita de al-Nuri, em Mossul.'}},
  'IQD:25000':{back:{title:'Rei Hammurabi recebe a Lei',summary:'Verso: representação do rei Hammurabi a receber a Lei.'}},
  'AFN:50':{back:{title:'Estrada para o passo de Salang, Hindu Kush',summary:'Verso: estrada para o passo de Salang, na cordilheira Hindu Kush.'}},
  'MVR:50':{front:{title:'Homens a puxar barcos para a água e rapaz a recitar o Alcorão',summary:'Frente: homens a puxar barcos da praia para a água; rapaz sentado a recitar o Alcorão.'}},
  'UGX:20000':{front:{title:'“Crescimento socioeconómico da cidade de Kampala”, Monumento do Centenário',summary:'Frente: “Crescimento socioeconómico da cidade de Kampala”, Monumento do Centenário, no Parque do Centenário, Kampala.'}},
  'ETB:100':{back:{summary:'Verso: grutas de Sof Omar e porta da cidade de Harar.'}},
  'MRU:20':{front:{title:'Grande Mesquita de Gataga, Kaédi, região de Gorgol',summary:'Frente: Grande Mesquita de Gataga, em Kaédi, região de Gorgol.'}},
  'KMF:2000':{front:{title:'Mesquita e mercado de Moroni',summary:'Frente: mesquita e mercado de Moroni.'}},
  'ZMW:200':{front:{title:'Águia-pescadora, Ponte de Kazungula sobre o rio Zambeze e brasão',summary:'Frente: águia-pescadora e Ponte de Kazungula sobre o rio Zambeze, entre a Zâmbia e o Botsuana; brasão.'}},
  'MUR:200':{back:{title:'Mercado',summary:'Verso: mercado.'}},
  'LRD:20':{back:{title:'Mercado',summary:'Verso: mercado.'}},
  'LRD:100':{back:{title:'Mulher no mercado',summary:'Verso: mulher no mercado.'}},
  'MGA:1000':{front:{title:'Ponte Kamoro na RN 4, região de Boeny',summary:'Frente: Ponte Kamoro na RN 4, região de Boeny.'}},
  'BSD:0':{front:{title:'Elizabeth II, flor e contorno das Bahamas',summary:'Frente: Elizabeth II, flor e contorno das Bahamas.'},back:{title:'Sister Sarah e Mercado de Nassau',summary:'Verso: Sister Sarah e Mercado de Nassau.'}},
  'BSD:1':{front:{title:'Contorno das Bahamas, flor e Sir Lynden O. Pindling',summary:'Frente: contorno das Bahamas, flor e Sir Lynden O. Pindling.'}},
  'BSD:3':{front:{title:'Elizabeth II, flor e contorno das Bahamas',summary:'Frente: Elizabeth II, flor e contorno das Bahamas.'}},
  'BSD:20':{front:{title:'Mapa das Bahamas, flor e Sir Milo B. Butler',summary:'Frente: mapa das Bahamas, flor e Sir Milo B. Butler.'}},
  'BBD:10':{back:{title:'Ponte Charles Duncan O’Neal sobre o Careenage, Bridgetown',summary:'Verso: Ponte Charles Duncan O’Neal sobre o Careenage, em Bridgetown.'}},
  'JMD:2000':{back:{title:'Estudante da Central Branch Primary School, Kingston',summary:'Verso: estudante da Central Branch Primary School, em Kingston, representando a diversidade da população jamaicana.'}},
  'TTD:5':{back:{title:'Banco Central no Eric Williams Financial Complex e mercado',summary:'Verso: edifício do Banco Central no Eric Williams Financial Complex e mercado de produtos agrícolas.'}},
  'BZD:5':{back:{title:'Península de Belize City e Haulover Creek',summary:'Verso: Península de Belize City e Haulover Creek; edifício do Supremo Tribunal e Catedral de Saint John, em Belize City.'}},
  'XCD:10':{back:{title:'Admiralty Bay, São Vicente, e “Warspite”, Anguila',summary:'Verso: Admiralty Bay, em São Vicente, e “Warspite”, em Anguila.'}},
  'KYD:1':{back:{title:'Escarpa rochosa “The Bluff”',summary:'Verso: escarpa rochosa conhecida como “The Bluff”.'}},
  'CKD:3':{front:{title:'“Ina e o Tubarão”, lenda polinésia',summary:'Frente: “Ina e o Tubarão”, motivo de uma lenda polinésia.'}},
  'NIO:50':{front:{title:'Mercado de Artesanato, Masaya',summary:'Frente: Mercado de Artesanato de Masaya.'}}
 };
 const mdl=[1,5,10,20,50,100,200,500,1000];
 for(const v of mdl)fixes[`MDL:${v}`]={front:{title:'Ștefan cel Mare (Estêvão, o Grande)',summary:'Frente: Ștefan cel Mare (Estêvão, o Grande).'}};
 const stores=()=>[
  window.NOTE_CONTEXT_MANUAL,window.NOTE_CONTEXT_AFRICA3,window.NOTE_CONTEXT_AFRICA2,window.NOTE_CONTEXT_AFRICA1,
  window.NOTE_CONTEXT_CATALOG,window.NOTE_CONTEXT_ENRICHMENT,window.NOTE_CONTEXT_QUALITY,
  window.NOTE_CONTEXT_WAVE5,window.NOTE_CONTEXT_WAVE4,window.NOTE_CONTEXT_WAVE3,window.NOTE_CONTEXT_WAVE2
 ].filter(Boolean);
 for(const store of stores())for(const [key,parts] of Object.entries(fixes)){
  if(!store[key])continue;
  for(const [side,fields] of Object.entries(parts)){
   store[key][side] ||= {};
   Object.assign(store[key][side],fields);
  }
 }
 window.NOTE_CONTEXT_EDITORIAL_AUDIT_FIXES=fixes;
})();
