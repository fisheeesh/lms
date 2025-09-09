import express from "express"
import { createALog } from "../../../controllers/admin/admin-controller"

const router = express.Router()

router.post("/create-log", createALog)

export default router