//npm i hapi

const Hapi = require('hapi')
const Context = require('./db/strategies/base/contextStrategies')
const MongoDb = require('./db/strategies/Mongodb/mongo')
const HeroiSchema = require('./db/strategies/Mongodb/schemas/heroisSchema')
const app = new Hapi.Server({
  port: 5000
})

async function main() {
  const connection = MongoDb.connect()
  const context = new Context(new MongoDb(connection, HeroiSchema))
  app.route([
    {
      path: '/herois',
      method: 'GET',
      handler: (request, head) => {
        return context.read()
      }
    }
  ])
  await app.start()
  console.log('Servidor rodando na porta', app.info.port)
}
main()