import { eachDayOfInterval, format } from "date-fns";
import { PrismaClient } from "../generated/prisma";
import CacheQueue from "../jobs/queues/cache-queue";
import { rentationDay } from "../utils/helpers";

const prisma = new PrismaClient()

export const getLogById = async (id: number) => {
    return await prisma.log.findUnique({
        where: { id }
    })
}

export const deleteLogsWhichAreOlderThan7Days = async () => {
    try {
        const cutoff = new Date()
        cutoff.setDate(cutoff.getDate() - +rentationDay!)

        await prisma.$transaction(async (tx) => {
            const oldLogs = await tx.log.findMany({
                where: {
                    createdAt: {
                        lte: cutoff,
                    },
                },
                select: { id: true },
            })

            if (oldLogs.length === 0) {
                console.log("No old logs to delete.")
                return
            }

            await tx.log.deleteMany({
                where: {
                    id: { in: oldLogs.map((l) => l.id) },
                },
            })

            console.log(`Deleted ${oldLogs.length} old logs (older than 7 days).`)

            await CacheQueue.add("invalidate-log-cache", {
                pattern: 'logs:*'
            }, {
                jobId: `invalidate-${Date.now()}`,
                priority: 1
            })
        })
    } catch (err) {
        console.error("Error running log retention job:", err)
    }
}

export const createLog = async (data: any) => {
    return await prisma.log.create({ data })
}

export const deleteLogById = async (id: number) => {
    return await prisma.log.delete({
        where: { id }
    })
}

export const getLogsOverviewFor60days = async (tenant: string, start: Date, end: Date) => {
    try {
        const allLogs = await prisma.log.findMany({
            where: {
                tenant,
                createdAt: {
                    gte: start,
                    lte: end
                }
            },
            select: {
                createdAt: true
            }
        })

        const dayMap: Record<
            string,
            { value: number }
        > = {}

        for (const log of allLogs) {
            const date = format(log.createdAt, "yyyy-MM-dd")
            if (dayMap[date]) {
                dayMap[date].value += 1
            } else {
                dayMap[date] = {
                    value: 1
                }
            }
        }

        //* Also set values to interval days to avoid jump data in the chart
        const days = eachDayOfInterval({ start, end })

        const result = days.map(day => {
            const key = format(day, "yyyy-MM-dd")
            return {
                date: key,
                value: dayMap[key] ? dayMap[key].value : 0
            }
        })

        return result
    } catch (error) {
        console.log(error)
    }
}

export const getLogsSourceComparison = async (tenant: string, start: Date, end: Date) => {
    try {
        const allLogs = await prisma.log.findMany({
            where: {
                tenant,
                createdAt: {
                    gte: start,
                    lte: end
                }
            },
            select: {
                createdAt: true,
                source: true
            }
        })

        const dayMap: Record<
            string,
            { firewall: number, api: number, crowdstrike: number, aws: number, m365: number, ad: number }
        > = {}

        for (const log of allLogs) {
            const date = format(log.createdAt, "MMM dd")

            if (!dayMap[date]) {
                dayMap[date] = {
                    firewall: 0,
                    api: 0,
                    crowdstrike: 0,
                    aws: 0,
                    m365: 0,
                    ad: 0,
                }
            }

            if (log.source === 'FIREWALL' || log.source === 'NETWORK') dayMap[date].firewall++
            else if (log.source === 'API') dayMap[date].api++
            else if (log.source === 'CROWDSTRIKE') dayMap[date].crowdstrike++
            else if (log.source === 'AWS') dayMap[date].aws++
            else if (log.source === 'M365') dayMap[date].m365++
            else if (log.source === 'AD') dayMap[date].ad++
        }

        const days = eachDayOfInterval({ start, end })

        const result = days.map(day => {
            const key = format(day, "MMM dd")
            return {
                date: key,
                firewall: dayMap[key]?.firewall ?? 0,
                api: dayMap[key]?.api ?? 0,
                crowdstrike: dayMap[key]?.crowdstrike ?? 0,
                aws: dayMap[key]?.aws ?? 0,
                m365: dayMap[key]?.m365 ?? 0,
                ad: dayMap[key]?.ad ?? 0,
            }
        })

        return result
    } catch (error) {
        console.log(error)
    }
}