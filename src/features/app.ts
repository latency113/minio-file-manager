import { Elysia } from 'elysia';
import { healthRoutes } from './health/health.routes';

export const app = () => {
  return new Elysia({ prefix: '/api/v1' })
    .use(healthRoutes());
};