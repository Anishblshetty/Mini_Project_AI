// ─── Word Bank ────────────────────────────────────────────────────────────────
const WORD_BANK = [
  // Animals
  { word: "ELEPHANT",  hint: "Largest land animal",           category: "🐾 Animals" },
  { word: "GIRAFFE",   hint: "Tallest animal on Earth",       category: "🐾 Animals" },
  { word: "PENGUIN",   hint: "Flightless bird of Antarctica", category: "🐾 Animals" },
  { word: "DOLPHIN",   hint: "Intelligent ocean mammal",      category: "🐾 Animals" },
  { word: "CHEETAH",   hint: "Fastest land animal",           category: "🐾 Animals" },
  { word: "PANTHER",   hint: "Black big cat",                 category: "🐾 Animals" },
  { word: "OSTRICH",   hint: "Largest bird, cannot fly",      category: "🐾 Animals" },
  { word: "HAMSTER",   hint: "Small furry pocket pet",        category: "🐾 Animals" },

  // Fruits
  { word: "MANGO",     hint: "King of fruits",                category: "🍎 Fruits" },
  { word: "PAPAYA",    hint: "Tropical orange fruit",         category: "🍎 Fruits" },
  { word: "CHERRY",    hint: "Small red stone fruit",         category: "🍎 Fruits" },
  { word: "BANANA",    hint: "Yellow curved fruit",           category: "🍎 Fruits" },
  { word: "LYCHEE",    hint: "Sweet white fruit in red skin", category: "🍎 Fruits" },
  { word: "GUAVA",     hint: "Tropical fruit, pink inside",   category: "🍎 Fruits" },
  { word: "PEACH",     hint: "Fuzzy soft summer fruit",       category: "🍎 Fruits" },
  { word: "PLUM",      hint: "Small purple juicy fruit",      category: "🍎 Fruits" },

  // Countries
  { word: "BRAZIL",    hint: "Largest country in South America",   category: "🌍 Countries" },
  { word: "FRANCE",    hint: "Home of the Eiffel Tower",           category: "🌍 Countries" },
  { word: "JAPAN",     hint: "Land of the Rising Sun",             category: "🌍 Countries" },
  { word: "CANADA",    hint: "Known for maple syrup",              category: "🌍 Countries" },
  { word: "EGYPT",     hint: "Home of the Pyramids",               category: "🌍 Countries" },
  { word: "MEXICO",    hint: "Country with Chichen Itza",          category: "🌍 Countries" },
  { word: "SWEDEN",    hint: "Scandinavian country in Europe",     category: "🌍 Countries" },
  { word: "RUSSIA",    hint: "Largest country by area",            category: "🌍 Countries" },

  // Sports
  { word: "CRICKET",   hint: "Popular bat and ball sport",         category: "⚽ Sports" },
  { word: "TENNIS",    hint: "Played with a racket and net",       category: "⚽ Sports" },
  { word: "HOCKEY",    hint: "Played with a stick and puck",       category: "⚽ Sports" },
  { word: "BOXING",    hint: "Fighting sport with gloves",         category: "⚽ Sports" },
  { word: "SWIMMING",  hint: "Race in water lanes",                category: "⚽ Sports" },
  { word: "ARCHERY",   hint: "Shooting arrows at a target",        category: "⚽ Sports" },
  { word: "ROWING",    hint: "Paddling a boat in a race",          category: "⚽ Sports" },
  { word: "FENCING",   hint: "Sword fighting sport",               category: "⚽ Sports" },

  // Technology
  { word: "BROWSER",   hint: "You use it to surf the web",         category: "💻 Technology" },
  { word: "KEYBOARD",  hint: "You type on this",                   category: "💻 Technology" },
  { word: "MONITOR",   hint: "Screen that shows your work",        category: "💻 Technology" },
  { word: "ROUTER",    hint: "Device that gives you WiFi",         category: "💻 Technology" },
  { word: "PYTHON",    hint: "Popular programming language",       category: "💻 Technology" },
  { word: "SERVER",    hint: "Hosts websites and data",            category: "💻 Technology" },
  { word: "PIXEL",     hint: "Tiny dot that makes up a screen",    category: "💻 Technology" },
  { word: "CURSOR",    hint: "Arrow pointer on screen",            category: "💻 Technology" },
];

const ROUNDS_PER_GAME = 10;
const TIME_PER_WORD   = 30;

// ─── State ────────────────────────────────────────────────────────────────────
let currentWord    = "";
let currentHint    = "";
let scrambledWord  = "";
let score          = 0;
let bestScore      = parseInt(localStorage.getItem("wsb") || "0");
let round          = 0;
let correct        = 0;
let skipped        = 0;
let streak         = 0;
let bestStreak     = 0;
let hintUsed       = false;
let timerVal       = TIME_PER_WORD;
let timerInterval  = null;
let usedIndices    = [];
let gameActive     = false;

// ─── DOM ──────────────────────────────────────────────────────────────────────
const scrambledEl  = document.getElementById("scrambledLetters");
const answerInput  = document.getElementById("answerInput");
const feedbackEl   = document.getElementById("feedback");
const timerBarEl   = document.getElementById("timerBar");
const timerTextEl  = document.getElementById("timerText");
const scoreEl      = document.getElementById("score");
const bestEl       = document.getElementById("best");
const statCorrect  = document.getElementById("statCorrect");
const statSkipped  = document.getElementById("statSkipped");
const statStreak   = document.getElementById("statStreak");
const categoryTag  = document.getElementById("categoryTag");
const hintBox      = document.getElementById("hintBox");
const hintTextEl   = document.getElementById("hintText");
const dotsEl       = document.getElementById("progressDots");
const modalOverlay = document.getElementById("modalOverlay");

// ─── Init ─────────────────────────────────────────────────────────────────────
bestEl.textContent = bestScore;
answerInput.addEventListener("keydown", (e) => { if (e.key === "Enter") checkAnswer(); });
newGame();

// ─── New Game ─────────────────────────────────────────────────────────────────
function newGame() {
  score     = 0;
  round     = 0;
  correct   = 0;
  skipped   = 0;
  streak    = 0;
  bestStreak= 0;
  usedIndices = [];
  gameActive  = true;

  modalOverlay.classList.remove("show");
  updateStats();
  updateScore();
  buildDots();
  nextWord();
}

// ─── Next Word ────────────────────────────────────────────────────────────────
function nextWord() {
  if (round >= ROUNDS_PER_GAME) { endGame(); return; }

  clearFeedback();
  hintUsed    = false;
  answerInput.value = "";
  answerInput.className = "";
  answerInput.disabled  = false;
  answerInput.focus();

  // Pick unique word
  let idx;
  do { idx = Math.floor(Math.random() * WORD_BANK.length); }
  while (usedIndices.includes(idx));
  usedIndices.push(idx);

  const entry    = WORD_BANK[idx];
  currentWord    = entry.word;
  currentHint    = entry.hint;
  scrambledWord  = scramble(currentWord);

  categoryTag.textContent = entry.category;
  hintTextEl.textContent  = "Click \"Hint\" to reveal the first letter";
  hintBox.style.opacity   = "1";

  renderLetters(scrambledWord);
  updateDot(round, "current");
  round++;
  startTimer();
}

// ─── Scramble ────────────────────────────────────────────────────────────────
function scramble(word) {
  let arr = word.split("");
  let attempts = 0;
  do {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    attempts++;
  } while (arr.join("") === word && attempts < 20);
  return arr.join("");
}

// ─── Render Letter Tiles ─────────────────────────────────────────────────────
function renderLetters(word) {
  scrambledEl.innerHTML = "";
  word.split("").forEach((ch, i) => {
    const tile = document.createElement("div");
    tile.className = "letter-tile";
    tile.style.animationDelay = (i * 0.05) + "s";
    tile.textContent = ch;
    scrambledEl.appendChild(tile);
  });
}

// ─── Timer ───────────────────────────────────────────────────────────────────
function startTimer() {
  clearInterval(timerInterval);
  timerVal = TIME_PER_WORD;
  updateTimerUI();

  timerInterval = setInterval(() => {
    timerVal--;
    updateTimerUI();
    if (timerVal <= 0) {
      clearInterval(timerInterval);
      timeUp();
    }
  }, 1000);
}

function updateTimerUI() {
  const pct = (timerVal / TIME_PER_WORD) * 100;
  timerBarEl.style.width = pct + "%";
  timerTextEl.textContent = timerVal + "s";
  timerBarEl.classList.toggle("warning", timerVal <= 10);
}

function timeUp() {
  showFeedback("⏰ Time's up! Answer: " + currentWord, "wrong");
  answerInput.disabled = true;
  streak = 0;
  skipped++;
  updateStats();
  updateDot(round - 1, "skip");
  setTimeout(() => nextWord(), 1600);
}

// ─── Check Answer ─────────────────────────────────────────────────────────────
function checkAnswer() {
  if (!gameActive || answerInput.disabled) return;
  const val = answerInput.value.trim().toUpperCase();
  if (!val) return;

  clearInterval(timerInterval);

  if (val === currentWord) {
    // Correct
    const timeBonus  = Math.floor((timerVal / TIME_PER_WORD) * 50);
    const hintPenalty = hintUsed ? 5 : 0;
    const streakBonus = streak >= 2 ? (streak * 5) : 0;
    const pts = Math.max(10 + timeBonus + streakBonus - hintPenalty, 5);

    score   += pts;
    correct++;
    streak++;
    if (streak > bestStreak) bestStreak = streak;

    answerInput.className = "correct";
    showFeedback(`✅ Correct! +${pts} pts${streakBonus ? " 🔥 Streak bonus!" : ""}`, "correct");
    scrambledEl.classList.add("bounce-anim");
    setTimeout(() => scrambledEl.classList.remove("bounce-anim"), 500);
    updateDot(round - 1, "done");
    updateScore();
    updateStats();
    setTimeout(() => nextWord(), 1200);
  } else {
    // Wrong
    streak = 0;
    answerInput.className = "wrong";
    answerInput.classList.add("shake");
    setTimeout(() => answerInput.classList.remove("shake"), 400);
    showFeedback("❌ Try again!", "wrong");
    setTimeout(() => {
      answerInput.className = "";
      clearFeedback();
      answerInput.value = "";
      startTimer();
    }, 800);
  }
}

// ─── Hint ─────────────────────────────────────────────────────────────────────
function useHint() {
  if (!gameActive || hintUsed) return;
  hintUsed = true;
  hintTextEl.textContent = `💡 Hint: ${currentHint} (starts with "${currentWord[0]}")`;
  score = Math.max(0, score - 5);
  updateScore();
  answerInput.focus();
}

// ─── Skip ─────────────────────────────────────────────────────────────────────
function skipWord() {
  if (!gameActive) return;
  clearInterval(timerInterval);
  showFeedback("Skipped! Answer: " + currentWord, "wrong");
  answerInput.disabled = true;
  streak = 0;
  skipped++;
  updateStats();
  updateDot(round - 1, "skip");
  setTimeout(() => nextWord(), 1400);
}

// ─── End Game ────────────────────────────────────────────────────────────────
function endGame() {
  gameActive = false;
  clearInterval(timerInterval);

  if (score > bestScore) {
    bestScore = score;
    localStorage.setItem("wsb", bestScore);
    bestEl.textContent = bestScore;
  }

  const pct = Math.round((correct / ROUNDS_PER_GAME) * 100);
  let emoji = "🎯";
  let title = "Round Complete!";
  if (pct === 100)      { emoji = "🏆"; title = "Perfect Score!"; }
  else if (pct >= 70)   { emoji = "🎉"; title = "Great Job!"; }
  else if (pct >= 40)   { emoji = "👍"; title = "Not Bad!"; }
  else                  { emoji = "😅"; title = "Keep Practicing!"; }

  document.getElementById("modalEmoji").textContent    = emoji;
  document.getElementById("modalTitle").textContent    = title;
  document.getElementById("modalScore").textContent    = score;
  document.getElementById("mCorrect").textContent      = correct;
  document.getElementById("mSkipped").textContent      = skipped;
  document.getElementById("mStreak").textContent       = bestStreak;

  setTimeout(() => modalOverlay.classList.add("show"), 400);
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
function updateScore() {
  scoreEl.textContent = score;
  if (score > bestScore) bestEl.textContent = score;
}

function updateStats() {
  statCorrect.textContent = correct;
  statSkipped.textContent = skipped;
  statStreak.textContent  = streak;
}

function showFeedback(msg, type) {
  feedbackEl.textContent  = msg;
  feedbackEl.className    = "feedback " + type;
}

function clearFeedback() {
  feedbackEl.textContent = "";
  feedbackEl.className   = "feedback";
}

function buildDots() {
  dotsEl.innerHTML = "";
  for (let i = 0; i < ROUNDS_PER_GAME; i++) {
    const d = document.createElement("div");
    d.className = "dot";
    d.id = "dot" + i;
    dotsEl.appendChild(d);
  }
}

function updateDot(idx, state) {
  const d = document.getElementById("dot" + idx);
  if (d) d.className = "dot " + state;
}
