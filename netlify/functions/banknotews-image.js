const BASE='https://www.banknote.ws/COLLECTION/countries/AFR/';
const INDEX={
 LIB:'LIB/LIB.htm', GAM:'GAM/GAM.htm', GUI:'GUI/GUI.htm', BUR:'BUR/BUR.htm',
 CDR:'CDR/CDR-CDR.htm', DJI:'DJI/DJI-DJI.htm', ERI:'ERI/ERI.htm', SUD:'SUD/SUD-SUD.htm',
 SSD:'SSD/SSD.htm', MAD:'MAD/MAD-BFM.htm'
};
const decode=s=>(s||'').replace(/&amp;/g,'&').replace(/&quot;/g,'"').replace(/&#39;/g,"'").replace(/&lt;/g,'<').replace(/&gt;/g,'>');
const text=s=>decode((s||'').replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim());
const norm=s=>text(s).toUpperCase().replace(/[^A-Z0-9]/g,'');
async function get(url,accept){const r=await fetch(url,{redirect:'follow',headers:{'User-Agent':'Mozilla/5.0 Notas-do-Mundo/0.11.22','Accept':accept||'text/html,*/*'}});if(!r.ok)throw new Error(`upstream ${r.status}`);return r;}
function hrefNearPick(html,pick,base){
 const want=norm(pick);
 const anchors=[...html.matchAll(/<a\b[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi)].map(m=>({href:decode(m[1]),label:norm(m[2]),i:m.index||0}));
 let a=anchors.find(x=>x.label===want||x.label.endsWith(want)||x.label.includes(want));
 if(!a){const upper=norm(html);const pos=upper.indexOf(want);if(pos>=0){a=anchors.filter(x=>/\.html?$/i.test(x.href)).sort((x,y)=>Math.abs(x.i-pos)-Math.abs(y.i-pos))[0]}}
 if(!a)throw new Error(`pick ${pick} not found`);
 return new URL(a.href,base).toString();
}
function imgSrc(tag){for(const a of ['src','data-src','data-lazy-src']){const m=tag.match(new RegExp(a+'=["\\']([^"\\']+)["\\']','i'));if(m)return decode(m[1])}const ss=tag.match(/srcset=["']([^"']+)["']/i)?.[1];return ss?decode(ss.split(',')[0].trim().split(/\s+/)[0]):null}
function noteImages(html,page){
 const out=[];
 for(const m of html.matchAll(/<img\b[^>]*>/gi)){
  const tag=m[0],src=imgSrc(tag);if(!src)continue;
  const u=new URL(src,page).toString();const low=u.toLowerCase();
  if(!/\.(?:png|jpe?g|webp)(?:\?|$)/i.test(u))continue;
  if(/logo|flag|banner|button|spacer|signature|printer|counter|arrow|home|blank/.test(low))continue;
  if(!out.includes(u))out.push(u);
 }
 return out;
}
exports.handler=async event=>{try{
 const q=event.queryStringParameters||{},country=String(q.country||'').toUpperCase(),pick=String(q.pick||''),side=q.side;
 if(!INDEX[country]||!pick||!['front','back'].includes(side))return{statusCode:400,body:'bad request'};
 const indexUrl=BASE+INDEX[country],indexHtml=await (await get(indexUrl)).text(),page=hrefNearPick(indexHtml,pick,indexUrl);
 const detailHtml=await (await get(page)).text(),imgs=noteImages(detailHtml,page);
 if(imgs.length<2)return{statusCode:404,body:'note images not found'};
 const target=side==='front'?imgs[0]:imgs[1],r=await get(target,'image/avif,image/webp,image/apng,image/*,*/*;q=0.8');
 const ct=r.headers.get('content-type')||'image/jpeg';if(!ct.startsWith('image/'))return{statusCode:415,body:'not image'};
 const bytes=Buffer.from(await r.arrayBuffer());return{statusCode:200,isBase64Encoded:true,headers:{'Content-Type':ct,'Cache-Control':'public,max-age=86400,s-maxage=604800,stale-while-revalidate=2592000','Access-Control-Allow-Origin':'*'},body:bytes.toString('base64')};
}catch(e){console.error('banknotews-image',e);return{statusCode:500,body:'banknote image resolve failed'}}};
