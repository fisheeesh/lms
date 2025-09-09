import { NextFunction, Request, Response } from "express"
import { query, validationResult } from "express-validator"
import { errorCodes } from "../../config/error-codes"
import { getUserById } from "../../services/auth-service"
import { checkUserIfNotExist, createHttpError } from "../../utils/check"
import { prisma } from "../../config/prisma-client"

interface CustomRequest extends Request {
    userId?: number
}

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

    const data = await prisma.user.findUnique({
        where: { id: userId! },
        select: {
            id: true,
            fullName: true,
            email: true,
            role: true,
            tenant: true
        }
    })

    res.status(200).json({
        message: "Here is your data",
        data
    })
}

export const getLogs = [
    query("tenant", "Tenant is required."),
    async (req: CustomRequest, res: Response, next: NextFunction) => {
        const errors = validationResult(req).array({ onlyFirstError: true })
        if (errors.length > 0) return next(createHttpError({
            message: errors[0].msg,
            status: 400,
            code: errorCodes.invalid
        }))

        const { } = req.query

        res.status(201).json({
            message: 'Here is your logs.',
        })
    }
]