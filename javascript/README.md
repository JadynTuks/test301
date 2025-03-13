# MPDBD JS Documentation

This document provides details on the MPDBD JavaScript client library that communicates with the MPDBD backend for authentication and database operations. The library provides functions for logging in, registering users, and managing databases.

## Table of Contents

1. [Authentication Functions](#authentication-functions)
   - [Login](#login)
   - [Register](#register)
2. [Database Operations](#database-operations)
   - [Create Database](#create-database)
   - [Delete Database](#delete-database)
   - [List Databases](#list-databases)
   - [List Collections](#list-collections)
   - [Delete Collections](#delete-collections)
3. [CRUD Operations](#crud-operations)
   - [Create Document](#create-document)
   - [Read Document](#read-document)
   - [List Documents](#list-documents)
   - [Update Document](#update-document)
   - [Delete Document](#delete-document)
4. [Query Documents](#query-documents)
   - [Query Documents](#query-documents)
5. [User Role Management](#database-operations)
   - [List Users](#list-users)
   - [Create User](#create-user)
   - [Delete User](#delete-user)
   - [Update User Role](#update-user-role)
6. [Usage Example](#usage-example)

---

## Authentication Functions

### 1. Login

**Function:** `loginUser(data)`

This function allows a user to log in using their username and password. The library sends a POST request to the `/auth/login` endpoint to authenticate the user. If successful, it stores the authentication token in sessionStorage.

**Request Body to JS Library:**

```json
{
  "username": "user@example.com",
  "password": "yourpassword"
}
```

**Return from API:**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user123",
    "username": "user@example.com",
    "role": "user"
  }
}
```

- **Explanation**: The `token` is stored in the sessionStorage and will be used for subsequent API calls requiring authentication.

---

### 2. Register

**Function:** `registerUser(data)`

This function allows a user to register with their username and password. The library sends a POST request to the `/auth/register` endpoint to create a new user. If successful, it stores the authentication token in sessionStorage.

**Request Body to JS Library:**

```json
{
  "username": "user@example.com",
  "password": "yourpassword"
}
```

**Return from API:**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user123",
    "username": "user@example.com",
    "role": "user"
  }
}
```

- **Explanation**: The `token` will be stored in sessionStorage and used for subsequent API calls.

---

## Database Operations

### 1. Create Database

**Function:** `createDatabase(data)`

This function allows a user to create a new database. The library sends a POST request to the `/db/create` endpoint with the database name.

**Request Body to JS Library:**

```json
{
  "dbName": "myDatabase"
}
```

**Return from API:**

```json
{
  "success": true,
  "message": "Database created successfully",
  "database": "myDatabase"
}
```

- **Explanation**: The response indicates whether the database was created successfully. The `message` provides further details, and `database` shows the name of the created database.

---

### 2. Delete Database

**Function:** `deleteDatabase(dbName)`

This function allows a user to delete a database. The library sends a POST request to the `/db/delete` endpoint with the database name.

**Request Body to JS Library:**

```json
{
  "dbName": "myDatabase"
}
```

**Return from API:**

```json
{
  "success": true,
  "message": "Database deleted successfully"
}
```

- **Explanation**: The response indicates whether the database was deleted successfully.

---

### 3. List Databases

**Function:** `listDatabases()`

This function retrieves the list of all databases for the authenticated user. The library sends a GET request to the `/db/list` endpoint.

**Return from API:**

```json
{
  "success": true,
  "databases": ["db1", "db2", "db3"]
}
```

- **Explanation**: The `databases` array contains the names of all databases available for the authenticated user.

---

### 4. List Collections

**Function:** `listCollections(dbName)`

This function retrieves the collections in a specified database. The library sends a GET request to the `/db/collections` endpoint with the `dbName` query parameter.

**Request Parameters to JS Library:**

```json
{
  "dbName": "myDatabase"
}
```

**Return from API:**

```json
{
  "success": true,
  "collections": ["users", "products", "orders"]
}
```

- **Explanation**: The `collections` array contains the names of all collections in the specified database.

---

### 5. Delete Collections

**Function:** `deleteCollections(dbName, collectionName)`

This function deletes the collections in a specified database. The library sends a DELETE request to the `/db/collections` endpoint with the `dbName` and `collectionName` query parameter.

**Request Parameters to JS Library:**

```json
{
    "dbName": "myDatabase"
    "collectionName": "collName"
}
```

---

## CRUD Operations

### 1. Create Document

**Function:** `createDocument(data)`

This function allows a user to create a new document in a specified collection within a database. The library sends a POST request to the /document/create endpoint to create the document.

**Request Body to JS Library**

```json
{
  "dbName": "myDatabase",
  "collectionName": "users",
  "document": {
    "name": "John Doe",
    "email": "john@example.com",
    "age": 30
  },
  "token": "your-auth-token"
}
```

**Return from API**

```json
{
  "success": true,
  "message": "Document created successfully",
  "documentId": "doc123"
}
```

**Explanation**
The token is used for authentication. The response includes a success message and the ID of the newly created document.

---

### 2.Read Document

**Function:** `readDocument(data)`

This function allows a user to read a document from a specified collection within a database. The library sends a POST request to the /document/read endpoint to retrieve the document.

**Request Body to JS Library**

```json
{
  "dbName": "exampleDB",
  "collectionName": "exampleCollection",
  "documentId": "doc123",
  "token": "your-auth-token"
}
```

**Return From API**

```json
{
  "success": true,
  "document": {
    "_id": "doc123",
    "name": "John Doe",
    "email": "john@example.com",
    "age": 30
  }
}
```

**Explanation**
The token is used for authentication. The response includes the requested document.

---

### 3. List Documents

**Function:** `listDocuments(data)`

This function allows a user to list all documents in a specified collection within a database. The library sends a POST request to the /document/list endpoint to retrieve the list of documents.

**Request Body to JS Library**

```json
{
  "dbName": "exampleDB",
  "collectionName": "exampleCollection",
  "token": "your-auth-token"
}
```

**Response from API**

```json
{
  "success": true,
  "documents": [
    {
      "_id": "doc123",
      "name": "John Doe",
      "email": "john@example.com"
    },
    {
      "_id": "doc124",
      "name": "Jane Smith",
      "email": "jane@example.com"
    }
  ]
}
```

**Explanation**
The token is used for authentication. The response includes a list of documents in the specified collection.

---

### 4. Update Document

**Function:** `updateDocument(data)`

This function allows a user to update an existing document in a specified collection within a database. The library sends a POST request to the /document/update endpoint to update the document.

**Request Body to JS Library**

```json
{
  "dbName": "myDatabase",
  "collectionName": "users",
  "documentId": "doc123",
  "update": {
    "name": "John Updated",
    "age": 31
  },
  "token": "your-auth-token"
}
```

**Response from API**

```json
{
  "success": true,
  "message": "Document updated successfully"
}
```

**Explanation**
The token is used for authentication. The response includes a success message indicating that the document was updated.

### 5.Delete Document

**Function:** `deleteDocument(data)`

This function allows a user to delete a document from a specified collection within a database. The library sends a POST request to the /document/delete endpoint to delete the document.

**Request Body to JS Library**

```json
{
  "dbName": "exampleDB",
  "collectionName": "exampleCollection",
  "documentId": "documentId",
  "token": "your-auth-token"
}
```

**Return from API**

```json
{
  "success": true,
  "message": "Document deleted successfully"
}
```

---

## Query Documents

### 1. Query Documents

**Function:** `queryDocuments(data)`

This function allows a user to query documents in a specified collection within a database. The library sends a POST request to the /document/query endpoint to retrieve the documents that match the query.

**Request Body to JS Library**

```json
{
  "dbName": "myDatabase",
  "collectionName": "users",
  "query": {
    "age": { "$gt": 25 }
  },
  "projection": {
    "name": 1,
    "email": 1
  },
  "sort": {
    "name": 1
  },
  "limit": 10,
  "skip": 0,
  "token": "your-auth-token"
}
```

**Response from API**

```json
{
  "success": true,
  "count": 2,
  "documents": [
    {
      "_id": "doc123",
      "name": "John Doe",
      "email": "john@example.com"
    },
    {
      "_id": "doc124",
      "name": "Jane Smith",
      "email": "jane@example.com"
    }
  ]
}
```

**Explanation**
The token is used for authentication. The response includes a list of documents that match the query.

---

## User Role Management

### 1. List Users

**Function:** `listUsers()`

This function allows a user to list all registered users. The library sends a GET request to the /users endpoint to retrieve all registered users.

### `listUsers()`

Retrieves a list of all users.

#### Returns:

- `Promise<Object>`: User list.

```javascript
listUsers() {
    return this.request(`/users`);
}
```

---

### 2. Create User

**Function:** `createUser(username, password, role)`

This function creates a user. The library sends a POST request to the /users endpoint to create a new user with a username, password and their role.

### `createUser(username, password, role)`

Creates a new user.

#### Parameters:

- `username` _(string)_: User's name.
- `password` _(string)_: User's password.
- `role` _(string)_: User role.

#### Returns:

- `Promise<Object>`: API response.

```javascript
createUser(username, password, role) {
    this.validateInput({ username, password, role });
    return this.request(`/users`, 'POST', { username, password, role });
}
```

---

### 3. Delete User

**Function:** `createUser(username, password, role)`

This function creates a user. The library sends a POST request to the /users endpoint to create a new user with a username, password and their role.

### `createUser(username, password, role)`

Creates a new user.

#### Parameters:

- `username` _(string)_: User's name.
- `password` _(string)_: User's password.
- `role` _(string)_: User role.

#### Returns:

- `Promise<Object>`: API response.

```javascript
createUser(username, password, role) {
    this.validateInput({ username, password, role });
    return this.request(`/users`, 'POST', { username, password, role });
}
```

---

### 4. Update User Role

**Function:** `updateUserRole(userId, role)`

This function allows admin user to change the role of a user to admin. The library sends a PUT request to the /users endpoint to update a user with a new role.

### `updateUserRole(userId, role)`

Updates a user's role.

#### Parameters:

- `userId` _(string)_: User ID.
- `role` _(string)_: New role.

#### Returns:

- `Promise<Object>`: API response.

```javascript
updateUserRole(userId, role) {
    this.validateInput({ userId, role });
    return this.request(`/users/${userId}/role`, 'PUT', { role });
}
```

---

## Usage Example

### Example Usage in UI:

```javascript
const dbClient = new NoSQLDBClient("https://TheAPIUrl:Port");

// Registering a new user
const registerData = {
  username: "newuser@example.com",
  password: "newpassword",
};

dbClient
  .registerUser(registerData)
  .then((result) => {
    if (result.token) {
      console.log("User registered and logged in!");
      // Now use the token for further operations
    }
  })
  .catch((err) => {
    console.error("Registration failed:", err);
  });

// Login an existing user
const loginData = {
  username: "existinguser@example.com",
  password: "existingpassword",
};

dbClient
  .loginUser(loginData)
  .then((result) => {
    if (result.token) {
      console.log("Logged in successfully!");
      // Now use the token for further operations
    }
  })
  .catch((err) => {
    console.error("Login failed:", err);
  });

// Creating a new database
const createDbData = { dbName: "newDatabase" };
dbClient
  .createDatabase(createDbData)
  .then((result) => {
    console.log("Database created:", result);
  })
  .catch((err) => {
    console.error("Failed to create database:", err);
  });

// Creating a new document
const createDocData = {
  dbName: "myDatabase",
  collectionName: "users",
  document: {
    name: "John Doe",
    email: "john@example.com",
    age: 30,
  },
  token: "your-auth-token",
};

dbClient
  .createDocument(createDocData)
  .then((result) => {
    console.log("Document created:", result);
  })
  .catch((err) => {
    console.error("Failed to create document:", err);
  });

// Reading a document
const readDocData = {
  dbName: "exampleDB",
  collectionName: "exampleCollection",
  documentId: "doc123",
  token: "your-auth-token",
};

dbClient
  .readDocument(readDocData)
  .then((result) => {
    console.log("Document read:", result);
  })
  .catch((err) => {
    console.error("Failed to read document:", err);
  });

// Listing documents
const listDocsData = {
  dbName: "exampleDB",
  collectionName: "exampleCollection",
  token: "your-auth-token",
};

dbClient
  .listDocuments(listDocsData)
  .then((result) => {
    console.log("Documents listed:", result);
  })
  .catch((err) => {
    console.error("Failed to list documents:", err);
  });

// Updating a document
const updateDocData = {
  dbName: "myDatabase",
  collectionName: "users",
  documentId: "doc123",
  update: {
    name: "John Updated",
    age: 31,
  },
  token: "your-auth-token",
};

dbClient
  .updateDocument(updateDocData)
  .then((result) => {
    console.log("Document updated:", result);
  })
  .catch((err) => {
    console.error("Failed to update document:", err);
  });

// Deleting a document
const deleteDocData = {
  dbName: "exampleDB",
  collectionName: "exampleCollection",
  documentId: "documentId",
  token: "your-auth-token",
};

dbClient
  .deleteDocument(deleteDocData)
  .then((result) => {
    console.log("Document deleted:", result);
  })
  .catch((err) => {
    console.error("Failed to delete document:", err);
  });

// Querying documents
const queryDocsData = {
  dbName: "myDatabase",
  collectionName: "users",
  query: {
    age: { $gt: 25 },
  },
  projection: {
    name: 1,
    email: 1,
  },
  sort: {
    name: 1,
  },
  limit: 10,
  skip: 0,
  token: "your-auth-token",
};

dbClient
  .queryDocuments(queryDocsData)
  .then((result) => {
    console.log("Documents queried:", result);
  })
  .catch((err) => {
    console.error("Failed to query documents:", err);
  });
```

---
