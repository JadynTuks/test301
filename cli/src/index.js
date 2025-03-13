#!/usr/bin/env node

// Import only the commands - remove all duplicate command definitions
import program from './commands.js';

// Parse command line arguments
program.parse(process.argv);

// Show help if no arguments provided
if (process.argv.length <= 2) {
  program.help();
}