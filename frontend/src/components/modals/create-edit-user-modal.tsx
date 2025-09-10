/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, type ControllerRenderProps, type DefaultValues, type Path, type SubmitHandler, } from "react-hook-form"
import type z from "zod"
import Spinner from "../shared/spinner"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { FaUserPen, FaUserPlus } from "react-icons/fa6";

interface CreateEditUserModalProps<T extends z.ZodType<any, any, any>> {
    formType: "CREATE" | "EDIT",
    schema: T,
    defaultValues: z.infer<T>,
}

export default function CreateEditUserModal<T extends z.ZodType<any, any, any>>({
    formType,
    schema,
    defaultValues,
    ...props
}: CreateEditUserModalProps<T>) {
    type FormData = z.infer<T>

    const form = useForm({
        resolver: zodResolver(schema) as any,
        defaultValues: defaultValues as DefaultValues<FormData>,
    })

    const handleSubmit: SubmitHandler<FormData> = async (values) => {
        console.log(values)
    }

    const buttonText = formType === 'CREATE' ? 'Create' : 'Edit'

    const isWorking = form.formState.isSubmitting


    return (
        <DialogContent className="w-full mx-auto max-h-[90vh] overflow-y-auto sm:max-w-[800px] no-scrollbar" {...props}>
            <DialogHeader>
                <DialogTitle className="text-xl font-bold flex items-center gap-2">
                    {formType === 'CREATE' ? <FaUserPlus /> : <FaUserPen />}
                    {formType === 'CREATE' ? 'Create a new User' : "Edit User"}
                </DialogTitle>
                <DialogDescription>Choose a template and edit fields before submitting.</DialogDescription>
            </DialogHeader>

            <Form {...form}>
                <form className="space-y-6" onSubmit={form.handleSubmit(handleSubmit)}>
                    <div className="grid md:grid-cols-2 gap-4">
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
                                                    {field.name.charAt(0).toUpperCase() + field.name.slice(1)}
                                                    <span className="text-red-600"> *</span>
                                                </FormLabel>
                                            </div>
                                            <FormControl>
                                                {field.name === "role" ? (
                                                    <Select
                                                        onValueChange={field.onChange}
                                                        defaultValue={field.value}
                                                    >
                                                        <SelectTrigger className="min-h-[44px] w-full">
                                                            <SelectValue placeholder="Select role" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="Admin">Admin</SelectItem>
                                                            <SelectItem value="User">User</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                ) : (
                                                    <Input
                                                        className={`min-h-[44px] ${field.name === 'password' ? 'font-en' : ''}`}
                                                        placeholder={`Enter ${field.name}`}
                                                        disabled={isWorking}
                                                        type={field.name === 'password' ? 'password' : 'text'}
                                                        {...field}
                                                    />
                                                )}
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            ))
                        }
                    </div>
                    <div className="flex justify-end">
                        <Button
                            type="submit"
                            className="bg-gradient-to-r from-purple-400 via-pink-500 to-blue-500 font-semibold hover:from-pink-500 hover:via-purple-500 hover:to-blue-400 transition-colors duration-300 w-fit text-white flex items-center gap-2 cursor-pointer"
                            disabled={isWorking}
                        >
                            <Spinner
                                isLoading={isWorking}
                                label={buttonText === 'Create' ? 'Creating...' : 'Editing...'}>
                                {buttonText}
                            </Spinner>
                        </Button>
                    </div>
                </form>
            </Form>
        </DialogContent>
    )
}
