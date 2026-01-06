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
  const viewPacking  = document.querySelector("#viewPacking");
  const viewSettle   = document.querySelector("#viewSettle");

  if (viewSchedule) viewSchedule.style.display = name==="schedule" ? "" : "none";
  if (viewPacking)  viewPacking.style.display  = name==="packing" ? "" : "none";
  if (viewSettle)   viewSettle.style.display   = name==="settle" ? "" : "none";
  
  if (name === "schedule") renderSchedule();
  if (name === "packing")  renderPacking();
  if (name === "settle")   renderSettle();
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
      note: "•예약 필요(유나)"
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
    { label: "Day 3", items: [] },
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

              const imageHtml = item.image
                ? `
                  <div class="media">
                    <img class="mediaImg"
                      src="${item.image}"
                      alt="${item.title || ""}"
                      loading="lazy"
                    />
                  </div>
                `
                : "";

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
async function renderSettle() {
  const root = $("#viewSettle");
  if (!root) return;

  console.log("[renderSettle] called");

  // ✅ 1) 기본 UI(헤더/새로고침 버튼/컨테이너) 먼저 고정 렌더
  //    이후에는 아래 컨테이너들만 업데이트해서 버튼이 사라지지 않게 함
  root.innerHTML = `
    <div class="card">
      <div style="display:flex; align-items:center; justify-content:space-between; gap:10px;">
        <div style="font-size:18px; font-weight:900;">정산</div>
        <button id="btnRefreshSettle" class="btnOutline" style="padding:10px 12px;">새로고침</button>
      </div>
      <div class="hint">settled=TRUE 인 항목은 정산에서 제외됩니다.</div>
      <div id="settleStatus" class="hint" style="margin-top:10px;">불러오는 중...</div>
    </div>

    <div class="card">
      <div style="font-size:18px; font-weight:900; margin-bottom:10px;">누가 누구에게 얼마</div>
      <div id="settleTransfers"></div>
    </div>

    <div class="card">
      <div style="font-size:18px; font-weight:900; margin-bottom:10px;">상세 내역</div>
      <div id="settleDetails"></div>
    </div>
  `;

  // ✅ 버튼 이벤트는 "기본 UI 렌더 직후"에 연결
  const btn = $("#btnRefreshSettle");
  if (btn) btn.onclick = () => renderSettle();

  const elStatus = $("#settleStatus");
  const elTransfers = $("#settleTransfers");
  const elDetails = $("#settleDetails");

  try {
    // ✅ 2) API URL 미정의 방어 (이거면 100% 빈 화면/오류)
    if (typeof SETTLE_API_URL === "undefined" || !SETTLE_API_URL) {
      throw new Error("SETTLE_API_URL이 설정되어 있지 않습니다. app.js 상단 설정값을 확인하세요.");
    }

    // ✅ 3) fetch
    const url = `${SETTLE_API_URL}?action=settle`;
    console.log("[renderSettle] fetching:", url);

    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const data = await res.json();

    if (!data || !data.ok) {
      throw new Error("정산 데이터 형식이 올바르지 않습니다.");
    }

    // fx가 없어도 터지지 않게
    const fx = data.fx || {};
    if (elStatus) elStatus.textContent = "불러오기 완료";

    // ✅ 4) 상단: transfers
    const transfers = Array.isArray(data.transfers) ? data.transfers : [];
    const expenses  = Array.isArray(data.expenses)  ? data.expenses  : [];
    const transferHtml = transfers.length
      ? `
        <table>
          <thead>
            <tr><th>보내는 사람</th><th>받는 사람</th><th>금액(원)</th></tr>
          </thead>
          <tbody>
            ${transfers.map(t => `
              <tr>
                <td>${escapeHtml_(t.from || "")}</td>
                <td>${escapeHtml_(t.to || "")}</td>
                <td>${formatKrw_(t.amountKrw || 0)}</td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      `
      : `<div class="hint">정산할 내역이 없어요(모두 settled=TRUE이거나 지출이 비어있음).</div>`;

    if (elTransfers) elTransfers.innerHTML = transferHtml;

    // ✅ 5) 하단: expenses 상세
    const listHtml = expenses.length
      ? `
        <table>
          <thead>
            <tr>
              <th>date</th><th>day</th><th>title</th><th>paid_by</th><th>amount</th><th>participants</th>
            </tr>
          </thead>
          <tbody>
            ${expenses.map(x => `
              <tr>
                <td>${escapeHtml_(x.date || "")}</td>
                <td>${escapeHtml_(x.day || "")}</td>
                <td>${escapeHtml_(x.title || "")}</td>
                <td>${escapeHtml_(x.paid_by || "")}</td>
                <td>${formatKrw_(x.amount || 0)}</td>
                <td>${escapeHtml_(Array.isArray(x.participants) ? x.participants.join(", ") : "")}</td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      `
      : `<div class="hint">상세 내역이 없습니다.</div>`;

    if (elDetails) elDetails.innerHTML = listHtml;

  } catch (err) {
    console.error("[renderSettle] error:", err);

    if (elStatus) elStatus.textContent = "불러오기 실패";

    // ✅ 실패 메시지는 아래 “누가 누구에게 얼마” 영역에 보여주기
    if (elTransfers) {
      elTransfers.innerHTML = `
        <div class="hint" style="font-weight:900;">정산 불러오기 실패</div>
        <div class="hint">${escapeHtml_(String(err.message || err))}</div>
      `;
    }

    // 상세 영역은 비워둠
    if (elDetails) elDetails.innerHTML = `<div class="hint">-</div>`;
  }
}


function formatKrw_(n) {
  const num = Number(n) || 0;
  return num.toLocaleString("ko-KR");
}

function escapeHtml_(s) {
  return String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}


// --- PACKING ---
function renderPacking(packing){
  const root = $("#viewPacking");
  const me = $("#meSelect").value;

  const shared = packing.shared || [];
  const personalAll = packing.personal || [];
  const personal = personalAll.filter(x=>String(x.person)===me);

  root.innerHTML = `
    <div class="card">
      <div style="font-size:18px;font-weight:900;">공용 준비물</div>
      <div class="hint">샴푸처럼 공용은 “담당자”를 선택하면 됩니다.</div>
      ${shared.map(item=>`
        <div style="margin-top:10px;padding-top:10px;border-top:1px solid #eee;">
          <div style="font-weight:900;">${item.item}</div>
          <div class="row" style="align-items:center;margin-top:8px;">
            <select data-shared-owner="${item.item}">
              <option value="">담당자 선택</option>
              ${PEOPLE.map(p=>`<option value="${p}" ${String(item.owner)===p?"selected":""}>${p}</option>`).join("")}
            </select>
            <label style="display:flex;align-items:center;gap:8px;margin:0;">
              <input type="checkbox" data-shared-done="${item.item}" ${String(item.done).toLowerCase()==="true"||item.done===true?"checked":""}/>
              준비완료
            </label>
          </div>
        </div>
      `).join("")}
      <div style="margin-top:12px;">
        <input id="newSharedItem" placeholder="공용 준비물 추가 (예: 바디워시)" class="big"/>
        <button id="addSharedBtn" class="btn big" style="margin-top:10px;">공용 준비물 추가</button>
      </div>
    </div>

    <div class="card">
      <div style="font-size:18px;font-weight:900;">내 개인 준비물 (${me})</div>
      <div class="hint">옷처럼 개인용은 본인만 체크됩니다.</div>
      ${personal.map(item=>`
        <div style="margin-top:10px;padding-top:10px;border-top:1px solid #eee;">
          <label style="display:flex;align-items:center;gap:10px;margin:0;">
            <input type="checkbox" data-personal-done="${item.item}" ${String(item.done).toLowerCase()==="true"||item.done===true?"checked":""}/>
            <span style="font-weight:900;">${item.item}</span>
          </label>
        </div>
      `).join("")}
      <div style="margin-top:12px;">
        <input id="newPersonalItem" placeholder="개인 준비물 추가 (예: 여벌옷)" class="big"/>
        <button id="addPersonalBtn" class="btn big" style="margin-top:10px;">개인 준비물 추가</button>
      </div>
    </div>
  `;

  // bind shared changes
  shared.forEach(item=>{
    const ownerSel = document.querySelector(`[data-shared-owner="${item.item}"]`);
    const doneChk = document.querySelector(`[data-shared-done="${item.item}"]`);
    ownerSel.addEventListener("change", async ()=>{
      await apiPost({action:"set_shared_item", item:item.item, owner: ownerSel.value, done: doneChk.checked});
    });
    doneChk.addEventListener("change", async ()=>{
      await apiPost({action:"set_shared_item", item:item.item, owner: ownerSel.value, done: doneChk.checked});
    });
  });

  $("#addSharedBtn").addEventListener("click", async ()=>{
    const v = $("#newSharedItem").value.trim();
    if (!v) return;
    await apiPost({action:"set_shared_item", item:v, owner:"", done:false});
    $("#newSharedItem").value = "";
    await loadPacking();
  });

  // personal
  personal.forEach(item=>{
    const chk = document.querySelector(`[data-personal-done="${item.item}"]`);
    chk.addEventListener("change", async ()=>{
      await apiPost({action:"set_personal_item", person: me, item:item.item, done: chk.checked});
    });
  });
  $("#addPersonalBtn").addEventListener("click", async ()=>{
    const v = $("#newPersonalItem").value.trim();
    if (!v) return;
    await apiPost({action:"set_personal_item", person: me, item:v, done:false});
    $("#newPersonalItem").value = "";
    await loadPacking();
  });
}

async function loadPacking(){
  const data = await apiGet("packing");
  if (!data.ok) { alert(data.error); return; }
  renderPacking(data.packing);
}

// --- SETTLE ---
function renderSettle(summary){
  const root = $("#viewSettle");
  const fx = summary.fx || 0;

  root.innerHTML = `
    <div class="card">
      <div style="font-size:18px;font-weight:900;">정산</div>
      <div class="hint">기준 통화: 원(KRW) / JPY는 환율(하루 1회)로 자동 환산됩니다.</div>
      <div class="hint">오늘 적용 환율(JPY→KRW): ${fx ? fx.toFixed(4) : "아직 없음 (runDailyFx 1회 실행 필요)"} </div>
    </div>

    <div class="card">
      <div style="font-size:18px;font-weight:900;">지출 추가</div>

      <label>카테고리</label>
      <div class="pill" id="catPill"></div>

      <label>금액</label>
      <input id="amt" type="number" inputmode="numeric" placeholder="예: 3200" class="big"/>

      <label>통화</label>
      <div class="pill" id="ccyPill"></div>

      <label>결제자</label>
      <select id="payer" class="big">${PEOPLE.map(p=>`<option value="${p}">${p}</option>`).join("")}</select>

      <label>Day</label>
      <select id="day" class="big">${DAYS.map(d=>`<option value="${d}">${d}</option>`).join("")}</select>

      <label>분배 방식</label>
      <div class="pill" id="splitPill"></div>

      <label>참여자(포함자 선택)</label>
      <div class="row" id="partBox"></div>

      <label>메모(선택)</label>
      <input id="note" placeholder="예: 공항 → 호텔 택시" class="big"/>

      <button id="addExpenseBtn" class="btn big" style="margin-top:12px;">등록</button>
    </div>

    <div class="card">
      <div style="font-size:18px;font-weight:900;">사람별 정산</div>
      <table>
        <thead><tr><th>이름</th><th>낸 돈</th><th>써야 하는 돈</th><th>정산</th></tr></thead>
        <tbody>
          ${(summary.balance||[]).map(b=>`
            <tr>
              <td style="font-weight:900;">${b.person}</td>
              <td>${fmtKRW(b.paidKrw)}</td>
              <td>${fmtKRW(b.owedKrw)}</td>
              <td style="font-weight:900;">${b.netKrw>=0?`받을 ${fmtKRW(b.netKrw)}`:`낼 ${fmtKRW(-b.netKrw)}`}</td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>

    <div class="card">
      <div style="font-size:18px;font-weight:900;">자동 송금 리스트</div>
      ${(summary.transfers||[]).length===0
        ? `<div class="hint">아직 송금할 내역이 없습니다.</div>`
        : `<table>
            <thead><tr><th>보내는 사람</th><th>받는 사람</th><th>금액</th></tr></thead>
            <tbody>
              ${summary.transfers.map(t=>`
                <tr>
                  <td style="font-weight:900;">${t.from}</td>
                  <td style="font-weight:900;">${t.to}</td>
                  <td style="font-weight:900;">${fmtKRW(t.amountKrw)}</td>
                </tr>
              `).join("")}
            </tbody>
          </table>`
      }
      <button id="refreshSummary" class="btnOutline big" style="margin-top:12px;">정산 새로고침</button>
    </div>
  `;

  // Pills
  const catPill = $("#catPill");
  catPill.innerHTML = CATEGORIES.map((c,i)=>`<button data-cat="${c}" class="${i===0?'on':''}">${c}</button>`).join("");
  const ccyPill = $("#ccyPill");
  ccyPill.innerHTML = [`KRW`,`JPY`].map((c,i)=>`<button data-ccy="${c}" class="${i===0?'on':''}">${c}</button>`).join("");
  const splitPill = $("#splitPill");
  splitPill.innerHTML = [`DUTCH`,`CUSTOM`].map((c,i)=>`<button data-split="${c}" class="${i===0?'on':''}">${c==='DUTCH'?'더치페이(균등)':'포함자 선택'}</button>`).join("");

  // Participants checkboxes (default all)
  const partBox = $("#partBox");
  partBox.innerHTML = PEOPLE.map(p=>`
    <label style="display:flex;align-items:center;gap:8px;margin:0;">
      <input type="checkbox" value="${p}" checked />
      <span style="font-weight:900;">${p}</span>
    </label>
  `).join("");

  // Defaults
  $("#payer").value = localStorage.getItem("me") || PEOPLE[0];

  // Toggle handlers
  function setOn(containerSel, attr){
    document.querySelectorAll(containerSel + " button").forEach(b=>{
      b.addEventListener("click", ()=>{
        document.querySelectorAll(containerSel + " button").forEach(x=>x.classList.remove("on"));
        b.classList.add("on");
      });
    });
  }
  setOn("#catPill","data-cat");
  setOn("#ccyPill","data-ccy");
  setOn("#splitPill","data-split");

  // Add expense
  $("#addExpenseBtn").addEventListener("click", async ()=>{
    const category = document.querySelector("#catPill button.on").dataset.cat;
    const currency = document.querySelector("#ccyPill button.on").dataset.ccy;
    const splitType = document.querySelector("#splitPill button.on").dataset.split;
    const amount = Number($("#amt").value);
    const payer = $("#payer").value;
    const day = $("#day").value;
    const note = $("#note").value.trim();

    const participants = Array.from(document.querySelectorAll("#partBox input[type=checkbox]"))
      .filter(x=>x.checked).map(x=>x.value);

    if (!(amount>0)) return alert("금액을 입력하세요.");
    if (participants.length < 1) return alert("참여자를 최소 1명 선택하세요.");

    const resp = await apiPost({
      action:"add_expense",
      category, amount, currency, payer, participants, splitType, day, note
    });
    if (!resp.ok) return alert(resp.error);

    $("#amt").value = "";
    $("#note").value = "";
    await loadSummary();
    alert("등록 완료");
  });

  $("#refreshSummary").addEventListener("click", loadSummary);
}

async function loadSummary(){
  const data = await apiGet("summary");
  if (!data.ok) { alert(data.error); return; }
  renderSettle(data);
}

// --- boot ---
(async function boot(){
  initMe();
  renderSchedule();
  const status = await apiGet("status");
  if (!status.ok) alert(status.error);

  await loadPacking();
  await loadSummary();
})();

// 탭 전환 + 렌더
function showTab(tab) {
  // 화면 토글
  $("#viewSchedule").style.display = tab === "schedule" ? "block" : "none";
  $("#viewPacking").style.display  = tab === "packing"  ? "block" : "none";
  $("#viewSettle").style.display   = tab === "settle"   ? "block" : "none";

  // 버튼 active 토글
  document.querySelectorAll(".tab").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.tab === tab);
  });

  // 탭별 렌더 호출
  if (tab === "schedule") renderSchedule();
  if (tab === "packing")  renderPacking?.(); // renderPacking 있으면 실행
  if (tab === "settle")   renderSettle();    // ✅ 이게 핵심
}

// 탭 버튼 클릭 이벤트 연결
document.querySelectorAll(".tab").forEach((btn) => {
  btn.addEventListener("click", () => showTab(btn.dataset.tab));
});

// 최초 1회 기본 탭 렌더
showTab("schedule");

