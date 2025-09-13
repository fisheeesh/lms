import dotenv from 'dotenv';
dotenv.config();

import { Worker } from "bullmq";
import { Resend } from "resend";
import { redis } from "../../config/redis-client";
import { SENDER_EMAIL } from "../../utils/helpers";

const resend = new Resend(process.env.RESEND_API_KEY!);
const FROM = SENDER_EMAIL;
// const TO = RECIEVER_EMAIL;

type JobPayload = {
    to: string,
    alertId: string;
    tenant: string;
    ruleName: string;
    severity?: number | null;
    logId?: string | number;
    source?: string | null;
    eventType?: string | null;
};

const emailWorker = new Worker<JobPayload>(
    "email-send",
    async (job) => {
        if (job.name !== "send-alert-email") return;

        console.log('working email')

        const { to, alertId, tenant, ruleName, severity, logId, source, eventType } = job.data;
        const subject = `[ALERT][${tenant}] ${ruleName} (sev ${severity ?? "-"})`;

        const html = `
        <h2>New Alert</h2>
        <p><b>Tenant:</b> ${tenant}</p>
        <p><b>Rule:</b> ${ruleName}</p>
        <p><b>Severity:</b> ${severity ?? "-"}</p>
        <p><b>Source:</b> ${source ?? "-"}</p>
        <p><b>Event Type:</b> ${eventType ?? "-"}</p>
        <p><b>Alert ID:</b> ${alertId}</p>
        ${logId ? `<p><b>Log ID:</b> ${logId}</p>` : ""}
    `;

        await resend.emails.send({
            from: FROM,
            to,
            subject,
            html,
        });
    },
    { connection: redis, concurrency: 5 }
);

emailWorker.on("completed", (job) => {
    console.log(`Job: ${job.id} completed`);
});

emailWorker.on("failed", (job, err) => {
    console.log(`Job: ${job?.id} failed`, err);
});

export default emailWorker;