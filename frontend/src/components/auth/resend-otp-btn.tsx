import { useEffect, useState } from "react"
import { Button } from "../ui/button"
import { useMutation } from "@tanstack/react-query"
import { authApi } from "@/api"
import { toast } from "sonner"
import useAuthStore, { Status } from "@/store/auth-store"
import Spinner from "../shared/spinner"

export default function ResendOTPBtn({ type }: { type: 'register' | 'forgot' }) {
    const [timer, setTimer] = useState(120)
    const [resend, setResend] = useState(false)
    const authStore = useAuthStore.getState()
    const route = type === 'register' ? "/register" : "/forgot-password"

    const min = Math.floor(timer / 60)
    const sec = timer % 60

    useEffect(() => {
        const id = setInterval(() => {
            if (timer > 0 && !resend) {
                setTimer(prev => prev - 1)
            }

            if (timer === 0) {
                setResend(true)
            }
        }, 1000)

        return () => clearInterval(id)
    }, [resend, timer])

    const { mutate, isPending } = useMutation({
        mutationFn: async () => {
            const data = {
                email: authStore.email
            }
            const res = await authApi.post(route, data)

            if (res.status !== 200) {
                throw new Error("Something went wrong. Please try again.")
            }

            authStore.setAuth(res.data.email, res.data.token, Status.otp)
            return res.data
        },
        onSuccess: () => {
            toast.success("Success", {
                description: "OTP has been sent to your email"
            })
        },
        onError: (error) => {
            toast.error("Error", {
                description: error instanceof Error ? error.message : "Something went wrong. Please try again."
            })
        }
    })

    return (
        <>
            {
                resend ?
                    <Button
                        disabled={isPending}
                        onClick={() => {
                            mutate()
                            setResend(false)
                            setTimer(120)
                        }}
                        variant='outline'
                        className="cursor-pointer min-h-[30px]"
                    >
                        <Spinner label="Sending..." isLoading={isPending}>
                            Resend
                        </Spinner>
                    </Button>
                    : <h2 className="text-brand font-medium font-en">
                        Resend Code in <span className="dark:text-white text-black">{min < 10 && '0'}{min} : {sec < 10 && '0'}{sec}</span>
                    </h2>
            }
        </>
    )
}
