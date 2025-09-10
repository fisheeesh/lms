import LocalSearch from "@/components/shared/common-search";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { dummyUsers, TENANTFILTER } from "@/lib/constants";
import { CreateUserSchema, EditUserSchema } from "@/lib/validators";
import useUserStore from "@/store/user-store";
import { MdFormatListBulletedAdd } from "react-icons/md";
import ConfirmModal from "../modals/confirm-modal";
import CreateEditUserModal from "../modals/create-edit-user-modal";
import CommonFilter from "../shared/common-filter";
import { Button } from "../ui/button";

export default function UserTable() {
    const { user } = useUserStore()

    const isAdmin = user.role === 'ADMIN'

    return (
        <Card className="rounded-md flex flex-col gap-5">
            <CardHeader className="space-y-2">
                <div className="flex flex-col xl:flex-row gap-3 xl:gap-0 justify-between">
                    <div className="flex flex-col items-start gap-2 tracking-wide">
                        <CardTitle className="text-xl md:text-2xl">All User Lists</CardTitle>
                        <CardDescription>Check them out</CardDescription>
                    </div>
                    {isAdmin && <div className="flex flex-col xl:flex-row xl:items-center gap-2">
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button className="bg-gradient-to-r from-purple-400 via-pink-500 to-blue-500 font-semibold hover:from-pink-500 hover:via-purple-500 hover:to-blue-400 transition-colors duration-300 w-fit min-h-[44px] text-white flex items-center gap-2 cursor-pointer">
                                    <MdFormatListBulletedAdd className="size-5" /> Create a new user
                                </Button>
                            </DialogTrigger>
                            <CreateEditUserModal
                                formType="CREATE"
                                schema={CreateUserSchema}
                                defaultValues={{
                                    firstName: '',
                                    lastName: '',
                                    email: 'syp@gmail.com',
                                    password: '12345678',
                                    role: 'User',
                                    tenant: ""
                                }}
                            />
                        </Dialog>
                    </div>}
                </div>
                <div className="flex flex-col xl:flex-row gap-2">
                    <LocalSearch filterValue="name" />
                    {isAdmin && <CommonFilter
                        filterValue="uTenant"
                        filters={TENANTFILTER}
                        otherClasses="min-h-[44px] sm:min-w-[150px]"
                    />}
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
                        {dummyUsers.map((log) => (
                            <TableRow key={log.name}>
                                <TableCell className="py-4">
                                    <span className="whitespace-nowrap">{log.name}</span>
                                </TableCell>
                                <TableCell className="py-4">
                                    <span className="whitespace-nowrap">{log.email}</span>
                                </TableCell>
                                <TableCell className="py-4">
                                    <span className="whitespace-nowrap">{log.tenant}</span>
                                </TableCell>
                                <TableCell className="py-4">
                                    <span className="whitespace-nowrap">{log.role}</span>
                                </TableCell>
                                <TableCell className="py-4">
                                    <span className="whitespace-nowrap">{log.status}</span>
                                </TableCell>
                                {isAdmin && <TableCell className="py-4 space-x-2">
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <Button variant='outline' className="cursor-pointer">
                                                Edit
                                            </Button>
                                        </DialogTrigger>
                                        <CreateEditUserModal
                                            formType="EDIT"
                                            schema={EditUserSchema}
                                            defaultValues={{
                                                firstName: 'Swam',
                                                lastName: "Yi Phyo",
                                                role: "Admin",
                                                tenant: "tenantA"
                                            }}
                                        />
                                    </Dialog>
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
