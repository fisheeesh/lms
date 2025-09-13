import { AiFillAlert } from 'react-icons/ai'
import { FaUsers } from 'react-icons/fa6'
import { GiFlyingFlag } from "react-icons/gi"
import { LuLogs } from 'react-icons/lu'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'

interface Props {
    summary: Summary
}

export default function StatsCards({ summary }: Props) {
    return (
        <>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-lg font-medium">Total Logs</CardTitle>
                    <LuLogs className="size-6" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">
                        {summary.allLogs}
                    </div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-lg font-medium">Total Users</CardTitle>
                    <FaUsers className="size-6" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">
                        {summary.allUsers}
                    </div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-lg font-medium">Total Rules</CardTitle>
                    <GiFlyingFlag className="size-6" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">
                        {summary.allRules}
                    </div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-lg font-medium">Total Alerts</CardTitle>
                    <AiFillAlert className="size-6" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">
                        {summary.allAlerts}
                    </div>
                </CardContent>
            </Card>
        </>
    )
}
