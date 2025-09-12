/* eslint-disable @typescript-eslint/no-unused-vars */
import { QueryClient } from '@tanstack/react-query';
import api, { adminApi } from '.';

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            // staleTime: 5 * 60 * 1000,
            staleTime: 0
            // retry: 2,
        }
    }
})

export const invalidateLogsQueries = async () => {
    await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['source-comparisons'], exact: false }),
        queryClient.invalidateQueries({ queryKey: ['logs', 'infinite'], exact: false }),
        queryClient.invalidateQueries({ queryKey: ['logs-overview'] }),
        queryClient.invalidateQueries({ queryKey: ['severity-overview'] }),
        queryClient.invalidateQueries({ queryKey: ['top-ips'] }),
        queryClient.invalidateQueries({ queryKey: ['summary'] })
    ]);
};

export const invalidateUserQueries = async () => {
    await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['users', 'infinite'], exact: false }),
        queryClient.invalidateQueries({ queryKey: ['summary'] })
    ]);
};

export const invalidateRuleQueries = async () => {
    await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['alert-rules'], exact: false }),
        queryClient.invalidateQueries({ queryKey: ['summary'] })
    ]);
};


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

const fetchLogsInfinite = async ({ pageParam = null, kw = null, tenant = null, ts = null, source = null, action = null, severity = null }: {
    pageParam?: number | null, kw?: string | null, tenant?: string | null, ts?: string | null, source?: string | null, action?: string | null, severity?: string | null
}) => {
    let query = pageParam ? `?limit=7&cursor=${pageParam}` : "?limit=7"
    if (kw) query += `&kw=${kw}`
    if (tenant) query += `&tenant=${tenant}`
    if (ts) query += `&ts=${ts}`
    if (source) query += `&source=${source}`
    if (action) query += `&action=${action}`
    if (severity) query += `&severity=${severity}`
    const res = await api.get(`user/get-logs-infinite${query}`)

    return res.data
}

export const logsInfiniteQuery = (kw: string | null = null, tenant: string | null = null, ts: string | null = null, source: string | null = null, action: string | null = null, severity: string | null = null) => ({
    queryKey: ['logs', 'infinite', kw ?? undefined, tenant ?? undefined, ts ?? undefined, source ?? undefined, action ?? undefined, severity ?? undefined],
    queryFn: ({ pageParam = null }: { pageParam?: number | null }) => fetchLogsInfinite({ pageParam, kw, tenant, ts, source, action, severity }),
    initialPageParam: null,
    // @ts-expect-error ignore type check
    getNextPageParam: (lastPage, pages) => lastPage.nextCursor ?? undefined
})

const fetchAllFilters = async () => {
    const res = await api.get("user/filters")

    return res.data
}

export const filtersQuery = () => ({
    queryKey: ['filters'],
    queryFn: fetchAllFilters
})

const fetchLogsInfiniteAdmin = async ({ pageParam = null, kw = null, tenant = null, ts = null, source = null, action = null, severity = null }: {
    pageParam?: number | null, kw?: string | null, tenant?: string | null, ts?: string | null, source?: string | null, action?: string | null, severity?: string | null
}) => {
    let query = pageParam ? `?limit=7&cursor=${pageParam}` : "?limit=7"
    if (kw) query += `&kw=${kw}`
    if (tenant) query += `&tenant=${tenant}`
    if (ts) query += `&ts=${ts}`
    if (source) query += `&source=${source}`
    if (action) query += `&action=${action}`
    if (severity) query += `&severity=${severity}`
    const res = await adminApi.get(`admin/get-logs-infinite${query}`)

    return res.data
}

export const logsInfiniteAdminQuery = (kw: string | null = null, tenant: string | null = null, ts: string | null = null, source: string | null = null, action: string | null = null, severity: string | null = null) => ({
    queryKey: ['logs', 'infinite', kw ?? undefined, tenant ?? undefined, ts ?? undefined, source ?? undefined, action ?? undefined, severity ?? undefined],
    queryFn: ({ pageParam = null }: { pageParam?: number | null }) => fetchLogsInfiniteAdmin({ pageParam, kw, tenant, ts, source, action, severity }),
    initialPageParam: null,
    // @ts-expect-error ignore type check
    getNextPageParam: (lastPage, pages) => lastPage.nextCursor ?? undefined
})

const fetchUserInfinite = async ({ pageParam = null, kw = null, tenant = null, role = null, status = null, ts = null }: {
    pageParam?: number | null, kw?: string | null, tenant?: string | null, role?: string | null, status?: string | null, ts?: string | null
}) => {
    let query = pageParam ? `?limit=7&cursor=${pageParam}` : "?limit=7"
    if (kw) query += `&kw=${kw}`
    if (tenant) query += `&tenant=${tenant}`
    if (role) query += `&role=${role}`
    if (status) query += `&status=${status}`
    if (ts) query += `&ts=${ts}`
    const res = await adminApi.get(`admin/users${query}`)

    return res.data
}

export const userInfiniteQuery = (kw: string | null = null, tenant: string | null = null, role: string | null = null, status: string | null = null, ts: string | null = null) => ({
    queryKey: ['users', 'infinite', kw ?? undefined, tenant ?? undefined, role ?? undefined, status ?? undefined, ts ?? undefined],
    queryFn: ({ pageParam = null }: { pageParam?: number | null }) => fetchUserInfinite({ pageParam, kw, tenant, role, status, ts }),
    initialPageParam: null,
    // @ts-expect-error ignore type check
    getNextPageParam: (lastPage, pages) => lastPage.nextCursor ?? undefined
})

const fetchTopIps = async () => {
    const res = api.get("user/top-ips")

    return (await res).data
}

export const topIpsQuery = () => ({
    queryKey: ['top-ips'],
    queryFn: fetchTopIps
})

const fetchAlertRules = async ({ tenant = null, kw = null, ts = null }: {
    tenant?: string | null, kw?: string | null, ts?: string | null
}) => {
    let query = "?"
    if (tenant) query += `&tenant=${tenant}`
    if (kw) query += `&kw=${kw}`
    if (ts) query += `&ts=${ts}`
    const res = await adminApi.get(`admin/alert-rules${query}`)
    return res.data
}

export const alertRulesQuery = (tenant: string | null = null, kw: string | null = null, ts: string | null = null) => ({
    queryKey: ['alert-rules', tenant ?? undefined, kw ?? undefined, ts ?? undefined],
    queryFn: () => fetchAlertRules({ tenant, kw, ts })
})

const fetchSummary = async () => {
    const res = await adminApi.get("admin/summary")

    return res.data
}

export const summaryQuery = () => ({
    queryKey: ['summary'],
    queryFn: fetchSummary
})