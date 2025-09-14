import { ASTATUSFILTER } from "@/lib/constants"
import { formatId } from "@/lib/utils"
import CommonFilter from "../shared/common-filter"
import Empty from "../shared/empty"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table"

interface Props {
    data: Alert[]
}

export default function TriggeredAlertsCard({ data }: Props) {
    return (
        <Card className="min-h-[475px]">
            <CardHeader className="flex lg:items-center flex-col lg:flex-row justify-between gap-3">
                <div>
                    <CardTitle className="text-xl md:text-2xl">Alerts Triggered</CardTitle>
                    <CardDescription>
                        List of alerts generated based on log severity and predefined rules.
                    </CardDescription>
                </div>
                <CommonFilter
                    filterValue="aStatus"
                    filters={ASTATUSFILTER}
                    otherClasses="min-h-[44px] sm:min-w-[150px]"
                />
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
                                <TableCell className="py-5 font-en">{formatId(alert.id)}</TableCell>
                                <TableCell className="py-5">{alert.tenant}</TableCell>
                                <TableCell className="py-5">{alert.ruleName}</TableCell>
                                <TableCell className="py-5">{alert.status}</TableCell>
                                <TableCell className="py-5 font-en">{alert.triggeredAt}</TableCell>
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
