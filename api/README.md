
# MPDB API Server

A comprehensive API server for the MPDB (Multi-Purpose Database) system that provides a RESTful interface to interact with the MPDB daemon service. This API server handles authentication, database operations, collection management, and document CRUD operations.

## 📋 Table of Contents

- [Features](#features)
- [Architecture](#architecture)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [API Documentation](#api-documentation)
  - [Authentication](#authentication)
  - [Database Operations](#database-operations)
  - [Collection Operations](#collection-operations)
  - [Document Operations](#document-operations)
  - [Health Checks](#health-checks)
- [Security](#security)
- [Error Handling](#error-handling)
- [Daemon Connection](#daemon-connection)
- [Development](#development)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)

## 🚀 Features

- **User Authentication**: Secure registration and login with JWT-based authentication
- **Database Management**: Create, read, list, and delete databases
- **Collection Management**: Create and list collections within databases
- **Document Operations**: Full CRUD operations for documents within collections
- **Querying**: Advanced document querying with sort, pagination, and filtering
- **Health Monitoring**: System and daemon health status endpoints
- **Cross-Platform Support**: Enhanced WSL detection and Windows host resolution
- **Error Handling**: Comprehensive error management and reporting

## 🏗️ Architecture

The MPDB API server follows a client-server architecture where:

- **API Server (this project)**: Handles HTTP requests, authentication, and forwards database operations to the daemon
- **MPDB Daemon (separate service)**: Performs actual database operations and maintains the database files

Communication between the API server and daemon occurs via TCP socket connections, with the API server acting as a TCP client to the daemon.

```
Client → API Server (Express) → TCP → MPDB Daemon → Database Files
```

## 📋 Prerequisites

- Node.js v18.x or higher
- npm or yarn package manager
- MPDB Daemon running on accessible host (default: 172.26.58.42:3000)

## 📦 Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/mpdb-api.git
cd mpdb-api
```

2. Install dependencies:
```bash
npm install
```

3. Set up configuration:
```bash
cp .env.example .env
# Edit the .env file with your configuration
```

4. Start the server:
```bash
npm start
```

For development with auto-restart:
```bash
npm run dev
```

## ⚙️ Configuration

Configure the application by setting the following environment variables in the `.env` file:

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | API server port | 5000 |
| `DAEMON_HOST` | MPDB daemon host | 172.26.58.42 |
| `DAEMON_PORT` | MPDB daemon port | 3000 |
| `JWT_SECRET` | Secret key for JWT tokens | (required) |
| `JWT_EXPIRATION` | JWT token expiration | 100d |
| `TOKEN_EXPIRY` | Token expiry duration | 100d |

## 📚 API Documentation

### Authentication

#### Register a new user
- **POST** `/auth/register`
- **Body**: `{ "username": "string", "password": "string", "email": "string" }`
- **Response**: `{ "status": "success", "message": "User registered successfully" }`

#### Login
- **POST** `/auth/login`
- **Body**: `{ "username": "string", "password": "string" }`
- **Response**: 
```json
{
  "status": "success",
  "message": "Login successful",
  "token": "jwt-token",
  "user": {
    "username": "string",
    "email": "string",
    "role": "string"
  }
}
```

### Database Operations

All database operations require authentication. Include the JWT token in the `Authorization` header:
```
Authorization: Bearer your-jwt-token
```

#### Create a database
- **POST** `/db/create`
- **Body**: `{ "dbName": "string" }`
- **Response**: Response from daemon

#### List all databases
- **GET** `/db/list`
- **Response**: List of databases from daemon

#### Read database info
- **POST** `/db/read`
- **Body**: `{ "dbName": "string" }`
- **Response**: Database info from daemon

#### Delete a database
- **DELETE** `/db/delete`
- **Body**: `{ "dbName": "string" }`
- **Response**: Response from daemon

#### List collections in a database
- **GET** `/db/collections?dbName=string`
- **Response**: List of collections in the database

### Collection Operations

#### Create a collection
- **POST** `/collection/create`
- **Body**: `{ "dbName": "string", "collectionName": "string" }`
- **Response**: Response from daemon

#### List collections
- **GET** `/collection/list?dbName=string`
- **Response**: List of collections in the database

### Document Operations

#### Create a document
- **POST** `/document/create`
- **Body**: `{ "dbName": "string", "collectionName": "string", "document": object, "documentId": "string" (optional) }`
- **Response**: Response from daemon with created document ID

#### Read a document
- **GET** `/document/read?dbName=string&collectionName=string&documentId=string`
- **Response**: Document data

#### List all documents
- **GET** `/document/list?dbName=string&collectionName=string`
- **Response**: All documents in the collection

#### Update a document
- **PUT** `/document/update`
- **Body**: `{ "dbName": "string", "collectionName": "string", "documentId": "string", "updates": object }`
- **Response**: Update confirmation

#### Delete a document
- **DELETE** `/document/delete`
- **Body**: `{ "dbName": "string", "collectionName": "string", "documentId": "string" }`
- **Response**: Deletion confirmation

#### Query documents
- **POST** `/document/query`
- **Body**: 
```json
{
  "dbName": "string",
  "collectionName": "string",
  "query": object,
  "sortBy": "string" (optional),
  "ascending": boolean (optional),
  "limit": number (optional),
  "skip": number (optional)
}
```
- **Response**: Matching documents

### Health Checks

#### Basic health check
- **GET** `/health`
- **Response**: Basic API status

#### Daemon health
- **GET** `/health/daemon`
- **Response**: Daemon connection status and available databases

#### Full system status
- **GET** `/health/system`
- **Response**: API and daemon status with uptime information

## 🔐 Security

- **Authentication**: JWT-based authentication with configurable expiration
- **Password Security**: Passwords are hashed using bcrypt before storage
- **Role-Based Access**: Support for user roles (user, admin) with middleware for authorization
- **Secure Headers**: Uses security headers via helmet middleware
- **Input Validation**: Request validation before processing

## ⚠️ Error Handling

The API includes comprehensive error handling through:

1. Global error handler middleware (`errorHandler.js`)
2. Specific error handling in each controller
3. Detailed error responses with appropriate HTTP status codes
4. Development-mode stack traces (controlled by NODE_ENV)

## 🔄 Daemon Connection

The API server establishes a TCP connection to the MPDB daemon service. The `tcpClient.js` module handles:

- Connection establishment and management
- Automatic reconnection on failure
- Request/response handling
- Timeout management
- Special handling for WSL environments
- Multiple fallback strategies for daemon host resolution

## 🛠️ Development

### Project Structure

```
├── src/
│   ├── config/       # Configuration files
│   ├── controllers/  # Route controllers
│   ├── middlewares/  # Express middlewares
│   ├── routes/       # API routes
│   ├── services/     # Service modules
│   └── utils/        # Utility functions
├── .env              # Environment variables
├── index.js          # Application entry point
└── package.json      # Project metadata and dependencies
```

### Available Scripts

- `npm start` - Start the server
- `npm run dev` - Start the server in development mode with auto-restart

## ❓ Troubleshooting

### Common Issues

1. **Cannot connect to daemon**
   - Verify daemon is running
   - Check DAEMON_HOST and DAEMON_PORT in .env
   - Check network connectivity and firewall settings

2. **Authentication failures**
   - Ensure JWT_SECRET is properly set
   - Verify token hasn't expired
   - Check token format in the Authorization header

3. **WSL Connection Issues**
   - For Windows Subsystem for Linux environments, the API includes special handling for host resolution
   - The system will try multiple possible host addresses to connect to the daemon

### Logs

The application uses console logging with emoji indicators for better readability:

- 🚀 - Server startup
- 📩 - Incoming request
- 📤 - Outgoing request to daemon
- ✅ - Success response
- ❌ - Error
- 🔌 - Connection events
- 🔍 - Debug/detection logs

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License - see the LICENSE file for details.

---

