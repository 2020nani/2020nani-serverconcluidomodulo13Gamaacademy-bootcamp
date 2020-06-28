const assert = require('assert')
const api = require('../api')
const Context = require('./../db/strategies/base/contextStrategies')
const Postgres = require('./../db/strategies/Postgres/postgres')
const UsuarioSchema = require('./../db/strategies/Postgres/schemas/usuarioSchema')
let app = {}
const USER = {
    username: 'xuxadasilva',
    password: '123'
}

const USER_DB = {
    username: USER.username.toLowerCase(),
    password: '$2b$04$1oDyREd9GX/dKBfxdUQJ/ulGMmeD/Csswuo6xrOuG34TxrtxiSbRW'
}


describe('Auth test suite', function () {
    this.beforeAll(async () => {
        app = await api
        const connectionPostgres = await Postgres.connect()
        const model = await Postgres.defineModel(connectionPostgres, UsuarioSchema)
        const postgresModel = new Context(new Postgres(connectionPostgres, model));
        await postgresModel.update(null, USER_DB, true)
    
    })
    it('deve obter um token', async () => {
        const result = await app.inject({
            method: 'POST',
            url: '/login',
            payload: USER
        });
        const statusCode = result.statusCode
        //console.log('result',result.payload)
        const dados = JSON.parse(result.payload)
       // console.log(dados)
        assert.deepEqual(statusCode, 200)
        assert.ok(dados.token.length >10)
    })

    it('deve retornar não autorizado ao tentar obter um token com login errado', async () => {
        const result = await app.inject({
            method: 'POST',
            url: '/login',
            payload: {
                username: 'erickwendel',
                password: '123'
            }
        });
        const statusCode = result.statusCode
        const dados = JSON.parse(result.payload)
        assert.deepEqual(statusCode, 401)
        assert.deepEqual(dados.error, "Unauthorized")
    })
})