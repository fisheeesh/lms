import { create } from 'zustand';
import { immer } from "zustand/middleware/immer";
import { persist, createJSONStorage } from "zustand/middleware";

interface Filters {
    uTenants: Filter[],
    lTenants: Filter[],
    sources: Filter[],
    actions: Filter[]
}

interface State {
    filters: Filters
}

interface Actions {
    setFilters: (filters: Filters) => void,
    clearFilters: () => void
}

const initialState: State = {
    filters: {
        uTenants: [],
        lTenants: [],
        sources: [],
        actions: []
    }
}

const useFilterStore = create<State & Actions>()(
    persist(
        immer((set) => ({
            ...initialState,
            setFilters: (filters) => set(state => {
                state.filters = filters
            }),
            clearFilters: () => set(initialState)
        })),
        {
            name: 'filters',
            storage: createJSONStorage(() => sessionStorage)
        }
    )
)

export default useFilterStore