/**
 * Main entry point for Circus
 */
import { Graph, createGraphFromLevel } from './graph.js';
import { Renderer } from './renderer.js';
import { Game } from './game.js';
import { levels, getLevelById, getNextLevel, getPrevLevel } from './levels.js';
import { generateEulerPuzzle, generateHamiltonPuzzle } from './generator.js';

class CircusApp {
    constructor() {
        this.canvas = document.getElementById('game-canvas');
        this.renderer = new Renderer(this.canvas);
        this.game = new Game();

        this.currentLevelId = 1;

        // DOM elements
        this.levelNumEl = document.getElementById('level-num');
        this.circuitTypeEl = document.getElementById('circuit-type');
        this.instructionsEl = document.getElementById('instructions');
        this.messageEl = document.getElementById('message');
        this.levelDisplayEl = document.getElementById('level-display');
        this.totalLevelsEl = document.getElementById('total-levels');
        this.nextBtn = document.getElementById('next-btn');
        this.hintBtn = document.getElementById('hint-btn');
        this.undoBtn = document.getElementById('undo-btn');

        this.setupEventListeners();
        this.loadLevel(this.currentLevelId);
    }

    setupEventListeners() {
        // Canvas interactions
        this.canvas.addEventListener('click', (e) => this.handleCanvasClick(e));
        this.canvas.addEventListener('mousemove', (e) => this.handleCanvasMouseMove(e));
        this.canvas.addEventListener('mouseleave', () => this.handleCanvasMouseLeave());

        // Touch support
        this.canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            const touch = e.touches[0];
            this.handleCanvasClick(touch);
        });

        // Buttons
        this.undoBtn.addEventListener('click', () => this.undoMove());
        document.getElementById('reset-btn').addEventListener('click', () => this.resetLevel());
        this.hintBtn.addEventListener('click', () => this.showHint());
        this.nextBtn.addEventListener('click', () => this.goToNextLevel());

        // Level navigation
        document.getElementById('prev-level').addEventListener('click', () => this.goToPrevLevel());
        document.getElementById('next-level').addEventListener('click', () => this.goToNextLevel());

        // Random puzzle generation
        document.getElementById('random-euler-btn').addEventListener('click', () => this.loadRandomPuzzle('euler'));
        document.getElementById('random-hamilton-btn').addEventListener('click', () => this.loadRandomPuzzle('hamilton'));

        // Game state changes
        this.game.onStateChange = () => this.render();
        this.game.onWin = () => this.handleWin();

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.key === 'r' || e.key === 'R') this.resetLevel();
            if (e.key === 'h' || e.key === 'H') this.showHint();
            if (e.key === 'z' && (e.ctrlKey || e.metaKey)) this.undoMove();
            if (e.key === 'ArrowRight') this.goToNextLevel();
            if (e.key === 'ArrowLeft') this.goToPrevLevel();
        });
    }

    loadLevel(levelId) {
        const level = getLevelById(levelId);
        if (!level) return;

        this.currentLevelId = levelId;
        const graph = createGraphFromLevel(level);

        this.game.loadLevel(level, graph);

        // Update UI
        this.levelNumEl.textContent = level.id;
        this.levelDisplayEl.textContent = level.id;
        this.totalLevelsEl.textContent = levels.length;

        this.circuitTypeEl.textContent = level.type === 'euler' ? 'Euler Circuit' : 'Hamilton Circuit';
        this.circuitTypeEl.classList.toggle('hamilton', level.type === 'hamilton');

        this.instructionsEl.textContent = level.type === 'euler'
            ? 'Traverse every edge exactly once and return to the start node.'
            : 'Visit every vertex exactly once and return to the start node.';

        this.hideMessage();
        this.render();
    }

    loadRandomPuzzle(type) {
        const level = type === 'euler'
            ? generateEulerPuzzle(6, 2)
            : generateHamiltonPuzzle(6, 3);

        this.currentLevelId = null; // Not a numbered level
        const graph = createGraphFromLevel(level);

        this.game.loadLevel(level, graph);

        // Update UI
        this.levelNumEl.textContent = '?';
        this.levelDisplayEl.textContent = '?';

        this.circuitTypeEl.textContent = level.type === 'euler' ? 'Euler Circuit' : 'Hamilton Circuit';
        this.circuitTypeEl.classList.toggle('hamilton', level.type === 'hamilton');

        this.instructionsEl.textContent = level.type === 'euler'
            ? 'Traverse every edge exactly once and return to the start node.'
            : 'Visit every vertex exactly once and return to the start node.';

        this.hideMessage();
        this.render();
    }

    handleCanvasClick(e) {
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const nodeId = this.renderer.getNodeAt(x, y, this.game.graph);

        if (nodeId !== null) {
            const success = this.game.selectNode(nodeId);
            if (!success && this.game.state.path.length > 0) {
                this.showMessage("Can't move there! Choose a highlighted node.", 'error');
            }
        }
    }

    handleCanvasMouseMove(e) {
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const nodeId = this.renderer.getNodeAt(x, y, this.game.graph);
        this.game.setHoveredNode(nodeId);

        // Update cursor
        this.canvas.style.cursor = nodeId !== null ? 'pointer' : 'default';
    }

    handleCanvasMouseLeave() {
        this.game.setHoveredNode(null);
    }

    handleWin() {
        const type = this.game.level.type;
        this.showMessage(`Excellent! You completed the ${type === 'euler' ? 'Euler' : 'Hamilton'} circuit!`, 'success');
    }

    resetLevel() {
        this.game.reset();
        this.hideMessage();
    }

    undoMove() {
        this.game.undoMove();
        this.hideMessage();
    }

    showHint() {
        if (this.game.state.isWon) return;
        const hint = this.game.getHint();
        this.showMessage(hint, 'hint');
    }

    goToNextLevel() {
        // If on a random puzzle, go to level 1
        if (this.currentLevelId === null) {
            this.loadLevel(1);
            return;
        }
        const next = getNextLevel(this.currentLevelId);
        if (next) {
            this.loadLevel(next.id);
        } else {
            this.showMessage("You've completed all levels! More coming soon.", 'success');
        }
    }

    goToPrevLevel() {
        // If on a random puzzle, go to level 1
        if (this.currentLevelId === null) {
            this.loadLevel(1);
            return;
        }
        const prev = getPrevLevel(this.currentLevelId);
        if (prev) {
            this.loadLevel(prev.id);
        }
    }

    showMessage(text, type = 'info') {
        this.messageEl.textContent = text;
        this.messageEl.className = `message show ${type}`;
    }

    hideMessage() {
        this.messageEl.className = 'message';
    }

    render() {
        this.renderer.render(this.game.graph, this.game.state);
        this.updateButtonStates();
    }

    updateButtonStates() {
        // Hint button disabled when puzzle is complete
        this.hintBtn.disabled = this.game.state.isWon;
        // Next button enabled only when puzzle is won
        this.nextBtn.disabled = !this.game.state.isWon;
    }
}

// Start the app
document.addEventListener('DOMContentLoaded', () => {
    window.app = new CircusApp();
});
