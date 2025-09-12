import { Dialog, DialogTrigger } from "@radix-ui/react-dialog";
import { GiFlyingFlag } from "react-icons/gi";
import LocalSearch from "../shared/common-search";
import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import CommonFilter from "../shared/common-filter";
import useFilterStore from "@/store/filter-store";
import { TIMEFILTER } from "@/lib/constants";
import CreateEditAlertRuleModal from "../modals/create-edit-alert-rule-modal";
import { CreateEditAlertRuleSchema } from "@/lib/validators";

const dummyAlertRules = [
    {
        id: "R-001",
        name: "Failed Login Attempts",
        condition: "More than 5 failed logins within 10 mins",
        severity: "High",
        source: "Active Directory",
        createdBy: "admin@company.com",
        status: "Active",
        action: "Send Email + Create Alert",
    },
    {
        id: "R-002",
        name: "Unusual API Calls",
        condition: "Spike >100 API requests/min",
        severity: "Medium",
        source: "AWS",
        createdBy: "security@company.com",
        status: "Active",
        action: "Create Alert",
    },
    {
        id: "R-003",
        name: "Privilege Escalation",
        condition: "Role change to Admin outside office hours",
        severity: "Critical",
        source: "M365",
        createdBy: "it.manager@company.com",
        status: "Active",
        action: "Send Email + Slack Notification",
    },
    {
        id: "R-004",
        name: "Antivirus Disabled",
        condition: "Endpoint AV turned off manually",
        severity: "Low",
        source: "CrowdStrike",
        createdBy: "analyst@company.com",
        status: "Inactive",
        action: "Log Only",
    },
    {
        id: "R-005",
        name: "Suspicious File Download",
        condition: "Large file downloaded >1GB after midnight",
        severity: "High",
        source: "Firewall",
        createdBy: "admin@company.com",
        status: "Active",
        action: "Send Email + Create Alert",
    },
]

export default function AlertRulesTable() {
    const { filters } = useFilterStore()

    return (
        <Card className="rounded-md flex flex-col gap-5">
            <CardHeader className="space-y-2">
                <div className="flex flex-col xl:flex-row gap-3 xl:gap-0 justify-between">
                    <div className="flex flex-col items-start gap-2 tracking-wide">
                        <CardTitle className="text-xl md:text-2xl">All Alert Rules</CardTitle>
                        <CardDescription>List of all configured alert rules that define when an alert is triggered.</CardDescription>
                    </div>
                    <div className="flex flex-col xl:flex-row xl:items-center gap-2">
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button className="bg-gradient-to-r from-purple-400 via-pink-500 to-blue-500 font-semibold hover:from-pink-500 hover:via-purple-500 hover:to-blue-400 transition-colors duration-300 w-fit min-h-[44px] text-white flex items-center gap-2 cursor-pointer">
                                    <GiFlyingFlag className="size-5" /> Create a new rule
                                </Button>
                            </DialogTrigger>
                            <CreateEditAlertRuleModal
                                formType="CREATE"
                                schema={CreateEditAlertRuleSchema}
                                defaultValues={{
                                    tenant: "tenantA",
                                    name: "High Severity",
                                    condition: "SEVERITY_GTE",
                                    threshold: 8,
                                    windowSeconds: 0
                                }}
                            />
                        </Dialog>
                    </div>
                </div>
                <div className="flex flex-col xl:flex-row gap-2">
                    <LocalSearch filterValue="aName" />
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
                            <TableHead className="whitespace-nowrap">Name</TableHead>
                            <TableHead className="whitespace-nowrap">Email</TableHead>
                            <TableHead className="whitespace-nowrap">Tenant</TableHead>
                            <TableHead className="whitespace-nowrap">Role</TableHead>
                            <TableHead className="whitespace-nowrap">Status</TableHead>
                            <TableHead className="whitespace-nowrap">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {dummyAlertRules.map((rule) => (
                            <TableRow key={rule.id}>
                                <TableCell className="py-5">{rule.id}</TableCell>
                                <TableCell className="py-5">{rule.name}</TableCell>
                                <TableCell className="py-5">{rule.condition}</TableCell>
                                <TableCell className="py-5">{rule.severity}</TableCell>
                                <TableCell className="py-5">{rule.source}</TableCell>
                                <TableCell className="py-5">{rule.createdBy}</TableCell>
                                <TableCell className="py-5">{rule.status}</TableCell>
                                <TableCell className="py-5">{rule.action}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}
