export const env = {
  APP_PORT: process.env.APP_PORT || 3000,

  REDIS_HOST: process.env.REDIS_HOST || 'localhost',
  REDIS_PORT: Number(process.env.REDIS_PORT) || 6379,
  REDIS_PASSWORD: process.env.REDIS_PASSWORD,

  MINIO_ENDPOINT: process.env.MINIO_ENDPOINT || 'localhost',
  MINIO_PORT: Number(process.env.MINIO_PORT) || 9000,
  MINIO_ACCESS_KEY: process.env.MINIO_ACCESS_KEY || 'minioadmin',
  MINIO_SECRET_KEY: process.env.MINIO_SECRET_KEY || 'minioadmin',
  MINIO_USE_SSL: process.env.MINIO_USE_SSL === 'true',
  MINIO_BUCKET_NAME: process.env.MINIO_BUCKET_NAME || 'uploads',
};