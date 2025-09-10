import { authApi } from "@/api"
import useUserStore from "@/store/user-store"
import { useMutation } from "@tanstack/react-query"
import { useNavigate } from "react-router"
import { toast } from "sonner"

const useLogout = () => {
    const { clearUser } = useUserStore()
    const navigate = useNavigate()

    const { mutate: logout, isPending: isLoading } = useMutation({
        mutationFn: async () => {
            const res = await authApi.post("logout")

            if (res.status !== 200) {
                throw new Error("Something went wrong. Please try again.")
            }

            return res.data
        },
        onSuccess: () => {
            clearUser()
            navigate('/login', { replace: true })
        },
        onError: (error) => {
            toast.error("Error", {
                description: error instanceof Error ? error.message : "Something went wrong. Please try again."
            })
        }
    })

    return { logout, isLoading }
}

export default useLogout