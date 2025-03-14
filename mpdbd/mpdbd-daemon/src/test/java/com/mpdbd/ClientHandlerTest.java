package com.mpdbd;


import com.server.ClientHandler;
import org.json.JSONObject;
import org.junit.jupiter.api.*;
import org.junit.jupiter.api.MethodOrderer.OrderAnnotation;
import org.junit.jupiter.api.TestInstance.Lifecycle;

import java.io.*;
import java.net.Socket;
import java.nio.file.Files;
import java.nio.file.Paths;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@TestMethodOrder(OrderAnnotation.class)
@TestInstance(Lifecycle.PER_CLASS)
public class ClientHandlerTest {

    private Socket mockSocket;
    private ByteArrayOutputStream outputStream;
    private ByteArrayInputStream inputStream;
    private ClientHandler clientHandler;
    private PrintWriter writer;
    private BufferedReader reader;

    private static final String TEST_DB = "testDB";
    private static final String TEST_COLLECTION = "testCollection";
    private static final String DATA_DIR = "data/";
    private static final String DB_FILE = DATA_DIR + "mpdb_data.json";

    @BeforeAll
    public void setupAll() throws IOException {
        // Ensure data directory exists
        Files.createDirectories(Paths.get(DATA_DIR));
        
        // Delete any existing test file
        Files.deleteIfExists(Paths.get(DB_FILE));
    }

    @BeforeEach
    public void setup() throws IOException {
        // Setup mock socket
        mockSocket = mock(Socket.class);
        
        // Create streams
        outputStream = new ByteArrayOutputStream();
        inputStream = new ByteArrayInputStream("".getBytes());
        
        // Configure mock socket
        when(mockSocket.getOutputStream()).thenReturn(outputStream);
        when(mockSocket.getInputStream()).thenReturn(inputStream);
        
        // Create client handler with mock socket
        clientHandler = new ClientHandler(mockSocket);
    }

    @AfterEach
    public void cleanup() throws IOException {
        outputStream.close();
        inputStream.close();
    }

    @AfterAll
    public void cleanupAll() throws IOException {
        // Clean up test database file
        Files.deleteIfExists(Paths.get(DB_FILE));
    }

    private JSONObject sendRequest(JSONObject request) throws IOException {
        // Set up new input stream with the request
        String requestStr = request.toString() + "\n";
        
        // We need to reset the socket mock for new input
        reset(mockSocket);
        
        // Create new streams
        ByteArrayInputStream newInput = new ByteArrayInputStream(requestStr.getBytes());
        ByteArrayOutputStream newOutput = new ByteArrayOutputStream();
        
        // Setup mock socket again
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
    public void testInvalidJSON() throws IOException {
        // Setup invalid input stream
        String invalidJson = "This is not valid JSON\n";
        reset(mockSocket);
        ByteArrayInputStream invalidInputStream = new ByteArrayInputStream(invalidJson.getBytes());
        ByteArrayOutputStream newOutput = new ByteArrayOutputStream();
        when(mockSocket.getInputStream()).thenReturn(invalidInputStream);
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
        JSONObject errorResponse = new JSONObject(lines[0]);
        
        assertEquals("error", errorResponse.getString("status"));
        assertEquals("Invalid JSON format", errorResponse.getString("message"));
    }

    @Test
    @Order(2)
    public void testCreateDatabase() throws IOException {
        JSONObject request = new JSONObject();
        request.put("action", "CREATE_DB");
        request.put("dbName", TEST_DB);
        
        JSONObject response = sendRequest(request);
        
        assertEquals("success", response.getString("status"));
        assertTrue(response.getString("message").contains("created"));
    }

    @Test
    @Order(3)
    public void testCreateDuplicateDatabase() throws IOException {
        JSONObject request = new JSONObject();
        request.put("action", "CREATE_DB");
        request.put("dbName", TEST_DB);
        
        JSONObject response = sendRequest(request);
        
        assertEquals("error", response.getString("status"));
        assertTrue(response.getString("message").contains("already exists"));
    }

    @Test
    @Order(4)
    public void testListDatabases() throws IOException {
        JSONObject request = new JSONObject();
        request.put("action", "LIST_DB");
        
        JSONObject response = sendRequest(request);
        
        assertEquals("success", response.getString("status"));
        assertTrue(response.getJSONArray("data").toString().contains(TEST_DB));
    }

    @Test
    @Order(5)
    public void testCreateCollection() throws IOException {
        JSONObject request = new JSONObject();
        request.put("action", "CREATE_COLLECTION");
        request.put("dbName", TEST_DB);
        request.put("collectionName", TEST_COLLECTION);
        
        JSONObject response = sendRequest(request);
        
        assertEquals("success", response.getString("status"));
        assertTrue(response.getString("message").contains("created"));
    }

    @Test
    @Order(6)
    public void testCreateDuplicateCollection() throws IOException {
        JSONObject request = new JSONObject();
        request.put("action", "CREATE_COLLECTION");
        request.put("dbName", TEST_DB);
        request.put("collectionName", TEST_COLLECTION);
        
        JSONObject response = sendRequest(request);
        
        assertEquals("error", response.getString("status"));
        assertTrue(response.getString("message").contains("already exists"));
    }

    @Test
    @Order(7)
    public void testListCollections() throws IOException {
        JSONObject request = new JSONObject();
        request.put("action", "LIST_COLLECTIONS");
        request.put("dbName", TEST_DB);
        
        JSONObject response = sendRequest(request);
        
        assertEquals("success", response.getString("status"));
        assertTrue(response.getJSONArray("collections").toString().contains(TEST_COLLECTION));
    }

    @Test
    @Order(8)
    public void testCreateDocument() throws IOException {
        JSONObject request = new JSONObject();
        request.put("action", "CREATE_DOCUMENT");
        request.put("dbName", TEST_DB);
        request.put("collectionName", TEST_COLLECTION);
        
        JSONObject document = new JSONObject();
        document.put("name", "Test User");
        document.put("age", 30);
        document.put("email", "test@example.com");
        
        request.put("document", document);
        
        JSONObject response = sendRequest(request);
        
        assertEquals("success", response.getString("status"));
        assertTrue(response.getString("message").contains("inserted"));
        assertNotNull(response.getString("documentId"));
    }

    @Test
    @Order(9)
    public void testCreateDocumentWithCustomId() throws IOException {
        JSONObject request = new JSONObject();
        request.put("action", "CREATE_DOCUMENT");
        request.put("dbName", TEST_DB);
        request.put("collectionName", TEST_COLLECTION);
        request.put("documentId", "custom-id-1");
        
        JSONObject document = new JSONObject();
        document.put("name", "Custom ID User");
        document.put("age", 25);
        document.put("email", "custom@example.com");
        
        request.put("document", document);
        
        JSONObject response = sendRequest(request);
        
        assertEquals("success", response.getString("status"));
        assertEquals("custom-id-1", response.getString("documentId"));
    }

    @Test
    @Order(10)
    public void testReadDocument() throws IOException {
        // First create document with custom ID
        JSONObject createRequest = new JSONObject();
        createRequest.put("action", "CREATE_DOCUMENT");
        createRequest.put("dbName", TEST_DB);
        createRequest.put("collectionName", TEST_COLLECTION);
        createRequest.put("documentId", "test-read-doc");
        
        JSONObject document = new JSONObject();
        document.put("name", "Read Test");
        document.put("value", 42);
        
        createRequest.put("document", document);
        
        sendRequest(createRequest);
        
        // Then try to read it
        JSONObject readRequest = new JSONObject();
        readRequest.put("action", "READ_DOCUMENT");
        readRequest.put("dbName", TEST_DB);
        readRequest.put("collectionName", TEST_COLLECTION);
        readRequest.put("documentId", "test-read-doc");
        
        JSONObject response = sendRequest(readRequest);
        
        assertEquals("success", response.getString("status"));
        assertEquals("Read Test", response.getJSONObject("document").getString("name"));
        assertEquals(42, response.getJSONObject("document").getInt("value"));
    }

    @Test
    @Order(11)
    public void testReadAllDocuments() throws IOException {
        JSONObject request = new JSONObject();
        request.put("action", "READ_DOCUMENTS");
        request.put("dbName", TEST_DB);
        request.put("collectionName", TEST_COLLECTION);
        
        JSONObject response = sendRequest(request);
        
        assertEquals("success", response.getString("status"));
        assertTrue(response.getInt("count") >= 3); // We've created at least 3 documents by now
    }

    @Test
    @Order(12)
    public void testUpdateDocument() throws IOException {
        // First check that our document exists
        JSONObject readRequest = new JSONObject();
        readRequest.put("action", "READ_DOCUMENT");
        readRequest.put("dbName", TEST_DB);
        readRequest.put("collectionName", TEST_COLLECTION);
        readRequest.put("documentId", "test-read-doc");
        
        JSONObject initialDoc = sendRequest(readRequest);
        
        // Now update it
        JSONObject updateRequest = new JSONObject();
        updateRequest.put("action", "UPDATE_DOCUMENT");
        updateRequest.put("dbName", TEST_DB);
        updateRequest.put("collectionName", TEST_COLLECTION);
        updateRequest.put("documentId", "test-read-doc");
        
        JSONObject updates = new JSONObject();
        updates.put("name", "Updated Name");
        updates.put("newField", "New Value");
        
        updateRequest.put("updates", updates);
        
        JSONObject updateResponse = sendRequest(updateRequest);
        
        assertEquals("success", updateResponse.getString("status"));
        
        // Verify the document was updated
        JSONObject verifyRequest = new JSONObject();
        verifyRequest.put("action", "READ_DOCUMENT");
        verifyRequest.put("dbName", TEST_DB);
        verifyRequest.put("collectionName", TEST_COLLECTION);
        verifyRequest.put("documentId", "test-read-doc");
        
        JSONObject verifyResponse = sendRequest(verifyRequest);
        
        assertEquals("Updated Name", verifyResponse.getJSONObject("document").getString("name"));
        assertEquals("New Value", verifyResponse.getJSONObject("document").getString("newField"));
        assertEquals(42, verifyResponse.getJSONObject("document").getInt("value")); // Original field preserved
    }

    @Test
    @Order(13)
    public void testQueryDocuments() throws IOException {
        // Create several documents for querying
        for (int i = 0; i < 5; i++) {
            JSONObject createRequest = new JSONObject();
            createRequest.put("action", "CREATE_DOCUMENT");
            createRequest.put("dbName", TEST_DB);
            createRequest.put("collectionName", TEST_COLLECTION);
            
            JSONObject document = new JSONObject();
            document.put("index", i);
            document.put("even", (i % 2 == 0));
            document.put("value", i * 10);
            
            createRequest.put("document", document);
            
            sendRequest(createRequest);
        }
        
        // Query for even documents
        JSONObject queryRequest = new JSONObject();
        queryRequest.put("action", "QUERY");
        queryRequest.put("dbName", TEST_DB);
        queryRequest.put("collectionName", TEST_COLLECTION);
        
        JSONObject query = new JSONObject();
        query.put("even", true);
        
        queryRequest.put("query", query);
        
        JSONObject response = sendRequest(queryRequest);
        
        assertEquals("success", response.getString("status"));
        JSONObject results = response.getJSONObject("documents");
        
        // We should find at least 3 documents (0, 2, 4)
        assertTrue(response.getInt("count") >= 3);
        
        // Try a more complex query
        JSONObject complexQuery = new JSONObject();
        complexQuery.put("action", "QUERY");
        complexQuery.put("dbName", TEST_DB);
        complexQuery.put("collectionName", TEST_COLLECTION);
        
        JSONObject valueQuery = new JSONObject();
        JSONObject gtOperator = new JSONObject();
        gtOperator.put("$gt", 20);
        valueQuery.put("value", gtOperator);
        
        complexQuery.put("query", valueQuery);
        complexQuery.put("sortBy", "index");
        complexQuery.put("ascending", false);
        complexQuery.put("limit", 2);
        
        JSONObject complexResponse = sendRequest(complexQuery);
        
        assertEquals("success", complexResponse.getString("status"));
        assertTrue(complexResponse.getInt("count") <= 2); // Respects the limit
    }

    @Test
    @Order(14)
    public void testDeleteDocument() throws IOException {
        // First create a document to delete
        JSONObject createRequest = new JSONObject();
        createRequest.put("action", "CREATE_DOCUMENT");
        createRequest.put("dbName", TEST_DB);
        createRequest.put("collectionName", TEST_COLLECTION);
        createRequest.put("documentId", "doc-to-delete");
        
        JSONObject document = new JSONObject();
        document.put("name", "Delete Test");
        
        createRequest.put("document", document);
        
        sendRequest(createRequest);
        
        // Now delete it
        JSONObject deleteRequest = new JSONObject();
        deleteRequest.put("action", "DELETE_DOCUMENT");
        deleteRequest.put("dbName", TEST_DB);
        deleteRequest.put("collectionName", TEST_COLLECTION);
        deleteRequest.put("documentId", "doc-to-delete");
        
        JSONObject response = sendRequest(deleteRequest);
        
        assertEquals("success", response.getString("status"));
        
        // Verify it's gone
        JSONObject verifyRequest = new JSONObject();
        verifyRequest.put("action", "READ_DOCUMENT");
        verifyRequest.put("dbName", TEST_DB);
        verifyRequest.put("collectionName", TEST_COLLECTION);
        verifyRequest.put("documentId", "doc-to-delete");
        
        JSONObject verifyResponse = sendRequest(verifyRequest);
        
        assertEquals("error", verifyResponse.getString("status"));
        assertTrue(verifyResponse.getString("message").contains("not found"));
    }

    @Test
    @Order(15)
    public void testDeleteCollection() throws IOException {
        JSONObject request = new JSONObject();
        request.put("action", "DELETE_COLLECTION");
        request.put("dbName", TEST_DB);
        request.put("collectionName", TEST_COLLECTION);
        
        JSONObject response = sendRequest(request);
        
        assertEquals("success", response.getString("status"));
        
        // Verify it's gone
        JSONObject verifyRequest = new JSONObject();
        verifyRequest.put("action", "LIST_COLLECTIONS");
        verifyRequest.put("dbName", TEST_DB);
        
        JSONObject verifyResponse = sendRequest(verifyRequest);
        
        assertEquals("success", verifyResponse.getString("status"));
        assertFalse(verifyResponse.getJSONArray("collections").toString().contains(TEST_COLLECTION));
    }

    @Test
    @Order(16)
    public void testDeleteDatabase() throws IOException {
        JSONObject request = new JSONObject();
        request.put("action", "DELETE_DB");
        request.put("dbName", TEST_DB);
        
        JSONObject response = sendRequest(request);
        
        assertEquals("success", response.getString("status"));
        
        // Verify it's gone
        JSONObject verifyRequest = new JSONObject();
        verifyRequest.put("action", "LIST_DB");
        
        JSONObject verifyResponse = sendRequest(verifyRequest);
        
        assertEquals("success", verifyResponse.getString("status"));
        assertFalse(verifyResponse.getJSONArray("data").toString().contains(TEST_DB));
    }

    @Test
    @Order(17)
    public void testUnknownAction() throws IOException {
        JSONObject request = new JSONObject();
        request.put("action", "UNKNOWN_ACTION");
        
        JSONObject response = sendRequest(request);
        
        assertEquals("error", response.getString("status"));
        assertTrue(response.getString("message").contains("Unknown action"));
    }
}