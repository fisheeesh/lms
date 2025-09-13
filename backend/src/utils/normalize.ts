import { LogSource, Prisma, Action } from "../generated/prisma";
import { toAction, to0to10, num } from "./helpers";

function parseSyslogKV(line: string) {
    const out: Record<string, any> = { original: line };

    const priMatch = line.match(/^<(\d+)>/);
    if (priMatch) out.pri = Number(priMatch[1]);

    const tsHostMatch = line.replace(/^<\d+>/, "").trim().split(/\s+/);
    if (tsHostMatch.length >= 4) {
        const month = tsHostMatch[0];
        const day = tsHostMatch[1];
        const time = tsHostMatch[2];
        const host = tsHostMatch[3];
        out.timestamp_str = `${month} ${day} ${time}`;
        out.host = host;
    }

    const kv: Record<string, string> = {};
    for (const m of line.matchAll(/(\w+)=([^\s]+)/g)) {
        kv[m[1]] = m[2];
    }
    out.kv = kv;

    return { raw: out, kv };
}

export function normalizeData(
    tenant: string,
    source: LogSource,
    payload: any
): Prisma.LogCreateInput {
    const now = new Date();

    const out: Prisma.LogCreateInput = {
        tenant,
        source,
        ts: now,
        eventType: undefined,
        eventSubtype: undefined,
        severity: undefined,
        action: undefined,
        user: undefined,
        host: undefined,
        process: undefined,
        src_ip: undefined,
        src_port: undefined,
        dst_ip: undefined,
        dst_port: undefined,
        protocol: undefined,
        url: undefined,
        http_method: undefined,
        status_code: undefined,
        rule_name: undefined,
        rule_id: undefined,
        ip: undefined,
        reason: undefined,
        cloud_account_id: undefined,
        cloud_region: undefined,
        cloud_service: undefined,
        raw: (typeof payload === "object" ? payload : { value: String(payload) }) as Prisma.InputJsonValue,
        tags: [String(source).toLowerCase()],
    };

    switch (source) {
        case LogSource.API: {
            out.ts = payload?.ts ? new Date(payload.ts) : now;
            out.action = toAction(payload?.action);
            out.severity = to0to10(payload?.severity);
            out.eventType = payload?.eventType ?? "application";
            out.user = payload?.user;
            out.ip = payload?.ip ?? payload?.src_ip;
            out.reason = payload?.reason;
            break;
        }

        case LogSource.FIREWALL:
        case LogSource.NETWORK: {
            if (typeof payload === "string") {
                //* Parse syslog line -> object
                const { raw, kv } = parseSyslogKV(payload);
                out.raw = raw as Prisma.InputJsonValue;
                out.eventType = "system";
                out.eventSubtype = "syslog";

                //* Map common kvs
                out.src_ip = kv.src ?? kv.src_ip;
                out.dst_ip = kv.dst ?? kv.dst_ip;
                out.src_port = kv.spt ?? kv.src_port;
                out.dst_port = kv.dpt ?? kv.dst_port;
                out.protocol = kv.proto ?? kv.protocol;
                out.action = toAction(kv.action) ?? Action.ALERT;
                out.rule_name = kv.policy ?? kv.rule ?? out.rule_name;
                out.reason = kv.msg ?? "syslog";
            } else {
                //* Structured firewall JSON
                out.ts = payload.ts ? new Date(payload.ts) : now;
                out.src_ip = payload.src_ip;
                out.src_port = num(payload.src_port)?.toString();
                out.dst_ip = payload.dst_ip;
                out.dst_port = num(payload.dst_port)?.toString();
                out.protocol = payload.protocol;
                out.action = toAction(payload.action);
                out.severity = to0to10(payload.severity);
                out.rule_name = payload.rule_name;
                out.rule_id = payload.rule_id;
                out.reason = payload.reason;
            }
            break;
        }

        case LogSource.AWS: {
            out.ts = payload?.eventTime ? new Date(payload.eventTime) : now;
            out.action = toAction(payload?.action);
            out.severity = to0to10(payload?.severity);
            out.eventType = payload?.eventType ?? "audit";
            out.user = payload?.user;
            out.ip = payload?.ip ?? payload?.src_ip;
            out.status_code = payload?.status;
            out.process = payload?.workload;

            if (payload?.cloud) {
                out.cloud_service = payload.cloud.service;
                out.cloud_account_id = payload.cloud.account_id;
                out.cloud_region = payload.cloud.region;
            }
            break;
        }

        case LogSource.M365: {
            out.ts = payload?.CreationTime ? new Date(payload.CreationTime) : now;
            out.action = toAction(payload?.action);
            out.severity = to0to10(payload?.severity);
            out.eventType = payload?.eventType ?? "audit";
            out.user = payload?.user;
            out.ip = payload?.ip ?? payload?.src_ip;
            out.status_code = payload?.status;
            out.process = payload?.workload;
            break;
        }

        case LogSource.AD: {
            out.ts = payload?.TimeCreated ? new Date(payload.TimeCreated) : now;
            out.action =
                String(payload?.EventID ?? payload?.eventId) === "4624"
                    ? Action.LOGIN
                    : Action.ALERT;
            out.severity = to0to10(payload?.severity);
            out.eventType = payload?.eventType ?? "authentication";
            out.user = payload?.user;
            out.host = payload?.host;
            out.ip = payload?.ip ?? payload?.src_ip;
            break;
        }

        case LogSource.CROWDSTRIKE: {
            const ts = payload?.["@timestamp"] ?? payload?.timestamp;
            out.ts = ts ? new Date(ts) : now;
            out.eventType = payload?.eventType ?? "alert";
            out.host = payload?.host;
            out.process = payload?.process;
            out.action = toAction(payload?.event_action ?? payload?.behavior) ?? Action.ALERT;
            out.severity = to0to10(payload?.severity);
            out.ip = payload?.ip ?? payload?.src_ip;
            break;
        }
    }

    return out;
}