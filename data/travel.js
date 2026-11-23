/* 문장 묶음 데이터. 새 묶음(일상 대화 등)은 data/ 에 새 파일을 만들고 같은 모양(.push)으로 쓰면 된다. 그리고 index.html에 script 한 줄을 넣는다.
   items 한 줄 = 문장 1개 (id, en 영어, ko 한국어, tip 원어민 팁, alt 이렇게도 말해요, audio 음성 파일)
   dialog = 상황극 대본 (s 직원 말, sk 번역, sa 직원 음성, u 내 문장 id) */
(window.PACKS = window.PACKS || []).push(
{ "id": "travel", "title": "해외여행", "scenes": [
  { "id": "air", "code": "AIR", "title": "공항", "sit": "체크인부터 입국심사, 짐 찾기까지",
    "items": [
      {"id":"a1","en":"Where is the check-in counter?","ko":"체크인 카운터가 어디예요?","tip":"항공사 이름을 붙이면 더 정확해요. Where is the Delta check-in counter?","alt":"Where do I check in?","audio":"audio/a1.mp3"},
      {"id":"a2","en":"I'd like a window seat, please.","ko":"창가 자리로 주세요.","tip":"I'd like ~는 I want ~보다 훨씬 공손해요. 통로 쪽은 an aisle seat이에요.","alt":"Could I get a window seat?","audio":"audio/a2.mp3"},
      {"id":"a3","en":"I have one bag to check.","ko":"부칠 가방이 하나 있어요.","tip":"'짐을 부치다'는 check예요. 기내에 들고 타는 가방은 carry-on이라고 해요.","alt":"I'd like to check this bag.","audio":"audio/a3.mp3"},
      {"id":"a4","en":"What time does boarding start?","ko":"탑승은 몇 시에 시작해요?","tip":"boarding은 탑승 시작이에요. 짧게 What time is boarding?도 많이 써요.","alt":"What time is boarding?","audio":"audio/a4.mp3"},
      {"id":"a5","en":"Which gate is it?","ko":"몇 번 게이트예요?","tip":"게이트 번호는 숫자 그대로 읽어요. 'Gate twelve.'","alt":"Which gate is my flight?","audio":"audio/a5.mp3"},
      {"id":"a6","en":"I'm here for sightseeing.","ko":"관광하러 왔어요.","tip":"입국심사에서 가장 많이 받는 질문의 답이에요. 출장이면 on business, 휴가면 on vacation이에요.","alt":"I'm here on vacation.","audio":"audio/a6.mp3"},
      {"id":"a7","en":"I'm staying for five days.","ko":"5일 동안 머물 거예요.","tip":"for 뒤에 기간을 넣어요. 짧게 'Five days.'라고만 해도 충분해요.","alt":"Five days.","audio":"audio/a7.mp3"},
      {"id":"a8","en":"Where can I get my luggage?","ko":"짐은 어디서 찾아요?","tip":"짐 찾는 곳의 정식 이름은 baggage claim이에요. 표지판에서 이 단어를 찾으세요.","alt":"Where is the baggage claim?","audio":"audio/a8.mp3"},
      {"id":"a9","en":"My bag didn't come out.","ko":"제 가방이 안 나왔어요.","tip":"분실 신고는 이 말부터 시작해요. 이어서 'It's a black suitcase.'처럼 생김새를 말해요.","alt":"My luggage is missing.","audio":"audio/a9.mp3"},
      {"id":"a10","en":"How do I get downtown?","ko":"시내에는 어떻게 가요?","tip":"downtown은 시내 중심가예요. 목적지를 넣으려면 How do I get to + 장소로 말해요.","alt":"How do I get to the city center?","audio":"audio/a10.mp3"}
    ],
    "dialog": [
      {"s":"Good morning. How can I help you?","sk":"안녕하세요. 무엇을 도와드릴까요?","u":"a1","sa":"audio/air-s1.mp3"},
      {"s":"It's right over there. Do you have a seat preference?","sk":"바로 저쪽입니다. 원하는 좌석이 있으세요?","u":"a2","sa":"audio/air-s2.mp3"},
      {"s":"Sure. Any bags to check?","sk":"네. 부칠 짐이 있으세요?","u":"a3","sa":"audio/air-s3.mp3"},
      {"s":"All set. Here's your boarding pass.","sk":"다 됐습니다. 탑승권 여기 있습니다.","u":"a4","sa":"audio/air-s4.mp3"},
      {"s":"Boarding starts at ten thirty.","sk":"탑승은 10시 30분에 시작합니다.","u":"a5","sa":"audio/air-s5.mp3"},
      {"s":"Gate twelve. What's the purpose of your visit?","sk":"12번 게이트입니다. 방문 목적이 무엇인가요?","u":"a6","sa":"audio/air-s6.mp3"},
      {"s":"How long are you staying?","sk":"얼마나 머무르시나요?","u":"a7","sa":"audio/air-s7.mp3"}
    ],
    "end": {"s":"Thank you. Enjoy your trip.","sk":"감사합니다. 즐거운 여행 되세요.","sa":"audio/air-end.mp3"}
  },
  { "id": "food", "code": "EAT", "title": "식당", "sit": "자리 잡기부터 주문, 계산까지",
    "items": [
      {"id":"r1","en":"A table for two, please.","ko":"두 명 자리 부탁해요.","tip":"인원수만 말하면 돼요. 창가를 원하면 'by the window'를 붙여요.","alt":"Two, please.","audio":"audio/r1.mp3"},
      {"id":"r2","en":"Can I see the menu?","ko":"메뉴 좀 볼 수 있을까요?","tip":"Can I ~?는 부탁할 때 가장 쉬운 틀이에요. 더 격식 있게는 May I ~?예요.","alt":"Could we get a menu?","audio":"audio/r2.mp3"},
      {"id":"r3","en":"What do you recommend?","ko":"뭘 추천하세요?","tip":"강세는 recommend의 -mend에 있어요. 편하게 What's good here?라고도 해요.","alt":"What's good here?","audio":"audio/r3.mp3"},
      {"id":"r4","en":"I'll have this one.","ko":"이걸로 할게요.","tip":"주문할 때는 I'll have ~가 가장 자연스러워요. 메뉴를 가리키며 말해도 돼요.","alt":"I'll take this.","audio":"audio/r4.mp3"},
      {"id":"r5","en":"No onions, please.","ko":"양파는 빼 주세요.","tip":"'~ 빼 주세요'는 No ~, please예요. 알레르기가 있으면 I'm allergic to onions라고 말해요.","alt":"Can I have it without onions?","audio":"audio/r5.mp3"},
      {"id":"r6","en":"Can I get some water?","ko":"물 좀 주시겠어요?","tip":"some을 붙이면 말이 부드러워져요. 얼음 없이 달라면 without ice를 붙여요.","alt":"Could I have some water?","audio":"audio/r6.mp3"},
      {"id":"r7","en":"This isn't what I ordered.","ko":"이건 제가 주문한 게 아니에요.","tip":"화내지 않고 사실만 말하는 표현이에요. 뒤에 Could you check?를 붙이면 더 부드러워요.","alt":"I think there's a mistake.","audio":"audio/r7.mp3"},
      {"id":"r8","en":"It was really good.","ko":"정말 맛있었어요.","tip":"다 먹고 나갈 때 건네는 칭찬이에요. delicious보다 really good이 일상 대화에서 더 자연스러워요.","alt":"Everything was delicious.","audio":"audio/r8.mp3"},
      {"id":"r9","en":"Can I have the check, please?","ko":"계산서 주시겠어요?","tip":"미국에서는 check, 영국에서는 bill이라고 해요. 둘 다 통해요.","alt":"Could we get the bill?","audio":"audio/r9.mp3"},
      {"id":"r10","en":"Can I pay by card?","ko":"카드로 계산해도 돼요?","tip":"현금이면 in cash예요. 나눠 내려면 Can we split the bill?라고 말해요.","alt":"Do you take credit cards?","audio":"audio/r10.mp3"}
    ],
    "dialog": [
      {"s":"Hi, welcome. How many?","sk":"어서 오세요. 몇 분이세요?","u":"r1","sa":"audio/food-s1.mp3"},
      {"s":"Right this way. Here's your table.","sk":"이쪽입니다. 여기 앉으세요.","u":"r2","sa":"audio/food-s2.mp3"},
      {"s":"Here you go. Are you ready to order?","sk":"여기 있습니다. 주문하시겠어요?","u":"r3","sa":"audio/food-s3.mp3"},
      {"s":"The grilled chicken is very popular.","sk":"구운 닭요리가 인기가 많습니다.","u":"r4","sa":"audio/food-s4.mp3"},
      {"s":"Good choice. Anything else?","sk":"좋은 선택입니다. 더 필요한 것 있으세요?","u":"r5","sa":"audio/food-s5.mp3"},
      {"s":"No problem. How was everything?","sk":"알겠습니다. 음식은 어떠셨어요?","u":"r8","sa":"audio/food-s6.mp3"},
      {"s":"Glad to hear that. Anything else for you?","sk":"다행입니다. 더 필요한 것 있으세요?","u":"r9","sa":"audio/food-s7.mp3"},
      {"s":"Sure, here you are.","sk":"네, 여기 있습니다.","u":"r10","sa":"audio/food-s8.mp3"}
    ],
    "end": {"s":"Of course. Thank you!","sk":"물론입니다. 감사합니다!","sa":"audio/food-end.mp3"}
  },
  { "id": "hotel", "code": "STAY", "title": "호텔", "sit": "체크인부터 부탁, 불편 말하기, 체크아웃까지",
    "items": [
      {"id":"h1","en":"I have a reservation.","ko":"예약했어요.","tip":"이름을 이어서 말하면 빨라요. 'under Kim.'(김 이름으로)","alt":"I have a booking under Kim.","audio":"audio/h1.mp3"},
      {"id":"h2","en":"I'd like to check in.","ko":"체크인하고 싶어요.","tip":"동사는 check in, 명사는 check-in이에요. 호텔에서는 I'd like to ~가 정중해요.","alt":"Hi, I'm checking in.","audio":"audio/h2.mp3"},
      {"id":"h3","en":"What time is breakfast?","ko":"아침 식사는 몇 시예요?","tip":"함께 알아두세요. 'Is breakfast included?'(조식이 포함인가요?)","alt":"When is breakfast served?","audio":"audio/h3.mp3"},
      {"id":"h4","en":"Is Wi-Fi free?","ko":"와이파이는 무료예요?","tip":"비밀번호는 password예요. 'What's the Wi-Fi password?'","alt":"Do you have free Wi-Fi?","audio":"audio/h4.mp3"},
      {"id":"h5","en":"Can I get an extra towel?","ko":"수건 하나 더 받을 수 있을까요?","tip":"extra는 '추가'예요. towel 자리에 pillow, toothbrush를 바꿔 넣어 보세요.","alt":"Could I have another towel?","audio":"audio/h5.mp3"},
      {"id":"h6","en":"The air conditioner isn't working.","ko":"에어컨이 안 돼요.","tip":"고장 났을 때는 isn't working이 만능이에요. TV, light, shower에도 그대로 써요.","alt":"The AC doesn't work.","audio":"audio/h6.mp3"},
      {"id":"h7","en":"Can you keep my luggage?","ko":"짐 좀 맡아 주실 수 있어요?","tip":"체크인 전이나 체크아웃 후에 짐을 맡길 때 써요. hold my bags도 같은 뜻이에요.","alt":"Can I leave my bags here?","audio":"audio/h7.mp3"},
      {"id":"h8","en":"Can I check out late?","ko":"늦게 체크아웃해도 돼요?","tip":"추가 요금이 궁금하면 'Is there a fee?'라고 물어요.","alt":"Is a late checkout possible?","audio":"audio/h8.mp3"},
      {"id":"h9","en":"Can you call a taxi for me?","ko":"택시 좀 불러 주시겠어요?","tip":"for me를 붙이면 부탁이라는 느낌이 분명해져요. 시간은 'How long will it take?'로 물어요.","alt":"Could you get me a taxi?","audio":"audio/h9.mp3"},
      {"id":"h10","en":"I'd like to check out.","ko":"체크아웃할게요.","tip":"방 번호를 함께 말하면 빨라요. 'Room 305.'","alt":"I'm checking out.","audio":"audio/h10.mp3"}
    ],
    "dialog": [
      {"s":"Good evening. Welcome.","sk":"안녕하세요. 어서 오세요.","u":"h2","sa":"audio/hotel-s1.mp3"},
      {"s":"Sure. Do you have a reservation?","sk":"네. 예약하셨나요?","u":"h1","sa":"audio/hotel-s2.mp3"},
      {"s":"Thank you. Here's your key.","sk":"감사합니다. 열쇠 여기 있습니다.","u":"h3","sa":"audio/hotel-s3.mp3"},
      {"s":"From seven to ten, on the second floor.","sk":"7시부터 10시까지, 2층입니다.","u":"h4","sa":"audio/hotel-s4.mp3"},
      {"s":"Yes, it is. The password is on your key card.","sk":"네, 무료입니다. 비밀번호는 카드에 있습니다.","u":"h5","sa":"audio/hotel-s5.mp3"}
    ],
    "end": {"s":"Of course. I'll send one up right away.","sk":"물론입니다. 바로 올려 보내겠습니다.","sa":"audio/hotel-end.mp3"}
  }
] }
);
