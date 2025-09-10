import { PrismaClient } from "../generated/prisma";

const prisma = new PrismaClient()

export const getLogById = async (id: number) => {
    return await prisma.log.findUnique({
        where: { id }
    })
}

export const deleteLogById = async (id: number) => {
    return await prisma.log.delete({
        where: { id }
    })
}