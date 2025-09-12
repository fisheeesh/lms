import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import useError from '@/hooks/use-error'
import { cn } from "@/lib/utils"
import { RegisterSchema } from "@/lib/validators"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Link, useActionData, useNavigation, useSubmit } from "react-router"
import type { z } from "zod"
import Spinner from "../shared/spinner"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import Logo from "../shared/logo"

export function RegisterForm({
    className,
    ...props
}: React.ComponentProps<"div">) {
    const submit = useSubmit()
    const actionData = useActionData()
    const navigation = useNavigation()

    const form = useForm<z.infer<typeof RegisterSchema>>({
        resolver: zodResolver(RegisterSchema),
        defaultValues: {
            email: ''
        }
    })

    function onSubmit(values: z.infer<typeof RegisterSchema>) {
        submit(values, {
            method: "post",
            action: "."
        })
    }

    const isWorking = navigation.state === 'submitting'

    useError(actionData, actionData?.message)

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <div className="flex flex-col gap-6">
                <div className="flex flex-col items-center gap-2">
                    <Logo />
                    <h1 className="text-xl font-bold mt-5">
                        Your logging journey starts here 🚀
                    </h1>
                    <div className="text-center text-sm">
                        Already have an account?{" "}
                        <Link to="/login" className="underline underline-offset-4">
                            Login
                        </Link>
                    </div>
                </div>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" autoComplete="off">
                        <div className="flex flex-col gap-6">
                            <div className="grid gap-3">
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem className="space-y-1">
                                            <FormLabel>Email Address <span className="text-red-600">*</span></FormLabel>
                                            <FormControl>
                                                <Input
                                                    className="min-h-[44px]"
                                                    id="email"
                                                    type="email"
                                                    placeholder="Enter your Email Address"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormDescription className="text-xs">ONLY Goolge-register emails can get email alerts and OTP.</FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <Button type="submit" className="w-full  min-h-[48px] cursor-pointer">
                                <Spinner label="Registering..." isLoading={isWorking}>
                                    Register
                                </Spinner>
                            </Button>
                        </div>
                    </form>
                </Form>
            </div>
        </div >
    )
}
