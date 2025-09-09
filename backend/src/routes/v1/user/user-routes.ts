import express from "express"
import { getLogs, testUser } from "../../../controllers/user/user-controller"

const router = express.Router()

router.get("/test", testUser)
router.get("/get-logs", getLogs)

export default router