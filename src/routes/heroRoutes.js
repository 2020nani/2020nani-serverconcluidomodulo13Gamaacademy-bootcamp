const BaseRoute = require('./base/baseRoute')
const Joi = require('joi')
const Boom = require('boom')
const failAction = (request, headers, erro) => {
  throw erro;
}
const headers = Joi.object({
  authorization: Joi.string().required()
}).unknown()
class HeroRoutes extends BaseRoute {
  constructor(db) {
    super()
    this.db = db
  }

  list() {
    return {
      path: '/herois',
      method: 'GET',
      config: {
        tags:['api'],
        notes:'pode paginar resultados e filtrar por nome',
        description:'Deve listar herois',
        validate: {
          //payload=body
          //headers = header
          //params = na URL:id
          //query = skip=0limit=100
          failAction,
          
          query: {
            skip: Joi.number().integer().default(0),
            limit: Joi.number().integer().default(10),
            nome: Joi.string().min(3).max(100)
          },
          headers
        }
        
      },
      handler: (request, headers) => {
        try {
          const { skip, limit, nome } = request.query

          const query = {
            nome: {
              //sintaxe buscar nome que contem palavra q usuario passou  
              $regex:`.*${nome}*.`
            }
          } 

          return this.db.read(nome ?query:{}, skip, limit)
        } catch (error) {
          console.log('deu ruim', error)
          return Boom.internal()

        }

      }
    }
  }

  create() {
    return {
      path: '/herois',
      method: 'POST',
      config:{
        tags:['api'],
        notes:'pode criar herois',
        description:'Deve criar herois',
        validate:{
          failAction,
          headers,
          payload:{
            nome: Joi.string().required().min(3).max(100),
            poder: Joi.string().required().min(2).max(100)
          }
        }
      },
     handler: async (request) =>{
       try{
         const{
           nome,
           poder
         } = request.payload
         const result = await this.db.create({
           nome,
           poder
         })
         console.log('result' ,result)
         return {
           message: 'Heroi cadastrado com sucesso!',
           _id: result._id
         }
         
       }catch(error){
        console.log('deu ruim', error)
        return Boom.internal()
      }
     } 
    }
  }

  update(){
    return {
      path: '/herois/{id}',
      method: 'PATCH',
      config: {
        tags:['api'],
        notes:'pode atualizar heroi por id',
        description:'Deve atualizar herois',
        validate: {
          params: {
            id: Joi.string().required()
          },
          headers,
          payload:{
            nome: Joi.string().min(3).max(100),
            poder: Joi.string().min(2).max(100)
          }
        }
      },
      handler:async (request) => {
        try{
          const {
            id
          } = request.params;
          const{
            payload
          } = request
          const dadosString = JSON.stringify(payload)
          const dados = JSON.parse(dadosString)

          const result = await this.db.update(id, dados)
          if(result.nModified !== 1) return Boom.preconditionFailed('Id Nao encontrado no banco')
          console.log('resultado = ', result)
          return {
            message:'Heroi atualizado com sucesso!'
          }
        }catch(error){
          console.log('deu ruim', error)
          return Boom.internal()
        }
      }
    }
  }
  delete() {
    return {
        path: '/herois/{id}',
        method: 'DELETE',
        config: {
          tags:['api'],
        notes:'pode deletar heroi pelo id',
        description:'Deve deletar herois',
            validate: {
                failAction,
                headers,
                params: {
                    id: Joi.string().required()
                }
            }
        },
        handler:async (request) => {
          try{
            const {id} = request.params
            const result = await this.db.delete(id)
            if (result.n !==1)
            return Boom.preconditionFailed('Id Nao encontrado no banco')
            return {
              message:'Heroi removido com sucesso'
            }
          }catch(error){
            console.log('deu ruim', error)
            return Boom.internal()
          }
        }
    }
}
  
}
module.exports = HeroRoutes