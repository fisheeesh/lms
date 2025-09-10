import LogsTable from "@/components/tables/logs-table";
import UserTable from "@/components/tables/user-table";

export default function AdminDashboardPage() {

    return (
        <section className="flex flex-col gap-4">
            <LogsTable />
            <UserTable />
        </section>
    )
}
