import { useEffect } from "react"

const useTitle = (title: string) => {
    useEffect(() => {
        document.title = `${title} | Logs Management System`

        return () => {
            document.title = "Logs Management System"
        }
    }, [title])
}

export default useTitle