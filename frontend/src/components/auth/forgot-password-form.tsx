import useError from "@/hooks/use-error";
import { cn } from "@/lib/utils";
import { RegisterSchema } from "@/lib/validators";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type SubmitHandler } from "react-hook-form";
import { Link, useActionData, useNavigation, useSubmit } from "react-router";
import z from "zod";
import Logo from "../shared/logo";
import Spinner from "../shared/spinner";
import { Button } from "../ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";

export default function ForgetPasswordForm({
    className,
    ...props
}: React.ComponentProps<"div">) {
    const submit = useSubmit()
    const navigation = useNavigation()
    const actionData = useActionData()

    const form = useForm<z.infer<typeof RegisterSchema>>({
        resolver: zodResolver(RegisterSchema),
        defaultValues: {
            email: ''
        }
    })

    const onSubmit: SubmitHandler<z.infer<typeof RegisterSchema>> = (data) => {
        submit(data, {
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
                    <h1 className="text-xl font-bold mt-5">Don't worry we get your back 😉</h1>
                    <div className="text-center text-sm">
                        Remember your password?{" "}
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
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <Button type="submit" className="w-full cursor-pointer  min-h-[48px]">
                                <Spinner label="Sending..." isLoading={isWorking}>
                                    Send OTP
                                </Spinner>
                            </Button>
                        </div>
                    </form>
                </Form>
            </div>
        </div >
    )
}
