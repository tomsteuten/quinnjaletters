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
            ghostPath: "M122 92 C95 92, 90 121, 114 130 C137 139, 134 165, 101 165",
            ghostPaths: ["M122 92 C95 92, 90 121, 114 130 C137 139, 134 165, 101 165"],
            arrows: [
              { from: { x: 122, y: 92 }, to: { x: 101, y: 130 }, label: "1", labelPos: { x: 132, y: 108 } },
              { from: { x: 101, y: 130 }, to: { x: 101, y: 165 }, label: "2", labelPos: { x: 90, y: 146 } }
            ],
            startDot: { x: 122, y: 92 }
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
            ghostPath: "M132 98 C120 86, 96 86, 90 108 C84 132, 99 154, 124 152 C136 151, 142 142, 142 131 L142 165",
            ghostPaths: ["M132 98 C120 86, 96 86, 90 108 C84 132, 99 154, 124 152 C136 151, 142 142, 142 131 L142 165"],
            arrows: [
              { from: { x: 132, y: 98 }, to: { x: 92, y: 112 }, label: "1", labelPos: { x: 138, y: 94 } },
              { from: { x: 92, y: 112 }, to: { x: 126, y: 152 }, label: "2", labelPos: { x: 88, y: 136 } },
              { from: { x: 142, y: 131 }, to: { x: 142, y: 165 }, label: "3", labelPos: { x: 150, y: 152 } }
            ],
            startDot: { x: 132, y: 98 }
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
            ghostPath: "M110 60 L110 165 M92 106 L128 106",
            ghostPaths: ["M110 60 L110 165 M92 106 L128 106"],
            arrows: [
              { from: { x: 110, y: 60 }, to: { x: 110, y: 165 }, label: "1", labelPos: { x: 118, y: 86 } },
              { from: { x: 92, y: 106 }, to: { x: 128, y: 106 }, label: "2", labelPos: { x: 96, y: 98 } }
            ],
            startDot: { x: 110, y: 60 }
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
            ghostPath: "M96 88 L96 205 M96 88 C126 88, 142 104, 142 126 L142 165",
            ghostPaths: ["M96 88 L96 205", "M96 205 L96 88", "M96 88 C126 88, 142 104, 142 126 L142 165"],
            arrows: [
              { from: { x: 96, y: 88 }, to: { x: 96, y: 205 }, label: "1", labelPos: { x: 104, y: 116 } },
              { from: { x: 96, y: 205 }, to: { x: 96, y: 88 }, label: "2", labelPos: { x: 80, y: 154 } },
              { from: { x: 96, y: 88 }, to: { x: 142, y: 126 }, label: "3", labelPos: { x: 108, y: 96 } },
              { from: { x: 142, y: 126 }, to: { x: 142, y: 165 }, label: "4", labelPos: { x: 150, y: 148 } }
            ],
            startDot: { x: 96, y: 88 },
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
        pictureCueWord: "insect",
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
            ghostPath: "M110 88 L110 165",
            ghostPaths: ["M110 88 L110 165"],
            arrows: [
              { from: { x: 110, y: 88 }, to: { x: 110, y: 165 }, label: "1", labelPos: { x: 118, y: 114 } },
              { from: { x: 110, y: 62 }, to: { x: 110, y: 62 }, label: "2", labelPos: { x: 118, y: 66 } }
            ],
            startDot: { x: 110, y: 88 },
            dot: { x: 110, y: 62 }
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
            ghostPath: "M82 88 L82 165 M82 88 Q112 88 132 112 L132 165",
            ghostPaths: ["M82 88 L82 165", "M82 165 L82 88", "M82 88 Q112 88 132 112 L132 165"],
            arrows: [
              { from: { x: 82, y: 88 }, to: { x: 82, y: 165 }, label: "1", labelPos: { x: 90, y: 114 } },
              { from: { x: 82, y: 165 }, to: { x: 82, y: 88 }, label: "2", labelPos: { x: 66, y: 132 } },
              { from: { x: 82, y: 88 }, to: { x: 132, y: 112 }, label: "3", labelPos: { x: 96, y: 96 } },
              { from: { x: 132, y: 112 }, to: { x: 132, y: 165 }, label: "4", labelPos: { x: 140, y: 140 } }
            ],
            startDot: { x: 82, y: 88 }
          }
        }
      }
    ],

    praiseCorrect: ["Well done!", "That's right!", "You got it!", "Great work!"],
    praiseCelebrate: ["Amazing!", "Wonderful!", "Superstar!", "Brilliant!"],
    tryAgainPrompt: "Try again!",

    sharedAudio: {
      tracePrompt: "assets/audio/trace-prompt.mp3",
      praise: [
        "assets/audio/praise-1.mp3",
        "assets/audio/praise-2.mp3",
        "assets/audio/praise-3.mp3",
        "assets/audio/praise-4.mp3"
      ],
      celebrate: [
        "assets/audio/celebrate-1.mp3",
        "assets/audio/celebrate-2.mp3",
        "assets/audio/celebrate-3.mp3",
        "assets/audio/celebrate-4.mp3"
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
      nfcModeOn: false
    }
  };

  window.QuinnjaData = data;
  window.QuinnjaLetters = window.QuinnjaLetters || {};
  window.QuinnjaLetters.Data = data;
})();
