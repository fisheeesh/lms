import { useEffect } from "react"
import { toast } from "sonner"

const useError = (check: unknown, message: string) => {
    useEffect(() => {
        if (check) {
            toast.error("Error", {
                description: message || "Something went wrong"
            })
        }
    }, [check, message])
}

export default useError