import { prisma } from "../config/prisma-client"
import { Action } from "../generated/prisma"
import EmailQueue from "../jobs/queues/email-queue"

export const actions = ["ALLOW", "DENY", "CREATE", "DELETE", "LOGIN", "LOGOUT", "ALERT"]

export const source = ["FIREWALL", "API", "CROWDSTRIKE", "AWS", "M365", "AD"]

export const rentationDay = process.env.LOG_RETENTION_DAYS || 7

export const SENDER_EMAIL = process.env.SENDER_EMAIL || "onboarding@resend.dev"

export const RECIEVER_EMAIL = process.env.RECIEVER_EMAIL || "6531503187@lamduan.mfu.ac.th"

export const authorize = (permission: boolean, userRole: string, ...roles: string[]) => {
    const result = roles.includes(userRole)

    let grant = true
    if (permission && !result) {
        grant = false
    }

    if (!permission && result) {
        grant = false
    }

    return grant
}

export function num(v: any): number | undefined {
    const n = Number(v);
    return Number.isFinite(n) ? n : undefined;
}
export function to0to10(v: any): number | undefined {
    const n = num(v);
    if (n == null) return undefined;
    return Math.max(0, Math.min(10, n));
}
export function toAction(a: any): Action | undefined {
    if (!a) return undefined;
    const s = String(a).toLowerCase();
    if (s.includes("allow")) return Action.ALLOW;
    if (s.includes("deny") || s.includes("block")) return Action.DENY;
    if (s.includes("create")) return Action.CREATE;
    if (s.includes("delete")) return Action.DELETE;
    if (s.includes("login") || s.includes("logon")) return Action.LOGIN;
    if (s.includes("logout")) return Action.LOGOUT;
    if (s.includes("alert") || s.includes("detect")) return Action.ALERT;
    return undefined;
}

export type AlertEmailJob = {
    to: string;
    alertId: string;
    tenant: string;
    ruleName: string;
    severity?: number | null;
    logId?: string | number;
    source?: string | null;
    eventType?: string | null;
};

export const enqueueAlertEmail = async (payload: AlertEmailJob) => {
    return await EmailQueue.add(
        "send-alert-email",
        payload,
        {
            jobId: `alert:${payload.alertId}:email`,
            attempts: 3,
            backoff: { type: "exponential", delay: 1000 },
            removeOnComplete: true,
            removeOnFail: 1000,
        }
    );
};

export const recentlyTriggered = async (tenant: string, ruleName: string, seconds: number) => {
    if (seconds <= 0) return false;
    const since = new Date(Date.now() - seconds * 1000);
    const count = await prisma.alert.count({
        where: { tenant, ruleName, triggeredAt: { gte: since } },
    });
    return count > 0;
};