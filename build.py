#!/usr/bin/env python3
"""
Build script for Circus standalone HTML.
Reads the modular source files and bundles them into a single HTML file.

Usage: python build.py
"""

import re
from pathlib import Path

def read_file(path):
    return Path(path).read_text(encoding='utf-8')

def strip_exports_imports(js_content):
    """Remove ES6 import/export statements."""
    # Remove import lines
    js_content = re.sub(r'^import\s+.*?[\'"].*?[\'"];?\s*$', '', js_content, flags=re.MULTILINE)
    # Remove export keywords but keep the content
    js_content = re.sub(r'^export\s+(class|function|const|let|var)', r'\1', js_content, flags=re.MULTILINE)
    js_content = re.sub(r'^export\s+\{[^}]*\};?\s*$', '', js_content, flags=re.MULTILINE)
    return js_content

def build():
    root = Path(__file__).parent

    # Read source files
    css = read_file(root / 'style.css')
    graph_js = read_file(root / 'js' / 'graph.js')
    levels_js = read_file(root / 'js' / 'levels.js')
    renderer_js = read_file(root / 'js' / 'renderer.js')
    game_js = read_file(root / 'js' / 'game.js')
    main_js = read_file(root / 'js' / 'main.js')

    # Strip module syntax
    graph_js = strip_exports_imports(graph_js)
    levels_js = strip_exports_imports(levels_js)
    renderer_js = strip_exports_imports(renderer_js)
    game_js = strip_exports_imports(game_js)
    main_js = strip_exports_imports(main_js)

    # Combine JS in dependency order
    combined_js = f"""
// ============ GRAPH ============
{graph_js.strip()}

// ============ LEVELS ============
{levels_js.strip()}

// ============ RENDERER ============
{renderer_js.strip()}

// ============ GAME ============
{game_js.strip()}

// ============ APP ============
{main_js.strip()}
"""

    # Build the HTML
    html = f'''<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Circus - Graph Circuit Puzzles</title>
    <style>
{css}
    </style>
</head>
<body>
    <div class="container">
        <header>
            <h1>Circus</h1>
            <p class="subtitle">Graph Circuit Puzzles</p>
        </header>

        <div class="game-info">
            <div class="level-info">
                <span class="level-label">Level <span id="level-num">1</span></span>
                <span class="circuit-type" id="circuit-type">Euler Circuit</span>
            </div>
            <p class="instructions" id="instructions">Traverse every edge exactly once and return to the start node.</p>
        </div>

        <div class="canvas-container">
            <canvas id="game-canvas"></canvas>
        </div>

        <div class="controls">
            <button id="undo-btn" class="btn btn-secondary">Undo Last</button>
            <button id="reset-btn" class="btn">Reset Path</button>
            <button id="hint-btn" class="btn btn-secondary">Hint</button>
            <button id="next-btn" class="btn btn-success" disabled>Next Level</button>
        </div>

        <div class="level-select">
            <button id="prev-level" class="btn-small">&larr;</button>
            <span>Level <span id="level-display">1</span> / <span id="total-levels">1</span></span>
            <button id="next-level" class="btn-small">&rarr;</button>
        </div>

        <div id="message" class="message"></div>
    </div>

    <script>
{combined_js}
    </script>
</body>
</html>
'''

    # Write output
    output_path = root / 'circus-standalone.html'
    output_path.write_text(html, encoding='utf-8')
    print(f"Built {output_path.name} ({len(html):,} bytes)")

if __name__ == '__main__':
    build()
