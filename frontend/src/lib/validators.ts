import { z } from 'zod'
import { LOG_SOURCES, ACTIONS } from './constants'

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

export const ResetPasswordSchema = z.object({
    password: z.string()
        .min(1, { message: "Password is required" })
        .min(8, { message: "Password must be at least 8 characters" })
        .regex(/^\d+$/, "Password must be numbers"),
    confirmPassword: z.string()
        .min(1, { message: "Confirm password is required" })
        .min(8, { message: "Confirm password must be at least 8 characters" })
        .regex(/^\d+$/, "Password must be numbers")
}).refine(data => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"]
})

export const BASE_SCHEMA = z.object({
    tenant: z.string().min(1, { message: "Tenant is required" }),
    source: z.enum(LOG_SOURCES, { message: "Source is required" }),
    action: z.enum(ACTIONS, { message: "Action is required" }),
    severity: z.number().int().min(0, { message: "Severity is required" }).max(10, { message: "Severity must be between 0 and 10" }),
})

export const HTTPSchema = BASE_SCHEMA.extend({
    source: z.literal("API"),
    action: z.literal("ALERT"),
    eventType: z.string().min(1, { message: "Event type is required" }),
    user: z.string().min(1, { message: "User is required" }),
    ip: z.string().min(1, { message: "IP is required" }),
    reason: z.string().min(1, { message: "Reason is required" }),
})

export const CrowdStrikeSchema = BASE_SCHEMA.extend({
    source: z.literal("CROWDSTRIKE"),
    event_type: z.string().min(1, { message: "Event type is required" }),
    host: z.string().min(1, { message: "Host is required" }),
    process: z.string().optional(),
    action: z.literal("ALERT"),
    sha256: z.string().optional(),
})

export const AwsSchema = BASE_SCHEMA.extend({
    source: z.literal("AWS"),
    action: z.literal("ALERT"),
    event_type: z.string(),
    user: z.string().optional(),
    // cloud: z.object({
    //     service: z.string(),
    //     account_id: z.string(),
    //     region: z.string(),
    // }),
    // raw: z.object({
    //     eventName: z.string(),
    //     requestParameters: z.string(),
    //     userName: z.string()
    // }),
})

export const M365Schema = BASE_SCHEMA.extend({
    source: z.literal("M365"),
    action: z.literal("ALERT"),
    event_type: z.string().min(1, { message: "Event type is required" }),
    user: z.string().min(1, { message: "User is required" }),
    ip: z.string().min(1, { message: "IP is required" }),
    status: z.string().min(1, { message: "Status is required" }),
    workload: z.string().min(1, { message: "Workload is required" }),
})

export const AdSchema = BASE_SCHEMA.extend({
    source: z.literal("AD"),
    action: z.literal("ALERT"),
    event_id: z.number().min(1, { message: "Event ID is required" }),
    event_type: z.string().min(1, { message: "Event type is required" }),
    user: z.string().min(1, { message: "User is required" }),
    host: z.string().min(1, { message: "Host is required" }),
    ip: z.string().min(1, { message: "Host is required" }),
    logon_type: z.number().min(1, { message: "Event ID is required" }),
})