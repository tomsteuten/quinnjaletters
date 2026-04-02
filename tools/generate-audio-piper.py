from __future__ import annotations

import argparse
import json
import subprocess
import wave
from pathlib import Path

from piper.config import SynthesisConfig
from piper.voice import PiperVoice


def build_parser() -> argparse.ArgumentParser:
    project_root = Path(__file__).resolve().parent.parent
    parser = argparse.ArgumentParser(description="Generate Quinnja trial audio with piper-tts")
    parser.add_argument(
        "--model",
        default=str(project_root / "tools" / "piper" / "en_US-lessac-medium.onnx"),
        help="Path to Piper ONNX model",
    )
    parser.add_argument(
        "--config",
        default=str(project_root / "tools" / "piper" / "en_US-lessac-medium.onnx.json"),
        help="Path to Piper model config JSON",
    )
    parser.add_argument(
        "--manifest",
        default=str(project_root / "tools" / "piper-trial-manifest.json"),
        help="Path to the JSON manifest",
    )
    parser.add_argument(
        "--output-dir",
        default=str(project_root / "assets" / "audio" / "piper-trial"),
        help="Directory for generated files",
    )
    parser.add_argument(
        "--temp-dir",
        default=str(project_root / "tools" / "tmp-piper-run"),
        help="Directory for temporary WAV intermediates",
    )
    parser.add_argument(
        "--ffmpeg",
        default=str(project_root / "tools" / "ffmpeg" / "ffmpeg.exe"),
        help="Path to ffmpeg executable for mp3 conversion",
    )
    parser.add_argument(
        "--format",
        choices=("wav", "mp3"),
        default="mp3",
        help="Output format",
    )
    parser.add_argument(
        "--sentence-silence",
        type=float,
        default=0.12,
        help="Seconds of silence after each sentence",
    )
    parser.add_argument(
        "--length-scale",
        type=float,
        default=0.94,
        help="Speech pace multiplier",
    )
    parser.add_argument(
        "--noise-scale",
        type=float,
        default=0.55,
        help="Generator noise level",
    )
    parser.add_argument(
        "--noise-w",
        type=float,
        default=0.8,
        help="Phoneme width noise",
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Print planned outputs without generating files",
    )
    parser.add_argument(
        "--only",
        default="",
        help="Generate only the manifest entry with this exact filename",
    )
    return parser


def synthesize_manifest(args: argparse.Namespace) -> int:
    model_path = Path(args.model)
    config_path = Path(args.config)
    manifest_path = Path(args.manifest)
    output_dir = Path(args.output_dir)
    temp_dir = Path(args.temp_dir)
    ffmpeg_path = Path(args.ffmpeg)

    if not model_path.exists():
        raise FileNotFoundError(f"Model not found: {model_path}")
    if not config_path.exists():
        raise FileNotFoundError(f"Config not found: {config_path}")
    if not manifest_path.exists():
        raise FileNotFoundError(f"Manifest not found: {manifest_path}")
    if args.format == "mp3" and not ffmpeg_path.exists():
        raise FileNotFoundError(f"FFmpeg not found: {ffmpeg_path}")

    manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
    if args.only:
        manifest = [entry for entry in manifest if entry["file"] == args.only]
        if not manifest:
            raise FileNotFoundError(f"Manifest entry not found for --only: {args.only}")
    output_dir.mkdir(parents=True, exist_ok=True)
    temp_dir.mkdir(parents=True, exist_ok=True)

    print("Python Piper trial generation")
    print(f"Model:  {model_path}")
    print(f"Config: {config_path}")
    print(f"Output: {output_dir}")
    print(f"Format: {args.format}")
    print(f"Items:  {len(manifest)}")
    if args.dry_run:
        print("\nDry run only. No files will be generated.")

    voice = None
    syn_config = None
    if not args.dry_run:
        voice = PiperVoice.load(model_path=model_path, config_path=config_path)
        syn_config = SynthesisConfig(
            length_scale=args.length_scale,
            noise_scale=args.noise_scale,
            noise_w_scale=args.noise_w,
        )

    for entry in manifest:
        filename = entry["file"]
        text = entry["text"]
        print(f"- {filename} <= {text}")

        if args.dry_run:
            continue

        target_path = output_dir / filename
        if target_path.exists():
            target_path.unlink()

        if args.format == "wav":
            wav_path = target_path
        else:
            wav_path = temp_dir / f"{target_path.stem}.tmp.wav"
            if wav_path.exists():
                wav_path.unlink()

        with wave.open(str(wav_path), "wb") as wav_file:
            voice.synthesize_wav(text, wav_file, syn_config=syn_config)

        if args.format == "mp3":
            subprocess.run(
                [
                    str(ffmpeg_path),
                    "-y",
                    "-loglevel",
                    "error",
                    "-i",
                    str(wav_path),
                    "-codec:a",
                    "libmp3lame",
                    "-q:a",
                    "4",
                    str(target_path),
                ],
                check=True,
            )
            wav_path.unlink()

    print("\nDone.")
    return 0


def main() -> int:
    parser = build_parser()
    args = parser.parse_args()
    return synthesize_manifest(args)


if __name__ == "__main__":
    raise SystemExit(main())
