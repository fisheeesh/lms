import express from "express"
import { createALog } from "../../../controllers/admin/admin-controller"

const router = express.Router()

router.post("/ingest", createALog)

export default router