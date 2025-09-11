/* eslint-disable @typescript-eslint/no-explicit-any */
import { adminApi } from "@/api"
import { invalidateUserQueries } from "@/api/query"
import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"

const useCreateUser = () => {
    const { mutate: createUser, isPending: userCreating } = useMutation({
        mutationFn: async (payload: any) => {
            const res = await adminApi.post("admin/users", payload)

            return res.data
        },
        onSuccess: async () => {
            await invalidateUserQueries()
            toast.success('Success', {
                description: "User has been created successfully.",
            });
        },
        onError: (err: any) => {
            const msg =
                err?.response?.data?.message ||
                err?.message ||
                "Failed to create user. Please try again.";
            toast.error('Error', {
                description: msg,
            });
        },
    })

    return { createUser, userCreating }
}

export default useCreateUser