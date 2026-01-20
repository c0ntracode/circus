/**
 * Test script for random puzzle generator
 * Run with: node js/test-generator.js
 */

import { generateEulerPuzzle, generateHamiltonPuzzle, generatePuzzle } from './generator.js';
import { validateLevel } from './validator.js';

const NUM_TESTS = 20;

console.log('=== Random Puzzle Generator Tests ===\n');

// Test Hamilton puzzles
console.log(`Testing ${NUM_TESTS} random Hamilton puzzles...`);
let hamiltonPass = 0;
let hamiltonFail = 0;

for (let i = 0; i < NUM_TESTS; i++) {
    const nodeCount = 4 + Math.floor(Math.random() * 7); // 4-10 nodes
    const extraEdges = Math.floor(Math.random() * 5);
    const puzzle = generateHamiltonPuzzle(nodeCount, extraEdges);
    const result = validateLevel(puzzle);

    if (result.valid) {
        hamiltonPass++;
    } else {
        hamiltonFail++;
        console.log(`  FAIL: ${nodeCount} nodes, ${extraEdges} extra edges`);
        console.log(`    Errors: ${result.errors.join(', ')}`);
    }
}

console.log(`  Passed: ${hamiltonPass}/${NUM_TESTS}`);
if (hamiltonFail > 0) {
    console.log(`  Failed: ${hamiltonFail}/${NUM_TESTS}`);
}

// Test Euler puzzles
console.log(`\nTesting ${NUM_TESTS} random Euler puzzles...`);
let eulerPass = 0;
let eulerFail = 0;

for (let i = 0; i < NUM_TESTS; i++) {
    const nodeCount = 3 + Math.floor(Math.random() * 8); // 3-10 nodes
    const extraPairs = Math.floor(Math.random() * 4);
    const puzzle = generateEulerPuzzle(nodeCount, extraPairs);
    const result = validateLevel(puzzle);

    if (result.valid) {
        eulerPass++;
    } else {
        eulerFail++;
        console.log(`  FAIL: ${nodeCount} nodes, ${extraPairs} extra pairs`);
        console.log(`    Errors: ${result.errors.join(', ')}`);
    }
}

console.log(`  Passed: ${eulerPass}/${NUM_TESTS}`);
if (eulerFail > 0) {
    console.log(`  Failed: ${eulerFail}/${NUM_TESTS}`);
}

// Test difficulty levels
console.log('\nTesting difficulty levels...');
for (const difficulty of ['easy', 'medium', 'hard']) {
    for (const type of ['euler', 'hamilton']) {
        const puzzle = generatePuzzle(type, difficulty);
        const result = validateLevel(puzzle);
        const status = result.valid ? 'OK' : 'FAIL';
        console.log(`  ${type} ${difficulty}: ${status} (${puzzle.nodes.length} nodes, ${puzzle.edges.length} edges)`);
    }
}

// Summary
console.log('\n=== Summary ===');
const totalPass = hamiltonPass + eulerPass;
const totalTests = NUM_TESTS * 2;
console.log(`Total: ${totalPass}/${totalTests} tests passed`);

if (hamiltonFail > 0 || eulerFail > 0) {
    console.error('\nSome tests failed!');
    process.exit(1);
}

console.log('\nAll tests passed!');
