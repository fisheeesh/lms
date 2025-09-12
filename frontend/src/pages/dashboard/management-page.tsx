import { alertRulesQuery, logsInfiniteAdminQuery, summaryQuery, userInfiniteQuery } from "@/api/query";
import StatsCards from "@/components/cards/stats-cards";
import AlertRulesTable from "@/components/tables/alert-rules-table";
import LogsTable from "@/components/tables/logs-table";
import UserTable from "@/components/tables/user-table";
import useTitle from "@/hooks/use-title";
import { useInfiniteQuery, useSuspenseQuery } from "@tanstack/react-query";
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

    //* For alert-rules
    const aKw = searchParams.get("aKw")
    const aTenant = searchParams.get("aTenant")
    const aTs = searchParams.get("aTs")

    const { data: summaryData } = useSuspenseQuery(summaryQuery())
    const { data: rulesData } = useSuspenseQuery(alertRulesQuery(aTenant, aKw, aTs))

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
                <StatsCards summary={summaryData.data} />
            </div>
            <AlertRulesTable data={rulesData.data} />
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
