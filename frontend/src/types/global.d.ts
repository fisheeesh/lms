interface Filter {
    name: string
    value: string
}

interface LogsAlertsOverview {
    date: string
    logs: number
    alerts: number
}

interface SourceComparisons {
    date: string
    ad: number
    api: number
    aws: number
    crowdstrike: number
    firewall: number
    m365: number
}

interface SeverityOverview {
    type: string,
    value: number
}

interface Log {
    id: number
    action: string
    createdAt: string
    eventType: string
    ip: string
    severity: number
    severityLabel: string
    source: string
    tenant: string
    user: string
}

interface User {
    id: number,
    firstName: string,
    lastName: string,
    fullName: string
    email: string,
    role: string
    tenant: string
    status: string
}

interface IP {
    ip: string
    count: number
}

interface Summary {
    allTenants: number,
    allUsers: number,
    allLogs: number,
    allAlerts: number
}

interface AlretRule {
    id: string
    name: string
    tenant: string
    condition: string
    createdAt: string
    threshold: number
    windowSeconds: number
}

interface Alert {
    id: string
    tenant: string
    ruleName: string
    status: string
    triggeredAt: string
}