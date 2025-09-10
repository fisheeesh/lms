import { Worker } from "bullmq";
import { redis } from "../../config/redis-client";
import { invalidateCache } from "../../utils/cache";

export const cacheWorker = new Worker("cache-invalidation", async (job) => {
    const { pattern } = job.data
    await invalidateCache(pattern)
}, {
    connection: redis,
    concurrency: 5 //* Process 5 jobs concurrently
})

cacheWorker.on("completed", (job) => {
    console.log(`Job: ${job.id} completed`)
})

cacheWorker.on("failed", (job: any, err) => {
    console.log(`Job: ${job.id} failed`, err)
})