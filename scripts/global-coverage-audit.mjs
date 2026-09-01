import fs from 'node:fs';
import path from 'node:path';

const root=process.cwd();
const sovereign=`AFG ALB DZA AND AGO ATG ARG ARM AUS AUT AZE BHS BHR BGD BRB BLR BEL BLZ BEN BTN BOL BIH BWA BRA BRN BGR BFA BDI CPV KHM CMR CAN CAF TCD CHL CHN COL COM COG COD CRI CIV HRV CUB CYP CZE DNK DJI DMA DOM ECU EGY SLV GNQ ERI EST SWZ ETH FJI FIN FRA GAB GMB GEO DEU GHA GRC GRD GTM GIN GNB GUY HTI HND HUN ISL IND IDN IRN IRQ IRL ISR ITA JAM JPN JOR KAZ KEN KIR PRK KOR KWT KGZ LAO LVA LBN LSO LBR LBY LIE LTU LUX MDG MWI MYS MDV MLI MLT MHL MRT MUS MEX FSM MDA MCO MNG MNE MAR MOZ MMR NAM NRU NPL NLD NZL NIC NER NGA MKD NOR OMN PAK PLW PAN PNG PRY PER PHL POL PRT QAT ROU RUS RWA KNA LCA VCT WSM SMR STP SAU SEN SRB SYC SLE SGP SVK SVN SLB SOM ZAF SSD ESP LKA SDN SUR SWE CHE SYR TJK TZA THA TLS TGO TON TTO TUN TUR TKM TUV UGA UKR ARE GBR USA URY UZB VUT VEN VNM YEM ZMB ZWE PSE VAT XKX`.split(/\s+/);

function walk(dir='.'){
  const out=[];
  for(const ent of fs.readdirSync(path.join(root,dir),{withFileTypes:true})){
    if(['.git','node_modules','assets'].includes(ent.name)) continue;
    const rel=path.join(dir,ent.name).replaceAll('\\','/');
    if(ent.isDirectory()) out.push(...walk(rel));
    else if(/\.(?:js|json)$/i.test(ent.name)) out.push(rel.replace(/^\.\//,''));
  }
  return out;
}

const ids=new Set();
for(const f of walk()){
  const s=fs.readFileSync(path.join(root,f),'utf8');
  for(const m of s.matchAll(/\bid\s*[:=]\s*["']([A-Z]{3})["']/g)) ids.add(m[1]);
  if(f.endsWith('.json')){
    try{const j=JSON.parse(s);if(Array.isArray(j))for(const x of j)if(x&&typeof x.id==='string'&&/^[A-Z]{3}$/.test(x.id))ids.add(x.id);}catch{}
  }
}

const missing=sovereign.filter(x=>!ids.has(x));
console.log('\n=== COBERTURA MUNDIAL · ESTADOS SOBERANOS ===');
console.log(`Esperados: ${sovereign.length}`);
console.log(`Detetados no projeto: ${sovereign.length-missing.length}`);
if(missing.length){
  console.error(`EM FALTA (${missing.length}): ${missing.join(', ')}`);
  process.exit(1);
}
console.log('Cobertura soberana completa.');
