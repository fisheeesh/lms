import api from "@/api"
import { invalidateLogsQueries } from "@/api/query"
import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"

const useLogDelete = () => {
    const { mutate: deleteLog, isPending: isLoading } = useMutation({
        mutationFn: async (id: number) => {
            const res = await api.delete("admin/logs", { data: { id } })

            return res.data
        },
        onSuccess: async () => {
            await invalidateLogsQueries()
            toast.success("Success", {
                description: `Log has been deleted successfully.`
            })
        },
        onError: (error) => {
            toast.error("Error", {
                description: error instanceof Error ? error.message : "Something went wrong. Please try again."
            })
        }
    })

    return { deleteLog, isLoading }
}

export default useLogDelete