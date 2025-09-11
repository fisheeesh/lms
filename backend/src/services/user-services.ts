import { prisma } from "../config/prisma-client";
import { PrismaClient } from "../generated/prisma";
import jwt from 'jsonwebtoken'

const prismaClient = new PrismaClient()

export const getUserdataById = async (id: number) => {
    return await prisma.user.findUnique({
        where: { id },
        select: {
            id: true,
            fullName: true,
            email: true,
            role: true,
            tenant: true
        }
    })
}

export const createNewUser = async (userData: any, otpData: any) => {
    return await prismaClient.$transaction(async (tx) => {
        const newUser = await tx.user.create({
            data: userData
        })

        await tx.otp.create({
            data: otpData
        })

        const refreshTokenPayload = { id: newUser.id, email: newUser.email, role: newUser.role, tenant: newUser.tenant }

        const refreshToken = jwt.sign(
            refreshTokenPayload,
            process.env.REFRESH_TOKEN_SECRET!,
            { expiresIn: "30d" }
        )

        await tx.user.update({
            where: { id: newUser.id },
            data: { rndToken: refreshToken }
        })

        return newUser
    })
}

export const deleteUserById = async (id: number) => {
    return await prismaClient.$transaction(async (tx) => {
        const deletedUser = await tx.user.delete({
            where: { id }
        })

        await tx.otp.deleteMany({
            where: { email: deletedUser.email }
        })

        return deletedUser
    })
}

export const updateUserById = async (id: number, data: any) => {
    return await prismaClient.user.update({
        where: { id },
        data
    })
}
