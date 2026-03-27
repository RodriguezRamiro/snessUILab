/* snesUILab/script.js */

import { ctx, canvas, startLoop } from "./modules/engine.js";
import { initInput, updateGamepad } from "./modules/input.js";
import { getGameList, loadGame, updateGame, renderGame } from "./modules/cartridgeManager.js";
// import { clamp, applyFriction } from "./modules/entities/player.js";
import { createPlayer } from "./modules/entities/player.js";
import { initUI, handleSystemInput, getState, STATES, triggerGameOver } from "./modules/uiManager.js";
import { on } from "./modules/eventBus.js";
import { resetGameState } from "./modules/gameState.js";
import { togglePause } from "./modules/gameState.js";
import { getStateValue } from "./modules/gameState.js";


let games = getGameList();

initUI(games, startSelectedGame);



const player = createPlayer();


// Konami Code Sequence
const konami = ['w','w','s','s','a','d','a','d','k','l','enter'];
let konamiIndex = 0;

// Display Boot Logic
const display = document.querySelector('.display');
const bootText = document.querySelector('.boot-text');







window.addEventListener("load", () => {
  setTimeout(typeLine, 600);
});





// Start Selected Game
function startSelectedGame(index) {

  resetGameState();

  loadGame(index)
}

function update(dt) {

  updateGamepad();

  if (getState() !== STATES.GAME) {
    return;

  if (getStateValue("paused"))
    return;

    updateGame(dt);
  }
}

// Render
function render() {
  ctx.fillStyle = "#0c0c0c";
  ctx.fillRect(0,0, canvas.width, canvas.height);

  if(getState() === STATES.GAME) {
  renderGame(ctx);
  }
}




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
        }, 800);
      }
      break;

    case STATES.MENU:
      if(key === "shift") {

      }
      if(key === "enter") {

      }
      break;

    case STATES.GAME:
      if(key === "shift") {

        exitGame();
      }

      if (key === "p") {
        togglePause();
      }

      break;

    case STATES.GAME_OVER:
      if(key === "enter") {
      }
      break;
  }
}

// Button Animation
function press(btn) {

  btn.classList.add('active');

  if (getState() !== STATES.GAME) return;

  if (!bootText) return;

const key = btn.dataset.key.toUpperCase();

bootText.innerHTML = `
<div> INPUT: ${key}</div>
`;
}

function release(btn) {
  btn.classList.remove('active');

  if (getState() === STATES.GAME && display) {
     bootText.textContent = 'READY';
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
  on("gameOver", triggerGameOver);