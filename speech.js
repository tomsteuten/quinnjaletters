(function () {
  /**
   * speech.js — Browser SpeechSynthesis for dynamic content
   *
   * Used for short supplementary phrases only (child's name in praise,
   * custom parent phrases). Core letter teaching audio stays as pre-recorded MP3.
   *
   * Quality varies by OS/browser — this is a supplement, not a replacement.
   */

  var speechState = {
    enabled: false,
    voiceURI: "",
    rate: 0.9,
    pitch: 1.0
  };

  var voicesLoaded = false;
  var cachedVoices = [];

  function isSupported() {
    return Boolean(window.speechSynthesis);
  }

  function getVoices() {
    if (!isSupported()) return [];

    if (cachedVoices.length) return cachedVoices;

    cachedVoices = window.speechSynthesis.getVoices().filter(function (v) {
      return v.lang.startsWith("en");
    });

    return cachedVoices;
  }

  // Voices load asynchronously on some browsers
  if (isSupported() && window.speechSynthesis.onvoiceschanged !== undefined) {
    window.speechSynthesis.onvoiceschanged = function () {
      cachedVoices = [];
      getVoices();
      voicesLoaded = true;
    };
  }

  function configure(settings) {
    if (!settings) return;
    speechState.enabled = Boolean(settings.speechSynthEnabled);
    speechState.voiceURI = settings.speechVoiceURI || "";
    speechState.rate = Number(settings.speechRate) || 0.9;
    speechState.pitch = Number(settings.speechPitch) || 1.0;
  }

  function speak(text, onDone) {
    if (!isSupported() || !speechState.enabled || !text) {
      if (onDone) onDone();
      return;
    }

    // Cancel any in-progress speech
    window.speechSynthesis.cancel();

    var utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = speechState.rate;
    utterance.pitch = speechState.pitch;

    // Select voice if configured
    if (speechState.voiceURI) {
      var voices = getVoices();
      var match = voices.find(function (v) {
        return v.voiceURI === speechState.voiceURI;
      });
      if (match) {
        utterance.voice = match;
      }
    }

    utterance.onend = function () {
      if (onDone) onDone();
    };

    utterance.onerror = function () {
      console.warn("SpeechSynthesis error for:", text);
      if (onDone) onDone();
    };

    window.speechSynthesis.speak(utterance);
  }

  function stop() {
    if (isSupported()) {
      window.speechSynthesis.cancel();
    }
  }

  function speakCelebration(childName, onDone) {
    if (!childName || !childName.trim() || !speechState.enabled) {
      if (onDone) onDone();
      return;
    }

    var phrases = [
      "Amazing, " + childName + "!",
      "Well done, " + childName + "!",
      "Great job, " + childName + "!",
      "You're a star, " + childName + "!",
      "Wonderful, " + childName + "!"
    ];

    var phrase = phrases[Math.floor(Math.random() * phrases.length)];
    speak(phrase, onDone);
  }

  var moduleApi = {
    isSupported: isSupported,
    getVoices: getVoices,
    configure: configure,
    speak: speak,
    stop: stop,
    speakCelebration: speakCelebration
  };

  window.QuinnjaSpeech = moduleApi;
  window.QuinnjaLetters = window.QuinnjaLetters || {};
  window.QuinnjaLetters.Speech = moduleApi;
})();
