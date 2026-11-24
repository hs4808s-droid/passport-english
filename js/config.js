/* 2단계 예정: AI 대화 상대를 붙일 자리. 지금은 꺼 둔다. */
const AI_PARTNER = { enabled: false };

const SCENES = PACKS.flatMap(p => p.scenes);
const ITEMS = SCENES.flatMap(s => s.items.map((it, i) => ({ ...it, scene: s, no: i + 1 })));
const BY_ID = Object.fromEntries(ITEMS.map(it => [it.id, it]));
// 한 주 = 7일차. 1~6일차: 전날 문장 복습(듣고 넘기기) → 새 문장 5개. 7일차: 그 주 문장 전체 마무리 복습.
const PER_DAY = 5, WEEK = 7, GOAL_SEC = 10;
// d일차의 새 문장 5개. (7일차처럼 주의 마지막 날은 복습일이라 새 문장이 없다)
// 이 계산은 tools/make-loops.js 도 그대로 가져다 쓴다. 바꾸면 연속 재생 파일 묶음도 같이 바뀐다.
const learnIdx = d => (Math.ceil(d / WEEK) - 1) * (WEEK - 1) + ((d - 1) % WEEK);   // d일차가 몇 번째 학습일인지(0부터)
const dayNew = d => ((d - 1) % WEEK === WEEK - 1) ? [] : ITEMS.slice(learnIdx(d) * PER_DAY, learnIdx(d) * PER_DAY + PER_DAY);
const LEVELS = [
  { n: 1, name: "1단계", desc: "단어 첫 글자를 힌트로 본다" },
  { n: 2, name: "2단계", desc: "앞의 두 단어만 힌트로 본다" },
  { n: 3, name: "3단계", desc: "힌트 없이 말한다" }
];
const RANKS = ["공항 도착", "체크인 완료", "탑승 중", "이륙", "순항 중", "착륙", "입국 통과", "여행 전문가"];


/* 음성 파일 지도: 문장(영어) → mp3 경로. data/*.js의 audio·sa 값에서 자동으로 만든다.
   음성은 Google Chirp 3 HD로 만든 파일이라 기기와 상관없이 같은 소리가 난다. */
const AUDIO = {};
PACKS.forEach(p => p.scenes.forEach(sc => {
  sc.items.forEach(it => { if (it.audio) AUDIO[it.en] = it.audio; });
  sc.dialog.forEach(d => { if (d.sa) AUDIO[d.s] = d.sa; });
  if (sc.end.sa) AUDIO[sc.end.s] = sc.end.sa;
}));
