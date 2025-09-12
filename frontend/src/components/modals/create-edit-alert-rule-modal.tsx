/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import useCreateUser from "@/hooks/use-create-user"
import useEditUser from "@/hooks/use-edit-user"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, type ControllerRenderProps, type DefaultValues, type Path, type SubmitHandler, } from "react-hook-form"
import { GiFlyingFlag } from "react-icons/gi"
import { TbFilterEdit } from "react-icons/tb"
import type z from "zod"
import Spinner from "../shared/spinner"
import { Button } from "../ui/button"
import { Input } from "../ui/input"

interface CreateEditAlertRuleModalProps<T extends z.ZodType<any, any, any>> {
    formType: "CREATE" | "EDIT",
    ruleId?: string,
    schema: T,
    defaultValues: z.infer<T>,
    onClose?: () => void;
}

export default function CreateEditAlertRuleModal<T extends z.ZodType<any, any, any>>({
    formType,
    ruleId,
    schema,
    defaultValues,
    onClose,
    ...props
}: CreateEditAlertRuleModalProps<T>) {
    const { createUser, userCreating } = useCreateUser()
    const { editUser, userEditing } = useEditUser()
    type FormData = z.infer<T>

    const form = useForm({
        resolver: zodResolver(schema) as any,
        defaultValues: defaultValues as DefaultValues<FormData>,
    })

    const handleSubmit: SubmitHandler<FormData> = async (values) => {
        if (formType === 'CREATE') {
            createUser(values, {
                onSettled: () => {
                    form.reset();
                    onClose?.();
                }
            })
        } else {
            editUser({
                id: ruleId,
                ...values
            }, {
                onSettled: () => {
                    form.reset();
                    onClose?.();
                }
            })
        }
    }

    const buttonText = formType === 'CREATE' ? 'Create New Rule' : 'Save Changes'

    const isWorking = form.formState.isSubmitting || userCreating || userEditing

    return (
        <DialogContent className="w-full mx-auto max-h-[90vh] overflow-y-auto sm:max-w-[800px] no-scrollbar" {...props}>
            <DialogHeader>
                <DialogTitle className="text-xl font-bold flex items-center gap-2">
                    {formType === 'CREATE' ? <GiFlyingFlag /> : <TbFilterEdit />}
                    {formType === 'CREATE' ? 'Create a new Rule' : "Edit Rule"}
                </DialogTitle>
                <DialogDescription>
                    {formType === 'CREATE' ? 'Fill in the details to add a new rule.' : "Update the rule information and save changes."}
                </DialogDescription>
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
                                                    {field.name !== 'windowSeconds' && <span className="text-red-600"> *</span>}
                                                </FormLabel>
                                            </div>
                                            <FormControl>
                                                <Input
                                                    className={`min-h-[44px] ${field.name === 'password' ? 'font-en' : ''}`}
                                                    placeholder={`Enter ${field.name}`}
                                                    disabled={isWorking}
                                                    type={['threshold', 'windowSeconds'].includes(field.name) ? 'number' : 'text'}
                                                    {...field}
                                                />
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
                                label={buttonText === 'Create New Rule' ? 'Creating...' : 'Editing...'}>
                                {buttonText}
                            </Spinner>
                        </Button>
                    </div>
                </form>
            </Form>
        </DialogContent>
    )
}
