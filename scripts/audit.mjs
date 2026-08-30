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

// 1) JSON parseability.
for(const f of files.filter(x=>x.endsWith('.json'))){
  try{JSON.parse(read(f));}catch(e){errors.push(`${f}: JSON inválido (${e.message})`);}
}

// 2) Local references in HTML/JS/CSS must point to a real file.
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

// 3) Every local script/css referenced by index.html must exist.
const index=read('index.html');
for(const m of index.matchAll(/(?:src|href)="(\/[^"?]+\.(?:js|css|webmanifest))[^" ]*"/g)){
  const p=m[1].slice(1);
  if(!exists(p))errors.push(`index.html referencia ficheiro inexistente: /${p}`);
}

// 4) Version/cache coherence.
const indexVersion=index.match(/v(\d+)\.(\d+)\.(\d+)\s*·/);
const sw=read('service-worker.js');
const cacheVersion=sw.match(/notas-mundo-v(\d+)/);
if(indexVersion&&cacheVersion){
  const expected=`${indexVersion[1]}${indexVersion[2].padStart(2,'0')}${indexVersion[3]}`;
  if(cacheVersion[1]!==expected)errors.push(`Cache PWA desalinhada: index v${indexVersion[1]}.${indexVersion[2]}.${indexVersion[3]} vs cache v${cacheVersion[1]}.`);
  else info.push(`Cache PWA alinhada com v${indexVersion[1]}.${indexVersion[2]}.${indexVersion[3]}.`);
}else warnings.push('Não foi possível comparar versão do index com CACHE do service worker.');

// 5) Editorial context load order.
const expectedContexts=['note-context-global.js','note-context-wave2.js','note-context-wave3.js','note-context-wave4.js','note-context-wave5.js','note-context.js'];
let pos=-1;
for(const f of expectedContexts){
  const i=index.indexOf(`/${f}`);
  if(i<0)errors.push(`Camada editorial em falta no index: ${f}`);
  else if(i<pos)errors.push(`Ordem editorial incorreta no index: ${f}`);
  pos=Math.max(pos,i);
}

// 6) Known stale UI/documentation markers.
const app=read('app.js');
if(app.includes('países na v0.2'))warnings.push('app.js ainda contém o rótulo histórico “países na v0.2”.');
if(read('README.md').includes('v0.4'))warnings.push('README.md ainda menciona v0.4.');

// 7) Count remote image dependencies for visibility.
let remoteImages=0;
for(const f of textual){
  const s=read(f);
  remoteImages+=(s.match(/https:\/\/[^"'`\s]+\.(?:png|jpe?g|webp)(?:\?[^"'`\s]*)?/gi)||[]).length;
}
info.push(`${remoteImages} referências diretas a imagens remotas detetadas (dependência de rede; não é erro por si só).`);

console.log('\n=== NOTAS DO MUNDO · AUDITORIA ESTÁTICA ===');
for(const x of info)console.log(`INFO  ${x}`);
for(const x of warnings)console.warn(`WARN  ${x}`);
for(const x of errors)console.error(`ERRO  ${x}`);
console.log(`\nResultado: ${errors.length} erro(s), ${warnings.length} aviso(s).`);
if(errors.length)process.exit(1);
