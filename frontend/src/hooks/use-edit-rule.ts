/* eslint-disable @typescript-eslint/no-explicit-any */
import { adminApi } from "@/api"
import { invalidateRuleQueries } from "@/api/query"
import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"

const useEditRule = () => {
    const { mutate: editRule, isPending: ruleEditing } = useMutation({
        mutationFn: async (payload: any) => {
            const res = await adminApi.patch("admin/alert-rules", payload)

            return res.data
        },
        onSuccess: async () => {
            await invalidateRuleQueries()
            toast.success('Success', {
                description: "Rule has been updated successfully.",
            });
        },
        onError: (err: any) => {
            const msg =
                err?.response?.data?.message ||
                err?.message ||
                "Failed to update rule. Please try again.";
            toast.error('Error', {
                description: msg,
            });
        },
    })

    return { editRule, ruleEditing }
}

export default useEditRule