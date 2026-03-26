# snessUILab
gameloop control
          ObjectPooling
          Collision detection
          State transitions
          FrameTiming
          Modular Architecture
          Canvas Rendering
          Separation of concerns

### Style
Ultra realistic SNES shell
3-zone layout(dpad / display / buttons)
Cable + lighting Effects
Console-grade depth & shading
Ready for JS intereactivity
Textured plastic
Recessed buttons wells
Ambient shell glow
Parallax depth
Physical button travel

### Logic
// event-driven input handling
// real time animation feedbak
// gamepad API integration
// clean separation of concerns
// stable input mapping
// real time keyboard interaction
// hardware controller integration
// custom css3d lighting
// slight tilt with mouse moves
// feels 3d
// easter egg detection
// professional animation polish
// CRT scanlines
// Power Flash
// BIOS boot text
// Retro Typing
// Idle State

// --------------16bit Survival Arena------------------- //
/*
Minimal concept
a square
enemis spawn slowly
d-pad mives
a button shoots
score increases over time
death = crt glitch + reboot
*/

// RequestAnimationFrame
// Collision detection
// Object Arrays
// Game state transition
// Input mapping abstraction
// Basic physicas loop
// Restart logic
// Separation of update/render logic

### ES6 Modules Restructure
Cleaner architecture
Easier cartridge system (/modules/games/...)
Avoids giant script.js
Closer to real game engine structure
Modern browsers optimize modules well
Modular Console OS

Target Architecture

snesUILab
│
├── index.html
├── style.css
├── README.md
│
├── modules
│   ├── main.js
│   ├── state.js
│   ├── input.js
│   ├── engine.js
│   │
│   └── games
│       ├── flightSim.js
│       ├── snake.js
│       ├── pong.js
│       └── survivalArena.js
│
└── assets

Core engine Module
modules/enjine.js becomes game engine core

State System
modules/state.js
modules/input.js
to later handle controller, gamepad,buttons.

Main Console OS
modules/main.js
console loads cartridges

exapnadability to emulators,
real console menus,
dynamic cartridge loading,
and audio systems.


### Loaded Flight Siomulator Cartridge
games/flightSim.js
games will live in their own modules
modules created
snake
flightSim
pong
surviavalArena

### Cartridge API
every cartridge contains
name
init()
update()
render()
destroy()

### Cartridge Manager
Modular cartridges
Game loader system
Dynamic menu
Clean architecture
Game cartridge Slot System handles
loading games
switching games
running games

### //Enteties/Players
allows for multiple players
enemies
AI Ships

### Current States
Physical collision
Crash detection
State transition
game over System
Event communicaiton
Explosion effect emminent.


### migrating to ES6 modules
Current phase moving
BOOT
MENU
LOADING
GAME OVER.

### Input manager Specifications
it owns:
keyboard input
Gamepad input,
MOuse controller lighting
Button visul toggles
updateGamepad() is called every frame.
import input to script