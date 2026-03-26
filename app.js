(function () {
  const data = (window.QuinnjaLetters && window.QuinnjaLetters.Data) || window.QuinnjaData;
  const audio = (window.QuinnjaLetters && window.QuinnjaLetters.Audio) || window.QuinnjaAudio;
  const nfc = (window.QuinnjaLetters && window.QuinnjaLetters.Nfc) || window.QuinnjaNfc;

  const storageKeys = {
    settings: "quinnjaLetters.settings",
    progress: "quinnjaLetters.progress"
  };

  const stageOrder = ["meet", "pick", "trace", "celebrate"];

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
    settings: loadSettings(),
    progress: loadProgress(),
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
    settingAudio: document.getElementById("setting-audio"),
    settingSoundEffects: document.getElementById("setting-sound-effects"),
    settingGuideDefault: document.getElementById("setting-guide-default"),
    settingNfcMode: document.getElementById("setting-nfc-mode"),
    settingsProgress: document.getElementById("settings-progress"),
    settingsMessage: document.getElementById("settings-message"),
    saveSettingsBtn: document.getElementById("btn-save-settings"),
    resetProgressBtn: document.getElementById("btn-reset-progress"),

    meetCue: document.getElementById("meet-cue"),
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
    confirmLeaveBtn: document.getElementById("btn-confirm-leave")
  };

  const traceState = {
    ctx: null,
    isDrawing: false,
    hasStrokes: false,
    width: 220,
    height: 220,
    hitmask: null,
    lastPoint: null
  };

  function renderSessionDots() {
    var ids = ["session-dots-meet", "session-dots-pick", "session-dots-trace", "session-dots-celebrate"];
    var html = "";

    for (var i = 0; i < state.letterQueue.length; i++) {
      var letter = state.letterQueue[i];
      var dotClass = "session-dot";
      var style = "";

      if (i < state.currentLetterIndex) {
        dotClass += " session-dot-done";
        style = "fill:" + letter.colourDark + ";";
      } else if (i === state.currentLetterIndex) {
        dotClass += " session-dot-current";
        style = "fill:" + letter.colourDark + ";";
      } else {
        dotClass += " session-dot-upcoming";
      }

      html += "<svg class='" + dotClass + "' style='" + style + "' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'>"
        + "<circle cx='7' cy='5.5' r='2.8'/>"
        + "<circle cx='17' cy='5.5' r='2.8'/>"
        + "<circle cx='3.2' cy='11' r='2.8'/>"
        + "<circle cx='20.8' cy='11' r='2.8'/>"
        + "<path d='M12 22c-3.5 0-5.5-2.2-6.5-4.5-.7-1.5-.2-3.5 1.2-4.5 1.2-.9 2.8-1.5 5.3-1.5s4.1.6 5.3 1.5c1.4 1 1.9 3 1.2 4.5C17.5 19.8 15.5 22 12 22z'/>"
        + "</svg>";
    }

    for (var j = 0; j < ids.length; j++) {
      var el = document.getElementById(ids[j]);
      if (el) {
        el.innerHTML = html;
      }
    }
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
      if (button.classList.contains("trace-done-disabled")) {
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
      if (!traceState.hasStrokes) return;
      state.lastTracedDataUrl = dom.traceCanvas.toDataURL("image/png");
      showCelebrateStage();
    });

    dom.meetReplayBtn.addEventListener("click", replayMeetAudio);
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
    traceState.lastPoint = null;
    if (dom.traceDoneBtn) {
      dom.traceDoneBtn.disabled = true;
      dom.traceDoneBtn.classList.add("trace-done-disabled");
    }
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
    ctx.font = (traceCase === "lowercase") ? "600 120px Fredoka, sans-serif" : "600 150px Fredoka, sans-serif";

    var guide = getActiveFormation(letter);
    var x = 110;
    var y = 160;
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
      queue = activeLetters.slice();
      queue = prioritiseWeakLetters(queue);
      state.nfcSingleLetterSession = false;
    }

    state.sessionTraceCase = resolveSessionTraceCase();
    state.letterQueue = queue;
    state.pickCaseQueue = buildPickCaseQueue(queue.length);
    state.pickModeQueue = buildPickModeQueue(queue.length);
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
    playMeetMascotVideo();
    dom.meetActions.hidden = true;

    const meetFile = state.currentLetter.audio.meet;
    const soundFile = state.currentLetter.audio.sound;

    const fallbackTimer = window.setTimeout(function () {
      if (state.currentStage === "meet") {
        dom.meetActions.hidden = false;
      }
    }, 10000);

    audio.playMp3Sequence([meetFile, soundFile], function () {
      window.clearTimeout(fallbackTimer);
      if (state.currentStage === "meet") {
        dom.meetActions.hidden = false;
      }
    });
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
      dom.pickTargetLetter.setAttribute("aria-label", "Which letter makes this sound?");
    } else {
      dom.pickTargetLetter.textContent = getLetterCharacter(state.currentLetter, state.currentPickCase);
      dom.pickTargetLetter.removeAttribute("aria-label");
    }

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

    if (state.currentPickMode === "sound") {
      audio.playMp3(state.currentLetter.audio.sound);
    } else {
      audio.playMp3(state.currentLetter.audio.pick);
    }
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

      setMascotState(dom.pickMascotWrap, "mascot-celebrating");
      dom.pickFeedback.textContent = "Correct";
      audio.playCorrectChime();
      if (navigator.vibrate) navigator.vibrate(50);

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
    playPickWrongReaction();
    dom.pickFeedback.textContent = "Try again";
    audio.playMp3(data.sharedAudio.tryAgain);
    if (navigator.vibrate) navigator.vibrate([40, 30, 40]);

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
    const tracedChar = getLetterCharacter(state.currentLetter, state.currentTraceCase);
    const pairedChar = getLetterCharacter(
      state.currentLetter,
      state.currentTraceCase === "uppercase" ? "lowercase" : "uppercase"
    );
    dom.celebrateLetterMain.textContent = tracedChar;
    dom.celebrateLetterSide.textContent = pairedChar;

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
      audio.playRandomMp3(data.sharedAudio.celebrate, function () {
        state.autoTimerId = window.setTimeout(function () {
          advanceStage();
        }, 6000);
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

    state.progress.totalSessions += 1;
    saveProgress();
    showCompleteStage();
  }

  function showCompleteStage() {
    showStage("complete");
    setMascotState(dom.completeMascotWrap, "mascot-celebrating");

    dom.completeLetters.innerHTML = "";
    var letterOrder = data.letters.map(function (l) { return l.id; });
    var sortedResults = state.sessionResults.slice().sort(function (a, b) {
      return letterOrder.indexOf(a.letterId) - letterOrder.indexOf(b.letterId);
    });
    sortedResults.forEach(function (result) {
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

    const pictureCueSrc = letter.pictureCueSrc || ("assets/images/cues/cue-" + letter.id + ".png");
    if (letter.pictureCueWord) {
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

    Object.keys(dom.stages).forEach(function (name) {
      dom.stages[name].classList.toggle("active", name === stageName);
    });

    state.currentStage = stageName;
    dom.stageStatus.textContent = "Stage: " + stageName;
    dom.globalHomeBtn.hidden = stageName === "home" || stageName === "settings";

    if (stageName === "home") {
      applyStageBackground("");
      updateHomeLettersRow();
      updateHomeProgressDots();
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
      ghostText = "<text x='110' y='160' text-anchor='middle'"
        + " font-family='Fredoka, sans-serif' font-weight='600'"
        + " font-size='150px' fill='#c9b49a' opacity='0.7'"
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
    return; // Active letters display removed from home screen
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

  function prioritiseWeakLetters(queue) {
    if (queue.length <= 1) return queue;

    var weak = [];
    var strong = [];

    queue.forEach(function (letter) {
      var stats = state.progress.letterStats[letter.id];
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
    var queue = [];
    // Sound mode disabled until speaker icon and audio-cue animation are polished.
    // Change to Math.random() < 0.5 ? "sound" : "visual" to re-enable.
    for (var i = 0; i < length; i++) {
      queue.push("visual");
    }
    return queue;
  }

  function updateHomeProgressDots() {
    dom.homeProgressDots.innerHTML = "";

    getActiveLetters().forEach(function (letter) {
      var dot = document.createElement("span");
      var stats = state.progress.letterStats[letter.id];
      var mastered = stats && stats.seen >= 2 && (stats.correctFirstTry / stats.seen) >= 0.5;
      dot.className = "progress-dot" + (mastered ? " progress-dot-filled" : "");
      dot.textContent = letter.uppercase;
      dom.homeProgressDots.appendChild(dot);
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
