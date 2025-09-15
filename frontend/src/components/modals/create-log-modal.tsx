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
import useCreateLog from "@/hooks/use-create-log"
import { AdSchema, AwsSchema, CrowdStrikeSchema, FirewallSchema, HTTPSchema, M365Schema, NetworkSchema } from "@/lib/validators"
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect, useMemo, useState } from "react"
import { useForm } from "react-hook-form"
import { TbLogs } from "react-icons/tb"
import { z } from "zod"
import Spinner from "../shared/spinner"

const ACTIONS = [
    "ALLOW",
    "DENY",
    "CREATE",
    "DELETE",
    "LOGIN",
    "LOGOUT",
    "ALERT",
] as const

const schemas = {
    http: HTTPSchema,
    aws: AwsSchema,
    crowdstrike: CrowdStrikeSchema,
    m365: M365Schema,
    ad: AdSchema,
    firewall: FirewallSchema,
    network: NetworkSchema,
} as const

const defaults = {
    http: {
        tenant: "tenantA",
        source: "API",
        action: "ALERT",
        severity: 5,
        eventType: "LoginAttempt",
        user: "Swam Yi Phyo",
        ip: "127.0.0.1",
        reason: "Testing default API log",
    },
    crowdstrike: {
        tenant: "tenantA",
        source: "CROWDSTRIKE",
        action: "ALERT",
        severity: 8,
        ip: "127.0.0.1",
        eventType: "malware_detected",
        host: "WIN10-01",
        process: "powershell.exe",
        sha256: "abc123def456",
    },
    aws: {
        tenant: "tenantA",
        source: "AWS",
        action: "ALERT",
        severity: 4,
        ip: "127.0.0.1",
        eventType: "CreateUser",
        user: "Fisheeesh",
        cloud: {
            service: "iam",
            account_id: "123456789012",
            region: "ap-southeast-1",
        },
    },
    m365: {
        tenant: "tenantA",
        source: "M365",
        action: "ALERT",
        severity: 3,
        eventType: "UserLoggedIn",
        user: "syp@swe",
        ip: "198.51.100.23",
        status: "Success",
        workload: "Exchange",
    },
    ad: {
        tenant: "tenantA",
        source: "AD",
        action: "ALERT",
        severity: 6,
        eventId: "4625",
        eventType: "LogonFailed",
        user: "Chotta Bheem",
        host: "DC01",
        ip: "203.0.113.77",
        logonType: "3",
    },
    firewall: {
        tenant: "tenantA",
        source: "FIREWALL",
        action: "DENY",
        severity: 5,
        host: "fw01",
        vendor: "demo",
        product: "ngfw",
        ip: "10.0.1.10",
        src: "10.0.1.10",
        dst: "8.8.8.8",
        spt: 5353,
        dpt: 53,
        proto: "udp",
        msg: "DNS blocked",
        policy: "Block-DNS",
        eventType: "dns_block",
    },
    network: {
        tenant: "tenantA",
        source: "NETWORK",
        action: "ALERT",
        severity: 3,
        host: "r1",
        ip: "127.0.0.1",
        if: "ge-0/0/1",
        event: "link-down",
        mac: "aa:bb:cc:dd:ee:ff",
        reason: "carrier-loss",
    },
} as const

type TemplateKey = keyof typeof schemas

type IngestPayload =
    | z.infer<typeof HTTPSchema>
    | z.infer<typeof AwsSchema>
    | z.infer<typeof CrowdStrikeSchema>
    | z.infer<typeof M365Schema>
    | z.infer<typeof AdSchema>;

interface CreateLogModalProps {
    onClose?: () => void;
}

export default function CreateLogModal({ onClose }: CreateLogModalProps) {
    const [template, setTemplate] = useState<TemplateKey>("http")
    const { createLog, isPending } = useCreateLog()

    const currentSchema = useMemo(() => schemas[template], [template])
    const currentDefaults = useMemo(() => defaults[template], [template])

    const form = useForm<z.infer<typeof currentSchema>>({
        resolver: zodResolver(currentSchema),
        defaultValues: currentDefaults as any,
        mode: "onBlur",
    })

    useEffect(() => {
        form.reset(currentDefaults as any);
    }, [template, currentDefaults, form]);

    const onSubmit = (values: z.infer<typeof currentSchema>) => {
        createLog(values as IngestPayload, {
            onSettled: () => {
                form.reset(currentDefaults as any);
                onClose?.();
            },
        });
    };

    const isWorking = form.formState.isSubmitting || isPending

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

        if (name === "cloud") {
            return (
                <>
                    <FormField
                        key="cloud.service"
                        control={form.control}
                        name={"cloud.service" as any}
                        render={({ field }) => (
                            <FormItem className="grid gap-2">
                                <FormLabel>Cloud Service</FormLabel>
                                <FormControl><Input className="min-h-[44px]" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        key="cloud.account_id"
                        control={form.control}
                        name={"cloud.account_id" as any}
                        render={({ field }) => (
                            <FormItem className="grid gap-2">
                                <FormLabel>Cloud Account ID</FormLabel>
                                <FormControl><Input className="min-h-[44px] font-en" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        key="cloud.region"
                        control={form.control}
                        name={"cloud.region" as any}
                        render={({ field }) => (
                            <FormItem className="grid gap-2">
                                <FormLabel>Cloud Region</FormLabel>
                                <FormControl><Input className="min-h-[44px]" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </>
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
                render={({ field }) => {
                    const isNumber = typeof field.value === "number";
                    return (
                        <FormItem className="grid gap-2">
                            <FormLabel>
                                {name.replace(/_/g, " ").replace(/\b\w/g, (m) => m.toUpperCase())} <span className="text-red-600">*</span>
                            </FormLabel>
                            <FormControl>
                                <Input
                                    type={isNumber ? "number" : "text"}
                                    className="min-h-[44px]"
                                    value={
                                        isNumber
                                            ? (field.value as number)
                                            : typeof field.value === "string"
                                                ? (field.value as string)
                                                : JSON.stringify(field.value ?? "")
                                    }
                                    onChange={(e) =>
                                        field.onChange(
                                            isNumber
                                                ? e.target.value === "" ? "" : Number(e.target.value)
                                                : e.target.value
                                        )
                                    }
                                    placeholder={`Enter ${name}`}
                                    disabled={isWorking}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    );
                }}
            />
        );
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
                            <SelectItem value="firewall">Firewall</SelectItem>
                            <SelectItem value="network">Network</SelectItem>
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