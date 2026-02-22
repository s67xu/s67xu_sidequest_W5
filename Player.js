class Player {
  constructor(x, y, speed) {
    this.x = x;
    this.y = y;
    this.s = speed ?? 2;
    this.pulse = 0;
    this.prevX = x;
    this.prevY = y;
  }

  updateInput() {
    this.prevX = this.x;
    this.prevY = this.y;
    
    const dx =
      (keyIsDown(RIGHT_ARROW) || keyIsDown(68)) -
      (keyIsDown(LEFT_ARROW) || keyIsDown(65));

    const dy =
      (keyIsDown(DOWN_ARROW) || keyIsDown(83)) -
      (keyIsDown(UP_ARROW) || keyIsDown(87));

    const len = max(1, abs(dx) + abs(dy));
    this.x += (dx / len) * this.s;
    this.y += (dy / len) * this.s;

    this.pulse += 0.03;
  }

  draw() {
    noStroke();

    let pulseSize = 1 + sin(this.pulse) * 0.05;

    // Outer glow
    for (let i = 5; i > 0; i--) {
      fill(80, 140, 255, 50);
      ellipse(this.x, this.y, 120 * pulseSize - i * 15);
    }

    // Core
    fill(60, 120, 255);
    ellipse(this.x, this.y, 18);
  }
}