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


### Technical architecture
current working Structure
snesUILab/

script.js
   orchestrator

modules/

engine.js
   game loop

uiManager.js
   console OS

input.js
   device input

eventBus.js
   system messaging

cartridgeManager.js
   game loader

entities/
   player.js

games/
   flightSim.js


### Modular Engine system
Tracks score
Tracks lives
Track Health
Pause gameplay
Trigger gameover
Reset between games
Notify UI automatically

### Next implementation
/Games/flightSim
Ship acceleration
Ship rotation
Ship velocity
Friction
Screen boundaries
Current Behavior:
Speed control
Altitude control
Heading control
Ground collision
Explosion timer
Cloud parallax
Building:
Throttle → speed increases gradually
Drag → speed slows naturally
Lift → altitude depends on speed
Gravity → altitude slowly drops
Banking → heading changes smoothly
Crash → if altitude too low at speed


### Flight Sim Architectural Principal
3d projected world
simulation space
camera model world projection
Cartridge Runtime
Game Logic Controller
Physics Model
Combat System
Rendering Pipeline
Difficulty Engine
init
update
physics
collision
render
crash
gameOver
destroy
spawn

### Combat Loop
Fully Functional
Weapons
Targets
Hit detection
Score reward
Cleanup
Pipeline
Fire laser
Move laser
Detect collision
Destroy obstacle
Award score
Remove objects



### Game Loop Flow
Calculate delta time
Update game state
Render frame
Schedule next frame
Variable Time-Step Game Loop
Frame Rate Independent Motion
Stable Physics Timing
Retro Rendering Pipeline
Decoupled
Reusable
Game-agnostic
Modular
Perfect first-frame timing
No initial spike
More deterministic startup

### Gameplay Systems
Flight physics
Stall mechanics
Turning physics
Banking animation
Altitude control
Ground collision
Weapon firing
5 shots per second
Stable weapon behavior
Obstacle spawning
Enemy destruction
Difficulty scaling
Crash detection
Explosion timer
Game over event
HUD display
Parallax clouds
Perspective ground

###  Architectural Snapshot — Input Layer
Full input pipeline.
Input Hardware
    ↓
Keyboard / Gamepad / Mouse
Input Driver
    input.js
Input State
    keys[]
Game Logic
    flightSim.update()

### Scalable Engine
Lets cartridges, UI, and system services talk without knowing about each other
System Message Bus
Signal Dispatcher
Event Router
Decoupling Layer
Loose coupling
Modular cartridges
System-level messaging
UI synchronization
Event System
Message Queue
Observer Pattern
Publish/Subscribe System

### Funciton 1 - on()
Registers a listener.
System behavior:
Subscribe to an event
Meaning:
When gameOver happens → run showGameOverScreen

### Function 2 — off()
Removes a listener.
System behavior:
Unsubscribe from an event
Critical for:
Scene switching
Cartridge unloading
Memory safety

### Function 3 — emit()
Triggers an event.
System behavior:
Broadcast message
Flow:
Cartridge emits event
↓
EventBus receives event
↓
All listeners execute

### Console OS Interface Layer
Boot sequence
System menu
Cartridge loading
Game state transitions
Game over screen
Input routing
Engine        → runs the loop
Game State    → stores memory
UI Manager    → controls system flow

### Loader — Real Cartridge Simulation
Progress bar
Timed loading
Transition state
█ and ░
UI signals the system
System launches the cartridge