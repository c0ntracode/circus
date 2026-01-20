# Circus

A browser-based puzzle game about graph circuits from discrete mathematics.

Born from a silly idea during a discrete math course and brought to life with [Claude Code](https://claude.ai/code).

## What is it?

Circus challenges you to trace paths through graphs, solving two classic problems:

- **Euler Circuits** — traverse every *edge* exactly once and return to where you started
- **Hamilton Circuits** — visit every *node* exactly once and return to where you started

These problems date back to Leonhard Euler's famous 1736 solution to the Seven Bridges of Königsberg, considered the first theorem of graph theory.

## Play

**Easiest way:** Open `circus-standalone.html` directly in your browser. No server needed.

**For development:** Use `index.html` with a local server (ES6 modules require this):

```bash
# Python
python -m http.server 8000

# Node
npx serve

# VS Code
# Use the "Live Server" extension
```

Then visit `localhost:8000`.

## Controls

| Input | Action |
|-------|--------|
| Click | Select nodes to build your path |
| Undo Last | Remove the last node from your path |
| Reset Path | Start over on the current level |
| Hint | Get help (disabled when circuit is complete) |
| Random Euler / Hamilton | Generate a random solvable puzzle |
| R | Reset current level |
| H | Show hint |
| Ctrl+Z | Undo last move |
| Arrow keys | Navigate between levels |

## Tech

- Vanilla HTML, CSS, JavaScript
- HTML5 Canvas for rendering
- ES6 modules
- No build tools or dependencies

## Project Structure

```
circus/
├── index.html              # Main page (needs server)
├── circus-standalone.html  # Single-file version (no server)
├── build.py                # Regenerates standalone from source
├── style.css
└── js/
    ├── main.js             # Entry point
    ├── graph.js            # Graph data structure + circuit detection
    ├── renderer.js         # Canvas rendering
    ├── game.js             # Game state and logic
    ├── levels.js           # Puzzle definitions
    ├── validator.js        # Puzzle validation
    ├── generator.js        # Random puzzle generation
    ├── validate-levels.js  # Test script for levels
    └── test-generator.js   # Test script for generator
```

## Building

After editing the source files, regenerate the standalone version:

```bash
python build.py
```

## Testing

Validate all preset levels are solvable:

```bash
node js/validate-levels.js
```

Test the random puzzle generator:

```bash
node js/test-generator.js
```

## License

MIT
