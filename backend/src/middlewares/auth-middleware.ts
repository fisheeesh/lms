import { NextFunction, Request, Response } from "express";
import { createHttpError } from "../utils/check";
import jwt from "jsonwebtoken"
import { errorCodes } from "../config/error-codes";
import { getUserById, updateUser } from "../services/auth-services";

interface CustomRequest extends Request {
    userId?: number
}

export const auth = async (req: CustomRequest, res: Response, next: NextFunction) => {

    const accessToken = req.cookies ? req.cookies.accessToken : null
    const refreshToken = req.cookies ? req.cookies.refreshToken : null

    if (!refreshToken) return next(createHttpError({
        message: 'You are not an authenticated user.',
        code: errorCodes.unauthenticated,
        status: 401,
    }))

    const generateNewTokens = async () => {
        let decoded;
        try {
            decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET!) as {
                id: number,
                email: string,
                role: string,
                tenant: string
            }
        } catch (error) {
            return next(createHttpError({
                message: 'You are not an authenticated user.',
                code: errorCodes.unauthenticated,
                status: 401,
            }))
        }

        if (isNaN(decoded.id)) {
            return next(createHttpError({
                message: 'You are not an authenticated user.',
                code: errorCodes.unauthenticated,
                status: 401,
            }))
        }

        const user = await getUserById(decoded.id)
        if (!user) {
            return next(createHttpError({
                message: 'This account has not been registered.',
                code: errorCodes.unauthenticated,
                status: 401,
            }))
        }

        if (user.email !== decoded.email || user.rndToken !== refreshToken) {
            return next(createHttpError({
                message: 'You are not an authenticated user.',
                code: errorCodes.unauthenticated,
                status: 401,
            }))
        }

        const accessTokenPayload = { id: user.id }
        const refreshTokenPayload = { id: user.id, email: user.email, role: user.role }

        const newAccessToken = jwt.sign(
            accessTokenPayload,
            process.env.ACCESS_TOKEN_SECRET!,
            { expiresIn: 60 * 15 }
        )

        const newRefreshToken = jwt.sign(
            refreshTokenPayload,
            process.env.REFRESH_TOKEN_SECRET!,
            { expiresIn: "30d" }
        )

        const userData = {
            rndToken: newRefreshToken
        }

        await updateUser(user!.id, userData)

        res.cookie("accessToken", newAccessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 1000 * 60 * 15
        }).cookie("refreshToken", newRefreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 1000 * 60 * 60 * 24 * 30
        })

        req.userId = decoded.id
        next()
    }

    if (!accessToken) {
        //* If there is not accessToken, genereate new ones
        generateNewTokens()
    } else {
        //* Verify access token
        let decoded;
        try {
            decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET!) as { id: number }

            if (isNaN(decoded.id)) {
                return next(createHttpError({
                    message: 'You are not an authenticated user.',
                    code: errorCodes.unauthenticated,
                    status: 401,
                }))
            }

            req.userId = decoded.id
            next()
        } catch (error: any) {
            if (error.name === 'TokenExpiredError') {
                generateNewTokens()
            } else {
                return next(createHttpError({
                    message: 'Access Token is invalid.',
                    code: errorCodes.attack,
                    status: 401,
                }))
            }
        }
    }
}