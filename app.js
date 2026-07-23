// ============================================================
// Application logic: state machine, rendering, scoring,
// session persistence (no PII), LT/EN language switching.
// ============================================================

const STORAGE_KEY = "reflectionSession.v1";
const SESSION_MAX_AGE_DAYS = 30;

const state = {
  lang: "lt",
  role: null,
  order: [],          // shuffled item ids
  index: 0,           // current question index
  answers: {},         // { itemId: rawScore(1-5) }
  screen: "intro"
};

function t() { return DATA.ui[state.lang]; }

function shuffledOrder() {
  const ids = DATA.items.map(i => i.id);
  for (let i = ids.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [ids[i], ids[j]] = [ids[j], ids[i]];
  }
  return ids;
}

function itemById(id) {
  return DATA.items.find(i => i.id === id);
}

// ---------- session persistence (no personal data) ----------

function saveSession() {
  try {
    const payload = {
      lang: state.lang,
      role: state.role,
      order: state.order,
      index: state.index,
      answers: state.answers,
      lastUpdated: Date.now()
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch (e) { /* storage unavailable — fail silently, nothing critical is lost */ }
}

function loadSession() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const payload = JSON.parse(raw);
    const ageDays = (Date.now() - payload.lastUpdated) / (1000 * 60 * 60 * 24);
    if (ageDays > SESSION_MAX_AGE_DAYS) {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }
    return payload;
  } catch (e) {
    return null;
  }
}

function clearSession() {
  try { localStorage.removeItem(STORAGE_KEY); } catch (e) {}
}

// ---------- screen switching ----------

function showScreen(id) {
  document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
  document.getElementById(id).classList.add("active");
  state.screen = id;
  window.scrollTo({ top: 0, behavior: "instant" in window ? "instant" : "auto" });
}

// ---------- render: static UI strings ----------

function renderStaticText() {
  const s = t();
  document.documentElement.lang = state.lang;
  document.getElementById("langToggle").textContent = s.langToggle;

  document.getElementById("heroTitle").textContent = s.heroTitle;
  document.getElementById("heroSubtitle").textContent = s.heroSubtitle;
  document.getElementById("disclaimerText").textContent = s.disclaimer;
  document.getElementById("startBtn").textContent = s.startButton;

  document.getElementById("roleQuestionText").textContent = s.roleQuestion;

  document.getElementById("scaleMinLabel").textContent = s.scaleMin;
  document.getElementById("scaleMaxLabel").textContent = s.scaleMax;
  document.getElementById("prevBtn").textContent = s.prevButton;

  document.getElementById("transitionTitle").textContent = s.transitionTitle;
  document.getElementById("transitionText").textContent = s.transitionText;
  document.getElementById("showResultsBtn").textContent = s.transitionButton;

  document.getElementById("resultsTitle").textContent = s.resultsTitle;
  document.getElementById("resultsIntro").textContent = s.resultsIntro;
  document.getElementById("topAreasHeading").textContent = s.topAreasHeading;
  document.getElementById("downloadPdfBtn").textContent = s.downloadPdfButton;
  document.getElementById("restartBtn").textContent = s.restartButton;
  document.getElementById("footerNote").textContent = s.footer;

  renderRoleOptions();
  updateNextButtonLabel();
}

function renderRoleOptions() {
  const s = t();
  const container = document.getElementById("roleOptions");
  container.innerHTML = "";
  s.roleOptions.forEach((label, idx) => {
    const btn = document.createElement("button");
    btn.className = "role-option";
    btn.type = "button";
    btn.textContent = label;
    btn.setAttribute("aria-pressed", state.role === idx ? "true" : "false");
    btn.addEventListener("click", () => {
      state.role = idx;
      saveSession();
      goToQuestions();
    });
    container.appendChild(btn);
  });
}

function updateNextButtonLabel() {
  const s = t();
  const isLast = state.index === state.order.length - 1;
  document.getElementById("nextBtn").textContent = isLast ? s.finishButton : s.nextButton;
}

// ---------- question rendering ----------

function renderQuestion() {
  const s = t();
  const itemId = state.order[state.index];
  const item = itemById(itemId);

  document.getElementById("questionText").textContent = item.text[state.lang];
  document.getElementById("progressLabel").textContent = s.progressLabel(state.index + 1, state.order.length);
  document.getElementById("progressFill").style.width =
    ((state.index) / state.order.length * 100) + "%";

  const row = document.getElementById("scaleRow");
  row.innerHTML = "";
  const currentAnswer = state.answers[itemId];
  for (let val = 1; val <= 5; val++) {
    const btn = document.createElement("button");
    btn.className = "scale-option";
    btn.type = "button";
    btn.textContent = val;
    btn.setAttribute("aria-pressed", currentAnswer === val ? "true" : "false");
    btn.addEventListener("click", () => selectAnswer(itemId, val));
    row.appendChild(btn);
  }

  document.getElementById("prevBtn").style.visibility = state.index === 0 ? "hidden" : "visible";
  document.getElementById("nextBtn").disabled = currentAnswer === undefined;
  updateNextButtonLabel();
}

function selectAnswer(itemId, val) {
  state.answers[itemId] = val;
  saveSession();
  renderQuestion();
}

function goToQuestions() {
  showScreen("screen-question");
  renderQuestion();
}

function nextQuestion() {
  if (state.index < state.order.length - 1) {
    state.index++;
    saveSession();
    renderQuestion();
  } else {
    showScreen("screen-transition");
  }
}

function prevQuestion() {
  if (state.index > 0) {
    state.index--;
    saveSession();
    renderQuestion();
  }
}

// ---------- scoring ----------

function computeCategoryScores() {
  const scores = {};
  DATA.categories.forEach(cat => {
    const items = DATA.items.filter(i => i.categoryId === cat.id);
    let sum = 0;
    items.forEach(i => {
      const raw = state.answers[i.id];
      sum += i.inverted ? (6 - raw) : raw;
    });
    scores[cat.id] = sum / items.length;
  });
  return scores;
}

function zoneFor(score) {
  return DATA.scoring.zones.find(z => score <= z.max) || DATA.scoring.zones[DATA.scoring.zones.length - 1];
}

// ---------- results rendering ----------

function renderResults() {
  const s = t();
  const scores = computeCategoryScores();

  const barsContainer = document.getElementById("categoryBars");
  barsContainer.innerHTML = "";

  DATA.categories.forEach(cat => {
    const score = scores[cat.id];
    const pct = ((score - 1) / 4) * 100;
    const zone = zoneFor(score);
    const isHigh = score >= 3.8;

    const row = document.createElement("div");
    row.className = "category-row";
    row.innerHTML = `
      <div class="category-head">
        <span class="category-name">${cat.name[state.lang]}</span>
        <span class="category-score">${score.toFixed(1)} / 5.0</span>
      </div>
      <div class="bar-axis">
        <div class="bar-fill ${isHigh ? "is-clay" : ""}" style="width:${pct}%"></div>
      </div>
      <div class="bar-mirror bar-fill ${isHigh ? "is-clay" : ""}" style="width:${pct}%"></div>
      <div class="category-label">${zone.label[state.lang]}</div>
    `;
    barsContainer.appendChild(row);
  });

  const topAreasList = document.getElementById("topAreasList");
  topAreasList.innerHTML = "";
  const ranked = [...DATA.categories]
    .sort((a, b) => scores[b.id] - scores[a.id])
    .slice(0, DATA.scoring.topAreasCount);

  ranked.forEach(cat => {
    const div = document.createElement("div");
    div.className = "top-area-item";
    div.innerHTML = `
      <div class="top-area-name">${cat.name[state.lang]}</div>
      <span class="reflection-label">${s.reflectionLabel}</span>
      <div class="reflection-question">${cat.reflection[state.lang]}</div>
    `;
    topAreasList.appendChild(div);
  });

  showScreen("screen-results");
}

// ---------- resume banner ----------

function checkResumableSession() {
  const saved = loadSession();
  const hasProgress = saved && Object.keys(saved.answers || {}).length > 0 && saved.order && saved.order.length > 0;
  if (!hasProgress) return;

  const s = t();
  const banner = document.getElementById("resumeBanner");
  banner.style.display = "flex";
  document.getElementById("resumeText").textContent = s.resumeText(Object.keys(saved.answers).length, saved.order.length);
  document.getElementById("discardBtn").textContent = s.discardButton;
  document.getElementById("resumeBtn").textContent = s.resumeButton;

  document.getElementById("resumeBtn").onclick = () => {
    state.lang = saved.lang || state.lang;
    state.role = saved.role;
    state.order = saved.order;
    state.answers = saved.answers;
    state.index = Math.min(saved.index, saved.order.length - 1);
    renderStaticText();
    banner.style.display = "none";
    goToQuestions();
  };
  document.getElementById("discardBtn").onclick = () => {
    clearSession();
    banner.style.display = "none";
  };
}

// ---------- init & events ----------

function startFresh() {
  state.role = null;
  state.order = shuffledOrder();
  state.index = 0;
  state.answers = {};
  clearSession();
  saveSession();
  showScreen("screen-role");
  renderRoleOptions();
}

function restartAll() {
  clearSession();
  state.role = null;
  state.order = [];
  state.index = 0;
  state.answers = {};
  showScreen("screen-intro");
}

function toggleLanguage() {
  state.lang = state.lang === "lt" ? "en" : "lt";
  saveSession();
  renderStaticText();
  if (state.screen === "screen-question") renderQuestion();
  if (state.screen === "screen-results") renderResults();
}

document.addEventListener("DOMContentLoaded", () => {
  renderStaticText();
  checkResumableSession();

  document.getElementById("langToggle").addEventListener("click", toggleLanguage);
  document.getElementById("startBtn").addEventListener("click", startFresh);
  document.getElementById("prevBtn").addEventListener("click", prevQuestion);
  document.getElementById("nextBtn").addEventListener("click", nextQuestion);
  document.getElementById("showResultsBtn").addEventListener("click", renderResults);
  document.getElementById("restartBtn").addEventListener("click", restartAll);
  document.getElementById("downloadPdfBtn").addEventListener("click", () => window.print());
});
