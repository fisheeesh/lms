import { NextFunction, Request, Response } from "express"
import { body, validationResult } from "express-validator"
import { createHttpError } from "../../utils/check"
import { errorCodes } from "../../config/error-codes"

interface CustomRequest extends Request {
    userId?: number
}

export const createALog = [
    body("tenant", "Tenant is required."),
    async (req: CustomRequest, res: Response, next: NextFunction) => {
        const errors = validationResult(req).array({ onlyFirstError: true })
        if (errors.length > 0) return next(createHttpError({
            message: errors[0].msg,
            status: 400,
            code: errorCodes.invalid
        }))

        const { } = req.body

        res.status(201).json({
            message: 'Successfully created a log.',
        })
    }
]