import { create } from 'zustand';
import { immer } from "zustand/middleware/immer";
import { persist, createJSONStorage } from "zustand/middleware";

interface User {
    id: number,
    fullName: string,
    email: string,
    role: string,
    tenant: string
}

interface State {
    user: User
}

interface Actions {
    setUser: (user: User) => void,
    clearUser: () => void
}

const initialState: State = {
    user: {
        id: 0,
        email: "",
        fullName: "",
        role: "",
        tenant: ""
    }
}

const useUserStore = create<State & Actions>()(
    persist(
        immer((set) => ({
            ...initialState,
            setUser: (user) => set(state => {
                state.user = user
            }),
            clearUser: () => set(initialState)
        })),
        {
            name: 'user-storage',
            storage: createJSONStorage(() => sessionStorage)
        }
    )
)

export default useUserStore