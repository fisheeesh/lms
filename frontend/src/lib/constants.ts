export const LOGIN = "Login"
export const REGISTER = "Register"

export const LOGIN_TITLE = "Login to your account"
export const LOGIN_SUBTITLE = "Enter your email address below to login to your account"

export const REGISTER_TITLE = "Create your account"
export const REGISTER_SUBTITLE = "Enter your email address below to create your account"

export const IMG_URL = import.meta.env.VITE_IMG_URL

export const APP_NAME = "Logs Management System"

export const NAVLINKS = [
    { to: "/", name: "Logs Dashboard" },
    { to: "/management", name: "Management" },
]

export const TSFILTER = [
    { name: 'Last 7 days', value: "7" },
    { name: "Last 30 days", value: "30" },
]

export const TIMEFILTER = [
    { name: 'Recent', value: 'desc' },
    { name: 'Oldest', value: 'asc' },
]

export const SOURCEFILTER = [
    { name: "All Sources", value: "all" },
    { name: "Firewall", value: "FIREWALL" },
    { name: "API", value: "API" },
    { name: "CrowdStrike", value: "CROWDSTRIKE" },
    { name: "AWS", value: "AWS" },
    { name: "Microsoft 365", value: "M365" },
    { name: "Active Directory", value: "AD" },
    { name: "Network", value: "NETWORK" },
]

export const SEVERITYFILTER = [
    { name: "All Severities", value: "all" },
    { name: "Info", value: "info" },
    { name: "Warn", value: "warn" },
    { name: "Error", value: "error" },
    { name: "Critical", value: "critical" },
]

export const ACTIONFILTER = [
    { name: "All Actions", value: "all" },
    { name: "Allow", value: "ALLOW" },
    { name: "Deny", value: "DENY" },
    { name: "Create", value: "CREATE" },
    { name: "Delete", value: "DELETE" },
    { name: "Login", value: "LOGIN" },
    { name: "Logout", value: "LOGOUT" },
    { name: "Alert", value: "ALERT" },
]

export const TENANTFILTER = [
    { name: "All Tenants", value: "all" },
    { name: "tenantA", value: "tenantA" },
    { name: "companyA", value: "companyA" },
    { name: "demoTenant", value: "demoTenant" }
]

export const ROLEFILTER = [
    { name: 'All Roles', value: 'all' },
    { name: 'Admin', value: 'ADMIN' },
    { name: 'User', value: 'USER' },
]

export const STATUSFILTER = [
    { name: 'All Status', value: 'all' },
    { name: 'Active', value: 'ACTIVE' },
    { name: 'Freeze', value: 'FREEZE' }
]

export const dummyUsers = [
    {
        name: "Alice Johnson",
        email: "alice.johnson@example.com",
        tenant: "CompanyA",
        role: "Admin",
        status: "Active",
    },
    {
        name: "Bob Smith",
        email: "bob.smith@example.com",
        tenant: "CompanyB",
        role: "User",
        status: "Inactive",
    },
    {
        name: "Charlie Brown",
        email: "charlie.brown@example.com",
        tenant: "CompanyA",
        role: "Manager",
        status: "Active",
    },
    {
        name: "Diana Prince",
        email: "diana.prince@example.com",
        tenant: "CompanyC",
        role: "User",
        status: "Pending",
    },
    {
        name: "Ethan Hunt",
        email: "ethan.hunt@example.com",
        tenant: "CompanyB",
        role: "Admin",
        status: "Active",
    },
    {
        name: "Fiona Gallagher",
        email: "fiona.gallagher@example.com",
        tenant: "CompanyC",
        role: "User",
        status: "Suspended",
    },
    {
        name: "George Miller",
        email: "george.miller@example.com",
        tenant: "CompanyA",
        role: "User",
        status: "Active",
    },
    {
        name: "Hannah Lee",
        email: "hannah.lee@example.com",
        tenant: "CompanyD",
        role: "Manager",
        status: "Active",
    },
    {
        name: "Ivan Petrov",
        email: "ivan.petrov@example.com",
        tenant: "CompanyB",
        role: "User",
        status: "Inactive",
    },
    {
        name: "Julia Roberts",
        email: "julia.roberts@example.com",
        tenant: "CompanyD",
        role: "Admin",
        status: "Active",
    },
]
