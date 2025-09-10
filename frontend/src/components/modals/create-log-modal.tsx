/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@/components/ui/button"
import {
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect, useMemo, useState } from "react"
import { useForm } from "react-hook-form"
import { TbLogs } from "react-icons/tb"
import { z } from "zod"
import Spinner from "../shared/spinner"
import { ACTIONS, defaults, schemas } from "@/lib/constants"

type TemplateKey = keyof typeof schemas

export default function CreateLogModal() {
    const [template, setTemplate] = useState<TemplateKey>("http")

    const currentSchema = useMemo(() => schemas[template], [template])
    const currentDefaults = useMemo(() => defaults[template], [template])

    const form = useForm<z.infer<typeof currentSchema>>({
        resolver: zodResolver(currentSchema),
        defaultValues: currentDefaults as any,
        mode: "onBlur",
    })

    useEffect(() => {
        // In case you prefer not to remount, you could do `form.reset(currentDefaults as any)`
        // But we remount via the `key` on <Form> below, which is more reliable for resolver updates.
    }, [template])

    const onSubmit = (values: z.infer<typeof currentSchema>) => {
        console.log("submit:", values)
    }

    const isWorking = form.formState.isSubmitting

    const renderField = (name: string) => {
        if (name === "source") {
            return (
                <FormField
                    key={name}
                    control={form.control}
                    name={name as any}
                    render={() => (
                        <FormItem className="grid gap-2">
                            <FormLabel>Source <span className="text-red-600">*</span></FormLabel>
                            <FormControl>
                                <Input
                                    className="min-h-[44px] font-en"
                                    value={template.toUpperCase()}
                                    disabled
                                    readOnly
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            )
        }

        if (name === "action") {
            return (
                <FormField
                    key={name}
                    control={form.control}
                    name={name as any}
                    render={({ field }) => (
                        <FormItem className="grid gap-2">
                            <FormLabel>Action <span className="text-red-600">*</span></FormLabel>
                            <FormControl>
                                <Select
                                    disabled={isWorking}
                                    value={field.value as string}
                                    onValueChange={(v) => field.onChange(v)}
                                >
                                    <SelectTrigger className="min-h-[44px] w-full">
                                        <SelectValue placeholder="Select action" />
                                    </SelectTrigger>
                                    <SelectContent
                                        className="min-w-[var(--radix-select-trigger-width)]"
                                    >
                                        {ACTIONS.map((a) => (
                                            <SelectItem key={a} value={a}>
                                                {a}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            )
        }

        if (name === "severity") {
            return (
                <FormField
                    key={name}
                    control={form.control}
                    name={name as any}
                    render={({ field }) => (
                        <FormItem className="grid gap-2">
                            <FormLabel>Severity (0–10) <span className="text-red-600">*</span></FormLabel>
                            <FormControl>
                                <Input
                                    type="number"
                                    min={0}
                                    max={10}
                                    step={1}
                                    disabled={isWorking}
                                    className="min-h-[44px] font-en"
                                    value={field.value as number | string | undefined}
                                    onChange={(e) => field.onChange(e.target.value === "" ? "" : Number(e.target.value))}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            )
        }

        return (
            <FormField
                key={name}
                control={form.control}
                name={name as any}
                render={({ field }) => (
                    <FormItem className="grid gap-2">
                        <FormLabel>
                            {name.replace(/_/g, " ").replace(/\b\w/g, (m) => m.toUpperCase())} <span className="text-red-600">*</span>
                        </FormLabel>
                        <FormControl>
                            <Input
                                disabled={isWorking}
                                className="min-h-[44px]"
                                value={typeof field.value === "string" || typeof field.value === "number" ? (field.value as any) : JSON.stringify(field.value ?? "")}
                                onChange={(e) => field.onChange(e.target.value)}
                                placeholder={`Enter ${name}`}
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
        )
    }

    return (
        <DialogContent className="w-full mx-auto max-h-[90vh] overflow-y-auto sm:max-w-[800px] no-scrollbar">
            <DialogHeader>
                <DialogTitle className="text-xl font-bold flex items-center gap-2">
                    <TbLogs />
                    Create a new Log
                </DialogTitle>
                <DialogDescription>Choose a template and edit fields before submitting.</DialogDescription>
            </DialogHeader>

            <div className="grid sm:grid-cols-2 gap-3 mb-4">
                <div>
                    <label className="text-sm font-medium">Source Template</label>
                    <Select
                        value={template}
                        onValueChange={(v: TemplateKey) => setTemplate(v)}
                    >
                        <SelectTrigger className="min-h-[44px] mt-1">
                            <SelectValue placeholder="Pick template" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="http">API / HTTP</SelectItem>
                            <SelectItem value="crowdstrike">CrowdStrike</SelectItem>
                            <SelectItem value="aws">AWS</SelectItem>
                            <SelectItem value="m365">Microsoft 365</SelectItem>
                            <SelectItem value="ad">Active Directory</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <Form {...form} key={template}>
                <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
                    <div className="grid md:grid-cols-2 gap-4">
                        {Object.entries(currentDefaults).map(([fieldName]) =>
                            renderField(fieldName)
                        )}
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-2">
                        <Button type="submit" className="bg-gradient-to-r from-purple-400 via-pink-500 to-blue-500 font-semibold hover:from-pink-500 hover:via-purple-500 hover:to-blue-400 transition-colors duration-300 w-fit text-white flex items-center gap-2 cursor-pointer" disabled={isWorking}>
                            <Spinner
                                isLoading={isWorking}
                                label={'Submitting'}>
                                Submit
                            </Spinner>
                        </Button>
                    </div>
                </form>
            </Form>
        </DialogContent>
    )
}