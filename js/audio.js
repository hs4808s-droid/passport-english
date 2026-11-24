/* ---------- 효과음 ---------- */
let AC = null;
function sfx(kind) {
  try {
    AC = AC || new (window.AudioContext || window.webkitAudioContext)();
    const t = AC.currentTime, N = kind === "ok" ? [523, 659, 784] : kind === "no" ? [233, 196] : [659, 784, 1047, 1319];
    N.forEach((f, i) => {
      const o = AC.createOscillator(), g = AC.createGain(); o.type = "sine"; o.frequency.value = f;
      g.gain.setValueAtTime(0, t + i * .09); g.gain.linearRampToValueAtTime(.11, t + i * .09 + .02); g.gain.exponentialRampToValueAtTime(.001, t + i * .09 + .26);
      o.connect(g); g.connect(AC.destination); o.start(t + i * .09); o.stop(t + i * .09 + .3);
    });
  } catch (e) {}
}

/* ---------- 소리 내기와 듣기 ---------- */
const caps = { tts: null, dict: null };
const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
let nativeBlocked = false, recBlocked = !(navigator.mediaDevices && window.MediaRecorder);
let dictCb = null, curRec = null, runTok = 0;
if (window.claude && typeof claude.use === "function") {
  claude.use("tts").then(t => { caps.tts = t; if (view.name === "settings") render(); }).catch(() => {});
  claude.use("dictation").then(d => {
    if (!d) return;
    caps.dict = d;
    d.onFinal(({ text }) => { if (dictCb) { const c = dictCb; dictCb = null; d.stop().catch(() => {}); c(text || ""); } });
    d.onState(({ state }) => { if (state === "idle" && dictCb) { const c = dictCb; dictCb = null; c(""); } });
    if (view.name !== "done") render();
  }).catch(() => {});
}
let curAudio = null, curRes = null, lastSound = "아직 시험 전";
function playClip(text, rate) {
  return new Promise(res => {
    const src = AUDIO[text]; if (!src) { res(false); return; }
    try {
      const a = new Audio(src); curAudio = a;
      a.playbackRate = rate; try { a.preservesPitch = true; } catch (e) {}
      let done = false; const fin = ok => { if (!done) { done = true; if (curRes === fin) curRes = null; res(ok); } };
      curRes = () => fin(true);
      a.onended = () => fin(true); a.onerror = () => fin(false);
      const p = a.play(); if (p && p.catch) p.catch(() => fin(false));
    } catch (e) { res(false); }
  });
}
function stopSound() {
  try { if (curAudio) curAudio.pause(); } catch (e) {}
  if (curRes) { const r = curRes; curRes = null; r(); }
  try { if (caps.tts) caps.tts.stop(); } catch (e) {}
  try { if (window.speechSynthesis) speechSynthesis.cancel(); } catch (e) {}
}
function speak(text, rate) {
  rate = rate || st.rate;
  if (typeof cmPause === "function") cmPause();   // 출근 준비 모드가 재생 중이면 멈춘다
  stopSound();
  return new Promise(res => {
    const synth = () => {
      if (!window.speechSynthesis) { lastSound = "소리를 낼 수 없었습니다"; res(); return; }
      let done = false; const fin = () => { if (!done) { done = true; res(); } };
      try {
        speechSynthesis.cancel();
        const u = new SpeechSynthesisUtterance(text);
        u.lang = "en-US"; u.rate = rate; u.onend = fin; u.onerror = fin;
        speechSynthesis.speak(u);
        lastSound = "기기 읽어주기로 재생";
        setTimeout(fin, 2000 + text.length * 110 / rate);
      } catch (e) { fin(); }
    };
    const clip = () => playClip(text, rate).then(ok => { if (ok) { lastSound = "재생 성공 (Google 음성)"; res(); } else synth(); });
    if (caps.tts) { caps.tts.speak(text, { rate: Math.max(.7, Math.min(1.5, rate)), language: "en" }).then(() => { lastSound = "재생 성공 (Claude 음성)"; res(); }, clip); return; }
    clip();
  });
}
const wait = ms => new Promise(r => setTimeout(r, ms));
const checkMode = () => (caps.dict || (SR && !nativeBlocked)) ? "auto" : "self";
function startListen(cb) {          // cb(text) · cb("") 못 들음 · cb(null) 이 기기에서 인식 불가
  if (caps.dict) {
    dictCb = cb;
    caps.dict.start().catch(e => {
      const code = (e && e.code) || String(e);
      if (code === "not_granted") caps.dict = null;
      if (dictCb) { dictCb = null; cb(code === "dismissed" ? "" : null); }
    });
    return;
  }
  if (SR && !nativeBlocked) {
    let got = false; const once = v => { if (!got) { got = true; cb(v); } };
    try {
      const r = new SR(); curRec = r;
      r.lang = "en-US"; r.interimResults = false; r.maxAlternatives = 1;
      r.onresult = e => once(e.results[0][0].transcript);
      r.onerror = e => { if (e.error === "not-allowed" || e.error === "service-not-allowed") { nativeBlocked = true; once(null); } else once(""); };
      r.onend = () => once("");
      r.start();
    } catch (e) { nativeBlocked = true; once(null); }
    return;
  }
  cb(null);
}
function stopListen() {
  dictCb = null;
  try { if (caps.dict) caps.dict.stop().catch(() => {}); } catch (e) {}
  try { if (curRec) curRec.abort(); } catch (e) {}
  curRec = null;
}
/* 내 목소리 녹음 (되는 기기에서만) */
let mr = null, recUrl = null;
async function recStart() {
  if (recBlocked) return false;
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const chunks = []; mr = new MediaRecorder(stream);
    mr.ondataavailable = e => chunks.push(e.data);
    mr.onstop = () => { stream.getTracks().forEach(t => t.stop()); recUrl = URL.createObjectURL(new Blob(chunks, { type: mr.mimeType })); mr = null; render(); };
    mr.start(); return true;
  } catch (e) { recBlocked = true; mr = null; return false; }
}
function recStop() { try { if (mr && mr.state !== "inactive") mr.stop(); } catch (e) {} }
function playMine() { if (recUrl) { try { new Audio(recUrl).play().catch(() => {}); } catch (e) {} } }

