import LocalSearch from "@/components/shared/common-search";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { SEVERITYFILTER, TSFILTER } from "@/lib/constants";
import useFilterStore from "@/store/filter-store";
import useUserStore from "@/store/user-store";
import { useState } from "react";
import { MdFormatListBulletedAdd } from "react-icons/md";
import ConfirmModal from "../modals/confirm-modal";
import CreateLogModal from "../modals/create-log-modal";
import CommonFilter from "../shared/common-filter";
import CustomBadge, { type LabelType } from "../shared/custom-badge";
import { Button } from "../ui/button";

interface Props {
    data: Log[]
    status: "error" | 'success' | 'pending',
    error: Error | null,
    isFetching: boolean,
    isFetchingNextPage: boolean,
    fetchNextPage: () => void,
    hasNextPage: boolean
}


export default function LogsTable({ data, status, error, isFetching, isFetchingNextPage, fetchNextPage, hasNextPage }: Props) {
    const { user } = useUserStore()
    const { filters } = useFilterStore()
    const [open, setOpen] = useState(false);

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
                        <Dialog open={open} onOpenChange={setOpen}>
                            <DialogTrigger asChild>
                                <Button className="bg-gradient-to-r from-purple-400 via-pink-500 to-blue-500 font-semibold hover:from-pink-500 hover:via-purple-500 hover:to-blue-400 transition-colors duration-300 w-fit min-h-[44px] text-white flex items-center gap-2 cursor-pointer">
                                    <MdFormatListBulletedAdd className="size-5" /> Create a new log
                                </Button>
                            </DialogTrigger>
                            {open && <CreateLogModal onClose={() => setOpen(false)} />}
                        </Dialog>
                    </div>}
                </div>
                <div className="flex flex-col xl:flex-row gap-2">
                    <LocalSearch filterValue="kw" />
                    {isAdmin && <CommonFilter
                        filterValue="tenant"
                        filters={filters.tenants}
                        otherClasses="min-h-[44px] sm:min-w-[150px]"
                    />}
                    <CommonFilter
                        filterValue="action"
                        filters={filters.actions}
                        otherClasses="min-h-[44px] sm:min-w-[150px]"
                    />
                    <CommonFilter
                        filterValue="source"
                        filters={filters.sources}
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
                            <TableHead className="whitespace-nowrap">User</TableHead>
                            <TableHead className="whitespace-nowrap">IP</TableHead>
                            <TableHead className="whitespace-nowrap">Tenant</TableHead>
                            <TableHead className="whitespace-nowrap">Source</TableHead>
                            <TableHead className="whitespace-nowrap">Type</TableHead>
                            <TableHead className="whitespace-nowrap">Severity</TableHead>
                            <TableHead className="whitespace-nowrap">Action</TableHead>
                            <TableHead className="whitespace-nowrap">TimeStamp</TableHead>
                        </TableRow>
                    </TableHeader>

                    {status === 'pending' ?
                        <div className="my-24 text-center font-medium">Loading...</div>
                        : status === 'error'
                            ? (<div className="my-24 text-center font-medium">Error: {error?.message}</div>)
                            : <TableBody className="">
                                {data.map((log) => (
                                    <TableRow key={log.id}>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <Avatar className="size-9">
                                                    <AvatarImage src={""} alt={log.user!} />
                                                    <AvatarFallback>{log.user?.charAt(0).toUpperCase() ?? 'A'}</AvatarFallback>
                                                </Avatar>
                                                <span className="whitespace-nowrap">{log.user ?? 'Anonymous'}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="py-4">
                                            <span className="whitespace-nowrap font-en">{log.ip}</span>
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
                                            <span className="whitespace-nowrap font-en">
                                                <CustomBadge label={log.severityLabel as LabelType} />
                                            </span>
                                        </TableCell>
                                        <TableCell className="py-4">
                                            <span className="whitespace-nowrap">{log.action}</span>
                                        </TableCell>
                                        <TableCell className="py-4">
                                            <span className="whitespace-nowrap font-en">{log.createdAt}</span>
                                        </TableCell>
                                        {isAdmin && <TableCell className="py-4">
                                            <Dialog>
                                                <DialogTrigger asChild>
                                                    <Button className="cursor-pointer" variant='destructive'>
                                                        Delete
                                                    </Button>
                                                </DialogTrigger>
                                                <ConfirmModal id={log.id} />
                                            </Dialog>
                                        </TableCell>}
                                    </TableRow>
                                ))}
                            </TableBody>}
                </Table>
                <div className="my-4 flex items-center justify-center">
                    <Button
                        className="cursor-pointer"
                        onClick={() => fetchNextPage()}
                        disabled={!hasNextPage || isFetchingNextPage}
                        variant={!hasNextPage ? "ghost" : "secondary"}
                    >
                        {isFetchingNextPage
                            ? "Loading more..."
                            : hasNextPage
                                ? "Load More"
                                : "Nothing more to load"}
                    </Button>
                </div>

                <div className="my-4 flex items-center justify-center">
                    {isFetching && !isFetchingNextPage ? "Background Updating..." : null}
                </div>
            </CardContent>
        </Card>
    )
}
