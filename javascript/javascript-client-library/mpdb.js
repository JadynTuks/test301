import axios from 'axios';

export class NOSQLDBClient {
    constructor(API_URL) {
        this.API_URL = API_URL;
        //this.client = axios.create({baseURL: API_URL});
        //this.dbName = dbName;
    }

    

    async createDocument(data){
        if (!data.dbName || !data.collectionName || !data.document) {
            throw new Error("Invalid arguments");
        }

        try {
            const response = await fetch(`${this.API_URL}/document/create`, {
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
            const response = await fetch(`${this.API_URL}/document/read`, {
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
            const response = await fetch(`${this.API_URL}/document/list`, {
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
            const response = await fetch(`${this.API_URL}/document/update`, {
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
            const response = await fetch(`${this.API_URL}/document/delete`, {
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
            const response = await fetch(`${this.API_URL}/document/query`, {
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

}

export default NOSQLDBClient;