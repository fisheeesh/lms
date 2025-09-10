import { PrismaClient } from "../generated/prisma";

const prismaClient = new PrismaClient()

export const getUserByEmail = async (email: string) => {
    return await prismaClient.user.findUnique({
        where: { email }
    })
}

export const getUserById = async (id: number) => {
    return await prismaClient.user.findUnique({
        where: { id }
    })
}

export const createUser = async (userData: any) => {
    return await prismaClient.user.create({
        data: userData
    })
}

export const updateUser = async (id: number, userData: any) => {
    return await prismaClient.user.update({
        where: { id },
        data: userData
    })
}

export const updateUserByEmail = async (email: string, userData: any) => {
    return await prismaClient.user.update({
        where: { email },
        data: userData
    })
}

export const createOTP = async (otpData: any) => {
    return await prismaClient.otp.create({
        data: otpData
    })
}

export const getOTPByEmail = async (email: string) => {
    return await prismaClient.otp.findUnique({
        where: { email }
    })
}

export const updateOTP = async (id: number, otpData: any) => {
    return await prismaClient.otp.update({
        where: { id },
        data: otpData
    })
}