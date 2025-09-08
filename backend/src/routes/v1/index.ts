import express from "express"
import authRoutes from "./auth/auth-routes"

const router = express.Router()

router.use('/api/v1', authRoutes)

export default router