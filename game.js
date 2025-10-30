
scene("game", (data) => {
const questionBank = QUIZ_BANKS[data.bankName]

console.log(questionBank)
const speed = 100;
const floorY = 680;
// let nextQuizHeight = 700;
// const quizInterval = 800;
let gamePaused = false;
let quizUI = [];
let playerDiameter = 16;
let score = 0;
let correctCount = 0;
let wrongCount = 0;
let bestHeight =  floorY; // we’ll re-init after player is created
const rng = makeRNG(Date.now()); // or pass a fixed number for repeatable maps
const QUIZ_EVERY = 700;   // pixels climbed between questions
let baseFeetY = null
let nextQuizAt = null;     // first quiz after 200px of climb
let fire = null

setGravity(600);




// player
const player = add([
    rect(playerDiameter, playerDiameter, { radius: 30 }),
    pos(150, floorY - playerDiameter),
    body(),
    area(),
    color("#ffd93d"),
    "player"
]);
// bestHeight = player.pos.y;
baseFeetY = player.pos.y + playerDiameter; // feet at start
nextQuizAt = 1200; // first quiz after 200px climbed
// floor
add([
    rect(width()*4, 200),
    pos(-width(), floorY),
    area(),
    body({ isStatic: true }),
    "groundPlatform"
]);

fire = add([
        rect(playerDiameter, playerDiameter, { radius: 30 }),
        pos(randRange(0,width()), player.pos.y - height()),
        body(),
        area(),
        color("#B22222"),
          area({collisionIgnore: "passthroughPlatform"}),
        "fire"
]);

// figure out how much world height we actually see with scale=2
const halfViewWorld = (height() / 2) / CAM_SCALE;
// clamp for camera center so floor stays at bottom of view
const minCamY = floorY - halfViewWorld;

// >>> THIS WAS THE BUG <<<
// you were calling camPos(..., lowestCamY) but lowestCamY no longer exists
function snapCameraToFloor() {
    camPos(player.pos.x, minCamY);
}
snapCameraToFloor();


const scoreLabel = add([
    text("Score: 0", {
        size: 16,
        align: "left",
        width: 200,
    }),
    pos(12, 12),
    color(255, 255, 255),
    fixed(),      // stays in screen space, not world space
    layer("ui"),
    "scoreLabel",
]);


onKeyPress((key) => {
    if ((key === "space" && player.isGrounded()) ||(key === "up" && player.isGrounded()) ) {
        player.jump(400);
    }
});

onKeyDown((key) => {
    if (key === "left") {
        player.move(-speed, 0);
    } else if (key === "right") {
        player.move(speed, 0);
    }
});

player.onBeforePhysicsResolve(collision => {
    if (collision.target.is("passthroughPlatform") && player.isJumping()) {
        collision.preventResolution();
    }

    if (isKeyDown("down") && collision.target.is("passthroughPlatform")) {
        collision.preventResolution();
    }
});

// platforms
function spawnPlatform(x, y) {
    return add([
        rect(60, 10, { radius: 2 }),
        pos(x, y),
        area(),
        body({ isStatic: true }),
        color("#3ddc97"),
        "platform",
        "passthroughPlatform",

    ]);
}

function makeRNG(seed) {
  return function() {
    // Mulberry32 PRNG
    seed |= 0;
    seed = seed + 0x6D2B79F5 | 0;
    let t = Math.imul(seed ^ seed >>> 15, 1 | seed);
    t ^= t + Math.imul(t ^ t >>> 7, 61 | t);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}

function randRange(min, max) {
  return min + (max - min) * rng();
}
// generate upward ladder
for (let i = 0; i <= 80; i++) {
    spawnPlatform(randRange(0, width()), 580 - i * 50);
    spawnPlatform(randRange(50, width()), 580 - i * 50);
    spawnPlatform(randRange(100, width()), 580 - i * 50);
 spawnPlatform(randRange(150, width()), 580 - i * 50);
 spawnPlatform(randRange(200, width()), 580 - i * 50);


}



// quiz helpers
function getQuestion() {
    return choose(questionBank);
}

function startQuiz() {
    gamePaused = true;
    player.jumpForce = 0;
    if (player.vel) player.vel.y = 0;
    showQuizUI(getQuestion());
}

onUpdate(() => {
    if (gamePaused) return;

    // CAMERA FOLLOW
    // target camera center should match player y unless that would dip below minCamY
    let targetCamY = player.pos.y;
    if (targetCamY > minCamY) {
        targetCamY = minCamY;
    }

    // horizontally, keep camera centered on player (optional but nice)
    let targetCamX = player.pos.x;

    const currentCam = camPos();

    camPos(
        lerp(currentCam.x, targetCamX, 0.1),
        lerp(currentCam.y, targetCamY, 0.1),
    );


        updateBestHeight();
        recalcScore();

    // QUIZ TRIGGER
// feetY = top-left y + height
const feetY = player.pos.y + playerDiameter;
// climb increases as feet go up (feetY gets smaller)
const climbed = Math.max(0, baseFeetY - feetY);

if (!gamePaused && climbed >= nextQuizAt) {
    startQuiz();
    nextQuizAt += QUIZ_EVERY;  // schedule the next one another N px later
}
});

// QUIZ UI
function showQuizUI(qObj) {
    const backdrop = add([
        rect(width(), height()),
        pos(0, 0),
        color(0, 0, 0),
        opacity(0.6),
        fixed(),
        layer("ui"),
    ]);
    quizUI.push(backdrop);

    const panel = add([
        rect(300, 240, { radius: 8 }),
        pos(center().x, center().y),
        anchor("center"),
        color("#ffffff"),
        outline(4, rgb(43, 75, 255)),
        fixed(),
        layer("ui"),
    ]);
    quizUI.push(panel);

    panel.add([
        text(qObj.q, { size: 14, width: 260, align: "center" }),
        color("#000000"),
        pos(0, -50),
        anchor("center"),
    ]);

    qObj.choices.forEach((choiceText, i) => {
        const btn = panel.add([
            rect(260, 28, { radius: 6 }),
            pos(0, -10 + i * 32),
            anchor("center"),
            area(),
            color("#f5f7fa"),
            outline(2, rgb(212, 217, 230)),
            {
                isCorrect: i === qObj.correctIndex,
                feedback: qObj.feedback,
            },
        ]);

        btn.add([
            text(choiceText, { size: 12, align: "center" }),
            anchor("center"),
            color("#000000"),
        ]);

        btn.onClick(() => {
            handleAnswer(btn.isCorrect, btn.feedback);
        });

        onKeyPress(String(i + 1), () => {
            handleAnswer(btn.isCorrect, btn.feedback);
        });

        quizUI.push(btn);
    });
}

function handleAnswer(correct, feedbackText) {
    if (correct) {
        correctCount++;
        correctReward();
    } else {
         wrongCount++;
        wrongPenalty();
    }
 recalcScore();
    showFeedbackAndResume(feedbackText, correct);
}

function correctReward() {
    if (player.jump) {
        player.jump(500);
    }
    shake(4);
    flash("#3ddc97", 0.15);
}

function wrongPenalty() {
    shake(12);
    flash("#cc425e", 0.2);
    player.pos.y += 300;
}

function showFeedbackAndResume(msg, correct) {

const popup = add([
    // 🔹 background box first
    rect(240, 80, { radius: 8 }),
    pos(center()),
    anchor("center"),
    color(0, 0, 0),         // dark background
    opacity(0.85),          // a little transparent if you want
    outline(2, rgb(255,255,255)),  // optional border
    fixed(),
    layer("ui"),
])

    popup.add([
            text(correct ? "Nice!" : msg, {
                    size: 14,
                    align: "center",
                    width: 200,
                }),
                color(correct ? rgb(61, 220, 151) : rgb(204, 66, 94)),
                pos(0, 0),
                anchor("center"),

    ])

    wait(1, () => {
        popup.destroy();
        destroyQuizUI();
        resumeGame();
    });
}

function destroyQuizUI() {
    for (const obj of quizUI) {
        if (obj && obj.exists()) {
            obj.destroy();
        }
    }
    quizUI = [];
}

function resumeGame() {
    gamePaused = false;
}



function updateBestHeight() {
    // lower y means we've climbed higher
    if (player.pos.y < bestHeight) {
        bestHeight = player.pos.y;
    }
}

function recalcScore() {
    const climbComponent = (floorY - bestHeight); // how high you've climbed
    const quizComponent = (correctCount * 100) + (wrongCount * -50);
    score = Math.floor(climbComponent + quizComponent);
    scoreLabel.text = `Score: ${score}`;
}


fire.onBeforePhysicsResolve(collision => {
    if (collision.target.is("passthroughPlatform")) {
        collision.preventResolution();
    }


});

function spawnFire(){

     add([
        rect(playerDiameter, playerDiameter, { radius: 30 }),
        pos(randRange(Math.floor(player.pos.x)-300,Math.floor(player.pos.x)+300), player.pos.y - height()),
        body(),
        area({collisionIgnore: ["passthroughPlatform"]}),
        color("#B22222"),
offscreen(),
        "fire"
]);

}

onCollide("player", "fire", (p, f) => {
  addKaboom(p.pos);
  if (f && f.exists()) f.destroy();
  if (p && p.exists()) p.destroy();
wait(3, () => {
    fireLoop.cancel();
      destroyAll("fire");
    go("menu");

})
});



// player.onCollide("fire", (fire)=>{
//     addKaboom(player.pos.x,player.pos.y);
//     destroy(fire)
// })

// onCollide("fire", "player", (f) => {
//     addKaboom(player.pos.x,player.pos.y);
//     destroy(f)
// })

// setInterval(() => {
//     spawnFire();
// }, 2000);

const fireLoop = loop(1, () => {
  spawnFire();
});


}) // end of game scene


go("menu");