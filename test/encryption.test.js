require('dotenv').config();
const { expect } = require('chai');
const { encrypt, decrypt } = require('../utils/encryption');

describe('Encryption utility', () => {
  it('should encrypt text so it is not plain text', () => {
    const result = encrypt('hello world');
    expect(result).to.not.equal('hello world');
  });

  it('should decrypt back to the original text', () => {
    const result = encrypt('hello world');
    expect(decrypt(result)).to.equal('hello world');
  });
});