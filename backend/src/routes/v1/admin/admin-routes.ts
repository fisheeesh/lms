import express from "express"
import { createALog, deleteALog, testAdmin } from "../../../controllers/admin/admin-controller"

const router = express.Router()

router.get("/test", testAdmin)
router.post("/ingest", createALog)
router.delete("/logs", deleteALog)

export default router