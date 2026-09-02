import fs from 'node:fs';
import vm from 'node:vm';

const sandbox={window:{},console};
vm.createContext(sandbox);
for(const file of ['note-context-catalog.js','note-context-pt.js','note-context-editorial-audit-fixes.js','note-context-editorial-audit-fixes-bbd.js']){
  vm.runInContext(fs.readFileSync(file,'utf8'),sandbox,{filename:file});
}
const catalog=sandbox.window.NOTE_CONTEXT_CATALOG||{};
const rows=[];
for(const [key,entry] of Object.entries(catalog)){
  for(const side of ['front','back']){
    const part=entry?.[side]; if(!part)continue;
    for(const field of ['title','summary','more']){
      const text=part?.[field]; if(typeof text==='string')rows.push({key,side,field,text});
    }
  }
}

const fatalPatterns=[
  [/William Lyon Mackenzie rei/i,'apelido King traduzido como “rei”'],
  [/\bMackenzie\s+rei\b/i,'possível corrupção do apelido King'],
  [/Royal Flying\s+(?:médico|doutor)\s+Service/i,'Royal Flying Doctor Service foi parcialmente traduzido'],
  [/\b(?:Kinabalu|Wakatobi|Komodo) parque\b/i,'ordem PT incorreta em nome de parque'],
  [/\bTaal lago\b/i,'ordem PT incorreta em lago Taal'],
  [/\bMayon vulcão\b/i,'ordem PT incorreta em vulcão Mayon'],
  [/\bBohol Chocolate colinas\b/i,'topónimo traduzido literalmente'],
  [/\bMalacañang palace\b/i,'resíduo inglês em nome de monumento'],
  [/\bterraços de arroz of Banaue\b/i,'resíduo inglês “of”'],
  [/\bnovo Guinea\b/i,'topónimo Nova Guiné corrompido'],
  [/\bpontetown\b/i,'Bridgetown corrompido por tradução literal']
];
const residualEnglish=/\b(the|and|with|from|near|along|village|fishermen|fisherman|dragging|bridge|temple|palace|mountain|river|lake|island|forest|elephant|portrait|building|church|mosque|fortress|waterfall|front|back|reverse|obverse|city|road|school|children|farmer|worker|boat|ship|train|railway|market|later|region)\b/i;
const officialNames=[
 'The Struggle','Zayed Sports City','Expo City Dubai','Central Branch Primary School','Belize City','The Bluff',
 'Union Museum','Eric Williams Financial Complex','Admiralty Bay','Saint John','Haulover Creek','Royal Flying Doctor Service'
];
const stripOfficialNames=text=>officialNames.reduce((s,name)=>s.replaceAll(name,''),text);
const fatals=[];const residual=[];
for(const row of rows){
  for(const [rx,label] of fatalPatterns)if(rx.test(row.text))fatals.push({...row,label});
  if(residualEnglish.test(stripOfficialNames(row.text)))residual.push(row);
}
const william=rows.filter(r=>/William Lyon Mackenzie/i.test(r.text));
if(william.length && william.some(r=>!r.text.includes('William Lyon Mackenzie King'))){
  fatals.push({key:'CAD:50',side:'front',field:'name',text:william.map(x=>x.text).join(' | '),label:'nome de William Lyon Mackenzie King não foi preservado integralmente'});
}
const flynn=rows.filter(r=>r.key==='AUD:20'&&r.side==='back'&&/John Flynn|Flying/i.test(r.text));
if(flynn.length && flynn.some(r=>/Flying/i.test(r.text)&&!r.text.includes('Royal Flying Doctor Service'))){
  fatals.push({key:'AUD:20',side:'back',field:'institution',text:flynn.map(x=>x.text).join(' | '),label:'nome Royal Flying Doctor Service não foi preservado integralmente'});
}
console.log(`Auditoria editorial: ${Object.keys(catalog).length} notas, ${rows.length} campos textuais.`);
console.log(`Resíduos ingleses a rever: ${residual.length}.`);
for(const r of residual.slice(0,200))console.log(`  REVIEW ${r.key} ${r.side}.${r.field}: ${r.text}`);
if(residual.length>200)console.log(`  ... +${residual.length-200} ocorrências.`);
if(fatals.length){
  console.error(`Erros editoriais bloqueantes: ${fatals.length}`);
  for(const r of fatals)console.error(`  ERROR ${r.key} ${r.side}.${r.field} [${r.label}]: ${r.text}`);
  process.exit(1);
}
console.log('Erros editoriais bloqueantes: 0.');
