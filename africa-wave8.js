// Africa wave 8 — Liberia, Gâmbia, Guiné, Burundi, RD Congo, Djibuti, Eritreia, Sudão, Sudão do Sul e Madagáscar
// Denominações revistas em 01-09-2026. Imagens resolvidas em runtime pelo Bank Note Museum.
(()=>{
 const defs=[
  {id:'LBR',name:'Libéria',flag:'🇱🇷',continent:'Africa',currency:'LRD',capital:'Monróvia',population:'≈ 5,7 milhões',language:'Inglês',history:[['1847–1907','Dólar liberiano inicial'],['1907–1935','Libra da África Ocidental Britânica'],['1935–hoje','Dólar liberiano (LRD); USD também tem curso legal']]},
  {id:'GMB',name:'Gâmbia',flag:'🇬🇲',continent:'Africa',currency:'GMD',capital:'Banjul',population:'≈ 2,8 milhões',language:'Inglês',history:[['até 1971','Libra gambiana'],['1971–hoje','Dalasi gambiano (GMD)']]},
  {id:'GIN',name:'Guiné',flag:'🇬🇳',continent:'Africa',currency:'GNF',capital:'Conacri',population:'≈ 15 milhões',language:'Francês e línguas nacionais',history:[['1959–1971','Franco guineense'],['1971–1986','Syli'],['1986–hoje','Franco guineense (GNF)']]},
  {id:'BDI',name:'Burundi',flag:'🇧🇮',continent:'Africa',currency:'BIF',capital:'Gitega',population:'≈ 14 milhões',language:'Kirundi / Francês / Inglês',history:[['1964–hoje','Franco do Burundi (BIF)']]},
  {id:'COD',name:'República Democrática do Congo',flag:'🇨🇩',continent:'Africa',currency:'CDF',capital:'Kinshasa',population:'≈ 115 milhões',language:'Francês e línguas nacionais',history:[['1967–1993','Zaïre'],['1993–1998','Novo zaïre'],['1998–hoje','Franco congolês (CDF)']]},
  {id:'DJI',name:'Djibuti',flag:'🇩🇯',continent:'Africa',currency:'DJF',capital:'Djibuti',population:'≈ 1,2 milhões',language:'Francês / Árabe',history:[['1949–hoje','Franco do Djibuti (DJF), ligado ao dólar dos EUA']]},
  {id:'ERI',name:'Eritreia',flag:'🇪🇷',continent:'Africa',currency:'ERN',capital:'Asmara',population:'≈ 3,7 milhões',language:'Tigrínia / Árabe / Inglês',history:[['até 1997','Birr etíope'],['1997–hoje','Nakfa eritreu (ERN)']]},
  {id:'SDN',name:'Sudão',flag:'🇸🇩',continent:'Africa',currency:'SDG',capital:'Cartum',population:'≈ 51 milhões',language:'Árabe / Inglês',history:[['1992–2007','Dinar sudanês'],['2007–hoje','Libra sudanesa (SDG)']]},
  {id:'SSD',name:'Sudão do Sul',flag:'🇸🇸',continent:'Africa',currency:'SSP',capital:'Juba',population:'≈ 12 milhões',language:'Inglês',history:[['2011–2023','South Sudanese Pound'],['2024–hoje','South Sudan Pound (SSP), nova designação legal']]},
  {id:'MDG',name:'Madagáscar',flag:'🇲🇬',continent:'Africa',currency:'MGA',capital:'Antananarivo',population:'≈ 32 milhões',language:'Malgaxe / Francês',history:[['1961–2005','Franco malgaxe em paralelo com o ariary'],['2005–hoje','Ariary malgaxe (MGA) como unidade oficial']]}
 ];
 const currencies={
  LRD:{name:'Dólar liberiano',symbol:'L$',group:'Libéria',source:'Central Bank of Liberia',rate:230,material:'Papel',notes:[20,50,100,500,1000],countries:['LBR'],focus:false},
  GMD:{name:'Dalasi gambiano',symbol:'D',group:'Gâmbia',source:'Central Bank of The Gambia',rate:84,material:'Papel',notes:[5,10,20,50,100,200],countries:['GMB'],focus:false},
  GNF:{name:'Franco guineense',symbol:'FG',group:'Guiné',source:'Banque Centrale de la République de Guinée',rate:10320,material:'Papel / polímero',notes:[100,500,1000,5000,10000,20000],countries:['GIN'],focus:false},
  BIF:{name:'Franco do Burundi',symbol:'FBu',group:'Burundi',source:'Banque de la République du Burundi',rate:3500,material:'Papel',notes:[100,500,1000,2000,5000,10000],countries:['BDI'],focus:false},
  CDF:{name:'Franco congolês',symbol:'FC',group:'RD Congo',source:'Banque Centrale du Congo',rate:3300,material:'Papel',notes:[50,100,200,500,1000,5000,10000,20000],countries:['COD'],focus:false},
  DJF:{name:'Franco do Djibuti',symbol:'Fdj',group:'Djibuti',source:'Banque Centrale de Djibouti',rate:208,material:'Papel',notes:[1000,2000,5000,10000],countries:['DJI'],focus:false},
  ERN:{name:'Nakfa eritreu',symbol:'Nfk',group:'Eritreia',source:'Bank of Eritrea',rate:17.6,material:'Papel',notes:[1,5,10,20,50,100],countries:['ERI'],focus:false},
  SDG:{name:'Libra sudanesa',symbol:'£SD',group:'Sudão',source:'Central Bank of Sudan',rate:720,material:'Papel',notes:[500,1000,2000],countries:['SDN'],focus:false},
  SSP:{name:'Libra do Sudão do Sul',symbol:'SS£',group:'Sudão do Sul',source:'Bank of South Sudan',rate:5500,material:'Papel',notes:[1,5,10,25,50,100,500,1000],countries:['SSD'],focus:false},
  MGA:{name:'Ariary malgaxe',symbol:'Ar',group:'Madagáscar',source:"Banky Foiben'i Madagasikara",rate:5100,material:'Papel',notes:[100,200,500,1000,2000,5000,10000,20000],countries:['MDG'],focus:false}
 };
 const iso={'430':'LBR','270':'GMB','324':'GIN','108':'BDI','180':'COD','262':'DJI','232':'ERI','729':'SDN','728':'SSD','450':'MDG'};
 const ref={
  LRD:{country:'LIB',pick:{20:'W39',50:'W40',100:'W41',500:'W42',1000:'W43'},page:'https://www.banknote.ws/COLLECTION/countries/AFR/LIB/LIB.htm',official:'https://cbl.org.lr/general/currency'},
  GMD:{country:'GAM',pick:{5:'W37',10:'W38',20:'W39',50:'W40',100:'W41',200:'W42'},page:'https://www.banknote.ws/COLLECTION/countries/AFR/GAM/GAM.htm',official:'https://www.cbg.gm/family-of-notes-and-coins'},
  GNF:{country:'GUI',pick:{100:'A47',500:'W52',1000:'48',5000:'49',10000:'W49A',20000:'50'},page:'https://www.banknote.ws/COLLECTION/countries/AFR/GUI/GUI.htm',official:'https://www.bcrg-guinee.org/moyens-de-paiement__trashed/billets-et-monnaie-en-circulation/'},
  BIF:{country:'BUR',pick:{100:'44',500:'50',1000:'51',2000:'52',5000:'W58',10000:'W59'},page:'https://www.banknote.ws/COLLECTION/countries/AFR/BUR/BUR.htm',official:'https://www.brb.bi/node/35'},
  CDF:{country:'CDR',pick:{50:'97',100:'98',200:'99',500:'96',1000:'101',5000:'102',10000:'103',20000:'104'},page:'https://www.banknote.ws/COLLECTION/countries/AFR/CDR/CDR-CDR.htm',official:'https://www.bcc.cd/la-banque/billets-et-monnaie/billets-en-circulation'},
  DJF:{country:'DJI',pick:{1000:'42',2000:'43',5000:'44',10000:'45'},page:'https://www.banknote.ws/COLLECTION/countries/AFR/DJI/DJI-DJI.htm',official:'https://banque-centrale.dj/'},
  ERN:{country:'ERI',pick:{1:'13',5:'14',10:'15',20:'16',50:'17',100:'18'},page:'https://www.banknote.ws/COLLECTION/countries/AFR/ERI/ERI.htm',official:'https://www.banknote.ws/COLLECTION/countries/AFR/ERI/ERI.htm'},
  SDG:{country:'SUD',pick:{500:'W86',1000:'W87',2000:'W88'},page:'https://www.banknote.ws/COLLECTION/countries/AFR/SUD/SUD-SUD.htm',official:'https://cbos.gov.sd/en/content/banknotes'},
  SSP:{country:'SSD',pick:{1:'5',5:'11',10:'12',25:'8',50:'14',100:'15',500:'W20',1000:'W21'},page:'https://www.banknote.ws/COLLECTION/countries/AFR/SSD/SSD.htm',official:'https://boss.gov.ss/bank-notes/'},
  MGA:{country:'MAD',pick:{100:'97',200:'98',500:'99',1000:'100',2000:'101',5000:'102',10000:'103',20000:'104'},page:'https://www.banknote.ws/COLLECTION/countries/AFR/MAD/MAD-BFM.htm',official:'https://nouveauxbillets.bfm.mg/'}
 };
 const img=(country,pick,side)=>`/.netlify/functions/banknotews-image?country=${country}&pick=${encodeURIComponent(pick)}&side=${side}`;
 const oldFetch=window.fetch.bind(window);
 window.fetch=async(...args)=>{const req=args[0],url=typeof req==='string'?req:req?.url||'';const r=await oldFetch(...args);
  if(url.includes('/data/countries.json')){const data=await r.clone().json();for(const c of defs)if(!data.some(x=>x.id===c.id))data.push(c);return new Response(JSON.stringify(data),{status:r.status,statusText:r.statusText,headers:{'Content-Type':'application/json; charset=utf-8'}})}
  if(url.includes('/data/currencies.json')){const data=await r.clone().json();for(const [code,def] of Object.entries(currencies))if(!data[code])data[code]=def;return new Response(JSON.stringify(data),{status:r.status,statusText:r.statusText,headers:{'Content-Type':'application/json; charset=utf-8'}})}
  if(url.includes('/data/iso-map.json')){const data=await r.clone().json();Object.assign(data,iso);return new Response(JSON.stringify(data),{status:r.status,statusText:r.statusText,headers:{'Content-Type':'application/json; charset=utf-8'}})}
  if(!url.includes('/data/notes.json'))return r;const data=await r.clone().json();
  for(const [code,def] of Object.entries(currencies))for(const value of def.notes){let n=data.find(x=>x.currency===code&&Number(x.value)===Number(value));if(!n){n={currency:code,value};data.push(n)}const cfg=ref[code],pick=cfg.pick[value];Object.assign(n,{status:'circulating',statusLabel:'Em circulação',source:def.source,material:def.material,front:img(cfg.country,pick,'front'),back:img(cfg.country,pick,'back'),imageStatus:'reference-resolved',imageSource:'Bank Note Museum · imagem resolvida em runtime',imageSourceUrl:cfg.page,officialUrl:cfg.official,officialLabel:`Ver ${code} na fonte oficial`})}
  return new Response(JSON.stringify(data),{status:r.status,statusText:r.statusText,headers:{'Content-Type':'application/json; charset=utf-8'}})
 };
})();

window.NOTE_CONTEXT_AFRICA8={
 'LRD:20':{front:{title:'William V. S. Tubman',summary:'Retrato do 18.º Presidente da Libéria.',more:'A família monetária moderna usa figuras presidenciais na frente.'},back:{title:'Agricultura',summary:'Cena de trabalho agrícola.',more:'O verso liga a moeda à produção rural liberiana.'}},
 'LRD:50':{front:{title:'Samuel K. Doe',summary:'Retrato do antigo Presidente Samuel K. Doe.',more:'A nota integra a série de figuras históricas liberianas.'},back:{title:'Plantação de palmeiras',summary:'Cena ligada à produção de óleo de palma.',more:'A agricultura comercial surge como tema económico.'}},
 'LRD:100':{front:{title:'William R. Tolbert Jr.',summary:'Retrato do 19.º Presidente da Libéria.',more:'A frente homenageia uma figura política do século XX.'},back:{title:'Mercado liberiano',summary:'Mulher comerciante com criança num mercado.',more:'O motivo celebra o comércio quotidiano e a atividade económica urbana.'}},
 'SSP:1':{front:{title:'John Garang de Mabior',summary:'Retrato do fundador do Sudão do Sul.',more:'John Garang é a figura comum das notas do país.'},back:{title:'Girafa e acácia',summary:'Girafa junto de uma acácia.',more:'A fauna e a paisagem natural dominam o verso.'}},
 'SSP:5':{front:{title:'John Garang de Mabior',summary:'Retrato do fundador do país.',more:'A frente mantém a identidade comum da série.'},back:{title:'Gado Sanga',summary:'Gado tradicional Sanga.',more:'O motivo representa pastoralismo, cultura e economia rural.'}},
 'SSP:10':{front:{title:'John Garang de Mabior',summary:'Retrato de John Garang.',more:'Figura central da independência sul-sudanesa.'},back:{title:'Búfalos e agricultura',summary:'Búfalo africano com cria e ananás.',more:'Fauna e potencial agrícola aparecem juntos.'}},
 'SSP:25':{front:{title:'John Garang de Mabior',summary:'Retrato de John Garang.',more:'Mantém a iconografia nacional comum.'},back:{title:'Órix e petróleo',summary:'Antílopes órix e torre petrolífera.',more:'O verso associa biodiversidade e recursos energéticos.'}},
 'SSP:50':{front:{title:'John Garang de Mabior',summary:'Retrato do fundador do Sudão do Sul.',more:'A nota preserva a identidade visual da família.'},back:{title:'Elefante e petróleo',summary:'Elefante e instalações petrolíferas.',more:'O desenho combina património natural e economia energética.'}},
 'SSP:100':{front:{title:'John Garang de Mabior',summary:'Retrato de John Garang.',more:'Figura histórica central da moeda nacional.'},back:{title:'Leão e cascata',summary:'Leão e paisagem com queda de água.',more:'O verso celebra fauna e paisagens naturais.'}},
 'SSP:500':{front:{title:'John Garang de Mabior',summary:'Retrato de John Garang.',more:'A denominação de 500 já existe com a nova designação “South Sudan Pound”.'},back:{title:'Rio Nilo',summary:'Paisagem do Nilo.',more:'O rio é apresentado como património natural e eixo económico.'}},
 'SSP:1000':{front:{title:'John Garang de Mabior',summary:'Retrato de John Garang.',more:'A maior denominação mantém a identidade nacional comum.'},back:{title:'Avestruzes',summary:'Dois avestruzes.',more:'A imagem destaca a biodiversidade do Sudão do Sul.'}},
 'MGA:100':{front:{title:'Catedral de Ambozontany',summary:'Catedral de Ambozontany, em Fianarantsoa.',more:'A série de 2017 é dedicada a Madagáscar e às suas riquezas.'},back:{title:'Rã de Madagáscar',summary:'Rã endémica.',more:'A biodiversidade singular da ilha é um dos temas da série.'}},
 'MGA:1000':{front:{title:'Ponte Kamoro',summary:'Ponte Kamoro na Route Nationale 4.',more:'Infraestruturas e paisagens regionais estruturam a série.'},back:{title:'Formação rochosa',summary:'Paisagem geológica de Madagáscar.',more:'O verso destaca o património natural da ilha.'}}
};
Object.assign(window.NOTE_CONTEXT_MANUAL||(window.NOTE_CONTEXT_MANUAL={}),window.NOTE_CONTEXT_AFRICA8);
