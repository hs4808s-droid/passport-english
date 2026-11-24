/* ---------- 기록 저장: 먼저 이 기기에 저장하고, 로그인했으면 js/cloud.js가 계정에도 올린다 ---------- */
const KEY = "trip-english-v1";
const blank = () => ({ level: 1, rate: 1, rec: false, cards: {}, streak: 0, best: 0, xp: 0, last: null, day: 0, upd: 0, epoch: 0 });
let st = blank();
const store = {
  load() { try { const v = JSON.parse(localStorage.getItem(KEY)); if (v) { st = Object.assign(st, v); if (v.day === undefined) st.day = Math.min(WEEK - 1, Math.ceil(Object.keys(v.cards || {}).length / PER_DAY)); if (!st.best) st.best = st.streak || 0; } } catch (e) {} },
  saveRaw() { try { localStorage.setItem(KEY, JSON.stringify(st)); } catch (e) {} },          // 이 기기에만 저장 (로그인 동기화가 합친 결과를 넣을 때)
  save() { st.upd = Date.now(); this.saveRaw(); if (typeof cloud !== "undefined") cloud.touch(); }   // 바꾼 시각을 적고, 로그인 상태면 계정에도 올린다
};
store.load();

/* ---------- 날짜 ---------- */
const pad = n => String(n).padStart(2, "0");
const dstr = d => d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate());
const today = () => dstr(new Date());
const plus = n => { const d = new Date(); d.setDate(d.getDate() + n); return dstr(d); };
const curStreak = () => (st.last === today() || st.last === plus(-1)) ? st.streak : 0;

