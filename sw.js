// MTC Makrotracker – Offline-Cache. Bei jedem Update VERSION erhöhen.
const VERSION="mtc-makro-v8";
const FILES=["./", "index.html", "coach.html", "manifest.webmanifest", "data/bls-v2.json", "icons/icon-192.png", "icons/icon-512.png", "icons/apple-touch-icon.png", "icons/logo-white.png", "fonts/chakra-petch-latin-600-normal.woff2", "fonts/chakra-petch-latin-700-normal.woff2"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(VERSION).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting()))});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==VERSION).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener("fetch",e=>{
  const u=new URL(e.request.url);
  if(e.request.method!=="GET"||u.origin!==location.origin)return;   // Open Food Facts nie cachen
  if(u.pathname.includes("/api/"))return;                             // Online-Suche immer live
  /* Seiten (index/coach) immer zuerst frisch laden, damit Updates sofort sichtbar sind; offline aus dem Cache */
  if(e.request.mode==="navigate"||u.pathname.endsWith(".html")||u.pathname.endsWith("/")){
    e.respondWith(fetch(e.request).then(r=>{if(r&&r.ok){const cl=r.clone();caches.open(VERSION).then(c=>c.put(e.request,cl))}return r}).catch(()=>caches.match(e.request,{ignoreSearch:true}).then(h=>h||caches.match("index.html"))));
    return;
  }
  e.respondWith(caches.open(VERSION).then(async c=>{
    const hit=await c.match(e.request,{ignoreSearch:true});
    const net=fetch(e.request).then(r=>{if(r&&r.ok)c.put(e.request,r.clone());return r}).catch(()=>hit);
    return hit||net; // sofort aus dem Cache, im Hintergrund aktualisieren
  }));
});
