# 패스포트 영어 (가칭)

공항·식당·호텔에서 쓰는 여행 영어를 소리 내어 말하며 익히는 설치형 웹앱.
자세한 설계와 다음 할 일은 `docs/제작지시서.md`.

## 내 컴퓨터에서 열어 보기
```
cd passport-english
python -m http.server 8000      (또는 npx serve)
```
브라우저에서 http://localhost:8000 을 연다. (index.html을 더블클릭하면 오프라인 저장 기능이 꺼진다.)

## 인터넷에 올리기 (무료)
폴더 전체를 GitHub Pages 같은 정적 호스팅에 올린다. 서버 프로그램은 필요 없다.
올리기 전에 `node tools/make-precache.js`를 실행한다.

## 문장을 늘릴 때
1. `data/`에 새 파일을 만든다 (`data/travel.js` 모양 그대로).
2. `index.html`에 `<script src="data/새파일.js"></script>`를 `data/travel.js` 줄 아래에 넣는다.
3. `node tools/make-voices.js` (내 PC, 구글 API 키 필요) → `node tools/make-precache.js`

## 로그인·기록 저장 (2026-11-24 추가)
- `js/firebase-config.js` 가 비어 있으면 로그인은 꺼지고 기록은 이 기기에만 저장된다.
- 값을 채우면 설정 화면에 로그인이 나타나고, 기록이 Firebase(Firestore `users/{uid}`)에 저장되어 기기 사이에 이어진다.
- 코드: `js/cloud.js`(로그인·동기화), `js/merge.js`(기록 합치기), `vendor/`(Firebase SDK, Apache-2.0, 로그인할 때만 불러옴).
- 설정 방법: `docs/로그인설정_가이드.md`, 보안 규칙: `docs/firestore.rules`.
- 한계: 두 기기에서 따로 번 XP는 합산하지 않고 큰 쪽을 쓴다. 로그아웃하면 그 기기의 기록은 지워진다(계정에는 남음).
