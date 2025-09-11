import { logsOverviewQuery, sourceCompaisonsQuery, userDataQuery } from "@/api/query"
import { LogsOverviewChart } from "@/components/charts/logs-overview-chart"
import { SeverityOverviewChart } from "@/components/charts/severity-overview-chart"
import { SourceComparisonChart } from "@/components/charts/source-comparison-chart"
import LogsTable from "@/components/tables/logs-table"
import useTitle from "@/hooks/use-title"
import useUserStore from "@/store/user-store"
import { useSuspenseQuery } from "@tanstack/react-query"
import { useEffect } from "react"
import { useSearchParams } from "react-router"

export default function DashboardPage() {
    useTitle("Logs Dashboard")
    const { setUser } = useUserStore()

    const [searchParams] = useSearchParams()

    const duration = searchParams.get("duration")

    const { data: userData } = useSuspenseQuery(userDataQuery())
    const { data: logsOverviewData } = useSuspenseQuery(logsOverviewQuery())
    const { data: soureComparisonsData } = useSuspenseQuery(sourceCompaisonsQuery(duration))

    useEffect(() => {
        if (userData) {
            setUser({
                id: userData.data.id,
                email: userData.data.email,
                fullName: userData.data.fullName,
                role: userData.data.role,
                tenant: userData.data.tenant
            })
        }
    }, [userData, setUser])

    return (
        <section className="flex flex-col gap-4">
            <LogsOverviewChart data={logsOverviewData.data} />
            <div className="grid gap-4 lg:grid-cols-3 items-stretch">
                <div className="lg:col-span-2">
                    <SourceComparisonChart data={soureComparisonsData.data} />
                </div>
                <SeverityOverviewChart />
            </div>
            <LogsTable />
        </section>
    )
}
