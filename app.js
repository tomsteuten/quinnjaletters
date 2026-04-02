(function () {
  const data = (window.QuinnjaLetters && window.QuinnjaLetters.Data) || window.QuinnjaData;
  const audio = (window.QuinnjaLetters && window.QuinnjaLetters.Audio) || window.QuinnjaAudio;
  const speech = (window.QuinnjaLetters && window.QuinnjaLetters.Speech) || window.QuinnjaSpeech;
  const nfc = (window.QuinnjaLetters && window.QuinnjaLetters.Nfc) || window.QuinnjaNfc;

  const storageKeys = {
    settings: "quinnjaLetters.settings",
    progress: "quinnjaLetters.progress",
    numbersProgress: "quinnjaLetters.numbersProgress"
  };

  const stageOrder = ["meet", "pick", "trace", "celebrate"];

  function smoothCrossfadeLoop(video, fadeDuration, triggerBefore) {
    var parent = video.parentElement;
    if (getComputedStyle(parent).position === 'static') {
      parent.style.position = 'relative';
    }
    var standby = document.createElement('video');
    standby.src         = video.src;
    standby.muted       = true;
    standby.playsInline = true;
    standby.style.cssText =
      'position:absolute;inset:0;width:100%;height:100%;object-fit:contain;opacity:0;pointer-events:none;';
    parent.appendChild(standby);
    var active = video, swap = standby, busy = false, tm = null;
    video.loop = false;
    function check() {
      if (!active.duration || busy) return;
      var rem = active.duration - active.currentTime;
      if (rem <= triggerBefore) {
        busy = true;
        swap.currentTime = 0;
        swap.play();
        void active.offsetWidth;
        active.style.transition = 'opacity ' + fadeDuration + 's linear';
        swap.style.transition   = 'opacity ' + fadeDuration + 's linear';
        active.style.opacity = '0';
        swap.style.opacity   = '1';
        tm = setTimeout(function () {
          active.pause();
          active.style.transition = 'none';
          active.style.opacity    = '0';
          var tmp = active; active = swap; swap = tmp;
          busy = false;
        }, (fadeDuration + 0.15) * 1000);
      }
    }
    video.addEventListener('timeupdate', check);
    standby.addEventListener('timeupdate', check);
    [video, standby].forEach(function (v) {
      v.addEventListener('ended', function () {
        if (!busy) { active.currentTime = 0; active.play(); }
      });
    });
  }

  // AI note: quick rollback switch for celebrate mascot video.
  // Set enabled to false to instantly restore the original PNG fallback.
  const celebrateMascotVideoConfig = {
    enabled: true,
    preferredSource: "assets/processed/green_trim_alpha_rgbkey_balanced.webm"
    // Alternative tested-good source:
    // preferredSource: "assets/processed/green_trim_alpha_rgbkey_soft.webm"
  };

  // AI note: quick rollback switch for meet mascot video.
  // Set enabled to false to instantly restore the original PNG fallback.
  const meetMascotVideoConfig = {
    enabled: true,
    preferredSource: "assets/processed/greenwaving_alpha_rgb_soft.webm"
    // Alternative tested-good source:
    // preferredSource: "assets/processed/greenwaving_alpha_rgb_balanced.webm"
  };

  // AI note: quick rollback switch for trace mascot video.
  // Set enabled to false to instantly restore the original PNG fallback.
  const traceMascotVideoConfig = {
    enabled: true,
    preferredSource: "assets/processed/tracinggreen_alpha_rgb_soft.webm"
    // Alternative tested-good source:
    // preferredSource: "assets/processed/tracinggreen_alpha_rgb_balanced.webm"
  };

  // AI note: quick rollback switch for home mascot video.
  // Set enabled to false to instantly restore the original PNG fallback.
  const homeMascotVideoConfig = {
    enabled: true,
    preferredSource: "assets/processed/idlegreen_alpha_rgb_soft.webm"
    // Alternative tested-good source:
    // preferredSource: "assets/processed/idlegreen_alpha_rgb_ultrasoft.webm"
  };

  const state = {
    currentStage: "home",
    currentLetterIndex: 0,
    letterQueue: [],
    currentLetter: null,
    sessionResults: [],
    currentPickState: null,
    currentPickCase: "uppercase",
    currentPickMode: "visual",
    currentTraceCase: "uppercase",
    pickCaseQueue: [],
    pickModeQueue: [],
    sessionTraceCase: "uppercase",
    sessionTraceImages: {},
    settings: loadSettings(),
    progress: loadProgress(),
    numbersProgress: loadNumbersProgress(),
    autoTimerId: null,
    nfcSingleLetterSession: false,
    nfcListening: false,
    lastTracedDataUrl: null
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
    homeMascotVideo: document.getElementById("home-mascot-video"),
    homeMascotFallback: document.getElementById("home-mascot-fallback"),
    modeToggle: document.getElementById("mode-toggle"),
    modeToggleLetters: document.getElementById("mode-toggle-letters"),
    modeToggleNumbers: document.getElementById("mode-toggle-numbers"),
    activeLettersRow: document.getElementById("home-active-letters"),
    nfcPrompt: document.getElementById("nfc-prompt"),
    startSessionBtn: document.getElementById("btn-start-session"),

    meetLetterUpper: document.getElementById("meet-letter-upper"),
    meetLetterLower: document.getElementById("meet-letter-lower"),
    meetMascotWrap: document.getElementById("meet-mascot-wrap"),
    meetMascotVideo: document.getElementById("meet-mascot-video"),
    meetMascotFallback: document.getElementById("meet-mascot-fallback"),

    pickTargetLetter: document.getElementById("pick-target-letter"),
    pickOptions: document.getElementById("pick-options"),
    pickFeedback: document.getElementById("pick-feedback"),
    pickMascotWrap: document.getElementById("pick-mascot-wrap"),
    pickMascotVideo: document.getElementById("pick-mascot-video"),
    pickMascotFallback: document.getElementById("pick-mascot-fallback"),
    pickWrongVideo: document.getElementById("pick-wrong-video"),

    traceLetter: document.getElementById("trace-letter"),
    traceGuide: document.getElementById("trace-guide"),
    traceCanvas: document.getElementById("trace-canvas"),
    traceBoard: document.getElementById("trace-board"),
    traceMascotWrap: document.getElementById("trace-mascot-wrap"),
    traceMascotVideo: document.getElementById("trace-mascot-video"),
    traceMascotFallback: document.getElementById("trace-mascot-fallback"),
    traceClearBtn: document.getElementById("btn-trace-clear"),
    traceDoneBtn: document.getElementById("btn-trace-done"),

    celebrateMascotWrap: document.getElementById("celebrate-mascot-wrap"),
    celebrateMascotVideo: document.getElementById("celebrate-mascot-video"),
    celebrateMascotFallback: document.getElementById("celebrate-mascot-fallback"),
    celebrateLetterMain: document.getElementById("celebrate-letter-main"),
    celebrateLetterSide: document.getElementById("celebrate-letter-side"),
    celebrateTracedImg: document.getElementById("celebrate-traced-img"),
    celebrateNextBtn: document.getElementById("btn-celebrate-next"),

    completeMascotWrap: document.getElementById("complete-mascot-wrap"),
    completeLetters: document.getElementById("complete-letters"),
    replayBtn: document.getElementById("btn-replay"),
    homeBtn: document.getElementById("btn-home"),

    openSettingsHomeBtn: document.getElementById("btn-open-settings-home"),
    openSettingsCompleteBtn: document.getElementById("btn-open-settings-complete"),
    globalHomeBtn: document.getElementById("btn-global-home"),

    settingChildName: document.getElementById("setting-child-name"),
    settingsLetterToggles: document.getElementById("settings-letter-toggles"),
    settingsNumberToggles: document.getElementById("settings-number-toggles"),
    settingsLetterSection: document.getElementById("settings-letter-section"),
    settingsNumberSection: document.getElementById("settings-number-section"),
    settingsCaseSection: document.getElementById("settings-case-section"),
    homeTitle: document.getElementById("home-title"),
    letterPresetSelector: document.getElementById("letter-preset-selector"),
    numberPresetSelector: document.getElementById("number-preset-selector"),
    customLettersCollapsible: document.getElementById("custom-letters-collapsible"),
    settingAudio: document.getElementById("setting-audio"),
    settingSoundEffects: document.getElementById("setting-sound-effects"),
    settingGuideDefault: document.getElementById("setting-guide-default"),
    settingNfcMode: document.getElementById("setting-nfc-mode"),
    settingsProgress: document.getElementById("settings-progress"),
    settingsMessage: document.getElementById("settings-message"),
    saveSettingsBtn: document.getElementById("btn-save-settings"),
    resetProgressBtn: document.getElementById("btn-reset-progress"),

    meetCue: document.getElementById("meet-cue"),
    meetQuantityDots: document.getElementById("meet-quantity-dots"),
    meetPictureCue: document.getElementById("meet-picture-cue"),
    meetPictureCueImg: document.getElementById("meet-picture-cue-img"),
    meetPictureCueWord: document.getElementById("meet-picture-cue-word"),
    meetActions: document.getElementById("meet-actions"),
    meetReplayBtn: document.getElementById("btn-meet-replay"),
    meetContinueBtn: document.getElementById("btn-meet-continue"),
    pickReplayBtn: null,
    homeProgressDots: document.getElementById("home-progress-dots"),
    confirmOverlay: document.getElementById("confirm-overlay"),
    confirmStayBtn: document.getElementById("btn-confirm-stay"),
    confirmLeaveBtn: document.getElementById("btn-confirm-leave"),
    confettiContainer: document.getElementById("confetti-container"),
    homeGreeting: document.getElementById("home-greeting"),
    traceProgressFill: document.getElementById("trace-progress-fill"),
    settingAmbient: document.getElementById("setting-ambient"),
    settingSpeechSynth: document.getElementById("setting-speech-synth"),
    speechSynthOptions: document.getElementById("speech-synth-options"),
    settingSpeechVoice: document.getElementById("setting-speech-voice"),
    settingSpeechRate: document.getElementById("setting-speech-rate"),
    settingSpeechPitch: document.getElementById("setting-speech-pitch"),
    btnTestSpeech: document.getElementById("btn-test-speech"),
    settingsSpeechGroup: document.getElementById("settings-speech-group")
  };

  function createTrackerView(wrapperId, stripId, countId) {
    var wrapper = document.getElementById(wrapperId);
    if (!wrapper) {
      return null;
    }

    return {
      wrapper: wrapper,
      strip: document.getElementById(stripId),
      count: document.getElementById(countId),
      prevBtn: wrapper.querySelector(".tracker-nav-prev"),
      nextBtn: wrapper.querySelector(".tracker-nav-next")
    };
  }

  var trackerViews = {
    home: [createTrackerView("tracker-home", "home-progress-dots", "tracker-count-home")].filter(Boolean),
    session: [
      createTrackerView("tracker-meet", "session-dots-meet", "tracker-count-meet"),
      createTrackerView("tracker-pick", "session-dots-pick", "tracker-count-pick"),
      createTrackerView("tracker-trace", "session-dots-trace", "tracker-count-trace"),
      createTrackerView("tracker-celebrate", "session-dots-celebrate", "tracker-count-celebrate")
    ].filter(Boolean)
  };

  var trackerState = {
    home: { items: [], focusIndex: 0, windowStart: 0, viewportSize: 0 },
    session: { items: [], focusIndex: 0, windowStart: 0, viewportSize: 0 }
  };

  const traceState = {
    ctx: null,
    isDrawing: false,
    hasStrokes: false,
    width: 220,
    height: 220,
    hitmask: null,
    lastPoint: null,
    coveredCells: new Set(),
    totalLetterCells: 0,
    traceAttempts: 0
  };

  var preloadedVideos = new Set();

  function renderSessionDots() {
    var items = [];

    for (var i = 0; i < state.letterQueue.length; i++) {
      var letter = state.letterQueue[i];
      var dotClass = "session-dot";
      var style = "";
      var traceImgHtml = "";
      var traceImgSrc = state.sessionTraceImages[letter.id];

      if (i < state.currentLetterIndex) {
        dotClass += " session-dot-done";
        style = "border-color:" + letter.colourDark + "; background:" + letter.colourLight + "; color:" + letter.colourDark + ";";
      } else if (i === state.currentLetterIndex) {
        dotClass += " session-dot-current";
        style = "border-color:" + letter.colourDark + "; color:" + letter.colourDark + ";";
      } else {
        dotClass += " session-dot-upcoming";
      }

      if (traceImgSrc) {
        dotClass += " session-dot-has-trace";
        traceImgHtml = "<img class='session-dot-trace' src='" + traceImgSrc + "' alt='' aria-hidden='true' />";
      }

      items.push({
        html: "<span class='" + dotClass + "' style='" + style + "' aria-hidden='true'>"
          + "<span class='session-dot-letter'>" + getLetterCharacter(letter, "uppercase") + "</span>"
          + traceImgHtml
          + "</span>"
      });
    }

    setTrackerItems("session", items, state.currentLetterIndex, true);
  }

  init();

  function init() {
    setupButtons();
    setupDevShortcuts();
    setupSettingsUI();
    setupTraceCanvas();
    syncAudioSettings();
    updateHomeLettersRow();
    updateHomeProgressDots();
    updateSettingsProgressSummary();
    setupHomeMascotMedia();
    setupTraceMascotMedia();
    setupMeetMascotMedia();
    setupCelebrateMascotMedia();
    smoothCrossfadeLoop(document.getElementById('complete-mascot-video'), 0.30, 1.70);
    setupSpeechUI();
    setupDotStripOverflowTracking();
    updateModeToggle();
    updateModeVisibility();
    if (dom.homeTitle) {
      dom.homeTitle.textContent = isNumbersMode() ? "Quinnja Numbers" : "Quinnja Letters";
    }

    if (!audio.isSoundEffectsSupported()) {
      state.settings.soundEffectsEnabled = false;
    }

    saveSettings();
    syncAudioSettings();
    syncSpeechSettings();
    showStage("home");
  }

  function setupButtons() {
    document.addEventListener("click", function (event) {
      const button = event.target.closest("button");
      if (!button || button.disabled) {
        return;
      }
      if (button.classList.contains("trace-done-disabled")) {
        return;
      }
      audio.playButtonTap();
    });

    dom.startSessionBtn.addEventListener("click", function () {
      startSession();
    });

    if (dom.modeToggleLetters) {
      dom.modeToggleLetters.addEventListener("click", function () {
        setMode("letters");
      });
    }

    if (dom.modeToggleNumbers) {
      dom.modeToggleNumbers.addEventListener("click", function () {
        setMode("numbers");
      });
    }

    dom.openSettingsHomeBtn.addEventListener("click", openSettings);
    dom.openSettingsCompleteBtn.addEventListener("click", openSettings);

    dom.traceClearBtn.addEventListener("click", clearTraceCanvas);
    dom.traceDoneBtn.addEventListener("click", function () {
      if (!traceState.hasStrokes) {
        dom.traceBoard.classList.remove("trace-nudge");
        void dom.traceBoard.offsetWidth;
        dom.traceBoard.classList.add("trace-nudge");
        if (state.settings.soundEffectsEnabled) audio.playTryAgainTone();
        return;
      }

      var coverage = 0;
      if (traceState.totalLetterCells > 0) {
        coverage = traceState.coveredCells.size / traceState.totalLetterCells;
      }

      if (coverage < 0.45 && traceState.traceAttempts < 1) {
        traceState.traceAttempts++;
        setMascotState(dom.traceMascotWrap, "mascot-encouraging");
        // Placeholder: reuse existing trace prompt audio.
        // Replace with dedicated "keep tracing" audio when available.
        audio.playMp3(data.sharedAudio.tracePrompt);
        renderTraceGuide(state.currentLetter);
        return;
      }

      state.lastTracedDataUrl = dom.traceCanvas.toDataURL("image/png");
      state.sessionTraceImages[state.currentLetter.id] = state.lastTracedDataUrl;
      showCelebrateStage();
    });

    dom.meetReplayBtn.addEventListener("click", replayMeetAudio);
    dom.meetPictureCue.addEventListener("click", replayMeetAudio);
    dom.meetContinueBtn.addEventListener("click", function () {
      advanceStage();
    });

    dom.pickTargetLetter.addEventListener("click", replayPickAudio);

    dom.celebrateNextBtn.addEventListener("click", function () {
      advanceStage();
    });

    dom.confirmStayBtn.addEventListener("click", hideConfirmOverlay);
    dom.confirmLeaveBtn.addEventListener("click", function () {
      hideConfirmOverlay();
      goHome();
    });

    dom.replayBtn.addEventListener("click", function () {
      startSession();
    });

    dom.homeBtn.addEventListener("click", function () {
      goHome();
    });

    dom.globalHomeBtn.addEventListener("click", handleGlobalHomeClick);

    dom.saveSettingsBtn.addEventListener("click", saveSettingsFromForm);
    dom.resetProgressBtn.addEventListener("click", resetProgress);
  }

  function setupDevShortcuts() {
    // Desktop: Ctrl+Alt+N
    document.addEventListener("keydown", function (event) {
      if (!event.ctrlKey || !event.altKey || event.shiftKey || event.metaKey) {
        return;
      }

      if (String(event.key).toLowerCase() !== "n") {
        return;
      }

      if (isTypingTarget(event.target)) {
        return;
      }

      event.preventDefault();
      advanceStageForDevShortcut();
    });

    // Mobile: triple-tap top-right corner (44×44 zone)
    var tripleTapCount = 0;
    var tripleTapTimer = null;
    document.addEventListener("click", function (event) {
      var stage = event.target.closest(".stage");
      if (!stage) return;
      var rect = stage.getBoundingClientRect();
      var x = event.clientX - rect.left;
      var y = event.clientY - rect.top;
      if (x < rect.width - 44 || y > 44) return;
      tripleTapCount++;
      if (tripleTapCount >= 3) {
        tripleTapCount = 0;
        clearTimeout(tripleTapTimer);
        advanceStageForDevShortcut();
        return;
      }
      clearTimeout(tripleTapTimer);
      tripleTapTimer = setTimeout(function () { tripleTapCount = 0; }, 800);
    });
  }

  function isTypingTarget(target) {
    if (!target || !(target instanceof Element)) {
      return false;
    }

    if (target.isContentEditable) {
      return true;
    }

    const tag = target.tagName;
    return tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT";
  }

  function advanceStageForDevShortcut() {
    if (["home", "settings", "complete"].includes(state.currentStage)) {
      startSession();
      return;
    }

    if (!state.currentLetter) {
      startSession();
      return;
    }

    advanceStage();
  }

  var letterPresets = {
    satpin: ["s", "a", "t", "p", "i", "n"],
    all: data.letters.map(function (l) { return l.id; })
  };

  var numberPresets = {
    "1to5": ["1", "2", "3", "4", "5"],
    "0to10": (data.numbers || []).map(function (n) { return n.id; })
  };

  function syncNumberPresetHighlight() {
    var checked = Array.from(
      document.querySelectorAll("input[data-number-toggle='true']:checked")
    ).map(function (input) { return input.value; });
    var checkedSet = new Set(checked);
    document.querySelectorAll("[data-number-preset]").forEach(function (btn) {
      var presetIds = numberPresets[btn.dataset.numberPreset];
      if (!presetIds) { btn.classList.remove("active"); return; }
      var match = presetIds.length === checked.length &&
        presetIds.every(function (id) { return checkedSet.has(id); });
      btn.classList.toggle("active", match);
    });
  }

  function applyNumberPreset(presetName) {
    var ids = numberPresets[presetName];
    if (!ids) return;
    var idSet = new Set(ids);
    document.querySelectorAll("input[data-number-toggle='true']").forEach(function (input) {
      input.checked = idSet.has(input.value);
    });
    syncNumberPresetHighlight();
  }

  function syncLetterPresetHighlight() {
    var checked = Array.from(
      document.querySelectorAll("input[data-letter-toggle='true']:checked")
    ).map(function (input) { return input.value; });
    var checkedSet = new Set(checked);

    document.querySelectorAll(".letter-preset-btn").forEach(function (btn) {
      var presetIds = letterPresets[btn.dataset.preset];
      if (!presetIds) { btn.classList.remove("active"); return; }
      var match = presetIds.length === checked.length &&
        presetIds.every(function (id) { return checkedSet.has(id); });
      btn.classList.toggle("active", match);
    });
  }

  function applyLetterPreset(presetName) {
    var ids = letterPresets[presetName];
    if (!ids) return;
    var idSet = new Set(ids);
    document.querySelectorAll("input[data-letter-toggle='true']").forEach(function (input) {
      input.checked = idSet.has(input.value);
    });
    syncLetterPresetHighlight();
    if (dom.customLettersCollapsible) dom.customLettersCollapsible.removeAttribute("open");
  }

  function setupSettingsUI() {
    dom.settingsLetterToggles.innerHTML = "";
    if (dom.settingsNumberToggles) {
      dom.settingsNumberToggles.innerHTML = "";
    }

    data.letters.forEach(function (letter) {
      const label = document.createElement("label");
      const input = document.createElement("input");
      const text = document.createElement("span");

      input.type = "checkbox";
      input.value = letter.id;
      input.dataset.letterToggle = "true";
      text.textContent = letter.uppercase;

      input.addEventListener("change", syncLetterPresetHighlight);

      label.appendChild(input);
      label.appendChild(text);
      dom.settingsLetterToggles.appendChild(label);
    });

    (data.numbers || []).forEach(function (numberItem) {
      if (!dom.settingsNumberToggles) {
        return;
      }

      var label = document.createElement("label");
      var input = document.createElement("input");
      var text = document.createElement("span");

      input.type = "checkbox";
      input.value = numberItem.id;
      input.dataset.numberToggle = "true";
      text.textContent = numberItem.numeral;

      input.addEventListener("change", syncNumberPresetHighlight);

      label.appendChild(input);
      label.appendChild(text);
      dom.settingsNumberToggles.appendChild(label);
    });

    if (dom.letterPresetSelector) {
      dom.letterPresetSelector.addEventListener("click", function (e) {
        var btn = e.target.closest(".letter-preset-btn");
        if (btn) applyLetterPreset(btn.dataset.preset);
      });
    }

    if (dom.numberPresetSelector) {
      dom.numberPresetSelector.addEventListener("click", function (e) {
        var btn = e.target.closest("[data-number-preset]");
        if (btn) applyNumberPreset(btn.dataset.numberPreset);
      });
    }
  }

  function setupTraceCanvas() {
    var dpr = window.devicePixelRatio || 1;
    dom.traceCanvas.width = traceState.width * dpr;
    dom.traceCanvas.height = traceState.height * dpr;

    traceState.ctx = dom.traceCanvas.getContext("2d");
    traceState.ctx.scale(dpr, dpr);

    dom.traceCanvas.addEventListener("pointerdown", tracePointerDown);
    dom.traceCanvas.addEventListener("pointermove", tracePointerMove);
    dom.traceCanvas.addEventListener("pointerup", tracePointerUp);
    dom.traceCanvas.addEventListener("pointercancel", tracePointerUp);
    dom.traceCanvas.addEventListener("pointerleave", tracePointerUp);

    clearTraceCanvas();
  }

  function tracePointerDown(event) {
    traceState.isDrawing = true;
    traceState.hasStrokes = true;
    dom.traceDoneBtn.disabled = false;
    dom.traceDoneBtn.classList.remove("trace-done-disabled");
    dom.traceCanvas.setPointerCapture(event.pointerId);
    var point = getTracePoint(event);
    traceState.lastPoint = point;

    // Draw a dot at the starting point
    var onLetter = isPointOnLetter(point.x, point.y);
    traceState.ctx.save();
    traceState.ctx.fillStyle = onLetter ? "#342b22" : "rgba(52, 43, 34, 0.12)";
    traceState.ctx.beginPath();
    traceState.ctx.arc(point.x, point.y, onLetter ? 5.5 : 1.5, 0, Math.PI * 2);
    traceState.ctx.fill();
    traceState.ctx.restore();

    if (onLetter) {
      registerCoveredCells(point.x, point.y, point.x, point.y);
    }
    traceState.lastPoint = point;
  }

  /**
   * Register all 4×4 grid cells along a line from (x0,y0) to (x1,y1),
   * including cells within the stroke radius. This ensures the progress
   * ring reflects the full width of the drawn stroke, not just the
   * pointer's center point.
   */
  function registerCoveredCells(x0, y0, x1, y1) {
    var dx = x1 - x0;
    var dy = y1 - y0;
    var dist = Math.sqrt(dx * dx + dy * dy);
    var steps = Math.max(1, Math.ceil(dist / 2));
    for (var s = 0; s <= steps; s++) {
      var t = s / steps;
      var cx = x0 + dx * t;
      var cy = y0 + dy * t;
      var gcx = Math.floor(cx / 4);
      var gcy = Math.floor(cy / 4);
      // Register a 3×3 neighbourhood to match the ~11px stroke width
      for (var oy = -1; oy <= 1; oy++) {
        for (var ox = -1; ox <= 1; ox++) {
          traceState.coveredCells.add((gcx + ox) + "," + (gcy + oy));
        }
      }
    }
  }

  function tracePointerMove(event) {
    if (!traceState.isDrawing || !traceState.lastPoint) {
      return;
    }

    var point = getTracePoint(event);
    var onLetter = isPointOnLetter(point.x, point.y);

    traceState.ctx.save();
    traceState.ctx.lineCap = "round";
    traceState.ctx.lineJoin = "round";
    traceState.ctx.lineWidth = onLetter ? 11 : 3;
    traceState.ctx.strokeStyle = onLetter ? "#342b22" : "rgba(52, 43, 34, 0.12)";
    traceState.ctx.beginPath();
    traceState.ctx.moveTo(traceState.lastPoint.x, traceState.lastPoint.y);
    traceState.ctx.lineTo(point.x, point.y);
    traceState.ctx.stroke();
    traceState.ctx.restore();

    if (onLetter) {
      registerCoveredCells(traceState.lastPoint.x, traceState.lastPoint.y, point.x, point.y);
      updateTraceProgressRing();
    }
    traceState.lastPoint = point;
  }

  function tracePointerUp(event) {
    if (!traceState.isDrawing) {
      return;
    }

    traceState.isDrawing = false;
    traceState.lastPoint = null;
    if (dom.traceCanvas.hasPointerCapture(event.pointerId)) {
      dom.traceCanvas.releasePointerCapture(event.pointerId);
    }
  }

  function clearTraceCanvas() {
    if (!traceState.ctx) {
      return;
    }

    traceState.ctx.clearRect(0, 0, traceState.width, traceState.height);
    traceState.hasStrokes = false;
    traceState.coveredCells = new Set();
    traceState.traceAttempts = 0;
    traceState.lastPoint = null;
    if (dom.traceDoneBtn) {
      dom.traceDoneBtn.disabled = true;
      dom.traceDoneBtn.classList.add("trace-done-disabled");
    }
    updateTraceProgressRing();
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

  function buildTraceHitmask(letter, traceCase) {
    var w = traceState.width;
    var h = traceState.height;
    var offscreen = document.createElement("canvas");
    offscreen.width = w;
    offscreen.height = h;
    var ctx = offscreen.getContext("2d");

    var ch = getLetterCharacter(letter, traceCase);

    // Draw the letter using the same anchor coordinates as the SVG ghost text
    ctx.textAlign = "center";
    ctx.textBaseline = "alphabetic";
    var isMultiChar = ch.length > 1;
    ctx.font = (traceCase === "lowercase")
      ? "600 120px Fredoka, sans-serif"
      : (isMultiChar ? "600 110px Fredoka, sans-serif" : "600 150px Fredoka, sans-serif");

    var guide = getActiveFormation(letter);
    var x = 110;
    var y = isMultiChar ? 155 : 160;
    if (traceCase === "lowercase") {
      y = (guide && guide.showDescender) ? 155 : 158;
    }

    // Fill the letter shape
    ctx.fillStyle = "#000000";
    ctx.fillText(ch, x, y);

    // Also stroke with a narrower line to keep tolerance forgiving but closer to the letter shape
    ctx.lineWidth = 16;
    ctx.strokeStyle = "#000000";
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    ctx.strokeText(ch, x, y);

    // Extract pixel data as hitmask
    traceState.hitmask = ctx.getImageData(0, 0, w, h).data;

    // Progress denominator: use a narrower reference (fillText only, no stroke
    // padding) so coverage reflects the natural letter body the child can reach
    // with an 11px drawn stroke. The wide hitmask above stays for hit detection.
    var progressCanvas = document.createElement("canvas");
    progressCanvas.width = w;
    progressCanvas.height = h;
    var pctx = progressCanvas.getContext("2d");
    pctx.textAlign = "center";
    pctx.textBaseline = "alphabetic";
    pctx.font = ctx.font;
    pctx.fillStyle = "#000000";
    pctx.fillText(ch, x, y);

    var progressData = pctx.getImageData(0, 0, w, h).data;
    var totalCells = 0;
    for (var gy = 0; gy < h; gy += 4) {
      for (var gx = 0; gx < w; gx += 4) {
        var idx = (gy * w + gx) * 4 + 3;
        if (progressData[idx] > 0) totalCells++;
      }
    }
    traceState.totalLetterCells = totalCells;
  }

  function isPointOnLetter(x, y) {
    if (!traceState.hitmask) {
      return true; // no mask = all strokes visible (fallback)
    }
    var w = traceState.width;
    var ix = Math.round(x);
    var iy = Math.round(y);
    if (ix < 0 || ix >= w || iy < 0 || iy >= traceState.height) {
      return false;
    }
    // Check the alpha channel of the hitmask pixel
    var index = (iy * w + ix) * 4 + 3;
    return traceState.hitmask[index] > 0;
  }

  function startSession(optionalLetterId) {
    clearAutoTimer();
    stopNfcIfRunning();
    audio.resetShuffleTracking();

    const activeItems = getActiveLetters();
    let queue = [];

    if (optionalLetterId) {
      const match = getItemPool().find(function (item) {
        return item.id === optionalLetterId;
      });

      if (match) {
        queue = [match];
        state.nfcSingleLetterSession = true;
      }
    }

    if (!queue.length) {
      queue = activeItems.slice();
      queue = prioritiseWeakLetters(queue);
      state.nfcSingleLetterSession = false;
    }

    // Start ambient audio if enabled (requires user gesture, which this click provides)
    audio.startAmbient();

    state.sessionTraceCase = resolveSessionTraceCase();
    state.letterQueue = queue;
    state.pickCaseQueue = buildPickCaseQueue(queue.length);
    state.pickModeQueue = buildPickModeQueue(queue.length);
    state.currentLetterIndex = 0;
    state.sessionResults = [];
    state.sessionTraceImages = {};
    state.currentPickState = null;
    state.currentLetter = state.letterQueue[0] || null;
    state.lastTracedDataUrl = null;

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
    playMeetMascotVideo();
    dom.meetActions.classList.remove("meet-actions-visible");

    const meetFile = state.currentLetter.audio.meet;
    const soundFile = state.currentLetter.audio.sound;

    const fallbackTimer = window.setTimeout(function () {
      if (state.currentStage === "meet") {
        dom.meetActions.classList.add("meet-actions-visible");
      }
    }, 10000);

    // Delay audio 500ms so the stage transition completes before speech begins
    window.setTimeout(function () {
      if (state.currentStage !== "meet") return;
      audio.playMp3Sequence([meetFile, soundFile], function () {
        window.clearTimeout(fallbackTimer);
        if (state.currentStage === "meet") {
          dom.meetActions.classList.add("meet-actions-visible");
        }
      });
    }, 500);
    renderSessionDots();
  }

  function showPickStage() {
    showStage("pick");
    setMascotState(dom.pickMascotWrap, "mascot-encouraging");
    state.currentPickCase = getPickCaseForCurrentLetter();
    state.currentPickMode = state.pickModeQueue[state.currentLetterIndex] || "visual";

    state.currentPickState = {
      solved: false,
      correctFirstTry: true
    };

    if (state.currentPickMode === "sound") {
      dom.pickTargetLetter.innerHTML = '<img src="assets/icons/speaker.svg" alt="Listen" class="pick-sound-icon" />';
      dom.pickTargetLetter.setAttribute("aria-label", isNumbersMode() ? "Which number is this?" : "Which letter makes this sound?");
    } else {
      dom.pickTargetLetter.textContent = getLetterCharacter(state.currentLetter, state.currentPickCase);
      dom.pickTargetLetter.removeAttribute("aria-label");
    }

    dom.pickOptions.innerHTML = "";
    dom.pickFeedback.textContent = "";

    var promptEl = document.getElementById("pick-prompt");
    if (promptEl) {
      if (state.currentPickMode === "sound") {
        promptEl.textContent = isNumbersMode() ? "Which number?" : "Which letter?";
      } else {
        promptEl.textContent = (isNumbersMode() ? "Find number " : "Find ") + getLetterCharacter(state.currentLetter, state.currentPickCase);
      }
    }

    const options = buildPickOptions(state.currentLetter);
    options.forEach(function (optionLetter) {
      const button = document.createElement("button");
      button.className = "pick-option";
      button.type = "button";
      button.textContent = getLetterCharacter(optionLetter, state.currentPickCase);
      button.dataset.letterId = optionLetter.id;
      button.setAttribute("aria-label", (isNumbersMode() ? "Number " : "Letter ") + getLetterCharacter(optionLetter, state.currentPickCase));

      button.addEventListener("click", function () {
        handlePickSelection(optionLetter.id, button);
      });

      dom.pickOptions.appendChild(button);
    });

    // Delay audio 300ms so the stage transition completes before speech begins
    window.setTimeout(function () {
      if (state.currentStage !== "pick") return;
      if (state.currentPickMode === "sound") {
        audio.playMp3(state.currentLetter.audio.sound);
      } else {
        audio.playMp3(state.currentLetter.audio.pick);
      }
    }, 300);
    renderSessionDots();
  }

  function handlePickSelection(letterId, button) {
    audio.stopCurrentAudio();

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

      // Stop wrong-answer video if it's still playing
      if (dom.pickWrongVideo && !dom.pickWrongVideo.hidden) {
        dom.pickWrongVideo.pause();
        dom.pickWrongVideo.hidden = true;
        dom.pickMascotVideo.hidden = false;
      }
      setMascotState(dom.pickMascotWrap, "mascot-celebrating");
      dom.pickFeedback.textContent = "Correct";
      audio.playCorrectChime();
      if (navigator.vibrate) navigator.vibrate(50);

      audio.playRandomMp3WithCustom(data.sharedAudio.praise, "praise", function () {
        state.autoTimerId = window.setTimeout(function () {
          advanceStage();
        }, 800);
      });

      return;
    }

    state.currentPickState.correctFirstTry = false;
    button.disabled = true;
    button.classList.add("is-wrong", "flash-wrong");
    setMascotState(dom.pickMascotWrap, "mascot-tryagain");
    playPickWrongReaction();
    dom.pickFeedback.textContent = "Try again";
    audio.playMp3(data.sharedAudio.tryAgain, function () {
      if (state.currentStage === "pick") {
        replayPickAudio();
      }
    });
    if (navigator.vibrate) navigator.vibrate([40, 30, 40]);

    // After a brief delay, add a subtle hint glow to the correct answer button
    window.setTimeout(function () {
      if (state.currentStage !== "pick") return;
      var correctBtn = dom.pickOptions.querySelector("[data-letter-id='" + state.currentLetter.id + "']");
      if (correctBtn && !correctBtn.disabled) {
        correctBtn.classList.add("hint-glow");
        // Remove glow after 2 seconds
        window.setTimeout(function () {
          correctBtn.classList.remove("hint-glow");
        }, 2000);
      }
    }, 600);

    window.setTimeout(function () {
      if (state.currentStage === "pick") {
        setMascotState(dom.pickMascotWrap, "mascot-encouraging");
      }
    }, 430);
  }

  function playPickWrongReaction() {
    if (!dom.pickWrongVideo || !dom.pickMascotVideo) {
      return;
    }
    // Hide the normal encouraging video, show the wrong-answer video
    dom.pickMascotVideo.hidden = true;
    dom.pickWrongVideo.hidden = false;
    dom.pickWrongVideo.currentTime = 0;
    var playPromise = dom.pickWrongVideo.play();
    if (playPromise && typeof playPromise.catch === "function") {
      playPromise.catch(function () {
        // If it fails to play, just revert immediately
        dom.pickWrongVideo.hidden = true;
        dom.pickMascotVideo.hidden = false;
      });
    }
    // When the wrong-answer clip finishes, revert to the encouraging video
    dom.pickWrongVideo.onended = function () {
      dom.pickWrongVideo.hidden = true;
      dom.pickMascotVideo.hidden = false;
    };
  }

  function showTraceStage() {
    showStage("trace");
    setMascotState(dom.traceMascotWrap, "mascot-encouraging");
    playTraceMascotVideo();
    state.currentTraceCase = getTraceCaseForCurrentLetter();
    dom.traceLetter.textContent = getLetterCharacter(state.currentLetter, state.currentTraceCase);
    clearTraceCanvas();
    traceState.hasStrokes = false;
    traceState.coveredCells = new Set();
    traceState.traceAttempts = 0;
    dom.traceDoneBtn.disabled = true;
    dom.traceDoneBtn.classList.add("trace-done-disabled");
    buildTraceHitmask(state.currentLetter, state.currentTraceCase);
    renderTraceGuide(state.currentLetter);
    audio.playMp3(data.sharedAudio.tracePrompt);
    renderSessionDots();
  }

  function showCelebrateStage() {
    showStage("celebrate");
    setMascotState(dom.celebrateMascotWrap, "mascot-celebrating");
    playCelebrateMascotVideo();
    spawnConfetti();
    const tracedChar = getLetterCharacter(state.currentLetter, state.currentTraceCase);
    dom.celebrateLetterMain.textContent = tracedChar;
    if (isNumbersMode()) {
      // Improvement #4: show dot pattern instead of word; #5: use theme colour
      dom.celebrateLetterSide.innerHTML = renderDotPatternSVG(
        state.currentLetter.dotPattern || [],
        state.currentLetter.colourDark
      );
    } else {
      dom.celebrateLetterSide.innerHTML = "";
      dom.celebrateLetterSide.textContent = getLetterCharacter(
        state.currentLetter,
        state.currentTraceCase === "uppercase" ? "lowercase" : "uppercase"
      );
    }

    if (state.lastTracedDataUrl) {
      dom.celebrateTracedImg.src = state.lastTracedDataUrl;
      dom.celebrateTracedImg.hidden = false;
    } else {
      dom.celebrateTracedImg.hidden = true;
    }

    state.sessionResults.push({
      letterId: state.currentLetter.id,
      pickCorrectOnFirstTry: Boolean(state.currentPickState && state.currentPickState.correctFirstTry)
    });

    updateProgressForCurrentLetter();
    audio.playCelebrationSequence();

    window.setTimeout(function () {
      audio.playRandomMp3WithCustom(data.sharedAudio.celebrate, "celebrate", function () {
        // After celebrate MP3, optionally speak the child's name via SpeechSynthesis
        if (speech && state.settings.speechSynthEnabled && state.settings.childName) {
          window.setTimeout(function () {
            speech.speakCelebration(state.settings.childName);
          }, 300);
        }
      });
    }, 400);
    renderSessionDots();
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

    var activeProgress = getActiveProgress();
    activeProgress.totalSessions += 1;
    if (isNumbersMode()) {
      saveNumbersProgress();
    } else {
      saveProgress();
    }
    showCompleteStage();
  }

  function showCompleteStage() {
    showStage("complete");
    setMascotState(dom.completeMascotWrap, "mascot-celebrating");

    dom.completeLetters.innerHTML = "";
    var itemPool = getItemPool();
    var letterOrder = itemPool.map(function (l) { return l.id; });
    var sortedResults = state.sessionResults.slice().sort(function (a, b) {
      return letterOrder.indexOf(a.letterId) - letterOrder.indexOf(b.letterId);
    });
    sortedResults.forEach(function (result) {
      const letter = itemPool.find(function (item) {
        return item.id === result.letterId;
      });
      if (!letter) {
        return;
      }

      const chip = document.createElement("div");
      chip.className = "complete-chip";
      chip.textContent = getLetterCharacter(letter, "uppercase");

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
    if (isNumbersMode()) {
      dom.meetLetterUpper.textContent = letter.numeral || letter.uppercase;
      dom.meetLetterLower.textContent = letter.word || "";
      if (dom.meetQuantityDots) {
        dom.meetQuantityDots.innerHTML = renderDotPatternSVG(letter.dotPattern || [], letter.colourDark);
        dom.meetQuantityDots.hidden = false;
      }
    } else {
      dom.meetLetterUpper.textContent = letter.uppercase;
      dom.meetLetterLower.textContent = letter.lowercase;
      if (dom.meetQuantityDots) {
        dom.meetQuantityDots.hidden = true;
        dom.meetQuantityDots.innerHTML = "";
      }
    }
    applyStageBackground(letter.stageBackground);

    const pictureCueSrc = letter.pictureCueSrc || ("assets/images/cues/cue-" + letter.id + ".png");
    if (!isNumbersMode() && letter.pictureCueWord) {
      dom.meetPictureCueImg.onerror = function () {
        dom.meetPictureCue.hidden = true;
        dom.meetPictureCueImg.onerror = null;
      };
      dom.meetPictureCueImg.src = pictureCueSrc;
      dom.meetPictureCueImg.alt = letter.pictureCueWord;
      dom.meetPictureCueWord.textContent = letter.pictureCueWord;
      dom.meetPictureCue.hidden = false;
    } else {
      dom.meetPictureCue.hidden = true;
    }
  }

  function showStage(stageName) {
    audio.stopCurrentAudio();
    clearAutoTimer();

    // Find the currently active stage for exit animation
    var currentActive = null;
    Object.keys(dom.stages).forEach(function (name) {
      if (dom.stages[name].classList.contains("active") && name !== stageName) {
        currentActive = dom.stages[name];
      }
    });

    // Apply exit transition if there's a current stage, then switch
    if (currentActive) {
      currentActive.classList.add("stage-exiting");
      currentActive.classList.remove("active");
      // Clean up after exit transition completes
      window.setTimeout(function () {
        currentActive.classList.remove("stage-exiting");
      }, 260);
    }

    Object.keys(dom.stages).forEach(function (name) {
      if (name === stageName) {
        dom.stages[name].classList.add("active");
      } else if (dom.stages[name] !== currentActive) {
        dom.stages[name].classList.remove("active");
      }
    });

    state.currentStage = stageName;
    dom.stageStatus.textContent = "Stage: " + stageName;
    dom.globalHomeBtn.hidden = stageName === "home" || stageName === "settings";

    if (stageName === "home") {
      applyStageBackground("");
      updateHomeLettersRow();
      updateHomeProgressDots();
      updateHomeGreeting();
      syncNfcState();
      playHomeMascotVideo();
    } else {
      stopNfcIfRunning();
      if (stageName === "complete" || stageName === "settings") {
        applyStageBackground("");
      }
    }

    if (stageName !== "home") {
      stopHomeMascotVideo();
    }

    if (stageName !== "meet") {
      stopMeetMascotVideo();
    }

    if (stageName !== "trace") {
      stopTraceMascotVideo();
    }

    if (stageName !== "celebrate") {
      stopCelebrateMascotVideo();
    }

    // Preload the next stage's video in the background for smoother transitions
    preloadNextVideo(stageName);
  }

  /**
   * Warm the browser cache for the next stage's mascot video.
    * Uses preload links to avoid file:// fetch CORS issues.
   */
  function preloadNextVideo(currentStage) {
    var nextVideoSrc = null;
    if (currentStage === "home") {
      nextVideoSrc = meetMascotVideoConfig.preferredSource;
    } else if (currentStage === "meet") {
      nextVideoSrc = traceMascotVideoConfig.preferredSource;
    } else if (currentStage === "trace") {
      nextVideoSrc = celebrateMascotVideoConfig.preferredSource;
    }
    if (nextVideoSrc && !preloadedVideos.has(nextVideoSrc)) {
      preloadedVideos.add(nextVideoSrc);
      var preload = document.createElement("link");
      preload.rel = "preload";
      preload.as = "video";
      preload.href = nextVideoSrc;
      document.head.appendChild(preload);
    }
  }

  function setupHomeMascotMedia() {
    if (!dom.homeMascotVideo || !dom.homeMascotFallback) {
      return;
    }

    if (!homeMascotVideoConfig.enabled) {
      dom.homeMascotVideo.hidden = true;
      dom.homeMascotFallback.hidden = false;
      return;
    }

    if (homeMascotVideoConfig.preferredSource) {
      dom.homeMascotVideo.src = homeMascotVideoConfig.preferredSource;
      dom.homeMascotVideo.addEventListener('loadedmetadata', function dom_homeMascotVideo_loop() {
        dom.homeMascotVideo.removeEventListener('loadedmetadata', dom_homeMascotVideo_loop);
        smoothCrossfadeLoop(dom.homeMascotVideo, 0.30, 1.70);
      }, { once: true });
    }

    // If the video fails to decode/load, gracefully fall back to the original PNG.
    dom.homeMascotVideo.addEventListener("error", function () {
      dom.homeMascotVideo.hidden = true;
      dom.homeMascotFallback.hidden = false;
    });

    dom.homeMascotVideo.hidden = false;
    dom.homeMascotFallback.hidden = true;
  }

  function playHomeMascotVideo() {
    if (!dom.homeMascotVideo || dom.homeMascotVideo.hidden) {
      return;
    }

    dom.homeMascotVideo.currentTime = 0;
    var playPromise = dom.homeMascotVideo.play();
    if (playPromise && typeof playPromise.catch === "function") {
      playPromise.catch(function () {
        dom.homeMascotVideo.hidden = true;
        if (dom.homeMascotFallback) {
          dom.homeMascotFallback.hidden = false;
        }
      });
    }
  }

  function stopHomeMascotVideo() {
    if (!dom.homeMascotVideo || dom.homeMascotVideo.hidden) {
      return;
    }

    dom.homeMascotVideo.pause();
    dom.homeMascotVideo.currentTime = 0;
  }

  function setupTraceMascotMedia() {
    if (!dom.traceMascotVideo || !dom.traceMascotFallback) {
      return;
    }

    if (!traceMascotVideoConfig.enabled) {
      dom.traceMascotVideo.hidden = true;
      dom.traceMascotFallback.hidden = false;
      return;
    }

    if (traceMascotVideoConfig.preferredSource) {
      dom.traceMascotVideo.src = traceMascotVideoConfig.preferredSource;
      dom.traceMascotVideo.addEventListener('loadedmetadata', function dom_traceMascotVideo_loop() {
        dom.traceMascotVideo.removeEventListener('loadedmetadata', dom_traceMascotVideo_loop);
        smoothCrossfadeLoop(dom.traceMascotVideo, 0.30, 1.70);
      }, { once: true });
    }

    // If the video fails to decode/load, gracefully fall back to the original PNG.
    dom.traceMascotVideo.addEventListener("error", function () {
      dom.traceMascotVideo.hidden = true;
      dom.traceMascotFallback.hidden = false;
    });

    dom.traceMascotVideo.hidden = false;
    dom.traceMascotFallback.hidden = true;
  }

  function playTraceMascotVideo() {
    if (!dom.traceMascotVideo || dom.traceMascotVideo.hidden) {
      return;
    }

    dom.traceMascotVideo.currentTime = 0;
    var playPromise = dom.traceMascotVideo.play();
    if (playPromise && typeof playPromise.catch === "function") {
      playPromise.catch(function () {
        dom.traceMascotVideo.hidden = true;
        if (dom.traceMascotFallback) {
          dom.traceMascotFallback.hidden = false;
        }
      });
    }
  }

  function stopTraceMascotVideo() {
    if (!dom.traceMascotVideo || dom.traceMascotVideo.hidden) {
      return;
    }

    dom.traceMascotVideo.pause();
    dom.traceMascotVideo.currentTime = 0;
  }

  function setupMeetMascotMedia() {
    if (!dom.meetMascotVideo || !dom.meetMascotFallback) {
      return;
    }

    if (!meetMascotVideoConfig.enabled) {
      dom.meetMascotVideo.hidden = true;
      dom.meetMascotFallback.hidden = false;
      return;
    }

    if (meetMascotVideoConfig.preferredSource) {
      dom.meetMascotVideo.src = meetMascotVideoConfig.preferredSource;
      dom.meetMascotVideo.addEventListener('loadedmetadata', function dom_meetMascotVideo_loop() {
        dom.meetMascotVideo.removeEventListener('loadedmetadata', dom_meetMascotVideo_loop);
        smoothCrossfadeLoop(dom.meetMascotVideo, 0.30, 1.70);
      }, { once: true });
    }

    // If the video fails to decode/load, gracefully fall back to the original PNG.
    dom.meetMascotVideo.addEventListener("error", function () {
      dom.meetMascotVideo.hidden = true;
      dom.meetMascotFallback.hidden = false;
    });

    dom.meetMascotVideo.hidden = false;
    dom.meetMascotFallback.hidden = true;
  }

  function playMeetMascotVideo() {
    if (!dom.meetMascotVideo || dom.meetMascotVideo.hidden) {
      return;
    }

    dom.meetMascotVideo.currentTime = 0;
    var playPromise = dom.meetMascotVideo.play();
    if (playPromise && typeof playPromise.catch === "function") {
      playPromise.catch(function () {
        dom.meetMascotVideo.hidden = true;
        if (dom.meetMascotFallback) {
          dom.meetMascotFallback.hidden = false;
        }
      });
    }
  }

  function stopMeetMascotVideo() {
    if (!dom.meetMascotVideo || dom.meetMascotVideo.hidden) {
      return;
    }

    dom.meetMascotVideo.pause();
    dom.meetMascotVideo.currentTime = 0;
  }

  function setupCelebrateMascotMedia() {
    if (!dom.celebrateMascotVideo || !dom.celebrateMascotFallback) {
      return;
    }

    if (!celebrateMascotVideoConfig.enabled) {
      dom.celebrateMascotVideo.hidden = true;
      dom.celebrateMascotFallback.hidden = false;
      return;
    }

    if (celebrateMascotVideoConfig.preferredSource) {
      dom.celebrateMascotVideo.src = celebrateMascotVideoConfig.preferredSource;
      dom.celebrateMascotVideo.addEventListener('loadedmetadata', function dom_celebrateMascotVideo_loop() {
        dom.celebrateMascotVideo.removeEventListener('loadedmetadata', dom_celebrateMascotVideo_loop);
        smoothCrossfadeLoop(dom.celebrateMascotVideo, 0.30, 1.70);
      }, { once: true });
    }

    // If the video fails to decode/load, gracefully fall back to the original PNG.
    dom.celebrateMascotVideo.addEventListener("error", function () {
      dom.celebrateMascotVideo.hidden = true;
      dom.celebrateMascotFallback.hidden = false;
    });

    dom.celebrateMascotVideo.hidden = false;
    dom.celebrateMascotFallback.hidden = true;
  }

  function playCelebrateMascotVideo() {
    if (!dom.celebrateMascotVideo || dom.celebrateMascotVideo.hidden) {
      return;
    }

    dom.celebrateMascotVideo.currentTime = 0;
    var playPromise = dom.celebrateMascotVideo.play();
    if (playPromise && typeof playPromise.catch === "function") {
      playPromise.catch(function () {
        dom.celebrateMascotVideo.hidden = true;
        if (dom.celebrateMascotFallback) {
          dom.celebrateMascotFallback.hidden = false;
        }
      });
    }
  }

  function stopCelebrateMascotVideo() {
    if (!dom.celebrateMascotVideo || dom.celebrateMascotVideo.hidden) {
      return;
    }

    dom.celebrateMascotVideo.pause();
    dom.celebrateMascotVideo.currentTime = 0;
  }

  function openSettings() {
    populateSettingsForm();
    showStage("settings");
  }

  function goHome() {
    audio.stopAmbient();
    showStage("home");
  }

  function handleGlobalHomeClick() {
    if (requiresHomeExitConfirm()) {
      showConfirmOverlay();
      return;
    }
    goHome();
  }

  function showConfirmOverlay() {
    dom.confirmOverlay.hidden = false;
  }

  function hideConfirmOverlay() {
    dom.confirmOverlay.hidden = true;
  }

  function requiresHomeExitConfirm() {
    return ["meet", "pick", "trace", "celebrate"].includes(state.currentStage);
  }

  function buildPickOptions(correctLetter) {
    const pool = getActiveLetters().filter(function (letter) {
      return letter.id !== correctLetter.id;
    });

    shuffle(pool);

    if (pool.length < 3) {
      const backup = getItemPool().filter(function (letter) {
        return letter.id !== correctLetter.id && !pool.some(function (p) { return p.id === letter.id; });
      });
      shuffle(backup);
      while (pool.length < 3 && backup.length) {
        pool.push(backup.shift());
      }
    }

    const options = [correctLetter, pool[0], pool[1], pool[2]].filter(Boolean);
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

    var hintDots = "";

    const optionalDot = guide.dot
      ? "<circle cx='" + guide.dot.x + "' cy='" + guide.dot.y + "' r='5' class='guide-optional-dot'></circle>"
      : "";

    // Determine which character to show
    var traceChar = getLetterCharacter(letter, state.currentTraceCase);

    // Font-rendered ghost letter — replaces the old dashed guide-path.
    // The font gives us a pixel-perfect letter on every device.
    var ghostText = "";
    if (state.currentTraceCase === "lowercase") {
      if (guide.showDescender) {
        // Letters with descenders (p) need more room below baseline
        ghostText = "<text x='110' y='155' text-anchor='middle'"
          + " font-family='Fredoka, sans-serif' font-weight='600'"
          + " font-size='120px' fill='#c9b49a' opacity='0.7'"
          + ">" + traceChar + "</text>";
      } else {
        ghostText = "<text x='110' y='158' text-anchor='middle'"
          + " font-family='Fredoka, sans-serif' font-weight='600'"
          + " font-size='120px' fill='#c9b49a' opacity='0.7'"
          + ">" + traceChar + "</text>";
      }
    } else {
      var isMultiCharTrace = traceChar.length > 1;
      ghostText = "<text x='110' y='" + (isMultiCharTrace ? "155" : "160") + "' text-anchor='middle'"
        + " font-family='Fredoka, sans-serif' font-weight='600'"
        + " font-size='" + (isMultiCharTrace ? "110" : "150") + "px' fill='#c9b49a' opacity='0.7'"
        + ">" + traceChar + "</text>";
    }

    // Build animated direction paths from ghostPaths — SAME AS BEFORE.
    // These are the orange looping stroke-order lines. Do not change
    // the animation logic that follows this section.
    var paths = guide.ghostPaths || [guide.ghostPath];
    var animHtml = "";
    paths.forEach(function (d, idx) {
      animHtml += "<path d='" + d + "' class='guide-anim-path'"
        + " data-stroke-index='" + idx + "'></path>";
    });

    dom.traceGuide.innerHTML =
      lines +
      ghostText +
      animHtml +
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

    var animPaths = dom.traceGuide.querySelectorAll(".guide-anim-path");
    if (animPaths.length > 0) {
      requestAnimationFrame(function () {
        var lengths = [];
        var totalLength = 0;

        animPaths.forEach(function (el) {
          var len = el.getTotalLength();
          lengths.push(len);
          totalLength += len;
          el.style.strokeDasharray = len;
          el.style.strokeDashoffset = len;
          el.style.opacity = 0;
        });

        var cycleDuration = 5000;
        var drawPortion = 0.55;
        var pausePortion = 0.15;
        var drawTime = cycleDuration * drawPortion;
        var pauseTime = cycleDuration * pausePortion;
        var resetTime = cycleDuration - drawTime - pauseTime;

        function animateCycle() {
          if (state.currentStage !== "trace") {
            return;
          }

          var delay = 0;
          animPaths.forEach(function (el, idx) {
            var strokeTime = (lengths[idx] / totalLength) * drawTime;
            var thisDelay = delay;

            window.setTimeout(function () {
              if (state.currentStage !== "trace") {
                return;
              }
              el.style.opacity = 0.35;
              el.style.transition = "stroke-dashoffset " + strokeTime + "ms ease-in-out";
              el.style.strokeDashoffset = "0";
            }, thisDelay);

            delay += strokeTime + 80;
          });

          window.setTimeout(function () {
            animPaths.forEach(function (el) {
              el.style.transition = "opacity 300ms ease";
              el.style.opacity = 0;
            });
          }, delay + pauseTime);

          window.setTimeout(function () {
            if (state.currentStage !== "trace") {
              return;
            }
            animPaths.forEach(function (el) {
              el.style.transition = "none";
              el.style.strokeDashoffset = el.getTotalLength();
              el.style.opacity = 0;
            });
            // Double rAF forces the browser to paint the reset state
            // before the next cycle begins. Without this, single-stroke
            // letters (S, a, t, i) skip the draw transition because
            // the browser batches reset + draw into one frame.
            requestAnimationFrame(function () {
              requestAnimationFrame(function () {
                animateCycle();
              });
            });
          }, delay + pauseTime + resetTime);
        }

        animateCycle();
      });
    }
  }

  function updateTraceProgressRing() {
    if (!dom.traceProgressFill) return;
    var circumference = 2 * Math.PI * 16; // r=16 from the SVG
    var rawCoverage = traceState.totalLetterCells > 0
      ? traceState.coveredCells.size / traceState.totalLetterCells
      : 0;
    // Generous ease-out curve: 45% actual → ~85% ring, 75%+ → full ring
    var coverage = Math.min(1, Math.pow(Math.min(rawCoverage / 0.75, 1), 0.4));
    var offset = circumference * (1 - coverage);
    dom.traceProgressFill.style.strokeDashoffset = offset;
  }

  function spawnConfetti() {
    if (!dom.confettiContainer) return;
    dom.confettiContainer.innerHTML = "";
    var colours = ["#f3c04d", "#ff6b35", "#66bb6a", "#f39c12", "#e57373", "#64b5f6", "#ba68c8"];
    for (var i = 0; i < 24; i++) {
      var piece = document.createElement("span");
      piece.className = "confetti-piece";
      piece.style.left = (Math.random() * 100) + "%";
      piece.style.background = colours[Math.floor(Math.random() * colours.length)];
      piece.style.animationDelay = (Math.random() * 0.6) + "s";
      piece.style.animationDuration = (1.6 + Math.random() * 1.2) + "s";
      piece.style.width = (6 + Math.random() * 6) + "px";
      piece.style.height = (10 + Math.random() * 8) + "px";
      piece.style.borderRadius = Math.random() > 0.5 ? "50%" : "2px";
      dom.confettiContainer.appendChild(piece);
    }
  }

  function setupSpeechUI() {
    if (!speech || !speech.isSupported()) {
      // Hide the entire speech settings group if not supported
      if (dom.settingsSpeechGroup) dom.settingsSpeechGroup.hidden = true;
      return;
    }

    // Toggle the options panel when checkbox changes
    if (dom.settingSpeechSynth) {
      dom.settingSpeechSynth.addEventListener("change", function () {
        if (dom.speechSynthOptions) {
          dom.speechSynthOptions.hidden = !dom.settingSpeechSynth.checked;
        }
      });
    }

    // Populate voice dropdown
    function populateVoices() {
      if (!dom.settingSpeechVoice) return;
      var voices = speech.getVoices();
      dom.settingSpeechVoice.innerHTML = "";
      var defaultOpt = document.createElement("option");
      defaultOpt.value = "";
      defaultOpt.textContent = "Default";
      dom.settingSpeechVoice.appendChild(defaultOpt);
      voices.forEach(function (v) {
        var opt = document.createElement("option");
        opt.value = v.voiceURI;
        opt.textContent = v.name + " (" + v.lang + ")";
        dom.settingSpeechVoice.appendChild(opt);
      });
    }

    populateVoices();
    // Voices may load async in some browsers
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = populateVoices;
    }

    // Test voice button
    if (dom.btnTestSpeech) {
      dom.btnTestSpeech.addEventListener("click", function () {
        var name = dom.settingChildName ? dom.settingChildName.value.trim() : "";
        var testText = name ? "Great job, " + name + "!" : "Great job!";
        // Temporarily configure speech with current form values
        speech.configure({
          speechSynthEnabled: true,
          speechVoiceURI: dom.settingSpeechVoice ? dom.settingSpeechVoice.value : "",
          speechRate: dom.settingSpeechRate ? Number(dom.settingSpeechRate.value) : 0.9,
          speechPitch: dom.settingSpeechPitch ? Number(dom.settingSpeechPitch.value) : 1.0
        });
        speech.speak(testText);
      });
    }
  }

  function setupRecordingUI() {
    var slotsContainer = document.getElementById("recording-slots");
    var recordingGroup = document.getElementById("settings-recording-group");
    if (!slotsContainer) return;

    // Check if MediaRecorder is available
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia || !window.MediaRecorder) {
      if (recordingGroup) recordingGroup.hidden = true;
      return;
    }

    var slots = [
      { category: "praise", index: 0, label: "Praise 1" },
      { category: "praise", index: 1, label: "Praise 2" },
      { category: "celebrate", index: 0, label: "Celebrate 1" },
      { category: "celebrate", index: 1, label: "Celebrate 2" }
    ];

    var activeRecorder = null;
    var activeSlotEl = null;

    function renderSlots() {
      slotsContainer.innerHTML = "";
      slots.forEach(function (slot) {
        var existing = audio.getCustomRecordings(slot.category);
        var hasRecording = Boolean(existing[slot.index]);

        var row = document.createElement("div");
        row.className = "recording-slot";

        var label = document.createElement("span");
        label.className = "recording-slot-label";
        label.textContent = slot.label;
        row.appendChild(label);

        var recordBtn = document.createElement("button");
        recordBtn.className = "btn-record";
        recordBtn.type = "button";
        recordBtn.textContent = "Record";
        recordBtn.addEventListener("click", function () {
          startRecording(slot, recordBtn);
        });
        row.appendChild(recordBtn);

        if (hasRecording) {
          var previewBtn = document.createElement("button");
          previewBtn.className = "btn-preview-rec";
          previewBtn.type = "button";
          previewBtn.textContent = "Play";
          previewBtn.addEventListener("click", function () {
            audio.playCustomAudio(existing[slot.index]);
          });
          row.appendChild(previewBtn);

          var deleteBtn = document.createElement("button");
          deleteBtn.className = "btn-delete-rec";
          deleteBtn.type = "button";
          deleteBtn.textContent = "Delete";
          deleteBtn.addEventListener("click", function () {
            audio.deleteCustomRecording(slot.category, slot.index);
            renderSlots();
          });
          row.appendChild(deleteBtn);

          var status = document.createElement("span");
          status.className = "recording-status";
          status.textContent = "Saved";
          row.appendChild(status);
        }

        slotsContainer.appendChild(row);
      });
    }

    function startRecording(slot, btn) {
      // Stop any active recording
      if (activeRecorder && activeRecorder.state === "recording") {
        activeRecorder.stop();
        return;
      }

      navigator.mediaDevices.getUserMedia({ audio: true }).then(function (stream) {
        var chunks = [];
        var recorder = new MediaRecorder(stream, { mimeType: "audio/webm" });
        activeRecorder = recorder;
        activeSlotEl = btn;

        btn.textContent = "Stop";
        btn.classList.add("recording");

        recorder.ondataavailable = function (e) {
          if (e.data.size > 0) chunks.push(e.data);
        };

        recorder.onstop = function () {
          stream.getTracks().forEach(function (t) { t.stop(); });
          btn.textContent = "Record";
          btn.classList.remove("recording");
          activeRecorder = null;

          if (!chunks.length) return;

          var blob = new Blob(chunks, { type: "audio/webm" });
          var reader = new FileReader();
          reader.onloadend = function () {
            var saved = audio.saveCustomRecording(slot.category, slot.index, reader.result);
            if (!saved) {
              showSettingsMessage("Recording too large — delete others first.", "error");
            }
            renderSlots();
          };
          reader.readAsDataURL(blob);
        };

        recorder.start();

        // Auto-stop after 3 seconds
        window.setTimeout(function () {
          if (recorder.state === "recording") {
            recorder.stop();
          }
        }, 3000);
      }).catch(function (err) {
        console.warn("Microphone access denied:", err);
        showSettingsMessage("Microphone access needed to record.", "error");
      });
    }

    renderSlots();
  }

  function syncSpeechSettings() {
    if (!speech) return;
    speech.configure(state.settings);
  }

  function updateHomeGreeting() {
    if (!dom.homeGreeting) return;
    var name = state.settings.childName;
    if (name && name.trim()) {
      dom.homeGreeting.textContent = "Hi " + name.trim() + "!";
      dom.homeGreeting.hidden = false;
    } else {
      dom.homeGreeting.hidden = true;
    }
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

  function isNumbersMode() {
    return state.settings.mode === "numbers";
  }

  function getItemPool() {
    return isNumbersMode() ? (data.numbers || []) : data.letters;
  }

  function getActiveItemIds() {
    return isNumbersMode() ? state.settings.activeNumberIds : state.settings.activeLetterIds;
  }

  function renderDotPatternSVG(dotPattern, colour) {
    if (!dotPattern || !dotPattern.length) {
      // Improvement #3: zero — show a bordered empty frame instead of nothing
      return "<svg class='dot-pattern-svg dot-pattern-empty' viewBox='0 0 100 100' aria-hidden='true'>"
        + "<rect x='5' y='5' width='90' height='90' rx='12' class='dot-pattern-zero-frame'></rect>"
        + "</svg>";
    }
    var circles = dotPattern.map(function (dot, i) {
      // Improvement #2: stagger delay per dot; #5: optional theme colour
      var styleStr = "animation-delay:" + (i * 0.2).toFixed(2) + "s";
      if (colour) { styleStr += ";fill:" + colour + ";stroke:none"; }
      return "<circle class='dot-pattern-dot' cx='" + dot.x + "' cy='" + dot.y + "' r='8' style='" + styleStr + "'></circle>";
    }).join("");
    return "<svg class='dot-pattern-svg' viewBox='0 0 100 100' aria-hidden='true'>" + circles + "</svg>";
  }

  function setMode(mode) {
    if (mode !== "letters" && mode !== "numbers") {
      return;
    }
    state.settings.mode = mode;
    if (dom.homeTitle) {
      dom.homeTitle.textContent = mode === "numbers" ? "Quinnja Numbers" : "Quinnja Letters";
    }
    updateModeToggle();
    updateModeVisibility();
    updateHomeProgressDots();
    updateSettingsProgressSummary();
    saveSettings();
  }

  function updateModeToggle() {
    if (!dom.modeToggleLetters || !dom.modeToggleNumbers) {
      return;
    }
    var lettersActive = !isNumbersMode();
    dom.modeToggleLetters.classList.toggle("mode-toggle-active", lettersActive);
    dom.modeToggleLetters.setAttribute("aria-pressed", String(lettersActive));
    dom.modeToggleNumbers.classList.toggle("mode-toggle-active", !lettersActive);
    dom.modeToggleNumbers.setAttribute("aria-pressed", String(!lettersActive));
  }

  function updateModeVisibility() {
    var numbersMode = isNumbersMode();
    if (dom.settingsLetterSection) {
      dom.settingsLetterSection.hidden = numbersMode;
    }
    if (dom.settingsNumberSection) {
      dom.settingsNumberSection.hidden = !numbersMode;
    }
    if (dom.settingsCaseSection) {
      dom.settingsCaseSection.hidden = numbersMode;
      if (numbersMode) {
        dom.settingsCaseSection.removeAttribute("open");
      }
    }
  }

  function populateSettingsForm() {
    const activeLetterSet = new Set(state.settings.activeLetterIds);
    const activeNumberSet = new Set(state.settings.activeNumberIds || []);

    dom.settingChildName.value = state.settings.childName;
    dom.settingAudio.checked = state.settings.audioEnabled;
    dom.settingSoundEffects.checked = state.settings.soundEffectsEnabled;
    if (dom.settingAmbient) dom.settingAmbient.checked = state.settings.ambientEnabled;
    dom.settingGuideDefault.checked = state.settings.formationGuideDefaultOn;
    dom.settingNfcMode.checked = state.settings.nfcModeOn;

    document.querySelectorAll("input[data-letter-toggle='true']").forEach(function (input) {
      input.checked = activeLetterSet.has(input.value);
    });

    document.querySelectorAll("input[data-number-toggle='true']").forEach(function (input) {
      input.checked = activeNumberSet.has(input.value);
    });

    syncLetterPresetHighlight();
    syncNumberPresetHighlight();
    if (dom.customLettersCollapsible) dom.customLettersCollapsible.removeAttribute("open");
    updateModeToggle();
    updateModeVisibility();

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

    // Refresh recording slots each time settings is opened
    setupRecordingUI();

    // Speech synthesis settings
    if (dom.settingSpeechSynth && speech && speech.isSupported()) {
      dom.settingSpeechSynth.checked = state.settings.speechSynthEnabled;
      if (dom.speechSynthOptions) {
        dom.speechSynthOptions.hidden = !state.settings.speechSynthEnabled;
      }
      if (dom.settingSpeechVoice) {
        dom.settingSpeechVoice.value = state.settings.speechVoiceURI || "";
      }
      if (dom.settingSpeechRate) {
        dom.settingSpeechRate.value = state.settings.speechRate || 0.9;
      }
      if (dom.settingSpeechPitch) {
        dom.settingSpeechPitch.value = state.settings.speechPitch || 1.0;
      }
    }

    showSettingsMessage("", "");
  }

  function saveSettingsFromForm() {
    const selectedLetterIds = Array.from(
      document.querySelectorAll("input[data-letter-toggle='true']:checked")
    ).map(function (input) {
      return input.value;
    });

    const selectedNumberIds = Array.from(
      document.querySelectorAll("input[data-number-toggle='true']:checked")
    ).map(function (input) {
      return input.value;
    });

    var mode = isNumbersMode() ? "numbers" : "letters";

    if (mode === "letters" && !selectedLetterIds.length) {
      showSettingsMessage("Please keep at least one active letter.", "error");
      return;
    }

    if (mode === "numbers" && !selectedNumberIds.length) {
      showSettingsMessage("Please keep at least one active number.", "error");
      return;
    }

    const displayCase =
      document.querySelector("input[name='display-case']:checked")?.value || "uppercase";
    const traceCase =
      document.querySelector("input[name='trace-case']:checked")?.value || "uppercase";

    state.settings = {
      childName: dom.settingChildName.value.trim(),
      mode: mode,
      activeLetterIds: selectedLetterIds,
      activeNumberIds: selectedNumberIds,
      displayCase: displayCase,
      traceCase: traceCase,
      audioEnabled: dom.settingAudio.checked,
      soundEffectsEnabled: dom.settingSoundEffects.checked && audio.isSoundEffectsSupported(),
      formationGuideDefaultOn: dom.settingGuideDefault.checked,
      nfcModeOn: dom.settingNfcMode.checked,
      ambientEnabled: dom.settingAmbient ? dom.settingAmbient.checked : false,
      speechSynthEnabled: dom.settingSpeechSynth ? dom.settingSpeechSynth.checked : false,
      speechVoiceURI: dom.settingSpeechVoice ? dom.settingSpeechVoice.value : "",
      speechRate: dom.settingSpeechRate ? Number(dom.settingSpeechRate.value) : 0.9,
      speechPitch: dom.settingSpeechPitch ? Number(dom.settingSpeechPitch.value) : 1.0
    };

    saveSettings();
    syncAudioSettings();
    syncSpeechSettings();
    updateHomeLettersRow();
    updateModeToggle();
    updateModeVisibility();
    updateHomeProgressDots();
    updateSettingsProgressSummary();
    showSettingsMessage("Settings saved.", "ok");

    window.setTimeout(function () {
      goHome();
    }, 300);
  }

  function updateHomeLettersRow() {
    return; // Active letters display removed from home screen
  }

  function updateProgressForCurrentLetter() {
    if (!state.currentLetter) {
      return;
    }

    const id = state.currentLetter.id;
    var stats = getActiveStats(id);
    if (!stats) {
      return;
    }

    var activeProgress = getActiveProgress();
    if (isNumbersMode()) {
      activeProgress.totalNumbersPractised += 1;
    } else {
      activeProgress.totalLettersPractised += 1;
    }

    stats.seen += 1;

    if (state.currentPickState && state.currentPickState.correctFirstTry) {
      stats.correctFirstTry += 1;
    }

    if (isNumbersMode()) {
      saveNumbersProgress();
    } else {
      saveProgress();
    }
  }

  function updateSettingsProgressSummary() {
    var activeProgress = getActiveProgress();
    var practisedCount = isNumbersMode() ? activeProgress.totalNumbersPractised : activeProgress.totalLettersPractised;
    var label = isNumbersMode() ? "Numbers practised" : "Letters practised";
    dom.settingsProgress.textContent =
      "Sessions: " +
      activeProgress.totalSessions +
      " | " + label + ": " +
      practisedCount;
  }

  function resetProgress() {
    state.progress = createBlankProgress();
    state.numbersProgress = createBlankNumbersProgress();
    saveProgress();
    saveNumbersProgress();
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
    audio.configureAmbient(state.settings.ambientEnabled);
  }

  function getLetterCharacter(letter, displayCase) {
    if (isNumbersMode()) {
      return letter.numeral || letter.uppercase || letter.id;
    }
    return displayCase === "lowercase" ? letter.lowercase : letter.uppercase;
  }

  function buildPickCaseQueue(length) {
    if (isNumbersMode()) {
      return new Array(length).fill("default");
    }

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
    if (isNumbersMode()) {
      return "default";
    }
    return state.pickCaseQueue[state.currentLetterIndex] || "uppercase";
  }

  function resolveSessionTraceCase() {
    if (isNumbersMode()) {
      return "default";
    }

    if (state.settings.traceCase === "uppercase") {
      return "uppercase";
    }

    if (state.settings.traceCase === "lowercase") {
      return "lowercase";
    }

    return state.progress.totalSessions % 2 === 0 ? "uppercase" : "lowercase";
  }

  function getTraceCaseForCurrentLetter() {
    return isNumbersMode() ? "default" : state.sessionTraceCase;
  }

  function getActiveFormation(letter) {
    if (!letter || !letter.formation) {
      return null;
    }
    if (isNumbersMode()) {
      return letter.formation.default || null;
    }
    return letter.formation[state.currentTraceCase];
  }

  function getActiveLetters() {
    const pool = getItemPool();
    const set = new Set(getActiveItemIds());
    const active = pool.filter(function (letter) {
      return set.has(letter.id);
    });

    return active.length ? active : (pool.length ? [pool[0]] : []);
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
        mode: ["letters", "numbers"].includes(saved.mode) ? saved.mode : defaults.mode,
        activeLetterIds: Array.isArray(saved.activeLetterIds) && saved.activeLetterIds.length
          ? saved.activeLetterIds
          : defaults.activeLetterIds,
        activeNumberIds: Array.isArray(saved.activeNumberIds) && saved.activeNumberIds.length
          ? saved.activeNumberIds
          : defaults.activeNumberIds,
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
        nfcModeOn: typeof saved.nfcModeOn === "boolean" ? saved.nfcModeOn : defaults.nfcModeOn,
        ambientEnabled: typeof saved.ambientEnabled === "boolean"
          ? saved.ambientEnabled
          : defaults.ambientEnabled,
        speechSynthEnabled: typeof saved.speechSynthEnabled === "boolean"
          ? saved.speechSynthEnabled
          : defaults.speechSynthEnabled,
        speechVoiceURI: typeof saved.speechVoiceURI === "string"
          ? saved.speechVoiceURI
          : defaults.speechVoiceURI,
        speechRate: typeof saved.speechRate === "number"
          ? saved.speechRate
          : defaults.speechRate,
        speechPitch: typeof saved.speechPitch === "number"
          ? saved.speechPitch
          : defaults.speechPitch
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

  function createBlankNumbersProgress() {
    const numberStats = {};
    (data.numbers || []).forEach(function (numberItem) {
      numberStats[numberItem.id] = { seen: 0, correctFirstTry: 0 };
    });

    return {
      totalSessions: 0,
      totalNumbersPractised: 0,
      numberStats: numberStats
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

  function loadNumbersProgress() {
    const blank = createBlankNumbersProgress();

    try {
      const saved = JSON.parse(localStorage.getItem(storageKeys.numbersProgress));
      if (!saved) {
        return blank;
      }

      blank.totalSessions = Number(saved.totalSessions) || 0;
      blank.totalNumbersPractised = Number(saved.totalNumbersPractised) || 0;

      Object.keys(blank.numberStats).forEach(function (id) {
        blank.numberStats[id].seen = Number(saved.numberStats?.[id]?.seen) || 0;
        blank.numberStats[id].correctFirstTry = Number(saved.numberStats?.[id]?.correctFirstTry) || 0;
      });

      return blank;
    } catch (error) {
      console.warn("Could not load numbers progress:", error);
      return blank;
    }
  }

  function saveNumbersProgress() {
    localStorage.setItem(storageKeys.numbersProgress, JSON.stringify(state.numbersProgress));
  }

  function getActiveProgress() {
    return isNumbersMode() ? state.numbersProgress : state.progress;
  }

  function getActiveStats(id) {
    var activeProgress = getActiveProgress();
    if (isNumbersMode()) {
      if (!activeProgress.numberStats[id]) {
        activeProgress.numberStats[id] = { seen: 0, correctFirstTry: 0 };
      }
      return activeProgress.numberStats[id];
    }
    if (!activeProgress.letterStats[id]) {
      activeProgress.letterStats[id] = { seen: 0, correctFirstTry: 0 };
    }
    return activeProgress.letterStats[id];
  }

  function replayMeetAudio() {
    if (!state.currentLetter) return;
    var meetFile = state.currentLetter.audio.meet;
    var soundFile = state.currentLetter.audio.sound;
    audio.stopCurrentAudio();
    audio.playMp3Sequence([meetFile, soundFile]);
  }

  function replayPickAudio() {
    if (!state.currentLetter) return;
    audio.stopCurrentAudio();
    if (state.currentPickMode === "sound") {
      audio.playMp3(state.currentLetter.audio.sound);
    } else {
      audio.playMp3(state.currentLetter.audio.pick);
    }
  }

  function prioritiseWeakLetters(queue) {
    if (queue.length <= 1) return queue;

    var weak = [];
    var strong = [];

    queue.forEach(function (letter) {
      var stats = getActiveStats(letter.id);
      if (!stats || stats.seen < 2 || (stats.correctFirstTry / stats.seen) < 0.5) {
        weak.push(letter);
      } else {
        strong.push(letter);
      }
    });

    shuffle(weak);
    shuffle(strong);
    return weak.concat(strong);
  }

  function buildPickModeQueue(length) {
    if (isNumbersMode()) {
      return new Array(length).fill("visual");
    }

    var queue = [];
    for (var i = 0; i < length; i++) {
      var letter = state.letterQueue[i];
      var stats = letter && getActiveStats(letter.id);
      // Use sound mode only for letters the child has seen 5+ times
      if (stats && stats.seen >= 5 && Math.random() < 0.25) {
        queue.push("sound");
      } else {
        queue.push("visual");
      }
    }
    return queue;
  }

  function updateHomeProgressDots() {
    var items = [];
    var firstPendingIndex = -1;

    getActiveLetters().slice().sort(function (a, b) {
      if (isNumbersMode()) {
        return (a.value || 0) - (b.value || 0);
      }
      return a.id.localeCompare(b.id);
    }).forEach(function (letter) {
      var stats = getActiveStats(letter.id);
      var mastered = stats && stats.seen >= 2 && (stats.correctFirstTry / stats.seen) >= 0.5;
      if (!mastered && firstPendingIndex === -1) {
        firstPendingIndex = items.length;
      }
      items.push({
        html: "<span class='progress-dot" + (mastered ? " progress-dot-filled" : "") + "' aria-hidden='true'>"
          + getLetterCharacter(letter, "uppercase")
          + "</span>"
      });
    });

    if (!items.length) {
      firstPendingIndex = 0;
    } else if (firstPendingIndex === -1) {
      firstPendingIndex = items.length - 1;
    }

    setTrackerItems("home", items, firstPendingIndex, true);
  }

  function updateHomeProgressOverflowState() {
    renderTrackerGroup("home");
  }

  function focusHomeProgressTarget() {
    centerTrackerOnFocus("home");
    renderTrackerGroup("home");
  }

  function setupDotStripOverflowTracking() {
    setupTrackerControls();
    window.addEventListener("resize", function () {
      updateHomeProgressOverflowState();
      syncSessionDotStrips();
    });
  }

  function syncSessionDotStrips() {
    centerTrackerOnFocus("session");
    renderTrackerGroup("session");
  }

  function setupTrackerControls() {
    Object.keys(trackerViews).forEach(function (trackerKey) {
      trackerViews[trackerKey].forEach(function (view) {
        if (view.prevBtn) {
          view.prevBtn.addEventListener("click", function () {
            shiftTrackerWindow(trackerKey, -1);
          });
        }
        if (view.nextBtn) {
          view.nextBtn.addEventListener("click", function () {
            shiftTrackerWindow(trackerKey, 1);
          });
        }
      });
    });
  }

  function getTrackerViewportSize(trackerKey, totalItems) {
    var maxVisible = trackerKey === "home" ? 7 : 6;
    if (window.innerWidth <= 768) {
      maxVisible = trackerKey === "home" ? 6 : 5;
    }
    if (window.innerWidth <= 480) {
      maxVisible = 5;
    }
    return Math.min(totalItems, maxVisible);
  }

  function getCenteredWindowStart(focusIndex, viewportSize, totalItems) {
    var maxStart = Math.max(0, totalItems - viewportSize);
    var centeredStart = focusIndex - Math.floor(viewportSize / 2);
    return Math.max(0, Math.min(maxStart, centeredStart));
  }

  function clampTrackerWindowStart(trackerKey) {
    var tracker = trackerState[trackerKey];
    var maxStart = Math.max(0, tracker.items.length - tracker.viewportSize);
    tracker.windowStart = Math.max(0, Math.min(maxStart, tracker.windowStart));
  }

  function centerTrackerOnFocus(trackerKey) {
    var tracker = trackerState[trackerKey];
    tracker.viewportSize = getTrackerViewportSize(trackerKey, tracker.items.length);
    tracker.windowStart = getCenteredWindowStart(tracker.focusIndex, tracker.viewportSize, tracker.items.length);
    clampTrackerWindowStart(trackerKey);
  }

  function setTrackerItems(trackerKey, items, focusIndex, shouldCenter) {
    var tracker = trackerState[trackerKey];
    tracker.items = items;
    tracker.focusIndex = Math.max(0, Math.min(items.length - 1, focusIndex || 0));
    tracker.viewportSize = getTrackerViewportSize(trackerKey, items.length);

    if (!items.length) {
      tracker.windowStart = 0;
    } else if (shouldCenter || tracker.windowStart === 0) {
      tracker.windowStart = getCenteredWindowStart(tracker.focusIndex, tracker.viewportSize, items.length);
    }

    clampTrackerWindowStart(trackerKey);
    renderTrackerGroup(trackerKey);
  }

  function shiftTrackerWindow(trackerKey, direction) {
    var tracker = trackerState[trackerKey];
    tracker.viewportSize = getTrackerViewportSize(trackerKey, tracker.items.length);
    if (tracker.items.length <= tracker.viewportSize) {
      return;
    }

    tracker.windowStart += direction;
    clampTrackerWindowStart(trackerKey);
    renderTrackerGroup(trackerKey);
  }

  function renderTrackerGroup(trackerKey) {
    var tracker = trackerState[trackerKey];
    var views = trackerViews[trackerKey] || [];
    var hasOverflow;
    var visibleHtml;
    var countText;

    tracker.viewportSize = getTrackerViewportSize(trackerKey, tracker.items.length);
    if (!tracker.items.length) {
      tracker.windowStart = 0;
    }
    clampTrackerWindowStart(trackerKey);

    hasOverflow = tracker.items.length > tracker.viewportSize;
    visibleHtml = tracker.items.slice(tracker.windowStart, tracker.windowStart + tracker.viewportSize).map(function (item) {
      return item.html;
    }).join("");
    countText = tracker.items.length ? ((tracker.focusIndex + 1) + " of " + tracker.items.length) : "";

    views.forEach(function (view) {
      if (view.strip) {
        view.strip.innerHTML = visibleHtml;
      }
      if (view.count) {
        view.count.textContent = countText;
      }
      if (view.wrapper) {
        view.wrapper.classList.toggle("tracker-has-overflow", hasOverflow);
      }
      if (view.prevBtn) {
        view.prevBtn.disabled = !hasOverflow || tracker.windowStart <= 0;
      }
      if (view.nextBtn) {
        view.nextBtn.disabled = !hasOverflow || tracker.windowStart + tracker.viewportSize >= tracker.items.length;
      }
    });
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
