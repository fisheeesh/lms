import { endOfDay, startOfDay, subDays } from "date-fns"
import { NextFunction, Request, Response } from "express"
import { query, validationResult } from "express-validator"
import { errorCodes } from "../../config/error-codes"
import { Action, LogSource, Prisma, PrismaClient } from "../../generated/prisma"
import { getUserById } from "../../services/auth-services"
import { getAllLogs, getLogsOverviewFor60days, getLogsSeverityOverview, getLogsSourceComparison, getTopIPsData } from "../../services/log-services"
import { getUserdataById } from "../../services/user-services"
import { checkUserIfNotExist, createHttpError } from "../../utils/check"
import { getAllAlertsData } from "../../services/alert-services"

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

export const getLogsAndAlertsOverview = [
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

        //? Desired format: [ { date: "2024-04-01", logs: 222, alerts: 12}, ...]
        const results = await getLogsOverviewFor60days(user!.tenant, user!.role, start, end)

        res.status(200).json({
            message: 'Here is your logs.',
            data: results
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
        const result = await getLogsSourceComparison(user!.tenant, user!.role, start, end)

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
    const result = await getLogsSeverityOverview(user!.tenant, user!.role)

    res.status(200).json({
        message: "Here is your severity data.",
        data: result
    })
}

export const getAllLogsInfinite = [
    query("limit", "Limit must be LogId.").isInt({ gt: 6 }).optional(),
    query("cursor", "Cursor must be unsigned integer.").isInt({ gt: 0 }).optional(),
    query("kw", "Invalid Keyword.").trim().escape().optional(),
    query("tenant", "Invalid Tenant.").trim().escape().optional(),
    query("action", "Invalid Action.").trim().escape().optional(),
    query("severity", "Invalid Severity.").trim().escape().optional(),
    query("source", "Invalid Source.").trim().escape().optional(),
    query("ts", "Invalid Timestamp.").trim().escape().optional(),
    query("date", "Invalid Date.").trim().escape().optional(),
    async (req: CustomRequest, res: Response, next: NextFunction) => {
        const errors = validationResult(req).array({ onlyFirstError: true })
        if (errors.length > 0) return next(createHttpError({
            message: errors[0].msg,
            status: 400,
            code: errorCodes.invalid
        }))

        const { limit = 7, cursor: lastCursor, kw, tenant, action, severity, source, ts = 'desc', date } = req.query
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

        const tenantFilter: Prisma.LogWhereInput =
            tenant && tenant !== 'all' ?
                { tenant: { contains: tenant as string, mode: 'insensitive' } as Prisma.StringFilter }
                : !tenant && user?.role !== 'ADMIN' ? { tenant: { contains: user!.tenant, mode: 'insensitive' } as Prisma.StringFilter }
                    : tenant && user?.role !== 'ADMIN' ? { tenant: { contains: user!.tenant, mode: 'insensitive' } as Prisma.StringFilter } : {}

        const actionFilter: Prisma.LogWhereInput =
            action &&
                action !== "all" &&
                Object.values(Action).includes(action as Action)
                ? { action: action as Action }
                : {};

        const sourceFilter: Prisma.LogWhereInput =
            source &&
                source !== "all" &&
                Object.values(LogSource).includes(source as LogSource)
                ? { source: source as LogSource }
                : {};

        const dateFilter = date ? {
            createdAt: {
                gte: startOfDay(new Date(date as string)),
                lte: endOfDay(new Date(date as string))
            }
        } : {}

        const options = {
            where: {
                ...dateFilter,
                ...kwFilter,
                ...tenantFilter,
                ...actionFilter,
                ...sourceFilter,
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
                createdAt: ts
            }
        }

        const logs = await getAllLogs(options, severity as string)

        const hasNextPage = logs.length > +limit

        if (hasNextPage) {
            logs.pop()
        }

        const nextCursor = logs.length > 0 ? logs[logs.length - 1].id : null

        res.status(200).json({
            message: "Here is all logs data with infinite scroll.",
            hasNextPage,
            nextCursor,
            prevCursor: lastCursor || undefined,
            data: logs
        })
    }
]

export const getAllFilters = async (req: CustomRequest, res: Response, next: NextFunction) => {
    try {
        const userId = req.userId;
        const user = await getUserById(userId!);
        checkUserIfNotExist(user);

        const uTenantsRaw = await prismaClient.user.findMany({
            distinct: ["tenant"],
            select: { tenant: true },
        });
        const uTenants = [
            { name: "All Companies", value: "all" },
            ...uTenantsRaw.map((u) => ({
                name: u.tenant,
                value: u.tenant,
            })),
        ];
        const lTenantsRaw = await prismaClient.log.findMany({
            distinct: ["tenant"],
            select: { tenant: true },
        });
        const lTenants = [
            { name: "All Companies", value: "all" },
            ...lTenantsRaw.map((u) => ({
                name: u.tenant,
                value: u.tenant,
            })),
        ];

        const sourcesRaw = await prismaClient.log.findMany({
            distinct: ["source"],
            select: { source: true },
        });
        const sources = [
            { name: "All Sources", value: "all" },
            ...sourcesRaw.map((l) => ({
                name: l.source,
                value: l.source,
            })),
        ];

        const actionsRaw = await prismaClient.log.findMany({
            distinct: ["action"],
            select: { action: true },
        });
        const actions = [
            { name: "All Actions", value: "all" },
            ...actionsRaw.map((l) => ({
                name: l.action,
                value: l.action,
            })),
        ];

        res.status(200).json({
            message: "Here is All Filters data.",
            data: {
                uTenants,
                lTenants,
                sources,
                actions,
            },
        });
    } catch (err) {
        next(err);
    }
};

export const getTopIps = async (req: CustomRequest, res: Response, next: NextFunction) => {
    const userId = req.userId;
    const user = await getUserById(userId!);
    checkUserIfNotExist(user);

    const result = await getTopIPsData(user!.tenant, user!.role)

    res.status(200).json({
        message: "Here is Top IPs data.",
        data: result
    })
}

export const getAllAlerts = [
    query("tenant", "Invalid Tenant").trim().escape().optional(),
    async (req: CustomRequest, res: Response, next: NextFunction) => {
        const errors = validationResult(req).array({ onlyFirstError: true })
        if (errors.length > 0) return next(createHttpError({
            message: errors[0].msg,
            status: 400,
            code: errorCodes.invalid
        }))

        const userId = req.userId;
        const user = await getUserById(userId!);
        checkUserIfNotExist(user);

        const { tenant } = req.query

        const result = await getAllAlertsData(user!.tenant, tenant as string, user!.role)

        res.status(200).json({
            message: "Here is All Alerts data.",
            data: result
        })
    }
]