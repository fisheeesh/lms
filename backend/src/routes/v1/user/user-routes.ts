import express from "express"
import { getAllFilters, getAllLogsInfinite, getLogsOverview, getSeverityOverview, getSourceComparisons, getTopIps, getUserData, testUser } from "../../../controllers/user/user-controller"

const router = express.Router()

router.get("/test", testUser)
router.get("/logs-overview", getLogsOverview)
router.get("/source-comparisons", getSourceComparisons)
router.get("/severity-overview", getSeverityOverview)
router.get("/get-logs-infinite", getAllLogsInfinite)
router.get("/filters", getAllFilters)
router.get("/user-data", getUserData)
router.get("/top-ips", getTopIps)

export default router