import { PrismaClient } from "../generated/prisma"

export const prisma = new PrismaClient().$extends({
    result: {
        user: {
            fullName: {
                needs: { firstName: true, lastName: true },
                compute(user) {
                    return `${user.firstName} ${user.lastName}`
                },
            },
            avatar: {
                needs: { avatar: true },
                compute(user) {
                    return `/optimizes/${user.avatar?.split(".")[0]}.webp`
                },
            },
        },
        log: {
            severityLabel: {
                needs: { severity: true },
                compute(log) {
                    const score = log.severity ?? 0

                    if (score <= 2) return "Info"
                    else if (score <= 4) return "Warn"
                    else if (score <= 7) return "Error"
                    else return "Critical"
                },
            },
            createdAt: {
                needs: { createdAt: true },
                compute(log) {
                    return log.createdAt.toLocaleDateString("en-US", {
                        year: "numeric", month: "long", day: "numeric"
                    })
                },
            },
        },
        alertRule: {
            createdAt: {
                needs: { createdAt: true },
                compute(log) {
                    return log.createdAt.toLocaleDateString("en-US", {
                        year: "numeric", month: "long", day: "numeric"
                    })
                },
            },
        },
        alert: {
            triggeredAt: {
                needs: { triggeredAt: true },
                compute(log) {
                    return log.triggeredAt.toLocaleDateString("en-US", {
                        year: "numeric", month: "long", day: "numeric"
                    })
                },
            }
        }
    },
})