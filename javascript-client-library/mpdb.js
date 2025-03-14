class NOSQLClient {
    /**
     * @brief Constructs an instance of MPDB.
     * @param {string} baseURL - The base URL of the database API.
     */
    constructor(baseURL) {
        this.baseURL = baseURL;
        this.token = null;
    }

    /**
     * @brief Sends a request to the API.
     * @param {string} endpoint - The API endpoint.
     * @param {string} [method='GET'] - The HTTP method.
     * @param {Object|null} [body=null] - The request body.
     * @returns {Promise<Object>} - The API response.
     */
    async request(endpoint, method = 'GET', body = null) {
        try {
            const headers = { 'Content-Type': 'application/json' };
            if (this.token) headers['Authorization'] = `Bearer ${this.token}`;

            const options = { method, headers };
            if (body) options.body = JSON.stringify(body);

            const response = await fetch(`${this.baseURL}${endpoint}`, options);

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'API request failed');
            }

            return response.json();
        } catch (error) {
            console.error(`Error in request: ${method} ${endpoint}`, error);
            throw error;
        }
    }

    // ================== COLLECTION MANAGEMENT ==================


    deleteCollection(dbName, collectionName) {
        this.validateInput({ dbName, collectionName });
        return this.request(`/db/${dbName}/collections/${collectionName}`, 'DELETE');
    }

    // ================== USER & ROLE MANAGEMENT ==================

    listUsers() {
        return this.request(`/users`);
    }

    createUser(username, password, role) {
        this.validateInput({ username, password, role });
        return this.request(`/users`, 'POST', { username, password, role });
    }

    deleteUser(userId) {
        this.validateInput({ userId });
        return this.request(`/users/${userId}`, 'DELETE');
    }

    updateUserRole(userId, role) {
        this.validateInput({ userId, role });
        return this.request(`/users/${userId}/role`, 'PUT', { role });
    }

    // ================== INPUT VALIDATION ==================

    /**
     * @brief Validates user input to prevent empty or invalid values.
     * @param {Object} fields - An object containing the fields to validate.
     * @throws Will throw an error if validation fails.
     */
    validateInput(fields) {
        for (const [key, value] of Object.entries(fields)) {
            if (!value || (typeof value === 'string' && value.trim() === '')) {
                throw new Error(`Invalid input: ${key} cannot be empty.`);
            }
        }
    }

    async createDocument(data){
        if (!data.dbName || !data.collectionName || !data.document) {
            throw new Error("Invalid arguments");
        }

        try {
            const response = await fetch(`${this.baseURL}/document/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${data.token}`
                },
                body: JSON.stringify(data)
            });

            const res = await response.json();
            if (!res.success) {
                throw new Error(res.message);
            }
            return res;
        }
        catch (error) {
            throw new Error(error.message || "Error creating document");
        }
    }

    async readDocument(data){
        if (!data.dbName || !data.collectionName || !data.documentId) {
            throw new Error("Invalid arguments");
        }

        try {
            const response = await fetch(`${this.baseURL}/document/read`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${data.token}`
                },
                body: JSON.stringify(data)
            });

            const res = await response.json();
            if (!res.success) {
                throw new Error(res.message);
            }
            return res;
        }
        catch (error) {
            throw new Error(error.message || "Error reading document");
        }
    }

    async listDocuments(data){
        if (!data.dbName || !data.collectionName) {
            throw new Error("Invalid arguments");
        }

        try {
            const response = await fetch(`${this.baseURL}/document/list`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${data.token}`
                },
                body: JSON.stringify(data)
            });

            const res = await response.json();
            if (!res.success) {
                throw new Error(res.message);
            }
            return res;
        }
        catch (error) {
            throw new Error(error.message || "Error listing documents");
        }
    }

    async updateDocument(data){
        if (!data.dbName || !data.collectionName || !data.documentId || !data.update) {
            throw new Error("Invalid arguments");
        }

        try {
            const response = await fetch(`${this.baseURL}/document/update`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${data.token}`
                },
                body: JSON.stringify(data)
            });

            const res = await response.json();
            if (!res.success) {
                throw new Error(res.message);
            }
            return res;
        }
        catch (error) {
            throw new Error(error.message || "Error updating document");
        }
    }

    async deleteDocument(data){
        if (!data.dbName || !data.collectionName || !data.documentId) {
            throw new Error("Invalid arguments");
        }

        try {
            const response = await fetch(`${this.baseURL}/document/delete`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${data.token}`
                },
                body: JSON.stringify(data)
            });

            const res = await response.json();
            if (!res.success) {
                throw new Error(res.message);
            }
            return res;
        }
        catch (error) {
            throw new Error(error.message || "Error deleting document");
        }
    }

    async queryDocuments(data){
        console.log("data", data);  

        if (!data.dbName) {
            console.error("Missing dbName");
            throw new Error("Invalid arguments: Missing dbName");
        }
        if (!data.collectionName) {
            console.error("Missing collectionName");
            throw new Error("Invalid arguments: Missing collectionName");
        }
        if (!data.query) {
            console.error("Missing query");
            throw new Error("Invalid arguments: Missing query");
        }
        if (!data.projection) {
            console.error("Missing projection");
            throw new Error("Invalid arguments: Missing projection");
        }
        if (!data.sort) {
            console.error("Missing sort");
            throw new Error("Invalid arguments: Missing sort");
        }
        if (typeof data.limit !== 'number') {
            console.error("Invalid limit");
            throw new Error("Invalid arguments: Invalid limit");
        }
        if (typeof data.skip !== 'number') {
            console.error("Invalid skip");
            throw new Error("Invalid arguments: Invalid skip");
        }

        try {
            const response = await fetch(`${this.baseURL}/document/query`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${data.token}`
                },
                body: JSON.stringify(data)
            });

            const res = await response.json();
            if (!res.success) {
                throw new Error(res.message);
            }
            return res;
        }
        catch (error) {
            throw new Error(error.message || "Error querying documents");
        }
    }

    //---------------------------------------------- Authentication Functions --------------------------------------------------------------
    async registerUser(userData) {
        const response = await fetch(`${this.baseURL}/auth/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(userData),
        });
      
        if (!response.ok) {
          throw new Error('Failed to register');
        }
      
        const data = await response.json();
        return data; // Make sure it returns { token: '...' }
      }
      

    async loginUser(data) {
        try {
            const response = await fetch(`${this.baseURL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: data.username,
                    password: data.password
                })
            });

            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

            const result = await response.json();

            if (result.token) {
                token = result.token;
                console.log("✅ Logged in successfully!");
            }

            return result;
        } catch (err) {
            console.error("❌ Error:", err);
        }
    }

    async logoutUser() {
        try {
            if (!token) throw new Error("User is not logged in.");
            
            const response = await fetch(`${this.baseURL}/auth/logout`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

            token = null; // Clear token on logout

            return await response.json();
        } catch (err) {
            console.error("❌ Error:", err);
        }
    }

    async me() {
        try {
            if (!token) throw new Error("User is not logged in.");

            const response = await fetch(`${this.baseURL}/auth/me`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

            return await response.json();
        } catch (err) {
            console.error("❌ Error:", err);
        }
    }

    //---------------------------------------------------- Database Management Functions ---------------------------------------------------
    async createDatabase(data) {
        try {
            if (!token) throw new Error("User is not logged in.");

            const response = await fetch(`${this.baseURL}/db/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    dbName: data.dbName
                })
            });

            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

            const result = await response.json();


            console.log("✅ Database created:", result.database);
            return result;
        } catch (err) {
            console.error("❌ Error:", err);
        }
    }

    async deleteDatabase(dbName) {
        try {
            if (!token) throw new Error("User is not logged in.");

            const response = await fetch(`${this.baseURL}/db/delete`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ dbName })
            });

            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

            const result = await response.json();

            if (!result.success) {
                throw new Error(result.message);
            }

            console.log("✅ Database deleted successfully.");
            return result;
        } catch (err) {
            console.error("❌ Error:", err);
        }
    }

    async listDatabases() {
        try {
            if (!token) throw new Error("User is not logged in.");

            const response = await fetch(`${this.baseURL}/db/list`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

            const result = await response.json();

            if (!result.success) {
                throw new Error("Failed to fetch databases.");
            }

            console.log("✅ Databases:", result.databases);
            return result;
        } catch (err) {
            console.error("❌ Error:", err);
        }
    }

    async listCollections(dbName) {
        console.log(`Calling request with: /db/${dbName}/collections`);
        return this.request(`/db/${dbName}/collections`);
    }
    
}

export default NOSQLClient;
