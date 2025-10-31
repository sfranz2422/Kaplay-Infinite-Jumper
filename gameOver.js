

const ENDPOINT = "https://script.google.com/macros/s/AKfycbw6RO9s0cnSrK9LWlEEeAu-QZfOwxBBs1DpH-nrWb864V3qmuMj042rRgdCETTXcm_L/exec"; // your web app URL
const TOKEN = "giovanna7524"; // must match SHARED_TOKEN in Apps Script

async function submitScore(name, score, level = "") {
  const res = await fetch(ENDPOINT, {
    method: "POST",
    // ❌ remove application/json to avoid preflight
    // headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      token: TOKEN,
      name,
      score,
      level,
      meta: navigator.userAgent.slice(0, 60),
    }),
  });

  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
  if (!data.ok) throw new Error(data.error || "Submit failed");
  return data;
}
// --- keep your ENDPOINT, TOKEN, submitScore() above ---

scene("gameover", (finalScore = 0, level = "") => {
  const W = width();
  const H = height();
  const PADDING = 16;

  let playerName = "";
  let typingEnabled = true;
  let messageNode = null;

  function toast(msg, colorName = rgb(255, 230, 120)) {
    if (messageNode) destroy(messageNode);
    messageNode = add([
      text(msg, { size: 18, width: W - 2 * PADDING }),
      pos(W / 2, H - 48),
      anchor("center"),
      color(colorName),
      z(10),
      opacity(1),
      lifespan(2, { fade: 1 }),
    ]);
  }

  // BG
  add([rect(W, H), color(20, 24, 32)]);

  add([
    text("GAME OVER", { size: 42 }),
    pos(W / 2, 80),
    anchor("center"),
    color(255, 240, 200),
  ]);

  // Score panel
  add([
    rect(W - 2 * PADDING, 80, { radius: 8 }),
    pos(PADDING, 130),
    color(32, 40, 56),
    outline(2, rgb(61, 220, 151)),
  ]);

  add([
    text(`Your Score: ${finalScore}`, { size: 28 }),
    pos(PADDING + 20, 145),
    color(230, 240, 255),
  ]);

  if (level) {
    add([
      text(`Level: ${level}`, { size: 18 }),
      pos(PADDING + 20, 180),
      color(200, 210, 230),
    ]);
  }

  // Name input
  add([
    text("Enter Name:", { size: 20 }),
    pos(PADDING + 16, 240),
    color(210, 220, 240),
  ]);

  const inputBox = add([
    rect(W - 2 * PADDING - 32, 44, { radius: 8 }),
    pos(PADDING + 16, 270),
    color(40, 48, 66),
    outline(2, rgb(61, 220, 151)),
    area(),
  ]);

  const caret = add([
    rect(2, 22),
    pos(inputBox.pos.x + 12, inputBox.pos.y + 11),
    color(220, 230, 255),
  ]);

  const nameTextNode = add([
    text("", { size: 22 }),
    pos(inputBox.pos.x + 12, inputBox.pos.y + 10),
    color(240, 245, 255),
  ]);

  // ---- Button factory (needed) ----
  function button(label, x, y, onPress) {
    const b = add([
      rect(180, 44, { radius: 8 }),
      pos(x, y),
      color(58, 72, 96),
      outline(2, rgb(61, 220, 151)),
      area(),
      { _hover: false, _disabled: false, _press: onPress },
    ]);

    add([
      text(label, { size: 20 }),
      pos(x + 90, y + 22),
      anchor("center"),
      color(240, 245, 255),
    ]);

    b.onHover(() => {
      if (b._disabled) return;
      if (!b._hover) {
        b.color = rgb(70, 86, 114);
        b._hover = true;
      }
    });
    b.onHoverEnd(() => {
      if (b._disabled) return;
      b.color = rgb(58, 72, 96);
      b._hover = false;
    });
    b.onClick(() => {
      if (!b._disabled && typeof b._press === "function") b._press();
    });

    return { box: b };
  }

  // ---- Buttons (spaced apart) ----
  const submitBtn = button("Submit Score", PADDING + 16, 340, async () => {
    try {
      if (!playerName.trim()) {
        toast("Please enter a name.");
        return;
      }
      submitBtn.box._disabled = true;
      toast("Submitting...");
      await submitScore(playerName.trim(), finalScore, level);
      toast("Score submitted!");
    } catch (e) {
      console.error("Submit error:", e);
      toast(String(e.message || e), rgb(255, 160, 160));
    } finally {
      submitBtn.box._disabled = false;
    }
  });

  const leaderboardBtn = button("View Leaderboard", PADDING + 216, 340, () => {
    go("leaderboard"); // separate scene
  });

  const menuBtn = button("Main Menu", PADDING + 416, 340, () => {
    go("menu");
  });

  // ---- Typing behavior (keep these!) ----
  inputBox.onClick(() => {
    typingEnabled = true;
    toast("Typing enabled. Press Enter to submit.", rgb(190, 230, 180));
  });

  let caretOn = true;
  loop(0.5, () => {
    caretOn = !caretOn;
    caret.hidden = !caretOn;
  });

  function redrawName() {
    nameTextNode.text = playerName;
    caret.pos = vec2(inputBox.pos.x + 12 + nameTextNode.width, inputBox.pos.y + 11);
  }

  onCharInput((ch) => {
    if (!typingEnabled) return;
    if (playerName.length >= 24) return;
    if (/[^\w\s\-.'!]/.test(ch)) return;
    playerName += ch;
    redrawName();
  });

  onKeyPressRepeat("backspace", () => {
    if (!typingEnabled || playerName.length === 0) return;
    playerName = playerName.slice(0, -1);
    redrawName();
  });

  onKeyPress("enter", async () => {
    if (!typingEnabled) return;
    try {
      if (!playerName.trim()) {
        toast("Please enter a name.");
        return;
      }
      typingEnabled = false;
      submitBtn.box._disabled = true;
      toast("Submitting...");
      await submitScore(playerName.trim(), finalScore, level);
      toast("Score submitted!");
    } catch (e) {
      toast(String(e.message || e), rgb(255, 160, 160));
    } finally {
      submitBtn.box._disabled = false;
      typingEnabled = true;
    }
  });

  onKeyPress("escape", () => {
    playerName = "";
    redrawName();
  });
  onKeyPress("tab", () => {
    typingEnabled = !typingEnabled;
    toast(typingEnabled ? "Typing enabled." : "Typing paused.");
  });
});