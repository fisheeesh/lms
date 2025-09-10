import LocalSearch from "@/components/shared/common-search";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ACTIONFILTER, dummyLogs, SEVERITYFILTER, SOURCEFILTER, TENANTFILTER, TSFILTER } from "@/lib/constants";
import useUserStore from "@/store/user-store";
import { MdFormatListBulletedAdd } from "react-icons/md";
import CommonFilter from "../shared/common-filter";
import { Button } from "../ui/button";
import CreateLogModal from "../modals/create-log-modal";
import ConfirmModal from "../modals/confirm-modal";

export default function LogsTable() {
    const { user } = useUserStore()

    const isAdmin = user.role === 'ADMIN'

    return (
        <Card className="rounded-md flex flex-col gap-5">
            <CardHeader className="space-y-2">
                <div className="flex flex-col xl:flex-row gap-3 xl:gap-0 justify-between">
                    <div className="flex flex-col items-start gap-2 tracking-wide">
                        <CardTitle className="text-xl md:text-2xl">Detailed list of logs under {user.tenant}</CardTitle>
                        <CardDescription>Search and filter logs for easier navigation</CardDescription>
                    </div>
                    {isAdmin && <div className="flex flex-col xl:flex-row xl:items-center gap-2">
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button className="bg-gradient-to-r from-purple-400 via-pink-500 to-blue-500 font-semibold hover:from-pink-500 hover:via-purple-500 hover:to-blue-400 transition-colors duration-300 w-fit min-h-[44px] text-white flex items-center gap-2 cursor-pointer">
                                    <MdFormatListBulletedAdd className="size-5" /> Create a new log
                                </Button>
                            </DialogTrigger>
                            <CreateLogModal />
                        </Dialog>
                    </div>}
                </div>
                <div className="flex flex-col xl:flex-row gap-2">
                    <LocalSearch filterValue="key" />
                    {isAdmin && <CommonFilter
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
                    <CommonFilter
                        filterValue="ts"
                        filters={TSFILTER}
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
                            <TableHead className="whitespace-nowrap">TimeStamp</TableHead>
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
                                    <span className="whitespace-nowrap">{log.action}</span>
                                </TableCell>
                                <TableCell className="py-4">
                                    <span className="whitespace-nowrap font-en">{log.ts.toDateString()}</span>
                                </TableCell>
                                {isAdmin && <TableCell className="py-4">
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <Button className="cursor-pointer" variant='destructive'>
                                                Delete
                                            </Button>
                                        </DialogTrigger>
                                        <ConfirmModal />
                                    </Dialog>
                                </TableCell>}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}
