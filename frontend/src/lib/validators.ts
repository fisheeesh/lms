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