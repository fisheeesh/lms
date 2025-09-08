import { Loader } from 'lucide-react'
import { Suspense } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router'
import LoginPage from './pages/auth/login-page'
import DashboardRootLayout from './pages/dashboard/dashboard-root-layout'
import ErrorElement from './pages/not-found/error-element'
import NotFound from './pages/not-found/not-found'

export default function Router() {
    const router = createBrowserRouter([
        {
            path: "/",
            Component: DashboardRootLayout,
            errorElement: <ErrorElement />,
            children: [
                {
                    index: true,
                    lazy: async () => {
                        const { default: DashboardPage } = await import("@/pages/dashboard/dashboard-page")
                        return { Component: DashboardPage }
                    },
                },
            ]
        },
        {
            path: '/login',
            Component: LoginPage,
        },
        {
            path: '*',
            Component: NotFound
        }
    ])

    return (
        <Suspense fallback={<Loader />}>
            <RouterProvider router={router} />
        </Suspense>
    )
}
