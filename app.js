// 1) 여기에 너의 Apps Script Web App URL 붙여넣기
const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxFQFBoTC7OGqcEZF7r-CC6p6eqCz057V_SbOCF_sJSH31U9kj_VS-53f-Tt6txEUWZCw/exec";

// 2) 고정 데이터
const PEOPLE = ["영수","연실","한나","유나","아라","현아","건"];
const CATEGORIES = ["택시","식당","기념품","카페","편의점","베이커리"];
const DAYS = ["1","2","3","4","5"];
const SETTLE_API_URL = APPS_SCRIPT_URL;

// --- helpers ---
const $ = (sel)=>document.querySelector(sel);
function fmtKRW(n){ return (Math.round(n)||0).toLocaleString("ko-KR") + "원"; }
async function apiGet(action){
  const res = await fetch(`${APPS_SCRIPT_URL}?action=${encodeURIComponent(action)}`);
  return res.json();
}
async function apiPost(payload){
  const res = await fetch(APPS_SCRIPT_URL, {
    method:"POST",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify(payload)
  });
  return res.json();
}
function setActiveTab(name){
  document.querySelectorAll(".tab").forEach(t=>{
    t.classList.toggle("active", t.dataset.tab===name);
  });

  const viewSchedule = document.querySelector("#viewSchedule");
  const viewRules    = document.querySelector("#viewRules");
  const viewSouvenir = document.querySelector("#viewSouvenir");

  if (viewSchedule) viewSchedule.style.display = name==="schedule" ? "" : "none";
  if (viewRules)    viewRules.style.display    = name==="rules" ? "" : "none";
  if (viewSouvenir) viewSouvenir.style.display = name==="souvenir" ? "" : "none";

  // 탭 들어갈 때 각 화면 렌더
  if (name === "schedule") renderSchedule?.();
  if (name === "rules")    renderRules?.();
  if (name === "souvenir") renderSouvenir?.();
}

  
  // ✅ 일정 탭에서는 숨김
  const meCard = document.querySelector("#meCard");
  if (meCard) meCard.style.display = (name === "schedule") ? "none" : "";

  if (name === "schedule") renderSchedule();
  if (name === "packing")  renderPacking();
 if (name === "settle") {
  const el = document.querySelector("#viewSettle");
  if (el) {
    el.innerHTML = `<div class="card"><b>정산 탭 클릭됨 ✅</b></div>`;
  } else {
    alert("#viewSettle 못 찾음");
  }
  console.log("[DEBUG] settle tab clicked", el);
}


// --- init ---
function initMe(){
  const sel = $("#meSelect");
  sel.innerHTML = PEOPLE.map(p=>`<option value="${p}">${p}</option>`).join("");
  const saved = localStorage.getItem("me") || PEOPLE[0];
  sel.value = saved;
  sel.addEventListener("change", ()=>localStorage.setItem("me", sel.value));
}
document.querySelectorAll(".tab").forEach(btn=>{
  btn.addEventListener("click", ()=>setActiveTab(btn.dataset.tab));
});

// --- SCHEDULE (placeholder: 너 일정 넣을 자리) ---
const scheduleData = {
  title: "Day5 일정",
  days: [
    {
      label: "Day 1",
      items: [
        {
          time: "16:30",
          title: "인천공항 도착",
          note: "선발대: 영수, 한나, 아라\n후발대: 연실, 유나, 건",
          mapUrl: ""
        },
        {
          time: "19:25 - 21:15",
          title: "인천 → 오사카 공항",
          note: "",
          mapUrl: ""
        },
        {
          time: "21:15 - 22:30",
          title: "→ 카몬 호텔 난바",
          note: "• <a href='https://blog.naver.com/bbh4313/224127071321' target='_blank'>ATM 위치</a>\n• 라피트 막차 시간 : 22시 55분",
          mapUrl: ""
        },
        {
          time: "22:30",
          title: "호텔 도착",
          mapUrl: "https://maps.google.com/?q=...",
          image: "./images/kamon-hotel-namba.png",
          note: "• 숙박세 인당 ¥200\n01- 영수, 연실, 한나, 유나\n02- 아라, 현아, 건"
        }

      ]
    },
{
  label: "Day 2",
  items: [
    {
      time: "06:30 - 08:00",
      title: "기상 & 준비"
    },
    {
      time: "08:00 - 09:30",
      title: "난바역 → 교토역",
      mapUrl: "https://www.jorudan.co.jp/time/to/%E4%BA%AC%E9%83%BD_%E5%A4%A7%E9%98%AA/?Dym=202602&Ddd=18&r=%EF%BC%AA%EF%BC%B2%E4%BA%AC%E9%83%BD%E7%B7%9A",
      note: "• 신쾌속 08:56편 출발\n• JR 신쾌속 소요시간 : 약 30분\n• 교통비 : ¥820\n• <a href=\"https://www.jorudan.co.jp/time/to/%E4%BA%AC%E9%83%BD_%E5%A4%A7%E9%98%AA/?Dym=202602&Ddd=18&r=%EF%BC%AA%EF%BC%B2%E4%BA%AC%E9%83%BD%E7%B7%9A\" target=\"_blank\">신쾌속 시간표</a>"
    },
    {
      time: "09:30 - 10:00",
      title: "호텔 체크인", 
      image: "images/Rinn Kujofujinoki Central.png",
      mapUrl: "https://maps.app.goo.gl/5G3xC3bxrmSEVxULA",
      note: "• 숙박세 : ¥400"
    },
    {
      time: "10:30 - 11:00",
      title: "→ 타이쇼 하나나",
      mapUrl: "https://maps.app.goo.gl/fauUxg3ejMhf2pWj7",
      note: "• 예약 필요(유나)"
    },
    {
      time: "11:00 - 12:00",
      title: "타이쇼 하나나 식사",
      image: "images/HANANA.jpg",
      note: "• 현금결제만 가능\n• <a href='https://blog.naver.com/jiyoo9697/223874041269' target='_blank' rel='noopener noreferrer'>타이쇼 하나나 정보</a>"
    }
    ,
    {
      time: "12:00 - 14:30",
      title: "아라시야마",
      image: "images/Arashiyama.png",
      note:
        "① 아라시야마 치쿠린\n" +
        "② 아라시야마 대나무길\n" +
        "③ 텐류지\n" +
        "④ 아라비카 교토 아라시야마점\n" +
        "⑤ 도게츠 교\n" +
        "⑥ 미피 사쿠라 키친 아라시야마점\n" +
        "⑦ 리락쿠마 카페 교토 아라시야마점\n" +
        "⑧ 코토이모 본점(당고)"
    },
    {
      time: "14:30 - 15:00",
      title: "🚕 니시키 시장",
      mapUrl: "https://maps.app.goo.gl/QnAwAYi3LdAShYQW6",
      note: "• 택시 도착 지점은 산리오 갤러리 교토로 찍기\n• 예상 택시비 : 30,000원"
    },
    {
      time: "15:00 - 17:00",
      title: "니시키 시장 근처",
      image: "images/nishiki.png",
      note:
        "[SOU・SOU]\n" +
        "• SOU・SOU 타비\n" +
        "• SOUSOU 이세모멘\n" +
        "• SOU・SOU kikoromo\n" +
        "• SOU・SOU hotei\n" +
        "• SOU・SOU Okurimono\n" +
        "• SOU・SOU Yousou.\n" +
        "• SOU・SOU deportare\n\n" +
        "[키디랜드]\n" +
        "• 키디랜드 교토시조가와라마치점\n\n" +
        "<span style='color:#ff5a7a'>[니시키시장 유의사항]</span>\n" +
        "• 시장 내 ‘먹으면서 걷기’ 금지\n" +
        "• 구입한 가게 앞/가게 안에서 시식 가능"
    },
    {
      time: "17:00 - 18:30",
      title: "레드락 스테이크 덮밥 / 장어덮밥",
      image: "images/kyo-unawa.jpg",
      note: "• 레드락 : 현금결제만 가능\n• <a href='https://maps.app.goo.gl/oPyQgQeqjbsGnu8c6 target='_blank' rel='noopener noreferrer'>레드락 스테이크 덮밥</a>\n•<a href='https://maps.app.goo.gl/TmYzrRZQdTyZWosg8'_blank' rel='noopener noreferrer'> 쿄우나와</a> "
    },
    {
      time: "18:30 - 19:30",
      title: "다이소 & StandardProducts",
      note: "• 각 매장 30분 제한"
    },
    {
      time: "19:30 - 20:00",
      title: "🚕 → 숙소",
      note: "• 예상 택시비 : 10,000원"
    },
    {
      time: "20:00 -",
      title: "→ 이온몰",
      image: "images/aeonmall.jpeg",
      note: "• 다이소 21시 마감\n• 마켓 가든 22시 마감"
    }
  ]
},
    
   {
  label: "Day 3",
  items: [
    { time: "08:20",
     title: "준비 & 아침식사" },

    { time: "08:20 - 09:00",
     title: "🚎 > 청수사",
     mapUrl: "https://maps.app.goo.gl/hLp5gqqzgsGzZ5NV6",
     note: "• 예상 버스비 : ¥230"
    },

    { time: "09:00 - 12:30",
      title: "청수사, 산넨자카, 니넨자카",
      image: "images/기요미즈데라.jpeg",
      note:
      "• 청수사 입장료: ¥500, 현금만 가능\n" +
      "• 청수사 근처: mochi mochi, 유바치즈, 월하미인\n\n" +
      "<span style='color:#ff5a7a'>[니넨자카 의미]</span>\n" +
      "• 니넨(2년)자카(고개, 언덕)\n" +
      "• 오르다 넘어지면 2년 안에 좋지 않은 일이 생긴다는 속설\n" +
      "• 본래 의미는 무사함, 평안, 출산의 안녕을 기원하는 길"
    },

    { time: "12:30 - 13:30",
      title: "점심 京料理 花かがみ",
      mapUrl: "https://maps.app.goo.gl/vJm4CRXN7cjiCfPu9",
      note: "• 예약확정: 12:30\n• 여행 2일 전 다시 이메일 드리기\n• <a href='https://www.hanakagami.co.jp/contact/'_blank' rel='noopener noreferrer'>京料理 花かがみ</a>"
    },

    { time: "13:30 - 14:00",
     title: "→ 오카페 교토",
     mapUrl: "https://maps.app.goo.gl/ZZRCgS4z8PbPRuC2A"    
    },
    
    { time: "14:00 - 15:00",
      title: "오카페 교토",
      image: "images/Okaffe Kyoto.jpeg"    
    },

    {
      time: "15:00 - 17:00",
      title: "문구점 투어",
      mapUrl: "https://maps.app.goo.gl/FeJypkoKBEw5My9j8",
      image: "images/SCR-20260107-bnzl.jpeg",
      note:
        "① 웰더(베이커리)\n" +
        "② 휴먼 메이드 1928\n" +
        "③ Stationery Shop tag\n" +
        "④ 규쿄도 문구\n" +
        "⑤ 그란디루 오이케점 (베이커리)\n" +
        "⑥ Para lucirse\n" +
        "⑦ 表現社 cozyca products shop HIRAETH\n" +
        "⑧ forme.(フォルム)\n" +
        "⑨ 伊藤文祥堂(이토문방구)\n"
    },

    { time: "17:00 - 17:30",
     title: "🚕 → Kaneko",
     mapUrl: "https://maps.app.goo.gl/pFwxx3v1cmQZxEAG9",
     image: "images/Kaneko.jpeg",
     note: "• 예상 택시비: 10,000원"
    },

    {
      time: "17:30 - 19:00",
      title: "Kaneko",
      note: "• <a href='https://www.instagram.com/kaneko_kyoto?igsh=Nmg1Y2Q0NWljZGI3&utm_source=qr'_blank' rel='noopener noreferrer'>인스타그램</a>",
      images: [
        // ✅ 여기 2개 이미지만 “안 잘리게” 옵션 추가
        { src: "images/kaneko-confirm-1.png", alt: "Kaneko 예약확정서 1", fit: "contain" },
        { src: "images/kaneko-confirm-2.png", alt: "Kaneko 예약확정서 2", fit: "contain" }
      ]
    },

    { time: "19:00 - 19:30",
     title: "🚎 > 숙소",
     note: "• 예상 버스비: ¥230"
    },

    {
      time: "20:00 -",
      title: "센토 Hinode-yu",
      mapUrl: "https://maps.app.goo.gl/BfUAtyudWqumkp4dA",
      image: "images/Hinode-yu.jpeg",
      note: "• 입장료: ¥550\n• <a href='https://blog.naver.com/ohihelloj/223247044183'_blank' rel='noopener noreferrer'>센토 후기</a>"
    }
  ]
},
    { label: "Day 4", items: [] },
    { label: "Day 5", items: [] }
  ]
};

// TODO: 네 일정 넣고 싶으면 items에 push하면 됨
function renderSchedule() {
  const root = $("#viewSchedule");

  root.innerHTML = `
    <div class="card">
      <div style="font-size:18px;font-weight:900;">전체 일정</div>
      <div class="hint">Day 1~5 탭 UI는 다음 단계에서 넣고, 지금은 리스트로 먼저 보여줍니다.</div>
    </div>

    ${scheduleData.days.map(day => {
      const dayBody = (day.items.length === 0)
        ? `<div class="hint" style="margin-top:10px;">아직 일정이 없습니다.</div>`
        : `
          <div class="timeline">
            ${day.items.map(item => {
              const noteHtml = item.note
                ? `<div class="noteBox">${item.note.replace(/\n/g, "<br>")}</div>`
                : "";

              // ✅ 이미지 렌더: item.image(단일) + item.images(복수) 둘 다 지원
const imageHtml = (() => {
  // 1) 복수 이미지 (images 배열)
  if (Array.isArray(item.images) && item.images.length) {
    return item.images.map(img => {
      const fit = String(img.fit || "").toLowerCase();
      const mediaClass = fit === "contain" ? "media media--contain" : "media";
      const imgClass   = fit === "contain" ? "mediaImg mediaImg--contain" : "mediaImg";
      return `
        <div class="${mediaClass}">
          <img class="${imgClass}"
               src="${img.src}"
               alt="${img.alt || item.title || ""}"
               loading="lazy">
        </div>
      `;
    }).join("");
  }

  // 2) 단일 이미지 (image 문자열)
  if (item.image) {
    return `
      <div class="media">
        <img class="mediaImg" src="${item.image}" alt="${item.title || ""}" loading="lazy">
      </div>
    `;
  }

  return "";
})();


              const mapHtml = item.mapUrl
                ? `
                  <a class="mapIconBtn"
                     href="${item.mapUrl}"
                     target="_blank"
                     rel="noopener noreferrer"
                     aria-label="지도 열기">🗺️</a>
                `
                : "";

              return `
                <div class="tItem">
                  <div class="tTop">
                    ${item.time ? `<span class="timeChip">${item.time}</span>` : ""}
                    <span class="placeText">${item.title || ""}</span>
                    ${mapHtml}
                  </div>
                  ${imageHtml}
                  ${noteHtml}
                </div>
              `;
            }).join("")}
          </div>
        `;

      return `
        <div class="card dayCard">
          <div style="font-size:20px;font-weight:950;letter-spacing:-0.2px;">${day.label}</div>
          ${dayBody}
        </div>
      `;
    }).join("")}
  `;
}
 
function renderRules() {
  const root = document.querySelector("#viewRules");
  if (!root) return;

  root.innerHTML = `
    <div class="card">
      <div style="font-size:18px; font-weight:900;">여행 규칙</div>
      <div class="hint" style="margin-top:8px;">여기에 우리 여행 규칙을 적어두면 돼요.</div>
    </div>

    <div class="card">
      <ul style="margin:0; padding-left:18px; line-height:1.8;">
        <li>아침 집합 시간 지키기</li>
        <li>지각/이탈 시 공유하기</li>
        <li>사진 공유는 단톡/앨범에 모으기</li>
        <li>예산/지출은 당일 간단 기록</li>
      </ul>
    </div>
  `;
}

function renderSouvenir() {
  const root = document.querySelector("#viewSouvenir");
  if (!root) return;

  root.innerHTML = `
    <div class="card">
      <div style="font-size:18px; font-weight:900;">기념품 리스트</div>
      <div class="hint" style="margin-top:8px;">사야 할 것 / 살 후보 / 산 것 정리용</div>
    </div>

    <div class="card">
      <div style="font-weight:900; margin-bottom:8px;">살 것</div>
      <ul style="margin:0; padding-left:18px; line-height:1.8;">
        <li>면세/드럭스토어</li>
        <li>과자/특산품</li>
        <li>가족 선물</li>
      </ul>
    </div>

    <div class="card">
      <div style="font-weight:900; margin-bottom:8px;">후보</div>
      <ul style="margin:0; padding-left:18px; line-height:1.8;">
        <li>생각나는대로 추가</li>
      </ul>
    </div>

    <div class="card">
      <div style="font-weight:900; margin-bottom:8px;">산 것</div>
      <div class="hint">여기에 구매 완료 내역을 옮겨 적기</div>
    </div>
  `;
}

setActiveTab("schedule");
renderSchedule?.();
