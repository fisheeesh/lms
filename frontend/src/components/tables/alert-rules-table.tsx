import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { TIMEFILTER } from "@/lib/constants";
import { formatId } from "@/lib/utils";
import { CreateEditAlertRuleSchema } from "@/lib/validators";
import useFilterStore from "@/store/filter-store";
import { useState } from "react";
import { GiFlyingFlag } from "react-icons/gi";
import ConfirmModal from "../modals/confirm-modal";
import CreateEditAlertRuleModal from "../modals/create-edit-alert-rule-modal";
import CommonFilter from "../shared/common-filter";
import LocalSearch from "../shared/common-search";
import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import Empty from "../shared/empty";

interface Props {
    data: AlretRule[]
}

export default function AlertRulesTable({ data }: Props) {
    const { filters } = useFilterStore()
    const [createOpen, setCreateOpen] = useState(false);
    const [editingAlertRule, setEditingAlertRule] = useState<AlretRule | null>(null);

    return (
        <Card className="rounded-md flex flex-col gap-5">
            <CardHeader className="space-y-2">
                <div className="flex flex-col xl:flex-row gap-3 xl:gap-0 justify-between">
                    <div className="flex flex-col items-start gap-2 tracking-wide">
                        <CardTitle className="text-xl md:text-2xl">All Alert Rules</CardTitle>
                        <CardDescription>List of all configured alert rules that define when an alert is triggered.</CardDescription>
                    </div>
                    <div className="flex flex-col xl:flex-row xl:items-center gap-2">
                        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
                            <DialogTrigger asChild>
                                <Button className="bg-gradient-to-r from-purple-400 via-pink-500 to-blue-500 font-semibold hover:from-pink-500 hover:via-purple-500 hover:to-blue-400 transition-colors duration-300 w-fit min-h-[44px] text-white flex items-center gap-2 cursor-pointer">
                                    <GiFlyingFlag className="size-5" /> Create a new rule
                                </Button>
                            </DialogTrigger>
                            {createOpen && <CreateEditAlertRuleModal
                                formType="CREATE"
                                schema={CreateEditAlertRuleSchema}
                                defaultValues={{
                                    tenant: "tenantA",
                                    name: "High Severity",
                                    condition: "SEVERITY_GTE",
                                    threshold: 7,
                                    windowSeconds: 0,
                                }}
                                onClose={() => setCreateOpen(false)}
                            />}
                        </Dialog>
                    </div>
                </div>
                <div className="flex flex-col xl:flex-row gap-2">
                    <LocalSearch filterValue="aKw" />
                    <CommonFilter
                        filterValue="aTenant"
                        filters={filters?.uTenants}
                        otherClasses="min-h-[44px] sm:min-w-[150px]"
                    />
                    <CommonFilter
                        filterValue="aTs"
                        filters={TIMEFILTER}
                        otherClasses="min-h-[44px] sm:min-w-[150px]"
                    />
                </div>
            </CardHeader>

            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="whitespace-nowrap">ID</TableHead>
                            <TableHead className="whitespace-nowrap">Tenant</TableHead>
                            <TableHead className="whitespace-nowrap">Rule Name</TableHead>
                            <TableHead className="whitespace-nowrap">Condition</TableHead>
                            <TableHead className="whitespace-nowrap">Threshold</TableHead>
                            <TableHead className="whitespace-nowrap">Window Seconds</TableHead>
                            <TableHead className="whitespace-nowrap">TimeStamp</TableHead>
                            <TableHead className="whitespace-nowrap">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    {data.length > 0 && <TableBody>
                        {data.map((rule) => (
                            <TableRow key={rule.id}>
                                <TableCell className="py-5">{formatId(rule.id)}</TableCell>
                                <TableCell className="py-5">{rule.tenant}</TableCell>
                                <TableCell className="py-5">{rule.name}</TableCell>
                                <TableCell className="py-5">{rule.condition}</TableCell>
                                <TableCell className="py-5">{rule.threshold}</TableCell>
                                <TableCell className="py-5">{rule.windowSeconds}</TableCell>
                                <TableCell className="py-5">{rule.createdAt}</TableCell>
                                <TableCell className="py-5 space-x-2">
                                    <Button
                                        variant="outline"
                                        className="cursor-pointer"
                                        onClick={() => setEditingAlertRule(rule)}
                                    >
                                        Edit
                                    </Button>

                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <Button className="cursor-pointer" variant="destructive">Delete</Button>
                                        </DialogTrigger>
                                        <ConfirmModal type="alert-rule" id={rule.id} />
                                    </Dialog>
                                </TableCell>
                            </TableRow>
                        ))}
                        <Dialog open={!!editingAlertRule} onOpenChange={(o) => !o && setEditingAlertRule(null)}>
                            {editingAlertRule && (
                                <CreateEditAlertRuleModal
                                    formType="EDIT"
                                    ruleId={editingAlertRule.id}
                                    schema={CreateEditAlertRuleSchema}
                                    key={editingAlertRule.id}
                                    defaultValues={{
                                        tenant: editingAlertRule.tenant,
                                        name: editingAlertRule.name,
                                        condition: editingAlertRule.condition,
                                        threshold: editingAlertRule.threshold,
                                        windowSeconds: editingAlertRule.windowSeconds
                                    }}
                                    onClose={() => setEditingAlertRule(null)}
                                />
                            )}
                        </Dialog>
                    </TableBody>}
                </Table>
                {data.length === 0 && <div className="my-4 flex flex-col items-center justify-center">
                    <Empty label="No records found" classesName="w-[300px] h-[200px] " />
                </div>}
            </CardContent>
        </Card>
    )
}
