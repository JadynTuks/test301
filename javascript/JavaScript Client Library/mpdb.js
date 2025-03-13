class MPDB {
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

    listCollections(dbName) {
        this.validateInput({ dbName });
        return this.request(`/db/${dbName}/collections`);
    }

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
}

    // Export the class for the UI team to use
    export default MPDB;
