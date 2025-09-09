import { Loader } from "lucide-react"

interface SpinnerProps {
    isLoading: boolean,
    label: string,
    children: React.ReactNode
}

export default function Spinner({ isLoading, label, children }: SpinnerProps) {
    return (
        <>
            {
                isLoading ? <>
                    <Loader className='size-4 animate-spin' />
                    <span>{label}</span>
                </> : children
            }
        </>
    )
}
