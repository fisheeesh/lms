import seedData from "../src/config/seed-data";
import { PrismaClient } from "../src/generated/prisma";

const prisma = new PrismaClient();

async function main() {
    console.log("Starting seeding...");

    await prisma.log.deleteMany();
    await prisma.user.deleteMany();
    await prisma.otp.deleteMany()
    await prisma.alert.deleteMany()
    await prisma.alertRule.deleteMany()

    await prisma.log.createMany({ data : seedData.logs });

    console.log(`Seeding finished.`);
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });