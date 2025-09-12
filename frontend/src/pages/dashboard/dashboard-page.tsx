import { allAlertsQuery, filtersQuery, logsInfiniteQuery, logsOverviewQuery, severityOverviewQuery, sourceCompaisonsQuery, topIpsQuery, userDataQuery } from "@/api/query"
import TopIPsCard from "@/components/cards/top-ips-card"
import TriggeredAlertsCard from "@/components/cards/triggered-alerts-card"
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
    const aTenant = searchParams.get("aTenant")
    const lDate = searchParams.get("lDate")

    const { data: userData } = useSuspenseQuery(userDataQuery())
    const { data: logsOverviewData } = useSuspenseQuery(logsOverviewQuery())
    const { data: soureComparisonsData } = useSuspenseQuery(sourceCompaisonsQuery(duration))
    const { data: severityOverviewData } = useSuspenseQuery(severityOverviewQuery())
    const { data: filtersData } = useSuspenseQuery(filtersQuery())
    const { data: topIpsData } = useSuspenseQuery(topIpsQuery())
    const { data: alertsData } = useSuspenseQuery(allAlertsQuery(aTenant))

    const {
        status,
        data,
        error,
        isFetching,
        isFetchingNextPage,
        fetchNextPage,
        hasNextPage,
    } = useInfiniteQuery(logsInfiniteQuery(kw, tenant, ts, source, action, severity, lDate))

    const allLogs = data?.pages.flatMap(page => page.data) ?? []

    useEffect(() => {
        if (filtersData) {
            setFilters({
                uTenants: filtersData.data.uTenants,
                lTenants: filtersData.data.lTenants,
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
        <section className="flex flex-col gap-4 min-w-0">
            <LogsOverviewChart data={logsOverviewData.data} />

            <div className="grid gap-4 lg:grid-cols-5 items-stretch min-w-0">
                <div className="lg:col-span-3 min-w-0">
                    <SourceComparisonChart data={soureComparisonsData.data} />
                </div>
                <div className="min-w-0 lg:col-span-2">
                    <SeverityOverviewChart data={severityOverviewData.data} />
                </div>
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

            <div className="flex flex-col lg:flex-row gap-4 min-w-0">
                <div className="w-full lg:w-1/3 min-w-0">
                    <TopIPsCard data={topIpsData.data} />
                </div>
                <div className="w-full lg:w-2/3 min-w-0">
                    <TriggeredAlertsCard data={alertsData.data} />
                </div>
            </div>
        </section>
    )
}
