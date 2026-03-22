# Quinnja Letters — Audio Files to Produce

Generate all files using the same ElevenLabs voice for consistency.
Keep each file short — under 3 seconds for most, under 5 for intros.
Export as MP3. Place all files in assets/audio/

## Phoneme Sounds
Sustain the sound — these are phonemes, not letter names.

| Filename       | What to generate                                              | Notes                                          |
|----------------|---------------------------------------------------------------|------------------------------------------------|
| sound-s.mp3    | "sssss" (sustained hissing S sound)                           | 1-2 seconds of continuous /s/. No vowel after. |
| sound-a.mp3    | "aaa" (short A as in "apple", not long A as in "ape")         | Short vowel, ~1 second. Mouth open, "ah" sound.|
| sound-t.mp3    | "t" (short sharp plosive, a quick tongue-tap sound)           | Very short. A crisp /t/ with minimal breath.   |
| sound-p.mp3    | "p" (short sharp plosive, a quick lip-pop sound)              | Very short. A crisp /p/ with minimal breath.   |
| sound-i.mp3    | "ih" (short I as in "insect", not long I as in "ice")         | Short vowel, ~1 second. "ih" not "eye".        |
| sound-n.mp3    | "nnnnn" (sustained nasal N sound)                             | 1-2 seconds of continuous /n/. Hum through nose.|

## Letter Introductions (MEET stage)
Played when the letter first appears. Warm, friendly, clear pace.

| Filename       | Script to generate                                            |
|----------------|---------------------------------------------------------------|
| meet-s.mp3     | "This is the letter S. Big S and little s."                   |
| meet-a.mp3     | "This is the letter A. Big A and little a."                   |
| meet-t.mp3     | "This is the letter T. Big T and little t."                   |
| meet-p.mp3     | "This is the letter P. Big P and little p."                   |
| meet-i.mp3     | "This is the letter I. Big I and little i."                   |
| meet-n.mp3     | "This is the letter N. Big N and little n."                   |

## Pick Prompts (PICK stage)
Played when the child needs to find the letter. Encouraging, upbeat.

| Filename       | Script to generate                                            |
|----------------|---------------------------------------------------------------|
| pick-s.mp3     | "Can you find S?"                                             |
| pick-a.mp3     | "Can you find A?"                                             |
| pick-t.mp3     | "Can you find T?"                                             |
| pick-p.mp3     | "Can you find P?"                                             |
| pick-i.mp3     | "Can you find I?"                                             |
| pick-n.mp3     | "Can you find N?"                                             |

## Trace Prompt (TRACE stage)
Single shared file for all letters.

| Filename            | Script to generate                                       |
|---------------------|----------------------------------------------------------|
| trace-prompt.mp3    | "Now trace the letter! Start at the dot."                |

## Praise — Correct Answer (PICK stage)
Played randomly after the child picks the right letter.

| Filename       | Script to generate                                            |
|----------------|---------------------------------------------------------------|
| praise-1.mp3   | "Well done!"                                                  |
| praise-2.mp3   | "That's right!"                                               |
| praise-3.mp3   | "You got it!"                                                 |
| praise-4.mp3   | "Great work!"                                                 |

## Celebration (CELEBRATE stage)
Played randomly after tracing, during the celebration screen.

| Filename         | Script to generate                                          |
|------------------|-------------------------------------------------------------|
| celebrate-1.mp3  | "Amazing!"                                                  |
| celebrate-2.mp3  | "Wonderful!"                                                |
| celebrate-3.mp3  | "Superstar!"                                                |
| celebrate-4.mp3  | "Brilliant!"                                                |

## Try Again (PICK stage — wrong answer)

| Filename        | Script to generate                                           |
|-----------------|--------------------------------------------------------------|
| try-again.mp3   | "Try again!"                                                 |

## Session Complete

| Filename              | Script to generate                                     |
|-----------------------|--------------------------------------------------------|
| session-complete.mp3  | "Amazing! You practised all your letters!"             |

---

## Total: 30 files

- 6 phoneme sounds
- 6 letter introductions
- 6 pick prompts
- 1 trace prompt
- 4 praise
- 4 celebration
- 1 try again
- 1 session complete

## ElevenLabs Tips

- Use a warm, friendly, slightly upbeat voice — something that sounds encouraging but calm, not hyperactive.
- Set stability fairly high to keep the tone consistent across all 30 files.
- For the phoneme sounds, you may need to experiment with spelling. Try "ssssss" for S, "aaaah" for short A, "tuh" for T (then trim the "uh"), "puh" for P (then trim), "ih" for short I, "nnnnnn" for N.
- If ElevenLabs adds unwanted sounds or breath at the start/end of a file, trim them. Audacity (free) can batch-trim silence from multiple files quickly.
- Keep file sizes small — these should be well under 100KB each at 128kbps MP3.
