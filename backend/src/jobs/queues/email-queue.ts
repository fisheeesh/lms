import { Queue } from "bullmq";
import { redis } from "../../config/redis-client";

const EmailQueue = new Queue("email-send", {
    connection: redis,
    defaultJobOptions: {
        attempts: 3,
        backoff: {
            type: "exponential",
            delay: 1000
        },
        removeOnComplete: true,
        removeOnFail: 1000
    }
})

export default EmailQueue