// commands.test.js
import { jest, describe, test, expect } from '@jest/globals';
import program from './commands.js';

describe('CLI Commands', () => {
  test('Program should be defined', () => {
    expect(program).toBeDefined();
  });
});