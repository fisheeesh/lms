/* eslint-disable @typescript-eslint/no-explicit-any */
import { adminApi } from "@/api"
import { invalidateRuleQueries } from "@/api/query"
import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"

const useCreateRule = () => {
    const { mutate: createRule, isPending: ruleCreating } = useMutation({
        mutationFn: async (payload: any) => {
            const res = await adminApi.post("admin/alert-rules", payload)

            return res.data
        },
        onSuccess: async () => {
            await invalidateRuleQueries()
            toast.success('Success', {
                description: "Rule has been created successfully.",
            });
        },
        onError: (err: any) => {
            const msg =
                err?.response?.data?.message ||
                err?.message ||
                "Failed to create rule. Please try again.";
            toast.error('Error', {
                description: msg,
            });
        },
    })

    return { createRule, ruleCreating }
}

export default useCreateRule