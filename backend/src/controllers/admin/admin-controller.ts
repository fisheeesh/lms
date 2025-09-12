import { NextFunction, Request, Response } from "express"
import { body, query, validationResult } from "express-validator"
import { errorCodes } from "../../config/error-codes"
import { Action, LogSource, Prisma, Role, Status } from "../../generated/prisma"
import CacheQueue from "../../jobs/queues/cache-queue"
import { createNewAlertRule, deleteAlertRuleById, getRuleById, getRuleByFields, updateAlertRuleById, getAllAlertRules, getEnabledRulesForTenant, createAlert, countLogsSince } from "../../services/alert-services"
import { getUserByEmail, getUserById } from "../../services/auth-services"
import { createLog, deleteLogById, getLogById } from "../../services/log-services"
import { createNewUser, deleteUserById, getAllUsers, updateUserById } from "../../services/user-services"
import { checkModalIfExist, checkUserExit, checkUserIfNotExist, createHttpError } from "../../utils/check"
import { generateHashedValue, generateOTP, generateToken } from "../../utils/generate"
import { normalizeData } from "../../utils/normalize"
import { prisma } from "../../config/prisma-client"
import { enqueueAlertEmail } from "../../utils/helpers"

interface CustomRequest extends Request {
    userId?: number
    user?: any
}

export const testAdmin = async (req: CustomRequest, res: Response, next: NextFunction) => {
    const otp = generateOTP()
    res.status(200).json({
        message: "You are allowed to see this resources.",
        userId: req.userId,
        role: req.user?.role,
        otp
    })
}

export const createALog = [
    body("tenant")
        .notEmpty().withMessage("Tenant is required.")
        .isString().withMessage("Tenant must be a string."),
    body("ts")
        .notEmpty().withMessage("Timestamp is required.")
        .isISO8601().withMessage("Timestamp must be valid ISO8601 (RFC3339).").optional(),
    body("source")
        .notEmpty().withMessage("Source is required.")
        .isIn(Object.values(LogSource)).withMessage(`Source must be one of: ${Object.values(LogSource).join(", ")}`),
    body("vendor").optional().isString(),
    body("product").optional().isString(),
    body("eventType").optional().isString(),
    body("eventSubtype").optional().isString(),
    body("severity").optional().isInt({ min: 0, max: 10 }).withMessage("Severity must be between 0–10."),
    body("action").optional().isIn(Object.values(Action)).withMessage(`Action must be one of: ${Object.values(Action).join(", ")}`),
    body("user").optional().isString(),
    body("host").optional().isString(),
    body("process").optional().isString(),
    body("sha256").optional().isString(),
    body("src_ip").optional().isIP().withMessage("src_ip must be a valid IP."),
    body("src_port").optional().isInt({ min: 1, max: 65535 }),
    body("dst_ip").optional().isIP().withMessage("dst_ip must be a valid IP."),
    body("dst_port").optional().isInt({ min: 1, max: 65535 }),
    body("protocol").optional().isString(),
    body("url").optional().isURL().withMessage("url must be a valid URL."),
    body("http_method").optional().isString(),
    body("logonType").optional().isString(),
    body("status").optional().isString(),
    body("workload").optional().isString(),
    body("rule_name").optional().isString(),
    body("rule_id").optional().isString(),
    body("ip").optional().isIP(),
    body("reason").optional().isString(),
    body("cloud").optional().isObject().withMessage("cloud must be an object"),
    body("cloud.service").optional().isString(),
    body("cloud.account_id").optional().isString(),
    body("cloud.region").optional().isString(),
    body("raw").optional().isObject(),
    body("tags", "Tag is invalid.").optional({ nullable: true }).customSanitizer((value) => {
        if (value) {
            return value.split(',').filter((tag: string) => tag.trim() !== '')
        }
        return value
    }),
    async (req: CustomRequest, res: Response, next: NextFunction) => {
        const errors = validationResult(req).array({ onlyFirstError: true });
        if (errors.length > 0) {
            return next(
                createHttpError({
                    message: errors[0].msg,
                    status: 400,
                    code: errorCodes.invalid,
                })
            );
        }

        const userId = req.userId
        const user = await getUserById(userId!)
        checkUserIfNotExist(user)

        const tenant = req.body.tenant || req.user?.tenant;

        const source = (req.body.source as LogSource) || LogSource.API;
        const payload = req.body;

        const data = normalizeData(tenant, source, payload);
        const log = await createLog(data);

        const severity = typeof log.severity === "number" ? log.severity : 0;
        console.log(typeof log.severity)
        const rules = await getEnabledRulesForTenant(tenant);

        const candidates = rules.filter(r => r.condition === "SEVERITY_GTE");

        for (const rule of candidates) {
            const win = rule.windowSeconds ?? 0;

            if (win <= 0) {
                if (severity >= rule.threshold) {
                    const alert = await createAlert(tenant, rule.name);
                    await enqueueAlertEmail({
                        to: user!.email as string,
                        alertId: alert.id,
                        tenant,
                        ruleName: rule.name,
                        severity,
                        logId: log.id as any,
                        source: (log as any).source ?? null,
                        eventType: (log as any).eventType ?? null,
                    }).catch(err => console.error("enqueueAlertEmail error:", err));
                }
            } else {
                const since = new Date(Date.now() - win * 1000);
                const count = await countLogsSince(tenant, rule.threshold, since);

                if (count >= rule.threshold && severity >= rule.threshold) {
                    const alert = await createAlert(tenant, rule.name);
                    enqueueAlertEmail({
                        to: user!.email as string,
                        alertId: alert.id,
                        tenant,
                        ruleName: rule.name,
                        severity,
                        logId: log.id as any,
                        source: (log as any).source ?? null,
                        eventType: (log as any).eventType ?? null,
                    }).catch(err => console.error("enqueueAlertEmail error:", err));
                }
            }
        }

        await CacheQueue.add("invalidate-log-cache", {
            pattern: 'logs:*'
        }, {
            jobId: `invalidate-${Date.now()}`,
            priority: 1
        })

        res.status(201).json({
            message: "Successfully created a log.",
            logId: log.id
        });
    },
];

export const deleteALog = [
    body("id", "Log ID is required.").notEmpty().isInt({ gt: 0 }),
    async (req: CustomRequest, res: Response, next: NextFunction) => {
        const errors = validationResult(req).array({ onlyFirstError: true });
        if (errors.length > 0) {
            return next(
                createHttpError({
                    message: errors[0].msg,
                    status: 400,
                    code: errorCodes.invalid,
                })
            );
        }

        const { id } = req.body
        const userId = req.userId
        const user = await getUserById(userId!)
        checkUserIfNotExist(user)

        const log = await getLogById(id)
        checkModalIfExist(log)

        const deletedLog = await deleteLogById(log!.id)

        await CacheQueue.add("invalidate-log-cache", {
            pattern: 'logs:*'
        }, {
            jobId: `invalidate-${Date.now()}`,
            priority: 1
        })

        res.status(200).json({
            message: "Successfully deleted a log.",
            logId: deletedLog.id
        });
    }
]

export const createAUser = [
    body("firstName", "First name is required.").notEmpty().isString().trim(),
    body("lastName", "Last name is required.").notEmpty().isString().trim(),
    body("email", "Email is required.").notEmpty().isEmail().trim(),
    body("password", "Password must be at least 8 digits.")
        .trim()
        .notEmpty()
        .matches(/^[\d]+$/)
        .isLength({ min: 8, max: 8 }),
    body("role", "Role is required.").notEmpty().isString().trim(),
    body("tenant", "Tenant is required.").notEmpty().isString().trim(),
    async (req: CustomRequest, res: Response, next: NextFunction) => {
        const errors = validationResult(req).array({ onlyFirstError: true });
        if (errors.length > 0) {
            return next(
                createHttpError({
                    message: errors[0].msg,
                    status: 400,
                    code: errorCodes.invalid,
                })
            );
        }

        const { email, password, firstName, lastName, role, tenant } = req.body

        const existingUser = await getUserByEmail(email)
        checkUserExit(existingUser)

        const otp = 123456
        const hashPassword = await generateHashedValue(password)
        const hashOTP = await generateHashedValue(otp.toString())

        const userData = {
            email,
            password: hashPassword,
            firstName,
            lastName,
            role,
            tenant,
            rndToken: ""
        }

        const otpData = {
            email,
            otp: hashOTP,
            rememberToken: generateToken(),
            count: 1
        }

        const newUser = await createNewUser(userData, otpData)

        await CacheQueue.add("invalidate-user-cache", {
            pattern: 'users:*'
        }, {
            jobId: `invalidate-${Date.now()}`,
            priority: 1
        })

        res.status(201).json({
            message: "Successfully created a user.",
            userId: newUser.id
        })
    }
]

export const deleteAUser = [
    body("id", "User ID is required.").notEmpty().isInt({ gt: 0 }),
    async (req: CustomRequest, res: Response, next: NextFunction) => {
        const errors = validationResult(req).array({ onlyFirstError: true });
        if (errors.length > 0) {
            return next(
                createHttpError({
                    message: errors[0].msg,
                    status: 400,
                    code: errorCodes.invalid,
                })
            );
        }

        const { id } = req.body
        const user = await getUserById(+id)
        if (!user) return next(createHttpError({
            message: 'There is no account with this ID in database.',
            code: errorCodes.notFound,
            status: 404
        }))

        const deletedUser = await deleteUserById(user.id)

        await CacheQueue.add("invalidate-user-cache", {
            pattern: 'users:*'
        }, {
            jobId: `invalidate-${Date.now()}`,
            priority: 1
        })

        res.status(200).json({
            message: "Successfully deleted a user.",
            userId: deletedUser.id
        })
    }
]

export const updateAUser = [
    body("id", "User ID is required.").notEmpty().isInt({ gt: 0 }),
    body("firstName", "First name is required.").notEmpty().isString().trim(),
    body("lastName", "Last name is required.").notEmpty().isString().trim(),
    body("role", "Role is required.").notEmpty().isString().trim(),
    body("tenant", "Tenant is required.").notEmpty().isString().trim(),
    async (req: CustomRequest, res: Response, next: NextFunction) => {
        const errors = validationResult(req).array({ onlyFirstError: true });
        if (errors.length > 0) {
            return next(
                createHttpError({
                    message: errors[0].msg,
                    status: 400,
                    code: errorCodes.invalid,
                })
            );
        }

        const { id, firstName, lastName, role, tenant } = req.body
        const user = await getUserById(+id)
        if (!user) return next(createHttpError({
            message: 'There is no account with this ID in database.',
            code: errorCodes.notFound,
            status: 404
        }))

        const updatedUser = await updateUserById(user.id, {
            firstName,
            lastName,
            role,
            tenant
        })

        await CacheQueue.add("invalidate-user-cache", {
            pattern: 'users:*'
        }, {
            jobId: `invalidate-${Date.now()}`,
            priority: 1
        })

        res.status(200).json({
            message: "Successfully updated a user.",
            userId: updatedUser.id
        })
    }
]

export const getAllUsersInfinite = [
    query("limit", "Limit must be LogId.").isInt({ gt: 6 }).optional(),
    query("cursor", "Cursor must be unsigned integer.").isInt({ gt: 0 }).optional(),
    query("kw", "Invalid Keyword.").trim().escape().optional(),
    query("tenant", "Invalid Tenant.").trim().escape().optional(),
    query("role", "Invalid Role.").trim().escape().optional(),
    query("status", "Invalid Status.").trim().escape().optional(),
    query("ts", "Invalid Timestamp.").trim().escape().optional(),
    async (req: CustomRequest, res: Response, next: NextFunction) => {
        const errors = validationResult(req).array({ onlyFirstError: true })
        if (errors.length > 0) return next(createHttpError({
            message: errors[0].msg,
            status: 400,
            code: errorCodes.invalid
        }))
        const { limit = 7, cursor: lastCursor, kw, tenant, role, status, ts = "desc" } = req.query
        const userId = req.userId
        const user = await getUserById(userId!)
        checkUserIfNotExist(user)

        const kwFilter: Prisma.UserWhereInput = kw ? {
            OR: [
                { firstName: { contains: kw, mode: 'insensitive' } },
                { lastName: { contains: kw, mode: 'insensitive' } },
                { email: { contains: kw, mode: 'insensitive' } },
            ] as Prisma.UserWhereInput[]
        } : {}


        const tenantFilter: Prisma.UserWhereInput =
            tenant && tenant !== 'all' ?
                { tenant: { contains: tenant as string, mode: 'insensitive' } as Prisma.StringFilter }
                : tenant && user?.role !== 'ADMIN' ? { tenant: { contains: user!.tenant, mode: 'insensitive' } as Prisma.StringFilter } : {}

        const roleFilter: Prisma.UserWhereInput =
            role &&
                role !== "all" &&
                Object.values(Role).includes(role as Role)
                ? { role: role as Role }
                : {};

        const statusFilter: Prisma.UserWhereInput =
            status &&
                status !== "all" &&
                Object.values(Status).includes(status as Status)
                ? { status: status as Status }
                : {};

        const options = {
            where: {
                ...kwFilter,
                ...tenantFilter,
                ...roleFilter,
                ...statusFilter,
            },
            take: +limit + 1,
            skip: lastCursor ? 1 : 0,
            cursor: lastCursor ? { id: +lastCursor } : undefined,
            select: {
                id: true,
                firstName: true,
                lastName: true,
                fullName: true,
                email: true,
                role: true,
                tenant: true,
                status: true
            },
            orderBy: {
                createdAt: ts
            }
        }

        const users = await getAllUsers(options)

        const hasNextPage = users.length > +limit

        if (hasNextPage) {
            users.pop()
        }

        const nextCursor = users.length > 0 ? users[users.length - 1].id : null

        res.status(200).json({
            message: "Here is all users data with infinite scroll.",
            hasNextPage,
            nextCursor,
            prevCursor: lastCursor || undefined,
            data: users
        })

    }
]

export const createAlertRule = [
    body("tenant", "Tenant is required.").trim().notEmpty().escape(),
    body("name", "Rule Name is required.").trim().notEmpty().escape(),
    body("condition", "Rule Condition is required.").trim().notEmpty().escape(),
    body("threshold", "Rule Threshold is required.").notEmpty().isInt({ gt: 0 }).escape(),
    body("windowSeconds", "Invalid Window Seconds.").trim().isInt({ gt: -1 }).escape().optional(),
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

        const { tenant, name, condition, threshold, windowSeconds } = req.body

        const existingRule = await getRuleByFields({ tenant, name, condition })
        if (existingRule) return next(createHttpError({
            message: "Rule already exists. Try another one.",
            status: 400,
            code: errorCodes.invalid
        }))

        const data = {
            tenant,
            name,
            condition,
            threshold: +threshold,
            windowSeconds: +windowSeconds,
        }

        const newRule = await createNewAlertRule(data)

        res.status(201).json({
            message: "Rule created successfully.",
            ruleId: newRule.id
        })
    }
]

export const deleteAlertRule = [
    body("id", "Rule Id is required.").trim().notEmpty().escape(),
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

        const { id } = req.body

        const existingRule = await getRuleById(id)
        if (!existingRule) return next(createHttpError({
            message: "There is no such rule with this id in the database.",
            status: 400,
            code: errorCodes.invalid
        }))

        const deletedRule = await deleteAlertRuleById(id)

        res.status(200).json({
            message: "Rule deleted successfully.",
            ruleId: deletedRule.id
        })
    }
]

export const updateAlertRule = [
    body("id", "Rule Id is required.").trim().notEmpty().escape(),
    body("tenant", "Tenant is required.").trim().notEmpty().escape(),
    body("name", "Rule Name is required.").trim().notEmpty().escape(),
    body("condition", "Rule Condition is required.").trim().notEmpty().escape(),
    body("threshold", "Rule Threshold is required.").notEmpty().isInt({ gt: 0 }).escape(),
    body("windowSeconds", "Invalid Window Seconds.").trim().isInt({ gt: -1 }).escape().optional(),
    async (req: CustomRequest, res: Response, next: NextFunction) => {
        const errors = validationResult(req).array({ onlyFirstError: true })
        if (errors.length > 0) return next(createHttpError({
            message: errors[0].msg,
            status: 400,
            code: errorCodes.invalid
        }))

        const { id, tenant, name, condition, threshold, windowSeconds } = req.body

        const existingRule = await getRuleById(id)
        if (!existingRule) return next(createHttpError({
            message: "There is no such rule with this id in the database.",
            status: 400,
            code: errorCodes.invalid
        }))

        const existAlertRule = await getRuleByFields({ tenant, name, condition, threshold: +threshold, windowSeconds: +windowSeconds })
        if (existAlertRule) return next(createHttpError({
            message: "Rule already exists. Try another one.",
            status: 400,
            code: errorCodes.invalid
        }))

        const data = {
            tenant,
            name,
            condition,
            threshold: +threshold,
            windowSeconds: +windowSeconds,
        }

        const updatedRule = await updateAlertRuleById(id, data)

        res.status(200).json({
            message: "Rule updated successfully.",
            ruleId: updatedRule.id,
        })
    }
]

export const getAllRules = [
    query("tenant", "Invalid Tenant.").trim().escape().optional(),
    query("kw", "Invalid Keyword.").trim().escape().optional(),
    query("ts", "Invalid Timestamp.").trim().escape().optional(),
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

        const { tenant, kw, ts = 'desc' } = req.query

        const kwFilter: Prisma.AlertRuleWhereInput = kw ? {
            OR: [
                { name: { contains: kw, mode: 'insensitive' } },
                { condition: { contains: kw, mode: 'insensitive' } },
            ] as Prisma.AlertRuleWhereInput[]
        } : {}


        const tenantFilter: Prisma.AlertRuleWhereInput =
            tenant && tenant !== 'all' ?
                { tenant: { contains: tenant as string, mode: 'insensitive' } as Prisma.StringFilter }
                : tenant && user?.role !== 'ADMIN' ? { tenant: { contains: user!.tenant, mode: 'insensitive' } as Prisma.StringFilter } : {}

        const options = {
            where: {
                ...kwFilter,
                ...tenantFilter,
            },
            select: {
                id: true,
                tenant: true,
                name: true,
                condition: true,
                threshold: true,
                windowSeconds: true,
                createdAt: true
            },
            orderBy: {
                createdAt: ts
            }
        }

        const result = await getAllAlertRules(options)

        res.status(200).json({
            message: "Here is all rules.",
            data: result
        })
    }
]

export const getSummary = async (req: CustomRequest, res: Response, next: NextFunction) => {

    const allLogs = await prisma.log.count()
    const allUsers = await prisma.user.count()
    const allAlerts = await prisma.alert.count()
    const allTenants = await prisma.user.groupBy({
        by: ['tenant'],
        _count: {
            tenant: true
        }
    })


    res.status(200).json({
        message: "Here is summary data.",
        data: {
            allLogs,
            allUsers,
            allAlerts,
            allTenants: allTenants.map(t => ({ count: t._count.tenant })).reduce((a, b) => a + b.count, 0)
        }
    })
}

