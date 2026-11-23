/* 오프라인에서도 열리게 하는 서비스워커.
   - 앱 파일은 설치할 때 전부 저장한다 (음성 mp3 포함).
   - 화면·코드·문장은 인터넷이 되면 최신을, 안 되면 저장본을 쓴다.
   - 음성·아이콘은 저장본을 먼저 쓴다. */
importScripts("precache.js");
const CACHE = "passport-" + self.APP_VERSION;
self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(self.PRECACHE)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k.startsWith("passport-") && k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin === location.origin) {
    const staticAsset = /\/(audio|icons)\//.test(url.pathname);
    if (staticAsset) {
      e.respondWith(caches.match(req).then(r => r || fetch(req).then(res => { const cp = res.clone(); caches.open(CACHE).then(c => c.put(req, cp)); return res; })));
    } else {
      e.respondWith(fetch(req).then(res => { const cp = res.clone(); caches.open(CACHE).then(c => c.put(req, cp)); return res; })
        .catch(() => caches.match(req, { ignoreSearch: true }).then(r => r || caches.match("./index.html"))));
    }
    return;
  }
  // 글꼴: 저장본을 먼저 보여 주고 뒤에서 갱신
  if (/fonts\.(googleapis|gstatic)\.com$/.test(url.hostname)) {
    e.respondWith(caches.open("passport-fonts").then(c => c.match(req).then(r => {
      const net = fetch(req).then(res => { c.put(req, res.clone()); return res; }).catch(() => r);
      return r || net;
    })));
  }
});
