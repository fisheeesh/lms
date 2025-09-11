import { filtersQuery, logsInfiniteQuery, logsOverviewQuery, severityOverviewQuery, sourceCompaisonsQuery, userDataQuery } from "@/api/query"
import { LogsOverviewChart } from "@/components/charts/logs-overview-chart"
import { SeverityOverviewChart } from "@/components/charts/severity-overview-chart"
import { SourceComparisonChart } from "@/components/charts/source-comparison-chart"
import LogsTable from "@/components/tables/logs-table"
import useTitle from "@/hooks/use-title"
import useFilterStore from "@/store/filter-store"
import useUserStore from "@/store/user-store"
import { useInfiniteQuery, useSuspenseQuery } from "@tanstack/react-query"
import { useEffect } from "react"
import { useSearchParams } from "react-router"

export default function DashboardPage() {
    useTitle("Logs Dashboard")
    const { setUser } = useUserStore()
    const { setFilters } = useFilterStore()

    const [searchParams] = useSearchParams()

    const duration = searchParams.get("duration")
    const kw = searchParams.get("kw")
    const tenant = searchParams.get("tenant")
    const ts = searchParams.get("ts")
    const source = searchParams.get("source")
    const action = searchParams.get("action")
    const severity = searchParams.get("severity")

    const { data: userData } = useSuspenseQuery(userDataQuery())
    const { data: logsOverviewData } = useSuspenseQuery(logsOverviewQuery())
    const { data: soureComparisonsData } = useSuspenseQuery(sourceCompaisonsQuery(duration))
    const { data: severityOverviewData } = useSuspenseQuery(severityOverviewQuery())
    const { data: filtersData } = useSuspenseQuery(filtersQuery())

    const {
        status,
        data,
        error,
        isFetching,
        isFetchingNextPage,
        fetchNextPage,
        hasNextPage,
    } = useInfiniteQuery(logsInfiniteQuery(kw, tenant, ts, source, action, severity))

    const allLogs = data?.pages.flatMap(page => page.data) ?? []

    useEffect(() => {
        if (filtersData) {
            setFilters({
                tenants: filtersData.data.tenants,
                sources: filtersData.data.sources,
                actions: filtersData.data.actions
            })
        }
        if (userData) {
            setUser({
                id: userData.data.id,
                email: userData.data.email,
                fullName: userData.data.fullName,
                role: userData.data.role,
                tenant: userData.data.tenant
            })
        }
    }, [userData, setUser, setFilters, filtersData])

    return (
        <section className="flex flex-col gap-4">
            <LogsOverviewChart data={logsOverviewData.data} />
            <div className="grid gap-4 lg:grid-cols-3 items-stretch">
                <div className="lg:col-span-2">
                    <SourceComparisonChart data={soureComparisonsData.data} />
                </div>
                <SeverityOverviewChart data={severityOverviewData.data} />
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
        </section>
    )
}
