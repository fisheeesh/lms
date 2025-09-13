import LocalSearch from "@/components/shared/common-search";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ROLEFILTER, STATUSFILTER, TIMEFILTER } from "@/lib/constants";
import { CreateUserSchema, EditUserSchema } from "@/lib/validators";
import { useState } from "react";
import { TiUserAdd } from "react-icons/ti";
import ConfirmModal from "../modals/confirm-modal";
import CreateEditUserModal from "../modals/create-edit-user-modal";
import CommonFilter from "../shared/common-filter";
import Empty from "../shared/empty";
import { Button } from "../ui/button";

interface Props {
    data: User[]
    status: "error" | 'success' | 'pending',
    error: Error | null,
    isFetching?: boolean,
    isFetchingNextPage: boolean,
    fetchNextPage: () => void,
    hasNextPage: boolean
}

export default function UserTable({ data, status, error, isFetchingNextPage, fetchNextPage, hasNextPage }: Props) {
    const [createOpen, setCreateOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);

    return (
        <Card className="rounded-md flex flex-col gap-5">
            <CardHeader className="space-y-2">
                <div className="flex flex-col xl:flex-row gap-3 xl:gap-0 justify-between">
                    <div className="flex flex-col items-start gap-2 tracking-wide">
                        <CardTitle className="text-xl md:text-2xl">All User Lists</CardTitle>
                        <CardDescription>View and manage every user in the system</CardDescription>
                    </div>
                    <div className="flex flex-col xl:flex-row xl:items-center gap-2">
                        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
                            <DialogTrigger asChild>
                                <Button className="bg-gradient-to-r from-purple-400 via-pink-500 to-blue-500 font-semibold hover:from-pink-500 hover:via-purple-500 hover:to-blue-400 transition-colors duration-300 w-fit min-h-[44px] text-white flex items-center gap-2 cursor-pointer">
                                    <TiUserAdd className="size-5" /> Create a new user
                                </Button>
                            </DialogTrigger>
                            {createOpen && <CreateEditUserModal
                                formType="CREATE"
                                schema={CreateUserSchema}
                                defaultValues={{
                                    firstName: 'new',
                                    lastName: 'user',
                                    email: 'newUser@gmail.com',
                                    password: '12345678',
                                    role: 'USER',
                                    tenant: "tenantA"
                                }}
                                onClose={() => setCreateOpen(false)}
                            />}
                        </Dialog>
                    </div>
                </div>
                <div className="flex flex-col xl:flex-row gap-2">
                    <LocalSearch filterValue="uName" />
                    <CommonFilter
                        filterValue="role"
                        filters={ROLEFILTER}
                        otherClasses="min-h-[44px] sm:min-w-[150px]"
                    />
                    <CommonFilter
                        filterValue="status"
                        filters={STATUSFILTER}
                        otherClasses="min-h-[44px] sm:min-w-[150px]"
                    />
                    <CommonFilter
                        filterValue="uTs"
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

                    {status === 'pending' ?
                        <TableBody>
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-10">
                                    Loading...
                                </TableCell>
                            </TableRow>
                        </TableBody>
                        : status === 'error'
                            ? <TableBody>
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-10">
                                        Error: {error?.message}
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                            :
                            <TableBody>
                                {data.map((user) => (
                                    <TableRow key={user.id}>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <Avatar className="size-9">
                                                    <AvatarImage src={""} alt={user.fullName!} />
                                                    <AvatarFallback>{user.firstName?.charAt(0).toUpperCase()}{user.lastName?.charAt(0).toUpperCase()}</AvatarFallback>
                                                </Avatar>
                                                <span className="whitespace-nowrap">{user.fullName ?? 'Anonymous'}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="py-4">
                                            <span className="whitespace-nowrap">{user.email}</span>
                                        </TableCell>
                                        <TableCell className="py-4">
                                            <span className="whitespace-nowrap">{user.tenant}</span>
                                        </TableCell>
                                        <TableCell className="py-4">
                                            <span className="whitespace-nowrap">{user.role}</span>
                                        </TableCell>
                                        <TableCell className="py-4">
                                            <span className="whitespace-nowrap">{user.status}</span>
                                        </TableCell>
                                        <TableCell className="py-4 space-x-2">
                                            <Button
                                                variant="outline"
                                                className="cursor-pointer"
                                                onClick={() => setEditingUser(user)}
                                            >
                                                Edit
                                            </Button>

                                            <Dialog>
                                                <DialogTrigger asChild>
                                                    <Button className="cursor-pointer" variant="destructive">Delete</Button>
                                                </DialogTrigger>
                                                <ConfirmModal type="user" id={user.id} />
                                            </Dialog>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                <Dialog open={!!editingUser} onOpenChange={(o) => !o && setEditingUser(null)}>
                                    {editingUser && (
                                        <CreateEditUserModal
                                            formType="EDIT"
                                            userId={editingUser.id}
                                            schema={EditUserSchema}
                                            key={editingUser.id}
                                            defaultValues={{
                                                firstName: editingUser.firstName,
                                                lastName: editingUser.lastName,
                                                role: editingUser.role as "ADMIN" | "USER",
                                                tenant: editingUser.tenant,
                                            }}
                                            onClose={() => setEditingUser(null)}
                                        />
                                    )}
                                </Dialog>
                            </TableBody>}
                </Table>
                <div className="my-4 flex flex-col items-center justify-center">
                    {data.length > 0 && <Button
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
                    </Button>}
                </div>

                {data.length === 0 && status === 'success' && <div className="my-4 flex flex-col items-center justify-center">
                    <Empty label="No records found" classesName="w-[300px] h-[200px] " />
                </div>}

                {/* <div className="my-4 flex items-center justify-center">
                    {isFetching && !isFetchingNextPage ? "Background Updating..." : null}
                </div> */}
            </CardContent>
        </Card>
    )
}
