import express from "express"
import { getLogs, getUserData, testUser } from "../../../controllers/user/user-controller"

const router = express.Router()

router.get("/test", testUser)
router.get("/get-logs", getLogs)
router.get("/user-data", getUserData)

export default router