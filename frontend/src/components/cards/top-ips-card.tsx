import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"

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
                    <TableBody>
                        {
                            data.map(item => (
                                <TableRow key={item.ip}>
                                    <TableCell className="py-5">
                                        {item.ip}
                                    </TableCell>
                                    <TableCell className="py-5">
                                        {item.count}
                                    </TableCell>
                                </TableRow>
                            ))
                        }
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}
