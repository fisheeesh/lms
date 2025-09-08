import bcrypt from 'bcrypt'
import { NextFunction, Request, Response } from 'express'
import { body, validationResult } from 'express-validator'
import jwt from 'jsonwebtoken'
import moment from 'moment'

import { errorCodes } from '../../config/error-codes'
import { checkOTPErrorIfSameDate, checkOTPRow, checkUserExit, checkUserIfNotExist, createHttpError } from '../../utils/check'
import { generateHashedValue, generateToken } from '../../utils/generate'
import { createOTP, createUser, getOTPByEmail, getUserByEmail, getUserById, updateOTP, updateUser } from '../../services/auth-service'

export const register = [
    body("email", "Invalid email format.")
        .trim()
        .notEmpty()
        .isEmail(),
    async (req: Request, res: Response, next: NextFunction) => {
        const errors = validationResult(req).array({ onlyFirstError: true })

        if (errors.length > 0) return next(createHttpError({
            message: errors[0].msg,
            status: 400,
            code: errorCodes.invalid,
        }))

        const { email } = req.body

        //* Check if user already exist
        const user = await getUserByEmail(email)
        checkUserExit(user)

        //* Genereate OTP & call OTP sending API
        const otp = 123456 //? For testing
        // const otp = generateOTP()
        const salt = await bcrypt.genSalt(10)
        const hashOtp = await bcrypt.hash(otp.toString(), salt)
        const token = generateToken()

        //* Get otp by phone
        const otpRow = await getOTPByEmail(email)
        let result;
        //* Check if otp is already in db
        if (!otpRow) {
            const otpData = {
                email,
                otp: hashOtp,
                rememberToken: token,
                count: 1
            }

            //* If not create otp
            result = await createOTP(otpData)
        } else {
            const lastOtpRequest = new Date(otpRow.updatedAt).toLocaleDateString()
            const today = new Date().toLocaleDateString()
            const isSameDate = lastOtpRequest === today

            //* If in db, and check if in same date and error is not happened 5 times
            checkOTPErrorIfSameDate(isSameDate, otpRow.error)

            //* If not in same date
            if (!isSameDate) {
                const otpData = {
                    otp: hashOtp,
                    rememberToken: token,
                    count: 1,
                    error: 0
                }

                //* reset otp count and error and update
                result = await updateOTP(otpRow.id, otpData)
            } else {
                //* Same date and coutn is already times
                if (otpRow.count === 3) {
                    return next(createHttpError({
                        message: "OTP is allowed to request 3 times per day. Please try again tomorrow.",
                        status: 405,
                        code: errorCodes.overLimit,
                    }))
                } else {
                    const otpData = {
                        otp: hashOtp,
                        rememberToken: token,
                        count: { increment: 1 },
                    }

                    //* If not, let user to get otp max per 3 times
                    result = await updateOTP(otpRow.id, otpData)
                }
            }
        }

        res.status(200).json({
            message: `We are sending OTP to ${result.email}.`,
            email: result.email,
            token: result.rememberToken
        })
    }
]

export const verifyOtp = [
    body("email", "Invalid email format.")
        .trim()
        .notEmpty()
        .isEmail(),
    body("otp", "Invalid OTP.")
        .trim()
        .notEmpty()
        .matches(/^[\d]+$/)
        .isLength({ min: 6, max: 6 }),
    body('token', "Invalid Token.")
        .trim()
        .notEmpty()
        .escape(),
    async (req: Request, res: Response, next: NextFunction) => {
        const errors = validationResult(req).array({ onlyFirstError: true })
        if (errors.length > 0) return next(createHttpError({
            message: errors[0].msg,
            status: 400,
            code: errorCodes.invalid,
        }))

        const { email, otp, token } = req.body
        const user = await getUserByEmail(email)
        checkUserExit(user)

        const otpRow = await getOTPByEmail(email)
        checkOTPRow(otpRow)

        const lastOtpVerify = new Date(otpRow!.updatedAt).toLocaleDateString()
        const today = new Date().toLocaleDateString()
        const isSameDate = lastOtpVerify === today
        //* If OTP verify is in the same date and over limit
        checkOTPErrorIfSameDate(isSameDate, otpRow!.error)

        if (otpRow?.rememberToken !== token) {
            const otpData = {
                error: 5
            }
            await updateOTP(otpRow!.id, otpData)

            return next(createHttpError({
                message: 'Invalid Token.',
                status: 400,
                code: errorCodes.invalid,
            }))
        }

        const isExpired = moment().diff(otpRow!.updatedAt) > 2 * 60 * 1000;

        //* Check if otp is expired
        if (isExpired) return next(createHttpError({
            message: 'OTP is expired. Please try again.',
            status: 403,
            code: errorCodes.otpExpired,
        }))


        const isMatchOtp = await bcrypt.compare(otp, otpRow!.otp)

        //* Check if otp is match
        if (!isMatchOtp) {
            //* If OTP is first time today
            if (!isSameDate) {
                const otpData = {
                    error: 1
                }

                await updateOTP(otpRow!.id, otpData)
            } else {
                //* If OTP error is not first time today
                const otpData = {
                    error: { increment: 1 }
                }

                await updateOTP(otpRow!.id, otpData)
            }

            return next(createHttpError({
                message: 'OTP is incorrect.',
                status: 400,
                code: errorCodes.invalid,
            }))
        }

        const verifyToken = generateToken()
        const otpData = {
            verifyToken,
            error: 0,
            count: 1
        }

        const result = await updateOTP(otpRow!.id, otpData)

        res.status(200).json({
            message: "OTP is successfully verified.",
            email: result.email,
            token: result.verifyToken
        })
    }
]

export const confirmPassword = [
    body("email", "Invalid email format.")
        .trim()
        .notEmpty()
        .isEmail(),
    body("password", "Password must be at least 8 digits.")
        .trim()
        .notEmpty()
        .matches(/^[\d]+$/)
        .isLength({ min: 8, max: 8 }),
    body('token', "Invalid Token.")
        .trim()
        .notEmpty()
        .escape(),
    async (req: Request, res: Response, next: NextFunction) => {
        const errors = validationResult(req).array({ onlyFirstError: true })
        if (errors.length > 0) return next(createHttpError({
            message: errors[0].msg,
            status: 400,
            code: errorCodes.invalid,
        }))

        const { email, password, token } = req.body

        const user = await getUserByEmail(email)
        checkUserExit(user)

        const otpRow = await getOTPByEmail(email)
        checkOTPRow(otpRow)

        //* OTP error count is over-limit
        if (otpRow?.error === 5) {
            return next(createHttpError({
                message: "Your request is over-limit. Please try again tomorrow.",
                status: 400,
                code: errorCodes.attack,
            }))
        }

        //* Token is wrong
        if (otpRow?.verifyToken !== token) {
            const otpData = {
                error: 5
            }
            await updateOTP(otpRow!.id, otpData)
            return next(createHttpError({
                message: "Invalid Token.",
                status: 400,
                code: errorCodes.invalid,
            }))
        }

        //* request is expired
        const isExpired = moment().diff(otpRow!.updatedAt) > 10 * 60 * 1000;
        if (isExpired) return next(createHttpError({
            message: "Your request is expired. Please try again.",
            status: 403,
            code: errorCodes.requestExpired,
        }))

        const hashPassword = await generateHashedValue(password)
        const randToken = "@TODO://"

        const userData = {
            email,
            password: hashPassword,
            randToken,
        }
        const newUser = await createUser(userData)

        const accessTokenPayload = { id: newUser.id }
        const refreshTokenPayload = { id: newUser.id, email: newUser.email, role: newUser.role }

        const accessToken = jwt.sign(
            accessTokenPayload,
            process.env.ACCESS_TOKEN_SECRET!,
            { expiresIn: 60 * 15 }
        )

        const refreshToken = jwt.sign(
            refreshTokenPayload,
            process.env.REFRESH_TOKEN_SECRET!,
            { expiresIn: "30d" }
        )

        const userUpdatedData = { randToken: refreshToken }

        await updateUser(newUser.id, userUpdatedData)

        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 1000 * 60 * 15,
            path: '/'
        }).cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 1000 * 60 * 60 * 24 * 30,
            path: "/"
        }).status(201).json({
            message: 'Successfully created an account.',
            userId: newUser.id,
        })
    }
]

export const login = [
    body("email", "Invalid email format.")
        .trim()
        .notEmpty()
        .isEmail(),
    body("password", "Password must be at least 8 digits.")
        .trim()
        .notEmpty()
        .matches(/^[\d]+$/)
        .isLength({ min: 8, max: 8 }),
    async (req: Request, res: Response, next: NextFunction) => {
        const errors = validationResult(req).array({ onlyFirstError: true })
        if (errors.length > 0) return next(createHttpError({
            message: errors[0].msg,
            status: 400,
            code: errorCodes.invalid,
        }))

        const password = req.body.password
        let phone = req.body.phone
        if (phone.slice(0, 2) === '09') {
            phone = phone.substring(2, phone.length)
        }

        const user = await getUserByEmail(phone)
        checkUserIfNotExist(user)

        if (user?.status === 'FREEZE') {
            return next(createHttpError({
                message: "Your account is temporarily locked. Please contact admin.",
                status: 401,
                code: errorCodes.accountFreeze,
            }))
        }

        const isMatchPassword = await bcrypt.compare(password, user!.password)

        if (!isMatchPassword) {
            //* ------------ Starting to record wrong times
            const lastRequest = new Date(user!.updatedAt).toLocaleDateString()
            const isSameDate = lastRequest === new Date().toLocaleDateString()

            if (!isSameDate) {
                const userData = {
                    errorLoginCount: 1
                }

                await updateUser(user!.id, userData)
            } else {
                if (user!.errorLoginCount >= 3) {
                    const userData = {
                        status: 'FREEZE'
                    }

                    await updateUser(user!.id, userData)
                } else {
                    const userData = {
                        errorLoginCount: { increment: 1 }
                    }

                    await updateUser(user!.id, userData)
                }
            }
            //* ------------ Ending -------------
            return next(createHttpError({
                message: "Password is incorrect.",
                status: 401,
                code: errorCodes.invalid,
            }))
        }

        //* Authorization token
        const accessTokenPayload = { id: user!.id }
        const refreshTokenPayload = { id: user!.id, email: user!.email, role: user!.role }

        const accessToken = jwt.sign(
            accessTokenPayload,
            process.env.ACCESS_TOKEN_SECRET!,
            { expiresIn: 60 * 15 }
        )

        const refreshToken = jwt.sign(
            refreshTokenPayload,
            process.env.REFRESH_TOKEN_SECRET!,
            { expiresIn: "30d" }
        )

        const userData = {
            errorLoginCount: 0,
            randToken: refreshToken
        }

        await updateUser(user!.id, userData)

        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 1000 * 60 * 15,
            path: "/"
        }).cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 1000 * 60 * 60 * 24 * 30,
            path: "/"
        }).status(200).json({
            message: 'Successfully Logged In.',
            userId: user!.id,
        })
    }
]

export const logout = async (req: Request, res: Response, next: NextFunction) => {
    //* Clear HttpOnly cookies
    const refreshToken = req.cookies ? req.cookies.refreshToken : null
    if (!refreshToken) return next(createHttpError({
        message: 'You are not an authenticated user.',
        code: errorCodes.unauthenticated,
        status: 401,
    }))

    let decoded;
    try {
        decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET!) as {
            id: number, email: string, role: string
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
    checkUserIfNotExist(user)

    if (user!.email !== decoded.email) return next(createHttpError({
        message: 'You are not an authenticated user.',
        code: errorCodes.unauthenticated,
        status: 401,
    }))

    //* Update randToken is User Table
    const userData = {
        randToken: generateToken(),
    }
    await updateUser(user!.id, userData)

    res.clearCookie('accessToken', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
        path: "/"
    })
    res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
        path: "/"
    })

    res.status(200).json({ message: "Successfully logged out. See you soon.!" })
}

// export const forgetPassword = [
//     body("email", "Invalid email format.")
//         .trim()
//         .notEmpty()
//         .isEmail(),
//     async (req: Request, res: Response, next: NextFunction) => {
//         const errors = validationResult(req).array({ onlyFirstError: true })
//         if (errors.length > 0) return next(createHttpError({
//             message: errors[0].msg,
//             status: 400,
//             code: errorCodes.invalid,
//         }))

//         const { email } = req.body
//         //* Check user's phone is in db or not
//         const user = await getUserByEmail(email)
//         checkUserIfNotExist(user)

//         //* Check user's account is freeze or not
//         if (user!.status === 'FREEZE') {
//             return next(createHttpError({
//                 message: "Your account is temporarily locked. Please contact us.",
//                 status: 401,
//                 code: errorCodes.accountFreeze,
//             }))
//         }

//         const otp = 123456
//         const salt = await bcrypt.genSalt(10)
//         const hashOtp = await bcrypt.hash(otp.toString(), salt)
//         const token = generateToken()

//         //* OTP Row must be in db
//         const otpRow = await getOTPByEmail(email)
//         //$ Warning - Our app may let users change their phone number.
//         // * If so, you need to check if phone number exists in OTP table

//         let result;
//         const lastOtpRequest = new Date(otpRow!.updatedAt).toLocaleDateString()
//         const isSameDate = lastOtpRequest === new Date().toLocaleDateString()

//         checkOTPErrorIfSameDate(isSameDate, otpRow!.error)

//         if (!isSameDate) {
//             const otpData = {
//                 otp: hashOtp,
//                 rememberToken: token,
//                 count: 1,
//                 error: 0
//             }
//             result = await updateOTP(otpRow!.id, otpData)
//         } else {
//             if (otpRow!.count === 3) {
//                 return next(createHttpError({
//                     message: 'You have reached the maximum number of attempts. Please try again tomorrow.',
//                     status: 400,
//                     code: errorCodes.invalid,
//                 }))
//             } else {
//                 const otpData = {
//                     otp: hashOtp,
//                     rememberToken: token,
//                     count: { increment: 1 },
//                 }

//                 result = await updateOTP(otpRow!.id, otpData)
//             }
//         }

//         res.status(200).json({
//             message: `We are sending OTP to ${result.email} to reset password.`,
//             email: result.email,
//             token: result.rememberToken
//         })
//     }
// ]

// export const verifyForgotOTP = [
//     body("email", "Invalid email format.")
//         .trim()
//         .notEmpty()
//         .isEmail(),
//     body("otp", "Invalid OTP.")
//         .trim()
//         .notEmpty()
//         .matches(/^[\d]+$/)
//         .isLength({ min: 6, max: 6 }),
//     body('token', "Invalid Token.")
//         .trim()
//         .notEmpty()
//         .escape(),
//     async (req: Request, res: Response, next: NextFunction) => {
//         const errors = validationResult(req).array({ onlyFirstError: true })
//         if (errors.length > 0) return next(createHttpError({
//             message: errors[0].msg,
//             status: 400,
//             code: errorCodes.invalid,
//         }))

//         const { email, otp, token } = req.body

//         const user = await getUserByEmail(email)
//         checkUserIfNotExist(user)

//         //* OTP row must be in db
//         const otpRow = await getOTPByEmail(email)

//         const lastOtpRequest = new Date(otpRow!.updatedAt).toLocaleDateString()
//         const isSameDate = lastOtpRequest === new Date().toLocaleDateString()
//         checkOTPErrorIfSameDate(isSameDate, otpRow!.error)

//         if (otpRow!.rememberToken !== token) {
//             const otpData = {
//                 error: 5
//             }
//             await updateOTP(otpRow!.id, otpData)
//             return next(createHttpError({
//                 message: "Your request is over-limit. Please try again.",
//                 status: 400,
//                 code: errorCodes.attack,
//             }))
//         }

//         const isExpired = moment().diff(otpRow!.updatedAt) > 2 * 60 * 1000;
//         if (isExpired) return next(createHttpError({
//             message: "OTP is expired.",
//             status: 400,
//             code: errorCodes.otpExpired,
//         }))

//         const isMatchOtp = await bcrypt.compare(otp, otpRow!.otp)

//         if (!isMatchOtp) {
//             if (!isSameDate) {
//                 const otpData = {
//                     error: 1
//                 }
//                 await updateOTP(otpRow!.id, otpData)
//             } else {
//                 const otpData = {
//                     error: { increment: 1 }
//                 }
//                 await updateOTP(otpRow!.id, otpData)
//             }

//             return next(createHttpError({
//                 message: "Incorrect OTP. Please try again.",
//                 status: 400,
//                 code: errorCodes.invalid,
//             }))
//         }

//         const verifyToken = generateToken()
//         const otpData = {
//             verifyToken,
//             error: 0,
//             count: 1
//         }

//         const result = await updateOTP(otpRow!.id, otpData)

//         res.status(200).json({
//             message: "OTP is successfully verified to reset password.",
//             email: result.email,
//             token: result.verifyToken
//         })
//     }
// ]

// export const resetPassword = [
//     body("email", "Invalid email format.")
//         .trim()
//         .notEmpty()
//         .isEmail(),
//     body("password", "Password must be at least 8 digits.")
//         .trim()
//         .notEmpty()
//         .matches(/^[\d]+$/)
//         .isLength({ min: 8, max: 8 }),
//     body('token', "Invalid Token.")
//         .trim()
//         .notEmpty()
//         .escape(),
//     async (req: Request, res: Response, next: NextFunction) => {
//         const errors = validationResult(req).array({ onlyFirstError: true })
//         if (errors.length > 0) return next(createHttpError({
//             message: errors[0].msg,
//             status: 400,
//             code: errorCodes.invalid,
//         }))

//         const { email, password, token } = req.body

//         const user = await getUserByEmail(email)
//         checkUserIfNotExist(user)

//         //* OTP row must be in db
//         const otpRow = await getOTPByEmail(email)

//         if (otpRow!.error >= 5) return next(createHttpError({
//             message: "Your request is over-limit. Please try again tomorrow.",
//             status: 400,
//             code: errorCodes.attack,
//         }))

//         if (otpRow!.verifyToken !== token) {
//             const otpData = {
//                 error: 5
//             }
//             await updateOTP(otpRow!.id, otpData)
//             return next(createHttpError({
//                 message: "Your request is over-limit. Please try again.",
//                 status: 400,
//                 code: errorCodes.attack,
//             }))
//         }

//         const isExpired = moment().diff(otpRow!.updatedAt) > 10 * 60 * 1000;

//         if (isExpired) return next(createHttpError({
//             message: "OTP is expired.",
//             status: 400,
//             code: errorCodes.otpExpired,
//         }))

//         const hashPassword = await generateHashedValue(password)

//         const accessPayload = { id: user!.id }
//         const refreshPayload = { id: user!.id, email: user!.email, role: user!.role }

//         const accessToken = jwt.sign(
//             accessPayload,
//             process.env.ACCESS_TOKEN_SECRET!,
//             { expiresIn: 60 * 15 }
//         )
//         const refreshToken = jwt.sign(
//             refreshPayload,
//             process.env.REFRESH_TOKEN_SECRET!,
//             { expiresIn: "30d" }
//         )

//         const userUpdatedData = {
//             password: hashPassword,
//             randToken: refreshToken
//         }

//         await updateUser(user!.id, userUpdatedData)

//         res.cookie("accessToken", accessToken, {
//             httpOnly: true,
//             secure: process.env.NODE_ENV === 'production',
//             sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
//             maxAge: 1000 * 60 * 15
//         })
//             .cookie("refreshToken", refreshToken, {
//                 httpOnly: true,
//                 secure: process.env.NODE_ENV === 'production',
//                 sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
//                 maxAge: 1000 * 60 * 60 * 24 * 30
//             })
//             .status(200).json({
//                 message: "Password is successfully reset.",
//                 userId: user!.id
//             })
//     }
// ]