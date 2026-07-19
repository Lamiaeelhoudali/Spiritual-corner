require('dotenv').config();
const { expect } = require('chai');
const jwt = require('jsonwebtoken');

describe('JWT token generation and verification', () => {
  it('should generate a token that can be verified successfully', () => {
    const payload = { userId: '12345' };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    expect(decoded.userId).to.equal(payload.userId);
  });

  it('should throw an error when verifying a token with the wrong secret', () => {
    const payload = { userId: '12345' };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });
    expect(() => jwt.verify(token, 'wrong_secret')).to.throw();
  });
});