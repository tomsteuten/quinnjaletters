(function () {
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  let audioContext = null;
  let currentAudio = null;

  const audioState = {
    speechEnabled: true,
    soundEffectsEnabled: true
  }

  function isSoundEffectsSupported() {
    return Boolean(AudioContextClass);
  }

  function configureAudio(settings) {
    audioState.speechEnabled = Boolean(settings.audioEnabled);
    audioState.soundEffectsEnabled = Boolean(settings.soundEffectsEnabled);
  }

  function getAudioContext() {
    if (!isSoundEffectsSupported()) {
      return null;
    }

    if (!audioContext) {
      audioContext = new AudioContextClass();
    }

    if (audioContext.state === "suspended") {
      audioContext.resume().catch(function () {
        // Keep this silent if the browser blocks auto-resume.
      });
    }

    return audioContext;
  }

  function playToneSequence(steps) {
    if (!audioState.soundEffectsEnabled) {
      return;
    }

    const context = getAudioContext();
    if (!context) {
      return;
    }

    const startTime = context.currentTime + 0.01;

    steps.forEach(function (step) {
      const oscillator = context.createOscillator();
      const gainNode = context.createGain();

      oscillator.type = step.type || "sine";
      oscillator.frequency.setValueAtTime(step.frequency, startTime + step.time);

      gainNode.gain.setValueAtTime(0.0001, startTime + step.time);
      gainNode.gain.exponentialRampToValueAtTime(step.volume || 0.08, startTime + step.time + 0.02);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, startTime + step.time + step.duration);

      oscillator.connect(gainNode);
      gainNode.connect(context.destination);
      oscillator.start(startTime + step.time);
      oscillator.stop(startTime + step.time + step.duration + 0.02);
    });
  }

  function playCorrectChime() {
    playToneSequence([
      { frequency: 523.25, time: 0, duration: 0.15, volume: 0.06, type: "sine" },
      { frequency: 659.25, time: 0.12, duration: 0.22, volume: 0.07, type: "sine" },
      // Warm harmonic tail
      { frequency: 659.25, time: 0.14, duration: 0.20, volume: 0.02, type: "triangle" }
    ]);
  }

  function playTryAgainTone() {
    playToneSequence([
      { frequency: 329.63, time: 0, duration: 0.14, volume: 0.05, type: "triangle" },
      { frequency: 293.66, time: 0.12, duration: 0.18, volume: 0.05, type: "triangle" }
    ]);
  }

  function playButtonTap() {
    playToneSequence([
      { frequency: 440, time: 0, duration: 0.07, volume: 0.025, type: "triangle" }
    ]);
  }

  function playCelebrationSequence() {
    if (!audioState.soundEffectsEnabled) {
      return;
    }

    playToneSequence([
      { frequency: 392.0, time: 0, duration: 0.15, volume: 0.05, type: "sine" },
      { frequency: 493.88, time: 0.13, duration: 0.15, volume: 0.055, type: "sine" },
      { frequency: 587.33, time: 0.26, duration: 0.16, volume: 0.06, type: "sine" },
      { frequency: 783.99, time: 0.4, duration: 0.30, volume: 0.065, type: "sine" },
      // Soft harmonic tail on the final note for warmth
      { frequency: 784.0, time: 0.42, duration: 0.28, volume: 0.025, type: "triangle" }
    ]);
  }

  function stopCurrentAudio() {
    if (currentAudio) {
      currentAudio.onended = null;
      currentAudio.onerror = null;
      currentAudio.pause();
      currentAudio.removeAttribute("src");
      currentAudio.load();
      currentAudio = null;
    }
  }

  function playMp3(src, onDone) {
    stopCurrentAudio();

    if (!audioState.speechEnabled) {
      if (onDone) {
        onDone();
      }
      return;
    }

    if (!src) {
      if (onDone) {
        onDone();
      }
      return;
    }

    var audioEl = new Audio(src);
    currentAudio = audioEl;

    audioEl.onended = function () {
      if (currentAudio === audioEl) {
        currentAudio = null;
      }
      if (onDone) {
        onDone();
      }
    };

    audioEl.onerror = function () {
      console.warn("Audio file not found or failed to load:", src);
      if (currentAudio === audioEl) {
        currentAudio = null;
      }
      if (onDone) {
        onDone();
      }
    };

    audioEl.play().catch(function (err) {
      console.warn("Audio play failed:", err);
      if (currentAudio === audioEl) {
        currentAudio = null;
      }
      if (onDone) {
        onDone();
      }
    });
  }

  function playMp3Sequence(sources, onAllDone) {
    if (!sources || !sources.length) {
      if (onAllDone) {
        onAllDone();
      }
      return;
    }

    var index = 0;

    function playNext() {
      if (index >= sources.length) {
        if (onAllDone) {
          onAllDone();
        }
        return;
      }

      var src = sources[index];
      index += 1;

      if (!src) {
        playNext();
        return;
      }

      playMp3(src, playNext);
    }

    playNext();
  }

  // Track used indices per source-list to avoid repeats until pool is exhausted
  var shuffleTracking = new Map();

  function playRandomMp3(srcList, onDone) {
    if (!srcList || !srcList.length) {
      if (onDone) {
        onDone();
      }
      return;
    }

    // Get or create the remaining-indices pool for this source list
    var key = srcList; // use the array reference as map key
    var remaining = shuffleTracking.get(key);
    if (!remaining || !remaining.length) {
      // Build a new shuffled pool of all indices
      remaining = [];
      for (var i = 0; i < srcList.length; i++) {
        remaining.push(i);
      }
      // Fisher-Yates shuffle
      for (var j = remaining.length - 1; j > 0; j--) {
        var k = Math.floor(Math.random() * (j + 1));
        var tmp = remaining[j];
        remaining[j] = remaining[k];
        remaining[k] = tmp;
      }
      shuffleTracking.set(key, remaining);
    }

    var idx = remaining.pop();
    playMp3(srcList[idx], onDone);
  }

  function resetShuffleTracking() {
    shuffleTracking.clear();
  }

  // --- Ambient audio support ---
  var ambientAudio = null;
  var ambientEnabled = false;
  var ambientVolume = 0.045;
  var ambientDuckedVolume = 0.008;
  var ambientSrc = "assets/audio/ambient.mp3";

  function configureAmbient(enabled) {
    ambientEnabled = Boolean(enabled);
    if (!ambientEnabled) {
      stopAmbient();
    }
  }

  function startAmbient() {
    if (!ambientEnabled || ambientAudio) return;
    ambientAudio = new Audio(ambientSrc);
    ambientAudio.loop = true;
    ambientAudio.volume = ambientVolume;
    ambientAudio.play().catch(function () {
      // Silently fail if autoplay blocked
      ambientAudio = null;
    });
  }

  function stopAmbient() {
    if (!ambientAudio) return;
    ambientAudio.pause();
    ambientAudio.removeAttribute("src");
    ambientAudio.load();
    ambientAudio = null;
  }

  function duckAmbient() {
    if (ambientAudio) {
      ambientAudio.volume = ambientDuckedVolume;
    }
  }

  function unduckAmbient() {
    if (ambientAudio) {
      ambientAudio.volume = ambientVolume;
    }
  }

  // Duck ambient when speech starts, unduck when it ends
  var _originalPlayMp3 = playMp3;
  playMp3 = function (src, onDone) {
    duckAmbient();
    _originalPlayMp3(src, function () {
      unduckAmbient();
      if (onDone) onDone();
    });
  };

  // --- Parent-recorded audio support ---
  var customAudioStorageKey = "quinnjaLetters.customAudio";

  function getCustomRecordings(category) {
    try {
      var stored = JSON.parse(localStorage.getItem(customAudioStorageKey));
      if (!stored || !stored[category]) return [];
      return stored[category].filter(Boolean);
    } catch (e) {
      return [];
    }
  }

  function saveCustomRecording(category, index, dataUrl) {
    try {
      var stored = JSON.parse(localStorage.getItem(customAudioStorageKey)) || {};
      if (!stored[category]) stored[category] = [];
      stored[category][index] = dataUrl;
      // Cap total storage at ~500KB
      var totalSize = JSON.stringify(stored).length;
      if (totalSize > 512000) {
        console.warn("Custom audio storage limit reached");
        return false;
      }
      localStorage.setItem(customAudioStorageKey, JSON.stringify(stored));
      return true;
    } catch (e) {
      console.warn("Failed to save custom recording:", e);
      return false;
    }
  }

  function deleteCustomRecording(category, index) {
    try {
      var stored = JSON.parse(localStorage.getItem(customAudioStorageKey)) || {};
      if (stored[category]) {
        stored[category][index] = null;
        localStorage.setItem(customAudioStorageKey, JSON.stringify(stored));
      }
    } catch (e) {
      console.warn("Failed to delete custom recording:", e);
    }
  }

  function playCustomAudio(dataUrl, onDone) {
    stopCurrentAudio();
    if (!dataUrl) {
      if (onDone) onDone();
      return;
    }
    var audioEl = new Audio(dataUrl);
    currentAudio = audioEl;
    audioEl.onended = function () {
      if (currentAudio === audioEl) currentAudio = null;
      if (onDone) onDone();
    };
    audioEl.onerror = function () {
      if (currentAudio === audioEl) currentAudio = null;
      if (onDone) onDone();
    };
    audioEl.play().catch(function () {
      if (currentAudio === audioEl) currentAudio = null;
      if (onDone) onDone();
    });
  }

  function playRandomMp3WithCustom(srcList, category, onDone) {
    // Mix custom recordings with stock MP3s
    var custom = getCustomRecordings(category);
    var combined = (srcList || []).slice();
    custom.forEach(function (dataUrl) {
      if (dataUrl) combined.push("__custom__:" + dataUrl);
    });
    if (!combined.length) {
      if (onDone) onDone();
      return;
    }
    // Use the no-repeat shuffle for the combined pool
    var key = srcList; // maintain the same key for shuffle tracking
    var remaining = shuffleTracking.get(key);
    if (!remaining || !remaining.length) {
      remaining = [];
      for (var i = 0; i < combined.length; i++) remaining.push(i);
      for (var j = remaining.length - 1; j > 0; j--) {
        var k = Math.floor(Math.random() * (j + 1));
        var tmp = remaining[j]; remaining[j] = remaining[k]; remaining[k] = tmp;
      }
      shuffleTracking.set(key, remaining);
    }
    var idx = remaining.pop();
    var src = combined[idx];
    if (src && src.startsWith("__custom__:")) {
      playCustomAudio(src.slice(11), onDone);
    } else {
      playMp3(src, onDone);
    }
  }

  const moduleApi = {
    stopCurrentAudio,
    configureAudio,
    isSoundEffectsSupported,
    playCorrectChime,
    playTryAgainTone,
    playButtonTap,
    playCelebrationSequence,
    playMp3,
    playMp3Sequence,
    playRandomMp3,
    resetShuffleTracking,
    getCustomRecordings,
    saveCustomRecording,
    deleteCustomRecording,
    playCustomAudio,
    playRandomMp3WithCustom,
    configureAmbient,
    startAmbient,
    stopAmbient
  };

  window.QuinnjaAudio = moduleApi;
  window.QuinnjaLetters = window.QuinnjaLetters || {};
  window.QuinnjaLetters.Audio = moduleApi;
})();
