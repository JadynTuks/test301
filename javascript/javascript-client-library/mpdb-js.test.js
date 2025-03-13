import { jest, test } from '@jest/globals';
import { NOSQLDBClient } from './mpdb.js';

describe("deleteDocument", () => {
    let apiClient;
    const mockData = {
      dbName: "starkdb",
      collectionName: "users",
      documentId: "3000",
      token: "tonystarksupersecrettoken",
    };
  
    beforeEach(() => {
      apiClient = new NOSQLDBClient("http://localhost:3000");
      global.fetch = jest.fn(); 
    });
  
    afterEach(() => {
      jest.clearAllMocks();
    });
  
    test("should successfully delete a document and return response", async () => {
      const mockResponse = {
        success: true,
        message: "Document deleted successfully",
      };
  
      fetch.mockResolvedValue({
        json: jest.fn().mockResolvedValue(mockResponse),
      });
  
      const result = await apiClient.deleteDocument(mockData);
  
      expect(fetch).toHaveBeenCalledWith(`${apiClient.API_URL}/document/delete`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${mockData.token}`,
        },
        body: JSON.stringify(mockData),
      });
  
      expect(result).toEqual(mockResponse);
    });
  
    test("should throw an error if API response is unsuccessful", async () => {
      fetch.mockResolvedValue({
        json: jest.fn().mockResolvedValue({ success: false, message: "Deletion failed" }),
      });
  
      await expect(apiClient.deleteDocument(mockData)).rejects.toThrow("Deletion failed");
    });
  
    test("should throw an error when required fields are missing", async () => {
      await expect(apiClient.deleteDocument({})).rejects.toThrow("Invalid arguments");
    });
  
    test("should handle network errors properly", async () => {
      fetch.mockRejectedValue(new Error("Network Error"));
  
      await expect(apiClient.deleteDocument(mockData)).rejects.toThrow("Network Error");
    });
  });

  describe("createDocument", () => {
    let apiClient;
    const mockData = {
      dbName: "starkdb",
      collectionName: "users",
      document: { name: "Tony Stark", age: 45 },
      token: "tonystarksupersecrettoken",
    }; 

    beforeEach(() => {
        apiClient = new NOSQLDBClient("http://tonyurl:3000");
        global.fetch = jest.fn(); // Mock global fetch
      });

    afterEach(() => {
        jest.clearAllMocks();
      });

    test("should successfully create a document and return response", async () => {
        const mockResponse = {
          success: true,
          message: "Document created successfully",
        };
    
        fetch.mockResolvedValue({
          json: jest.fn().mockResolvedValue(mockResponse),
        });
    
        const result = await apiClient.createDocument(mockData);
    
        expect(fetch).toHaveBeenCalledWith(`${apiClient.API_URL}/document/create`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${mockData.token}`,
          },
          body: JSON.stringify(mockData),
        });
    
        expect(result).toEqual(mockResponse);
      });

    test("should throw an error if API response is unsuccessful", async () => {
        fetch.mockResolvedValue({
          json: jest.fn().mockResolvedValue({ success: false, message: "Error creating document" }),
        });
    
        await expect(apiClient.createDocument(mockData)).rejects.toThrow("Error creating document");
      });

    test("should throw an error when required fields are missing", async () => {
        await expect(apiClient.createDocument({})).rejects.toThrow("Invalid arguments");
      });

    test("should handle network errors properly", async () => {
        fetch.mockRejectedValue(new Error("Network Error"));
    
        await expect(apiClient.createDocument(mockData)).rejects.toThrow("Network Error");
      });
  });
  
    describe("readDocument", () => {
        let apiClient;
        const mockData = {
        dbName: "starkdb",
        collectionName: "users",
        documentId: "3000",
        token: "tonystarksupersecrettoken",
        };
        
        beforeEach(() => {
            apiClient = new NOSQLDBClient("http://localhost:3000");
            global.fetch = jest.fn(); // Mock global fetch
        });

        afterEach(() => {
            jest.clearAllMocks();
        });

        test("should successfully read a document and return response", async () => {
            const mockResponse = {
                success: true,
                message: "Document read successfully",
            };

            fetch.mockResolvedValue({
                json: jest.fn().mockResolvedValue(mockResponse),
            });

            const result = await apiClient.readDocument(mockData);

            expect(fetch).toHaveBeenCalledWith(`${apiClient.API_URL}/document/read`, {
                method: "POST",
                headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${mockData.token}`,
                },
                body: JSON.stringify(mockData),
            });

            expect(result).toEqual(mockResponse);
        });

        test("should throw an error if API response is unsuccessful", async () => {
            fetch.mockResolvedValue({
                json: jest.fn().mockResolvedValue({ success: false, message: "Error reading document" }),
            });

            await expect(apiClient.readDocument(mockData)).rejects.toThrow("Error reading document");
        });

        test("should throw an error when required fields are missing", async () => {
            await expect(apiClient.readDocument({})).rejects.toThrow("Invalid arguments");
        });

        test("should handle network errors properly", async () => {
            fetch.mockRejectedValue(new Error("Network Error"));

            await expect(apiClient.readDocument(mockData)).rejects.toThrow("Network Error");
        });
    });

    describe("listDocuments", () => {
        let apiClient;
        const mockData = {
        dbName: "starkdb",
        collectionName: "users",
        token: "tonystarksupersecrettoken",
        };

        beforeEach(() => {
            apiClient = new NOSQLDBClient("http://localhost:3000");
            global.fetch = jest.fn(); // Mock global fetch
        });

        afterEach(() => {
            jest.clearAllMocks();
        });

        test("should successfully list documents and return response", async () => {
            const mockResponse = {
                success: true,
                message: "Documents listed successfully",
            };

            fetch.mockResolvedValue({
                json: jest.fn().mockResolvedValue(mockResponse),
            });

            const result = await apiClient.listDocuments(mockData);

            expect(fetch).toHaveBeenCalledWith(`${apiClient.API_URL}/document/list`, {
                method: "POST",
                headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${mockData.token}`,
                },
                body: JSON.stringify(mockData),
            });

            expect(result).toEqual(mockResponse);
        });

        test("should throw an error if API response is unsuccessful", async () => {
            fetch.mockResolvedValue({
                json: jest.fn().mockResolvedValue({ success: false, message: "Error listing documents" }),
            });

            await expect(apiClient.listDocuments(mockData)).rejects.toThrow("Error listing documents");
        });

        test("should throw an error when required fields are missing", async () => {
            await expect(apiClient.listDocuments({})).rejects.toThrow("Invalid arguments");
        });

        test("should handle network errors properly", async () => {
            fetch.mockRejectedValue(new Error("Network Error"));

            await expect(apiClient.listDocuments(mockData)).rejects.toThrow("Network Error");
        });
    });

    describe("updateDocument", () => {
        let apiClient;
        const mockData = {
        dbName: "starkdb",
        collectionName: "users",
        documentId: "3000",
        update: { name: "Tony Stark", age: 45 },
        token: "tonystarksupersecrettoken",
        };

        beforeEach(() => {
            apiClient = new NOSQLDBClient("http://localhost:3000");
            global.fetch = jest.fn(); // Mock global fetch
        });

        afterEach(() => {
            jest.clearAllMocks();
        });

        test("should successfully update a document and return response", async () => {
            const mockResponse = {
                success: true,
                message: "Document updated successfully",
            };

            fetch.mockResolvedValue({
                json: jest.fn().mockResolvedValue(mockResponse),
            });

            const result = await apiClient.updateDocument(mockData);

            expect(fetch).toHaveBeenCalledWith(`${apiClient.API_URL}/document/update`, {
                method: "POST",
                headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${mockData.token}`,
                },
                body: JSON.stringify(mockData),
            });

            expect(result).toEqual(mockResponse);
        });

        test("should throw an error if API response is unsuccessful", async () => {
            fetch.mockResolvedValue({
                json: jest.fn().mockResolvedValue({ success: false, message: "Error updating document" }),
            });

            await expect(apiClient.updateDocument(mockData)).rejects.toThrow("Error updating document");
        });

        test("should throw an error when required fields are missing", async () => {
            await expect(apiClient.updateDocument({})).rejects.toThrow("Invalid arguments");
        });

        test("should handle network errors properly", async () => {
            fetch.mockRejectedValue(new Error("Network Error"));

            await expect(apiClient.updateDocument(mockData)).rejects.toThrow("Network Error");
        });
    });

    describe("queryDocuments", () => {
        let apiClient;
        const mockData = {
            dbName: "starkdb",
            collectionName: "users",
            query: { age: { "$gt": 45 } }, 
            projection: { name: 1, age: 1 },
            sort: { name: 1 },
            limit: 10,
            skip: 0,
            token: "tonystarksupersecrettoken"
        };

        beforeEach(() => {
            apiClient = new NOSQLDBClient("http://localhost:3000");
            global.fetch = jest.fn(); // Mock global fetch
        });

        afterEach(() => {
            jest.clearAllMocks();
        });

        test("should successfully query documents and return response", async () => {
            const mockResponse = {
                success: true,
                message: "Documents queried successfully",
            };

            fetch.mockResolvedValue({
                json: jest.fn().mockResolvedValue(mockResponse),
            });

            const result = await apiClient.queryDocuments(mockData);

            expect(fetch).toHaveBeenCalledWith(`${apiClient.API_URL}/document/query`, {
                method: "POST",
                headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${mockData.token}`,
                },
                body: JSON.stringify(mockData),
            });

            expect(result).toEqual(mockResponse);
        });

        test("should throw an error if API response is unsuccessful", async () => {
            fetch.mockResolvedValue({
                json: jest.fn().mockResolvedValue({ success: false, message: "Error querying documents" }),
            });

            await expect(apiClient.queryDocuments(mockData)).rejects.toThrow("Error querying documents");
        });

        test("should throw an error when required fields are missing", async () => {
            await expect(apiClient.queryDocuments({})).rejects.toThrow("Invalid arguments");
        });

        test("should handle network errors properly", async () => {
            fetch.mockRejectedValue(new Error("Network Error"));

            await expect(apiClient.queryDocuments(mockData)).rejects.toThrow("Network Error");
        });
      });