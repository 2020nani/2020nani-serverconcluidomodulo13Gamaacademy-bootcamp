const assert = require('assert')
const api = require('../api')
let app = {}
const TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Ilh1eGFkYXNpbHZhIiwiaWQiOjEsImlhdCI6MTU5MjY2MjYyM30.MS9qwkxqTXPSneLtjCcwxQspYtKdn7_5SoU68YfxMhs'
const headers = {
  Authorization: TOKEN
}
const MOCK_HEROI_CADASTRAR = {
  nome: 'Chapolin Colorado',
  poder:'Marreta Bionica'
}
const MOCK_HEROI_INICIAL = {
  nome: 'Gaviao Negro',
  poder:'Mira'
}
let MOCK_ID=''
describe('Suite de testes api heroes', function () {
  this.beforeAll(async () => {
    app = await api
    const result = await app.inject({
      method: 'POST',
      headers,
      url: '/herois',
      payload:JSON.stringify(MOCK_HEROI_INICIAL)
    })
    const dados = JSON.parse(result.payload)
    MOCK_ID = dados._id
  })

  it('listar/herois', async () => {
    const result = await app.inject({
      method: 'GET',
      headers,
      url: '/herois?skip=0&limit=10'
    })
    const dados = JSON.parse(result.payload)
    const statusCode = result.statusCode

    assert.deepEqual(statusCode, 200)
    assert.ok(Array.isArray(dados))
  })
  it('listar /herois - deve retornar somente 3 registros', async () => {
    const TAMANHO_LIMITE = 3
    const result = await app.inject({
      method:'GET',
      headers,
      url: `/herois?skip=0&limit=${TAMANHO_LIMITE}`
    })
    console.log(result)
    const dados = JSON.parse(result.payload)
    const statusCode = result.statusCode

    assert.deepEqual(statusCode, 200)
    assert.ok(dados.length === TAMANHO_LIMITE)
 

  })

  it('listar /herois - deve retornar um erro com limit incorreto', async () => {
    const TAMANHO_LIMITE = 'AEEE'
    const result = await app.inject({
      method:'GET',
      headers,
      url: `/herois?skip=0&limit=${TAMANHO_LIMITE}`
    })
    const errorResult = {
      "statusCode":400 ,
      "error":"Bad Request",
      "message":"child \"limit\" fails because [\"limit\" must be a number]",
      "validation":{
        "source":"query",
        "keys":["limit"]
      }

    }
    assert.deepEqual(result.statusCode, 400)
    assert.deepEqual(result.payload, JSON.stringify(errorResult))
 

  })
  it('listar /herois - deve filtrar um item', async () => {
    //const TAMANHO_LIMITE = 1000
    const NAME = 'Homem Aranha-1592450030474'
    const result = await app.inject({
      method:'GET',
      headers,
      url: `/herois?skip=0&limit=1000&nome=${NAME}`
    })
    const dados = JSON.parse(result.payload)
    const statusCode = result.statusCode
    console.log(dados)
    assert.deepEqual(statusCode, 200)
    assert.ok(dados[0].nome === NAME)

  })
  it('Cadastrar POST - /herois', async() => {
    const result = await app.inject({
      method:'POST',
      headers,
      url: `/herois`,
      payload: JSON.stringify(MOCK_HEROI_CADASTRAR)
    })
    const statusCode = result.statusCode
    const{
      message,
      _id
    } = JSON.parse(result.payload)

    assert.ok(statusCode === 200)
    assert.notStrictEqual(_id, undefined)
    assert.deepEqual(message, "Heroi cadastrado com sucesso!")
  })
  it('atualizar PATCH - /herois/:id', async () =>{
    const _id = MOCK_ID
    const expected = {
      poder: 'Super Mira'
    }
    const result = await app.inject({
      method:'PATCH',
      headers,
      url: `/herois/${_id}`,
      payload: JSON.stringify(expected)
    })
    const statusCode = result.statusCode
    const dados = JSON.parse(result.payload)

    assert.ok(statusCode === 200)
    assert.deepEqual(dados.message, 'Heroi atualizado com sucesso!')
  })
  it('atualizar PATCH/PUT - /herois/:id - nao deve atualizar com ID incorreto', async () =>{
    const _id = '5eed7df805615139b4318773'
    const expected = {
      poder: 'Super Mira'
    }
    const result = await app.inject({
      method:'PATCH',
      headers,
      url: `/herois/${_id}`,
      payload: JSON.stringify(expected)
    })
    const statusCode = result.statusCode
    const dados = JSON.parse(result.payload)
    const expectedError = {
    statusCode: 412,
    error: 'Precondition Failed',
    message: 'Id Nao encontrado no banco'
    }
    assert.ok(statusCode === 412)
    assert.deepEqual(dados, expectedError)
  })
  it('remover DELETE /herois/{id}', async () => {
    const _id = MOCK_ID
    const result =  await app.inject({
        method: 'DELETE',
        headers,
        url: `/herois/${_id}` 
    })
    const statusCode = result.statusCode
    const dados = JSON.parse(result.payload)
    assert.ok(statusCode === 200)
    assert.deepEqual(dados.message, 'Heroi removido com sucesso')
})
it('remover DELETE /herois/{id} nao deve remover', async () => {
  const _id ='5eed7df805615139b4318773'
  const result =  await app.inject({
      method: 'DELETE',
      headers,
      url: `/herois/${_id}` 
  })
  const statusCode = result.statusCode
  const dados = JSON.parse(result.payload)
  console.log(dados)
  const expectedError = {
    statusCode: 412,
    error: 'Precondition Failed',
    message: 'Id Nao encontrado no banco'
    }
  assert.ok(statusCode === 412)
  assert.deepEqual(dados, expectedError)
})
it('remover DELETE /herois/{id} nao deve remover com id invalidi', async () => {
  const _id ='ID_INVALIDO'
  const result =  await app.inject({
      method: 'DELETE',
      headers,
      url: `/herois/${_id}` 
  })
  const statusCode = result.statusCode
  const dados = JSON.parse(result.payload)
  console.log(dados)
  const expectedError={
    error: 'Internal Server Error',
    message: 'An internal server error occurred',
    statusCode: 500
  }
  assert.ok(statusCode === 500)
  assert.deepEqual(dados, expectedError
  )
})
})