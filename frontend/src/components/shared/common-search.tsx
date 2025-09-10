import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import { Input } from "../ui/input";
import { BsSearch } from "react-icons/bs";

export default function LocalSearch({ filterValue = 'search' }: { filterValue: string }) {
    const [searchParams, setSearchParams] = useSearchParams()
    const search = searchParams.get(filterValue)
    const [query, setQuery] = useState(search || '')

    useEffect(() => {
        const debounceFunc = setTimeout(() => {
            if (query) searchParams.set(filterValue, query)
            else searchParams.delete(filterValue)

            setSearchParams(searchParams)
        }, 500)

        return () => clearTimeout(debounceFunc)
    }, [query, filterValue, setSearchParams, searchParams])

    return (
        <div className="relative">
            <Input
                value={query}
                type="search"
                placeholder="Search by keywords..."
                className="min-h-[44px] w-full xl:w-[300px] pl-10"
                onChange={(e) => setQuery(e.target.value)}
            />
            <BsSearch className="absolute top-3.5 left-3 size-[16px]" />
        </div>
    )
}
