//criando imagem postgress no docker
docker run \
--name postgres \
-e POSTGRES_USER=hernani \
-e POSTGRES_PASSWORD=nani2020 \
-e POSTGRES_DB=heroes \
-p 5432:5432 \
-d\
postgres
//comando entrar no container
docker exec -it postgres /bin/bash
//abrir acesso administratvo
docker run \
--name adminer \
-p 8080:8080
--link postgres:postgres \
-d\
adminer

//criando imagem mongo no docker
docker run \
--name mongodb \
-p 27017/27017 \
-e MONGO_INITDB_ROOT_USERNAME=nani \
-e MONGO_INITDB_ROOT_PASSWORD=nani2020\
-d \
mongo:4
//criando cliente mongodb
docker run \
--name mongocliente \
-p 3300:3300 \
--link mongodb:mongodb \
-d \
mongoclient/mongoclient
//criar usuario banco mongo
docker exec -it mongodb \
mongo --host localhost -u nani -p nani2020 --authenticationDatabase admin \
--eval "db.getSiblingDB('herois').createUser({user:'hernani', pwd:'nani2021', roles:[{role: 'readWrite', db:'herois'}]})" 