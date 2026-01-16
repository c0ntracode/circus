/**
 * Game state and logic controller
 */
export class Game {
    constructor() {
        this.graph = null;
        this.level = null;
        this.state = this.createInitialState();
        this.onStateChange = null;
        this.onWin = null;
    }

    createInitialState() {
        return {
            path: [],
            usedEdges: new Map(),
            validMoves: new Set(),
            hoveredNode: null,
            hoveredEdge: null,
            isComplete: false,
            isWon: false
        };
    }

    loadLevel(level, graph) {
        this.level = level;
        this.graph = graph;
        this.reset();
    }

    reset() {
        this.state = this.createInitialState();
        // All nodes are valid starting points
        for (const [nodeId] of this.graph.nodes) {
            this.state.validMoves.add(nodeId);
        }
        this.notifyStateChange();
    }

    /**
     * Handle player clicking on a node
     */
    selectNode(nodeId) {
        if (this.state.isWon) return false;

        // If no path yet, start from this node
        if (this.state.path.length === 0) {
            this.state.path.push(nodeId);
            this.updateValidMoves();
            this.notifyStateChange();
            return true;
        }

        // Check if this is a valid move
        if (!this.state.validMoves.has(nodeId)) {
            return false;
        }

        const currentNode = this.state.path[this.state.path.length - 1];

        // Add to path
        this.state.path.push(nodeId);

        // Mark edge as used
        const edgeKey = this.graph.edgeKey(currentNode, nodeId);
        const currentCount = this.state.usedEdges.get(edgeKey) || 0;
        this.state.usedEdges.set(edgeKey, currentCount + 1);

        // Check for win condition
        this.checkWinCondition();

        // Update valid moves
        this.updateValidMoves();

        this.notifyStateChange();
        return true;
    }

    /**
     * Undo last move
     */
    undoMove() {
        if (this.state.path.length <= 1) {
            this.reset();
            return;
        }

        const removedNode = this.state.path.pop();
        const currentNode = this.state.path[this.state.path.length - 1];

        // Restore edge
        const edgeKey = this.graph.edgeKey(currentNode, removedNode);
        const currentCount = this.state.usedEdges.get(edgeKey) || 0;
        if (currentCount <= 1) {
            this.state.usedEdges.delete(edgeKey);
        } else {
            this.state.usedEdges.set(edgeKey, currentCount - 1);
        }

        this.state.isWon = false;
        this.state.isComplete = false;
        this.updateValidMoves();
        this.notifyStateChange();
    }

    /**
     * Update which nodes are valid moves from current position
     */
    updateValidMoves() {
        this.state.validMoves.clear();

        if (this.state.path.length === 0) {
            // All nodes are valid starting points
            for (const [nodeId] of this.graph.nodes) {
                this.state.validMoves.add(nodeId);
            }
            return;
        }

        const currentNode = this.state.path[this.state.path.length - 1];
        const neighbors = this.graph.getNeighbors(currentNode);

        for (const neighbor of neighbors) {
            if (this.canTraverseEdge(currentNode, neighbor)) {
                this.state.validMoves.add(neighbor);
            }
        }
    }

    /**
     * Check if an edge can still be traversed
     */
    canTraverseEdge(from, to) {
        const edgeKey = this.graph.edgeKey(from, to);
        const usedCount = this.state.usedEdges.get(edgeKey) || 0;

        // Count how many times this edge appears in the graph
        let totalCount = 0;
        for (const edge of this.graph.edges) {
            if (this.graph.edgeKey(edge.from, edge.to) === edgeKey) {
                totalCount++;
            }
        }

        if (this.level.type === 'euler') {
            // For Euler circuits, each edge can only be used once
            return usedCount < totalCount;
        } else {
            // For Hamilton circuits, we just need adjacency
            // But we can't revisit nodes (except returning to start)
            const startNode = this.state.path[0];
            const visitedNodes = new Set(this.state.path);

            // Can always return to start if we've visited all nodes
            if (to === startNode && visitedNodes.size === this.graph.nodes.size) {
                return true;
            }

            // Can't revisit other nodes
            return !visitedNodes.has(to);
        }
    }

    /**
     * Check if player has won
     */
    checkWinCondition() {
        if (this.state.path.length < 2) return;

        const startNode = this.state.path[0];
        const currentNode = this.state.path[this.state.path.length - 1];

        // Must return to start
        if (currentNode !== startNode) return;

        let isValid = false;

        if (this.level.type === 'euler') {
            isValid = this.graph.isValidEulerCircuit(this.state.path);
        } else if (this.level.type === 'hamilton') {
            isValid = this.graph.isValidHamiltonCircuit(this.state.path);
        }

        if (isValid) {
            this.state.isComplete = true;
            this.state.isWon = true;
            this.state.validMoves.clear();
            if (this.onWin) {
                this.onWin();
            }
        }
    }

    /**
     * Get a hint for the player
     */
    getHint() {
        if (this.state.path.length === 0) {
            return "Click any node to start your path.";
        }

        if (this.state.validMoves.size === 0) {
            return "No valid moves! Try resetting and taking a different path.";
        }

        if (this.level.type === 'euler') {
            // Fleury's algorithm hint: prefer edges that aren't bridges
            const currentNode = this.state.path[this.state.path.length - 1];
            const remainingEdges = this.getRemainingEdgeCount();

            if (remainingEdges === 1) {
                return "One edge left! Return to start to complete the circuit.";
            }

            return `You have ${remainingEdges} edges left to traverse. Try to avoid getting stuck!`;
        } else {
            const visitedCount = new Set(this.state.path).size;
            const totalNodes = this.graph.nodes.size;
            const remaining = totalNodes - visitedCount;

            if (remaining === 0) {
                return "All nodes visited! Return to start to complete the circuit.";
            }

            return `Visit ${remaining} more node${remaining > 1 ? 's' : ''}, then return to start.`;
        }
    }

    getRemainingEdgeCount() {
        let total = this.graph.edges.length;
        let used = 0;
        for (const count of this.state.usedEdges.values()) {
            used += count;
        }
        return total - used;
    }

    setHoveredNode(nodeId) {
        this.state.hoveredNode = nodeId;
        this.notifyStateChange();
    }

    notifyStateChange() {
        if (this.onStateChange) {
            this.onStateChange(this.state);
        }
    }
}
