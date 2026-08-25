const CACHE="notas-mundo-v059";
const CORE=["/","/index.html","/app.css?v=059","/viewer.css?v=059","/note-overrides.js?v=059","/image-proxy-client.js?v=059","/app.js?v=059","/manifest.webmanifest","/data/countries.json","/data/currencies.json","/data/notes.json","/data/iso-map.json","/assets/icon.svg"];
self.addEventListener("install",e=>{self.skipWaiting();e.waitUntil(caches.open(CACHE).then(c=>c.addAll(CORE)))});
self.addEventListener("activate",e=>e.waitUntil(Promise.all([caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))),self.clients.claim()])));
self.addEventListener("fetch",e=>{
  if(e.request.method!=="GET")return;
  const url=new URL(e.request.url);
  if(url.pathname.startsWith("/.netlify/functions/")){e.respondWith(fetch(e.request));return;}
  e.respondWith(caches.match(e.request).then(cached=>cached||fetch(e.request).then(resp=>{
    if(resp.ok){const clone=resp.clone();caches.open(CACHE).then(c=>c.put(e.request,clone));}
    return resp;
  })));
});
