import fs from 'node:fs';
import vm from 'node:vm';

const sandbox={window:{},console,setTimeout:()=>{}};
vm.createContext(sandbox);
for(const file of ['note-technical-data.js','note-technical-data-wave2.js']){
  vm.runInContext(fs.readFileSync(file,'utf8'),sandbox,{filename:file});
}
const api=sandbox.window.NOTE_TECHNICAL;
if(!api?.families)throw new Error('NOTE_TECHNICAL não foi inicializado.');

const required={
  USD:[1,2,5,10,20,50,100],EUR:[5,10,20,50,100,200,500],GBP:[5,10,20,50],
  CAD:[5,10,20,50,100],AUD:[5,10,20,50,100],CHF:[10,20,50,100,200,1000],JPY:[1000,2000,5000,10000],
  NZD:[5,10,20,50,100],HKD:[10,20,50,100,500,1000]
};
const errors=[];let notes=0;
for(const [code,values] of Object.entries(required)){
  const fam=api.families[code];
  if(!fam){errors.push(`${code}: família técnica em falta.`);continue;}
  for(const field of ['material','security','circulation','source','sourceUrl'])if(!fam[field])errors.push(`${code}: ${field} em falta.`);
  if(fam.sourceUrl&&!/^https:\/\//.test(fam.sourceUrl))errors.push(`${code}: sourceUrl não é HTTPS.`);
  for(const value of values){
    notes++;
    const row=api.get(code,value);
    if(!row?.dimensions)errors.push(`${code}:${value}: dimensões em falta.`);
    if(!row?.material)errors.push(`${code}:${value}: material em falta.`);
    if(!row?.security)errors.push(`${code}:${value}: segurança em falta.`);
    if(!row?.circulation)errors.push(`${code}:${value}: situação de circulação em falta.`);
  }
}
const eur500=api.get('EUR',500);
if(eur500?.legalStatus!=='Curso legal · emissão terminada')errors.push('EUR:500: estado jurídico esperado não está definido.');

console.log(`Auditoria técnica de notas: ${Object.keys(required).length} famílias, ${notes} denominações com ficha técnica explícita.`);
console.log('Campos verificados: dimensões, material, segurança, circulação e fonte.');
if(errors.length){for(const e of errors)console.error(`ERRO ${e}`);process.exit(1)}
console.log('Resultado: 0 erros técnicos.');
