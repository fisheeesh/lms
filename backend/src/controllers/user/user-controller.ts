import { endOfDay, startOfDay, subDays } from "date-fns"
import { NextFunction, Request, Response } from "express"
import { query, validationResult } from "express-validator"
import { errorCodes } from "../../config/error-codes"
import { Prisma, PrismaClient } from "../../generated/prisma"
import { getUserById } from "../../services/auth-services"
import { getAllLogs, getLogsOverviewFor60days, getLogsSeverityOverview, getLogsSourceComparison } from "../../services/log-services"
import { getUserdataById } from "../../services/user-services"
import { checkUserIfNotExist, createHttpError } from "../../utils/check"

interface CustomRequest extends Request {
    userId?: number
}

const prismaClient = new PrismaClient()

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

        const gap = +duration <= 7 ? 6 : +duration - 1
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

export const getSeverityOverview = async (req: CustomRequest, res: Response, next: NextFunction) => {
    const userId = req.userId
    const user = await getUserById(userId!)
    checkUserIfNotExist(user)

    // ? Desired format : [{type: "error", value: 100}, ...]
    const result = await getLogsSeverityOverview(user!.tenant)

    res.status(200).json({
        message: "Here is your severity data.",
        data: result
    })
}

export const getAllLogsInfinite = [
    query("limit", "Limit must be LogId.").isInt({ gt: 6 }).optional(),
    query("cursor", "Limit must be unsigned integer.").isInt({ gt: 0 }).optional(),
    query("kw", "Invalid Keyword.").trim().escape().optional(),
    query("tenant", "Invalid Tenant.").trim().escape().optional(),
    query("action", "Invalid Action.").trim().escape().optional(),
    query("severity", "Invalid Severity.").trim().escape().optional(),
    query("source", "Invalid Source.").trim().escape().optional(),
    query("duration", "Invalid Duration.").trim().escape().optional(),
    async (req: CustomRequest, res: Response, next: NextFunction) => {
        const errors = validationResult(req).array({ onlyFirstError: true })
        if (errors.length > 0) return next(createHttpError({
            message: errors[0].msg,
            status: 400,
            code: errorCodes.invalid
        }))

        const { limit = 7, cursor: lastCursor, kw, tenant, action, severity, source, duration = '7' } = req.query
        const userId = req.userId
        const user = await getUserById(userId!)
        checkUserIfNotExist(user)

        const kwFilter: Prisma.LogWhereInput = kw ? {
            OR: [
                { user: { contains: kw, mode: 'insensitive' } },
                { eventType: { contains: kw, mode: 'insensitive' } },
                { ip: { contains: kw, mode: 'insensitive' } },
            ] as Prisma.LogWhereInput[]
        } : {}

        const now = new Date();

        const gap = +duration <= 7 ? 6 : +duration - 1
        const start = startOfDay(subDays(now, gap))
        const end = endOfDay(now)

        const options = {
            where: {
                ...kwFilter,
                tenant: user!.tenant || tenant as string,
                createdAt: {
                    gte: start,
                    lte: end
                }
            },
            take: +limit + 1,
            skip: lastCursor ? 1 : 0,
            cursor: lastCursor ? { id: +lastCursor } : undefined,
            select: {
                id: true,
                ip: true,
                user: true,
                eventType: true,
                tenant: true,
                severity: true,
                severityLabel: true,
                createdAt: true,
                source: true,
                action: true
            },
            orderBy: {
                createdAt: 'desc'
            }
        }

        const logs = await getAllLogs(options)

        const hasNextPage = logs.length > +limit

        if (hasNextPage) {
            logs.pop()
        }

        const nextCursor = logs.length > 0 ? logs[logs.length - 1].id : null

        res.status(200).json({
            message: "Here is All Logs data with infinite scorll.",
            hasNextPage,
            nextCursor,
            prevCursor: lastCursor || undefined,
            data: logs
        })
    }
]