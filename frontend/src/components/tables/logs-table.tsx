import LocalSearch from "@/components/shared/common-search";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ACTIONFILTER, dummyLogs, SEVERITYFILTER, SOURCEFILTER, TENANTFILTER } from "@/lib/constants";
import CommonFilter from "../shared/common-filter";
import useUserStore from "@/store/user-store";

export default function LogsTable() {
    const { user } = useUserStore()
    return (
        <Card className="rounded-md flex flex-col gap-5">
            <CardHeader className="space-y-2">
                <div className="flex flex-col xl:flex-row gap-3 xl:gap-0 justify-between">
                    <div className="flex flex-col items-start gap-2 tracking-wide">
                        <CardTitle className="text-xl md:text-2xl">Log Lists under Tenant A</CardTitle>
                        <CardDescription>Check them out</CardDescription>
                    </div>
                </div>
                <div className="flex flex-col lg:flex-row gap-2">
                    <LocalSearch filterValue="key" />
                    {user.role === 'ADMIN' && <CommonFilter
                        filterValue="tenant"
                        filters={TENANTFILTER}
                        otherClasses="min-h-[44px] sm:min-w-[150px]"
                    />}
                    <CommonFilter
                        filterValue="action"
                        filters={ACTIONFILTER}
                        otherClasses="min-h-[44px] sm:min-w-[150px]"
                    />
                    <CommonFilter
                        filterValue="source"
                        filters={SOURCEFILTER}
                        otherClasses="min-h-[44px] sm:min-w-[150px]"
                    />
                    <CommonFilter
                        filterValue="severity"
                        filters={SEVERITYFILTER}
                        otherClasses="min-h-[44px] sm:min-w-[150px]"
                    />
                </div>
            </CardHeader>

            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="whitespace-nowrap">IP</TableHead>
                            <TableHead className="whitespace-nowrap">User</TableHead>
                            <TableHead className="whitespace-nowrap">Tenant</TableHead>
                            <TableHead className="whitespace-nowrap">Source</TableHead>
                            <TableHead className="whitespace-nowrap">Type</TableHead>
                            <TableHead className="whitespace-nowrap">SubType</TableHead>
                            <TableHead className="whitespace-nowrap">Severity</TableHead>
                            <TableHead className="whitespace-nowrap">Action</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {dummyLogs.map((log) => (
                            <TableRow key={log.id}>
                                <TableCell className="py-4">
                                    <span className="whitespace-nowrap font-en">{log.ip}</span>
                                </TableCell>
                                <TableCell className="py-4">
                                    <span className="whitespace-nowrap">{log.user}</span>
                                </TableCell>
                                <TableCell className="py-4">
                                    <span className="whitespace-nowrap">{log.tenant}</span>
                                </TableCell>
                                <TableCell className="py-4">
                                    <span className="whitespace-nowrap">{log.source}</span>
                                </TableCell>
                                <TableCell className="py-4">
                                    <span className="whitespace-nowrap">{log.eventType}</span>
                                </TableCell>
                                <TableCell className="py-4">
                                    <span className="whitespace-nowrap">{log.eventSubtype}</span>
                                </TableCell>
                                <TableCell className="py-4">
                                    <span className="whitespace-nowrap font-en">{log.severity}</span>
                                </TableCell>
                                <TableCell className="py-4">
                                    <span className="whitespace-nowrap font-en">{log.action}</span>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}
