import { QueryClient } from '@tanstack/react-query';
import api from '.';

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            // staleTime: 5 * 60 * 1000,
            staleTime: 0
            // retry: 2,
        }
    }
})

const fetchUserData = async () => {
    const res = await api.get("user/user-data")

    return res.data
}

export const userDataQuery = () => ({
    queryKey: ['user-data'],
    queryFn: fetchUserData
})