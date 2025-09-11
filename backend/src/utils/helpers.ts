import { Action } from "../generated/prisma"

export const rentationDay = process.env.LOG_RETENTION_DAYS || 7

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