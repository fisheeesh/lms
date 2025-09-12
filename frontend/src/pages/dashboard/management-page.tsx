import { logsInfiniteAdminQuery, userInfiniteQuery } from "@/api/query";
import LogsTable from "@/components/tables/logs-table";
import UserTable from "@/components/tables/user-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import useTitle from "@/hooks/use-title";
import { useInfiniteQuery } from "@tanstack/react-query";
import { AiFillAlert } from "react-icons/ai";
import { BsBuildingsFill } from "react-icons/bs";
import { FaUsers } from "react-icons/fa6";
import { LuLogs } from "react-icons/lu";
import { useSearchParams } from "react-router";

export default function AdminDashboardPage() {
    useTitle("Management Dashboard")

    const [searchParams] = useSearchParams()

    //* For logs
    const kw = searchParams.get("kw")
    const tenant = searchParams.get("tenant")
    const ts = searchParams.get("ts")
    const source = searchParams.get("source")
    const action = searchParams.get("action")
    const severity = searchParams.get("severity")

    //* For users
    const uName = searchParams.get("uName")
    const uTenant = searchParams.get("uTenant")
    const role = searchParams.get("role")
    const uStatus = searchParams.get("status")
    const uTs = searchParams.get("uTs")

    const {
        status,
        data,
        error,
        isFetching,
        isFetchingNextPage,
        fetchNextPage,
        hasNextPage,
    } = useInfiniteQuery(logsInfiniteAdminQuery(kw, tenant, ts, source, action, severity))

    const {
        status: userStatus,
        data: userData,
        error: userError,
        isFetching: isUserFetching,
        isFetchingNextPage: isUserFetchingNextPage,
        fetchNextPage: fetchUserNextPage,
        hasNextPage: hasUserNextPage,
    } = useInfiniteQuery(userInfiniteQuery(uName, uTenant, role, uStatus, uTs))


    const allLogs = data?.pages.flatMap(page => page.data) ?? []

    const allUsers = userData?.pages.flatMap(page => page.data) ?? []

    return (
        <section className="flex flex-col gap-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-lg font-medium">Total Logs</CardTitle>
                        <LuLogs className="size-6" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            25
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-lg font-medium">Total Tenants</CardTitle>
                        <BsBuildingsFill className="size-6" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            3
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-lg font-medium">Total Users</CardTitle>
                        <FaUsers className="size-6" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            200
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-lg font-medium">Total Alerts</CardTitle>
                        <AiFillAlert className="size-6" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            10
                        </div>
                    </CardContent>
                </Card>
            </div>
            <LogsTable
                data={allLogs}
                status={status}
                error={error}
                isFetching={isFetching}
                isFetchingNextPage={isFetchingNextPage}
                fetchNextPage={fetchNextPage}
                hasNextPage={hasNextPage}
            />
            <UserTable
                data={allUsers}
                status={userStatus}
                error={userError}
                isFetching={isUserFetching}
                isFetchingNextPage={isUserFetchingNextPage}
                fetchNextPage={fetchUserNextPage}
                hasNextPage={hasUserNextPage}
            />
        </section>
    )
}
