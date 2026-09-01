// Africa wave 7 — Cabo Verde, Lesoto, Eswatini, Maurícia e Seicheles
// Imagens locais importadas do Bank Note Museum / banknote.ws.
(()=>{
 const defs=[
  {id:'CPV',name:'Cabo Verde',flag:'🇨🇻',continent:'Africa',currency:'CVE',capital:'Praia',population:'≈ 530 mil',language:'Português / Crioulo cabo-verdiano',history:[['1914–1975','Escudo de Cabo Verde sob administração portuguesa'],['1975–hoje','Escudo cabo-verdiano (CVE)'],['1998–hoje','CVE ligado ao euro através de acordo cambial']]},
  {id:'LSO',name:'Lesoto',flag:'🇱🇸',continent:'Africa',currency:'LSL',capital:'Maseru',population:'≈ 2,3 milhões',language:'Sesotho / Inglês',history:[['antes de 1980','Rand sul-africano'],['1980–hoje','Loti / maloti do Lesoto (LSL), em paridade com o rand']]},
  {id:'SWZ',name:'Eswatini',flag:'🇸🇿',continent:'Africa',currency:'SZL',capital:'Mbabane / Lobamba',population:'≈ 1,25 milhões',language:'SiSwati / Inglês',history:[['1974–2018','Lilangeni da Suazilândia'],['2018–hoje','Lilangeni de Eswatini (SZL), em paridade com o rand']]},
  {id:'MUS',name:'Maurícia',flag:'🇲🇺',continent:'Africa',currency:'MUR',capital:'Port Louis',population:'≈ 1,3 milhões',language:'Inglês / Francês / Crioulo mauriciano',history:[['1877–hoje','Rupia mauriciana (MUR)'],['1967–hoje','Emissão pelo Bank of Mauritius']]},
  {id:'SYC',name:'Seicheles',flag:'🇸🇨',continent:'Africa',currency:'SCR',capital:'Victoria',population:'≈ 130 mil',language:'Crioulo seichelense / Inglês / Francês',history:[['1914–hoje','Rupia das Seicheles (SCR)'],['1983–hoje','Emissão pelo Central Bank of Seychelles']]}
 ];
 const currencies={
  CVE:{name:'Escudo cabo-verdiano',symbol:'$',group:'Cabo Verde',source:'Banco de Cabo Verde',rate:110.265,material:'Papel / polímero',notes:[200,500,1000,2000,5000],countries:['CPV'],focus:false,assetStatus:'local-banknotews'},
  LSL:{name:'Loti do Lesoto',symbol:'M',group:'Lesoto',source:'Central Bank of Lesotho',rate:20.7,material:'Papel',notes:[10,20,50,100,200],countries:['LSO'],focus:false,assetStatus:'local-banknotews'},
  SZL:{name:'Lilangeni de Eswatini',symbol:'E',group:'Eswatini',source:'Central Bank of Eswatini',rate:20.7,material:'Papel',notes:[10,20,50,100,200],countries:['SWZ'],focus:false,assetStatus:'local-banknotews'},
  MUR:{name:'Rupia mauriciana',symbol:'₨',group:'Maurícia',source:'Bank of Mauritius',rate:54,material:'Polímero',notes:[25,50,100,200,500,1000,2000],countries:['MUS'],focus:false,assetStatus:'local-banknotews'},
  SCR:{name:'Rupia das Seicheles',symbol:'₨',group:'Seicheles',source:'Central Bank of Seychelles',rate:16.2,material:'Papel',notes:[25,50,100,500],countries:['SYC'],focus:false,assetStatus:'local-banknotews'}
 };
 const iso={'132':'CPV','426':'LSO','748':'SWZ','480':'MUS','690':'SYC'};
 const official={
  CVE:'https://www.bcv.cv/pt/Notas%20e%20Moedas/Notas/Paginas/Notas.aspx',
  LSL:'https://centralbank.org.ls/currency/',
  SZL:'https://www.centralbank.org.sz/currency/',
  MUR:'https://www.bom.mu/bank-notes-coins/bank-notes/virtual-museum',
  SCR:'https://www.cbs.sc/Currency/NotesAndCoins.html'
 };
 const banknotePage={CVE:'https://www.banknote.ws/COLLECTION/countries/AFR/CVE/CVE.htm',LSL:'https://www.banknote.ws/COLLECTION/countries/AFR/LES/LES.htm',SZL:'https://www.banknote.ws/COLLECTION/countries/AFR/SWZ/SWZ.htm',MUR:'https://www.banknote.ws/COLLECTION/countries/AFR/MRS/MRS-MRS.htm',SCR:'https://www.banknote.ws/COLLECTION/countries/AFR/SEY/SEY.htm'};
 const local=(code,value,side)=>`/assets/notes/banknotews/${code.toLowerCase()}/${value}-${side}.jpg`;
 const oldFetch=window.fetch.bind(window);
 window.fetch=async(...args)=>{
  const req=args[0],url=typeof req==='string'?req:req?.url||'';const r=await oldFetch(...args);
  if(url.includes('/data/countries.json')){const data=await r.clone().json();for(const c of defs)if(!data.some(x=>x.id===c.id))data.push(c);return new Response(JSON.stringify(data),{status:r.status,statusText:r.statusText,headers:{'Content-Type':'application/json; charset=utf-8'}})}
  if(url.includes('/data/currencies.json')){const data=await r.clone().json();for(const [code,def] of Object.entries(currencies))data[code]={...(data[code]||{}),...def};return new Response(JSON.stringify(data),{status:r.status,statusText:r.statusText,headers:{'Content-Type':'application/json; charset=utf-8'}})}
  if(url.includes('/data/iso-map.json')){const data=await r.clone().json();Object.assign(data,iso);return new Response(JSON.stringify(data),{status:r.status,statusText:r.statusText,headers:{'Content-Type':'application/json; charset=utf-8'}})}
  if(!url.includes('/data/notes.json'))return r;
  const data=await r.clone().json();
  for(const [code,def] of Object.entries(currencies))for(const value of def.notes){
   let n=data.find(x=>x.currency===code&&Number(x.value)===Number(value));if(!n){n={currency:code,value};data.push(n)}
   Object.assign(n,{status:'circulating',statusLabel:'Em circulação',source:def.source,material:code==='CVE'&&value===200?'Polímero':def.material,front:local(code,value,'front'),back:local(code,value,'back'),imageStatus:'local-reference',imageSource:'Bank Note Museum · banknote.ws · cópia local',imageSourceUrl:banknotePage[code],officialUrl:official[code],officialLabel:`Ver ${code} na fonte oficial`});
  }
  return new Response(JSON.stringify(data),{status:r.status,statusText:r.statusText,headers:{'Content-Type':'application/json; charset=utf-8'}})
 };
})();

window.NOTE_CONTEXT_AFRICA7={
 'CVE:200':{front:{title:'Henrique Teixeira de Sousa',summary:'Retrato do médico e escritor cabo-verdiano Henrique Teixeira de Sousa, com referências à ilha do Fogo e à viticultura.',more:'A nota homenageia o escritor e médico e liga a sua figura à ilha natal.'},back:{title:'Pico do Fogo',summary:'Vulcão do Fogo e motivos ligados às uvas da região.',more:'O verso celebra uma das paisagens mais reconhecíveis de Cabo Verde.'}},
 'CVE:500':{front:{title:'Jorge Barbosa',summary:'Retrato do poeta Jorge Barbosa e referências à literatura cabo-verdiana.',more:'Jorge Barbosa foi uma figura central do movimento literário Claridade.'},back:{title:'Poesia e paisagem',summary:'Versos, pena de escrita e motivos paisagísticos associados à obra de Jorge Barbosa.',more:'A composição transforma a literatura cabo-verdiana no tema principal do verso.'}},
 'CVE:1000':{front:{title:'Codé di Dona e o funaná',summary:'Músico e compositor Codé di Dona com acordeão; a emissão atualizada inclui banda holográfica e mapa da ilha de Santiago.',more:'A nota mantém o funaná como tema e reforça os elementos de segurança.'},back:{title:'Ferrinho e funaná',summary:'Músico tocando ferrinho, instrumento rítmico característico do funaná.',more:'O verso celebra um dos géneros musicais mais identitários de Cabo Verde.'}},
 'CVE:2000':{front:{title:'Cesária Évora',summary:'Retrato da cantora Cesária Évora, a “Diva dos Pés Descalços”, associado à morna.',more:'A emissão atualizada conserva a homenagem à cantora.'},back:{title:'Violino e morna',summary:'Violino e elementos musicais ligados à morna cabo-verdiana.',more:'O instrumento reforça a homenagem à tradição musical internacionalizada por Cesária Évora.'}},
 'CVE:5000':{front:{title:'Aristides Pereira',summary:'Retrato de Aristides Pereira, primeiro Presidente da República de Cabo Verde.',more:'A maior denominação desta família homenageia uma figura central da independência e do Estado cabo-verdiano.'},back:{title:'Arquipélago e farol',summary:'Mapa estilizado das ilhas de Cabo Verde e motivos marítimos, incluindo um farol.',more:'O verso sublinha a identidade insular e atlântica do país.'}},
 'LSL:10':{front:{title:'Três reis do Lesoto',summary:'Retratos de Moshoeshoe II, Letsie III e Moshoeshoe I, com brasão nacional e mokorotlo.',more:'A frente reúne a continuidade histórica da monarquia e símbolos nacionais do Lesoto.'},back:{title:'Flores do Lesoto',summary:'Flores de cosmos enquadradas por padrões decorativos.',more:'O motivo natural destaca a flora do reino montanhoso.'}},
 'LSL:20':{front:{title:'Monarquia e identidade nacional',summary:'Moshoeshoe II, Letsie III e Moshoeshoe I, brasão do Lesoto e mokorotlo.',more:'O desenho comum da série moderna associa a monarquia aos símbolos nacionais.'},back:{title:'Arquitetura tradicional basotho',summary:'Casas tradicionais basotho num cenário rural.',more:'A cena recorda a arquitetura vernacular e a vida comunitária do Lesoto.'}},
 'LSL:50':{front:{title:'Três reis do Lesoto',summary:'Retratos dos três monarcas e o brasão nacional.',more:'O mokorotlo e os motivos geométricos reforçam a identidade cultural basotho.'},back:{title:'Cultura basotho',summary:'Grupo de pessoas em trajes tradicionais numa cena cultural.',more:'A imagem celebra a população, o vestuário e as tradições do Lesoto.'}},
 'LSL:100':{front:{title:'Monarquia do Lesoto',summary:'Os três reis com o brasão e o mokorotlo.',more:'A composição liga o fundador histórico do reino à monarquia contemporânea.'},back:{title:'Pastoreio nas montanhas',summary:'Pastor com rebanho de ovelhas numa paisagem montanhosa.',more:'O pastoreio é um elemento tradicional da economia rural do Lesoto.'}},
 'LSL:200':{front:{title:'Reis e símbolos nacionais',summary:'Retratos de Moshoeshoe II, Letsie III e Moshoeshoe I, brasão e mokorotlo.',more:'A maior denominação regular mantém a iconografia monárquica comum.'},back:{title:'Cavaleiro basotho',summary:'Homem a cavalo numa paisagem do Lesoto.',more:'O cavalo basotho está profundamente associado à mobilidade e à cultura das terras altas.'}}
};
Object.assign(window.NOTE_CONTEXT_MANUAL||(window.NOTE_CONTEXT_MANUAL={}),window.NOTE_CONTEXT_AFRICA7);
