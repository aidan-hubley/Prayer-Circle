import { create } from 'zustand';

export const useStore = create((set) => ({
	filter: 'unfiltered',
	currentFilterName: 'Prayer Circle',
	globalReload: false,
	updateFilter: (newVal) => set(() => ({ filter: newVal })),
	updateFilterName: (newVal) => set(() => ({ currentFilterName: newVal })),
	setGlobalReload: (newVal) => set(() => ({ globalReload: newVal }))
}));
