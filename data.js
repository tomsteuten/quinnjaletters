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
      },
      {
        id: "c",
        uppercase: "C",
        lowercase: "c",
        name: "C",
        sound: "k",
        pictureCueWord: "cat",
        audioLabel: "C",
        colour: "#FFE0D6",
        colourDark: "#E8A790",
        stageBackground: "linear-gradient(135deg, #FFE0D6 0%, #FFF0E8 100%)",
        audio: {
          sound: "assets/audio/sound-c.mp3",
          meet: "assets/audio/meet-c.mp3",
          pick: "assets/audio/pick-c.mp3"
        },
        formation: {
          uppercase: {
            strokes: 1,
            continuous: true,
            startPoint: "two-oclock",
            steps: ["Big curve around"],
            audioInstruction: "Start just below the top. Big curve around.",
            ghostPath: "M148 52 C120 28, 62 40, 62 108 C62 176, 120 188, 148 164",
            ghostPaths: ["M148 52 C120 28, 62 40, 62 108 C62 176, 120 188, 148 164"],
            arrows: [
              { from: { x: 148, y: 52 }, to: { x: 62, y: 108 }, label: "1", labelPos: { x: 80, y: 60 } },
              { from: { x: 62, y: 108 }, to: { x: 148, y: 164 }, label: "2", labelPos: { x: 80, y: 160 } }
            ],
            startDot: { x: 148, y: 52 }
          },
          lowercase: {
            strokes: 1,
            continuous: true,
            startPoint: "two-oclock",
            steps: ["Little curve around"],
            audioInstruction: "Start just below the top. Little curve around.",
            ghostPath: "M138 100 C120 88, 88 90, 88 130 C88 158, 110 170, 138 158",
            ghostPaths: ["M138 100 C120 88, 88 90, 88 130 C88 158, 110 170, 138 158"],
            arrows: [
              { from: { x: 138, y: 100 }, to: { x: 88, y: 130 }, label: "1", labelPos: { x: 100, y: 98 } },
              { from: { x: 88, y: 130 }, to: { x: 138, y: 158 }, label: "2", labelPos: { x: 100, y: 158 } }
            ],
            startDot: { x: 138, y: 100 }
          }
        }
      },
      {
        id: "k",
        uppercase: "K",
        lowercase: "k",
        name: "K",
        sound: "k",
        pictureCueWord: "kite",
        audioLabel: "K",
        colour: "#F0E0F0",
        colourDark: "#C8A0C8",
        stageBackground: "linear-gradient(135deg, #F0E0F0 0%, #F5E8F5 100%)",
        audio: {
          sound: "assets/audio/sound-k.mp3",
          meet: "assets/audio/meet-k.mp3",
          pick: "assets/audio/pick-k.mp3"
        },
        formation: {
          uppercase: {
            strokes: 3,
            continuous: false,
            startPoint: "top-left",
            steps: ["Big line goes down", "Diagonal line kicks in", "Diagonal line kicks out"],
            audioInstruction: "Start at the top. Big line down. Pick up. Diagonal in to the middle. Diagonal out to the bottom.",
            ghostPath: "M80 30 L80 185 M150 30 L80 108 M80 108 L150 185",
            ghostPaths: [
              "M80 30 L80 185",
              "M150 30 L80 108",
              "M80 108 L150 185"
            ],
            arrows: [
              { from: { x: 80, y: 30 }, to: { x: 80, y: 185 }, label: "1", labelPos: { x: 66, y: 56 } },
              { from: { x: 150, y: 30 }, to: { x: 80, y: 108 }, label: "2", labelPos: { x: 124, y: 56 } },
              { from: { x: 80, y: 108 }, to: { x: 150, y: 185 }, label: "3", labelPos: { x: 124, y: 156 } }
            ],
            startDot: { x: 80, y: 30 }
          },
          lowercase: {
            strokes: 3,
            continuous: false,
            startPoint: "top",
            steps: ["Line goes down", "Diagonal in", "Diagonal out"],
            audioInstruction: "Start at the top. Line down. Pick up. Diagonal in. Diagonal out.",
            ghostPath: "M88 65 L88 165 M130 95 L88 130 M88 130 L130 165",
            ghostPaths: [
              "M88 65 L88 165",
              "M130 95 L88 130",
              "M88 130 L130 165"
            ],
            arrows: [
              { from: { x: 88, y: 65 }, to: { x: 88, y: 165 }, label: "1", labelPos: { x: 74, y: 100 } },
              { from: { x: 130, y: 95 }, to: { x: 88, y: 130 }, label: "2", labelPos: { x: 118, y: 100 } },
              { from: { x: 88, y: 130 }, to: { x: 130, y: 165 }, label: "3", labelPos: { x: 118, y: 155 } }
            ],
            startDot: { x: 88, y: 65 }
          }
        }
      },
      {
        id: "e",
        uppercase: "E",
        lowercase: "e",
        name: "E",
        sound: "e",
        pictureCueWord: "egg",
        audioLabel: "E",
        colour: "#FFF9C4",
        colourDark: "#E6D370",
        stageBackground: "linear-gradient(135deg, #FFF9C4 0%, #FFFDE7 100%)",
        audio: {
          sound: "assets/audio/sound-e.mp3",
          meet: "assets/audio/meet-e.mp3",
          pick: "assets/audio/pick-e.mp3"
        },
        formation: {
          uppercase: {
            strokes: 4,
            continuous: false,
            startPoint: "top-left",
            steps: ["Big line goes down", "Little line across the top", "Little line across the middle", "Little line across the bottom"],
            audioInstruction: "Start at the top. Big line down. Little line across the top. Little line across the middle. Little line across the bottom.",
            ghostPath: "M80 30 L80 185 M80 30 L150 30 M80 108 L140 108 M80 185 L150 185",
            ghostPaths: [
              "M80 30 L80 185",
              "M80 30 L150 30",
              "M80 108 L140 108",
              "M80 185 L150 185"
            ],
            arrows: [
              { from: { x: 80, y: 30 }, to: { x: 80, y: 185 }, label: "1", labelPos: { x: 66, y: 56 } },
              { from: { x: 80, y: 30 }, to: { x: 150, y: 30 }, label: "2", labelPos: { x: 110, y: 20 } },
              { from: { x: 80, y: 108 }, to: { x: 140, y: 108 }, label: "3", labelPos: { x: 110, y: 98 } },
              { from: { x: 80, y: 185 }, to: { x: 150, y: 185 }, label: "4", labelPos: { x: 110, y: 196 } }
            ],
            startDot: { x: 80, y: 30 }
          },
          lowercase: {
            strokes: 1,
            continuous: true,
            startPoint: "midline",
            steps: ["Line across", "Curve up and over and around"],
            audioInstruction: "Start in the middle. Line across. Curve up, over, and around.",
            ghostPath: "M88 130 L132 130 C132 100, 88 90, 88 130 C88 165, 132 170, 138 155",
            ghostPaths: ["M88 130 L132 130 C132 100, 88 90, 88 130 C88 165, 132 170, 138 155"],
            arrows: [
              { from: { x: 88, y: 130 }, to: { x: 132, y: 130 }, label: "1", labelPos: { x: 110, y: 140 } },
              { from: { x: 132, y: 130 }, to: { x: 138, y: 155 }, label: "2", labelPos: { x: 78, y: 115 } }
            ],
            startDot: { x: 88, y: 130 }
          }
        }
      },
      {
        id: "h",
        uppercase: "H",
        lowercase: "h",
        name: "H",
        sound: "h",
        pictureCueWord: "hat",
        audioLabel: "H",
        colour: "#E8F0E0",
        colourDark: "#B0C8A0",
        stageBackground: "linear-gradient(135deg, #E8F0E0 0%, #F0F5E8 100%)",
        audio: {
          sound: "assets/audio/sound-h.mp3",
          meet: "assets/audio/meet-h.mp3",
          pick: "assets/audio/pick-h.mp3"
        },
        formation: {
          uppercase: {
            strokes: 3,
            continuous: false,
            startPoint: "top-left",
            steps: ["Big line goes down", "Big line goes down", "Little line across the middle"],
            audioInstruction: "Start at the top left. Big line down. Pick up. Big line down on the right. Little line across the middle.",
            ghostPath: "M72 30 L72 185 M148 30 L148 185 M72 108 L148 108",
            ghostPaths: [
              "M72 30 L72 185",
              "M148 30 L148 185",
              "M72 108 L148 108"
            ],
            arrows: [
              { from: { x: 72, y: 30 }, to: { x: 72, y: 185 }, label: "1", labelPos: { x: 58, y: 56 } },
              { from: { x: 148, y: 30 }, to: { x: 148, y: 185 }, label: "2", labelPos: { x: 156, y: 56 } },
              { from: { x: 72, y: 108 }, to: { x: 148, y: 108 }, label: "3", labelPos: { x: 110, y: 98 } }
            ],
            startDot: { x: 72, y: 30 }
          },
          lowercase: {
            strokes: 1,
            continuous: true,
            startPoint: "top",
            steps: ["Line goes down", "Swim back up", "Over the hump", "Back down"],
            audioInstruction: "Start at the top. Line down to the bottom. Swim back up to the middle. Over the hump. Back down.",
            ghostPath: "M88 65 L88 165 M88 165 L88 95 M88 95 C88 95, 120 88, 135 110 L135 165",
            ghostPaths: ["M88 65 L88 165 M88 165 L88 95 M88 95 C88 95, 120 88, 135 110 L135 165"],
            arrows: [
              { from: { x: 88, y: 65 }, to: { x: 88, y: 165 }, label: "1", labelPos: { x: 96, y: 100 } },
              { from: { x: 88, y: 165 }, to: { x: 88, y: 95 }, label: "2", labelPos: { x: 72, y: 140 } },
              { from: { x: 88, y: 95 }, to: { x: 135, y: 110 }, label: "3", labelPos: { x: 102, y: 92 } },
              { from: { x: 135, y: 110 }, to: { x: 135, y: 165 }, label: "4", labelPos: { x: 143, y: 140 } }
            ],
            startDot: { x: 88, y: 65 }
          }
        }
      },
      {
        id: "r",
        uppercase: "R",
        lowercase: "r",
        name: "R",
        sound: "r",
        pictureCueWord: "rain",
        audioLabel: "R",
        colour: "#FFE0E0",
        colourDark: "#E8A0A0",
        stageBackground: "linear-gradient(135deg, #FFE0E0 0%, #FFF0F0 100%)",
        audio: {
          sound: "assets/audio/sound-r.mp3",
          meet: "assets/audio/meet-r.mp3",
          pick: "assets/audio/pick-r.mp3"
        },
        formation: {
          uppercase: {
            strokes: 3,
            continuous: false,
            startPoint: "top-left",
            steps: ["Big line goes down", "Curve around the top", "Diagonal kick out"],
            audioInstruction: "Start at the top. Big line down. Pick up. Curve around the top. Diagonal kick out.",
            ghostPath: "M80 30 L80 185 M80 30 C80 30, 150 30, 150 70 C150 108, 80 108, 80 108 M80 108 L150 185",
            ghostPaths: [
              "M80 30 L80 185",
              "M80 30 C80 30, 150 30, 150 70 C150 108, 80 108, 80 108",
              "M80 108 L150 185"
            ],
            arrows: [
              { from: { x: 80, y: 30 }, to: { x: 80, y: 185 }, label: "1", labelPos: { x: 66, y: 56 } },
              { from: { x: 80, y: 30 }, to: { x: 80, y: 108 }, label: "2", labelPos: { x: 148, y: 56 } },
              { from: { x: 80, y: 108 }, to: { x: 150, y: 185 }, label: "3", labelPos: { x: 124, y: 156 } }
            ],
            startDot: { x: 80, y: 30 }
          },
          lowercase: {
            strokes: 1,
            continuous: true,
            startPoint: "midline",
            steps: ["Down to the bottom", "Swim back up", "Little curve over"],
            audioInstruction: "Start in the middle. Down to the bottom. Swim back up. Little curve over.",
            ghostPath: "M100 95 L100 165 M100 165 L100 95 M100 95 C100 90, 120 88, 130 95",
            ghostPaths: ["M100 95 L100 165 M100 165 L100 95 M100 95 C100 90, 120 88, 130 95"],
            arrows: [
              { from: { x: 100, y: 95 }, to: { x: 100, y: 165 }, label: "1", labelPos: { x: 108, y: 120 } },
              { from: { x: 100, y: 165 }, to: { x: 100, y: 95 }, label: "2", labelPos: { x: 86, y: 140 } },
              { from: { x: 100, y: 95 }, to: { x: 130, y: 95 }, label: "3", labelPos: { x: 115, y: 85 } }
            ],
            startDot: { x: 100, y: 95 }
          }
        }
      },
      {
        id: "m",
        uppercase: "M",
        lowercase: "m",
        name: "M",
        sound: "mmm",
        pictureCueWord: "moon",
        audioLabel: "M",
        colour: "#FFECB3",
        colourDark: "#E6C060",
        stageBackground: "linear-gradient(135deg, #FFECB3 0%, #FFF8E1 100%)",
        audio: {
          sound: "assets/audio/sound-m.mp3",
          meet: "assets/audio/meet-m.mp3",
          pick: "assets/audio/pick-m.mp3"
        },
        formation: {
          uppercase: {
            strokes: 4,
            continuous: false,
            startPoint: "top-left",
            steps: ["Big line goes down", "Diagonal line slides down", "Diagonal line slides up", "Big line goes down"],
            audioInstruction: "Start at the top left. Big line down. Pick up. Diagonal down to the middle. Diagonal back up. Big line down.",
            ghostPath: "M62 30 L62 185 M62 30 L110 120 M110 120 L158 30 M158 30 L158 185",
            ghostPaths: [
              "M62 30 L62 185",
              "M62 30 L110 120",
              "M110 120 L158 30",
              "M158 30 L158 185"
            ],
            arrows: [
              { from: { x: 62, y: 30 }, to: { x: 62, y: 185 }, label: "1", labelPos: { x: 48, y: 56 } },
              { from: { x: 62, y: 30 }, to: { x: 110, y: 120 }, label: "2", labelPos: { x: 72, y: 60 } },
              { from: { x: 110, y: 120 }, to: { x: 158, y: 30 }, label: "3", labelPos: { x: 140, y: 60 } },
              { from: { x: 158, y: 30 }, to: { x: 158, y: 185 }, label: "4", labelPos: { x: 166, y: 56 } }
            ],
            startDot: { x: 62, y: 30 }
          },
          lowercase: {
            strokes: 1,
            continuous: true,
            startPoint: "midline",
            steps: ["Down to the bottom", "Swim back up", "Over one hump", "Back down", "Swim back up", "Over another hump", "Back down"],
            audioInstruction: "Start in the middle. Down. Back up. Over one hump. Down. Back up. Over another hump. Down.",
            ghostPath: "M72 95 L72 165 M72 165 L72 95 M72 95 C72 88, 98 88, 110 110 L110 165 M110 165 L110 95 M110 95 C110 88, 136 88, 148 110 L148 165",
            ghostPaths: ["M72 95 L72 165 M72 165 L72 95 M72 95 C72 88, 98 88, 110 110 L110 165 M110 165 L110 95 M110 95 C110 88, 136 88, 148 110 L148 165"],
            arrows: [
              { from: { x: 72, y: 95 }, to: { x: 72, y: 165 }, label: "1", labelPos: { x: 60, y: 120 } },
              { from: { x: 72, y: 165 }, to: { x: 72, y: 95 }, label: "2", labelPos: { x: 60, y: 145 } },
              { from: { x: 72, y: 95 }, to: { x: 110, y: 165 }, label: "3", labelPos: { x: 90, y: 92 } },
              { from: { x: 110, y: 165 }, to: { x: 110, y: 95 }, label: "4", labelPos: { x: 98, y: 145 } },
              { from: { x: 110, y: 95 }, to: { x: 148, y: 165 }, label: "5", labelPos: { x: 128, y: 92 } }
            ],
            startDot: { x: 72, y: 95 }
          }
        }
      },
      {
        id: "d",
        uppercase: "D",
        lowercase: "d",
        name: "D",
        sound: "d",
        pictureCueWord: "dog",
        audioLabel: "D",
        colour: "#E0ECFF",
        colourDark: "#A0B8E8",
        stageBackground: "linear-gradient(135deg, #E0ECFF 0%, #E8F0FF 100%)",
        audio: {
          sound: "assets/audio/sound-d.mp3",
          meet: "assets/audio/meet-d.mp3",
          pick: "assets/audio/pick-d.mp3"
        },
        formation: {
          uppercase: {
            strokes: 2,
            continuous: false,
            startPoint: "top-left",
            steps: ["Big line goes down", "Big curve around"],
            audioInstruction: "Start at the top. Big line down. Pick up. Big curve around.",
            ghostPath: "M80 30 L80 185 M80 30 C80 30, 160 30, 160 108 C160 185, 80 185, 80 185",
            ghostPaths: [
              "M80 30 L80 185",
              "M80 30 C80 30, 160 30, 160 108 C160 185, 80 185, 80 185"
            ],
            arrows: [
              { from: { x: 80, y: 30 }, to: { x: 80, y: 185 }, label: "1", labelPos: { x: 66, y: 56 } },
              { from: { x: 80, y: 30 }, to: { x: 80, y: 185 }, label: "2", labelPos: { x: 150, y: 100 } }
            ],
            startDot: { x: 80, y: 30 }
          },
          lowercase: {
            strokes: 1,
            continuous: true,
            startPoint: "midline",
            steps: ["Little curve around", "Up to the top", "Back down"],
            audioInstruction: "Start in the middle. Little curve around. Up to the top. Back down.",
            ghostPath: "M132 100 C120 88, 88 90, 88 130 C88 160, 110 170, 132 158 L132 65 M132 65 L132 165",
            ghostPaths: ["M132 100 C120 88, 88 90, 88 130 C88 160, 110 170, 132 158 L132 65 M132 65 L132 165"],
            arrows: [
              { from: { x: 132, y: 100 }, to: { x: 88, y: 130 }, label: "1", labelPos: { x: 78, y: 100 } },
              { from: { x: 132, y: 158 }, to: { x: 132, y: 65 }, label: "2", labelPos: { x: 140, y: 100 } },
              { from: { x: 132, y: 65 }, to: { x: 132, y: 165 }, label: "3", labelPos: { x: 142, y: 150 } }
            ],
            startDot: { x: 132, y: 100 }
          }
        }
      },
      {
        id: "g",
        uppercase: "G",
        lowercase: "g",
        name: "G",
        sound: "g",
        pictureCueWord: "goat",
        audioLabel: "G",
        colour: "#E0F5E8",
        colourDark: "#90D0A8",
        stageBackground: "linear-gradient(135deg, #E0F5E8 0%, #E8FAF0 100%)",
        audio: {
          sound: "assets/audio/sound-g.mp3",
          meet: "assets/audio/meet-g.mp3",
          pick: "assets/audio/pick-g.mp3"
        },
        formation: {
          uppercase: {
            strokes: 2,
            continuous: false,
            startPoint: "two-oclock",
            steps: ["Big curve around", "Little line goes in"],
            audioInstruction: "Start just below the top. Big curve around. Pick up. Little line goes in.",
            ghostPath: "M148 52 C120 28, 62 40, 62 108 C62 176, 120 188, 148 164 M148 108 L110 108",
            ghostPaths: [
              "M148 52 C120 28, 62 40, 62 108 C62 176, 120 188, 148 164",
              "M148 108 L110 108"
            ],
            arrows: [
              { from: { x: 148, y: 52 }, to: { x: 148, y: 164 }, label: "1", labelPos: { x: 56, y: 108 } },
              { from: { x: 148, y: 108 }, to: { x: 110, y: 108 }, label: "2", labelPos: { x: 130, y: 98 } }
            ],
            startDot: { x: 148, y: 52 }
          },
          lowercase: {
            strokes: 1,
            continuous: true,
            startPoint: "two-oclock",
            steps: ["Little curve around", "Up", "Down below the line"],
            audioInstruction: "Start just below the top. Little curve around. Up. Down below the line.",
            ghostPath: "M138 100 C120 88, 88 90, 88 130 C88 158, 110 168, 132 158 L132 95 M132 95 L132 209",
            ghostPaths: ["M138 100 C120 88, 88 90, 88 130 C88 158, 110 168, 132 158 L132 95 M132 95 L132 209"],
            arrows: [
              { from: { x: 138, y: 100 }, to: { x: 88, y: 130 }, label: "1", labelPos: { x: 78, y: 100 } },
              { from: { x: 132, y: 158 }, to: { x: 132, y: 95 }, label: "2", labelPos: { x: 140, y: 120 } },
              { from: { x: 132, y: 95 }, to: { x: 132, y: 209 }, label: "3", labelPos: { x: 140, y: 190 } }
            ],
            startDot: { x: 138, y: 100 },
            showDescender: true
          }
        }
      },
      {
        id: "o",
        uppercase: "O",
        lowercase: "o",
        name: "O",
        sound: "o",
        pictureCueWord: "octopus",
        audioLabel: "O",
        colour: "#FFE8D0",
        colourDark: "#E8B080",
        stageBackground: "linear-gradient(135deg, #FFE8D0 0%, #FFF0E0 100%)",
        audio: {
          sound: "assets/audio/sound-o.mp3",
          meet: "assets/audio/meet-o.mp3",
          pick: "assets/audio/pick-o.mp3"
        },
        formation: {
          uppercase: {
            strokes: 1,
            continuous: true,
            startPoint: "top-centre",
            steps: ["Big curve all the way around"],
            audioInstruction: "Start at the top. Big curve all the way around.",
            ghostPath: "M110 30 C60 30, 55 108, 55 108 C55 185, 110 185, 110 185 C160 185, 165 108, 165 108 C165 30, 110 30, 110 30",
            ghostPaths: ["M110 30 C60 30, 55 108, 55 108 C55 185, 110 185, 110 185 C160 185, 165 108, 165 108 C165 30, 110 30, 110 30"],
            arrows: [
              { from: { x: 110, y: 30 }, to: { x: 55, y: 108 }, label: "1", labelPos: { x: 68, y: 56 } },
              { from: { x: 55, y: 108 }, to: { x: 110, y: 30 }, label: "2", labelPos: { x: 152, y: 108 } }
            ],
            startDot: { x: 110, y: 30 }
          },
          lowercase: {
            strokes: 1,
            continuous: true,
            startPoint: "top",
            steps: ["Little curve all the way around"],
            audioInstruction: "Start at the top. Little curve all the way around.",
            ghostPath: "M110 95 C85 95, 80 130, 80 130 C80 165, 110 165, 110 165 C140 165, 140 130, 140 130 C140 95, 110 95, 110 95",
            ghostPaths: ["M110 95 C85 95, 80 130, 80 130 C80 165, 110 165, 110 165 C140 165, 140 130, 140 130 C140 95, 110 95, 110 95"],
            arrows: [
              { from: { x: 110, y: 95 }, to: { x: 80, y: 130 }, label: "1", labelPos: { x: 78, y: 100 } },
              { from: { x: 80, y: 130 }, to: { x: 110, y: 95 }, label: "2", labelPos: { x: 138, y: 130 } }
            ],
            startDot: { x: 110, y: 95 }
          }
        }
      },
      {
        id: "u",
        uppercase: "U",
        lowercase: "u",
        name: "U",
        sound: "u",
        pictureCueWord: "umbrella",
        audioLabel: "U",
        colour: "#E0E0FF",
        colourDark: "#A0A0E8",
        stageBackground: "linear-gradient(135deg, #E0E0FF 0%, #E8E8FF 100%)",
        audio: {
          sound: "assets/audio/sound-u.mp3",
          meet: "assets/audio/meet-u.mp3",
          pick: "assets/audio/pick-u.mp3"
        },
        formation: {
          uppercase: {
            strokes: 1,
            continuous: true,
            startPoint: "top-left",
            steps: ["Down", "Curve across the bottom", "Back up"],
            audioInstruction: "Start at the top left. Down. Curve across the bottom. Back up.",
            ghostPath: "M72 30 L72 140 C72 185, 110 185, 110 185 C148 185, 148 140, 148 140 L148 30",
            ghostPaths: ["M72 30 L72 140 C72 185, 110 185, 110 185 C148 185, 148 140, 148 140 L148 30"],
            arrows: [
              { from: { x: 72, y: 30 }, to: { x: 72, y: 140 }, label: "1", labelPos: { x: 58, y: 56 } },
              { from: { x: 72, y: 140 }, to: { x: 148, y: 140 }, label: "2", labelPos: { x: 110, y: 190 } },
              { from: { x: 148, y: 140 }, to: { x: 148, y: 30 }, label: "3", labelPos: { x: 156, y: 56 } }
            ],
            startDot: { x: 72, y: 30 }
          },
          lowercase: {
            strokes: 1,
            continuous: true,
            startPoint: "midline",
            steps: ["Down", "Curve across", "Back up", "Down"],
            audioInstruction: "Start in the middle. Down. Curve across. Back up. Down.",
            ghostPath: "M88 95 L88 145 C88 165, 110 165, 132 145 L132 95 M132 95 L132 165",
            ghostPaths: ["M88 95 L88 145 C88 165, 110 165, 132 145 L132 95 M132 95 L132 165"],
            arrows: [
              { from: { x: 88, y: 95 }, to: { x: 88, y: 145 }, label: "1", labelPos: { x: 76, y: 120 } },
              { from: { x: 88, y: 145 }, to: { x: 132, y: 95 }, label: "2", labelPos: { x: 110, y: 168 } },
              { from: { x: 132, y: 95 }, to: { x: 132, y: 165 }, label: "3", labelPos: { x: 140, y: 140 } }
            ],
            startDot: { x: 88, y: 95 }
          }
        }
      },
      {
        id: "l",
        uppercase: "L",
        lowercase: "l",
        name: "L",
        sound: "l",
        pictureCueWord: "lion",
        audioLabel: "L",
        colour: "#F5F0E0",
        colourDark: "#D0C8A0",
        stageBackground: "linear-gradient(135deg, #F5F0E0 0%, #FAF5E8 100%)",
        audio: {
          sound: "assets/audio/sound-l.mp3",
          meet: "assets/audio/meet-l.mp3",
          pick: "assets/audio/pick-l.mp3"
        },
        formation: {
          uppercase: {
            strokes: 2,
            continuous: false,
            startPoint: "top-left",
            steps: ["Big line goes down", "Little line across the bottom"],
            audioInstruction: "Start at the top. Big line down. Little line across the bottom.",
            ghostPath: "M80 30 L80 185 M80 185 L150 185",
            ghostPaths: [
              "M80 30 L80 185",
              "M80 185 L150 185"
            ],
            arrows: [
              { from: { x: 80, y: 30 }, to: { x: 80, y: 185 }, label: "1", labelPos: { x: 66, y: 56 } },
              { from: { x: 80, y: 185 }, to: { x: 150, y: 185 }, label: "2", labelPos: { x: 110, y: 196 } }
            ],
            startDot: { x: 80, y: 30 }
          },
          lowercase: {
            strokes: 1,
            continuous: true,
            startPoint: "top",
            steps: ["Line goes down"],
            audioInstruction: "Start at the top. Line down.",
            ghostPath: "M110 65 L110 165",
            ghostPaths: ["M110 65 L110 165"],
            arrows: [
              { from: { x: 110, y: 65 }, to: { x: 110, y: 165 }, label: "1", labelPos: { x: 118, y: 115 } }
            ],
            startDot: { x: 110, y: 65 }
          }
        }
      },
      {
        id: "f",
        uppercase: "F",
        lowercase: "f",
        name: "F",
        sound: "fff",
        pictureCueWord: "fish",
        audioLabel: "F",
        colour: "#FFE8E8",
        colourDark: "#E8B0B0",
        stageBackground: "linear-gradient(135deg, #FFE8E8 0%, #FFF0F0 100%)",
        audio: {
          sound: "assets/audio/sound-f.mp3",
          meet: "assets/audio/meet-f.mp3",
          pick: "assets/audio/pick-f.mp3"
        },
        formation: {
          uppercase: {
            strokes: 3,
            continuous: false,
            startPoint: "top-left",
            steps: ["Big line goes down", "Little line across the top", "Little line across the middle"],
            audioInstruction: "Start at the top. Big line down. Little line across the top. Little line across the middle.",
            ghostPath: "M80 30 L80 185 M80 30 L150 30 M80 108 L140 108",
            ghostPaths: [
              "M80 30 L80 185",
              "M80 30 L150 30",
              "M80 108 L140 108"
            ],
            arrows: [
              { from: { x: 80, y: 30 }, to: { x: 80, y: 185 }, label: "1", labelPos: { x: 66, y: 56 } },
              { from: { x: 80, y: 30 }, to: { x: 150, y: 30 }, label: "2", labelPos: { x: 110, y: 20 } },
              { from: { x: 80, y: 108 }, to: { x: 140, y: 108 }, label: "3", labelPos: { x: 110, y: 98 } }
            ],
            startDot: { x: 80, y: 30 }
          },
          lowercase: {
            strokes: 2,
            continuous: false,
            startPoint: "top",
            steps: ["Curve over the top and down", "Little line across the middle"],
            audioInstruction: "Start near the top. Curve over and down. Little line across the middle.",
            ghostPath: "M125 72 C125 62, 110 60, 110 72 L110 165 M90 95 L130 95",
            ghostPaths: [
              "M125 72 C125 62, 110 60, 110 72 L110 165",
              "M90 95 L130 95"
            ],
            arrows: [
              { from: { x: 125, y: 72 }, to: { x: 110, y: 165 }, label: "1", labelPos: { x: 118, y: 110 } },
              { from: { x: 90, y: 95 }, to: { x: 130, y: 95 }, label: "2", labelPos: { x: 110, y: 85 } }
            ],
            startDot: { x: 125, y: 72 }
          }
        }
      },
      {
        id: "b",
        uppercase: "B",
        lowercase: "b",
        name: "B",
        sound: "b",
        pictureCueWord: "ball",
        audioLabel: "B",
        colour: "#E0F0F0",
        colourDark: "#90C0C0",
        stageBackground: "linear-gradient(135deg, #E0F0F0 0%, #E8F5F5 100%)",
        audio: {
          sound: "assets/audio/sound-b.mp3",
          meet: "assets/audio/meet-b.mp3",
          pick: "assets/audio/pick-b.mp3"
        },
        formation: {
          uppercase: {
            strokes: 3,
            continuous: false,
            startPoint: "top-left",
            steps: ["Big line goes down", "Bump around the top", "Bump around the bottom"],
            audioInstruction: "Start at the top. Big line down. Pick up. Bump around the top. Bump around the bottom.",
            ghostPath: "M80 30 L80 185 M80 30 C80 30, 150 30, 150 70 C150 108, 80 108, 80 108 M80 108 C80 108, 155 108, 155 148 C155 185, 80 185, 80 185",
            ghostPaths: [
              "M80 30 L80 185",
              "M80 30 C80 30, 150 30, 150 70 C150 108, 80 108, 80 108",
              "M80 108 C80 108, 155 108, 155 148 C155 185, 80 185, 80 185"
            ],
            arrows: [
              { from: { x: 80, y: 30 }, to: { x: 80, y: 185 }, label: "1", labelPos: { x: 66, y: 56 } },
              { from: { x: 80, y: 30 }, to: { x: 80, y: 108 }, label: "2", labelPos: { x: 145, y: 56 } },
              { from: { x: 80, y: 108 }, to: { x: 80, y: 185 }, label: "3", labelPos: { x: 148, y: 148 } }
            ],
            startDot: { x: 80, y: 30 }
          },
          lowercase: {
            strokes: 1,
            continuous: true,
            startPoint: "top",
            steps: ["Line goes down", "Swim back up to the middle", "Bump around"],
            audioInstruction: "Start at the top. Line down. Swim back up to the middle. Bump around.",
            ghostPath: "M88 65 L88 165 M88 165 L88 95 M88 95 C88 90, 138 90, 138 130 C138 165, 88 168, 88 165",
            ghostPaths: ["M88 65 L88 165 M88 165 L88 95 M88 95 C88 90, 138 90, 138 130 C138 165, 88 168, 88 165"],
            arrows: [
              { from: { x: 88, y: 65 }, to: { x: 88, y: 165 }, label: "1", labelPos: { x: 76, y: 100 } },
              { from: { x: 88, y: 165 }, to: { x: 88, y: 95 }, label: "2", labelPos: { x: 76, y: 145 } },
              { from: { x: 88, y: 95 }, to: { x: 88, y: 165 }, label: "3", labelPos: { x: 138, y: 120 } }
            ],
            startDot: { x: 88, y: 65 }
          }
        }
      },
      {
        id: "j",
        uppercase: "J",
        lowercase: "j",
        name: "J",
        sound: "j",
        pictureCueWord: "jug",
        audioLabel: "J",
        colour: "#FFE8C8",
        colourDark: "#E8C090",
        stageBackground: "linear-gradient(135deg, #FFE8C8 0%, #FFF0D8 100%)",
        audio: {
          sound: "assets/audio/sound-j.mp3",
          meet: "assets/audio/meet-j.mp3",
          pick: "assets/audio/pick-j.mp3"
        },
        formation: {
          uppercase: {
            strokes: 1,
            continuous: true,
            startPoint: "top-centre",
            steps: ["Line goes down", "Hook to the left"],
            audioInstruction: "Start at the top. Line down. Hook to the left.",
            ghostPath: "M120 30 L120 155 C120 185, 80 185, 80 160",
            ghostPaths: ["M120 30 L120 155 C120 185, 80 185, 80 160"],
            arrows: [
              { from: { x: 120, y: 30 }, to: { x: 120, y: 155 }, label: "1", labelPos: { x: 128, y: 80 } },
              { from: { x: 120, y: 155 }, to: { x: 80, y: 160 }, label: "2", labelPos: { x: 86, y: 178 } }
            ],
            startDot: { x: 120, y: 30 }
          },
          lowercase: {
            strokes: 2,
            continuous: false,
            startPoint: "midline",
            steps: ["Line goes down", "Hook to the left", "Dot on top"],
            audioInstruction: "Start in the middle. Line down. Hook to the left. Pick up. Dot on top.",
            ghostPath: "M118 95 L118 180 C118 209, 88 209, 88 190 M118 75 L118 75",
            ghostPaths: [
              "M118 95 L118 180 C118 209, 88 209, 88 190",
              "M118 75 L118 75"
            ],
            arrows: [
              { from: { x: 118, y: 95 }, to: { x: 88, y: 190 }, label: "1", labelPos: { x: 126, y: 140 } },
              { from: { x: 118, y: 75 }, to: { x: 118, y: 75 }, label: "2", labelPos: { x: 128, y: 75 } }
            ],
            startDot: { x: 118, y: 95 },
            showDescender: true,
            dot: { x: 118, y: 68 }
          }
        }
      },
      {
        id: "z",
        uppercase: "Z",
        lowercase: "z",
        name: "Z",
        sound: "zzz",
        pictureCueWord: "zip",
        audioLabel: "Z",
        colour: "#F0E0F5",
        colourDark: "#C0A0D0",
        stageBackground: "linear-gradient(135deg, #F0E0F5 0%, #F5E8FA 100%)",
        audio: {
          sound: "assets/audio/sound-z.mp3",
          meet: "assets/audio/meet-z.mp3",
          pick: "assets/audio/pick-z.mp3"
        },
        formation: {
          uppercase: {
            strokes: 3,
            continuous: false,
            startPoint: "top-left",
            steps: ["Little line across the top", "Big diagonal line goes down", "Little line across the bottom"],
            audioInstruction: "Start at the top left. Line across the top. Diagonal down. Line across the bottom.",
            ghostPath: "M72 30 L148 30 M148 30 L72 185 M72 185 L148 185",
            ghostPaths: [
              "M72 30 L148 30",
              "M148 30 L72 185",
              "M72 185 L148 185"
            ],
            arrows: [
              { from: { x: 72, y: 30 }, to: { x: 148, y: 30 }, label: "1", labelPos: { x: 110, y: 20 } },
              { from: { x: 148, y: 30 }, to: { x: 72, y: 185 }, label: "2", labelPos: { x: 118, y: 100 } },
              { from: { x: 72, y: 185 }, to: { x: 148, y: 185 }, label: "3", labelPos: { x: 110, y: 196 } }
            ],
            startDot: { x: 72, y: 30 }
          },
          lowercase: {
            strokes: 1,
            continuous: true,
            startPoint: "top",
            steps: ["Line across", "Diagonal down", "Line across"],
            audioInstruction: "Start at the top. Line across. Diagonal down. Line across.",
            ghostPath: "M88 95 L132 95 L88 165 L132 165",
            ghostPaths: ["M88 95 L132 95 L88 165 L132 165"],
            arrows: [
              { from: { x: 88, y: 95 }, to: { x: 132, y: 95 }, label: "1", labelPos: { x: 110, y: 85 } },
              { from: { x: 132, y: 95 }, to: { x: 88, y: 165 }, label: "2", labelPos: { x: 118, y: 130 } },
              { from: { x: 88, y: 165 }, to: { x: 132, y: 165 }, label: "3", labelPos: { x: 110, y: 175 } }
            ],
            startDot: { x: 88, y: 95 }
          }
        }
      },
      {
        id: "w",
        uppercase: "W",
        lowercase: "w",
        name: "W",
        sound: "w",
        pictureCueWord: "web",
        audioLabel: "W",
        colour: "#E0F8F0",
        colourDark: "#90D8C0",
        stageBackground: "linear-gradient(135deg, #E0F8F0 0%, #E8FFF5 100%)",
        audio: {
          sound: "assets/audio/sound-w.mp3",
          meet: "assets/audio/meet-w.mp3",
          pick: "assets/audio/pick-w.mp3"
        },
        formation: {
          uppercase: {
            strokes: 4,
            continuous: false,
            startPoint: "top-left",
            steps: ["Diagonal down to the right", "Diagonal up to the right", "Diagonal down to the right", "Diagonal up to the right"],
            audioInstruction: "Start at the top left. Slide down. Slide up. Slide down. Slide up.",
            ghostPath: "M55 30 L80 185 M80 185 L110 90 M110 90 L140 185 M140 185 L165 30",
            ghostPaths: [
              "M55 30 L80 185",
              "M80 185 L110 90",
              "M110 90 L140 185",
              "M140 185 L165 30"
            ],
            arrows: [
              { from: { x: 55, y: 30 }, to: { x: 80, y: 185 }, label: "1", labelPos: { x: 52, y: 56 } },
              { from: { x: 80, y: 185 }, to: { x: 110, y: 90 }, label: "2", labelPos: { x: 82, y: 130 } },
              { from: { x: 110, y: 90 }, to: { x: 140, y: 185 }, label: "3", labelPos: { x: 132, y: 130 } },
              { from: { x: 140, y: 185 }, to: { x: 165, y: 30 }, label: "4", labelPos: { x: 162, y: 56 } }
            ],
            startDot: { x: 55, y: 30 }
          },
          lowercase: {
            strokes: 1,
            continuous: true,
            startPoint: "midline",
            steps: ["Diagonal down", "Diagonal up", "Diagonal down", "Diagonal up"],
            audioInstruction: "Start at the top. Slide down. Slide up. Slide down. Slide up.",
            ghostPath: "M72 95 L88 165 L110 115 L132 165 L148 95",
            ghostPaths: ["M72 95 L88 165 L110 115 L132 165 L148 95"],
            arrows: [
              { from: { x: 72, y: 95 }, to: { x: 88, y: 165 }, label: "1", labelPos: { x: 68, y: 120 } },
              { from: { x: 88, y: 165 }, to: { x: 110, y: 115 }, label: "2", labelPos: { x: 90, y: 140 } },
              { from: { x: 110, y: 115 }, to: { x: 132, y: 165 }, label: "3", labelPos: { x: 126, y: 140 } },
              { from: { x: 132, y: 165 }, to: { x: 148, y: 95 }, label: "4", labelPos: { x: 146, y: 120 } }
            ],
            startDot: { x: 72, y: 95 }
          }
        }
      },
      {
        id: "v",
        uppercase: "V",
        lowercase: "v",
        name: "V",
        sound: "vvv",
        pictureCueWord: "van",
        audioLabel: "V",
        colour: "#FFE0F0",
        colourDark: "#E8A0C0",
        stageBackground: "linear-gradient(135deg, #FFE0F0 0%, #FFF0F8 100%)",
        audio: {
          sound: "assets/audio/sound-v.mp3",
          meet: "assets/audio/meet-v.mp3",
          pick: "assets/audio/pick-v.mp3"
        },
        formation: {
          uppercase: {
            strokes: 2,
            continuous: false,
            startPoint: "top-left",
            steps: ["Diagonal line slides down to the middle", "Diagonal line slides up to the right"],
            audioInstruction: "Start at the top left. Slide down to the middle bottom. Pick up. Slide down from the top right to meet it.",
            ghostPath: "M68 30 L110 185 M152 30 L110 185",
            ghostPaths: [
              "M68 30 L110 185",
              "M152 30 L110 185"
            ],
            arrows: [
              { from: { x: 68, y: 30 }, to: { x: 110, y: 185 }, label: "1", labelPos: { x: 74, y: 80 } },
              { from: { x: 152, y: 30 }, to: { x: 110, y: 185 }, label: "2", labelPos: { x: 144, y: 80 } }
            ],
            startDot: { x: 68, y: 30 }
          },
          lowercase: {
            strokes: 1,
            continuous: true,
            startPoint: "midline",
            steps: ["Diagonal down to the middle", "Diagonal up to the right"],
            audioInstruction: "Start at the top left. Slide down. Slide up.",
            ghostPath: "M80 95 L110 165 L140 95",
            ghostPaths: ["M80 95 L110 165 L140 95"],
            arrows: [
              { from: { x: 80, y: 95 }, to: { x: 110, y: 165 }, label: "1", labelPos: { x: 82, y: 125 } },
              { from: { x: 110, y: 165 }, to: { x: 140, y: 95 }, label: "2", labelPos: { x: 132, y: 125 } }
            ],
            startDot: { x: 80, y: 95 }
          }
        }
      },
      {
        id: "y",
        uppercase: "Y",
        lowercase: "y",
        name: "Y",
        sound: "y",
        pictureCueWord: "yak",
        audioLabel: "Y",
        colour: "#FFF5D0",
        colourDark: "#E8D890",
        stageBackground: "linear-gradient(135deg, #FFF5D0 0%, #FFFAE0 100%)",
        audio: {
          sound: "assets/audio/sound-y.mp3",
          meet: "assets/audio/meet-y.mp3",
          pick: "assets/audio/pick-y.mp3"
        },
        formation: {
          uppercase: {
            strokes: 3,
            continuous: false,
            startPoint: "top-left",
            steps: ["Diagonal down to the centre", "Diagonal down from the right to the centre", "Line goes down"],
            audioInstruction: "Start at the top left. Diagonal down to the centre. Pick up. Diagonal down from the right. Line goes down.",
            ghostPath: "M68 30 L110 108 M152 30 L110 108 M110 108 L110 185",
            ghostPaths: [
              "M68 30 L110 108",
              "M152 30 L110 108",
              "M110 108 L110 185"
            ],
            arrows: [
              { from: { x: 68, y: 30 }, to: { x: 110, y: 108 }, label: "1", labelPos: { x: 74, y: 56 } },
              { from: { x: 152, y: 30 }, to: { x: 110, y: 108 }, label: "2", labelPos: { x: 144, y: 56 } },
              { from: { x: 110, y: 108 }, to: { x: 110, y: 185 }, label: "3", labelPos: { x: 118, y: 150 } }
            ],
            startDot: { x: 68, y: 30 }
          },
          lowercase: {
            strokes: 1,
            continuous: true,
            startPoint: "midline",
            steps: ["Diagonal down", "Diagonal up", "Down below the line"],
            audioInstruction: "Start at the top left. Slide down. Slide up. Down below the line.",
            ghostPath: "M80 95 L110 155 L140 95 M140 95 L110 155 L100 209",
            ghostPaths: ["M80 95 L110 155 L140 95 M140 95 L110 155 L100 209"],
            arrows: [
              { from: { x: 80, y: 95 }, to: { x: 110, y: 155 }, label: "1", labelPos: { x: 82, y: 118 } },
              { from: { x: 110, y: 155 }, to: { x: 140, y: 95 }, label: "2", labelPos: { x: 132, y: 118 } },
              { from: { x: 140, y: 95 }, to: { x: 100, y: 209 }, label: "3", labelPos: { x: 120, y: 190 } }
            ],
            startDot: { x: 80, y: 95 },
            showDescender: true
          }
        }
      },
      {
        id: "x",
        uppercase: "X",
        lowercase: "x",
        name: "X",
        sound: "ks",
        pictureCueWord: "box",
        audioLabel: "X",
        colour: "#E8E8F0",
        colourDark: "#B0B0C8",
        stageBackground: "linear-gradient(135deg, #E8E8F0 0%, #F0F0F5 100%)",
        audio: {
          sound: "assets/audio/sound-x.mp3",
          meet: "assets/audio/meet-x.mp3",
          pick: "assets/audio/pick-x.mp3"
        },
        formation: {
          uppercase: {
            strokes: 2,
            continuous: false,
            startPoint: "top-left",
            steps: ["Diagonal line slides down to the right", "Diagonal line slides down to the left"],
            audioInstruction: "Start at the top left. Diagonal down to the right. Pick up. Diagonal down to the left.",
            ghostPath: "M68 30 L152 185 M152 30 L68 185",
            ghostPaths: [
              "M68 30 L152 185",
              "M152 30 L68 185"
            ],
            arrows: [
              { from: { x: 68, y: 30 }, to: { x: 152, y: 185 }, label: "1", labelPos: { x: 125, y: 80 } },
              { from: { x: 152, y: 30 }, to: { x: 68, y: 185 }, label: "2", labelPos: { x: 85, y: 80 } }
            ],
            startDot: { x: 68, y: 30 }
          },
          lowercase: {
            strokes: 2,
            continuous: false,
            startPoint: "top-left",
            steps: ["Diagonal down to the right", "Diagonal down to the left"],
            audioInstruction: "Start at the top left. Diagonal down to the right. Pick up. Diagonal down to the left.",
            ghostPath: "M82 95 L138 165 M138 95 L82 165",
            ghostPaths: [
              "M82 95 L138 165",
              "M138 95 L82 165"
            ],
            arrows: [
              { from: { x: 82, y: 95 }, to: { x: 138, y: 165 }, label: "1", labelPos: { x: 122, y: 115 } },
              { from: { x: 138, y: 95 }, to: { x: 82, y: 165 }, label: "2", labelPos: { x: 92, y: 115 } }
            ],
            startDot: { x: 82, y: 95 }
          }
        }
      },
      {
        id: "q",
        uppercase: "Q",
        lowercase: "q",
        name: "Q",
        sound: "kw",
        pictureCueWord: "queen",
        audioLabel: "Q",
        colour: "#FFF0C0",
        colourDark: "#E8D070",
        stageBackground: "linear-gradient(135deg, #FFF0C0 0%, #FFF8D0 100%)",
        audio: {
          sound: "assets/audio/sound-q.mp3",
          meet: "assets/audio/meet-q.mp3",
          pick: "assets/audio/pick-q.mp3"
        },
        formation: {
          uppercase: {
            strokes: 2,
            continuous: false,
            startPoint: "top-centre",
            steps: ["Big curve all the way around", "Little diagonal tail"],
            audioInstruction: "Start at the top. Big curve all the way around. Pick up. Little diagonal tail.",
            ghostPath: "M110 30 C60 30, 55 108, 55 108 C55 185, 110 185, 110 185 C160 185, 165 108, 165 108 C165 30, 110 30, 110 30 M130 160 L158 195",
            ghostPaths: [
              "M110 30 C60 30, 55 108, 55 108 C55 185, 110 185, 110 185 C160 185, 165 108, 165 108 C165 30, 110 30, 110 30",
              "M130 160 L158 195"
            ],
            arrows: [
              { from: { x: 110, y: 30 }, to: { x: 55, y: 108 }, label: "1", labelPos: { x: 68, y: 56 } },
              { from: { x: 130, y: 160 }, to: { x: 158, y: 195 }, label: "2", labelPos: { x: 152, y: 170 } }
            ],
            startDot: { x: 110, y: 30 }
          },
          lowercase: {
            strokes: 1,
            continuous: true,
            startPoint: "two-oclock",
            steps: ["Little curve around", "Up", "Down below the line"],
            audioInstruction: "Start just below the top. Little curve around. Up. Down below the line.",
            ghostPath: "M138 100 C120 88, 88 90, 88 130 C88 158, 110 168, 132 158 L132 95 M132 95 L132 209",
            ghostPaths: ["M138 100 C120 88, 88 90, 88 130 C88 158, 110 168, 132 158 L132 95 M132 95 L132 209"],
            arrows: [
              { from: { x: 138, y: 100 }, to: { x: 88, y: 130 }, label: "1", labelPos: { x: 78, y: 100 } },
              { from: { x: 132, y: 158 }, to: { x: 132, y: 95 }, label: "2", labelPos: { x: 140, y: 120 } },
              { from: { x: 132, y: 95 }, to: { x: 132, y: 209 }, label: "3", labelPos: { x: 140, y: 190 } }
            ],
            startDot: { x: 138, y: 100 },
            showDescender: true
          }
        }
      }
    ],

    numbers: [
      {
        id: "1",
        numeral: "1",
        word: "one",
        value: 1,
        uppercase: "1",
        lowercase: "1",
        name: "1",
        colour: "#FFF3E0",
        colourDark: "#E89A5B",
        stageBackground: "linear-gradient(135deg, #FFF3E0 0%, #FFF8EC 100%)",
        dotPattern: [{ x: 50, y: 50 }],
        audio: {
          sound: "assets/audio/sound-1.mp3",
          meet: "assets/audio/meet-1.mp3",
          pick: "assets/audio/pick-1.mp3"
        },
        formation: {
          default: {
            ghostPaths: ["M110 35 L110 185"],
            startDot: { x: 110, y: 35 },
            arrows: [
              { from: { x: 110, y: 35 }, to: { x: 110, y: 185 }, label: "1", labelPos: { x: 120, y: 62 } }
            ]
          }
        }
      },
      {
        id: "2",
        numeral: "2",
        word: "two",
        value: 2,
        uppercase: "2",
        lowercase: "2",
        name: "2",
        colour: "#E8F5E9",
        colourDark: "#7DBA84",
        stageBackground: "linear-gradient(135deg, #E8F5E9 0%, #F1FAF2 100%)",
        dotPattern: [{ x: 36, y: 50 }, { x: 64, y: 50 }],
        audio: {
          sound: "assets/audio/sound-2.mp3",
          meet: "assets/audio/meet-2.mp3",
          pick: "assets/audio/pick-2.mp3"
        },
        formation: {
          default: {
            ghostPaths: ["M84 64 C84 46, 136 46, 136 78 C136 102, 98 122, 86 144 L138 144"],
            startDot: { x: 84, y: 64 },
            arrows: [
              { from: { x: 84, y: 64 }, to: { x: 136, y: 78 }, label: "1", labelPos: { x: 94, y: 50 } },
              { from: { x: 136, y: 78 }, to: { x: 86, y: 144 }, label: "2", labelPos: { x: 142, y: 102 } },
              { from: { x: 86, y: 144 }, to: { x: 138, y: 144 }, label: "3", labelPos: { x: 94, y: 136 } }
            ]
          }
        }
      },
      {
        id: "3",
        numeral: "3",
        word: "three",
        value: 3,
        uppercase: "3",
        lowercase: "3",
        name: "3",
        colour: "#E3F2FD",
        colourDark: "#6E9FD1",
        stageBackground: "linear-gradient(135deg, #E3F2FD 0%, #EEF6FF 100%)",
        dotPattern: [{ x: 50, y: 28 }, { x: 50, y: 52 }, { x: 50, y: 76 }],
        audio: {
          sound: "assets/audio/sound-3.mp3",
          meet: "assets/audio/meet-3.mp3",
          pick: "assets/audio/pick-3.mp3"
        },
        formation: {
          default: {
            ghostPaths: [
              "M88 62 C106 44, 140 52, 132 82 C126 100, 102 106, 92 106",
              "M92 106 C106 106, 136 114, 136 146 C136 174, 102 182, 86 164"
            ],
            startDot: { x: 88, y: 62 },
            arrows: [
              { from: { x: 88, y: 62 }, to: { x: 132, y: 82 }, label: "1", labelPos: { x: 94, y: 48 } },
              { from: { x: 92, y: 106 }, to: { x: 136, y: 146 }, label: "2", labelPos: { x: 98, y: 118 } }
            ]
          }
        }
      },
      {
        id: "4",
        numeral: "4",
        word: "four",
        value: 4,
        uppercase: "4",
        lowercase: "4",
        name: "4",
        colour: "#FCE4EC",
        colourDark: "#D88CAB",
        stageBackground: "linear-gradient(135deg, #FCE4EC 0%, #FFF0F5 100%)",
        dotPattern: [{ x: 36, y: 36 }, { x: 64, y: 36 }, { x: 36, y: 64 }, { x: 64, y: 64 }],
        audio: {
          sound: "assets/audio/sound-4.mp3",
          meet: "assets/audio/meet-4.mp3",
          pick: "assets/audio/pick-4.mp3"
        },
        formation: {
          default: {
            ghostPaths: ["M132 32 L82 122 L144 122", "M132 32 L132 186"],
            startDot: { x: 132, y: 32 },
            arrows: [
              { from: { x: 132, y: 32 }, to: { x: 82, y: 122 }, label: "1", labelPos: { x: 120, y: 56 } },
              { from: { x: 82, y: 122 }, to: { x: 144, y: 122 }, label: "2", labelPos: { x: 90, y: 112 } },
              { from: { x: 132, y: 32 }, to: { x: 132, y: 186 }, label: "3", labelPos: { x: 142, y: 70 } }
            ]
          }
        }
      },
      {
        id: "5",
        numeral: "5",
        word: "five",
        value: 5,
        uppercase: "5",
        lowercase: "5",
        name: "5",
        colour: "#E8EAF6",
        colourDark: "#9398CE",
        stageBackground: "linear-gradient(135deg, #E8EAF6 0%, #F1F3FF 100%)",
        dotPattern: [{ x: 36, y: 36 }, { x: 64, y: 36 }, { x: 50, y: 50 }, { x: 36, y: 64 }, { x: 64, y: 64 }],
        audio: {
          sound: "assets/audio/sound-5.mp3",
          meet: "assets/audio/meet-5.mp3",
          pick: "assets/audio/pick-5.mp3"
        },
        formation: {
          default: {
            ghostPaths: ["M136 42 L92 42 L88 106", "M88 106 C104 90, 138 100, 138 136 C138 172, 102 182, 84 162"],
            startDot: { x: 136, y: 42 },
            arrows: [
              { from: { x: 136, y: 42 }, to: { x: 88, y: 106 }, label: "1", labelPos: { x: 122, y: 52 } },
              { from: { x: 88, y: 106 }, to: { x: 138, y: 136 }, label: "2", labelPos: { x: 96, y: 116 } }
            ]
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
      mode: "letters",
      activeLetterIds: ["s", "a", "t", "p", "i", "n"],
      activeNumberIds: ["1", "2", "3", "4", "5"],
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
