(()=>{
 const fixes={
  'BBD:20':{back:{title:'Edifício do Parlamento, Bridgetown',summary:'Verso: edifício do Parlamento, em Bridgetown.'}},
  'BBD:50':{back:{title:'Praça da Independência, Bridgetown',summary:'Verso: Praça da Independência, em Bridgetown.'}}
 };
 const stores=[window.NOTE_CONTEXT_MANUAL,window.NOTE_CONTEXT_CATALOG,window.NOTE_CONTEXT_ENRICHMENT,window.NOTE_CONTEXT_QUALITY,window.NOTE_CONTEXT_WAVE5,window.NOTE_CONTEXT_WAVE4,window.NOTE_CONTEXT_WAVE3,window.NOTE_CONTEXT_WAVE2].filter(Boolean);
 for(const store of stores)for(const [key,parts] of Object.entries(fixes)){
  if(!store[key])continue;
  for(const [side,fields] of Object.entries(parts)){store[key][side] ||= {};Object.assign(store[key][side],fields)}
 }
})();
