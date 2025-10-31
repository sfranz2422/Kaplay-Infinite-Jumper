scene("leaderboard", () => {
  const W = width();
  const H = height();
  const PADDING = 16;

  add([rect(W, H), color(20, 24, 32)]);

  add([
    text("TOP SCORES", { size: 42 }),
    pos(W / 2, 60),
    anchor("center"),
    color(255, 240, 200),
  ]);

  // Back button
  const backBtn = add([
    rect(160, 44, { radius: 8 }),
    pos(PADDING + 16, 90),
    color(58, 72, 96),
    outline(2, rgb(61, 220, 151)),
    area(),
  ]);
  add([text("Back", { size: 20 }), pos(PADDING + 96, 112), anchor("center"), color(240, 245, 255)]);
  backBtn.onClick(() => go("menu")); // or go("gameover")

  // Columns
  const startX = PADDING + 24;
  const colXs = { rank: startX, name: startX + 44, score: startX + 320, level: startX + 470 };
  const rowStartY = 180;
  const rowGap = 32;

  add([text("#", { size: 20 }), pos(colXs.rank, rowStartY - 30), color(180, 190, 210)]);
  add([text("Name", { size: 20 }), pos(colXs.name, rowStartY - 30), color(180, 190, 210)]);
  add([text("Score", { size: 20 }), pos(colXs.score, rowStartY - 30), color(180, 190, 210)]);
  add([text("Level", { size: 20 }), pos(colXs.level, rowStartY - 30), color(180, 190, 210)]);

  // --- Scrollable rows ---
  let scrollY = 0;
  const nodes = []; // store created row nodes (each with _baseY)
  function pushNode(n, baseY) { n._baseY = baseY; nodes.push(n); }
  function clearRows() { nodes.forEach(n => destroy(n)); nodes.length = 0; }

  // Loading / status text
  let statusNode = add([
    text("Loading…", { size: 18 }),
    pos(startX, rowStartY),
    color(200, 210, 230),
  ]);

  (async () => {
    try {
      // Inline fetch so we don't depend on getLeaderboard() being in scope
      const url = new URL(ENDPOINT);
      url.searchParams.set("action", "top");
      url.searchParams.set("limit", "50");

      const res = await fetch(url.toString());
      console.log("[LB] HTTP status:", res.status, res.statusText);
      if (!res.ok) {
        const txt = await res.text().catch(() => "");
        throw new Error(`Top HTTP ${res.status} ${res.statusText} ${txt.slice(0,120)}`);
      }

      const json = await res.json();
      console.log("[LB] Raw JSON:", json);

      const rows = Array.isArray(json.data) ? json.data : [];
      console.log("[LB] Parsed rows:", rows);

      destroy(statusNode);
      clearRows();

      if (!rows.length) {
        pushNode(
          add([text("No scores yet.", { size: 20 }), pos(startX, rowStartY), color(200, 210, 230)]),
          rowStartY
        );
        return;
      }

      rows.forEach((r, i) => {
        const y = rowStartY + i * rowGap;
        pushNode(add([text(String(i + 1), { size: 20 }), pos(colXs.rank, y), color(230, 235, 245)]), y);
        pushNode(add([text(String(r.name ?? ""), { size: 20 }), pos(colXs.name, y), color(230, 235, 245)]), y);
        pushNode(add([text(String(r.score ?? ""), { size: 20 }), pos(colXs.score, y), color(230, 235, 245)]), y);
        pushNode(add([text(String(r.level ?? ""), { size: 20 }), pos(colXs.level, y), color(200, 210, 230)]), y);
      });
    } catch (e) {
      console.error("[LB] Load error:", e);
      destroy(statusNode);
      clearRows();
      pushNode(
        add([text("Failed to load leaderboard.", { size: 20 }), pos(startX, rowStartY), color(255, 170, 170)]),
        rowStartY
      );
      // Show error details line 2 (small)
      pushNode(
        add([text(String(e.message || e).slice(0, 80), { size: 14 }), pos(startX, rowStartY + 24), color(210, 120, 120)]),
        rowStartY + 24
      );
    }
  })();

  // Scroll controls
  onScroll((delta) => { scrollY -= delta.y * 0.5; });
  onKeyDown("down", () => (scrollY -= 10));
  onKeyDown("up", () => (scrollY += 10));

  onUpdate(() => {
    nodes.forEach(n => { n.pos.y = n._baseY + scrollY; });
  });

  add([
    text("Use mouse wheel or ↑↓ to scroll", { size: 16 }),
    pos(W / 2, H - 24),
    anchor("center"),
    color(120, 140, 160),
  ]);
});