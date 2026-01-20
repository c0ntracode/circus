# Circus - Graph Circuit Puzzle Game

## Project Overview
A browser-based puzzle game focused on Hamilton and Euler circuits from discrete mathematics. Players trace valid circuits on graphs by clicking nodes/edges.

## Tech Stack
- Vanilla HTML/CSS/JavaScript (no frameworks)
- HTML5 Canvas for graph rendering
- ES6 modules for code organization
- No build tools required

## Goals
- Desktop browser game first
- Mobile browser compatibility planned
- Possible native app in the future

## Core Gameplay
- Player sees a graph with nodes and edges
- Must trace a valid Hamilton circuit (visit every node once, return to start) or Euler circuit (traverse every edge once, return to start)
- Click to build path, game validates solution

## File Structure
```
circus/
├── index.html              # Main page (requires server for ES6 modules)
├── circus-standalone.html  # Single-file version (no server needed)
├── style.css
├── build.py                # Generates standalone HTML from source
├── js/
│   ├── main.js             # Entry point
│   ├── graph.js            # Graph data structure + circuit detection
│   ├── renderer.js         # Canvas rendering
│   ├── game.js             # Game state/logic
│   ├── levels.js           # Puzzle definitions
│   ├── validator.js        # Puzzle validation module
│   ├── generator.js        # Random puzzle generation
│   ├── validate-levels.js  # Test script for level validation
│   └── test-generator.js   # Test script for generator
```

## Current Status
- [x] Initial project setup
- [x] HTML/CSS foundation
- [x] Graph data structure
- [x] Canvas rendering
- [x] Game logic
- [x] Level system (10 starter levels)
- [x] Fixed unsolvable levels (House → Crystal, K4 → K5, Grid → Cube)
- [x] All nodes use letter labels (A, B, C, etc.)
- [x] Added Undo Last button
- [x] Hint button disables when circuit is complete
- [x] Standalone single-file HTML version
- [x] Build script to regenerate standalone from source
- [x] Puzzle validator module
- [x] Random puzzle generator with Euler/Hamilton buttons
- [ ] User-designed puzzles (see Future Features below)

## How to Run

**Standalone (easiest):** Open `circus-standalone.html` directly in a browser. No server needed.

**Development:** Use `index.html` with a local server (ES6 modules require this):
- Python: `python -m http.server 8000` then visit `localhost:8000`
- VS Code: Use "Live Server" extension
- Node: `npx serve`

## Building

After editing the source files, regenerate the standalone version:
```
python build.py
```
This bundles all JS/CSS into `circus-standalone.html`.

## Controls
- **Click**: Select nodes to build path
- **Undo Last button**: Undo last move
- **Reset Path button**: Start over on current level
- **Hint button**: Get a hint (disabled when complete)
- **Random Euler/Hamilton buttons**: Generate a random solvable puzzle
- **R**: Reset current level
- **H**: Show hint
- **Ctrl+Z**: Undo last move
- **Arrow keys**: Navigate levels

## Testing

Validate all starter levels are solvable:
```
node js/validate-levels.js
```

Test random puzzle generator (generates 40 random puzzles and validates them):
```
node js/test-generator.js
```

## Level Design Rules

**CRITICAL: Every puzzle MUST be solvable. No exceptions.**

Before adding any level to `levels.js`, verify mathematically:

### Euler Circuits
- **Required**: Every vertex must have even degree
- **Required**: Graph must be connected
- Check: Count edges at each vertex. If any vertex has an odd number of edges, the puzzle is IMPOSSIBLE.

### Hamilton Circuits
- **Required**: A valid path exists that visits every vertex exactly once and returns to start
- Watch out for bipartite graphs with unequal partitions (e.g., odd-sized grids)
- When in doubt, manually trace a solution before adding the level

### Forbidden
- No multigraphs (duplicate edges between same nodes) - they're visually confusing
- No unsolvable "trick" puzzles - the game has no UI to mark a puzzle as impossible

## Key Decisions
- Canvas over SVG for better interaction performance
- No build tools for simplicity
- Desktop-first responsive design

## Implemented Features

### Puzzle Validator (`validator.js`)
Verifies puzzles are solvable before presenting them to players.

**API:**
- `validateLevel(level)` → detailed result with errors/warnings
- `validateAllLevels(levels)` → summary for all levels
- `isLevelSolvable(level)` → quick boolean check
- `printValidationReport(results)` → console output

**Euler validation:** Checks all vertices have even degree and graph is connected.

**Hamilton validation:** Backtracking search for graphs ≤12 nodes (NP-complete, so limited).

### Random Puzzle Generator (`generator.js`)
Generates random solvable puzzles with validator integration.

**API:**
- `generateHamiltonPuzzle(nodeCount, extraEdges)` → level definition
- `generateEulerPuzzle(nodeCount, extraEdgePairs)` → level definition
- `generatePuzzle(type, difficulty)` → level definition ('easy'/'medium'/'hard')

**Hamilton generation:** Creates a cycle through all vertices (guaranteed solution), then adds random extra edges for difficulty.

**Euler generation:** Starts with a base cycle, adds edges while maintaining even degree. Auto-fixes invalid puzzles by adding edges between odd-degree vertices.

**Size constraints:** 4-12 nodes depending on difficulty.

---

## Future Features

### User-Designed Puzzles
Allow players to create and share their own puzzles.

**Editor features:**
- Click to place nodes
- Click and drag between nodes to create edges
- Delete nodes/edges
- Set puzzle type (Euler or Hamilton)
- Validate button to check if puzzle is solvable

**Validation:**
- For Euler: verify all vertices have even degree and graph is connected
- For Hamilton: harder to verify algorithmically (NP-complete), may need to brute-force small graphs or trust the user

**Sharing:**
- Export puzzle as JSON or encoded URL parameter
- Import puzzle from JSON/URL
- Possible: copy-paste shareable code

**UI additions needed:**
- "Create Puzzle" button/mode
- Node/edge placement tools
- Delete tool
- Puzzle type selector
- Validate and Save buttons
- Import/Export interface
