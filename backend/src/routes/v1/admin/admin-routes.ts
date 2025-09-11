import express from "express"
import { createALog, createAUser, deleteALog, deleteAUser, getAllUsersInfinite, testAdmin, updateAUser } from "../../../controllers/admin/admin-controller"
import { getAllLogsInfinite } from "../../../controllers/user/user-controller"

const router = express.Router()

//* Logs Management
router.get("/test", testAdmin)
router.post("/ingest", createALog)
router.delete("/logs", deleteALog)
router.get("/get-logs-infinite", getAllLogsInfinite)

//* Users Mangement
router.post("/users", createAUser)
router.delete("/users", deleteAUser)
router.patch("/users", updateAUser)
router.get("/users", getAllUsersInfinite)

export default router