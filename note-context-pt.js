(()=>{
 const stores=()=>[
  window.NOTE_CONTEXT_CATALOG,window.NOTE_CONTEXT_MANUAL,window.NOTE_CONTEXT_ENRICHMENT,
  window.NOTE_CONTEXT_QUALITY,window.NOTE_CONTEXT_AFRICA1,window.NOTE_CONTEXT_WAVE5,
  window.NOTE_CONTEXT_WAVE4,window.NOTE_CONTEXT_WAVE3,window.NOTE_CONTEXT_WAVE2,
  window.NOTE_CONTEXT_GLOBAL
 ].filter(Boolean);
 const phrases=[
  [/elephant dragging (?:a )?log/gi,'elefante a arrastar um tronco'],[/dragging (?:a )?log/gi,'a arrastar um tronco'],[/logging elephant/gi,'elefante usado na exploração florestal'],
  [/rice terraces of Banaue/gi,'terraços de arroz de Banaue'],[/Banaue rice terraces/gi,'terraços de arroz de Banaue'],
  [/declaration of independence/gi,'declaração de independência'],[/prime minister/gi,'primeiro-ministro'],[/coat of arms/gi,'brasão'],[/city skyline/gi,'panorama urbano'],
  [/national park/gi,'parque nacional'],[/nature reserve/gi,'reserva natural'],[/wildlife reserve/gi,'reserva de vida selvagem'],[/mountain range/gi,'cordilheira'],
  [/fishing boat/gi,'barco de pesca'],[/power station/gi,'central elétrica'],[/oil refinery/gi,'refinaria de petróleo'],[/traditional dance/gi,'dança tradicional'],[/musical instrument/gi,'instrumento musical'],
  [/waterfalls?/gi,'cascata'],[/rivers?/gi,'rio'],[/lakes?/gi,'lago'],[/islands?/gi,'ilha'],[/bridges?/gi,'ponte'],[/temples?/gi,'templo'],[/palaces?/gi,'palácio'],[/mosques?/gi,'mesquita'],[/churches?/gi,'igreja'],[/cathedrals?/gi,'catedral'],[/monuments?/gi,'monumento'],[/fortress(?:es)?/gi,'fortaleza'],[/fort\b/gi,'forte'],[/castles?/gi,'castelo'],[/museums?/gi,'museu'],[/universit(?:y|ies)/gi,'universidade'],[/schools?/gi,'escola'],[/buildings?/gi,'edifício'],
  [/harbou?r/gi,'porto'],[/dam\b/gi,'barragem'],[/factor(?:y|ies)/gi,'fábrica'],[/trains?/gi,'comboio'],[/railway/gi,'caminho de ferro'],[/airplanes?/gi,'avião'],[/aircraft/gi,'aeronave'],[/ships?/gi,'navio'],[/boats?/gi,'barco'],
  [/farmers?/gi,'agricultor'],[/workers?/gi,'trabalhador'],[/women/gi,'mulheres'],[/woman/gi,'mulher'],[/men\b/gi,'homens'],[/man\b/gi,'homem'],[/children/gi,'crianças'],[/child\b/gi,'criança'],
  [/king\b/gi,'rei'],[/queen\b/gi,'rainha'],[/president/gi,'presidente'],[/princess/gi,'princesa'],[/prince/gi,'príncipe'],[/poet/gi,'poeta'],[/writer/gi,'escritor'],[/scientist/gi,'cientista'],[/portrait/gi,'retrato'],
  [/emblem/gi,'emblema'],[/flag\b/gi,'bandeira'],[/map\b/gi,'mapa'],[/outline/gi,'contorno'],[/star\b/gi,'estrela'],[/crown/gi,'coroa'],
  [/elephants?/gi,'elefante'],[/tigers?/gi,'tigre'],[/lions?/gi,'leão'],[/rhinoceros/gi,'rinoceronte'],[/rhino\b/gi,'rinoceronte'],[/turtles?/gi,'tartaruga'],[/tortoise/gi,'tartaruga terrestre'],[/sharks?/gi,'tubarão'],[/whales?/gi,'baleia'],[/fish\b/gi,'peixe'],[/deer\b/gi,'veado'],[/bears?/gi,'urso'],[/horses?/gi,'cavalo'],[/camels?/gi,'camelo'],[/gazelles?/gi,'gazela'],[/monkeys?/gi,'macaco'],[/birds?/gi,'ave'],[/eagles?/gi,'águia'],[/falcons?/gi,'falcão'],[/butterfl(?:y|ies)/gi,'borboleta'],
  [/flowers?/gi,'flor'],[/trees?/gi,'árvore'],[/palm tree/gi,'palmeira'],[/forests?/gi,'floresta'],[/mountains?/gi,'montanha'],[/volcano/gi,'vulcão'],[/deserts?/gi,'deserto'],[/beaches?/gi,'praia'],[/coast/gi,'costa'],[/sea\b/gi,'mar'],[/fields?/gi,'campo'],[/rice\b/gi,'arroz'],[/wheat/gi,'trigo'],[/cotton/gi,'algodão'],[/coffee/gi,'café'],[/corn\b/gi,'milho'],
  [/dancers?/gi,'dançarino'],[/dance/gi,'dança'],[/independence/gi,'independência'],[/battle/gi,'batalha'],[/revolution/gi,'revolução'],[/constitution/gi,'constituição'],[/parliament/gi,'parlamento'],[/congress/gi,'congresso'],[/anniversary/gi,'aniversário'],[/commemorative/gi,'comemorativa'],
  [/\blater\b/gi,'mais tarde'],[/\bwith\b/gi,'com'],[/\band\b/gi,'e'],[/\bof the\b/gi,'da'],[/\bof\b/gi,'de'],[/\bat the\b/gi,'no'],[/\bat\b/gi,'em'],[/\bnear\b/gi,'perto de'],[/\bfrom\b/gi,'de'],[/\btraditional\b/gi,'tradicional'],[/\bnational\b/gi,'nacional'],[/\bcentral bank\b/gi,'banco central']
 ];
 const suspicious=/\b(the|and|with|from|near|dragging|log|bridge|temple|palace|mountain|river|lake|island|forest|elephant|king|queen|president|portrait|building|church|mosque|fortress|waterfall|national park|reserve)\b/i;
 function pt(text){if(typeof text!=='string'||!text.trim())return text;let out=text;for(const [rx,repl] of phrases)out=out.replace(rx,repl);return out.replace(/\s+([,.;:])/g,'$1').replace(/\s{2,}/g,' ').trim()}
 function normalizeEntry(entry){if(!entry||typeof entry!=='object')return;for(const side of ['front','back']){const x=entry[side];if(!x||typeof x!=='object')continue;for(const f of ['title','summary','more'])if(typeof x[f]==='string')x[f]=pt(x[f]);if(suspicious.test(x.title||'')){const n=side==='front'?'Frente':'Verso';x.title=`${n} da nota`;if(suspicious.test(x.summary||''))x.summary=`${n}: composição e motivos da nota.`}}}
 function run(){for(const store of stores())for(const entry of Object.values(store))normalizeEntry(entry)}
 run();window.NOTE_CONTEXT_PT={translate:pt,run};
})();