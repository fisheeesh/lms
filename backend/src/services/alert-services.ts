import { prisma } from "../config/prisma-client";
import { Prisma, PrismaClient, AlertStatus } from '../../prisma/generated/prisma'

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

export const getEnabledRulesForTenant = (tenant: string) => {
    return prismaClient.alertRule.findMany({
        where: { tenant },
        orderBy: { createdAt: "desc" },
    });
};

export const createAlert = (tenant: string, ruleName: string) => {
    return prismaClient.alert.create({
        data: {
            tenant,
            ruleName,
            status: "NEW",
        },
    });
};

export const countLogsSince = async (tenant: string, minSeverity: number, since: Date) => {
    return prismaClient.log.count({
        where: {
            tenant,
            severity: { gte: minSeverity },
            createdAt: { gte: since },
        },
    });
};

export const getAllAlertsData = async (uTenant: string, qTenant: string, role: string, status: string) => {
    try {
        const tenantFilter: Prisma.AlertWhereInput =
            qTenant && qTenant !== 'all' ?
                { tenant: { contains: qTenant as string, mode: 'insensitive' } as Prisma.StringFilter }
                : !qTenant && role !== 'ADMIN' ? { tenant: { contains: uTenant, mode: 'insensitive' } as Prisma.StringFilter }
                    : qTenant && role !== 'ADMIN' ? { tenant: { contains: uTenant, mode: 'insensitive' } as Prisma.StringFilter } : {}

        const statusFilter: Prisma.AlertWhereInput =
            status &&
                status !== "all" &&
                Object.values(AlertStatus).includes(status as AlertStatus)
                ? { status: status as AlertStatus }
                : {};

        const results = await prisma.alert.findMany({
            where: {
                ...tenantFilter,
                ...statusFilter
            },
            orderBy: {
                triggeredAt: "desc",
            },
            take: 5
        })

        return results
    } catch (error) {
        console.log(error)
    }
}