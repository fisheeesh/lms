import express from "express"
import authRoutes from "./auth/auth-routes"
import adiminRoutes from "./admin/admin-routes"
import userRoutes from "./user/user-routes"
import { auth } from "../../middlewares/auth-middleware"
import { authorize } from "../../middlewares/authorize-middleware"

const router = express.Router()

router.use('/api/v1', authRoutes)
router.use("/api/v1/admin", auth, authorize(true, "ADMIN"), adiminRoutes)
router.use("/api/v1/user", auth, userRoutes)

export default router