import { randomBytes } from "crypto";
import * as bcrypt from "bcrypt"

export const generateOTP = () => {
    return parseInt(randomBytes(3).toString('hex'), 16) % 900000 + 100000
}

export const generateToken = () => {
    return randomBytes(32).toString('hex')
}

export const generateHashedValue = async (value: string) => {
    const salt = await bcrypt.genSalt(10)
    return await bcrypt.hash(value, salt)
}