import { LogSource, Prisma, Action } from "../generated/prisma";
import { toAction, to0to10, num } from "./helpers";

export function normalizeData(tenant: string, source: LogSource, payload: any): Prisma.LogCreateInput {
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
        raw: payload,
        tags: [String(source).toLowerCase()],
    };

    switch (source) {
        case LogSource.API: {
            out.ts = payload.ts ? new Date(payload.ts) : now;
            out.user = payload.user;
            out.eventType = payload.event ?? "application";
            out.eventSubtype = payload.action;
            out.action = toAction(payload.action);
            out.severity = to0to10(payload.severity);
            out.http_method = payload.http?.method;
            out.url = payload.http?.path ?? payload.url;
            out.status_code = num(payload.http?.status_code ?? payload.status_code);
            out.src_ip = payload.network?.src_ip;
            out.dst_ip = payload.network?.dst_ip;
            break;
        }

        case LogSource.FIREWALL:
        case LogSource.NETWORK: {
            if (typeof payload === "string") {
                out.eventType = "system";
                out.eventSubtype = "syslog";
                out.reason = payload;
            } else {
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
            out.ts = payload.eventTime ? new Date(payload.eventTime) : now;
            out.eventType = "audit";
            out.eventSubtype = payload.eventName;
            out.user = payload.userIdentity?.userName ?? payload.userIdentity?.arn;
            out.src_ip = payload.sourceIPAddress;
            out.cloud_account_id = payload.recipientAccountId;
            out.cloud_region = payload.awsRegion;
            out.cloud_service = payload.eventSource;
            break;
        }

        case LogSource.M365: {
            out.ts = payload.CreationTime ? new Date(payload.CreationTime) : now;
            out.eventType = "audit";
            out.eventSubtype = payload.Operation;
            out.user = payload.UserId ?? payload.UserPrincipalName;
            out.host = payload.Workload
            break;
        }

        case LogSource.AD: {
            out.ts = payload.TimeCreated ? new Date(payload.TimeCreated) : now;
            out.eventType = "authentication";
            out.eventSubtype = "logon";
            out.user = payload.TargetUserName ?? payload.user;
            out.host = payload.ComputerName ?? payload.host;
            out.src_ip = payload.IpAddress ?? payload.ip;
            out.action = (String(payload.EventID ?? payload.event_id) === "4624") ? Action.LOGIN : Action.ALERT;
            break;
        }

        case LogSource.CROWDSTRIKE: {
            out.ts = payload['@timestamp'] ? new Date(payload['@timestamp']) : (payload.timestamp ? new Date(payload.timestamp) : now);
            out.eventType = payload.event_type ?? "alert";
            out.eventSubtype = payload.event_action ?? payload.behavior;
            out.action = toAction(payload.event_action ?? payload.behavior) ?? Action.ALERT;
            out.severity = to0to10(payload.severity);
            out.user = payload.user;
            out.host = payload.hostname ?? payload.device_name;
            out.src_ip = payload.local_ip;
            break;
        }
    }

    return out;
}