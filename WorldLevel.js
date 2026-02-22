class WorldLevel {
  constructor(json) {
    this.w = json.world?.w ?? 2400;
    this.h = json.world?.h ?? 1600;
    this.bg = json.world?.bg ?? [10, 15, 25];
    this.camLerp = json.camera?.lerp ?? 0.06;

    this.rooms = this.createRooms();

    this.currentRoom = null;
    this.roomTextAlpha = 0;
    this.roomTextTimer = 0;
  }

  createRooms() {
    return [
      // BEDROOM (CENTER)
      {
        name: "Bedroom",
        x: 1200,
        y: 800,
        w: 500,
        h: 340,
        color: [255, 226, 146],
        isCore: true,
        door: { x: 0, y: 170, w: 90, h: 20 },
        furniture: [
          { type: "bed", x: -140, y: 60, w: 180, h: 70 },
          { type: "wardrobe", x: 170, y: -40, w: 70, h: 160 },
          { type: "toy", x: -60, y: 80, r: 15, push: true },
          { type: "toy", x: -30, y: 90, r: 12, push: true },
        ],
      },

      // LIVING ROOM
      {
        name: "Living Room",
        x: 600,
        y: 800,
        w: 450,
        h: 300,
        color: [245, 220, 195],
        isCore: false,
        door: { x: 220, y: 0, w: 20, h: 80 },
        furniture: [
          { type: "couch", x: -50, y: 40, w: 200, h: 60 },
          { type: "table", x: 100, y: 40, w: 100, h: 40 },
        ],
      },

      // CLASSROOM
      {
        name: "Classroom",
        x: 1200,
        y: 250,
        w: 500,
        h: 320,
        color: [240, 230, 200],
        isCore: false,
        door: { x: 0, y: 160, w: 90, h: 20 },
        furniture: [
          { type: "desk", x: -120, y: 30, w: 80, h: 40 },
          { type: "desk", x: 0, y: 30, w: 80, h: 40 },
          { type: "desk", x: 120, y: 30, w: 80, h: 40 },
          { type: "board", x: 0, y: -120, w: 300, h: 50 },
        ],
      },

      // BATHROOM
      {
        name: "Bathroom",
        x: 1800,
        y: 800,
        w: 420,
        h: 280,
        color: [220, 235, 245],
        isCore: false,
        door: { x: -210, y: 0, w: 20, h: 80 },
        furniture: [
          { type: "bathtub", x: -80, y: 40, w: 160, h: 60 },
          { type: "toilet", x: 100, y: 50, w: 40, h: 60 },
          { type: "sink", x: 80, y: -50, w: 60, h: 40 },
        ],
      },

      // TOY STORE
      {
        name: "Toy Store",
        x: 600,
        y: 1300,
        w: 480,
        h: 320,
        color: [255, 220, 230],
        isCore: false,
        door: { x: 0, y: -160, w: 90, h: 20 },
        furniture: [
          { type: "aisle", x: -120, y: 0, w: 60, h: 200 },
          { type: "aisle", x: 0, y: 0, w: 60, h: 200 },
          { type: "aisle", x: 120, y: 0, w: 60, h: 200 },
          { type: "counter", x: 0, y: 120, w: 200, h: 50 },
        ],
      },

      // ICE CREAM SHOP
      {
        name: "Ice Cream Shop",
        x: 1800,
        y: 1300,
        w: 480,
        h: 320,
        color: [255, 235, 210],
        isCore: false,
        door: { x: 0, y: -160, w: 90, h: 20 },
        furniture: [
          { type: "counter", x: 0, y: -40, w: 260, h: 60 },
          { type: "circle", x: -100, y: 80, r: 20, push: true },
          { type: "circle", x: 100, y: 80, r: 20, push: true },
        ],
      },
    ];
  }

  drawBackground() {
    background(this.bg[0], this.bg[1], this.bg[2]);
  }

  drawWorld(player) {
    // Draw background ONCE
    background(this.bg[0], this.bg[1], this.bg[2]);

    // Draw all rooms
    for (let room of this.rooms) {
      this.drawRoom(room, player);
    }

    // Draw room title text
    this.handleRoomText(player);
  }

  drawRoom(room, player) {
    const d = dist(player.x, player.y, room.x, room.y);

    let fade = map(d, 0, 900, 1, 0.8);
    fade = constrain(fade, 0.25, 1);
    if (room.isCore) fade = max(fade, 0.75);

    // Warm neutral from your uploaded palette
    const neutral = [230, 215, 195];

    const r = lerp(neutral[0], room.color[0], fade);
    const g = lerp(neutral[1], room.color[1], fade);
    const b = lerp(neutral[2], room.color[2], fade);

    rectMode(CENTER);

    stroke(255);
    strokeWeight(10);
    fill(r, g, b);
    rect(room.x, room.y, room.w, room.h, 20);

    // door
    noStroke();
    fill(this.bg);
    rect(room.x + room.door.x, room.y + room.door.y, room.door.w, room.door.h);

    for (let item of room.furniture) {
      this.drawFurniture(room, item, player, fade);
    }
  }

  drawFurniture(room, item, player, fade) {
    let fx = room.x + item.x;
    let fy = room.y + item.y;

    let d = dist(player.x, player.y, fx, fy);

    if (item.push && d < 120) {
      let angle = atan2(fy - player.y, fx - player.x);
      let push = map(d, 0, 120, 15, 0);
      fx += cos(angle) * push;
      fy += sin(angle) * push;
    }

    fill(255, 240 * fade);

    switch (item.type) {
      case "bed":
      case "couch":
      case "table":
      case "desk":
      case "counter":
      case "aisle":
      case "bathtub":
      case "wardrobe":
        rect(fx, fy, item.w, item.h, 8);
        break;

      case "toilet":
        rect(fx, fy, item.w, item.h, 8);
        ellipse(fx, fy - 25, 40);
        break;

      case "sink":
        rect(fx, fy, item.w, item.h, 5);
        break;

      case "board":
        rect(fx, fy, item.w, item.h, 4);
        break;

      case "toy":
      case "circle":
        ellipse(fx, fy, item.r);
        break;
    }
  }

  handleRoomText(player) {
    for (let room of this.rooms) {
      if (
        player.x > room.x - room.w / 2 &&
        player.x < room.x + room.w / 2 &&
        player.y > room.y - room.h / 2 &&
        player.y < room.y + room.h / 2
      ) {
        if (this.currentRoom !== room.name) {
          this.currentRoom = room.name;
          this.roomTextAlpha = 255;
          this.roomTextTimer = 120;
        }
      }
    }

    if (this.roomTextTimer > 0) {
      this.roomTextTimer--;
    } else {
      this.roomTextAlpha -= 3;
    }

    if (this.roomTextAlpha > 0 && this.currentRoom) {
      push();
      fill(255, this.roomTextAlpha);
      textAlign(CENTER, CENTER);
      textSize(36);
      text(this.currentRoom, player.x, player.y - 120);
      pop();
    }
  }

  drawHUD() {}

  constrainPlayer(player) {
  for (let room of this.rooms) {

    let left = room.x - room.w / 2;
    let right = room.x + room.w / 2;
    let top = room.y - room.h / 2;
    let bottom = room.y + room.h / 2;

    let wasInside =
      player.prevX > left &&
      player.prevX < right &&
      player.prevY > top &&
      player.prevY < bottom;

    let isInside =
      player.x > left &&
      player.x < right &&
      player.y > top &&
      player.y < bottom;

    let doorLeft = room.x + room.door.x - room.door.w / 2;
    let doorRight = room.x + room.door.x + room.door.w / 2;
    let doorTop = room.y + room.door.y - room.door.h / 2;
    let doorBottom = room.y + room.door.y + room.door.h / 2;

    let inDoor =
      player.x > doorLeft &&
      player.x < doorRight &&
      player.y > doorTop &&
      player.y < doorBottom;

    // 🔹 If crossing boundary
    if (wasInside !== isInside) {
      if (!inDoor) {
        player.x = player.prevX;
        player.y = player.prevY;
      }
    }
  }
}
}

