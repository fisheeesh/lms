import { authApi } from "@/api"
import { queryClient, userDataQuery } from "@/api/query"
import useAuthStore, { Status } from "@/store/auth-store"
import { redirect } from "react-router"

export const homeLoader = async () => {
    await queryClient.ensureQueryData(userDataQuery())

    return null
}

export const loginLoader = async () => {
    try {
        const res = await authApi.get("auth-check")

        if (res.status !== 200) {
            return null
        }

        return redirect("/")
    } catch (error) {
        console.log(error)
        return null
    }
}

export const OTPLoader = () => {
    const authStore = useAuthStore.getState()

    if (authStore.status !== Status.otp) {
        return redirect("/register")
    }

    return null
}

export const confirmPasswordLoader = () => {
    const authStore = useAuthStore.getState()

    if (authStore.status !== Status.confirm) {
        return redirect("/register")
    }

    return null
}

export const verifyOTPLoader = () => {
    const authStore = useAuthStore.getState()

    if (authStore.status !== Status.verify) {
        return redirect("/forgot-password")
    }

    return null
}

export const resetPasswordLoader = () => {
    const authStore = useAuthStore.getState()

    if (authStore.status !== Status.reset) {
        return redirect("/forgot-password")
    }

    return null
}