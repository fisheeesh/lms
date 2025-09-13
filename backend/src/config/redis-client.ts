import { Redis } from "ioredis";

let redis: Redis;

console.log('REDIS_URL exists:', !!process.env.REDIS_URL);
console.log('REDIS_URL value:', process.env.REDIS_URL ? 'SET' : 'NOT SET');

if (process.env.REDIS_URL) {
    console.log('Connecting with REDIS_URL');
    redis = new Redis(process.env.REDIS_URL, {
        maxRetriesPerRequest: null,
        enableReadyCheck: false,
        tls: process.env.REDIS_URL.startsWith("rediss://") ? {} : undefined,
    });
} else {
    console.log('Connecting with individual credentials');
    console.log('REDIS_HOST:', process.env.REDIS_HOST);
    console.log('REDIS_PORT:', process.env.REDIS_PORT);
    redis = new Redis({
        host: process.env.REDIS_HOST || "localhost",
        port: Number(process.env.REDIS_PORT) || 6379,
        password: process.env.REDIS_PASSWORD,
        maxRetriesPerRequest: null,
        enableReadyCheck: false,
    });
}

redis.on('connect', () => {
    console.log('Redis connected successfully');
});

redis.on('error', (err) => {
    console.error('Redis connection error:', err);
});

redis.on('ready', () => {
    console.log('Redis ready to receive commands');
});

export { redis };