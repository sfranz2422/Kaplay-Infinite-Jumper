scene("menu", () => {
    add([
        text("Endless Climb Quiz", {
            size: 24,
            align: "center",
            width: 300,
        }),
        color(255, 255, 255),
        pos(center().x, center().y - 140),
        anchor("center"),
        fixed(),
        layer("ui"),
    ]);

    add([
        text("Choose your quiz set:", {
            size: 12,
            align: "center",
            width: 260,
        }),
        color(200, 200, 200),
        pos(center().x, center().y - 100),
        anchor("center"),
        fixed(),
        layer("ui"),
    ]);

    function makeQuizButton(label, yOffset, bankName) {
        const btn = add([
            rect(220, 50, { radius: 8 }),
            pos(center().x, center().y + yOffset),
            anchor("center"),
            color(0, 0, 0),
            opacity(0.8),
            outline(2, rgb(61, 220, 151)),
            area(),
            fixed(),
            layer("ui"),
        ]);

        btn.add([
            text(label, {
                size: 16,
                align: "center",
                width: 200,
            }),
            color(61, 220, 151),
            anchor("center"),
            pos(0, 0),
        ]);

        btn.onClick(() => {
            go("game", { bankName });
        });

        // keyboard shortcut idea: 1/2/3 selects
        onKeyPress("1", () => { go("game", { bankName: "htmlBasics" }); });
        onKeyPress("2", () => { go("game", { bankName: "httpWeb" }); });
        onKeyPress("3", () => { go("game", { bankName: "jsIntro" }); });
    }

    makeQuizButton("HTML Basics (1)",   -20,  "htmlBasics");
    makeQuizButton("HTTP / Web (2)",     40,  "httpWeb");
    makeQuizButton("JavaScript (3)",    100,  "jsIntro");
});