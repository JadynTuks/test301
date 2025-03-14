// commands-helper.js
import program from './commands.js';

/**
 * This helper function transforms the Commander commands into a testable format
 * by extracting the action functions and making them directly callable
 */
export function prepareCommandsForTesting() {
  // Make commands testable by exposing their action functions
  program.commands.forEach(cmd => {
    const originalAction = cmd._actionHandler;
    
    if (originalAction) {
      // Add a property that can be directly called in tests
      cmd.actionFunction = async (...args) => {
        return await originalAction(...args);
      };
    } else {
      console.warn(`Warning: Command ${cmd.name()} does not have an action handler.`);
    }
  });
  
  return program;
}

// Export the program directly to make it accessible in tests
export { program };

// Export the prepared commands as default
export default prepareCommandsForTesting();