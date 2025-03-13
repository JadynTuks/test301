package com.mpdbd;


import com.server.ClientHandler;
import org.json.JSONArray;
import org.json.JSONObject;
import org.junit.jupiter.api.*;
import org.junit.jupiter.api.MethodOrderer.OrderAnnotation;
import org.junit.jupiter.api.TestInstance.Lifecycle;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.net.Socket;
import java.nio.file.Files;
import java.nio.file.Paths;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@TestMethodOrder(OrderAnnotation.class)
@TestInstance(Lifecycle.PER_CLASS)
public class QueryOperationsTest {

    private Socket mockSocket;
    private static final String TEST_DB = "queryTestDB";
    private static final String TEST_COLLECTION = "queryTestCollection";
    private static final String DATA_DIR = "data/";
    private static final String DB_FILE = DATA_DIR + "mpdb_data.json";

    @BeforeAll
    public void setupAll() throws IOException {
        // Ensure data directory exists
        Files.createDirectories(Paths.get(DATA_DIR));
        
        // Setup test database and collection
        setupTestEnvironment();
        
        // Create test data
        createTestData();
    }

    @AfterAll
    public void cleanupAll() throws IOException {
        // Clean up by deleting the test database
        JSONObject request = new JSONObject();
        request.put("action", "DELETE_DB");
        request.put("dbName", TEST_DB);
        
        sendRequest(request);
    }

    private void setupTestEnvironment() throws IOException {
        // Create database
        JSONObject createDBRequest = new JSONObject();
        createDBRequest.put("action", "CREATE_DB");
        createDBRequest.put("dbName", TEST_DB);
        sendRequest(createDBRequest);
        
        // Create collection
        JSONObject createCollectionRequest = new JSONObject();
        createCollectionRequest.put("action", "CREATE_COLLECTION");
        createCollectionRequest.put("dbName", TEST_DB);
        createCollectionRequest.put("collectionName", TEST_COLLECTION);
        sendRequest(createCollectionRequest);
    }

    private void createTestData() throws IOException {
        // Create various test documents with different properties
        String[] categories = {"Electronics", "Books", "Clothing", "Food", "Sports"};
        
        for (int i = 0; i < 20; i++) {
            JSONObject createRequest = new JSONObject();
            createRequest.put("action", "CREATE_DOCUMENT");
            createRequest.put("dbName", TEST_DB);
            createRequest.put("collectionName", TEST_COLLECTION);
            createRequest.put("documentId", "product-" + i);
            
            JSONObject document = new JSONObject();
            document.put("name", "Product " + i);
            document.put("price", 10.0 + (i * 5.5));
            document.put("inStock", (i % 3 == 0));
            document.put("quantity", i * 10);
            document.put("category", categories[i % categories.length]);
            document.put("tags", new JSONArray(new String[]{"tag" + (i % 3), "tag" + (i % 5)}));
            
            if (i % 2 == 0) {
                document.put("featured", true);
            }
            
            createRequest.put("document", document);
            sendRequest(createRequest);
        }
    }

    private JSONObject sendRequest(JSONObject request) throws IOException {
        // Set up new input stream with the request
        String requestStr = request.toString() + "\n";
        
        // Create mock socket
        mockSocket = mock(Socket.class);
        
        // Create new streams
        ByteArrayInputStream newInput = new ByteArrayInputStream(requestStr.getBytes());
        ByteArrayOutputStream newOutput = new ByteArrayOutputStream();
        
        // Setup mock socket
        when(mockSocket.getInputStream()).thenReturn(newInput);
        when(mockSocket.getOutputStream()).thenReturn(newOutput);
        
        // Create and start a new clientHandler
        ClientHandler handler = new ClientHandler(mockSocket);
        Thread handlerThread = new Thread(handler);
        handlerThread.start();
        
        // Give the thread time to process
        try {
            Thread.sleep(100);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        
        // Get response
        String response = newOutput.toString();
        String[] lines = response.split("\n");
        
        // Parse the first line as JSON
        return new JSONObject(lines[0]);
    }

    @Test
    @Order(1)
    public void testBasicQuery() throws IOException {
        JSONObject queryRequest = new JSONObject();
        queryRequest.put("action", "QUERY");
        queryRequest.put("dbName", TEST_DB);
        queryRequest.put("collectionName", TEST_COLLECTION);
        
        JSONObject query = new JSONObject();
        query.put("inStock", true);
        
        queryRequest.put("query", query);
        
        JSONObject response = sendRequest(queryRequest);
        
        assertEquals("success", response.getString("status"));
        // We should have at least 7 inStock products (every 3rd product)
        assertTrue(response.getInt("count") >= 7);
    }

    @Test
    @Order(2)
    public void testRangeQuery() throws IOException {
        JSONObject queryRequest = new JSONObject();
        queryRequest.put("action", "QUERY");
        queryRequest.put("dbName", TEST_DB);
        queryRequest.put("collectionName", TEST_COLLECTION);
        
        JSONObject query = new JSONObject();
        JSONObject priceRange = new JSONObject();
        priceRange.put("$gt", 30.0);
        priceRange.put("$lt", 70.0);
        query.put("price", priceRange);
        
        queryRequest.put("query", query);
        
        JSONObject response = sendRequest(queryRequest);
        
        assertEquals("success", response.getString("status"));
        // Verify documents have prices in the correct range
        JSONObject documents = response.getJSONObject("documents");
        for (String key : documents.keySet()) {
            JSONObject doc = documents.getJSONObject(key);
            double price = doc.getDouble("price");
            assertTrue(price > 30.0 && price < 70.0);
        }
    }

    @Test
    @Order(3)
    public void testQueryWithSortingAndLimit() throws IOException {
        JSONObject queryRequest = new JSONObject();
        queryRequest.put("action", "QUERY");
        queryRequest.put("dbName", TEST_DB);
        queryRequest.put("collectionName", TEST_COLLECTION);
        
        // No specific query - get all documents but sort them
        queryRequest.put("query", new JSONObject());
        queryRequest.put("sortBy", "price");
        queryRequest.put("ascending", false);
        queryRequest.put("limit", 5);
        
        JSONObject response = sendRequest(queryRequest);
        
        assertEquals("success", response.getString("status"));
        assertEquals(5, response.getInt("count"));
        
        // Verify documents are sorted by price in descending order
        JSONObject documents = response.getJSONObject("documents");
        double previousPrice = Double.MAX_VALUE;
        
        for (String key : documents.keySet()) {
            JSONObject doc = documents.getJSONObject(key);
            double currentPrice = doc.getDouble("price");
            assertTrue(currentPrice <= previousPrice);
            previousPrice = currentPrice;
        }
    }

    @Test
    @Order(4)
    public void testMultiConditionQuery() throws IOException {
        JSONObject queryRequest = new JSONObject();
        queryRequest.put("action", "QUERY");
        queryRequest.put("dbName", TEST_DB);
        queryRequest.put("collectionName", TEST_COLLECTION);
        
        JSONObject query = new JSONObject();
        query.put("featured", true);
        query.put("category", "Electronics");
        
        queryRequest.put("query", query);
        
        JSONObject response = sendRequest(queryRequest);
        
        assertEquals("success", response.getString("status"));
        
        // Verify all returned documents meet both conditions
        JSONObject documents = response.getJSONObject("documents");
        for (String key : documents.keySet()) {
            JSONObject doc = documents.getJSONObject(key);
            assertTrue(doc.getBoolean("featured"));
            assertEquals("Electronics", doc.getString("category"));
        }
    }

    @Test
    @Order(5)
    public void testQueryWithProjection() throws IOException {
        JSONObject queryRequest = new JSONObject();
        queryRequest.put("action", "QUERY");
        queryRequest.put("dbName", TEST_DB);
        queryRequest.put("collectionName", TEST_COLLECTION);
        
        JSONObject query = new JSONObject();
        query.put("category", "Books");
        
        queryRequest.put("query", query);
        
        // Add projection to only include specific fields
        JSONArray projection = new JSONArray();
        projection.put("name");
        projection.put("price");
        queryRequest.put("projection", projection);
        
        JSONObject response = sendRequest(queryRequest);
        
        assertEquals("success", response.getString("status"));
        
        // Verify returned documents only have the projected fields
        JSONObject documents = response.getJSONObject("documents");
        for (String key : documents.keySet()) {
            JSONObject doc = documents.getJSONObject(key);
            assertEquals(2, doc.length());
            assertTrue(doc.has("name"));
            assertTrue(doc.has("price"));
            assertFalse(doc.has("category"));
            assertFalse(doc.has("quantity"));
        }
    }
}