import axios from 'axios'

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
        "Content-Type": "application/json"
    },
    withCredentials: true
})

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            window.location.href = `/login?redirect=${encodeURIComponent(window.location.pathname)}`
        }
        return Promise.reject(error)
    }
)

export const authApi = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
        "Content-Type": "application/json"
    },
    withCredentials: true
})

export const adminApi = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
        "Content-Type": "application/json"
    },
    withCredentials: true
})

adminApi.interceptors.response.use(
    response => response,
    error => {
        if (error.response?.status === 403) {
            window.location.href = "/"
        }
        if (error.response?.status === 401) {
            window.location.href = `/login?redirect=${encodeURIComponent(window.location.pathname)}`
        }
        return Promise.reject(error)
    }
)

export default api