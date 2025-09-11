/* eslint-disable @typescript-eslint/no-unused-vars */
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

const fetchLogsInfinite = async ({ pageParam = null, kw = null }: { pageParam?: number | null, kw?: string | null }) => {
    let query = pageParam ? `?limit=7&cursor=${pageParam}` : "?limit=7"
    if (kw) query += `&kw=${kw}`
    const res = await api.get(`user/get-logs-infinite${query}`)

    return res.data
}

export const logsInfiniteQuery = (kw: string | null = null) => ({
    queryKey: ['logs', 'infinite', kw ?? undefined],
    queryFn: ({ pageParam = null }: { pageParam?: number | null }) => fetchLogsInfinite({ pageParam, kw }),
    initialPageParam: null,
    // @ts-expect-error ignore type check
    getNextPageParam: (lastPage, pages) => lastPage.nextCursor ?? undefined
})

export const invalidateLogsQueries = async () => {
    await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['source-comparisons'], exact: false }),
        queryClient.invalidateQueries({ queryKey: ['logs', 'infinite'], exact: false }),
        queryClient.invalidateQueries({ queryKey: ['logs-overview'] }),
        queryClient.invalidateQueries({ queryKey: ['severity-overview'] }),
    ]);
};