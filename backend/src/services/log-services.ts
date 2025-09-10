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