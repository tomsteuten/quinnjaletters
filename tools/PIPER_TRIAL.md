# Piper Trial

This adds a reversible, local TTS trial for Quinnja without changing the live game audio.

The generator writes trial files to `assets/audio/piper-trial/` so you can listen first and only replace production audio if the voice is good enough.

The working path in this repo is the Python package `piper-tts`, not the standalone `piper.exe`.

## What It Generates

The starter manifest is in [tools/piper-trial-manifest.json](/c:/Users/TomSteuten/OneDrive%20-%20Dunbrae%20Group/Desktop/Quinnja_Letters_R2_fixed/tools/piper-trial-manifest.json).

It includes 10 trial clips:

- `meet-s.mp3`
- `sound-s.mp3`
- `pick-s.mp3`
- `meet-a.mp3`
- `sound-a.mp3`
- `pick-a.mp3`
- `trace-prompt.mp3`
- `praise-1.mp3`
- `try-again.mp3`
- `session-complete.mp3`

## Install Piper

Download:

- the Piper executable for Windows
- one voice model `.onnx`
- the matching `.onnx.json`

A safe starting point is the official Piper workflow with a broadly used English voice such as `en_US-lessac-medium`.

Official Piper README:

- https://github.com/id-2/piper-TTS

Suggested local layout:

```text
tools/
  piper/
    piper.exe
    en_US-lessac-medium.onnx
    en_US-lessac-medium.onnx.json
```

## Install Python Package

The repo virtual environment already has a working install path:

```powershell
.\.venv\Scripts\python.exe -m pip install piper-tts
```

## Run A Dry Check

```powershell
.\.venv\Scripts\python.exe .\tools\generate-audio-piper.py --dry-run
```

## Generate Trial Audio

```powershell
.\.venv\Scripts\python.exe .\tools\generate-audio-piper.py
```

The script will:

- synthesize WAV with `piper-tts`
- convert to MP3 with the bundled `tools/ffmpeg/ffmpeg.exe`
- write the results to `assets/audio/piper-trial/`

## Tuning

Default settings are biased toward calm, child-friendly pacing:

- `LengthScale = 0.94`
- `NoiseScale = 0.55`
- `NoiseW = 0.8`
- `SentenceSilence = 0.12`

Example with slightly slower pacing:

```powershell
.\.venv\Scripts\python.exe .\tools\generate-audio-piper.py `
  --length-scale 1.02
```

## Next Step If The Trial Sounds Good

Do not copy files over manually one by one. Expand the manifest first, review the wording, then either:

- re-run to `assets/audio/piper-trial/` for a full set review
- or re-run with `-OutputDir .\assets\audio` only when you are ready to replace the live files
