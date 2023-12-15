import { RedisClientOptions, createClient } from 'redis';

export function getCacheClient(config: RedisClientOptions) {
  return createClient(config);
}
