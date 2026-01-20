/**
 * Puzzle validator module
 * Verifies that puzzles are solvable before presenting them to players.
 */

import { Graph, createGraphFromLevel } from './graph.js';

/**
 * Validate a single level definition
 * @param {Object} level - Level definition with nodes, edges, and type
 * @returns {Object} Validation result with valid flag and details
 */
export function validateLevel(level) {
    const result = {
        valid: false,
        levelId: level.id,
        levelName: level.name,
        type: level.type,
        nodeCount: level.nodes.length,
        edgeCount: level.edges.length,
        errors: [],
        warnings: []
    };

    // Basic structure validation
    if (!level.nodes || level.nodes.length === 0) {
        result.errors.push('Level has no nodes');
        return result;
    }

    if (!level.edges || level.edges.length === 0) {
        result.errors.push('Level has no edges');
        return result;
    }

    if (!level.type || !['euler', 'hamilton'].includes(level.type)) {
        result.errors.push(`Invalid level type: ${level.type}`);
        return result;
    }

    // Create graph from level
    const graph = createGraphFromLevel(level);

    // Check connectivity
    if (!graph.isConnected()) {
        result.errors.push('Graph is not connected');
        return result;
    }

    // Type-specific validation
    if (level.type === 'euler') {
        const eulerResult = validateEulerLevel(graph, result);
        return eulerResult;
    } else {
        const hamiltonResult = validateHamiltonLevel(graph, result);
        return hamiltonResult;
    }
}

/**
 * Validate an Euler circuit level
 */
function validateEulerLevel(graph, result) {
    // Check that every vertex has even degree
    const oddDegreeNodes = [];
    for (const [nodeId] of graph.nodes) {
        const degree = graph.getDegree(nodeId);
        if (degree % 2 !== 0) {
            const nodeData = graph.nodes.get(nodeId);
            oddDegreeNodes.push(`${nodeData.label} (degree ${degree})`);
        }
    }

    if (oddDegreeNodes.length > 0) {
        result.errors.push(`Euler circuit impossible: nodes with odd degree: ${oddDegreeNodes.join(', ')}`);
        return result;
    }

    // Double-check with the graph method
    if (!graph.hasEulerCircuit()) {
        result.errors.push('Euler circuit check failed');
        return result;
    }

    result.valid = true;
    return result;
}

/**
 * Validate a Hamilton circuit level
 */
function validateHamiltonLevel(graph, result) {
    // Warn for large graphs
    if (graph.nodes.size > 12) {
        result.warnings.push(`Large graph (${graph.nodes.size} nodes) - Hamilton validation may be slow`);
    }

    // Check if Hamilton circuit exists
    if (!graph.hasHamiltonCircuit()) {
        result.errors.push('No Hamilton circuit exists');
        return result;
    }

    result.valid = true;
    return result;
}

/**
 * Validate all levels in an array
 * @param {Array} levels - Array of level definitions
 * @returns {Object} Summary with results for each level
 */
export function validateAllLevels(levels) {
    const results = {
        total: levels.length,
        valid: 0,
        invalid: 0,
        levels: []
    };

    for (const level of levels) {
        const levelResult = validateLevel(level);
        results.levels.push(levelResult);

        if (levelResult.valid) {
            results.valid++;
        } else {
            results.invalid++;
        }
    }

    return results;
}

/**
 * Print validation results to console
 * @param {Object} results - Results from validateAllLevels
 */
export function printValidationReport(results) {
    console.log('\n=== Puzzle Validation Report ===\n');
    console.log(`Total levels: ${results.total}`);
    console.log(`Valid: ${results.valid}`);
    console.log(`Invalid: ${results.invalid}`);
    console.log('');

    for (const level of results.levels) {
        const status = level.valid ? '✓' : '✗';
        console.log(`${status} Level ${level.levelId}: ${level.levelName} (${level.type})`);
        console.log(`  Nodes: ${level.nodeCount}, Edges: ${level.edgeCount}`);

        if (level.warnings.length > 0) {
            for (const warning of level.warnings) {
                console.log(`  ⚠ ${warning}`);
            }
        }

        if (level.errors.length > 0) {
            for (const error of level.errors) {
                console.log(`  ✗ ${error}`);
            }
        }
    }

    console.log('\n================================\n');
}

/**
 * Quick check if a level is solvable (convenience function)
 * @param {Object} level - Level definition
 * @returns {boolean} true if solvable
 */
export function isLevelSolvable(level) {
    return validateLevel(level).valid;
}
