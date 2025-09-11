import express from "express"
import { getLogsOverview, getSeverityOverview, getSourceComparisons, getUserData, testUser } from "../../../controllers/user/user-controller"

const router = express.Router()

router.get("/test", testUser)
router.get("/logs-overview", getLogsOverview)
router.get("/source-comparisons", getSourceComparisons)
router.get("/severity-overview", getSeverityOverview)

router.get("/user-data", getUserData)

export default router