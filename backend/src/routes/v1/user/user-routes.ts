import express from "express"
import { getLogs } from "../../../controllers/user/user-controller"

const router = express.Router()

router.get("/get-logs", getLogs)

export default router