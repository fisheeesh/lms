import dgram from "dgram";
import net from "net";
import { normalizeData } from "./utils/normalize";
import { LogSource, PrismaClient } from "../prisma/generated/prisma";

const prisma = new PrismaClient()

const PORT = 1514;
const TENANT = "companyA";

const udp = dgram.createSocket("udp4");
udp.on("message", async (msg, rinfo) => {
    const payload = msg.toString();
    const data = normalizeData(TENANT, LogSource.FIREWALL, payload);
    await prisma.log.create({ data });
});
udp.bind(PORT, () => console.log(`Syslog UDP listening on :${PORT}`));

const tcp = net.createServer(socket => {
    socket.on("data", async buf => {
        const payload = buf.toString();
        const data = normalizeData(TENANT, LogSource.FIREWALL, payload);
        await prisma.log.create({ data });
    });
});
tcp.listen(PORT, () => console.log(`Syslog TCP listening on :${PORT}`));