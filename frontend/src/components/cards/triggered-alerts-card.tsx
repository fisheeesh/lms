import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../ui/card"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "../ui/table"

const dummyAlerts = [
    {
        id: "A-101",
        timestamp: "2025-09-12 14:35:22",
        severity: "Critical",
        source: "Firewall",
        host: "192.168.1.10",
        user: "N/A",
        rule: "Multiple Failed Login Attempts",
        description: "10 consecutive failed logins detected from external IP.",
    },
    {
        id: "A-102",
        timestamp: "2025-09-12 13:12:08",
        severity: "High",
        source: "M365",
        host: "10.0.0.5",
        user: "john.doe",
        rule: "Suspicious File Download",
        description: "Large file downloaded outside office hours.",
    },
    {
        id: "A-103",
        timestamp: "2025-09-12 12:01:44",
        severity: "Medium",
        source: "AWS",
        host: "54.201.11.3",
        user: "svc-backup",
        rule: "Unusual API Calls",
        description: "Spike in API requests detected in short interval.",
    },
    {
        id: "A-104",
        timestamp: "2025-09-12 11:47:03",
        severity: "Low",
        source: "CrowdStrike",
        host: "172.16.2.14",
        user: "mary.smith",
        rule: "Disabled Antivirus",
        description: "Endpoint AV agent was disabled manually.",
    },
    {
        id: "A-105",
        timestamp: "2025-09-12 10:22:59",
        severity: "High",
        source: "Active Directory",
        host: "192.168.2.25",
        user: "admin",
        rule: "Privilege Escalation",
        description: "Admin rights granted outside of change window.",
    },
]


export default function TriggeredAlertsCard() {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-xl md:text-2xl">Alerts Triggered</CardTitle>
                <CardDescription>
                    List of alerts generated based on log severity and predefined rules.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="whitespace-nowrap">Alert ID</TableHead>
                            <TableHead className="whitespace-nowrap">Timestamp</TableHead>
                            <TableHead className="whitespace-nowrap">Severity</TableHead>
                            <TableHead className="whitespace-nowrap">Source</TableHead>
                            <TableHead className="whitespace-nowrap">IP</TableHead>
                            <TableHead className="whitespace-nowrap">User</TableHead>
                            <TableHead className="whitespace-nowrap">Rule Matched</TableHead>
                            <TableHead className="whitespace-nowrap">Description</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {dummyAlerts.map((alert) => (
                            <TableRow key={alert.id}>
                                <TableCell className="py-5">{alert.id}</TableCell>
                                <TableCell className="py-5">{alert.timestamp}</TableCell>
                                <TableCell className="py-5">{alert.severity}</TableCell>
                                <TableCell className="py-5">{alert.source}</TableCell>
                                <TableCell className="py-5">{alert.host}</TableCell>
                                <TableCell className="py-5">{alert.user}</TableCell>
                                <TableCell className="py-5">{alert.rule}</TableCell>
                                <TableCell className="py-5">{alert.description}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}
