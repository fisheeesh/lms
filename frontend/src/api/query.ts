import { QueryClient } from '@tanstack/react-query';
import api from '.';

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            // staleTime: 5 * 60 * 1000,
            staleTime: 0
            // retry: 2,
        }
    }
})

const fetchUserData = async () => {
    const res = await api.get("user/user-data")

    return res.data
}

export const userDataQuery = () => ({
    queryKey: ['user-data'],
    queryFn: fetchUserData
})

const fetchLogsOverview = async () => {
    const res = await api.get("user/logs-overview")

    return res.data
}

export const logsOverviewQuery = () => ({
    queryKey: ['logs-overview'],
    queryFn: fetchLogsOverview
})

const fetchSourceComparisons = async (q?: string | null) => {
    const query = q ? `?duration=${q}` : ''
    const res = await api.get(`user/source-comparisons${query}`)

    return res.data
}

export const sourceCompaisonsQuery = (q?: string | null) => ({
    queryKey: ['source-comparisons', q],
    queryFn: () => fetchSourceComparisons(q)
})

export const fetchSeverityOverview = async () => {
    const res = await api.get("user/severity-overview")

    return res.data
}

export const severityOverviewQuery = () => ({
    queryKey: ['severity-overview'],
    queryFn: fetchSeverityOverview
})