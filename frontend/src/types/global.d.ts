interface Filter {
    name: string
    value: string
}

interface LogsOverview {
    date: string
    value: number
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

interface Log{
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