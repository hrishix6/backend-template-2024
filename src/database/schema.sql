/*
    define your schema here, if you are using docker, docker-compose will use this 
    file to initialize database when creating db container.
*/

CREATE DATABASE "mydb"
    WITH
    OWNER = postgres
    ENCODING = 'UTF8'
    CONNECTION LIMIT = -1
    IS_TEMPLATE = False;