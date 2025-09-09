import { useEffect } from "react"

const useTitle = (title: string) => {
    useEffect(() => {
        document.title = `${title} | Furnivo`

        return () => {
            document.title = "Furnivo"
        }
    }, [title])
}

export default useTitle