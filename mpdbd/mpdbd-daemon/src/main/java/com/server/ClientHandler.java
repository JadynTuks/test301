package com.server;

import java.io.*;
import java.net.*;
import java.util.*;
import java.util.concurrent.*;
import java.nio.file.*;
import java.util.concurrent.ConcurrentHashMap;

import org.json.JSONObject;
import org.json.JSONArray;
import org.json.JSONException;


public class ClientHandler extends Thread {
    private Socket clientSocket;
    private static ConcurrentHashMap<String, ConcurrentHashMap<String, ConcurrentHashMap<String, String>>> databaseMap = new ConcurrentHashMap<>();
    
    // File path for persistence
    private static final String DATA_DIR = "data/";
    private static final String DB_FILE = DATA_DIR + "mpdb_data.json";

    public ClientHandler(Socket socket) {
        this.clientSocket = socket;
        File dataDir = new File(DATA_DIR);
        if (!dataDir.exists()) {
            dataDir.mkdirs();
        }
        
        // Load data from persistent storage
        loadDataFromDisk();
    }

    @Override
    public void run() {
        BufferedReader in = null;
        PrintWriter out = null;
        
        try {
            in = new BufferedReader(new InputStreamReader(clientSocket.getInputStream()));
            out = new PrintWriter(clientSocket.getOutputStream(), true);
            
            String inputLine;
            while ((inputLine = in.readLine()) != null) {
                System.out.println("📩 Received from client: " + inputLine);

                try {
                    JSONObject request = new JSONObject(inputLine);
                    JSONObject response = handleRequest(request);

                    out.println(response.toString());
                    saveDataToDisk();
                    System.out.println("📤 Sent response: " + response.toString());
                } catch (JSONException e) {
                    System.err.println("❌ Invalid JSON received: " + e.getMessage());
                    JSONObject errorResponse = new JSONObject();
                    errorResponse.put("status", "error");
                    errorResponse.put("message", "Invalid JSON format");
                    out.println(errorResponse.toString());
                }
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
        // No finally block to close resources
    }

    public static synchronized void saveDataToDisk() {
        try {
            JSONObject data = new JSONObject();
            
            // Convert ConcurrentHashMap to JSONObject
            for (Map.Entry<String, ConcurrentHashMap<String, ConcurrentHashMap<String, String>>> dbEntry : databaseMap.entrySet()) {
                JSONObject dbObject = new JSONObject();
                String dbName = dbEntry.getKey();
                
                ConcurrentHashMap<String, ConcurrentHashMap<String, String>> collections = dbEntry.getValue();
                for (Map.Entry<String, ConcurrentHashMap<String, String>> collEntry : collections.entrySet()) {
                    JSONObject collObject = new JSONObject();
                    String collName = collEntry.getKey();
                    
                    ConcurrentHashMap<String, String> documents = collEntry.getValue();
                    for (Map.Entry<String, String> docEntry : documents.entrySet()) {
                        collObject.put(docEntry.getKey(), new JSONObject(docEntry.getValue()));
                    }
                    
                    dbObject.put(collName, collObject);
                }
                
                data.put(dbName, dbObject);
            }
            
            // Write to file
            try (FileWriter file = new FileWriter(DB_FILE)) {
                file.write(data.toString(2));
                System.out.println("📝 Data successfully saved to " + DB_FILE);
            }
        } catch (IOException | JSONException e) {
            System.err.println("❌ Error saving data: " + e.getMessage());
            e.printStackTrace();
        }
    }
    
    // Method to load data from disk
    private synchronized void loadDataFromDisk() {
        File dbFile = new File(DB_FILE);
        if (!dbFile.exists()) {
            System.out.println("🆕 No existing database file found. Starting fresh.");
            return;
        }
        
        try {
            StringBuilder content = new StringBuilder();
            try (BufferedReader reader = new BufferedReader(new FileReader(dbFile))) {
                String line;
                while ((line = reader.readLine()) != null) {
                    content.append(line);
                }
            }
            
            JSONObject data = new JSONObject(content.toString());
            
            // Clear existing data
            databaseMap.clear();
            
            // Populate from JSON
            Iterator<String> dbKeys = data.keys();
            while (dbKeys.hasNext()) {
                String dbName = dbKeys.next();
                JSONObject dbObject = data.getJSONObject(dbName);
                
                ConcurrentHashMap<String, ConcurrentHashMap<String, String>> dbMap = new ConcurrentHashMap<>();
                databaseMap.put(dbName, dbMap);
                
                Iterator<String> collKeys = dbObject.keys();
                while (collKeys.hasNext()) {
                    String collName = collKeys.next();
                    JSONObject collObject = dbObject.getJSONObject(collName);
                    
                    ConcurrentHashMap<String, String> collMap = new ConcurrentHashMap<>();
                    dbMap.put(collName, collMap);
                    
                    Iterator<String> docKeys = collObject.keys();
                    while (docKeys.hasNext()) {
                        String docId = docKeys.next();
                        JSONObject docObject = collObject.getJSONObject(docId);
                        collMap.put(docId, docObject.toString());
                    }
                }
            }
            
            System.out.println("📝 Data successfully loaded from " + DB_FILE);
        } catch (IOException | JSONException e) {
            System.err.println("❌ Error loading data: " + e.getMessage());
            e.printStackTrace();
        }
    }
    
 private JSONObject handleRequest(JSONObject request) {
            JSONObject response = new JSONObject();
            String action = request.optString("action", "UNKNOWN");
            
            switch (action) {
                case "CREATE_DB":
                    return createDatabase(request);
                    
                case "LIST_DB":
                    return listDatabases();
                    
                case "READ_DB":
                    return readDatabase(request);
                    
                case "DELETE_DB":
                    return deleteDatabase(request);
                    
                case "CREATE_COLLECTION":
                    return createCollection(request);
                    
                case "READ_COLLECTIONS":
                case "LIST_COLLECTIONS":
                    return listCollections(request);
                    
                case "DELETE_COLLECTION":
                    return deleteCollection(request);
                    
                case "CREATE_DOCUMENT":
                    return createDocument(request);
                    
                case "READ_DOCUMENT":
                    return readDocument(request);
                    
                case "READ_DOCUMENTS":
                    return readDocuments(request);
                    
                case "UPDATE_DOCUMENT":
                    return updateDocument(request);
                    
                case "DELETE_DOCUMENT":
                    return deleteDocument(request);
                    
                case "QUERY":
                    return queryDocuments(request);
                    
                default:
                    response.put("status", "error");
                    response.put("message", "Unknown action: " + action);
                    return response;
            }
        }

        private JSONObject createDatabase(JSONObject request) {
            JSONObject response = new JSONObject();
            String dbName = request.optString("dbName", "").trim();
            
            if (dbName.isEmpty()) {
                response.put("status", "error");
                response.put("message", "Database name is required.");
            } else if (databaseMap.containsKey(dbName)) {
                response.put("status", "error");
                response.put("message", "Database '" + dbName + "' already exists.");
            } else {
                databaseMap.put(dbName, new ConcurrentHashMap<>());
                response.put("status", "success");
                response.put("message", "Database '" + dbName + "' created.");
            }
            
            return response;
        }
        
        private JSONObject listDatabases() {
            JSONObject response = new JSONObject();
            Set<String> dbNames = databaseMap.keySet();
            
            response.put("status", "success");
            response.put("data", dbNames);
            
            return response;
        }



        private JSONObject readDatabase(JSONObject request) {
            JSONObject response = new JSONObject();
            String dbName = request.optString("dbName", "").trim();
            
            if (dbName.isEmpty()) {
                response.put("status", "error");
                response.put("message", "Database name is required.");
            } else if (!databaseMap.containsKey(dbName)) {
                response.put("status", "error");
                response.put("message", "Database '" + dbName + "' not found.");
            } else {
                ConcurrentHashMap<String, ConcurrentHashMap<String, String>> collections = databaseMap.get(dbName);
                JSONObject dbData = new JSONObject();
                
                for (Map.Entry<String, ConcurrentHashMap<String, String>> entry : collections.entrySet()) {
                    String collName = entry.getKey();
                    JSONObject collData = new JSONObject();
                    
                    ConcurrentHashMap<String, String> documents = entry.getValue();
                    for (Map.Entry<String, String> docEntry : documents.entrySet()) {
                        try {
                            collData.put(docEntry.getKey(), new JSONObject(docEntry.getValue()));
                        } catch (JSONException e) {
                            System.err.println("❌ Error parsing document: " + e.getMessage());
                        }
                    }
                    
                    dbData.put(collName, collData);
                }
                
                response.put("status", "success");
                response.put("data", dbData);
            }
            
            return response;
        }
        
        private JSONObject deleteDatabase(JSONObject request) {
            JSONObject response = new JSONObject();
            String dbName = request.optString("dbName", "").trim();
            
            if (dbName.isEmpty()) {
                response.put("status", "error");
                response.put("message", "Database name is required.");
            } else if (!databaseMap.containsKey(dbName)) {
                response.put("status", "error");
                response.put("message", "Database '" + dbName + "' not found.");
            } else {
                databaseMap.remove(dbName);
                response.put("status", "success");
                response.put("message", "Database '" + dbName + "' deleted.");
            }
            
            return response;
        }
        
        // Collection Operations
        private JSONObject createCollection(JSONObject request) {
            JSONObject response = new JSONObject();
            String dbName = request.optString("dbName", "").trim();
            String collectionName = request.optString("collectionName", "").trim();
            
            if (dbName.isEmpty() || collectionName.isEmpty()) {
                response.put("status", "error");
                response.put("message", "dbName and collectionName are required.");
            } else if (!databaseMap.containsKey(dbName)) {
                response.put("status", "error");
                response.put("message", "Database '" + dbName + "' not found.");
            } else {
                ConcurrentHashMap<String, ConcurrentHashMap<String, String>> collections = databaseMap.get(dbName);
                
                if (collections.containsKey(collectionName)) {
                    response.put("status", "error");
                    response.put("message", "Collection '" + collectionName + "' already exists in database '" + dbName + "'.");
                } else {
                    collections.put(collectionName, new ConcurrentHashMap<>());
                    response.put("status", "success");
                    response.put("message", "Collection '" + collectionName + "' created in database '" + dbName + "'.");
                }
            }
            
            return response;
        }
        
        private JSONObject listCollections(JSONObject request) {
            JSONObject response = new JSONObject();
            String dbName = request.optString("dbName", "").trim();
            
            if (dbName.isEmpty()) {
                response.put("status", "error");
                response.put("message", "Database name is required.");
            } else if (!databaseMap.containsKey(dbName)) {
                response.put("status", "error");
                response.put("message", "Database '" + dbName + "' not found.");
            } else {
                Set<String> collections = databaseMap.get(dbName).keySet();
                response.put("status", "success");
                response.put("collections", collections);
            }
            
            return response;
        }
        
        private JSONObject deleteCollection(JSONObject request) {
            JSONObject response = new JSONObject();
            String dbName = request.optString("dbName", "").trim();
            String collectionName = request.optString("collectionName", "").trim();
            
            if (dbName.isEmpty() || collectionName.isEmpty()) {
                response.put("status", "error");
                response.put("message", "dbName and collectionName are required.");
            } else if (!databaseMap.containsKey(dbName)) {
                response.put("status", "error");
                response.put("message", "Database '" + dbName + "' not found.");
            } else {
                ConcurrentHashMap<String, ConcurrentHashMap<String, String>> collections = databaseMap.get(dbName);
                
                if (!collections.containsKey(collectionName)) {
                    response.put("status", "error");
                    response.put("message", "Collection '" + collectionName + "' not found in database '" + dbName + "'.");
                } else {
                    collections.remove(collectionName);
                    response.put("status", "success");
                    response.put("message", "Collection '" + collectionName + "' deleted from database '" + dbName + "'.");
                }
            }
            
            return response;
        }
        
        // Document Operations
        private JSONObject createDocument(JSONObject request) {
            JSONObject response = new JSONObject();
            String dbName = request.optString("dbName", "").trim();
            String collectionName = request.optString("collectionName", "").trim();
            JSONObject document = request.optJSONObject("document");
            
            if (dbName.isEmpty() || collectionName.isEmpty() || document == null) {
                response.put("status", "error");
                response.put("message", "dbName, collectionName, and document are required.");
            } else if (!databaseMap.containsKey(dbName)) {
                response.put("status", "error");
                response.put("message", "Database '" + dbName + "' not found.");
            } else {
                ConcurrentHashMap<String, ConcurrentHashMap<String, String>> db = databaseMap.get(dbName);
                
                if (!db.containsKey(collectionName)) {
                    response.put("status", "error");
                    response.put("message", "Collection '" + collectionName + "' not found in database '" + dbName + "'.");
                } else {
                    ConcurrentHashMap<String, String> collection = db.get(collectionName);
                    String docId = request.optString("documentId", "");
                    
                    if (docId.isEmpty()) {
                        docId = "doc_" + System.currentTimeMillis() + "_" + UUID.randomUUID().toString().substring(0, 8);
                    } else if (collection.containsKey(docId)) {
                        response.put("status", "error");
                        response.put("message", "Document with ID '" + docId + "' already exists.");
                        return response;
                    }
                    
                    collection.put(docId, document.toString());
                    
                    response.put("status", "success");
                    response.put("message", "Document inserted into collection '" + collectionName + "'.");
                    response.put("documentId", docId);
                }
            }
            
            return response;
        }
        
        private JSONObject readDocument(JSONObject request) {
            JSONObject response = new JSONObject();
            String dbName = request.optString("dbName", "").trim();
            String collectionName = request.optString("collectionName", "").trim();
            String documentId = request.optString("documentId", "").trim();
            
            if (dbName.isEmpty() || collectionName.isEmpty() || documentId.isEmpty()) {
                response.put("status", "error");
                response.put("message", "dbName, collectionName, and documentId are required.");
            } else if (!databaseMap.containsKey(dbName)) {
                response.put("status", "error");
                response.put("message", "Database '" + dbName + "' not found.");
            } else {
                ConcurrentHashMap<String, ConcurrentHashMap<String, String>> db = databaseMap.get(dbName);
                
                if (!db.containsKey(collectionName)) {
                    response.put("status", "error");
                    response.put("message", "Collection '" + collectionName + "' not found in database '" + dbName + "'.");
                } else {
                    ConcurrentHashMap<String, String> collection = db.get(collectionName);
                    
                    if (!collection.containsKey(documentId)) {
                        response.put("status", "error");
                        response.put("message", "Document with ID '" + documentId + "' not found.");
                    } else {
                        String docStr = collection.get(documentId);
                        try {
                            JSONObject document = new JSONObject(docStr);
                            response.put("status", "success");
                            response.put("document", document);
                            response.put("documentId", documentId);
                        } catch (JSONException e) {
                            response.put("status", "error");
                            response.put("message", "Error parsing document: " + e.getMessage());
                        }
                    }
                }
            }
            
            return response;
        }
        
        private JSONObject readDocuments(JSONObject request) {
            JSONObject response = new JSONObject();
            String dbName = request.optString("dbName", "").trim();
            String collectionName = request.optString("collectionName", "").trim();
            
            if (dbName.isEmpty() || collectionName.isEmpty()) {
                response.put("status", "error");
                response.put("message", "dbName and collectionName are required.");
            } else if (!databaseMap.containsKey(dbName)) {
                response.put("status", "error");
                response.put("message", "Database '" + dbName + "' not found.");
            } else {
                ConcurrentHashMap<String, ConcurrentHashMap<String, String>> db = databaseMap.get(dbName);
                
                if (!db.containsKey(collectionName)) {
                    response.put("status", "error");
                    response.put("message", "Collection '" + collectionName + "' not found in database '" + dbName + "'.");
                } else {
                    ConcurrentHashMap<String, String> collection = db.get(collectionName);
                    JSONObject documents = new JSONObject();
                    
                    for (Map.Entry<String, String> entry : collection.entrySet()) {
                        try {
                            documents.put(entry.getKey(), new JSONObject(entry.getValue()));
                        } catch (JSONException e) {
                            System.err.println("❌ Error parsing document: " + e.getMessage());
                        }
                    }
                    
                    response.put("status", "success");
                    response.put("documents", documents);
                    response.put("count", documents.length());
                }
            }
            
            return response;
        }
        
        private JSONObject updateDocument(JSONObject request) {
            JSONObject response = new JSONObject();
            String dbName = request.optString("dbName", "").trim();
            String collectionName = request.optString("collectionName", "").trim();
            String documentId = request.optString("documentId", "").trim();
            JSONObject updates = request.optJSONObject("updates");
            
            if (dbName.isEmpty() || collectionName.isEmpty() || documentId.isEmpty() || updates == null) {
                response.put("status", "error");
                response.put("message", "dbName, collectionName, documentId, and updates are required.");
            } else if (!databaseMap.containsKey(dbName)) {
                response.put("status", "error");
                response.put("message", "Database '" + dbName + "' not found.");
            } else {
                ConcurrentHashMap<String, ConcurrentHashMap<String, String>> db = databaseMap.get(dbName);
                
                if (!db.containsKey(collectionName)) {
                    response.put("status", "error");
                    response.put("message", "Collection '" + collectionName + "' not found in database '" + dbName + "'.");
                } else {
                    ConcurrentHashMap<String, String> collection = db.get(collectionName);
                    
                    if (!collection.containsKey(documentId)) {
                        response.put("status", "error");
                        response.put("message", "Document with ID '" + documentId + "' not found.");
                    } else {
                        try {
                            JSONObject existingDoc = new JSONObject(collection.get(documentId));
                            
                            // Apply updates
                            for (String key : updates.keySet()) {
                                existingDoc.put(key, updates.get(key));
                            }
                            
                            collection.put(documentId, existingDoc.toString());
                            
                            response.put("status", "success");
                            response.put("message", "Document updated successfully.");
                            response.put("documentId", documentId);
                            response.put("document", existingDoc);
                        } catch (JSONException e) {
                            response.put("status", "error");
                            response.put("message", "Error updating document: " + e.getMessage());
                        }
                    }
                }
            }
            
            return response;
        }
        
        private JSONObject deleteDocument(JSONObject request) {
            JSONObject response = new JSONObject();
            String dbName = request.optString("dbName", "").trim();
            String collectionName = request.optString("collectionName", "").trim();
            String documentId = request.optString("documentId", "").trim();
            
            if (dbName.isEmpty() || collectionName.isEmpty() || documentId.isEmpty()) {
                response.put("status", "error");
                response.put("message", "dbName, collectionName, and documentId are required.");
            } else if (!databaseMap.containsKey(dbName)) {
                response.put("status", "error");
                response.put("message", "Database '" + dbName + "' not found.");
            } else {
                ConcurrentHashMap<String, ConcurrentHashMap<String, String>> db = databaseMap.get(dbName);
                
                if (!db.containsKey(collectionName)) {
                    response.put("status", "error");
                    response.put("message", "Collection '" + collectionName + "' not found in database '" + dbName + "'.");
                } else {
                    ConcurrentHashMap<String, String> collection = db.get(collectionName);
                    
                    if (!collection.containsKey(documentId)) {
                        response.put("status", "error");
                        response.put("message", "Document with ID '" + documentId + "' not found.");
                    } else {
                        collection.remove(documentId);
                        response.put("status", "success");
                        response.put("message", "Document with ID '" + documentId + "' deleted successfully.");
                    }
                }
            }
            
            return response;
        }
        
        private JSONObject queryDocuments(JSONObject request) {
            JSONObject response = new JSONObject();
            String dbName = request.optString("dbName", "").trim();
            String collectionName = request.optString("collectionName", "").trim();
            JSONObject query = request.optJSONObject("query");
            
            if (dbName.isEmpty() || collectionName.isEmpty() || query == null) {
                response.put("status", "error");
                response.put("message", "dbName, collectionName, and query are required.");
            } else if (!databaseMap.containsKey(dbName)) {
                response.put("status", "error");
                response.put("message", "Database '" + dbName + "' not found.");
            } else {
                ConcurrentHashMap<String, ConcurrentHashMap<String, String>> db = databaseMap.get(dbName);
                
                if (!db.containsKey(collectionName)) {
                    response.put("status", "error");
                    response.put("message", "Collection '" + collectionName + "' not found in database '" + dbName + "'.");
                } else {
                    ConcurrentHashMap<String, String> collection = db.get(collectionName);
                    JSONObject results = new JSONObject();
                    int matchCount = 0;
                    
                    // Process sorting parameters
                    String sortField = request.optString("sortBy", "");
                    boolean ascending = request.optBoolean("ascending", true);
                    
                    // Process pagination parameters
                    int limit = request.optInt("limit", Integer.MAX_VALUE);
                    int skip = request.optInt("skip", 0);
                    
                    // Convert collection to list for sorting and pagination
                    List<Map.Entry<String, JSONObject>> documentList = new ArrayList<>();
                    
                    for (Map.Entry<String, String> entry : collection.entrySet()) {
                        try {
                            JSONObject doc = new JSONObject(entry.getValue());
                            if (matchesQuery(doc, query)) {
                                documentList.add(new AbstractMap.SimpleEntry<>(entry.getKey(), doc));
                            }
                        } catch (JSONException e) {
                            System.err.println("❌ Error parsing document: " + e.getMessage());
                        }
                    }
                    
                    // Sort if sortField is provided
                    if (!sortField.isEmpty()) {
                        documentList.sort((a, b) -> {
                            Object valA = a.getValue().opt(sortField);
                            Object valB = b.getValue().opt(sortField);
                            
                            if (valA == null && valB == null) return 0;
                            if (valA == null) return ascending ? -1 : 1;
                            if (valB == null) return ascending ? 1 : -1;
                            
                            // Compare different types of values
                            if (valA instanceof Number && valB instanceof Number) {
                                double numA = ((Number) valA).doubleValue();
                                double numB = ((Number) valB).doubleValue();
                                return ascending ? Double.compare(numA, numB) : Double.compare(numB, numA);
                            } else {
                                String strA = valA.toString();
                                String strB = valB.toString();
                                return ascending ? strA.compareTo(strB) : strB.compareTo(strA);
                            }
                        });
                    }
                    
                    // Apply pagination
                    int endIndex = Math.min(skip + limit, documentList.size());
                    for (int i = skip; i < endIndex; i++) {
                        Map.Entry<String, JSONObject> entry = documentList.get(i);
                        results.put(entry.getKey(), entry.getValue());
                        matchCount++;
                    }
                    
                    response.put("status", "success");
                    response.put("documents", results);
                    response.put("count", matchCount);
                    response.put("totalMatches", documentList.size());
                }
            }
            
            return response;
        }
        
        private boolean matchesQuery(JSONObject document, JSONObject query) {
            // Simple query matching logic
            for (String key : query.keySet()) {
                if (key.equals("$and")) {
                    JSONArray conditions = query.optJSONArray(key);
                    if (conditions != null) {
                        for (int i = 0; i < conditions.length(); i++) {
                            JSONObject condition = conditions.optJSONObject(i);
                            if (condition != null && !matchesQuery(document, condition)) {
                                return false;
                            }
                        }
                    }
                } else if (key.equals("$or")) {
                    JSONArray conditions = query.optJSONArray(key);
                    if (conditions != null) {
                        boolean anyMatch = false;
                        for (int i = 0; i < conditions.length(); i++) {
                            JSONObject condition = conditions.optJSONObject(i);
                            if (condition != null && matchesQuery(document, condition)) {
                                anyMatch = true;
                                break;
                            }
                        }
                        if (!anyMatch) return false;
                    }
                } else if (key.equals("$not")) {
                    JSONObject condition = query.optJSONObject(key);
                    if (condition != null && matchesQuery(document, condition)) {
                        return false;
                    }
                } else {
                    // Handle comparison operators
                    if (key.contains(".")) {
                        // Handle nested fields
                        String[] parts = key.split("\\.", 2);
                        String nestedKey = parts[0];
                        String remainingKey = parts[1];
                        
                        JSONObject nestedObj = document.optJSONObject(nestedKey);
                        if (nestedObj == null) {
                            return false;
                        }
                        
                        JSONObject nestedQuery = new JSONObject();
                        nestedQuery.put(remainingKey, query.get(key));
                        if (!matchesQuery(nestedObj, nestedQuery)) {
                            return false;
                        }
                    } else {
                        Object queryValue = query.get(key);
                        
                        if (queryValue instanceof JSONObject) {
                            // Handle operator queries like {age: {$gt: 30}}
                            JSONObject opQuery = (JSONObject) queryValue;
                            if (!matchesOperatorQuery(document, key, opQuery)) {
                                return false;
                            }
                        } else {
                            // Simple equality match
                            if (!document.has(key) || !isEqual(document.get(key), queryValue)) {
                                return false;
                            }
                        }
                    }
                }
            }
            
            return true;
        }
        
        private boolean matchesOperatorQuery(JSONObject document, String field, JSONObject opQuery) {
            if (!document.has(field)) {
                return false;
            }
            
            Object fieldValue = document.get(field);
            
            for (String op : opQuery.keySet()) {
                Object compareValue = opQuery.get(op);
                
                switch (op) {
                    case "$eq":
                        if (!isEqual(fieldValue, compareValue)) return false;
                        break;
                    case "$ne":
                        if (isEqual(fieldValue, compareValue)) return false;
                        break;
                    case "$gt":
                        if (!isGreaterThan(fieldValue, compareValue)) return false;
                        break;
                    case "$gte":
                        if (!isGreaterThan(fieldValue, compareValue) && !isEqual(fieldValue, compareValue)) return false;
                        break;
                    case "$lt":
                        if (!isLessThan(fieldValue, compareValue)) return false;
                        break;
                    case "$lte":
                        if (!isLessThan(fieldValue, compareValue) && !isEqual(fieldValue, compareValue)) return false;
                        break;
                    case "$in":
                        if (!(compareValue instanceof JSONArray) || !isInArray((JSONArray) compareValue, fieldValue)) return false;
                        break;
                    case "$nin":
                        if (!(compareValue instanceof JSONArray) || isInArray((JSONArray) compareValue, fieldValue)) return false;
                        break;
                    case "$exists":
                        boolean shouldExist = Boolean.parseBoolean(compareValue.toString());
                        if (shouldExist != document.has(field)) return false;
                        break;
                    case "$regex":
                        if (!(fieldValue instanceof String) || !matchesRegex((String) fieldValue, compareValue.toString())) return false;
                        break;
                }
            }
            
            return true;
        }
        
        private boolean isEqual(Object a, Object b) {
            if (a == null && b == null) return true;
            if (a == null || b == null) return false;
            
            if (a instanceof Number && b instanceof Number) {
                double numA = ((Number) a).doubleValue();
                double numB = ((Number) b).doubleValue();
                return Math.abs(numA - numB) < 0.00001; // Small epsilon for floating point comparison
            }
            
            return a.toString().equals(b.toString());
        }
        
        private boolean isGreaterThan(Object a, Object b) {
            if (a == null || b == null) return false;
            
            if (a instanceof Number && b instanceof Number) {
                double numA = ((Number) a).doubleValue();
                double numB = ((Number) b).doubleValue();
                return numA > numB;
            }
            
            return a.toString().compareTo(b.toString()) > 0;
        }
        
        private boolean isLessThan(Object a, Object b) {
            if (a == null || b == null) return false;
            
            if (a instanceof Number && b instanceof Number) {
                double numA = ((Number) a).doubleValue();
                double numB = ((Number) b).doubleValue();
                return numA < numB;
            }
            
            return a.toString().compareTo(b.toString()) < 0;
        }
        
        private boolean isInArray(JSONArray array, Object value) {
            for (int i = 0; i < array.length(); i++) {
                if (isEqual(array.get(i), value)) {
                    return true;
                }
            }
            return false;
        }
        
        private boolean matchesRegex(String value, String pattern) {
            try {
                return value.matches(pattern);
            } catch (Exception e) {
                return false;
            }
        }
    }
















