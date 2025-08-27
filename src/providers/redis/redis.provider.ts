import { createClient }  from 'redis';
import { env } from '../../shared/config/env';

export const redis = createClient({
  socket: {
    host: env.REDIS_HOST,
    port: env.REDIS_PORT,
  },
  password: env.REDIS_PASSWORD,
});

redis.on('error', (err) => console.log('Redis Client Error', err));

(async () => {
  await redis.connect();
})();
