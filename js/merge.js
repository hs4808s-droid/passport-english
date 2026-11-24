/* ---------- 기록 합치기 (순수 함수: 화면·네트워크와 상관없음, 시험하기 쉽게 따로 둔다) ----------
   두 기기에서 따로 쓴 기록을 하나로 합칠 때 쓴다.
   - 외운 문장(cards)은 합집합. 어느 한쪽에서 외웠으면 외운 것으로 본다.
   - XP·최고 연속일·진도(day)는 큰 쪽을 쓴다. (두 기기에서 따로 번 XP는 합산하지 않는다. 한계로 안내한다.)
   - 연속일은 마지막으로 공부한 날이 더 늦은 쪽을 쓴다.
   - 힌트 단계·말하기 속도 같은 설정은 더 최근에 바꾼 쪽을 쓴다.
   - "처음부터 다시" 한 기록(epoch가 더 큰 쪽)은 통째로 이긴다. 안 그러면 지운 기록이 되살아난다. */
function mergeState(a, b) {
  a = a || {}; b = b || {};
  const ea = a.epoch || 0, eb = b.epoch || 0;
  if (ea !== eb) return JSON.parse(JSON.stringify(ea > eb ? a : b));
  const ua = a.upd || 0, ub = b.upd || 0;
  const newer = ua >= ub ? a : b, older = newer === a ? b : a;
  const out = Object.assign({}, older, newer);
  ["level", "rate", "rec"].forEach(k => { out[k] = newer[k] !== undefined ? newer[k] : older[k]; });
  out.cards = {};
  [older.cards || {}, newer.cards || {}].forEach(cs => Object.keys(cs).forEach(id => {
    const c = out.cards[id] || {};
    out.cards[id] = { seen: !!(c.seen || cs[id].seen), fast: !!(c.fast || cs[id].fast) };
  }));
  out.xp = Math.max(a.xp || 0, b.xp || 0);
  out.day = Math.max(a.day || 0, b.day || 0);
  const la = a.last || "", lb = b.last || "";
  if (la !== lb) { const w = la > lb ? a : b; out.last = w.last || null; out.streak = w.streak || 0; }
  else { out.last = a.last || null; out.streak = Math.max(a.streak || 0, b.streak || 0); }
  out.best = Math.max(a.best || 0, b.best || 0, out.streak || 0);
  out.epoch = ea; out.upd = Math.max(ua, ub);
  return out;
}
if (typeof module !== "undefined") module.exports = { mergeState };
