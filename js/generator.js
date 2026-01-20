/**
 * Random puzzle generator
 * Generates solvable Euler and Hamilton circuit puzzles
 */

import { Graph } from './graph.js';
import { validateLevel } from './validator.js';

/**
 * Layout generators for varied puzzle shapes
 */
const layouts = {
    /**
     * Circular layout - nodes evenly spaced on a circle
     */
    circular(count, width, height) {
        const nodes = [];
        const centerX = width / 2;
        const centerY = height / 2;
        const radius = Math.min(width, height) / 2 * 0.8;

        for (let i = 0; i < count; i++) {
            const angle = (2 * Math.PI * i) / count - Math.PI / 2;
            nodes.push({
                x: centerX + radius * Math.cos(angle),
                y: centerY + radius * Math.sin(angle)
            });
        }
        return nodes;
    },

    /**
     * Grid layout - rectangular arrangement
     */
    grid(count, width, height) {
        const cols = Math.ceil(Math.sqrt(count));
        const rows = Math.ceil(count / cols);
        const cellW = width / (cols + 1);
        const cellH = height / (rows + 1);
        const nodes = [];

        for (let i = 0; i < count; i++) {
            const col = i % cols;
            const row = Math.floor(i / cols);
            nodes.push({
                x: cellW * (col + 1),
                y: cellH * (row + 1)
            });
        }
        return nodes;
    },

    /**
     * Two rows layout - nodes split between top and bottom
     */
    twoRows(count, width, height) {
        const topCount = Math.ceil(count / 2);
        const bottomCount = count - topCount;
        const nodes = [];

        for (let i = 0; i < topCount; i++) {
            nodes.push({
                x: width * (i + 1) / (topCount + 1),
                y: height * 0.25
            });
        }
        for (let i = 0; i < bottomCount; i++) {
            nodes.push({
                x: width * (i + 1) / (bottomCount + 1),
                y: height * 0.75
            });
        }
        return nodes;
    },

    /**
     * Diamond layout - rhombus shape
     */
    diamond(count, width, height) {
        const nodes = [];
        const centerX = width / 2;
        const centerY = height / 2;
        const radiusX = width * 0.4;
        const radiusY = height * 0.4;

        for (let i = 0; i < count; i++) {
            const angle = (2 * Math.PI * i) / count - Math.PI / 2;
            // Diamond shape using abs functions
            const t = angle;
            const cos = Math.cos(t);
            const sin = Math.sin(t);
            const r = 1 / (Math.abs(cos) + Math.abs(sin));
            nodes.push({
                x: centerX + radiusX * r * cos,
                y: centerY + radiusY * r * sin
            });
        }
        return nodes;
    },

    /**
     * Random scattered layout with minimum distance between nodes
     */
    scattered(count, width, height) {
        const nodes = [];
        const padding = 0.4;
        const minDist = Math.min(width, height) / (count * 0.6);

        for (let i = 0; i < count; i++) {
            let x, y, valid;
            let attempts = 0;

            do {
                x = padding + Math.random() * (width - padding * 2);
                y = padding + Math.random() * (height - padding * 2);
                valid = true;

                for (const node of nodes) {
                    const dist = Math.sqrt((x - node.x) ** 2 + (y - node.y) ** 2);
                    if (dist < minDist) {
                        valid = false;
                        break;
                    }
                }
                attempts++;
            } while (!valid && attempts < 100);

            nodes.push({ x, y });
        }
        return nodes;
    },

    /**
     * Star layout - center node with others around it
     */
    star(count, width, height) {
        if (count < 4) return layouts.circular(count, width, height);

        const nodes = [];
        const centerX = width / 2;
        const centerY = height / 2;

        // Center node
        nodes.push({ x: centerX, y: centerY });

        // Outer ring
        const radius = Math.min(width, height) * 0.4;
        for (let i = 1; i < count; i++) {
            const angle = (2 * Math.PI * (i - 1)) / (count - 1) - Math.PI / 2;
            nodes.push({
                x: centerX + radius * Math.cos(angle),
                y: centerY + radius * Math.sin(angle)
            });
        }
        return nodes;
    },

    /**
     * Hourglass layout - two triangles meeting at center
     */
    hourglass(count, width, height) {
        if (count < 5) return layouts.diamond(count, width, height);

        const nodes = [];
        const topCount = Math.floor((count - 1) / 2);
        const bottomCount = count - 1 - topCount;

        // Center node
        nodes.push({ x: width / 2, y: height / 2 });

        // Top triangle
        for (let i = 0; i < topCount; i++) {
            const spread = (i + 1) / (topCount + 1);
            nodes.push({
                x: width * (0.2 + 0.6 * spread),
                y: height * 0.15
            });
        }

        // Bottom triangle
        for (let i = 0; i < bottomCount; i++) {
            const spread = (i + 1) / (bottomCount + 1);
            nodes.push({
                x: width * (0.2 + 0.6 * spread),
                y: height * 0.85
            });
        }
        return nodes;
    },

    /**
     * Bipartite layout - two columns
     */
    bipartite(count, width, height) {
        const leftCount = Math.ceil(count / 2);
        const rightCount = count - leftCount;
        const nodes = [];

        for (let i = 0; i < leftCount; i++) {
            nodes.push({
                x: width * 0.25,
                y: height * (i + 1) / (leftCount + 1)
            });
        }
        for (let i = 0; i < rightCount; i++) {
            nodes.push({
                x: width * 0.75,
                y: height * (i + 1) / (rightCount + 1)
            });
        }
        return nodes;
    }
};

/**
 * Generate random node positions using a randomly selected layout
 * @param {number} count - Number of nodes
 * @param {number} width - Canvas logical width
 * @param {number} height - Canvas logical height
 * @returns {Array} Array of {id, x, y, label} objects
 */
function generateNodePositions(count, width = 4, height = 4) {
    const layoutNames = Object.keys(layouts);
    const layoutName = layoutNames[Math.floor(Math.random() * layoutNames.length)];
    const positions = layouts[layoutName](count, width, height);

    // Shuffle positions so the Hamilton cycle isn't visually obvious
    shuffleArray(positions);

    // Assign IDs and labels
    return positions.map((pos, i) => ({
        id: i,
        x: pos.x,
        y: pos.y,
        label: String.fromCharCode(65 + i) // A, B, C, ...
    }));
}

/**
 * Fisher-Yates shuffle
 */
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

/**
 * Generate a random Hamilton circuit puzzle
 * Strategy: Create a cycle through all vertices (guaranteed Hamilton circuit),
 * then add random extra edges for difficulty.
 *
 * @param {number} nodeCount - Number of nodes (4-12 recommended)
 * @param {number} extraEdges - Number of additional edges to add
 * @returns {Object} Level definition
 */
export function generateHamiltonPuzzle(nodeCount = 6, extraEdges = 3) {
    nodeCount = Math.max(4, Math.min(12, nodeCount));

    const nodes = generateNodePositions(nodeCount);
    const edges = [];

    // Create base cycle: 0 -> 1 -> 2 -> ... -> (n-1) -> 0
    // This guarantees a Hamilton circuit exists
    for (let i = 0; i < nodeCount; i++) {
        edges.push([i, (i + 1) % nodeCount]);
    }

    // Track existing edges to avoid duplicates
    const edgeSet = new Set(edges.map(e => edgeKey(e[0], e[1])));

    // Add random extra edges for difficulty
    let attempts = 0;
    let added = 0;
    const maxAttempts = extraEdges * 10;

    while (added < extraEdges && attempts < maxAttempts) {
        const a = Math.floor(Math.random() * nodeCount);
        const b = Math.floor(Math.random() * nodeCount);

        if (a !== b) {
            const key = edgeKey(a, b);
            if (!edgeSet.has(key)) {
                edges.push([a, b]);
                edgeSet.add(key);
                added++;
            }
        }
        attempts++;
    }

    const level = {
        id: 'random',
        name: 'Random Hamilton',
        type: 'hamilton',
        description: `Random ${nodeCount}-node Hamilton circuit puzzle.`,
        nodes,
        edges
    };

    // Validate (should always pass for this generation strategy)
    const result = validateLevel(level);
    if (!result.valid) {
        console.error('Generated invalid Hamilton puzzle:', result.errors);
        // Retry with no extra edges as fallback
        return generateHamiltonPuzzle(nodeCount, 0);
    }

    return level;
}

/**
 * Generate a random Euler circuit puzzle
 * Strategy: Start with a base cycle, then add edges while maintaining
 * even degree for all vertices.
 *
 * @param {number} nodeCount - Number of nodes (4-12 recommended)
 * @param {number} extraEdgePairs - Number of additional edge pairs to add
 * @returns {Object} Level definition
 */
export function generateEulerPuzzle(nodeCount = 5, extraEdgePairs = 2) {
    nodeCount = Math.max(3, Math.min(12, nodeCount));

    const nodes = generateNodePositions(nodeCount);
    const edges = [];

    // Create base cycle (all vertices have degree 2 = even)
    for (let i = 0; i < nodeCount; i++) {
        edges.push([i, (i + 1) % nodeCount]);
    }

    const edgeSet = new Set(edges.map(e => edgeKey(e[0], e[1])));

    // Add extra edges while maintaining even degree
    // When we add an edge, both endpoints get +1 degree
    // To keep degrees even, we add edges in "balancing pairs"
    // Method: Add two edges that share a common vertex
    // e.g., add (A-B) and (A-C), now A has +2 degree (still even)
    // and B, C each have +1... so we need to connect B-C too
    // Better method: Add triangles (3 edges, each vertex +2 degree)

    let attempts = 0;
    let added = 0;
    const maxAttempts = extraEdgePairs * 20;

    while (added < extraEdgePairs && attempts < maxAttempts) {
        // Try to add a pair of edges forming a path: a-b-c
        // This gives a +1, b +2, c +1
        // Then add a-c to give a +1, c +1 (now all even again)
        // Net effect: adds triangle a-b-c if none of those edges exist

        const a = Math.floor(Math.random() * nodeCount);
        let b = Math.floor(Math.random() * nodeCount);
        let c = Math.floor(Math.random() * nodeCount);

        // Ensure distinct vertices
        while (b === a) b = Math.floor(Math.random() * nodeCount);
        while (c === a || c === b) c = Math.floor(Math.random() * nodeCount);

        const keyAB = edgeKey(a, b);
        const keyBC = edgeKey(b, c);
        const keyAC = edgeKey(a, c);

        // Check if we can add at least 2 edges of the triangle
        const canAddAB = !edgeSet.has(keyAB);
        const canAddBC = !edgeSet.has(keyBC);
        const canAddAC = !edgeSet.has(keyAC);

        // We need to add edges in pairs to maintain even degree
        // Try to add a complete triangle
        if (canAddAB && canAddBC && canAddAC) {
            edges.push([a, b], [b, c], [a, c]);
            edgeSet.add(keyAB);
            edgeSet.add(keyBC);
            edgeSet.add(keyAC);
            added++;
        }
        // Or add just two edges sharing a vertex (forms a path that closes existing structure)
        else if (canAddAB && canAddAC) {
            edges.push([a, b], [a, c]);
            edgeSet.add(keyAB);
            edgeSet.add(keyAC);
            // b and c now have odd degree - need to connect them if possible
            if (!edgeSet.has(keyBC)) {
                edges.push([b, c]);
                edgeSet.add(keyBC);
            }
            added++;
        }

        attempts++;
    }

    const level = {
        id: 'random',
        name: 'Random Euler',
        type: 'euler',
        description: `Random ${nodeCount}-node Euler circuit puzzle.`,
        nodes,
        edges
    };

    // Validate and fix if needed
    const result = validateLevel(level);
    if (!result.valid) {
        console.warn('Generated Euler puzzle needs fixing:', result.errors);
        // Use the fix function
        return fixEulerPuzzle(level);
    }

    return level;
}

/**
 * Fix an Euler puzzle by adding edges between odd-degree vertices
 * @param {Object} level - Level definition that may have odd-degree vertices
 * @returns {Object} Fixed level definition
 */
function fixEulerPuzzle(level) {
    const graph = new Graph();

    for (const node of level.nodes) {
        graph.addNode(node.id, node.x, node.y, node.label);
    }
    for (const edge of level.edges) {
        graph.addEdge(edge[0], edge[1]);
    }

    const edges = [...level.edges];
    const edgeSet = new Set(edges.map(e => edgeKey(e[0], e[1])));

    // Find odd-degree vertices
    let oddVertices = [];
    for (const [nodeId] of graph.nodes) {
        if (graph.getDegree(nodeId) % 2 !== 0) {
            oddVertices.push(nodeId);
        }
    }

    // Pair up odd vertices and add edges
    while (oddVertices.length >= 2) {
        const a = oddVertices.pop();
        const b = oddVertices.pop();

        const key = edgeKey(a, b);
        if (!edgeSet.has(key)) {
            edges.push([a, b]);
            edgeSet.add(key);
            graph.addEdge(a, b);
        } else {
            // Edge already exists, find another vertex to bridge through
            for (let i = 0; i < level.nodes.length; i++) {
                if (i !== a && i !== b) {
                    const keyAI = edgeKey(a, i);
                    const keyBI = edgeKey(b, i);
                    if (!edgeSet.has(keyAI) && !edgeSet.has(keyBI)) {
                        edges.push([a, i], [b, i]);
                        edgeSet.add(keyAI);
                        edgeSet.add(keyBI);
                        graph.addEdge(a, i);
                        graph.addEdge(b, i);
                        // i now has +2 degree, still even if it was even
                        // a and b each have +1, so now even
                        break;
                    }
                }
            }
        }
    }

    const fixedLevel = {
        ...level,
        edges
    };

    // Validate again
    const result = validateLevel(fixedLevel);
    if (!result.valid) {
        // Last resort: return a simple cycle
        console.error('Could not fix Euler puzzle, returning simple cycle');
        return generateEulerPuzzle(level.nodes.length, 0);
    }

    return fixedLevel;
}

/**
 * Create a unique key for an edge (order-independent)
 */
function edgeKey(a, b) {
    return a < b ? `${a}-${b}` : `${b}-${a}`;
}

/**
 * Generate a puzzle of specified type and difficulty
 * @param {string} type - 'euler' or 'hamilton'
 * @param {string} difficulty - 'easy', 'medium', or 'hard'
 * @returns {Object} Level definition
 */
export function generatePuzzle(type, difficulty = 'medium') {
    const sizes = {
        easy: { nodes: 4, extra: 1 },
        medium: { nodes: 6, extra: 2 },
        hard: { nodes: 9, extra: 4 }
    };

    const config = sizes[difficulty] || sizes.medium;

    if (type === 'euler') {
        return generateEulerPuzzle(config.nodes, config.extra);
    } else {
        return generateHamiltonPuzzle(config.nodes, config.extra);
    }
}
