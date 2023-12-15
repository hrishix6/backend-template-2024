import 'reflect-metadata';
import http from 'http';
import { Container } from 'typedi';
import { ConfigService } from './config';
import { PoolConfig } from 'pg';
import { DB_TOKEN, getDbClient } from './database';
import { RedisClientOptions } from 'redis';
import { CACHE_TOKEN, getCacheClient } from './cache';
import { App } from './app';
import { LOGGER_TOKEN, LogService, logger } from './logging';
Container.set(LOGGER_TOKEN, logger);

function listenAsync(server: http.Server, port: number) {
  return new Promise((resolve, reject) => {
    server.listen(port);
    server.once('listening', () => {
      resolve(null);
    });
    server.once('error', (err) => {
      reject(err);
    });
  });
}

const logService = Container.get(LogService);
async function main() {
  const configService = Container.get(ConfigService);
  configService.load();

  const poolCfg: PoolConfig = {
    host: configService.get('db_host'),
    port: configService.get('db_port'),
    user: configService.get('db_user'),
    password: configService.get('db_pass'),
    max: 25,
    database: configService.get('db_name'),
    min: 5,
    connectionTimeoutMillis: 5000,
    keepAlive: true,
  };
  const db = getDbClient(poolCfg);
  Container.set(DB_TOKEN, db);

  const cacheEnabled = configService.get<boolean>('cache_enabled');

  const cacheConfig: RedisClientOptions = {
    username: configService.get('cache_user'),
    password: configService.get('cache_pass'),
    socket: {
      host: configService.get('cache_host'),
      port: configService.get<number>('cache_port'),
    },
  };

  const cache = getCacheClient(cacheConfig);

  if (cacheEnabled) {
    try {
      await cache
        .on('error', (err) =>
          logService.error(
            `Redis client encountered connection error: ${err}`,
            'main'
          )
        )
        .connect();

      if (cache.isReady) {
        logService.info(`connected to Redis server`, 'main');
        Container.set(CACHE_TOKEN, cache);
      } else {
        Container.set(CACHE_TOKEN, null);
      }
    } catch (error) {
      logService.error(`${error}`, 'main');
    }
  }

  try {
    const ApplicationBuilder = Container.get(App);
    const server = http.createServer(ApplicationBuilder.setup());
    await listenAsync(server, configService.get<number>('port'));
    logService.info(
      `server listning on PORT ${configService.get<number>('port')}`,
      'main'
    );
    logService.info(
      `health check path - "http://localhost:${configService.get<number>(
        'port'
      )}/api/ping"`,
      'main'
    );
    logService.info(
      `api documentation - "http://localhost:${configService.get<number>(
        'port'
      )}/docs"`,
      'main'
    );
  } catch (error) {
    logService.error(`${error}`, 'main');
    await db.destroy();
    await cache.quit();
    process.exit(1);
  }
}

process.on('uncaughtException', (e) => {
  logService.error(`Uncaught Exception: ${e}`, 'main');
});

main();
