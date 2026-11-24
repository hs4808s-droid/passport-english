/* ---------- 로그인과 기록 동기화 (Firebase) ----------
   - 설정값(js/firebase-config.js)이 비어 있으면 아무것도 하지 않는다. 앱은 기존처럼 이 기기에만 저장한다.
   - Firebase 코드는 vendor/ 에 들어 있고, 로그인할 때만 불러온다. (로그인 안 쓰는 사람은 내려받지 않는다)
   - 기록은 먼저 이 기기에 저장하고, 인터넷이 되면 계정에 올린다. 올리기 전에 항상 계정의 기록과 합친다. */
const cloud = (() => {
  const CFG = window.FIREBASE_CONFIG || {};
  const ready = !!(CFG.apiKey && CFG.projectId && CFG.appId);
  const FLAG = "trip-english-cloud", DIRTY = "trip-english-dirty";
  const LIBS = ["vendor/firebase-app-compat.js", "vendor/firebase-auth-compat.js", "vendor/firebase-firestore-compat.js"];
  let auth = null, db = null, user = null, sdk = null;
  let phase = ready ? "out" : "none";   // none 설정 없음 · out 로그아웃 · load 불러오는 중 · in 로그인됨
  let msg = "", code = "", busy = false, lastSync = 0, timer = null, lastTry = 0;
  const lsGet = k => { try { return localStorage.getItem(k); } catch (e) { return null; } };
  const lsSet = (k, v) => { try { v === null ? localStorage.removeItem(k) : localStorage.setItem(k, v); } catch (e) {} };

  function loadOne(src) {
    return new Promise((ok, no) => {
      const s = document.createElement("script"); s.src = src; s.onload = ok; s.onerror = () => no({ code: "load-failed" });
      document.head.appendChild(s);
    });
  }
  function ensureSDK() {
    if (sdk) return sdk;
    sdk = (async () => {
      for (const l of LIBS) await loadOne(l);
      firebase.initializeApp({ apiKey: CFG.apiKey, authDomain: CFG.authDomain, projectId: CFG.projectId, appId: CFG.appId });
      auth = firebase.auth(); db = firebase.firestore();
      auth.onAuthStateChanged(onUser);
    })().catch(e => { sdk = null; throw e; });
    return sdk;
  }

  const FRIENDLY = {
    "auth/popup-closed-by-user": "로그인 창이 닫혔어요.",
    "auth/cancelled-popup-request": "로그인 창이 닫혔어요.",
    "auth/popup-blocked": "로그인 창이 막혔어요. 아래 이메일로 로그인해 보세요.",
    "auth/unauthorized-domain": "이 주소가 Firebase에 등록되어 있지 않아요. 설정 가이드 6단계를 확인하세요.",
    "auth/operation-not-allowed": "이 로그인 방식이 아직 켜져 있지 않아요. 설정 가이드 3단계를 확인하세요.",
    "auth/invalid-email": "이메일 모양이 맞지 않아요.",
    "auth/missing-email": "이메일을 입력하세요.",
    "auth/missing-password": "비밀번호를 입력하세요.",
    "auth/weak-password": "비밀번호는 6자 이상이어야 해요.",
    "auth/email-already-in-use": "이미 가입된 이메일이에요. 로그인을 눌러 보세요.",
    "auth/invalid-credential": "이메일 또는 비밀번호가 맞지 않아요.",
    "auth/wrong-password": "이메일 또는 비밀번호가 맞지 않아요.",
    "auth/user-not-found": "이메일 또는 비밀번호가 맞지 않아요.",
    "auth/too-many-requests": "시도가 너무 많아요. 잠시 뒤에 다시 해 보세요.",
    "auth/network-request-failed": "인터넷 연결을 확인하세요.",
    "load-failed": "로그인 기능을 불러오지 못했어요. 인터넷 연결을 확인하세요.",
    "permission-denied": "기록을 저장할 권한이 없어요. 설정 가이드 4단계(보안 규칙)를 확인하세요.",
    "unavailable": "지금은 연결할 수 없어요. 인터넷이 되면 자동으로 다시 시도해요.",
    "failed-precondition": "데이터베이스가 아직 만들어지지 않았어요. 설정 가이드 4단계를 확인하세요.",
    "not-found": "데이터베이스가 아직 만들어지지 않았어요. 설정 가이드 4단계를 확인하세요."
  };
  function fail(e) { code = (e && e.code) || String(e && e.message || e); msg = FRIENDLY[code] || "문제가 생겼어요. 아래 오류 코드를 알려 주세요."; }
  function paint() { if (typeof view !== "undefined" && ["home", "record", "modes", "settings"].includes(view.name)) render(); }

  /* 같은 내용인지 비교 (키 순서와 상관없이) */
  const stable = o => JSON.stringify(o, (k, v) => (v && typeof v === "object" && !Array.isArray(v)) ? Object.keys(v).sort().reduce((r, x) => (r[x] = v[x], r), {}) : v);
  const clean = o => JSON.parse(JSON.stringify(o));

  /* 계정의 기록을 받아 이 기기 기록과 합치고, 합친 결과를 양쪽에 저장한다.
     받기→합치기→올리기를 한 묶음(트랜잭션)으로 처리해서, 두 기기가 동시에 저장해도 서로 덮어쓰지 않는다. */
  async function sync(force) {
    if (!user || busy) return;
    if (!force && Date.now() - lastTry < 15000 && lsGet(DIRTY) !== "1") return;
    busy = true; lastTry = Date.now(); msg = ""; code = ""; paint();
    try {
      const ref = db.collection("users").doc(user.uid), startUpd = st.upd;
      let merged = null;
      await db.runTransaction(async tx => {
        const snap = await tx.get(ref);
        const remote = snap.exists ? (snap.data().data || null) : null;
        merged = remote ? mergeState(st, remote) : clean(st);
        if (!remote || stable(merged) !== stable(remote)) tx.set(ref, { v: 1, upd: merged.upd || Date.now(), data: clean(merged) });
      });
      const changed = st.upd !== startUpd;           // 저장하는 사이에 또 공부해서 기록이 바뀐 경우
      st = Object.assign(blank(), mergeState(st, merged)); store.saveRaw();
      if (changed) { lsSet(DIRTY, "1"); clearTimeout(timer); timer = setTimeout(() => sync(true), 800); }
      else { lsSet(DIRTY, null); lastSync = Date.now(); }
    } catch (e) { fail(e); lsSet(DIRTY, "1"); }
    finally { busy = false; paint(); }
  }

  function onUser(u) {
    user = u || null;
    if (user) { phase = "in"; lsSet(FLAG, "1"); sync(true); }
    else { phase = ready ? "out" : "none"; lsSet(FLAG, null); paint(); }
  }

  async function run(fn) {
    msg = ""; code = ""; phase = "load"; paint();
    try { await ensureSDK(); await fn(); }
    catch (e) { fail(e); }
    finally { if (!user) phase = "out"; paint(); }
  }

  async function signOutNow() {
    msg = ""; code = ""; paint();
    await sync(true);                                    // 마지막으로 올려 둔다
    if (lsGet(DIRTY) === "1") { view.outAsk = false; msg = "올리지 못한 기록이 있어 로그아웃하지 않았어요. 인터넷이 될 때 다시 해 주세요."; paint(); return; }
    await auth.signOut();
    st = blank(); store.saveRaw(); lsSet(DIRTY, null);   // 다른 사람이 이 기기를 써도 섞이지 않게 비운다
    view.outAsk = false; go("settings");
  }

  const val = id => { const e = document.getElementById(id); return e ? e.value.trim() : ""; };
  function act(a) {
    if (!ready) return;
    switch (a) {
      case "gLogin": return run(() => auth.signInWithPopup(new firebase.auth.GoogleAuthProvider()));
      case "eLogin": { const m = val("cl-email"), p = document.getElementById("cl-pass")?.value || ""; return run(() => auth.signInWithEmailAndPassword(m, p)); }
      case "eSignup": { const m = val("cl-email"), p = document.getElementById("cl-pass")?.value || ""; return run(() => auth.createUserWithEmailAndPassword(m, p)); }
      case "eReset": { const m = val("cl-email"); if (!m) { msg = "이메일을 먼저 입력하세요."; code = ""; return paint(); } return run(async () => { await auth.sendPasswordResetEmail(m); msg = "비밀번호 재설정 메일을 보냈어요. 스팸함도 확인하세요."; }); }
      case "cSync": return sync(true);
      case "cOut": view.outAsk = true; return paint();
      case "cOutNo": view.outAsk = false; return paint();
      case "cOut2": return signOutNow();
    }
  }

  function html() {
    if (phase === "none") return `<section class="card"><h2>로그인으로 기록 이어 쓰기</h2><p class="muted">준비 중이에요. 지금은 이 기기에만 저장돼요.</p></section>`;
    const err = msg ? `<p class="small" style="color:var(--rose-d)">${msg}</p>${code ? `<p class="small muted">오류 코드: ${code}</p>` : ""}` : "";
    if (phase === "load") return `<section class="card"><h2>로그인으로 기록 이어 쓰기</h2><p class="muted">연결하는 중…</p></section>`;
    if (phase === "in") {
      const who = user ? (user.displayName || user.email || "내 계정") : "";
      const t = lastSync ? new Date(lastSync) : null;
      const when = busy ? "저장하는 중…" : (t ? `마지막 저장 ${pad(t.getHours())}:${pad(t.getMinutes())}` : (lsGet(DIRTY) === "1" ? "아직 저장하지 못했어요" : "저장 확인 중"));
      return `<section class="card"><h2>로그인으로 기록 이어 쓰기</h2>
        <p><b>${who}</b> 님으로 로그인됨</p>
        <p class="small muted">${when}. 같은 계정으로 로그인하면 폰과 컴퓨터에서 같은 기록을 써요.</p>${err}
        <button class="btn" data-act="cSync">지금 저장하기</button>
        ${view.outAsk ? `<p class="small muted">로그아웃하면 이 기기의 기록은 지워져요. 계정에는 남아 있어서 다시 로그인하면 돌아와요.</p><div class="row"><button class="btn rose" data-act="cOut2">로그아웃</button><button class="btn" data-act="cOutNo">취소</button></div>` : `<button class="btn ghost" data-act="cOut">로그아웃</button>`}
      </section>`;
    }
    return `<section class="card"><h2>로그인으로 기록 이어 쓰기</h2>
      <p class="muted">로그인하면 기록이 내 계정에 저장돼요. 폰을 바꾸거나 앱을 지워도, 컴퓨터에서도 이어서 쓸 수 있어요.</p>${err}
      <button class="btn primary" data-act="gLogin">Google로 로그인</button>
      <p class="small muted">구글 로그인이 안 되면 이메일로 해 보세요.</p>
      <input id="cl-email" class="fld" type="email" inputmode="email" autocomplete="email" placeholder="이메일">
      <input id="cl-pass" class="fld" type="password" autocomplete="current-password" placeholder="비밀번호 (6자 이상)">
      <div class="row"><button class="btn" data-act="eLogin">로그인</button><button class="btn" data-act="eSignup">새로 가입</button></div>
      <button class="btn ghost" data-act="eReset">비밀번호를 잊었어요</button>
      <p class="small muted">로그인하지 않아도 앱은 그대로 쓸 수 있어요. 그때는 이 기기에만 저장돼요.</p>
    </section>`;
  }

  /* 기록이 바뀔 때마다 store.save()가 부른다. 잠깐 모았다가 한 번에 올린다 */
  function touch() {
    if (!ready || (!user && lsGet(FLAG) !== "1")) return;
    lsSet(DIRTY, "1");
    clearTimeout(timer); timer = setTimeout(() => sync(true), 3000);
  }
  function init() {
    if (!ready) return;
    if (lsGet(FLAG) === "1") { phase = "load"; ensureSDK().catch(e => { fail(e); phase = "out"; paint(); }); }
    window.addEventListener("online", () => { if (user) sync(true); });
    document.addEventListener("visibilitychange", () => { if (!document.hidden && user) sync(false); });
  }
  const phaseNow = () => phase;
  return { ready, init, touch, act, html, sync, phase: phaseNow, isIn: () => !!user };
})();
