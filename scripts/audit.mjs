import fs from 'node:fs';
import path from 'node:path';

const root=process.cwd();
const errors=[];
const warnings=[];
const info=[];
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const exists=p=>fs.existsSync(path.join(root,p));

function walk(dir='.'){
  const out=[];
  for(const ent of fs.readdirSync(path.join(root,dir),{withFileTypes:true})){
    if(['.git','node_modules'].includes(ent.name))continue;
    const rel=path.join(dir,ent.name).replaceAll('\\','/');
    if(ent.isDirectory())out.push(...walk(rel)); else out.push(rel.replace(/^\.\//,''));
  }
  return out;
}

const files=walk();

for(const f of files.filter(x=>x.endsWith('.json'))){
  try{JSON.parse(read(f));}catch(e){errors.push(`${f}: JSON inválido (${e.message})`);}
}

const textual=files.filter(x=>/\.(?:html|js|css|mjs)$/.test(x));
const localRefs=new Set();
for(const f of textual){
  const s=read(f);
  const re=/["'`](\/assets\/[A-Za-z0-9_./%+()\-]+\.(?:png|jpe?g|webp|svg))(?:\?[^"'`]*)?["'`]/gi;
  for(const m of s.matchAll(re)){
    if(m[1].includes('${'))continue;
    localRefs.add(decodeURIComponent(m[1].slice(1)));
  }
}
for(const ref of [...localRefs].sort())if(!exists(ref))errors.push(`Asset local inexistente: /${ref}`);
info.push(`${localRefs.size} referências locais estáticas verificadas.`);

const index=read('index.html');
for(const m of index.matchAll(/(?:src|href)="(\/[^"?]+\.(?:js|css|webmanifest))[^" ]*"/g)){
  const p=m[1].slice(1);
  if(!exists(p))errors.push(`index.html referencia ficheiro inexistente: /${p}`);
}

const indexVersion=index.match(/v(\d+)\.(\d+)\.(\d+)\s*·/);
const sw=read('service-worker.js');
const cacheVersion=sw.match(/notas-mundo-v(\d+)/);
if(indexVersion&&cacheVersion){
  const expected=`${indexVersion[1]}${indexVersion[2].padStart(2,'0')}${indexVersion[3]}`;
  if(cacheVersion[1]!==expected)errors.push(`Cache PWA desalinhada: index v${indexVersion[1]}.${indexVersion[2]}.${indexVersion[3]} vs cache v${cacheVersion[1]}.`);
  else info.push(`Cache PWA alinhada com v${indexVersion[1]}.${indexVersion[2]}.${indexVersion[3]}.`);
}else warnings.push('Não foi possível comparar versão do index com CACHE do service worker.');

const expectedContexts=['note-context-global.js','note-context-wave2.js','note-context-wave3.js','note-context-wave4.js','note-context-wave5.js','note-context.js'];
let pos=-1;
for(const f of expectedContexts){
  const i=index.indexOf(`/${f}`);
  if(i<0)errors.push(`Camada editorial em falta no index: ${f}`);
  else if(i<pos)errors.push(`Ordem editorial incorreta no index: ${f}`);
  pos=Math.max(pos,i);
}

const app=read('app.js');
if(app.includes('países na v0.2'))warnings.push('app.js ainda contém o rótulo histórico “países na v0.2”.');
if(read('README.md').includes('v0.4'))warnings.push('README.md ainda menciona v0.4.');

let remoteImages=0;
for(const f of textual){
  const s=read(f);
  remoteImages+=(s.match(/https:\/\/[^"'`\s]+\.(?:png|jpe?g|webp)(?:\?[^"'`\s]*)?/gi)||[]).length;
}
info.push(`${remoteImages} referências diretas a imagens remotas detetadas (dependência de rede; não é erro por si só).`);

const bankDir='assets/notes/banknotews';
if(exists(bankDir)){
  const scans=walk(bankDir).filter(x=>/-(?:front|back)\.jpg$/i.test(x));
  const stems=new Map();
  for(const f of scans){
    const m=f.match(/^(.*)-(front|back)\.jpg$/i);if(!m)continue;
    if(!stems.has(m[1]))stems.set(m[1],new Set());stems.get(m[1]).add(m[2].toLowerCase());
  }
  let incomplete=0;
  for(const [stem,sides] of stems){if(!sides.has('front')||!sides.has('back')){errors.push(`Par frente/verso incompleto: ${stem}`);incomplete++;}}
  info.push(`${stems.size} notas locais banknote.ws verificadas em pares frente/verso; ${incomplete} incompletas.`);
}

// O auditor editorial dedicado distingue prosa inglesa de nomes oficiais (ex.: Belize City, The Bluff).
const contextFiles=files.filter(x=>/^note-context.*\.js$/i.test(path.basename(x))&&!/editorial-audit-fixes/i.test(path.basename(x)));
const englishMarkers=/\b(?:building|bridge|church|palace|portrait|river|mountain|waterfall|fishermen|village|airport|airplane|ship|boat|farmer|farmers|cattle|children|dancers|forest|bird|birds|turtle|flower|flowers|school|hospital|museum|monument|statue|arms|coat of arms|government|central bank|national bank)\b/i;
const englishHits=[];
for(const f of contextFiles){
  const lines=read(f).split(/\r?\n/);
  lines.forEach((line,i)=>{if(englishMarkers.test(line)&&/(summary|more|title)\s*:/.test(line))englishHits.push(`${f}:${i+1}`);});
}
if(englishHits.length)warnings.push(`Possível inglês residual em descrições: ${englishHits.slice(0,20).join(', ')}${englishHits.length>20?` (+${englishHits.length-20})`:''}.`);
else info.push('Sem marcadores óbvios de inglês residual nas descrições editoriais.');

console.log('\n=== NOTAS DO MUNDO · AUDITORIA ESTÁTICA ===');
for(const x of info)console.log(`INFO  ${x}`);
for(const x of warnings)console.warn(`WARN  ${x}`);
for(const x of errors)console.error(`ERRO  ${x}`);
console.log(`\nResultado: ${errors.length} erro(s), ${warnings.length} aviso(s).`);
if(errors.length)process.exit(1);
