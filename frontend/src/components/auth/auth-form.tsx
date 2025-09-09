/* eslint-disable @typescript-eslint/no-explicit-any */
import useError from '@/hooks/use-error';
import { LOGIN, LOGIN_SUBTITLE, LOGIN_TITLE, REGISTER, REGISTER_SUBTITLE, REGISTER_TITLE } from "@/lib/constants";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useForm, type ControllerRenderProps, type DefaultValues, type Path, type SubmitHandler } from "react-hook-form";
import { Link, useActionData, useNavigation, useSubmit } from "react-router";
import { z } from "zod";
import Spinner from '../shared/spinner';
import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";

interface AuthFormProps<T extends z.ZodType<any, any, any>> {
    formType: "LOGIN" | "REGISTER",
    schema: T,
    defaultValues: z.infer<T>,
}

export default function AuthForm<T extends z.ZodType<any, any, any>>({
    formType,
    schema,
    defaultValues,
    ...props
}: AuthFormProps<T>) {
    type FormData = z.infer<T>
    const [showPassword, setShowPassword] = useState<Record<string, boolean>>({});

    const submit = useSubmit()
    const navigation = useNavigation()
    const actionData = useActionData()

    const form = useForm({
        resolver: zodResolver(schema) as any,
        defaultValues: defaultValues as DefaultValues<FormData>,
    })

    const handleSubmit: SubmitHandler<FormData> = async (values) => {
        submit(values, {
            method: "POST",
            action: '/login'
        })
    }
    useError(actionData, actionData?.message)

    const isWorking = navigation.state === 'submitting'

    const buttonText = formType === 'LOGIN' ? LOGIN : REGISTER

    return (
        <div className="flex flex-col gap-6" {...props}>
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">{formType === 'LOGIN' ? LOGIN_TITLE : REGISTER_TITLE}</CardTitle>
                    <CardDescription>
                        {formType === 'LOGIN' ? LOGIN_SUBTITLE : REGISTER_SUBTITLE}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(handleSubmit)}>
                            <div className="flex flex-col gap-6">
                                {
                                    Object.keys(defaultValues).map(field => (
                                        <FormField
                                            key={field}
                                            control={form.control}
                                            name={field as Path<FormData>}
                                            render={({ field }: { field: ControllerRenderProps<FormData, Path<FormData>> }) => (
                                                <FormItem className="grid gap-3">
                                                    <div className="flex items-center gap-1 justify-between">
                                                        <FormLabel>
                                                            {field.name === 'phone' ? 'Phone Number' :
                                                                field.name.charAt(0).toUpperCase() + field.name.slice(1)}
                                                            <span className="text-red-600"> *</span>
                                                        </FormLabel>
                                                        {formType === 'LOGIN' && field.name === 'password' && <Link
                                                            to="/forgot-password"
                                                            className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                                                        >
                                                            Forgot password?
                                                        </Link>}
                                                    </div>
                                                    <FormControl>
                                                        <div className="relative">
                                                            <Input
                                                                className={`min-h-[44px] ${field.name === 'password' || field.name === 'confirmPassword' ? 'font-en' : ''}`}
                                                                disabled={isWorking}
                                                                placeholder={field.name === 'email' ? 'Email Address' : 'Password'}
                                                                type={(field.name === 'password' || field.name === 'confirmPassword') && showPassword[field.name] ? 'text' : (field.name === 'password' || field.name === 'confirmPassword') ? 'password' : 'text'}
                                                                {...field}
                                                            />
                                                            {(field.name === 'password' || field.name === 'confirmPassword') && (
                                                                <button
                                                                    type="button"
                                                                    onClick={() =>
                                                                        setShowPassword(prev => ({
                                                                            ...prev,
                                                                            [field.name]: !prev[field.name]
                                                                        }))
                                                                    }
                                                                    className="absolute cursor-pointer right-3 top-4 text-muted-foreground"
                                                                >
                                                                    {showPassword[field.name] ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                                                                </button>
                                                            )}
                                                        </div>
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    ))
                                }
                                <div className="flex flex-col gap-3">
                                    <Button
                                        type="submit"
                                        className="w-full min-h-[48px] flex items-center gap-2 justify-center cursor-pointer"
                                        disabled={isWorking}
                                    >
                                        <Spinner
                                            isLoading={isWorking}
                                            label={buttonText === 'Login' ? 'Logging In...' : 'Signing Up...'}>
                                            {buttonText}
                                        </Spinner>
                                    </Button>
                                </div>
                            </div>
                            {
                                formType === 'LOGIN' ?
                                    <div className="mt-4 text-center text-sm">
                                        Don&apos;t have an account?{" "}
                                        <Link to='/register' className="underline-offset-4 hover:underline font-bold">
                                            Register
                                        </Link>
                                    </div> :
                                    <div className="mt-4 text-center text-sm">
                                        Alreay have an account?{" "}
                                        <Link to="/login" className="underline-offset-4 hover:underline font-bold">
                                            Login
                                        </Link>
                                    </div>
                            }
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    )
}
