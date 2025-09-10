import { NextFunction, Request, Response } from "express"
import { body, validationResult } from "express-validator"
import { errorCodes } from "../../config/error-codes"
import { Action, LogSource, PrismaClient } from "../../generated/prisma"
import { checkModalIfExist, checkUserIfNotExist, createHttpError } from "../../utils/check"
import { normalizeData } from "../../utils/normalize"
import { getUserById } from "../../services/auth-services"
import { deleteLogById, getLogById } from "../../services/log-services"

interface CustomRequest extends Request {
    userId?: number
    user?: any
}

const prisma = new PrismaClient()

export const testAdmin = async (req: CustomRequest, res: Response, next: NextFunction) => {
    res.status(200).json({
        message: "You are allowed to see this resources.",
        userId: req.userId,
        role: req.user?.role
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
    body("cloud_account_id").optional().isString(),
    body("cloud_region").optional().isString(),
    body("cloud_service").optional().isString(),
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

        const tenant = req.body.tenant || req.user?.tenant;

        const source = (req.body.source as LogSource) || LogSource.API;
        const payload = req.body;

        const data = normalizeData(tenant, source, payload);
        const log = await prisma.log.create({ data });

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

        res.status(200).json({
            message: "Successfully deleted a log.",
            logId: deletedLog.id
        });
    }
]