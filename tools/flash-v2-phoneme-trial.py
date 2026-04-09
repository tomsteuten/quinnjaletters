"""
Flash v2 phoneme trial — Quinnja Letters
=========================================
Generates 2 test clips using ElevenLabs eleven_flash_v2 with SSML CMU Arpabet
phoneme tags, to check whether Emma's timbre is consistent enough with the
existing Multilingual v2 clips to use for phoneme-only sounds.

Output: assets/audio/flash-v2-phoneme-trial/
  sound-e.mp3  — short "eh" vowel  (ph="EH1")
  sound-g.mp3  — soft "guh" sound  (ph="G AH0")

Usage:
    python tools/flash-v2-phoneme-trial.py

Requires ELEVENLABS_API_KEY environment variable.
"""

from __future__ import annotations

import json
import os
import sys
import time
from pathlib import Path
from urllib import error, parse, request

# ---------------------------------------------------------------------------
# Trial config — edit here if experimenting
# ---------------------------------------------------------------------------
VOICE_ID    = "56bWURjYFHyYyVf490Dp"
MODEL_ID    = "eleven_flash_v2"        # NOT the default multilingual v2
SPEED       = 0.85
STABILITY   = 0.62
SIMILARITY  = 0.78
STYLE       = 0.0
SPEAKER_BOOST = True
OUTPUT_FORMAT = "mp3_44100_128"
DELAY_BETWEEN = 1.0                    # seconds between API calls
REQUEST_TIMEOUT = 120.0

BASE_URL = "https://api.elevenlabs.io"

OUTPUT_DIR = Path(__file__).resolve().parent.parent / "assets" / "audio" / "flash-v2-phoneme-trial"

# SSML clips to generate.  Text must be a complete <speak>…</speak> document.
CLIPS = [
    {
        "file": "sound-e.mp3",
        "ssml": '<speak><phoneme alphabet="cmu-arpabet" ph="EH1">e</phoneme></speak>',
        "note": 'short "eh" vowel',
    },
    {
        "file": "sound-g.mp3",
        "ssml": '<speak><phoneme alphabet="cmu-arpabet" ph="G AH0">g</phoneme></speak>',
        "note": 'soft "guh" sound',
    },
]
# ---------------------------------------------------------------------------


def _tts_request(api_key: str, ssml: str) -> bytes:
    """Call the ElevenLabs TTS streaming endpoint and return raw audio bytes."""
    query = parse.urlencode({"output_format": OUTPUT_FORMAT})
    url = f"{BASE_URL}/v1/text-to-speech/{VOICE_ID}/stream?{query}"

    body = {
        "text": ssml,
        "model_id": MODEL_ID,
        "voice_settings": {
            "stability": STABILITY,
            "similarity_boost": SIMILARITY,
            "style": STYLE,
            "speed": SPEED,
            "use_speaker_boost": SPEAKER_BOOST,
        },
    }

    data = json.dumps(body).encode("utf-8")
    req = request.Request(
        url,
        data=data,
        method="POST",
        headers={
            "xi-api-key": api_key,
            "Content-Type": "application/json",
            "Accept": "audio/mpeg",
        },
    )

    retryable = {408, 409, 425, 429, 500, 502, 503, 504}
    max_retries = 4

    for attempt in range(1, max_retries + 1):
        try:
            with request.urlopen(req, timeout=REQUEST_TIMEOUT) as resp:
                return resp.read()
        except error.HTTPError as exc:
            if exc.code not in retryable or attempt == max_retries:
                detail = exc.read().decode("utf-8", errors="replace")
                raise RuntimeError(f"ElevenLabs HTTP {exc.code}: {detail}") from exc
            wait = min(30.0, 2.0 ** (attempt - 1))
            print(f"  WAIT  HTTP {exc.code}, retry {attempt} in {wait:.1f}s...")
            time.sleep(wait)
        except error.URLError as exc:
            if attempt == max_retries:
                raise RuntimeError(f"Network error: {exc}") from exc
            wait = min(30.0, 2.0 ** (attempt - 1))
            print(f"  WAIT  Network issue, retry {attempt} in {wait:.1f}s...")
            time.sleep(wait)

    raise RuntimeError("Unexpected retry loop exit")


def main() -> int:
    api_key = os.environ.get("ELEVENLABS_API_KEY", "")
    if not api_key:
        print("ERROR: ELEVENLABS_API_KEY environment variable is not set.")
        return 1

    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    print("Flash v2 phoneme trial")
    print(f"Voice:  {VOICE_ID}")
    print(f"Model:  {MODEL_ID}")
    print(f"Speed:  {SPEED}")
    print(f"Output: {OUTPUT_DIR}")
    print()

    errors = 0
    for clip in CLIPS:
        out_path = OUTPUT_DIR / clip["file"]
        print(f"  GEN   {clip['file']}  ({clip['note']})")
        print(f"        SSML: {clip['ssml']}")
        try:
            audio = _tts_request(api_key, clip["ssml"])
            out_path.write_bytes(audio)
            print(f"        OK    {len(audio):,} bytes -> {out_path}")
        except Exception as exc:
            print(f"        ERROR {exc}")
            errors += 1

        if DELAY_BETWEEN > 0 and clip is not CLIPS[-1]:
            time.sleep(DELAY_BETWEEN)

    print()
    if errors == 0:
        print(f"Done. Both clips written to {OUTPUT_DIR}")
    else:
        print(f"Done with {errors} error(s). Check output above.")
    return 0 if errors == 0 else 1


if __name__ == "__main__":
    raise SystemExit(main())
