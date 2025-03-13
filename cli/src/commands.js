#!/usr/bin/env node 
/** 
 * @file commands.js
 * @brief Command Line Interface (CLI) for interacting with the API
 */

/**
 * @brief Importing required libraries.
 */
import { program } from 'commander';
import api from './apiClient.js';
import chalk from 'chalk';
import inquirer from 'inquirer';
import fs from 'fs';
import os from 'os';
import path from 'path';

/**
 * @brief Define CLI commands and metadata.
 */
program
  .name('mpdb')
  .description('MPDB CLI - Command line interface for MPDB database')
  .version('1.0.0');

// Database commands
program
  .command('db:list')
  .description('List all databases')
  .action(async () => {
    try {
      const result = await api.getDatabases();
      console.log(chalk.green('Available databases:'));
      if (result.databases && result.databases.length > 0) {
        result.databases.forEach(db => console.log(`  - ${db}`));
      } else {
        console.log('  No databases found');
      }
    } catch (error) {
      console.error(chalk.red(`Error: ${error.message}`));
    }
  });

program
  .command('db:create <dbName>')
  .description('Create a new database')
  .action(async (dbName) => {
    try {
      const result = await api.createDatabase(dbName);
      console.log(chalk.green(`Database '${dbName}' created successfully`));
    } catch (error) {
      console.error(chalk.red(`Error: ${error.message}`));
    }
  });

// Collection commands
program
  .command('collection:list <dbName>')
  .description('List all collections in a database')
  .action(async (dbName) => {
    try {
      const result = await api.getCollections(dbName);
      console.log(chalk.green(`Collections in '${dbName}':`));
      if (result.collections && result.collections.length > 0) {
        result.collections.forEach(col => console.log(`  - ${col}`));
      } else {
        console.log('  No collections found');
      }
    } catch (error) {
      console.error(chalk.red(`Error: ${error.message}`));
    }
  });

program
  .command('collection:create <dbName> <collectionName>')
  .description('Create a new collection')
  .action(async (dbName, collectionName) => {
    try {
      const result = await api.createCollection(dbName, collectionName);
      console.log(chalk.green(`Collection '${collectionName}' created in database '${dbName}'`));
    } catch (error) {
      console.error(chalk.red(`Error: ${error.message}`));
    }
  });

// Document commands
program
  .command('doc:list <dbName> <collectionName>')
  .description('List all documents in a collection')
  .action(async (dbName, collectionName) => {
    try {
      const result = await api.getDocuments(dbName, collectionName);
      console.log(chalk.green(`Documents in '${dbName}.${collectionName}':`));
      if (result.documents) {
        console.log(JSON.stringify(result.documents, null, 2));
      } else {
        console.log('  No documents found');
      }
    } catch (error) {
      console.error(chalk.red(`Error: ${error.message}`));
    }
  });

program
  .command('doc:get <dbName> <collectionName> <documentId>')
  .description('Get a document by ID')
  .action(async (dbName, collectionName, documentId) => {
    try {
      const result = await api.getDocument(dbName, collectionName, documentId);
      console.log(chalk.green(`Document '${documentId}':`));
      if (result.document) {
        console.log(JSON.stringify(result.document, null, 2));
      } else {
        console.log('  Document not found');
      }
    } catch (error) {
      console.error(chalk.red(`Error: ${error.message}`));
    }
  });

program
  .command('doc:create <dbName> <collectionName>')
  .description('Create a new document')
  .option('-d, --data <json>', 'Document data as JSON string')
  .action(async (dbName, collectionName, options) => {
    try {
      let document;
      
      if (options.data) {
        document = JSON.parse(options.data);
      } else {
        // Interactive mode
        const answers = await inquirer.prompt([
          {
            type: 'editor',
            name: 'document',
            message: 'Enter document JSON:',
            validate: input => {
              try {
                JSON.parse(input);
                return true;
              } catch (e) {
                return 'Invalid JSON format';
              }
            }
          }
        ]);
        document = JSON.parse(answers.document);
      }
      
      const result = await api.insertDocument(dbName, collectionName, document);
      console.log(chalk.green(`Document created with ID: ${result.documentId}`));
    } catch (error) {
      console.error(chalk.red(`Error: ${error.message}`));
    }
  });

program
  .command('doc:update <dbName> <collectionName> <documentId>')
  .description('Update a document')
  .option('-d, --data <json>', 'Update data as JSON string')
  .action(async (dbName, collectionName, documentId, options) => {
    try {
      let updates;
      
      if (options.data) {
        updates = JSON.parse(options.data);
      } else {
        // Interactive mode
        const answers = await inquirer.prompt([
          {
            type: 'editor',
            name: 'updates',
            message: 'Enter updates as JSON:',
            validate: input => {
              try {
                JSON.parse(input);
                return true;
              } catch (e) {
                return 'Invalid JSON format';
              }
            }
          }
        ]);
        updates = JSON.parse(answers.updates);
      }
      
      const result = await api.updateDocument(dbName, collectionName, documentId, updates);
      console.log(chalk.green(`Document '${documentId}' updated successfully`));
    } catch (error) {
      console.error(chalk.red(`Error: ${error.message}`));
    }
  });

program
  .command('doc:delete <dbName> <collectionName> <documentId>')
  .description('Delete a document')
  .action(async (dbName, collectionName, documentId) => {
    try {
      const result = await api.deleteDocument(dbName, collectionName, documentId);
      console.log(chalk.green(`Document '${documentId}' deleted successfully`));
    } catch (error) {
      console.error(chalk.red(`Error: ${error.message}`));
    }
  });

program
  .command('doc:query <dbName> <collectionName>')
  .description('Query documents in a collection')
  .option('-q, --query <json>', 'Query as JSON string')
  .action(async (dbName, collectionName, options) => {
    try {
      let query;
      
      if (options.query) {
        query = JSON.parse(options.query);
      } else {
        // Interactive mode
        const answers = await inquirer.prompt([
          {
            type: 'editor',
            name: 'query',
            message: 'Enter query as JSON:',
            validate: input => {
              try {
                JSON.parse(input);
                return true;
              } catch (e) {
                return 'Invalid JSON format';
              }
            }
          }
        ]);
        query = JSON.parse(answers.query);
      }
      
      const result = await api.queryDocuments(dbName, collectionName, query);
      console.log(chalk.green('Query results:'));
      console.log(JSON.stringify(result.documents || [], null, 2));
    } catch (error) {
      console.error(chalk.red(`Error: ${error.message}`));
    }
  });

// Enhanced connectivity testing commands
program
  .command('connect:test')
  .description('Run comprehensive connectivity tests between CLI, API, and daemon')
  .action(async () => {
    try {
      console.log(chalk.blue('🔍 Running MPDB Connectivity Tests'));
      
      // Step 1: Try to connect to API
      console.log('\n' + chalk.yellow('1. Testing CLI to API connection...'));
      try {
        const apiHealth = await api.getHealth();
        console.log(chalk.green(`✅ Successfully connected to API at ${api.getCurrentEndpoint()}`));
        console.log(chalk.green(`   API health status: ${apiHealth.status}`));
        console.log(chalk.green(`   API timestamp: ${apiHealth.timestamp}`));
      } catch (error) {
        console.log(chalk.red(`❌ Failed to connect to API: ${error.message}`));
        
        // Try to discover API endpoint
        console.log(chalk.yellow('\n   Attempting to discover API endpoint...'));
        try {
          await api.rediscoverEndpoint();
          console.log(chalk.green(`✅ Discovered and connected to API at ${api.getCurrentEndpoint()}`));
        } catch (discoverError) {
          console.log(chalk.red(`❌ API discovery failed: ${discoverError.message}`));
          console.log(chalk.red('\nConnection test failed. Please make sure the API server is running.'));
          return;
        }
      }
      
      // Step 2: Test API to daemon connection
      console.log('\n' + chalk.yellow('2. Testing API to daemon connection...'));
      try {
        const dbList = await api.getDatabases();
        console.log(chalk.green('✅ API successfully connected to daemon'));
        console.log(chalk.green(`   Available databases: ${dbList.databases ? dbList.databases.join(', ') : 'None'}`));
      } catch (error) {
        console.log(chalk.red(`❌ API to daemon connection failed: ${error.message}`));
        console.log(chalk.red('   Possible causes:'));
        console.log(chalk.red('   - Daemon not running'));
        console.log(chalk.red('   - Network configuration issue between API and daemon'));
        console.log(chalk.red('   - API cannot resolve daemon host'));
      }
      
      // Step 3: Get detailed connection info
      console.log('\n' + chalk.yellow('3. Detailed connection information:'));
      const connInfo = await api.getConnectionInfo();
      
      console.log('\nNetwork interfaces:');
      for (const [name, addrs] of Object.entries(connInfo.networkInterfaces)) {
        for (const addr of addrs) {
          const isInternal = addr.internal ? ' (internal)' : '';
          console.log(chalk.cyan(`• ${name}: ${addr.address}${isInternal}`));
        }
      }
      
      console.log('\nConnection configuration:');
      console.log(chalk.cyan(`• Configured API endpoint: ${connInfo.configuredEndpoint}`));
      console.log(chalk.cyan(`• Current active endpoint: ${connInfo.currentEndpoint}`));
      
      console.log('\nConnection test completed.');
    } catch (error) {
      console.error(chalk.red(`Error during connection test: ${error.message}`));
    }
  });

// Command to fix connection issues automatically
program
  .command('connect:repair')
  .description('Attempt to automatically fix connection issues')
  .action(async () => {
    try {
      console.log(chalk.blue('🔧 Running MPDB Connection Repair'));
      
      // Step 1: Clear the existing configuration
      const configPath = path.join(process.cwd(), 'src', 'db.json');
      console.log(chalk.yellow('1. Resetting API endpoint configuration...'));
      
      try {
        // Write a default configuration
        fs.writeFileSync(configPath, JSON.stringify({ apiEndpoint: 'http://localhost:5000' }, null, 2));
        console.log(chalk.green('✅ Reset API endpoint to default (http://localhost:5000)'));
      } catch (fsError) {
        console.log(chalk.red(`❌ Could not reset configuration: ${fsError.message}`));
      }
      
      // Step 2: Force rediscovery
      console.log(chalk.yellow('\n2. Discovering API endpoint...'));
      try {
        const discoveredEndpoint = await api.discoverApiEndpoint();
        if (discoveredEndpoint) {
          console.log(chalk.green(`✅ Discovered API at ${discoveredEndpoint}`));
        } else {
          console.log(chalk.red('❌ Could not discover API endpoint'));
          console.log(chalk.yellow('\nPlease make sure the API server is running on this machine or network.'));
        }
      } catch (discoverError) {
        console.log(chalk.red(`❌ API discovery failed: ${discoverError.message}`));
      }
      
      // Step 3: Test the connection
      console.log(chalk.yellow('\n3. Testing connection...'));
      try {
        await api.rediscoverEndpoint();
        const health = await api.getHealth();
        console.log(chalk.green(`✅ Successfully connected to API at ${api.getCurrentEndpoint()}`));
        console.log(chalk.green(`   API health status: ${health.status}`));
      } catch (error) {
        console.log(chalk.red(`❌ Connection test failed: ${error.message}`));
      }
      
      console.log('\nConnection repair completed.');
    } catch (error) {
      console.error(chalk.red(`Error during connection repair: ${error.message}`));
    }
  });

// Add a manual configuration command
program
  .command('connect:config')
  .description('Manually configure API endpoint')
  .action(async () => {
    try {
      const currentEndpoint = api.getCurrentEndpoint();
      
      // Get user input for new endpoint
      const answers = await inquirer.prompt([
        {
          type: 'input',
          name: 'endpoint',
          message: 'Enter API endpoint URL:',
          default: currentEndpoint,
          validate: input => {
            if (!input.startsWith('http://') && !input.startsWith('https://')) {
              return 'URL must start with http:// or https://';
            }
            return true;
          }
        }
      ]);
      
      // Use process.cwd() instead of fileURLToPath
      const configPath = path.join(process.cwd(), 'src', 'db.json');
      fs.writeFileSync(configPath, JSON.stringify({ apiEndpoint: answers.endpoint }, null, 2));
      
      console.log(chalk.green(`✅ API endpoint configured to: ${answers.endpoint}`));
      
      // Test the connection
      console.log(chalk.yellow('\nTesting connection to new endpoint...'));
      try {
        // Force reload of the configuration
        await api.rediscoverEndpoint();
        const health = await api.getHealth();
        console.log(chalk.green(`✅ Successfully connected to API at ${answers.endpoint}`));
      } catch (error) {
        console.log(chalk.red(`❌ Connection test failed: ${error.message}`));
        console.log(chalk.yellow('Configuration saved, but connection was not successful.'));
      }
    } catch (error) {
      console.error(chalk.red(`Error configuring endpoint: ${error.message}`));
    }
  });

export default program;