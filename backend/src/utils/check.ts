import { errorCodes } from "../config/error-codes"

export const createHttpError = ({ message, status, code }: { message: string, status: number, code: string }) => {
    const error: any = new Error(message)
    error.status = status
    error.code = code
    return error
}

export const checkUserExit = (user: any) => {
    if (user) {
        const error: any = new Error('This email address has already been registered.')
        error.status = 409
        error.code = errorCodes.userExists
        throw error
    }
}

export const checkUserIfNotExist = (user: any) => {
    if (!user) {
        const error: any = new Error('This email address has not been registered.')
        error.status = 401
        error.code = errorCodes.unauthenticated
        throw error
    }
}

export const checkOTPErrorIfSameDate = (isSameDate: boolean, errorCount: number) => {
    if (isSameDate && errorCount >= 5) {
        const error: any = new Error(
            "OTP is wrong for 5 times. Please try again tomorrow."
        )
        error.status = 401
        error.code = errorCodes.overLimit
        throw error
    }
}

export const checkOTPRow = (otpRow: any) => {
    if (!otpRow) {
        const error: any = new Error('Email address is incorrect.')
        error.status = 400
        error.code = errorCodes.invalid
        throw error
    }
}

export const checkModalIfExist = (modal: any) => {
    if (!modal) {
        const error: any = new Error('Modal is not exist.')
        error.status = 400
        error.code = errorCodes.invalid
        throw error
    }
}