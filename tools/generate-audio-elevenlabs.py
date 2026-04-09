from __future__ import annotations

import argparse
import json
import os
import time
from pathlib import Path
from typing import Any
from urllib import error, parse, request


PROTECTED_REFERENCE_FILES = {
    "sound-s.mp3",
    "sound-a.mp3",
    "sound-t.mp3",
    "sound-p.mp3",
    "sound-i.mp3",
    "sound-n.mp3",
    "meet-s.mp3",
    "meet-a.mp3",
    "meet-t.mp3",
    "meet-p.mp3",
    "meet-i.mp3",
    "meet-n.mp3",
    "pick-s.mp3",
    "pick-a.mp3",
    "pick-t.mp3",
    "pick-p.mp3",
    "pick-i.mp3",
    "pick-n.mp3",
    "trace-prompt.mp3",
    "praise-1.mp3",
    "praise-2.mp3",
    "praise-3.mp3",
    "praise-4.mp3",
    "celebrate-1.mp3",
    "celebrate-2.mp3",
    "celebrate-3.mp3",
    "celebrate-4.mp3",
    "try-again.mp3",
    "session-complete.mp3",
}


def build_parser() -> argparse.ArgumentParser:
    project_root = Path(__file__).resolve().parent.parent
    parser = argparse.ArgumentParser(description="Generate Quinnja audio via ElevenLabs TTS")
    parser.add_argument(
        "--manifest",
        default=str(project_root / "tools" / "letters-numbers-main-manifest.json"),
        help="Path to JSON manifest file",
    )
    parser.add_argument(
        "--output-dir",
        default=str(project_root / "assets" / "audio"),
        help="Directory to write MP3 files into",
    )
    parser.add_argument(
        "--voice-id",
        default=os.environ.get("ELEVENLABS_VOICE_ID", ""),
        help="ElevenLabs voice ID (or set ELEVENLABS_VOICE_ID env var)",
    )
    parser.add_argument(
        "--api-key",
        default=os.environ.get("ELEVENLABS_API_KEY", ""),
        help="ElevenLabs API key (or set ELEVENLABS_API_KEY env var)",
    )
    parser.add_argument(
        "--model-id",
        default="eleven_multilingual_v2",
        help="ElevenLabs model ID",
    )
    parser.add_argument(
        "--output-format",
        default="mp3_44100_128",
        help="ElevenLabs output format (example: mp3_44100_128)",
    )
    parser.add_argument(
        "--stability",
        type=float,
        default=0.62,
        help="Voice stability setting (0.0-1.0)",
    )
    parser.add_argument(
        "--similarity-boost",
        type=float,
        default=0.78,
        help="Voice similarity boost (0.0-1.0)",
    )
    parser.add_argument(
        "--style",
        type=float,
        default=0.0,
        help="Voice style exaggeration (0.0-1.0)",
    )
    parser.add_argument(
        "--speed",
        type=float,
        default=0.85,
        help="Speech speed (0.7-1.2, default: 0.85)",
    )
    parser.add_argument(
        "--speaker-boost",
        action="store_true",
        default=True,
        help="Enable ElevenLabs speaker boost (default: on)",
    )
    parser.add_argument(
        "--no-speaker-boost",
        action="store_true",
        help="Disable ElevenLabs speaker boost",
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Print planned outputs without generating files",
    )
    parser.add_argument(
        "--skip-existing",
        action="store_true",
        default=True,
        help="Skip files that already exist (default: on)",
    )
    parser.add_argument(
        "--no-skip-existing",
        action="store_true",
        help="Overwrite existing files listed in the manifest",
    )
    parser.add_argument(
        "--allow-protected-overwrite",
        action="store_true",
        help="Allow overwriting protected reference files",
    )
    parser.add_argument(
        "--delay",
        type=float,
        default=1.0,
        help="Seconds to wait between API calls (default: 1.0)",
    )
    parser.add_argument(
        "--max-retries",
        type=int,
        default=6,
        help="Maximum retries for retryable API failures",
    )
    parser.add_argument(
        "--request-timeout",
        type=float,
        default=120.0,
        help="HTTP timeout in seconds",
    )
    parser.add_argument(
        "--only",
        default="",
        help="Generate only the manifest entry with this exact filename",
    )
    parser.add_argument(
        "--base-url",
        default="https://api.elevenlabs.io",
        help="ElevenLabs API base URL",
    )
    parser.add_argument(
        "--language-code",
        default="",
        help="Optional ISO-639-1 language code",
    )
    parser.add_argument(
        "--seed",
        type=int,
        default=-1,
        help="Optional deterministic seed (0 to 4294967295)",
    )
    parser.add_argument(
        "--pronunciation-dictionary-locator",
        action="append",
        default=[],
        help="Pronunciation dictionary locator in id:version_id format. Repeat for multiple locators.",
    )
    return parser


def _clamp(value: float, label: str) -> float:
    if value < 0.0 or value > 1.0:
        raise ValueError(f"{label} must be between 0.0 and 1.0")
    return value


def _clamp_speed(value: float) -> float:
    if value < 0.7 or value > 1.2:
        raise ValueError("speed must be between 0.7 and 1.2")
    return value


def _parse_pronunciation_dictionary_locators(raw_locators: list[str]) -> list[dict[str, str]]:
    locators: list[dict[str, str]] = []
    for raw in raw_locators:
        raw = raw.strip()
        if not raw:
            continue
        parts = raw.split(":", 1)
        if len(parts) != 2 or not parts[0].strip() or not parts[1].strip():
            raise ValueError(
                "Each --pronunciation-dictionary-locator must be in id:version_id format"
            )
        locators.append({"pronunciation_dictionary_id": parts[0].strip(), "version_id": parts[1].strip()})
    return locators


def _load_manifest(manifest_path: Path) -> list[dict[str, str]]:
    if not manifest_path.exists():
        raise FileNotFoundError(f"Manifest not found: {manifest_path}")

    manifest = json.loads(manifest_path.read_text(encoding="utf-8-sig"))
    if not isinstance(manifest, list):
        raise ValueError("Manifest root must be a JSON array")

    parsed_entries: list[dict[str, str]] = []
    for idx, entry in enumerate(manifest):
        if not isinstance(entry, dict):
            raise ValueError(f"Manifest entry {idx} must be an object")
        filename = entry.get("file")
        text = entry.get("text")
        if not filename or not text:
            raise ValueError(f"Manifest entry {idx} must contain non-empty 'file' and 'text'")
        parsed_entries.append({"file": str(filename), "text": str(text)})
    return parsed_entries


def _request_tts_audio(args: argparse.Namespace, text: str) -> bytes:
    query = parse.urlencode({"output_format": args.output_format})
    url = f"{args.base_url.rstrip('/')}/v1/text-to-speech/{args.voice_id}/stream?{query}"

    body = {
        "text": text,
        "model_id": args.model_id,
        "voice_settings": {
            "stability": args.stability,
            "similarity_boost": args.similarity_boost,
            "style": args.style,
            "speed": args.speed,
            "use_speaker_boost": args.speaker_boost,
        },
    }

    if args.language_code:
        body["language_code"] = args.language_code
    if args.seed >= 0:
        body["seed"] = args.seed
    if args.pronunciation_dictionary_locators:
        body["pronunciation_dictionary_locators"] = args.pronunciation_dictionary_locators

    data = json.dumps(body).encode("utf-8")

    req = request.Request(
        url,
        data=data,
        method="POST",
        headers={
            "xi-api-key": args.api_key,
            "Content-Type": "application/json",
            "Accept": "audio/mpeg",
        },
    )

    retryable_statuses = {408, 409, 425, 429, 500, 502, 503, 504}

    for attempt in range(1, args.max_retries + 1):
        try:
            with request.urlopen(req, timeout=args.request_timeout) as response:
                return response.read()
        except error.HTTPError as exc:
            if exc.code not in retryable_statuses or attempt == args.max_retries:
                detail = exc.read().decode("utf-8", errors="replace")
                raise RuntimeError(f"ElevenLabs request failed ({exc.code}): {detail}") from exc
            retry_after = exc.headers.get("Retry-After")
            if retry_after and retry_after.isdigit():
                sleep_seconds = float(retry_after)
            else:
                sleep_seconds = min(30.0, 2.0 ** (attempt - 1))
            print(f"  WAIT  Retryable HTTP {exc.code}. Retrying in {sleep_seconds:.1f}s...")
            time.sleep(sleep_seconds)
        except error.URLError as exc:
            if attempt == args.max_retries:
                raise RuntimeError(f"Network error during ElevenLabs request: {exc}") from exc
            sleep_seconds = min(30.0, 2.0 ** (attempt - 1))
            print(f"  WAIT  Network issue. Retrying in {sleep_seconds:.1f}s...")
            time.sleep(sleep_seconds)

    raise RuntimeError("Unexpected retry loop exit")


def generate(args: argparse.Namespace) -> int:
    if (not args.api_key) and (not args.dry_run):
        print("ERROR: No API key provided. Use --api-key or set ELEVENLABS_API_KEY.")
        return 1
    if not args.voice_id:
        print("ERROR: No voice ID provided. Use --voice-id or set ELEVENLABS_VOICE_ID.")
        return 1

    args.stability = _clamp(args.stability, "stability")
    args.similarity_boost = _clamp(args.similarity_boost, "similarity_boost")
    args.style = _clamp(args.style, "style")
    args.speed = _clamp_speed(args.speed)
    if args.seed > 4294967295:
        print("ERROR: seed must be between 0 and 4294967295")
        return 1
    try:
        args.pronunciation_dictionary_locators = _parse_pronunciation_dictionary_locators(
            args.pronunciation_dictionary_locator
        )
    except ValueError as exc:
        print(f"ERROR: {exc}")
        return 1

    if args.no_speaker_boost:
        args.speaker_boost = False
    if args.no_skip_existing:
        args.skip_existing = False

    manifest_path = Path(args.manifest)
    output_dir = Path(args.output_dir)
    entries = _load_manifest(manifest_path)

    if args.only:
        entries = [entry for entry in entries if entry["file"] == args.only]
        if not entries:
            print(f"ERROR: Manifest entry not found for --only: {args.only}")
            return 1

    output_dir.mkdir(parents=True, exist_ok=True)

    print("ElevenLabs TTS generation")
    print(f"Voice:   {args.voice_id}")
    print(f"Model:   {args.model_id}")
    print(f"Speed:   {args.speed}")
    print(f"Output:  {output_dir}")
    print(f"Items:   {len(entries)}")
    print(f"Dry run: {args.dry_run}")
    if args.pronunciation_dictionary_locators:
        print(f"Dictionary locators: {len(args.pronunciation_dictionary_locators)}")

    generated = 0
    skipped_existing = 0
    skipped_protected = 0
    errors = 0

    for entry in entries:
        filename = entry["file"]
        text = entry["text"]
        out_path = output_dir / filename

        if (filename in PROTECTED_REFERENCE_FILES) and (not args.allow_protected_overwrite):
            print(f"  SKIP  {filename} (protected reference clip)")
            skipped_protected += 1
            continue

        if args.skip_existing and out_path.exists():
            print(f"  SKIP  {filename} (exists)")
            skipped_existing += 1
            continue

        print(f"  GEN   {filename} <= {text!r}")

        if args.dry_run:
            continue

        try:
            audio_bytes = _request_tts_audio(args, text)
            out_path.write_bytes(audio_bytes)
            generated += 1
        except Exception as exc:  # pragma: no cover
            print(f"  ERROR {filename}: {exc}")
            errors += 1

        if args.delay > 0:
            time.sleep(args.delay)

    print(
        "\nDone. "
        f"Generated: {generated}  "
        f"Skipped(existing): {skipped_existing}  "
        f"Skipped(protected): {skipped_protected}  "
        f"Errors: {errors}"
    )
    return 0 if errors == 0 else 1


def main() -> int:
    parser = build_parser()
    args = parser.parse_args()
    return generate(args)


if __name__ == "__main__":
    raise SystemExit(main())