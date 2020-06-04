const config = require('./environment');
const Redis = require("ioredis");
const REDIS_PORT = config.REDIS_PORT || 6379;
const REDIS_HOST = config.REDIS_HOST || '127.0.0.1';
const redis = new Redis(REDIS_PORT, REDIS_HOST);

redis.on("error", function(error) {
  console.error(error.message);
  throw error;
});

export default redis;