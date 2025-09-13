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
        queryClient.invalidateQueries({ queryKey: ['logs-alerts-overview'], exact: false }),
        queryClient.invalidateQueries({ queryKey: ['severity-overview'], exact: false }),
        queryClient.invalidateQueries({ queryKey: ['top-ips'], exact: false }),
        queryClient.invalidateQueries({ queryKey: ['summary'], exact: false }),
        queryClient.invalidateQueries({ queryKey: ['all-alerts'], exact: false })
    ]);
};

export const invalidateUserQueries = async () => {
    await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['users', 'infinite'], exact: false }),
        queryClient.invalidateQueries({ queryKey: ['summary'], exact: false })
    ]);
};

export const invalidateRuleQueries = async () => {
    await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['alert-rules'], exact: false }),
        queryClient.invalidateQueries({ queryKey: ['summary'], exact: false })
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

const fetchLogsAlertsOverview = async (tennat?: string | null) => {
    const res = await api.get(`user/logs-alerts-overview?tenant=${tennat}`)

    return res.data
}

export const logsAlertsOverviewQuery = (tenant?: string | null) => ({
    queryKey: ['logs-alerts-overview', tenant ?? undefined],
    queryFn: () => fetchLogsAlertsOverview(tenant)
})

const fetchSourceComparisons = async (d?: string | null, tenant?: string | null) => {
    let query = "?"
    if (d) query += `duration=${d}`
    if (tenant) query += `&tenant=${tenant}`
    const res = await api.get(`user/source-comparisons${query}`)

    return res.data
}

export const sourceCompaisonsQuery = (d?: string | null, tenant?: string | null) => ({
    queryKey: ['source-comparisons', d ?? undefined, tenant ?? undefined],
    queryFn: () => fetchSourceComparisons(d, tenant)
})

export const fetchSeverityOverview = async (tenant?: string | null) => {
    const res = await api.get(`user/severity-overview?tenant=${tenant}`)

    return res.data
}

export const severityOverviewQuery = (tenant?: string | null) => ({
    queryKey: ['severity-overview', tenant ?? undefined],
    queryFn: () => fetchSeverityOverview(tenant)
})

const fetchLogsInfinite = async ({ pageParam = null, kw = null, tenant = null, ts = null, source = null, action = null, severity = null, lDate = null }: {
    pageParam?: number | null, kw?: string | null, tenant?: string | null, ts?: string | null, source?: string | null, action?: string | null, severity?: string | null, lDate?: string | null
}) => {
    let query = pageParam ? `?limit=7&cursor=${pageParam}` : "?limit=7"
    if (kw) query += `&kw=${kw}`
    if (tenant) query += `&tenant=${tenant}`
    if (ts) query += `&ts=${ts}`
    if (source) query += `&source=${source}`
    if (action) query += `&action=${action}`
    if (severity) query += `&severity=${severity}`
    if (lDate) query += `&date=${lDate}`
    const res = await api.get(`user/get-logs-infinite${query}`)

    return res.data
}

export const logsInfiniteQuery = (kw: string | null = null, tenant: string | null = null, ts: string | null = null, source: string | null = null, action: string | null = null, severity: string | null = null, lDate: string | null = null) => ({
    queryKey: ['logs', 'infinite', kw ?? undefined, tenant ?? undefined, ts ?? undefined, source ?? undefined, action ?? undefined, severity ?? undefined, lDate ?? undefined],
    queryFn: ({ pageParam = null }: { pageParam?: number | null }) => fetchLogsInfinite({ pageParam, kw, tenant, ts, source, action, severity, lDate }),
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

const fetchTopIps = async (tenant?: string | null) => {
    const res = await api.get(`user/top-ips?tenant=${tenant}`)

    return res.data
}

export const topIpsQuery = (tenant?: string | null) => ({
    queryKey: ['top-ips', tenant ?? undefined],
    queryFn: () => fetchTopIps(tenant)
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

const fetchSummary = async (tenant?: string | null) => {
    const res = await adminApi.get(`admin/summary?tenant=${tenant}`)

    return res.data
}

export const summaryQuery = (tenant?: string | null) => ({
    queryKey: ['summary', tenant ?? undefined],
    queryFn: () => fetchSummary(tenant)
})

const fetchAllAlerts = async (tenant?: string | null, status?: string | null) => {
    let query = "?"
    if (tenant) query += `&tenant=${tenant}`
    if (status) query += `&status=${status}`
    const res = await api.get(`user/all-alerts${query}`)

    return res.data
}

export const allAlertsQuery = (tenant?: string | null, status?: string | null) => ({
    queryKey: ['all-alerts', tenant ?? undefined, status ?? undefined],
    queryFn: () => fetchAllAlerts(tenant, status)
})