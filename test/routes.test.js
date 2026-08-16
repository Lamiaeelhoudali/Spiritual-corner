require('dotenv').config();
const { expect } = require('chai');
const request = require('supertest');
const app = require('../server');

describe('Auth routes', () => {
  const testEmail = `test${Date.now()}@example.com`;

  it('should register a new user', async () => {
    const res = await request(app)
      .post('/users')
      .send({ name: 'Test User', email: testEmail, password: 'testpass123' });
    expect(res.statusCode).to.equal(201);
  });

  it('should reject login with wrong password', async () => {
    const res = await request(app)
      .post('/login')
      .send({ email: testEmail, password: 'wrongpassword' });
    expect(res.statusCode).to.equal(400);
  });

  it('should log in successfully with correct credentials', async () => {
    const res = await request(app)
      .post('/login')
      .send({ email: testEmail, password: 'testpass123' });
    expect(res.statusCode).to.equal(200);
    expect(res.body.token).to.exist;
  });

  it('should reject journal access without a token', async () => {
    const res = await request(app).get('/journal');
    expect(res.statusCode).to.equal(401);
  });
});