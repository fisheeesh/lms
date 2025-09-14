import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import Empty from "../shared/empty"

interface Props {
    data: IP[]
}

export default function TopIPsCard({ data }: Props) {
    return (
        <Card className="min-h-[475px]">
            <CardHeader>
                <CardTitle className="text-xl md:text-2xl">Top IPs</CardTitle>
                <CardDescription>See which IPs are making the most logs</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="whitespace-nowrap">IP Name</TableHead>
                            <TableHead className="whitespace-nowrap">Counts</TableHead>
                        </TableRow>
                    </TableHeader>
                    {data.length > 0 && <TableBody>
                        {
                            data.map(item => (
                                <TableRow key={item.ip}>
                                    <TableCell className="py-5 font-en">
                                        {item.ip}
                                    </TableCell>
                                    <TableCell className="py-5 font-en">
                                        {item.count}
                                    </TableCell>
                                </TableRow>
                            ))
                        }
                    </TableBody>}
                </Table>
                {data.length === 0 && <div className="my-4 flex flex-col items-center justify-center">
                    <Empty label="No records found" classesName="w-[300px] h-[200px] " />
                </div>}
            </CardContent>
        </Card>
    )
}
