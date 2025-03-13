# MPDB CLI - Command Line Interface for MPDB Database

![version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![license](https://img.shields.io/badge/license-ISC-green.svg)

A powerful command-line interface for interacting with MPDB databases, designed to provide robust, efficient, and secure access to database operations.

## Overview

MPDB CLI is a Node.js-based command line tool that allows users to interact with MPDB databases. It provides a comprehensive set of commands for managing databases, collections, and documents through a simple and intuitive interface.

## Features

- **Database Management**: Create and list databases
- **Collection Management**: Create and list collections within databases
- **Document Operations**: Create, read, update, delete, and query documents
- **Interactive Mode**: Use interactive prompts for creating and updating documents
- **Smart API Discovery**: Automatically detects and connects to the API server
- **Connection Diagnostics**: Advanced tools for diagnosing and repairing connection issues

## Installation

### Prerequisites

- Node.js (v12 or higher)
- npm (v6 or higher)

### Install from Source

1. Clone this repository
   ```
   git clone <repository-url>
   cd mpdb-cli
   ```

2. Install dependencies
   ```
   npm install
   ```

3. Install globally on your system
   ```
   npm run install-local
   ```

## Quick Start

After installation, verify the CLI is working properly:

```bash
mpdb --version
```

This should display the version number (1.0.0).

To see available commands:

```bash
mpdb help
```

## Configuration

MPDB CLI looks for the API endpoint in the following order:

1. Environment variable: `MPDB_API_ENDPOINT`
2. Configuration file: `db.json` in the current directory
3. Default: `http://localhost:5000`

You can configure the API endpoint manually:

```bash
mpdb connect:config
```

## Usage

### Database Operations

List all databases:
```bash
mpdb db:list
```

Create a new database:
```bash
mpdb db:create mydatabase
```

### Collection Operations

List all collections in a database:
```bash
mpdb collection:list mydatabase
```

Create a new collection:
```bash
mpdb collection:create mydatabase mycollection
```

### Document Operations

List all documents in a collection:
```bash
mpdb doc:list mydatabase mycollection
```

Get a specific document:
```bash
mpdb doc:get mydatabase mycollection documentId
```

Create a new document (interactive mode):
```bash
mpdb doc:create mydatabase mycollection
```

Create a new document (with JSON data):
```bash
mpdb doc:create mydatabase mycollection --data '{"name": "John", "age": 30}'
```

Update a document (interactive mode):
```bash
mpdb doc:update mydatabase mycollection documentId
```

Update a document (with JSON data):
```bash
mpdb doc:update mydatabase mycollection documentId --data '{"name": "Updated Name"}'
```

Delete a document:
```bash
mpdb doc:delete mydatabase mycollection documentId
```

Query documents:
```bash
mpdb doc:query mydatabase mycollection --query '{"age": {"$gt": 25}}'
```

### Connection Management

Test connectivity:
```bash
mpdb connect:test
```

Repair connection issues:
```bash
mpdb connect:repair
```

## API Client

The CLI communicates with the MPDB API server, which acts as a bridge between the CLI and the database daemon. The API client handles:

- Connection establishment and management
- API endpoint discovery
- Request/response handling
- Error handling and reporting

## Architecture

The CLI follows a modular architecture:

- **index.js**: Entry point that initializes the CLI
- **commands.js**: Defines all CLI commands and their handlers
- **apiClient.js**: Manages communication with the API server

## Security

- The CLI supports authenticated sessions (via the API)
- User roles and permissions are enforced through the API
- Supports encrypted communication with the API server

## Connection Diagnostics

For troubleshooting connectivity issues, the CLI provides comprehensive diagnostic tools:

```bash
mpdb connect:test
```

This command will:
1. Test connectivity to the API server
2. Verify API to daemon connection
3. Display network configuration information
4. Attempt to discover alternative endpoints

## Documentation

For more detailed documentation on specific commands, use:

```bash
mpdb help [command]
```

## Requirements

MPDB CLI fulfills the following key requirements:

### Functional Requirements

- **CLI Launching**: Run from local command prompt
- **Database Operations**: Create, read, update, delete
- **Collection Operations**: Create, list
- **Document Operations**: Create, read, update, delete, query
- **Command Syntax**: Interactive help for command errors
- **Display**: Presentable results for queries

### Non-functional Requirements

- **Performance**: Fast response time (results within a second)
- **Quality**: High availability (99% uptime)
- **Safety**: Database protection against query failures
- **Security**: Authentication and role-based access

## Troubleshooting

### Common Issues

1. **Cannot connect to API server**
   - Check if the API server is running
   - Run `mpdb connect:test` to diagnose
   - Run `mpdb connect:repair` to fix common issues

2. **Command not found**
   - Ensure CLI is installed globally (`npm run install-local`)
   - Check your PATH environment variable

3. **Authentication failures**
   - Verify your credentials
   - Ensure the API server is running

## Development

### Building from Source

1. Clone the repository
2. Install dependencies with `npm install`
3. Make your changes
4. Test with `node index.js [command]`

### Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request