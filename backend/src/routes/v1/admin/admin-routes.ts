import express from "express"
import { createAlertRule, createALog, createAUser, deleteAlertRule, deleteALog, deleteAUser, getAllRules, getAllUsersInfinite, testAdmin, updateAlertRule, updateAUser } from "../../../controllers/admin/admin-controller"
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

//* Alerts Management
router.post("/alert-rules", createAlertRule)
router.patch("/alert-rules", updateAlertRule)
router.delete("/alert-rules", deleteAlertRule)
router.get("/alert-rules", getAllRules)

export default router