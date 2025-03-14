import NoSQLClient from './mpdb.js';

const client = new NoSQLClient("http://localhost:5000");

async function testLogin(){
    const data = {
        username: "Capleton",
        password: "Capleton11"
    }
    const result = await client.loginUser(data);
    console.log(result)
}

async function testRegistration(){
    const data = {
        username: "Capleton1",
        password: "Capleton11",
        email:"abcdgge@gmail.com"
    }
    const result = await client.registerUser(data);
    console.log(result)
}

async function testCreateDatabase() {
    const data = { dbName: "MockDB1" };
  
    const result = await client.createDatabase(data);
    console.log("Create Database Result:", result);
}

async function testListDatabases() {
   
    const result = await client.listDatabases();
    console.log("List Databases Result:", result);
}

async function testListCollections() {
   
    const result = await client.listCollections("MockDB");
    console.log("List Collections Result:", result);
}

async function runTests() {
    await testRegistration();
    await testLogin();
    await testCreateDatabase();
    /* await testCreateCollection();
    await testListDatabases();
    await testListCollections(); */
}

runTests();
