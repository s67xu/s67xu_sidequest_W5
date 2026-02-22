/*
Week 5 — Example 4: Data-driven world with JSON + Smooth Camera

Course: GBDA302 | Instructors: Dr. Karen Cochrane & David Han
Date: Feb. 12, 2026

Move: WASD/Arrows

Learning goals:
- Extend the JSON-driven world to include camera parameters
- Implement smooth camera follow using interpolation (lerp)
- Separate camera behavior from player/world logic
- Tune motion and feel using external data instead of hard-coded values
- Maintain player visibility with soft camera clamping
- Explore how small math changes affect “game feel”
*/

const VIEW_W = 800;
const VIEW_H = 480;

let worldData;
let level;
let player;

let camX = 0;
let camY = 0;

let zoomLevel = 1;
let minZoom = 0.6;
let maxZoom = 1.8;

function preload() {
  worldData = loadJSON("world.json"); // load JSON before setup [web:122]
}

function setup() {
  createCanvas(VIEW_W, VIEW_H);
  textFont("sans-serif");
  textSize(14);

  level = new WorldLevel(worldData);

  const start = worldData.playerStart ?? { x: 300, y: 300, speed: 3 };
  player = new Player(start.x, start.y, start.speed);

  camX = player.x - width / 2;
  camY = player.y - height / 2;
}

function draw() {
  player.updateInput();
  level.constrainPlayer(player);

  // Keep player inside world
  player.x = constrain(player.x, 0, level.w);
  player.y = constrain(player.y, 0, level.h);

  // Target camera (center on player)
  let targetX = player.x - width / 2;
  let targetY = player.y - height / 2;

  // Clamp target camera safely
  const maxCamX = max(0, level.w - width);
  const maxCamY = max(0, level.h - height);
  targetX = constrain(targetX, 0, maxCamX);
  targetY = constrain(targetY, 0, maxCamY);

  // Smooth follow using the JSON knob
  const camLerp = level.camLerp; // ← data-driven now
  camX = lerp(camX, targetX, camLerp);
  camY = lerp(camY, targetY, camLerp);

  level.drawBackground();

push();

// Move origin to center of screen
translate(width / 2, height / 2);

// Apply zoom scaling
scale(zoomLevel);

// Move world relative to camera
translate(-camX - width / 2, -camY - height / 2);

// Draw world + player
level.drawWorld(player);
player.draw();

pop();

level.drawHUD(player, camX, camY);
drawZoomUI();
}

function keyPressed() {
  if (key === "r" || key === "R") {
    const start = worldData.playerStart ?? { x: 300, y: 300, speed: 3 };
    player = new Player(start.x, start.y, start.speed);
  }
}

function drawZoomUI() {
  let size = 40;
  let padding = 20;

  let x = width - size - padding;
  let yPlus = height - size * 2 - padding - 10;
  let yMinus = height - size - padding;

  noStroke();
  fill(255);
  rect(x, yPlus, size, size, 8);
  rect(x, yMinus, size, size, 8);

  fill(0);
  textAlign(CENTER, CENTER);
  textSize(22);

  text("+", x + size / 2, yPlus + size / 2 + 1);
  text("–", x + size / 2, yMinus + size / 2 + 1);
}

function mousePressed() {
  let size = 40;
  let padding = 20;

  let x = width - size - padding;
  let yPlus = height - size * 2 - padding - 10;
  let yMinus = height - size - padding;

  if (mouseX > x && mouseX < x + size) {
    if (mouseY > yPlus && mouseY < yPlus + size) {
      zoomLevel += 0.1;
      zoomLevel = constrain(zoomLevel, minZoom, maxZoom);
    }

    if (mouseY > yMinus && mouseY < yMinus + size) {
      zoomLevel -= 0.1;
      zoomLevel = constrain(zoomLevel, minZoom, maxZoom);
    }
  }
}