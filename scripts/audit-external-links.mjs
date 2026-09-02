import fs from 'node:fs';
import path from 'node:path';

const root=process.cwd();
const allowedExt=new Set(['.html','.js','.json','.md']);
const skipDirs=new Set(['.git','node_modules','assets']);
const files=[];
function walk(dir){for(const ent of fs.readdirSync(dir,{withFileTypes:true})){if(skipDirs.has(ent.name))continue;const p=path.join(dir,ent.name);if(ent.isDirectory())walk(p);else if(allowedExt.has(path.extname(ent.name)))files.push(p)}}
walk(root);
const urls=new Map();
const re=/https?:\/\/[^\s'"`<>)\]}]+/g;
for(const f of files){const txt=fs.readFileSync(f,'utf8');for(const m of txt.matchAll(re)){let u=m[0].replace(/[.,;:]+$/,'');if(!urls.has(u))urls.set(u,[]);urls.get(u).push(path.relative(root,f))}}
const selected=[...urls.keys()].filter(u=>!u.includes('example.com')&&!u.includes('localhost')).sort();
const timeout=AbortSignal.timeout;
async function check(url){const started=Date.now();for(const method of ['HEAD','GET']){try{const r=await fetch(url,{method,redirect:'follow',signal:timeout(12000),headers:{'User-Agent':'Notas-do-Mundo-link-audit/1.0'}});if(method==='HEAD'&&[403,405].includes(r.status))continue;return {url,status:r.status,ok:r.status<400||r.status===403,ms:Date.now()-started,finalUrl:r.url}}catch(e){if(method==='HEAD')continue;return {url,status:0,ok:false,ms:Date.now()-started,error:String(e.message||e)}}}return {url,status:0,ok:false,ms:Date.now()-started,error:'Sem resposta'}}
const out=[];let i=0;
async function worker(){while(i<selected.length){const idx=i++;out[idx]=await check(selected[idx]);console.log(`${out[idx].ok?'OK':'WARN'} ${out[idx].status||'-'} ${out[idx].url}`)}}
await Promise.all(Array.from({length:Math.min(8,selected.length||1)},worker));
const hard=out.filter(x=>x.status===404||x.status===410);
const warnings=out.filter(x=>!x.ok&&!hard.includes(x));
fs.mkdirSync(path.join(root,'data'),{recursive:true});
fs.writeFileSync(path.join(root,'data','external-link-audit.json'),JSON.stringify({generatedAt:new Date().toISOString(),checked:out.length,hardBroken:hard.length,warnings:warnings.length,results:out},null,2));
console.log(`\nChecked ${out.length}; hard broken ${hard.length}; warnings ${warnings.length}`);
if(hard.length){console.error('Hard broken links:');hard.forEach(x=>console.error(x.status,x.url));process.exitCode=1}
