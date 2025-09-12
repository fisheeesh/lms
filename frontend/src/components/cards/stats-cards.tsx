import { AiFillAlert } from 'react-icons/ai'
import { BsBuildingsFill } from 'react-icons/bs'
import { FaUsers } from 'react-icons/fa6'
import { LuLogs } from 'react-icons/lu'
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card'

export default function StatsCard() {
    return (
        <>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-lg font-medium">Total Logs</CardTitle>
                    <LuLogs className="size-6" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">
                        25
                    </div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-lg font-medium">Total Tenants</CardTitle>
                    <BsBuildingsFill className="size-6" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">
                        3
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
                        200
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
                        10
                    </div>
                </CardContent>
            </Card>
        </>
    )
}
