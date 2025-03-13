import MPDB from './MPDB';

const baseURL = ''; // Replace with actual API URL
const dbClient = new MPDB(baseURL);

async function testMPDB() {
    // Test: Create User
    try {
        console.log('Creating user...');
        const newUser = await dbClient.createUser('MockAdmin1', 'securePass@123', 'admin');
        console.log('User created:', newUser);
    } catch (error) {
        console.error('Error creating user:', error);
    }

    // Test: List Users
    try {
        console.log('Listing users...');
        const users = await dbClient.listUsers();
        console.log('Users:', users);
    } catch (error) {
        console.error('Error listing users:', error);
    }

    // Test: Update User Role
    try {
        console.log('Updating user role...');
        await dbClient.updateUserRole(newUser.id, 'admin');
        console.log('User role updated.');
    } catch (error) {
        console.error('Error updating user role:', error);
    }

    // Test: Delete User
    try {
        console.log('Deleting user...');
        await dbClient.deleteUser(newUser.id);
        console.log('User deleted.');
    } catch (error) {
        console.error('Error deleting user:', error);
    }

    // Test: List Collections
    const dbName = 'testDB';
    try {
        console.log(`Listing collections in ${dbName}...`);
        const collections = await dbClient.listCollections(dbName);
        console.log('Collections:', collections);
    } catch (error) {
        console.error(`Error listing collections in ${dbName}:`, error);
    }

    // Test: Delete Collection
    const collectionName = 'testCollection';
    try {
        console.log(`Deleting collection ${collectionName}...`);
        await dbClient.deleteCollection(dbName, collectionName);
        console.log('Collection deleted.');
    } catch (error) {
        console.error(`Error deleting collection ${collectionName}:`, error);
    }
}

testMPDB();