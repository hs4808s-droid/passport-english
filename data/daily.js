/* 일상 대화 묶음 (2주차: 8~13일차 새 문장, 14일차 마무리 복습).
   모양은 data/travel.js 와 같다. 장면 3개 x 문장 10개 = 30문장.
   ⚠ 음성 파일(audio/*.mp3)은 아직 없다. 내 PC에서 `node tools/make-voices.js` 를 실행하면 만들어진다.
     음성이 없는 동안에는 휴대폰 내장 음성으로 대신 읽어 준다. */
(window.PACKS = window.PACKS || []).push(
{ "id": "daily", "title": "일상 대화", "scenes": [
  { "id": "talk", "code": "TALK", "title": "인사·잡담", "sit": "처음 만난 사람, 동료와 가볍게 이야기하기",
    "items": [
      {"id":"t1","en":"Nice to meet you.","ko":"만나서 반갑습니다.","tip":"처음 만났을 때만 써요. 이미 만난 적 있는 사람에게는 Nice to see you.라고 해요.","alt":"It's great to meet you.","audio":"audio/t1.mp3"},
      {"id":"t2","en":"How's it going?","ko":"요즘 어때요?","tip":"가벼운 안부 인사예요. 진짜 긴 대답을 기대하는 말은 아니라서 Good, you? 정도로 받으면 돼요.","alt":"How are you doing?","audio":"audio/t2.mp3"},
      {"id":"t3","en":"Pretty good, thanks. How about you?","ko":"꽤 좋아요, 고마워요. 당신은요?","tip":"대답하고 나서 How about you?로 질문을 돌려주면 대화가 이어져요. Pretty good은 '꽤 괜찮다'예요.","alt":"Good, thanks. And you?","audio":"audio/t3.mp3"},
      {"id":"t4","en":"What do you do?","ko":"무슨 일 하세요?","tip":"직업을 묻는 가장 흔한 말이에요. 'What do you do for work?'라고 풀어서 말해도 돼요.","alt":"What do you do for work?","audio":"audio/t4.mp3"},
      {"id":"t5","en":"I work at a company in Seoul.","ko":"저는 서울에 있는 회사에서 일해요.","tip":"work at 뒤에 일하는 곳을 말해요. 회사 이름을 알리고 싶지 않으면 a company라고만 해도 자연스러워요.","alt":"I work in an office.","audio":"audio/t5.mp3"},
      {"id":"t6","en":"Where are you from?","ko":"어디에서 오셨어요?","tip":"출신지를 묻는 말이에요. 지금 사는 곳을 물을 때는 Where do you live?라고 해요.","alt":"Where do you come from?","audio":"audio/t6.mp3"},
      {"id":"t7","en":"I'm from Korea.","ko":"저는 한국에서 왔어요.","tip":"도시를 말해도 돼요. I'm from Seoul. 나라 이름 앞에는 the를 붙이지 않아요.","alt":"I'm Korean.","audio":"audio/t7.mp3"},
      {"id":"t8","en":"Sorry, could you say that again?","ko":"죄송한데, 다시 한 번 말씀해 주시겠어요?","tip":"못 알아들었을 때 가장 안전한 말이에요. Sorry를 먼저 붙이면 훨씬 부드러워요.","alt":"Sorry, what was that?","audio":"audio/t8.mp3"},
      {"id":"t9","en":"Could you speak a little slower?","ko":"조금만 천천히 말해 주시겠어요?","tip":"a little을 넣으면 정중하고 부드러워요. 그냥 Slower, please.라고 해도 통해요.","alt":"Slower, please.","audio":"audio/t9.mp3"},
      {"id":"t10","en":"What did you do this weekend?","ko":"주말에 뭐 했어요?","tip":"월요일 아침 잡담의 단골 질문이에요. 대답은 'Not much. I just relaxed.'처럼 짧게 해도 괜찮아요.","alt":"Did you do anything fun this weekend?","audio":"audio/t10.mp3"}
    ],
    "dialog": [
      {"s":"Hi, I'm Mark.","sk":"안녕하세요, 저는 마크예요.","u":"t1","sa":"audio/talk-s1.mp3"},
      {"s":"Nice to meet you too. How are you these days?","sk":"저도 반가워요. 요즘 어떠세요?","u":"t3","sa":"audio/talk-s2.mp3"},
      {"s":"Glad to hear it. So, what do you do?","sk":"다행이네요. 그런데 무슨 일 하세요?","u":"t5","sa":"audio/talk-s3.mp3"},
      {"s":"That sounds interesting. I'm from Canada. And you?","sk":"흥미롭네요. 저는 캐나다에서 왔어요. 당신은요?","u":"t7","sa":"audio/talk-s4.mp3"},
      {"s":"My family lives near the harbor in Vancouver, close to the mountains.","sk":"우리 가족은 밴쿠버 항구 근처, 산 가까이에 살아요.","u":"t8","sa":"audio/talk-s5.mp3"},
      {"s":"Sure. My family lives in Vancouver, but I grew up in a small town nearby.","sk":"그럼요. 가족은 밴쿠버에 살지만 저는 근처 작은 마을에서 자랐어요.","u":"t9","sa":"audio/talk-s6.mp3"},
      {"s":"No problem. Anyway, it's Monday again. I'm so tired.","sk":"괜찮아요. 아무튼 또 월요일이네요. 너무 피곤해요.","u":"t10","sa":"audio/talk-s7.mp3"}
    ],
    "end": {"s":"Not much, just relaxed. It was nice talking to you.","sk":"별로 안 했어요, 그냥 쉬었어요. 이야기 즐거웠어요.","sa":"audio/talk-end.mp3"}
  },
  { "id": "plan", "code": "PLAN", "title": "약속·부탁", "sit": "약속 잡기, 일정 바꾸기, 부탁하기",
    "items": [
      {"id":"p1","en":"Are you free this weekend?","ko":"이번 주말에 시간 돼요?","tip":"free는 '한가한'이라는 뜻이에요. 약속을 제안하기 전에 먼저 묻는 말이에요.","alt":"Do you have any plans this weekend?","audio":"audio/p1.mp3"},
      {"id":"p2","en":"Do you want to grab lunch?","ko":"점심 같이 먹을래요?","tip":"grab은 '간단히 먹다'예요. 정식 식사가 아니라 편하게 먹자는 느낌이에요.","alt":"Want to get lunch?","audio":"audio/p2.mp3"},
      {"id":"p3","en":"What time works for you?","ko":"몇 시가 괜찮으세요?","tip":"works for you는 '당신 일정에 맞다'예요. 상대에게 시간을 고르게 하는 배려가 담겨 있어요.","alt":"What time is good for you?","audio":"audio/p3.mp3"},
      {"id":"p4","en":"Sounds good to me.","ko":"저는 좋아요.","tip":"제안을 받아들이는 가장 흔한 말이에요. 주어 It을 빼고 Sounds good.이라고 짧게 해도 돼요.","alt":"That works for me.","audio":"audio/p4.mp3"},
      {"id":"p5","en":"Sorry, I can't make it.","ko":"미안해요, 못 갈 것 같아요.","tip":"make it은 '참석하다'예요. 이유를 길게 대지 않아도 되고, 뒤에 'Maybe next time.'을 붙이면 좋아요.","alt":"I'm afraid I can't come.","audio":"audio/p5.mp3"},
      {"id":"p6","en":"Can we do it another day?","ko":"다른 날로 할 수 있을까요?","tip":"약속을 미룰 때 쓰는 말이에요. 격식 있게는 Could we reschedule?이라고 해요.","alt":"Could we reschedule?","audio":"audio/p6.mp3"},
      {"id":"p7","en":"Could you do me a favor?","ko":"부탁 하나만 들어줄래요?","tip":"favor는 '호의, 부탁'이에요. 본론을 말하기 전에 먼저 꺼내면 부탁이 자연스러워져요.","alt":"Can I ask you a favor?","audio":"audio/p7.mp3"},
      {"id":"p8","en":"Could you help me with this?","ko":"이것 좀 도와주시겠어요?","tip":"help me with 뒤에 도움받을 일을 말해요. 가볍게는 Can you give me a hand?라고 해요.","alt":"Can you give me a hand?","audio":"audio/p8.mp3"},
      {"id":"p9","en":"I'll be there in ten minutes.","ko":"10분 뒤에 도착해요.","tip":"in + 시간은 '지금부터 그 시간 뒤에'라는 뜻이에요. 이동 중이면 I'm on my way.도 많이 써요.","alt":"I'm on my way.","audio":"audio/p9.mp3"},
      {"id":"p10","en":"Let me know when you're free.","ko":"시간 될 때 알려 주세요.","tip":"Let me know는 '알려 주세요'예요. 약속 날짜를 상대에게 맡길 때 편하게 쓰는 말이에요.","alt":"Just let me know.","audio":"audio/p10.mp3"}
    ],
    "dialog": [
      {"s":"Hey! What's up?","sk":"안녕! 무슨 일이야?","u":"p1","sa":"audio/plan-s1.mp3"},
      {"s":"Yeah, I think I'm free. What do you have in mind?","sk":"응, 시간 될 것 같아. 뭐 생각해 둔 거 있어?","u":"p2","sa":"audio/plan-s2.mp3"},
      {"s":"Sure, I'd love to.","sk":"좋지, 가고 싶어.","u":"p3","sa":"audio/plan-s3.mp3"},
      {"s":"How about noon on Saturday?","sk":"토요일 정오는 어때?","u":"p6","sa":"audio/plan-s4.mp3"},
      {"s":"Sure. How about Sunday at one?","sk":"그래. 일요일 한 시는 어때?","u":"p4","sa":"audio/plan-s5.mp3"},
      {"s":"Great. Is there anything else?","sk":"좋아. 다른 건 없어?","u":"p7","sa":"audio/plan-s6.mp3"},
      {"s":"Of course. What do you need?","sk":"물론이지. 뭐가 필요해?","u":"p8","sa":"audio/plan-s7.mp3"}
    ],
    "end": {"s":"No problem. Talk to you soon!","sk":"문제없어. 곧 얘기하자!","sa":"audio/plan-end.mp3"}
  },
  { "id": "buy", "code": "BUY", "title": "쇼핑·카페", "sit": "옷 가게와 카페에서 묻고, 사고, 계산하기",
    "items": [
      {"id":"b1","en":"Can I get an iced americano?","ko":"아이스 아메리카노 한 잔 주시겠어요?","tip":"카페 주문은 Can I get ~?가 가장 흔해요. 크기를 말하려면 a large iced americano라고 해요.","alt":"I'd like an iced americano, please.","audio":"audio/b1.mp3"},
      {"id":"b2","en":"For here, please.","ko":"여기서 먹을게요.","tip":"'For here or to go?'(드시고 가세요, 가져가세요?)에 대한 대답이에요. 가져갈 때는 To go, please.예요.","alt":"I'll have it here.","audio":"audio/b2.mp3"},
      {"id":"b3","en":"Can I get that to go?","ko":"포장해 주시겠어요?","tip":"to go가 '가져가는'이라는 뜻이에요. 영국식으로는 takeaway라고도 해요.","alt":"To go, please.","audio":"audio/b3.mp3"},
      {"id":"b4","en":"How much is this?","ko":"이거 얼마예요?","tip":"물건을 가리키며 말하면 돼요. 여러 개면 How much are these?라고 해요.","alt":"How much does this cost?","audio":"audio/b4.mp3"},
      {"id":"b5","en":"Do you have this in a larger size?","ko":"이거 더 큰 사이즈 있어요?","tip":"in a ~ size에서 in은 '그 사이즈로'라는 뜻이에요. 작은 사이즈는 a smaller size예요.","alt":"Do you have a bigger one?","audio":"audio/b5.mp3"},
      {"id":"b6","en":"Can I try this on?","ko":"입어 봐도 돼요?","tip":"try on은 '입어 보다'예요. 탈의실은 fitting room이라고 해요.","alt":"Where is the fitting room?","audio":"audio/b6.mp3"},
      {"id":"b7","en":"I'll take it.","ko":"이걸로 할게요.","tip":"물건을 사기로 정했을 때 쓰는 말이에요. 아주 짧지만 가장 자연스러워요.","alt":"I'll get this one.","audio":"audio/b7.mp3"},
      {"id":"b8","en":"Can I pay with my phone?","ko":"휴대폰으로 결제해도 돼요?","tip":"with my phone은 '내 휴대폰으로'예요. 카드로 낼 때는 by card, 현금은 in cash라고 해요.","alt":"Do you take mobile payments?","audio":"audio/b8.mp3"},
      {"id":"b9","en":"Could I get a receipt?","ko":"영수증 주시겠어요?","tip":"receipt는 '리시트'로 읽고 p는 발음하지 않아요. 계산하고 나서 건네는 말이에요.","alt":"Can I have the receipt, please?","audio":"audio/b9.mp3"},
      {"id":"b10","en":"I'd like to return this.","ko":"이거 반품하고 싶어요.","tip":"return은 '돌려주다, 반품하다'예요. 환불까지 원하면 Can I get a refund?라고 이어서 말해요.","alt":"Can I get a refund?","audio":"audio/b10.mp3"}
    ],
    "dialog": [
      {"s":"Hi there! Let me know if you need any help.","sk":"안녕하세요! 필요하시면 말씀하세요.","u":"b4","sa":"audio/buy-s1.mp3"},
      {"s":"It's forty-five dollars.","sk":"45달러예요.","u":"b6","sa":"audio/buy-s2.mp3"},
      {"s":"Of course. The fitting room is over there. How does it fit?","sk":"물론이죠. 탈의실은 저쪽이에요. 어떠세요?","u":"b5","sa":"audio/buy-s3.mp3"},
      {"s":"Let me check. Yes, here's a large. How's that?","sk":"확인해 볼게요. 네, 라지가 있어요. 어떠세요?","u":"b7","sa":"audio/buy-s4.mp3"},
      {"s":"Great. That comes to forty-eight dollars with tax.","sk":"좋아요. 세금 포함해서 48달러예요.","u":"b8","sa":"audio/buy-s5.mp3"},
      {"s":"Sure. Here you go. Anything else?","sk":"네. 여기 있어요. 더 필요한 건 없으세요?","u":"b9","sa":"audio/buy-s6.mp3"}
    ],
    "end": {"s":"Here's your receipt. Have a great day!","sk":"영수증 여기 있어요. 좋은 하루 보내세요!","sa":"audio/buy-end.mp3"}
  }
]}
);
