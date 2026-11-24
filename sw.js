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
// 저장본 먼저. 정상 응답(200)만 저장한다(없는 파일의 404를 저장하지 않기 위해).
// 아이폰 사파리는 소리 파일을 "일부분 요청(Range)"으로 받으므로, 저장본에서 그 부분만 잘라 206으로 돌려준다.
async function staticFirst(req) {
  try {
    const cache = await caches.open(CACHE);
    let res = await cache.match(req.url);
    if (!res) {
      const net = await fetch(req.url);
      if (net.ok) cache.put(req.url, net.clone());
      res = net;
    }
    const range = req.headers.get("range");
    if (!range || !res.ok) return res;
    const m = /bytes=(\d*)-(\d*)/.exec(range); if (!m) return res;
    const buf = await res.arrayBuffer(), size = buf.byteLength;
    let start = m[1] === "" ? Math.max(0, size - +m[2]) : +m[1], end = m[1] === "" || m[2] === "" ? size - 1 : Math.min(+m[2], size - 1);
    if (start >= size) return new Response(null, { status: 416, headers: { "Content-Range": "bytes */" + size } });
    return new Response(buf.slice(start, end + 1), { status: 206, headers: { "Content-Type": res.headers.get("Content-Type") || "audio/mpeg", "Content-Range": "bytes " + start + "-" + end + "/" + size, "Content-Length": String(end - start + 1), "Accept-Ranges": "bytes" } });
  } catch (err) { return Response.error(); }
}
self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin === location.origin) {
    // 음성·이어 듣기 파일·아이콘: 저장본 먼저. (loops/index.json 은 최신을 먼저 본다)
    const staticAsset = /\/(audio|icons)\//.test(url.pathname) || /\/loops\/[^/]+\.mp3$/.test(url.pathname);
    if (staticAsset) { e.respondWith(staticFirst(req)); }
    else {
      e.respondWith(fetch(req).then(res => { if (res.ok) { const cp = res.clone(); caches.open(CACHE).then(c => c.put(req, cp)); } return res; })
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
