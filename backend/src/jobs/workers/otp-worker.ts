import { Worker } from "bullmq";
import { redis } from "../../config/redis-client";
import { Resend } from "resend";
import { SENDER_EMAIL } from "../../utils/helpers";

require("dotenv").config();

const resend = new Resend(process.env.RESEND_API_KEY!);
const FROM = SENDER_EMAIL

type OTPJob = {
    to: string;
    otp: string;
    expiresIn?: number;
};

const otpWorker = new Worker<OTPJob>(
    "otp-send",
    async (job) => {
        if (job.name !== "send-otp-email") return;

        const { to, otp, expiresIn = 120 } = job.data;

        const subject = "Your OTP Code";
        const html = `
        <div style="font-family:system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif;line-height:1.6">
            <h2>Verification Code</h2>
            <p>Use the following one-time code to continue:</p>
            <p style="font-size:24px;font-weight:700;letter-spacing:3px">${otp}</p>
            <p>This code will expire in ${Math.floor(expiresIn / 60)} minutes.</p>
            <hr/>
        <p style="color:#6b7280;font-size:12px">If you didn’t request this, you can safely ignore this email.</p>
        </div>
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

otpWorker.on("completed", (job) => {
    console.log(`OTP job ${job.id} completed`);
});

otpWorker.on("failed", (job, err) => {
    console.error(`OTP job ${job?.id} failed`, err);
});

export default otpWorker;