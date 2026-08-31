#!/usr/bin/env python3
import json,re,pathlib
ROOT=pathlib.Path(__file__).resolve().parents[1]
RAW=ROOT/'data/banknote-context-raw.json'
OUT=ROOT/'note-context-catalog.js'

# Banknote.ws uses compact catalogue English. These replacements intentionally keep proper names intact
# while translating the recurring numismatic vocabulary into Portuguese.
PHRASES=[
 ('coat of arms','brasão'),('national coat of arms','brasão nacional'),('state emblem','emblema do Estado'),('national emblem','emblema nacional'),
 ('portrait of','retrato de'),('portrait','retrato'),('watermark','marca de água'),('security thread','fio de segurança'),
 ('bank logo','logótipo do banco'),('bank seal','selo do banco'),('central bank','banco central'),('bank building','edifício do banco'),
 ('presidential palace','palácio presidencial'),('royal palace','palácio real'),('government building','edifício governamental'),
 ('parliament building','edifício do parlamento'),('parliament','parlamento'),('independence monument','monumento da independência'),
 ('independence memorial','memorial da independência'),('war memorial','memorial de guerra'),('monument','monumento'),('memorial','memorial'),
 ('mosque','mesquita'),('cathedral','catedral'),('church','igreja'),('temple','templo'),('pagoda','pagode'),('stupa','estupa'),('palace','palácio'),
 ('castle','castelo'),('fortress','fortaleza'),('fort','forte'),('bridge','ponte'),('tower','torre'),('museum','museu'),('university','universidade'),
 ('school','escola'),('library','biblioteca'),('hospital','hospital'),('stadium','estádio'),('airport','aeroporto'),('harbour','porto'),('harbor','porto'),
 ('railway station','estação ferroviária'),('railway','ferrovia'),('dam','barragem'),('hydroelectric power station','central hidroelétrica'),
 ('power station','central elétrica'),('oil refinery','refinaria de petróleo'),('factory','fábrica'),('industrial complex','complexo industrial'),
 ('agriculture','agricultura'),('farmer','agricultor'),('farmers','agricultores'),('harvesting','colheita'),('harvest','colheita'),('rice field','arrozal'),
 ('cotton','algodão'),('coffee','café'),('tea plantation','plantação de chá'),('fishing','pesca'),('fisherman','pescador'),('fishermen','pescadores'),
 ('mountain range','cordilheira'),('mountains','montanhas'),('mountain','montanha'),('waterfall','cascata'),('river','rio'),('lake','lago'),('sea','mar'),
 ('coastline','linha costeira'),('coast','costa'),('landscape','paisagem'),('volcano','vulcão'),('glacier','glaciar'),('desert','deserto'),('forest','floresta'),
 ('national park','parque nacional'),('nature reserve','reserva natural'),('wildlife','fauna selvagem'),('bird','ave'),('birds','aves'),('fish','peixe'),
 ('turtle','tartaruga'),('elephant','elefante'),('tiger','tigre'),('lion','leão'),('deer','veado'),('horse','cavalo'),('camel','camelo'),('eagle','águia'),
 ('falcon','falcão'),('butterfly','borboleta'),('flower','flor'),('flowers','flores'),('tree','árvore'),('trees','árvores'),('plant','planta'),('plants','plantas'),
 ('traditional dance','dança tradicional'),('traditional dancers','dançarinos tradicionais'),('traditional dancer','dançarino tradicional'),
 ('traditional costume','traje tradicional'),('traditional dress','traje tradicional'),('traditional house','casa tradicional'),
 ('musical instrument','instrumento musical'),('musical instruments','instrumentos musicais'),('drum','tambor'),('weaving','tecelagem'),('pottery','cerâmica'),
 ('archaeological site','sítio arqueológico'),('ancient ruins','ruínas antigas'),('ruins','ruínas'),('rock carving','gravura rupestre'),('cave','gruta'),
 ('space satellite','satélite espacial'),('satellite','satélite'),('communications','comunicações'),('technology','tecnologia'),('science','ciência'),
 ('students','estudantes'),('student','estudante'),('children','crianças'),('child','criança'),('teacher','professor'),('education','educação'),
 ('medical care','cuidados de saúde'),('doctor','médico'),('scientist','cientista'),('poet','poeta'),('writer','escritor'),('composer','compositor'),
 ('president','presidente'),('prime minister','primeiro-ministro'),('king','rei'),('queen','rainha'),('emperor','imperador'),('empress','imperatriz'),
 ('national hero','herói nacional'),('hero','herói'),('revolutionary','revolucionário'),('general','general'),('admiral','almirante'),
 ('founder','fundador'),('statesman','estadista'),('philosopher','filósofo'),('scholar','erudito'),('historian','historiador'),
 ('map of','mapa de'),('map','mapa'),('flag','bandeira'),('national flag','bandeira nacional'),('globe','globo terrestre'),
 ('people','pessoas'),('family','família'),('woman','mulher'),('women','mulheres'),('man','homem'),('men','homens'),
 ('left','à esquerda'),('right','à direita'),('center','ao centro'),('centre','ao centro'),('background','ao fundo'),('foreground','em primeiro plano'),
 ('and','e'),('with','com'),('at','em'),('on','sobre'),('of the','do'),('of','de')
]
PHRASES=sorted(PHRASES,key=lambda x:len(x[0]),reverse=True)

def pt(s):
    if not s:return ''
    s=' '.join(str(s).replace('\xa0',' ').split())
    for a,b in PHRASES:
        s=re.sub(r'(?i)(?<![\w])'+re.escape(a)+r'(?![\w])',b,s)
    s=re.sub(r'\s+([,.;:])',r'\1',s)
    s=re.sub(r'\s+',' ',s).strip(' .;-')
    return s

def significance(raw,side):
    x=raw.lower()
    if any(k in x for k in ['portrait','president','king','queen','emperor','poet','writer','hero','general','founder','statesman','scientist','scholar']):
        return 'A escolha desta figura liga a nota à memória histórica, política ou cultural do país.'
    if any(k in x for k in ['temple','mosque','cathedral','church','palace','monument','memorial','fort','castle','bridge','museum','archaeological','ruins','pagoda','stupa']):
        return 'O motivo destaca património histórico e arquitetónico usado como referência da identidade nacional.'
    if any(k in x for k in ['mountain','waterfall','river','lake','landscape','forest','national park','wildlife','bird','fish','turtle','elephant','tiger','lion','flower','tree','volcano','glacier','desert']):
        return 'O motivo valoriza a paisagem, a fauna ou a flora como parte do património natural nacional.'
    if any(k in x for k in ['agriculture','harvest','farmer','industry','factory','dam','power station','oil','railway','airport','technology','satellite']):
        return 'A composição associa a moeda ao trabalho, aos recursos e ao desenvolvimento económico e tecnológico do país.'
    if any(k in x for k in ['dance','traditional','costume','dress','instrument','weaving','pottery']):
        return 'A imagem sublinha tradições e expressões culturais reconhecidas como parte da identidade do país.'
    if any(k in x for k in ['coat of arms','emblem','flag']):
        return 'A presença de símbolos oficiais reforça a soberania e a identidade do Estado emissor.'
    return 'Esta composição foi escolhida pelo emissor para representar referências reconhecíveis da história, cultura, território ou identidade nacional.'

def make_side(raw,side):
    desc=pt(raw)
    prefix='Frente' if side=='front' else 'Verso'
    # catalogue descriptions are the useful title here; keep it concise but exact
    title=desc.split(';')[0].strip()
    if len(title)>105:title=title[:102].rstrip()+ '…'
    return {'title':title or prefix,'summary':f'{prefix}: {desc}.','more':significance(raw,side)}

raw=json.loads(RAW.read_text(encoding='utf-8'))
rows={}
for key,n in raw.get('notes',{}).items():
    sides={}
    if n.get('front'):sides['front']=make_side(n['front'],'front')
    if n.get('back'):sides['back']=make_side(n['back'],'back')
    if sides: rows[key]=sides
js='window.NOTE_CONTEXT_CATALOG='+json.dumps(rows,ensure_ascii=False,separators=(',',':'))+';\n'
OUT.write_text(js,encoding='utf-8')
print('contexts',len(rows),'front',sum('front' in x for x in rows.values()),'back',sum('back' in x for x in rows.values()))
