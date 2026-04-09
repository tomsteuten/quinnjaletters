"""
phonetic-dict-setup.py
Creates or updates the 'quinnja-phonetics' ElevenLabs pronunciation dictionary,
populating IPA phoneme rules for all phonetic sound clips used in the game.
Outputs LOCATOR=<id>:<version_id> for use with --pronunciation-dictionary-locator.

Usage:
    python tools/phonetic-dict-setup.py

Reads ELEVENLABS_API_KEY from environment.
"""
from __future__ import annotations
import json
import os
import urllib.request
import urllib.error

BASE_URL = "https://api.elevenlabs.io"
DICT_NAME = "quinnja-phonetics"

# IPA phoneme rules for each sound clip prompt string.
# Keep string_to_replace in sync with manifest "text" fields.
# Using IPA alphabet; phoneme is what ElevenLabs substitutes.
RULES = [
    # Short E as in "egg" (Australian English /e/)
    {"type": "phoneme", "string_to_replace": "ehh",  "phoneme": "eː",  "alphabet": "ipa"},
    # Hard G + schwa (as in "go")
    {"type": "phoneme", "string_to_replace": "guh",  "phoneme": "ɡʌ", "alphabet": "ipa"},
    # Hard K + schwa ("cat" / "kite")
    {"type": "phoneme", "string_to_replace": "kuh",  "phoneme": "kʌ", "alphabet": "ipa"},
    # D + schwa ("dog")
    {"type": "phoneme", "string_to_replace": "duh",  "phoneme": "dʌ", "alphabet": "ipa"},
    # B + schwa ("ball")
    {"type": "phoneme", "string_to_replace": "buh",  "phoneme": "bʌ", "alphabet": "ipa"},
    # J + schwa ("jug")
    {"type": "phoneme", "string_to_replace": "juh",  "phoneme": "dʒʌ", "alphabet": "ipa"},
    # W + schwa ("web")
    {"type": "phoneme", "string_to_replace": "wuh",  "phoneme": "wʌ", "alphabet": "ipa"},
    # Y + schwa ("yak")
    {"type": "phoneme", "string_to_replace": "yuh",  "phoneme": "jʌ", "alphabet": "ipa"},
    # KW + schwa ("queen")
    {"type": "phoneme", "string_to_replace": "kwuh", "phoneme": "kwʌ", "alphabet": "ipa"},
    # Short O as in "octopus"
    {"type": "phoneme", "string_to_replace": "ah",   "phoneme": "ɒ",  "alphabet": "ipa"},
    # Short U as in "umbrella"
    {"type": "phoneme", "string_to_replace": "uh",   "phoneme": "ʌ",  "alphabet": "ipa"},
    # K-S blend for X ("box")
    {"type": "phoneme", "string_to_replace": "ksss", "phoneme": "ks", "alphabet": "ipa"},
    # Sustained L ("lion")
    {"type": "phoneme", "string_to_replace": "lll",  "phoneme": "lːː", "alphabet": "ipa"},
    # Sustained N ("net")
    {"type": "phoneme", "string_to_replace": "nnn",  "phoneme": "nːː", "alphabet": "ipa"},
    # Sustained M ("moon")
    {"type": "phoneme", "string_to_replace": "mmm",  "phoneme": "mːː", "alphabet": "ipa"},
    # Sustained S ("snake")
    {"type": "phoneme", "string_to_replace": "sss",  "phoneme": "sːː", "alphabet": "ipa"},
    # Sustained R ("rain")
    {"type": "phoneme", "string_to_replace": "rrr",  "phoneme": "rːː", "alphabet": "ipa"},
    # Sustained H ("hat")
    {"type": "phoneme", "string_to_replace": "hhh",  "phoneme": "hːː", "alphabet": "ipa"},
    # Sustained F ("fish")
    {"type": "phoneme", "string_to_replace": "fff",  "phoneme": "fːː", "alphabet": "ipa"},
    # Sustained V ("van")
    {"type": "phoneme", "string_to_replace": "vvv",  "phoneme": "vːː", "alphabet": "ipa"},
    # Sustained ZZ ("zip")
    {"type": "phoneme", "string_to_replace": "zzz",  "phoneme": "zːː", "alphabet": "ipa"},
]


def _request(method: str, path: str, *, json_body: dict | None = None,
             api_key: str) -> dict:
    url = f"{BASE_URL}{path}"
    if json_body is not None:
        data = json.dumps(json_body).encode("utf-8")
        headers = {
            "xi-api-key": api_key,
            "Content-Type": "application/json",
        }
    else:
        data = None
        headers = {"xi-api-key": api_key}

    req = urllib.request.Request(url, data=data, method=method, headers=headers)
    try:
        with urllib.request.urlopen(req) as resp:
            return json.loads(resp.read())
    except urllib.error.HTTPError as exc:
        detail = exc.read().decode("utf-8", errors="replace")
        raise RuntimeError(f"HTTP {exc.code} {method} {path}: {detail}") from exc


def main() -> None:
    api_key = os.environ.get("ELEVENLABS_API_KEY", "")
    if not api_key:
        raise SystemExit("ERROR: ELEVENLABS_API_KEY not set")

    # 1. Find existing dictionary named DICT_NAME
    data = _request("GET", "/v1/pronunciation-dictionaries", api_key=api_key)
    dicts = data.get("pronunciation_dictionaries", [])
    existing = next((d for d in dicts if d["name"] == DICT_NAME), None)

    if existing:
        dict_id = existing["id"]
        print(f"Found existing dictionary: {dict_id} ({DICT_NAME})")

        # Remove existing rules for our target strings so we don't accumulate duplicates
        existing_strings = [r["string_to_replace"] for r in RULES]
        remove_payload = {"rule_strings": existing_strings}
        try:
            _request("POST", f"/v1/pronunciation-dictionaries/{dict_id}/remove-rules",
                     json_body=remove_payload, api_key=api_key)
            print(f"Cleared {len(existing_strings)} old rule strings")
        except RuntimeError as exc:
            # Non-fatal: if there were no prior rules the endpoint may 404 or 422
            print(f"(remove-rules skipped: {exc})")
    else:
        # 2. Create a new dictionary using the add-from-rules endpoint (pure JSON)
        result = _request("POST", "/v1/pronunciation-dictionaries/add-from-rules",
                          json_body={
                              "name": DICT_NAME,
                              "description": "Phoneme rules for Quinnja Letters game",
                              "rules": RULES,
                          },
                          api_key=api_key)
        dict_id = result["id"]
        version_id = result.get("version_id") or result.get("latest_version_id", "?")
        print(f"Created dictionary: {dict_id} ({DICT_NAME})")
        print(f"LOCATOR={dict_id}:{version_id}")
        return

    # 3. Add all rules
    result = _request("POST", f"/v1/pronunciation-dictionaries/{dict_id}/add-rules",
                      json_body={"rules": RULES}, api_key=api_key)
    version_id = result.get("version_id") or result.get("id", "?")
    print(f"Added {len(RULES)} phoneme rules. New version: {version_id}")
    print(f"LOCATOR={dict_id}:{version_id}")


if __name__ == "__main__":
    main()
