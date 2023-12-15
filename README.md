# Opinionated backend project template

This is opinionated project template for backend in 2024.

**Base**

- [node](https://nodejs.org/en) ( >= v18)
- [typescript](https://www.typescriptlang.org/) (>= v5)
- [express](https://expressjs.com/) (>= v4)
- [postgresql](https://www.postgresql.org/)
- [redis](https://redis.io/)

**Libraries**

- [zod](https://github.com/colinhacks/zod) - validations.
- [typedi](https://github.com/typestack/typedi) - depedency injection tool.
- [dotenv](https://github.com/motdotla/dotenv) - config loader in development.
- [kysely](https://github.com/kysely-org/kysely) - query builder for postgres.
- [winston](https://github.com/winstonjs/winston) - logger.

**Code quality & formatting**

- [prettier](https://prettier.io/)
- [eslint](https://eslint.org/)

**Other integrations**

- [docker](https://docs.docker.com/)
- [pgadmin](https://www.pgadmin.org/)
- [redis-commander](https://www.npmjs.com/package/redis-commander)

## Setup

1. You need Docker installed, it's required.

2. Clone this repo.

3. Create a `.env` file in the root directory,

```env
 # server config
 APP_PORT=<your port>
 FRONTEND_ORIGINS=<comma separated list of frontend origins>
 FRONTEND_METHODS=<comma separated list of HTTP methods you want to allow>

 #db config
 DB_HOST=<database hostname>
 DB_PORT=5432
 DB_NAME=<database name>
 DB_USER=<database username>
 DB_PASS=<database password>

 # cache config
 CACHE_ENABLED=<true | false to enable/disable cache>
 CACHE_HOST=<cache hostname>
 CACHE_USER=<cache username>
 CACHE_PASS=<cache password>
 CACHE_PORT=6379
```

4. create a `integrations.env` in root of the project,

```env
 # Pgadmin 4 config , use these to login to pgAdmin
 PGADMIN_DEFAULT_EMAIL=admin@admin.com
 PGADMIN_DEFAULT_PASSWORD=12345

 # Postgresql config , these will be default user/pass credentials
 POSTGRES_USER=postgres
 POSTGRES_PASSWORD=postgres

 # redis-commander config, make sure redis settings below match your redis.conf settings.
 HTTP_USER=admin@admin.com
 HTTP_PASSWORD=12345
 PORT=8080
 REDIS_PORT=6379
 REDIS_HOST=cache
 REDIS_USERNAME=redis-user
 REDIS_PASSWORD=hrishix6
```

5. Add your database schema commands in `src/database/schema.sql`, it will be used to initialize a database in postgres container.

6. If you have your open api spec , paste it in `src/openapi/spec.json`, the documentation for api will be available at `http://localhost:5000/docs`
   ([open](http://localhost:5000/docs)).

## How to run

```shell
$ docker compose up --build
```

- Pgdmin4 will be accessible at `http://localhost:8888` ([open](http://localhost:8888))
- Redis GUI will be accessible at `http://localhost:8080` ([open](http://localhost:8080))
- Postgresql will be accessible at `postgres://<db-user>:<db-password>@localhost:5432/<your-db-name>`.
- Redis server will be accessible at `localhost:6379`

- As database and cache are accessible in docker network and localhost , during development you can switch hostname to localhost and run.
