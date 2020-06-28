//docker ps
//docker exec -it 40f6534b3c94 mongo -u hernani -p nani2021 --authenticationDatabase herois
//databases
show dbs
//database especifica
use herois
//mostrar colecoes
show collections

db.herois.insert({
  nome: 'Flash',
  poder: 'velocidade',
  dataNascimento: '1998-01-01'
})
//buscar dados database
db.herois.find()
//buscar dados database formatado
db.herois.find().pretty()

for(let i=0;i<=10000;i++){
  db.herois.insert({
    nome: `clone-${i}`,
    poder: 'velocidade',
    dataNascimento: '1998-01-01'
  })
}
db.herois.find({}, {poder:1, _id: 0})
db.herois.count()
db.herois.findOne()
db.herois.find().limit(1000).sort({nome: -1})
//create
db.herois.insert({
  nome: `clone-${i}`,
  poder: 'velocidade',
  dataNascimento: '1998-01-01'
})
//read
db.herois.find({}, {poder:1, _id: 0})
db.herois.count()
db.herois.findOne()
db.herois.find().limit(1000).sort({nome: -1})
//update
db.herois.update({_id : ObjectId("5ee82650bd86e2e54ab65f1a")},
{nome: 'Mulher Maravilha'})
//tirando risco de perder dados
db.herois.update({_id : ObjectId("5ee82650bd86e2e54ab65f1a")}, {$set:{nome: 'Lanterna verde'}})
//delete
//delete todos os dados
db.herois.remove({})
//delete especifico
db.herois.remove({nome: 'Mulher maravilha'})