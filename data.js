(function () {
  const data = {
    letters: [
      {
        id: "s",
        uppercase: "S",
        lowercase: "s",
        name: "S",
        sound: "sss",
        pictureCueWord: "snake",
        audioLabel: "S",
        colour: "#FFE5EC",
        colourDark: "#EAA7B6",
        stageBackground: "linear-gradient(135deg, #FFE5EC 0%, #FFF0F5 100%)",
        audio: {
          sound: "assets/audio/sound-s.mp3",
          meet: "assets/audio/meet-s.mp3",
          pick: "assets/audio/pick-s.mp3"
        },
        formation: {
          uppercase: {
            strokes: 1,
            continuous: true,
            startPoint: "top-centre",
            steps: ["Little curve", "Little curve"],
            audioInstruction: "Start at the top. Little curve. Little curve.",
            ghostPath: "M116 32 C82 32, 76 84, 109 102 C145 120, 138 184, 90 184",
            ghostPaths: ["M116 32 C82 32, 76 84, 109 102 C145 120, 138 184, 90 184"],
            arrows: [
              { from: { x: 116, y: 32 }, to: { x: 88, y: 90 }, label: "1", labelPos: { x: 126, y: 58 } },
              { from: { x: 88, y: 90 }, to: { x: 92, y: 184 }, label: "2", labelPos: { x: 76, y: 112 } }
            ],
            startDot: { x: 116, y: 32 }
          },
          lowercase: {
            strokes: 1,
            continuous: true,
            startPoint: "top",
            steps: ["Little curve", "Little curve"],
            audioInstruction: "Start at the top. Little curve. Little curve.",
            ghostPath: "M122 95 C100 95, 90 128, 110 133 C130 138, 128 165, 100 165",
            ghostPaths: ["M122 95 C100 95, 90 128, 110 133 C130 138, 128 165, 100 165"],
            arrows: [
              { from: { x: 122, y: 95 }, to: { x: 100, y: 130 }, label: "1", labelPos: { x: 130, y: 108 } },
              { from: { x: 100, y: 130 }, to: { x: 100, y: 165 }, label: "2", labelPos: { x: 88, y: 148 } }
            ],
            startDot: { x: 122, y: 95 }
          }
        }
      },
      {
        id: "a",
        uppercase: "A",
        lowercase: "a",
        name: "A",
        sound: "a",
        pictureCueWord: "apple",
        audioLabel: "A",
        colour: "#E8F5E9",
        colourDark: "#A9D8B0",
        stageBackground: "linear-gradient(135deg, #E8F5E9 0%, #F1F8E9 100%)",
        audio: {
          sound: "assets/audio/sound-a.mp3",
          meet: "assets/audio/meet-a.mp3",
          pick: "assets/audio/pick-a.mp3"
        },
        formation: {
          uppercase: {
            strokes: 3,
            continuous: false,
            startPoint: "top-centre",
            steps: [
              "Big line slides down left",
              "Frog jump back to the top",
              "Big line slides down right",
              "Little line across the middle"
            ],
            audioInstruction: "Start at the top. Big line slides down left. Jump back to the top. Big line slides down right. Little line across the middle.",
            ghostPath: "M110 30 L70 185 M110 30 L150 185 M86 114 L134 114",
            ghostPaths: ["M110 30 L70 185", "M110 30 L150 185", "M86 114 L134 114"],
            arrows: [
              { from: { x: 110, y: 30 }, to: { x: 70, y: 185 }, label: "1", labelPos: { x: 96, y: 56 } },
              { from: { x: 110, y: 30 }, to: { x: 150, y: 185 }, label: "2", labelPos: { x: 126, y: 56 } },
              { from: { x: 86, y: 114 }, to: { x: 134, y: 114 }, label: "3", labelPos: { x: 94, y: 104 } }
            ],
            startDot: { x: 110, y: 30 }
          },
          lowercase: {
            strokes: 1,
            continuous: true,
            startPoint: "two-oclock",
            steps: ["Magic c", "Go all the way around", "Then straight down"],
            audioInstruction: "Start just under the top on the right. Magic c. Go all the way around. Then straight down.",
            ghostPath: "M132 100 C115 88, 88 95, 88 125 C88 150, 110 162, 135 155 M135 100 L135 165",
            ghostPaths: [
              "M132 100 C115 88, 88 95, 88 125 C88 150, 110 162, 135 155",
              "M135 100 L135 165"
            ],
            arrows: [
              { from: { x: 132, y: 100 }, to: { x: 88, y: 130 }, label: "1", labelPos: { x: 138, y: 96 } },
              { from: { x: 88, y: 130 }, to: { x: 135, y: 155 }, label: "2", labelPos: { x: 85, y: 148 } },
              { from: { x: 135, y: 100 }, to: { x: 135, y: 165 }, label: "3", labelPos: { x: 143, y: 140 } }
            ],
            startDot: { x: 132, y: 100 }
          }
        }
      },
      {
        id: "t",
        uppercase: "T",
        lowercase: "t",
        name: "T",
        sound: "t",
        pictureCueWord: "tap",
        audioLabel: "T",
        colour: "#E3F2FD",
        colourDark: "#A8C6E8",
        stageBackground: "linear-gradient(135deg, #E3F2FD 0%, #E8EAF6 100%)",
        audio: {
          sound: "assets/audio/sound-t.mp3",
          meet: "assets/audio/meet-t.mp3",
          pick: "assets/audio/pick-t.mp3"
        },
        formation: {
          uppercase: {
            strokes: 2,
            continuous: false,
            startPoint: "top-centre",
            steps: ["Big line goes down", "Little line goes across the top"],
            audioInstruction: "Start at the top. Big line goes down. Little line goes across the top.",
            ghostPath: "M110 30 L110 185 M70 30 L150 30",
            ghostPaths: ["M110 30 L110 185", "M70 30 L150 30"],
            arrows: [
              { from: { x: 110, y: 30 }, to: { x: 110, y: 185 }, label: "1", labelPos: { x: 118, y: 56 } },
              { from: { x: 70, y: 30 }, to: { x: 150, y: 30 }, label: "2", labelPos: { x: 82, y: 50 } }
            ],
            startDot: { x: 110, y: 30 }
          },
          lowercase: {
            strokes: 2,
            continuous: false,
            startPoint: "top",
            steps: ["Start at the top", "Go straight down", "Cross through the middle"],
            audioInstruction: "Start at the top. Go straight down. Cross through the middle.",
            ghostPath: "M110 65 L110 165 M92 108 L128 108",
            ghostPaths: [
              "M110 65 L110 165",
              "M92 108 L128 108"
            ],
            arrows: [
              { from: { x: 110, y: 65 }, to: { x: 110, y: 165 }, label: "1", labelPos: { x: 118, y: 90 } },
              { from: { x: 92, y: 108 }, to: { x: 128, y: 108 }, label: "2", labelPos: { x: 96, y: 100 } }
            ],
            startDot: { x: 110, y: 65 }
          }
        }
      },
      {
        id: "p",
        uppercase: "P",
        lowercase: "p",
        name: "P",
        sound: "p",
        pictureCueWord: "pig",
        audioLabel: "P",
        colour: "#FFF3E0",
        colourDark: "#E6B787",
        stageBackground: "linear-gradient(135deg, #FFF3E0 0%, #FFF8E1 100%)",
        audio: {
          sound: "assets/audio/sound-p.mp3",
          meet: "assets/audio/meet-p.mp3",
          pick: "assets/audio/pick-p.mp3"
        },
        formation: {
          uppercase: {
            strokes: 2,
            continuous: false,
            startPoint: "top-left",
            steps: ["Big line goes down", "Frog jump back to the top", "Big curve around"],
            audioInstruction: "Start at the top left. Big line goes down. Jump back to the top. Big curve around.",
            ghostPath: "M78 30 L78 185 M78 30 C148 34, 148 112, 78 112",
            ghostPaths: ["M78 30 L78 185", "M78 30 C148 34, 148 112, 78 112"],
            arrows: [
              { from: { x: 78, y: 30 }, to: { x: 78, y: 185 }, label: "1", labelPos: { x: 86, y: 56 } },
              { from: { x: 78, y: 30 }, to: { x: 140, y: 86 }, label: "2", labelPos: { x: 88, y: 74 } }
            ],
            startDot: { x: 78, y: 30 }
          },
          lowercase: {
            strokes: 1,
            continuous: true,
            startPoint: "midline",
            steps: ["Start in the middle", "Dive down below the line", "Swim back up", "Curve over", "Come back down"],
            audioInstruction: "Start in the middle. Dive down below the line. Swim back up. Curve over. Come back down.",
            ghostPath: "M96 95 L96 200 M96 200 L96 95 M96 95 C130 95, 148 115, 148 132 C148 150, 130 165, 96 165",
            ghostPaths: [
              "M96 95 L96 200",
              "M96 200 L96 95",
              "M96 95 C130 95, 148 115, 148 132 C148 150, 130 165, 96 165"
            ],
            arrows: [
              { from: { x: 96, y: 95 }, to: { x: 96, y: 200 }, label: "1", labelPos: { x: 104, y: 130 } },
              { from: { x: 96, y: 200 }, to: { x: 96, y: 95 }, label: "2", labelPos: { x: 80, y: 150 } },
              { from: { x: 96, y: 95 }, to: { x: 148, y: 132 }, label: "3", labelPos: { x: 110, y: 100 } },
              { from: { x: 148, y: 132 }, to: { x: 96, y: 165 }, label: "4", labelPos: { x: 150, y: 152 } }
            ],
            startDot: { x: 96, y: 95 },
            showDescender: true
          }
        }
      },
      {
        id: "i",
        uppercase: "I",
        lowercase: "i",
        name: "I",
        sound: "i",
        pictureCueWord: "igloo",
        audioLabel: "I",
        colour: "#F3E5F5",
        colourDark: "#CEB1D8",
        stageBackground: "linear-gradient(135deg, #F3E5F5 0%, #EDE7F6 100%)",
        audio: {
          sound: "assets/audio/sound-i.mp3",
          meet: "assets/audio/meet-i.mp3",
          pick: "assets/audio/pick-i.mp3"
        },
        formation: {
          uppercase: {
            strokes: 1,
            continuous: true,
            startPoint: "top-centre",
            steps: ["Big line goes down"],
            audioInstruction: "Start at the top. Big line goes down.",
            ghostPath: "M110 30 L110 185",
            ghostPaths: ["M110 30 L110 185"],
            arrows: [
              { from: { x: 110, y: 30 }, to: { x: 110, y: 185 }, label: "1", labelPos: { x: 118, y: 56 } }
            ],
            startDot: { x: 110, y: 30 }
          },
          lowercase: {
            strokes: 2,
            continuous: false,
            startPoint: "midline",
            steps: ["Start in the middle", "Go straight down", "Pick up", "Dot on top"],
            audioInstruction: "Start in the middle. Go straight down. Pick up. Dot on top.",
            ghostPath: "M110 95 L110 165",
            ghostPaths: ["M110 95 L110 165"],
            arrows: [
              { from: { x: 110, y: 95 }, to: { x: 110, y: 165 }, label: "1", labelPos: { x: 118, y: 120 } },
              { from: { x: 110, y: 68 }, to: { x: 110, y: 68 }, label: "2", labelPos: { x: 118, y: 72 } }
            ],
            startDot: { x: 110, y: 95 },
            dot: { x: 110, y: 68 }
          }
        }
      },
      {
        id: "n",
        uppercase: "N",
        lowercase: "n",
        name: "N",
        sound: "n",
        pictureCueWord: "net",
        audioLabel: "N",
        colour: "#E0F7FA",
        colourDark: "#9FCED4",
        stageBackground: "linear-gradient(135deg, #E0F7FA 0%, #E0F2F1 100%)",
        audio: {
          sound: "assets/audio/sound-n.mp3",
          meet: "assets/audio/meet-n.mp3",
          pick: "assets/audio/pick-n.mp3"
        },
        formation: {
          uppercase: {
            strokes: 3,
            continuous: false,
            startPoint: "top-left",
            steps: [
              "Big line goes down",
              "Frog jump back to the top",
              "Big line slides down to the corner",
              "Frog jump up",
              "Big line goes down"
            ],
            audioInstruction: "Start at the top left. Big line down. Jump back up. Slide down. Jump up. Big line down.",
            ghostPath: "M72 30 L72 185 M72 30 L150 185 M150 30 L150 185",
            ghostPaths: ["M72 30 L72 185", "M72 30 L150 185", "M150 30 L150 185"],
            arrows: [
              { from: { x: 72, y: 30 }, to: { x: 72, y: 185 }, label: "1", labelPos: { x: 80, y: 56 } },
              { from: { x: 72, y: 30 }, to: { x: 150, y: 185 }, label: "2", labelPos: { x: 86, y: 72 } },
              { from: { x: 150, y: 30 }, to: { x: 150, y: 185 }, label: "3", labelPos: { x: 158, y: 56 } }
            ],
            startDot: { x: 72, y: 30 }
          },
          lowercase: {
            strokes: 1,
            continuous: true,
            startPoint: "midline",
            steps: ["Down to the bottom", "Swim back up", "Over the hump", "Back down"],
            audioInstruction: "Start in the middle. Down to the bottom. Swim back up. Over one hump. Back down.",
            ghostPath: "M88 95 L88 165 M88 165 L88 95 M88 95 C88 95, 120 88, 135 110 L135 165",
            ghostPaths: [
              "M88 95 L88 165",
              "M88 165 L88 95",
              "M88 95 C88 95, 120 88, 135 110 L135 165"
            ],
            arrows: [
              { from: { x: 88, y: 95 }, to: { x: 88, y: 165 }, label: "1", labelPos: { x: 96, y: 120 } },
              { from: { x: 88, y: 165 }, to: { x: 88, y: 95 }, label: "2", labelPos: { x: 72, y: 140 } },
              { from: { x: 88, y: 95 }, to: { x: 135, y: 110 }, label: "3", labelPos: { x: 102, y: 92 } },
              { from: { x: 135, y: 110 }, to: { x: 135, y: 165 }, label: "4", labelPos: { x: 143, y: 140 } }
            ],
            startDot: { x: 88, y: 95 }
          }
        }
      }
    ],

    praiseCorrect: ["Well done!", "That's right!", "You got it!", "Great work!", "Fantastic!", "Look at you go!", "You're a star!", "Brilliant!"],
    praiseCelebrate: ["Amazing!", "Wonderful!", "Superstar!", "Brilliant!", "What a champion!", "Incredible!", "Hooray!", "You nailed it!"],
    tryAgainPrompt: "Try again!",

    sharedAudio: {
      tracePrompt: "assets/audio/trace-prompt.mp3",
      praise: [
        "assets/audio/praise-1.mp3",
        "assets/audio/praise-2.mp3",
        "assets/audio/praise-3.mp3",
        "assets/audio/praise-4.mp3",
        "assets/audio/praise-5.mp3",
        "assets/audio/praise-6.mp3",
        "assets/audio/praise-7.mp3",
        "assets/audio/praise-8.mp3"
      ],
      celebrate: [
        "assets/audio/celebrate-1.mp3",
        "assets/audio/celebrate-2.mp3",
        "assets/audio/celebrate-3.mp3",
        "assets/audio/celebrate-4.mp3",
        "assets/audio/celebrate-5.mp3",
        "assets/audio/celebrate-6.mp3",
        "assets/audio/celebrate-7.mp3",
        "assets/audio/celebrate-8.mp3"
      ],
      tryAgain: "assets/audio/try-again.mp3",
      sessionComplete: "assets/audio/session-complete.mp3"
    },

    defaultSettings: {
      childName: "Quinn",
      activeLetterIds: ["s", "a", "t", "p", "i", "n"],
      displayCase: "uppercase",
      traceCase: "lowercase",
      audioEnabled: true,
      soundEffectsEnabled: true,
      formationGuideDefaultOn: true,
      nfcModeOn: false,
      ambientEnabled: false,
      speechSynthEnabled: false,
      speechVoiceURI: "",
      speechRate: 0.9,
      speechPitch: 1.0
    }
  };

  window.QuinnjaData = data;
  window.QuinnjaLetters = window.QuinnjaLetters || {};
  window.QuinnjaLetters.Data = data;
})();
