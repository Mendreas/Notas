(()=>{
 const AFR=new Set(['ZAR','BWP','NAD','XOF','XAF','GHS','UGX','TZS','ETB','RWF','MRU','KMF','STN','ZMW','MWK','MZN','AOA','SLE','KES','NGN','TND','DZD','EGP','MAD','SCR','MUR','CVE','SZL','LSL','LRD','GNF','DJF','ERN','SDG','BIF','MGA','CDF','GMD','SSP','LYD','SOS','ZWG']);
 const COUNTRY={ZAR:'África do Sul',BWP:'Botsuana',NAD:'Namíbia',XOF:'África Ocidental',XAF:'África Central',GHS:'Gana',UGX:'Uganda',TZS:'Tanzânia',ETB:'Etiópia',RWF:'Ruanda',MRU:'Mauritânia',KMF:'Comores',STN:'São Tomé e Príncipe',ZMW:'Zâmbia',MWK:'Malawi',MZN:'Moçambique',AOA:'Angola',SLE:'Serra Leoa',KES:'Quénia',NGN:'Nigéria',TND:'Tunísia',DZD:'Argélia',EGP:'Egito',MAD:'Marrocos',SCR:'Seicheles',MUR:'Maurícia',CVE:'Cabo Verde',SZL:'Eswatini',LSL:'Lesoto',LRD:'Libéria',GNF:'Guiné',DJF:'Djibuti',ERN:'Eritreia',SDG:'Sudão',BIF:'Burundi',MGA:'Madagáscar',CDF:'República Democrática do Congo',GMD:'Gâmbia',SSP:'Sudão do Sul',LYD:'Líbia',SOS:'Somália',ZWG:'Zimbabué'};
 const GENERIC=/O emissor escolheu|A personalidade foi escolhida|O motivo valoriza|O motivo representa|O motivo identifica|Os símbolos oficiais reforçam|A imagem representa|Cada verso|Os reversos|As frentes|identidade nacional|património natural do país|história, cultura, território/i;
 const R=[
  [/\bPresident\b/gi,'Presidente'],[/\bKing\b/gi,'Rei'],[/\bQueen\b/gi,'Rainha'],[/\bPrince\b/gi,'Príncipe'],[/\bPrincesses\b/gi,'Princesas'],[/\bPrincess\b/gi,'Princesa'],
  [/\bwoman\b/gi,'mulher'],[/\bwomen\b/gi,'mulheres'],[/\bgirl\b/gi,'rapariga'],[/\bgirls\b/gi,'raparigas'],[/\bboy\b/gi,'rapaz'],[/\bboys\b/gi,'rapazes'],[/\bman\b/gi,'homem'],[/\bmen\b/gi,'homens'],
  [/\bbirds\b/gi,'aves'],[/\bbird\b/gi,'ave'],[/\bflowers\b/gi,'flores'],[/\bflower\b/gi,'flor'],[/\btrees\b/gi,'árvores'],[/\btree\b/gi,'árvore'],[/\bplants\b/gi,'plantas'],[/\bplant\b/gi,'planta'],
  [/\bmountains\b/gi,'montanhas'],[/\bmountain\b/gi,'montanha'],[/\briver\b/gi,'rio'],[/\blake\b/gi,'lago'],[/\bisland\b/gi,'ilha'],[/\bislands\b/gi,'ilhas'],[/\blandscape\b/gi,'paisagem'],[/\bbeach\b/gi,'praia'],
  [/\bbuilding\b/gi,'edifício'],[/\bbuildings\b/gi,'edifícios'],[/\bbridge\b/gi,'ponte'],[/\bdam\b/gi,'barragem'],[/\bwaterfall\b/gi,'cascata'],[/\bfalls\b/gi,'cascatas'],[/\bfortress\b/gi,'fortaleza'],[/\bfort\b/gi,'forte'],[/\bcastle\b/gi,'castelo'],[/\bpalace\b/gi,'palácio'],[/\bmosque\b/gi,'mesquita'],[/\bcathedral\b/gi,'catedral'],[/\btemple\b/gi,'templo'],[/\bchurch\b/gi,'igreja'],
  [/\bmarket\b/gi,'mercado'],[/\bschool\b/gi,'escola'],[/\buniversity\b/gi,'universidade'],[/\bparliament\b/gi,'Parlamento'],[/\bcourt House\b/gi,'Tribunal'],[/\bport\b/gi,'porto'],[/\bwaterfront\b/gi,'frente marítima'],[/\brefinery\b/gi,'refinaria'],[/\bmine\b/gi,'mina'],[/\bmining\b/gi,'mineração'],[/\bagriculture\b/gi,'agricultura'],[/\bagricultural\b/gi,'agrícola'],
  [/\bfishermen\b/gi,'pescadores'],[/\bfisherman\b/gi,'pescador'],[/\bhorsemen\b/gi,'cavaleiros'],[/\bshepherd\b/gi,'pastor'],[/\bdrummers\b/gi,'tocadores de tambor'],[/\bdancers\b/gi,'dançarinos'],[/\bdancer\b/gi,'dançarino'],[/\bfieldwork\b/gi,'trabalho agrícola'],[/\bplanting rice\b/gi,'plantação de arroz'],[/\bbanana harvest\b/gi,'colheita de banana'],
  [/\bcattle\b/gi,'gado'],[/\bcow\b/gi,'vaca'],[/\bsheep\b/gi,'ovelha'],[/\bgoat\b/gi,'cabra'],[/\bbuffalos\b/gi,'búfalos'],[/\bbuffalo\b/gi,'búfalo'],[/\bhippos\b/gi,'hipopótamos'],[/\bhippo\b/gi,'hipopótamo'],[/\belephants\b/gi,'elefantes'],[/\belephant\b/gi,'elefante'],[/\brhinoceroses\b/gi,'rinocerontes'],[/\brhinoceros\b/gi,'rinoceronte'],[/\blions\b/gi,'leões'],[/\blion\b/gi,'leão'],[/\bgiraffes\b/gi,'girafas'],[/\bgiraffe\b/gi,'girafa'],[/\bantelopes\b/gi,'antílopes'],[/\bantelope\b/gi,'antílope'],[/\bostriches\b/gi,'avestruzes'],[/\bostrich\b/gi,'avestruz'],[/\bgorillas\b/gi,'gorilas'],[/\bwhale\b/gi,'baleia'],[/\bfrog\b/gi,'rã'],[/\bmonkey\b/gi,'macaco'],[/\bparrot\b/gi,'papagaio'],[/\bpigeons\b/gi,'pombos'],[/\bpigeon\b/gi,'pombo'],
  [/\bcoat of arms\b/gi,'brasão'],[/\bflag\b/gi,'bandeira'],[/\boutline of\b/gi,'contorno de'],[/\bmap of\b/gi,'mapa de'],[/\bstatue\b/gi,'estátua'],[/\bmonument\b/gi,'monumento'],[/\btraditional\b/gi,'tradicional'],[/\bcargo ships\b/gi,'navios de carga'],[/\bcargo ship\b/gi,'navio de carga'],[/\boil industry\b/gi,'indústria petrolífera'],[/\boil derrick\b/gi,'torre de perfuração petrolífera'],[/\bhydroelectric\b/gi,'hidroelétrica'],[/\bpower plant\b/gi,'central elétrica'],[/\brailroad\b/gi,'ferrovia'],[/\btrain\b/gi,'comboio'],[/\broad\b/gi,'estrada'],
  [/\bwith\b/gi,'com'],[/\band\b/gi,'e'],[/\bof the\b/gi,'da'],[/\bof\b/gi,'de'],[/\bon\b/gi,'sobre'],[/\bin\b/gi,'em'],[/\bnear\b/gi,'perto de']
 ];
 function norm(s){let x=String(s||'');for(const [a,b] of R)x=x.replace(a,b);return x.replace(/\s+([,.;:])/g,'$1').replace(/\s{2,}/g,' ').replace(/\bda Africa\b/gi,'de África').replace(/\bAfrica\b/g,'África').trim()}
 const PEOPLE=[
  [/Nelson.*Mandela/i,'Nelson Mandela foi o principal símbolo da luta contra o apartheid e o primeiro presidente negro da África do Sul; o seu retrato representa a transição democrática do país.'],
  [/Seretse Khama/i,'Sir Seretse Khama foi o primeiro presidente do Botsuana e uma figura central na formação do Estado após a independência.'],
  [/Kgalemang.*Motsete/i,'Kgalemang Tumediso Motsete foi professor, compositor e autor da letra do hino nacional do Botsuana, razão pela qual é homenageado na moeda.'],
  [/Sam Nujoma/i,'Sam Nujoma liderou o movimento de independência e foi o primeiro presidente da Namíbia, tornando-se uma figura fundadora do Estado moderno.'],
  [/Hendrik Witbooi/i,'Hendrik Witbooi foi um líder nama que resistiu à expansão colonial alemã e é lembrado como uma das grandes figuras históricas da Namíbia.'],
  [/Mohammed VI|Mohamed VI/i,'Mohammed VI é o rei de Marrocos; o seu retrato estabelece a continuidade da monarquia e da autoridade do Estado emissor.'],
  [/Jomo Kenyatta|Kenyatta statue/i,'Jomo Kenyatta foi o primeiro presidente do Quénia independente; a estátua e o centro de convenções associam memória política e modernização de Nairobi.'],
  [/Big Six|Nkrumah/i,'Os “Big Six” foram líderes do movimento nacionalista ganês que preparou o caminho para a independência; entre eles estava Kwame Nkrumah, primeiro chefe de governo e presidente do Gana.'],
  [/Julius.*Nyerere/i,'Julius Nyerere foi o primeiro presidente da Tanzânia e uma das figuras mais influentes da independência e do pan-africanismo na África Oriental.'],
  [/Amani.*Karume/i,'Abeid Amani Karume foi o primeiro presidente de Zanzibar após a revolução de 1964 e uma figura-chave na formação da Tanzânia unida.'],
  [/Samora.*Machel/i,'Samora Machel liderou a luta de independência moçambicana e tornou-se o primeiro presidente de Moçambique em 1975.'],
  [/Agostinho Neto/i,'Agostinho Neto foi líder do movimento de independência e primeiro presidente de Angola; permanece uma figura central da narrativa nacional angolana.'],
  [/Bai Bureh/i,'Bai Bureh foi um líder temne associado à resistência contra o domínio colonial britânico na Serra Leoa no final do século XIX.'],
  [/Wallace-Johnson/i,'Isaac Wallace-Johnson foi sindicalista, jornalista e ativista pan-africanista, ligado à luta por direitos políticos e sociais na Serra Leoa.'],
  [/Sengbe Pieh/i,'Sengbe Pieh, conhecido também como Joseph Cinqué, liderou a revolta do navio Amistad e tornou-se símbolo da resistência à escravatura.'],
  [/Tafawa Balewa/i,'Abubakar Tafawa Balewa foi o primeiro primeiro-ministro da Nigéria independente e uma figura fundadora da política nacional.'],
  [/Alvan Ikoku/i,'Alvan Ikoku foi educador e ativista nigeriano, conhecido pela defesa da expansão e reforma do ensino.'],
  [/Murtala.*Muhammed/i,'Murtala Muhammed foi chefe de Estado da Nigéria em 1975–1976 e é recordado pelas reformas administrativas e pela política africana do seu governo.'],
  [/Obafemi Awolowo/i,'Obafemi Awolowo foi um dos principais líderes nacionalistas e políticos da Nigéria, associado a reformas educativas e ao desenvolvimento regional.'],
  [/Ahmadu Bello/i,'Ahmadu Bello foi primeiro-ministro da Região Norte da Nigéria e uma das figuras políticas mais influentes do período da independência.'],
  [/Nnamdi Azikiwe/i,'Nnamdi Azikiwe foi um dos grandes líderes nacionalistas e o primeiro presidente da Nigéria republicana.'],
  [/Mai-Bornu|Clement Isong/i,'Aliyu Mai-Bornu e Clement Isong foram governadores do Banco Central da Nigéria; a nota homenageia a história institucional da autoridade monetária.'],
  [/Tawhida.*Ben Cheikh/i,'Tawhida Ben Cheikh foi a primeira médica tunisina e uma pioneira da medicina e dos direitos das mulheres no país.'],
  [/Farhat Hached/i,'Farhat Hached foi sindicalista e líder nacionalista tunisino, assassinado em 1952, e tornou-se símbolo da luta pela independência.'],
  [/Hedi Nouira/i,'Hédi Nouira foi economista, governador do banco central e primeiro-ministro da Tunísia; está ligado à modernização económica do país.'],
  [/Henrique Teixeira de Sousa/i,'Henrique Teixeira de Sousa foi médico e escritor cabo-verdiano, cuja obra retratou a sociedade e a identidade das ilhas, em especial do Fogo.'],
  [/Jorge Barbosa/i,'Jorge Barbosa foi um dos fundadores do movimento literário Claridade e uma figura decisiva na afirmação de uma literatura especificamente cabo-verdiana.'],
  [/Codé di Dona/i,'Codé di Dona foi músico e compositor de funaná, género tradicional de Santiago; a nota homenageia uma expressão cultural essencial de Cabo Verde.'],
  [/Cesária Évora/i,'Cesária Évora, conhecida como a “diva dos pés descalços”, levou a morna cabo-verdiana ao mundo e tornou-se um dos maiores símbolos culturais do arquipélago.'],
  [/Aristides.*Pereira/i,'Aristides Pereira foi o primeiro presidente de Cabo Verde após a independência, exercendo o cargo entre 1975 e 1991.'],
  [/Mswati III/i,'Mswati III é o rei de Eswatini; o retrato identifica a monarquia como instituição central do Estado e da identidade nacional.'],
  [/Letsie III|Moshoeshoe I|Moshoeshoe II/i,'A frente reúne Letsie III, Moshoeshoe I e Moshoeshoe II, ligando a monarquia atual ao fundador do povo basotho e à continuidade histórica do Lesoto.'],
  [/William.*Tubman/i,'William Tubman foi presidente da Libéria entre 1944 e 1971 e marcou profundamente a modernização económica e política do país no século XX.'],
  [/Samuel.*Doe/i,'Samuel Doe foi chefe de Estado e depois presidente da Libéria durante a década de 1980; o seu retrato pertence à galeria de líderes representados na série.'],
  [/William.*Tolbert/i,'William Tolbert foi presidente da Libéria entre 1971 e 1980 e é uma das figuras políticas representadas na família monetária.'],
  [/Ali Ahmed Oudoum/i,'Ali Ahmed Oudoum foi uma figura política e administrativa do Djibuti, homenageada como parte da memória pública do país.'],
  [/Mahamoud Harbi/i,'Mahamoud Harbi foi um importante dirigente anticolonial e defensor da independência do Djibuti.'],
  [/Hassan Gouled Aptidon/i,'Hassan Gouled Aptidon foi o primeiro presidente do Djibuti independente, exercendo o cargo de 1977 a 1999.'],
  [/Rwagasore/i,'O príncipe Louis Rwagasore foi líder da independência do Burundi e primeiro-ministro em 1961; foi assassinado pouco antes da independência formal.'],
  [/Melchior Ndadaye/i,'Melchior Ndadaye foi o primeiro presidente do Burundi eleito democraticamente e uma figura marcante da história política contemporânea do país.'],
  [/John Garang/i,'John Garang de Mabior liderou o SPLM/A durante a guerra civil sudanesa e tornou-se primeiro vice-presidente do Sudão; é uma figura fundadora do Sudão do Sul.'],
  [/Omar.*Mukhtar/i,'Omar al-Mukhtar liderou durante anos a resistência líbia contra a ocupação italiana e tornou-se um dos maiores símbolos nacionais da Líbia.'],
  [/Seewoosagur Ramgoolam/i,'Sir Seewoosagur Ramgoolam liderou o movimento para a independência e foi o primeiro primeiro-ministro da Maurícia independente, sendo conhecido como “Pai da Nação”.'],
  [/Sookdeo Bissoondoyal/i,'Sookdeo Bissoondoyal foi educador, reformador social e figura do movimento político que conduziu a Maurícia à independência.'],
  [/Abdool Razack Mohamed/i,'Sir Abdool Razack Mohamed foi advogado e político mauriciano, ligado à representação das comunidades e à construção institucional do país.'],
  [/Renganaden Seeneevassen/i,'Renganaden Seeneevassen foi advogado e político mauriciano, associado ao movimento trabalhista e à vida parlamentar anterior à independência.'],
  [/Moilin Jean Ah-Chuen/i,'Sir Moilin Jean Ah-Chuen foi empresário, político e filantropo mauriciano, ligado ao desenvolvimento económico e social do país.'],
  [/Maurice Paturau|Joseph Maurice Paturau/i,'Joseph Maurice Paturau foi engenheiro, empresário e político mauriciano, associado à industrialização e ao desenvolvimento económico da ilha.'],
  [/Charles Gaetan Duval/i,'Sir Gaëtan Duval foi advogado e uma das figuras políticas mais influentes da Maurícia no período pós-independência.']
 ];
 function specific(t){for(const [re,s] of PEOPLE)if(re.test(t))return s;return ''}
 function explain(title,summary,cur,side){const c=COUNTRY[cur]||cur,t=norm(`${title} ${summary}`).toLowerCase(),sp=specific(`${title} ${summary}`);if(sp)return sp;
  if(cur==='XOF')return side==='front'?'A frente comum do franco CFA da África Ocidental combina património comercial, integração regional e temas de desenvolvimento partilhados pelos países da BCEAO.':'O verso usa fauna e paisagens para representar a diversidade ambiental da África Ocidental.';
  if(cur==='XAF')return side==='front'?'A frente comum do franco CFA da África Central identifica a BEAC e a CEMAC, sublinhando a moeda partilhada e a integração económica regional.':'O verso desenvolve temas de agricultura, saúde, educação e proteção ambiental comuns aos países da África Central.';
  if(/brasão|bandeira|mapa|contorno/.test(t))return `Os símbolos de Estado afirmam a soberania e a identidade institucional de ${c}; na nota reforçam a ligação entre a moeda, o território e a autoridade emissora.`;
  if(/mesquita|catedral|templo|igreja|fortaleza|forte|castelo|palácio|monumento|torre|edifício|universidade|parlamento|tribunal|círculos de pedra|ruínas|arco/.test(t))return `O motivo apresenta património histórico, arquitetónico ou institucional de ${c}. A sua presença na nota transforma a moeda num pequeno inventário visual da memória e das instituições do país.`;
  if(/elefante|rinoceronte|leão|búfalo|girafa|antílope|hipopótamo|avestruz|gorila|ave|papagaio|pombo|rã|baleia|macaco|tartaruga|peixe|crocodilo|zebra|okapi|kudu|gazela|pangolim/.test(t))return `A fauna representada destaca a biodiversidade de ${c} e os ecossistemas característicos do território, funcionando também como símbolo de património natural e conservação.`;
  if(/montanha|cascata|rio|lago|ilha|paisagem|praia|parque nacional|formação rochosa|pico|vale|floresta/.test(t))return `A paisagem liga a nota à geografia de ${c}, valorizando lugares reconhecíveis, recursos naturais e a diversidade ambiental do território.`;
  if(/agric|colheita|plantação|gado|milho|banana|café|cacau|palmeira|pastor|pescador|mercado|trabalho agrícola/.test(t))return `A cena representa atividades agrícolas, pastorícias ou comerciais importantes na vida quotidiana e na economia de ${c}, dando visibilidade ao trabalho e aos recursos locais.`;
  if(/barragem|hidroelétrica|refinaria|mineração|mina|porto|comboio|ferrovia|ponte|central elétrica|satélite|indústria|aeroporto|estrada|oil|petróleo/.test(t))return `O motivo representa infraestrutura, energia ou atividade económica de ${c}, mostrando a modernização e os setores produtivos que sustentam o desenvolvimento nacional.`;
  if(/dança|dançar|tambor|música|instrumento|máscara|cerâmica|cesto|tecel|traje|ferrinho|funaná|morna/.test(t))return `A imagem celebra tradições e expressões culturais de ${c}, preservando na moeda práticas, artes e símbolos associados à identidade das comunidades locais.`;
  return `${side==='front'?'A frente':'O verso'} reúne elementos escolhidos para representar ${c}. O desenho liga a moeda à história, à cultura, às instituições ou ao território nacional.`;
 }
 function wiki(title){const q=norm(title).split(/[;,·]/)[0].trim();return q?`https://pt.wikipedia.org/w/index.php?search=${encodeURIComponent(q)}`:''}
 function review(i,cur,side){if(!i)return null;const o={...i};o.title=norm(o.title);o.summary=norm(o.summary||`${side==='front'?'Frente':'Verso'}: ${o.title}.`);if(!o.more||GENERIC.test(o.more)||/[A-Za-z]+\s+(of|with|and|the)\s+/i.test(o.more)||o.more.length<70)o.more=explain(o.title,o.summary,cur,side);else o.more=norm(o.more);if(!o.wiki)o.wiki=wiki(o.title);return o}
 const OUT={};const manual=window.NOTE_CONTEXT_MANUAL||{},catalog=window.NOTE_CONTEXT_CATALOG||{};
 const keys=new Set([...Object.keys(catalog),...Object.keys(manual)]);
 for(const k of keys){const [cur]=k.split(':');if(!AFR.has(cur))continue;const src=manual[k]||catalog[k];if(!src)continue;OUT[k]={front:review(src.front,cur,'front'),back:review(src.back,cur,'back')};}
 window.NOTE_CONTEXT_AFRICA_REVIEW=OUT;Object.assign(window.NOTE_CONTEXT_MANUAL||(window.NOTE_CONTEXT_MANUAL={}),OUT);
})();
