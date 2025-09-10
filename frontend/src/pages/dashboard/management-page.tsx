import LogsTable from "@/components/tables/logs-table";
import UserTable from "@/components/tables/user-table";
import useTitle from "@/hooks/use-title";

export default function AdminDashboardPage() {
    useTitle("Management Dashboard")

    return (
        <section className="flex flex-col gap-4">
            <LogsTable />
            <UserTable />
        </section>
    )
}
