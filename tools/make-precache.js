// 사용법: node tools/make-precache.js
// 앱에 필요한 파일 목록과 버전(내용 해시)을 precache.js에 적는다.
// 파일을 고치거나 추가한 뒤에는 꼭 다시 실행해야 사용자 기기에 새 내용이 전달된다.
const fs = require("fs"), path = require("path"), crypto = require("crypto");
const root = path.join(__dirname, "..");
const SKIP = new Set(["tools", "docs", "node_modules", ".git"]);
const FILES = [];
(function walk(d) {
  for (const n of fs.readdirSync(d)) {
    const p = path.join(d, n), rel = path.relative(root, p).split(path.sep).join("/");
    if (fs.statSync(p).isDirectory()) { if (!SKIP.has(n)) walk(p); continue; }
    if (["precache.js", "sw.js", "README.md", ".DS_Store"].includes(n) || /\.zip$/.test(n)) continue;
    FILES.push(rel);
  }
})(root);
FILES.sort();
const h = crypto.createHash("sha1");
FILES.forEach(f => { h.update(f); h.update(fs.readFileSync(path.join(root, f))); });
const version = h.digest("hex").slice(0, 10);
fs.writeFileSync(path.join(root, "precache.js"),
  "// 자동 생성 파일 (tools/make-precache.js). 직접 고치지 않는다.\nself.APP_VERSION = " + JSON.stringify(version) + ";\nself.PRECACHE = " + JSON.stringify(["./"].concat(FILES), null, 1) + ";\n");
console.log("precache", FILES.length, "files, version", version);
