/* eslint-disable @typescript-eslint/no-explicit-any */
import { adminApi } from "@/api"
import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"

const useEditRule = () => {
    const { mutate: editRule, isPending: ruleEditing } = useMutation({
        mutationFn: async (payload: any) => {
            const res = await adminApi.patch("admin/alert-rules", payload)

            return res.data
        },
        onSuccess: async () => {
            toast.success('Success', {
                description: "User has been updated successfully.",
            });
        },
        onError: (err: any) => {
            const msg =
                err?.response?.data?.message ||
                err?.message ||
                "Failed to update user. Please try again.";
            toast.error('Error', {
                description: msg,
            });
        },
    })

    return { editRule, ruleEditing }
}

export default useEditRule