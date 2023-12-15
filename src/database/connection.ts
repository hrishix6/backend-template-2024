import { Kysely, PostgresDialect } from 'kysely';
import { Pool, PoolConfig } from 'pg';
import { DB } from './generated.types';

export function getDbClient(config: PoolConfig) {
  const dialect = new PostgresDialect({
    pool: new Pool(config),
  });

  return new Kysely<DB>({ dialect });
}
