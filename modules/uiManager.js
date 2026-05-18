/* //snesUILab/modules/uiManager.js */

import { on } from "./eventBus.js";

/**
 * HUD
 * Menus
 * Game Over Screen
 * Pause Screen
 * Score Display
 * Lives Display
 */




export const STATES = {
    BOOT: "boot",
    MENU: "menu",
    LOADING: "loading",
    GAME: "game",
    GAME_OVER: "gameOver"
  };

  let currentState = STATES.BOOT;

  let games = [];
  let selectedGame = 0;

  const display = document.querySelector(".display");
  const bootText = document.querySelector(".boot-text");

  // Silent Runtime crashes safeguard
  if (!display || !bootText) {
    throw new Error("UI element missing");

  }

  const bootLines = [
    "████████████████████████",
    " SNES DEV BIOS v1.2",
    " RodriguezTech Studios",
    "████████████████████████",
    "",
    "Memory Check..........OK",
    "Video Interface.......OK",
    "Controller Port 1.....OK",
    "Controller Port 2.....OK",
    "Nostalgia Feel..Imminent",
    "",
    "Loading Console OS.....",
    ""
  ];

  let lineIndex = 0;

  let onGameStart = null;

  export function initUI(gameList, startGameCallback) {

    games = gameList;
    onGameStart = startGameCallback;

    window.addEventListener("load", () => {
      setTimeout(typeLine, 600);
    });

    on("gameOver", data => {
      triggerGameOver(data);
    });

  }

  export function getState() {
    return currentState;
  }

  export function handleSystemInput(key) {
    switch (currentState) {

      case STATES.BOOT:

      if (key === "enter") {

        bootText.innerHTML =
        "INSERTING CARTRIDGE...";

        setTimeout(() => {
          startMenu();
        }, 800);
      }

      break;

      case STATES.MENU:

      if (key === "shift") {
        cycleGame();
      }

      if (key === "enter") {
        launchGame();
      }

      break;

    case STATES.GAME:

      if (key === "shift") {
        startMenu();
      }

      break;

    case STATES.GAME_OVER:

      if (key === "enter") {
        startMenu();
      }

      break;
  }

}

function setState(newState) {
  currentState = newState;
  console.log(
    "UI STATE:",
    currentState
  );
}

  function startMenu() {

    selectedGame = 0;

    lineIndex = 0;

    setState(STATES.MENU);


    renderMenu();

  }

  function renderMenu() {

    bootText.innerHTML =
      "<div>SELECT GAME</div><br>";

    games.forEach((game, index) => {

      const line =
        document.createElement("div");

      if (index === selectedGame) {

        line.textContent =
          `> ${game}`;

        line.style.color =
          "#00ff88";

      } else {

        line.textContent =
          ` ${game}`;

      }

      bootText.appendChild(line);

    });

  }

  function cycleGame() {

    selectedGame++;

    if (selectedGame >= games.length) {

      selectedGame = 0;

    }

    renderMenu();

  }

  function launchGame() {

    setState(STATES.LOADING);

    display.classList.remove("game-active");

    bootText.innerHTML =
      "INSERTING CARTRIDGE...";

    setTimeout(startLoader, 800);

  }

  function startLoader() {

    let progress = 0;

    const loader = setInterval(() => {

      progress += 10;

      const barLength = 14;

      const filled =
        Math.floor(
          (progress / 100) * barLength
        );

      const bar =
        "[" +
        "█".repeat(filled) +
        "░".repeat(barLength - filled) +
        "]";

      bootText.innerHTML =
        `LOADING ${games[selectedGame]}
         <br><br>${bar}`;

      if (progress >= 100) {

        clearInterval(loader);

        setTimeout(() => {

          setState(STATES.GAME);

          bootText.classList.add("hidden");

          display.classList.add("game-active");

          if (onGameStart) {
            onGameStart(selectedGame);
          }

        }, 400);

      }

    }, 120);

  }

  export function triggerGameOver(winner) {

    setState(STATES.GAME_OVER);


    bootText.classList.remove("hidden");

    bootText.style.display = "block";

    bootText.innerHTML = `
      <div>*** GAME OVER ***</div>
      <br>
      <div>Score: ${winner?.score ?? 0}</div>
      <br>
      <div>PRESS ENTER</div>
    `;

  }

  function typeLine() {

    if (lineIndex < bootLines.length) {

      const line =
        document.createElement("div");

      line.textContent =
        bootLines[lineIndex];

      bootText.appendChild(line);

      lineIndex++;

      const delay =
        200 + Math.random() * 200;

      setTimeout(typeLine, delay);

    } else {

      setTimeout(() => {

        const startPrompt =
          document.createElement("div");

        startPrompt.textContent =
          "> PRESS ENTER";

        startPrompt.classList.add("blink");

        bootText.appendChild(startPrompt);

      }, 2000);

    }

  }