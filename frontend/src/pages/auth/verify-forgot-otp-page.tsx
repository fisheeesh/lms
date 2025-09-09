import { VerifyForgotOTPForm } from "@/components/auth/verify-forgot-otp-form"
import useTitle from "@/hooks/use-title"

export default function VerifyForgotOTP() {
    useTitle("Forget Password")
    return (
        <div className="bg-background flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
            <div className="w-full max-w-md">
                <VerifyForgotOTPForm />
            </div>
        </div>
    )
}
