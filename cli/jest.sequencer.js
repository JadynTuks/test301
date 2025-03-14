// jest.sequencer.js
import pkg from '@jest/test-sequencer';
const { Sequencer } = pkg;
import path from 'path';

/**
 * Custom test sequencer to ensure tests run in a specific order
 * to prevent race conditions and dependency issues.
 */
export default class CustomSequencer extends Sequencer {
  /**
   * Sort test paths in the desired execution order
   * @param {Array} tests - Array of test files
   * @returns {Array} Sorted test array
   */
  sort(tests) {
    // Define the desired test order by filename
    const testOrder = [
      'apiClient.test.js',
      'commands.test.js',
      'index.test.js'
    ];
    
    // Return tests sorted by the order defined above
    return [...tests].sort((a, b) => {
      const aFilename = path.basename(a.path);
      const bFilename = path.basename(b.path);
      
      const aIndex = testOrder.indexOf(aFilename);
      const bIndex = testOrder.indexOf(bFilename);
      
      // If both files are in the order list, sort by their position
      if (aIndex !== -1 && bIndex !== -1) {
        return aIndex - bIndex;
      }
      
      // If only one file is in the order list, prioritize it
      if (aIndex !== -1) return -1;
      if (bIndex !== -1) return 1;
      
      // Default to alphabetical sorting for any other files
      return aFilename.localeCompare(bFilename);
    });
  }
}