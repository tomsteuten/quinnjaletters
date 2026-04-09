from __future__ import annotations

import argparse
import json
import os
import subprocess
import tempfile
import time
from pathlib import Path

from google import genai
from google.genai import types


PERSONA = (
    "You are Quinnja, a friendly and encouraging teacher for preschoolers. "
    "Speak in a cheerful, warm, child-friendly female voice."
)

MODEL = "gemini-2.5-flash-preview-tts"
VOICE = "Zephyr"


def build_parser() -> argparse.ArgumentParser:
    project_root = Path(__file__).resolve().parent.parent
    parser = argparse.ArgumentParser(description="Generate Quinnja audio via Gemini TTS")
    parser.add_argument("--manifest", required=True, help="Path to JSON manifest file")
    parser.add_argument("--output-dir", required=True, help="Directory to write MP3 files into")
    parser.add_argument(
        "--api-key",
        default=os.environ.get("GEMINI_API_KEY", ""),
        help="Gemini API key (or set GEMINI_API_KEY env var)",
    )
    parser.add_argument(
        "--ffmpeg",
        default=str(project_root / "tools" / "ffmpeg" / "ffmpeg.exe"),
        help="Path to ffmpeg (used if API returns WAV)",
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
        "--delay",
        type=float,
        default=0.5,
        help="Seconds to wait between API calls (default: 0.5)",
    )
    return parser


def pcm_to_mp3(ffmpeg_path: Path, pcm_path: Path, mp3_path: Path, sample_rate: int) -> None:
    """Convert raw signed-16-bit little-endian PCM to MP3."""
    subprocess.run(
        [
            str(ffmpeg_path),
            "-y",
            "-loglevel", "error",
            "-f", "s16le",
            "-ar", str(sample_rate),
            "-ac", "1",
            "-i", str(pcm_path),
            "-codec:a", "libmp3lame",
            "-q:a", "4",
            str(mp3_path),
        ],
        check=True,
    )


def wav_to_mp3(ffmpeg_path: Path, wav_path: Path, mp3_path: Path) -> None:
    subprocess.run(
        [
            str(ffmpeg_path),
            "-y",
            "-loglevel", "error",
            "-i", str(wav_path),
            "-codec:a", "libmp3lame",
            "-q:a", "4",
            str(mp3_path),
        ],
        check=True,
    )


def generate(args: argparse.Namespace) -> int:
    if not args.api_key:
        print("ERROR: No API key provided. Use --api-key or set GEMINI_API_KEY.")
        return 1

    manifest_path = Path(args.manifest)
    output_dir = Path(args.output_dir)
    ffmpeg_path = Path(args.ffmpeg)

    if not manifest_path.exists():
        print(f"ERROR: Manifest not found: {manifest_path}")
        return 1

    manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
    output_dir.mkdir(parents=True, exist_ok=True)

    print(f"Gemini TTS generation")
    print(f"Model:  {MODEL}")
    print(f"Voice:  {VOICE}")
    print(f"Output: {output_dir}")
    print(f"Items:  {len(manifest)}")
    if args.dry_run:
        print("\nDry run — no files will be generated.")

    client = None if args.dry_run else genai.Client(api_key=args.api_key)

    skipped = 0
    generated = 0
    errors = 0

    for entry in manifest:
        filename = entry["file"]
        text = entry["text"]
        out_path = output_dir / filename

        if args.skip_existing and out_path.exists():
            print(f"  SKIP  {filename} (exists)")
            skipped += 1
            continue

        print(f"  GEN   {filename} <= {text!r}")

        if args.dry_run:
            continue

        max_retries = 8
        for attempt in range(max_retries):
            try:
                response = client.models.generate_content(
                    model=MODEL,
                    contents=f"{PERSONA}\n\nSay: {text}",
                    config=types.GenerateContentConfig(
                        speech_config=types.SpeechConfig(
                            voice_config=types.VoiceConfig(
                                prebuilt_voice_config=types.PrebuiltVoiceConfig(
                                    voice_name=VOICE
                                )
                            )
                        ),
                        response_modalities=["AUDIO"],
                    ),
                )

                part = response.candidates[0].content.parts[0]
                audio_bytes = part.inline_data.data
                mime_type = part.inline_data.mime_type or ""

                if "mpeg" in mime_type or "mp3" in mime_type:
                    out_path.write_bytes(audio_bytes)
                elif "L16" in mime_type or "pcm" in mime_type:
                    sample_rate = 24000
                    for seg in mime_type.split(";"):
                        seg = seg.strip()
                        if seg.startswith("rate="):
                            sample_rate = int(seg.split("=")[1])
                    with tempfile.NamedTemporaryFile(suffix=".pcm", delete=False) as tmp:
                        tmp.write(audio_bytes)
                        tmp_path = Path(tmp.name)
                    try:
                        pcm_to_mp3(ffmpeg_path, tmp_path, out_path, sample_rate)
                    finally:
                        tmp_path.unlink(missing_ok=True)
                else:
                    with tempfile.NamedTemporaryFile(suffix=".wav", delete=False) as tmp:
                        tmp.write(audio_bytes)
                        tmp_path = Path(tmp.name)
                    try:
                        wav_to_mp3(ffmpeg_path, tmp_path, out_path)
                    finally:
                        tmp_path.unlink(missing_ok=True)

                generated += 1
                break  # success

            except Exception as exc:
                exc_str = str(exc)
                if "429" in exc_str and attempt < max_retries - 1:
                    # Parse retryDelay from error message if present
                    wait = 22  # default: slightly over 20s (3 req/min)
                    import re
                    m = re.search(r"retryDelay.*?(\d+)s", exc_str)
                    if m:
                        wait = int(m.group(1)) + 2
                    print(f"  WAIT  {filename} — rate limited, retrying in {wait}s (attempt {attempt + 1}/{max_retries})")
                    time.sleep(wait)
                else:
                    print(f"  ERROR {filename}: {exc}")
                    errors += 1
                    break

        if args.delay > 0:
            time.sleep(args.delay)

    print(f"\nDone. Generated: {generated}  Skipped: {skipped}  Errors: {errors}")
    return 0 if errors == 0 else 1


def main() -> int:
    parser = build_parser()
    args = parser.parse_args()
    return generate(args)


if __name__ == "__main__":
    raise SystemExit(main())
