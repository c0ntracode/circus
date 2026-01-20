/**
 * Test script to validate all puzzle levels
 * Run with: node js/validate-levels.js
 */

import { levels } from './levels.js';
import { validateAllLevels, printValidationReport } from './validator.js';

const results = validateAllLevels(levels);
printValidationReport(results);

// Exit with error code if any levels are invalid
if (results.invalid > 0) {
    console.error(`ERROR: ${results.invalid} level(s) are unsolvable!`);
    process.exit(1);
}

console.log('All levels validated successfully!');
