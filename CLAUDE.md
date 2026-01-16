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
├── index.html
├── style.css
├── js/
│   ├── main.js      # Entry point
│   ├── graph.js     # Graph data structure
│   ├── renderer.js  # Canvas rendering
│   ├── game.js      # Game state/logic
│   └── levels.js    # Puzzle definitions
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
- [ ] Random puzzle generator (see Future Features below)

## How to Run
Open `index.html` in a browser. Due to ES6 modules, you may need a local server:
- VS Code: Use "Live Server" extension
- Python: `python -m http.server 8000` then visit `localhost:8000`
- Node: `npx serve`

## Controls
- **Click**: Select nodes to build path
- **Undo Last button**: Undo last move
- **Reset Path button**: Start over on current level
- **Hint button**: Get a hint (disabled when complete)
- **R**: Reset current level
- **H**: Show hint
- **Ctrl+Z**: Undo last move
- **Arrow keys**: Navigate levels

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

## Future Features

### Random Puzzle Generator
Add buttons to generate random solvable Euler and Hamilton circuits.

**Hamilton circuit generation (simpler):**
1. Create a cycle through all vertices (this IS the Hamilton circuit)
2. Add random extra edges to increase difficulty
3. The original cycle is always a valid solution

**Euler circuit generation (more complex):**
1. Every vertex must have even degree
2. Approach: add edges in pairs to maintain even degree at each vertex
3. Or: start with random cycles and merge them at shared vertices
4. Must ensure graph stays connected

**Recommended size constraints:**
- Minimum: 4 nodes (enough to be interesting)
- Maximum: 12 nodes (desktop), 8 nodes (mobile)
- Consider difficulty levels:
  - Easy: 4-6 nodes
  - Medium: 6-9 nodes
  - Hard: 9-12 nodes

**UI additions needed:**
- "Random Euler" button
- "Random Hamilton" button
- Possibly a difficulty/size selector
