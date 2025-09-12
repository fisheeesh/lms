import { formatId } from "@/lib/utils"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../ui/card"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "../ui/table"
import CommonFilter from "../shared/common-filter"
import useFilterStore from "@/store/filter-store"
import Empty from "../shared/empty"
import useUserStore from "@/store/user-store"

interface Props {
    data: Alert[]
}

export default function TriggeredAlertsCard({ data }: Props) {
    const { filters } = useFilterStore()
    const { user } = useUserStore()

    return (
        <Card className="min-h-[475px]">
            <CardHeader className="flex lg:items-center flex-col lg:flex-row justify-between gap-3">
                <div>
                    <CardTitle className="text-xl md:text-2xl">Alerts Triggered</CardTitle>
                    <CardDescription>
                        List of alerts generated based on log severity and predefined rules.
                    </CardDescription>
                </div>
                {user.role === "ADMIN" && <CommonFilter
                    filterValue="aTenant"
                    filters={filters.lTenants}
                    otherClasses="min-h-[44px] sm:min-w-[150px]"
                />}
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="whitespace-nowrap">Alert ID</TableHead>
                            <TableHead className="whitespace-nowrap">Tenant</TableHead>
                            <TableHead className="whitespace-nowrap">Rule Name</TableHead>
                            <TableHead className="whitespace-nowrap">Status</TableHead>
                            <TableHead className="whitespace-nowrap">TriggeredAt</TableHead>
                        </TableRow>
                    </TableHeader>
                    {data.length > 0 && <TableBody>
                        {data.map((alert) => (
                            <TableRow key={alert.id}>
                                <TableCell className="py-5">{formatId(alert.id)}</TableCell>
                                <TableCell className="py-5">{alert.tenant}</TableCell>
                                <TableCell className="py-5">{alert.ruleName}</TableCell>
                                <TableCell className="py-5">{alert.status}</TableCell>
                                <TableCell className="py-5">{new Date(alert.triggeredAt).toLocaleDateString("en-US", {
                                    year: "numeric", month: "long", day: "numeric"
                                })}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>}
                </Table>
                {data.length === 0 && <div className="my-4 flex flex-col items-center justify-center">
                    <Empty label="No records found" classesName="w-[300px] h-[200px] " />
                </div>}
            </CardContent>
        </Card>
    )
}
