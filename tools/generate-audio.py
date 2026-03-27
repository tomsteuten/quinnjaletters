"""
Quinnja Letters — Batch TTS Audio Generator using Edge TTS

Usage:
    pip install edge-tts
    python tools/generate-audio.py

This generates all game audio MP3s from the manifest below using Microsoft's
free neural TTS voices. Edit the text, re-run the script — iteration drops
from minutes to seconds.

To preview available voices:
    edge-tts --list-voices | grep en-

Recommended voices:
    en-GB-SoniaNeural     (warm British female — default)
    en-GB-MaisieNeural    (young female)
    en-AU-NatashaNeural   (friendly Australian)
"""

import asyncio
import os
import sys

try:
    import edge_tts
except ImportError:
    print("edge-tts not installed. Run: pip install edge-tts")
    sys.exit(1)

# Voice to use — change this to try different voices
VOICE = "en-GB-SoniaNeural"

# Output directory (relative to project root)
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.dirname(SCRIPT_DIR)
OUTPUT_DIR = os.path.join(PROJECT_ROOT, "assets", "audio")

# Audio manifest — edit text here, re-run to regenerate
MANIFEST = [
    # Per-letter: meet intros
    {"file": "meet-s.mp3", "text": "This is the letter S. S makes a sss sound, like a snake!"},
    {"file": "meet-a.mp3", "text": "This is the letter A. A makes an ah sound, like apple!"},
    {"file": "meet-t.mp3", "text": "This is the letter T. T makes a tuh sound, like tap!"},
    {"file": "meet-p.mp3", "text": "This is the letter P. P makes a puh sound, like pig!"},
    {"file": "meet-i.mp3", "text": "This is the letter I. I makes an ih sound, like igloo!"},
    {"file": "meet-n.mp3", "text": "This is the letter N. N makes a nnn sound, like net!"},

    # Per-letter: phoneme sounds
    {"file": "sound-s.mp3", "text": "sssss"},
    {"file": "sound-a.mp3", "text": "aah"},
    {"file": "sound-t.mp3", "text": "tuh"},
    {"file": "sound-p.mp3", "text": "puh"},
    {"file": "sound-i.mp3", "text": "ih"},
    {"file": "sound-n.mp3", "text": "nnn"},

    # Per-letter: pick prompts
    {"file": "pick-s.mp3", "text": "Can you find the letter S?"},
    {"file": "pick-a.mp3", "text": "Can you find the letter A?"},
    {"file": "pick-t.mp3", "text": "Can you find the letter T?"},
    {"file": "pick-p.mp3", "text": "Can you find the letter P?"},
    {"file": "pick-i.mp3", "text": "Can you find the letter I?"},
    {"file": "pick-n.mp3", "text": "Can you find the letter N?"},

    # Shared: trace
    {"file": "trace-prompt.mp3", "text": "Now trace the letter! Start at the dot."},

    # Shared: praise (correct pick) — 8 variants for variety
    {"file": "praise-1.mp3", "text": "Well done!"},
    {"file": "praise-2.mp3", "text": "That's right!"},
    {"file": "praise-3.mp3", "text": "You got it!"},
    {"file": "praise-4.mp3", "text": "Great work!"},
    {"file": "praise-5.mp3", "text": "Fantastic!"},
    {"file": "praise-6.mp3", "text": "Look at you go!"},
    {"file": "praise-7.mp3", "text": "You're a star!"},
    {"file": "praise-8.mp3", "text": "Brilliant!"},

    # Shared: celebrate (after trace) — 8 variants for variety
    {"file": "celebrate-1.mp3", "text": "Amazing!"},
    {"file": "celebrate-2.mp3", "text": "Wonderful!"},
    {"file": "celebrate-3.mp3", "text": "Superstar!"},
    {"file": "celebrate-4.mp3", "text": "Brilliant!"},
    {"file": "celebrate-5.mp3", "text": "What a champion!"},
    {"file": "celebrate-6.mp3", "text": "Incredible!"},
    {"file": "celebrate-7.mp3", "text": "Hooray!"},
    {"file": "celebrate-8.mp3", "text": "You nailed it!"},

    # Shared: try again
    {"file": "try-again.mp3", "text": "Almost! Try another one!"},

    # Shared: session complete
    {"file": "session-complete.mp3", "text": "Amazing! You practised all your letters!"},
]


async def generate_file(entry):
    """Generate a single MP3 from text using Edge TTS."""
    output_path = os.path.join(OUTPUT_DIR, entry["file"])
    communicate = edge_tts.Communicate(entry["text"], VOICE)
    await communicate.save(output_path)
    size_kb = os.path.getsize(output_path) / 1024
    print(f"  {entry['file']:30s} ({size_kb:.0f} KB)")


async def main():
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    print(f"Generating {len(MANIFEST)} audio files with voice: {VOICE}")
    print(f"Output: {OUTPUT_DIR}\n")

    for entry in MANIFEST:
        await generate_file(entry)

    print(f"\nDone! {len(MANIFEST)} files generated.")


if __name__ == "__main__":
    asyncio.run(main())
