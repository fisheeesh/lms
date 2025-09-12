import { adminApi } from "@/api"
import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"

const useDeleteRule = () => {
    const { mutate: deleteRule, isPending: ruleLoading } = useMutation({
        mutationFn: async (id: string) => {
            const res = await adminApi.delete("admin/alert-rules", { data: { id } })

            return res.data
        },
        onSuccess: async () => {
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

    return { deleteRule, ruleLoading }
}

export default useDeleteRule