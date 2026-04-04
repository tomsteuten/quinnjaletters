"""Batch Speech-to-Speech phoneme generation for Quinnja Letters.

Uses ElevenLabs Speech-to-Speech with Emma's voice to re-render the existing
isolated phoneme masters in ``assets/phonetics`` into production clips in
``assets/audio``.

Examples:
    python tools/sts-trial.py
    python tools/sts-trial.py --only g
    python tools/sts-trial.py --dry-run
    python tools/sts-trial.py --overwrite --only z

Reads ``ELEVENLABS_API_KEY`` from the environment.
"""

from __future__ import annotations

import argparse
import json
import os
import time
import uuid
from pathlib import Path
from urllib import error, request

# ---------------------------------------------------------------------------
# Trial config
# ---------------------------------------------------------------------------
VOICE_ID      = "56bWURjYFHyYyVf490Dp"
MODEL_ID      = "eleven_english_sts_v2"
OUTPUT_FORMAT = "mp3_44100_128"
STABILITY     = 0.62
SIMILARITY    = 0.78
STYLE         = 0.0
SPEAKER_BOOST = True
REQUEST_TIMEOUT = 120.0

BASE_URL = "https://api.elevenlabs.io"

PROJECT_ROOT = Path(__file__).resolve().parent.parent
SOURCE_DIR   = PROJECT_ROOT / "assets" / "phonetics"
OUTPUT_DIR   = PROJECT_ROOT / "assets" / "audio"

LETTERS = tuple("abcdefghijklmnopqrstuvwxyz")
PROTECTED_LETTERS = frozenset({"s", "a", "t", "p", "i", "n"})
SOURCE_NAME_OVERRIDES = {
    "o": "alphasounds-o-sh.mp3",
    "p": "alphasounds-p-2.mp3",
    "u": "alphasounds-u-sh.mp3",
}
CALL_DELAY_SECONDS = 1.0
# ---------------------------------------------------------------------------


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description=(
            "Convert isolated phoneme source clips in assets/phonetics into "
            "Emma voice clips in assets/audio using ElevenLabs STS."
        )
    )
    parser.add_argument(
        "--only",
        metavar="LETTER",
        help="Process a single letter from a-z.",
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Print planned operations without calling the ElevenLabs API.",
    )
    parser.add_argument(
        "--overwrite",
        action="store_true",
        help="Overwrite existing output files unless they are protected.",
    )
    parser.add_argument(
        "--allow-protected-overwrite",
        action="store_true",
        help="Allow overwrite of protected reference clips when used with --overwrite.",
    )
    return parser.parse_args()


def normalize_letter(raw_letter: str | None) -> str | None:
    if raw_letter is None:
        return None

    letter = raw_letter.strip().lower()
    if letter not in LETTERS:
        raise ValueError(f"Invalid letter '{raw_letter}'. Expected a single letter a-z.")
    return letter


def source_file_name(letter: str) -> str:
    return SOURCE_NAME_OVERRIDES.get(letter, f"alphasounds-{letter}.mp3")


def source_path_for(letter: str) -> Path:
    return SOURCE_DIR / source_file_name(letter)


def output_path_for(letter: str) -> Path:
    return OUTPUT_DIR / f"sound-{letter}.mp3"


def is_protected_output(letter: str) -> bool:
    return letter in PROTECTED_LETTERS


def planned_letters(only_letter: str | None) -> list[str]:
    return [only_letter] if only_letter else list(LETTERS)


def should_skip_existing(
    *,
    letter: str,
    out_path: Path,
    overwrite: bool,
    allow_protected_overwrite: bool,
) -> tuple[bool, str | None]:
    if not out_path.exists():
        return False, None

    if is_protected_output(letter) and not allow_protected_overwrite:
        return True, "protected output exists; pass --allow-protected-overwrite with --overwrite to replace it"

    if not overwrite:
        return True, "output exists; pass --overwrite to replace it"

    if is_protected_output(letter) and allow_protected_overwrite:
        return False, None

    return False, None


def build_plan(
    *,
    letters: list[str],
    overwrite: bool,
    allow_protected_overwrite: bool,
) -> list[dict[str, object]]:
    operations: list[dict[str, object]] = []
    for letter in letters:
        source_path = source_path_for(letter)
        out_path = output_path_for(letter)

        if not source_path.exists():
            operations.append({
                "letter": letter,
                "action": "error",
                "reason": f"source not found: {source_path}",
                "source_path": source_path,
                "output_path": out_path,
            })
            continue

        skip, reason = should_skip_existing(
            letter=letter,
            out_path=out_path,
            overwrite=overwrite,
            allow_protected_overwrite=allow_protected_overwrite,
        )
        if skip:
            operations.append({
                "letter": letter,
                "action": "skip",
                "reason": reason,
                "source_path": source_path,
                "output_path": out_path,
            })
            continue

        operations.append({
            "letter": letter,
            "action": "convert",
            "reason": None,
            "source_path": source_path,
            "output_path": out_path,
        })

    return operations


def print_plan(operations: list[dict[str, object]]) -> None:
    for op in operations:
        letter = op["letter"]
        action = op["action"]
        source_path = op["source_path"]
        output_path = op["output_path"]
        reason = op["reason"]

        if action == "convert":
            print(f"  STS   {letter}: {source_path.name} -> {output_path.name}")
        elif action == "skip":
            print(f"  SKIP  {letter}: {reason}")
        else:
            print(f"  ERROR {letter}: {reason}")


def _build_multipart(fields: dict, file_name: str, file_data: bytes) -> tuple[str, bytes]:
    """Return (content_type_header_value, body_bytes) for a multipart/form-data request."""
    boundary = uuid.uuid4().hex
    ctype = f"multipart/form-data; boundary={boundary}"

    parts = b""
    for name, value in fields.items():
        parts += f"--{boundary}\r\n".encode()
        parts += f'Content-Disposition: form-data; name="{name}"\r\n\r\n'.encode()
        parts += value.encode() + b"\r\n"

    # Audio file field
    parts += f"--{boundary}\r\n".encode()
    parts += f'Content-Disposition: form-data; name="audio"; filename="{file_name}"\r\n'.encode()
    parts += b"Content-Type: audio/mpeg\r\n\r\n"
    parts += file_data + b"\r\n"
    parts += f"--{boundary}--\r\n".encode()

    return ctype, parts


def _sts_request(api_key: str, source_path: Path) -> bytes:
    query_string = f"output_format={OUTPUT_FORMAT}"
    url = f"{BASE_URL}/v1/speech-to-speech/{VOICE_ID}/stream?{query_string}"

    voice_settings = json.dumps({
        "stability": STABILITY,
        "similarity_boost": SIMILARITY,
        "style": STYLE,
        "use_speaker_boost": SPEAKER_BOOST,
    })

    fields = {
        "model_id": MODEL_ID,
        "voice_settings": voice_settings,
    }

    file_data = source_path.read_bytes()
    content_type, body = _build_multipart(fields, source_path.name, file_data)

    req = request.Request(
        url,
        data=body,
        method="POST",
        headers={
            "xi-api-key": api_key,
            "Content-Type": content_type,
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
    try:
        args = parse_args()
        only_letter = normalize_letter(args.only)
    except ValueError as exc:
        print(f"ERROR: {exc}")
        return 1

    if args.allow_protected_overwrite and not args.overwrite:
        print("ERROR: --allow-protected-overwrite requires --overwrite.")
        return 1

    api_key = os.environ.get("ELEVENLABS_API_KEY", "")
    if not api_key and not args.dry_run:
        print("ERROR: ELEVENLABS_API_KEY environment variable is not set.")
        return 1

    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    letters = planned_letters(only_letter)
    operations = build_plan(
        letters=letters,
        overwrite=args.overwrite,
        allow_protected_overwrite=args.allow_protected_overwrite,
    )

    print("ElevenLabs Speech-to-Speech phoneme batch")
    print(f"Voice:   {VOICE_ID}")
    print(f"Model:   {MODEL_ID}")
    print(f"Source:  {SOURCE_DIR}")
    print(f"Output:  {OUTPUT_DIR}")
    print(f"Letters: {', '.join(letters)}")
    print()

    print_plan(operations)

    if args.dry_run:
        convert_count = sum(1 for op in operations if op["action"] == "convert")
        print()
        print(f"Dry run only. {convert_count} file(s) would be sent to ElevenLabs.")
        return 0

    errors = 0
    converts = [op for op in operations if op["action"] == "convert"]
    for index, op in enumerate(converts):
        letter = op["letter"]
        source_path = op["source_path"]
        out_path = op["output_path"]

        print()
        print(f"  STS   {letter}  ({source_path.name}, {source_path.stat().st_size:,} bytes source)")
        try:
            audio = _sts_request(api_key, source_path)
            out_path.write_bytes(audio)
            print(f"        OK    {len(audio):,} bytes -> {out_path.name}")
        except Exception as exc:
            print(f"        ERROR {exc}")
            errors += 1

        if index != len(converts) - 1:
            time.sleep(CALL_DELAY_SECONDS)

    plan_errors = sum(1 for op in operations if op["action"] == "error")
    errors += plan_errors

    print()
    if errors == 0:
        print(f"Done. Clips written to {OUTPUT_DIR}")
    else:
        print(f"Done with {errors} error(s).")
    return 0 if errors == 0 else 1


if __name__ == "__main__":
    raise SystemExit(main())
