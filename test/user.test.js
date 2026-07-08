const bcrypt = require('bcrypt');
const { expect} = require('chai');

describe('Password hashing', () => {
 it('should hash the password so it is not plain text', async () => {
    const hashed = await bcrypt.hash('mypassword', 10);
    expect(hashed).to.not.equal('mypassword');
    });
    it('should successfully verify a correct password against its hash', async () => { 
        const hashed = await bcrypt.hash('mypassword', 10);
        const isMatch = await bcrypt.compare('mypassword', hashed);
        expect(isMatch).to.be.true;

});
});