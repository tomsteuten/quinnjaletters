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
      { frequency: 523.25, time: 0, duration: 0.15, volume: 0.07, type: "sine" },
      { frequency: 659.25, time: 0.12, duration: 0.18, volume: 0.08, type: "sine" }
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
      { frequency: 392.0, time: 0, duration: 0.12, volume: 0.055, type: "sine" },
      { frequency: 493.88, time: 0.1, duration: 0.12, volume: 0.06, type: "sine" },
      { frequency: 587.33, time: 0.2, duration: 0.14, volume: 0.065, type: "sine" },
      { frequency: 783.99, time: 0.32, duration: 0.18, volume: 0.07, type: "sine" }
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

  function playRandomMp3(srcList, onDone) {
    if (!srcList || !srcList.length) {
      if (onDone) {
        onDone();
      }
      return;
    }

    var src = srcList[Math.floor(Math.random() * srcList.length)];
    playMp3(src, onDone);
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
    playRandomMp3
  };

  window.QuinnjaAudio = moduleApi;
  window.QuinnjaLetters = window.QuinnjaLetters || {};
  window.QuinnjaLetters.Audio = moduleApi;
})();
