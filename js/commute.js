/* ---------- 출근 준비 모드 ----------
   버튼을 누르지 않아도 계속 흘러가는 듣기·따라 말하기.
   한 문장을 [원어민] → 쉼 → [원어민] → 쉼 으로 이어 붙인 mp3(loops/)를 그냥 재생한다.
   파일은 tools/make-loops.js 가 만든다. 화면이 꺼져도 소리가 이어지도록 일반 오디오 재생을 쓴다. */
let cmIndex = null, cmAud = null, cmCur = null, cmLoop = true, cmErr = "", cmLoading = false;

async function cmOpen() {
  go("commute");
  if (cmIndex || cmLoading) return;
  cmLoading = true;
  try { const r = await fetch("loops/index.json"); cmIndex = r.ok ? await r.json() : { units: [] }; }
  catch (e) { cmIndex = { units: [], off: true }; }
  cmLoading = false;
  if (view.name === "commute") render();
}
const cmUnits = () => (cmIndex && cmIndex.units) || [];
function cmPick(id) {
  const u = cmUnits().find(x => x.id === id); if (!u) return;
  stopSound(); runTok++;
  cmErr = "";
  if (!cmAud) {
    cmAud = new Audio(); cmAud.preload = "auto";
    cmAud.addEventListener("timeupdate", cmTick);
    cmAud.addEventListener("play", cmRefresh);
    cmAud.addEventListener("pause", cmRefresh);
    cmAud.addEventListener("error", () => { cmErr = "소리 파일을 불러오지 못했어요. 인터넷 연결을 확인하세요."; cmRefresh(); });
    cmAud.addEventListener("ended", () => {
      if (cmLoop) return;                       // 반복이 켜져 있으면 loop 속성이 알아서 다시 시작한다
      const L = cmUnits(), i = L.findIndex(x => x.id === (cmCur && cmCur.id));
      if (i >= 0 && i < L.length - 1) cmPick(L[i + 1].id); else cmRefresh();
    });
  }
  cmCur = u; cmAud.loop = cmLoop; cmAud.src = u.file;
  cmMedia(u);
  const p = cmAud.play(); if (p && p.catch) p.catch(() => { cmErr = "재생이 막혔어요. 재생 버튼을 한 번 더 눌러 주세요."; cmRefresh(); });
  cmRefresh();
}
function cmToggle() {
  if (!cmAud || !cmCur) return;
  if (cmAud.paused) { cmErr = ""; const p = cmAud.play(); if (p && p.catch) p.catch(() => {}); } else cmAud.pause();
}
function cmPause() { try { if (cmAud && !cmAud.paused) cmAud.pause(); } catch (e) {} }
function cmStep(d) {
  const L = cmUnits(), i = L.findIndex(x => x.id === (cmCur && cmCur.id)), j = i + d;
  if (i >= 0 && j >= 0 && j < L.length) cmPick(L[j].id);
}
function cmRefresh() { if (view.name === "commute") render(); }
function cmMedia(u) {
  if (!("mediaSession" in navigator)) return;
  try {
    navigator.mediaSession.metadata = new MediaMetadata({ title: u.title, artist: "패스포트 영어 · 출근 준비", album: u.sub });
    navigator.mediaSession.setActionHandler("play", () => cmToggle());
    navigator.mediaSession.setActionHandler("pause", () => cmToggle());
    navigator.mediaSession.setActionHandler("previoustrack", () => cmStep(-1));
    navigator.mediaSession.setActionHandler("nexttrack", () => cmStep(1));
  } catch (e) {}
}
/* 지금 몇 번째 문장의 어느 단계인지 (듣는 중 / 따라 말할 차례) */
function cmPos() {
  if (!cmCur || !cmAud) return null;
  const t = cmAud.currentTime, C = cmCur.cues;
  let k = 0; for (let i = 0; i < C.length; i++) if (C[i].t <= t + .05) k = i;
  const c = C[k], o = t - c.t;
  const ph = o < c.d ? "listen1" : o < c.d + c.g ? "say1" : o < 2 * c.d + c.g ? "listen2" : "say2";
  return { k, c, ph, frac: cmCur.dur ? Math.min(1, t / cmCur.dur) : 0 };
}
const CM_PH = { listen1: ["듣기", "먼저 잘 들어요"], say1: ["따라 말하기", "지금 소리 내어 말해요"], listen2: ["다시 듣기", "한 번 더 들어요"], say2: ["따라 말하기", "한 번 더 말해요"] };
function cmTick() {                          // 화면 전체를 다시 그리지 않고 필요한 곳만 바꾼다
  if (view.name !== "commute") return;
  const p = cmPos(); if (!p) return;
  const it = BY_ID[p.c.id], q = id => document.getElementById(id);
  if (q("cmEn") && it) { q("cmEn").textContent = it.en; q("cmKo").textContent = it.ko; }
  const lab = CM_PH[p.ph]; if (q("cmPh")) { q("cmPh").textContent = lab[0]; q("cmPh").dataset.say = /say/.test(p.ph) ? "1" : ""; q("cmHint").textContent = lab[1]; }
  if (q("cmBar")) q("cmBar").style.width = Math.round(p.frac * 100) + "%";
  if (q("cmNo")) q("cmNo").textContent = (p.k + 1) + " / " + cmCur.cues.length;
  document.querySelectorAll("#cmList .line").forEach((el, i) => el.classList.toggle("now", i === p.k));
}
function cmMin(sec) { return Math.round(sec / 60) + "분"; }
function vCommute() {
  const L = cmUnits(), playing = cmAud && !cmAud.paused && cmCur;
  let body;
  if (!cmIndex) body = `<p class="muted">불러오는 중…</p>`;
  else if (!L.length) body = `<p class="muted">${cmIndex.off ? "인터넷이 연결되지 않아 목록을 가져오지 못했어요. 연결한 뒤 다시 열어 주세요." : "아직 이어 듣기 파일이 없어요. tools/make-loops.js 로 만들어 올리면 여기에 나타나요."}</p>`;
  else {
    const today = "day" + (st.day + 1), todayU = L.find(u => u.id === today) || L.find(u => u.id === "day" + st.day);
    const grp = (title, kind) => { const g = L.filter(u => u.kind === kind); return g.length ? `<h2>${title}</h2><div class="stack">${g.map(u => `
      <button class="btn mode ${cmCur && cmCur.id === u.id ? "sel" : ""}" data-act="cmpick" data-v="${u.id}"><span class="mi">${ic(cmCur && cmCur.id === u.id && playing ? "wave" : "play")}</span><span><b>${u.title}${todayU && todayU.id === u.id ? " · 오늘" : ""}</b><span class="d">${u.sub} · ${cmMin(u.dur)}</span></span></button>`).join("")}</div>` : ""; };
    body = grp("일차별", "day") + grp("주차 전체 복습", "week") + grp("장면별", "scene");
  }
  let now = "";
  if (cmCur) {
    const p = cmPos() || { k: 0, c: cmCur.cues[0], ph: "listen1", frac: 0 }, it = BY_ID[p.c.id], lab = CM_PH[p.ph];
    now = `<section class="card cmnow"><p class="small muted">${cmCur.title} · <span id="cmNo">${p.k + 1} / ${cmCur.cues.length}</span></p>
      <div class="cmph" id="cmPh" data-say="${/say/.test(p.ph) ? 1 : ""}">${lab[0]}</div><p class="small muted" id="cmHint">${lab[1]}</p>
      <div class="cmen" id="cmEn">${it.en}</div><div class="cmko" id="cmKo">${it.ko}</div>
      <div class="count"><i id="cmBar" style="width:${Math.round(p.frac * 100)}%;transition:none"></i></div>
      ${cmErr ? `<p class="small" style="color:var(--rose)">${cmErr}</p>` : ""}
      <div class="row"><button class="btn" data-act="cmprev" aria-label="앞 묶음">이전</button>
        <button class="btn ${playing ? "live" : "primary"}" data-act="cmtog">${playing ? "멈추기" : "계속 듣기"}</button>
        <button class="btn" data-act="cmnext" aria-label="다음 묶음">다음</button></div>
      <button class="btn ghost" data-act="cmloop">묶음 반복: ${cmLoop ? "켜짐 (끝나면 처음부터)" : "꺼짐 (끝나면 다음 묶음)"}</button>
      <div class="list" id="cmList">${cmCur.cues.map((c, i) => `<div class="line ${i === p.k ? "now" : ""}"><div class="e">${BY_ID[c.id].en}</div><div class="k">${BY_ID[c.id].ko}</div></div>`).join("")}</div></section>`;
  }
  return shell(`<h1 style="font-family:var(--f-disp);font-weight:400;font-size:28px">출근 준비 모드</h1>
    <p class="muted">원어민이 한 문장을 두 번 말해 주고, 사이마다 쉬어요. 쉬는 시간에 따라 말하세요. 쉬는 시간은 문장이 길수록 길어요.</p>
    ${now}<section class="card">${body}</section>`, "modes");
}
