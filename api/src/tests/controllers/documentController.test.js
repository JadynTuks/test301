import { 
    createDocument, 
    readDocument, 
    readDocuments, 
    updateDocument, 
    deleteDocument,
    queryDocuments 
  } from 'src/controllers/documentController.js';
  import { sendToDaemon } from 'src/services/tcpClient.js';
  
  // Mock the TCP client service
  jest.mock('src/services/tcpClient.js');
  
  describe('Document Controller Tests', () => {
    let req;
    let res;
    
    beforeEach(() => {
      // Reset mocks before each test
      jest.clearAllMocks();
      
      // Setup request and response objects
      req = {
        body: {},
        query: {}
      };
      
      res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
      
      // Mock successful daemon response
      sendToDaemon.mockResolvedValue({ success: true, data: {} });
    });
    
    describe('createDocument', () => {
      it('should return 400 if required fields are missing', async () => {
        await createDocument(req, res);
        
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
          error: expect.stringContaining('required')
        }));
      });
      
      it('should send correct request to daemon when all fields are provided', async () => {
        const testData = {
          dbName: 'testDb',
          collectionName: 'testCollection',
          document: { name: 'Test Document' }
        };
        
        req.body = testData;
        
        await createDocument(req, res);
        
        expect(sendToDaemon).toHaveBeenCalledWith({
          action: 'CREATE_DOCUMENT',
          ...testData
        });
        expect(res.json).toHaveBeenCalledWith({ success: true, data: {} });
      });
      
      it('should include documentId in request if provided', async () => {
        const testData = {
          dbName: 'testDb',
          collectionName: 'testCollection',
          document: { name: 'Test Document' },
          documentId: 'doc123'
        };
        
        req.body = testData;
        
        await createDocument(req, res);
        
        expect(sendToDaemon).toHaveBeenCalledWith({
          action: 'CREATE_DOCUMENT',
          ...testData
        });
      });
      
      it('should return 500 status on error', async () => {
        req.body = {
          dbName: 'testDb',
          collectionName: 'testCollection',
          document: { name: 'Test Document' }
        };
        
        const error = new Error('Test error');
        sendToDaemon.mockRejectedValue(error);
        
        await createDocument(req, res);
        
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
          error: 'Daemon error',
          details: 'Test error'
        }));
      });
    });
    
    describe('readDocument', () => {
      it('should return 400 if required fields are missing', async () => {
        await readDocument(req, res);
        
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
          error: expect.stringContaining('required')
        }));
      });
      
      it('should send correct request to daemon when all fields are provided', async () => {
        const testData = {
          dbName: 'testDb',
          collectionName: 'testCollection',
          documentId: 'doc123'
        };
        
        req.query = testData;
        
        await readDocument(req, res);
        
        expect(sendToDaemon).toHaveBeenCalledWith({
          action: 'READ_DOCUMENT',
          ...testData
        });
        expect(res.json).toHaveBeenCalledWith({ success: true, data: {} });
      });
      
      it('should return 500 status on error', async () => {
        req.query = {
          dbName: 'testDb',
          collectionName: 'testCollection',
          documentId: 'doc123'
        };
        
        const error = new Error('Test error');
        sendToDaemon.mockRejectedValue(error);
        
        await readDocument(req, res);
        
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
          error: 'Daemon error',
          details: 'Test error'
        }));
      });
    });
    
    describe('readDocuments', () => {
      it('should return 400 if required fields are missing', async () => {
        await readDocuments(req, res);
        
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
          error: expect.stringContaining('required')
        }));
      });
      
      it('should send correct request to daemon when all fields are provided', async () => {
        const testData = {
          dbName: 'testDb',
          collectionName: 'testCollection'
        };
        
        req.query = testData;
        
        await readDocuments(req, res);
        
        expect(sendToDaemon).toHaveBeenCalledWith({
          action: 'READ_DOCUMENTS',
          ...testData
        });
        expect(res.json).toHaveBeenCalledWith({ success: true, data: {} });
      });
      
      it('should return 500 status on error', async () => {
        req.query = {
          dbName: 'testDb',
          collectionName: 'testCollection'
        };
        
        const error = new Error('Test error');
        sendToDaemon.mockRejectedValue(error);
        
        await readDocuments(req, res);
        
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
          error: 'Daemon error',
          details: 'Test error'
        }));
      });
    });
    
    describe('updateDocument', () => {
      it('should return 400 if required fields are missing', async () => {
        await updateDocument(req, res);
        
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
          error: expect.stringContaining('required')
        }));
      });
      
      it('should send correct request to daemon when all fields are provided', async () => {
        const testData = {
          dbName: 'testDb',
          collectionName: 'testCollection',
          documentId: 'doc123',
          updates: { name: 'Updated Document' }
        };
        
        req.body = testData;
        
        await updateDocument(req, res);
        
        expect(sendToDaemon).toHaveBeenCalledWith({
          action: 'UPDATE_DOCUMENT',
          ...testData
        });
        expect(res.json).toHaveBeenCalledWith({ success: true, data: {} });
      });
      
      it('should return 500 status on error', async () => {
        req.body = {
          dbName: 'testDb',
          collectionName: 'testCollection',
          documentId: 'doc123',
          updates: { name: 'Updated Document' }
        };
        
        const error = new Error('Test error');
        sendToDaemon.mockRejectedValue(error);
        
        await updateDocument(req, res);
        
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
          error: 'Daemon error',
          details: 'Test error'
        }));
      });
    });
    
    describe('deleteDocument', () => {
      it('should return 400 if required fields are missing', async () => {
        await deleteDocument(req, res);
        
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
          error: expect.stringContaining('required')
        }));
      });
      
      it('should send correct request to daemon when all fields are provided', async () => {
        const testData = {
          dbName: 'testDb',
          collectionName: 'testCollection',
          documentId: 'doc123'
        };
        
        req.body = testData;
        
        await deleteDocument(req, res);
        
        expect(sendToDaemon).toHaveBeenCalledWith({
          action: 'DELETE_DOCUMENT',
          ...testData
        });
        expect(res.json).toHaveBeenCalledWith({ success: true, data: {} });
      });
      
      it('should return 500 status on error', async () => {
        req.body = {
          dbName: 'testDb',
          collectionName: 'testCollection',
          documentId: 'doc123'
        };
        
        const error = new Error('Test error');
        sendToDaemon.mockRejectedValue(error);
        
        await deleteDocument(req, res);
        
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
          error: 'Daemon error',
          details: 'Test error'
        }));
      });
    });
    
    describe('queryDocuments', () => {
      it('should return 400 if required fields are missing', async () => {
        await queryDocuments(req, res);
        
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
          error: expect.stringContaining('required')
        }));
      });
      
      it('should send correct request to daemon with required fields only', async () => {
        const testData = {
          dbName: 'testDb',
          collectionName: 'testCollection',
          query: { name: 'Test' }
        };
        
        req.body = testData;
        
        await queryDocuments(req, res);
        
        expect(sendToDaemon).toHaveBeenCalledWith({
          action: 'QUERY',
          ...testData
        });
        expect(res.json).toHaveBeenCalledWith({ success: true, data: {} });
      });
      
      it('should include optional parameters if provided', async () => {
        const testData = {
          dbName: 'testDb',
          collectionName: 'testCollection',
          query: { name: 'Test' },
          sortBy: 'name',
          ascending: true,
          limit: 10,
          skip: 5
        };
        
        req.body = testData;
        
        await queryDocuments(req, res);
        
        expect(sendToDaemon).toHaveBeenCalledWith({
          action: 'QUERY',
          ...testData
        });
      });
      
      it('should return 500 status on error', async () => {
        req.body = {
          dbName: 'testDb',
          collectionName: 'testCollection',
          query: { name: 'Test' }
        };
        
        const error = new Error('Test error');
        sendToDaemon.mockRejectedValue(error);
        
        await queryDocuments(req, res);
        
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
          error: 'Daemon error',
          details: 'Test error'
        }));
      });
    });
  });