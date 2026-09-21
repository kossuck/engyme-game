const DEFAULT_SETTINGS = {
  completeScore: 10,
  wrongPenalty: 5,
  winScore: 200,
  missLimit: 5,
  spawnInterval: 4,
  speedMultiplier: 1,
  progressiveDifficulty: true,
  nutrientRatio: { carb: 1, protein: 1, fat: 1 },
  requireFatOrder: true,
  hintMode: true,
  soundEnabled: true,
  keys: {
    saliva: 'KeyQ',
    gastric: 'KeyZ',
    bile: 'BracketRight',
    pancreas: 'Slash',
  },
  zoneTimes: {
    mouth: 4,
    esophagus: 1.5,
    stomach: 5,
    smallIntestine: 7,
    largeIntestine: 2,
  },
};

const ROLES = {
  saliva: { label: '침 분비', key: 'KeyQ', zone: 'mouth', zoneLabel: '입', nutrientLabel: '탄수화물', secretion: '침', enzyme: '아밀레이스', color: '#5fc8ff', short: '침' },
  gastric: { label: '위액 분비', key: 'KeyZ', zone: 'stomach', zoneLabel: '위', nutrientLabel: '단백질', secretion: '위액', enzyme: '펩신', color: '#8ad76d', short: '위액' },
  bile: { label: '쓸개즙 분비', key: 'BracketRight', zone: 'smallIntestine', zoneLabel: '작은창자', nutrientLabel: '지방', secretion: '쓸개즙', enzyme: '효소 없음', color: '#ffb95c', short: '쓸개즙' },
  pancreas: { label: '이자액 분비', key: 'Slash', zone: 'smallIntestine', zoneLabel: '작은창자', nutrientLabel: '탄수화물·단백질·지방', secretion: '이자액', enzyme: '아밀레이스·트립신·라이페이스', color: '#d58cf2', short: '이자액' },
};

const STAGE_RULES = {
  carb: [
    { role: 'saliva', product: '엿당' },
    { role: 'pancreas', product: '포도당' },
  ],
  protein: [
    { role: 'gastric', product: '작은 조각' },
    { role: 'pancreas', product: '아미노산' },
  ],
  fat: [
    { role: 'bile', product: '작은 기름 알갱이' },
    { role: 'pancreas', product: '지방산+모노글리세리드' },
  ],
};

const DIGESTIVE_ROUTE_POINTS = [
  { zone: 'mouth', points: [{ x: 148, y: 178 }, { x: 174, y: 176 }, { x: 198, y: 185 }, { x: 214, y: 205 }] },
  { zone: 'esophagus', points: [{ x: 214, y: 205 }, { x: 214, y: 250 }, { x: 214, y: 300 }, { x: 216, y: 344 }] },
  { zone: 'stomach', points: [{ x: 216, y: 344 }, { x: 250, y: 360 }, { x: 300, y: 362 }, { x: 350, y: 380 }, { x: 376, y: 416 }, { x: 374, y: 460 }, { x: 354, y: 494 }, { x: 318, y: 512 }, { x: 274, y: 505 }, { x: 242, y: 484 }, { x: 226, y: 452 }] },
  { zone: 'smallIntestine', points: [{ x: 226, y: 452 }, { x: 202, y: 464 }, { x: 180, y: 484 }, { x: 170, y: 508 }, { x: 178, y: 530 }, { x: 204, y: 545 }, { x: 244, y: 550 }, { x: 290, y: 550 }, { x: 334, y: 542 }, { x: 366, y: 524 }, { x: 382, y: 500 }, { x: 388, y: 536 }, { x: 378, y: 568 }, { x: 354, y: 590 }, { x: 314, y: 602 }, { x: 270, y: 600 }, { x: 230, y: 590 }, { x: 198, y: 570 }, { x: 180, y: 548 }, { x: 176, y: 584 }, { x: 186, y: 620 }, { x: 212, y: 645 }, { x: 252, y: 658 }, { x: 298, y: 658 }, { x: 340, y: 648 }, { x: 370, y: 628 }, { x: 386, y: 602 }, { x: 392, y: 640 }, { x: 382, y: 676 }, { x: 356, y: 700 }, { x: 316, y: 712 }, { x: 274, y: 708 }, { x: 236, y: 694 }, { x: 210, y: 670 }, { x: 202, y: 706 }, { x: 214, y: 738 }, { x: 240, y: 760 }, { x: 282, y: 770 }, { x: 322, y: 764 }, { x: 346, y: 746 }] },
];

const FOODS = [
  { nutrient: 'carb', emoji: '🍚', name: '밥' },
  { nutrient: 'carb', emoji: '🍞', name: '빵' },
  { nutrient: 'carb', emoji: '🥔', name: '감자' },
  { nutrient: 'protein', emoji: '🥚', name: '달걀' },
  { nutrient: 'protein', emoji: '🐟', name: '생선' },
  { nutrient: 'fat', emoji: '🥓', name: '베이컨' },
  { nutrient: 'fat', emoji: '🥑', name: '아보카도' },
];

const TEXT = {
  mainTitle: '소화 효소 게임',
  readyHint: '4명이 역할을 정하고 각자 키 위치를 확인하세요!',
  readyCards: {
    saliva: {
      title: '[침 분비] (담당 키: Q)',
      body: ['나오는 곳: 입', '효소: 아밀레이스', '작업: 탄수화물을 엿당으로 분해해요.', '한 줄 정리: 탄수화물 소화를 입에서 시작해요.'],
    },
    gastric: {
      title: '[위액 분비] (담당 키: Z)',
      body: ['나오는 곳: 위', '효소: 펩신', '작업: 단백질을 작은 조각으로 분해해요.', '한 줄 정리: 단백질 소화를 위에서 시작해요.'],
    },
    bile: {
      title: '[쓸개즙 분비] (담당 키: ])',
      body: ['나오는 곳: 작은창자', '효소: 없음', '작업: 지방을 작은 알갱이로 쪼개요.', '한 줄 정리: 지방 소화를 도와주는 조수예요.'],
    },
    pancreas: {
      title: '[이자액 분비] (담당 키: /)',
      body: ['나오는 곳: 작은창자', '효소: 아밀레이스, 트립신, 라이페이스', '작업: 탄수화물·단백질·지방을 최종 분해해요.', '한 줄 정리: 세 가지 영양소를 마무리하는 소화의 마지막 담당이에요.'],
    },
  },
};

const STORAGE_KEY = 'digestion_special_force_settings';
const app = document.getElementById('app');

const state = {
  screen: 'main',
  settings: loadSettings(),
  currentRoleEditing: null,
  game: null,
  result: null,
  lastTs: 0,
  audioCtx: null,
};

function clone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

function loadSettings() {
  const fallback = clone(DEFAULT_SETTINGS);
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return fallback;
    return mergeSettings(fallback, parsed);
  } catch (error) {
    return fallback;
  }
}

function mergeSettings(base, incoming) {
  const merged = clone(base);
  if (incoming.keys && typeof incoming.keys === 'object') {
    merged.keys = { ...merged.keys, ...incoming.keys };
  }
  if (incoming.zoneTimes && typeof incoming.zoneTimes === 'object') {
    merged.zoneTimes = { ...merged.zoneTimes, ...incoming.zoneTimes };
  }
  if (incoming.nutrientRatio && typeof incoming.nutrientRatio === 'object') {
    merged.nutrientRatio = { ...merged.nutrientRatio, ...incoming.nutrientRatio };
  }
  for (const key of Object.keys(incoming)) {
    if (key !== 'keys' && key !== 'zoneTimes' && key !== 'nutrientRatio' && incoming[key] !== undefined) {
      merged[key] = incoming[key];
    }
  }
  return merged;
}

function saveSettings() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.settings));
  } catch (error) {
    // ignore
  }
}

function getKeyLabel(code) {
  const labels = {
    KeyQ: 'Q', KeyW: 'W', KeyE: 'E', KeyR: 'R', KeyT: 'T', KeyY: 'Y', KeyU: 'U', KeyI: 'I', KeyO: 'O', KeyP: 'P',
    KeyA: 'A', KeyS: 'S', KeyD: 'D', KeyF: 'F', KeyG: 'G', KeyH: 'H', KeyJ: 'J', KeyK: 'K', KeyL: 'L',
    KeyZ: 'Z', KeyX: 'X', KeyC: 'C', KeyV: 'V', KeyB: 'B', KeyN: 'N', KeyM: 'M',
    BracketLeft: '[', BracketRight: ']', Backslash: '\\', Slash: '/', Quote: "'", Semicolon: ';', Comma: ',', Period: '.', Minus: '-', Equal: '=', Space: 'Space',
  };
  return labels[code] || code || '';
}

function renderScreen() {
  const screens = {
    main: renderMainScreen(),
    settings: renderSettingsScreen(),
    ready: renderReadyScreen(),
    game: renderGameScreen(),
    result: renderResultScreen(),
  };
  app.innerHTML = screens[state.screen] || screens.main;
  bindEvents();
}

function renderMainScreen() {
  return `
    <div class="screen main">
      <div class="title-card">
        <h1 class="game-title">${TEXT.mainTitle}</h1>
        <div class="subtitle">소화계의 구조와 효소의 역할을 함께 익혀요!</div>
      </div>
      <div class="main-buttons">
        <button class="primary-btn" data-action="start-game">게임 시작</button>
        <button class="secondary-btn" data-action="open-settings">설정</button>
      </div>
    </div>
  `;
}

function renderSettingsScreen() {
  const rows = [
    { label: '소화 완료 점수', path: 'completeScore' },
    { label: '오답 감점', path: 'wrongPenalty' },
    { label: '승리 점수', path: 'winScore' },
    { label: '게임 오버 기준 미소화 음식물', path: 'missLimit' },
    { label: '음식물 등장 간격', path: 'spawnInterval' },
    { label: '전체 이동 속도 배율', path: 'speedMultiplier' },
    { label: '입 통과 시간', path: 'zoneTimes.mouth' },
    { label: '식도 통과 시간', path: 'zoneTimes.esophagus' },
    { label: '위 통과 시간', path: 'zoneTimes.stomach' },
    { label: '작은창자 통과 시간', path: 'zoneTimes.smallIntestine' },
    { label: '탄수화물 비율', path: 'nutrientRatio.carb' },
    { label: '단백질 비율', path: 'nutrientRatio.protein' },
    { label: '지방 비율', path: 'nutrientRatio.fat' },
  ];

  return `
    <div class="screen settings">
      <div class="settings-header">
        <h2 class="panel-title">게임 설정</h2>
        <div class="action-row">
          <button class="small-btn" data-action="save-settings">저장</button>
          <button class="small-btn" data-action="reset-defaults">기본값으로 되돌리기</button>
        </div>
      </div>
      <div class="settings-grid">
        <div class="settings-card">
          <h3>점수와 진행</h3>
          ${rows.slice(0, 6).map(renderSettingInput).join('')}
        </div>
        <div class="settings-card">
          <h3>속도와 난이도</h3>
          ${rows.slice(6, 11).map(renderSettingInput).join('')}
          <div class="setting-row">
            <label>점진적 난이도 상승</label>
            <div class="toggle-wrap"><input type="checkbox" data-setting="progressiveDifficulty" ${state.settings.progressiveDifficulty ? 'checked' : ''}></div>
          </div>
        </div>
        <div class="settings-card">
          <h3>음식 비율</h3>
          ${rows.slice(11).map(renderSettingInput).join('')}
        </div>
        <div class="settings-card">
          <h3>규칙</h3>
          <div class="setting-row"><label>지방은 쓸개즙 → 이자액 순서 필수</label><div class="toggle-wrap"><input type="checkbox" data-setting="requireFatOrder" ${state.settings.requireFatOrder ? 'checked' : ''}></div></div>
          <div class="setting-row"><label>힌트 모드</label><div class="toggle-wrap"><input type="checkbox" data-setting="hintMode" ${state.settings.hintMode ? 'checked' : ''}></div></div>
          <div class="setting-row"><label>효과음</label><div class="toggle-wrap"><input type="checkbox" data-setting="soundEnabled" ${state.settings.soundEnabled ? 'checked' : ''}></div></div>
        </div>
        <div class="settings-card">
          <h3>키 설정</h3>
          ${Object.entries(ROLES).map(([id, role]) => `
            <div class="setting-row">
              <label>${role.label}</label>
              <button class="key-box ${state.currentRoleEditing === id ? 'editing' : ''}" data-role-key="${id}" type="button">${getKeyLabel(state.settings.keys[id])}</button>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;
}

function renderSettingInput({ label, path }) {
  const value = getSettingByPath(state.settings, path);
  return `
    <div class="setting-row">
      <label>${label}</label>
      <input type="number" data-setting-path="${path}" value="${value}" step="0.1" />
    </div>
  `;
}

function getSettingByPath(obj, path) {
  return path.split('.').reduce((cursor, key) => cursor && cursor[key] !== undefined ? cursor[key] : '', obj);
}

function setSettingByPath(path, value) {
  const parts = path.split('.');
  let cursor = state.settings;
  for (let i = 0; i < parts.length - 1; i += 1) {
    cursor = cursor[parts[i]];
  }
  cursor[parts[parts.length - 1]] = value;
}

function renderReadyScreen() {
  const cards = Object.entries(ROLES).map(([id, role]) => {
    const info = TEXT.readyCards[id];
    const label = getKeyLabel(state.settings.keys[id]);
    const title = info.title.replace(/\(담당 키: .*?\)/, `(담당 키: ${label})`);
    return `
      <div class="role-card">
        <h3>${title}</h3>
        <div class="badge">${label}</div>
        ${info.body.map((line) => `<p>${line}</p>`).join('')}
      </div>
    `;
  }).join('');

  return `
    <div class="screen ready">
      <h2 class="panel-title">소화 효소 분비 준비</h2>
      <div class="role-grid">${cards}</div>
      <div class="ready-footer">
        <div class="hint">${TEXT.readyHint}</div>
        <button class="primary-btn" data-action="begin-game">출발!</button>
      </div>
    </div>
  `;
}

function renderGameScreen() {
  return `
    <div class="screen game">
      <div class="game-layout">
        <div class="game-topbar">
          <div class="score-box">
            <div class="score-chip">점수 <strong id="scoreValue">0</strong> / <span id="goalValue">${state.settings.winScore}</span></div>
            <div class="score-chip">완료 <strong id="completeCount">0</strong></div>
          </div>
          <div class="progress-wrap">
            <span>목표 진행</span>
            <div class="progress-bar"><div id="progressFill" class="progress-fill"></div></div>
          </div>
          <div class="game-controls">
            <div class="miss-counter" id="missCounter">❌0 / ${state.settings.missLimit}</div>
            <button class="small-btn" data-action="pause-game">일시정지 (Esc)</button>
            <button class="small-btn" data-action="go-main">메인으로</button>
          </div>
        </div>
        <div class="game-main">
          <svg id="gameSvg" viewBox="0 0 1280 620"></svg>
          <div class="role-corners">
            ${Object.entries(ROLES).map(([id, role]) => `
              <div class="key-panel role-${id}" data-role-panel="${id}">
                <div class="key-panel-label">${role.label}</div>
                <div class="key-stack">
                  <div class="key-panel-heading">담당 키</div>
                  <div class="key-panel-key">${getKeyLabel(state.settings.keys[id])}</div>
                </div>
              </div>
            `).join('')}
          </div>
          <div id="feedback" class="feedback"></div>
          <div id="countdown" class="countdown hidden">3</div>
          <div id="pauseOverlay" class="pause-overlay hidden"><div class="pause-box">일시정지</div></div>
        </div>
      </div>
    </div>
  `;
}

function renderResultScreen() {
  const result = state.result || {
    win: false,
    score: 0,
    elapsed: 0,
    completed: { carb: 0, protein: 0, fat: 0 },
    missed: { carb: 0, protein: 0, fat: 0 },
    wrong: { zone: 0, nutrient: 0, order: 0 },
    roleStats: { saliva: { success: 0, error: 0 }, gastric: { success: 0, error: 0 }, bile: { success: 0, error: 0 }, pancreas: { success: 0, error: 0 } },
    missedReasons: [],
  };

  const totalCompleted = Object.values(result.completed).reduce((sum, value) => sum + value, 0);
  const totalMissed = Object.values(result.missed).reduce((sum, value) => sum + value, 0);
  const totalWrong = Object.values(result.wrong).reduce((sum, value) => sum + value, 0);

  return `
    <div class="screen result">
      <div class="settings-header"><h2 class="panel-title">${result.win ? '소화 성공! 몸이 영양소를 흡수했어요' : '소화되지 못한 음식물이 너무 많아요'}</h2></div>
      <div class="result-summary">
        <div class="result-card">
          <h3>최종 결과</h3>
          <div class="stat-row"><span>최종 점수</span><strong>${result.score}점</strong></div>
          <div class="stat-row"><span>플레이 시간</span><strong>${formatSeconds(result.elapsed)}</strong></div>
          <div class="stat-row"><span>소화 완료 개수</span><strong>${totalCompleted}개</strong></div>
          <div class="stat-row"><span>미소화 개수</span><strong>${totalMissed}개</strong></div>
        </div>
        <div class="result-card">
          <h3>오답 횟수</h3>
          <div class="stat-row"><span>구역 오류</span><strong>${result.wrong.zone}</strong></div>
          <div class="stat-row"><span>영양소 오류</span><strong>${result.wrong.nutrient}</strong></div>
          <div class="stat-row"><span>순서 오류</span><strong>${result.wrong.order}</strong></div>
          <div class="stat-row"><span>총 오답</span><strong>${totalWrong}</strong></div>
        </div>
      </div>
      <div class="action-row" style="margin-top: 18px;">
        <button class="primary-btn" data-action="restart-same">같은 설정으로 다시 하기</button>
        <button class="secondary-btn" data-action="result-settings">설정</button>
        <button class="small-btn" data-action="go-main">메인으로</button>
      </div>
    </div>
  `;
}

function bindEvents() {
  document.querySelectorAll('[data-action]').forEach((button) => {
    button.onclick = () => {
      const action = button.dataset.action;
      if (action === 'start-game') {
        state.screen = 'ready';
      } else if (action === 'open-settings') {
        state.screen = 'settings';
      } else if (action === 'save-settings') {
        collectSettings();
        saveSettings();
        state.screen = 'main';
      } else if (action === 'reset-defaults') {
        state.settings = clone(DEFAULT_SETTINGS);
        saveSettings();
        state.screen = 'settings';
      } else if (action === 'begin-game') {
        startGame();
        return;
      } else if (action === 'restart-same') {
        startGame();
        return;
      } else if (action === 'result-settings') {
        state.screen = 'settings';
      } else if (action === 'go-main') {
        state.screen = 'main';
        state.game = null;
      } else if (action === 'pause-game') {
        if (state.game) togglePause();
      }
      renderScreen();
    };
  });

  document.querySelectorAll('[data-role-key]').forEach((button) => {
    button.onclick = () => {
      state.currentRoleEditing = button.dataset.roleKey;
      renderScreen();
    };
  });

  document.querySelectorAll('[data-setting]').forEach((checkbox) => {
    checkbox.onchange = () => {
      state.settings[checkbox.dataset.setting] = checkbox.checked;
    };
  });

  document.querySelectorAll('[data-setting-path]').forEach((input) => {
    input.onchange = () => {
      const raw = input.value;
      const numeric = Number(raw);
      setSettingByPath(input.dataset.settingPath, input.type === 'number' && raw !== '' && Number.isFinite(numeric) ? numeric : raw);
    };
  });

  const overlay = document.getElementById('pauseOverlay');
  if (overlay) overlay.onclick = () => togglePause(false);
}

function collectSettings() {
  document.querySelectorAll('[data-setting]').forEach((checkbox) => {
    state.settings[checkbox.dataset.setting] = checkbox.checked;
  });
  document.querySelectorAll('[data-setting-path]').forEach((input) => {
    const raw = input.value;
    const numeric = Number(raw);
    setSettingByPath(input.dataset.settingPath, input.type === 'number' && raw !== '' && Number.isFinite(numeric) ? numeric : raw);
  });
}

function startGame() {
  state.game = {
    started: false,
    countdown: 3,
    pause: false,
    score: 0,
    elapsed: 0,
    spawnTimer: state.settings.spawnInterval,
    foods: [],
    completed: { carb: 0, protein: 0, fat: 0 },
    missed: { carb: 0, protein: 0, fat: 0 },
    missedCount: 0,
    answerStats: { zone: 0, nutrient: 0, order: 0 },
    roleStats: { saliva: { success: 0, error: 0 }, gastric: { success: 0, error: 0 }, bile: { success: 0, error: 0 }, pancreas: { success: 0, error: 0 } },
    missedReasons: [],
    difficultyStep: 0,
    feedbackText: '',
    feedbackTone: 'info',
    feedbackUntil: 0,
    roleFlash: {},
    nutrientBag: [],
  };
  state.result = null;
  state.screen = 'game';
  renderScreen();
  requestAnimationFrame(gameLoop);
}

function gameLoop(ts) {
  if (state.screen !== 'game' || !state.game) return;
  if (!state.lastTs) state.lastTs = ts;
  const dt = Math.min(0.033, (ts - state.lastTs) / 1000 || 0.016);
  state.lastTs = ts;

  if (!state.game.started) {
    state.game.countdown -= dt;
    const countdown = document.getElementById('countdown');
    if (countdown) {
      const value = Math.max(1, Math.ceil(state.game.countdown));
      countdown.textContent = value;
      countdown.classList.remove('hidden');
      if (state.game.countdown <= 0) {
        state.game.started = true;
        countdown.classList.add('hidden');
      }
    }
    renderFoodSvg();
    requestAnimationFrame(gameLoop);
    return;
  }

  if (state.game.pause) {
    renderGameStatus();
    requestAnimationFrame(gameLoop);
    return;
  }

  state.game.elapsed += dt;
  state.game.spawnTimer -= dt;
  if (state.game.spawnTimer <= 0) {
    spawnFood();
    state.game.spawnTimer = getSpawnInterval();
  }

  updateFoods(dt);
  updateFeedback();
  renderGameStatus();
  renderFoodSvg();

  if (state.game.score >= state.settings.winScore) {
    endGame(true);
    return;
  }
  if (state.game.missedCount >= state.settings.missLimit) {
    endGame(false);
    return;
  }

  requestAnimationFrame(gameLoop);
}

function getSpawnInterval() {
  if (!state.settings.progressiveDifficulty) return state.settings.spawnInterval;
  const step = Math.floor(state.game.difficultyStep / 4);
  return Math.max(2, state.settings.spawnInterval * (1 - step * 0.08));
}

function spawnFood() {
  const nutrient = pickNutrient();
  const list = FOODS.filter((food) => food.nutrient === nutrient);
  const base = list[Math.floor(Math.random() * list.length)];
  const startPosition = getFoodPosition(0);
  state.game.foods.push({
    id: Date.now() + Math.random(),
    ...base,
    progress: 0,
    stepIndex: 0,
    zone: 'mouth',
    x: startPosition.x,
    y: startPosition.y,
    failed: false,
    completed: false,
    intermediateLabel: '',
  });
  state.game.difficultyStep += 1;
}

function pickNutrient() {
  if (!state.game.nutrientBag.length) {
    const ratio = state.settings.nutrientRatio;
    const bag = [];
    for (const nutrient of ['carb', 'protein', 'fat']) {
      const count = Math.max(0, Math.round(Number(ratio[nutrient]) || 0));
      for (let index = 0; index < count; index += 1) bag.push(nutrient);
    }
    state.game.nutrientBag = bag.length ? shuffle(bag) : ['carb', 'protein', 'fat'];
  }
  return state.game.nutrientBag.pop();
}

function shuffle(items) {
  const result = items.slice();
  for (let index = result.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [result[index], result[swapIndex]] = [result[swapIndex], result[index]];
  }
  return result;
}

function getZoneByProgress(progress) {
  const route = getRouteSegments();
  const segment = route.find((item) => progress < item.end) || route[route.length - 1];
  return segment.zone;
}

function getRouteSegments() {
  const zones = ['mouth', 'esophagus', 'stomach', 'smallIntestine'];
  const total = zones.reduce((sum, zone) => sum + Math.max(0.1, Number(state.settings.zoneTimes[zone]) || 0.1), 0);
  let start = 0;
  return zones.map((zone) => {
    const duration = Math.max(0.1, Number(state.settings.zoneTimes[zone]) || 0.1);
    const end = start + duration / total;
    const segment = { zone, start, end, duration };
    start = end;
    return segment;
  });
}

function updateFoods(dt) {
  const totalRouteTime = getRouteSegments().reduce((sum, segment) => sum + segment.duration, 0);
  for (const food of state.game.foods) {
    if (food.failed || food.completed) continue;
    const prevZone = food.zone;
    food.progress = Math.min(1, food.progress + dt * state.settings.speedMultiplier / totalRouteTime);
    food.zone = getZoneByProgress(food.progress);
    const position = getFoodPosition(food.progress);
    food.x = position.x;
    food.y = position.y;

    if (prevZone !== food.zone) {
      if (prevZone === 'mouth' && food.nutrient === 'carb' && food.stepIndex === 0) {
        failFood(food, '탄수화물이 침을 만나지 못하고 입을 지나쳤어요!');
      }
      if (prevZone === 'stomach' && food.nutrient === 'protein' && food.stepIndex === 0) {
        failFood(food, '단백질이 위액을 만나지 못하고 위를 지나쳤어요!');
      }
    }

    if (food.progress >= 1) {
      failFood(food, `${food.name}이(가) 소화 관을 지나치며 남았어요!`);
    }
  }
  state.game.foods = state.game.foods.filter((food) => !food.failed && !food.completed);
}

function getFoodPosition(progress) {
  const points = [{ x: 140, y: 350 }, { x: 350, y: 350 }, { x: 520, y: 350 }, { x: 760, y: 350 }, { x: 1100, y: 350 }];
  const segments = getRouteSegments();
  const segment = segments.find((item) => progress < item.end) || segments[segments.length - 1];
  const index = segments.indexOf(segment);
  const t = Math.min(1, Math.max(0, (progress - segment.start) / (segment.end - segment.start)));
  const yOffset = index === 0 ? Math.sin(t * Math.PI) * 16 : index === 1 ? Math.cos(t * Math.PI) * 10 : index === 2 ? Math.sin(t * Math.PI * 2.2) * 24 : Math.sin(t * Math.PI * 3) * 8;
  return { x: lerp(points[index].x, points[index + 1].x, t), y: 350 + yOffset };
}

function getFlatRoutePoints() {
  const points = [];
  let distance = 0;
  DIGESTIVE_ROUTE_POINTS.forEach((segment) => {
    segment.points.forEach((point, index) => {
      if (points.length && index === 0) return;
      const displayPoint = getDisplayPoint(point);
      if (points.length) {
        const previous = points[points.length - 1];
        distance += Math.hypot(displayPoint.x - previous.x, displayPoint.y - previous.y);
      }
      points.push({ ...displayPoint, distance });
    });
  });
  return points;
}

function getDisplayPoint(point) {
  return {
    x: point.x,
    y: point.y,
  };
}

function pointsToPath(points) {
  if (points.length < 2) return '';
  let path = `M ${points[0].x} ${points[0].y}`;
  for (let index = 1; index < points.length - 1; index += 1) {
    const current = points[index];
    const next = points[index + 1];
    const midpoint = { x: (current.x + next.x) / 2, y: (current.y + next.y) / 2 };
    path += ` Q ${current.x} ${current.y} ${midpoint.x} ${midpoint.y}`;
  }
  const last = points[points.length - 1];
  path += ` Q ${last.x} ${last.y} ${last.x} ${last.y}`;
  return path;
}

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function renderGameStatus() {
  if (!state.game) return;
  const scoreValue = document.getElementById('scoreValue');
  const completeCount = document.getElementById('completeCount');
  const missCounter = document.getElementById('missCounter');
  const progressFill = document.getElementById('progressFill');
  const feedback = document.getElementById('feedback');

  if (scoreValue) scoreValue.textContent = String(state.game.score);
  if (completeCount) completeCount.textContent = String(Object.values(state.game.completed).reduce((sum, value) => sum + value, 0));
  if (missCounter) missCounter.textContent = `${'❌'.repeat(state.game.missedCount)}${'○'.repeat(Math.max(0, state.settings.missLimit - state.game.missedCount))} ${state.game.missedCount}/${state.settings.missLimit}`;
  if (progressFill) progressFill.style.width = `${Math.min(100, (state.game.score / state.settings.winScore) * 100)}%`;
  if (feedback) {
    feedback.textContent = state.game.feedbackText || '';
    feedback.className = `feedback ${state.game.feedbackText ? 'visible ' + state.game.feedbackTone : ''}`.trim();
  }

  document.querySelectorAll('[data-role-panel]').forEach((panel) => {
    panel.classList.remove('success', 'error');
    const roleId = panel.dataset.rolePanel;
    if (state.game.roleFlash[roleId]) {
      panel.classList.add(state.game.roleFlash[roleId]);
      state.game.roleFlash[roleId] = '';
    }
  });

  const overlay = document.getElementById('pauseOverlay');
  if (overlay) {
    if (state.game.pause) overlay.classList.remove('hidden');
    else overlay.classList.add('hidden');
  }
}

function togglePause(forceValue) {
  if (!state.game) return;
  state.game.pause = typeof forceValue === 'boolean' ? forceValue : !state.game.pause;
  renderGameStatus();
}

function updateFeedback() {
  if (!state.game) return;
  if (state.game.feedbackUntil && performance.now() > state.game.feedbackUntil) {
    state.game.feedbackText = '';
    state.game.feedbackTone = 'info';
    state.game.feedbackUntil = 0;
  }
}

function setFeedback(text, tone = 'info', duration = 1500) {
  if (!state.game) return;
  state.game.feedbackText = text;
  state.game.feedbackTone = tone;
  state.game.feedbackUntil = performance.now() + duration;
}

function processRoleInput(code) {
  if (!state.game || !state.game.started || state.game.pause) return;
  const roleId = Object.keys(ROLES).find((id) => state.settings.keys[id] === code);
  if (!roleId) return;

  const foodsInZone = state.game.foods.filter((food) => food.zone === ROLES[roleId].zone && !food.failed && !food.completed);
  if (foodsInZone.length === 0) {
    registerWrongAnswer('zone', roleId, `지금은 ${ROLES[roleId].zone === 'mouth' ? '입' : ROLES[roleId].zone === 'stomach' ? '위' : '작은창자'}에 음식물이 없어요!`);
    state.game.roleFlash[roleId] = 'error';
    return;
  }

  const candidate = foodsInZone.find((food) => {
    const next = STAGE_RULES[food.nutrient]?.[food.stepIndex];
    if (!next) return false;
    if (state.settings.requireFatOrder && food.nutrient === 'fat' && roleId === 'pancreas' && food.stepIndex === 0) return false;
    return next.role === roleId;
  });

  if (!candidate) {
    if (state.settings.requireFatOrder && roleId === 'pancreas' && foodsInZone.some((food) => food.nutrient === 'fat' && food.stepIndex === 0)) {
      registerWrongAnswer('order', roleId, '먼저 쓸개즙이 지방을 잘게 쪼개야 해요!');
      state.game.roleFlash[roleId] = 'error';
      return;
    }
    registerWrongAnswer('nutrient', roleId, `${ROLES[roleId].label}는 ${ROLES[roleId].zone === 'mouth' ? '탄수화물' : ROLES[roleId].zone === 'stomach' ? '단백질' : '지방'}에만 작용해요!`);
    state.game.roleFlash[roleId] = 'error';
    return;
  }

  applySuccess(candidate, roleId);
}

function applySuccess(food, roleId) {
  const step = STAGE_RULES[food.nutrient][food.stepIndex];
  state.game.roleStats[roleId].success += 1;
  state.game.roleFlash[roleId] = 'success';

  if (food.stepIndex < STAGE_RULES[food.nutrient].length - 1) {
    food.stepIndex += 1;
    food.intermediateLabel = step.product;
    setFeedback(`${food.name}이(가) ${step.product}(으)로 바뀌고 있어요!`, 'success', 1200);
    playSound('success');
    return;
  }

  food.completed = true;
  food.intermediateLabel = step.product;
  state.game.completed[food.nutrient] += 1;
  state.game.score += state.settings.completeScore;
  setFeedback(`${step.product} 완성! +${state.settings.completeScore}점`, 'success', 1600);
  playSound('success');
  state.game.foods = state.game.foods.filter((item) => item.id !== food.id);
}

function registerWrongAnswer(type, roleId, message) {
  state.game.answerStats[type] = (state.game.answerStats[type] || 0) + 1;
  state.game.roleStats[roleId].error += 1;
  state.game.score = Math.max(0, state.game.score - state.settings.wrongPenalty);
  setFeedback(message, 'error', 1600);
  playSound('wrong');
}

function failFood(food, reason) {
  if (food.failed) return;
  food.failed = true;
  state.game.missed[food.nutrient] += 1;
  state.game.missedCount = Object.values(state.game.missed).reduce((sum, value) => sum + value, 0);
  state.game.missedReasons.push({ nutrient: food.nutrient, reason });
  setFeedback(reason, 'error', 2000);
  playSound('wrong');
  state.game.foods = state.game.foods.filter((item) => item.id !== food.id);
}

function endGame(win) {
  if (!state.game) return;
  state.result = {
    win,
    score: state.game.score,
    elapsed: state.game.elapsed,
    completed: { ...state.game.completed },
    missed: { ...state.game.missed },
    wrong: { ...state.game.answerStats },
    roleStats: clone(state.game.roleStats),
    missedReasons: state.game.missedReasons.slice(0, 10),
  };
  state.screen = 'result';
  renderScreen();
  playSound(win ? 'win' : 'gameover');
}

function formatSeconds(total) {
  const minutes = Math.floor(total / 60);
  const seconds = Math.floor(total % 60);
  return `${minutes}분 ${seconds}초`;
}

function renderFoodSvg() {
  const svg = document.getElementById('gameSvg');
  if (!svg || !state.game) return;
  svg.innerHTML = drawGameSvg();
}

function drawGameSvg() {
  const roleColors = Object.fromEntries(Object.entries(ROLES).map(([id, role]) => [id, role.color]));
  const roleKeys = Object.fromEntries(Object.keys(ROLES).map((id) => [id, getKeyLabel(state.settings.keys[id])]));
  const routePoints = getFlatRoutePoints();
  const routePath = pointsToPath(routePoints);
  return `
    <defs>
      <filter id="glow"><feDropShadow dx="0" dy="0" stdDeviation="4" flood-color="#80d0ff" flood-opacity="0.5"/></filter>
    </defs>
    <g>
      <rect x="140" y="210" width="210" height="280" rx="34" fill="#ffe1e8" />
      <text x="245" y="188" text-anchor="middle" font-size="32" font-weight="900" fill="#2d4562">입</text>
      <rect x="350" y="210" width="170" height="280" rx="26" fill="#fff2bf" />
      <text x="435" y="188" text-anchor="middle" font-size="26" fill="#647594">식도</text>
      <rect x="520" y="210" width="240" height="280" rx="34" fill="#dff3d5" />
      <text x="640" y="188" text-anchor="middle" font-size="32" font-weight="900" fill="#285e46">위</text>
      <rect x="760" y="210" width="340" height="280" rx="34" fill="#dcecff" />
      <text x="930" y="188" text-anchor="middle" font-size="30" font-weight="900" fill="#234d81">작은창자</text>
      <path d="M 140 350 C 220 350, 285 350, 350 350" stroke="#ef7897" stroke-width="18" fill="none" stroke-linecap="round" />
      <path d="M 350 350 C 410 350, 470 350, 520 350" stroke="#e4bd3d" stroke-width="18" fill="none" stroke-linecap="round" />
      <path d="M 520 350 C 600 350, 680 350, 760 350" stroke="#62a85a" stroke-width="26" fill="none" stroke-linecap="round" />
      <path d="M 760 350 C 860 350, 980 350, 1100 350" stroke="#5d9fe8" stroke-width="26" fill="none" stroke-linecap="round" />
      <g class="route-role route-role-saliva"><rect x="158" y="226" width="174" height="86" rx="14" fill="#ffe1e8" stroke="#ef7897" stroke-width="4"/><text x="245" y="249" text-anchor="middle" font-size="18" font-weight="900" fill="#16324d">침 (탄수화물)</text><text x="245" y="271" text-anchor="middle" font-size="14" font-weight="800" fill="#315a70">${ROLES.saliva.secretion}</text><text x="245" y="292" text-anchor="middle" font-size="14" font-weight="800" fill="#315a70">${ROLES.saliva.enzyme}</text></g>
      <g class="route-role route-role-gastric"><rect x="546" y="226" width="190" height="86" rx="14" fill="#dff3d5" stroke="#62a85a" stroke-width="4"/><text x="641" y="249" text-anchor="middle" font-size="18" font-weight="900" fill="#16324d">위액 (단백질)</text><text x="641" y="271" text-anchor="middle" font-size="14" font-weight="800" fill="#315a70">${ROLES.gastric.secretion}</text><text x="641" y="292" text-anchor="middle" font-size="14" font-weight="800" fill="#315a70">${ROLES.gastric.enzyme}</text></g>
      <g class="route-role route-role-bile"><rect x="815" y="216" width="230" height="86" rx="14" fill="#dcecff" stroke="#5d9fe8" stroke-width="4"/><text x="930" y="239" text-anchor="middle" font-size="18" font-weight="900" fill="#16324d">쓸개즙 (지방)</text><text x="930" y="261" text-anchor="middle" font-size="14" font-weight="800" fill="#315a70">${ROLES.bile.secretion}</text><text x="930" y="282" text-anchor="middle" font-size="14" font-weight="800" fill="#315a70">${ROLES.bile.enzyme}</text></g>
      <g class="route-role route-role-pancreas"><rect x="815" y="400" width="230" height="86" rx="14" fill="#dcecff" stroke="#5d9fe8" stroke-width="4"/><text x="930" y="423" text-anchor="middle" font-size="16" font-weight="900" fill="#16324d">이자액 (탄수화물·단백질·지방)</text><text x="930" y="445" text-anchor="middle" font-size="14" font-weight="800" fill="#315a70">${ROLES.pancreas.secretion}</text><text x="930" y="466" text-anchor="middle" font-size="14" font-weight="800" fill="#315a70">${ROLES.pancreas.enzyme}</text></g>
    </g>
    ${state.game.foods.map((food) => `
      <g>
        <circle cx="${food.x}" cy="${food.y}" r="36" fill="${getNutrientColor(food.nutrient)}" opacity="0.22"/>
        <circle cx="${food.x}" cy="${food.y}" r="28" fill="${getNutrientColor(food.nutrient)}" opacity="0.96" stroke="#ffffff" stroke-width="3"/>
        <text x="${food.x}" y="${food.y + 9}" font-size="27" text-anchor="middle">${food.emoji}</text>
        <text x="${food.x}" y="${food.y - 39}" font-size="17" text-anchor="middle" fill="#20314a" font-weight="800">${getFoodLabel(food)}</text>
        ${food.intermediateLabel ? `<text x="${food.x}" y="${food.y + 53}" font-size="15" text-anchor="middle" fill="#2d6d48" font-weight="800">${food.intermediateLabel}</text>` : ''}
      </g>
    `).join('')}
  `;
}

function getFoodLabel(food) {
  if (state.settings.hintMode) {
    const nutrientName = food.nutrient === 'carb' ? '탄수화물' : food.nutrient === 'protein' ? '단백질' : '지방';
    return `${food.name} · ${nutrientName}`;
  }
  return food.name;
}

function getNutrientColor(nutrient) {
  if (nutrient === 'carb') return '#6fd5ff';
  if (nutrient === 'protein') return '#86ce5f';
  return '#ffbb57';
}

function handleKeyboard(event) {
  const code = event.code;

  if (state.currentRoleEditing) {
    event.preventDefault();
    const duplicate = Object.entries(state.settings.keys).find(([id, value]) => id !== state.currentRoleEditing && value === code);
    if (duplicate) {
      setFeedback('이미 사용 중인 키예요. 다른 키를 눌러줘!', 'error', 1200);
      return;
    }
    state.settings.keys[state.currentRoleEditing] = code;
    state.currentRoleEditing = null;
    saveSettings();
    renderScreen();
    return;
  }

  if (state.screen === 'game' && code === 'Escape') {
    event.preventDefault();
    togglePause();
    return;
  }

  if (state.screen === 'game' && state.game && state.game.started && !state.game.pause && Object.values(state.settings.keys).includes(code)) {
    event.preventDefault();
    processRoleInput(code);
  }
}

window.addEventListener('keydown', handleKeyboard);

function playSound(type) {
  if (!state.settings.soundEnabled) return;
  const AudioCtor = window.AudioContext || window.webkitAudioContext;
  if (!AudioCtor) return;
  if (!state.audioCtx) state.audioCtx = new AudioCtor();
  if (state.audioCtx.state === 'suspended') state.audioCtx.resume();
  const ctx = state.audioCtx;
  const oscillator = ctx.createOscillator();
  const gain = ctx.createGain();
  const now = ctx.currentTime;
  const tones = {
    success: { freq: 660, type: 'triangle', duration: 0.18 },
    wrong: { freq: 200, type: 'square', duration: 0.18 },
    win: { freq: 520, type: 'sine', duration: 0.28 },
    gameover: { freq: 120, type: 'sawtooth', duration: 0.34 },
  };
  const tone = tones[type] || tones.success;
  oscillator.type = tone.type;
  oscillator.frequency.setValueAtTime(tone.freq, now);
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(0.06, now + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + tone.duration);
  oscillator.connect(gain);
  gain.connect(ctx.destination);
  oscillator.start(now);
  oscillator.stop(now + tone.duration);
}

renderScreen();
