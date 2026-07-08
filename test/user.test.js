const bcrypt = require('bcrypt');
const { expect} = require('chai');

describe('Password hashing', () => {
 it('should hash the password so it is not plain text', async () => {
    const hashed = await bcrypt.hash('mypassword', 10);
    expect(hashed).to.not.equal('mypassword');
    });
});