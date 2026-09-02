const test = require('node:test');
const assert = require('node:assert/strict');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'college_portal_secret_2026';

function createToken(userId, role, departmentId) {
  return jwt.sign(
    { id: userId, role, departmentId },
    JWT_SECRET,
    { expiresIn: '1h' }
  );
}

async function makeRequest(path, token) {
  const server = require('../server').listen(0);
  try {
    const { port } = server.address();
    const url = `http://127.0.0.1:${port}${path}`;
    const response = await fetch(url, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      timeout: 5000
    });
    const body = await response.text();
    return {
      status: response.status,
      body: body ? JSON.parse(body) : {}
    };
  } finally {
    await new Promise(resolve => server.close(resolve));
  }
}

test('role-based access control: student cannot access student database', async () => {
  const studentToken = createToken(1, 'student', 2);
  const result = await makeRequest('/api/students', studentToken);
  
  assert.equal(result.status, 403, 'Student should get 403 Forbidden');
  assert.equal(result.body.success, false, 'Response should indicate failure');
});

test('role-based access control: faculty can access student database', async () => {
  const facultyToken = createToken(2, 'faculty', 2);
  const result = await makeRequest('/api/students', facultyToken);
  
  assert.equal(result.status, 200, 'Faculty should get 200 OK');
  assert.equal(Array.isArray(result.body.data), true, 'Response should contain data array');
});

test('role-based access control: lab technician can access student database', async () => {
  const labTechToken = createToken(3, 'lab_technician', 1);
  const result = await makeRequest('/api/students', labTechToken);
  
  assert.equal(result.status, 200, 'Lab technician should get 200 OK');
  assert.equal(Array.isArray(result.body.data), true, 'Response should contain data array');
});

test('role-based access control: admin can access student database', async () => {
  const adminToken = createToken(4, 'admin', 1);
  const result = await makeRequest('/api/students', adminToken);
  
  assert.equal(result.status, 200, 'Admin should get 200 OK');
  assert.equal(Array.isArray(result.body.data), true, 'Response should contain data array');
});

test('authenticated student can access their own profile', async () => {
  const studentToken = createToken(1, 'student', 2);
  const result = await makeRequest('/api/students/me', studentToken);
  
  assert.equal(result.status, 200, 'Student should access their own profile');
  assert.equal(result.body.success, true, 'Response should succeed');
});

test('unauthenticated request is rejected', async () => {
  const result = await makeRequest('/api/students', null);
  
  assert.equal(result.status, 401, 'Unauthenticated request should get 401');
});
