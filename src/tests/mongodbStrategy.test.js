const assert = require('assert')
const Mongodb = require('./../db/strategies/Mongodb/mongo')
const HeroiSchema = require('./../db/strategies/Mongodb/schemas/heroisSchema')
const Context = require('./../db/strategies/base/contextStrategies')
const MOCK_HEROI_CADASTRAR = {
  nome: 'Mulher Maravilha',
  poder: 'Laco'
}
const MOCK_HEROI_DEFAULT = {
  nome: `Homem Aranha-${Date.now()}`,
  poder: 'Super teia'
}
const MOCK_HEROI_ATUALIZAR = {
  nome: `Patolino-${Date.now()}`,
  poder: 'velocidade'
}
let MOCK_HEROI_ID = ''

let context = {}
describe('MongoDb suite de testes', function () {
  this.beforeAll(async () => {
    const connection = Mongodb.connect()
    context = new Context(new Mongodb(connection, HeroiSchema))
    await context.create(MOCK_HEROI_DEFAULT)
    const result = await context.create(MOCK_HEROI_ATUALIZAR)
    MOCK_HEROI_ID = result._id
  })
  it('verificar conexao', async () => {
    const result = await context.isConnected()
    const expected = 'Conectado'

    assert.deepEqual(result, expected)
  })
  it('cadastrar', async () => {
    const { nome, poder } = await context.create(MOCK_HEROI_CADASTRAR)
    assert.deepEqual({ nome, poder }, MOCK_HEROI_CADASTRAR)
  })
  it('listar', async () => {
    const [{ nome, poder }] = await context.read({ nome: MOCK_HEROI_DEFAULT.nome })
    const result = {
      nome, poder
    }
    assert.deepEqual(result, MOCK_HEROI_DEFAULT)
  })
  it('atualizar', async () => {
    
    const result = await context.update(MOCK_HEROI_ID, {
      nome: 'Pernalonga'
    })

    assert.deepEqual(result.nModified, 1)
  })
  it('remover', async () => {
    const result = await context.delete(MOCK_HEROI_ID)
    assert.deepEqual(result.n, 1)
  })
})
