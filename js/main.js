/* ---------- 누르기 처리 ---------- */
$app.addEventListener("click", e => {
  const b = e.target.closest("[data-act]"); if (!b || b.disabled) return;
  const a = b.dataset.act, v = b.dataset.v;
  const cur = S && view.name === "session" ? S.q[S.i] : null, it = cur ? BY_ID[cur.id] : null;
  switch (a) {
    case "install": if (installEv) { installEv.prompt(); installEv.userChoice.finally(() => { installEv = null; render(); }); } break;
    case "tab": clearInterval(tick); stopListen(); recStop(); go(v); break;
    case "start": startSession(false); break;
    case "replay": case "extra": startSession(true); break;
    case "test": go("test", { i: 0, sum: 0 }); break;
    case "ans": view.sum += +v; view.i++; render(); break;
    case "level": st.level = +v; store.save(); if (b.dataset.home) go("home"); else render(); break;
    case "rate": st.rate = +v; store.save(); render(); break;
    case "rec": st.rec = !st.rec; store.save(); render(); break;
    case "reset": view.ask = true; render(); break;
    case "reset2": st = blank(); store.save(); go("home"); break;
    case "sound": speak("Where is the check-in counter?").then(render); break;
    case "play": speak(it.en); break;
    case "slow": speak(it.en, .75); break;
    case "mine": playMine(); break;
    case "speak": onSpeak(); break;
    case "selfDone": selfDone(); break;
    case "cancelListen": stopListen(); recStop(); step.phase = "idle"; render(); break;
    case "retry": recUrl = null; step.phase = "idle"; step.heard = null; step.show = false; render(); speak(it.en); break;
    case "override": step.pass = true; sfx("ok"); nextStep(); break;
    case "self": step.pass = v === "1"; sfx(step.pass ? "ok" : "no"); nextStep(); break;
    case "next": nextStep(); break;
    case "quit": clearInterval(tick); stopListen(); recStop(); go("home"); break;
    case "pick": go("modes", { pick: v }); break;
    case "scene": {
      const sc = SCENES.find(s => s.id === v), kind = view.pick || view.kind || (view.name === "role" ? "role" : "listen");
      if (kind === "role") { go("role", { scene: sc, i: 0, show: false, heard: null }); speak(sc.dialog[0].s); }
      else go("play", { scene: sc, kind, i: 0, playing: false });
      break;
    }
    case "rplay": speak(view.scene.dialog[view.i].s); break;
    case "rshow": view.show = true; render(); speak(BY_ID[view.scene.dialog[view.i].u].en); break;
    case "rspeak": {
      stopSound(); view.listening = true; render();
      const target = BY_ID[view.scene.dialog[view.i].u].en;
      startListen(text => { view.listening = false; if (text === null) { render(); return; } view.heard = text; view.show = true; render(); speak(target); });
      break;
    }
    case "rcancel": stopListen(); view.listening = false; render(); break;
    case "rnext": {
      view.i++; view.show = false; view.heard = null; render();
      const d = view.scene.dialog; speak(view.i < d.length ? d[view.i].s : view.scene.end.s);
      break;
    }
    case "pstart": runPlay(); break;
    case "pstop": runTok++; stopSound(); view.playing = false; view.you = false; render(); break;
    case "prate": st.rate = st.rate === 1 ? .8 : 1; store.save(); render(); break;
  }
});
render();
window.addEventListener("beforeinstallprompt", e => { e.preventDefault(); installEv = e; if (view.name === "settings") render(); });
if ("serviceWorker" in navigator && location.protocol.indexOf("http") === 0) {
  window.addEventListener("load", () => navigator.serviceWorker.register("sw.js").catch(() => {}));
}
