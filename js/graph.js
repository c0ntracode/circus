/**
 * Graph data structure for circuit puzzles
 */
export class Graph {
    constructor() {
        this.nodes = new Map(); // id -> {x, y, label}
        this.edges = [];        // [{from, to}]
        this.adjacency = new Map(); // id -> Set of neighbor ids
    }

    addNode(id, x, y, label = null) {
        this.nodes.set(id, { x, y, label: label || id.toString() });
        if (!this.adjacency.has(id)) {
            this.adjacency.set(id, new Set());
        }
        return this;
    }

    addEdge(from, to) {
        // Undirected graph - add both directions
        this.edges.push({ from, to });
        this.adjacency.get(from).add(to);
        this.adjacency.get(to).add(from);
        return this;
    }

    getNeighbors(nodeId) {
        return this.adjacency.get(nodeId) || new Set();
    }

    getDegree(nodeId) {
        return this.getNeighbors(nodeId).size;
    }

    getNodeCount() {
        return this.nodes.size;
    }

    getEdgeCount() {
        return this.edges.length;
    }

    /**
     * Check if an Euler circuit exists.
     * An Euler circuit exists iff the graph is connected and every vertex has even degree.
     */
    hasEulerCircuit() {
        if (!this.isConnected()) return false;

        for (const [nodeId] of this.nodes) {
            if (this.getDegree(nodeId) % 2 !== 0) {
                return false;
            }
        }
        return true;
    }

    /**
     * Check if graph is connected using BFS
     */
    isConnected() {
        if (this.nodes.size === 0) return true;

        const visited = new Set();
        const queue = [this.nodes.keys().next().value];

        while (queue.length > 0) {
            const current = queue.shift();
            if (visited.has(current)) continue;
            visited.add(current);

            for (const neighbor of this.getNeighbors(current)) {
                if (!visited.has(neighbor)) {
                    queue.push(neighbor);
                }
            }
        }

        return visited.size === this.nodes.size;
    }

    /**
     * Validate if a path is a valid Euler circuit
     */
    isValidEulerCircuit(path) {
        if (path.length !== this.edges.length + 1) return false;
        if (path[0] !== path[path.length - 1]) return false;

        // Track edge usage
        const edgeUsage = new Map();
        for (const edge of this.edges) {
            const key = this.edgeKey(edge.from, edge.to);
            edgeUsage.set(key, (edgeUsage.get(key) || 0) + 1);
        }

        // Check each step uses a valid edge exactly once
        for (let i = 0; i < path.length - 1; i++) {
            const key = this.edgeKey(path[i], path[i + 1]);
            const count = edgeUsage.get(key) || 0;
            if (count <= 0) return false;
            edgeUsage.set(key, count - 1);
        }

        // All edges should be used
        for (const count of edgeUsage.values()) {
            if (count !== 0) return false;
        }

        return true;
    }

    /**
     * Validate if a path is a valid Hamilton circuit
     */
    isValidHamiltonCircuit(path) {
        if (path.length !== this.nodes.size + 1) return false;
        if (path[0] !== path[path.length - 1]) return false;

        // Check all nodes visited exactly once (except start/end)
        const visited = new Set();
        for (let i = 0; i < path.length - 1; i++) {
            if (visited.has(path[i])) return false;
            visited.add(path[i]);
        }

        if (visited.size !== this.nodes.size) return false;

        // Check all edges in path are valid
        for (let i = 0; i < path.length - 1; i++) {
            if (!this.getNeighbors(path[i]).has(path[i + 1])) {
                return false;
            }
        }

        return true;
    }

    /**
     * Create a unique key for an edge (order-independent)
     */
    edgeKey(a, b) {
        return a < b ? `${a}-${b}` : `${b}-${a}`;
    }

    /**
     * Check if two nodes are connected by an edge
     */
    hasEdge(from, to) {
        return this.getNeighbors(from).has(to);
    }

    /**
     * Get all edges from a node
     */
    getEdgesFrom(nodeId) {
        return this.edges.filter(e => e.from === nodeId || e.to === nodeId);
    }
}

/**
 * Create a graph from a level definition
 */
export function createGraphFromLevel(level) {
    const graph = new Graph();

    for (const node of level.nodes) {
        graph.addNode(node.id, node.x, node.y, node.label);
    }

    for (const edge of level.edges) {
        graph.addEdge(edge[0], edge[1]);
    }

    return graph;
}
