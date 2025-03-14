import NOSQLClient from './mpdb.js'; // Adjust the path if necessary

global.fetch = jest.fn(); // Mock the fetch API

beforeAll(() => {
  console.error = jest.fn(); // Override console.error
});

afterAll(() => {
  console.error.mockRestore(); 
});

describe('NOSQLClient Class', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('NOSQLClient constructor should initialize with baseURL and null token', () => {
    const db = new NOSQLClient('https://api.example.com');
    expect(db.baseURL).toBe('https://api.example.com');
    expect(db.token).toBeNull();
  });

  test('request method should return data on successful response', async () => {
    const db = new NOSQLClient('https://api.example.com');
    const mockResponse = { message: 'success' };

    global.fetch.mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue(mockResponse),
    });

    const result = await db.request('/endpoint');
    expect(result).toEqual(mockResponse);
  });

  test('request method should throw error on failed response', async () => {
    const db = new NOSQLClient('https://api.example.com');
    global.fetch.mockResolvedValue({
      ok: false,
      json: jest.fn().mockResolvedValue({ message: 'API request failed' }),
    });

    await expect(db.request('/endpoint')).rejects.toThrow('API request failed');
  });

  test('listCollections should call request with correct endpoint', async () => {
    const db = new NOSQLClient('https://api.example.com');
    db.request = jest.fn().mockResolvedValue({ collections: [] });
    await db.listCollections('testDB');
    expect(db.request).toHaveBeenCalledWith('/db/testDB/collections');
  });
});

//---------------------- Unit Testing ----------------------
/* describe('NOSQLClient Unit Tests', () => {
  let client;
  const baseURL = 'http://localhost:5000';
  const mockToken = 'CallMeToken';

  beforeEach(() => {
    client = new NOSQLClient(baseURL);
    fetch.mockClear();
  });

  test('registerUser - should register a user and return a token', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ token: mockToken })
    });

    const result = await client.registerUser({
      username: 'Capleton',
      password: 'CaplePass',
      email: 'test@example.com'
    });

    console.log("registerUser response:", result); // Debugging log

    expect(fetch).toHaveBeenCalledWith(`${baseURL}/auth/register`, expect.any(Object));
    expect(result.token).toBe(mockToken);
  });

  test('loginUser - should login user and return a token', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ token: mockToken })
    });

    const result = await client.loginUser({ username: 'Capleton', password: 'CaplePass' });
    expect(fetch).toHaveBeenCalledWith(`${baseURL}/auth/login`, expect.any(Object));
    expect(result.token).toBe(mockToken);
  });
}); */

//---------------------- Integration Testing ----------------------
// describe('NOSQLClient Integration Tests', () => {
//   let client;
//   const baseURL = 'http://localhost:5000';

//   beforeAll(() => {
//     client = new NOSQLClient(baseURL);
//   });

//   test('Register and Login User', async () => {
//     const registerResponse = await client.registerUser({
//       username: 'Capleton',
//       password: 'CaplePass',
//       email: 'test@example.com'
//     });
//     expect(registerResponse).toHaveProperty('token');

//     const loginResponse = await client.loginUser({ username: 'Capleton', password: 'CaplePass' });
//     expect(loginResponse).toHaveProperty('token');
//   });

//   test('Create and Delete Database', async () => {
//     const createResponse = await client.createDatabase({ dbName: 'testDB' });
//     expect(createResponse).toHaveProperty('database', 'testDB');

//     const deleteResponse = await client.deleteDatabase('testDB');
//     expect(deleteResponse).toHaveProperty('success', true);
//   });
// });
