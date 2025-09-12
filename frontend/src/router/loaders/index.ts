import { authApi } from "@/api"
import { alertRulesQuery, allAlertsQuery, filtersQuery, logsInfiniteAdminQuery, logsInfiniteQuery, logsAlertsOverviewQuery, queryClient, severityOverviewQuery, sourceCompaisonsQuery, summaryQuery, topIpsQuery, userDataQuery, userInfiniteQuery } from "@/api/query"
import useAuthStore, { Status } from "@/store/auth-store"
import { redirect } from "react-router"

export const homeLoader = async () => {
    await Promise.all([
        queryClient.ensureQueryData(userDataQuery()),
        queryClient.ensureQueryData(logsAlertsOverviewQuery()),
        queryClient.ensureQueryData(sourceCompaisonsQuery()),
        queryClient.ensureQueryData(severityOverviewQuery()),
        queryClient.ensureInfiniteQueryData(logsInfiniteQuery()),
        queryClient.ensureQueryData(filtersQuery()),
        queryClient.ensureQueryData(topIpsQuery()),
        queryClient.ensureQueryData(allAlertsQuery()),
    ])

    return null
}

export const managementLoader = async () => {
    await Promise.all([
        queryClient.ensureQueryData(summaryQuery()),
        queryClient.ensureInfiniteQueryData(logsInfiniteAdminQuery()),
        queryClient.ensureInfiniteQueryData(userInfiniteQuery()),
        queryClient.ensureQueryData(alertRulesQuery())
    ])
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