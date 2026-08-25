const SOURCES={
  resbank:'https://www.resbank.co.za/en/home/what-we-do/banknotes-and-coin/Use-of-banknotes'
};

const esc=s=>s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
const decode=s=>(s||'').replace(/&amp;/g,'&').replace(/&quot;/g,'"').replace(/&#39;/g,"'").replace(/&lt;/g,'<').replace(/&gt;/g,'>');
const attrs=tag=>Object.fromEntries([...tag.matchAll(/([\w:-]+)\s*=\s*["']([^"']*)["']/g)].map(m=>[m[1].toLowerCase(),decode(m[2])]));

async function getHtml(url){
  const r=await fetch(url,{redirect:'follow',headers:{'User-Agent':'Mozilla/5.0 Notas-do-Mundo/0.6.7','Accept':'text/html,application/xhtml+xml'}});
  if(!r.ok) throw new Error(`page ${r.status}`);
  return await r.text();
}
async function getImage(url){
  const r=await fetch(url,{redirect:'follow',headers:{'User-Agent':'Mozilla/5.0 Notas-do-Mundo/0.6.7','Accept':'image/avif,image/webp,image/apng,image/*,*/*;q=0.8'}});
  if(!r.ok) throw new Error(`image ${r.status}`);
  const ct=r.headers.get('content-type')||'application/octet-stream';
  if(!ct.startsWith('image/')) throw new Error(`not image ${ct}`);
  const bytes=Buffer.from(await r.arrayBuffer());
  return {statusCode:200,isBase64Encoded:true,headers:{'Content-Type':ct,'Cache-Control':'public,max-age=86400,s-maxage=604800','Access-Control-Allow-Origin':'*'},body:bytes.toString('base64')};
}

exports.handler=async event=>{
  try{
    const q=event.queryStringParameters||{};
    if(q.source==='resbank'){
      const file=q.file||'';
      if(!/^R(?:10|20|50|100|200)_(?:Front|Back)\.jpg$/i.test(file)) return {statusCode:400,body:'bad file'};
      const page=SOURCES.resbank, html=await getHtml(page);
      const re=new RegExp('["\']([^"\']*'+esc(file)+'[^"\']*)["\']','i');
      const m=html.match(re);
      if(!m) return {statusCode:404,body:'asset not found in official gallery'};
      return await getImage(new URL(decode(m[1]),page).toString());
    }
    if(q.source==='banxico'){
      const page=q.page;
      const side=(q.side||'').toLowerCase();
      const value=String(q.value||'');
      if(!/^https:\/\/www\.banxico\.org\.mx\/billetes-y-monedas\//.test(page||'')||!['front','back'].includes(side)||!/^(20|50|100|200|500|1000)$/.test(value)) return {statusCode:400,body:'bad request'};
      const html=await getHtml(page);
      const tags=[...html.matchAll(/<img\b[^>]*>/gi)].map(m=>m[0]);
      const needle=side==='front'?'anverso':'reverso';
      let chosen=null;
      for(const tag of tags){
        const a=attrs(tag), alt=(a.alt||a.title||'').toLowerCase();
        if(!alt.includes(needle)||!alt.includes('billete')||!alt.includes(value)) continue;
        if(/señal|senal|detalle|fluores|seguridad|ubicaci|ventana|folio|hilo|marca/.test(alt)) continue;
        const src=a.src||a['data-src']||a['data-original'];
        if(src){chosen=src;break;}
      }
      if(!chosen) return {statusCode:404,body:'banknote image not found on official page'};
      return await getImage(new URL(chosen,page).toString());
    }
    return {statusCode:400,body:'unknown source'};
  }catch(e){console.error('official-source-image',e);return {statusCode:500,body:'official image fetch failed'};}
};
