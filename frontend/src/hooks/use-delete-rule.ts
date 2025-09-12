import { adminApi } from "@/api"
import { invalidateRuleQueries } from "@/api/query"
import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"

const useDeleteRule = () => {
    const { mutate: deleteRule, isPending: ruleLoading } = useMutation({
        mutationFn: async (id: string) => {
            const res = await adminApi.delete("admin/alert-rules", { data: { id } })

            return res.data
        },
        onSuccess: async () => {
            await invalidateRuleQueries()
            toast.success("Success", {
                description: `Rule has been deleted successfully.`
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