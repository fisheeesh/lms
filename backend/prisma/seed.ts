import { PrismaClient } from "@prisma/client";
import data from "../src/config/seed-data";

const prisma = new PrismaClient();

async function main() {
    console.log("Starting seeding...");

    await prisma.log.createMany({ data });

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