(function () {
  let reader = null;

  function isNfcSupported() {
    return "NDEFReader" in window;
  }

  function parseQuinnjaTag(text) {
    if (typeof text !== "string") {
      return null;
    }

    const trimmed = text.trim().toLowerCase();
    const parts = trimmed.split(":");

    if (parts.length !== 2 || parts[0] !== "ql" || !parts[1]) {
      return null;
    }

    return { letterId: parts[1] };
  }

  async function startNfcScan(onTag) {
    if (!isNfcSupported()) {
      console.log("Web NFC is not supported. Falling back to normal flow.");
      return false;
    }

    try {
      if (!reader) {
        reader = new NDEFReader();
      }

      await reader.scan();

      reader.onreading = function (event) {
        if (!event.message || !Array.isArray(event.message.records)) {
          return;
        }

        event.message.records.forEach(function (record) {
          if (record.recordType !== "text") {
            return;
          }

          const text = new TextDecoder(record.encoding || "utf-8").decode(record.data);
          const parsed = parseQuinnjaTag(text);
          if (parsed && typeof onTag === "function") {
            onTag(parsed);
          }
        });
      };

      return true;
    } catch (error) {
      console.log("NFC scan could not start. Falling back to normal flow.", error);
      return false;
    }
  }

  function stopNfcScan() {
    if (!reader) {
      return;
    }

    reader.onreading = null;
  }

  const moduleApi = {
    isNfcSupported,
    startNfcScan,
    stopNfcScan,
    parseQuinnjaTag
  };

  window.QuinnjaNfc = moduleApi;
  window.QuinnjaLetters = window.QuinnjaLetters || {};
  window.QuinnjaLetters.Nfc = moduleApi;
})();
