# 🔤 Word Scramble

A fun, browser-based word unscrambling game built with pure HTML, CSS, and JavaScript. No installation, no frameworks — just open and play!

---

## 📁 Project Structure

```
word-scramble/
├── index.html   → Game layout and structure
├── style.css    → All styling and animations
└── game.js      → Game logic, word bank, timer, scoring
```

---

## 🚀 How to Run

1. Extract the zip file
2. Open `index.html` in any modern browser (Chrome, Firefox, Edge, Safari)
3. That's it — no server or internet required!

---

## 🎮 How to Play

- A scrambled word appears as letter tiles on screen
- Type the correct unscrambled word in the input box
- Press **Enter** or click **Check** to submit your answer
- You have **30 seconds** per word — answer faster for more points!

### Buttons

| Button | Action |
|--------|--------|
| 💡 Hint | Reveals the first letter and the word's clue (costs −5 pts) |
| ⏭ Skip | Skips the current word (counts as skipped) |
| 🔄 New Game | Restarts with a fresh set of 10 words |

---

## 🏆 Scoring System

| Action | Points |
|--------|--------|
| Correct answer | 10 pts base |
| Time bonus | Up to +50 pts (based on remaining time) |
| Streak bonus | +5 pts × current streak (for 2+ in a row) |
| Hint penalty | −5 pts |

Your **best score** is saved in the browser automatically.

---

## 📚 Word Categories

The game includes **40 words** across 5 categories:

- 🐾 **Animals** — Elephant, Giraffe, Penguin, Dolphin...
- 🍎 **Fruits** — Mango, Papaya, Cherry, Lychee...
- 🌍 **Countries** — Brazil, France, Japan, Egypt...
- ⚽ **Sports** — Cricket, Tennis, Boxing, Archery...
- 💻 **Technology** — Browser, Keyboard, Python, Router...

Each game picks **10 random words** from the full pool.

---

## ✨ Features

- 🎲 Random word selection — no two games are the same
- ⏱ Countdown timer with color warning when time is low
- 🔥 Streak tracking for consecutive correct answers
- 📊 Live stats — correct count, skipped count, current streak
- 🟣 Progress dots showing status of each round
- 🏅 Game-over summary with final score and stats
- 💾 Best score saved via localStorage
- 📱 Responsive design — works on mobile and desktop

---

## 🛠 Tech Stack

| Technology | Usage |
|------------|-------|
| HTML5 | Game structure and layout |
| CSS3 | Styling, animations, responsive design |
| JavaScript (Vanilla) | Game logic, timer, scoring, DOM updates |
| Google Fonts | Nunito font family |
| localStorage | Persistent best score |

---

## 🔧 Customisation

To add your own words, open `game.js` and add entries to the `WORD_BANK` array:

```javascript
{ word: "GUITAR", hint: "Six-stringed musical instrument", category: "🎵 Music" },
```

To change the number of rounds or timer duration, edit these constants at the top of `game.js`:

```javascript
const ROUNDS_PER_GAME = 10;  // Number of words per game
const TIME_PER_WORD   = 30;  // Seconds per word
```

---

## 📄 License

Free to use for educational and personal projects.
