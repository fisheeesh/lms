import express from "express"
import { getAllAlerts, getAllFilters, getAllLogsInfinite, getLogsAndAlertsOverview, getSeverityOverview, getSourceComparisons, getTopIps, getUserData, testUser } from "../../../controllers/user/user-controller"

const router = express.Router()

router.get("/test", testUser)
router.get("/logs-alerts-overview", getLogsAndAlertsOverview)
router.get("/source-comparisons", getSourceComparisons)
router.get("/severity-overview", getSeverityOverview)
router.get("/get-logs-infinite", getAllLogsInfinite)
router.get("/filters", getAllFilters)
router.get("/user-data", getUserData)
router.get("/top-ips", getTopIps)
router.get("/all-alerts", getAllAlerts)

export default router