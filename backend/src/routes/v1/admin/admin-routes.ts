import express from "express"
import { createALog, createAUser, deleteALog, deleteAUser, testAdmin, updateAUser } from "../../../controllers/admin/admin-controller"

const router = express.Router()

router.get("/test", testAdmin)
router.post("/ingest", createALog)
router.delete("/logs", deleteALog)

router.post("/create-user", createAUser)
router.delete("/users", deleteAUser)
router.patch("/users", updateAUser)

export default router