// 새 문장의 음성(mp3)을 Google Chirp 3 HD로 만든다. 내 PC에서 실행한다.
// 규칙: data/*.js 에 audio(또는 sa) 경로가 적혀 있는데 그 파일이 없는 문장만 만든다.
// 실행 (PowerShell):
//   $env:GOOGLE_TTS_KEY="API키"      ← 키는 대화창이나 파일에 적지 않는다
//   node tools/make-voices.js          만들기
//   node tools/make-voices.js --dry    무엇을 만들지 목록만 보기
// 끝나면: node tools/make-precache.js
const fs = require("fs"), path = require("path"), vm = require("vm");
const root = path.join(__dirname, "..");
const VOICE_ME = "en-US-Chirp3-HD-Kore";      // 내가 말할 문장
const VOICE_STAFF = "en-US-Chirp3-HD-Charon"; // 상황극 직원
const dry = process.argv.includes("--dry");

const PACKS = [];
fs.readdirSync(path.join(root, "data")).filter(f => f.endsWith(".js")).sort().forEach(f => {
  const win = {}; vm.createContext(win); win.window = win;
  vm.runInContext(fs.readFileSync(path.join(root, "data", f), "utf8"), win);
  (win.PACKS || []).forEach(p => PACKS.push(p));
});

const jobs = [];
PACKS.forEach(p => p.scenes.forEach(sc => {
  sc.items.forEach(it => it.audio && jobs.push({ text: it.en, file: it.audio, voice: VOICE_ME }));
  sc.dialog.forEach(d => d.sa && jobs.push({ text: d.s, file: d.sa, voice: VOICE_STAFF }));
  if (sc.end.sa) jobs.push({ text: sc.end.s, file: sc.end.sa, voice: VOICE_STAFF });
}));
const todo = jobs.filter(j => !fs.existsSync(path.join(root, j.file)));
console.log("전체 " + jobs.length + "개 중 새로 만들 것 " + todo.length + "개");
if (dry || !todo.length) { todo.forEach(j => console.log(" -", j.file, "|", j.text)); process.exit(0); }

const KEY = process.env.GOOGLE_TTS_KEY;
if (!KEY) { console.log('API 키가 없습니다. 먼저 $env:GOOGLE_TTS_KEY="키" 를 입력하세요.'); process.exit(1); }
async function make(text, voice) {
  const r = await fetch("https://texttospeech.googleapis.com/v1/text:synthesize?key=" + encodeURIComponent(KEY), {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ input: { text }, voice: { languageCode: "en-US", name: voice }, audioConfig: { audioEncoding: "MP3" } })
  });
  const j = await r.json();
  if (!r.ok) throw new Error((j.error && j.error.message) || ("HTTP " + r.status));
  return Buffer.from(j.audioContent, "base64");
}
(async () => {
  fs.mkdirSync(path.join(root, "audio"), { recursive: true });
  for (let i = 0; i < todo.length; i++) {
    const j = todo[i];
    try { fs.writeFileSync(path.join(root, j.file), await make(j.text, j.voice)); console.log((i + 1) + "/" + todo.length, j.file); }
    catch (e) { console.log("실패:", j.file, "-", e.message); }
    await new Promise(r => setTimeout(r, 250));
  }
  console.log("완료. 이어서 node tools/make-precache.js 를 실행하세요.");
})();
