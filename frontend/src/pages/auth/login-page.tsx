import AuthForm from '@/components/auth/auth-form'
import Logo from '@/components/shared/logo'
import useTitle from '@/hooks/use-title'
import { LogInSchema } from '@/lib/validators'

export default function LoginPage() {
    useTitle('Login')

    return (
        <section className='relative'>
            <main className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
                <div className="flex flex-col gap-5 min-h-svh w-full items-center justify-center p-6 md:p-10">
                    <Logo />
                    <div className="w-full max-w-[420px]">
                        <AuthForm
                            formType='LOGIN'
                            schema={LogInSchema}
                            defaultValues={{
                                email: 'admingmail.com',
                                password: '12345678'
                            }}
                        />
                    </div>
                </div>
                <div className="bg-muted relative hidden lg:block">
                    <img
                        src="/placeholder.svg"
                        alt="Image"
                        className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
                    />
                </div>
            </main>
        </section>
    )
}
