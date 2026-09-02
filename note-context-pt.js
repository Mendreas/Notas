(()=>{
 const stores=()=>[
  window.NOTE_CONTEXT_MANUAL,window.NOTE_CONTEXT_AFRICA3,window.NOTE_CONTEXT_AFRICA2,
  window.NOTE_CONTEXT_AFRICA1,window.NOTE_CONTEXT_CATALOG,window.NOTE_CONTEXT_ENRICHMENT,
  window.NOTE_CONTEXT_QUALITY,window.NOTE_CONTEXT_WAVE5,window.NOTE_CONTEXT_WAVE4,
  window.NOTE_CONTEXT_WAVE3,window.NOTE_CONTEXT_WAVE2,window.NOTE_CONTEXT_GLOBAL
 ].filter(Boolean);

 // Expressões completas e nomes próprios devem ser tratados ANTES da tradução palavra a palavra.
 // Isto evita erros como William Lyon Mackenzie King -> William Lyon Mackenzie rei.
 const prePhrases=[
  [/William Lyon Mackenzie King/g,'William Lyon Mackenzie King'],
  [/New Guinea/g,'Nova Guiné'],[/South Sudan/g,'Sudão do Sul'],[/Cape Verde/g,'Cabo Verde'],
  [/Banaue rice terraces/gi,'terraços de arroz de Banaue'],[/rice terraces of Banaue/gi,'terraços de arroz de Banaue'],
  [/Puerto Princesa Subterranean River National Park/gi,'Parque Nacional do Rio Subterrâneo de Puerto Princesa'],
  [/Kinabalu National Park/gi,'Parque Nacional de Kinabalu'],[/Wakatobi National Park/gi,'Parque Nacional de Wakatobi'],
  [/Komodo National Park/gi,'Parque Nacional de Komodo'],[/Malacañang Palace/gi,'Palácio de Malacañang'],
  [/Taal Lake/gi,'lago Taal'],[/Mayon Volcano/gi,'vulcão Mayon'],[/Bohol Chocolate Hills/gi,'Colinas de Chocolate de Bohol'],
  [/Derawan Islands/gi,'ilhas Derawan'],[/Raja Ampat archipelago/gi,'arquipélago de Raja Ampat'],[/Banda Island/gi,'ilha de Banda'],
  [/Fort Belgica/gi,'Forte Belgica']
 ];
 const phrases=[
  [/fishermen'?s village along Congo (?:river|rio)/gi,'aldeia de pescadores ao longo do rio Congo'],
  [/fishermen'?s village/gi,'aldeia de pescadores'],[/fishing village/gi,'aldeia piscatória'],[/village along/gi,'aldeia ao longo de'],[/along the/gi,'ao longo do'],[/along/gi,'ao longo de'],[/village/gi,'aldeia'],
  [/elephant dragging (?:a )?log/gi,'elefante a arrastar um tronco'],[/dragging (?:a )?log/gi,'a arrastar um tronco'],[/logging elephant/gi,'elefante usado na exploração florestal'],
  [/rice terraces/gi,'terraços de arroz'],
  [/declaration of independence/gi,'declaração de independência'],[/independence monument/gi,'monumento da independência'],[/prime minister/gi,'primeiro-ministro'],[/coat of arms/gi,'brasão'],[/city skyline/gi,'panorama urbano'],[/city view/gi,'vista da cidade'],[/city centre/gi,'centro da cidade'],
  [/national park/gi,'parque nacional'],[/nature reserve/gi,'reserva natural'],[/wildlife reserve/gi,'reserva de vida selvagem'],[/mountain range/gi,'cordilheira'],[/rock formation/gi,'formação rochosa'],[/stone circles/gi,'círculos de pedra'],
  [/fishing boat/gi,'barco de pesca'],[/cargo ship/gi,'navio de carga'],[/power station/gi,'central elétrica'],[/power plant/gi,'central elétrica'],[/oil refinery/gi,'refinaria de petróleo'],[/oil industry/gi,'indústria petrolífera'],[/oil derrick/gi,'torre de perfuração petrolífera'],[/traditional dance/gi,'dança tradicional'],[/musical instrument/gi,'instrumento musical'],
  [/court house/gi,'tribunal'],[/government house/gi,'edifício governamental'],[/central bank/gi,'banco central'],[/parliament building/gi,'edifício do parlamento'],[/school children/gi,'crianças em idade escolar'],[/health care/gi,'cuidados de saúde'],[/laboratory technician/gi,'técnico de laboratório'],
  [/banana harvest/gi,'colheita de banana'],[/planting rice/gi,'plantação de arroz'],[/tea plantation/gi,'plantação de chá'],[/coffee plantation/gi,'plantação de café'],[/sugar cane/gi,'cana-de-açúcar'],[/cotton plant/gi,'planta de algodão'],[/cocoa pods/gi,'vagens de cacau'],
  [/waterfalls?/gi,'cascata'],[/rivers?/gi,'rio'],[/lakes?/gi,'lago'],[/islands?/gi,'ilha'],[/bridges?/gi,'ponte'],[/temples?/gi,'templo'],[/palaces?/gi,'palácio'],[/mosques?/gi,'mesquita'],[/churches?/gi,'igreja'],[/cathedrals?/gi,'catedral'],[/monuments?/gi,'monumento'],[/fortress(?:es)?/gi,'fortaleza'],[/fort\b/gi,'forte'],[/castles?/gi,'castelo'],[/museums?/gi,'museu'],[/universit(?:y|ies)/gi,'universidade'],[/schools?/gi,'escola'],[/buildings?/gi,'edifício'],[/villages?/gi,'aldeia'],
  [/harbou?r/gi,'porto'],[/dam\b/gi,'barragem'],[/factor(?:y|ies)/gi,'fábrica'],[/trains?/gi,'comboio'],[/railway/gi,'caminho de ferro'],[/railroad/gi,'ferrovia'],[/airplanes?/gi,'avião'],[/aircraft/gi,'aeronave'],[/ships?/gi,'navio'],[/boats?/gi,'barco'],[/roads?/gi,'estrada'],
  [/farmers?/gi,'agricultor'],[/fishermen/gi,'pescadores'],[/fisherman/gi,'pescador'],[/workers?/gi,'trabalhador'],[/women/gi,'mulheres'],[/woman/gi,'mulher'],[/men\b/gi,'homens'],[/man\b/gi,'homem'],[/children/gi,'crianças'],[/child\b/gi,'criança'],[/girls?/gi,'rapariga'],[/boys?/gi,'rapaz'],[/students?/gi,'estudante'],[/teacher/gi,'professor'],[/nurse/gi,'enfermeira'],
  // Títulos em minúsculas podem ser traduzidos diretamente. Com maiúscula, só quando antecedem um nome.
  [/\bking\b/g,'rei'],[/\bKing(?=\s+[A-ZÀ-Ý])/g,'Rei'],[/\bqueen\b/g,'rainha'],[/\bQueen(?=\s+[A-ZÀ-Ý])/g,'Rainha'],
  [/\bprince\b/g,'príncipe'],[/\bPrince(?=\s+[A-ZÀ-Ý])/g,'Príncipe'],[/\bprincess\b/g,'princesa'],[/\bPrincess(?=\s+[A-ZÀ-Ý])/g,'Princesa'],
  [/president/gi,'presidente'],[/poet/gi,'poeta'],[/writer/gi,'escritor'],[/scientist/gi,'cientista'],[/doctor/gi,'médico'],[/portrait/gi,'retrato'],[/statue/gi,'estátua'],
  [/emblem/gi,'emblema'],[/flag\b/gi,'bandeira'],[/map\b/gi,'mapa'],[/outline/gi,'contorno'],[/star\b/gi,'estrela'],[/crown/gi,'coroa'],[/logo/gi,'logótipo'],
  [/elephants?/gi,'elefante'],[/tigers?/gi,'tigre'],[/lions?/gi,'leão'],[/rhinoceros/gi,'rinoceronte'],[/rhino\b/gi,'rinoceronte'],[/turtles?/gi,'tartaruga'],[/tortoise/gi,'tartaruga terrestre'],[/sharks?/gi,'tubarão'],[/whales?/gi,'baleia'],[/fish\b/gi,'peixe'],[/deer\b/gi,'veado'],[/bears?/gi,'urso'],[/horses?/gi,'cavalo'],[/camels?/gi,'camelo'],[/gazelles?/gi,'gazela'],[/antelopes?/gi,'antílope'],[/monkeys?/gi,'macaco'],[/birds?/gi,'ave'],[/eagles?/gi,'águia'],[/falcons?/gi,'falcão'],[/parrots?/gi,'papagaio'],[/ostrich(?:es)?/gi,'avestruz'],[/giraffes?/gi,'girafa'],[/hippos?/gi,'hipopótamo'],[/gorillas?/gi,'gorila'],[/butterfl(?:y|ies)/gi,'borboleta'],[/frogs?/gi,'rã'],
  [/flowers?/gi,'flor'],[/trees?/gi,'árvore'],[/palm tree/gi,'palmeira'],[/forests?/gi,'floresta'],[/mountains?/gi,'montanha'],[/volcano/gi,'vulcão'],[/deserts?/gi,'deserto'],[/beaches?/gi,'praia'],[/coast/gi,'costa'],[/sea\b/gi,'mar'],[/fields?/gi,'campo'],[/rice\b/gi,'arroz'],[/wheat/gi,'trigo'],[/cotton/gi,'algodão'],[/coffee/gi,'café'],[/corn\b/gi,'milho'],[/banana/gi,'banana'],[/cocoa/gi,'cacau'],
  [/dancers?/gi,'dançarino'],[/dance/gi,'dança'],[/drummers?/gi,'tocadores de tambor'],[/independence/gi,'independência'],[/battle/gi,'batalha'],[/revolution/gi,'revolução'],[/constitution/gi,'constituição'],[/parliament/gi,'parlamento'],[/congress/gi,'congresso'],[/anniversary/gi,'aniversário'],[/commemorative/gi,'comemorativa'],[/agriculture/gi,'agricultura'],[/agricultural/gi,'agrícola'],[/industry/gi,'indústria'],[/mining/gi,'mineração'],[/mine\b/gi,'mina'],
  [/\bfront\b/gi,'frente'],[/\bback\b/gi,'verso'],[/\breverse\b/gi,'verso'],[/\bobverse\b/gi,'frente'],[/\blater\b/gi,'mais tarde'],[/\bwith\b/gi,'com'],[/\band\b/gi,'e'],[/\bof the\b/gi,'da'],[/\bof\b/gi,'de'],[/\bat the\b/gi,'no'],[/\bat\b/gi,'em'],[/\bnear\b/gi,'perto de'],[/\bfrom\b/gi,'de'],[/\bon the\b/gi,'sobre o'],[/\bon\b/gi,'sobre'],[/\bin the\b/gi,'no'],[/\bin\b/gi,'em'],[/\btraditional\b/gi,'tradicional'],[/\bnational\b/gi,'nacional'],[/\bnew\b/gi,'novo'],[/\bold\b/gi,'antigo'],[/\bmodern\b/gi,'moderno']
 ];
 const suspicious=/\b(the|and|with|from|near|along|village|fishermen|fisherman|dragging|log|bridge|temple|palace|mountain|river|lake|island|forest|elephant|king|queen|president|portrait|building|church|mosque|fortress|waterfall|national park|reserve|front|back|reverse|obverse|city|road|school|children|farmer|worker|boat|ship|train|railway|dam|market|statue|monument|flowers|trees|birds|fish|turtle|deer|horse|camel|later|region)\b/i;
 const malformed=[
  [/\b(?:Kinabalu|Wakatobi|Komodo) parque\b/gi,m=>m.replace(' parque','')+''],
  [/\bTaal lago\b/gi,'lago Taal'],[/\bMayon vulcão\b/gi,'vulcão Mayon'],[/\bBohol Chocolate colinas\b/gi,'Colinas de Chocolate de Bohol'],
  [/\bMalacañang palace\b/gi,'Palácio de Malacañang'],[/\bterraços de arroz of Banaue\b/gi,'terraços de arroz de Banaue'],
  [/\bDerawan ilha\b/gi,'ilhas Derawan'],[/\bRaja Ampat arquipélago\b/gi,'arquipélago de Raja Ampat'],[/\bBanda ilha\b/gi,'ilha de Banda'],
  [/\bnovo Guinea\b/gi,'Nova Guiné']
 ];
 function pt(text){
  if(typeof text!=='string'||!text.trim())return text;
  let out=text.replace(/[’‘]/g,"'");
  // Proteger apelido King antes de qualquer regra lexical.
  out=out.replace(/William Lyon Mackenzie King/g,'William Lyon Mackenzie __SURNAME_KING__');
  for(const [rx,repl] of prePhrases)out=out.replace(rx,repl);
  for(const [rx,repl] of phrases)out=out.replace(rx,repl);
  for(const [rx,repl] of malformed)out=out.replace(rx,repl);
  out=out.replace(/__SURNAME_KING__/g,'King');
  return out.replace(/\s+([,.;:])/g,'$1').replace(/\s{2,}/g,' ').trim();
 }
 const leftovers=[];
 function normalizeEntry(entry,key=''){
  if(!entry||typeof entry!=='object')return;
  for(const side of ['front','back']){
   const x=entry[side];if(!x||typeof x!=='object')continue;
   for(const f of ['title','summary','more']){
    if(typeof x[f]!=='string')continue;
    x[f]=pt(x[f]);
    if(suspicious.test(x[f]))leftovers.push({key,side,field:f,text:x[f]});
   }
  }
 }
 function run(){leftovers.length=0;for(const store of stores())for(const [key,entry] of Object.entries(store))normalizeEntry(entry,key);window.NOTE_CONTEXT_UNTRANSLATED=[...leftovers];return leftovers}
 run();window.NOTE_CONTEXT_PT={translate:pt,run,leftovers};
})();
