
// Keyboard Tracking
const keys = {};

const STATES = {
  BOOT: "boot",
  MENU: "menu",
  GAME: "game",
  GAME_OVER: "gameOver"
}

const cartidge = {
  init() {},
  update() {},
  render() {},
  destroy() {}
}

const canvas = document.getElementById("gameScreen");
const ctx = canvas.getContext("2d");

// Internal retro resolution
canvas.width = 320;
canvas.height = 180;

// Game loop control
let lastTime = 0;

let currentStates = STATES.BOOT

// Konami Code Sequence
const konami = ['w','w','s','s','a','d','a','d','k','l','enter'];
let konamiIndex = 0;

// Display Boot Logic
const display = document.querySelector('.display');
const bootText = document.querySelector('.boot-text');

const bootLines = [
  "SNES UI LAB BIOS v1.0",
  "RodriguezTech Studios",
  "",
  "Copyright 1991 Nintendo",
  "Initializing Controllers...",
  "Loading Assets...",
  "Ready"
];

let lineIndex = 0;

const player = {
  x: 160,
  y: 90,
  size: 8,
  speed: 0,
  maxSpeed: 120,
  accel: 600,
  friction: 800,
  vx: 0,
  vy: 0
};


function typeLine() {
  if (lineIndex < bootLines.length) {
    const line = document.createElement("div");
    line.textContent = bootLines[lineIndex];
    bootText.appendChild(line);
    lineIndex++;
    setTimeout(typeLine, 600);
  } else {
    setTimeout(() => {
      bootText.innerHTML = "PRESS START";
    }, 1000);
  }
}

window.addEventListener("load", () => {
  setTimeout(typeLine, 600);
});

function gameLoop(timestamp) {
  const deltaTime = (timestamp - lastTime) / 1000
  lastTime = timestamp;

  update(deltaTime);
  render();

  requestAnimationFrame(gameLoop)
}

function update(dt) {
  // Horizsontal movement
  if (keys["ArrowLeft"]) player.vx -= player.accel * dt
  if(keys["ArrowRight"]) player.vx += player.accel * dt;

  // Vertical movement
  if (keys["ArrowUp"]) player.vy -= player.accel * dt;
  if (keys["ArrowDown"]) player.vy += player.accel * dt;

  // Apply friction
  applyFriction(player, dt)

  // Clamp max speed
  player.vx = clamp(player.vx, -player.maxSpeed, player.maxSpeed);
  player.vy = clamp(player.vy, -player.maxSpeed, player.maxSpeed);

  // Move
  player.x += player.vx * dt;
  player.y += player.vy * dt;

  // Screen bounds
  player.x = clamp(player.x, 0, canvas.width - player.size);
  player.y = clamp(player.y, 0, canvas.height - player.size);
  }

// Utility Functions

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function applyFriction(obj, dt) {
  if (!keys["ArrowLeft"] && !keys["ArrowRight"]) {
    if (obj.vx > 0) obj.vx -= obj.friction * dt;
    if (obj.vx < 0) obj.vx += obj.friction * dt;
    if (Math.abs(obj.vx) < 5) obj.vx = 0;

  }

  if (!keys["ArrowUp"] && !keys["ArrowDown"]) {
    if (obj.vy > 0) obj.vy -= obj.friction * dt;
    if (obj.vy < 0) obj.vy += obj.friction * dt;
    if (Math.abs(obj.vy) < 5) obj.vy = 0;
  }
}

// Render
function render() {
  ctx.fillStyle = "#0c0c0c";
  ctx.fillRect(0,0, canvas.width, canvas.height);

  ctx.fillStyle = "#00ff88";
  ctx.fillRect(player.x, player.y, player.size, player.size)
}

requestAnimationFrame(gameLoop);


// Keybaord events

window.addEventListener("keydown", (e) => {
  keys[e.key] = true;
});

window.addEventListener("keyup", (e) => {
  keys[e.key] = false;
});

document.addEventListener('keydown', e => {
  const key = e.key.toLowerCase();
  if(keys[key]) return;

  keys[key] = true;

  handleKonami(key);

  const btn = document.querySelector(`[data-key="${key}"]`);
  if (btn) press(btn);
});

document.addEventListener('keyup', e => {
  const key = e.key.toLowerCase();
  keys[key] = false;

  const btn = document.querySelector(`[data-key="${key}"]`);
  if (btn) release(btn);
});

// Mouse Events
document.addEventListener("mousemove", (e) => {
  const controller = document.querySelector(".controller");
  const x = (window.innerWidth /2 - e.clientX) / 80;
  const y = (window.innerHeight /2 - e.clientY) / 80;

  controller.style.transform = `rotateX(${y}deg) rotateY(${x}deg)`;
});

// Konami Code
function handleKonami(key) {
  if(key === konami[konamiIndex]) {
    konamiIndex++;
    if (konamiIndex === konami.length) {
      activateKonami();
      konamiIndex = 0;
    }
  } else {
    konamiIndex = 0;
  }
}

function activateKonami() {
  const controller = document.querySelector('.controller');
  controller.classList.add('konami');

  if(display) display.textContent = 'KONAMI MODE';

  setTimeout(() => {
    controller.classList.remove('konami');
    if (display) display.textContent = 'READY';
  }, 3000);
}

// Button Animation

function press(btn) {
  btn.classList.add('active');

  if (display) {
    display.textContent = `INPUT: ${btn.dataset.key.toUpperCase()}`;
  }
}

function release(btn) {
  btn.classList.remove('active');
  if (display) display.textContent = 'READY';
}

// Gamepad Suppourt

let gamepadIndex = null;

window.addEventListener("gamepadconnected", e => {
  gamepadIndex = e.gamepad.index;
  console.log("Gamepad connected: ", e.gamepad.id);
  pollGamepad();
});

function pollGamepad() {
  if (gamepadIndex === null) return;

  const gp = navigator.getGamepads()[gamepadIndex];
  if (!gp) return;

  // D-pad
  toggle('w', gp.buttons[12].pressed)
  toggle('s', gp.buttons[13].pressed);
  toggle('a', gp.buttons[14].pressed);
  toggle('d', gp.buttons[15].pressed);

  // Action Buttons
  toggle('k', gp.buttons[0].pressed); // B
  toggle('l', gp.buttons[1].pressed); // A
  toggle('j', gp.buttons[2].pressed);
  toggle('i', gp.buttons[3].pressed);

  // Start / Select
  toggle('enter', gp.buttons[9].pressed);
  toggle('shift', gp.buttons[8].pressed);

  requestAnimationFrame(pollGamepad);
}

// Toggle Handler

function toggle(key, pressed) {
  const el = document.querySelector(`[data-key="${key}"]`);
  if (!el) return;

  el.classList.toggle('active', pressed);

  if (pressed && display) {
    display.textContent = `INPUT: ${key.toUpperCase()}`;
  }
}