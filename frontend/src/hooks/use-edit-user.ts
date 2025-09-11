/* eslint-disable @typescript-eslint/no-explicit-any */
import { adminApi } from "@/api"
import { invalidateUserQueries } from "@/api/query"
import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"

const useEditUser = () => {
    const { mutate: editUser, isPending: userEditing } = useMutation({
        mutationFn: async (payload: any) => {
            const res = await adminApi.patch("admin/users", payload)

            return res.data
        },
        onSuccess: async () => {
            await invalidateUserQueries()
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

    return { editUser, userEditing }
}

export default useEditUser