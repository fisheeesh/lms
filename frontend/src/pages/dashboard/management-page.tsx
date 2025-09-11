import { logsInfiniteAdminQuery } from "@/api/query";
import LogsTable from "@/components/tables/logs-table";
import UserTable from "@/components/tables/user-table";
import useTitle from "@/hooks/use-title";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router";

export default function AdminDashboardPage() {
    useTitle("Management Dashboard")

    const [searchParams] = useSearchParams()

    const kw = searchParams.get("kw")
    const tenant = searchParams.get("tenant")
    const ts = searchParams.get("ts")
    const source = searchParams.get("source")
    const action = searchParams.get("action")
    const severity = searchParams.get("severity")

    const {
        status,
        data,
        error,
        isFetching,
        isFetchingNextPage,
        fetchNextPage,
        hasNextPage,
    } = useInfiniteQuery(logsInfiniteAdminQuery(kw, tenant, ts, source, action, severity))

    const allLogs = data?.pages.flatMap(page => page.data) ?? []

    return (
        <section className="flex flex-col gap-4">
            <LogsTable
                data={allLogs}
                status={status}
                error={error}
                isFetching={isFetching}
                isFetchingNextPage={isFetchingNextPage}
                fetchNextPage={fetchNextPage}
                hasNextPage={hasNextPage}
            />
            <UserTable />
        </section>
    )
}
