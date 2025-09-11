import { adminApi } from "@/api"
import { invalidateUserQueries } from "@/api/query"
import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"

const useDeleteUser = () => {
    const { mutate: deleteUser, isPending: userLoading } = useMutation({
        mutationFn: async (id: number) => {
            const res = await adminApi.delete("admin/users", { data: { id } })

            return res.data
        },
        onSuccess: async () => {
            await invalidateUserQueries()
            toast.success("Success", {
                description: `User has been deleted successfully.`
            })
        },
        onError: (error) => {
            toast.error("Error", {
                description: error instanceof Error ? error.message : "Something went wrong. Please try again."
            })
        }
    })

    return { deleteUser, userLoading }
}

export default useDeleteUser