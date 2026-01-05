// 1) 여기에 너의 Apps Script Web App URL 붙여넣기
const APPS_SCRIPT_URL = "PASTE_YOUR_WEB_APP_URL_HERE";

// 2) 고정 데이터
const PEOPLE = ["영수","연실","한나","유나","아라","현아","건"];
const CATEGORIES = ["택시","식당","기념품","카페","편의점","베이커리"];
const DAYS = ["1","2","3","4","5"];

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
  $("#viewSchedule").style.display = name==="schedule" ? "" : "none";
  $("#viewPacking").style.display = name==="packing" ? "" : "none";
  $("#viewSettle").style.display = name==="settle" ? "" : "none";
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
  days: DAYS.map(d=>({label:`Day ${d}`, items: []}))
};
// TODO: 네 일정 넣고 싶으면 items에 push하면 됨
function renderSchedule(){
  const root = $("#viewSchedule");
  root.innerHTML = `
    <div class="card">
      <div style="font-size:18px;font-weight:900;">전체 일정</div>
      <div class="hint">Day 1~5 탭 UI는 다음 단계에서 넣고, 지금은 리스트로 먼저 보여줍니다.</div>
    </div>
    ${scheduleData.days.map(day=>`
      <div class="card">
        <div style="font-size:18px;font-weight:900;">${day.label}</div>
        ${day.items.length===0 ? `<div class="hint">아직 일정이 없습니다.</div>` :
          day.items.map(it=>`
            <div style="margin-top:10px;padding-top:10px;border-top:1px solid #eee;">
              <div style="font-weight:900;">${it.time||""} ${it.title||""}</div>
              <div>${it.note||""}</div>
              ${it.mapUrl?`<div style="margin-top:8px;"><a href="${it.mapUrl}" target="_blank">지도 열기</a></div>`:""}
            </div>
          `).join("")
        }
      </div>
    `).join("")}
  `;
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
