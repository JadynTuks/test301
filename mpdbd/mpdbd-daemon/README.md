# MPDB (Mini Persistence Database Daemon)

## Overview

MPDB is a lightweight, JSON-based database daemon implemented in Java. It provides a simple yet robust persistence layer for applications through a TCP socket interface. The daemon handles basic database operations like creating, reading, updating, and deleting data (CRUD operations) while maintaining data persistence through a file-based storage system.

## Features

- **JSON-based Storage**: All data is stored in JSON format for easy inspection and manipulation
- **TCP Socket Interface**: Connect and interact with the database through a standard TCP socket
- **Document-Oriented Structure**: Organize data in databases, collections, and documents
- **Persistence**: Automatic data persistence to disk
- **Concurrency**: Thread-safe operations using ConcurrentHashMap
- **Query Capabilities**: Basic querying with filtering, sorting, and pagination
- **Low Memory Footprint**: Designed to run with minimal system resources

## Getting Started

### Prerequisites

- Java JDK 11 or higher
- Maven 3.6 or higher

### Building the Project

Clone the repository and build the project using Maven:

```bash
git clone https://github.com/COS301-SE-2025/MP6.git
cd COS301
mvn clean package
```

This will create two JAR files in the `target` directory:
- `COS301-1.0-SNAPSHOT.jar`: The basic JAR file
- `COS301-1.0-SNAPSHOT-jar-with-dependencies.jar`: A self-contained executable JAR with all dependencies

### Running the Daemon

To start the MPDB daemon:

```bash
java -jar target/COS301-1.0-SNAPSHOT-jar-with-dependencies.jar
```

By default, the daemon will:
- Start a TCP server on port 3000
- Create a `data` directory if it doesn't exist
- Load or initialize the database file at `data/mpdb_data.json`

## Connecting to MPDB

You can connect to the MPDB daemon using any TCP client. All communication with the daemon uses JSON messages.

Example using Telnet:

```bash
telnet localhost 3000
{"action":"LIST_DB"}
```

## API Reference

MPDB uses a simple JSON-based protocol for all operations. Each request should be a valid JSON object with an `action` field specifying the operation to perform.

### Database Operations

#### Create Database

```json
{
  "action": "CREATE_DB",
  "dbName": "myDatabase"
}
```

Response:
```json
{
  "status": "success",
  "message": "Database 'myDatabase' created."
}
```

#### List Databases

```json
{
  "action": "LIST_DB"
}
```

Response:
```json
{
  "status": "success",
  "data": ["myDatabase", "anotherDatabase"]
}
```

#### Read Database

```json
{
  "action": "READ_DB",
  "dbName": "myDatabase"
}
```

Response:
```json
{
  "status": "success",
  "data": {
    "collection1": {
      "doc1": { "key": "value" },
      "doc2": { "key": "value2" }
    },
    "collection2": {}
  }
}
```

#### Delete Database

```json
{
  "action": "DELETE_DB",
  "dbName": "myDatabase"
}
```

Response:
```json
{
  "status": "success",
  "message": "Database 'myDatabase' deleted."
}
```

### Collection Operations

#### Create Collection

```json
{
  "action": "CREATE_COLLECTION",
  "dbName": "myDatabase",
  "collectionName": "myCollection"
}
```

Response:
```json
{
  "status": "success",
  "message": "Collection 'myCollection' created in database 'myDatabase'."
}
```

#### List Collections

```json
{
  "action": "LIST_COLLECTIONS",
  "dbName": "myDatabase"
}
```

Response:
```json
{
  "status": "success",
  "collections": ["collection1", "collection2"]
}
```

#### Delete Collection

```json
{
  "action": "DELETE_COLLECTION",
  "dbName": "myDatabase",
  "collectionName": "myCollection"
}
```

Response:
```json
{
  "status": "success",
  "message": "Collection 'myCollection' deleted from database 'myDatabase'."
}
```

### Document Operations

#### Create Document

```json
{
  "action": "CREATE_DOCUMENT",
  "dbName": "myDatabase",
  "collectionName": "myCollection",
  "document": {
    "name": "John Doe",
    "age": 30,
    "email": "john@example.com"
  },
  "documentId": "user123"
}
```

Response:
```json
{
  "status": "success",
  "message": "Document inserted into collection 'myCollection'.",
  "documentId": "user123"
}
```

*Note: If `documentId` is not provided, a UUID will be automatically generated.*

#### Read Document

```json
{
  "action": "READ_DOCUMENT",
  "dbName": "myDatabase",
  "collectionName": "myCollection",
  "documentId": "user123"
}
```

Response:
```json
{
  "status": "success",
  "document": {
    "name": "John Doe",
    "age": 30,
    "email": "john@example.com"
  },
  "documentId": "user123"
}
```

#### Read All Documents

```json
{
  "action": "READ_DOCUMENTS",
  "dbName": "myDatabase",
  "collectionName": "myCollection"
}
```

Response:
```json
{
  "status": "success",
  "documents": {
    "user123": {
      "name": "John Doe",
      "age": 30,
      "email": "john@example.com"
    },
    "user456": {
      "name": "Jane Smith",
      "age": 25,
      "email": "jane@example.com"
    }
  },
  "count": 2
}
```

#### Update Document

```json
{
  "action": "UPDATE_DOCUMENT",
  "dbName": "myDatabase",
  "collectionName": "myCollection",
  "documentId": "user123",
  "updates": {
    "age": 31,
    "address": "123 Main St"
  }
}
```

Response:
```json
{
  "status": "success",
  "message": "Document updated successfully.",
  "documentId": "user123",
  "document": {
    "name": "John Doe",
    "age": 31,
    "email": "john@example.com",
    "address": "123 Main St"
  }
}
```

#### Delete Document

```json
{
  "action": "DELETE_DOCUMENT",
  "dbName": "myDatabase",
  "collectionName": "myCollection",
  "documentId": "user123"
}
```

Response:
```json
{
  "status": "success",
  "message": "Document with ID 'user123' deleted successfully."
}
```

### Query Operations

MPDB supports advanced querying with filtering, sorting, and pagination.

#### Query Documents

```json
{
  "action": "QUERY",
  "dbName": "myDatabase",
  "collectionName": "myCollection",
  "query": {
    "age": {"$gt": 25}
  },
  "sortBy": "age",
  "ascending": false,
  "limit": 10,
  "skip": 0
}
```

Response:
```json
{
  "status": "success",
  "documents": {
    "user123": {
      "name": "John Doe",
      "age": 31,
      "email": "john@example.com"
    }
  },
  "count": 1,
  "totalMatches": 1
}
```

#### Query Operators

MPDB supports the following query operators:

- `$eq`: Equal to
- `$ne`: Not equal to
- `$gt`: Greater than
- `$gte`: Greater than or equal to
- `$lt`: Less than
- `$lte`: Less than or equal to
- `$in`: In array
- `$nin`: Not in array
- `$exists`: Field exists
- `$regex`: Regular expression match

#### Logical Operators

- `$and`: Logical AND of conditions
- `$or`: Logical OR of conditions
- `$not`: Negation of condition

## Error Handling

All errors are returned with a `status` field set to `"error"` and a `message` field explaining the error:

```json
{
  "status": "error",
  "message": "Database 'myDatabase' not found."
}
```

## Project Structure

```
COS301/
├── data/                      # Data storage directory
│   └── mpdb_data.json         # Database file
├── src/
│   ├── main/
│   │   └── java/
│   │       └── com/
│   │           ├── mpdbd/
│   │           │   └── App.java       # Main application entry point
│   │           └── server/
│   │               ├── ClientHandler.java  # Handles client connections
│   │               └── TCPServer.java      # TCP server implementation
│   └── test/
│       └── java/
│           └── com/
│               └── mpdbd/
│                   ├── AppTest.java           # Tests for App
│                   ├── ClientHandlerTest.java # Tests for ClientHandler
│                   └── QueryOperationsTest.java # Tests for query operations
├── target/                    # Build output directory
├── pom.xml                    # Maven project configuration
└── README.md                  # This documentation file
```

## Architecture

MPDB follows a simple client-server architecture:

1. **TCPServer**: Listens for incoming connections on a specified port and creates a ClientHandler for each connection.

2. **ClientHandler**: Handles communication with a client, parsing JSON requests, executing operations, and sending JSON responses.

3. **Data Storage**: Uses a ConcurrentHashMap structure to store databases, collections, and documents in memory, with periodic synchronization to disk.

The data storage hierarchy is:
- Database → Collection → Document
- Similar to MongoDB's organization structure

## Configuration

Currently, MPDB has a few hardcoded configuration values in the source code:

- **TCP Port**: 3000 (defined in `App.java`)
- **Data Directory**: "data/" (defined in `ClientHandler.java`)
- **Database File**: "data/mpdb_data.json" (defined in `ClientHandler.java`)

Future versions may include a configuration file for easier customization.

## Performance Considerations

- **Memory Usage**: All data is kept in memory for fast access. For large datasets, consider monitoring memory usage.
- **Concurrency**: Uses ConcurrentHashMap for thread safety, but complex operations are not atomic.
- **Persistence**: Data is saved to disk immediately after changes, which may impact performance for high-throughput scenarios.

## Security Considerations

- **No Authentication**: MPDB currently does not implement authentication or authorization.
- **No Encryption**: Data is transmitted in plaintext and stored unencrypted.
- **Network Exposure**: By default, the server binds to all interfaces ("0.0.0.0"), which may expose the daemon to external networks.

This project is intended for development and learning purposes; additional security measures should be implemented for production use.

## Development

### Running Tests

Run the test suite using Maven:

```bash
mvn test
```

### Building a Custom Version

To modify the code and build your own version:

1. Make changes to the source code
2. Run tests to ensure functionality
3. Build with Maven: `mvn clean package`

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- This project was created for COS301 course work
- Inspired by document-oriented databases like MongoDB

## Contact

For any queries or issues, please raise an issue on the repository.