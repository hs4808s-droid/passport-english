/* Firebase 연결 정보 — 여기에 Firebase 콘솔에서 복사한 값을 붙여 넣는다.
   (docs/로그인설정_가이드.md 의 5단계 참고)
   이 값은 비밀 키가 아니라 "이 앱이 어느 Firebase 프로젝트에 연결되는지" 알려 주는 주소표다.
   공개 저장소에 올려도 된다. 데이터는 보안 규칙(docs/firestore.rules)과 로그인으로 지킨다.
   비워 두면 로그인 기능은 꺼지고, 앱은 지금처럼 이 기기에만 저장한다. */
window.FIREBASE_CONFIG = {
  apiKey: "AIzaSyB2z57YuNSlepcB-YyMS_R6w-fiuS7Enkw",
  authDomain: "gen-lang-client-0346421456.firebaseapp.com",
  projectId: "gen-lang-client-0346421456",
  appId: "1:768296652106:web:ed87ac4a12c2d74fb985b3"
};
