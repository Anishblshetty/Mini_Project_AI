/* ============================================================
   EASY ESCAPE ROOM — script.js
   3 simple puzzles, friendly UI, no AI needed
   ============================================================ */

const puzzles = {
  note: {
    emoji: "📝",
    title: "Sticky Note",
    clue: "The code is the number of sides on:\n🔺 Triangle + 🟥 Square + ⭕ Circle",
    type: "number",
    answer: "430",  // 3 + 4 + 0 = "430" — triangle(3), square(4), circle(0 sides)
    hint: "Think: Triangle = 3 sides, Square = 4 sides, Circle = 0 sides → code is 3, 4, 0"
  },
  chest: {
    emoji: "📦",
    title: "Treasure Chest",
    clue: "Riddle: I have 4 legs in the morning, 2 at noon, and 3 at night. What am I?",
    type: "choice",
    options: ["A dog 🐕", "A human 🧑", "A spider 🕷️", "A horse 🐴"],
    answer: 1,  // index of correct option
    hint: "This is the famous Sphinx's riddle. Think about stages of life!"
  },
  clock: {
    emoji: "🕐",
    title: "Wall Clock",
    clue: "The clock shows 3:00. \nWhat is 3 × 3?",
    type: "number",
    answer: "9",
    hint: "Multiply the hour shown on the clock by itself!"
  }
};

let solved = new Set();
let startTime = null;

// ── BOOT ──────────────────────────────────────────────────
document.getElementById("start-btn").addEventListener("click", () => {
  document.getElementById("start-screen").classList.add("hidden");
  document.getElementById("game-screen").classList.remove("hidden");
  startTime = Date.now();
  initObjects();
});

function initObjects() {
  ["note", "chest", "clock"].forEach(id => {
    const el = document.getElementById("obj-" + id);
    el.classList.add("unsolved");
    el.addEventListener("click", () => openPuzzle(id));
  });

  document.getElementById("obj-door").addEventListener("click", tryDoor);
  document.getElementById("modal-close").addEventListener("click", closeModal);
  document.getElementById("replay-btn").addEventListener("click", replay);
  updateProgress();
}

// ── PROGRESS ──────────────────────────────────────────────
function updateProgress() {
  const n = solved.size;
  document.getElementById("progress-text").textContent = `${n} / 3 solved`;
  document.getElementById("progress-fill").style.width = (n / 3 * 100) + "%";
}

// ── OPEN PUZZLE ───────────────────────────────────────────
function openPuzzle(id) {
  if (solved.has(id)) {
    showModal(puzzles[id].emoji, puzzles[id].title, "Already solved! ✅", "", null);
    return;
  }
  const p = puzzles[id];
  document.getElementById("modal-emoji").textContent = p.emoji;
  document.getElementById("modal-title").textContent = p.title;
  document.getElementById("modal-clue").textContent  = p.clue;
  document.getElementById("modal-msg").textContent   = "";
  document.getElementById("modal-msg").className     = "modal-msg";

  const body = document.getElementById("modal-body");
  body.innerHTML = "";

  if (p.type === "number") {
    const inp = document.createElement("input");
    inp.type = "text"; inp.className = "answer-input";
    inp.placeholder = "Your answer..."; inp.maxLength = 6;
    inp.addEventListener("keydown", e => { if (e.key === "Enter") check(); });
    body.appendChild(inp);

    const hint = document.createElement("p");
    hint.style.cssText = "font-size:0.75rem;color:#aaa;margin-bottom:0.5rem;cursor:pointer;text-decoration:underline;";
    hint.textContent = "💡 Show hint";
    hint.addEventListener("click", () => {
      hint.textContent = "💡 " + p.hint;
      hint.style.color = "#f25c2e";
      hint.style.textDecoration = "none";
    });
    body.appendChild(hint);

    const btn = document.createElement("button");
    btn.className = "submit-btn"; btn.textContent = "Check Answer ✔";
    btn.addEventListener("click", check);
    body.appendChild(btn);

    function check() {
      const val = inp.value.trim();
      if (val === p.answer) onCorrect(id);
      else onWrong();
    }

  } else if (p.type === "choice") {
    const opts = document.createElement("div");
    opts.className = "options";
    p.options.forEach((opt, i) => {
      const btn = document.createElement("button");
      btn.className = "opt-btn"; btn.textContent = opt;
      btn.addEventListener("click", () => {
        opts.querySelectorAll(".opt-btn").forEach(b => {
          b.classList.remove("correct-opt", "wrong-opt");
          b.disabled = true;
        });
        if (i === p.answer) {
          btn.classList.add("correct-opt");
          setTimeout(() => onCorrect(id), 700);
        } else {
          btn.classList.add("wrong-opt");
          opts.querySelectorAll(".opt-btn")[p.answer].classList.add("correct-opt");
          setTimeout(onWrong, 700);
        }
      });
      opts.appendChild(btn);
    });
    body.appendChild(opts);

    const hint = document.createElement("p");
    hint.style.cssText = "font-size:0.75rem;color:#aaa;margin-top:0.5rem;cursor:pointer;text-decoration:underline;";
    hint.textContent = "💡 Show hint";
    hint.addEventListener("click", () => {
      hint.textContent = "💡 " + p.hint;
      hint.style.color = "#f25c2e";
      hint.style.textDecoration = "none";
    });
    body.appendChild(hint);
  }

  document.getElementById("modal").classList.remove("hidden");
}

function showModal(emoji, title, clueText, bodyHtml, msgText) {
  document.getElementById("modal-emoji").textContent = emoji;
  document.getElementById("modal-title").textContent = title;
  document.getElementById("modal-clue").textContent  = clueText;
  document.getElementById("modal-body").innerHTML    = bodyHtml || "";
  document.getElementById("modal-msg").textContent   = msgText || "";
  document.getElementById("modal").classList.remove("hidden");
}

function closeModal() {
  document.getElementById("modal").classList.add("hidden");
}

// ── FEEDBACK ──────────────────────────────────────────────
function onCorrect(id) {
  const msg = document.getElementById("modal-msg");
  msg.textContent = "✅ Correct! Well done!";
  msg.className = "modal-msg ok";

  solved.add(id);
  const el = document.getElementById("obj-" + id);
  el.classList.remove("unsolved");
  el.classList.add("solved");

  // Cross out clue
  const clueMap = { note: "clue1", chest: "clue2", clock: "clue3" };
  document.getElementById(clueMap[id]).classList.add("solved-clue");

  updateProgress();
  setTimeout(closeModal, 1000);
}

function onWrong() {
  const msg = document.getElementById("modal-msg");
  msg.textContent = "❌ Not quite — try again!";
  msg.className = "modal-msg err";
  setTimeout(() => { msg.textContent = ""; msg.className = "modal-msg"; }, 1500);
}

// ── DOOR ──────────────────────────────────────────────────
function tryDoor() {
  if (solved.size < 3) {
    showModal("🔒", "Exit Door",
      `Door is locked! Solve all 3 puzzles first.\n\nProgress: ${solved.size}/3 solved.`,
      "", null);
  } else {
    closeModal();
    showWin();
  }
}

// ── WIN ───────────────────────────────────────────────────
function showWin() {
  const elapsed = Math.floor((Date.now() - startTime) / 1000);
  const m = Math.floor(elapsed / 60);
  const s = elapsed % 60;
  document.getElementById("win-time").textContent =
    `⏱ Time: ${m > 0 ? m + "m " : ""}${s}s`;
  document.getElementById("win-screen").classList.remove("hidden");
}

function replay() {
  solved.clear();
  document.getElementById("win-screen").classList.add("hidden");
  // Reset objects
  ["note","chest","clock"].forEach(id => {
    const el = document.getElementById("obj-" + id);
    el.classList.remove("solved");
    el.classList.add("unsolved");
  });
  document.getElementById("door-emoji").textContent = "🔒";
  ["clue1","clue2","clue3"].forEach(c =>
    document.getElementById(c).classList.remove("solved-clue")
  );
  startTime = Date.now();
  updateProgress();
}
