import { prisma } from "../config/prisma-client";
import { PrismaClient } from "../generated/prisma";

const prismaClient = new PrismaClient()

export const getRuleById = async (id: string) => {
    return await prismaClient.alertRule.findUnique({
        where: { id }
    })
}

export const createNewAlertRule = async (data: any) => {
    return await prismaClient.alertRule.create({ data })
}

export const getRuleByFields = async (fields: any) => {
    return await prismaClient.alertRule.findFirst({
        where: { ...fields }
    })
}

export const deleteAlertRuleById = async (id: string) => {
    return await prismaClient.alertRule.delete({
        where: { id }
    })
}

export const updateAlertRuleById = async (id: string, data: any) => {
    return await prismaClient.alertRule.update({
        where: { id },
        data
    })
}

export const getAllAlertRules = async (options: any) => {
    return await prisma.alertRule.findMany(options)
}