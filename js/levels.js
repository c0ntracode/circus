/**
 * Level definitions for circuit puzzles
 *
 * Each level has:
 * - id: unique identifier
 * - name: display name
 * - type: 'euler' or 'hamilton'
 * - nodes: array of {id, x, y, label?}
 * - edges: array of [fromId, toId]
 */

export const levels = [
    // === EULER CIRCUITS ===
    {
        id: 1,
        name: "Triangle",
        type: "euler",
        description: "A simple triangle - the easiest Euler circuit.",
        nodes: [
            { id: 0, x: 2, y: 0, label: "A" },
            { id: 1, x: 0, y: 3, label: "B" },
            { id: 2, x: 4, y: 3, label: "C" }
        ],
        edges: [
            [0, 1], [1, 2], [2, 0]
        ]
    },
    {
        id: 2,
        name: "Square",
        type: "euler",
        description: "A square has 4 vertices of degree 2.",
        nodes: [
            { id: 0, x: 0, y: 0, label: "A" },
            { id: 1, x: 3, y: 0, label: "B" },
            { id: 2, x: 3, y: 3, label: "C" },
            { id: 3, x: 0, y: 3, label: "D" }
        ],
        edges: [
            [0, 1], [1, 2], [2, 3], [3, 0]
        ]
    },
    {
        id: 3,
        name: "Bowtie",
        type: "euler",
        description: "Two triangles sharing a vertex. The center has degree 4.",
        nodes: [
            { id: 0, x: 0, y: 1, label: "A" },
            { id: 1, x: 0, y: 3, label: "B" },
            { id: 2, x: 2, y: 2, label: "C" },
            { id: 3, x: 4, y: 1, label: "D" },
            { id: 4, x: 4, y: 3, label: "E" }
        ],
        edges: [
            [0, 1], [1, 2], [2, 0],
            [2, 3], [3, 4], [4, 2]
        ]
    },
    {
        id: 4,
        name: "Crystal",
        type: "euler",
        description: "A triangular prism with face diagonals. All vertices have degree 4.",
        nodes: [
            { id: 0, x: 1, y: 0, label: "A" },
            { id: 1, x: 3, y: 0, label: "B" },
            { id: 2, x: 2, y: 1.5, label: "C" },
            { id: 3, x: 1, y: 3.5, label: "D" },
            { id: 4, x: 3, y: 3.5, label: "E" },
            { id: 5, x: 2, y: 2, label: "F" }
        ],
        edges: [
            // Top triangle
            [0, 1], [1, 2], [2, 0],
            // Bottom triangle
            [3, 4], [4, 5], [5, 3],
            // Vertical edges
            [0, 3], [1, 4], [2, 5],
            // Face diagonals (to make all degrees 4)
            [0, 4], [1, 5], [2, 3]
        ]
    },
    {
        id: 5,
        name: "Complete K5",
        type: "euler",
        description: "Complete graph on 5 vertices. Every vertex has degree 4.",
        nodes: [
            { id: 0, x: 2, y: 0, label: "A" },
            { id: 1, x: 4, y: 1.5, label: "B" },
            { id: 2, x: 3.2, y: 3.5, label: "C" },
            { id: 3, x: 0.8, y: 3.5, label: "D" },
            { id: 4, x: 0, y: 1.5, label: "E" }
        ],
        edges: [
            [0, 1], [0, 2], [0, 3], [0, 4],
            [1, 2], [1, 3], [1, 4],
            [2, 3], [2, 4],
            [3, 4]
        ]
    },

    // === HAMILTON CIRCUITS ===
    {
        id: 6,
        name: "Simple Square",
        type: "hamilton",
        description: "Visit every vertex exactly once and return home.",
        nodes: [
            { id: 0, x: 0, y: 0, label: "A" },
            { id: 1, x: 3, y: 0, label: "B" },
            { id: 2, x: 3, y: 3, label: "C" },
            { id: 3, x: 0, y: 3, label: "D" }
        ],
        edges: [
            [0, 1], [1, 2], [2, 3], [3, 0]
        ]
    },
    {
        id: 7,
        name: "Pentagon",
        type: "hamilton",
        description: "A 5-vertex cycle - find the Hamilton circuit.",
        nodes: [
            { id: 0, x: 2, y: 0, label: "A" },
            { id: 1, x: 4, y: 1.5, label: "B" },
            { id: 2, x: 3.2, y: 3.5, label: "C" },
            { id: 3, x: 0.8, y: 3.5, label: "D" },
            { id: 4, x: 0, y: 1.5, label: "E" }
        ],
        edges: [
            [0, 1], [1, 2], [2, 3], [3, 4], [4, 0]
        ]
    },
    {
        id: 8,
        name: "Petersen's Challenge",
        type: "hamilton",
        description: "A graph with extra edges. Find the right path!",
        nodes: [
            { id: 0, x: 0, y: 0, label: "A" },
            { id: 1, x: 3, y: 0, label: "B" },
            { id: 2, x: 4, y: 2, label: "C" },
            { id: 3, x: 1.5, y: 4, label: "D" },
            { id: 4, x: -1, y: 2, label: "E" }
        ],
        edges: [
            [0, 1], [1, 2], [2, 3], [3, 4], [4, 0],
            [0, 2], [1, 3]
        ]
    },
    {
        id: 9,
        name: "Hexagon Plus",
        type: "hamilton",
        description: "Six vertices with some diagonals. Multiple solutions exist!",
        nodes: [
            { id: 0, x: 1, y: 0, label: "A" },
            { id: 1, x: 3, y: 0, label: "B" },
            { id: 2, x: 4, y: 1.7, label: "C" },
            { id: 3, x: 3, y: 3.4, label: "D" },
            { id: 4, x: 1, y: 3.4, label: "E" },
            { id: 5, x: 0, y: 1.7, label: "F" }
        ],
        edges: [
            [0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 0],
            [0, 3], [1, 4], [2, 5]
        ]
    },
    {
        id: 10,
        name: "The Cube",
        type: "hamilton",
        description: "Vertices and edges of a cube. Find the Hamilton circuit.",
        nodes: [
            { id: 0, x: 0, y: 1, label: "A" },
            { id: 1, x: 3, y: 1, label: "B" },
            { id: 2, x: 3, y: 3.5, label: "C" },
            { id: 3, x: 0, y: 3.5, label: "D" },
            { id: 4, x: 1, y: 0, label: "E" },
            { id: 5, x: 4, y: 0, label: "F" },
            { id: 6, x: 4, y: 2.5, label: "G" },
            { id: 7, x: 1, y: 2.5, label: "H" }
        ],
        edges: [
            // Front face
            [0, 1], [1, 2], [2, 3], [3, 0],
            // Back face
            [4, 5], [5, 6], [6, 7], [7, 4],
            // Connecting edges
            [0, 4], [1, 5], [2, 6], [3, 7]
        ]
    }
];

export function getLevelById(id) {
    return levels.find(l => l.id === id);
}

export function getNextLevel(currentId) {
    const idx = levels.findIndex(l => l.id === currentId);
    if (idx >= 0 && idx < levels.length - 1) {
        return levels[idx + 1];
    }
    return null;
}

export function getPrevLevel(currentId) {
    const idx = levels.findIndex(l => l.id === currentId);
    if (idx > 0) {
        return levels[idx - 1];
    }
    return null;
}
