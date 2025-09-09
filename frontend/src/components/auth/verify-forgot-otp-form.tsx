import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import z from "zod"

import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage
} from "@/components/ui/form"
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSeparator,
    InputOTPSlot,
} from "@/components/ui/input-otp"
import useError from "@/hooks/use-error"
import { cn } from "@/lib/utils"
import { OTPSchema } from "@/lib/validators"
import { REGEXP_ONLY_DIGITS } from "input-otp"
import { useActionData, useNavigation, useSubmit } from "react-router"
import Logo from "../shared/logo"
import Spinner from "../shared/spinner"

export function VerifyForgotOTPForm({
    className,
    ...props
}: React.ComponentProps<"div">) {
    const submit = useSubmit()
    const actionData = useActionData()
    const navigation = useNavigation()

    const form = useForm<z.infer<typeof OTPSchema>>({
        resolver: zodResolver(OTPSchema),
        defaultValues: {
            otp: "",
        },
    })

    function onSubmit(data: z.infer<typeof OTPSchema>) {
        submit(data, {
            method: "POST",
            action: '/forgot-password/verify-otp'
        })
    }

    const isWorking = navigation.state === 'submitting'

    useError(actionData, actionData?.message)

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <div className="flex flex-col gap-6">
                <div className="flex flex-col items-center gap-2">
                    <Logo />
                    <h1 className="text-muted-foreground text-center mt-5">Almost there. Please enter OTP sent to your email. ✨</h1>
                </div>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6 flex items-center justify-center flex-col mx-auto">
                        <FormField
                            control={form.control}
                            name="otp"
                            render={({ field }) => (
                                <FormItem className="flex flex-col items-center font-en">
                                    <FormControl>
                                        <InputOTP maxLength={6} {...field} pattern={REGEXP_ONLY_DIGITS}>
                                            <InputOTPGroup>
                                                <InputOTPSlot index={0} />
                                                <InputOTPSlot index={1} />
                                            </InputOTPGroup>
                                            <InputOTPSeparator />
                                            <InputOTPGroup>
                                                <InputOTPSlot index={2} />
                                                <InputOTPSlot index={3} />
                                            </InputOTPGroup>
                                            <InputOTPSeparator />
                                            <InputOTPGroup>
                                                <InputOTPSlot index={4} />
                                                <InputOTPSlot index={5} />
                                            </InputOTPGroup>
                                        </InputOTP>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" className="cursor-pointer w-full min-h-[48px]">
                            <Spinner label="Verifying..." isLoading={isWorking}>
                                Verifty
                            </Spinner>
                        </Button>
                    </form>
                </Form>
            </div>
        </div>
    )
}
