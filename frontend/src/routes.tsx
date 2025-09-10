import { Suspense } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router'
import Loader from './components/shared/loader'
import ConfirmPasswordPage from './pages/auth/confirm-password-page'
import ForgotPasswordPage from './pages/auth/forgot-password-page'
import LoginPage from './pages/auth/login-page'
import RegisterPage from './pages/auth/register-page'
import ResetPasswordPage from './pages/auth/reset-password-page'
import VerifyForgotOTPPage from './pages/auth/verify-forgot-otp-page'
import VerifyOTPPage from './pages/auth/verify-otp-page'
import DashboardRootLayout from './pages/dashboard/dashboard-root-layout'
import ErrorElement from './pages/not-found/error-element'
import NotFoundPage from './pages/not-found/not-found'
import { confirmPasswordLoader, homeLoader, loginLoader, OTPLoader, resetPasswordLoader, verifyOTPLoader } from './router/loaders'
import { confirmPasswordAction, forgetPasswordAction, loginAction, OTPAction, registerAction, resetPasswordAction, verifyOTPAction } from './router/actions'
import ManagementPage from './pages/dashboard/management-page'

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
                    loader: homeLoader,
                },
                {
                    path: 'management',
                    Component: ManagementPage
                }
            ]
        },
        {
            path: '/login',
            Component: LoginPage,
            loader: loginLoader,
            action: loginAction
        },
        {
            path: '/register',
            lazy: async () => {
                const { default: AuthRootLayout } = await import('@/pages/auth//auth-root-layout')
                return { Component: AuthRootLayout }
            },
            children: [
                {
                    index: true,
                    Component: RegisterPage,
                    loader: loginLoader,
                    action: registerAction
                },
                {
                    path: "otp",
                    Component: VerifyOTPPage,
                    loader: OTPLoader,
                    action: OTPAction
                },
                {
                    path: "confirm-password",
                    Component: ConfirmPasswordPage,
                    loader: confirmPasswordLoader,
                    action: confirmPasswordAction
                }
            ]
        },
        {
            path: '/forgot-password',
            lazy: async () => {
                const { default: AuthRootLayout } = await import("@/pages/auth/auth-root-layout")
                return { Component: AuthRootLayout }
            },
            children: [
                {
                    index: true,
                    Component: ForgotPasswordPage,
                    loader: loginLoader,
                    action: forgetPasswordAction,
                },
                {
                    path: 'verify-otp',
                    Component: VerifyForgotOTPPage,
                    loader: verifyOTPLoader,
                    action: verifyOTPAction
                },
                {
                    path: 'reset-password',
                    Component: ResetPasswordPage,
                    loader: resetPasswordLoader,
                    action: resetPasswordAction
                }
            ]
        },
        {
            path: '*',
            Component: NotFoundPage
        }
    ])

    return (
        <Suspense fallback={<Loader />}>
            <RouterProvider router={router} />
        </Suspense>
    )
}
