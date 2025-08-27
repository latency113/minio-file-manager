import type { HealthStatus } from './health.types';

export function getHealthStatus(): HealthStatus {
  return {
    status: 'ok',
    timestamp: new Date().toISOString(),
  }
}
