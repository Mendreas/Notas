#!/usr/bin/env python3
import json,re,pathlib
ROOT=pathlib.Path(__file__).resolve().parents[1]
RAW=ROOT/'data/banknote-context-raw.json'; OUT=ROOT/'note-context-catalog.js'

# The source captions are compact English numismatic labels. Keep proper names and Latin species,
# but translate the recurring descriptive vocabulary so the UI reads naturally in Portuguese.
P=[
('Declaration of Philippine Independence','Declaração da Independência das Filipinas'),('Declaration of Independence','Declaração de Independência'),
('proclamation of Filipino as national language','proclamação do filipino como língua nacional'),('Opening of Malolos Congress','abertura do Congresso de Malolos'),
('National Parliament House','edifício do Parlamento Nacional'),('National Assembly building','edifício da Assembleia Nacional'),('Parliament building','edifício do Parlamento'),
('Presidential residence','residência presidencial'),('Presidential palace','palácio presidencial'),('Royal Ceremonial Hall','Salão Cerimonial Real'),
('Royal palace throne room','sala do trono do Palácio Real'),('Royal palace','palácio real'),('Governmental buildings','edifícios governamentais'),
('Central Bank building','edifício do banco central'),('Bank of Ceylon Headquarters','sede do Bank of Ceylon'),('World Trade Centre','World Trade Centre'),
('National Library','Biblioteca Nacional'),('National Academy of Sciences','Academia Nacional de Ciências'),('National Cultural Center','Centro Cultural Nacional'),
('National Cultural Centre','Centro Cultural Nacional'),('National Martyrs\' monument','Monumento Nacional aos Mártires'),('National Martyrs’ monument','Monumento Nacional aos Mártires'),
('Independence monument','Monumento da Independência'),('Freedom monument','Monumento da Liberdade'),('Victory monument','Monumento da Vitória'),
('Martyrs\' Monument','Monumento dos Mártires'),('Martyrs’ Monument','Monumento dos Mártires'),('monument to','monumento a'),
('State Emblem','emblema do Estado'),('national coat of arms','brasão nacional'),('coat of arms','brasão'),('Omani arms','brasão de Omã'),('arms','brasão'),
('outline of','contorno de'),('map of','mapa de'),('stylized map','mapa estilizado'),('national flag','bandeira nacional'),('flag','bandeira'),
('King Father','Rei-Pai'),('Crown Prince','Príncipe Herdeiro'),('Kings','Reis'),('King','Rei'),('Queen','Rainha'),('Sultan','Sultão'),('President','Presidente'),
('Prince Bishop','Príncipe-Bispo'),('Prince','Príncipe'),('General','General'),('Ayatollah','Aiatolá'),
('old and new façades','fachadas antiga e nova'),('Old and new façades','Fachadas antiga e nova'),('Old Court building','antigo edifício do Tribunal'),
('school building','edifício escolar'),('School building','Edifício escolar'),('school','escola'),('university','universidade'),('library','biblioteca'),
('mosque','mesquita'),('Mosque','Mesquita'),('Grand Mosque','Grande Mesquita'),('temple','templo'),('Temple','Templo'),('church','igreja'),('Church','Igreja'),
('cathedral','catedral'),('monastery','mosteiro'),('Monastery','Mosteiro'),('pagoda','pagode'),('stupa','estupa'),('basilica','basílica'),('shrine','santuário'),
('mausoleum','mausoléu'),('tomb of','túmulo de'),('fortress','fortaleza'),('Fortress','Fortaleza'),('castle','castelo'),('Castle','Castelo'),('fort','forte'),('Fort','Forte'),
('amphitheatre','anfiteatro'),('amphitheater','anfiteatro'),('archaeological site','sítio arqueológico'),('archeological site','sítio arqueológico'),
('archaeological ruins','ruínas arqueológicas'),('archeological ruins','ruínas arqueológicas'),('ancient ruins','ruínas antigas'),('ruins','ruínas'),
('bridge over','ponte sobre'),('bridge','ponte'),('Bridge','Ponte'),('tower','torre'),('Tower','Torre'),('building','edifício'),('Building','Edifício'),
('museum','museu'),('Museum','Museu'),('airport','aeroporto'),('Airport','Aeroporto'),('railroad track and tunnel','linha férrea e túnel'),('railway','ferrovia'),
('hydroelectric power station','central hidroelétrica'),('Hydroelectric complex','complexo hidroelétrico'),('hydroelectric complex','complexo hidroelétrico'),
('power plant','central elétrica'),('Power Plant','Central elétrica'),('nuclear power plant','central nuclear'),('oil refinery','refinaria de petróleo'),('refinery','refinaria'),
('oil pumps','bombas de petróleo'),('oil rigs','plataformas petrolíferas'),('Oil rigs','Plataformas petrolíferas'),('oil well','poço de petróleo'),('first oil well','primeiro poço de petróleo'),
('smelter building','fundição de alumínio'),('cement factory','fábrica de cimento'),('factory','fábrica'),('industrial port','porto industrial'),('Port of','Porto de'),
('high speed train','comboio de alta velocidade'),('expressway','via rápida'),('dhow','dhow tradicional'),('Dhow','Dhow tradicional'),('junk','junco tradicional'),('Junk','Junco tradicional'),
('ferryboat','ferry'),('fishing boat','barco de pesca'),('boats','barcos'),('boat','barco'),('vessel','embarcação'),('sail boat','veleiro'),
('landscape','paisagem'),('Landscape','Paisagem'),('mountain range','cordilheira'),('snow-covered mountains','montanhas cobertas de neve'),('Mountains','Montanhas'),('mountains','montanhas'),
('Mountain','Montanha'),('mountain','montanha'),('hills','colinas'),('Hills','Colinas'),('waterfall','cascata'),('Waterfall','Cascata'),('river','rio'),('River','Rio'),
('lake','lago'),('Lake','Lago'),('islands','ilhas'),('Islands','Ilhas'),('island','ilha'),('Island','Ilha'),('archipelago','arquipélago'),('Archipelago','Arquipélago'),
('sea','mar'),('Sea','Mar'),('national park','parque nacional'),('National Park','Parque Nacional'),('park','parque'),('Park','Parque'),('canyon','desfiladeiro'),('Canyon','Desfiladeiro'),
('cave','gruta'),('Caves','Grutas'),('caves','grutas'),('forest','floresta'),('desert','deserto'),('glacier','glaciar'),('volcano','vulcão'),('vulcano','vulcão'),
('rice terraces','terraços de arroz'),('Rice terraces','Terraços de arroz'),('terraces','terraços'),('agricultural fields','campos agrícolas'),('agriculture','agricultura'),
('palm tree','palmeira'),('Palm tree','Palmeira'),('coconut trees','coqueiros'),('tree of life','árvore da vida'),('Tree of Life','Árvore da Vida'),('tree','árvore'),('Tree','Árvore'),
('hibiscus','hibisco'),('flower','flor'),('Flower','Flor'),('flowers','flores'),('blossoms','flores'),('leaves','folhas'),('Leaves','Folhas'),('grain stalks','espigas de cereal'),
('grapes','uvas'),('spool of thread','fuso de fio'),('spindle of thread','fuso de fio'),('cotton','algodão'),('pottery','cerâmica'),('jugs','jarros'),('jug','jarro'),('chalice','cálice'),
('traditional drums','tambores tradicionais'),('drummer','tocador de tambor'),('dancers','dançarinos'),('dancer','dançarino'),('traditional attire','trajes tradicionais'),
('traditional dress','traje tradicional'),('traditional decorative stucco','estuque decorativo tradicional'),('traditional hand carved vase','vaso tradicional esculpido à mão'),
('lacquerware industry','indústria de laca'),('musicians','músicos'),('musical note','notação musical'),('musical chord','acorde musical'),('musical chords','acordes musicais'),
('baseball team','equipa de basebol'),('soccer player','jogador de futebol'),('football player','jogador de futebol'),('people','pessoas'),('People','Pessoas'),
('children','crianças'),('Children','Crianças'),('women','mulheres'),('Women','Mulheres'),('woman','mulher'),('men','homens'),('Men','Homens'),('man','homem'),
('soldiers','soldados'),('Soldiers','Soldados'),('soldier','soldado'),('party members','membros do partido'),('young people','jovens'),('peasant','camponês'),('farmer','agricultor'),
('scientists','cientistas'),('scientific work','trabalho científico'),('scientific','científico'),('satellite dishes','antenas de satélite'),('rocket','foguetão'),('satellite','satélite'),
('film festival','festival de cinema'),('public debate','debate público'),('open network','rede aberta'),('phonetic alphabet','alfabeto fonético'),('alphabet development','evolução do alfabeto'),
('Education','Educação'),('Garden City','Cidade-jardim'),('Sports','Desporto'),('Arts','Artes'),('Youth','Juventude'),('Government','Governação'),
('Symbolic presentation of Kite Sport','representação simbólica do jogo tradicional de papagaio de papel'),('Kite Sport','jogo tradicional de papagaio de papel'),
('Declaration of Independence','Declaração de Independência'),('during','durante'),('with','com'),('atop','no topo'),('near','perto de'),('inside','no interior de'),
('right hand','mão direita'),('left hand','mão esquerda'),('hand holding','mão segurando'),('hands','mãos'),('hand','mão'),('globe','globo terrestre'),
('time zones','fusos horários'),('star constellations','constelações'),('wind belts','faixas de vento'),('planetary system','sistema planetário'),('particle detector','detetor de partículas'),('particle collision','colisão de partículas'),
('watch','relógio'),('butterflies','borboletas'),('butterfly','borboleta'),('paraglider','parapente'),('aqueduct','aqueduto'),
('Rhinoceros hornbills','calaus-rinoceronte'),('hawksbill turtles','tartarugas-de-pente'),('Hawksbill turtles','Tartarugas-de-pente'),('Hawksbill sea turtle','tartaruga-de-pente'),
('sea turtle','tartaruga marinha'),('turtles','tartarugas'),('turtle','tartaruga'),('whale shark','tubarão-baleia'),('Whale shark','Tubarão-baleia'),('shark','tubarão'),
('giant trevally','xaréu-gigante'),('silver pomfret fish','peixe-pomfret-prateado'),('silver pomfret','pomfret-prateado'),('pearl oyster','ostra-perlífera'),('oyster','ostra'),('fish','peixe'),
('Philippine eagle','águia-filipina'),('eagle','águia'),('Eagle','Águia'),('falcon','falcão'),('Falcon','Falcão'),('pheasant','faisão'),('parrot','papagaio'),('owl','coruja'),('birds','aves'),('Birds','Aves'),
('spotted deer','veado-malhado'),('Sika deers','veados-sika'),('Sambar deers','veados-sambar'),('Sambar deer','veado-sambar'),('deers','veados'),('deer','veado'),
('snow leopard','leopardo-das-neves'),('leopard','leopardo'),('tiger','tigre'),('elephants','elefantes'),('Elephants','Elefantes'),('elephant','elefante'),('rhinoceros','rinoceronte'),
('gazelles','gazelas'),('gazelle','gazela'),('antelope','antílope'),('Antelope','Antílope'),('Saiga antelopes','antílopes-saiga'),('camel','camelo'),('horses','cavalos'),('Horses','Cavalos'),('horse','cavalo'),
('cattle','gado'),('Cattle','Gado'),('yak','yak'),('Yaks','Yaks'),('manta rays','raias-manta'),('green turtle','tartaruga-verde'),('Asian palm civet','civeta-de-palmeira-asiática'),
('Philippine tarsier','társio-filipino'),('Visayan spotted deer','veado-malhado-de-Visayas'),('Visayan leopard cat','gato-leopardo-de-Visayas'),('Palawan peacock pheasant','faisão-pavão-de-Palawan'),
('Golden eagle','águia-real'),('Central Asian Shepherd Dog','cão-pastor-da-Ásia-Central'),('sighthound','galgo'),('urial','urial'),
('Sail and Pearl Monument','Monumento da Vela e da Pérola'),('Liberation tower','Torre da Libertação'),('Kuwait Towers','Torres do Kuwait'),('National Assembly','Assembleia Nacional'),
('Pearl diver','mergulhador de pérolas'),('pearl diver','mergulhador de pérolas'),('product tanker','navio-tanque'),('Product tanker','Navio-tanque'),
('refinery','refinaria'),('ancient columns','colunas antigas'),('Door','Porta tradicional'),('door','porta'),('signature','assinatura'),
('Capital of Corinthian column','capitel de coluna coríntia'),('moonlit flora','flora iluminada pela lua'),('Moonlit flora','Flora iluminada pela lua'),
('Palm trees','Palmeiras'),('citrus tree with fruit','citrino com frutos'),('Almond tree leaves','folhas de amendoeira'),
('stylized ornamental shield','escudo ornamental estilizado'),('ornamental shield','escudo ornamental'),('ornamental designs','padrões ornamentais'),
('stylized floral motifs','motivos florais estilizados'),('stylized floral motif','motivo floral estilizado'),('geometric designs','desenhos geométricos'),('Geometric designs','Desenhos geométricos'),
('geometric block design','desenho geométrico em blocos'),('geometric square spaces','espaços geométricos quadrados'),('stair','escada'),('stairs','escadas'),('sun-like rosette','rosácea solar'),
('oldest musical note','mais antiga notação musical'),('ancient cuneiform clay tables','antigas tabuletas de argila com escrita cuneiforme'),('alphabet on','alfabeto em'),
('birthplace of','local de nascimento de'),('birthplace','local de nascimento'),('birthplace in','local de nascimento em'),('court','corte'),('plaza','praça'),('square','praça'),('Square','Praça'),
('and','e'),(' of ',' de '),(' of the ',' do '),(' in ',' em ')
]
P=sorted(P,key=lambda x:len(x[0]),reverse=True)
COUNTRY={'Indonesia':'Indonésia','Philippines':'Filipinas','China':'China','Korea':'Coreia','Japan':'Japão','Nepal':'Nepal','Bhutan':'Butão','Cambodia':'Camboja','Laos':'Laos','Myanmar':'Myanmar','Thailand':'Tailândia','Malaysia':'Malásia','Singapore':'Singapura','Vietnam':'Vietname','Kuwait':'Kuwait','Bahrain':'Bahrain','Oman':'Omã','Jordan':'Jordânia','Kazakhstan':'Cazaquistão','Kyrgyzstan':'Quirguistão','Tajikistan':'Tajiquistão','Turkmenistan':'Turquemenistão','Uzbekistan':'Uzbequistão','Lebanon':'Líbano','Yemen':'Iémen','Iran':'Irão','Iraq':'Iraque'}
THEME={
'IDR':('As personalidades escolhidas são heróis nacionais e figuras ligadas à independência e construção da Indonésia.','Os reversos da série de 2022 combinam paisagens emblemáticas com danças tradicionais, ligando território e diversidade cultural.'),
'MYR':('O retrato de Tuanku Abdul Rahman, primeiro Yang di-Pertuan Agong, e o hibisco nacional afirmam a identidade constitucional e os símbolos da Malásia.','Cada verso destaca natureza, cultura ou desenvolvimento nacional da Malásia.'),
'THB':('A frente apresenta o rei Rama X, chefe de Estado da atual dinastia Chakri.','O verso homenageia pares de monarcas da dinastia Chakri, formando uma sequência histórica da monarquia tailandesa.'),
'PHP':('Os motivos da frente pertencem à atual família filipina e homenageiam história nacional ou espécies endémicas, conforme a denominação.','Os reversos associam paisagens protegidas e biodiversidade das Filipinas.'),
'VND':('Ho Chi Minh foi líder da independência vietnamita e fundador da República Democrática do Vietname; o seu retrato é o motivo comum da família atual.','Os reversos representam património, paisagens e setores económicos do Vietname.'),
'TWD':('A família do novo dólar de Taiwan combina líderes históricos, educação, juventude, ciência e desporto.','Os reversos ligam cada tema a edifícios, fauna e paisagens de Taiwan.'),
'BDT':('A família do taka usa monumentos nacionais, património religioso e referências à independência e identidade do Bangladesh.','Os reversos desenvolvem património, biodiversidade e instituições nacionais.'),
'LKR':('As frentes da série mostram desenvolvimento económico e infraestruturas juntamente com aves endémicas.','Os versos celebram danças, percussão e arte escultórica tradicional do Sri Lanka.'),
'NPR':('O Everest e o património religioso substituíram os antigos retratos reais após a transição republicana do Nepal.','Os animais e paisagens do Himalaia representam a biodiversidade e geografia do Nepal.'),
'PKR':('Muhammad Ali Jinnah, fundador do Paquistão, é o retrato comum da família atual.','Cada reverso apresenta um marco histórico, cultural ou natural de uma região do Paquistão.'),
'MNT':('As notas mongóis homenageiam Sükhbaatar ou Chinggis Khaan, figuras centrais da formação política e histórica da Mongólia.','Os reversos evocam cultura e poder da estepe, da vida nómada à memória do império mongol.'),
'KHR':('As frentes combinam a monarquia cambojana, símbolos naga e referências budistas.','Os versos destacam Angkor, o Palácio Real e outros elementos da civilização Khmer.'),
'LAK':('As frentes ligam líderes nacionais e monumentos budistas à identidade do Laos.','Os versos representam religião, agricultura, indústria e infraestruturas do país.'),
'BND':('A monarquia e a flora nacional são os elementos dominantes das frentes do dólar do Brunei.','Os reversos destacam mesquitas, instituições e episódios da história do sultanato.'),
'MMK':('As frentes alternam o chinthe, elefantes e Aung San, símbolos históricos do Myanmar.','Os reversos mostram ofícios tradicionais, instituições e arquitetura nacional.'),
'SAR':('A família saudita combina a monarquia com os lugares sagrados do Islão e marcos do Estado moderno.','Os reversos aprofundam a dimensão religiosa, urbana e económica da Arábia Saudita.'),
'AED':('As frentes apresentam património, fundadores e grandes projetos que narram a formação dos Emirados Árabes Unidos.','Os reversos mostram união política, infraestruturas e ambição tecnológica do país.'),
'QAR':('Brasão, bandeira e arquitetura tradicional formam a identidade comum da família do rial do Qatar.','Os reversos percorrem mar, fauna, desporto, religião, aviação e energia — pilares históricos e modernos do Qatar.'),
'JOD':('Os retratos e monumentos da frente percorrem a história da monarquia hachemita e do património jordano.','Os reversos destacam Petra, Amã, Wadi Mujib e Wadi Rum, ligando história e paisagem.'),
'KZT':('A nova série “Saka Style” recupera arte e símbolos arqueológicos da estepe cazaque.','Fauna, montanhas e paisagens representam o território e a herança natural do Cazaquistão.'),
'KGS':('Cada frente homenageia uma personalidade da literatura, política ou cultura do Quirguistão.','Os reversos apresentam monumentos e paisagens associados à história e geografia quirguizes.'),
'TJS':('As frentes homenageiam poetas, estudiosos, estadistas e fundadores ligados à história tajique.','Os reversos destacam mausoléus, fortalezas e instituições do Tajiquistão.'),
'TMT':('As frentes percorrem heróis, poetas e governantes da tradição turquemena.','Os reversos mostram edifícios estatais e monumentos que projetam a identidade do Turquemenistão moderno.'),
'UZS':('As frentes apresentam arquitetura histórica e mapas que situam o património das várias regiões do Uzbequistão.','Os reversos destacam sítios arqueológicos e objetos que sublinham a profundidade histórica do país na Rota da Seda.'),
'ILS':('A terceira série do novo shekel homenageia poetas hebraicos e associa cada retrato a elementos botânicos.','Os reversos unem natureza e paisagem israelita a referências literárias e culturais.'),
'IQD':('As frentes percorrem ciência, recursos, paisagem e memória política do Iraque.','Os reversos destacam a Mesopotâmia antiga, arquitetura islâmica e património histórico iraquiano.'),
'AFN':('As frentes apresentam santuários, mesquitas e monumentos que representam a diversidade histórica do Afeganistão.','Os reversos percorrem palácios, montanhas, aeroportos e mausoléus associados ao território e à história afegã.'),
'BTN':('A monarquia e símbolos budistas dominam a iconografia da atual família do ngultrum.','Os dzongs e o mosteiro de Taktsang representam a união entre religião, administração e arquitetura tradicional do Butão.'),
'MVR':('As frentes celebram modos de vida, cultura, transporte e biodiversidade das Maldivas.','Os reversos apresentam objetos, monumentos e fauna marinha associados à identidade do arquipélago.'),
'IRR':('As emissões iranianas recorrem a líderes, mesquitas e grandes marcos históricos como símbolos do Estado e da cultura persa.','Os reversos destacam poetas, património, desporto e desenvolvimento económico do Irão.'),
'SYP':('A atual família síria combina património antigo, arquitetura e símbolos de Estado.','Os reversos percorrem arqueologia, artes, agricultura e instituições sírias.'),
'YER':('A iconografia do rial iemenita destaca arquitetura islâmica e património regional.','Os reversos valorizam paisagens, agricultura e arquitetura histórica do Iémen.'),
'KPW':('A iconografia norte-coreana apresenta monumentos, grupos sociais e símbolos promovidos pelo Estado.','Os reversos combinam monumentos, paisagens e padrões ornamentais de acordo com a narrativa oficial da série.')
}

def pt(s):
    if not s:return ''
    s=' '.join(str(s).replace('\xa0',' ').split())
    for a,b in P:s=re.sub(r'(?i)(?<![\w])'+re.escape(a)+r'(?![\w])',b,s)
    for a,b in COUNTRY.items():s=re.sub(r'(?i)(?<![\w])'+re.escape(a)+r'(?![\w])',b,s)
    s=s.replace(' de do ',' do ').replace(' de da ',' da ').replace(' em o ',' no ').replace(' em a ',' na ')
    s=re.sub(r'\s+([,.;:])',r'\1',s);s=re.sub(r'\s+',' ',s).strip(' .;-')
    return s

def generic_more(raw):
    x=raw.lower()
    if any(k in x for k in ['king','president','ayatollah','general','prince','poet','writer','scientist','scholar','jinnah','gandhi','ho chi minh']):return 'A personalidade foi escolhida por representar uma etapa relevante da história política, cultural ou intelectual do país.'
    if any(k in x for k in ['temple','mosque','church','palace','monument','fort','castle','bridge','museum','archaeological','ruins','pagoda','stupa']):return 'O motivo identifica património histórico ou arquitetónico reconhecido como parte da memória nacional.'
    if any(k in x for k in ['mountain','waterfall','river','lake','forest','park','bird','fish','turtle','elephant','tiger','leopard','flower','tree','volcano']):return 'O motivo valoriza paisagem, fauna ou flora como parte do património natural do país.'
    if any(k in x for k in ['factory','dam','power','oil','rail','airport','satellite','refinery']):return 'O motivo representa recursos, infraestruturas e desenvolvimento económico ou tecnológico nacional.'
    if any(k in x for k in ['dance','dancer','traditional','instrument','weaving','pottery']):return 'A imagem representa uma tradição ou expressão cultural usada como símbolo da identidade nacional.'
    if any(k in x for k in ['arms','emblem','flag']):return 'Os símbolos oficiais reforçam a soberania e a identidade do Estado emissor.'
    return 'O emissor escolheu este motivo como referência à história, cultura, território ou identidade nacional.'

def make_side(raw,side,currency):
    desc=pt(raw);prefix='Frente' if side=='front' else 'Verso';title=desc.split(';')[0].strip()
    if len(title)>115:title=title[:112].rstrip()+'…'
    family=THEME.get(currency,('',''))[0 if side=='front' else 1]
    more=family or generic_more(raw)
    return {'title':title or prefix,'summary':f'{prefix}: {desc}.','more':more}

raw=json.loads(RAW.read_text(encoding='utf-8'));rows={}
for key,n in raw.get('notes',{}).items():
    sides={};cur=n.get('currency','')
    if n.get('front'):sides['front']=make_side(n['front'],'front',cur)
    if n.get('back'):sides['back']=make_side(n['back'],'back',cur)
    if sides:rows[key]=sides
OUT.write_text('window.NOTE_CONTEXT_CATALOG='+json.dumps(rows,ensure_ascii=False,separators=(',',':'))+';\n',encoding='utf-8')
print('contexts',len(rows),'front',sum('front' in x for x in rows.values()),'back',sum('back' in x for x in rows.values()))
