import { z } from 'zod'

export const LogInSchema = z.object({
    email: z.string().email({ message: 'Invalid email format' }),
    password: z.string()
        .min(1, { message: "Password is required" })
        .min(8, { message: "Password must be at least 8 digit" })
        .regex(/^\d+$/, "Password must be numbers")
})

export const RegisterSchema = z.object({
    email: z.string().email({ message: 'Invalid email format' }),
})

export const OTPSchema = z.object({
    otp: z.string().min(6, {
        message: "Your OTP must be 6 characters.",
    }),
})

export const ConfirmPasswordSchema = z.object({
    firstName: z.string().min(1, { message: "First name is required" }),
    lastName: z.string().min(1, { message: "Last name is required" }),
    password: z.string()
        .min(1, { message: "Password is required" })
        .min(8, { message: "Password must be at least 8 characters" })
        .regex(/^\d+$/, "Password must be numbers"),
    confirmPassword: z.string()
        .min(1, { message: "Confirm password is required" })
        .min(8, { message: "Confirm password must be at least 8 characters" })
        .regex(/^\d+$/, "Password must be numbers"),
    tenant: z.string().min(1, { message: "Tenant is required" })
}).refine(data => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"]
})

export const ResetPasswordSchema = ConfirmPasswordSchema.omit({ firstName: true, lastName: true, tenant: true })

const LOG_SOURCES = [
    "FIREWALL",
    "API",
    "CROWDSTRIKE",
    "AWS",
    "M365",
    "AD",
    "NETWORK",
] as const

const ACTIONS = [
    "ALLOW",
    "DENY",
    "CREATE",
    "DELETE",
    "LOGIN",
    "LOGOUT",
    "ALERT",
] as const

export const BASE_SCHEMA = z.object({
    tenant: z.string().min(1, { message: "Tenant is required" }),
    source: z.enum(LOG_SOURCES, { message: "Source is required" }),
    action: z.enum(ACTIONS, { message: "Action is required" }),
    severity: z.number().int().min(0, { message: "Severity is required" }).max(10, { message: "Severity must be between 0 and 10" }),
    ip: z.string().min(1, { message: "IP is required" }),
})

export const FirewallSchema = BASE_SCHEMA.extend({
    source: z.literal("FIREWALL"),
    host: z.string().optional(),
    vendor: z.string().min(1, { message: "Vendor is required" }),
    product: z.string().min(1, { message: "Product is required" }),
    src: z.string().min(1, { message: "Source IP is required" }),
    dst: z.string().min(1, { message: "Destination IP is required" }),
    spt: z.number().int().min(0, { message: "Source port is required" }),
    dpt: z.number().int().min(0, { message: "Destination port is required" }),
    proto: z.string().min(1, { message: "Protocol is required" }),
    msg: z.string().min(1, { message: "Message is required" }),
    policy: z.string().min(1, { message: "Policy is required" }),
    eventType: z.string().optional(),
});

export const NetworkSchema = BASE_SCHEMA.extend({
    source: z.literal("NETWORK"),
    host: z.string().optional(),
    if: z.string().min(1, { message: "Interface is required" }),
    event: z.string().min(1, { message: "Event is required" }),
    mac: z.string().min(1, { message: "MAC is required" }),
    reason: z.string().min(1, { message: "Reason is required" }),
});

export const HTTPSchema = BASE_SCHEMA.extend({
    source: z.literal("API"),
    eventType: z.string().min(1, { message: "Event type is required" }),
    user: z.string().min(1, { message: "User is required" }),
    reason: z.string().min(1, { message: "Reason is required" }),
})

export const CrowdStrikeSchema = BASE_SCHEMA.extend({
    source: z.literal("CROWDSTRIKE"),
    eventType: z.string().min(1, { message: "Event type is required" }),
    host: z.string().min(1, { message: "Host is required" }),
    process: z.string().min(1, { message: "Process is required" }),
    sha256: z.string().min(1, { message: "SHA256 is required" }),
})

export const AwsSchema = BASE_SCHEMA.extend({
    source: z.literal("AWS"),
    eventType: z.string().min(1, { message: "Event type is required" }),
    user: z.string().optional(),
    cloud: z.object({
        service: z.string().min(1, { message: "Service is required" }),
        account_id: z.string().min(1, { message: "Account ID is required" }),
        region: z.string().min(1, { message: "Region is required" }),
    }),
})

export const M365Schema = BASE_SCHEMA.extend({
    source: z.literal("M365"),
    eventType: z.string().min(1, { message: "Event type is required" }),
    user: z.string().min(1, { message: "User is required" }),
    status: z.string().min(1, { message: "Status is required" }),
    workload: z.string().min(1, { message: "Workload is required" }),
})

export const AdSchema = BASE_SCHEMA.extend({
    source: z.literal("AD"),
    eventId: z.string().min(1, { message: "Event ID is required" }),
    eventType: z.string().min(1, { message: "Event type is required" }),
    user: z.string().min(1, { message: "User is required" }),
    host: z.string().min(1, { message: "Host is required" }),
    logonType: z.string().min(1, { message: "Event ID is required" }),
})

export const CreateUserSchema = z.object({
    firstName: z.string().min(1, { message: "First name is required" }),
    lastName: z.string().min(1, { message: "Last name is required" }),
    email: z.string().email({ message: 'Invalid email format' }),
    password: z.string()
        .min(1, { message: "Password is required" })
        .min(8, { message: "Password must be at least 8 digit" })
        .regex(/^\d+$/, "Password must be numbers"),
    role: z.enum(["ADMIN", "USER"], { message: "Role must be 'ADMIN' or 'USER'" }),
    tenant: z.string().min(1, { message: "Tenant is required" }),
})

export const EditUserSchema = CreateUserSchema.omit({ email: true, password: true }).extend({
    status: z.enum(["ACTIVE", "INACTIVE", "FREEZE"], { message: "Status must be 'ACTIVE' or 'INACTIVE'" }),
})

export const CreateEditAlertRuleSchema = z.object({
    tenant: z.string().min(1, { message: "Tenant is required" }),
    name: z.string().min(1, { message: "Name is required" }),
    condition: z.string().min(1, { message: "Condition is required" }),
    threshold: z.coerce.number().int().nonnegative(),
    windowSeconds: z
        .preprocess((v) => (v === "" || v == null ? undefined : v), z.coerce.number().int().nonnegative().optional()),
});