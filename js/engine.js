/* ---------- 말한 문장 채점 ---------- */
const FIX = { "i'd": "i would", "i'll": "i will", "i'm": "i am", "isn't": "is not", "didn't": "did not", "it's": "it is", "wifi": "wi fi", "5": "five", "2": "two", "1": "one", "checkin": "check in", "checkout": "check out" };
function words(s) {
  return s.toLowerCase().replace(/[’`]/g, "'").replace(/-/g, " ").replace(/[^a-z0-9' ]/g, " ").split(/\s+/).filter(Boolean)
    .map(w => FIX[w] || w).join(" ").split(" ").filter(Boolean);
}
function score(target, heard) {
  const t = words(target), h = words(heard || ""); let hit = 0;
  t.forEach(w => { const i = h.indexOf(w); if (i >= 0) { hit++; h.splice(i, 1); } });
  return t.length ? hit / t.length : 0;
}
function hintFor(en) {
  if (st.level === 3) return "";
  const w = en.split(" ");
  if (st.level === 2) return w.slice(0, 2).join(" ") + " …";
  return w.map(x => x[0] + x.slice(1).replace(/[A-Za-z]/g, "_")).join(" ");
}
const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

/* ---------- 성취: 스탬프, 배지, 레벨 ---------- */
function stats() {
  const ids = Object.keys(st.cards);
  return { learned: ids.length, fast: ids.filter(i => st.cards[i].fast).length, total: ITEMS.length };
}
const sceneDone = sc => sc.items.every(i => st.cards[i.id]);
function achievements() {
  const s = stats(), A = [];
  SCENES.forEach(sc => A.push({ id: "st_" + sc.id, kind: "stamp", name: sc.title + " 스탬프", desc: sc.title + " 문장 " + sc.items.length + "개를 모두 배웠어요", ok: sceneDone(sc), ic: "plane" }));
  A.push(
    { id: "b_first", kind: "badge", name: "첫 비행", desc: "1일차를 마쳤어요", ok: st.day >= 1, ic: "plane" },
    { id: "b_s3", kind: "badge", name: "3일 연속", desc: "3일 연속으로 공부했어요", ok: (st.best || 0) >= 3, ic: "flame" },
    { id: "b_f10", kind: "badge", name: "10초 챌린저", desc: "10초 안에 말한 문장 10개", ok: s.fast >= 10, ic: "bolt" },
    { id: "b_week", kind: "badge", name: "한 주 완주", desc: "7일차까지 마쳤어요", ok: st.day >= 7, ic: "star" },
    { id: "b_s7", kind: "badge", name: "7일 연속", desc: "7일 연속으로 공부했어요", ok: (st.best || 0) >= 7, ic: "flame" },
    { id: "b_goal", kind: "badge", name: "목표 달성", desc: "30문장을 모두 10초 안에", ok: s.total > 0 && s.fast >= s.total, ic: "star" }
  );
  return A;
}
const lvInfo = () => { const x = st.xp || 0, lv = Math.floor(x / 100) + 1; return { lv, into: x % 100, name: RANKS[Math.min(lv - 1, RANKS.length - 1)] }; };
const STAMP_ROT = { air: -8, food: 6, hotel: -4 };
function stampHTML(sc) {
  const on = sceneDone(sc), n = sc.items.filter(i => st.cards[i.id]).length;
  return `<div class="stamp s-${sc.id} ${on ? "on" : ""}"><div class="ring" style="--rot:${STAMP_ROT[sc.id] || -6}deg">${on ? ic("plane") : ic("lock")}<b>${sc.code}</b><small>${on ? "도착 완료" : n + "/" + sc.items.length}</small></div><span class="nm">${sc.title}</span></div>`;
}

/* ---------- 일차 계획 ---------- */
function dayPlan(D) {
  const w = (D - 1) % WEEK + 1, W = Math.ceil(D / WEEK);
  const learnIdx = d => (Math.ceil(d / WEEK) - 1) * (WEEK - 1) + ((d - 1) % WEEK);   // d일차가 몇 번째 학습일인지(0부터)
  const newOf = d => ITEMS.slice(learnIdx(d) * PER_DAY, learnIdx(d) * PER_DAY + PER_DAY);
  if (w === WEEK) {
    let rev = []; for (let d = D - WEEK + 1; d < D; d++) rev = rev.concat(newOf(d));
    return { D, W, w, weekly: true, review: rev, fresh: [] };
  }
  const prev = (D > 1 && (D - 1) % WEEK !== 0) ? newOf(D - 1) : [];
  return { D, W, w, weekly: false, review: prev, fresh: newOf(D) };
}
const nextDay = () => dayPlan(st.day + 1);
let S = null;      // 진행 중인 학습
function startSession(replay) {
  const P = replay ? { D: st.day, replay: true, weekly: false, review: ITEMS.filter(it => st.cards[it.id]), fresh: [] } : nextDay();
  const q = [];
  P.review.forEach(it => q.push({ type: "review", id: it.id }));
  P.fresh.forEach(it => { q.push({ type: "listen", id: it.id }); q.push({ type: "repeat", id: it.id }); });
  P.fresh.forEach(it => q.push({ type: "recall", id: it.id }));
  if (!q.length) return;
  S = { P, q, i: 0, nrev: P.review.length, fresh: P.fresh.length, retried: {}, pass: 0, fast: 0, xp: 0, before: new Set(achievements().filter(a => a.ok).map(a => a.id)) };
  step = { phase: "idle", heard: null, sc: null, pass: null, t0: Date.now(), sec: null, show: false };
  go("session"); enterStep(true);
}
let step = null, tick = null;
function enterStep(fromClick) {
  stopSound(); stopListen(); clearInterval(tick); recUrl = null;
  const cur = S.q[S.i];
  step = { phase: "idle", heard: null, sc: null, pass: null, t0: Date.now(), sec: null, show: false };
  render();
  const it = BY_ID[cur.id];
  if (cur.type !== "recall" && fromClick) speak(it.en);
  if (cur.type === "recall") {
    tick = setInterval(() => {
      const el = document.getElementById("timer"); if (!el || step.sec !== null) return;
      const s = (Date.now() - step.t0) / 1000; el.textContent = s.toFixed(1) + "초"; el.classList.toggle("over", s > GOAL_SEC);
    }, 100);
  }
}
function grade(id, pass, sec) {
  const c = st.cards[id] || {};
  c.seen = true; if (pass && sec !== null && sec <= GOAL_SEC) c.fast = true;
  st.cards[id] = c; store.save();
}
function gainFor(cur, pass, sec) {
  if (cur.type === "review") return 2;
  if (cur.type === "listen") return 3;
  if (cur.type === "repeat") return 5;
  return pass ? 10 + (sec !== null && sec <= GOAL_SEC ? 5 : 0) : 0;
}
function nextStep() {
  const cur = S.q[S.i];
  if (cur.type === "recall" && step.pass !== null) {
    grade(cur.id, step.pass, step.sec);
    if (step.pass) { S.pass++; if (step.sec <= GOAL_SEC) S.fast++; }
    else if (!S.retried[cur.id]) { S.retried[cur.id] = 1; S.q.push({ type: "recall", id: cur.id, review: cur.review, again: true }); }
  }
  S.xp += gainFor(cur, step.pass, step.sec);
  S.i++;
  if (S.i >= S.q.length) return finish();
  enterStep(true);
}
function finish() {
  clearInterval(tick); stopSound();
  if (!S.P.replay) { st.day = S.P.D; S.xp += 20; }
  st.xp = (st.xp || 0) + S.xp;
  const t = today();
  if (st.last !== t) { st.streak = (st.last === plus(-1)) ? st.streak + 1 : 1; st.last = t; }
  st.best = Math.max(st.best || 0, st.streak);
  S.newAch = achievements().filter(a => a.ok && !S.before.has(a.id));
  store.save(); go("done"); sfx("win");
}
function onSpeak() {           // 말하기 시작 버튼
  const cur = S.q[S.i], it = BY_ID[cur.id];
  stopSound();
  if (checkMode() === "auto") {
    step.phase = "listening"; render();
    startListen(text => {
      recStop();
      if (text === null) { step.phase = "idle"; render(); return; }      // 인식 불가 → 스스로 판단 방식으로
      step.sec = (Date.now() - step.t0) / 1000;
      step.heard = text; step.sc = score(it.en, text); step.pass = step.sc >= .8; step.phase = "result"; step.show = true;
      render(); sfx(step.pass ? "ok" : "no");
      if (cur.type === "recall") setTimeout(() => speak(it.en), 450);
    });
    if (st.rec) recStart();
  } else {
    recStart().then(ok => { if (ok) { step.phase = "recording"; render(); } else selfDone(); });
  }
}
function selfDone() {          // 스스로 판단 방식: 말을 마쳤다
  const cur = S.q[S.i], it = BY_ID[cur.id];
  recStop();
  step.sec = (Date.now() - step.t0) / 1000; step.phase = "result"; step.show = true; render();
  if (cur.type === "recall") speak(it.en);
}

