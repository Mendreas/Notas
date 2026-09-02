import fs from 'node:fs';
import vm from 'node:vm';

const root=new URL('../',import.meta.url);
const read=p=>fs.readFileSync(new URL(p,root),'utf8');
const stripQuery=s=>s.replace(/^\//,'').split('?')[0];
const html=read('index.html');
const baseNotes=JSON.parse(read('data/notes.json'));

const srcs=[...html.matchAll(/<script\s+[^>]*src=["']([^"']+)["'][^>]*><\/script>/gi)].map(m=>m[1]);
const appIndex=srcs.findIndex(x=>stripQuery(x)==='app.js');
const noteScripts=srcs.slice(0,appIndex).filter(x=>!/^https?:/i.test(x));

const nativeFetch=async input=>{
  const url=typeof input==='string'?input:input?.url||'';
  if(url.includes('/data/notes.json')){
    return new Response(JSON.stringify(baseNotes),{status:200,headers:{'Content-Type':'application/json; charset=utf-8'}});
  }
  return new Response('',{status:404});
};

const sandbox={
  console,
  Response,
  Request,
  Headers,
  URL,
  setTimeout,
  clearTimeout,
  fetch:nativeFetch,
  document:{write(){},createElement(){return {};},head:{appendChild(){}}},
  location:{href:'https://example.invalid/',origin:'https://example.invalid'},
  navigator:{},
  localStorage:{getItem(){return null;},setItem(){},removeItem(){}},
};
sandbox.window=sandbox;
sandbox.globalThis=sandbox;
vm.createContext(sandbox);

const skipped=[];
for(const src of noteScripts){
  const path=stripQuery(src);
  if(!fs.existsSync(new URL(path,root))) continue;
  try{vm.runInContext(read(path),sandbox,{filename:path});}
  catch(e){skipped.push(`${path}: ${e.message}`);}
}

const response=await sandbox.window.fetch('/data/notes.json');
const notes=await response.json();
const current=notes.filter(n=>String(n.status||'circulating').toLowerCase()!=='withdrawn' && String(n.statusLabel||'').toLowerCase()!=='retirada');
const isMuseum=n=>String(n.front||'').startsWith('/assets/notes/banknotews/') && String(n.back||'').startsWith('/assets/notes/banknotews/');
const external=current.filter(n=>!isMuseum(n));
const byCurrency=new Map();
for(const n of external){
  const c=n.currency||'?';
  if(!byCurrency.has(c))byCurrency.set(c,[]);
  byCurrency.get(c).push({value:n.value,front:n.front||'',back:n.back||'',imageSource:n.imageSource||''});
}

console.log(`Effective notes: ${current.length}`);
console.log(`Bank Note Museum local pairs: ${current.length-external.length}`);
console.log(`Non-Museum effective notes: ${external.length}`);
console.log(`Currencies with non-Museum effective images: ${byCurrency.size}`);
for(const [currency,rows] of [...byCurrency].sort((a,b)=>a[0].localeCompare(b[0]))){
  console.log(`NON_MUSEUM ${currency}: ${rows.map(x=>x.value).join(', ')}`);
  for(const x of rows) console.log(`  ${currency}:${x.value} | ${x.imageSource||'sem imageSource'} | ${x.front}`);
}
if(skipped.length){
  console.log(`Scripts skipped during simulation: ${skipped.length}`);
  for(const s of skipped)console.log(`SKIP ${s}`);
}
