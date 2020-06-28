const assert = require('assert');
const PasswordHelper = require('./../helpers/passwordHelper');

const SENHA = 'Erick@32123123';
const HASH = '$2b$04$G6WPBd3kX/HZs46jeViHt.dDdkhIYOqjArSbRnVCGmt.Fr7g7AOQe'



describe('UserHelper test suite', function () {
    it('deve gerar um hash a partir de uma senha', async () => {
        const result = await PasswordHelper.hashPassword(SENHA);

        // const result = await PasswordHelper.hashPassword('321123');
        //console.log('result', result)
        assert.ok(result.length > 10);
    });
    it('deve comparar uma senha e seu hash', async () => {
        const result = await PasswordHelper.comparePassword(SENHA, HASH)
        //console.log('result:', result)
        assert.ok(result)
    })

});