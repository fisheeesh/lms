import { PrismaClient } from "../generated/prisma"

export const prisma = new PrismaClient().$extends({
    result: {
        user: {
            fullName: {
                needs: { firstName: true, lastName: true },
                compute(user) {
                    return `${user.firstName} ${user.lastName}`
                }
            },
            avatar: {
                needs: { avatar: true, },
                compute(user) {
                    return `/optimizes/${user.avatar?.split(".")[0]}.webp`
                }
            },
        },
    }
})