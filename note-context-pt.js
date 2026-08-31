(()=>{
 const stores=()=>[
  window.NOTE_CONTEXT_CATALOG,window.NOTE_CONTEXT_MANUAL,window.NOTE_CONTEXT_ENRICHMENT,
  window.NOTE_CONTEXT_QUALITY,window.NOTE_CONTEXT_AFRICA1,window.NOTE_CONTEXT_WAVE5,
  window.NOTE_CONTEXT_WAVE4,window.NOTE_CONTEXT_WAVE3,window.NOTE_CONTEXT_WAVE2,
  window.NOTE_CONTEXT_GLOBAL
 ].filter(Boolean);

 const phrases=[
  [/dragging a log/gi,'arrastando um tronco'],
  [/elephant dragging logs?/gi,'elefante a arrastar troncos'],
  [/elephant dragging a log/gi,'elefante a arrastar um tronco'],
  [/logging elephant/gi,'elefante usado na exploração florestal'],
  [/rice terraces of Banaue/gi,'terraços de arroz de Banaue'],
  [/Banaue rice terraces/gi,'terraços de arroz de Banaue'],
  [/national park/gi,'parque nacional'],
  [/nature reserve/gi,'reserva natural'],
  [/wildlife reserve/gi,'reserva de vida selvagem'],
  [/mountain range/gi,'cordilheira'],
  [/waterfall/gi,'cascata'],
  [/waterfalls/gi,'cascatas'],
  [/river/gi,'rio'],
  [/lake/gi,'lago'],
  [/islands/gi,'ilhas'],
  [/island/gi,'ilha'],
  [/bridge/gi,'ponte'],
  [/temple/gi,'templo'],
  [/palace/gi,'palácio'],
  [/mosque/gi,'mesquita'],
  [/church/gi,'igreja'],
  [/cathedral/gi,'catedral'],
  [/monument/gi,'monumento'],
  [/fortress/gi,'fortaleza'],
  [/fort\b/gi,'forte'],
  [/castle/gi,'castelo'],
  [/museum/gi,'museu'],
  [/university/gi,'universidade'],
  [/school/gi,'escola'],
  [/building/gi,'edifício'],
  [/city skyline/gi,'panorama urbano'],
  [/skyline/gi,'panorama urbano'],
  [/harbour/gi,'porto'],
  [/harbor/gi,'porto'],
  [/port\b/gi,'porto'],
  [/dam\b/gi,'barragem'],
  [/power station/gi,'central elétrica'],
  [/oil refinery/gi,'refinaria de petróleo'],
  [/factory/gi,'fábrica'],
  [/train/gi,'comboio'],
  [/railway/gi,'caminho de ferro'],
  [/airplane/gi,'avião'],
  [/aircraft/gi,'aeronave'],
  [/ship\b/gi,'navio'],
  [/boat\b/gi,'barco'],
  [/fishing boat/gi,'barco de pesca'],
  [/farmer/gi,'agricultor'],
  [/farmers/gi,'agricultores'],
  [/worker/gi,'trabalhador'],
  [/workers/gi,'trabalhadores'],
  [/woman/gi,'mulher'],
  [/women/gi,'mulheres'],
  [/man\b/gi,'homem'],
  [/men\b/gi,'homens'],
  [/children/gi,'crianças'],
  [/child\b/gi,'criança'],
  [/king\b/gi,'rei'],
  [/queen\b/gi,'rainha'],
  [/president/gi,'presidente'],
  [/prime minister/gi,'primeiro-ministro'],
  [/prince/gi,'príncipe'],
  [/princess/gi,'princesa'],
  [/poet/gi,'poeta'],
  [/writer/gi,'escritor'],
  [/scientist/gi,'cientista'],
  [/portrait/gi,'retrato'],
  [/coat of arms/gi,'brasão'],
  [/emblem/gi,'emblema'],
  [/flag\b/gi,'bandeira'],
  [/map\b/gi,'mapa'],
  [/outline/gi,'contorno'],
  [/star\b/gi,'estrela'],
  [/crown/gi,'coroa'],
  [/elephant/gi,'elefante'],
  [/tiger/gi,'tigre'],
  [/lion\b/gi,'leão'],
  [/rhinoceros/gi,'rinoceronte'],
  [/rhino\b/gi,'rinoceronte'],
  [/turtle/gi,'tartaruga'],
  [/tortoise/gi,'tartaruga terrestre'],
  [/shark/gi,'tubarão'],
  [/whale/gi,'baleia'],
  [/fish\b/gi,'peixe'],
  [/deer\b/gi,'veado'],
  [/bear\b/gi,'urso'],
  [/horse/gi,'cavalo'],
  [/camel/gi,'camelo'],
  [/gazelle/gi,'gazela'],
  [/monkey/gi,'macaco'],
  [/bird\b/gi,'ave'],
  [/birds\b/gi,'aves'],
  [/eagle/gi,'águia'],
  [/falcon/gi,'falcão'],
  [/butterfly/gi,'borboleta'],
  [/flower/gi,'flor'],
  [/flowers/gi,'flores'],
  [/tree\b/gi,'árvore'],
  [/trees\b/gi,'árvores'],
  [/palm tree/gi,'palmeira'],
  [/forest/gi,'floresta'],
  [/mountain/gi,'montanha'],
  [/volcano/gi,'vulcão'],
  [/desert/gi,'deserto'],
  [/beach/gi,'praia'],
  [/coast/gi,'costa'],
  [/sea\b/gi,'mar'],
  [/field/gi,'campo'],
  [/rice\b/gi,'arroz'],
  [/wheat/gi,'trigo'],
  [/cotton/gi,'algodão'],
  [/coffee/gi,'café'],
  [/corn\b/gi,'milho'],
  [/dance/gi,'dança'],
  [/dancer/gi,'dançarino'],
  [/dancers/gi,'dançarinos'],
  [/traditional dance/gi,'dança tradicional'],
  [/musical instrument/gi,'instrumento musical'],
  [/independence/gi,'independência'],
  [/declaration of independence/gi,'declaração de independência'],
  [/battle/gi,'batalha'],
  [/revolution/gi,'revolução'],
  [/constitution/gi,'constituição'],
  [/parliament/gi,'parlamento'],
  [/congress/gi,'congresso'],
  [/anniversary/gi,'aniversário'],
  [/commemorative/gi,'comemorativa'],
  [/later\s+/gi,'mais tarde '],
  [/\bwith\b/gi,'com'],
  [/\band\b/gi,'e'],
  [/\bof the\b/gi,'da'],
  [/\bof\b/gi,'de'],
  [/\bat the\b/gi,'no'],
  [/\bat\b/gi,'em'],
  [/\bnear\b/gi,'perto de'],
  [/\bfrom\b/gi,'de'],
  [/\btraditional\b/gi,'tradicional'],
  [/\bnational\b/gi,'nacional'],
  [/\bcentral bank\b/gi,'banco central']
 ];

 const suspicious=/\b(the|and|with|from|near|dragging|log|bridge|temple|palace|mountain|river|lake|island|forest|elephant|king|queen|president|portrait|building|church|mosque|fortress|waterfall|national park|reserve)\b/i;

 function pt(text){
   if(typeof text!=='string'||!text.trim())return text;
   let out=text;
   for(const [rx,repl] of phrases)out=out.replace(rx,repl);
   out=out.replace(/\s+([,.;:])/g,'$1').replace(/\s{2,}/g,' ').trim();
   return out;
 }
 function normalizeEntry(entry){
   if(!entry||typeof entry!=='object')return;
   for(const side of ['front','back']){
     const x=entry[side]; if(!x||typeof x!=='object')continue;
     for(const f of ['title','summary','more'])if(typeof x[f]==='string')x[f]=pt(x[f]);
     // Se ainda restar inglês evidente, evita mostrá-lo como título cru.
     if(suspicious.test(x.title||'')){
       const sideName=side==='front'?'Frente':'Verso';
       x.title=`${sideName} da nota`;
       if(suspicious.test(x.summary||''))x.summary=`${sideName}: composição e motivos da nota.`;
     }
   }
 }
 function run(){for(const store of stores())for(const entry of Object.values(store))normalizeEntry(entry)}
 run();
 window.NOTE_CONTEXT_PT={translate:pt,run};
})();
