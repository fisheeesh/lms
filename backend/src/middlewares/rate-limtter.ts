import { rateLimit } from 'express-rate-limit'

export const limiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    limit: 200, // Limit each IP to 200 requests per `window` (here, per 1 minute).
    standardHeaders: 'draft-8', // draft-6: `RateLimit-*` headers; draft-7 & draft-8: combined `RateLimit` header
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
})