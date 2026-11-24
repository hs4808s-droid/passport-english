/* ---------- 화면 ---------- */
let view = { name: "home" };
function go(name, extra) { runTok++; stopSound(); view = Object.assign({ name }, extra || {}); render(); window.scrollTo(0, 0); }
const $app = document.getElementById("app");
function tabbar(cur) {
  const T = [["home", "홈", "home"], ["modes", "연습", "mic"], ["record", "기록", "star"], ["settings", "설정", "sliders"]];
  return `<nav class="tabbar" aria-label="메뉴"><div class="in">${T.map(([k, l, i]) => `<button data-act="tab" data-v="${k}" aria-current="${k === cur}">${ic(i)}${l}</button>`).join("")}</div></nav>`;
}
function topbar() {
  return `<header class="top"><div class="logo"><i>${ic("plane")}</i>패스포트 영어</div>
    <div class="chips"><div class="chip flame" aria-label="연속 ${curStreak()}일">${ic("flame")}${curStreak()}</div><div class="chip xp" aria-label="경험치 ${st.xp || 0}">${ic("bolt")}${st.xp || 0}</div></div></header>`;
}
const shell = (inner, tab) => `<main class="page">${tab ? topbar() : ""}${inner}</main>${tab ? tabbar(tab) : ""}`;
function routeHTML(D) {
  const W = Math.ceil(D / WEEK), s0 = (W - 1) * WEEK + 1;
  return `<div class="route2" aria-label="${W}주차 진행">${Array.from({ length: WEEK }, (_, k) => {
    const d = s0 + k, cls = d <= st.day ? "done" : (d === D ? "now" : "");
    return `<div class="stop ${cls}"><b>${d <= st.day ? ic("check") : (d === D ? ic("plane") : "")}</b>${k === WEEK - 1 ? "복습" : d + "일"}</div>`; }).join("")}</div>`;
}
function vHome() {
  const P = nextDay(), s = stats();
  const empty = !P.review.length && !P.fresh.length;
  const min = Math.max(1, Math.round((P.review.length * 8 + P.fresh.length * 55) / 60));
  let title, sub, btn;
  if (empty) { title = "다음 여행 준비 중"; sub = "일상 대화 묶음을 만들고 있어요. 그동안 배운 문장을 다시 들어 보세요."; btn = `<button class="btn white big" data-act="replay">${ic("speaker")}배운 문장 다시 듣기</button>`; }
  else if (P.weekly) { title = `${P.W}주차 마무리 복습`; sub = `이번 주 ${P.review.length}문장을 듣고 넘겨요 · 약 ${min}분`; btn = `<button class="btn white big" data-act="start">복습 출발하기</button>`; }
  else { title = `${P.D}일차`; sub = (P.review.length ? `어제 문장 ${P.review.length}개 복습 → ` : "") + `새 문장 ${P.fresh.length}개 · 약 ${min}분`; btn = `<button class="btn white big" data-act="start">${P.D}일차 시작하기</button>`; }
  const L = lvInfo(), ratio = s.total ? s.fast / s.total : 0, C = 2 * Math.PI * 34;
  return shell(`
  <section class="hero">
    <span class="tag">${empty ? "여행 완료" : P.W + "주차 · " + (st.last === today() ? "오늘 학습 완료" : "오늘의 비행")}</span>
    <h1>${title}</h1>
    ${empty ? "" : routeHTML(P.D)}
    <p class="sub">${sub}</p>
    ${btn}
  </section>
  <section class="card goal">
    <div class="ringbox"><svg viewBox="0 0 84 84" aria-hidden="true"><circle cx="42" cy="42" r="34" fill="none" stroke="var(--line)" stroke-width="10"/><circle cx="42" cy="42" r="34" fill="none" stroke="var(--gold)" stroke-width="10" stroke-linecap="round" stroke-dasharray="${C.toFixed(1)}" stroke-dashoffset="${(C * (1 - ratio)).toFixed(1)}"/></svg><div class="t"><div>${s.fast}<small>/ ${s.total}</small></div></div></div>
    <div><h2>${GOAL_SEC}초 챌린지</h2><p class="small muted">한국어만 보고 ${GOAL_SEC}초 안에 영어로 말한 문장이에요. ${s.total - s.fast}문장 남았어요.</p></div>
  </section>
  <section class="card"><h2>여권 스탬프</h2>
    <div class="stamps">${SCENES.map(stampHTML).join("")}</div>
  </section>
  <section class="card lvl"><div class="n"><div>${L.lv}<small>LV</small></div></div>
    <div style="flex:1;display:flex;flex-direction:column;gap:6px"><b>${L.name}</b><div class="bar gold"><i style="width:${L.into}%"></i></div><span class="small muted">다음 레벨까지 ${100 - L.into} XP</span></div>
  </section>`, "home");
}
function vRecord() {
  const s = stats(), A = achievements(), badges = A.filter(a => a.kind === "badge"), L = lvInfo();
  return shell(`
  <section class="tiles">
    <div class="tile"><b>${st.day}</b><span>마친 일차</span></div>
    <div class="tile"><b>${st.best || 0}</b><span>최고 연속일</span></div>
    <div class="tile"><b>${s.learned}</b><span>배운 문장</span></div>
  </section>
  <section class="card lvl"><div class="n"><div>${L.lv}<small>LV</small></div></div>
    <div style="flex:1;display:flex;flex-direction:column;gap:6px"><b>${L.name}</b><div class="bar gold"><i style="width:${L.into}%"></i></div><span class="small muted">총 ${st.xp || 0} XP · 다음 레벨까지 ${100 - L.into} XP</span></div>
  </section>
  <section class="card"><h2>여권 스탬프</h2><div class="stamps">${SCENES.map(stampHTML).join("")}</div></section>
  <section class="card"><h2>배지</h2>
    <div class="badges">${badges.map(b => `<div class="badge ${b.ok ? "on" : ""}"><div class="medal">${ic(b.ok ? b.ic : "lock")}</div>${b.name}<small>${b.desc}</small></div>`).join("")}</div>
  </section>
  <section class="card"><h2>4주 목표</h2>
    <div class="bar"><i style="width:${Math.round(s.fast / s.total * 100)}%"></i></div>
    <p class="small muted">한국어만 보고 ${GOAL_SEC}초 안에 말하는 문장 ${s.fast}/${s.total}</p></section>`, "record");
}
function sceneButtons(act) {
  return `<div class="stack">${SCENES.map(s => `<button class="btn mode" data-act="${act}" data-v="${s.id}"><span class="mi">${ic("plane")}</span><span><b>${s.title}</b><span class="d">${s.sit}</span></span></button>`).join("")}</div>`;
}
function vModes() {
  if (view.pick) {
    const L = { role: "상황극", shadow: "쉐도잉", listen: "듣기" }[view.pick];
    return shell(`<section class="card"><h1>${L}</h1><p class="muted">어느 장면으로 할까요?</p>${sceneButtons("scene")}<button class="btn ghost" data-act="tab" data-v="modes">뒤로</button></section>`, "modes");
  }
  return shell(`
  <section class="stack">
    <h1 style="font-family:var(--f-disp);font-weight:400;font-size:28px">연습 방법 고르기</h1>
    <button class="btn mode" data-act="start"><span class="mi">${ic("plane")}</span><span><b>오늘의 학습</b><span class="d">복습 → 듣기 → 따라 말하기 → 영어로 말하기</span></span></button>
    <button class="btn mode" data-act="pick" data-v="role"><span class="mi">${ic("chat")}</span><span><b>상황극</b><span class="d">앱이 직원, 내가 손님이 되어 대화해요</span></span></button>
    <button class="btn mode" data-act="pick" data-v="shadow"><span class="mi">${ic("wave")}</span><span><b>쉐도잉</b><span class="d">음성을 듣고 바로 따라 말해요</span></span></button>
    <button class="btn mode" data-act="pick" data-v="listen"><span class="mi">${ic("headset")}</span><span><b>듣기</b><span class="d">소리 내지 않고 듣기만 해요. 이동 중에 좋아요</span></span></button>
    <button class="btn mode" data-act="commute"><span class="mi">${ic("headset")}</span><span><b>출근 준비 모드</b><span class="d">버튼 없이 계속 들려줘요. 한 문장을 두 번, 쉬는 시간마다 따라 말해요</span></span></button>
    <button class="btn mode" disabled><span class="mi">${ic("lock")}</span><span><b>AI와 자유 대화</b><span class="d">곧 추가돼요</span></span></button>
  </section>`, "modes");
}
function vSettings() {
  const chk = checkMode() === "auto" ? "음성 인식으로 자동 확인" : "스스로 판단 (이 화면에서는 음성 인식을 쓸 수 없어요)";
  return shell(`
  <h1 style="font-family:var(--f-disp);font-weight:400;font-size:28px">설정</h1>
  <section class="card"><h2>힌트 단계</h2>
    <div class="stack">${LEVELS.map(l => `<button class="btn mode ${st.level === l.n ? "sel" : ""}" data-act="level" data-v="${l.n}"><span class="mi">${st.level === l.n ? ic("check") : l.n}</span><span><b>${l.name}</b><span class="d">${l.desc}</span></span></button>`).join("")}</div>
    <button class="btn" data-act="test">30초 수준 테스트로 정하기</button>
  </section>
  <section class="card"><h2>소리</h2>
    <p>말하는 속도</p>
    <div class="row">${[[.8, "천천히"], [1, "보통"]].map(([r, l]) => `<button class="btn ${st.rate === r ? "primary" : ""}" data-act="rate" data-v="${r}">${l}</button>`).join("")}</div>
    <button class="btn" data-act="sound">${ic("speaker")}소리 시험 듣기</button>
    <p class="small muted">${lastSound}. 소리가 안 나면 휴대폰이 무음 모드인지, 볼륨이 켜져 있는지 확인하세요.</p>
    <p class="small muted">말하기 확인: ${chk}</p>
    ${recBlocked ? `<p class="small muted">내 녹음 듣기: 이 화면에서는 쓸 수 없어요</p>` : `<button class="btn" data-act="rec">내 녹음 다시 듣기: ${st.rec ? "켜짐" : "꺼짐"} (시험 기능)</button>`}
  </section>
  ${cloud.html()}
  <section class="card"><h2>앱으로 설치</h2>${installHTML()}</section>
  <section class="card"><h2>기록</h2>
    <p class="small muted">${cloud.isIn() ? "기록은 이 기기와 로그인한 계정에 저장돼요. 지우면 로그인한 모든 기기에서 지워져요." : "기록은 이 기기에만 저장돼요. 로그인하면 계정에도 저장할 수 있어요."}</p>
    <button class="btn" data-act="reset">기록 지우고 처음부터</button>
    ${view.ask ? `<div class="row"><button class="btn rose" data-act="reset2">정말 지우기</button><button class="btn" data-act="tab" data-v="settings">취소</button></div>` : ""}
  </section>`, "settings");
}
const TEST = [
  { ko: "물 좀 주시겠어요?" }, { ko: "탑승은 몇 시에 시작해요?" }, { ko: "이건 제가 주문한 게 아니에요." }
];
function vTest() {
  if (view.i >= TEST.length) {
    const rec = view.sum <= 2 ? 1 : (view.sum <= 4 ? 2 : 3);
    return shell(`<section class="card"><h1>추천은 ${LEVELS[rec - 1].name}</h1><p class="muted">${LEVELS[rec - 1].desc}</p>
      <button class="btn primary big" data-act="level" data-v="${rec}" data-home="1">${LEVELS[rec - 1].name}로 시작하기</button>
      <p class="small muted">다른 단계를 고를 수도 있어요.</p>
      <div class="row">${LEVELS.filter(l => l.n !== rec).map(l => `<button class="btn" data-act="level" data-v="${l.n}" data-home="1">${l.name}</button>`).join("")}</div></section>`);
  }
  return shell(`<div class="sbar"><button class="iconbtn" data-act="tab" data-v="home" aria-label="그만두기">${ic("x")}</button><div class="bar prog"><i style="width:${Math.round(view.i / TEST.length * 100)}%"></i></div></div>
    <section class="card"><p class="small muted">수준 테스트 ${view.i + 1}/${TEST.length}</p>
    <h2>이 말을 영어로 할 수 있나요?</h2><p class="ko q">${TEST[view.i].ko}</p>
    <div class="stack"><button class="btn" data-act="ans" data-v="2">바로 말할 수 있어요</button><button class="btn" data-act="ans" data-v="1">시간이 걸려요</button><button class="btn" data-act="ans" data-v="0">안 나와요</button></div></section>`);
}
function micArea(type) {
  const mode = checkMode();
  if (step.phase === "listening") return `<div class="micwrap"><button class="mic live" data-act="cancelListen" aria-label="듣는 중. 누르면 취소">${ic("mic")}</button><p class="miclabel">듣고 있어요… 누르면 취소</p></div>`;
  if (step.phase === "recording") return `<div class="micwrap"><button class="mic live" data-act="selfDone" aria-label="녹음 중. 끝나면 누르세요">${ic("mic")}</button><p class="miclabel">녹음 중 · 말이 끝나면 누르세요</p></div>`;
  if (step.phase === "idle") {
    if (mode === "auto") return `<div class="micwrap"><button class="mic" data-act="speak" aria-label="말하기 시작">${ic("mic")}</button><p class="miclabel">눌러서 말하기</p></div>`;
    if (!recBlocked) return `<div class="micwrap"><button class="mic" data-act="speak" aria-label="녹음하며 말하기">${ic("mic")}</button><p class="miclabel">눌러서 녹음하며 말하기</p><button class="btn ghost" data-act="selfDone">녹음 없이 말했어요</button></div>`;
    return `<div class="micwrap"><p class="miclabel">소리 내어 말해 보세요</p><button class="btn primary big" style="width:100%" data-act="selfDone">${type === "recall" ? "말했어요 (정답 보기)" : "따라 말했어요"}</button></div>`;
  }
  return "";
}
function passCard(it, inner) {
  return `<section class="pass"><div class="ptop"><span class="rt">${ic("plane")}${it.scene.code}</span><span>${it.scene.title} · ${pad(it.no)}/${pad(it.scene.items.length)}</span></div><div class="perf"></div><div class="pbody">${inner}</div></section>`;
}
const spk = () => `<button class="spk" data-act="play" aria-label="원어민 소리 듣기">${ic("speaker")}</button>`;
function tipBox(it) {
  return `<div class="tip">${ic("bulb")}<div><b>원어민 팁</b>${it.tip}${it.alt ? `<div class="alt">이렇게도 말해요 · ${it.alt}</div>` : ""}</div></div>`;
}
function sheet(cur, it) {
  if (step.phase !== "result") return "";
  const auto = step.heard !== null, isRecall = cur.type === "recall";
  let cls, title, icn;
  if (auto) {
    if (step.pass) { cls = "good"; title = "정확해요!"; icn = "check"; }
    else if (step.sc >= .5) { cls = "mid"; title = "거의 맞았어요"; icn = "star"; }
    else { cls = "bad"; title = "다시 도전해요"; icn = "x"; }
  } else { cls = "neutral"; title = isRecall ? "정답을 확인하세요" : "잘했어요!"; icn = isRecall ? "bulb" : "check"; }
  const gain = auto ? gainFor(cur, step.pass, step.sec) : (isRecall ? 0 : gainFor(cur, true, null));
  let h = `<div class="sheet ${cls}" role="status"><div class="in"><h3>${ic(icn)}${title}</h3>`;
  if (auto) h += `<div class="heard"><small>들린 말</small>${step.heard ? esc(step.heard) : "(아무 말도 듣지 못했어요)"}</div>`;
  h += `<div class="meta">`;
  if (isRecall) h += `<span>${step.sec.toFixed(1)}초 ${step.sec <= GOAL_SEC ? "· 목표 안!" : "· 목표 " + GOAL_SEC + "초 넘음"}</span>`;
  if (gain) h += `<span class="gain">${ic("bolt")}+${gain} XP</span>`;
  h += `</div>`;
  if (isRecall && (!auto || !step.pass)) h += tipBox(it);
  h += `<div class="row"><button class="btn" data-act="play">${ic("speaker")}원어민 듣기</button>${recUrl ? `<button class="btn" data-act="mine">내 녹음 듣기</button>` : ""}</div>`;
  const nb = auto ? (step.pass ? "mint" : cls === "mid" ? "gold" : "rose") : "primary";
  if (isRecall) {
    if (auto) {
      h += `<button class="btn ${nb} big" data-act="next">계속하기</button>`;
      if (!step.pass) h += `<button class="btn ghost" data-act="override">맞게 말했는데 인식이 틀렸어요</button>`;
    } else {
      h += `<p><b>맞게 말했나요?</b></p><div class="row"><button class="btn mint" data-act="self" data-v="1">맞게 말했어요</button><button class="btn" data-act="self" data-v="0">막혔어요</button></div>`;
    }
  } else {
    h += `<div class="row"><button class="btn" data-act="retry">한 번 더</button><button class="btn ${nb} big" data-act="next">계속하기</button></div>`;
  }
  return h + `</div></div>`;
}
function vSession() {
  const cur = S.q[S.i], it = BY_ID[cur.id];
  const pct = Math.round(S.i / S.q.length * 100);
  const head = `<div class="sbar"><button class="iconbtn" data-act="quit" aria-label="그만하고 홈으로">${ic("x")}</button><div class="bar prog" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${pct}"><i style="width:${Math.max(pct, 3)}%"></i></div><div class="chip xp">${ic("bolt")}${S.xp}</div></div>`;
  let label, body = "", dock = "";
  if (cur.type === "review") {
    const k = S.q.slice(0, S.i + 1).filter(x => x.type === "review").length;
    const last = S.i + 1 >= S.q.length || S.q[S.i + 1].type !== "review";
    label = (S.P.replay ? "다시 듣기" : (S.P.weekly ? `${S.P.W}주차 마무리 복습` : "어제 문장 복습")) + ` ${k}/${S.nrev}`;
    body = passCard(it, `${spk()}<p class="en">${it.en}</p><p class="ko">${it.ko}</p>`);
    dock = `<div class="row"><button class="btn" data-act="play">다시 듣기</button><button class="btn" data-act="slow">천천히</button></div>
      <button class="btn primary big" data-act="next">${last ? (S.fresh ? "새 문장 시작" : "마치기") : "다음 문장"}</button>`;
  } else if (cur.type === "listen") {
    label = "새 문장 듣기";
    body = passCard(it, `${spk()}<p class="en">${it.en}</p><p class="ko">${it.ko}</p>`) + tipBox(it);
    dock = `<div class="row"><button class="btn" data-act="play">다시 듣기</button><button class="btn" data-act="slow">천천히</button></div>
      <button class="btn primary big" data-act="next">따라 말하기</button>`;
  } else if (cur.type === "repeat") {
    label = "따라 말하기";
    body = passCard(it, `${spk()}<p class="en">${it.en}</p><p class="ko">${it.ko}</p>`) + micArea("repeat");
  } else {
    const hint = hintFor(it.en);
    label = cur.again ? "한 번 더 도전" : (cur.review ? "복습" : "영어로 말하기");
    body = passCard(it, `<p class="ko q">${it.ko}</p>
        ${step.show ? `<p class="en" style="padding-right:0">${it.en}</p>` : (hint ? `<p class="hint">${hint}</p>` : "")}
        ${step.sec === null ? `<div class="timer" id="timer">0.0초</div>` : ""}`) + micArea("recall");
  }
  return `<main class="page">${head}<p class="steplabel"><b>${label}</b></p>${body}</main>${dock && step.phase === "idle" || cur.type === "review" || cur.type === "listen" ? `<div class="dock"><div class="in">${dock}</div></div>` : ""}${sheet(cur, it)}`;
}
function vDone() {
  const N = nextDay(), P = S.P;
  const head = P.replay ? "다시 듣기 끝!" : (P.weekly ? `${P.W}주차 완주!` : `${P.D}일차 완료!`);
  const next = (!N.review.length && !N.fresh.length) ? "다음 여행(일상 대화)은 준비 중이에요."
    : (N.weekly ? `다음은 ${N.W}주차 마무리 복습이에요.` : `다음은 ${N.D}일차예요.${N.review.length ? " 오늘 문장 복습으로 시작해요." : ""}`);
  const stampTxt = P.replay ? ["REPLAY", ic("speaker"), "다시 듣기"] : (P.weekly ? ["WEEK", P.W, "완주"] : ["DAY", P.D, "도착"]);
  return `<main class="page"><section class="done">
    <div class="bigstamp"><small>${stampTxt[0]}</small><b>${stampTxt[1]}</b><span>${stampTxt[2]}</span></div>
    <h1>${head}</h1>
    <p class="muted">${st.streak}일 연속으로 공부하고 있어요</p>
    <div class="tiles" style="width:100%">
      <div class="tile"><b id="xpn">+${S.xp}</b><span>얻은 XP</span></div>
      <div class="tile"><b>${S.nrev}</b><span>복습</span></div>
      <div class="tile"><b>${S.fresh}</b><span>새 문장</span></div>
    </div>
    ${S.fresh ? `<p class="muted"><b>${S.fast}/${S.fresh}</b> 문장을 ${GOAL_SEC}초 안에 말했어요</p>` : ""}
    ${S.newAch && S.newAch.length ? `<div class="newach">${S.newAch.map(a => `<div class="ach"><div class="medal">${ic(a.ic)}</div><div>${a.kind === "stamp" ? "새 스탬프" : "새 배지"} · ${a.name}<small>${a.desc}</small></div></div>`).join("")}</div>` : ""}
    <p class="small muted">${next}</p>
    <button class="btn primary big" style="width:100%" data-act="tab" data-v="home">홈으로</button>
  </section></main>`;
}
/* 상황극 */
function vRole() {
  const sc = view.scene, d = sc.dialog, i = view.i;
  const bar = `<div class="sbar"><button class="iconbtn" data-act="tab" data-v="modes" aria-label="그만하기">${ic("x")}</button><div class="bar prog"><i style="width:${Math.max(3, Math.round(i / d.length * 100))}%"></i></div></div>`;
  if (i >= d.length) {
    return shell(`${bar}<section class="card"><p class="small muted">상황극 · ${sc.title}</p>
      <div class="bubble"><span class="who">직원</span><div class="t"><p class="en">${sc.end.s}</p><p class="small muted">${sc.end.sk}</p></div></div>
      <h1>대화를 끝냈어요!</h1>
      <div class="row"><button class="btn" data-act="scene" data-v="${sc.id}">다시 하기</button><button class="btn primary" data-act="tab" data-v="modes">연습으로</button></div></section>`);
  }
  const t = d[i], it = BY_ID[t.u];
  return shell(`${bar}<p class="steplabel"><b>상황극 · ${sc.title} ${i + 1}/${d.length}</b></p>
    <section class="stack">
      <div class="bubble"><span class="who">직원</span><div class="t"><p class="en">${t.s}</p><p class="small muted">${t.sk}</p></div></div>
      <div class="bubble me"><span class="who">나</span><div class="t"><p class="ko q" style="font-size:19px">${it.ko}</p>${view.show ? `<p class="en" style="font-size:21px;padding:0">${it.en}</p>` : (hintFor(it.en) ? `<p class="hint">${hintFor(it.en)}</p>` : "")}
        ${view.heard != null ? `<div class="heard">${view.heard ? esc(view.heard) : "(듣지 못했어요)"}</div>` : ""}</div></div>
    </section>
    <div class="row"><button class="btn" data-act="rplay">${ic("speaker")}직원 말 다시</button>${view.show ? "" : `<button class="btn" data-act="rshow">영어 보기</button>`}</div>
    ${view.listening ? `<div class="micwrap"><button class="mic live" data-act="rcancel" aria-label="듣는 중. 누르면 취소">${ic("mic")}</button><p class="miclabel">듣고 있어요… 누르면 취소</p></div>` :
      (view.show ? `<button class="btn primary big" data-act="rnext">다음</button>` :
        (checkMode() === "auto" ? `<div class="micwrap"><button class="mic" data-act="rspeak" aria-label="말하기 시작">${ic("mic")}</button><p class="miclabel">눌러서 말하기</p></div>` : `<button class="btn primary big" data-act="rshow">말했어요 (정답 보기)</button>`))}`);
}
/* 쉐도잉 · 듣기 */
function vPlay() {
  const sc = view.scene, sh = view.kind === "shadow";
  return shell(`<div class="sbar"><button class="iconbtn" data-act="tab" data-v="modes" aria-label="연습으로">${ic("x")}</button></div>
    <section class="card"><p class="small muted">${sh ? "쉐도잉" : "듣기"} · ${sc.title}</p>
    <h1>${view.playing ? (sh ? (view.you ? "지금 따라 말하세요" : "듣는 중") : "듣는 중") : (sh ? "음성이 끝나면 바로 따라 말해요" : "소리 내지 않고 듣기만 해요")}</h1>
    ${sh ? `<div class="count"><i id="cnt" style="width:${view.you ? 100 : 0}%"></i></div>` : ""}
    <div class="list">${sc.items.map((it, i) => `<div class="line ${view.playing && i === view.i ? "now" : ""}"><div class="e">${it.en}</div><div class="k">${it.ko}</div></div>`).join("")}</div>
    <div class="row">${view.playing ? `<button class="btn live" data-act="pstop">멈추기</button>` : `<button class="btn primary" data-act="pstart">${ic("play")}시작</button>`}
      <button class="btn" data-act="prate">속도: ${st.rate === 1 ? "보통" : "천천히"}</button></div>
    </section>`);
}
async function runPlay() {
  const tok = ++runTok, sc = view.scene, sh = view.kind === "shadow";
  view.playing = true;
  for (let i = 0; i < sc.items.length; i++) {
    if (tok !== runTok) return;
    view.i = i; view.you = false; render();
    await speak(sc.items[i].en);
    if (tok !== runTok) return;
    if (sh) {
      view.you = true; render();
      const ms = 1500 + sc.items[i].en.length * 90 / st.rate, el = document.getElementById("cnt");
      if (el) { el.style.transition = "none"; el.style.width = "100%"; requestAnimationFrame(() => { el.style.transition = "width " + ms + "ms linear"; el.style.width = "0%"; }); }
      await wait(ms);
    } else await wait(700);
  }
  if (tok !== runTok) return;
  view.playing = false; view.you = false; render();
}
/* 축하 효과 (한 번만) */
function confetti() {
  const c = document.getElementById("confetti");
  if (!c || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const x = c.getContext("2d"), W = c.width = innerWidth, H = c.height = innerHeight;
  const cols = ["#3D5AFE", "#FF6B3D", "#FFC53D", "#12B57B", "#EF4565"];
  const P = Array.from({ length: 130 }, () => ({ x: Math.random() * W, y: -20 - Math.random() * H * .5, r: 4 + Math.random() * 5, vx: (Math.random() - .5) * 3, vy: 2 + Math.random() * 4, c: cols[Math.random() * 5 | 0], a: Math.random() * 6, va: (Math.random() - .5) * .3 }));
  const t0 = performance.now();
  (function f(t) {
    x.clearRect(0, 0, W, H);
    P.forEach(p => { p.x += p.vx; p.y += p.vy; p.a += p.va; x.save(); x.translate(p.x, p.y); x.rotate(p.a); x.fillStyle = p.c; x.fillRect(-p.r, -p.r / 2, p.r * 2, p.r); x.restore(); });
    if (t - t0 < 2600) requestAnimationFrame(f); else x.clearRect(0, 0, W, H);
  })(t0);
}
function countUp(el, to) {
  if (!el || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  let s = null;
  (function f(t) { s = s || t; const k = Math.min(1, (t - s) / 900); el.textContent = "+" + Math.round(to * k); if (k < 1 && document.body.contains(el)) requestAnimationFrame(f); })(performance.now());
}
function render() {
  const V = { home: vHome, modes: vModes, record: vRecord, settings: vSettings, test: vTest, session: vSession, done: vDone, role: vRole, play: vPlay, commute: vCommute };
  $app.innerHTML = V[view.name]();
  if (view.name === "done" && !view.fx) { view.fx = 1; confetti(); countUp(document.getElementById("xpn"), S.xp); }
}


/* 앱 설치 안내: 안드로이드 크롬은 버튼, 아이폰은 사파리 공유 메뉴로 안내 */
let installEv = null;
const isStandalone = () => matchMedia("(display-mode: standalone)").matches || navigator.standalone === true;
function installHTML() {
  if (isStandalone()) return `<p class="muted">이미 앱으로 설치되어 있어요.</p>`;
  if (installEv) return `<p class="muted">홈 화면에 추가하면 앱처럼 열리고, 인터넷이 없어도 쓸 수 있어요.</p><button class="btn primary" data-act="install">홈 화면에 추가</button>`;
  const ios = /iphone|ipad|ipod/i.test(navigator.userAgent);
  return `<p class="muted">${ios ? "사파리 아래의 공유 버튼을 누르고 ‘홈 화면에 추가’를 고르세요." : "브라우저 메뉴(⋮)에서 ‘홈 화면에 추가’ 또는 ‘앱 설치’를 고르세요."}</p><p class="small muted">설치하면 앱처럼 열리고, 인터넷이 없어도 쓸 수 있어요.</p>`;
}
