/* snesUILab/script.js */

import { ctx, canvas, startLoop } from "./modules/engine.js";
import { initInput, keys } from "./modules/input.js";
import { getGameList, loadGame, updateGame, renderGame } from "./modules/cartridgeManager.js";
import { clamp, applyFriction } from "./modules/enteties/player.js";
import { createPlayer } from "./modules/enteties/player.js";

const STATES = {
  BOOT: "boot",
  MENU: "menu",
  LOADING: "loading",
  GAME: "game",
  GAME_OVER: "gameOver"
}

let games = getGameList()


let selectedGame = 0;

const player = createPlayer();


let currentState = STATES.BOOT

// Konami Code Sequence
const konami = ['w','w','s','s','a','d','a','d','k','l','enter'];
let konamiIndex = 0;

// Display Boot Logic
const display = document.querySelector('.display');
const bootText = document.querySelector('.boot-text');

const bootLines = [
  "████████████████████████",
  " SNES DEV BIOS v1.2",
  " RodriguezTech Studios",
  "████████████████████████",
  "",
  "Memory Check........OK",
  "Video Interface.....OK",
  "Controller Port 1...OK",
  "Controller Port 2...OK",
  "",
  "Loading Console OS...",
  ""
];

let lineIndex = 0;


// Menu Screen
function startMenu() {
  currentState = STATES.MENU;
  bootText.innerHTML = "";
  renderMenu();
}

function typeLine() {
  if (lineIndex < bootLines.length) {

    const line = document.createElement("div");
    line.textContent = bootLines[lineIndex];

    bootText.appendChild(line);

    lineIndex++;

    //Random delay for "retro" nostalgia
    const delay = 200 + Math.random() * 200;

    setTimeout(typeLine, delay);

  } else {

    setTimeout(() => {

      const startPrompt = document.createElement("div");
      startPrompt.textContent = "> PRESS START";

      startPrompt.classList.add("blink");

      bootText.appendChild(startPrompt);
    }, 2000);
  }
}

window.addEventListener("load", () => {
  setTimeout(typeLine, 600);
});

// Render Game List
function renderMenu() {
  bootText.innerHTML = "<div>SELECT GAME</div><br>"

  games.forEach((game, index) => {
    const line = document.createElement("div");

    if (index === selectedGame) {
      line.textContent = `> ${game}`;
      line.style.color = "#00ff88";
    } else {
      line.textContent = ` ${game}`
    }

    bootText.appendChild(line);
    });
}

// Select Buttons Cycle Games
function cycleGame() {
  selectedGame++;

  if(selectedGame >= games.length) {
    selectedGame = 0;
  }
  renderMenu();
}

// Start Button Launches Game
function launchGame() {
  currentState = STATES.LOADING;
  bootText.innerHTML = `INSERTING CARTRIDGE...`;
  setTimeout(startLoader, 800);
}

// Exit Game
function exitGame() {
  currentState = STATES.MENU;
  renderMenu();
}

// Loader Animation
function startLoader() {

  let progress = 0;

  const loader = setInterval(() => {
    progress += 10;

    const barLength = 14;
    const filled = Math.floor((progress / 100) * barLength);

    const bar =
          "[" +
          "█".repeat(filled) +
          "░".repeat(barLength - filled) +
          "]";
    bootText.innerHTML =
      `LOADING ${games[selectedGame]}<br><br>${bar}`;

      if (progress >= 100) {
        clearInterval(loader);

        setTimeout(() => {
          startSelectedGame();
        }, 400);
      }
  }, 120);
}

// Start Selected Game
function startSelectedGame() {
  currentState = STATES.GAME;

  loadGame(selectedGame)
}

function update(dt) {

  pollGamepad();

  if (currentState === STATES.GAME) {
    updateGame(dt);
  }
}

// Render
function render() {
  ctx.fillStyle = "#0c0c0c";
  ctx.fillRect(0,0, canvas.width, canvas.height);

  if(currentState === STATES.GAME) {
  renderGame(ctx);
  }
}




// Mouse Events
document.addEventListener("mousemove", (e) => {

  const controller = document.querySelector(".controller");

  const x = (window.innerWidth /2 - e.clientX) / 80;
  const y = (window.innerHeight /2 - e.clientY) / 80;

  controller.style.transform = `rotateX(${y}deg) rotateY(${x}deg)`;

  // dynamic lighting
  const lightX = (e.clientX / window.innerWidth) * 100;
  const lightY = (e.clientY / window.innerHeight) * 100;

  controller.style.background = `
  radial-gradient(circle at ${lightX}% ${lightY}%,
  rgba(255, 255, 255, 0.25),
  transparent 40%),
  linear-gradient(
  to bottom,
  #f2f2f2 0%,
  #d9d9d9 45%,
  #bfbfbf 100%)
  `;
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

// Console OS Behavior
function handleSystemInput(key){
  switch(currentState) {
    case STATES.BOOT:
      if(key === "enter") {

        bootText.innerHTML = "INSERTING CARTRIDGE...";

        setTimeout(() => {
          startMenu();
        }, 800);
      }
      break;

    case STATES.MENU:
      if(key === "shift") {
        cycleGame();
      }
      if(key === "enter") {
        launchGame();
      }
      break;

    case STATES.GAME:
      if(key === "shift") {
        exitGame();
      }
      break;

    case STATES.GAME_OVER:
      if(key === "enter") {
        startMenu()
      }
      break;
  }
}

// Button Animation
function press(btn) {
  btn.classList.add('active');

  if (currentState !== STATES.GAME)

  if (!bootText) return;

const key = btn.dataset.key.toUpperCase();

bootText.InnerHTML = `
<div> INPUT: ${key}</div>
`;
}

function release(btn) {
  btn.classList.remove('active');

  if (currentState === STATES.GAME && display) {
     bootText.textContent = 'READY';
}
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

}

// Toggle Handler
function toggle(key, pressed) {
  const el = document.querySelector(`[data-key="${key}"]`);

  if (!el) return;

  el.classList.toggle('active', pressed);

  if (pressed) {

    handleSystemInput(key);

    handleKonami(key);
  }
}

// Clickable Start / Select buttons (mouse suppourt)
  const startBtn = document.querySelector('[data-key="enter"]');
  const selectBtn = document.querySelector('[data-key="shift"]');

  if (startBtn) {
    startBtn.addEventListener('click', () => {
      handleSystemInput('enter');
    });
  }

  if (selectBtn) {
    selectBtn.addEventListener('click', () => {
      handleSystemInput('shift')
    });
  }


  initInput({
    handleSystemInput,
    handleKonami,
    press,
    release
  });

  startLoop(update, render);  //run update() and render() everyframe


  // Game Over Trigger
  document.addEventListener("gameOver", () => {
    currentState = STATES.GAME_OVER;

    boot.Text.innerHTML = `
    <div>*** GAME OVER ***</div>
    <br>
    <div>PRESS START</div>
    `;
  });