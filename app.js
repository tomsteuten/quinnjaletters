(function () {
  const data = (window.QuinnjaLetters && window.QuinnjaLetters.Data) || window.QuinnjaData;
  const audio = (window.QuinnjaLetters && window.QuinnjaLetters.Audio) || window.QuinnjaAudio;
  const nfc = (window.QuinnjaLetters && window.QuinnjaLetters.Nfc) || window.QuinnjaNfc;

  const storageKeys = {
    settings: "quinnjaLetters.settings",
    progress: "quinnjaLetters.progress"
  };

  const stageOrder = ["meet", "pick", "trace", "celebrate"];

  const state = {
    currentStage: "home",
    currentLetterIndex: 0,
    letterQueue: [],
    currentLetter: null,
    sessionResults: [],
    currentPickState: null,
    currentPickCase: "uppercase",
    currentTraceCase: "uppercase",
    pickCaseQueue: [],
    sessionTraceCase: "uppercase",
    settings: loadSettings(),
    progress: loadProgress(),
    autoTimerId: null,
    nfcSingleLetterSession: false,
    nfcListening: false
  };

  const dom = {
    stages: {
      home: document.getElementById("stage-home"),
      meet: document.getElementById("stage-meet"),
      pick: document.getElementById("stage-pick"),
      trace: document.getElementById("stage-trace"),
      celebrate: document.getElementById("stage-celebrate"),
      complete: document.getElementById("stage-complete"),
      settings: document.getElementById("stage-settings")
    },
    stageStatus: document.getElementById("stage-status"),

    homeMascotWrap: document.getElementById("home-mascot-wrap"),
    activeLettersRow: document.getElementById("home-active-letters"),
    nfcPrompt: document.getElementById("nfc-prompt"),
    startSessionBtn: document.getElementById("btn-start-session"),

    meetLetterUpper: document.getElementById("meet-letter-upper"),
    meetLetterLower: document.getElementById("meet-letter-lower"),
    meetMascotWrap: document.getElementById("meet-mascot-wrap"),

    pickTargetLetter: document.getElementById("pick-target-letter"),
    pickOptions: document.getElementById("pick-options"),
    pickFeedback: document.getElementById("pick-feedback"),
    pickMascotWrap: document.getElementById("pick-mascot-wrap"),

    traceLetter: document.getElementById("trace-letter"),
    traceGuide: document.getElementById("trace-guide"),
    traceCanvas: document.getElementById("trace-canvas"),
    traceBoard: document.getElementById("trace-board"),
    traceMascotWrap: document.getElementById("trace-mascot-wrap"),
    traceClearBtn: document.getElementById("btn-trace-clear"),
    traceDoneBtn: document.getElementById("btn-trace-done"),

    celebrateMascotWrap: document.getElementById("celebrate-mascot-wrap"),
    celebrateLetterMain: document.getElementById("celebrate-letter-main"),
    celebrateLetterSide: document.getElementById("celebrate-letter-side"),

    completeMascotWrap: document.getElementById("complete-mascot-wrap"),
    completeLetters: document.getElementById("complete-letters"),
    replayBtn: document.getElementById("btn-replay"),
    homeBtn: document.getElementById("btn-home"),

    openSettingsHomeBtn: document.getElementById("btn-open-settings-home"),
    openSettingsCompleteBtn: document.getElementById("btn-open-settings-complete"),

    settingChildName: document.getElementById("setting-child-name"),
    settingsLetterToggles: document.getElementById("settings-letter-toggles"),
    settingAudio: document.getElementById("setting-audio"),
    settingSoundEffects: document.getElementById("setting-sound-effects"),
    settingGuideDefault: document.getElementById("setting-guide-default"),
    settingNfcMode: document.getElementById("setting-nfc-mode"),
    settingsProgress: document.getElementById("settings-progress"),
    settingsMessage: document.getElementById("settings-message"),
    saveSettingsBtn: document.getElementById("btn-save-settings"),
    resetProgressBtn: document.getElementById("btn-reset-progress")
  };

  const traceState = {
    ctx: null,
    isDrawing: false,
    width: 220,
    height: 220
  };

  init();

  function init() {
    setupButtons();
    setupSettingsUI();
    setupTraceCanvas();
    syncAudioSettings();
    updateHomeLettersRow();
    updateSettingsProgressSummary();

    if (!audio.isSoundEffectsSupported()) {
      state.settings.soundEffectsEnabled = false;
    }

    saveSettings();
    syncAudioSettings();
    showStage("home");
  }

  function setupButtons() {
    document.addEventListener("click", function (event) {
      const button = event.target.closest("button");
      if (!button || button.disabled) {
        return;
      }
      audio.playButtonTap();
    });

    dom.startSessionBtn.addEventListener("click", function () {
      startSession();
    });

    dom.openSettingsHomeBtn.addEventListener("click", openSettings);
    dom.openSettingsCompleteBtn.addEventListener("click", openSettings);

    dom.traceClearBtn.addEventListener("click", clearTraceCanvas);
    dom.traceDoneBtn.addEventListener("click", function () {
      showCelebrateStage();
    });

    dom.replayBtn.addEventListener("click", function () {
      startSession();
    });

    dom.homeBtn.addEventListener("click", function () {
      goHome();
    });

    dom.saveSettingsBtn.addEventListener("click", saveSettingsFromForm);
    dom.resetProgressBtn.addEventListener("click", resetProgress);
  }

  function setupSettingsUI() {
    dom.settingsLetterToggles.innerHTML = "";

    data.letters.forEach(function (letter) {
      const label = document.createElement("label");
      const input = document.createElement("input");
      const text = document.createElement("span");

      input.type = "checkbox";
      input.value = letter.id;
      input.dataset.letterToggle = "true";
      text.textContent = letter.uppercase;

      label.appendChild(input);
      label.appendChild(text);
      dom.settingsLetterToggles.appendChild(label);
    });
  }

  function setupTraceCanvas() {
    traceState.ctx = dom.traceCanvas.getContext("2d");
    traceState.ctx.lineCap = "round";
    traceState.ctx.lineJoin = "round";
    traceState.ctx.lineWidth = 11;
    traceState.ctx.strokeStyle = "#342b22";

    dom.traceCanvas.addEventListener("pointerdown", tracePointerDown);
    dom.traceCanvas.addEventListener("pointermove", tracePointerMove);
    dom.traceCanvas.addEventListener("pointerup", tracePointerUp);
    dom.traceCanvas.addEventListener("pointercancel", tracePointerUp);
    dom.traceCanvas.addEventListener("pointerleave", tracePointerUp);

    clearTraceCanvas();
  }

  function tracePointerDown(event) {
    traceState.isDrawing = true;
    dom.traceCanvas.setPointerCapture(event.pointerId);
    const point = getTracePoint(event);
    traceState.ctx.beginPath();
    traceState.ctx.moveTo(point.x, point.y);
  }

  function tracePointerMove(event) {
    if (!traceState.isDrawing) {
      return;
    }

    const point = getTracePoint(event);
    traceState.ctx.lineTo(point.x, point.y);
    traceState.ctx.stroke();
  }

  function tracePointerUp(event) {
    if (!traceState.isDrawing) {
      return;
    }

    traceState.isDrawing = false;
    traceState.ctx.closePath();
    if (dom.traceCanvas.hasPointerCapture(event.pointerId)) {
      dom.traceCanvas.releasePointerCapture(event.pointerId);
    }
  }

  function clearTraceCanvas() {
    if (!traceState.ctx) {
      return;
    }

    traceState.ctx.clearRect(0, 0, traceState.width, traceState.height);
  }

  function getTracePoint(event) {
    const rect = dom.traceCanvas.getBoundingClientRect();
    const scaleX = traceState.width / rect.width;
    const scaleY = traceState.height / rect.height;

    return {
      x: (event.clientX - rect.left) * scaleX,
      y: (event.clientY - rect.top) * scaleY
    };
  }

  function startSession(optionalLetterId) {
    clearAutoTimer();
    stopNfcIfRunning();

    const activeLetters = getActiveLetters();
    let queue = [];

    if (optionalLetterId) {
      const match = data.letters.find(function (letter) {
        return letter.id === optionalLetterId;
      });

      if (match) {
        queue = [match];
        state.nfcSingleLetterSession = true;
      }
    }

    if (!queue.length) {
      queue = shuffle(activeLetters.slice());
      state.nfcSingleLetterSession = false;
    }

    state.sessionTraceCase = resolveSessionTraceCase();
    state.letterQueue = queue;
    state.pickCaseQueue = buildPickCaseQueue(queue.length);
    state.currentLetterIndex = 0;
    state.sessionResults = [];
    state.currentPickState = null;
    state.currentLetter = state.letterQueue[0] || null;

    showMeetStage();
  }

  function advanceStage() {
    if (!state.currentLetter) {
      goHome();
      return;
    }

    const currentIndex = stageOrder.indexOf(state.currentStage);
    if (currentIndex === -1) {
      return;
    }

    if (currentIndex === stageOrder.length - 1) {
      loadNextLetterOrFinish();
      return;
    }

    const nextStage = stageOrder[currentIndex + 1];
    if (nextStage === "pick") {
      showPickStage();
    } else if (nextStage === "trace") {
      showTraceStage();
    } else if (nextStage === "celebrate") {
      showCelebrateStage();
    }
  }

  function showMeetStage() {
    loadLetter(state.currentLetter);
    showStage("meet");
    setMascotState(dom.meetMascotWrap, "mascot-presenting");

    const meetFile = state.currentLetter.audio.meet;
    const soundFile = state.currentLetter.audio.sound;

    const fallbackTimer = window.setTimeout(function () {
      if (state.currentStage === "meet") {
        advanceStage();
      }
    }, 6000);

    audio.playMp3Sequence([meetFile, soundFile], function () {
      window.clearTimeout(fallbackTimer);
      state.autoTimerId = window.setTimeout(function () {
        advanceStage();
      }, 600);
    });
  }

  function showPickStage() {
    showStage("pick");
    setMascotState(dom.pickMascotWrap, "mascot-encouraging");
    state.currentPickCase = getPickCaseForCurrentLetter();

    state.currentPickState = {
      solved: false,
      correctFirstTry: true
    };

    dom.pickTargetLetter.textContent = getLetterCharacter(state.currentLetter, state.currentPickCase);
    dom.pickOptions.innerHTML = "";
    dom.pickFeedback.textContent = "";

    const options = buildPickOptions(state.currentLetter);
    options.forEach(function (optionLetter) {
      const button = document.createElement("button");
      button.className = "pick-option";
      button.type = "button";
      button.textContent = getLetterCharacter(optionLetter, state.currentPickCase);
      button.dataset.letterId = optionLetter.id;
      button.setAttribute("aria-label", "Letter " + getLetterCharacter(optionLetter, state.currentPickCase));

      button.addEventListener("click", function () {
        handlePickSelection(optionLetter.id, button);
      });

      dom.pickOptions.appendChild(button);
    });

    audio.playMp3(state.currentLetter.audio.pick);
  }

  function handlePickSelection(letterId, button) {
    if (!state.currentPickState || state.currentPickState.solved) {
      return;
    }

    const isCorrect = letterId === state.currentLetter.id;

    if (isCorrect) {
      state.currentPickState.solved = true;
      button.classList.add("is-correct", "flash-correct");

      dom.pickOptions.querySelectorAll("button").forEach(function (item) {
        item.disabled = true;
      });

      setMascotState(dom.pickMascotWrap, "mascot-celebrating");
      dom.pickFeedback.textContent = "Correct";
      audio.playCorrectChime();

      audio.playRandomMp3(data.sharedAudio.praise, function () {
        state.autoTimerId = window.setTimeout(function () {
          advanceStage();
        }, 400);
      });

      return;
    }

    state.currentPickState.correctFirstTry = false;
    button.disabled = true;
    button.classList.add("is-wrong", "flash-wrong");
    setMascotState(dom.pickMascotWrap, "mascot-tryagain");
    dom.pickFeedback.textContent = "Try again";
    audio.playTryAgainTone();
    audio.playMp3(data.sharedAudio.tryAgain);

    window.setTimeout(function () {
      if (state.currentStage === "pick") {
        setMascotState(dom.pickMascotWrap, "mascot-encouraging");
      }
    }, 430);
  }

  function showTraceStage() {
    showStage("trace");
    setMascotState(dom.traceMascotWrap, "mascot-encouraging");
    state.currentTraceCase = getTraceCaseForCurrentLetter();
    dom.traceLetter.textContent = getLetterCharacter(state.currentLetter, state.currentTraceCase);
    clearTraceCanvas();
    renderTraceGuide(state.currentLetter);
    audio.playMp3(data.sharedAudio.tracePrompt);
  }

  function showCelebrateStage() {
    showStage("celebrate");
    setMascotState(dom.celebrateMascotWrap, "mascot-celebrating");
    const tracedChar = getLetterCharacter(state.currentLetter, state.currentTraceCase);
    const pairedChar = getLetterCharacter(
      state.currentLetter,
      state.currentTraceCase === "uppercase" ? "lowercase" : "uppercase"
    );
    dom.celebrateLetterMain.textContent = tracedChar;
    dom.celebrateLetterSide.textContent = pairedChar;

    state.sessionResults.push({
      letterId: state.currentLetter.id,
      pickCorrectOnFirstTry: Boolean(state.currentPickState && state.currentPickState.correctFirstTry)
    });

    updateProgressForCurrentLetter();
    audio.playCelebrationSequence();

    window.setTimeout(function () {
      audio.playRandomMp3(data.sharedAudio.celebrate, function () {
        state.autoTimerId = window.setTimeout(function () {
          advanceStage();
        }, 800);
      });
    }, 400);
  }

  function loadNextLetterOrFinish() {
    if (state.currentLetterIndex < state.letterQueue.length - 1) {
      state.currentLetterIndex += 1;
      state.currentLetter = state.letterQueue[state.currentLetterIndex];
      showMeetStage();
      return;
    }

    if (state.nfcSingleLetterSession) {
      goHome();
      return;
    }

    state.progress.totalSessions += 1;
    saveProgress();
    showCompleteStage();
  }

  function showCompleteStage() {
    showStage("complete");
    setMascotState(dom.completeMascotWrap, "mascot-celebrating");

    dom.completeLetters.innerHTML = "";
    state.sessionResults.forEach(function (result) {
      const letter = data.letters.find(function (item) {
        return item.id === result.letterId;
      });
      if (!letter) {
        return;
      }

      const chip = document.createElement("div");
      chip.className = "complete-chip";
      chip.textContent = letter.uppercase;

      const tick = document.createElement("img");
      tick.src = "assets/icons/check.svg";
      tick.alt = "";
      chip.appendChild(tick);
      dom.completeLetters.appendChild(chip);
    });

    audio.playMp3(data.sharedAudio.sessionComplete);
  }

  function loadLetter(letter) {
    if (!letter) {
      return;
    }

    state.currentLetter = letter;
    dom.meetLetterUpper.textContent = letter.uppercase;
    dom.meetLetterLower.textContent = letter.lowercase;
    applyStageBackground(letter.stageBackground);
  }

  function showStage(stageName) {
    clearAutoTimer();

    Object.keys(dom.stages).forEach(function (name) {
      dom.stages[name].classList.toggle("active", name === stageName);
    });

    state.currentStage = stageName;
    dom.stageStatus.textContent = "Stage: " + stageName;

    if (stageName === "home") {
      applyStageBackground("");
      updateHomeLettersRow();
      syncNfcState();
    } else {
      stopNfcIfRunning();
      if (stageName === "complete" || stageName === "settings") {
        applyStageBackground("");
      }
    }
  }

  function openSettings() {
    populateSettingsForm();
    showStage("settings");
  }

  function goHome() {
    showStage("home");
  }

  function buildPickOptions(correctLetter) {
    const pool = getActiveLetters().filter(function (letter) {
      return letter.id !== correctLetter.id;
    });

    shuffle(pool);

    if (pool.length < 2) {
      const backup = data.letters.filter(function (letter) {
        return letter.id !== correctLetter.id;
      });
      shuffle(backup);
      while (pool.length < 2 && backup.length) {
        pool.push(backup.shift());
      }
    }

    const options = [correctLetter, pool[0], pool[1]].filter(Boolean);
    return shuffle(options);
  }

  function renderTraceGuide(letter) {
    if (!state.settings.formationGuideDefaultOn) {
      dom.traceGuide.innerHTML = "";
      return;
    }

    const guide = getActiveFormation(letter);
    if (!guide) {
      dom.traceGuide.innerHTML = "";
      return;
    }

    const showLowercaseLines = state.currentTraceCase === "lowercase";
    let lines = "";
    if (showLowercaseLines) {
      lines += "<line x1='20' y1='88' x2='200' y2='88' class='guide-line'></line>";
      lines += "<line x1='20' y1='165' x2='200' y2='165' class='guide-line'></line>";
      if (guide.showDescender) {
        lines += "<line x1='20' y1='209' x2='200' y2='209' class='guide-line'></line>";
      }
    }

    let hintDots = "";
    if (guide.arrows && guide.arrows.length > 0) {
      const firstArrow = guide.arrows[0];
      const fx = firstArrow.from.x;
      const fy = firstArrow.from.y;
      const tx = firstArrow.to.x;
      const ty = firstArrow.to.y;

      const opacities = [0.5, 0.28, 0.16];
      const sizes = [5, 4, 3.5];
      for (let i = 0; i < 3; i += 1) {
        const t = (i + 1) * 0.25;
        const dx = fx + (tx - fx) * t;
        const dy = fy + (ty - fy) * t;
        hintDots +=
          "<circle cx='" +
          dx +
          "' cy='" +
          dy +
          "' r='" +
          sizes[i] +
          "' fill='#ff7f2a' opacity='" +
          opacities[i] +
          "'></circle>";
      }
    }

    const optionalDot = guide.dot
      ? "<circle cx='" + guide.dot.x + "' cy='" + guide.dot.y + "' r='5' class='guide-optional-dot'></circle>"
      : "";

    dom.traceGuide.innerHTML =
      lines +
      "<path d='" +
      guide.ghostPath +
      "' class='guide-path'></path>" +
      hintDots +
      "<circle cx='" +
      guide.startDot.x +
      "' cy='" +
      guide.startDot.y +
      "' r='18' class='guide-start-halo'></circle>" +
      "<circle cx='" +
      guide.startDot.x +
      "' cy='" +
      guide.startDot.y +
      "' r='10' class='guide-start-dot'></circle>" +
      optionalDot;
  }

  function setMascotState(element, stateClass) {
    if (!element) {
      return;
    }

    element.classList.remove(
      "mascot-idle",
      "mascot-presenting",
      "mascot-encouraging",
      "mascot-celebrating",
      "mascot-tryagain"
    );
    element.classList.add(stateClass);
  }

  function applyStageBackground(stageBackground) {
    const defaultBackground = "linear-gradient(135deg, #fff8e7 0%, #ffe5b4 100%)";
    const activeBackground = stageBackground || defaultBackground;

    [dom.stages.meet, dom.stages.pick, dom.stages.trace, dom.stages.celebrate].forEach(function (stage) {
      stage.style.background = activeBackground;
    });

    [dom.stages.home, dom.stages.complete, dom.stages.settings].forEach(function (stage) {
      stage.style.background = defaultBackground;
    });

    document.body.style.background = defaultBackground;
  }

  function syncNfcState() {
    const nfcSupported = nfc && nfc.isNfcSupported && nfc.isNfcSupported();
    const shouldShowPrompt = state.settings.nfcModeOn && nfcSupported;

    dom.nfcPrompt.hidden = !shouldShowPrompt;

    if (!state.settings.nfcModeOn) {
      stopNfcIfRunning();
      return;
    }

    if (!nfcSupported) {
      console.log("NFC mode is on, but Web NFC is unavailable. Using normal start flow.");
      stopNfcIfRunning();
      return;
    }

    if (state.currentStage === "home") {
      startNfcIfNeeded();
    }
  }

  function startNfcIfNeeded() {
    if (!nfc || !state.settings.nfcModeOn || state.nfcListening) {
      return;
    }

    nfc.startNfcScan(function (parsed) {
      if (!parsed || !parsed.letterId || state.currentStage !== "home") {
        return;
      }

      startSession(parsed.letterId);
    }).then(function (started) {
      state.nfcListening = Boolean(started);
    });
  }

  function stopNfcIfRunning() {
    if (!nfc || !state.nfcListening) {
      return;
    }

    nfc.stopNfcScan();
    state.nfcListening = false;
  }

  function populateSettingsForm() {
    const activeSet = new Set(state.settings.activeLetterIds);

    dom.settingChildName.value = state.settings.childName;
    dom.settingAudio.checked = state.settings.audioEnabled;
    dom.settingSoundEffects.checked = state.settings.soundEffectsEnabled;
    dom.settingGuideDefault.checked = state.settings.formationGuideDefaultOn;
    dom.settingNfcMode.checked = state.settings.nfcModeOn;

    document.querySelectorAll("input[data-letter-toggle='true']").forEach(function (input) {
      input.checked = activeSet.has(input.value);
    });

    document.querySelectorAll("input[name='display-case']").forEach(function (input) {
      input.checked = input.value === state.settings.displayCase;
    });

    document.querySelectorAll("input[name='trace-case']").forEach(function (input) {
      input.checked = input.value === state.settings.traceCase;
    });

    updateSettingsProgressSummary();

    if (!audio.isSoundEffectsSupported()) {
      dom.settingSoundEffects.checked = false;
      dom.settingSoundEffects.disabled = true;
    } else {
      dom.settingSoundEffects.disabled = false;
    }

    showSettingsMessage("", "");
  }

  function saveSettingsFromForm() {
    const selectedLetterIds = Array.from(
      document.querySelectorAll("input[data-letter-toggle='true']:checked")
    ).map(function (input) {
      return input.value;
    });

    if (!selectedLetterIds.length) {
      showSettingsMessage("Please keep at least one active letter.", "error");
      return;
    }

    const displayCase =
      document.querySelector("input[name='display-case']:checked")?.value || "uppercase";
    const traceCase =
      document.querySelector("input[name='trace-case']:checked")?.value || "uppercase";

    state.settings = {
      childName: dom.settingChildName.value.trim(),
      activeLetterIds: selectedLetterIds,
      displayCase: displayCase,
      traceCase: traceCase,
      audioEnabled: dom.settingAudio.checked,
      soundEffectsEnabled: dom.settingSoundEffects.checked && audio.isSoundEffectsSupported(),
      formationGuideDefaultOn: dom.settingGuideDefault.checked,
      nfcModeOn: dom.settingNfcMode.checked
    };

    saveSettings();
    syncAudioSettings();
    updateHomeLettersRow();
    showSettingsMessage("Settings saved.", "ok");

    window.setTimeout(function () {
      goHome();
    }, 300);
  }

  function updateHomeLettersRow() {
    dom.activeLettersRow.innerHTML = "";

    getActiveLetters().forEach(function (letter) {
      const bubble = document.createElement("div");
      bubble.className = "letter-bubble";
      bubble.textContent = letter.uppercase;
      bubble.style.background = letter.stageBackground;
      dom.activeLettersRow.appendChild(bubble);
    });
  }

  function updateProgressForCurrentLetter() {
    if (!state.currentLetter) {
      return;
    }

    const id = state.currentLetter.id;
    if (!state.progress.letterStats[id]) {
      state.progress.letterStats[id] = { seen: 0, correctFirstTry: 0 };
    }

    state.progress.totalLettersPractised += 1;
    state.progress.letterStats[id].seen += 1;

    if (state.currentPickState && state.currentPickState.correctFirstTry) {
      state.progress.letterStats[id].correctFirstTry += 1;
    }

    saveProgress();
  }

  function updateSettingsProgressSummary() {
    dom.settingsProgress.textContent =
      "Sessions: " +
      state.progress.totalSessions +
      " | Letters practised: " +
      state.progress.totalLettersPractised;
  }

  function resetProgress() {
    state.progress = createBlankProgress();
    saveProgress();
    updateSettingsProgressSummary();
    showSettingsMessage("Progress reset.", "ok");
  }

  function showSettingsMessage(text, tone) {
    dom.settingsMessage.textContent = text;
    dom.settingsMessage.className = "settings-message";
    if (tone) {
      dom.settingsMessage.classList.add(tone);
    }
  }

  function syncAudioSettings() {
    audio.configureAudio(state.settings);
  }

  function getLetterCharacter(letter, displayCase) {
    return displayCase === "lowercase" ? letter.lowercase : letter.uppercase;
  }

  function buildPickCaseQueue(length) {
    if (state.settings.displayCase === "uppercase") {
      return new Array(length).fill("uppercase");
    }

    if (state.settings.displayCase === "lowercase") {
      return new Array(length).fill("lowercase");
    }

    const startWithUppercase = Math.random() < 0.5;
    const queue = [];
    for (let index = 0; index < length; index += 1) {
      const evenStep = index % 2 === 0;
      const useUpper = evenStep ? startWithUppercase : !startWithUppercase;
      queue.push(useUpper ? "uppercase" : "lowercase");
    }
    return queue;
  }

  function getPickCaseForCurrentLetter() {
    return state.pickCaseQueue[state.currentLetterIndex] || "uppercase";
  }

  function resolveSessionTraceCase() {
    if (state.settings.traceCase === "uppercase") {
      return "uppercase";
    }

    if (state.settings.traceCase === "lowercase") {
      return "lowercase";
    }

    return state.progress.totalSessions % 2 === 0 ? "uppercase" : "lowercase";
  }

  function getTraceCaseForCurrentLetter() {
    return state.sessionTraceCase;
  }

  function getActiveFormation(letter) {
    if (!letter || !letter.formation) {
      return null;
    }
    return letter.formation[state.currentTraceCase];
  }

  function getActiveLetters() {
    const set = new Set(state.settings.activeLetterIds);
    const active = data.letters.filter(function (letter) {
      return set.has(letter.id);
    });

    return active.length ? active : [data.letters[0]];
  }

  function clearAutoTimer() {
    if (!state.autoTimerId) {
      return;
    }
    window.clearTimeout(state.autoTimerId);
    state.autoTimerId = null;
  }

  function loadSettings() {
    const defaults = JSON.parse(JSON.stringify(data.defaultSettings));

    try {
      const saved = JSON.parse(localStorage.getItem(storageKeys.settings));
      if (!saved) {
        return defaults;
      }

      return {
        childName: typeof saved.childName === "string" ? saved.childName : defaults.childName,
        activeLetterIds: Array.isArray(saved.activeLetterIds) && saved.activeLetterIds.length
          ? saved.activeLetterIds
          : defaults.activeLetterIds,
        displayCase: ["uppercase", "lowercase", "both"].includes(saved.displayCase)
          ? saved.displayCase
          : defaults.displayCase,
        traceCase: ["uppercase", "lowercase", "alternate"].includes(saved.traceCase)
          ? saved.traceCase
          : defaults.traceCase,
        audioEnabled: typeof saved.audioEnabled === "boolean" ? saved.audioEnabled : defaults.audioEnabled,
        soundEffectsEnabled: typeof saved.soundEffectsEnabled === "boolean"
          ? saved.soundEffectsEnabled
          : defaults.soundEffectsEnabled,
        formationGuideDefaultOn: typeof saved.formationGuideDefaultOn === "boolean"
          ? saved.formationGuideDefaultOn
          : defaults.formationGuideDefaultOn,
        nfcModeOn: typeof saved.nfcModeOn === "boolean" ? saved.nfcModeOn : defaults.nfcModeOn
      };
    } catch (error) {
      console.warn("Could not load settings:", error);
      return defaults;
    }
  }

  function saveSettings() {
    localStorage.setItem(storageKeys.settings, JSON.stringify(state.settings));
  }

  function createBlankProgress() {
    const letterStats = {};
    data.letters.forEach(function (letter) {
      letterStats[letter.id] = { seen: 0, correctFirstTry: 0 };
    });

    return {
      totalSessions: 0,
      totalLettersPractised: 0,
      letterStats: letterStats
    };
  }

  function loadProgress() {
    const blank = createBlankProgress();

    try {
      const saved = JSON.parse(localStorage.getItem(storageKeys.progress));
      if (!saved) {
        return blank;
      }

      blank.totalSessions = Number(saved.totalSessions) || 0;
      blank.totalLettersPractised = Number(saved.totalLettersPractised) || 0;

      Object.keys(blank.letterStats).forEach(function (id) {
        blank.letterStats[id].seen = Number(saved.letterStats?.[id]?.seen) || 0;
        blank.letterStats[id].correctFirstTry = Number(saved.letterStats?.[id]?.correctFirstTry) || 0;
      });

      return blank;
    } catch (error) {
      console.warn("Could not load progress:", error);
      return blank;
    }
  }

  function saveProgress() {
    localStorage.setItem(storageKeys.progress, JSON.stringify(state.progress));
  }

  function shuffle(array) {
    for (let i = array.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
    return array;
  }

  window.QuinnjaLetters = window.QuinnjaLetters || {};
  window.QuinnjaLetters.App = {
    startSession,
    showStage,
    goHome
  };
})();
