import { endOfDay, startOfDay, subDays } from "date-fns"
import { NextFunction, Request, Response } from "express"
import { query, validationResult } from "express-validator"
import { errorCodes } from "../../config/error-codes"
import { PrismaClient } from "../../generated/prisma"
import { getUserById } from "../../services/auth-services"
import { getLogsOverviewFor60days, getLogsSourceComparison } from "../../services/log-services"
import { getUserdataById } from "../../services/user-services"
import { checkUserIfNotExist, createHttpError } from "../../utils/check"

interface CustomRequest extends Request {
    userId?: number
}

const prisma = new PrismaClient()

export const testUser = async (req: CustomRequest, res: Response, next: NextFunction) => {
    res.status(200).json({
        message: "You are authenticated.",
        userId: req.userId
    })
}

export const getUserData = async (req: CustomRequest, res: Response, next: NextFunction) => {
    const userId = req.userId
    const user = await getUserById(userId!)
    checkUserIfNotExist(user)

    const data = await getUserdataById(user!.id)

    res.status(200).json({
        message: "Here is your data",
        data
    })
}

export const getLogsOverview = [
    async (req: CustomRequest, res: Response, next: NextFunction) => {
        const errors = validationResult(req).array({ onlyFirstError: true })
        if (errors.length > 0) return next(createHttpError({
            message: errors[0].msg,
            status: 400,
            code: errorCodes.invalid
        }))

        const userId = req.userId
        const user = await getUserById(userId!)
        checkUserIfNotExist(user)

        const now = new Date();

        const start = startOfDay(subDays(now, 59))
        const end = endOfDay(now)

        //? Desired format: [ { date: "2024-04-01", value: 222}, ...]
        const result = await getLogsOverviewFor60days(user!.tenant, start, end)

        res.status(200).json({
            message: 'Here is your logs.',
            data: result
        })
    }
]

export const getSourceComparisons = [
    query("duration", "Invalid Duration").trim().escape().optional(),
    async (req: CustomRequest, res: Response, next: NextFunction) => {
        const errors = validationResult(req).array({ onlyFirstError: true })
        if (errors.length > 0) return next(createHttpError({
            message: errors[0].msg,
            status: 400,
            code: errorCodes.invalid
        }))

        const { duration = '7' } = req.query
        const userId = req.userId
        const user = await getUserById(userId!)
        checkUserIfNotExist(user)

        const now = new Date();

        const gap = +duration < 7 ? 6 : +duration - 1
        console.log(gap)
        const start = startOfDay(subDays(now, gap))
        const end = endOfDay(now)

        // ? Desired format: [{date: 'Sep 01', api: 100, ... }, ...]
        const result = await getLogsSourceComparison(user!.tenant, start, end)

        res.status(200).json({
            message: "Here is Log's Source Comparison data.",
            data: result
        })
    }
]