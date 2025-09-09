import { userDataQuery } from "@/api/query"
import useUserStore from "@/store/user-store"
import { useSuspenseQuery } from "@tanstack/react-query"
import { useEffect } from "react"

export default function DashboardPage() {
    const { setUser } = useUserStore()

    const { data: userData } = useSuspenseQuery(userDataQuery())

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
        <div>
            Dashboard
        </div>
    )
}
